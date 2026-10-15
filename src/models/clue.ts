import * as T from 'three';
export function createClue(id:string,kind:string,m:Record<string,T.MeshStandardMaterial>){
 const root=new T.Group();root.name='clue-'+id;
 const box=(name:string,w:number,h:number,d:number,x:number,y:number,z:number,mat='metal')=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),m[mat]);o.name=name;o.position.set(x,y,z);root.add(o);return o;};
 const cylinder=(name:string,r:number,h:number,x:number,y:number,z:number,mat='metal')=>{const o=new T.Mesh(new T.CylinderGeometry(r,r,h,16),m[mat]);o.name=name;o.position.set(x,y,z);root.add(o);return o;};
 if(id.includes('key')&&id!=='music-key'){const bow=new T.Mesh(new T.TorusGeometry(.05,.012,6,16),m.metal);bow.name='key-bow';bow.rotation.x=Math.PI/2;root.add(bow);box('key-shaft',.018,.022,.19,0,0,.12);for(const z of [.17,.21])box('key-tooth',.055,.022,.024,.015,0,z);}
 else if(kind==='battery'||id==='fuse'){cylinder('cell-body',.04,.18,0,0,0,id==='fuse'?'glass':'dark').rotation.z=Math.PI/2;for(const x of [-.09,.09])cylinder('cell-terminal',.043,.025,x,0,0).rotation.z=Math.PI/2;}
 else if(id==='crowbar'){const curve=new T.CatmullRomCurve3([new T.Vector3(-.22,0,-.12),new T.Vector3(-.15,0,-.2),new T.Vector3(.1,0,.15),new T.Vector3(.2,0,.2)]);root.add(new T.Mesh(new T.TubeGeometry(curve,16,.017,6,false),m.metal));}
 else if(id==='scissors'){for(const side of [-1,1]){const handle=new T.Mesh(new T.TorusGeometry(.035,.009,6,12),m.metal);handle.rotation.x=Math.PI/2;handle.position.set(side*.038,0,-.08);root.add(handle);const blade=box('scissor-blade',.02,.018,.2,side*.02,0,.04);blade.rotation.y=side*.2;}}
 else if(id==='record'){box('player-base',.6,.09,.47,0,.02,0,'wood');cylinder('record-platter',.19,.022,-.06,.08,0,'dark');cylinder('spindle',.015,.04,-.06,.1,0);box('tonearm',.025,.022,.28,.23,.1,-.02);}
 else if(id==='tape'){box('recorder-body',.52,.12,.4,0,.04,0,'dark');for(const x of [-.14,.14]){cylinder('tape-reel',.1,.025,x,.12,-.04);cylinder('reel-hub',.025,.03,x,.14,-.04,'dark');}for(let i=0;i<4;i++)box('recorder-button',.07,.022,.07,-.14+i*.09,.12,.13,'cream');}
 else if(id==='music-key'){box('sealed-trunk',.7,.44,.48,0,-.2,0,'wood');box('trunk-lid',.75,.09,.52,0,.05,0,'wood');for(const x of [-.23,.23])box('trunk-latch',.07,.14,.03,x,-.02,.28);}
 else if(id==='ledger'){box('book-spine',.04,.04,.4,0,0,0,'wood');for(const x of [-.17,.17]){box('book-cover',.33,.025,.42,x,-.02,0,'wood');box('book-pages',.3,.035,.38,x,.01,0,'cream');for(let i=0;i<6;i++)box('ledger-entry',.24,.003,.009,x,.031,-.13+i*.05,'dark');}}
 else{box('paper',.38,.012,.3,0,0,0,'cream');for(let i=0;i<5;i++)box('written-line',.27,.002,.008,0,.008,-.09+i*.04,'dark');}
 root.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=true;o.receiveShadow=true;}});return root;
}
