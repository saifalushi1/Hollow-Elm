import type {Point,RNG} from './game';
const distance=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.z-b.z);

export type ScareNavigation={remaining:number;destinations:(player:Point)=>Point[]};
export const RUSH_SPEED=6.4;
export const VANISH_DISTANCE=1.4;
/** Random checks use the game's seeded RNG, so the behavior can be replayed in tests. */
export class SprintScare{
 cooldown=30;rollTimer=0;elapsed=0;active=false;invisible=0;
 event:'start'|'vanish'|null=null;
 reset(){this.cooldown=30;this.rollTimer=0;this.elapsed=0;this.active=false;this.invisible=0;this.event=null;}
 tick(dt:number){this.event=null;this.invisible=Math.max(0,this.invisible-dt);this.cooldown=Math.max(0,this.cooldown-dt);if(this.active)this.elapsed+=dt;}
 tryStart(dt:number,eligible:boolean,rng:RNG){if(this.active||this.cooldown>0)return false;this.rollTimer+=dt;if(this.rollTimer<8)return false;this.rollTimer=0;if(!eligible||rng.next()>=.22)return false;this.active=true;this.elapsed=0;this.event='start';return true;}
 shouldVanish(position:Point,player:Point,hidden:boolean){return hidden||this.elapsed>=8||distance(position,player)<=VANISH_DISTANCE;}
 finish(player:Point,navigation:ScareNavigation,rng:RNG){const spots=navigation.destinations(player);if(!spots.length)return null;const point=spots[Math.floor(rng.next()*spots.length)];this.active=false;this.elapsed=0;this.cooldown=75+rng.next()*45;this.invisible=.3;this.event='vanish';return {...point};}
}
