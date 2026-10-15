import * as T from 'three';
export function createPantry(materials:Record<string,T.MeshStandardMaterial>){
 const group=new T.Group();group.name='complete-pantry-cabinet';
 const box=(name:string,w:number,h:number,d:number,x:number,y:number,z:number,mat='wood')=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),materials[mat]);m.name=name;m.userData.material=mat;m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;group.add(m);return m;};
 box('cabinet-carcass',2.8,.76,.78,0,.51,0);box('countertop',2.94,.1,.9,0,.96,.02,'cream');box('plinth',2.62,.13,.65,0,.12,0);
 for(const x of [-1.2,1.2])for(const z of [-.28,.28])box('foot',.14,.18,.14,x,.09,z);
 for(const x of [-.7,.7]){box('cupboard-door',1.3,.57,.065,x,.46,.423);box('raised-door-panel',1.05,.36,.025,x,.46,.469,'trim');box('drawer-front',1.3,.17,.065,x,.83,.423);box('drawer-handle',.26,.035,.06,x,.83,.49,'metal');box('cupboard-handle',.035,.13,.06,x<0?-.13:.13,.5,.49,'metal');}
 box('shelf-back',2.8,1.38,.06,0,1.74,-.33);for(const x of [-1.35,1.35])box('shelf-upright',.1,1.5,.44,x,1.75,-.13);for(const y of [1.07,1.73,2.42])box('shelf-board',2.8,.08,.46,0,y,-.13);box('shelf-cornice',2.96,.13,.5,0,2.5,-.13,'trim');
 for(const y of [1.27,1.94])for(let i=0;i<6;i++){const x=-1.06+i*.42;const jar=new T.Mesh(new T.CylinderGeometry(.11,.12,.26,14),materials.glass);jar.name='preserves-jar';jar.userData.material='glass';jar.position.set(x,y,-.06);jar.castShadow=true;group.add(jar);box('jar-lid',.24,.035,.24,x,y+.148,-.06,'metal');box('jar-label',.13,.1,.015,x,y,.063,'cream');}
 return group;
}
