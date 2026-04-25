const APP_VERSION = "6.0.0-potstake-horizontal-composite";
const INCH = 96;
const LABEL_SIZES = { POT:{widthIn:5,heightIn:.75}, WRAP:{widthIn:5,heightIn:.5} };

/*
  APP.JS ONLY UPDATE
  - Injects required CSS fixes so you do not need to replace styles.css.
  - Uses built-in v4 POT defaults even if old layout JSON files are still in repo.
  - Clears old saved working layouts once for this app version.
*/

(function injectV4Css(){
  const css = `
    .labelCanvas{background:#fff;color:#000;position:relative;overflow:hidden;border:1px solid rgba(0,0,0,.5);box-shadow:0 20px 50px rgba(0,0,0,.35)}
    .stageInner{position:relative;transform-origin:center top}
    .obj{position:absolute;border:1px dashed rgba(250,204,21,.55);user-select:none;touch-action:none;overflow:visible}
    .obj.selected{border:2px solid #facc15;background:rgba(250,204,21,.08)}
    .obj.locked{border-color:rgba(248,113,113,.9)}
    .inner{position:absolute;display:flex;overflow:hidden;align-items:center;justify-content:center;text-align:center;line-height:.95;white-space:nowrap;text-transform:uppercase;font-family:"Times New Roman",Georgia,serif;font-weight:900;transform-origin:center center}
    .obj img,.obj canvas{width:100%;height:100%;display:block;image-rendering:pixelated}
    .handle{display:none;position:absolute;width:10px;height:10px;background:#facc15;border:1px solid #111827;border-radius:3px;z-index:20}
    .obj.selected .handle{display:block}
    .handle.n{top:-6px;left:50%;margin-left:-5px;cursor:ns-resize}
    .handle.s{bottom:-6px;left:50%;margin-left:-5px;cursor:ns-resize}
    .handle.e{right:-6px;top:50%;margin-top:-5px;cursor:ew-resize}
    .handle.w{left:-6px;top:50%;margin-top:-5px;cursor:ew-resize}
    .handle.ne{right:-6px;top:-6px;cursor:nesw-resize}
    .handle.nw{left:-6px;top:-6px;cursor:nwse-resize}
    .handle.se{right:-6px;bottom:-6px;cursor:nwse-resize}
    .handle.sw{left:-6px;bottom:-6px;cursor:nesw-resize}
    .gridOverlay{position:absolute;inset:0;pointer-events:none;z-index:4;opacity:.28}
    .safeZone{position:absolute;border:1px dashed rgba(239,68,68,.7);pointer-events:none;z-index:5}
    .guide{position:absolute;background:#38bdf8;box-shadow:0 0 8px rgba(56,189,248,.8);pointer-events:none;z-index:99}
    .guide.v{width:1px;top:-9999px;height:20000px}
    .guide.h{height:1px;left:-9999px;width:20000px}
    .stageMeta{display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:center;margin:0 0 6px 0;padding:8px 10px;border:1px solid rgba(255,255,255,.12);border-radius:10px;background:rgba(255,255,255,.04);color:#e5e7eb}\n    .stageStack{display:flex;flex-direction:column;align-items:center;gap:16px;width:100%;padding-top:8px}
    .stageMeta .metaPill{display:inline-flex;gap:6px;align-items:center;padding:5px 9px;border-radius:999px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.04);font-size:12px}
    .stageMeta .metaPill.colorPill{font-weight:700}
    .stageMeta b{color:#fff}
    .table thead th{position:sticky;top:0;z-index:8;background:#0f172a;box-shadow:0 1px 0 rgba(255,255,255,.08)}
    .table{border-collapse:separate;border-spacing:0}

    .table thead th{position:sticky!important;top:0!important;z-index:50!important;background:#121a2c!important;color:#e5e7eb!important;box-shadow:0 2px 0 rgba(0,0,0,.45)!important}
    .table{border-collapse:separate!important;border-spacing:0!important}
    .stageStack{padding-top:26px!important;gap:18px!important}
    .stageMeta{position:relative!important;z-index:25!important;background:#121a2c!important}
    .modeTabs{display:inline-flex;gap:6px;align-items:center;margin-left:6px}
    .modeTab{border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(255,255,255,.04);color:#e5e7eb;padding:8px 12px;font-size:13px;font-weight:800;cursor:pointer}
    .modeTab.active{border-color:#60a5fa;background:rgba(96,165,250,.18)}
    .potMain{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;line-height:.92;padding:2px 4px;white-space:normal;word-break:break-word;overflow-wrap:anywhere}
    .potMain .scion{font-weight:900}
    .potMain .onLine{font-weight:900}
    .potMain .onWord{font-size:.72em;margin-right:.18em}
    .potMain .rootstock{font-size:1em}
    .potMain .patentLine{font-size:.34em;line-height:1.05;margin-top:2px}
    .potMetaText{position:absolute;inset:0;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;text-align:left;line-height:.94;padding:2px 4px;white-space:pre-line;word-break:break-word;overflow-wrap:anywhere}
    .potWarningText{position:absolute;inset:0;display:flex;align-items:center;justify-content:flex-start;text-align:left;line-height:1.02;padding:2px 3px;white-space:pre-line;font-weight:900}
    .potStatic{position:absolute;pointer-events:none}
    .potLogo{object-fit:contain;image-rendering:auto;background:#fff}
  `;
  const tag = document.createElement("style");
  tag.setAttribute("data-beinvt-v4-css", "1");
  tag.textContent = css;
  document.head.appendChild(tag);
})();

if(localStorage.getItem("beinvtAppVersion") !== APP_VERSION){
  localStorage.removeItem("beinvtWorkingLayout_POT");
  localStorage.removeItem("beinvtWorkingLayout_WRAP");
  localStorage.setItem("beinvtAppVersion", APP_VERSION);
}

let DEFAULT_LAYOUTS={}, labelType="POT", rows=[], filteredRows=[], currentRowIndex=0, selectedId="ITEM", layout=null;
let showSafeZone=true, showGrid=false, testMode=false;
let calibration=JSON.parse(localStorage.getItem("beinvtCalibration")||'{"scaleX":1,"scaleY":1}');
let presets=JSON.parse(localStorage.getItem("beinvtLayoutPresets")||"{}");
let queue=JSON.parse(localStorage.getItem("beinvtPrintQueue")||"[]");
let undoStack=[], redoStack=[], isRestoring=false;
let potAutoLayoutKey="";

const $=id=>document.getElementById(id);
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const cap=s=>String(s??"").toUpperCase();
const clone=o=>JSON.parse(JSON.stringify(o));

function sizePx(type=labelType){
  const s=LABEL_SIZES[type];
  return {w:Math.round(s.widthIn*INCH), h:Math.round(s.heightIn*INCH)};
}

function pushHistory(){
  if(isRestoring||!layout)return;
  undoStack.push(clone(layout));
  if(undoStack.length>100)undoStack.shift();
  redoStack=[];
  updateUndoButtons();
}
function undo(){
  if(!undoStack.length)return;
  redoStack.push(clone(layout));
  isRestoring=true;
  layout=undoStack.pop();
  labelType=layout.labelType||labelType;
  isRestoring=false;
  saveWorkingLayout();
  renderAll();
  updateUndoButtons();
}
function redo(){
  if(!redoStack.length)return;
  undoStack.push(clone(layout));
  isRestoring=true;
  layout=redoStack.pop();
  labelType=layout.labelType||labelType;
  isRestoring=false;
  saveWorkingLayout();
  renderAll();
  updateUndoButtons();
}
function updateUndoButtons(){
  if($("undoBtn")) $("undoBtn").disabled=!undoStack.length;
  if($("redoBtn")) $("redoBtn").disabled=!redoStack.length;
}

async function loadDefaults(){
  // app.js-only update: use built-in corrected defaults so old JSON files do not keep bad positions.
  DEFAULT_LAYOUTS.POT = fallbackLayout("POT");
  DEFAULT_LAYOUTS.WRAP = fallbackLayout("WRAP");
}

function fallbackLayout(t){
  if(t==="POT") return {
    name:"Pot Standard v6",
    labelType:"POT",
    safeMarginPx:4,
    gridPx:4,
    objects:{
      QR:{x:6,y:14,w:34,h:34,rot:0,locked:false,visible:true},
      WO:{x:44,y:5,w:86,h:60,rot:0,fontSize:16,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"left",alignV:"middle"},
      ITEM:{x:128,y:4,w:190,h:60,rot:0,fontSize:26,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      WEEK:{x:396,y:4,w:80,h:62,rot:0,fontSize:7,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"left",alignV:"middle"}
    }
  };
  return {
    name:"Wrap Standard v4",
    labelType:"WRAP",
    safeMarginPx:3,
    gridPx:4,
    objects:{
      WO:{x:8,y:13,w:96,h:18,rot:0,fontSize:16,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      QR:{x:104,y:4,w:40,h:40,rot:0,locked:false,visible:true},
      ITEM:{x:142,y:5,w:315,h:38,rot:0,fontSize:30,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      WEEK:{x:460,y:12,w:18,h:24,rot:-90,fontSize:12,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"}
    }
  };
}

function setLayout(n,keepHist=true){
  if(keepHist)pushHistory();
  layout=clone(n);
  labelType=layout.labelType||labelType;
  potAutoLayoutKey="";
  clampAllObjects();
  saveWorkingLayout();
  renderAll();
}
function saveWorkingLayout(){
  localStorage.setItem("beinvtWorkingLayout_"+labelType,JSON.stringify(layout));
}
function loadWorkingLayout(type){
  try{
    const s=localStorage.getItem("beinvtWorkingLayout_"+type);
    if(s)return JSON.parse(s);
  }catch(e){}
  return clone(DEFAULT_LAYOUTS[type]||fallbackLayout(type));
}

function parseCsv(text){
  const out=[]; let row=[],cur="",q=false;
  for(let i=0;i<text.length;i++){
    const ch=text[i];
    if(q){
      if(ch=='"'){
        if(text[i+1]=='"'){cur+='"';i++}
        else q=false;
      }else cur+=ch;
    }else{
      if(ch=='"')q=true;
      else if(ch==","){row.push(cur);cur=""}
      else if(ch=="\n"){row.push(cur);out.push(row);row=[];cur=""}
      else if(ch!="\r")cur+=ch;
    }
  }
  row.push(cur); out.push(row);
  while(out.length&&out[out.length-1].every(c=>!String(c).trim()))out.pop();
  return out;
}

async function loadCsv(){
  const txt=await(await fetch("data/labels.csv?cache="+Date.now())).text();
  const g=parseCsv(txt);
  if(!g.length)return;
  const h=g[0].map(x=>x.trim());
  rows=g.slice(1).map(line=>{
    const o={}; h.forEach((k,i)=>o[k]=line[i]||"");
    const act=o["Activity Code"]||"";
    return {
      wo:o["Work Order"]||"",
      act,
      crop:o["Crop"]||"",
      scion:o["Scion"]||"",
      rootstock:o["Rootstock"]||"",
      internalId:o["Internal ID"]||"",
      lotNumber:o["Lot Number"]||"",
      scionPatent:o["Scion Patent"]||"",
      rootstockPatent:o["Rootstock Patent"]||"",
      tray:o["Tray Type"]||"",
      labelColor:o["Label Color"]||"",
      quantity:o["Quantity"]||"1",
      labelsNeeded:normalizeLabelCount(o["Labels Needed"]||"1"),
      week:currentWeekNumber()
    };
  }).filter(r=>r.wo);
  filteredRows=rows.slice();
  renderRows();
}

function isoWeekNumber(date){
  if(!(date instanceof Date)||isNaN(date))return"";
  const d=new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate()));
  const day=d.getUTCDay()||7;
  d.setUTCDate(d.getUTCDate()+4-day);
  const y0=new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return String(Math.ceil((((d-y0)/86400000)+1)/7));
}
function currentWeekNumber(){
  return isoWeekNumber(new Date());
}

function currentRow(){
  if(testMode)return {
    wo:"WO9999999999",
    act:"INITIATION",
    crop:"OLIVE",
    scion:"SUPER LONG OLIVE VARIETY NAME THAT SHOULD AUTO FIT",
    rootstock:"EXTREMELY LONG ROOTSTOCK NAME FOR WORST CASE TESTING",
    labelColor:"TEST PINK",
    quantity:"3",
    labelsNeeded:"3",
    internalId:"27047",
    lotNumber:"2026",
    scionPatent:"USPP 12345",
    rootstockPatent:"USPP 67890",
    week:"52"
  };
  return filteredRows[currentRowIndex]||rows[0]||{
    wo:"WO123456",
    scion:"ARBEQUINA",
    rootstock:"TEST ROOTSTOCK",
    crop:"OLIVE",
    labelColor:"WHITE",
    quantity:"1",
    week:"17",
    act:"INITIATION",
    internalId:"27047",
    lotNumber:"2026",
    scionPatent:"",
    rootstockPatent:"",
    labelsNeeded:"1"
  };
}

function potWarningText(){
  return `WARNING: ASEXUAL
REPRODUCTION OF SCIONS,
BUDS, OR CUTTINGS
WHETHER FOR SALE
OR OWN USE IS
PROHIBITED UNDER
U.S. PLANT PATENT LAWS.
SALES OUTSIDE THE
U.S. ARE PROHIBITED.`;
}
function patentPieces(row){
  const out=[];
  const sp=cap(row.scionPatent||"").trim();
  const rp=cap(row.rootstockPatent||"").trim();
  if(sp) out.push(sp);
  if(rp) out.push(rp);
  return out;
}
function potLotQrText(row){
  return String(row.lotNumber||row.internalId||row.wo||"").trim() || String(row.wo||"").trim();
}
function labelText(id,row){
  if(id==="WO"){
    if(labelType==="POT") return [cap(row.wo||"WO"), cap(row.crop||""), cap(row.internalId||"")].filter(Boolean).join("\n");
    return cap(row.wo||"WO");
  }
  if(id==="ITEM"){
    const sc=cap(row.scion||"").trim();
    const rt=cap(row.rootstock||row.scion||"ITEM").trim();
    if(labelType==="POT") return [sc||cap(row.crop||""), rt].filter(Boolean).join(" ");
    const olive=/olive/i.test(row.crop||"");
    return cap(olive?(row.scion||row.rootstock||"ITEM"):(row.rootstock||row.scion||"ITEM"));
  }
  if(id==="WEEK"){
    if(labelType==="POT") return potWarningText();
    return cap(currentWeekNumber());
  }
  return "";
}

function normalizeColorName(name){
  return String(name||"").trim().toLowerCase().replace(/\s+/g,"");
}
function colorMeta(name){
  const raw=String(name||"").trim();
  const key=normalizeColorName(raw);
  const map={
    hotpink:{bg:"#ff69b4",fg:"#111827"},pink:{bg:"#ec4899",fg:"#111827"},red:{bg:"#ef4444",fg:"#ffffff"},
    yellow:{bg:"#facc15",fg:"#111827"},turquoise:{bg:"#40e0d0",fg:"#111827"},white:{bg:"#ffffff",fg:"#111827"},
    blue:{bg:"#3b82f6",fg:"#ffffff"},green:{bg:"#22c55e",fg:"#111827"},orange:{bg:"#fb923c",fg:"#111827"},
    purple:{bg:"#a855f7",fg:"#ffffff"},black:{bg:"#111827",fg:"#ffffff"},gray:{bg:"#9ca3af",fg:"#111827"},grey:{bg:"#9ca3af",fg:"#111827"}
  };
  if(map[key]) return {...map[key], label: raw.toUpperCase()};
  const probe=document.createElement("span");
  probe.style.color=key;
  if(probe.style.color) return {bg:key,fg:"#111827",label:raw.toUpperCase()};
  return {bg:"rgba(255,255,255,.08)",fg:"#e5e7eb",label:raw.toUpperCase()||"UNKNOWN"};
}

function normalizeLabelCount(v){
  const n=parseFloat(String(v??"").replace(/,/g,"").trim());
  if(isFinite(n)) return String(Math.max(1,Math.ceil(n)));
  const raw=String(v??"").trim();
  return raw || "1";
}
function displayLabelsNeeded(row){
  return normalizeLabelCount(row && row.labelsNeeded);
}
function measureTextPx(text,fontPx,fontFamily){
  try{
    const c=measureTextPx._c||(measureTextPx._c=document.createElement("canvas"));
    const ctx=c.getContext("2d");
    ctx.font=`900 ${Number(fontPx||22)}px "${fontFamily||"Times New Roman"}", Georgia, serif`;
    return Math.ceil(ctx.measureText(String(text||"")).width);
  }catch(e){
    return Math.ceil(String(text||"").length*Number(fontPx||22)*0.62);
  }
}
function ensureModeTabs(){
  const sel=$("labelType");
  if(!sel||document.getElementById("modeTabs"))return;
  sel.style.display="none";
  const tabs=document.createElement("div");
  tabs.id="modeTabs";
  tabs.className="modeTabs";
  tabs.innerHTML='<button type="button" class="modeTab" data-mode="POT">Pot Stakes</button><button type="button" class="modeTab" data-mode="WRAP">Wrap Ties</button>';
  sel.parentNode.insertBefore(tabs, sel.nextSibling);
  tabs.addEventListener("click",function(e){
    const b=e.target.closest("[data-mode]");
    if(!b)return;
    labelType=b.getAttribute("data-mode");
    selectedId="ITEM";
    undoStack=[];
    redoStack=[];
    setLayout(loadWorkingLayout(labelType),false);
    renderRows();
    updateModeTabs();
  });
  updateModeTabs();
}
function updateModeTabs(){
  const tabs=document.querySelectorAll(".modeTab[data-mode]");
  tabs.forEach(b=>b.classList.toggle("active",b.getAttribute("data-mode")===labelType));
  if($("labelType")) $("labelType").value=labelType;
}

function currentPotAutoKey(){
  const row=currentRow();
  return [labelType,row.wo||"",labelText("ITEM",row),currentWeekNumber()].join("|");
}
function syncPotAutoLayout(force=false){
  if(labelType!=="POT") return;
  const key=currentPotAutoKey();
  if(!force && potAutoLayoutKey===key) return;
  applyPotAutoStack();
  potAutoLayoutKey=key;
}

function qrUrl(text){
  return "https://quickchart.io/qr?size=220&text="+encodeURIComponent(text||" ");
}

function applyPotAutoStack(){
  if(labelType!=="POT"||!layout||!layout.objects)return;
  const objs=layout.objects;
  const limit=350;
  const row=currentRow();
  const wo=objs.WO, qr=objs.QR, item=objs.ITEM, week=objs.WEEK;

  if(wo){
    wo.rot=0;
    wo.x=3; wo.y=8; wo.w=66; wo.h=18;
  }

  if(qr){
    qr.rot=0;
    qr.w=clamp(Number(qr.w||46),34,50);
    qr.h=clamp(Number(qr.h||46),34,50);
    qr.x=Math.round((72-qr.w)/2);
    qr.y=(wo?Number(wo.y||0)+Number(wo.h||18)+2:28);
  }

  if(item){
    item.x=2;
    item.w=68;
    item.rot=90;
    item.alignH='center';
    item.alignV='middle';
    item.y=(qr?Number(qr.y||0)+Number(qr.h||0)+2:82);

    const weekH=(week&&Number(week.h||24))||24;
    const maxH=Math.max(38,limit-weekH-2-Number(item.y||0));
    const txt=labelText("ITEM",row);
    const measured=measureTextPx(txt,Number(item.fontSize||22),item.fontFamily);
    item.h=clamp(measured+4,38,maxH);
  }

  if(week){
    week.rot=0;
    week.w=50;
    week.h=24;
    week.x=Math.round((72-week.w)/2);
    week.y=clamp(Math.round((item?Number(item.y||0)+Number(item.h||0)+2:320)),0,Math.max(0,limit-Number(week.h||24)));
  }

  clampAllObjects();
}

let __potTightenPass=false;
function tightenPotLayoutAfterFit(){
  if(labelType!=="POT"||!layout||!layout.objects||__potTightenPass)return false;
  const item=layout.objects.ITEM, week=layout.objects.WEEK;
  const itemEl=document.querySelector('.obj[data-id="ITEM"]');
  const inner=itemEl&&itemEl.querySelector('.inner');
  if(!item||!week||!itemEl||!inner)return false;
  try{
    const z=Number(($("zoom")&&$("zoom").value)||1)||1;
    const rg=document.createRange();
    rg.selectNodeContents(inner);
    const tr=rg.getBoundingClientRect();
    const neededH=Math.max(40,Math.ceil(tr.height/z)+8);
    const limit=activeBottomLimit();
    const weekH=Number(week.h||24);
    const maxH=Math.max(40,limit-weekH-6-Number(item.y||0));
    const nextH=clamp(neededH,40,maxH);
    const nextWeekY=clamp(Math.round(Number(item.y||0)+nextH+4),0,Math.max(0,limit-weekH));
    const changed=Math.abs(nextH-Number(item.h||0))>1 || Math.abs(nextWeekY-Number(week.y||0))>1;
    if(!changed)return false;
    item.h=Math.round(nextH);
    week.y=Math.round(nextWeekY);
    clampAllObjects();
    return true;
  }catch(err){
    return false;
  }
}

function renderAll(){
  ensureModeTabs();
  updateModeTabs();
  if($("labelType")) $("labelType").value=labelType;
  if($("safeToggle")) $("safeToggle").checked=showSafeZone;
  if($("gridToggle")) $("gridToggle").checked=showGrid;
  renderRows();
  renderCanvas();
  renderObjectPanel();
  syncControls();
  renderPresetList();
  renderQueue();
  updateUndoButtons();
}

function renderCanvas(){
  const host=$("canvasHost");
  if(!host) return;
  host.innerHTML="";
  syncPotAutoLayout();
  const s=sizePx(), zoom=Number(($("zoom")&&$("zoom").value)||1);
  const row=currentRow();
  const cm=colorMeta(row.labelColor||"");
  const stack=document.createElement("div");
  stack.className="stageStack";
  const meta=document.createElement("div");
  meta.className="stageMeta";
  meta.style.alignSelf='center';
  meta.innerHTML=`
    <span class="metaPill colorPill" style="background:${escapeHtml(cm.bg)};color:${escapeHtml(cm.fg)};border-color:${escapeHtml(cm.fg==='#ffffff'?'rgba(255,255,255,.35)':'rgba(17,24,39,.2)')}">Label Color <b style="color:${escapeHtml(cm.fg)}">${escapeHtml(cm.label)}</b></span>
    <span class="metaPill">Qty <b>${escapeHtml(displayLabelsNeeded(row))}</b></span>
  `;
  stack.appendChild(meta);
  const stage=document.createElement("div");
  stage.className="stageInner";
  stage.style.transformOrigin="center top";
  stage.style.transform=`scale(${zoom})`;

  const lab=document.createElement("div");
  lab.className="labelCanvas";
  lab.style.width=s.w+"px";
  lab.style.height=s.h+"px";
  stage.appendChild(lab);

  if(showGrid){
    const gp=Number(($("gridPx")&&$("gridPx").value)||layout.gridPx||4);
    const gr=document.createElement("div");
    gr.className="gridOverlay";
    gr.style.backgroundImage=`linear-gradient(to right, rgba(2,6,23,.28) 1px, transparent 1px),linear-gradient(to bottom, rgba(2,6,23,.28) 1px, transparent 1px)`;
    gr.style.backgroundSize=`${gp}px ${gp}px`;
    lab.appendChild(gr);
  }

  if(showSafeZone){
    const safe=document.createElement("div");
    safe.className="safeZone";
    const m=Number(layout.safeMarginPx||0);
    safe.style.left=m+"px";
    safe.style.top=m+"px";
    safe.style.width=Math.max(1,s.w-2*m)+"px";
    safe.style.height=Math.max(1,s.h-2*m)+"px";
    lab.appendChild(safe);
  }

  const ids=(labelType==="POT")?["QR","WO","ITEM","WEEK"]:["WO","QR","ITEM","WEEK"];
  for(const id of ids){
    const o=layout.objects[id];
    if(!o||o.visible===false)continue;
    const el=document.createElement("div");
    el.className="obj"+(selectedId===id?" selected":"")+(o.locked?" locked":"");
    el.dataset.id=id;
    Object.assign(el.style,{left:o.x+"px",top:o.y+"px",width:o.w+"px",height:o.h+"px"});
    if(id==="QR") renderQrInto(el,row.wo);
    else el.appendChild(makeTextInner(id,row,o));
    lab.appendChild(el);
    attachObjectEvents(el);
  }

  if(labelType==="POT"){
    const lot=document.createElement("div");
    lot.className='potStatic';
    Object.assign(lot.style,{left:'330px',top:'8px',width:'38px',height:'38px'});
    renderQrInto(lot,potLotQrText(row));
    lab.appendChild(lot);

    const logo=document.createElement('img');
    logo.className='potStatic potLogo';
    logo.src='https://11150895.app.netsuite.com/core/media/media.nl?id=154769&c=11150895&h=gz_jC4_Zsi8evEFt-sGPjDNJhRvthM-3uNCqvPr8uc5CrgD1&fcts=20251229204334&whence=';
    Object.assign(logo.style,{left:'374px',top:'12px',width:'22px',height:'22px'});
    lab.appendChild(logo);
  }

  stack.appendChild(stage);
  host.appendChild(stack);
  autoFitTextObjects();
}

function makeTextInner(id,row,o){
  const c=document.createElement("div");
  c.className="inner";
  c.dataset.textId=id;
  c.style.fontSize=(o.fontSize||16)+"px";
  c.style.fontFamily=`"${o.fontFamily||"Times New Roman"}", Georgia, serif`;
  c.style.justifyContent=alignH(o.alignH);
  c.style.alignItems=alignV(o.alignV);
  c.style.textAlign="center";

  if(labelType==="POT" && id==="WO"){
    c.className='potMetaText';
    c.textContent=labelText(id,row);
    c.style.fontSize=(o.fontSize||16)+"px";
    return c;
  }
  if(labelType==="POT" && id==="ITEM"){
    const sc=cap(row.scion||"").trim() || cap(row.crop||"").trim() || "SCION";
    const rt=cap(row.rootstock||"").trim() || "ROOTSTOCK";
    const patents=patentPieces(row);
    c.className='potMain';
    c.innerHTML=`<div class="scion">${escapeHtml(sc)}</div><div class="onLine"><span class="onWord">ON</span><span class="rootstock">${escapeHtml(rt)}</span></div>${patents.length?`<div class="patentLine">${escapeHtml(patents.join(' | '))}</div>`:''}`;
    c.style.fontSize=(o.fontSize||26)+"px";
    return c;
  }
  if(labelType==="POT" && id==="WEEK"){
    c.className='potWarningText';
    c.textContent=potWarningText();
    c.style.fontSize=(o.fontSize||7)+"px";
    return c;
  }

  c.textContent=labelText(id,row);
  if(id==="ITEM"){
    c.style.justifyContent='center';
    c.style.alignItems='center';
    c.style.whiteSpace="normal";
    c.style.wordBreak="break-word";
    c.style.overflowWrap="anywhere";
    c.style.padding="1px 2px";
  }
  applyInnerRotation(c,o);
  return c;
}

function applyInnerRotation(c,o){
  const r=((Number(o.rot||0)%360)+360)%360, swap=(r===90||r===270);
  c.style.left = swap ? ((o.w-o.h)/2)+"px" : "0px";
  c.style.top = swap ? ((o.h-o.w)/2)+"px" : "0px";
  c.style.width = (swap?o.h:o.w)+"px";
  c.style.height = (swap?o.w:o.h)+"px";
  c.style.transform = `rotate(${Number(o.rot||0)}deg)`;
}

function renderQrInto(el,text){
  const img=document.createElement("img");
  img.src=qrUrl(text);
  img.alt="QR";
  img.onerror=function(){
    el.innerHTML="";
    const c=document.createElement("canvas");
    el.appendChild(c);
    if(window.BEINVT_QR_FALLBACK)window.BEINVT_QR_FALLBACK.draw(c,text);
  };
  el.appendChild(img);
}

function alignH(v){return v==="left"?"flex-start":v==="right"?"flex-end":"center"}
function alignV(v){return v==="top"?"flex-start":v==="bottom"?"flex-end":"center"}

function autoFitTextObjects(){
  for(const id of["WO","ITEM","WEEK"]){
    const e=document.querySelector(`.obj[data-id="${id}"]`);
    if(!e)continue;
    const c=e.firstElementChild;
    if(!c)continue;
    const o=layout.objects[id], r=((Number(o.rot||0)%360)+360)%360, swap=(r===90||r===270);
    const maxW=swap?o.h:o.w, maxH=swap?o.w:o.h;
    let hi=Number(o.fontSize||16), lo=6, best=lo;
    c.style.fontSize=hi+"px";
    if(c.scrollWidth<=maxW && c.scrollHeight<=maxH)continue;
    while(lo<=hi){
      const mid=Math.floor((lo+hi)/2);
      c.style.fontSize=mid+"px";
      if(c.scrollWidth<=maxW && c.scrollHeight<=maxH){best=mid;lo=mid+1}
      else hi=mid-1;
    }
    c.style.fontSize=best+"px";
  }
}

function attachObjectEvents(el){
  const id=el.dataset.id;
  el.addEventListener("pointerdown",e=>{
    e.stopPropagation();
    selectObject(id);
    if(layout.objects[id].locked||e.target.classList.contains("handle"))return;
    startMove(e,el,id);
  });
  for(const dir of["n","s","e","w","ne","nw","se","sw"]){
    const h=document.createElement("div");
    h.className="handle "+dir;
    h.dataset.dir=dir;
    h.addEventListener("pointerdown",e=>{
      e.stopPropagation();
      e.preventDefault();
      selectObject(id);
      if(layout.objects[id].locked)return;
      startResize(e,el,id,dir);
    });
    el.appendChild(h);
  }
}

function labelBounds(){return sizePx()}
function activeBottomLimit(){const b=labelBounds(); return labelType==="POT"?Math.min(350,b.h):b.h}
function gridSnapVal(v){
  const snapGrid=$("snapGridToggle");
  if(!snapGrid||!snapGrid.checked)return v;
  const g=Number(($("gridPx")&&$("gridPx").value)||layout.gridPx||4);
  return Math.round(v/g)*g;
}

function startMove(e,el,id){
  pushHistory();
  const o=layout.objects[id], st={x:e.clientX,y:e.clientY,ox:o.x,oy:o.y};
  let raf=0,last=e;
  function apply(ev){
    const z=Number(($("zoom")&&$("zoom").value)||1);
    let nx=gridSnapVal(st.ox+(ev.clientX-st.x)/z),ny=gridSnapVal(st.oy+(ev.clientY-st.y)/z);
    const sn=snapRect({x:nx,y:ny,w:o.w,h:o.h},id);
    o.x=Math.round(sn.x);
    o.y=Math.round(sn.y);
    clampObject(id);
    el.style.left=o.x+"px";
    el.style.top=o.y+"px";
    syncControls();
    drawGuides(sn.guides);
  }
  function mv(ev){last=ev;if(raf)return;raf=requestAnimationFrame(()=>{raf=0;apply(last)})}
  function up(){
    document.removeEventListener("pointermove",mv);
    document.removeEventListener("pointerup",up);
    clearGuides();
    saveWorkingLayout();
    renderAll();
  }
  document.addEventListener("pointermove",mv);
  document.addEventListener("pointerup",up);
}

function startResize(e,el,id,dir){
  pushHistory();
  const o=layout.objects[id], st={x:e.clientX,y:e.clientY,ox:o.x,oy:o.y,ow:o.w,oh:o.h};
  let raf=0,last=e;
  function apply(ev){
    const z=Number(($("zoom")&&$("zoom").value)||1),dx=(ev.clientX-st.x)/z,dy=(ev.clientY-st.y)/z;
    let x=st.ox,y=st.oy,w=st.ow,h=st.oh;
    if(dir.includes("e"))w=st.ow+dx;
    if(dir.includes("s"))h=st.oh+dy;
    if(dir.includes("w")){w=st.ow-dx;x=st.ox+dx}
    if(dir.includes("n")){h=st.oh-dy;y=st.oy+dy}
    w=Math.max(8,gridSnapVal(w));
    h=Math.max(8,gridSnapVal(h));
    x=gridSnapVal(x);
    y=gridSnapVal(y);
    const b=labelBounds(), limH=activeBottomLimit();
    x=clamp(x,0,Math.max(0,b.w-w));
    y=clamp(y,0,Math.max(0,limH-h));
    w=Math.min(w,b.w-x);
    h=Math.min(h,limH-y);
    const sn=snapRect({x,y,w,h},id);
    o.x=Math.round(sn.x);
    o.y=Math.round(sn.y);
    o.w=Math.round(sn.w);
    o.h=Math.round(sn.h);
    Object.assign(el.style,{left:o.x+"px",top:o.y+"px",width:o.w+"px",height:o.h+"px"});
    syncControls();
    drawGuides(sn.guides);
  }
  function mv(ev){last=ev;if(raf)return;raf=requestAnimationFrame(()=>{raf=0;apply(last)})}
  function up(){
    document.removeEventListener("pointermove",mv);
    document.removeEventListener("pointerup",up);
    clearGuides();
    saveWorkingLayout();
    renderAll();
  }
  document.addEventListener("pointermove",mv);
  document.addEventListener("pointerup",up);
}

function snapRect(r,id){
  const snap=$("snapToggle");
  if(!snap||!snap.checked)return{...r,guides:[]};
  const th=Number(($("snapPx")&&$("snapPx").value)||5),b=labelBounds(),xs=[0,b.w/2,b.w],ys=[0,b.h/2,b.h];
  for(const[oid,o]of Object.entries(layout.objects)){
    if(oid===id||o.visible===false)continue;
    xs.push(o.x,o.x+o.w/2,o.x+o.w);
    ys.push(o.y,o.y+o.h/2,o.y+o.h);
  }
  const rx=[r.x,r.x+r.w/2,r.x+r.w],ry=[r.y,r.y+r.h/2,r.y+r.h],guides=[];
  let bx=null,bd=Infinity,bi=0;
  xs.forEach(xv=>rx.forEach((rv,i)=>{const d=Math.abs(rv-xv);if(d<bd&&d<=th){bd=d;bx=xv;bi=i}}));
  if(bx!==null){if(bi===0)r.x=bx;if(bi===1)r.x=bx-r.w/2;if(bi===2)r.x=bx-r.w;guides.push({type:"v",pos:bx})}
  let by=null,byd=Infinity,byi=0;
  ys.forEach(yv=>ry.forEach((rv,i)=>{const d=Math.abs(rv-yv);if(d<byd&&d<=th){byd=d;by=yv;byi=i}}));
  if(by!==null){if(byi===0)r.y=by;if(byi===1)r.y=by-r.h/2;if(byi===2)r.y=by-r.h;guides.push({type:"h",pos:by})}
  const limH=activeBottomLimit();
  r.x=clamp(r.x,0,Math.max(0,b.w-r.w));
  r.y=clamp(r.y,0,Math.max(0,limH-r.h));
  return{...r,guides};
}

function drawGuides(gs=[]){
  clearGuides();
  const lab=document.querySelector(".labelCanvas");
  if(!lab)return;
  for(const g of gs){
    const d=document.createElement("div");
    d.className="guide "+g.type;
    if(g.type==="v")d.style.left=g.pos+"px";
    else d.style.top=g.pos+"px";
    lab.appendChild(d);
  }
}
function clearGuides(){document.querySelectorAll(".guide").forEach(g=>g.remove())}

function clampObject(id){
  const o=layout.objects[id],b=labelBounds(),limH=activeBottomLimit();
  o.w=clamp(Number(o.w||10),8,b.w);
  o.h=clamp(Number(o.h||10),8,limH);
  o.x=clamp(Number(o.x||0),0,Math.max(0,b.w-o.w));
  o.y=clamp(Number(o.y||0),0,Math.max(0,limH-o.h));
}
function clampAllObjects(){Object.keys(layout.objects).forEach(clampObject)}

function renderObjectPanel(){
  const h=$("objectPanel");
  if(!h)return;
  h.innerHTML="";
  for(const id of["WO","QR","ITEM","WEEK"]){
    const o=layout.objects[id],b=document.createElement("button");
    b.className="objectBtn"+(selectedId===id?" active":"");
    b.innerHTML=`<span>${id}</span><span class="badge">${o.locked?"LOCKED":"UNLOCKED"}</span>`;
    b.onclick=()=>selectObject(id);
    h.appendChild(b);
  }
}
function selectObject(id){
  selectedId=id;
  renderObjectPanel();
  renderCanvas();
  syncControls();
}

function syncControls(){
  const o=layout.objects[selectedId];
  if(!o)return;
  if($("selectedName")) $("selectedName").textContent=selectedId;
  for(const k of["x","y","w","h","rot","fontSize"]){
    const inp=$(k);
    if(inp)inp.value=Math.round(Number(o[k]||0));
  }
  if($("fontSize")) $("fontSize").disabled=selectedId==="QR";
  if($("lockToggle")) $("lockToggle").checked=!!o.locked;
  if($("visibleToggle")) $("visibleToggle").checked=o.visible!==false;
  if($("safeMargin")) $("safeMargin").value=Number(layout.safeMarginPx||0);
  if($("safeValue")) $("safeValue").textContent=Number(layout.safeMarginPx||0)+"px";
  if($("gridPx")) $("gridPx").value=Number(layout.gridPx||4);
}

function applyControls(){
  pushHistory();
  const o=layout.objects[selectedId];
  for(const k of["x","y","w","h","rot"]){
    const inp=$(k);
    const v=Number(inp&&inp.value);
    if(isFinite(v))o[k]=v;
  }
  if(selectedId!=="QR"){
    const fs=Number($("fontSize")&&$("fontSize").value);
    if(isFinite(fs)&&fs>0)o.fontSize=fs;
    o.fontFamily="Times New Roman";
  }
  if($("lockToggle")) o.locked=$("lockToggle").checked;
  if($("visibleToggle")) o.visible=$("visibleToggle").checked;
  if($("safeMargin")) layout.safeMarginPx=Number($("safeMargin").value||0);
  if($("gridPx")) layout.gridPx=Number($("gridPx").value||4);
  clampObject(selectedId);
  saveWorkingLayout();
  renderAll();
}

function centerSelected(axis){
  pushHistory();
  const o=layout.objects[selectedId],b=labelBounds();
  if(axis==="h"||axis==="both")o.x=Math.round((b.w-o.w)/2);
  if(axis==="v"||axis==="both")o.y=Math.round((b.h-o.h)/2);
  saveWorkingLayout();
  renderAll();
}

function renderRows(){
  const q=(($("search")&&$("search").value)||"").toLowerCase();
  filteredRows=rows.filter(r=>{
    if(labelType==="POT" && String(r.scion||"").trim()) return false;
    return Object.values(r).join(" ").toLowerCase().includes(q);
  });
  if(currentRowIndex>=filteredRows.length)currentRowIndex=0;
  const tb=$("rowsBody");
  if(!tb)return;
  tb.innerHTML="";
  const head=document.querySelector(".table thead tr");
  if(head)head.innerHTML="<th>WO</th><th>Activity</th><th>Scion</th><th>Rootstock</th><th>Color</th><th>Labels Needed</th><th></th>";
  filteredRows.slice(0,300).forEach((r,i)=>{
    const tr=document.createElement("tr");
    if(i===currentRowIndex)tr.className="active";
    tr.innerHTML=`<td>${escapeHtml(cap(r.wo))}</td><td>${escapeHtml(cap(r.act))}</td><td>${escapeHtml(cap(r.scion||""))}</td><td>${escapeHtml(cap(r.rootstock||""))}</td><td>${escapeHtml(cap(r.labelColor||""))}</td><td>${escapeHtml(displayLabelsNeeded(r))}</td><td><button>Add</button></td>`;
    tr.onclick=e=>{
      if(e.target.tagName==="BUTTON"){addToQueue(r);return}
      currentRowIndex=i;
      renderRows();
      renderCanvas();
    };
    tb.appendChild(tr);
  });
}

function addToQueue(r=currentRow()){
  const id=Date.now()+"_"+Math.random().toString(16).slice(2);
  queue.push({id,row:clone(r),qty:Math.max(1,parseInt(r.labelsNeeded||"1",10)||1)});
  saveQueue();
  renderQueue();
}
function saveQueue(){localStorage.setItem("beinvtPrintQueue",JSON.stringify(queue))}
function renderQueue(){
  const h=$("queueList");
  if(!h)return;
  h.innerHTML="";
  if(!queue.length){h.innerHTML='<div class="small">Queue is empty.</div>';return}
  queue.forEach(q=>{
    const d=document.createElement("div");
    d.className="queueItem";
    d.innerHTML=`<div><b>${escapeHtml(cap(q.row.wo))}</b><div class="small">${escapeHtml(cap(q.row.scion||""))} ${q.row.rootstock?"| "+escapeHtml(cap(q.row.rootstock)):""}</div><div class="small">${escapeHtml(cap(q.row.labelColor||""))} • Qty ${escapeHtml(displayLabelsNeeded(q.row))}</div></div><input type="number" min="1" value="${q.qty}"><button class="danger">x</button>`;
    d.querySelector("input").onchange=e=>{q.qty=Math.max(1,parseInt(e.target.value||"1",10)||1);saveQueue()};
    d.querySelector("button").onclick=()=>{queue=queue.filter(x=>x.id!==q.id);saveQueue();renderQueue()};
    h.appendChild(d);
  });
}

function renderPresetList(){
  const s=$("presetSelect");
  if(!s)return;
  const names=Object.keys(presets).sort();
  s.innerHTML='<option value="">Select saved preset...</option>'+names.map(n=>`<option>${escapeHtml(n)}</option>`).join("");
}
function savePreset(){
  const name=prompt("Preset name:",layout.name||`${labelType} Custom`);
  if(!name)return;
  layout.name=name;
  presets[name]=clone(layout);
  localStorage.setItem("beinvtLayoutPresets",JSON.stringify(presets));
  renderPresetList();
}
function loadPreset(){
  const n=$("presetSelect")&&$("presetSelect").value;
  if(n&&presets[n])setLayout(presets[n]);
}
function deletePreset(){
  const n=$("presetSelect")&&$("presetSelect").value;
  if(n&&confirm(`Delete preset "${n}"?`)){
    delete presets[n];
    localStorage.setItem("beinvtLayoutPresets",JSON.stringify(presets));
    renderPresetList();
  }
}
function exportLayout(){if($("layoutJson")) $("layoutJson").value=JSON.stringify(layout,null,2)}
function importLayout(){
  try{
    const obj=JSON.parse($("layoutJson").value);
    if(!obj.objects)throw Error("Layout missing objects");
    setLayout(obj);
  }catch(e){alert("Import failed: "+e.message)}
}
function downloadLayout(){
  const blob=new Blob([JSON.stringify(layout,null,2)],{type:"application/json"}),a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=(layout.name||"label-layout").replace(/[^\w-]+/g,"_")+".json";
  a.click();
  URL.revokeObjectURL(a.href);
}
function resetLayout(){
  if(confirm("Reset current label type?"))setLayout(DEFAULT_LAYOUTS[labelType]||fallbackLayout(labelType));
}
function escapeHtml(s){
  return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

function printCalibration(){
  const w=window.open("","_blank");
  w.document.write(`<!doctype html><style>@page{size:2in 2in;margin:0}body{margin:0}.sq{width:1in;height:1in;border:2px solid #000;margin:.25in;font:12px Arial;display:flex;align-items:center;justify-content:center}</style><div class="sq">1in x 1in</div><script>setTimeout(()=>print(),200)<\/script>`);
  w.document.close();
}
function saveCalibration(){
  const mw=Number(($("measuredW")&&$("measuredW").value)||1),mh=Number(($("measuredH")&&$("measuredH").value)||1);
  if(mw>0&&mh>0){
    calibration={scaleX:1/mw,scaleY:1/mh};
    localStorage.setItem("beinvtCalibration",JSON.stringify(calibration));
    if($("calStatus")) $("calStatus").textContent=`Saved: X ${calibration.scaleX.toFixed(4)}, Y ${calibration.scaleY.toFixed(4)}`;
  }
}
function printLabel(){printRows([{row:currentRow(),qty:1}])}
function printQueue(){
  if(!queue.length){alert("Queue is empty.");return}
  printRows(queue);
}
function printRows(items){
  applyPotAutoStack();
  const s=LABEL_SIZES[labelType],b=sizePx(),win=window.open("","_blank");
  let pages="";
  items.forEach(item=>{for(let i=0;i<Math.max(1,item.qty||1);i++)pages+=renderPrintPage(item.row,b)});
  win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Print Labels</title><style>@page{size:${s.widthIn}in ${s.heightIn}in;margin:0}html,body{margin:0;padding:0;background:#fff}.page{position:relative;width:${b.w}px;height:${b.h}px;overflow:hidden;background:#fff;color:#000;page-break-after:always;break-after:page;transform-origin:0 0;transform:scale(${calibration.scaleX},${calibration.scaleY})}*{box-sizing:border-box}</style></head><body>${pages}<script>setTimeout(()=>print(),300)<\/script></body></html>`);
  win.document.close();
}
function renderPrintPage(row,b){
  let out=`<div class="page">`;
  for(const id of["WO","QR","ITEM","WEEK"]){
    const o=layout.objects[id];
    if(!o||o.visible===false)continue;
    if(id==="WEEK"&&!row.week)continue;
    const outer=`position:absolute;left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;overflow:hidden;`;
    if(id==="QR") out+=`<div style="${outer}"><img src="${qrUrl(row.wo)}" style="width:100%;height:100%;image-rendering:pixelated"/></div>`;
    else out+=`<div style="${outer}">${printTextInner(id,row,o)}</div>`;
  }
  return out+"</div>";
}
function printTextInner(id,row,o){
  const r=((Number(o.rot||0)%360)+360)%360, swap=(r===90||r===270);
  const left=swap?((o.w-o.h)/2):0, top=swap?((o.h-o.w)/2):0, w=swap?o.h:o.w, h=swap?o.w:o.h;
  const white=id==="ITEM"?"white-space:normal;word-break:break-word;overflow-wrap:anywhere;padding:1px 2px;":"white-space:nowrap;";
  const jc=id==="ITEM"?'center':alignH(o.alignH);
  const ai=id==="ITEM"?'center':alignV(o.alignV);
  const ta='center';
  return `<div style="position:absolute;left:${left}px;top:${top}px;width:${w}px;height:${h}px;display:flex;align-items:${ai};justify-content:${jc};overflow:hidden;text-align:${ta};${white}text-transform:uppercase;font-family:'Times New Roman',Georgia,serif;font-weight:900;font-size:${o.fontSize||16}px;line-height:.95;transform-origin:center center;transform:rotate(${o.rot||0}deg);">${escapeHtml(labelText(id,row))}</div>`;
}

function nudgeSelected(dx,dy){
  const o=layout&&layout.objects&&layout.objects[selectedId];
  if(!o||o.locked)return;
  pushHistory();
  o.x=Number(o.x||0)+dx;
  o.y=Number(o.y||0)+dy;
  clampObject(selectedId);
  saveWorkingLayout();
  renderAll();
}
function bindDirectionalButtons(){
  const map={
    nudgeUp:[0,-1], nUp:[0,-1], upBtn:[0,-1],
    nudgeDown:[0,1], nD:[0,1], downBtn:[0,1],
    nudgeLeft:[-1,0], nL:[-1,0], leftBtn:[-1,0],
    nudgeRight:[1,0], nR:[1,0], rightBtn:[1,0]
  };
  Object.entries(map).forEach(([id,delta])=>{
    const el=$(id);
    if(el&&!el.dataset.nudgeBound){
      el.dataset.nudgeBound="1";
      el.onclick=()=>nudgeSelected(delta[0],delta[1]);
    }
  });
}

function initEvents(){
  ensureModeTabs();
  bindDirectionalButtons();
  if($("labelType")) $("labelType").onchange=e=>{labelType=e.target.value;selectedId="ITEM";undoStack=[];redoStack=[];setLayout(loadWorkingLayout(labelType),false); renderRows(); updateModeTabs();};
  if($("zoom")) $("zoom").oninput=renderCanvas;
  if($("search")) $("search").oninput=renderRows;
  if($("safeToggle")) $("safeToggle").onchange=e=>{showSafeZone=e.target.checked;renderCanvas()};
  if($("gridToggle")) $("gridToggle").onchange=e=>{showGrid=e.target.checked;renderCanvas()};
  if($("gridPx")) $("gridPx").onchange=applyControls;
  if($("safeMargin")) $("safeMargin").oninput=e=>{layout.safeMarginPx=Number(e.target.value||0);if($("safeValue"))$("safeValue").textContent=layout.safeMarginPx+"px";saveWorkingLayout();renderCanvas()};
  for(const id of["x","y","w","h","rot","fontSize"]){
    const inp=$(id);
    if(inp){inp.onchange=applyControls;inp.onkeydown=e=>{if(e.key==="Enter")applyControls()}}
  }
  if($("lockToggle")) $("lockToggle").onchange=applyControls;
  if($("visibleToggle")) $("visibleToggle").onchange=applyControls;
  if($("centerH")) $("centerH").onclick=()=>centerSelected("h");
  if($("centerV")) $("centerV").onclick=()=>centerSelected("v");
  if($("centerBoth")) $("centerBoth").onclick=()=>centerSelected("both");
  if($("savePreset")) $("savePreset").onclick=savePreset;
  if($("loadPreset")) $("loadPreset").onclick=loadPreset;
  if($("deletePreset")) $("deletePreset").onclick=deletePreset;
  if($("exportLayout")) $("exportLayout").onclick=exportLayout;
  if($("importLayout")) $("importLayout").onclick=importLayout;
  if($("downloadLayout")) $("downloadLayout").onclick=downloadLayout;
  if($("resetLayout")) $("resetLayout").onclick=resetLayout;
  if($("printCalibration")) $("printCalibration").onclick=printCalibration;
  if($("saveCalibration")) $("saveCalibration").onclick=saveCalibration;
  if($("testMode")) $("testMode").onclick=()=>{testMode=!testMode;$("testMode").classList.toggle("good",testMode);renderCanvas()};
  if($("printLabel")) $("printLabel").onclick=printLabel;
  if($("printQueue")) $("printQueue").onclick=printQueue;
  if($("addCurrent")) $("addCurrent").onclick=()=>addToQueue();
  if($("clearQueue")) $("clearQueue").onclick=()=>{queue=[];saveQueue();renderQueue()};
  if($("undoBtn")) $("undoBtn").onclick=undo;
  if($("redoBtn")) $("redoBtn").onclick=redo;

  document.addEventListener("keydown",e=>{
    const tag=document.activeElement.tagName;
    if(["INPUT","TEXTAREA","SELECT"].includes(tag))return;
    const mod=e.ctrlKey||e.metaKey;
    if(mod&&e.key.toLowerCase()==="z"){e.preventDefault();e.shiftKey?redo():undo();return}
    if(mod&&e.key.toLowerCase()==="y"){e.preventDefault();redo();return}
    const o=layout.objects[selectedId];
    if(!o||o.locked)return;
    const step=e.shiftKey?10:1;
    if(e.key==="ArrowUp"){e.preventDefault();nudgeSelected(0,-step);return}
    else if(e.key==="ArrowDown"){e.preventDefault();nudgeSelected(0,step);return}
    else if(e.key==="ArrowLeft"){e.preventDefault();nudgeSelected(-step,0);return}
    else if(e.key==="ArrowRight"){e.preventDefault();nudgeSelected(step,0);return}
  });
}

function boot(){
  loadDefaults().then(()=>{
    layout=loadWorkingLayout(labelType);
    initEvents();
    loadCsv().catch(console.warn).finally(renderAll);
  });
}
boot();
