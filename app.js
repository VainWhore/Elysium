import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const content = await fetch('./content.json').then(r=>r.json());
const $=(s,root=document)=>root.querySelector(s); const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const views=['home','map','history','sectors','nexus','gallery'];
function openView(name,section){views.forEach(v=>$('#view-'+v)?.classList.toggle('active',v===name));$$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===name && (!section || b.dataset.section===section || !b.dataset.section)));$('#sidebar').classList.remove('open');if(name==='history'&&section)scrollToSection(section);window.dispatchEvent(new Event('resize'));}
$$('.nav-item').forEach(b=>b.addEventListener('click',()=>openView(b.dataset.view,b.dataset.section)));
$$('[data-open]').forEach(b=>b.addEventListener('click',()=>openView(b.dataset.open,b.dataset.section)));
$('#menuToggle').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));

// Narrative is taken directly from the 29-page PDF. Section names are navigation labels only;
// no invented subheadings are inserted into the prose itself.
const story=$('#story'), index=$('#historyIndex');
content.sections.forEach((s,i)=>{
 const nav=document.createElement('button');nav.className='history-link';nav.textContent=String(i+1).padStart(2,'0')+' / '+s.label;nav.addEventListener('click',()=>scrollToSection(s.id));index.append(nav);
 const article=document.createElement('section');article.className='story-section';article.id='story-'+s.id;
 s.paragraphs.forEach(t=>{const p=document.createElement('p');p.textContent=t;article.append(p)});story.append(article);
});
function scrollToSection(id){const el=$('#story-'+id);if(el){el.scrollIntoView({behavior:'smooth',block:'start'});$$('.history-link',index).forEach((b,i)=>b.classList.toggle('active',content.sections[i].id===id));}}
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){const id=e.target.id.replace('story-','');$$('.history-link',index).forEach((b,i)=>b.classList.toggle('active',content.sections[i].id===id));}}),{rootMargin:'-18% 0px -65% 0px'});$$('.story-section').forEach(s=>observer.observe(s));

// Sector cards, using the facilities supplied for the site. No exact level assignments are asserted.
const sectorData=['sanctum','shelter'];
sectorData.forEach(key=>{const f=content.facilities[key];const card=document.createElement('article');card.className='sector-card';card.innerHTML=`<div class="eyebrow">${key==='sanctum'?'SECTOR 01':'SECTOR 02'} / ELYSIUM</div><h2>${f.name}</h2><div class="card-kicker">${f.subtitle}</div><p>${f.description}</p><ul>${f.items.map(x=>`<li>${x}</li>`).join('')}</ul>`;$('#sectorCards').append(card)});

// Three-dimensional holographic terrain + cutaway settlement. Drag rotates, wheel/pinch zooms,
// and touch gestures are handled by OrbitControls on desktop and mobile.
const scenes=[];
function createScene(canvas,compact=false){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x061319,0);
 const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x07151a,.026);
 const camera=new THREE.PerspectiveCamera(42,1,.1,250);camera.position.set(16,13,19);
 const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.065;controls.minDistance=9;controls.maxDistance=42;controls.maxPolarAngle=Math.PI*.48;controls.target.set(0,-1.5,0);controls.rotateSpeed=.55;controls.zoomSpeed=.7;controls.panSpeed=.55;controls.enablePan=true;
 scene.add(new THREE.AmbientLight(0x9acfd0,.65));const key=new THREE.DirectionalLight(0x8ce9e5,2.2);key.position.set(8,15,9);scene.add(key);const fill=new THREE.PointLight(0x2a9ba9,28,40);fill.position.set(-9,-2,-6);scene.add(fill);
 const world=new THREE.Group();scene.add(world);const surface=new THREE.Group(),sub=new THREE.Group();world.add(surface,sub);
 const groundMat=new THREE.MeshStandardMaterial({color:0x152b28,roughness:.95,metalness:.05,transparent:true,opacity:.96});
 const ground=new THREE.Mesh(new THREE.CylinderGeometry(11.2,12.3,.75,64,1),groundMat);ground.position.y=2.7;surface.add(ground);
 // topographic rings and fine grid
 for(let i=0;i<7;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(7.7+i*.48,.012,4,120),new THREE.MeshBasicMaterial({color:0x6eb9a5,transparent:true,opacity:.24-i*.018}));ring.rotation.x=Math.PI/2;ring.position.y=3.12+i*.008;surface.add(ring)}
 const grid=new THREE.GridHelper(24,32,0x5aa9a4,0x285a58);grid.position.y=3.1;grid.material.transparent=true;grid.material.opacity=.22;surface.add(grid);
 // undulating terrain mesh with subtle height variation
 const geo=new THREE.PlaneGeometry(21,21,48,48);geo.rotateX(-Math.PI/2);const pos=geo.attributes.position;for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i);pos.setY(i,.22*Math.sin(x*.65)*Math.cos(z*.48)+.12*Math.sin(z*1.1+x*.2));}geo.computeVertexNormals();const terrain=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0x294a3c,roughness:1,transparent:true,opacity:.55,wireframe:false}));terrain.position.y=3.18;surface.add(terrain);
 // stylized forest, deliberately irregular clusters
 const treeMat=new THREE.MeshStandardMaterial({color:0x365f4e,roughness:1});const trunkMat=new THREE.MeshStandardMaterial({color:0x493e31});
 for(let i=0;i<125;i++){const a=Math.random()*Math.PI*2,r=4.5+Math.random()*6.1,x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.abs(x)<2.2&&Math.abs(z)<2.2)continue;const h=.65+Math.random()*1.05;const tree=new THREE.Group();const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.045,.07,h*.42,5),trunkMat);trunk.position.y=h*.2;tree.add(trunk);const crown=new THREE.Mesh(new THREE.ConeGeometry(.24+Math.random()*.18,h,6),treeMat);crown.position.y=h*.72;tree.add(crown);tree.position.set(x,3.25,z);tree.rotation.y=Math.random()*6;surface.add(tree)}
 // hidden entry hatches blend into forest, only glow when selected
 const entries=[[-7,-2.8],[5,5.7],[7,-4.5]];entries.forEach((p,i)=>{const hatch=new THREE.Mesh(new THREE.CylinderGeometry(.28,.34,.08,16),new THREE.MeshStandardMaterial({color:0x789b88,metalness:.45,roughness:.55}));hatch.position.set(p[0],3.35,p[1]);hatch.userData={key:'entry',label:'Acceso oculto '+(i+1)};surface.add(hatch);const halo=new THREE.Mesh(new THREE.TorusGeometry(.42,.018,5,32),new THREE.MeshBasicMaterial({color:0x82e5df,transparent:true,opacity:.5}));halo.rotation.x=Math.PI/2;halo.position.set(p[0],3.4,p[1]);halo.userData={key:'entry',label:'Acceso oculto '+(i+1)};surface.add(halo)});
 // geological cutaway slab below the forest
 const strata=new THREE.Mesh(new THREE.BoxGeometry(17,.34,14),new THREE.MeshStandardMaterial({color:0x172c34,transparent:true,opacity:.55,wireframe:true}));strata.position.set(0,-.2,0);sub.add(strata);
 const floorYs=[1.25,-1.15,-3.55];const floorColors=[0x4b8c89,0x5d9c9b,0x477d86];
 const floors=[];
 floorYs.forEach((y,i)=>{const g=new THREE.Group();sub.add(g);const plate=new THREE.Mesh(new THREE.BoxGeometry(14,.13,10),new THREE.MeshStandardMaterial({color:0x16353d,metalness:.55,roughness:.5,transparent:true,opacity:.84}));plate.position.y=y;g.add(plate);const edges=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(14,.13,10)),new THREE.LineBasicMaterial({color:floorColors[i],transparent:true,opacity:.8}));edges.position.y=y;g.add(edges);const grid2=new THREE.GridHelper(14,14,0x4d9699,0x26545c);grid2.position.set(0,y+.08,0);grid2.material.transparent=true;grid2.material.opacity=.2;g.add(grid2);floors.push(g)});
 // room blocks and corridors, broad footprints rather than individual rooms
 function block(g,x,z,w,d,y,color,key,label){const m=new THREE.Mesh(new THREE.BoxGeometry(w,.55,d),new THREE.MeshStandardMaterial({color,metalness:.3,roughness:.48,transparent:true,opacity:.82}));m.position.set(x,y,z);m.userData={key,label};g.add(m);const e=new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry),new THREE.LineBasicMaterial({color:0x8be5e1,transparent:true,opacity:.75}));e.position.copy(m.position);e.userData={key,label};g.add(e);return m}
 function corridor(g,points,y){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(p[0],y,p[1])));const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,40,.055,6,false),new THREE.MeshBasicMaterial({color:0x65d5d6,transparent:true,opacity:.72}));g.add(mesh)}
 const top=floors[0],mid=floors[1],low=floors[2];
 block(top,-4,-2,3.5,2.4,1.25,0x28515a,'elysium','Núcleo administrativo');block(top,0,-2,3,2,1.25,0x275e62,'sanctum','Sanctum');block(top,4,-2,3.2,2.6,1.25,0x315c54,'shelter','The Shelter');block(top,0,2.6,2.2,1.2,1.25,0x1d4a55,'shared','Infraestructura compartida');corridor(top,[[-5.8,-2],[-2,-2],[0,-2],[2,-2],[5.6,-2]],1.55);corridor(top,[[0,-2],[0,2.5]],1.55);
 block(mid,-4,-2,4.1,3,-1.15,0x24545c,'sanctum','Sanctum');block(mid,2.8,-2,5.2,3.4,-1.15,0x28574e,'shelter','The Shelter');block(mid,-.4,2.3,2.6,1.6,-1.15,0x1d4650,'shared','Servicios compartidos');corridor(mid,[[-6,-2],[-2,-2],[0,-2],[2,-2],[5.5,-2]],-.85);corridor(mid,[[0,-2],[0,2.3]],-.85);
 block(low,-3.4,-1.5,4.2,2.5,-3.55,0x24515c,'shared','Infraestructura técnica');block(low,2.4,-1.5,4.8,2.5,-3.55,0x1e4752,'shared','Sistemas de soporte');corridor(low,[[-5.5,-1.5],[-1,-1.5],[1,-1.5],[5,-1.5]],-3.2);
 // vertical cores connecting the stacked levels
 [[-5,1],[0,0],[5,1]].forEach((p,i)=>{const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,5.7,12,1,true),new THREE.MeshBasicMaterial({color:0x83e8e2,wireframe:true,transparent:true,opacity:.62}));shaft.position.set(p[0],-.85,p[1]);shaft.userData={key:'shared',label:'Núcleo vertical / ascensores'};sub.add(shaft)});
 // vertical entrance shafts from the forest down to the bunker
 entries.forEach((p,i)=>{const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,2.4,10,1,true),new THREE.MeshBasicMaterial({color:0x81e1dc,wireframe:true,transparent:true,opacity:.58}));shaft.position.set(p[0],1.9,p[1]);sub.add(shaft)});
 // suspended contour lines surrounding the whole model
 const contourGroup=new THREE.Group();world.add(contourGroup);for(let i=0;i<5;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(10.7+i*.45,.009,3,120),new THREE.MeshBasicMaterial({color:0x4bb5b8,transparent:true,opacity:.12}));ring.rotation.x=Math.PI/2;ring.position.y=-4.8-i*.18;contourGroup.add(ring)}
 const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let labels=true,layer='both';
 function resize(){const w=canvas.clientWidth||1,h=canvas.clientHeight||1;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
 const ro=new ResizeObserver(resize);ro.observe(canvas);resize();
 function animate(){requestAnimationFrame(animate);controls.update();renderer.render(scene,camera)}animate();
 function choose(ev){const rect=canvas.getBoundingClientRect();pointer.x=((ev.clientX-rect.left)/rect.width)*2-1;pointer.y=-((ev.clientY-rect.top)/rect.height)*2+1;raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(world.children,true).filter(h=>h.object.userData?.key);if(hits.length){const d=hits[0].object.userData;showInfo(d.key,d.label)}}
 let pointerStart=null;canvas.addEventListener('pointerdown',ev=>{pointerStart={x:ev.clientX,y:ev.clientY}});canvas.addEventListener('pointerup',ev=>{if(pointerStart&&Math.hypot(ev.clientX-pointerStart.x,ev.clientY-pointerStart.y)<6)choose(ev);pointerStart=null});
 function setLayer(v){layer=v;surface.visible=v!=='bunker';sub.visible=v!=='surface';if(v==='surface'){camera.position.set(13,13,16);controls.target.set(0,3,0)}else if(v==='bunker'){camera.position.set(14,7,17);controls.target.set(0,-1.7,0)}else{camera.position.set(16,13,19);controls.target.set(0,-1.5,0)}controls.update()}
 return {renderer,scene,camera,controls,setLayer,reset:()=>{setLayer(layer)},setLabels:v=>{labels=v;contourGroup.visible=v;grid.visible=v;},}
}
const infoMap={
 elysium:{name:'ELYSIUM',id:'CORE / 001',desc:'Núcleo administrativo y de coordinación general.',items:content.facilities.elysium.items},
 sanctum:{name:'SANCTUM',id:'SECTOR / 002',desc:content.facilities.sanctum.description,items:content.facilities.sanctum.items},
 shelter:{name:'THE SHELTER',id:'SECTOR / 003',desc:content.facilities.shelter.description,items:content.facilities.shelter.items},
 shared:{name:'INFRAESTRUCTURA COMPARTIDA',id:'SYSTEM / 004',desc:content.facilities.shared.description,items:content.facilities.shared.items},
 entry:{name:'ACCESO EXTERIOR',id:'ENTRY / RESTRICTED',desc:'Acceso camuflado entre la vegetación. La ubicación y cantidad definitivas de entradas no están fijadas en este modelo.',items:['Control exterior','Verificación de ingreso','Conexión vertical protegida']}
};
function showInfo(key,label){const d=infoMap[key]||infoMap.shared;$('#infoId').textContent=d.id;$('#infoContent').innerHTML=`<div class="info-symbol">⌖</div><h2>${label||d.name}</h2><p>${d.desc}</p><ul class="facility-list">${d.items.map(x=>`<li>${x}</li>`).join('')}</ul><div class="info-hint">DISTRIBUCIÓN CONCEPTUAL · CONSULTAR AUTORIZACIÓN DE ACCESO</div>`;}
let mainScene,homeScene;
try{mainScene=createScene($('#mainCanvas'));homeScene=createScene($('#homeCanvas'),true);$('#sceneLoading').classList.add('hidden');setTimeout(()=>$('#sceneLoading').remove(),700)}catch(e){console.error(e);$('#sceneLoading').textContent='NO SE PUDO INICIAR EL MOTOR 3D. VERIFICÁ LA CONEXIÓN.'}
$$('.layer-btn').forEach(b=>b.addEventListener('click',()=>{$$('.layer-btn').forEach(x=>x.classList.toggle('active',x===b));mainScene?.setLayer(b.dataset.layer);homeScene?.setLayer(b.dataset.layer)}));
$('#resetView').addEventListener('click',()=>{mainScene?.setLayer('both');homeScene?.setLayer('both');$$('.layer-btn').forEach(x=>x.classList.toggle('active',x.dataset.layer==='both'))});
$('#toggleLabels').addEventListener('click',e=>{e.currentTarget.classList.toggle('selected');const v=e.currentTarget.classList.contains('selected');mainScene?.setLabels(v);homeScene?.setLabels(v)});
