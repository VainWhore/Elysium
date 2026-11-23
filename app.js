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
 'Sala de consejo':'Espacio de deliberación y toma de decisiones administrativas.','Archivo general':'Conserva documentación institucional y registros generales.','Puesto de vigilancia':'Supervisa los accesos y las condiciones de seguridad del complejo.','Zona de aislamiento':'Área restringida para procedimientos de aislamiento y observación.','Red de comunicaciones':'Gestiona los enlaces internos y las comunicaciones autorizadas.','Sala de reuniones':'Espacio destinado a reuniones de coordinación.','Centro de mando':'Coordina operaciones de seguridad y seguimiento de amenazas.','Laboratorio':'Instalación destinada a investigación y análisis.','Centro médico':'Atención, evaluación, tratamiento y seguimiento sanitario.','Servidores':'Aloja la infraestructura informática independiente.','Taller tecnológico':'Reparación, adaptación y mantenimiento de equipos.','Archivo':'Almacena documentación técnica y registros del sector.','Comedor':'Área de alimentación para el personal del sector.','Dormitorios':'Alojamiento residencial para habitantes del sector.','Invernadero':'Producción interna de vegetales y cultivos.','Área de evaluación y entrenamiento psicológico':'Espacio de evaluación y entrenamiento psicológico.','Oficina de Neuvillette':'Oficina vinculada a las actividades de Neuvillette.','Plaza central':'Punto de encuentro y circulación comunitaria.','Mercado':'Área de intercambio y distribución de productos.','Comedor comunitario':'Prepara y distribuye las comidas de los residentes.','Taller':'Reparación y elaboración de objetos de uso cotidiano.','Enfermería':'Atención primaria y seguimiento de necesidades sanitarias.','Zona creativa':'Espacio para actividades artísticas y recreativas.','Almacén':'Resguarda provisiones y materiales de uso común.','Sala común':'Lugar de descanso y convivencia entre residentes.','Bar':'Establecimiento recreativo y punto de encuentro.','Generación y distribución eléctrica':'Produce y distribuye energía a las instalaciones.','Tratamiento y almacenamiento de agua':'Procesa y conserva el suministro de agua.','Ventilación y climatización':'Renueva el aire y regula las condiciones ambientales.','Gestión de residuos':'Clasifica y procesa los residuos del asentamiento.','Mantenimiento técnico':'Da soporte a los sistemas e instalaciones.','Almacenes de servicio':'Conserva repuestos y materiales técnicos.','Conexiones verticales y corredores':'Conectan los distintos niveles y áreas del complejo.'
};

function createScene(canvas,compact=false){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.08;
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
 function createOrganicWing(pts2D, yPos, thickness=.26, edgeColor=cyan, edgeOpacity=.72){
  let pts=pts2D.map(p=>[p[0],p[1]]);
  for(let iter=0;iter<2;iter++){
   const next=[];
   for(let i=0;i<pts.length;i++){
    const a=pts[i], b=pts[(i+1)%pts.length];
    next.push([a[0]*.75+b[0]*.25, a[1]*.75+b[1]*.25]);
    next.push([a[0]*.25+b[0]*.75, a[1]*.25+b[1]*.75]);
   }
   pts=next;
  }
  const shape=new THREE.Shape();
  shape.moveTo(pts[0][0], pts[0][1]);
  for(let i=1;i<pts.length;i++) shape.lineTo(pts[i][0], pts[i][1]);
  shape.closePath();

  const geo=new THREE.ExtrudeGeometry(shape,{depth:thickness,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.18,bevelThickness:.08,curveSegments:24});
  geo.rotateX(Math.PI/2);
  const mesh=new THREE.Mesh(geo,slabMat);
  mesh.position.y=yPos;

  const edges=new THREE.LineSegments(new THREE.EdgesGeometry(geo,28),new THREE.LineBasicMaterial({color:edgeColor,transparent:true,opacity:edgeOpacity}));
  edges.position.y=yPos;

  const grp=new THREE.Group();
  grp.add(mesh,edges);
  sub.add(grp);
  return grp;
 }

 // Level 0 (Y = 3.8): Upper Command & Intake Wing (ELYSIUM Admin + Entry Airlock Tunnel)
 createOrganicWing([
  [-11,-7],[-3,-8.5],[5,-7.5],[11,-4.5],[12,1.5],[7,5.5],[-1,6.2],[-9,4.5],[-13,-1]
 ], 3.8, .22, 0xf59e42, .85);
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

 // 3. CURVED TUNNELS, SERVICE CORRIDORS, BLAST AIRLOCKS & MULTIPLE SURFACE EXITS
 const tunnelRecords=[];
 const stairRecords=[];
 const tunnelMat=new THREE.MeshStandardMaterial({color:0x365c63,metalness:.58,roughness:.38,transparent:true,opacity:.52});
 const serviceTunnelMat=new THREE.MeshStandardMaterial({color:0x4b4238,metalness:.62,roughness:.44,transparent:true,opacity:.58});
 const evacTunnelMat=new THREE.MeshStandardMaterial({color:0x2b4e4c,metalness:.52,roughness:.36,transparent:true,opacity:.54});
 const pulseLineMat=new THREE.MeshBasicMaterial({color:cyan,transparent:true,opacity:.72});
 const serviceLineMat=new THREE.MeshBasicMaterial({color:0xe2b979,transparent:true,opacity:.72});
 const evacLineMat=new THREE.MeshBasicMaterial({color:0x7ee6b8,transparent:true,opacity:.76});

 function buildTunnel(pts, radius=.24, kind='main'){
  const vecPts=pts.map(p=>new THREE.Vector3(p[0],p[1],p[2]));
  const curve=new THREE.CatmullRomCurve3(vecPts);
  const baseMat=kind==='service'?serviceTunnelMat:(kind==='evac'?evacTunnelMat:tunnelMat);
  const baseLMat=kind==='service'?serviceLineMat:(kind==='evac'?evacLineMat:pulseLineMat);
  const mat=baseMat.clone();
  const lMat=baseLMat.clone();
  const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,64,radius,14,false),mat);
  const rail=new THREE.Mesh(new THREE.TubeGeometry(curve,64,.02,8,false),lMat);
  sub.add(tube,rail);
  const ribs=[];
  [0.02,0.25,0.5,0.75,0.98].forEach((t,idx)=>{
   const pos=curve.getPoint(t);
   const tan=curve.getTangent(t);
   const isEnd=(idx===0||idx===4);
   const rib=new THREE.Mesh(new THREE.TorusGeometry(radius*(isEnd?1.18:1.1),.02,8,22),lMat);
   rib.position.copy(pos);
   rib.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),tan);
   sub.add(rib);
   ribs.push(rib);
  });
  const samplePts=[];
  for(let s=0;s<=12;s++) samplePts.push(curve.getPoint(s/12));
  tunnelRecords.push({kind,mat,lMat,baseOp:baseMat.opacity,baseLineOp:baseLMat.opacity,samplePts,rail,ribs});
 }

 // Helper for restricted blast-door airlock gates between sectors and service corridors
 const bulkheadMat=new THREE.MeshStandardMaterial({color:0x24373c,metalness:.72,roughness:.35});
 function buildBlastBulkhead(x,y,z,rotY=0,isRestricted=true){
  const gate=new THREE.Group();
  gate.position.set(x,y,z);
  gate.rotation.y=rotY;
  const frame=new THREE.Mesh(new THREE.BoxGeometry(.95,.72,.22),bulkheadMat);
  frame.position.y=.36;
  const trim=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(.98,.75,.25)),new THREE.LineBasicMaterial({color:isRestricted?0xe2b979:cyan,transparent:true,opacity:.88}));
  trim.position.y=.36;
  gate.add(frame,trim);
  sub.add(gate);
 }

 // A. PRIMARY & SECONDARY SURFACE ACCESSES + CAMOUFLAGED FOREST EMERGENCY EXITS
 // 1) Main Mountain Blast Portal (existing front-south intake)
 buildTunnel([[px,py+.15,pz],[2.0,6.2,3.5],[1.2,4.8,0.5],[0,4.05,-2.5]], .36, 'main');

 // 2) Camouflaged Forest Emergency Hatch — West Woods (Sanctum escape route)
 const exW_x=-15.8, exW_z=7.4, exW_y=baseY+mountainHeight(exW_x,exW_z);
 buildTunnel([[-13.5,1.02,4.2],[-15.2,3.8,6.2],[exW_x,exW_y-.05,exW_z]], .23, 'evac');

 // 3) Camouflaged Forest Emergency Hatch — East Pine Ravine (The Shelter escape route)
 const exE_x=16.6, exE_z=7.2, exE_y=baseY+mountainHeight(exE_x,exE_z);
 buildTunnel([[13.5,-2.08,4.0],[15.8,2.5,6.0],[exE_x,exE_y-.05,exE_z]], .23, 'evac');

 // 4) Concealed North Ridge Supply & Service Tunnel (Restricted logistics access, bypasses living quarters)
 const supN_x=-11.8, supN_z=-12.2, supN_y=baseY+mountainHeight(supN_x,supN_z);
 buildTunnel([[-10.5,4.0,-6.2],[-11.4,6.4,-9.6],[supN_x,supN_y-.05,supN_z]], .28, 'service');

 // 5) Hidden Northeast Emergency Extraction Tunnel from Level -1/-2 Perimeter
 const exNE_x=15.4, exNE_z=-11.4, exNE_y=baseY+mountainHeight(exNE_x,exNE_z);
 buildTunnel([[13.2,1.02,-5.5],[14.8,4.6,-8.8],[exNE_x,exNE_y-.05,exNE_z]], .22, 'evac');

 // Render camouflaged surface hatches & mossy rock/foliage cover in the forest
 [
  {x:exW_x, y:exW_y, z:exW_z, kind:'evac', rot:.45},
  {x:exE_x, y:exE_y, z:exE_z, kind:'evac', rot:-.55},
  {x:supN_x, y:supN_y, z:supN_z, kind:'service', rot:.2},
  {x:exNE_x, y:exNE_y, z:exNE_z, kind:'evac', rot:-.3}
 ].forEach(h=>{
  const hatchGrp=new THREE.Group();
  hatchGrp.position.set(h.x,h.y+.04,h.z);
  hatchGrp.rotation.y=h.rot;
  // Low mossy rock-toned hatch lid blended into terrain
  const baseCol=h.kind==='service'?0x3d4338:0x2d473a;
  const rimCol=h.kind==='service'?0xe2b979:0x7ee6b8;
  const casing=new THREE.Mesh(new THREE.CylinderGeometry(.55,.68,.24,8),new THREE.MeshStandardMaterial({color:baseCol,roughness:.92,metalness:.35}));
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.56,.018,6,16),new THREE.MeshBasicMaterial({color:rimCol,transparent:true,opacity:.72}));
  ring.rotation.x=Math.PI/2;
  ring.position.y=.13;
  // Camouflage foliage shrubs & boulders around hatch rim
  const shrubMat=new THREE.MeshStandardMaterial({color:0x294a39,roughness:.96});
  for(let k=0;k<5;k++){
   const ang=(k/5)*Math.PI*2+.3;
   const shrub=new THREE.Mesh(new THREE.DodecahedronGeometry(.34+((k%2)*.12),0),shrubMat);
   shrub.scale.set(1.2,.68,1.1);
   shrub.position.set(Math.cos(ang)*.64,.12,Math.sin(ang)*.64);
   hatchGrp.add(shrub);
  }
  hatchGrp.add(casing,ring);
  surface.add(hatchGrp);
 });

 // B. EXPANDED MULTI-ROUTE CORRIDOR NETWORK (CONNECTING EVERY CHAMBER & SECTOR WITHOUT BOTTLENECKS)
 // Sloped cargo/service ramps connecting decks
 buildTunnel([[-10.5,4.0,-3.5],[-12.8,2.4,-2.0],[-11.5,1.0,1.5]], .26, 'service');
 buildTunnel([[11.5,1.0,-2.0],[13.5,-0.6,0.5],[11.5,-2.1,3.2]], .26, 'service');
 buildTunnel([[-9.8,-2.1,-3.2],[-11.6,-3.8,-1.5],[-9.2,-5.25,-2.5]], .24, 'service');
 buildTunnel([[8.2,-5.25,-1.5],[9.6,-6.7,-0.2],[7.2,-8.05,0.8]], .23, 'service');

 // Lateral wing connector tunnels (dual parallel links so wings are never dead-ends)
 buildTunnel([[10.2,3.95,-3.2],[14.2,3.85,-3.2]], .24, 'main');
 buildTunnel([[9.5,3.95,-1.5],[14.2,3.85,-3.2]], .17, 'service');
 buildTunnel([[-13.5,0.95,-1.2],[-19.2,0.85,-1.2]], .24, 'main');
 buildTunnel([[-13.5,0.95,3.2],[-18.5,0.85,3.2]], .19, 'main');
 buildTunnel([[14.2,-2.15,-1.2],[19.2,-2.25,-1.2]], .24, 'main');
 buildTunnel([[13.8,-2.15,3.2],[18.8,-2.25,3.2]], .19, 'main');

 // Deck 0 (Y=4.02): Full perimeter ring + cross-links connecting all 6 ELYSIUM admin & intake rooms
 buildTunnel([[-9.5,4.02,-4.5],[-3.0,4.02,-5.5],[4.5,4.02,-4.8],[9.5,4.02,-1.5]], .19, 'main');
 buildTunnel([[-7.5,4.02,-4.2],[-7.8,4.02,2.2],[-1.8,4.02,3.2],[4.2,4.02,-4.6]], .18, 'main');
 buildTunnel([[-2.2,4.02,-5.2],[-1.8,4.02,3.2]], .16, 'main');
 buildTunnel([[-10.5,4.02,-6.0],[-7.5,4.02,-4.2]], .16, 'service'); // Restricted supply bypass

 // Deck 1 (Y=1.02): SANCTUM dual north/south galleries + west/east cross-corridors + restricted perimeter service loop
 buildTunnel([[-12.5,1.02,-5.5],[-4.5,1.02,-6.2],[1.5,1.02,-6.0],[7.8,1.02,-5.2],[11.5,1.02,-1.5]], .20, 'main');
 buildTunnel([[-11.5,1.02,3.5],[-3.2,1.02,4.0],[3.5,1.02,4.2],[9.8,1.02,3.5],[11.5,1.02,-1.5]], .19, 'main');
 buildTunnel([[-10.2,1.02,-5.5],[-9.5,1.02,3.5]], .17, 'main');
 buildTunnel([[-4.5,1.02,-6.2],[-3.2,1.02,4.0]], .16, 'main');
 buildTunnel([[7.8,1.02,-5.2],[9.8,1.02,3.5]], .17, 'main');
 buildTunnel([[-19.2,1.02,-1.2],[-18.5,1.02,3.2],[-13.5,1.02,4.2]], .17, 'evac');
 // Restricted Sanctum Tactical Perimeter Corridor
 buildTunnel([[-12.8,1.02,-6.8],[0,1.02,-7.6],[13.2,1.02,-5.5]], .15, 'service');

 // Deck 2 (Y=-2.08): THE SHELTER interconnected residential/community loop + service corridor
 buildTunnel([[-12.5,-2.08,-5.2],[-4.8,-2.08,-5.8],[1.2,-2.08,-5.8],[7.5,-2.08,-5.0],[11.8,-2.08,-0.8]], .20, 'main');
 buildTunnel([[-11.5,-2.08,3.8],[-3.5,-2.08,4.6],[3.2,-2.08,4.8],[9.5,-2.08,3.8],[11.8,-2.08,-0.8]], .19, 'main');
 buildTunnel([[-10.5,-2.08,-5.0],[-9.8,-2.08,3.8]], .17, 'main');
 buildTunnel([[-4.8,-2.08,-5.8],[-3.5,-2.08,4.6]], .16, 'main');
 buildTunnel([[7.5,-2.08,-5.0],[9.5,-2.08,3.8]], .17, 'main');
 buildTunnel([[19.2,-2.08,-1.2],[18.8,-2.08,3.2],[13.5,-2.08,4.0]], .17, 'evac');
 // Separate Back-of-House Logistics Corridor (keeps supply haulage away from living quarters)
 buildTunnel([[-13.2,-2.08,-6.6],[0,-2.08,-7.5],[13.5,-2.08,-5.8]], .15, 'service');

 // Deck 3 (Y=-5.18) & Deck 4 (Y=-7.98): Full ring circuits connecting all engineering & aquifer chambers
 buildTunnel([[-9.5,-5.18,-3.5],[-2.2,-5.18,-4.4],[4.5,-5.18,-4.0],[8.8,-5.18,1.5],[2.5,-5.18,4.8],[-6.5,-5.18,4.2],[-9.5,-5.18,-3.5]], .18, 'service');
 buildTunnel([[-6.5,-7.98,-2.0],[0.8,-7.98,-2.6],[6.5,-7.98,1.2],[1.5,-7.98,3.8],[-5.5,-7.98,2.8],[-6.5,-7.98,-2.0]], .17, 'service');

 // Security Blast-Door Checkpoints at restricted junctions & sector transitions
 buildBlastBulkhead(-10.2, 3.85, -5.6, .35, true);
 buildBlastBulkhead(11.6, 3.85, -3.2, Math.PI/2, true);
 buildBlastBulkhead(-15.5, 0.85, -1.2, Math.PI/2, true);
 buildBlastBulkhead(11.8, 0.85, -4.8, -.4, true);
 buildBlastBulkhead(15.8, -2.25, -1.2, Math.PI/2, false);
 buildBlastBulkhead(-11.8, -2.25, -6.2, .25, true);

 // 4. SINGLE CENTRAL ELEVATOR CORE + MULTI-SECTOR STAIRWELLS & VENTILATION SHAFTS
 const shaftGlass=new THREE.MeshPhysicalMaterial({color:0x69cbd1,metalness:.45,roughness:.18,transparent:true,opacity:.18,transmission:.2});
 const shaftWire=new THREE.MeshBasicMaterial({color:cyan,wireframe:true,transparent:true,opacity:.36});

 // SINGLE Main Central High-Speed Elevator Core (the sole elevator shaft in the complex)
 const mainShaft=new THREE.Group();
 const mhTotal=15.8, mhCenter=-0.4;
 const mainOuter=new THREE.Mesh(new THREE.CylinderGeometry(.92,.92,mhTotal,16,1,true),shaftGlass);
 mainOuter.position.y=mhCenter;
 mainShaft.add(mainOuter);
 const mainInner=new THREE.Mesh(new THREE.CylinderGeometry(.32,.32,mhTotal,10),shaftWire);
 mainInner.position.y=mhCenter;
 mainShaft.add(mainInner);
 [3.9, 0.9, -2.2, -5.3, -8.1].forEach(ry=>{
  const collar=new THREE.Mesh(new THREE.TorusGeometry(.96,.035,8,24),pulseLineMat);
  collar.rotation.x=Math.PI/2;
  collar.position.y=ry;
  mainShaft.add(collar);
 });
 sub.add(mainShaft);

 // ARCHITECTURAL STAIRWELLS & INDEPENDENT EMERGENCY STAIR TOWERS (Visible 3D Zig-Zag Flights!)
 const stairSteelMat=new THREE.MeshStandardMaterial({color:0x4b6e75,metalness:.65,roughness:.35,transparent:true,opacity:.88});
 const stairCageMat=new THREE.MeshBasicMaterial({color:0x7ee6b8,wireframe:true,transparent:true,opacity:.24});
 const stairRailMat=new THREE.MeshBasicMaterial({color:cyan,transparent:true,opacity:.72});

 function buildStairwell(x, z, levels, isEmergency=false){
  const grp=new THREE.Group();
  grp.position.set(x,0,z);
  const cMat=isEmergency?new THREE.MeshBasicMaterial({color:0x7ee6b8,wireframe:true,transparent:true,opacity:.26}):stairCageMat;
  const rMat=isEmergency?evacLineMat:stairRailMat;

  for(let i=0;i<levels.length-1;i++){
   const yTop=levels[i]+.08, yBot=levels[i+1]+.08;
   const dy=yTop-yBot;
   const yMid=(yTop+yBot)/2;

   // Open structural stairwell frame
   const cage=new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(1.18, dy, 1.48)),
    new THREE.LineBasicMaterial({color:isEmergency?0x7ee6b8:cyan,transparent:true,opacity:.42})
   );
   cage.position.y=yMid;
   grp.add(cage);

   // Intermediate switchback landing platform
   const landing=new THREE.Mesh(new THREE.BoxGeometry(1.1,.07,.45),stairSteelMat);
   landing.position.set(0, yMid, -.48);
   grp.add(landing);

   // Flight 1 (Upper half: top -> intermediate landing) & Flight 2 (Lower half: landing -> bottom)
   const fLen=Math.hypot(dy/2, .92);
   const pitch=Math.atan2(dy/2, .92);

   const flight1=new THREE.Mesh(new THREE.BoxGeometry(.42,.08,fLen),stairSteelMat);
   flight1.position.set(-.26, yTop-dy*.25, .02);
   flight1.rotation.x=pitch;
   const rail1=new THREE.Mesh(new THREE.BoxGeometry(.03,.03,fLen),rMat);
   rail1.position.set(-.26, yTop-dy*.25+.18, .02);
   rail1.rotation.x=pitch;

   const flight2=new THREE.Mesh(new THREE.BoxGeometry(.42,.08,fLen),stairSteelMat);
   flight2.position.set(.26, yTop-dy*.75, .02);
   flight2.rotation.x=-pitch;
   const rail2=new THREE.Mesh(new THREE.BoxGeometry(.03,.03,fLen),rMat);
   rail2.position.set(.26, yTop-dy*.75+.18, .02);
   rail2.rotation.x=-pitch;

   // Individual step treads along both flights for clear visual stair silhouette
   for(let s=1;s<=4;s++){
    const t=s/5;
    const stepA=new THREE.Mesh(new THREE.BoxGeometry(.4,.04,.16),stairSteelMat);
    stepA.position.set(-.26, yTop-(dy*.5)*t, .44-.88*t);
    const stepB=new THREE.Mesh(new THREE.BoxGeometry(.4,.04,.16),stairSteelMat);
    stepB.position.set(.26, yMid-(dy*.5)*t, -.44+.88*t);
    grp.add(stepA,stepB);
   }
   grp.add(flight1,rail1,flight2,rail2);
  }
  sub.add(grp);
  stairRecords.push({x,z,levels,isEmergency,grp});
 }

 // 4 Strategic Stairwells so personnel move between sectors & levels without using the central elevator:
 // 1) West Sector Inter-Deck Stairwell (connects Deck 0 -> -1 -> -2 -> -3)
 buildStairwell(-7.4, -0.8, [3.8, 0.8, -2.3, -5.4], false);
 // 2) East Sector Inter-Deck Stairwell (connects Deck 0 -> -1 -> -2 -> -3)
 buildStairwell(7.2, 0.6, [3.8, 0.8, -2.3, -5.4], false);
 // 3) Southwest Independent Emergency Escape Stair Tower (Deck -1 -> -2 -> -3 -> -4, isolated from central shaft)
 buildStairwell(-11.8, 4.4, [0.8, -2.3, -5.4, -8.2], true);
 // 4) Northeast Independent Emergency & Engineering Stair Tower (Deck 0 -> -1 -> -2 -> -3 -> -4)
 buildStairwell(10.6, -4.6, [3.8, 0.8, -2.3, -5.4, -8.2], true);

 // Concealed Ventilation & Air-Filtration Chimneys (slender ducts only — no extra elevators)
 [
  {x:-8.8, z:-4.2, top:baseY+mountainHeight(-8.8,-4.2), bot:-5.4, r:.24},
  {x:8.6,  z:3.6,  top:baseY+mountainHeight(8.6,3.6),   bot:-5.4, r:.24}
 ].forEach(s=>{
  const h=s.top-s.bot, cy=(s.top+s.bot)/2;
  const duct=new THREE.Mesh(new THREE.CylinderGeometry(s.r,s.r,h,10,1,true),shaftWire);
  duct.position.set(s.x,cy,s.z);
  sub.add(duct);
  const cap=new THREE.Mesh(new THREE.CylinderGeometry(s.r*1.3,s.r*1.5,.2,12),new THREE.MeshStandardMaterial({color:0x4b5e54,metalness:.55,roughness:.5}));
  cap.position.set(s.x,s.top+.09,s.z);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(s.r*1.4,.016,6,20),pulseLineMat);
  ring.rotation.x=Math.PI/2;
  ring.position.set(s.x,s.top+.2,s.z);
  surface.add(cap,ring);
 });
 // 5. ARCHITECTURAL CHAMBERS & INTERACTIVE FACILITY PODS (VARIED SHAPES: OCTAGONAL HUBS, BAYS, DOMES)
 const facilityRecords=[];
 const hitTargets=[];
 const hitSphereGeo=new THREE.SphereGeometry(.62,12,10);
 const hitSphereMat=new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false});
 const sectorSpecs=[
  {key:'elysium',name:'ELYSIUM',color:0xf59e42,items:content.facilities.elysium.items},
  {key:'sanctum',name:'SANCTUM',color:0x83dbe8,items:content.facilities.sanctum.items},
  {key:'shelter',name:'THE SHELTER',color:0xa3d8bd,items:content.facilities.shelter.items},
  {key:'shared',name:'INFRAESTRUCTURA COMPARTIDA',color:0x9bb7f0,items:content.facilities.shared.items}
 ];

 const placements=[
  {y:3.8, sector:0, coords:[
   [-7.5,-4.2,'hub'], [-2.2,-5.2,'bay'], [4.2,-4.6,'bay'],
   [14.2,-3.2,'hub'], [-7.8,2.2,'bay'], [-1.8,3.2,'bay']
  ]},
  {y:0.8, sector:1, coords:[
   [-10.2,-5.5,'hub'], [-4.5,-6.2,'bay'], [1.5,-6.0,'bay'], [7.8,-5.2,'hub'],
   [-19.2,-1.2,'hub'], [-18.5,3.2,'bay'], [-9.5,3.5,'bay'], [-3.2,4.0,'bay'],
   [3.5,4.2,'bay'], [9.8,3.5,'hub'], [11.5,-1.5,'bay']
  ]},
  {y:-2.3, sector:2, coords:[
   [-10.5,-5.0,'hub'], [-4.8,-5.8,'bay'], [1.2,-5.8,'bay'], [7.5,-5.0,'hub'],
   [19.2,-1.2,'hub'], [18.8,3.2,'bay'], [-9.8,3.8,'bay'], [-3.5,4.6,'hub'],
   [3.2,4.8,'bay'], [9.5,3.8,'bay'], [11.8,-0.8,'bay']
  ]},
  {y:-5.4, sector:3, coords:[
   [-8.5,-3.6,'hub'], [-2.2,-4.4,'bay'], [4.5,-4.0,'bay'], [8.8,1.5,'hub']
  ]},
  {y:-8.2, sector:3, coords:[
   [-5.8,-1.8,'hub'], [0.8,-2.6,'bay'], [6.5,1.2,'hub']
  ]}
 ];

 const orbGeo=new THREE.SphereGeometry(.14,18,14);
 const haloGeo=new THREE.TorusGeometry(.28,.016,8,32);
 const stemGeo=new THREE.CylinderGeometry(.012,.012,.28,8);

 function buildChamber(sector, item, idx, x, z, y, shapeType){
  const pod=new THREE.Group();
  pod.position.set(x,y+.02,z);
  sub.add(pod);

  const isRestricted=sector.key==='elysium';
  const baseDesc=facilityDescriptions[item]||'Instalación interna de Elysium.';
  const data={
   key:sector.key,
   sector:isRestricted?'ELYSIUM · ÁREA RESTRINGIDA (SOLO PERSONAL AUTORIZADO)':sector.name,
   name:item,
   desc:isRestricted ? `${baseDesc} Lugar restringido: solo entra personal autorizado.` : baseDesc,
   id:`${sector.key.toUpperCase()} / ${(idx+1).toString().padStart(2,'0')}`,
   color:sector.color,
   restricted:isRestricted
  };

  if(shapeType==='hub'){
   const r=1.55;
   const plinth=new THREE.Mesh(new THREE.CylinderGeometry(r*1.08,r*1.16,.1,24),slabMat);
   plinth.position.y=.05;
   const base=new THREE.Mesh(new THREE.CylinderGeometry(r,r*1.04,.16,16),slabMat);
   base.position.y=.12;
   pod.add(plinth,base);
   const ring=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.CylinderGeometry(r,r,.74,16,1,true)),new THREE.LineBasicMaterial({color:sector.color,transparent:true,opacity:.72}));
   ring.position.y=.5;
   pod.add(ring);
   const topCollar=new THREE.Mesh(new THREE.TorusGeometry(r,.018,8,32),new THREE.MeshBasicMaterial({color:sector.color,transparent:true,opacity:.65}));
   topCollar.rotation.x=Math.PI/2;
   topCollar.position.y=.87;
   pod.add(topCollar);
   const core=new THREE.Mesh(new THREE.CylinderGeometry(.42,.5,.34,16),innerWallMat);
   core.position.y=.32;
   pod.add(core);
  } else {
   const w=2.5, d=1.9;
   const plinth=new THREE.Mesh(new THREE.CylinderGeometry(1.52,1.62,.1,8),slabMat);
   plinth.rotation.y=Math.PI/8;
   plinth.position.y=.05;
   pod.add(plinth);

   const base=new THREE.Mesh(new THREE.BoxGeometry(w,.14,d),slabMat);
   base.position.y=.12;
   pod.add(base);
   const edges=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w,.14,d)),new THREE.LineBasicMaterial({color:sector.color,transparent:true,opacity:.76}));
   edges.position.y=.12;
   pod.add(edges);

   const back=new THREE.Mesh(new THREE.BoxGeometry(w,.66,.1),innerWallMat);
   back.position.set(0,.48,-d/2);
   const left=new THREE.Mesh(new THREE.BoxGeometry(.1,.66,d),innerWallMat);
   left.position.set(-w/2,.48,0);
   const right=new THREE.Mesh(new THREE.BoxGeometry(.1,.66,d),innerWallMat);
   right.position.set(w/2,.48,0);
   pod.add(back,left,right);

   const consoleBox=new THREE.Mesh(new THREE.BoxGeometry(.75,.28,.42),rockRimMat);
   consoleBox.position.set(-.35,.31,-.22);
   pod.add(consoleBox);
  }

  const beacon=new THREE.Group();
  beacon.position.set(0,1.18,0);
  pod.add(beacon);

  const orb=new THREE.Mesh(orbGeo,new THREE.MeshBasicMaterial({color:sector.color}));
  const halo=new THREE.Mesh(haloGeo,new THREE.MeshBasicMaterial({color:sector.color,transparent:true,opacity:.9}));
  halo.rotation.x=Math.PI/2;
  const stem=new THREE.Mesh(stemGeo,new THREE.MeshBasicMaterial({color:sector.color,transparent:true,opacity:.68}));
  stem.position.y=-.18;
  const hitSphere=new THREE.Mesh(hitSphereGeo,hitSphereMat);
  beacon.add(orb,halo,stem,hitSphere);

  [beacon,orb,halo,hitSphere].forEach(obj=>{obj.userData={facility:data}});
  pod.traverse(child=>{if(child.isMesh && !child.userData?.facility) child.userData={facility:data};});
  hitTargets.push(hitSphere,orb,halo);
  facilityRecords.push({pod,beacon,orb,halo,data,pos:new THREE.Vector3(x,y+.2,z)});
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
  const ring=new THREE.Mesh(new THREE.TorusGeometry(17.5+i*.75,.014,6,144),new THREE.MeshBasicMaterial({color:cyan,transparent:true,opacity:.14-i*.016}));
  ring.rotation.x=Math.PI/2;
  ring.position.y=baseY-.45-i*.05;
  scan.add(ring);
 }
 const deepRing=new THREE.Mesh(new THREE.TorusGeometry(16.5,.016,6,144),new THREE.MeshBasicMaterial({color:cyan,transparent:true,opacity:.14}));
 deepRing.rotation.x=Math.PI/2;
 deepRing.position.y=-8.4;
 scan.add(deepRing);

 // Popover & Raycasting (direct hitTargets priority -> guaranteed response on every point!)
 const frame=canvas.closest('.scene-frame');
 let popup=frame.querySelector('.facility-popup');
 if(!popup){
  popup=document.createElement('div');
  popup.className='facility-popup';
  popup.innerHTML='<button class="popup-close" aria-label="Cerrar">×</button><span class="popup-kicker">INSTALLATION / SELECTED</span><small class="popup-id"></small><h3></h3><p></p><span class="popup-sector"></span>';
  frame.append(popup);
  popup.querySelector('.popup-close').addEventListener('click',()=>{popup.classList.remove('visible');selected=null;resetHighlights();});
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
 function resetHighlights(){
  tunnelRecords.forEach(tr=>{
   tr.mat.opacity=tr.baseOp;
   tr.lMat.opacity=tr.baseLineOp;
   tr.rail.scale.set(1,1,1);
  });
  stairRecords.forEach(sr=>{
   sr.grp.scale.set(1,1,1);
   sr.grp.traverse(c=>{if(c.material)c.material.opacity=c.isLineSegments?.42:.88;});
  });
 }

 function highlightConnectedRoutes(rec){
  resetHighlights();
  if(!rec)return;
  const p=rec.pos;
  // Dim non-connected corridors slightly and illuminate nearest corridors + nearest stairwell + nearest evac route
  let bestStair=null, bestStairDist=1e9;
  stairRecords.forEach(sr=>{
   const inLevelRange=(p.y<=Math.max(...sr.levels)+1.2 && p.y>=Math.min(...sr.levels)-1.2);
   const d=Math.hypot(sr.x-p.x,sr.z-p.z)+(inLevelRange?0:8);
   if(d<bestStairDist){bestStairDist=d;bestStair=sr;}
  });

  tunnelRecords.forEach(tr=>{
   let minDist=1e9;
   for(const sp of tr.samplePts){
    const d=sp.distanceTo(p);
    if(d<minDist)minDist=d;
   }
   const isConnected=(minDist<5.4);
   const isNearestEvac=(tr.kind==='evac' && minDist<9.2);
   if(isConnected || isNearestEvac){
    tr.mat.opacity=Math.min(.92,tr.baseOp+.32);
    tr.lMat.opacity=1.0;
    tr.rail.scale.set(1.45,1.45,1.45);
   } else {
    tr.mat.opacity=tr.baseOp*.42;
    tr.lMat.opacity=tr.baseLineOp*.35;
   }
  });

  stairRecords.forEach(sr=>{
   const isNearest=(sr===bestStair);
   sr.grp.scale.set(isNearest?1.12:1,1,isNearest?1.12:1);
   sr.grp.traverse(c=>{
    if(c.material) c.material.opacity=isNearest?1.0:(c.isLineSegments?.22:.48);
   });
  });
 }

 function selectFacility(data,beacon){
  const rec=facilityRecords.find(r=>r.data===data)||facilityRecords.find(r=>r.beacon===beacon);
  selected={data,beacon:rec?.beacon||beacon};
  popup.querySelector('.popup-id').textContent=data.id;
  popup.querySelector('h3').textContent=data.name;
  popup.querySelector('p').textContent=data.desc;
  popup.querySelector('.popup-sector').textContent=data.sector+'  /  ELYSIUM';
  popup.classList.add('visible');
  updatePopup();
  highlightConnectedRoutes(rec);
  if(typeof showInfo==='function')showInfo(data.key,data.name,data);
 }
 function pickFacility(ev){
  const rect=canvas.getBoundingClientRect();
  pointer.x=((ev.clientX-rect.left)/rect.width)*2-1;
  pointer.y=-((ev.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  const beaconHits=raycaster.intersectObjects(hitTargets,false);
  if(beaconHits.length){
   const data=beaconHits[0].object.userData.facility;
   const rec=facilityRecords.find(r=>r.data===data);
   return {data,beacon:rec?.beacon||beaconHits[0].object.parent};
  }
  const podHits=raycaster.intersectObjects(sub.children,true).find(h=>h.object.userData?.facility);
  if(podHits){
   const data=podHits.object.userData.facility;
   const rec=facilityRecords.find(r=>r.data===data);
   return {data,beacon:rec?.beacon||podHits.object.parent};
  }
  return null;
 }
 function choose(ev){
  const found=pickFacility(ev);
  if(found){
   selectFacility(found.data,found.beacon);
  } else {
   popup.classList.remove('visible');
   selected=null;
   resetHighlights();
  }
 }
 let down=null;
 canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY}});
 canvas.addEventListener('pointermove',e=>{
  if(down)return;
  const found=pickFacility(e);
  canvas.style.cursor=found?'pointer':'grab';
 });
 canvas.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<9)choose(e);down=null});

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
 function setFilter(fKey){
  selected=null;
  popup.classList.remove('visible');
  resetHighlights();
  if(fKey==='all'){
   facilityRecords.forEach(r=>{
    r.pod.visible=true;
    r.beacon.scale.set(1,1,1);
    r.pod.traverse(c=>{if(c.material && c.material!==hitSphereMat)c.material.opacity=.88;});
   });
   return;
  }
  if(fKey==='evac'){
   // Highlight all emergency exits, evac tunnels, and emergency stair towers
   facilityRecords.forEach(r=>{
    r.beacon.scale.set(.75,.75,.75);
    r.pod.traverse(c=>{if(c.material && c.material!==hitSphereMat)c.material.opacity=.28;});
   });
   tunnelRecords.forEach(tr=>{
    const isEvac=(tr.kind==='evac'||tr.kind==='service');
    tr.mat.opacity=isEvac?.88:.18;
    tr.lMat.opacity=isEvac?1.0:.18;
    tr.rail.scale.set(isEvac?1.5:1,isEvac?1.5:1,isEvac?1.5:1);
   });
   stairRecords.forEach(sr=>{
    sr.grp.scale.set(sr.isEmergency?1.16:1,1,sr.isEmergency?1.16:1);
    sr.grp.traverse(c=>{if(c.material)c.material.opacity=sr.isEmergency?1.0:.22;});
   });
   return;
  }
  // Sector filter: 'elysium', 'sanctum', 'shelter', or 'shared'
  facilityRecords.forEach(r=>{
   const match=(r.data.key===fKey);
   r.beacon.scale.set(match?1.25:.72,match?1.25:.72,match?1.25:.72);
   r.pod.traverse(c=>{
    if(c.material && c.material!==hitSphereMat){
     c.material.opacity=match?.95:.22;
    }
   });
  });
  if(typeof showInfo==='function')showInfo(fKey);
 }
 return {setLayer,setFilter,reset:()=>{setLayer(layer);setFilter('all');},setLabels:v=>{labels=v;scan.visible=v;contourGroup.visible=v;},dispose:()=>{cancelAnimationFrame(rafId);ro.disconnect();renderer.dispose()}};
}

const infoMap={
 elysium:{name:'ELYSIUM',id:'CORE / 001',desc:content.facilities.elysium.description,items:content.facilities.elysium.items},
 sanctum:{name:'SANCTUM',id:'SECTOR / 002',desc:content.facilities.sanctum.description,items:content.facilities.sanctum.items},
 shelter:{name:'THE SHELTER',id:'SECTOR / 003',desc:content.facilities.shelter.description,items:content.facilities.shelter.items},
 shared:{name:'INFRAESTRUCTURA COMPARTIDA',id:'SYSTEM / 004',desc:content.facilities.shared.description,items:content.facilities.shared.items}
};
function showInfo(key,label,facility){
 const d=facility?{name:facility.name,id:facility.id,desc:facility.desc,items:[],restricted:facility.restricted,sector:facility.sector}:(infoMap[key]||infoMap.shared);
 const isElysium=key==='elysium'||d.restricted;
 const extraNotice=isElysium?'<div class="info-restricted">⚠ LUGAR RESTRINGIDO — SOLO ENTRA PERSONAL AUTORIZADO</div>':'';
 $('#infoId').textContent=d.id;
 $('#infoContent').innerHTML=`<div class="info-symbol"${isElysium?' style="border-color:rgba(245,158,66,.55);color:#f59e42"':''}>⌖</div><h2>${d.name}</h2><p>${d.desc}</p>${extraNotice}${d.items.length?`<ul class="facility-list">${d.items.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}<div class="info-hint">${facility?'INSTALACIÓN SELECCIONADA · '+facility.sector:'DISTRIBUCIÓN CONCEPTUAL · CONSULTAR AUTORIZACIÓN DE ACCESO'}</div>`;
}
let mainScene,homeScene;
try{mainScene=createScene($('#mainCanvas'));homeScene=createScene($('#homeCanvas'),true);$('#sceneLoading').classList.add('hidden');setTimeout(()=>$('#sceneLoading')?.remove(),700)}catch(e){console.error(e);$('#sceneLoading').textContent='NO SE PUDO INICIAR EL MOTOR 3D. VERIFICÁ LA CONEXIÓN.'}
$$('.layer-btn').forEach(b=>b.addEventListener('click',()=>{$$('.layer-btn').forEach(x=>x.classList.toggle('active',x===b));mainScene?.setLayer(b.dataset.layer);homeScene?.setLayer(b.dataset.layer)}));
$$('.filter-chip').forEach(chip=>chip.addEventListener('click',()=>{
 $$('.filter-chip').forEach(c=>c.classList.toggle('active',c===chip));
 mainScene?.setFilter(chip.dataset.filter);
}));
$('#resetView').addEventListener('click',()=>{
 mainScene?.setLayer('both');homeScene?.setLayer('both');
 mainScene?.setFilter('all');
 $$('.layer-btn').forEach(x=>x.classList.toggle('active',x.dataset.layer==='both'));
 $$('.filter-chip').forEach(c=>c.classList.toggle('active',c.dataset.filter==='all'));
});
$('#toggleLabels').addEventListener('click',e=>{e.currentTarget.classList.toggle('selected');const v=e.currentTarget.classList.contains('selected');mainScene?.setLabels(v);homeScene?.setLabels(v)});

// Regional map pins (ONLY Elysium and Nexus) + two-segment distance lines
(()=>{
 const geoData={
  elysium:{
   kicker:'UBICACIÓN / BOSQUE',
   title:'Elysium',
   desc:'Refugio subterráneo oculto en el bosque, a 85 km de la orilla de la ciudad.',
   metric:'85 KM DE DISTANCIA A LA ORILLA · +34 KM A NEXUS'
  },
  nexus:{
   kicker:'NÚCLEO URBANO / RED EXTERNA',
   title:'Nexus',
   desc:'Edificio y red central en el interior de la ciudad, a 34 km desde la orilla urbana.',
   metric:'34 KM DE DISTANCIA DESDE LA ORILLA · 119 KM TOTAL'
  }
 };
 const card=$('#geoCard'), closeBtn=$('#geoCardClose');
 const showGeo=(key)=>{
  const d=geoData[key]; if(!d||!card)return;
  $('#geoKicker').textContent=d.kicker;
  $('#geoTitle').textContent=d.title;
  $('#geoDesc').textContent=d.desc;
  $('#geoMetric').textContent=d.metric;
  $$('.geo-pin').forEach(p=>p.classList.toggle('active',p.dataset.geo===key));
  card.classList.add('open');
 };
 $$('.geo-pin').forEach(pin=>{
  pin.addEventListener('click',e=>{e.stopPropagation();showGeo(pin.dataset.geo)});
 });
 closeBtn?.addEventListener('click',()=>{card.classList.remove('open');$$('.geo-pin').forEach(p=>p.classList.remove('active'))});

 const routeBtn=$('#toggleRouteLine'), lines=$$('.route-line'), badges=$$('.dist-badge');
 routeBtn?.addEventListener('click',()=>{
  routeBtn.classList.toggle('active');
  const show=routeBtn.classList.contains('active');
  lines.forEach(l=>l.classList.toggle('visible',show));
  badges.forEach(b=>b.classList.toggle('visible',show));
 });

 const distBtn=$('#openDistanceTool'), inspector=$('#distanceInspector');
 distBtn?.addEventListener('click',()=>{
  distBtn.classList.toggle('active');
  inspector?.classList.toggle('highlighted',distBtn.classList.contains('active'));
  lines.forEach(l=>l.classList.add('visible'));
  badges.forEach(b=>b.classList.add('visible'));
  routeBtn?.classList.add('active');
  if(!card?.classList.contains('open'))showGeo('elysium');
 });
})();
