import * as T from 'three';
/** Original non-graphic face geometry. Details emerge as the lantern draws near. */
export class MarrowFace{
 root=new T.Group();jaw=new T.Group();eyes:T.Mesh[]=[];mouth:T.Mesh;skin:T.MeshStandardMaterial;
 constructor(){
 this.skin=new T.MeshStandardMaterial({color:0xaaa889,roughness:.95});const dark=new T.MeshStandardMaterial({color:0x100f0d,roughness:1}),tooth=new T.MeshStandardMaterial({color:0xb8ab7a,roughness:.85}),vein=new T.MeshStandardMaterial({color:0x3b4432,roughness:1});
 const sphere=(r:number,x:number,y:number,z:number,mat:T.Material,sx=1,sy=1,sz=1,parent=this.root)=>{const m=new T.Mesh(new T.SphereGeometry(r,20,14),mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;};
 sphere(.19,0,.03,.05,this.skin,.93,1.18,.83);sphere(.11,-.12,-.03,.1,this.skin,.5,.95,.48);sphere(.11,.12,-.03,.1,this.skin,.5,1.05,.48);
 for(const x of [-.075,.075]){sphere(.062,x,.065,.184,dark,1,.7,.32);const eye=sphere(.023,x,.062,.206,new T.MeshStandardMaterial({color:0xcfc7a5,emissive:0x746836,emissiveIntensity:.15}),1,.7,.45);this.eyes.push(eye);sphere(.01,x+.004,.06,.219,dark,.3,1,.3);const brow=new T.Mesh(new T.CapsuleGeometry(.018,.06,4,8),this.skin);brow.rotation.z=x<0?.9:-.75;brow.position.set(x,.108,.19);this.root.add(brow);}
 const nose=new T.Mesh(new T.ConeGeometry(.032,.12,7),this.skin);nose.rotation.x=-Math.PI/2;nose.position.set(.012,.005,.21);this.root.add(nose);
 this.mouth=sphere(.075,0,-.091,.183,dark,1.12,.5,.32);this.root.add(this.jaw);this.jaw.position.set(0,-.12,.09);sphere(.095,0,-.012,.03,this.skin,.98,.5,.72,this.jaw);
 for(let i=0;i<9;i++){const x=(i-4)*.017;const upper=new T.Mesh(new T.ConeGeometry(.009,.035+(i%3)*.009,5),tooth);upper.rotation.z=Math.PI;upper.position.set(x,-.059,.214-Math.abs(x)*.3);this.root.add(upper);const lower=upper.clone();lower.rotation.z=0;lower.position.set(x,.022,.118-Math.abs(x)*.3);this.jaw.add(lower);}
 // Wrinkles, asymmetry and dark branching veins rather than blood or wounds.
 for(let side=-1;side<=1;side+=2)for(let i=0;i<7;i++){const x=side*(.085+i*.009),y=.01-i*.019;const curve=new T.CatmullRomCurve3([new T.Vector3(x,y,.188),new T.Vector3(x+side*.017,y-.015,.17),new T.Vector3(x+side*.008,y-.04,.16)]);this.root.add(new T.Mesh(new T.TubeGeometry(curve,6,.0016,3,false),vein));}
 for(let i=0;i<5;i++){const curve=new T.CatmullRomCurve3([new T.Vector3(-.1,.14+i*.012,.16),new T.Vector3(0,.135+i*.012,.187),new T.Vector3(.1,.143+i*.012,.16)]);this.root.add(new T.Mesh(new T.TubeGeometry(curve,10,.0013,3,false),vein));}
 this.root.name='Marrow_proximity_face';this.update(20);
 }
 update(distance:number,forced=false){const fear=forced?1:T.MathUtils.clamp((8-distance)/7,0,1);this.jaw.position.y=-.12-fear*.105;this.jaw.rotation.z=fear*.12;this.mouth.scale.y=.5+fear*1.1;this.mouth.position.y=-.09-fear*.035;this.skin.color.setRGB(.49+fear*.14,.5+fear*.09,.38+fear*.04);for(const eye of this.eyes){eye.scale.y=.7+fear*.65;(eye.material as T.MeshStandardMaterial).emissiveIntensity=.15+fear*.75;}this.root.rotation.z=fear*.07;}
}
export class CatchScare{
 scene=new T.Scene();camera=new T.PerspectiveCamera(43,1,.02,10);face=new MarrowFace();active=false;time=0;reduced=false;complete?:()=>void;
 constructor(){this.scene.background=new T.Color(0x020504);this.scene.add(this.face.root,new T.HemisphereLight(0xb6b79b,0x050a08,2));const lamp=new T.PointLight(0xe9b36f,7,4,2);lamp.position.set(-.35,-.3,.7);this.scene.add(lamp);this.camera.position.set(0,.02,1.3);this.camera.lookAt(0,0,0);}
 start(reduced:boolean,complete:()=>void){this.time=0;this.active=true;this.reduced=reduced;this.complete=complete;this.face.update(0,true);}
 render(renderer:T.WebGLRenderer,dt:number){if(!this.active)return;this.time+=dt;this.camera.aspect=renderer.domElement.width/renderer.domElement.height;this.camera.position.z=this.reduced?.83:T.MathUtils.lerp(1.25,.57,Math.min(1,this.time/.22));this.face.root.rotation.z=this.reduced?.06:.1+Math.sin(this.time*21)*.022;this.camera.updateProjectionMatrix();renderer.render(this.scene,this.camera);if(this.time>(this.reduced?.85:1.15)){this.active=false;const done=this.complete;this.complete=undefined;done?.();}}
}
