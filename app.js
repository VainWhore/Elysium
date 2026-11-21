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

// Expanded multi-level mountain bunker + woodland surface cutaway.
const scenes=[];
const facilityDescriptions={
 'Sala de consejo':'Espacio de deliberación y toma de decisiones administrativas.','Archivo general':'Conserva documentación institucional y registros generales.','Puesto de vigilancia':'Supervisa los accesos y las condiciones de seguridad del complejo.','Zona de aislamiento':'Área restringida para procedimientos de aislamiento y observación.','Red de comunicaciones':'Gestiona los enlaces internos y las comunicaciones autorizadas.','Sala de reuniones':'Espacio destinado a reuniones de coordinación.','Centro de mando':'Coordina operaciones de seguridad y seguimiento de amenazas.','Laboratorio':'Instalación destinada a investigación y análisis.','Centro médico':'Atención, evaluación, tratamiento y seguimiento sanitario.','Servidores':'Aloja la infraestructura informática independiente.','Taller tecnológico':'Reparación, adaptación y mantenimiento de equipos.','Archivo':'Almacena documentación técnica y registros del sector.','Comedor':'Área de alimentación para el personal del sector.','Dormitorios':'Alojamiento residencial para habitantes del sector.','Invernadero':'Producción interna de vegetales y cultivos.','Área de evaluación y entrenamiento psicológico':'Espacio de evaluación y entrenamiento psicológico.','Oficina de Neuroelect':'Oficina vinculada a las actividades de Neuroelect.','Plaza central':'Punto de encuentro y circulación comunitaria.','Mercado':'Área de intercambio y distribución de productos.','Comedor comunitario':'Prepara y distribuye las comidas de los residentes.','Taller':'Reparación y elaboración de objetos de uso cotidiano.','Enfermería':'Atención primaria y seguimiento de necesidades sanitarias.','Zona creativa':'Espacio para actividades artísticas y recreativas.','Almacén':'Resguarda provisiones y materiales de uso común.','Sala común':'Lugar de descanso y convivencia entre residentes.','Bar':'Establecimiento recreativo y punto de encuentro.','Generación y distribución eléctrica':'Produce y distribuye energía a las instalaciones.','Tratamiento y almacenamiento de agua':'Procesa y conserva el suministro de agua.','Ventilación y climatización':'Renueva el aire y regula el condiciones ambientales.','Gestión de residuos':'Clasifica y procesa los residuos del asentamiento.','Mantenimiento técnico':'Da soporte a los sistemas e instalaciones.','Almacenes de servicio':'Conserva repuestos y materiales técnicos.','Conexiones verticales y corredores':'Conectan los distintos niveles y áreas del complejo.'
};
function createScene(canvas,compact=false){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.setClearColor(0x061319,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
 const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x07151a,.014);
 const camera=new THREE.PerspectiveCamera(38,1,.1,360);camera.position.set(30,22,33);
 const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.075;controls.minDistance=9;controls.maxDistance=72;controls.maxPolarAngle=Math.PI*.485;controls.minPolarAngle=.12;controls.target.set(0,-1.8,0);controls.rotateSpeed=.48;controls.zoomSpeed=.72;controls.panSpeed=.58;controls.enablePan=true;
 scene.add(new THREE.HemisphereLight(0xb8e6e8,0x101b20,1.4));const key=new THREE.DirectionalLight(0xc4f6f2,2.15);key.position.set(15,28,14);scene.add(key);const rim=new THREE.PointLight(0x55d9e4,42,68);rim.position.set(-15,1,-13);scene.add(rim);const warm=new THREE.PointLight(0x9ab8a2,15,48);warm.position.set(14,-4,15);scene.add(warm);
 const world=new THREE.Group();scene.add(world);const surface=new THREE.Group(),sub=new THREE.Group(),markers=new THREE.Group();world.add(surface,sub,markers);
 const cyan=0x8de8e7;

 // Expanded mountain & forest terrain (lighter tree count for smooth FPS).
 const baseY=7.2;
 const terrainGeo=new THREE.PlaneGeometry(38,34,76,68);terrainGeo.rotateX(-Math.PI/2);const tp=terrainGeo.attributes.position;
 for(let i=0;i<tp.count;i++){
  const x=tp.getX(i),z=tp.getZ(i);
  const ridge=2.25*Math.exp(-((x+5.5)*(x+5.5)+((z+6.5)*(z+6.5)))/38)+1.45*Math.exp(-((x-7.5)*(x-7.5)+((z+4.0)*(z+4.0)))/46);
  const roll=.65*Math.sin(x*.18)*Math.cos(z*.16)+.25*Math.sin(z*.36+x*.12)+.12*Math.cos(x*.55-z*.24);
  tp.setY(i,ridge+roll);
 }
 terrainGeo.computeVertexNormals();
 const terrain=new THREE.Mesh(terrainGeo,new THREE.MeshStandardMaterial({color:0x354d3f,roughness:1,metalness:0,transparent:true,opacity:.93,side:THREE.DoubleSide}));
 terrain.position.y=baseY;surface.add(terrain);
 const earth=new THREE.Mesh(new THREE.CylinderGeometry(19.2,20.4,1.7,72,1),new THREE.MeshStandardMaterial({color:0x172928,roughness:1,transparent:true,opacity:.95}));
 earth.position.y=baseY-.85;surface.add(earth);

 // Shared lightweight tree geometry & materials so 145 trees render fast with zero lag.
 const barkMat=new THREE.MeshStandardMaterial({color:0x524838,roughness:1});
 const leafMats=[0x2a4e3e,0x375c46,0x43654c,0x2b493e].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:1}));
 const trunkGeo=new THREE.CylinderGeometry(.08,.15,1,6);
 const crownGeo=new THREE.IcosahedronGeometry(.82,1);
 let seed=8317;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 for(let i=0;i<145;i++){
  const a=rand()*Math.PI*2,r=6.8+rand()*11.2,x=Math.cos(a)*r,z=Math.sin(a)*r;
  if(Math.abs(x)<4.2&&Math.abs(z)<3.6)continue;
  const ridge=2.25*Math.exp(-((x+5.5)*(x+5.5)+((z+6.5)*(z+6.5)))/38)+1.45*Math.exp(-((x-7.5)*(x-7.5)+((z+4.0)*(z+4.0)))/46);
  const h=1.8+rand()*2.3,g=new THREE.Group();
  const trunk=new THREE.Mesh(trunkGeo,barkMat);trunk.scale.set(1,h*.5,1);trunk.position.y=h*.25;g.add(trunk);
  for(let j=0;j<2;j++){
   const c=new THREE.Mesh(crownGeo,leafMats[Math.floor(rand()*leafMats.length)]);
   const sc=.75+rand()*.4;
   c.scale.set(sc,sc*(1.12+rand()*.25),sc);
   c.position.set((rand()-.5)*.28,h*.52+j*.48,(rand()-.5)*.28);
   g.add(c);
  }
  g.position.set(x,baseY+ridge+.1,z);g.rotation.y=rand()*6.28;surface.add(g);
 }
 const clearing=new THREE.Mesh(new THREE.CircleGeometry(4.0,40),new THREE.MeshStandardMaterial({color:0x51634c,roughness:1,transparent:true,opacity:.55}));
 clearing.rotation.x=-Math.PI/2;clearing.position.set(0,baseY+.05,0);surface.add(clearing);

 // Deeper multi-level bunker (5 subterranean decks) + wider lateral wings & rock ribs.
 const deckYs=[3.4,1.05,-1.3,-3.65,-6.0];
 const deckWidths=[22,24,25,23,20];
 const deckDepths=[16,17.5,18,17,15];
 const deckGroups=[];
 const shell=new THREE.Mesh(new THREE.BoxGeometry(26.5,11.6,19.5),new THREE.MeshBasicMaterial({color:0x2b6269,transparent:true,opacity:.14,wireframe:true}));
 shell.position.set(0,-1.3,0);sub.add(shell);

 function box(parent,w,h,d,mat,x,y,z){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);parent.add(m);return m}
 function lineBox(parent,w,h,d,x,y,z,color=cyan,opacity=.66){const m=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w,h,d)),new THREE.LineBasicMaterial({color,transparent:true,opacity}));m.position.set(x,y,z);parent.add(m);return m}
 const floorMat=new THREE.MeshStandardMaterial({color:0x223a42,metalness:.62,roughness:.42,transparent:true,opacity:.92});
 const wallMat=new THREE.MeshStandardMaterial({color:0x2f464d,metalness:.5,roughness:.4,transparent:true,opacity:.88});
 const glassMat=new THREE.MeshPhysicalMaterial({color:0x4c9296,metalness:.28,roughness:.22,transparent:true,opacity:.16,transmission:.12});
 const beamGlowMat=new THREE.MeshBasicMaterial({color:cyan,transparent:true,opacity:.42});

 deckYs.forEach((y,idx)=>{
  const w=deckWidths[idx],d=deckDepths[idx],hw=w/2,hd=d/2;
  const deck=new THREE.Group();sub.add(deck);deckGroups.push(deck);
  box(deck,w,.2,d,floorMat,0,y,0);
  lineBox(deck,w,.2,d,0,y,0,idx===0?0x8eddd9:0x62b9c4,.78);
  const grid=new THREE.GridHelper(Math.max(w,d),28,0x4c9da4,0x254d56);
  grid.scale.set(w/Math.max(w,d),1,d/Math.max(w,d));
  grid.position.y=y+.11;grid.material.transparent=true;grid.material.opacity=.11;deck.add(grid);
  // Rear and side blast/retaining walls with stepped bays.
  box(deck,w,.85,.2,wallMat,0,y+.43,-hd+.1);
  box(deck,.2,.85,d,wallMat,-hw+.1,y+.43,0);
  box(deck,.2,.85,d,wallMat,hw-.1,y+.43,0);
  lineBox(deck,w,.85,.2,0,y+.43,-hd+.1);
  lineBox(deck,.2,.85,d,-hw+.1,y+.43,0);
  lineBox(deck,.2,.85,d,hw-.1,y+.43,0);
  for(let x=-hw+2.4;x<=hw-2.4;x+=4.2){
   box(deck,.12,1.15,.14,wallMat,x,y+.58,0);
   box(deck,.025,.78,.035,beamGlowMat,x+.09,y+.58,0);
  }
  const roof=box(deck,w-.3,.06,d-.3,glassMat,0,y+1.05,0);
  roof.material=roof.material.clone();roof.material.opacity=.06;
 });

 // Facility pods spread across 5 subterranean levels and wide lateral wings.
 const facilityRecords=[];
 const sectorSpecs=[
  {key:'elysium',name:'ELYSIUM',color:0x8bd9d2,items:content.facilities.elysium.items},
  {key:'sanctum',name:'SANCTUM',color:0x83dbe8,items:content.facilities.sanctum.items},
  {key:'shelter',name:'THE SHELTER',color:0xa3d8bd,items:content.facilities.shelter.items},
  {key:'shared',name:'INFRAESTRUCTURA COMPARTIDA',color:0x9bb7f0,items:content.facilities.shared.items}
 ];

 const placements=[
  // Deck 0 (Superior): ELYSIUM administración central + puestos de control
  {deck:0,sector:0,coords:[[-8.2,-4.6],[-3.6,-4.6],[1.2,-4.6],[6.2,-4.6],[-7.4,3.8],[-2.2,3.8]]},
  // Deck 1 (Nivel -1): SANCTUM núcleo de seguridad, mando, laboratorios y servidores
  {deck:1,sector:1,coords:[[-9.2,-5.2],[-4.6,-5.2],[0.0,-5.2],[4.8,-5.2],[9.4,-5.2],[-8.6,0.4],[-3.8,0.4],[1.4,0.4],[6.6,0.4],[-6.2,5.2],[2.8,5.2]]},
  // Deck 2 (Nivel -2): THE SHELTER vida comunitaria, residencia, plaza, mercado y recreación
  {deck:2,sector:2,coords:[[-9.6,-5.4],[-4.8,-5.4],[0.0,-5.4],[4.8,-5.4],[9.6,-5.4],[-8.8,0.2],[-3.8,0.2],[1.2,0.2],[6.2,0.2],[-6.4,5.4],[3.6,5.4]]},
  // Deck 3 & Deck 4 (Niveles profundos -3 y -4): INFRAESTRUCTURA COMPARTIDA y expansiones laterales
  {deck:3,sector:3,coords:[[-8.4,-4.5],[-2.8,-4.5],[2.8,-4.5],[8.4,-4.5]]},
  {deck:4,sector:3,coords:[[-6.2,-3.4],[0.0,-3.6],[6.2,-3.4]]}
 ];

 const podBaseGeo=new THREE.BoxGeometry(2.5,.12,1.95);
 const podDeskGeo=new THREE.BoxGeometry(.64,.26,.44);
 const podRackGeo=new THREE.BoxGeometry(.4,.38,.32);
 const deskMat=new THREE.MeshStandardMaterial({color:0x53676a,metalness:.5,roughness:.5});
 const rackMat=new THREE.MeshStandardMaterial({color:0x354e56,metalness:.55,roughness:.4});
 const orbGeo=new THREE.SphereGeometry(.105,14,10);
 const haloGeo=new THREE.TorusGeometry(.22,.012,6,28);
 const stemGeo=new THREE.CylinderGeometry(.008,.008,.23,6);

 function roomPod(deck,sector,item,idx,x,z,y){
  const w=2.5,d=1.95;
  const pod=new THREE.Group();deck.add(pod);pod.position.set(x,y,z);
  const base=new THREE.Mesh(podBaseGeo,floorMat);base.position.y=.08;pod.add(base);
  lineBox(pod,w,.12,d,0,.08,0,sector.color,.82);
  box(pod,w,.72,.1,wallMat,0,.47,-d/2);
  box(pod,.1,.72,d,wallMat,-w/2,.47,0);
  box(pod,.1,.72,d,wallMat,w/2,.47,0);
  box(pod,.76,.72,.1,wallMat,-.86,.47,d/2);
  box(pod,.76,.72,.1,wallMat,.86,.47,d/2);
  const inner=new THREE.Mesh(new THREE.BoxGeometry(w-.28,.04,d-.28),new THREE.MeshBasicMaterial({color:sector.color,transparent:true,opacity:.09}));
  inner.position.y=.16;pod.add(inner);
  const desk=new THREE.Mesh(podDeskGeo,deskMat);desk.position.set(-.44,.27,-.18);pod.add(desk);
  const rack=new THREE.Mesh(podRackGeo,rackMat);rack.position.set(.54,.32,-.26);pod.add(rack);
  const beacon=new THREE.Group();pod.add(beacon);beacon.position.set(0,1.12,0);
  const orb=new THREE.Mesh(orbGeo,new THREE.MeshBasicMaterial({color:sector.color}));beacon.add(orb);
  const halo=new THREE.Mesh(haloGeo,new THREE.MeshBasicMaterial({color:sector.color,transparent:true,opacity:.88}));halo.rotation.x=Math.PI/2;beacon.add(halo);
  const stem=new THREE.Mesh(stemGeo,new THREE.MeshBasicMaterial({color:sector.color,transparent:true,opacity:.65}));stem.position.y=-.16;beacon.add(stem);
  const data={key:sector.key,sector:sector.name,name:item,desc:facilityDescriptions[item]||'Instalación interna de Elysium.',id:`${sector.key.toUpperCase()} / ${(idx+1).toString().padStart(2,'0')}`,color:sector.color};
  beacon.userData={facility:data};orb.userData={facility:data};halo.userData={facility:data};
  facilityRecords.push({beacon,data});return pod;
 }

 placements.forEach(pl=>{
  const sector=sectorSpecs[pl.sector],items=sector.items,deck=deckGroups[pl.deck];
  items.forEach((item,i)=>{
   const c=pl.coords[i]||[((i%5)-2)*3.8,((Math.floor(i/5))-1)*4.2];
   roomPod(deck,sector,item,i,c[0],c[1],.11);
  });
 });

 // Expanded lateral corridors, galleries, and cross-corridors on every deck.
 const tubeMat=new THREE.MeshStandardMaterial({color:0x426c72,metalness:.55,roughness:.38,transparent:true,opacity:.54});
 const lightMat=new THREE.MeshBasicMaterial({color:cyan,transparent:true,opacity:.76});
 function corridor(deck,pts,y,width=.22){
  const curve=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],y,p[1])));
  deck.add(new THREE.Mesh(new THREE.TubeGeometry(curve,44,width,7,false),tubeMat));
  deck.add(new THREE.Mesh(new THREE.TubeGeometry(curve,44,.018,5,false),lightMat));
 }
 deckGroups.forEach((d,i)=>{
  const y=deckYs[i]+.22,hw=deckWidths[i]/2-1.2,hd=deckDepths[i]/2-1.6;
  corridor(d,[[-hw,-hd],[-hw*.5,-hd],[0,-hd],[hw*.5,-hd],[hw,-hd]],y,.22);
  corridor(d,[[-hw,0],[-hw*.5,0],[0,0],[hw*.5,0],[hw,0]],y,.2);
  corridor(d,[[-hw*.85,hd],[0,hd],[hw*.85,hd]],y,.18);
  corridor(d,[[-hw*.75,-hd],[-hw*.75,0],[-hw*.75,hd]],y,.18);
  corridor(d,[[0,-hd],[0,-hd*.4],[0,0],[0,hd*.5],[0,hd]],y,.18);
  corridor(d,[[hw*.75,-hd],[hw*.75,0],[hw*.75,hd]],y,.18);
 });

 // Vertical elevator cores & ventilation shafts spanning all 5 decks up to the surface layer.
 const shaftMat=new THREE.MeshPhysicalMaterial({color:0x69cbd1,metalness:.45,roughness:.18,transparent:true,opacity:.18,transmission:.2});
 const coreWireMat=new THREE.MeshBasicMaterial({color:cyan,wireframe:true,transparent:true,opacity:.35});
 [[-8.5,-5.2],[0,0],[8.5,5.2],[-7.2,4.8],[7.2,-4.6]].forEach(p=>{
  const shaft=new THREE.Group();sub.add(shaft);
  const h=12.8,cy=-.2;
  shaft.add(new THREE.Mesh(new THREE.BoxGeometry(.78,h,.78),shaftMat)).position.y=cy;
  lineBox(shaft,.8,h,.8,0,cy,0,cyan,.68);
  shaft.add(new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,h*.55,10),coreWireMat)).position.y=cy;
  shaft.position.set(p[0],0,p[1]);
 });

 // Concealed surface hatches aligned with vertical shafts.
 const accessPts=[[-10.5,-6.2],[9.8,7.6],[11.5,-7.5],[-11.0,6.8]];
 accessPts.forEach((p,i)=>{
  const hatch=new THREE.Mesh(new THREE.CylinderGeometry(.4,.45,.11,20),new THREE.MeshStandardMaterial({color:0x53665b,metalness:.55,roughness:.48}));
  hatch.position.set(p[0],baseY+.22,p[1]);surface.add(hatch);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.48,.018,6,36),new THREE.MeshBasicMaterial({color:cyan,transparent:true,opacity:.82}));
  ring.rotation.x=Math.PI/2;ring.position.set(p[0],baseY+.29,p[1]);ring.userData={access:i};surface.add(ring);
  const vShaft=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,4.2,10,1,true),coreWireMat);
  vShaft.position.set(p[0],baseY-1.9,p[1]);sub.add(vShaft);
 });

 // Perimeter HUD rings.
 const scan=new THREE.Group();world.add(scan);
 for(let i=0;i<5;i++){
  const ring=new THREE.Mesh(new THREE.TorusGeometry(15.2+i*.65,.012,4,120),new THREE.MeshBasicMaterial({color:cyan,transparent:true,opacity:.13-i*.015}));
  ring.rotation.x=Math.PI/2;ring.position.y=baseY-.35-i*.04;scan.add(ring);
 }

 const frame=canvas.closest('.scene-frame');let popup=frame.querySelector('.facility-popup');
 if(!popup){popup=document.createElement('div');popup.className='facility-popup';popup.innerHTML='<button class="popup-close" aria-label="Cerrar">×</button><span class="popup-kicker">INSTALLATION / SELECTED</span><small class="popup-id"></small><h3></h3><p></p><span class="popup-sector"></span>';frame.append(popup);popup.querySelector('.popup-close').addEventListener('click',()=>popup.classList.remove('visible'))}
 const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let layer='both',labels=true,selected=null;
 function updatePopup(){if(!selected)return;const v=selected.beacon.getWorldPosition(new THREE.Vector3()).project(camera);if(v.z>1){popup.classList.remove('visible');return}const rect=canvas.getBoundingClientRect(),x=(v.x*.5+.5)*rect.width,y=(-v.y*.5+.5)*rect.height;popup.style.left=`${Math.max(14,Math.min(rect.width-260,x+15))}px`;popup.style.top=`${Math.max(48,Math.min(rect.height-160,y-20))}px`;}
 function selectFacility(data,beacon){selected={data,beacon};popup.querySelector('.popup-id').textContent=data.id;popup.querySelector('h3').textContent=data.name;popup.querySelector('p').textContent=data.desc;popup.querySelector('.popup-sector').textContent=data.sector+'  /  ELYSIUM';popup.classList.add('visible');updatePopup();if(typeof showInfo==='function')showInfo(data.key,data.name,data)}
 function choose(ev){const rect=canvas.getBoundingClientRect();pointer.x=((ev.clientX-rect.left)/rect.width)*2-1;pointer.y=-((ev.clientY-rect.top)/rect.height)*2+1;raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(world.children,true);const hit=hits.find(h=>h.object.userData?.facility);if(hit){const data=hit.object.userData.facility;const rec=facilityRecords.find(r=>r.data===data)||facilityRecords.find(r=>r.data.name===data.name);selectFacility(data,rec?.beacon||hit.object.parent)}else{popup.classList.remove('visible')}}
 let down=null;canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY}});canvas.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<7)choose(e);down=null});
 function resize(){const w=canvas.clientWidth||1,h=canvas.clientHeight||1;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();updatePopup()}const ro=new ResizeObserver(resize);ro.observe(canvas);resize();
 let rafId=0;
 function animate(){rafId=requestAnimationFrame(animate);controls.update();renderer.render(scene,camera);if(popup.classList.contains('visible'))updatePopup()}animate();
 function setLayer(v){layer=v;surface.visible=v!=='bunker';sub.visible=v!=='surface';markers.visible=true;if(v==='surface'){camera.position.set(25,21,28);controls.target.set(0,baseY,0)}else if(v==='bunker'){camera.position.set(28,13,31);controls.target.set(0,-1.6,0)}else{camera.position.set(30,22,33);controls.target.set(0,-1.8,0)}controls.update();popup.classList.remove('visible')}
 return {setLayer,reset:()=>setLayer(layer),setLabels:v=>{labels=v;scan.visible=v;},dispose:()=>{cancelAnimationFrame(rafId);ro.disconnect();renderer.dispose()}};
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
