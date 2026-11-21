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

// Holographic surface + architectural cutaway. Only the map engine is replaced here.
const scenes=[];
const facilityDescriptions={
 'Sala de consejo':'Espacio de deliberación y toma de decisiones administrativas.','Archivo general':'Conserva documentación institucional y registros generales.','Puesto de vigilancia':'Supervisa los accesos y las condiciones de seguridad del complejo.','Zona de aislamiento':'Área restringida para procedimientos de aislamiento y observación.','Red de comunicaciones':'Gestiona los enlaces internos y las comunicaciones autorizadas.','Sala de reuniones':'Espacio destinado a reuniones de coordinación.','Centro de mando':'Coordina operaciones de seguridad y seguimiento de amenazas.','Laboratorio':'Instalación destinada a investigación y análisis.','Centro médico':'Atención, evaluación, tratamiento y seguimiento sanitario.','Servidores':'Aloja la infraestructura informática independiente.','Taller tecnológico':'Reparación, adaptación y mantenimiento de equipos.','Archivo':'Almacena documentación técnica y registros del sector.','Comedor':'Área de alimentación para el personal del sector.','Dormitorios':'Alojamiento residencial para habitantes del sector.','Invernadero':'Producción interna de vegetales y cultivos.','Área de evaluación y entrenamiento psicológico':'Espacio de evaluación y entrenamiento psicológico.','Oficina de Neuroelect':'Oficina vinculada a las actividades de Neuroelect.','Plaza central':'Punto de encuentro y circulación comunitaria.','Mercado':'Área de intercambio y distribución de productos.','Comedor comunitario':'Prepara y distribuye las comidas de los residentes.','Taller':'Reparación y elaboración de objetos de uso cotidiano.','Enfermería':'Atención primaria y seguimiento de necesidades sanitarias.','Zona creativa':'Espacio para actividades artísticas y recreativas.','Almacén':'Resguarda provisiones y materiales de uso común.','Sala común':'Lugar de descanso y convivencia entre residentes.','Bar':'Establecimiento recreativo y punto de encuentro.','Generación y distribución eléctrica':'Produce y distribuye energía a las instalaciones.','Tratamiento y almacenamiento de agua':'Procesa y conserva el suministro de agua.','Ventilación y climatización':'Renueva el aire y regula las condiciones ambientales.','Gestión de residuos':'Clasifica y procesa los residuos del asentamiento.','Mantenimiento técnico':'Da soporte a los sistemas e instalaciones.','Almacenes de servicio':'Conserva repuestos y materiales técnicos.','Conexiones verticales y corredores':'Conectan los distintos niveles y áreas del complejo.'
};
function createScene(canvas,compact=false){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setClearColor(0x061319,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
 const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x07151a,.018);
 const camera=new THREE.PerspectiveCamera(39,1,.1,300);camera.position.set(23,17,25);
 const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.075;controls.minDistance=8;controls.maxDistance=54;controls.maxPolarAngle=Math.PI*.485;controls.minPolarAngle=.12;controls.target.set(0,.1,0);controls.rotateSpeed=.48;controls.zoomSpeed=.72;controls.panSpeed=.55;controls.enablePan=true;
 scene.add(new THREE.HemisphereLight(0xb8e6e8,0x101b20,1.35));const key=new THREE.DirectionalLight(0xc4f6f2,2.1);key.position.set(12,22,10);scene.add(key);const rim=new THREE.PointLight(0x55d9e4,35,55);rim.position.set(-12,2,-10);scene.add(rim);const warm=new THREE.PointLight(0x9ab8a2,13,38);warm.position.set(10,-2,12);scene.add(warm);
 const world=new THREE.Group();scene.add(world);const surface=new THREE.Group(),sub=new THREE.Group(),markers=new THREE.Group();world.add(surface,sub,markers);
 const cyan=0x8de8e7, pale=0xc2fffa;
 // Surface terrain: softly rolling forest floor with a physically layered canopy.
 const terrainGeo=new THREE.PlaneGeometry(30,27,70,64);terrainGeo.rotateX(-Math.PI/2);const tp=terrainGeo.attributes.position;for(let i=0;i<tp.count;i++){let x=tp.getX(i),z=tp.getZ(i);tp.setY(i,.55*Math.sin(x*.22)*Math.cos(z*.19)+.22*Math.sin(z*.42+x*.11)+.12*Math.cos(x*.63-z*.28));}terrainGeo.computeVertexNormals();const terrain=new THREE.Mesh(terrainGeo,new THREE.MeshStandardMaterial({color:0x344b3e,roughness:1,metalness:0,transparent:true,opacity:.92,side:THREE.DoubleSide}));terrain.position.y=5.55;surface.add(terrain);
 const earth=new THREE.Mesh(new THREE.CylinderGeometry(15.2,16.3,1.5,80,1),new THREE.MeshStandardMaterial({color:0x182b29,roughness:1,transparent:true,opacity:.94}));earth.position.y=4.78;surface.add(earth);
 const bark=new THREE.MeshStandardMaterial({color:0x554b3a,roughness:1});const leaves=[0x294d3d,0x365b45,0x42634b,0x29483d].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:1}));
 let seed=8317;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 for(let i=0;i<205;i++){const a=rand()*Math.PI*2,r=5.8+rand()*9.0,x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.abs(x)<3.6&&Math.abs(z)<3.1)continue;const h=1.7+rand()*2.4,g=new THREE.Group();const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.07,.13,h*.48,7),bark);trunk.position.y=h*.24;g.add(trunk);for(let j=0;j<3;j++){const rr=.65+rand()*.35;const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(rr,1),leaves[Math.floor(rand()*leaves.length)]);crown.scale.set(1,1.1+rand()*.3,1);crown.position.set((rand()-.5)*.3,h*.48+j*.42,(rand()-.5)*.3);g.add(crown)}g.position.set(x,5.55+.12*Math.sin(x*.22)*Math.cos(z*.19),z);g.rotation.y=rand()*6.28;surface.add(g)}
 // A sparse clearing makes the concealed access points legible without exposing them.
 const clearing=new THREE.Mesh(new THREE.CircleGeometry(3.5,48),new THREE.MeshStandardMaterial({color:0x53644d,roughness:1,transparent:true,opacity:.6}));clearing.rotation.x=-Math.PI/2;clearing.position.set(0,5.59,0);surface.add(clearing);
 // Bunker shell and three connected architectural decks. The room placement is illustrative, not canonically assigned.
 const shell=new THREE.Mesh(new THREE.BoxGeometry(19,.32,15),new THREE.MeshStandardMaterial({color:0x172a31,metalness:.45,roughness:.48,transparent:true,opacity:.42,wireframe:true}));shell.position.set(0,-2.6,0);sub.add(shell);
 const deckYs=[1.35,-1.35,-4.05];const deckGroups=[];const deckLabels=['PLATAFORMA SUPERIOR','PLATAFORMA INTERMEDIA','PLATAFORMA INFERIOR'];
 function box(parent,w,h,d,mat,x,y,z){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);parent.add(m);return m}
 function lineBox(parent,w,h,d,x,y,z,color=cyan,opacity=.68){const m=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w,h,d)),new THREE.LineBasicMaterial({color,transparent:true,opacity}));m.position.set(x,y,z);parent.add(m);return m}
 const floorMat=new THREE.MeshStandardMaterial({color:0x243b42,metalness:.62,roughness:.42,transparent:true,opacity:.91});const wallMat=new THREE.MeshStandardMaterial({color:0x31474d,metalness:.48,roughness:.4,transparent:true,opacity:.88});const glassMat=new THREE.MeshPhysicalMaterial({color:0x4c9296,metalness:.28,roughness:.22,transparent:true,opacity:.2,transmission:.15});
 deckYs.forEach((y,idx)=>{const deck=new THREE.Group();sub.add(deck);deckGroups.push(deck);box(deck,17,.22,13,floorMat,0,y,0);lineBox(deck,17,.22,13,0,y,0,idx===0?0x8eddd9:0x62b9c4,.78);const grid=new THREE.GridHelper(17,34,0x4c9da4,0x28535c);grid.position.y=y+.12;grid.material.transparent=true;grid.material.opacity=.13;deck.add(grid); // outer retaining walls, with an open front to reveal the interior
 box(deck,17,.95,.22,wallMat,0,y+.48,-6.4);box(deck,.22,.95,13,wallMat,-8.4,y+.48,0);box(deck,.22,.95,13,wallMat,8.4,y+.48,0);lineBox(deck,17,.95,.22,0,y+.48,-6.4);lineBox(deck,.22,.95,13,-8.4,y+.48,0);lineBox(deck,.22,.95,13,8.4,y+.48,0);
 // Structural beams and light channels create scale and believable construction.
 for(let x=-7;x<=7;x+=3.5){box(deck,.12,1.25,.14,wallMat,x,y+.62,0);const glow=box(deck,.025,.85,.035,new THREE.MeshBasicMaterial({color:cyan,transparent:true,opacity:.45}),x+.09,y+.62,0)}
 // A transparent partial ceiling reads as a cutaway rather than a flat floorplan.
 const roof=box(deck,16.7,.08,12.6,glassMat,0,y+1.15,0);roof.material=roof.material.clone();roof.material.opacity=.08;
 });
 // Build room pods with walls, door gaps, glass partitions and a selectable holographic beacon.
 const facilityRecords=[];
 const sectorSpecs=[
  {key:'elysium',name:'ELYSIUM',color:0x8bd9d2,items:content.facilities.elysium.items},
  {key:'sanctum',name:'SANCTUM',color:0x83dbe8,items:content.facilities.sanctum.items},
  {key:'shelter',name:'THE SHELTER',color:0xa3d8bd,items:content.facilities.shelter.items},
  {key:'shared',name:'INFRAESTRUCTURA COMPARTIDA',color:0x9bb7f0,items:content.facilities.shared.items}
 ];
 // Place facilities across the decks in a readable, connected cluster. These positions are visual placeholders.
 const placements=[
  {deck:0,sector:0,coords:[[-5.4,-3.9],[-1.8,-3.9],[1.8,-3.9],[5.4,-3.9],[-5.4,2.9],[-1.8,2.9]]},
  {deck:0,sector:1,coords:[[1.8,2.9],[5.4,2.9],[-5.4,0],[-1.8,0],[1.8,0],[5.4,0],[-5.4,-1.9],[-1.8,-1.9],[1.8,-1.9],[5.4,-1.9],[-1.8,4.7]]},
  {deck:1,sector:2,coords:[[-5.4,-3.9],[-1.8,-3.9],[1.8,-3.9],[5.4,-3.9],[-5.4,0],[-1.8,0],[1.8,0],[5.4,0],[-5.4,3.1],[-1.8,3.1],[1.8,3.1]]},
  {deck:2,sector:3,coords:[[-5.4,-2.8],[-1.8,-2.8],[1.8,-2.8],[5.4,-2.8],[-5.4,2],[-1.8,2],[1.8,2]]}
 ];
 function roomPod(deck,sector,item,idx,x,z,y){const w=2.55,d=2.05,h=.82;const pod=new THREE.Group();deck.add(pod);pod.position.set(x,y,z);const base=box(pod,w,.13,d,floorMat,0,.08,0);lineBox(pod,w,.13,d,0,.08,0,sector.color,.85);
 // Three solid sides and a segmented front wall leave a visible doorway.
 box(pod,w,.76,.10,wallMat,0,.49,-d/2);box(pod,.10,.76,d,wallMat,-w/2,.49,0);box(pod,.10,.76,d,wallMat,w/2,.49,0);box(pod,.78,.76,.10,wallMat,-.88,.49,d/2);box(pod,.78,.76,.10,wallMat,.88,.49,d/2);
 const inner=new THREE.Mesh(new THREE.BoxGeometry(w-.3,.04,d-.3),new THREE.MeshBasicMaterial({color:sector.color,transparent:true,opacity:.09}));inner.position.y=.17;pod.add(inner);
 // Small interior forms make the footprint read as a room, not a floating cube.
 box(pod,.68,.28,.46,new THREE.MeshStandardMaterial({color:0x53676a,metalness:.5,roughness:.5}),-.45,.28,-.2);box(pod,.42,.42,.34,new THREE.MeshStandardMaterial({color:0x354e56,metalness:.55,roughness:.4}),.55,.34,-.28);
 const ceiling=box(pod,w,.045,d,glassMat,0,.9,0);ceiling.material=ceiling.material.clone();ceiling.material.opacity=.16;
 const beacon=new THREE.Group();pod.add(beacon);beacon.position.set(0,1.18,0);const orb=new THREE.Mesh(new THREE.SphereGeometry(.105,16,12),new THREE.MeshBasicMaterial({color:sector.color}));beacon.add(orb);const halo=new THREE.Mesh(new THREE.TorusGeometry(.22,.012,6,32),new THREE.MeshBasicMaterial({color:sector.color,transparent:true,opacity:.9}));halo.rotation.x=Math.PI/2;beacon.add(halo);const stem=new THREE.Mesh(new THREE.CylinderGeometry(.008,.008,.23,6),new THREE.MeshBasicMaterial({color:sector.color,transparent:true,opacity:.65}));stem.position.y=-.17;beacon.add(stem);
 const data={key:sector.key,sector:sector.name,name:item,desc:facilityDescriptions[item]||'Instalación interna de Elysium.',id:`${sector.key.toUpperCase()} / ${(idx+1).toString().padStart(2,'0')}`,color:sector.color,position:beacon.getWorldPosition(new THREE.Vector3())};beacon.userData={facility:data};orb.userData={facility:data};halo.userData={facility:data};facilityRecords.push({beacon,data});return pod}
 placements.forEach((pl,pi)=>{const sector=sectorSpecs[pl.sector],items=sector.items,deck=deckGroups[pl.deck],y=deckYs[pl.deck];items.forEach((item,i)=>{const c=pl.coords[i]||[0,0];roomPod(deck,sector,item,i,c[0],c[1],.12);});});
 // Broad corridors and connecting galleries between the room clusters.
 function corridor(deck,pts,y,width=.32){const curve=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],y,p[1])));const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,70,width,8,false),new THREE.MeshStandardMaterial({color:0x426c72,metalness:.55,roughness:.38,transparent:true,opacity:.55}));deck.add(tube);const light=new THREE.Mesh(new THREE.TubeGeometry(curve,70,.018,5,false),new THREE.MeshBasicMaterial({color:cyan,transparent:true,opacity:.78}));deck.add(light)}
 deckGroups.forEach((d,i)=>{const y=deckYs[i]+.23;corridor(d,[[-7.8,-5.1],[-5,-5.1],[-2,-5.1],[1,-5.1],[4,-5.1],[7.8,-5.1]],y,.22);corridor(d,[[-7.8,1.4],[-4,1.4],[0,1.4],[4,1.4],[7.8,1.4]],y,.18);corridor(d,[[0,-5.1],[0,-2],[0,1.4],[0,4.9]],y,.17)});
 // Glass elevator cores visibly connect all decks and reach the forest service layer.
 const shaftMat=new THREE.MeshPhysicalMaterial({color:0x69cbd1,metalness:.45,roughness:.18,transparent:true,opacity:.19,transmission:.25});[[-6.4,-4.8],[0,0],[6.4,4.8]].forEach((p,i)=>{const shaft=new THREE.Group();sub.add(shaft);const h=7.9;const casing=new THREE.Mesh(new THREE.BoxGeometry(.72,h,.72),shaftMat);casing.position.y=-1.4;shaft.add(casing);lineBox(shaft,.74,h,.74,p[0],-1.4,p[1],cyan,.72);shaft.position.set(p[0],0,p[1]);const core=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,h*.48,12),new THREE.MeshBasicMaterial({color:cyan,wireframe:true,transparent:true,opacity:.38}));core.position.y=-1.4;shaft.add(core)});
 // Concealed surface access hatches and vertical shafts, visually aligned with the underground model.
 const accessPts=[[-9,-5],[8,7],[10,-7]];accessPts.forEach((p,i)=>{const hatch=new THREE.Mesh(new THREE.CylinderGeometry(.38,.42,.1,24),new THREE.MeshStandardMaterial({color:0x53665b,metalness:.55,roughness:.48}));hatch.position.set(p[0],5.75,p[1]);surface.add(hatch);const ring=new THREE.Mesh(new THREE.TorusGeometry(.46,.018,6,40),new THREE.MeshBasicMaterial({color:cyan,transparent:true,opacity:.82}));ring.rotation.x=Math.PI/2;ring.position.set(p[0],5.82,p[1]);ring.userData={access:i};surface.add(ring);const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,4.7,12,1,true),new THREE.MeshBasicMaterial({color:cyan,wireframe:true,transparent:true,opacity:.28}));shaft.position.set(p[0],3.1,p[1]);sub.add(shaft)});
 // Surface scan lines and subtle perimeter HUD rings.
 const scan=new THREE.Group();world.add(scan);for(let i=0;i<5;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(12.2+i*.55,.012,4,150),new THREE.MeshBasicMaterial({color:cyan,transparent:true,opacity:.13-i*.015}));ring.rotation.x=Math.PI/2;ring.position.y=5.15-i*.035;scan.add(ring)}
 // Build DOM hologram popover for each selected room.
 const frame=canvas.closest('.scene-frame');let popup=frame.querySelector('.facility-popup');if(!popup){popup=document.createElement('div');popup.className='facility-popup';popup.innerHTML='<button class="popup-close" aria-label="Cerrar">×</button><span class="popup-kicker">INSTALLATION / SELECTED</span><small class="popup-id"></small><h3></h3><p></p><span class="popup-sector"></span>';frame.append(popup);popup.querySelector('.popup-close').addEventListener('click',()=>popup.classList.remove('visible'))}
 const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let layer='both',labels=true,selected=null;
 function updatePopup(){if(!selected)return;const v=selected.beacon.getWorldPosition(new THREE.Vector3()).project(camera);if(v.z>1){popup.classList.remove('visible');return}const rect=canvas.getBoundingClientRect(),x=(v.x*.5+.5)*rect.width,y=(-v.y*.5+.5)*rect.height;popup.style.left=`${Math.max(14,Math.min(rect.width-260,x+15))}px`;popup.style.top=`${Math.max(48,Math.min(rect.height-160,y-20))}px`;}
 function selectFacility(data,beacon){selected={data,beacon};popup.querySelector('.popup-id').textContent=data.id;popup.querySelector('h3').textContent=data.name;popup.querySelector('p').textContent=data.desc;popup.querySelector('.popup-sector').textContent=data.sector+'  /  ELYSIUM';popup.classList.add('visible');updatePopup();if(typeof showInfo==='function')showInfo(data.key,data.name,data)}
 function choose(ev){const rect=canvas.getBoundingClientRect();pointer.x=((ev.clientX-rect.left)/rect.width)*2-1;pointer.y=-((ev.clientY-rect.top)/rect.height)*2+1;raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(world.children,true);const hit=hits.find(h=>h.object.userData?.facility);if(hit){const data=hit.object.userData.facility;const rec=facilityRecords.find(r=>r.data===data)||facilityRecords.find(r=>r.data.name===data.name);selectFacility(data,rec?.beacon||hit.object.parent)}else{popup.classList.remove('visible')}}
 let down=null;canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY}});canvas.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<7)choose(e);down=null});
 function resize(){const w=canvas.clientWidth||1,h=canvas.clientHeight||1;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();updatePopup()}const ro=new ResizeObserver(resize);ro.observe(canvas);resize();
 function animate(){requestAnimationFrame(animate);controls.update();renderer.render(scene,camera);if(popup.classList.contains('visible'))updatePopup()}animate();
 function setLayer(v){layer=v;surface.visible=v!=='bunker';sub.visible=v!=='surface';markers.visible=true;if(v==='surface'){camera.position.set(20,17,23);controls.target.set(0,5.4,0)}else if(v==='bunker'){camera.position.set(22,12,24);controls.target.set(0,-1.2,0)}else{camera.position.set(23,17,25);controls.target.set(0,.1,0)}controls.update();popup.classList.remove('visible')}
 return {setLayer,reset:()=>setLayer(layer),setLabels:v=>{labels=v;scan.visible=v;},dispose:()=>{ro.disconnect();renderer.dispose()}};
}
const infoMap={
 elysium:{name:'ELYSIUM',id:'CORE / 001',desc:content.facilities.elysium.description,items:content.facilities.elysium.items},
 sanctum:{name:'SANCTUM',id:'SECTOR / 002',desc:content.facilities.sanctum.description,items:content.facilities.sanctum.items},
 shelter:{name:'THE SHELTER',id:'SECTOR / 003',desc:content.facilities.shelter.description,items:content.facilities.shelter.items},
 shared:{name:'INFRAESTRUCTURA COMPARTIDA',id:'SYSTEM / 004',desc:content.facilities.shared.description,items:content.facilities.shared.items}
};
function showInfo(key,label,facility){const d=facility?{name:facility.name,id:facility.id,desc:facility.desc,items:[]}:(infoMap[key]||infoMap.shared);$('#infoId').textContent=d.id;$('#infoContent').innerHTML=`<div class="info-symbol">⌖</div><h2>${d.name}</h2><p>${d.desc}</p>${d.items.length?`<ul class="facility-list">${d.items.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}<div class="info-hint">${facility?'INSTALACIÓN SELECCIONADA · '+facility.sector:'DISTRIBUCIÓN CONCEPTUAL · CONSULTAR AUTORIZACIÓN DE ACCESO'}</div>`;}
let mainScene,homeScene;
try{mainScene=createScene($('#mainCanvas'));homeScene=createScene($('#homeCanvas'),true);$('#sceneLoading').classList.add('hidden');setTimeout(()=>$('#sceneLoading')?.remove(),700)}catch(e){console.error(e);$('#sceneLoading').textContent='NO SE PUDO INICIAR EL MOTOR 3D. VERIFICÁ LA CONEXIÓN.'}
$$('.layer-btn').forEach(b=>b.addEventListener('click',()=>{$$('.layer-btn').forEach(x=>x.classList.toggle('active',x===b));mainScene?.setLayer(b.dataset.layer);homeScene?.setLayer(b.dataset.layer)}));
$('#resetView').addEventListener('click',()=>{mainScene?.setLayer('both');homeScene?.setLayer('both');$$('.layer-btn').forEach(x=>x.classList.toggle('active',x.dataset.layer==='both'))});
$('#toggleLabels').addEventListener('click',e=>{e.currentTarget.classList.toggle('selected');const v=e.currentTarget.classList.contains('selected');mainScene?.setLabels(v);homeScene?.setLabels(v)});

$('#toggleLabels').addEventListener('click',e=>{e.currentTarget.classList.toggle('selected');const v=e.currentTarget.classList.contains('selected');mainScene?.setLabels(v);homeScene?.setLabels(v)});
