import {test} from 'node:test';
import {strict as a} from 'node:assert';
import * as T from 'three';
import {MotherAI,NoiseSystem,RNG,distance} from '../src/core/game';
import {SprintScare,VANISH_DISTANCE} from '../src/core/sprint-scare';
import {World} from '../src/world';
Object.assign(globalThis,{document:{createElement:()=>({width:256,height:256,getContext:()=>({createImageData:(w:number,h:number)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},fillRect(){},strokeRect(){},fillText(){}})})}});

test('sprint scare is random, respects cooldown, and cannot start when ineligible',()=>{
 const scare=new SprintScare(),rng=new RNG();rng.next=()=>0;
 a.equal(scare.tryStart(8,true,rng),false);scare.tick(30);
 a.equal(scare.tryStart(8,false,rng),false);
 rng.next=()=>.99;a.equal(scare.tryStart(8,true,rng),false);
 rng.next=()=>0;a.equal(scare.tryStart(8,true,rng),true);a.equal(scare.event,'start');
 scare.finish({x:0,z:0},{remaining:4,destinations:()=>[{x:12,z:0}]},rng);
 a.ok(scare.cooldown>=75);a.equal(scare.event,'vanish');a.equal(scare.tryStart(8,true,rng),false);
});
test('rush closes faster than normal chase, then vanishes before contact and never catches',()=>{
 const ai=new MotherAI([{x:0,z:0}]);ai.position={x:0,z:0};ai.grace=0;ai.scare.cooldown=0;ai.scare.rollTimer=8;ai.rng.next=()=>0;
 const player={x:8,z:0},navigation={remaining:4,destinations:()=>[{x:-8,z:-8}]};
 ai.tick(.1,player,1,false,new NoiseSystem(),()=>true,(_,b)=>b,[],false,navigation);
 a.equal(ai.state,'Rush');a.ok(ai.position.x>.6);
 let nearest=distance(ai.position,player);
 for(let i=0;i<100&&ai.state==='Rush';i++){ai.tick(.05,player,1,false,new NoiseSystem(),()=>true,(_,b)=>b,[],false,navigation);if(ai.scare.event!=='vanish')nearest=Math.min(nearest,distance(ai.position,player));}
 a.equal(ai.scare.event,'vanish');a.notEqual(ai.state,'Catch');a.ok(nearest>=VANISH_DISTANCE-.02);a.deepEqual(ai.position,{x:-8,z:-8});a.ok(ai.scare.invisible>0);a.deepEqual(ai.target,player);
});
test('exhausted scare budget and hiding prevent a random rush',()=>{
 for(const [hidden,remaining] of [[true,4],[false,0]] as const){const ai=new MotherAI([{x:0,z:0}]);ai.position={x:0,z:0};ai.grace=0;ai.scare.cooldown=0;ai.scare.rollTimer=8;ai.rng.next=()=>0;
 ai.tick(.05,{x:8,z:0},1,hidden,new NoiseSystem(),()=>true,(_,b)=>b,[],false,{remaining,destinations:()=>[{x:-8,z:-8}]});a.notEqual(ai.state,'Rush');}
});
test('every relocation spot on every floor is clear and Marrow can return through closed doors',()=>{
 const world=new World(new T.Scene(),false),player={x:-8,z:0};
 for(let night=1;night<=3;night++){
 world.build(night);for(const door of world.doors.values()){door.open=false;door.mesh.visible=true;}
 const positions=world.relocationSpots(player);a.ok(positions.length>0);
 for(const position of positions){
 a.ok(distance(position,player)>=10);a.equal(world.blocked(position.x,position.z,.35),false);a.ok(world.canReach(position,player));
 for(const door of world.doors.values()){door.open=false;door.mesh.visible=true;}
 const ai=new MotherAI(world.roomCenters);ai.position={...position};ai.target={...player};ai.state='Investigate';ai.grace=0;
 let returned=false;
 for(let frame=0;frame<1800;frame++){ai.tick(.05,player,night,false,new NoiseSystem(),(a,b)=>world.los(a,b),(a,b)=>world.path(a,b),[]);if(distance(ai.position,player)<.7){returned=true;break;}}
 a.ok(returned,`Night ${night}: stranded at ${JSON.stringify(ai.position)} from ${JSON.stringify(position)}`);
 }
 }
});
