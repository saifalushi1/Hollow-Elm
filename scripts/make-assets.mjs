import * as THREE from 'three';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {meshopt} from '@gltf-transform/functions';
import {MeshoptEncoder,MeshoptDecoder} from 'meshoptimizer';
import fs from 'node:fs/promises';
globalThis.FileReader=class{readAsArrayBuffer(blob){blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.();});}readAsDataURL(blob){blob.arrayBuffer().then(result=>{this.result='data:'+blob.type+';base64,'+Buffer.from(result).toString('base64');this.onloadend?.();});}};
const root=new THREE.Bone();root.name='root';
const spine=new THREE.Bone();spine.name='spine';spine.position.set(0,.95,0);root.add(spine);
const head=new THREE.Bone();head.name='head';head.position.set(0,.4,.13);spine.add(head);
const la=new THREE.Bone();la.name='leftArm';la.position.set(-.28,.1,.05);spine.add(la);
const ra=new THREE.Bone();ra.name='rightArm';ra.position.set(.28,.1,.05);spine.add(ra);
const ll=new THREE.Bone();ll.name='leftLeg';ll.position.set(-.13,.55,0);root.add(ll);
const rl=new THREE.Bone();rl.name='rightLeg';rl.position.set(.13,.55,0);root.add(rl);
const bones=[root,spine,head,la,ra,ll,rl];
const parts=[];function part(w,h,d,x,y,z,bone,color){const geo=new THREE.BoxGeometry(w,h,d);geo.translate(x,y,z);const n=geo.attributes.position.count,indices=new Uint16Array(n*4),weights=new Float32Array(n*4),colors=new Float32Array(n*3),c=new THREE.Color(color);for(let i=0;i<n;i++){indices[i*4]=bone;weights[i*4]=1;colors.set([c.r,c.g,c.b],i*3);}geo.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(indices,4));geo.setAttribute('skinWeight',new THREE.Float32BufferAttribute(weights,4));geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));parts.push(geo);}
part(.48,.7,.36,0,.95,0,1,0x4e5d52);part(.55,.5,.4,0,.4,.02,0,0x3d493d);part(.28,.3,.28,0,1.37,.13,2,0x9f9980);part(.32,.13,.29,0,1.55,.08,2,0xb3b4a3);part(.1,.6,.12,-.29,.75,.08,3,0x4e5d52);part(.1,.6,.12,.29,.75,.08,4,0x4e5d52);part(.1,.15,.11,-.29,.39,.08,3,0x9f9980);part(.1,.15,.11,.29,.39,.08,4,0x9f9980);part(.15,.55,.16,-.13,.3,0,5,0x303c32);part(.15,.55,.16,.13,.3,0,6,0x303c32);part(.18,.09,.25,-.13,.05,.04,5,0x262d27);part(.18,.09,.25,.13,.05,.04,6,0x262d27);
const mesh=new THREE.SkinnedMesh(mergeGeometries(parts),new THREE.MeshStandardMaterial({vertexColors:true,roughness:.88}));mesh.name='Mother_Marrow_PLACEHOLDER_RIG';mesh.add(root);mesh.bind(new THREE.Skeleton(bones));const group=new THREE.Group();group.name='Original_placeholder_character_CC0';group.add(mesh);
const cane=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.95,8),new THREE.MeshStandardMaterial({color:0x534b37}));cane.position.set(.38,.49,.3);group.add(cane);const lantern=new THREE.Mesh(new THREE.BoxGeometry(.18,.28,.17),new THREE.MeshStandardMaterial({color:0x9b8957,emissive:0xffa73a,emissiveIntensity:.65}));lantern.position.set(-.3,.48,.25);group.add(lantern);
const tracks=(s)=>[new THREE.NumberKeyframeTrack('leftArm.rotation[x]',[0,.5,1],[s,-s,s]),new THREE.NumberKeyframeTrack('rightArm.rotation[x]',[0,.5,1],[-s,s,-s]),new THREE.NumberKeyframeTrack('leftLeg.rotation[x]',[0,.5,1],[-s,s,-s]),new THREE.NumberKeyframeTrack('rightLeg.rotation[x]',[0,.5,1],[s,-s,s])];
// Quaternion tracks are portable glTF skeletal animation channels.
function anim(name,duration,amount){const ts=[0,duration/2,duration];const out=[];for(const [bone,sign]of [['leftArm',1],['rightArm',-1],['leftLeg',-1],['rightLeg',1]]){const vals=[];for(const angle of [amount,-amount,amount]){const q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),angle*sign);vals.push(...q.toArray());}out.push(new THREE.QuaternionKeyframeTrack(bone+'.quaternion',ts,vals));}return new THREE.AnimationClip(name,duration,out);}
const clips=[anim('idle',3,.025),anim('walk',1.4,.14),anim('search',2,.055),anim('chase',.75,.26),anim('catch',.9,.45)];
const raw=await new GLTFExporter().parseAsync(group,{binary:true,animations:clips});await MeshoptEncoder.ready;await MeshoptDecoder.ready;const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder':MeshoptEncoder,'meshopt.decoder':MeshoptDecoder});const doc=await io.readBinary(new Uint8Array(raw));await doc.transform(meshopt({encoder:MeshoptEncoder,level:'medium'}));await io.write('public/assets/mother-marrow-placeholder.glb',doc);
// Original kit prop: clock, four jars, desk and evidence surface.
const kit=new THREE.Group();for(let i=0;i<4;i++){const jar=new THREE.Mesh(new THREE.CylinderGeometry(.12,.13,.28,12),new THREE.MeshStandardMaterial({color:0x374f43,roughness:.3}));jar.position.set(i*.35,1,0);kit.add(jar);}const desk=new THREE.Mesh(new THREE.BoxGeometry(1.6,.1,.8),new THREE.MeshStandardMaterial({color:0x65553d,roughness:.8}));desk.position.set(.5,.8,0);kit.add(desk);const rawKit=await new GLTFExporter().parseAsync(kit,{binary:true});const kd=await io.readBinary(new Uint8Array(rawKit));await kd.transform(meshopt({encoder:MeshoptEncoder,level:'medium'}));await io.write('public/assets/preserves-kit.glb',kd);
console.log('Generated original meshopt-compressed rig and preserves kit.');
