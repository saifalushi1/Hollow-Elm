import {SprintScare,ScareNavigation,RUSH_SPEED,VANISH_DISTANCE} from './sprint-scare';
export type AIState='Patrol'|'Investigate'|'Search'|'Chase'|'Rush'|'Catch';
export type Point={x:number,z:number};
export const noiseRadius={crouch:1,sneak:2,walk:4,run:9,slowDoor:2,door:6,drop:10,ring:12,vibrate:3,fail:8};
export const distance=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.z-b.z);
export class RNG{constructor(public seed=13741){} next(){this.seed=(Math.imul(1664525,this.seed)+1013904223)>>>0;return this.seed/4294967296;}}
export type Save={night:number,lives:number,items:string[],evidence:string[],deductions:string[],flags:string[],caught:number,resets:number,time:number,scares:number,hideUses:Record<string,number>,checkpoint:Point};
export const fresh=():Save=>({night:0,lives:2,items:['lockpick'],evidence:[],deductions:[],flags:[],caught:0,resets:0,time:0,scares:0,hideUses:{},checkpoint:{x:-8,z:8}});
export function save(s:Save){try{localStorage.setItem('hollow-elm-save-v1',JSON.stringify(s));return true;}catch{return false;}}
export function load():Save|null{try{const raw=localStorage.getItem('hollow-elm-save-v1');if(!raw)return null;const s=JSON.parse(raw);if(!Number.isInteger(s.night)||s.night<0||s.night>4||!Array.isArray(s.items)||!Array.isArray(s.flags)||!Array.isArray(s.evidence)||!Array.isArray(s.deductions)||!s.checkpoint||!Number.isFinite(s.checkpoint.x)||!Number.isFinite(s.checkpoint.z))return null;return {...fresh(),...s};}catch{return null;}}
export function caught(s:Save){s.caught++;s.lives--;if(s.lives<=0){s.lives=2;s.resets++;}save(s);return s;}
export function hidingChance(uses:number){return Math.min(.9,.3*Math.max(1,uses));}
export function ending(flags:string[],deductions:string[]){if(flags.includes('finalCaught')||flags.includes('wrongTrust'))return 'guest';if(flags.includes('saveBoth')&&flags.includes('daleSafe')&&deductions.includes('authentic')&&!flags.includes('leaveJuniper'))return 'dawn';return 'hollow';}
export class NoiseSystem{events:{position:Point,radius:number,age:number}[]=[];emit(position:Point,radius:number){this.events.push({position:{...position},radius,age:0});}tick(dt:number){for(const e of this.events)e.age+=dt;this.events=this.events.filter(e=>e.age<1.15);}heard(position:Point){return this.events.filter(e=>distance(e.position,position)<=e.radius).sort((a,b)=>b.radius-a.radius)[0];}}
export class MotherAI{
 scare=new SprintScare();
 state:AIState='Patrol';position:Point={x:8,z:-8};target:Point={x:8,z:-8};waypoint=0;timer=0;hearTimer=0;lost=0;searchIndex=0;searchSpots:Point[]=[];grace=14;angle=0; rng=new RNG();
 constructor(public route:Point[]){this.target={...route[0]};}
 reset(){this.scare.reset();this.state='Patrol';this.position={x:8,z:-8};this.target={...this.route[0]};this.grace=14;this.timer=0;this.lost=0;this.searchSpots=[];}
 tick(dt:number,player:Point,night:number,hidden:boolean,noise:NoiseSystem,los:(a:Point,b:Point)=>boolean,path:(a:Point,b:Point)=>Point,spots:Point[],assist=false,scareNavigation?:ScareNavigation){
 this.scare.tick(dt);
 if(scareNavigation){
 const d=distance(this.position,player);
 const eligible=scareNavigation.remaining>0&&this.grace===0&&!hidden&&this.state!=='Catch'&&d>=3.5&&d<=14&&los(this.position,player);
 if(this.scare.tryStart(dt,eligible,this.rng)){
 if(scareNavigation.destinations(player).length)this.state='Rush';
 else{this.scare.active=false;this.scare.event=null;this.scare.cooldown=10;}
 }
 if(this.scare.active){
 this.state='Rush';this.target={...player};
 const finish=()=>{const destination=this.scare.finish(player,scareNavigation,this.rng);if(destination){this.position=destination;this.state='Investigate';this.target={...player};this.timer=0;this.lost=0;this.hearTimer=0;this.grace=3;return true;}return false;};
 if(this.scare.shouldVanish(this.position,player,hidden)&&finish())return;
 const dest=path(this.position,player),length=distance(this.position,dest);
 if(length>.001){const step=Math.min(length,RUSH_SPEED*dt,Math.max(0,d-VANISH_DISTANCE));this.angle=Math.atan2(dest.x-this.position.x,dest.z-this.position.z);this.position.x+=(dest.x-this.position.x)/length*step;this.position.z+=(dest.z-this.position.z)/length*step;}
 if(distance(this.position,player)<=VANISH_DISTANCE+.02)finish();
 return; // The rush is a scare, never a damaging catch.
 }
 }
 this.grace=Math.max(0,this.grace-dt);this.hearTimer+=dt;const d=distance(this.position,player);const sees=!hidden&&d<8&&los(this.position,player)&&this.grace===0;
 if(sees){this.state='Chase';this.target={...player};this.lost=0;}
 if(this.hearTimer>=1){this.hearTimer=0;const n=noise.heard(this.position);if(n&&this.state!=='Chase'&&this.grace===0){this.state=n.radius>=9&&distance(this.position,n.position)<3&&!hidden?'Chase':'Investigate';this.target={...n.position};this.timer=0;}}
 if(this.state==='Chase'){if(sees)this.target={...player};else this.lost+=dt;if(this.lost>1.8){this.state='Search';this.searchSpots=[...spots].sort((a,b)=>distance(this.position,a)-distance(this.position,b)).slice(0,3);this.searchIndex=0;this.target={...(this.searchSpots[0]??this.route[0])};this.timer=0;}if(!hidden&&d<.65&&this.grace===0)this.state='Catch';}
 if(this.state==='Patrol'&&distance(this.position,this.target)<.3){this.timer+=dt;if(this.timer>3){this.waypoint=(this.waypoint+1)%this.route.length;this.target={...this.route[this.waypoint]};this.timer=0;}}
 if(this.state==='Investigate'&&distance(this.position,this.target)<.3){this.timer+=dt;if(this.timer>5+this.rng.next()*3){this.state='Patrol';this.target={...this.route[this.waypoint]};this.timer=0;}}
 if(this.state==='Search'&&distance(this.position,this.target)<.4){this.timer+=dt;if(this.timer>2){this.searchIndex++;this.timer=0;if(this.searchIndex>=this.searchSpots.length){this.state='Patrol';this.target={...this.route[this.waypoint]};}else this.target={...this.searchSpots[this.searchIndex]};}}
 if(this.state==='Catch')return;
 const dest=path(this.position,this.target);const delta=distance(this.position,dest);const speed=(this.state==='Chase'?[2.2,2.6,3][Math.min(2,night-1)]:1.2)*(assist?.65:1);if(delta>.001){const step=Math.min(delta,speed*dt);this.angle=Math.atan2(dest.x-this.position.x,dest.z-this.position.z);this.position.x+=(dest.x-this.position.x)/delta*step;this.position.z+=(dest.z-this.position.z)/delta*step;}
 }
}
