import type {Point} from './game';
export function segmentHitsBox(a:Point,b:Point,box:{x:number,z:number,w:number,d:number},radius:number){
 let near=0,far=1;
 for(const [start,delta,min,max]of [[a.x,b.x-a.x,box.x-box.w/2-radius,box.x+box.w/2+radius],[a.z,b.z-a.z,box.z-box.d/2-radius,box.z+box.d/2+radius]]){
 if(Math.abs(delta)<1e-9){if(start<=min||start>=max)return false;continue;}
 let t0=(min-start)/delta,t1=(max-start)/delta;if(t0>t1)[t0,t1]=[t1,t0];near=Math.max(near,t0);far=Math.min(far,t1);if(near>=far)return false;
 }return far>0&&near<1;
}
/** Static furniture/wall grid. Doors remain traversable because Marrow opens them. */
export class NavigationGrid{
 readonly size=60;readonly step=.4;readonly min=-11.8;free:Uint8Array;cache=new Map<string,Point[]>();
 constructor(isFree:(x:number,z:number)=>boolean){this.free=new Uint8Array(this.size*this.size);for(let i=0;i<this.free.length;i++){const p=this.point(i);this.free[i]=isFree(p.x,p.z)?1:0;}}
 point(id:number):Point{return {x:this.min+(id%this.size)*this.step,z:this.min+Math.floor(id/this.size)*this.step};}
 nearest(p:Point,accept:(p:Point)=>boolean=()=>true){const c=Math.round((p.x-this.min)/this.step),r=Math.round((p.z-this.min)/this.step);let best=-1,dist=Infinity;for(let radius=0;radius<=4;radius++){for(let z=r-radius;z<=r+radius;z++)for(let x=c-radius;x<=c+radius;x++){if(x<0||z<0||x>=this.size||z>=this.size)continue;const i=z*this.size+x;if(!this.free[i])continue;const pt=this.point(i);if(!accept(pt))continue;const d=Math.hypot(p.x-pt.x,p.z-pt.z);if(d<dist){best=i;dist=d;}}if(best!==-1)return best;}return -1;}
 route(a:Point,b:Point,connect?:(a:Point,b:Point)=>boolean){const start=this.nearest(a,p=>!connect||connect(a,p)),end=this.nearest(b,p=>!connect||connect(b,p));if(start<0||end<0)return [];const key=start+':'+end;const cached=this.cache.get(key);if(cached)return cached;
 const open=[start],closed=new Set<number>(),cost=new Map([[start,0]]),parent=new Map<number,number>();const endPoint=this.point(end);const heuristic=(id:number)=>{const p=this.point(id);return Math.hypot(p.x-endPoint.x,p.z-endPoint.z)/this.step;};
 while(open.length){let best=0;for(let k=1;k<open.length;k++)if(cost.get(open[k])!+heuristic(open[k])<cost.get(open[best])!+heuristic(open[best]))best=k;const current=open.splice(best,1)[0];if(current===end){const ids=[end];let next=end;while(next!==start){next=parent.get(next)!;ids.push(next);}const path=ids.reverse().map(id=>this.point(id));if(this.cache.size>256)this.cache.clear();this.cache.set(key,path);return path;}closed.add(current);const c=current%this.size,r=Math.floor(current/this.size);
 for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const x=c+dx,z=r+dz;if(x<0||z<0||x>=this.size||z>=this.size)continue;const id=z*this.size+x;if(!this.free[id]||closed.has(id)||dx&&dz&&(!this.free[r*this.size+x]||!this.free[z*this.size+c]))continue;const value=cost.get(current)!+(dx&&dz?Math.SQRT2:1);if(value<(cost.get(id)??Infinity)){cost.set(id,value);parent.set(id,current);if(!open.includes(id))open.push(id);}}
 }return [];
 }
}
