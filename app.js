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

// Organic mountain-excavated subterranean bunker complex (Mount Weather inspired)
const facilityDescriptions={
 'Sala de consejo':'Espacio de deliberación y toma de decisiones administrativas.','Archivo general':'Conserva documentación institucional y registros generales.','Puesto de vigilancia':'Supervisa los accesos y las condiciones de seguridad del complejo.','Zona de aislamiento':'Área restringida para procedimientos de aislamiento y observación.','Red de comunicaciones':'Gestiona los enlaces internos y las comunicaciones autorizadas.','Sala de reuniones':'Espacio destinado a reuniones de coordinación.','Centro de mando':'Coordina operaciones de seguridad y seguimiento de amenazas.','Laboratorio':'Instalación destinada a investigación y análisis.','Centro médico':'Atención, evaluación, tratamiento y seguimiento sanitario.','Servidores':'Aloja la infraestructura informática independiente.','Taller tecnológico':'Reparación, adaptación y mantenimiento de equipos.','Archivo':'Almacena documentación técnica y registros del sector.','Comedor':'Área de alimentación para el personal del sector.','Dormitorios':'Alojamiento residencial para habitantes del sector.','Invernadero':'Producción interna de vegetales y cultivos.','Área de evaluación y entrenamiento psicológico':'Espacio de evaluación y entrenamiento psicológico.','Oficina de Neuroelect':'Oficina vinculada a las actividades de Neuroelect.','Plaza central':'Punto de encuentro y circulación comunitaria.','Mercado':'Área de intercambio y distribución de productos.','Comedor comunitario':'Prepara y distribuye las comidas de los residentes.','Taller':'Reparación y elaboración de objetos de uso cotidiano.','Enfermería':'Atención primaria y seguimiento de necesidades sanitarias.','Zona creativa':'Espacio para actividades artísticas y recreativas.','Almacén':'Resguarda provisiones y materiales de uso común.','Sala común':'Lugar de descanso y convivencia entre residentes.','Bar':'Establecimiento recreativo y punto de encuentro.','Generación y distribución eléctrica':'Produce y distribuye energía a las instalaciones.','Tratamiento y almacenamiento de agua':'Procesa y conserva el suministro de agua.','Ventilación y climatización':'Renueva el aire y regula las condiciones ambientales.','Gestión de residuos':'Clasifica y procesa los residuos del asentamiento.','Mantenimiento técnico':'Da soporte a los sistemas e instalaciones.','Almacenes de servicio':'Conserva repuestos y materiales técnicos.','Conexiones verticales y corredores':'Conectan los distintos niveles y áreas del complejo.'
};

function createScene(canvas,compact=false){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));
 renderer.setClearColor(0x061319,0);
 renderer.outputColorSpace=THREE.SRGBColorSpace;

 const scene=new THREE.Scene();
 scene.fog=new THREE.FogExp2(0x061217,.012);

 const camera=new THREE.PerspectiveCamera(38,1,.1,400);
 camera.position.set(34,24,36);

 const controls=new OrbitControls(camera,canvas);
 controls.enableDamping=true;
 controls.dampingFactor=.075;
 controls.minDistance=10;
 controls.maxDistance=78;
 controls.maxPolarAngle=Math.PI*.485;
 controls.minPolarAngle=.12;
 controls.target.set(0,-1.2,0);
 controls.rotateSpeed=.48;
 controls.zoomSpeed=.72;
 controls.panSpeed=.58;
 controls.enablePan=true;

 scene.add(new THREE.HemisphereLight(0xb8e6e8,0x0f1a20,1.45));
 const key=new THREE.DirectionalLight(0xc4f6f2,2.2);
 key.position.set(16,30,14);
 scene.add(key);
 const rim=new THREE.PointLight(0x55d9e4,45,75);
 rim.position.set(-16,0,-14);
 scene.add(rim);
 const warm=new THREE.PointLight(0x8bb9a6,18,52);
 warm.position.set(15,-5,15);
 scene.add(warm);

 const world=new THREE.Group();
 scene.add(world);
 const surface=new THREE.Group(), sub=new THREE.Group(), markers=new THREE.Group();
 world.add(surface,sub,markers);

 const cyan=0x8de8e7, deepTeal=0x162d34;
 let seed=8317;
 const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};

 // 1. REALISTIC MOUNTAIN MASSIF & WOODED SURFACE (NO FLAT BOXES)
 const baseY=8.2;
 const surfW=42, surfD=36;
 const terrainGeo=new THREE.PlaneGeometry(surfW,surfD,84,72);
 terrainGeo.rotateX(-Math.PI/2);
 const tp=terrainGeo.attributes.position;

 function mountainHeight(x,z){
  // Main central-rear mountain ridge (Mount Weather style) + secondary crags + valley trail
  const p1=4.4*Math.exp(-((x+4.5)*(x+4.5)+(z+7.5)*(z+7.5))/42);
  const p2=3.1*Math.exp(-((x-7.2)*(x-7.2)+(z+5.5)*(z+5.5))/36);
  const p3=2.0*Math.exp(-((x+11.5)*(x+11.5)+(z-2.0)*(z-2.0))/32);
  const valley=-1.1*Math.exp(-((x-2.0)*(x-2.0)+(z-6.5)*(z-6.5))/28);
  const crag=.55*Math.sin(x*.24)*Math.cos(z*.21)+.28*Math.sin(z*.48+x*.19)+.14*Math.cos(x*.75-z*.35);
  return Math.max(-.4, p1+p2+p3+valley+crag);
 }

 for(let i=0;i<tp.count;i++){
  const x=tp.getX(i), z=tp.getZ(i);
  tp.setY(i, mountainHeight(x,z));
 }
 terrainGeo.computeVertexNormals();

 const terrainMat=new THREE.MeshStandardMaterial({
  color:0x364f40,roughness:.96,metalness:.04,transparent:true,opacity:.94,side:THREE.DoubleSide
 });
 const terrain=new THREE.Mesh(terrainGeo,terrainMat);
 terrain.position.y=baseY;
 surface.add(terrain);

 // Topographic contour rings hugging the mountain slopes
 const contourGroup=new THREE.Group();
 [1.1,2.2,3.3].forEach((hLevel,idx)=>{
  const pts=[];
  for(let a=0;a<=96;a++){
   const ang=(a/96)*Math.PI*2;
   const rx=15.5-idx*2.6+Math.sin(ang*3)*1.1;
   const rz=12.5-idx*2.1+Math.cos(ang*2)*0.9;
   const x=Math.cos(ang)*rx-1.5;
   const z=Math.sin(ang)*rz-3.5;
   pts.push(new THREE.Vector3(x, baseY+mountainHeight(x,z)+.08, z));
  }
  const cGeo=new THREE.BufferGeometry().setFromPoints(pts);
  contourGroup.add(new THREE.Line(cGeo,new THREE.LineBasicMaterial({color:cyan,transparent:true,opacity:.22})));
 });
 surface.add(contourGroup);

 // Geological cutaway crust beneath the mountain surface (organic beveled stratum, not a cylinder)
 const crustPts=[
  new THREE.Vector2(-21,-9.5),new THREE.Vector2(-22.5,-2.5),new THREE.Vector2(-21,5.5),
  new THREE.Vector2(-15,8.2),new THREE.Vector2(15,8.2),new THREE.Vector2(21,5.5),
  new THREE.Vector2(22.5,-2.5),new THREE.Vector2(21,-9.5)
 ];
 const rockWallMat=new THREE.MeshBasicMaterial({color:0x3f8b92,wireframe:true,transparent:true,opacity:.09});
 const stratumCage=new THREE.Mesh(new THREE.BoxGeometry(42,17.5,36,8,4,7),rockWallMat);
 stratumCage.position.set(0,-.5,0);
 sub.add(stratumCage);

 // Blast-door mountain portal carved into the lower mountain face
 const portalGroup=new THREE.Group();
 const px=2.2, pz=6.8, py=baseY+mountainHeight(px,pz);
 portalGroup.position.set(px,py+.25,pz);
 portalGroup.rotation.y=-.22;
 const portalArch=new THREE.Mesh(new THREE.CylinderGeometry(.85,.95,1.8,16,1,false,0,Math.PI),new THREE.MeshStandardMaterial({color:0x2b3e42,metalness:.6,roughness:.45}));
 portalArch.rotation.z=Math.PI/2;
 portalArch.rotation.y=Math.PI/2;
 portalGroup.add(portalArch);
 const portalRim=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.75,1.1,1.85)),new THREE.LineBasicMaterial({color:cyan,transparent:true,opacity:.85}));
 portalRim.position.y=.25;
 portalGroup.add(portalRim);
 const portalGlow=new THREE.Mesh(new THREE.PlaneGeometry(1.2,.75),new THREE.MeshBasicMaterial({color:cyan,transparent:true,opacity:.45,side:THREE.DoubleSide}));
 portalGlow.position.set(0,.28,.93);
 portalGroup.add(portalGlow);
 surface.add(portalGroup);

 // Lightweight pine/conifer forest cluster (optimized shared geometries -> zero lag)
 const barkMat=new THREE.MeshStandardMaterial({color:0x4f4536,roughness:1});
 const pineMats=[0x254738,0x315641,0x3d6048,0x274337].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.95}));
 const trunkGeo=new THREE.CylinderGeometry(.06,.13,1,5);
 const coneGeo=new THREE.ConeGeometry(.75,1.55,6);

 for(let i=0;i<130;i++){
  const x=(rand()-.5)*37;
  const z=(rand()-.5)*31;
  // Keep portal clearing & steep rocky peak clear
  if(Math.hypot(x-px,z-pz)<3.4)continue;
  const mh=mountainHeight(x,z);
  if(mh>3.4)continue; // rocky alpine peak above treeline
  const scale=.85+rand()*.75;
  const tree=new THREE.Group();
  const tr=new THREE.Mesh(trunkGeo,barkMat);
  tr.scale.set(1,1.1*scale,1);
  tr.position.y=.55*scale;
  tree.add(tr);
  for(let tier=0;tier<2;tier++){
   const cn=new THREE.Mesh(coneGeo,pineMats[Math.floor(rand()*pineMats.length)]);
   const s=scale*(1-tier*.26);
   cn.scale.set(s,s,s);
   cn.position.y=(1.15+tier*.68)*scale;
   tree.add(cn);
  }
  tree.position.set(x,baseY+mh-.05,z);
  tree.rotation.y=rand()*6.28;
  surface.add(tree);
 }

 // 2. ORGANIC EXCAVATED SUBTERRANEAN CAVERN COMPLEX (NOT STACKED RECTANGLES!)
 // Instead of 5 identical square slabs, each subterranean level has irregular, organic polygonal
 // rock-cut wings, lateral galleries, blast-lock chambers, and staggered expansion bays built over time.
 const slabMat=new THREE.MeshStandardMaterial({color:0x1b323a,metalness:.55,roughness:.48,transparent:true,opacity:.92});
 const rockRimMat=new THREE.MeshStandardMaterial({color:0x284149,metalness:.45,roughness:.55,transparent:true,opacity:.85});
 const innerWallMat=new THREE.MeshStandardMaterial({color:0x324d55,metalness:.5,roughness:.42,transparent:true,opacity:.88});

 // Helper to extrude an organic polygonal subterranean wing with holographic edge wireframe
 function createOrganicWing(pts2D, yPos, thickness=.24, edgeColor=cyan, edgeOpacity=.78){
  const shape=new THREE.Shape();
  shape.moveTo(pts2D[0][0], pts2D[0][1]);
  for(let i=1;i<pts2D.length;i++) shape.lineTo(pts2D[i][0], pts2D[i][1]);
  shape.closePath();

  const geo=new THREE.ExtrudeGeometry(shape,{depth:thickness,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.12,bevelThickness:.05});
  geo.rotateX(Math.PI/2);
  const mesh=new THREE.Mesh(geo,slabMat);
  mesh.position.y=yPos;

  const edges=new THREE.LineSegments(new THREE.EdgesGeometry(geo,24),new THREE.LineBasicMaterial({color:edgeColor,transparent:true,opacity:edgeOpacity}));
  edges.position.y=yPos;

  const grp=new THREE.Group();
  grp.add(mesh,edges);
  sub.add(grp);
  return grp;
 }

 // Level 0 (Y = 3.8): Upper Command & Intake Wing (ELYSIUM Admin + Entry Airlock Tunnel)
 createOrganicWing([
  [-11,-7],[-3,-8.5],[5,-7.5],[11,-4.5],[12,1.5],[7,5.5],[-1,6.2],[-9,4.5],[-13,-1]
 ], 3.8, .22, 0x95ebe5, .82);
 // Lateral North-East Comm Annex on Level 0
 createOrganicWing([
  [10,-6],[16.5,-7.5],[18.5,-3],[15.5,1.5],[10.5,0]
 ], 3.65, .2, 0x8bd9d2, .7);

 // Level -1 (Y = 0.8): SANCTUM Tactical, Labs & Server Vaults (Asymmetric sprawling L-cavern + West Lab Wing)
 createOrganicWing([
  [-14.5,-8.5],[-5,-9.5],[6,-8.8],[14,-6],[15.5,2],[11,7.5],[2,8.2],[-6,6.5],[-13.5,7.2],[-16.5,1]
 ], 0.8, .24, 0x7fdbe8, .8);
 // West Excavated Bio-Lab Cavern (carved deeper into the mountain)
 createOrganicWing([
  [-15,-4],[-21.5,-5.5],[-23,0.5],[-20.5,6],[-14.5,4.5]
 ], 0.65, .2, 0x7fdbe8, .68);

 // Level -2 (Y = -2.3): THE SHELTER Habitat Cavern (Broad central dome-plaza + East Residential & Hydroponic Wings)
 createOrganicWing([
  [-15,-7.5],[-6,-9.2],[5,-9],[14.5,-7.2],[17.5,-1],[15,7.5],[6,9.5],[-5,9],[-14.5,6.8],[-16.5,-0.5]
 ], -2.3, .25, 0xa3d8bd, .8);
 // East Excavated Hydroponics & Rec Wing
 createOrganicWing([
  [14.5,-4.5],[21.5,-5.8],[23.5,0.5],[21,6.5],[14.5,5]
 ], -2.45, .2, 0xa3d8bd, .68);

 // Level -3 (Y = -5.4): Deep Core Engineering & Geothermal/Water Vaults (Irregular cross-vaults)
 createOrganicWing([
  [-12.5,-6.5],[-3,-8],[8,-7.2],[13,-2.5],[11.5,5.5],[3,7.2],[-7,6.5],[-13,1.5]
 ], -5.4, .24, 0x8cb2eb, .75);

 // Level -4 (Y = -8.2): Deepest Aquifer & Backup Reactor Chamber
 createOrganicWing([
  [-8.5,-4.8],[0,-6.2],[9,-4.5],[10.5,2.2],[4,5.5],[-6,4.8],[-9.5,-0.5]
 ], -8.2, .22, 0x7ba4e3, .72);

 // 3. CURVED TUNNELS, BLAST CORRIDORS & INCLINED ACCESS RAMPS
 const tunnelMat=new THREE.MeshStandardMaterial({color:0x365c63,metalness:.58,roughness:.38,transparent:true,opacity:.52});
 const pulseLineMat=new THREE.MeshBasicMaterial({color:cyan,transparent:true,opacity:.8});

 function buildTunnel(pts, radius=.24){
  const curve=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],p[1],p[2])));
  const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,48,radius,8,false),tunnelMat);
  const rail=new THREE.Mesh(new THREE.TubeGeometry(curve,48,.02,5,false),pulseLineMat);
  sub.add(tube,rail);
  // Structural rib rings along tunnel
  [0.2,0.5,0.8].forEach(t=>{
   const pos=curve.getPoint(t);
   const tan=curve.getTangent(t);
   const rib=new THREE.Mesh(new THREE.TorusGeometry(radius*1.12,.022,6,16),pulseLineMat);
   rib.position.copy(pos);
   rib.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),tan);
   sub.add(rib);
  });
 }

 // Inclined entry tunnel from the mountain blast portal down into Level 0 Intake!
 buildTunnel([[px,py+.15,pz],[2.0,6.2,3.5],[1.2,4.8,0.5],[0,4.05,-2.5]], .36);
 // Sloped vehicle/cargo ramp connecting Level 0 -> Level -1 -> Level -2
 buildTunnel([[-10.5,4.0,-3.5],[-12.8,2.4,-2.0],[-11.5,1.0,1.5]], .28);
 buildTunnel([[11.5,1.0,-2.0],[13.5,-0.6,0.5],[11.5,-2.1,3.2]], .28);
 // Lateral wing connector tunnels
 buildTunnel([[10.2,3.95,-3.2],[14.2,3.85,-3.2]], .26);
 buildTunnel([[-13.5,0.95,0.2],[-18.2,0.85,0.2]], .26);
 buildTunnel([[14.2,-2.15,0.4],[18.8,-2.25,0.4]], .26);
 // Internal organic curved arteries on each floor
 buildTunnel([[-9.5,4.02,-4.5],[-3.0,4.02,-5.5],[4.5,4.02,-4.8],[9.5,4.02,-1.5]], .19);
 buildTunnel([[-12.5,1.02,-5.5],[-4.0,1.02,-6.2],[5.5,1.02,-5.5],[12.5,1.02,0.5]], .21);
 buildTunnel([[-11.5,1.02,3.5],[-2.5,1.02,4.2],[7.5,1.02,3.8]], .18);
 buildTunnel([[-12.5,-2.08,-5.2],[-2.0,-2.08,-6.0],[8.5,-2.08,-4.8],[13.2,-2.08,2.5]], .21);
 buildTunnel([[-11.5,-2.08,4.0],[0,-2.08,5.2],[10.5,-2.08,4.2]], .19);
 buildTunnel([[-9.5,-5.18,-3.5],[0,-5.18,-4.5],[9.5,-5.18,-1.5]], .19);
 buildTunnel([[-6.5,-7.98,-2.0],[0,-7.98,-2.8],[7.5,-7.98,-1.0]], .18);

 // 4. CENTRAL & SECONDARY VERTICAL ELEVATOR SHAFTS + EXHAUST VENTILATION CHIMNEYS
 const shaftGlass=new THREE.MeshPhysicalMaterial({color:0x69cbd1,metalness:.45,roughness:.18,transparent:true,opacity:.18,transmission:.2});
 const shaftWire=new THREE.MeshBasicMaterial({color:cyan,wireframe:true,transparent:true,opacity:.36});

 // Main Central High-Speed Elevator Core (Mount Weather style central shaft)
 const mainShaft=new THREE.Group();
 const mhTotal=15.8, mhCenter=-0.4;
 const mainOuter=new THREE.Mesh(new THREE.CylinderGeometry(.92,.92,mhTotal,16,1,true),shaftGlass);
 mainOuter.position.y=mhCenter;
 mainShaft.add(mainOuter);
 const mainInner=new THREE.Mesh(new THREE.CylinderGeometry(.32,.32,mhTotal,10),shaftWire);
 mainInner.position.y=mhCenter;
 mainShaft.add(mainInner);
 // Elevator ring collars at each deck height
 [3.9, 0.9, -2.2, -5.3, -8.1].forEach(ry=>{
  const collar=new THREE.Mesh(new THREE.TorusGeometry(.96,.035,8,24),pulseLineMat);
  collar.rotation.x=Math.PI/2;
  collar.position.y=ry;
  mainShaft.add(collar);
 });
 sub.add(mainShaft);

 // Secondary Elevator & Ventilation Shafts reaching the mountain ridge
 [
  {x:-8.8, z:-4.2, top:baseY+mountainHeight(-8.8,-4.2), bot:-5.4, r:.42},
  {x:8.6,  z:3.6,  top:baseY+mountainHeight(8.6,3.6),   bot:-5.4, r:.42},
  {x:-5.2, z:4.5,  top:3.9, bot:-8.2, r:.36},
  {x:6.4,  z:-4.8, top:3.9, bot:-8.2, r:.36}
 ].forEach(s=>{
  const h=s.top-s.bot, cy=(s.top+s.bot)/2;
  const tube=new THREE.Mesh(new THREE.CylinderGeometry(s.r,s.r,h,12,1,true),shaftGlass);
  tube.position.set(s.x,cy,s.z);
  const core=new THREE.Mesh(new THREE.CylinderGeometry(s.r*.32,s.r*.32,h,8),shaftWire);
  core.position.set(s.x,cy,s.z);
  sub.add(tube,core);
  if(s.top>baseY-1){
   // Concealed mountain exhaust vent cap
   const cap=new THREE.Mesh(new THREE.CylinderGeometry(s.r*1.2,s.r*1.35,.22,14),new THREE.MeshStandardMaterial({color:0x4b5e54,metalness:.55,roughness:.5}));
   cap.position.set(s.x,s.top+.1,s.z);
   const ring=new THREE.Mesh(new THREE.TorusGeometry(s.r*1.3,.018,6,24),pulseLineMat);
   ring.rotation.x=Math.PI/2;
   ring.position.set(s.x,s.top+.22,s.z);
   surface.add(cap,ring);
  }
 });

 // 5. ARCHITECTURAL CHAMBERS & INTERACTIVE FACILITY PODS (VARIED SHAPES: OCTAGONAL HUBS, BAYS, DOMES)
 const facilityRecords=[];
 const sectorSpecs=[
  {key:'elysium',name:'ELYSIUM',color:0x8bd9d2,items:content.facilities.elysium.items},
  {key:'sanctum',name:'SANCTUM',color:0x83dbe8,items:content.facilities.sanctum.items},
  {key:'shelter',name:'THE SHELTER',color:0xa3d8bd,items:content.facilities.shelter.items},
  {key:'shared',name:'INFRAESTRUCTURA COMPARTIDA',color:0x9bb7f0,items:content.facilities.shared.items}
 ];

 // Carefully spaced organic coordinates across all 5 subterranean levels & lateral wings
 const placements=[
  // Deck 0 (Y=3.8): ELYSIUM Administration & Intake
  {y:3.8, sector:0, coords:[
   [-7.5,-4.2,'hub'], [-2.2,-5.2,'bay'], [4.2,-4.6,'bay'],
   [14.2,-3.2,'hub'], [-7.8,2.2,'bay'], [-1.8,3.2,'bay']
  ]},
  // Deck 1 (Y=0.8): SANCTUM Security, Command, Labs & Neuroelect
  {y:0.8, sector:1, coords:[
   [-10.2,-5.5,'hub'], [-4.5,-6.2,'bay'], [1.5,-6.0,'bay'], [7.8,-5.2,'hub'],
   [-19.2,-1.2,'hub'], [-18.5,3.2,'bay'], [-9.5,3.5,'bay'], [-3.2,4.0,'bay'],
   [3.5,4.2,'bay'], [9.8,3.5,'hub'], [11.5,-1.5,'bay']
  ]},
  // Deck 2 (Y=-2.3): THE SHELTER Community Plaza, Market, Habitat & Bar
  {y:-2.3, sector:2, coords:[
   [-10.5,-5.0,'hub'], [-4.8,-5.8,'bay'], [1.2,-5.8,'bay'], [7.5,-5.0,'hub'],
   [19.2,-1.2,'hub'], [18.8,3.2,'bay'], [-9.8,3.8,'bay'], [-3.5,4.6,'hub'],
   [3.2,4.8,'bay'], [9.5,3.8,'bay'], [11.8,-0.8,'bay']
  ]},
  // Deck 3 (Y=-5.4): INFRAESTRUCTURA COMPARTIDA (Power, Water, HVAC, Waste)
  {y:-5.4, sector:3, coords:[
   [-8.5,-3.6,'hub'], [-2.2,-4.4,'bay'], [4.5,-4.0,'bay'], [8.8,1.5,'hub']
  ]},
  // Deck 4 (Y=-8.2): INFRAESTRUCTURA COMPARTIDA (Maintenance, Service Vaults, Vertical Corridors)
  {y:-8.2, sector:3, coords:[
   [-5.8,-1.8,'hub'], [0.8,-2.6,'bay'], [6.5,1.2,'hub']
  ]}
 ];

 const orbGeo=new THREE.SphereGeometry(.12,14,10);
 const haloGeo=new THREE.TorusGeometry(.25,.014,6,28);
 const stemGeo=new THREE.CylinderGeometry(.01,.01,.26,6);

 function buildChamber(sector, item, idx, x, z, y, shapeType){
  const pod=new THREE.Group();
  pod.position.set(x,y+.05,z);
  sub.add(pod);

  if(shapeType==='hub'){
   // Octagonal command/plaza chamber
   const r=1.55;
   const base=new THREE.Mesh(new THREE.CylinderGeometry(r,r*1.04,.14,8),slabMat);
   base.position.y=.07;
   pod.add(base);
   const ring=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.CylinderGeometry(r,r,.78,8,1,true)),new THREE.LineBasicMaterial({color:sector.color,transparent:true,opacity:.78}));
   ring.position.y=.46;
   pod.add(ring);
   const core=new THREE.Mesh(new THREE.CylinderGeometry(.42,.48,.34,8),innerWallMat);
   core.position.y=.28;
   pod.add(core);
  } else {
   // Chamfered architectural bay with recessed bulkhead walls
   const w=2.55, d=1.95;
   const base=new THREE.Mesh(new THREE.BoxGeometry(w,.12,d),slabMat);
   base.position.y=.06;
   pod.add(base);
   const edges=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w,.12,d)),new THREE.LineBasicMaterial({color:sector.color,transparent:true,opacity:.82}));
   edges.position.y=.06;
   pod.add(edges);

   const back=new THREE.Mesh(new THREE.BoxGeometry(w,.7,.1),innerWallMat);
   back.position.set(0,.44,-d/2);
   const left=new THREE.Mesh(new THREE.BoxGeometry(.1,.7,d),innerWallMat);
   left.position.set(-w/2,.44,0);
   const right=new THREE.Mesh(new THREE.BoxGeometry(.1,.7,d),innerWallMat);
   right.position.set(w/2,.44,0);
   pod.add(back,left,right);

   const consoleBox=new THREE.Mesh(new THREE.BoxGeometry(.75,.28,.42),rockRimMat);
   consoleBox.position.set(-.35,.26,-.22);
   pod.add(consoleBox);
  }

  // Interactive holographic beacon
  const beacon=new THREE.Group();
  beacon.position.set(0,1.15,0);
  pod.add(beacon);

  const orb=new THREE.Mesh(orbGeo,new THREE.MeshBasicMaterial({color:sector.color}));
  const halo=new THREE.Mesh(haloGeo,new THREE.MeshBasicMaterial({color:sector.color,transparent:true,opacity:.9}));
  halo.rotation.x=Math.PI/2;
  const stem=new THREE.Mesh(stemGeo,new THREE.MeshBasicMaterial({color:sector.color,transparent:true,opacity:.68}));
  stem.position.y=-.18;
  beacon.add(orb,halo,stem);

  const data={
   key:sector.key,
   sector:sector.name,
   name:item,
   desc:facilityDescriptions[item]||'Instalación interna de Elysium.',
   id:`${sector.key.toUpperCase()} / ${(idx+1).toString().padStart(2,'0')}`,
   color:sector.color
  };
  beacon.userData={facility:data};
  orb.userData={facility:data};
  halo.userData={facility:data};
  facilityRecords.push({beacon,data});
  return pod;
 }

 placements.forEach(pl=>{
  const sector=sectorSpecs[pl.sector], items=sector.items;
  items.forEach((item,i)=>{
   const c=pl.coords[i]||[0,0,'bay'];
   buildChamber(sector, item, i, c[0], c[1], pl.y, c[2]||'bay');
  });
 });

 // 6. HOLOGRAPHIC TERRAIN RADAR RINGS & RETICLE GRID
 const scan=new THREE.Group();
 world.add(scan);
 for(let i=0;i<5;i++){
  const ring=new THREE.Mesh(new THREE.TorusGeometry(17.5+i*.75,.014,4,128),new THREE.MeshBasicMaterial({color:cyan,transparent:true,opacity:.14-i*.016}));
  ring.rotation.x=Math.PI/2;
  ring.position.y=baseY-.45-i*.05;
  scan.add(ring);
 }
 const deepRing=new THREE.Mesh(new THREE.TorusGeometry(16.5,.016,4,128),new THREE.MeshBasicMaterial({color:cyan,transparent:true,opacity:.14}));
 deepRing.rotation.x=Math.PI/2;
 deepRing.position.y=-8.4;
 scan.add(deepRing);

 // Popover & Raycasting
 const frame=canvas.closest('.scene-frame');
 let popup=frame.querySelector('.facility-popup');
 if(!popup){
  popup=document.createElement('div');
  popup.className='facility-popup';
  popup.innerHTML='<button class="popup-close" aria-label="Cerrar">×</button><span class="popup-kicker">INSTALLATION / SELECTED</span><small class="popup-id"></small><h3></h3><p></p><span class="popup-sector"></span>';
  frame.append(popup);
  popup.querySelector('.popup-close').addEventListener('click',()=>popup.classList.remove('visible'));
 }
 const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2();
 let layer='both', labels=true, selected=null;

 function updatePopup(){
  if(!selected)return;
  const v=selected.beacon.getWorldPosition(new THREE.Vector3()).project(camera);
  if(v.z>1){popup.classList.remove('visible');return}
  const rect=canvas.getBoundingClientRect(), x=(v.x*.5+.5)*rect.width, y=(-v.y*.5+.5)*rect.height;
  popup.style.left=`${Math.max(14,Math.min(rect.width-260,x+15))}px`;
  popup.style.top=`${Math.max(48,Math.min(rect.height-160,y-20))}px`;
 }
 function selectFacility(data,beacon){
  selected={data,beacon};
  popup.querySelector('.popup-id').textContent=data.id;
  popup.querySelector('h3').textContent=data.name;
  popup.querySelector('p').textContent=data.desc;
  popup.querySelector('.popup-sector').textContent=data.sector+'  /  ELYSIUM';
  popup.classList.add('visible');
  updatePopup();
  if(typeof showInfo==='function')showInfo(data.key,data.name,data);
 }
 function choose(ev){
  const rect=canvas.getBoundingClientRect();
  pointer.x=((ev.clientX-rect.left)/rect.width)*2-1;
  pointer.y=-((ev.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  const hits=raycaster.intersectObjects(world.children,true);
  const hit=hits.find(h=>h.object.userData?.facility);
  if(hit){
   const data=hit.object.userData.facility;
   const rec=facilityRecords.find(r=>r.data===data)||facilityRecords.find(r=>r.data.name===data.name);
   selectFacility(data,rec?.beacon||hit.object.parent);
  } else {
   popup.classList.remove('visible');
  }
 }
 let down=null;
 canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY}});
 canvas.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<7)choose(e);down=null});

 function resize(){
  const w=canvas.clientWidth||1, h=canvas.clientHeight||1;
  renderer.setSize(w,h,false);
  camera.aspect=w/h;
  camera.updateProjectionMatrix();
  updatePopup();
 }
 const ro=new ResizeObserver(resize);
 ro.observe(canvas);
 resize();

 let rafId=0;
 function animate(){
  rafId=requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene,camera);
  if(popup.classList.contains('visible'))updatePopup();
 }
 animate();

 function setLayer(v){
  layer=v;
  surface.visible=v!=='bunker';
  sub.visible=v!=='surface';
  markers.visible=true;
  if(v==='surface'){camera.position.set(28,23,31);controls.target.set(0,baseY,0)}
  else if(v==='bunker'){camera.position.set(32,14,35);controls.target.set(0,-2.0,0)}
  else{camera.position.set(34,24,36);controls.target.set(0,-1.2,0)}
  controls.update();
  popup.classList.remove('visible');
 }
 return {setLayer,reset:()=>setLayer(layer),setLabels:v=>{labels=v;scan.visible=v;contourGroup.visible=v;},dispose:()=>{cancelAnimationFrame(rafId);ro.disconnect();renderer.dispose()}};
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
