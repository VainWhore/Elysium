const floors = {
"00":{label:"LEVEL 00 / ACCESS",title:"NÚCLEO CENTRAL",type:"CIRCULACIÓN VERTICAL",desc:"Distribuidor principal del complejo. Conecta los niveles mediante ascensores, escaleras y corredores. La geometría mostrada es conceptual.",nodes:[
["core","NÚCLEO",500,320,"NÚCLEO CENTRAL","CIRCULACIÓN VERTICAL","Distribuidor principal con ascensores, escaleras y conexiones entre niveles."],
["entry","ACCESO",500,90,"ACCESO PRINCIPAL","CONTROL DE INGRESO","Acceso principal oculto. La aproximación exterior y los accesos secundarios todavía deben definirse en el plano maestro."],
["admin","ADMIN",285,230,"ALA ADMINISTRATIVA","ADMINISTRACIÓN","Área destinada a la sala de consejo, archivo general y sala de reuniones."],
["security","SEGURIDAD",715,230,"ALA DE SEGURIDAD","VIGILANCIA Y CONTROL","Área destinada al puesto de vigilancia, zona de aislamiento y red de comunicaciones."]
],rooms:[{x:170,y:175,w:205,h:105,label:"ADMINISTRACIÓN",id:"admin"},{x:625,y:175,w:205,h:105,label:"SEGURIDAD",id:"security"},{x:420,y:265,w:160,h:110,label:"NÚCLEO",id:"core"},{x:420,y:55,w:160,h:70,label:"VESTÍBULO DE ACCESO",id:"entry"}],routes:[[500,125,500,265],[375,230,420,290],[580,290,625,230]]},
"01":{label:"LEVEL −01 / SANCTUM",title:"CENTRO DE MANDO",type:"OPERACIONES",desc:"Centro de operaciones del sector. Selecciona los nodos para consultar las áreas funcionales.",nodes:[
["core","NÚCLEO",500,325,"NÚCLEO CENTRAL","CONEXIÓN VERTICAL","Conexión con los niveles superior e inferior."],
["ops","OPERACIONES",500,135,"CENTRO DE MANDO","OPERACIONES","Centro de mando de Sanctum."],
["research","INVESTIGACIÓN",270,250,"ALA DE INVESTIGACIÓN","LABORATORIO Y NEUROELECT","Incluye laboratorio y oficina de Neuroelect."],
["tech","TECNOLOGÍA",730,250,"ALA TECNOLÓGICA","SERVIDORES Y TALLER","Incluye servidores y taller tecnológico."],
["medical","SERVICIOS",500,505,"ALA DE SERVICIOS","MEDICINA Y VIDA INTERNA","Incluye centro médico, archivo, comedor y dormitorios."],
["green","CULTIVO",270,505,"INVERNADERO","PRODUCCIÓN AGRÍCOLA","Zona de cultivo conectada funcionalmente con el invernadero de The Shelter."]
],rooms:[{x:420,y:85,w:160,h:95,label:"CENTRO DE MANDO",id:"ops"},{x:160,y:195,w:220,h:115,label:"INVESTIGACIÓN",id:"research"},{x:620,y:195,w:220,h:115,label:"TECNOLOGÍA",id:"tech"},{x:420,y:445,w:160,h:110,label:"SERVICIOS",id:"medical"},{x:160,y:450,w:220,h:110,label:"INVERNADERO",id:"green"},{x:420,y:270,w:160,h:110,label:"NÚCLEO",id:"core"}],routes:[[500,180,500,270],[380,250,420,300],[580,300,620,250],[500,380,500,445],[380,505,420,340]]},
"02":{label:"LEVEL −02 / THE SHELTER",title:"PLAZA CENTRAL",type:"VIDA COMUNITARIA",desc:"Espacio central de encuentro y circulación del sector residencial.",nodes:[
["core","NÚCLEO",500,325,"NÚCLEO CENTRAL","CONEXIÓN VERTICAL","Conexión con los demás niveles."],
["plaza","PLAZA",500,325,"PLAZA CENTRAL","ESPACIO COMUNITARIO","Punto principal de encuentro y distribución de The Shelter."],
["commerce","COMERCIO",270,235,"ALA COMERCIAL","MERCADO Y BAR","Incluye mercado, bar y comedor comunitario."],
["social","SOCIAL",730,235,"ALA SOCIAL","CONVIVENCIA","Incluye sala común, zona creativa y taller."],
["residence","RESIDENCIAL",270,495,"ALA RESIDENCIAL","HABITACIÓN Y CUIDADOS","Incluye dormitorios y enfermería."],
["green","PRODUCCIÓN",730,495,"ALA DE PRODUCCIÓN","CULTIVO Y ABASTECIMIENTO","Incluye invernadero y almacén. El invernadero se conecta con el de Sanctum."]
],rooms:[{x:420,y:260,w:160,h:125,label:"PLAZA CENTRAL",id:"plaza"},{x:160,y:175,w:220,h:115,label:"COMERCIO",id:"commerce"},{x:620,y:175,w:220,h:115,label:"ZONA SOCIAL",id:"social"},{x:160,y:440,w:220,h:115,label:"RESIDENCIAL",id:"residence"},{x:620,y:440,w:220,h:115,label:"PRODUCCIÓN",id:"green"}],routes:[[380,230,420,290],[580,290,620,230],[420,350,380,495],[580,350,620,495]]},
"03":{label:"LEVEL −03 / INFRASTRUCTURE",title:"SERVICIOS TÉCNICOS",type:"INFRAESTRUCTURA COMPARTIDA",desc:"Nivel técnico propuesto para alojar los sistemas de soporte del complejo. Su composición queda pendiente de validación.",nodes:[
["core","NÚCLEO",500,325,"NÚCLEO CENTRAL","CONEXIÓN VERTICAL","Conexión de servicio entre niveles."],
["power","ENERGÍA",270,220,"DISTRIBUCIÓN ENERGÉTICA","SERVICIO PROPUESTO","Espacio reservado para generación y distribución eléctrica, sujeto a definición."],
["water","AGUA",730,220,"TRATAMIENTO DE AGUA","SERVICIO PROPUESTO","Espacio reservado para tratamiento y almacenamiento de agua, sujeto a definición."],
["air","VENTILACIÓN",270,485,"VENTILACIÓN","SERVICIO PROPUESTO","Espacio reservado para climatización y renovación del aire."],
["maint","MANTENIMIENTO",730,485,"MANTENIMIENTO","SERVICIO PROPUESTO","Espacio reservado para gestión de residuos, mantenimiento y almacén técnico."]
],rooms:[{x:160,y:165,w:220,h:110,label:"ENERGÍA",id:"power"},{x:620,y:165,w:220,h:110,label:"AGUA",id:"water"},{x:160,y:435,w:220,h:110,label:"VENTILACIÓN",id:"air"},{x:620,y:435,w:220,h:110,label:"MANTENIMIENTO",id:"maint"},{x:420,y:270,w:160,h:110,label:"NÚCLEO",id:"core"}],routes:[[380,220,420,295],[580,295,620,220],[380,490,420,350],[580,350,620,490]]}
};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let currentFloor="00",selectedNode=null;
function svgEl(tag,attrs={},parent){const e=document.createElementNS("http://www.w3.org/2000/svg",tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));if(parent)parent.appendChild(e);return e}
function drawMap(){
 const f=floors[currentFloor],structure=$("#mapStructure"),nodes=$("#mapNodes"),routes=$("#mapRoutes");structure.innerHTML="";nodes.innerHTML="";routes.innerHTML="";
 f.routes.forEach(r=>{svgEl("path",{d:`M${r[0]} ${r[1]} L${r[2]} ${r[3]}`,class:"corridor"},routes);svgEl("path",{d:`M${r[0]} ${r[1]} L${r[2]} ${r[3]}`,class:"corridor-edge"},routes)});
 f.rooms.forEach(room=>{const g=svgEl("g",{},structure);svgEl("rect",{x:room.x,y:room.y,width:room.w,height:room.h,rx:3,class:"room"},g);svgEl("path",{d:`M${room.x+10} ${room.y+12}h18 M${room.x+room.w-28} ${room.y+room.h-12}h18`,stroke:"#70d8ee","stroke-width":1,opacity:.65},g);const t=svgEl("text",{x:room.x+room.w/2,y:room.y+room.h/2+4,class:"room-label"},g);t.textContent=room.label});
 const core=svgEl("g",{},structure);svgEl("rect",{x:458,y:282,width:84,height:76,rx:2,class:"shaft"},core);svgEl("path",{d:"M472 295v50m28-50v50m28-50v50",stroke:"#65d9f1","stroke-width":1.2,opacity:.8},core);svgEl("text",{x:500,y:372,"text-anchor":"middle",fill:"#8bdff2","font-size":8,"font-family":"DM Mono"},core).textContent="LIFT / STAIR CORE";
 f.nodes.forEach(n=>{const g=svgEl("g",{class:"node","data-id":n[0]},nodes);svgEl("circle",{cx:n[2],cy:n[3],r:n[0]==="core"?8:6},g);const label=svgEl("text",{x:n[2],y:n[3]-13},g);label.textContent=n[1];g.addEventListener("click",()=>selectNode(n,g))});
 $("#floorLabel").textContent=f.label;$("#nodeTitle").textContent=f.title;$("#nodeDesc").textContent=f.desc;$("#nodeId").textContent=`SYS / ${currentFloor}`;$(".node-type").textContent=f.type;$$(".node").forEach(n=>n.classList.remove("selected"));selectedNode=null;
}
function selectNode(n,g){$$(".node").forEach(x=>x.classList.remove("selected"));if(g)g.classList.add("selected");selectedNode=n[0];$("#nodeId").textContent=`NODE / ${n[0].toUpperCase()}`;$("#nodeTitle").textContent=n[4];$(".node-type").textContent=n[5];$("#nodeDesc").textContent=n[6];}
$$(".level-tab").forEach(b=>b.addEventListener("click",()=>{$$(".level-tab").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");currentFloor=b.dataset.level;drawMap()}));
$("#routeToggle").addEventListener("click",e=>{e.currentTarget.classList.toggle("selected");$("#facilityMap").classList.toggle("route-hidden")});
$("#gridToggle").addEventListener("click",e=>{e.currentTarget.classList.toggle("selected");$("#facilityMap").classList.toggle("grid-hidden")});
$("#resetMap").addEventListener("click",()=>{currentFloor="00";$$(".level-tab").forEach(x=>x.classList.toggle("selected",x.dataset.level==="00"));$("#facilityMap").classList.remove("route-hidden","grid-hidden");$("#routeToggle").classList.add("selected");$("#gridToggle").classList.add("selected");drawMap()});
function showView(name){$$(".view").forEach(v=>v.classList.toggle("active",v.id===`view-${name}`));$$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===name));$("#crumb").textContent=({overview:"VISTA GENERAL",map:"COMPLEJO SUBTERRÁNEO",history:"HISTORIA Y CRONOLOGÍA",nexus:"NEXUS",sectors:"SECTORES",records:"REGISTROS",gallery:"GALERÍA VISUAL"})[name]||name.toUpperCase();window.scrollTo({top:0,behavior:"smooth"})}
$$(".nav-item").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
$$("[data-jump]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.jump)));
drawMap();
