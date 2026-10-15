import {test} from 'node:test';
import {strict as a} from 'node:assert';
import * as T from 'three';
import {World} from '../src/world';
import {DoorModel} from '../src/models/door';
import {createRoomKit} from '../src/models/room-kit';
import {createPantry} from '../src/models/pantry';
import {slideMove} from '../src/core/movement';
const mats=Object.fromEntries(['wood','cream','metal','dark','trim','cloth','glass'].map(n=>[n,new T.MeshStandardMaterial()]));
test('hinged doors retain complete visible models and collision follows the leaf',()=>{
 const d=new DoorModel('test',0,0,false,mats);a.ok(d.blocked({x:0,z:0}));
 for(const name of ['frame-post','frame-lintel','solid-oak-leaf','recessed-panel','brass-handle','hinge-barrel'])a.ok(d.mesh.getObjectByName(name),name);
 d.setOpen(true);d.update(1);a.ok(d.mesh.visible);a.ok(d.angle>1.5);a.equal(d.blocked({x:0,z:0}),false);
 d.setOpen(false);d.update(1);a.ok(d.blocked({x:0,z:0}));
 d.setOpen(true,true);const p={x:.7,z:0};for(let i=0;i<100;i++){d.setOpen(false);d.update(.02,p);a.equal(d.blocked(p,.28),false);}
});
test('pantry is floor supported with a complete cabinet and twelve lidded jars',()=>{
 const p=createPantry(mats),counts:Record<string,number>={};p.traverse(o=>{counts[o.name]=(counts[o.name]??0)+1;});
 a.equal(counts.foot,4);a.equal(counts['cupboard-door'],2);a.equal(counts['drawer-front'],2);a.equal(counts['preserves-jar'],12);a.equal(counts['jar-lid'],12);
 const bounds=new T.Box3().setFromObject(p);a.ok(Math.abs(bounds.min.y)<.001);a.ok(bounds.max.y>2.5);
});
test('enemy-free traversal reaches every clue and closet on all floors through animated doors',()=>{
 const w=new World(new T.Scene(),false);
 for(let n=1;n<=3;n++){
 w.build(n);let p=w.walkablePoint({x:8,z:0});
 for(const target of w.targets.filter(t=>t.kind!=='door')){
 const goal=target.kind==='hide'?w.hidingApproach(target):target.position;
 let arrived=false;
 for(let frame=0;frame<2800;frame++){
 if(Math.hypot(goal.x-p.x,goal.z-p.z)<1.5&&w.canInteract(p,target)){arrived=true;break;}
 const waypoint=w.path(p,w.walkablePoint(goal));w.update(.05,p);const dx=waypoint.x-p.x,dz=waypoint.z-p.z,length=Math.hypot(dx,dz),scale=Math.min(.105,length)/(length||1);
 p=slideMove(p,dx*scale,dz*scale,(x,z)=>w.blocked(x,z));
 }

 a.ok(arrived,`Floor ${n}: cannot reach ${target.id} from ${JSON.stringify(p)}`);
 }
 }
});

test('every interior mesh has finite nonempty geometry and assigned materials',()=>{
 const w=new World(new T.Scene(),false);for(let n=1;n<=3;n++){w.build(n);let count=0;w.group.traverse(o=>{if(!(o instanceof T.Mesh))return;count++;const positions=o.geometry.getAttribute('position');a.ok(positions&&positions.count>0);for(const v of positions.array)a.ok(Number.isFinite(v));a.ok(o.material);o.geometry.computeBoundingBox();a.ok(o.geometry.boundingBox&&!o.geometry.boundingBox.isEmpty());});a.ok(count>400);a.ok(w.spots.every(s=>!s.label.includes('curtain')));}
});

test('all sink assemblies leave full doorway approaches clear',()=>{
 const entrances=[[-4,-2.2,-1.25,1.25],[2.2,4,-1.25,1.25],[-1.25,1.25,-4,-2.2],[-1.25,1.25,2.2,4]];
 for(const room of ['Kitchen','Scullery','Bathroom']){const kit=createRoomKit(room,mats),sink=kit.getObjectByName('sink-unit')!;a.ok(sink);const bounds=new T.Box3().setFromObject(sink);for(const [minX,maxX,minZ,maxZ] of entrances){const approach=new T.Box3(new T.Vector3(minX,0,minZ),new T.Vector3(maxX,2,maxZ));a.equal(bounds.intersectsBox(approach),false,room+' sink blocks an entrance');}a.ok(bounds.min.z> -3.9,'sink stays inside the wall');}
});
