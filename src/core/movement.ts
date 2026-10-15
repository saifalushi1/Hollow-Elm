import type {Point} from './game';
export class Movement{
 stamina=100;exhausted=false;
 reset(){this.stamina=100;this.exhausted=false;}
 step(dt:number,moving:boolean,wantsRun:boolean,crouch:boolean,sneak:boolean,phone:boolean,hidden:boolean){
 const sprinting=moving&&!hidden&&!phone&&!crouch&&!sneak&&wantsRun&&!this.exhausted&&this.stamina>0;
 if(sprinting){this.stamina=Math.max(0,this.stamina-5*dt);if(this.stamina===0)this.exhausted=true;}
 else this.stamina=Math.min(100,this.stamina+(moving?18:24)*dt);
 if(this.exhausted&&this.stamina>=30)this.exhausted=false;
 return {sprinting,speed:hidden?0:(crouch?.9:sneak?1.1:sprinting?3.8:2.1)*(phone?.35:1),noise:hidden?0:crouch?1:sneak?2:sprinting?9:4};
 }
}
export function slideMove(point:Point,dx:number,dz:number,blocked:(x:number,z:number)=>boolean){
 const result={...point},steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.1));
 for(let i=0;i<steps;i++){if(!blocked(result.x+dx/steps,result.z))result.x+=dx/steps;if(!blocked(result.x,result.z+dz/steps))result.z+=dz/steps;}return result;
}
export class HidingSession{
 anchor:Point|null=null;origin:Point|null=null;remaining=0;
 get active(){return this.anchor!==null;}
 enter(anchor:Point,origin:Point){if(this.active)return false;this.anchor={...anchor};this.origin={...origin};this.remaining=1;return true;}
 tick(dt:number){this.remaining=Math.max(0,this.remaining-dt);}
 pin(point:Point){return {...(this.anchor??point)};}
 leave(){const origin=this.origin;this.reset();return origin;}
 reset(){this.anchor=null;this.origin=null;this.remaining=0;}
}
