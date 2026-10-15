import * as T from 'three';
import type {Point} from '../core/game';
import {segmentHitsBox} from '../core/navigation';
export class DoorModel{
 mesh=new T.Group();hinge=new T.Group();open=false;angle=0;readonly base:number;
 wall:{x:number,z:number,w:number,d:number,door:string};
 constructor(public id:string,x:number,z:number,vertical:boolean,materials:Record<string,T.MeshStandardMaterial>){
 this.base=vertical?Math.PI/2:0;this.wall={x,z,w:vertical?.17:1.9,d:vertical?1.9:.17,door:id};this.mesh.name=id;this.mesh.position.set(x,0,z);this.mesh.rotation.y=this.base;this.mesh.add(this.hinge);this.hinge.name='hinged-leaf';this.hinge.position.x=-.89;
 const box=(name:string,w:number,h:number,d:number,x:number,y:number,z:number,material:string,parent=this.mesh)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),materials[material]);m.name=name;m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
 for(const side of [-1,1])box('frame-post',.13,2.78,.3,side*.99,1.39,0,'cream');box('frame-lintel',2.12,.14,.32,0,2.73,0,'cream');box('threshold',1.9,.035,.3,0,.02,0,'metal');
 box('solid-oak-leaf',1.78,2.56,.1,.89,1.3,0,'wood',this.hinge);
 for(const zSide of [-1,1]){
 for(const px of [.46,1.32])for(const py of [.72,1.88]){box('recessed-panel',.65,.88,.035,px,py,zSide*.065,'dark',this.hinge);for(const dx of [-.34,.34])box('panel-stile',.035,.94,.055,px+dx,py,zSide*.08,'wood',this.hinge);for(const dy of [-.46,.46])box('panel-rail',.7,.035,.055,px,py+dy,zSide*.08,'wood',this.hinge);}
 box('handle-backplate',.1,.26,.035,1.57,1.24,zSide*.09,'metal',this.hinge);const knob=new T.Mesh(new T.SphereGeometry(.055,12,8),materials.metal);knob.name='brass-handle';knob.position.set(1.57,1.24,zSide*.155);this.hinge.add(knob);
 }
 for(const y of [.32,1.3,2.3]){const barrel=new T.Mesh(new T.CylinderGeometry(.03,.03,.17,8),materials.metal);barrel.name='hinge-barrel';barrel.position.set(0,y,0);this.hinge.add(barrel);}
 }
 setOpen(open:boolean,instant=false){this.open=open;if(instant){this.angle=open?Math.PI/2:0;this.hinge.rotation.y=this.angle;}this.mesh.visible=true;}
 blocked(p:Point,r=.25,angle=this.angle){const hx=this.wall.x-Math.cos(this.base)*.89,hz=this.wall.z+Math.sin(this.base)*.89,dx=p.x-hx,dz=p.z-hz,theta=this.base+angle;const x=Math.cos(theta)*dx-Math.sin(theta)*dz,z=Math.sin(theta)*dx+Math.cos(theta)*dz;const nearestX=Math.max(0,Math.min(1.78,x)),nearestZ=Math.max(-.055,Math.min(.055,z));return Math.hypot(x-nearestX,z-nearestZ)<r;}
 blocksRoute(a:Point,b:Point,r=.25){const hx=this.wall.x-Math.cos(this.base)*.89,hz=this.wall.z+Math.sin(this.base)*.89,angle=this.base+Math.PI/2;const local=(p:Point)=>({x:Math.cos(angle)*(p.x-hx)-Math.sin(angle)*(p.z-hz),z:Math.sin(angle)*(p.x-hx)+Math.cos(angle)*(p.z-hz)});return segmentHitsBox(local(a),local(b),{x:.89,z:0,w:1.78,d:.11},r);}
 update(dt:number,player?:Point){const target=this.open?Math.PI/2:0,next=T.MathUtils.damp(this.angle,target,10,dt);if(!this.open&&player&&this.blocked(player,.28,next)&&!this.blocked(player,.28,this.angle))return;this.angle=Math.abs(next-target)<.002?target:next;this.hinge.rotation.y=this.angle;this.mesh.visible=true;}
}
