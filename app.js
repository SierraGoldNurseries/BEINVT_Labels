const APP_VERSION = "8.6.17-left-panel-730-smaller-pills";
const INCH = 96;
const LABEL_SIZES = {
  POT: { widthIn: 0.75, heightIn: 5 },
  WRAP: { widthIn: 5, heightIn: 0.5 }
};
const SG_LOGO_URL = "https://11150895.app.netsuite.com/core/media/media.nl?id=154769&c=11150895&h=gz_jC4_Zsi8evEFt-sGPjDNJhRvthM-3uNCqvPr8uc5CrgD1&fcts=20251229204334&whence=";
const GENEVA_SG_LOGO_URL = "https://11150895.app.netsuite.com/core/media/media.nl?id=260263&c=11150895&h=NMkHvroppy8Yi93204J1rZiq_7V-dJBmcFNuScfEc2hRzqB9";
const GENEVA_LOGO_SHIFT_Y = -1;
const OUTER_CARD_EXTRA_WIDTH = 0;
const TABLE_CARD_WIDTH_EXTRA_BY_LABEL = { POT: 196, WRAP: 194 }; // reference: target missing width; actual layout now fills to top menu right edge
const DEBUG_LAYER_LABELS_DEFAULT = false;

/*
  v8.6.13 config:
  - A = outer dark card (.stageWrap).
  - Debug tools stay installed, but OFF by default.
  - Change LAYER_DEBUG_CONFIG.enabled from false to true to show/debug/move labels.
  - Debug panel can be dragged anywhere on screen and remembers position.
  - Geneva logo logic checks raw rootstock, derived RSCH rootstock, lot fields, item/name, and printable label rootstock text.
  - Outer card keeps its current width but shifts right if it overlaps the left menu.
  - Page render height is trimmed by 5% through pageHeightScale.
  - Debug includes T = the actual top control card containing Pot Stakes / Wrap Ties / Zoom / print buttons.
  - v8.6.14: C table card gains +196px for Pot Stakes and +194px for Wrap Ties.
  - v8.6.14: debug W/H fields no longer refresh while typing, and A manual debug width is not capped.
  - v8.6.16: width authority is T top menu minus L left panel; top-menu right edge is no longer clipped to viewport.
  - v8.6.16: debug panel stops auto-refresh while interacting, so Set buttons cannot be destroyed before click.
  - v8.6.17: left settings panel is 730px wide in both templates; preview meta pills are 10% smaller.
*/
const OUTER_CARD_SIZE_CONFIG = {
  enabled: true,
  // fitTopMenu = fill the usable width between the left settings menu and the right edge of the top control card.
  // manual = use manualWidth/manualHeight from the debug panel, capped to the usable right edge by default.
  widthMode: "fitTopMenu",
  heightMode: "fitViewport",
  // 0.95 trims the render area height by 5% so the normal page does not create a browser scrollbar.
  pageHeightScale: 0.95,
  // v8.6.15: A starts exactly after the left panel and ends at the top control card right edge.
  preserveCurrentWidthOnShift: false,
  shiftRightFromLeftPanel: true,
  manualWidth: 1600,
  fallbackWidth: 1600,
  extraWidth: 0,
  rightMargin: 0,
  leftGap: 0,
  minWidth: 700,
  height: 1193,
  minHeight: 520,
  bottomMargin: 14,
  capManualToAvailable: true,
  applyTo: ["POT", "WRAP"]
};
const LAYER_DEBUG_CONFIG = {
  enabled: false,
  movable: true,
  rememberPosition: true,
  defaultLeft: 18,
  defaultTop: 70,
  showShortcut: true
};
const WRAP_ADDRESS = "SIERRA GOLD NURSERIES YUBA CITY, CA 95991";
const WRAP_WARNING = "WARNING: ASEXUAL\nREPRODUCTION OF SCIONS,\nBUDS, OR CUTTINGS\nWHETHER FOR SALE\nOR OWN USE IS\nPROHIBITED UNDER\nU.S. PLANT PATENT LAWS.\nSALES OUTSIDE THE\nU.S. ARE PROHIBITED.";

const POT_OBJECT_ORDER = ["WO", "QR", "ITEM", "WEEK"];
const WRAP_OBJECT_ORDER = [
  "WO_QR", "WO", "CROP", "INTERNAL", "SCION", "SCION_PATENT", "ROOTSTOCK",
  "ROOTSTOCK_PATENT", "LOT", "ADDRESS", "LOT_QR", "LOGO", "WARNING"
];
const IMAGE_OBJECT_IDS = new Set(["QR", "WO_QR", "LOT_QR", "LOGO"]);
const POT_EXCLUDED_ACTIVITIES = [
  /pre[-\s]*ship\s+sorting/i,
  /shipping\s+request/i,
  /propagation\s+material\s+processing/i
];

let DEFAULT_LAYOUTS = {};
let labelType = "POT";
let rows = [];
let filteredRows = [];
let currentRowIndex = 0;
let selectedId = "ITEM";
let layout = null;
let showSafeZone = true;
let showGrid = false;
let testMode = false;
let calibration = readJson("beinvtCalibration", { scaleX: 1, scaleY: 1 });
let presets = readJson("beinvtLayoutPresets", {});
let queue = readJson("beinvtPrintQueue", []);
let undoStack = [];
let redoStack = [];
let isRestoring = false;
let potAutoLayoutKey = "";
let zoomAutoModeKey = "";

function $(id) {
  return document.getElementById(id);
}
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function clone(o) {
  return JSON.parse(JSON.stringify(o));
}
function cap(v) {
  return String(v ?? "").toUpperCase();
}
function escapeHtml(v) {
  return String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : clone(fallback);
  } catch (e) {
    return clone(fallback);
  }
}
function cleanDisplay(v) {
  const s = String(v ?? "").trim();
  if (!s) return "";
  if (/^-?\s*none\s*-?$/i.test(s)) return "";
  return s;
}
function capClean(v) {
  return cap(cleanDisplay(v));
}
function objectOrder(type = labelType) {
  return type === "WRAP" ? WRAP_OBJECT_ORDER : POT_OBJECT_ORDER;
}
function defaultSelectedId(type = labelType) {
  return type === "WRAP" ? "SCION" : "ITEM";
}
function isImageObject(id) {
  return IMAGE_OBJECT_IDS.has(id);
}
function sizePx(type = labelType) {
  const s = LABEL_SIZES[type] || LABEL_SIZES.POT;
  return { w: Math.round(s.widthIn * INCH), h: Math.round(s.heightIn * INCH) };
}

(function resetOldBrokenWorkingLayouts() {
  if (localStorage.getItem("beinvtAppVersion") !== APP_VERSION) {
    localStorage.removeItem("beinvtWorkingLayout_POT");
    localStorage.removeItem("beinvtWorkingLayout_WRAP");
    // Clear old debug-forced A sizes so the new 5% height trim and right-shift logic can apply.
    localStorage.removeItem("beinvtOuterCardDebugWidth_v8615");
    localStorage.removeItem("beinvtOuterCardDebugHeight_v8615");
    localStorage.removeItem("beinvtOuterCardDebugWidth_v8615");
    localStorage.removeItem("beinvtOuterCardDebugHeight_v8615");
    localStorage.removeItem("beinvtDebugLayerManualSizes");
    localStorage.removeItem("beinvtLayerManualSizes_v8612");
    localStorage.removeItem("beinvtLayerManualSizes_v8615");
    localStorage.removeItem("beinvtLayerManualSizes_v8616");
    localStorage.setItem("beinvtAppVersion", APP_VERSION);
  }
})();

(function injectCleanCss() {
  const css = `
    *{box-sizing:border-box}
    body.beinvt-label-pot,body.beinvt-label-wrap{overflow:hidden}
    .topbar,.toolbar,header{position:relative;z-index:60}
    .modeTabs{display:inline-flex;gap:6px;align-items:center;margin-left:6px;vertical-align:middle}
    .modeTab{border:1px solid rgba(255,255,255,.22);border-radius:999px;background:rgba(255,255,255,.05);color:#e5e7eb;padding:8px 13px;font-size:13px;font-weight:900;cursor:pointer}
    .modeTab.active{border-color:#7da2ff;background:rgba(96,165,250,.22);color:#fff}
    #zoom{accent-color:#7c6cff}

    aside.panel,.panel.sidebar,.settingsPanel{height:1177px!important;min-height:0!important;max-height:1177px!important;overflow:auto!important;background:#121429!important;border-right:1px solid rgba(255,255,255,.14)!important;width:730px!important;min-width:730px!important;max-width:730px!important;flex:0 0 730px!important}
    .beinvtSettingsPanel{display:flex;flex-direction:column;gap:8px;padding:8px 10px 12px;min-height:100%}
    .beinvtCard{border:1px solid rgba(255,255,255,.14);background:#14162d;border-radius:13px;overflow:hidden;flex:0 0 auto;box-shadow:0 8px 24px rgba(0,0,0,.15)}
    .beinvtCardHeader{padding:9px 12px;border-bottom:1px solid rgba(255,255,255,.12);font-weight:900;color:#fff;font-size:14px;display:flex;justify-content:space-between;align-items:center;gap:8px}
    .beinvtCardBody{padding:10px 12px}
    .beinvtObjectsCard{position:sticky;top:0;z-index:80;background:#14162d;box-shadow:0 8px 26px rgba(0,0,0,.38)}
    .beinvtObjectsCard .beinvtCardBody{padding:8px 10px}
    #objectPanel{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;max-height:250px;min-height:116px;overflow:auto;padding-right:2px}
    body.beinvt-label-wrap #objectPanel{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px;max-height:235px}
    .objectBtn{border:1px solid rgba(255,255,255,.16);border-radius:10px;background:#0d1022;color:#e5e7eb;padding:7px 8px;display:flex;flex-direction:column;gap:4px;text-align:left;cursor:pointer;min-width:0;line-height:1.1;white-space:normal;font-weight:800;font-size:12px}
    .objectBtn.active{border-color:#facc15;background:rgba(250,204,21,.14);color:#fff}
    .objectBtn .badge{font-size:9px;opacity:.75;font-weight:800;white-space:nowrap}
    .objectBtn.hiddenObj{opacity:.55}
    .compactGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
    .compactGrid.two{grid-template-columns:repeat(2,minmax(0,1fr))}
    .field label,.checkRow label{display:block;color:#aeb7d5;font-size:11px;margin:0 0 4px}
    .field input,.field select,#layoutJson{width:100%;border:1px solid rgba(255,255,255,.14);background:#080b1a;color:#fff;border-radius:8px;padding:7px 8px;font-size:13px;min-width:0}
    .field input[type=range]{padding:0;accent-color:#7c6cff}
    .checkRow{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px 12px;align-items:center}
    .checkItem{display:flex!important;gap:6px;align-items:center;font-size:12px;color:#e5e7eb;white-space:nowrap;min-width:0}
    .checkItem input{width:auto;margin:0}
    .buttonRow{display:flex;flex-wrap:wrap;gap:7px;align-items:center}
    .buttonRow button,.beinvtCard button{border:1px solid rgba(255,255,255,.18);background:#0d1022;color:#fff;border-radius:9px;padding:7px 10px;font-weight:800;cursor:pointer}
    .buttonRow button:hover,.beinvtCard button:hover{background:#161b38}
    .buttonRow .danger,.danger{border-color:rgba(248,113,113,.5)!important;color:#fecaca!important}
    .smallNote{font-size:11px;color:#9aa4c4;line-height:1.35}
    #layoutJson{min-height:86px;resize:vertical;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;line-height:1.3}
    .queueItem{display:flex;align-items:center;justify-content:space-between;gap:8px;border:1px solid rgba(255,255,255,.10);border-radius:10px;padding:7px 8px;margin-bottom:6px;background:#0d1022}
    .queueItem input{width:62px;border:1px solid rgba(255,255,255,.14);background:#080b1a;color:#fff;border-radius:8px;padding:6px}
    .small{font-size:11px;color:#aeb7d5}
    .beinvtDuplicateSettings{display:none!important}
    .beinvtSettingsPanel .beinvtCard{display:block!important}

    .stageWrap{display:flex!important;flex-direction:column!important;height:1193px!important;min-height:0!important;overflow:hidden!important;padding:3px!important;gap:3px!important;background:radial-gradient(circle at center,rgba(255,255,255,.06),rgba(255,255,255,.015))!important;min-width:0!important;max-width:100vw!important}
    #canvasHost{width:100%!important;height:100%!important;min-height:0!important;display:flex!important;gap:4px!important;align-items:stretch!important;justify-content:stretch!important;overflow:hidden!important}
    body.beinvt-label-pot #canvasHost{flex-direction:row!important}
    body.beinvt-label-wrap #canvasHost{flex-direction:column!important}
    #stageDataWrap{background:#0f1228;border:1px solid rgba(255,255,255,.16);border-radius:13px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 12px 34px rgba(0,0,0,.22);min-width:0;min-height:0}
    body.beinvt-label-pot #stageDataWrap{flex:1 1 72%;min-width:540px;height:100%}
    body.beinvt-label-wrap #stageDataWrap{flex:0 0 clamp(420px,55vh,690px);width:100%}
    #stageDataSearchRow{padding:8px;border-bottom:1px solid rgba(255,255,255,.10);background:#13162e;display:flex;gap:8px;align-items:center}
    #stageSearch{width:100%;height:34px;border-radius:9px;border:1px solid rgba(255,255,255,.15);background:#090d1f;color:#e5e7eb;padding:7px 10px;font-size:13px}
    .stageTableScroll{flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;background:#0f1228}
    #stageRowsTable{width:100%!important;min-width:0!important;table-layout:fixed!important;border-collapse:separate!important;border-spacing:0!important;background:#0f1228!important;font-size:12px}
    #stageRowsTable th{position:sticky;top:0;z-index:30;background:#151831!important;color:#e5e7eb!important;text-align:left;font-weight:900;padding:9px 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border-bottom:1px solid rgba(255,255,255,.12)}
    #stageRowsTable td{background:#10142d!important;color:#e5e7eb!important;padding:9px 8px;border-bottom:1px solid rgba(255,255,255,.07);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;vertical-align:middle}
    #stageRowsTable tr.active td{background:rgba(104,124,210,.55)!important;color:#fff!important}
    #stageRowsTable tr:hover td{background:rgba(255,255,255,.055)!important}
    #stageRowsTable button{border:1px solid rgba(255,255,255,.18);background:#080b1a;color:#fff;border-radius:8px;padding:5px 8px;font-weight:800;cursor:pointer}

    #stageLabelHost{min-width:0;min-height:0;overflow:hidden;display:flex;align-items:center;justify-content:center;padding:8px;position:relative}
    body.beinvt-label-pot #stageLabelHost{flex:0 0 min(370px,34%);height:100%;align-items:center;justify-content:center;padding:4px 4px}
    body.beinvt-label-wrap #stageLabelHost{flex:1 1 auto;align-items:flex-start;justify-content:center;padding:4px 6px 8px}
    .stageStack{display:flex;flex-direction:column;gap:6px;align-items:center;justify-content:flex-start;max-width:100%;max-height:100%}
    .labelPreviewRow{display:flex;align-items:center;justify-content:center;gap:8px;max-width:100%;max-height:100%;min-width:0;overflow:visible}
    body.beinvt-label-pot .labelPreviewRow{flex-direction:column;gap:6px}
    body.beinvt-label-wrap .labelPreviewRow{flex-direction:row;gap:8px}
    .stageMeta{display:flex;gap:7px;align-items:stretch;justify-content:center;min-width:198px;max-width:306px;padding:7px;border:1px solid rgba(255,255,255,.14);border-radius:14px;background:#171a35;color:#e5e7eb;position:relative;z-index:20;box-shadow:0 10px 28px rgba(0,0,0,.22)}
    body.beinvt-label-pot .stageMeta{width:min(100%,288px);flex-direction:column}
    body.beinvt-label-wrap .stageMeta{width:185px;flex-direction:column;flex:0 0 185px}
    .stageMeta .metaPill{display:flex;justify-content:space-between;gap:9px;align-items:center;padding:7px 9px;border-radius:10px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.04);font-size:11px;line-height:1.12;font-weight:800;white-space:nowrap}
    .stageMeta b{font-size:12px;color:#fff}
    .stageFrame{position:relative;flex:0 0 auto;display:block;overflow:visible}
    .stageInner{position:absolute;left:0;top:0;transform-origin:left top}
    .labelCanvas{background:#fff;color:#000;position:relative;overflow:hidden;border:1px solid rgba(0,0,0,.55);box-shadow:0 18px 46px rgba(0,0,0,.42)}
    .obj{position:absolute;border:1px dashed rgba(250,204,21,.75);user-select:none;touch-action:none;overflow:hidden;background:rgba(255,255,255,.02)}
    .obj.selected{border:2px solid #facc15;background:rgba(250,204,21,.08);overflow:visible;z-index:8}
    .obj.locked{border-color:rgba(248,113,113,.95)}
    .obj.emptyText{display:none}
    .inner{position:absolute;display:flex;overflow:hidden;align-items:center;justify-content:center;text-align:center;line-height:.94;text-transform:uppercase;font-family:"Times New Roman",Georgia,serif;font-weight:900;transform-origin:center center;color:#000}
    .potItemInner{white-space:normal;word-break:normal;overflow-wrap:normal;hyphens:manual;line-height:.9;padding:0;text-wrap:wrap}
    .obj img,.obj canvas{width:100%;height:100%;display:block;image-rendering:pixelated}
    .handle{display:none;position:absolute;width:11px;height:11px;background:#facc15;border:1px solid #111827;border-radius:3px;z-index:40}
    .obj.selected .handle{display:block}
    .handle.n{top:-7px;left:50%;margin-left:-5px;cursor:ns-resize}.handle.s{bottom:-7px;left:50%;margin-left:-5px;cursor:ns-resize}.handle.e{right:-7px;top:50%;margin-top:-5px;cursor:ew-resize}.handle.w{left:-7px;top:50%;margin-top:-5px;cursor:ew-resize}.handle.ne{right:-7px;top:-7px;cursor:nesw-resize}.handle.nw{left:-7px;top:-7px;cursor:nwse-resize}.handle.se{right:-7px;bottom:-7px;cursor:nwse-resize}.handle.sw{left:-7px;bottom:-7px;cursor:nesw-resize}
    .gridOverlay{position:absolute;inset:0;pointer-events:none;z-index:2;opacity:.28}.safeZone{position:absolute;border:1px dashed rgba(239,68,68,.8);pointer-events:none;z-index:3}.guide{position:absolute;background:#38bdf8;box-shadow:0 0 8px rgba(56,189,248,.8);pointer-events:none;z-index:50}.guide.v{width:1px;top:-9999px;height:20000px}.guide.h{height:1px;left:-9999px;width:20000px}
    .wrapTextInner{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;overflow:hidden;text-align:center;white-space:normal;word-break:normal;overflow-wrap:normal;hyphens:manual;text-transform:uppercase;font-family:"Times New Roman",Georgia,serif;font-weight:900;color:#000;line-height:.86;padding:0 1px}
    .wrapTextInner.leftText{justify-content:flex-start;text-align:left}.wrapTextInner.smallText{line-height:.92}.wrapTextInner.warningText{white-space:pre-line;line-height:1.05;text-align:left;justify-content:flex-start;align-items:center}.wrapTextInner .wrapOn{font-size:.68em;margin-right:.18em;text-transform:none!important}.wrapLogo{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}.wrapLogo img{width:100%;height:100%;object-fit:contain!important;image-rendering:auto!important}.wrapLogo.genevaStackedLogo{flex-direction:column!important;gap:1px;align-items:center!important;justify-content:center!important}.wrapLogo.genevaStackedLogo img{width:100%!important;height:calc(50% - 1px)!important;max-height:calc(50% - 1px)!important;object-fit:contain!important;display:block!important}.wrapLogoFallback{font-size:8px;font-weight:900;border:1px solid #000;border-radius:999px;padding:1px 3px;line-height:1}
    #gridSection .beinvtCardBody{padding-top:9px}
    #gridSection .compactGrid{grid-template-columns:1fr 1fr 1fr auto;align-items:end}
    #gridSection .field label{min-height:14px}
    #stageRowsTable td,#stageRowsTable th{font-size:12px}
    @media(max-width:1100px){aside.panel,.panel.sidebar,.settingsPanel{width:730px!important;min-width:730px!important;max-width:730px!important;flex-basis:730px!important}#canvasHost{flex-direction:column!important}body.beinvt-label-pot #stageDataWrap{flex:0 0 clamp(300px,52vh,560px);min-width:0;width:100%}body.beinvt-label-pot #stageLabelHost{flex:1 1 auto;width:100%}.compactGrid{grid-template-columns:repeat(2,minmax(0,1fr))}.checkRow{grid-template-columns:repeat(2,minmax(0,1fr))}}
  `;
  const tag = document.createElement("style");
  tag.setAttribute("data-beinvt-clean-css", "1");
  tag.textContent = css;
  document.head.appendChild(tag);
})();

(function injectFullWidthV86Css(){
  const css = `
    /* v8.6.2: restart from v8.5 and use the empty right-side space. */
    .stageWrap{width:auto!important;max-width:none!important;flex:1 1 auto!important}
    #canvasHost{width:100%!important;max-width:100%!important}
    body.beinvt-label-wrap #canvasHost{align-items:stretch!important;justify-content:stretch!important}
    body.beinvt-label-wrap #stageDataWrap{width:100%!important;flex:0 0 clamp(390px,54vh,700px)!important}
    body.beinvt-label-wrap #stageLabelHost{width:100%!important;flex:1 1 auto!important;align-items:center!important;justify-content:center!important;padding:4px 8px 8px!important}
    body.beinvt-label-wrap #stageLabelHost .stageStack{width:100%!important;max-width:100%!important;align-items:center!important}
    body.beinvt-label-wrap .labelPreviewRow{width:100%!important;max-width:100%!important;justify-content:center!important;gap:10px!important}
    body.beinvt-label-wrap .stageFrame{flex:0 0 auto!important}
    body.beinvt-label-wrap .stageMeta{flex:0 0 205px!important;width:205px!important}

    body.beinvt-label-pot #canvasHost{align-items:stretch!important;justify-content:stretch!important}
    body.beinvt-label-pot #stageDataWrap{flex:1 1 auto!important;min-width:0!important;width:auto!important}
    body.beinvt-label-pot #stageLabelHost{flex:0 0 clamp(270px,23vw,340px)!important;min-width:270px!important;height:100%!important;align-items:center!important;justify-content:flex-end!important;padding:4px 8px 4px 4px!important}
    body.beinvt-label-pot #stageLabelHost .stageStack{width:100%!important;max-width:100%!important;align-items:flex-end!important}
    body.beinvt-label-pot .labelPreviewRow{width:auto!important;max-width:100%!important;align-items:flex-end!important;justify-content:flex-end!important}
  `;
  const tag = document.createElement("style");
  tag.setAttribute("data-beinvt-v86-full-width-css", "1");
  tag.textContent = css;
  document.head.appendChild(tag);
})();

(function injectToolbarWidthV863Css(){
  const css = `
    /* v8.6.3: make the render card match the toolbar/right edge and use the width. */
    .stageWrap{box-sizing:border-box!important;max-width:none!important;min-width:0!important;overflow:hidden!important}
    #canvasHost{width:100%!important;max-width:100%!important;min-width:0!important;overflow:hidden!important}
    #stageDataWrap{min-width:0!important;max-width:none!important}
    body.beinvt-label-pot #stageDataWrap{flex:1 1 auto!important;width:auto!important;min-width:0!important;max-width:none!important}
    body.beinvt-label-pot #stageLabelHost{flex:0 0 clamp(320px,22vw,420px)!important;min-width:320px!important;max-width:420px!important;justify-content:flex-end!important;align-items:center!important;padding:4px 6px 4px 2px!important}
    body.beinvt-label-pot #stageLabelHost .stageStack{width:100%!important;align-items:flex-end!important;justify-content:center!important}
    body.beinvt-label-pot .labelPreviewRow{align-items:flex-end!important;justify-content:flex-end!important;max-width:100%!important}
    body.beinvt-label-pot .stageMeta{width:min(100%,320px)!important;max-width:320px!important}

    body.beinvt-label-wrap #stageDataWrap{width:100%!important;max-width:none!important;flex:0 0 clamp(390px,54vh,700px)!important}
    body.beinvt-label-wrap #stageLabelHost{width:100%!important;max-width:none!important;flex:1 1 auto!important;justify-content:center!important;align-items:center!important;padding:4px 6px 8px!important}
    body.beinvt-label-wrap #stageLabelHost .stageStack{width:100%!important;max-width:100%!important;align-items:center!important}
    body.beinvt-label-wrap .labelPreviewRow{width:100%!important;max-width:100%!important;justify-content:center!important;gap:10px!important}
    body.beinvt-label-wrap .stageFrame{max-width:calc(100% - 225px)!important}
  `;
  const tag = document.createElement("style");
  tag.setAttribute("data-beinvt-v863-toolbar-width-css", "1");
  tag.textContent = css;
  document.head.appendChild(tag);
})();

(function injectStageEdgeV865Css(){
  const css = `
    /* v8.6.5: use more of the right-side page width and tighten the stage gutters. */
    .stageWrap{padding:1px!important;gap:2px!important}
    #canvasHost{gap:2px!important}
    #stageDataWrap,#stageLabelHost{min-width:0!important}

    body.beinvt-label-pot #stageDataWrap{flex:1 1 auto!important;width:auto!important;min-width:0!important;max-width:none!important}
    body.beinvt-label-pot #stageLabelHost{flex:0 0 clamp(290px,20vw,360px)!important;min-width:290px!important;max-width:360px!important;justify-content:flex-end!important;align-items:center!important;padding:2px 4px 2px 1px!important}
    body.beinvt-label-pot #stageLabelHost .stageStack{width:100%!important;max-width:100%!important;align-items:flex-end!important}
    body.beinvt-label-pot .stageMeta{width:min(100%,300px)!important;max-width:300px!important}

    body.beinvt-label-wrap #stageDataWrap{width:100%!important;max-width:none!important;flex:0 0 clamp(400px,56vh,740px)!important}
    body.beinvt-label-wrap #stageLabelHost{width:100%!important;max-width:none!important;flex:1 1 auto!important;justify-content:center!important;align-items:center!important;padding:2px 4px 6px!important}
    body.beinvt-label-wrap #stageLabelHost .stageStack{width:100%!important;max-width:100%!important;align-items:center!important}
    body.beinvt-label-wrap .stageMeta{flex:0 0 190px!important;width:190px!important}
    body.beinvt-label-wrap .labelPreviewRow{width:100%!important;max-width:100%!important;justify-content:center!important;gap:8px!important}
    body.beinvt-label-wrap .stageFrame{max-width:calc(100% - 198px)!important}
  `;
  const tag = document.createElement("style");
  tag.setAttribute("data-beinvt-v865-stage-edge-css", "1");
  tag.textContent = css;
  document.head.appendChild(tag);
})();

(function injectOuterCardWideV866Css(){
  const css = `
    /* v8.6.6: outer render card width is forced in JS; this keeps earlier card CSS from clipping it. */
    .stageWrap{max-width:none!important;min-width:0!important;overflow:visible!important}
    #canvasHost{width:100%!important;max-width:100%!important;min-width:0!important}
  `;
  const tag = document.createElement("style");
  tag.setAttribute("data-beinvt-v866-outer-card-wide-css", "1");
  tag.textContent = css;
  document.head.appendChild(tag);
})();

(function injectOuterCardTopbarWidthV869Css(){
  const css = `
    /* v8.6.10: A outer card is bounded to the visible page area by JS; do not grow the whole page. */
    body.beinvt-label-pot,body.beinvt-label-wrap{overflow-x:hidden!important;overflow-y:hidden!important}
    body.beinvt-label-pot .stageWrap,body.beinvt-label-wrap .stageWrap{
      box-sizing:border-box!important;
      width:var(--beinvt-outer-card-width)!important;
      min-width:var(--beinvt-outer-card-width)!important;
      max-width:var(--beinvt-outer-card-width)!important;
      inline-size:var(--beinvt-outer-card-width)!important;
      min-inline-size:var(--beinvt-outer-card-width)!important;
      flex:0 0 var(--beinvt-outer-card-width)!important;
      flex-basis:var(--beinvt-outer-card-width)!important;
      height:var(--beinvt-outer-card-height)!important;
      min-height:var(--beinvt-outer-card-height)!important;
      max-height:var(--beinvt-outer-card-height)!important;
      overflow:hidden!important;
    }
    body.beinvt-label-pot #canvasHost,body.beinvt-label-wrap #canvasHost{
      width:100%!important;min-width:100%!important;max-width:100%!important;
    }
  `;
  const tag = document.createElement("style");
  tag.setAttribute("data-beinvt-v869-outer-card-topbar-width-css", "1");
  tag.textContent = css;
  document.head.appendChild(tag);
})();

(function injectTopMenuSumV8615Css(){
  const css = `
    /* v8.6.15: final width authority. A fills the exact space remaining after the left panel. */
    body.beinvt-label-pot,body.beinvt-label-wrap{overflow-x:hidden!important;overflow-y:hidden!important}
    body.beinvt-label-pot .stageWrap,body.beinvt-label-wrap .stageWrap{
      max-width:var(--beinvt-outer-card-width)!important;
      min-width:var(--beinvt-outer-card-width)!important;
      width:var(--beinvt-outer-card-width)!important;
      flex:0 0 var(--beinvt-outer-card-width)!important;
      flex-basis:var(--beinvt-outer-card-width)!important;
    }
    body.beinvt-label-pot #canvasHost,body.beinvt-label-wrap #canvasHost{
      width:100%!important;
      max-width:100%!important;
      min-width:0!important;
      overflow:hidden!important;
    }
    body.beinvt-label-pot #stageDataWrap{
      flex:1 1 auto!important;
      width:auto!important;
      min-width:0!important;
      max-width:none!important;
    }
    body.beinvt-label-pot #stageLabelHost{
      flex:0 0 360px!important;
      width:360px!important;
      min-width:360px!important;
      max-width:360px!important;
    }
  `;
  const tag = document.createElement("style");
  tag.setAttribute("data-beinvt-v8615-top-menu-sum-css", "1");
  tag.textContent = css;
  document.head.appendChild(tag);
})();

(function injectFinalWidthAuthorityV8616Css(){
  const css = `
    /* v8.6.16 final overrides. Keep L + A aligned to T and set requested fixed debug dimensions. */
    body.beinvt-label-pot aside.panel,body.beinvt-label-pot .panel.sidebar,body.beinvt-label-pot .settingsPanel,
    body.beinvt-label-wrap aside.panel,body.beinvt-label-wrap .panel.sidebar,body.beinvt-label-wrap .settingsPanel{
      width:730px!important;
      min-width:730px!important;
      max-width:730px!important;
      flex:0 0 730px!important;
      flex-basis:730px!important;
      height:1177px!important;
      min-height:1177px!important;
      max-height:1177px!important;
      overflow:auto!important;
    }
    body.beinvt-label-pot .stageWrap,body.beinvt-label-wrap .stageWrap{
      width:var(--beinvt-outer-card-width)!important;
      min-width:var(--beinvt-outer-card-width)!important;
      max-width:var(--beinvt-outer-card-width)!important;
      flex:0 0 var(--beinvt-outer-card-width)!important;
      flex-basis:var(--beinvt-outer-card-width)!important;
      flex-shrink:0!important;
    }
    body.beinvt-label-pot #canvasHost,body.beinvt-label-wrap #canvasHost{
      width:100%!important;
      min-width:0!important;
      max-width:100%!important;
      flex:1 1 auto!important;
    }
    body.beinvt-label-wrap #stageLabelHost{
      flex:0 0 362px!important;
      height:362px!important;
      min-height:362px!important;
      max-height:362px!important;
      width:100%!important;
      max-width:100%!important;
      align-items:center!important;
      justify-content:center!important;
    }
    body.beinvt-label-wrap #stageDataWrap{
      flex:1 1 auto!important;
      width:100%!important;
      min-height:0!important;
      max-height:none!important;
    }
    [data-beinvt-debug-width-test="1"]{
      box-sizing:border-box!important;
    }
  `;
  const tag = document.createElement("style");
  tag.setAttribute("data-beinvt-v8616-final-width-authority-css", "1");
  tag.textContent = css;
  document.head.appendChild(tag);
})();


(function injectLayerDebugLabelsV867Css(){
  const css = `
    /* v8.6.7 debug layer labels: viewport overlays, no layout effect, hidden in print. */
    .beinvtLayerDebugRoot{position:fixed;inset:0;z-index:999997;pointer-events:none!important;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace!important}
    .beinvtLayerDebugBox{position:fixed;pointer-events:none!important;border:2px dashed currentColor;border-radius:8px;box-shadow:0 0 0 1px rgba(0,0,0,.55),0 0 18px rgba(255,255,255,.15);background:rgba(255,255,255,.035)}
    .beinvtLayerDebugTag{position:fixed;pointer-events:none!important;z-index:999998;padding:3px 6px;border-radius:7px;border:1px solid currentColor;background:rgba(3,7,18,.92);color:currentColor;font-size:11px;font-weight:950;line-height:1.2;text-shadow:0 1px 1px #000;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,.35)}
    .beinvtLayerDebugPanel{position:fixed;left:18px;top:70px;right:auto;z-index:999999;width:560px;max-width:calc(100vw - 24px);max-height:calc(95vh - 75px);overflow:auto;border:1px solid rgba(255,255,255,.28);border-radius:13px;background:rgba(7,10,28,.96);color:#eef2ff;padding:10px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:1.25;box-shadow:0 16px 45px rgba(0,0,0,.45);cursor:grab;user-select:none}
    .beinvtLayerDebugPanel b{font-size:13px;color:#fff}.beinvtLayerDebugPanel .muted{color:#aeb7d5}.beinvtLayerDebugPanel .row{display:grid;grid-template-columns:22px 1fr 92px 205px;gap:6px;align-items:center;border-top:1px solid rgba(255,255,255,.10);padding:6px 0}.beinvtLayerDebugPanel .key{font-weight:950}.beinvtLayerDebugPanel .name{font-weight:850;color:#fff;overflow:hidden;text-overflow:ellipsis}.beinvtLayerDebugPanel .size{color:#dbeafe;text-align:right}.beinvtLayerDebugPanel button{border:1px solid rgba(255,255,255,.22);background:#10142d;color:#fff;border-radius:7px;padding:4px 6px;font-size:10px;font-weight:900;cursor:pointer}.beinvtLayerDebugPanel button:hover{background:#1b2250}.beinvtLayerDebugPanel .btns{display:flex;gap:4px;justify-content:flex-end}.beinvtLayerDebugPanel .dimControls{display:grid;grid-template-columns:1fr 1fr 42px;gap:4px;align-items:center}.beinvtLayerDebugPanel .dimControls input{width:100%;min-width:0;box-sizing:border-box;border:1px solid rgba(255,255,255,.20);background:#080b1a;color:#fff;border-radius:7px;padding:4px 5px;font-size:10px;font-weight:850}.beinvtLayerDebugPanel .dimControls input:focus{outline:2px solid rgba(124,108,255,.55)}.beinvtLayerDebugPanel .topBtns{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}.beinvtLayerDebugPanel code{color:#fde68a}
    @media print{.beinvtLayerDebugRoot,.beinvtLayerDebugPanel{display:none!important}}
  `;
  const tag = document.createElement("style");
  tag.setAttribute("data-beinvt-v867-layer-debug-css", "1");
  tag.textContent = css;
  document.head.appendChild(tag);
})();


(function injectLeftPanel730MetaPillsV8617Css(){
  const css = `
    /* v8.6.17: fixed requested left panel width and smaller label-color/qty pills. */
    body.beinvt-label-pot aside.panel,
    body.beinvt-label-pot .panel.sidebar,
    body.beinvt-label-pot .settingsPanel,
    body.beinvt-label-wrap aside.panel,
    body.beinvt-label-wrap .panel.sidebar,
    body.beinvt-label-wrap .settingsPanel{
      width:730px!important;
      min-width:730px!important;
      max-width:730px!important;
      flex:0 0 730px!important;
      flex-basis:730px!important;
      height:1177px!important;
      min-height:1177px!important;
      max-height:1177px!important;
    }
    .stageMeta{
      gap:7px!important;
      min-width:198px!important;
      max-width:306px!important;
      padding:7px!important;
      border-radius:13px!important;
    }
    body.beinvt-label-pot .stageMeta{
      width:min(100%,288px)!important;
      flex-direction:column!important;
    }
    body.beinvt-label-wrap .stageMeta{
      width:185px!important;
      flex:0 0 185px!important;
      flex-direction:column!important;
    }
    .stageMeta .metaPill{
      gap:9px!important;
      padding:7px 9px!important;
      border-radius:10px!important;
      font-size:11px!important;
      line-height:1.12!important;
    }
    .stageMeta b{
      font-size:12px!important;
    }
  `;
  const tag = document.createElement("style");
  tag.setAttribute("data-beinvt-v8617-left-panel-730-meta-pills", "1");
  tag.textContent = css;
  document.head.appendChild(tag);
})();

function fallbackLayout(type) {
  if (type === "POT") {
    return {
      name: "Pot Stakes Clean Default",
      labelType: "POT",
      safeMarginPx: 5,
      gridPx: 4,
      snapPx: 5,
      objects: {
        WO: { x: 3, y: 8, w: 66, h: 18, rot: 0, fontSize: 16, fontFamily: "Times New Roman", locked: false, visible: true, alignH: "center", alignV: "middle" },
        QR: { x: 12, y: 31, w: 48, h: 48, rot: 0, locked: false, visible: true },
        ITEM: { x: 2, y: 82, w: 68, h: 246, rot: 90, fontSize: 30, fontFamily: "Times New Roman", locked: false, visible: true, alignH: "center", alignV: "middle" },
        WEEK: { x: 11, y: 330, w: 50, h: 24, rot: 0, fontSize: 18, fontFamily: "Times New Roman", locked: false, visible: true, alignH: "center", alignV: "middle" }
      }
    };
  }
  return {
    name: "Wrap Ties Clean Default",
    labelType: "WRAP",
    safeMarginPx: 3,
    gridPx: 4,
    snapPx: 5,
    objects: {
      WO_QR: { x: 4, y: 7, w: 34, h: 34, rot: 0, locked: false, visible: true },
      WO: { x: 42, y: 2, w: 72, h: 13, rot: 0, fontSize: 13, fontFamily: "Times New Roman", locked: false, visible: true, alignH: "left", alignV: "middle" },
      CROP: { x: 42, y: 16, w: 72, h: 11, rot: 0, fontSize: 9, fontFamily: "Times New Roman", locked: false, visible: true, alignH: "left", alignV: "middle" },
      INTERNAL: { x: 42, y: 29, w: 72, h: 12, rot: 0, fontSize: 10, fontFamily: "Times New Roman", locked: false, visible: true, alignH: "left", alignV: "middle" },
      SCION: { x: 119, y: 1, w: 234, h: 18, rot: 0, fontSize: 20, fontFamily: "Times New Roman", locked: false, visible: true, alignH: "center", alignV: "middle" },
      SCION_PATENT: { x: 119, y: 16, w: 234, h: 5, rot: 0, fontSize: 4.5, fontFamily: "Times New Roman", locked: false, visible: true, alignH: "center", alignV: "middle" },
      ROOTSTOCK: { x: 119, y: 19, w: 234, h: 18, rot: 0, fontSize: 20, fontFamily: "Times New Roman", locked: false, visible: true, alignH: "center", alignV: "middle" },
      ROOTSTOCK_PATENT: { x: 119, y: 36, w: 234, h: 5, rot: 0, fontSize: 4.2, fontFamily: "Times New Roman", locked: false, visible: true, alignH: "center", alignV: "middle" },
      LOT: { x: 119, y: 37, w: 234, h: 6, rot: 0, fontSize: 5, fontFamily: "Times New Roman", locked: false, visible: true, alignH: "center", alignV: "middle" },
      ADDRESS: { x: 119, y: 43, w: 234, h: 5, rot: 0, fontSize: 4.6, fontFamily: "Times New Roman", locked: false, visible: true, alignH: "center", alignV: "middle" },
      LOT_QR: { x: 359, y: 7, w: 34, h: 34, rot: 0, locked: false, visible: true },
      LOGO: { x: 399, y: 4, w: 18, h: 40, rot: 0, locked: false, visible: true },
      WARNING: { x: 420, y: 2, w: 58, h: 44, rot: 0, fontSize: 3.2, fontFamily: "Times New Roman", locked: false, visible: true, alignH: "left", alignV: "middle" }
    }
  };
}

function normalizeLayout(src) {
  const type = (src && src.labelType) === "WRAP" ? "WRAP" : "POT";
  const base = fallbackLayout(type);
  const out = Object.assign({}, base, src || {}, { labelType: type, objects: {} });
  const sourceObjects = (src && src.objects) || {};
  for (const id of objectOrder(type)) {
    out.objects[id] = Object.assign({}, base.objects[id] || {}, sourceObjects[id] || {});
  }
  if (type === "WRAP" && sourceObjects.ITEM && !sourceObjects.SCION) {
    out.objects = clone(base.objects);
  }
  return out;
}
function loadDefaults() {
  DEFAULT_LAYOUTS.POT = fallbackLayout("POT");
  DEFAULT_LAYOUTS.WRAP = fallbackLayout("WRAP");
}
function loadWorkingLayout(type) {
  try {
    const raw = localStorage.getItem("beinvtWorkingLayout_" + type);
    if (raw) return normalizeLayout(JSON.parse(raw));
  } catch (e) {}
  return normalizeLayout(DEFAULT_LAYOUTS[type] || fallbackLayout(type));
}
function saveWorkingLayout() {
  if (layout) localStorage.setItem("beinvtWorkingLayout_" + labelType, JSON.stringify(layout));
}
function setLayout(next, keepHistory = true) {
  if (keepHistory) pushHistory();
  layout = normalizeLayout(clone(next));
  labelType = layout.labelType || labelType;
  if (!layout.objects[selectedId]) selectedId = defaultSelectedId(labelType);
  potAutoLayoutKey = "";
  clampAllObjects();
  saveWorkingLayout();
  renderAll();
}

function pushHistory() {
  if (isRestoring || !layout) return;
  undoStack.push(clone(layout));
  if (undoStack.length > 100) undoStack.shift();
  redoStack = [];
  updateUndoButtons();
}
function undo() {
  if (!undoStack.length) return;
  redoStack.push(clone(layout));
  isRestoring = true;
  layout = normalizeLayout(undoStack.pop());
  labelType = layout.labelType || labelType;
  if (!layout.objects[selectedId]) selectedId = defaultSelectedId(labelType);
  isRestoring = false;
  saveWorkingLayout();
  renderAll();
}
function redo() {
  if (!redoStack.length) return;
  undoStack.push(clone(layout));
  isRestoring = true;
  layout = normalizeLayout(redoStack.pop());
  labelType = layout.labelType || labelType;
  if (!layout.objects[selectedId]) selectedId = defaultSelectedId(labelType);
  isRestoring = false;
  saveWorkingLayout();
  renderAll();
}
function updateUndoButtons() {
  if ($("undoBtn")) $("undoBtn").disabled = !undoStack.length;
  if ($("redoBtn")) $("redoBtn").disabled = !redoStack.length;
}

function parseCsv(text) {
  const out = [];
  let row = [], cur = "", quote = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cur += '"'; i++; }
        else quote = false;
      } else cur += ch;
    } else {
      if (ch === '"') quote = true;
      else if (ch === ",") { row.push(cur); cur = ""; }
      else if (ch === "\n") { row.push(cur); out.push(row); row = []; cur = ""; }
      else if (ch !== "\r") cur += ch;
    }
  }
  row.push(cur); out.push(row);
  while (out.length && out[out.length - 1].every(c => !String(c).trim())) out.pop();
  return out;
}
function normCsvKey(s) {
  return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}
function csvVal(obj, names) {
  for (const name of names) {
    if (Object.prototype.hasOwnProperty.call(obj, name) && cleanDisplay(obj[name])) return cleanDisplay(obj[name]);
  }
  const wanted = names.map(normCsvKey);
  for (const [k, v] of Object.entries(obj)) {
    if (cleanDisplay(v) && wanted.includes(normCsvKey(k))) return cleanDisplay(v);
  }
  return "";
}
async function loadCsv() {
  const txt = await (await fetch("data/labels.csv?cache=" + Date.now())).text();
  const grid = parseCsv(txt);
  if (!grid.length) return;
  const headers = grid[0].map(x => String(x || "").trim());
  rows = grid.slice(1).map(line => {
    const raw = {};
    headers.forEach((h, i) => { raw[h] = line[i] || ""; });
    return {
      wo: csvVal(raw, ["Work Order", "WO"]),
      act: csvVal(raw, ["Activity Code", "Activity"]),
      crop: csvVal(raw, ["Crop"]),
      name: csvVal(raw, ["Name", "Item Name"]),
      scion: csvVal(raw, ["Scion"]),
      rootstock: csvVal(raw, ["Rootstock", "Root Stock"]),
      internalId: csvVal(raw, ["Internal ID", "InternalID", "Item Internal ID"]),
      lotNumber: csvVal(raw, ["Lot Number", "Lot", "Lot #"]),
      scionPatent: csvVal(raw, ["Scion Patent", "Scion Patent Number", "Scion Royalty", "Scion Royalty Fee"]),
      rootstockPatent: csvVal(raw, ["Rootstock Patent", "Rootstock Patent Number", "Root Stock Patent", "Rootstock Royalty", "Rootstock Royalty Fee"]),
      labelColor: csvVal(raw, ["Label Color", "Color"]),
      quantity: csvVal(raw, ["Quantity", "Qty"]) || "1",
      labelsNeeded: normalizeLabelCount(csvVal(raw, ["Labels Needed", "Labels", "Label Qty"]) || "1"),
      week: currentWeekNumber()
    };
  }).filter(r => cleanDisplay(r.wo));
  filteredRows = rows.slice();
}
function normalizeLabelCount(v) {
  const n = parseFloat(String(v ?? "").replace(/,/g, "").trim());
  if (Number.isFinite(n)) return String(Math.max(1, Math.ceil(n)));
  return cleanDisplay(v) || "1";
}
function displayLabelsNeeded(row) {
  return normalizeLabelCount(row && row.labelsNeeded);
}
function isoWeekNumber(date) {
  if (!(date instanceof Date) || isNaN(date)) return "";
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return String(Math.ceil((((d - y0) / 86400000) + 1) / 7));
}
function currentWeekNumber() {
  return isoWeekNumber(new Date());
}
function currentRow() {
  if (testMode) {
    return {
      wo: "WO9999999999",
      act: labelType === "WRAP" ? "SHIPPING REQUEST" : "POTTING UP - 120MM",
      crop: "PEACH (FREESTONE)",
      scion: "SUPER LONG GLEASON ELBERTA VARIETY NAME",
      rootstock: "EXTRA LONG KRYMSK 86 ROOTSTOCK NAME",
      internalId: "8650",
      lotNumber: "2026",
      scionPatent: "USPP 12345",
      rootstockPatent: "USPP 67890",
      labelColor: "HOT PINK",
      quantity: "3",
      labelsNeeded: "3",
      week: "52"
    };
  }
  return filteredRows[currentRowIndex] || rows[0] || {
    wo: "WO123456",
    act: "POTTING UP - 120MM",
    crop: "OLIVE",
    scion: "ARBEQUINA",
    rootstock: "TEST ROOTSTOCK",
    internalId: "27047",
    lotNumber: "2026",
    scionPatent: "",
    rootstockPatent: "",
    labelColor: "WHITE",
    quantity: "1",
    labelsNeeded: "1",
    week: currentWeekNumber()
  };
}

function splitLotParts(row) {
  return String((row && row.lotNumber) || "").split("|").map(s => cleanDisplay(s)).filter(Boolean);
}
function isRschScion(row) {
  return /rsch\s*scion/i.test(String((row && row.scion) || "")) || /rsch\s*scion/i.test(String((row && row.name) || ""));
}
function isRschRootstock(row) {
  return /rsch\s*rootstock/i.test(String((row && row.rootstock) || "")) || /rsch\s*rootstock/i.test(String((row && row.name) || ""));
}
function isRschRow(row) {
  return isRschScion(row) || isRschRootstock(row) || /rsch/i.test(String((row && row.scion) || "") + " " + String((row && row.rootstock) || "") + " " + String((row && row.name) || ""));
}
function derivedScion(row) {
  const raw = cleanDisplay(row && row.scion);
  const parts = splitLotParts(row);
  if (isRschScion(row)) return cleanDisplay(parts[0] || raw || row.crop);
  return cleanDisplay(raw || (row && row.crop));
}
function derivedRootstock(row) {
  const raw = cleanDisplay(row && row.rootstock);
  const parts = splitLotParts(row);
  if (isRschRootstock(row)) return cleanDisplay(parts[1] || parts[0] || raw);
  return cleanDisplay(raw || (row && row.scion));
}
function displayPotItem(row) {
  const olive = /olive/i.test(row && row.crop || "");
  let txt = olive ? (derivedScion(row) || derivedRootstock(row) || "ITEM") : (derivedRootstock(row) || derivedScion(row) || "ITEM");
  if (/^platinum\s+pistachio\s+rootstock$/i.test(txt)) txt = "Platinum";
  return capClean(txt);
}
function wrapScionText(row) {
  return capClean(derivedScion(row) || row.crop || derivedRootstock(row) || "ITEM");
}
function wrapRootstockText(row) {
  let txt = derivedRootstock(row) || derivedScion(row) || row.crop || "ROOTSTOCK";
  if (/^platinum\s+pistachio\s+rootstock$/i.test(txt)) txt = "Platinum";
  return capClean(txt);
}
function isGenevaRootstock(row) {
  /*
    v8.6.13: Geneva detection must work for normal rootstock rows and RSCH rootstock rows.
    The previous logic stopped at raw row.rootstock; for RSCH rows that can be "RSCH Rootstock",
    so it never checked the derived/lot printable rootstock where "GENEVA" actually appears.
  */
  const parts = splitLotParts(row);
  const haystack = [
    row && row.rootstock,
    row && row.name,
    row && row.item,
    row && row.itemRootstock,
    row && row.labelRootstock,
    row && row.lotNumber,
    ...parts,
    derivedRootstock(row),
    wrapRootstockText(row),
    displayPotItem(row)
  ].map(v => cleanDisplay(v)).filter(Boolean).join(" | ");
  return /geneva/i.test(haystack);
}
function logoUrlsForRow(row) {
  return isGenevaRootstock(row) ? [SG_LOGO_URL, GENEVA_SG_LOGO_URL] : [SG_LOGO_URL];
}
function logoUrlForRow(row) {
  return logoUrlsForRow(row)[0] || SG_LOGO_URL;
}
function logoTopForRow(o, row) {
  return isGenevaRootstock(row) ? Math.max(0, Number(o.y || 0) + GENEVA_LOGO_SHIFT_Y) : Number(o.y || 0);
}
function wrapLotLine(row) {
  if (isRschRow(row)) return "";
  return capClean(row && row.lotNumber);
}
function wrapLeftQrText(row) {
  return cleanDisplay(row && row.wo) || " ";
}
function wrapRightQrText(row) {
  if (isRschRow(row)) return "";
  const lot = cleanDisplay(row && row.lotNumber);
  const wo = cleanDisplay(row && row.wo);
  return lot ? `LOT ${lot} | ${wo}` : (wo || " ");
}
function labelText(id, row) {
  if (id === "WO") return capClean(row.wo || "WO");
  if (id === "ITEM") return displayPotItem(row);
  if (id === "WEEK") return capClean(currentWeekNumber());
  return "";
}
function wrapObjectText(id, row) {
  if (id === "WO") return capClean(row.wo);
  if (id === "CROP") return capClean(row.crop);
  if (id === "INTERNAL") return capClean(row.internalId);
  if (id === "SCION") return wrapScionText(row);
  if (id === "SCION_PATENT") return capClean(row.scionPatent);
  if (id === "ROOTSTOCK") return wrapRootstockText(row);
  if (id === "ROOTSTOCK_PATENT") return capClean(row.rootstockPatent);
  if (id === "LOT") return wrapLotLine(row);
  if (id === "ADDRESS") return WRAP_ADDRESS;
  if (id === "WARNING") return WRAP_WARNING;
  return "";
}

function hasWrapObjectValue(id, row) {
  if (labelType !== "WRAP") return true;
  if (id === "SCION_PATENT" || id === "ROOTSTOCK_PATENT") return !!cleanDisplay(wrapObjectText(id, row));
  if (id === "LOT") return !!cleanDisplay(wrapObjectText(id, row));
  return true;
}
function shouldRenderObject(id, row) {
  if (!layout || !layout.objects || !layout.objects[id] || layout.objects[id].visible === false) return false;
  return hasWrapObjectValue(id, row);
}
function applyWrapDataAwareStack(row) {
  if (labelType !== "WRAP" || !layout || !layout.objects) return;
  const o = layout.objects;
  const hasScionPatent = !!cleanDisplay(wrapObjectText("SCION_PATENT", row));
  const hasRootstockPatent = !!cleanDisplay(wrapObjectText("ROOTSTOCK_PATENT", row));
  const mainX = 119, mainW = 234;
  ["SCION", "SCION_PATENT", "ROOTSTOCK", "ROOTSTOCK_PATENT", "LOT", "ADDRESS"].forEach(id => {
    if (o[id]) { o[id].x = mainX; o[id].w = mainW; o[id].rot = 0; o[id].alignH = "center"; o[id].alignV = "middle"; }
  });
  let y = 1;
  if (o.SCION) {
    o.SCION.y = y;
    o.SCION.h = hasScionPatent ? 14 : (hasRootstockPatent ? 17 : 18);
    y += o.SCION.h;
  }
  if (o.SCION_PATENT) {
    o.SCION_PATENT.y = y;
    o.SCION_PATENT.h = hasScionPatent ? 5 : 0;
    if (hasScionPatent) y += o.SCION_PATENT.h;
  }
  if (o.ROOTSTOCK) {
    o.ROOTSTOCK.y = y;
    o.ROOTSTOCK.h = hasRootstockPatent ? 14 : (hasScionPatent ? 17 : 18);
    y += o.ROOTSTOCK.h;
  }
  if (o.ROOTSTOCK_PATENT) {
    o.ROOTSTOCK_PATENT.y = y;
    o.ROOTSTOCK_PATENT.h = hasRootstockPatent ? 5 : 0;
    if (hasRootstockPatent) y += o.ROOTSTOCK_PATENT.h;
  }
  if (o.LOT) {
    o.LOT.y = y;
    o.LOT.h = (hasScionPatent || hasRootstockPatent) ? 4 : 6;
    y += o.LOT.h;
  }
  if (o.ADDRESS) {
    o.ADDRESS.y = y;
    o.ADDRESS.h = Math.max(4, 48 - y);
  }
  clampAllObjects();
}
function qrUrl(text) {
  return "https://quickchart.io/qr?size=220&text=" + encodeURIComponent(text || " ");
}
function colorMeta(name) {
  const raw = cleanDisplay(name);
  const key = raw.toLowerCase().replace(/\s+/g, "");
  const map = {
    hotpink: { bg: "#ff69b4", fg: "#111827" }, pink: { bg: "#ec4899", fg: "#111827" }, red: { bg: "#ef4444", fg: "#ffffff" },
    yellow: { bg: "#facc15", fg: "#111827" }, turquoise: { bg: "#40e0d0", fg: "#111827" }, white: { bg: "#ffffff", fg: "#111827" },
    blue: { bg: "#3b82f6", fg: "#ffffff" }, green: { bg: "#22c55e", fg: "#111827" }, orange: { bg: "#fb923c", fg: "#111827" },
    purple: { bg: "#a855f7", fg: "#ffffff" }, darkpurple: { bg: "#581c87", fg: "#ffffff" }, black: { bg: "#111827", fg: "#ffffff" },
    gray: { bg: "#9ca3af", fg: "#111827" }, grey: { bg: "#9ca3af", fg: "#111827" }, lavender: { bg: "#c4b5fd", fg: "#111827" }, gold: { bg: "#d4af37", fg: "#111827" }, brown: { bg: "#92400e", fg: "#ffffff" }
  };
  if (map[key]) return { ...map[key], label: cap(raw) };
  const probe = document.createElement("span");
  probe.style.color = key;
  if (probe.style.color) return { bg: key, fg: "#111827", label: cap(raw) };
  return { bg: "rgba(255,255,255,.08)", fg: "#e5e7eb", label: cap(raw) || "UNKNOWN" };
}

function removeGitHubWorkflowText() {
  const needle = "To commit a preset to GitHub: export/download JSON, then use the included manual GitHub workflow Commit layout preset.";
  document.querySelectorAll("body *").forEach(el => {
    if (!el || ["SCRIPT", "STYLE"].includes(el.tagName)) return;
    [...el.childNodes].forEach(node => {
      if (node.nodeType === 3 && String(node.nodeValue || "").includes(needle)) {
        node.nodeValue = String(node.nodeValue || "").replace(needle, "").trim();
      }
    });
    if (el.children.length === 0 && String(el.textContent || "").trim() === needle) el.remove();
  });
}
function applyModeClass() {
  document.body.classList.toggle("beinvt-label-pot", labelType === "POT");
  document.body.classList.toggle("beinvt-label-wrap", labelType === "WRAP");
}
function ensureModeTabs() {
  const sel = $("labelType");
  if (!sel || $("modeTabs")) return;
  sel.style.display = "none";
  const tabs = document.createElement("div");
  tabs.id = "modeTabs";
  tabs.className = "modeTabs";
  tabs.innerHTML = '<button type="button" class="modeTab" data-mode="POT">Pot Stakes</button><button type="button" class="modeTab" data-mode="WRAP">Wrap Ties</button>';
  sel.parentNode.insertBefore(tabs, sel.nextSibling);
  tabs.addEventListener("click", ev => {
    const btn = ev.target.closest("[data-mode]");
    if (!btn) return;
    labelType = btn.getAttribute("data-mode");
    selectedId = defaultSelectedId(labelType);
    undoStack = [];
    redoStack = [];
    setLayout(loadWorkingLayout(labelType), false);
  });
}
function updateModeTabs() {
  document.querySelectorAll(".modeTab[data-mode]").forEach(btn => btn.classList.toggle("active", btn.getAttribute("data-mode") === labelType));
  if ($("labelType")) $("labelType").value = labelType;
  applyModeClass();
}

function findSettingsPanel() {
  const candidates = [...document.querySelectorAll("aside.panel,.panel.sidebar,.settingsPanel,aside")]
    .filter(el => el && !el.closest("#canvasHost") && !el.closest("#stageDataWrap") && !el.closest("#stageLabelHost"));
  const existing = candidates.find(el => el.classList && el.classList.contains("beinvtSettingsPanel"));
  if (existing) return existing;
  if (!candidates.length) return null;
  return candidates
    .map(el => ({ el, rect: el.getBoundingClientRect() }))
    .filter(x => x.rect.width > 80 && x.rect.height > 80)
    .sort((a, b) => a.rect.left - b.rect.left)[0]?.el || candidates[0];
}
function ensureLeftPanel() {
  const panel = findSettingsPanel();
  if (!panel) return;
  if (panel.dataset.beinvtCleanPanel === "1") return;
  panel.dataset.beinvtCleanPanel = "1";
  panel.classList.add("beinvtSettingsPanel");
  panel.innerHTML = `
    <section class="beinvtCard beinvtObjectsCard" id="objectsSection">
      <div class="beinvtCardHeader">Objects <span class="smallNote" id="objectsModeNote"></span></div>
      <div class="beinvtCardBody"><div id="objectPanel"></div></div>
    </section>
    <section class="beinvtCard" id="positionSection">
      <div class="beinvtCardHeader">Position / Size</div>
      <div class="beinvtCardBody">
        <div style="font-weight:900;color:#fff;margin-bottom:8px"><span id="selectedName">Object</span> <span class="smallNote">selected</span></div>
        <div class="compactGrid">
          <div class="field"><label for="x">X</label><input id="x" type="number" step="1"></div>
          <div class="field"><label for="y">Y</label><input id="y" type="number" step="1"></div>
          <div class="field"><label for="w">W</label><input id="w" type="number" step="1"></div>
          <div class="field"><label for="h">H</label><input id="h" type="number" step="1"></div>
        </div>
        <div class="compactGrid two" style="margin-top:8px">
          <div class="field"><label for="rot">Rot</label><input id="rot" type="number" step="1"></div>
          <div class="field"><label for="fontSize">Font Size</label><input id="fontSize" type="number" step="1"></div>
        </div>
        <div class="buttonRow" style="margin-top:9px">
          <label class="checkItem"><input id="lockToggle" type="checkbox"> Lock</label>
          <label class="checkItem"><input id="visibleToggle" type="checkbox"> Visible</label>
        </div>
      </div>
    </section>
    <section class="beinvtCard" id="gridSection">
      <div class="beinvtCardHeader">Grid / Snap / Safe Zone</div>
      <div class="beinvtCardBody">
        <div class="checkRow">
          <label class="checkItem"><input id="safeToggle" type="checkbox"> Show Safe Zone</label>
          <label class="checkItem"><input id="gridToggle" type="checkbox"> Show Grid</label>
          <label class="checkItem"><input id="snapToggle" type="checkbox"> Snap Guides</label>
          <label class="checkItem"><input id="snapGridToggle" type="checkbox"> Snap Grid</label>
        </div>
        <div class="compactGrid" style="margin-top:9px">
          <div class="field"><label for="safeMargin">Safe Margin</label><input id="safeMargin" type="number" min="0" max="40" step="1"></div>
          <div class="field"><label for="gridPx">Grid Size PX</label><input id="gridPx" type="number" min="1" max="80" step="1"></div>
          <div class="field"><label for="snapPx">Snap Distance PX</label><input id="snapPx" type="number" min="1" max="60" step="1"></div>
          <div class="field"><label>&nbsp;</label><button id="resetLayout" type="button" style="width:100%">Reset</button></div>
        </div>
      </div>
    </section>
    <details class="beinvtCard" id="layoutSection">
      <summary class="beinvtCardHeader">Presets / Import / Export</summary>
      <div class="beinvtCardBody">
        <div class="field"><label for="presetSelect">Saved Presets</label><select id="presetSelect"></select></div>
        <div class="buttonRow" style="margin-top:8px"><button id="savePreset" type="button">Save</button><button id="loadPreset" type="button">Load</button><button id="deletePreset" class="danger" type="button">Delete</button><button id="exportLayout" type="button">Export</button><button id="importLayout" type="button">Import</button><button id="downloadLayout" type="button">Download JSON</button></div>
        <div class="field" style="margin-top:8px"><textarea id="layoutJson" placeholder="Exported layout JSON appears here. Paste JSON here and click Import."></textarea></div>
      </div>
    </details>
    <details class="beinvtCard" id="queueSection">
      <summary class="beinvtCardHeader">Queue</summary>
      <div class="beinvtCardBody">
        <div class="buttonRow"><button id="addCurrent" type="button">Add Current</button><button id="clearQueue" class="danger" type="button">Clear Queue</button></div>
        <div id="queueList" style="margin-top:8px"></div>
      </div>
    </details>
    <details class="beinvtCard" id="calibrationSection">
      <summary class="beinvtCardHeader">Print Calibration</summary>
      <div class="beinvtCardBody">
        <p class="smallNote">Print 1-inch square, measure it, enter measured size, then save.</p>
        <div class="buttonRow"><button id="printCalibration" type="button">Print 1in Test Square</button></div>
        <div class="compactGrid two" style="margin-top:8px"><div class="field"><label for="measuredW">Measured W</label><input id="measuredW" type="number" step="0.001" value="1"></div><div class="field"><label for="measuredH">Measured H</label><input id="measuredH" type="number" step="0.001" value="1"></div></div>
        <div class="buttonRow" style="margin-top:8px"><button id="saveCalibration" type="button">Save Calibration</button></div>
        <div class="smallNote" id="calStatus" style="margin-top:6px"></div>
      </div>
    </details>
  `;
}


function outerCardSizeRuntimeConfig() {
  const override = window.BEINVT_OUTER_CARD_SIZE_CONFIG && typeof window.BEINVT_OUTER_CARD_SIZE_CONFIG === "object" ? window.BEINVT_OUTER_CARD_SIZE_CONFIG : {};
  const cfg = Object.assign({}, OUTER_CARD_SIZE_CONFIG, override);
  const storedW = localStorage.getItem("beinvtOuterCardDebugWidth_v8615");
  const storedH = localStorage.getItem("beinvtOuterCardDebugHeight_v8615");
  if (storedW !== null && storedW !== "") {
    cfg.widthMode = "manual";
    cfg.manualWidth = Number(storedW) || cfg.manualWidth;
    // Debug/manual width must be literal. Do not cap it back to the fitTopMenu value.
    cfg.capManualToAvailable = false;
  }
  if (storedH !== null && storedH !== "") {
    cfg.heightMode = "manual";
    cfg.height = Number(storedH) || cfg.height;
  }
  return cfg;
}
function shouldForceOuterCardSize() {
  const cfg = outerCardSizeRuntimeConfig();
  if (!cfg.enabled) return false;
  const allowed = Array.isArray(cfg.applyTo) ? cfg.applyTo : ["POT", "WRAP"];
  return allowed.includes(labelType);
}
function viewportWidthNow() {
  return Math.max(300, Math.round(window.innerWidth || document.documentElement.clientWidth || 0));
}
function viewportHeightNow() {
  return Math.max(300, Math.round(window.innerHeight || document.documentElement.clientHeight || 0));
}
function rectLooksLikeTopControlBar(el) {
  if (!el || el === document.body || el === document.documentElement) return false;
  const r = el.getBoundingClientRect();
  const vw = viewportWidthNow();
  if (!r || r.width < Math.max(420, vw * 0.45)) return false;
  if (r.height < 26 || r.height > 104) return false;
  if (r.top < -4 || r.top > 96 || r.bottom > 132) return false;
  const txt = String(el.textContent || "").toLowerCase();
  const hasControls = txt.includes("beinvt label designer") || txt.includes("pot stakes") || txt.includes("wrap ties") || txt.includes("zoom") || txt.includes("print current") || txt.includes("print queue") || txt.includes("worst-case");
  return hasControls || !!el.querySelector("#modeTabs,#labelType,#zoom,#printLabel,#printQueue,#testMode,.modeTab,button");
}
function scoreTopControlBarCandidate(el) {
  const r = el.getBoundingClientRect();
  let score = Math.round(r.width * 10) - Math.round(r.top * 4) - Math.abs(Math.round(r.height) - 48);
  const txt = String(el.textContent || "").toLowerCase();
  if (txt.includes("beinvt label designer")) score += 9000;
  if (txt.includes("pot stakes") && txt.includes("wrap ties")) score += 9000;
  if (txt.includes("zoom")) score += 3000;
  if (txt.includes("print current") || txt.includes("print queue")) score += 2200;
  if (txt.includes("worst-case")) score += 1200;
  if (el.querySelector("#modeTabs,#labelType,#zoom,#testMode,.modeTab")) score += 4500;
  if (el.matches && el.matches("header,.topbar,.toolbar,[role='banner']")) score += 2500;
  return score;
}
function topMenuElement() {
  const existing = document.querySelector("[data-beinvt-top-menu-ref='1']");
  if (existing && existing.isConnected && rectLooksLikeTopControlBar(existing)) return existing;
  document.querySelectorAll("[data-beinvt-top-menu-ref='1']").forEach(el => el.removeAttribute("data-beinvt-top-menu-ref"));

  const candidates = [];
  document.querySelectorAll(".topbar,.toolbar,header,[role='banner']").forEach(el => { if (rectLooksLikeTopControlBar(el)) candidates.push(el); });

  const anchors = [$("modeTabs"), $("labelType"), $("zoom"), $("printLabel"), $("printQueue"), $("testMode"), document.querySelector(".modeTab")].filter(Boolean);
  anchors.forEach(anchor => {
    let node = anchor;
    let guard = 0;
    while (node && node !== document.body && node !== document.documentElement && guard < 12) {
      if (rectLooksLikeTopControlBar(node)) candidates.push(node);
      node = node.parentElement;
      guard++;
    }
  });

  if (!candidates.length) {
    document.querySelectorAll("body *").forEach(el => {
      if (candidates.length > 80) return;
      if (rectLooksLikeTopControlBar(el)) candidates.push(el);
    });
  }
  const unique = [...new Set(candidates)];
  const best = unique.sort((a, b) => scoreTopControlBarCandidate(b) - scoreTopControlBarCandidate(a))[0] || null;
  if (best) {
    best.setAttribute("data-beinvt-top-menu-ref", "1");
    best.classList.add("beinvtTopMenuReference");
  }
  return best;
}
function topMenuBounds() {
  const viewportW = viewportWidthNow();
  const topbar = topMenuElement();
  if (!topbar) return { left: 0, right: viewportW, width: viewportW, top: 0, bottom: 0, height: 0, element: null };
  const r = topbar.getBoundingClientRect();
  const left = Math.max(0, Math.round((r && r.left) || 0));
  // v8.6.16: do NOT clamp the top control card right edge to viewportW.
  // The top card itself is the width authority; clamping here was the exact reason
  // A/C stayed about 190-196px short even when the debug target showed the larger width.
  const rawWidth = Math.max(0, Math.round((r && r.width) || 0));
  const right = Math.max(left + rawWidth, Math.round((r && r.right) || viewportW));
  const top = Math.max(0, Math.round((r && r.top) || 0));
  const bottom = Math.max(top, Math.round((r && r.bottom) || 0));
  const width = rawWidth || Math.max(0, right - left);
  const height = Math.max(0, bottom - top);
  return { left, right, width: width || viewportW, top, bottom, height, element: topbar };
}
function measureTopMenuBarWidth() {
  return topMenuBounds().width;
}
function outerCardDesiredLeft() {
  const cfg = outerCardSizeRuntimeConfig();
  const gap = Math.max(0, Number(cfg.leftGap || 0));
  const panel = findSettingsPanel();
  if (panel) return Math.ceil(panel.getBoundingClientRect().right + gap);
  const stage = document.querySelector(".stageWrap") || ($("canvasHost") && $("canvasHost").parentElement);
  if (stage) return Math.max(0, Math.ceil(stage.getBoundingClientRect().left));
  return 0;
}
function outerCardTargetLeft() {
  return outerCardDesiredLeft();
}
function outerCardRightLimit() {
  const cfg = outerCardSizeRuntimeConfig();
  const rightMargin = Math.max(0, Number(cfg.rightMargin || 0));
  const viewportW = viewportWidthNow();
  const top = topMenuBounds();
  // v8.6.16: T top control card is the right-edge authority, not viewport width.
  // If the top card is 2540px wide, A must be allowed to reach that same right edge.
  const right = top && top.element ? (top.right || (top.left + top.width)) : viewportW;
  return Math.max(300, Math.round(right - rightMargin));
}
function leftPanelWidthForTopMenuSum() {
  const panel = findSettingsPanel();
  if (!panel) return 0;
  const r = panel.getBoundingClientRect();
  return Math.max(0, Math.round((r && r.width) || 0));
}
function outerCardTopMenuSumWidth(stage) {
  const cfg = outerCardSizeRuntimeConfig();
  const minW = Math.max(300, Number(cfg.minWidth || 700));
  const top = topMenuBounds();
  const panelW = leftPanelWidthForTopMenuSum();
  const gap = Math.max(0, Number(cfg.leftGap || 0));
  const rightMargin = Math.max(0, Number(cfg.rightMargin || 0));
  if (top && top.element && top.width) {
    return Math.max(minW, Math.round(top.width - panelW - gap - rightMargin));
  }
  return Math.max(minW, outerCardAvailableWidth(stage));
}
function outerCardCurrentShift(stage) {
  const el = stage || document.querySelector(".stageWrap") || ($("canvasHost") && $("canvasHost").parentElement);
  if (!el) return 0;
  return Math.round(Number(el.dataset.beinvtOuterCardShiftX || 0) || 0);
}
function outerCardNaturalLeft(stage) {
  const el = stage || document.querySelector(".stageWrap") || ($("canvasHost") && $("canvasHost").parentElement);
  if (!el) return outerCardDesiredLeft();
  const r = el.getBoundingClientRect();
  if (!r || !Number.isFinite(r.left)) return outerCardDesiredLeft();
  // Remove our own visual shift so the measurement does not feed back and make A wiggle left/right.
  return Math.round(r.left - outerCardCurrentShift(el));
}
function outerCardLayoutMetrics(stage) {
  const cfg = outerCardSizeRuntimeConfig();
  const minW = Math.max(300, Number(cfg.minWidth || 700));
  const desiredLeft = outerCardDesiredLeft();
  const naturalLeft = outerCardNaturalLeft(stage);

  // v8.6.15: allow a small negative OR positive correction so A lines up to the left panel's right edge.
  // Previous versions only shifted right, which left unused space on the right and made C impossible to widen.
  const correction = cfg.shiftRightFromLeftPanel === false ? 0 : Math.round(desiredLeft - naturalLeft);
  const actualLeft = naturalLeft + correction;
  const rightLimit = outerCardRightLimit();

  // v8.6.15: width is anchored to actualLeft, not naturalLeft.
  // This makes: LEFT PANEL width + A width = TOP MENU width (minus configured margins/gaps).
  const widthAnchorLeft = actualLeft;
  const rawAvailable = Math.floor(rightLimit - widthAnchorLeft);
  const availableWidth = rawAvailable >= minW ? rawAvailable : Math.max(300, rawAvailable);
  return { desiredLeft, naturalLeft, correction, actualLeft, rightLimit, availableWidth, widthAnchorLeft };
}
function outerCardAvailableWidth(stage) {
  return Math.max(300, outerCardLayoutMetrics(stage).availableWidth);
}
function tableCardExtraWidth() {
  const override = window.BEINVT_TABLE_CARD_WIDTH_EXTRA_BY_LABEL && typeof window.BEINVT_TABLE_CARD_WIDTH_EXTRA_BY_LABEL === "object" ? window.BEINVT_TABLE_CARD_WIDTH_EXTRA_BY_LABEL : {};
  const merged = Object.assign({}, TABLE_CARD_WIDTH_EXTRA_BY_LABEL, override);
  return Math.max(0, Math.round(Number(merged[labelType] || 0)));
}
function outerCardTargetWidth(stage) {
  const cfg = outerCardSizeRuntimeConfig();
  const mode = String(cfg.widthMode || "fitTopMenu").toLowerCase();
  const extra = Number(cfg.extraWidth ?? OUTER_CARD_EXTRA_WIDTH ?? 0) || 0;
  const available = outerCardAvailableWidth(stage);

  // v8.6.16: final width authority.
  // For normal fit modes the rule is: LEFT PANEL width + A OUTER CARD width = T TOP MENU CARD width.
  // C cannot be made wider directly while A is short; C is flex:1 and only receives remaining space after D.
  if (mode === "fittopmenu" || mode === "topbar") {
    return Math.max(300, Math.round(outerCardTopMenuSumWidth(stage) + extra));
  }
  if (mode === "fitviewport" || mode === "fit" || mode === "available" || mode === "safe") {
    return Math.max(300, Math.round(available + extra));
  }
  const requested = Math.max(300, Math.round(Number(cfg.manualWidth || cfg.width || cfg.fallbackWidth || 1600) + extra));
  return cfg.capManualToAvailable === false ? requested : Math.min(requested, available);
}
function outerCardAvailableHeight(stage) {
  const cfg = outerCardSizeRuntimeConfig();
  const vh = viewportHeightNow();
  const bottomMargin = Math.max(0, Number(cfg.bottomMargin || 8));
  let top = 0;
  const el = stage || document.querySelector(".stageWrap") || ($("canvasHost") && $("canvasHost").parentElement);
  if (el) {
    const r = el.getBoundingClientRect();
    if (r && Number.isFinite(r.top) && r.top >= 0) top = Math.round(r.top);
  }
  if (!top) top = Math.max(0, topMenuBounds().bottom + 8);
  const minH = Math.max(260, Number(cfg.minHeight || 520));
  const rawAvailable = Math.floor(vh - top - bottomMargin);
  const scale = Math.min(1, Math.max(0.60, Number(cfg.pageHeightScale || 1)));
  const available = Math.floor(rawAvailable * scale);
  return Math.max(Math.min(minH, Math.max(260, vh - bottomMargin)), available);
}
function outerCardTargetHeight(stage) {
  const cfg = outerCardSizeRuntimeConfig();
  const mode = String(cfg.heightMode || "manual").toLowerCase();
  if (mode === "fitviewport" || mode === "fit" || mode === "available" || mode === "safe") {
    return Math.max(260, Math.round(outerCardAvailableHeight(stage)));
  }
  return Math.max(200, Math.round(Number(cfg.height || 1193)));
}
function releaseOuterCardAncestors(stage) {
  if (!stage) return;
  document.documentElement.style.removeProperty("min-width");
  document.body.style.removeProperty("min-width");
  document.documentElement.style.setProperty("overflow-x", "hidden", "important");
  document.body.style.setProperty("overflow-x", "hidden", "important");
  document.documentElement.style.setProperty("overflow-y", "hidden", "important");
  document.body.style.setProperty("overflow-y", "hidden", "important");

  let node = stage.parentElement;
  let guard = 0;
  while (node && node !== document.body && guard < 8) {
    node.style.setProperty("min-width", "0px", "important");
    node.style.setProperty("max-width", "none", "important");
    node.style.setProperty("box-sizing", "border-box", "important");
    node.style.setProperty("overflow-x", "visible", "important");
    node = node.parentElement;
    guard++;
  }
}
function forceOuterCardSize() {
  if (!shouldForceOuterCardSize()) return;
  const stage = document.querySelector(".stageWrap") || ($("canvasHost") && $("canvasHost").parentElement);
  if (!stage) return;

  releaseOuterCardAncestors(stage);

  const metrics = outerCardLayoutMetrics(stage);
  stage.style.setProperty("margin-left", "0px", "important");
  stage.style.setProperty("margin-right", "0px", "important");

  const width = outerCardTargetWidth(stage);
  const height = outerCardTargetHeight(stage);

  document.documentElement.style.setProperty("--beinvt-outer-card-width", width + "px");
  document.documentElement.style.setProperty("--beinvt-outer-card-height", height + "px");
  stage.style.setProperty("--beinvt-outer-card-width", width + "px");
  stage.style.setProperty("--beinvt-outer-card-height", height + "px");
  stage.dataset.beinvtOuterCardTarget = width + "x" + height;
  stage.dataset.beinvtOuterCardWidthMode = String(outerCardSizeRuntimeConfig().widthMode || "fitTopMenu");
  stage.dataset.beinvtOuterCardLeft = String(metrics.actualLeft);
  stage.dataset.beinvtOuterCardRightLimit = String(metrics.rightLimit);
  stage.dataset.beinvtOuterCardShiftX = String(metrics.correction || 0);

  stage.style.setProperty("box-sizing", "border-box", "important");
  stage.style.setProperty("position", "relative", "important");
  stage.style.setProperty("transform", "translateX(" + (metrics.correction || 0) + "px)", "important");
  stage.style.setProperty("will-change", "transform", "important");
  stage.style.setProperty("width", width + "px", "important");
  stage.style.setProperty("min-width", width + "px", "important");
  stage.style.setProperty("max-width", width + "px", "important");
  stage.style.setProperty("inline-size", width + "px", "important");
  stage.style.setProperty("min-inline-size", width + "px", "important");
  stage.style.setProperty("max-inline-size", width + "px", "important");
  stage.style.setProperty("flex", "0 0 " + width + "px", "important");
  stage.style.setProperty("flex-basis", width + "px", "important");
  stage.style.setProperty("height", height + "px", "important");
  stage.style.setProperty("min-height", height + "px", "important");
  stage.style.setProperty("max-height", height + "px", "important");
  stage.style.setProperty("overflow", "hidden", "important");

  const host = $("canvasHost");
  if (host) {
    host.style.setProperty("width", "100%", "important");
    host.style.setProperty("height", "100%", "important");
    host.style.setProperty("min-width", "0px", "important");
    host.style.setProperty("min-height", "0px", "important");
    host.style.setProperty("max-width", "100%", "important");
    host.style.setProperty("max-height", "100%", "important");
    host.style.setProperty("overflow", "hidden", "important");
    host.style.setProperty("display", "flex", "important");
  }

  // v8.6.15: make C absorb all remaining width after D so left panel + C + D reaches the top menu width.
  const dataWrap = $("stageDataWrap");
  const labelHost = $("stageLabelHost");
  if (dataWrap && !readDebugLayerManualSizes().C) {
    dataWrap.style.setProperty("flex", "1 1 auto", "important");
    dataWrap.style.setProperty("flex-grow", "1", "important");
    dataWrap.style.setProperty("flex-shrink", "1", "important");
    dataWrap.style.setProperty("flex-basis", "auto", "important");
    dataWrap.style.setProperty("width", "auto", "important");
    dataWrap.style.setProperty("min-width", "0px", "important");
    dataWrap.style.setProperty("max-width", "none", "important");
  }
  if (labelHost && !readDebugLayerManualSizes().D) {
    if (labelType === "POT") {
      labelHost.style.setProperty("flex", "0 0 360px", "important");
      labelHost.style.setProperty("width", "360px", "important");
      labelHost.style.setProperty("min-width", "360px", "important");
      labelHost.style.setProperty("max-width", "360px", "important");
      labelHost.style.setProperty("height", "100%", "important");
      labelHost.style.setProperty("min-height", "0px", "important");
      labelHost.style.setProperty("max-height", "100%", "important");
    } else {
      labelHost.style.setProperty("flex", "0 0 362px", "important");
      labelHost.style.setProperty("height", "362px", "important");
      labelHost.style.setProperty("min-height", "362px", "important");
      labelHost.style.setProperty("max-height", "362px", "important");
      labelHost.style.setProperty("width", "100%", "important");
      labelHost.style.setProperty("max-width", "100%", "important");
    }
  }
}
function dockStageAwayFromLeftPanel() {
  const panel = findSettingsPanel();
  const stage = document.querySelector(".stageWrap") || ($("canvasHost") && $("canvasHost").parentElement);
  if (!panel || !stage) return;

  if (shouldForceOuterCardSize()) {
    forceOuterCardSize();
    applyPersistentDebugLayerSizes(false);
    return;
  }

  const metrics = outerCardLayoutMetrics(stage);
  const width = Math.max(300, metrics.availableWidth + Number(window.BEINVT_OUTER_CARD_EXTRA_WIDTH ?? OUTER_CARD_EXTRA_WIDTH ?? 0));
  const height = outerCardTargetHeight(stage);

  stage.dataset.beinvtOuterCardShiftX = String(metrics.correction || 0);
  stage.style.setProperty("box-sizing", "border-box", "important");
  stage.style.setProperty("position", "relative", "important");
  stage.style.setProperty("transform", "translateX(" + (metrics.correction || 0) + "px)", "important");
  stage.style.setProperty("will-change", "transform", "important");
  stage.style.setProperty("margin-left", "0px", "important");
  stage.style.setProperty("margin-right", "0px", "important");
  stage.style.setProperty("min-width", width + "px", "important");
  stage.style.setProperty("max-width", width + "px", "important");
  stage.style.setProperty("flex", "0 0 " + width + "px", "important");
  stage.style.setProperty("flex-basis", width + "px", "important");
  stage.style.setProperty("align-self", "stretch", "important");
  stage.style.setProperty("overflow", "hidden", "important");
  stage.style.setProperty("width", width + "px", "important");
  stage.style.setProperty("height", height + "px", "important");
}

function outerCardDebugInfo() {
  const stage = document.querySelector(".stageWrap") || ($("canvasHost") && $("canvasHost").parentElement);
  const cs = stage ? getComputedStyle(stage) : null;
  const cfg = outerCardSizeRuntimeConfig();
  const top = topMenuBounds();
  const metrics = outerCardLayoutMetrics(stage);
  return {
    mode: cfg.widthMode,
    heightMode: cfg.heightMode,
    topbarFound: !!top.element,
    topbarWidth: measureTopMenuBarWidth(),
    topbarHeight: top.height,
    topbarLeft: top.left,
    topbarRight: top.right,
    topbarBottom: top.bottom,
    targetLeft: metrics.actualLeft,
    desiredLeft: metrics.desiredLeft,
    naturalLeft: metrics.naturalLeft,
    leftCorrection: metrics.correction,
    rightLimit: metrics.rightLimit,
    availableWidth: metrics.availableWidth,
    tableExtraWidth: tableCardExtraWidth(),
    targetWidth: outerCardTargetWidth(stage),
    targetHeight: outerCardTargetHeight(stage),
    inlineWidth: stage ? (stage.style.getPropertyValue("width") || "") : "",
    computedWidth: cs ? cs.width : "",
    flex: cs ? cs.flex : ""
  };
}

function debugLayerTargets() {
  return [
    { key: "T", color: "#a3e635", name: "TOP MENU CARD controls", selector: "[data-beinvt-top-menu-ref='1']", note: "actual top card containing Pot Stakes / Wrap Ties / Zoom / print buttons; read only" },
    { key: "A", color: "#ff4d6d", name: "OUTER CARD .stageWrap", selector: ".stageWrap", note: "big dark card that contains table plus preview" },
    { key: "B", color: "#fb923c", name: "SPLIT HOST #canvasHost", selector: "#canvasHost", note: "inside A; holds table card and preview area" },
    { key: "C", color: "#facc15", name: "TABLE CARD #stageDataWrap", selector: "#stageDataWrap", note: "WO/search table area" },
    { key: "D", color: "#22c55e", name: "LABEL AREA #stageLabelHost", selector: "#stageLabelHost", note: "area below/next to table where preview sits" },
    { key: "E", color: "#14b8a6", name: "PREVIEW STACK .stageStack", selector: ".stageStack", note: "stack around meta and label preview" },
    { key: "F", color: "#38bdf8", name: "PREVIEW ROW .labelPreviewRow", selector: ".labelPreviewRow", note: "row containing purple meta plus label" },
    { key: "G", color: "#818cf8", name: "SCALED FRAME .stageFrame", selector: ".stageFrame", note: "scaled preview frame" },
    { key: "H", color: "#e879f9", name: "WHITE LABEL .labelCanvas", selector: ".labelCanvas", note: "actual printable label canvas" },
    { key: "I", color: "#c084fc", name: "PURPLE INFO .stageMeta", selector: ".stageMeta", note: "label color / qty card" },
    { key: "J", color: "#f472b6", name: "SELECTED OBJECT .obj.selected", selector: ".obj.selected", note: "currently selected yellow object box" },
    { key: "K", color: "#ef4444", name: "SAFE ZONE .safeZone", selector: ".safeZone", note: "red dashed print safe boundary" },
    { key: "L", color: "#a3e635", name: "LEFT PANEL settings", selector: "aside.panel,.panel.sidebar,.settingsPanel", note: "left controls panel" }
  ];
}

function layerDebugRuntimeConfig() {
  const override = window.BEINVT_LAYER_DEBUG_CONFIG && typeof window.BEINVT_LAYER_DEBUG_CONFIG === "object" ? window.BEINVT_LAYER_DEBUG_CONFIG : {};
  return Object.assign({}, LAYER_DEBUG_CONFIG, override);
}
function isLayerDebugConfigEnabled() {
  return !!layerDebugRuntimeConfig().enabled;
}
function debugPanelSavedPosition() {
  const cfg = layerDebugRuntimeConfig();
  if (!cfg.rememberPosition) return null;
  try {
    const raw = localStorage.getItem("beinvtLayerDebugPanelPosition");
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}
function saveDebugPanelPosition(left, top) {
  const cfg = layerDebugRuntimeConfig();
  if (!cfg.rememberPosition) return;
  try { localStorage.setItem("beinvtLayerDebugPanelPosition", JSON.stringify({ left: Math.round(left), top: Math.round(top) })); } catch (e) {}
}
function positionDebugPanel(panel) {
  if (!panel || panel.dataset.beinvtPositioned === "1") return;
  const cfg = layerDebugRuntimeConfig();
  const saved = debugPanelSavedPosition();
  const left = saved && Number.isFinite(Number(saved.left)) ? Number(saved.left) : Number(cfg.defaultLeft || 18);
  const top = saved && Number.isFinite(Number(saved.top)) ? Number(saved.top) : Number(cfg.defaultTop || 70);
  panel.style.setProperty("left", Math.max(0, Math.min(viewportWidthNow() - 40, left)) + "px", "important");
  panel.style.setProperty("top", Math.max(0, Math.min((window.innerHeight || 900) - 40, top)) + "px", "important");
  panel.style.setProperty("right", "auto", "important");
  panel.dataset.beinvtPositioned = "1";
}
function makeDebugPanelMovable(panel) {
  const cfg = layerDebugRuntimeConfig();
  if (!panel || !cfg.movable || panel.dataset.beinvtMovable === "1") return;
  panel.dataset.beinvtMovable = "1";
  let drag = null;
  panel.addEventListener("pointerdown", ev => {
    if (!isDebugLayerLabelsOn()) return;
    if (ev.button !== 0) return;
    if (ev.target && ev.target.closest && ev.target.closest("button,input,textarea,select,a,label")) return;
    const r = panel.getBoundingClientRect();
    drag = { startX: ev.clientX, startY: ev.clientY, left: r.left, top: r.top };
    panel.style.cursor = "grabbing";
    try { panel.setPointerCapture && panel.setPointerCapture(ev.pointerId); } catch (e) {}
  });
  panel.addEventListener("pointermove", ev => {
    if (!drag) return;
    const nextLeft = Math.max(0, Math.min((window.innerWidth || 1200) - 40, drag.left + ev.clientX - drag.startX));
    const nextTop = Math.max(0, Math.min((window.innerHeight || 900) - 40, drag.top + ev.clientY - drag.startY));
    panel.style.setProperty("left", nextLeft + "px", "important");
    panel.style.setProperty("top", nextTop + "px", "important");
    panel.style.setProperty("right", "auto", "important");
  });
  function endDrag(ev) {
    if (!drag) return;
    const r = panel.getBoundingClientRect();
    saveDebugPanelPosition(r.left, r.top);
    drag = null;
    panel.style.cursor = "grab";
    try { panel.releasePointerCapture && panel.releasePointerCapture(ev.pointerId); } catch (e) {}
  }
  panel.addEventListener("pointerup", endDrag);
  panel.addEventListener("pointercancel", endDrag);
}

function isDebugLayerLabelsOn() {
  if (!isLayerDebugConfigEnabled()) return false;
  const raw = localStorage.getItem("beinvtDebugLayerLabels");
  if (raw === null) return !!DEBUG_LAYER_LABELS_DEFAULT || !!layerDebugRuntimeConfig().enabled;
  return raw === "1" || raw === "true";
}
function setDebugLayerLabels(on) {
  localStorage.setItem("beinvtDebugLayerLabels", on ? "1" : "0");
  updateDebugLayerLabels();
}
function roundedRectInfo(el) {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (!r || r.width <= 0 || r.height <= 0) return null;
  return { left: Math.round(r.left), top: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height), right: Math.round(r.right), bottom: Math.round(r.bottom) };
}
function ensureDebugLayerRoot() {
  let root = document.getElementById("beinvtLayerDebugRoot");
  if (!root) {
    root = document.createElement("div");
    root.id = "beinvtLayerDebugRoot";
    root.className = "beinvtLayerDebugRoot";
    document.body.appendChild(root);
  }
  return root;
}
function ensureDebugLayerPanel() {
  let panel = document.getElementById("beinvtLayerDebugPanel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "beinvtLayerDebugPanel";
    panel.className = "beinvtLayerDebugPanel";
    document.body.appendChild(panel);
  }
  positionDebugPanel(panel);
  makeDebugPanelMovable(panel);
  if (panel.dataset.beinvtSetDelegated !== "1") {
    panel.dataset.beinvtSetDelegated = "1";
    panel.addEventListener("pointerdown", () => holdDebugPanelAutoRefresh(1800), true);
    panel.addEventListener("input", () => holdDebugPanelAutoRefresh(1800), true);
    panel.addEventListener("click", ev => {
      const btn = ev.target && ev.target.closest ? ev.target.closest("button[data-debug-apply-size]") : null;
      if (!btn) return;
      holdDebugPanelAutoRefresh(1000);
      ev.preventDefault();
      ev.stopPropagation();
      applyDebugLayerSizeFromPanel(btn.getAttribute("data-debug-apply-size"));
    }, true);
    panel.addEventListener("keydown", ev => {
      const inp = ev.target && ev.target.matches && ev.target.matches("input[data-debug-dim-key][data-dim]") ? ev.target : null;
      if (!inp || ev.key !== "Enter") return;
      holdDebugPanelAutoRefresh(1000);
      ev.preventDefault();
      applyDebugLayerSizeFromPanel(inp.getAttribute("data-debug-dim-key"));
    }, true);
  }
  return panel;
}
function debugLayerElement(target) {
  if (target && target.key === "T") return topMenuElement();
  try { return document.querySelector(target.selector); } catch (e) { return null; }
}
function debugLayerSnapshot() {
  return debugLayerTargets().map(t => {
    const el = debugLayerElement(t);
    const r = roundedRectInfo(el);
    return Object.assign({}, t, { found: !!el, rect: r, className: el ? String(el.className || "") : "" });
  });
}
function debugDimensionInputs(t) {
  const r = t.rect;
  const manual = readDebugLayerManualSizes()[t.key];
  const active = document.activeElement;
  const activeW = active && active.matches && active.matches(`input[data-debug-dim-key="${CSS.escape(t.key)}"][data-dim="w"]`) ? active.value : null;
  const activeH = active && active.matches && active.matches(`input[data-debug-dim-key="${CSS.escape(t.key)}"][data-dim="h"]`) ? active.value : null;
  const storedOuterW = t.key === "A" ? localStorage.getItem("beinvtOuterCardDebugWidth_v8615") : null;
  const storedOuterH = t.key === "A" ? localStorage.getItem("beinvtOuterCardDebugHeight_v8615") : null;
  const w = activeW !== null ? activeW : (manual && manual.width ? manual.width : (t.key === "A" && storedOuterW ? Number(storedOuterW) : (t.key === "A" ? outerCardTargetWidth() : (r ? r.width : ""))));
  const h = activeH !== null ? activeH : (manual && manual.height ? manual.height : (t.key === "A" && storedOuterH ? Number(storedOuterH) : (t.key === "A" ? outerCardTargetHeight() : (r ? r.height : ""))));
  if (t.key === "T") {
    return `<div class="dimControls"><input type="number" step="1" min="1" value="${escapeHtml(w)}" readonly title="Top menu width px"><input type="number" step="1" min="1" value="${escapeHtml(h)}" readonly title="Top menu height px"><span class="readonlyRef">ref</span></div>`;
  }
  return `<div class="dimControls"><input type="number" step="1" min="1" value="${escapeHtml(w)}" data-debug-dim-key="${escapeHtml(t.key)}" data-dim="w" title="Width px"><input type="number" step="1" min="1" value="${escapeHtml(h)}" data-debug-dim-key="${escapeHtml(t.key)}" data-dim="h" title="Height px"><button type="button" data-debug-apply-size="${escapeHtml(t.key)}">Set</button></div>`;
}
function isDebugDimensionInputActive() {
  const active = document.activeElement;
  return !!(active && active.matches && active.matches("input[data-debug-dim-key][data-dim]"));
}
function holdDebugPanelAutoRefresh(ms = 1400) {
  window.beinvtDebugPanelHoldUntil = Date.now() + Math.max(200, Number(ms) || 1400);
}
function isDebugPanelAutoRefreshHeld() {
  return Date.now() < Number(window.beinvtDebugPanelHoldUntil || 0);
}
function updateDebugLayerLabelsSoft() {
  if (isDebugDimensionInputActive() || isDebugPanelAutoRefreshHeld()) return;
  updateDebugLayerLabels();
}
function updateDebugLayerLabels() {
  if (!document.body) return;
  const on = isDebugLayerLabelsOn();
  const root = ensureDebugLayerRoot();
  const panel = ensureDebugLayerPanel();
  if (!isLayerDebugConfigEnabled()) {
    root.style.display = "none";
    panel.style.display = "none";
    return;
  }
  panel.style.display = "block";
  if (!on) {
    root.style.display = "none";
    panel.innerHTML = `<b>Layer Debug: OFF</b><div class="muted">Set <code>LAYER_DEBUG_CONFIG.enabled</code> to <code>true</code> to show labels. Drag this panel by any empty area.</div><div class="topBtns"><button type="button" id="beinvtDebugOnBtn">Turn labels ON</button></div>`;
    const onBtn = document.getElementById("beinvtDebugOnBtn");
    if (onBtn) onBtn.onclick = () => setDebugLayerLabels(true);
    return;
  }
  root.style.display = "block";
  root.innerHTML = "";
  const snap = debugLayerSnapshot();
  snap.forEach(t => {
    if (!t.rect) return;
    const box = document.createElement("div");
    box.className = "beinvtLayerDebugBox";
    box.style.color = t.color;
    box.style.left = t.rect.left + "px";
    box.style.top = t.rect.top + "px";
    box.style.width = Math.max(1, t.rect.width) + "px";
    box.style.height = Math.max(1, t.rect.height) + "px";
    const tag = document.createElement("div");
    tag.className = "beinvtLayerDebugTag";
    tag.style.color = t.color;
    tag.style.left = Math.max(4, Math.min(window.innerWidth - 260, t.rect.left + 4)) + "px";
    tag.style.top = Math.max(4, Math.min(window.innerHeight - 24, t.rect.top + 4)) + "px";
    tag.textContent = `${t.key} ${t.name} ${t.rect.width}x${t.rect.height}`;
    root.appendChild(box);
    root.appendChild(tag);
  });
  const rows = snap.map(t => {
    const size = t.rect ? `${t.rect.width}x${t.rect.height}` : (t.found ? "0x0" : "not found");
    return `<div class="row" title="${escapeHtml(t.note)}"><div class="key" style="color:${escapeHtml(t.color)}">${escapeHtml(t.key)}</div><div class="name">${escapeHtml(t.name)}</div><div class="size">${escapeHtml(size)}</div>${debugDimensionInputs(t)}</div>`;
  }).join("");
  const ocInfo = outerCardDebugInfo();
  panel.innerHTML = `<b>Layer Debug: ON</b> <span class="muted">drag this panel anywhere</span><div class="muted">T is the top control card containing Pot Stakes / Wrap Ties / Zoom / print buttons. Found: <code>${escapeHtml(ocInfo.topbarFound)}</code>. A target: <code>${escapeHtml(ocInfo.targetWidth)}x${escapeHtml(ocInfo.targetHeight)}</code>. Width rule: <code>L + A = T</code> using T raw width, not viewport-clipped width. C table target gain ref: <code>${escapeHtml(ocInfo.tableExtraWidth)}</code>. Width mode: <code>${escapeHtml(ocInfo.mode)}</code>. Height mode: <code>${escapeHtml(ocInfo.heightMode)}</code>. T left/width/right/bottom: <code>${escapeHtml(ocInfo.topbarLeft)}/${escapeHtml(ocInfo.topbarWidth)}/${escapeHtml(ocInfo.topbarRight)}/${escapeHtml(ocInfo.topbarBottom)}</code>. A left/right/available/shift: <code>${escapeHtml(ocInfo.targetLeft)}/${escapeHtml(ocInfo.rightLimit)}/${escapeHtml(ocInfo.availableWidth)}/${escapeHtml(ocInfo.leftCorrection)}</code>. Inline: <code>${escapeHtml(ocInfo.inlineWidth)}</code>. Computed: <code>${escapeHtml(ocInfo.computedWidth)}</code>.</div><div class="topBtns"><button type="button" id="beinvtDebugOffBtn">Hide labels</button><button type="button" id="beinvtDebugRefreshBtn">Refresh</button><button type="button" id="beinvtDebugClearBtn">Clear manual sizes</button><button type="button" id="beinvtDebugCopyBtn">Copy sizes</button></div><div class="muted">Type W/H values and press <code>Set</code>. Manual sizes now persist for debug layers instead of snapping back. Clear manual sizes returns A to fitTopMenu/fitViewport. T is reference-only.</div>${rows}`;
  const offBtn = document.getElementById("beinvtDebugOffBtn");
  const refreshBtn = document.getElementById("beinvtDebugRefreshBtn");
  const clearBtn = document.getElementById("beinvtDebugClearBtn");
  const copyBtn = document.getElementById("beinvtDebugCopyBtn");
  if (offBtn) offBtn.onclick = () => setDebugLayerLabels(false);
  if (refreshBtn) refreshBtn.onclick = () => updateDebugLayerLabels();
  if (clearBtn) clearBtn.onclick = () => { clearDebugWidthTests(); renderAll(); updateDebugLayerLabels(); };
  if (copyBtn) copyBtn.onclick = () => copyDebugLayerSizes();
  panel.querySelectorAll("button[data-debug-apply-size]").forEach(btn => { btn.onclick = () => applyDebugLayerSizeFromPanel(btn.getAttribute("data-debug-apply-size")); });
  panel.querySelectorAll("input[data-debug-dim-key]").forEach(inp => {
    inp.addEventListener("keydown", ev => { if (ev.key === "Enter") applyDebugLayerSizeFromPanel(inp.getAttribute("data-debug-dim-key")); });
  });
}
const DEBUG_LAYER_MANUAL_SIZES_KEY = "beinvtLayerManualSizes_v8616";
function readDebugLayerManualSizes() {
  try { return JSON.parse(localStorage.getItem(DEBUG_LAYER_MANUAL_SIZES_KEY) || "{}"); } catch (e) { return {}; }
}
function writeDebugLayerManualSizes(sizes) {
  try { localStorage.setItem(DEBUG_LAYER_MANUAL_SIZES_KEY, JSON.stringify(sizes || {})); } catch (e) {}
}
function storeDebugLayerManualSize(key, width, height) {
  const sizes = readDebugLayerManualSizes();
  sizes[key] = { width: Math.max(1, Math.round(Number(width || 0))), height: Math.max(1, Math.round(Number(height || 0))) };
  writeDebugLayerManualSizes(sizes);
}
function applyDebugManualSizeToElement(key, el, size) {
  if (!el || !size || key === "T") return;
  const w = Math.max(1, Math.round(Number(size.width || size.w || 0)));
  const h = Math.max(1, Math.round(Number(size.height || size.h || 0)));
  if (!w || !h) return;
  el.dataset.beinvtDebugWidthTest = "1";
  el.style.setProperty("box-sizing", "border-box", "important");
  el.style.setProperty("width", w + "px", "important");
  el.style.setProperty("min-width", w + "px", "important");
  el.style.setProperty("max-width", w + "px", "important");
  el.style.setProperty("inline-size", w + "px", "important");
  el.style.setProperty("min-inline-size", w + "px", "important");
  el.style.setProperty("max-inline-size", w + "px", "important");
  el.style.setProperty("height", h + "px", "important");
  el.style.setProperty("min-height", h + "px", "important");
  el.style.setProperty("max-height", h + "px", "important");

  // v8.6.15: flex shorthand must be forced, otherwise existing !important CSS flex rules keep winning.
  if (key === "B" || key === "C" || key === "D" || key === "E" || key === "F" || key === "G" || key === "H" || key === "I") {
    el.style.setProperty("flex", "0 0 " + w + "px", "important");
    el.style.setProperty("flex-basis", w + "px", "important");
    el.style.setProperty("flex-grow", "0", "important");
    el.style.setProperty("flex-shrink", "0", "important");
  }
  if (key === "C") {
    // Keep the table internally scrollable; only its card gets debug-sized.
    el.style.setProperty("overflow", "hidden", "important");
    const scroller = el.querySelector(".stageTableScroll");
    if (scroller) scroller.style.setProperty("overflow-y", "auto", "important");
  }
}
function applyPersistentDebugLayerSizes(includeOuter = true) {
  const sizes = readDebugLayerManualSizes();
  if (includeOuter && sizes.A) forceOuterCardSize();
  debugLayerTargets().forEach(t => {
    if (t.key === "A" || t.key === "T") return;
    const size = sizes[t.key];
    if (!size) return;
    const el = debugLayerElement(t);
    applyDebugManualSizeToElement(t.key, el, size);
  });
}

function refreshDebugLayerLabelsSoon() {
  if (!isDebugLayerLabelsOn()) return;
  window.requestAnimationFrame(() => window.setTimeout(updateDebugLayerLabels, 40));
}
function readDebugPanelSizeInputs(key) {
  const wEl = document.querySelector(`input[data-debug-dim-key="${CSS.escape(key)}"][data-dim="w"]`);
  const hEl = document.querySelector(`input[data-debug-dim-key="${CSS.escape(key)}"][data-dim="h"]`);
  return {
    width: wEl ? Number(wEl.value || 0) : 0,
    height: hEl ? Number(hEl.value || 0) : 0
  };
}
function applyDebugLayerSizeFromPanel(key) {
  const v = readDebugPanelSizeInputs(key);
  setDebugLayerSize(key, v.width, v.height);
}
function setDebugLayerSize(key, width, height) {
  const target = debugLayerTargets().find(t => t.key === key);
  if (!target || key === "T") return;
  const el = debugLayerElement(target);
  const w = Math.max(1, Math.round(Number(width || 0)));
  const h = Math.max(1, Math.round(Number(height || 0)));
  if (!el) return;

  storeDebugLayerManualSize(key, w, h);
  if (key === "A") {
    const cfg = outerCardSizeRuntimeConfig();
    window.BEINVT_OUTER_CARD_SIZE_CONFIG = Object.assign({}, cfg, { widthMode: "manual", heightMode: "manual", manualWidth: w, height: h, capManualToAvailable: false });
    localStorage.setItem("beinvtOuterCardDebugWidth_v8615", String(w));
    localStorage.setItem("beinvtOuterCardDebugHeight_v8615", String(h));
    forceOuterCardSize();
    console.log(`[BEINVT layer debug] A outer card manual size -> ${w}x${h}`, window.BEINVT_OUTER_CARD_SIZE_CONFIG);
    updateDebugLayerLabels();
    return;
  }

  applyDebugManualSizeToElement(key, el, { width: w, height: h });
  // If an inner width is manually made larger than its parent can hold, expand A/B too.
  // Otherwise the inline debug size is technically set but visually clipped by #canvasHost.
  if ((key === "C" || key === "D" || key === "B") && labelType === "POT") {
    const sizes = readDebugLayerManualSizes();
    const cRect = roundedRectInfo($("stageDataWrap"));
    const dRect = roundedRectInfo($("stageLabelHost"));
    const desiredC = key === "C" ? w : (sizes.C && sizes.C.width ? Number(sizes.C.width) : (cRect ? cRect.width : 0));
    const desiredD = key === "D" ? w : (sizes.D && sizes.D.width ? Number(sizes.D.width) : (dRect ? dRect.width : 360));
    const requiredA = Math.max(300, Math.round(desiredC + desiredD + 8));
    const aRect = roundedRectInfo(document.querySelector(".stageWrap"));
    if (requiredA > (aRect ? aRect.width : 0)) {
      window.BEINVT_OUTER_CARD_SIZE_CONFIG = Object.assign({}, outerCardSizeRuntimeConfig(), { widthMode: "manual", manualWidth: requiredA, capManualToAvailable: false });
      localStorage.setItem("beinvtOuterCardDebugWidth_v8615", String(requiredA));
      forceOuterCardSize();
    }
  }
  window.requestAnimationFrame(() => applyPersistentDebugLayerSizes(false));
  console.log(`[BEINVT layer debug] ${key} ${target.name}: manual size -> ${w}x${h}`, el);
  holdDebugPanelAutoRefresh(500);
  updateDebugLayerLabels();
}
function widenDebugLayer(key, delta) {
  const target = debugLayerTargets().find(t => t.key === key);
  if (!target) return;
  const el = debugLayerElement(target);
  const r = roundedRectInfo(el);
  if (!el || !r) return;
  setDebugLayerSize(key, Math.max(20, r.width + Number(delta || 0)), r.height);
}
function clearDebugWidthTests() {
  document.querySelectorAll("[data-beinvt-debug-width-test]").forEach(el => {
    delete el.dataset.beinvtDebugWidthTest;
    ["width", "min-width", "max-width", "height", "min-height", "max-height", "flex-basis", "box-sizing"].forEach(prop => el.style.removeProperty(prop));
  });
  window.BEINVT_OUTER_CARD_SIZE_CONFIG = Object.assign({}, OUTER_CARD_SIZE_CONFIG);
  localStorage.removeItem(DEBUG_LAYER_MANUAL_SIZES_KEY);
  localStorage.removeItem("beinvtLayerManualSizes_v8612");
  localStorage.removeItem("beinvtLayerManualSizes_v8615");
    localStorage.removeItem("beinvtLayerManualSizes_v8616");
  localStorage.removeItem("beinvtOuterCardDebugWidth_v8610");
  localStorage.removeItem("beinvtOuterCardDebugHeight_v8610");
  localStorage.removeItem("beinvtOuterCardDebugWidth_v8615");
  localStorage.removeItem("beinvtOuterCardDebugHeight_v8615");
  localStorage.removeItem("beinvtOuterCardManualDebugWidth");
  forceOuterCardSize();
}
function copyDebugLayerSizes() {
  const text = debugLayerSnapshot().map(t => {
    const r = t.rect;
    return `${t.key} ${t.name}: ${r ? `${r.width}x${r.height} at ${r.left},${r.top}` : (t.found ? "found but 0x0" : "not found")}`;
  }).join("\n");
  console.log("[BEINVT layer debug sizes]\n" + text);
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).catch(() => {});
}
function installDebugLayerLabels() {
  window.BEINVT_DEBUG_LAYERS = { update: updateDebugLayerLabels, snapshot: debugLayerSnapshot, setSize: setDebugLayerSize, widen: widenDebugLayer, clear: clearDebugWidthTests, copySizes: copyDebugLayerSizes, applyManualSizes: applyPersistentDebugLayerSizes, on: () => setDebugLayerLabels(true), off: () => setDebugLayerLabels(false), config: LAYER_DEBUG_CONFIG, tableExtraByLabel: TABLE_CARD_WIDTH_EXTRA_BY_LABEL };
  window.BEINVT_OUTER_CARD_SIZE = { apply: forceOuterCardSize, config: OUTER_CARD_SIZE_CONFIG, info: outerCardDebugInfo, setManualWidth: w => { window.BEINVT_OUTER_CARD_SIZE_CONFIG = Object.assign({}, outerCardSizeRuntimeConfig(), { widthMode: "manual", manualWidth: Number(w) || outerCardTargetWidth(), capManualToAvailable: false }); localStorage.setItem("beinvtOuterCardDebugWidth_v8615", String(Number(w) || outerCardTargetWidth())); forceOuterCardSize(); updateDebugLayerLabelsSoft(); }, setManualSize: (w,h) => setDebugLayerSize("A", w, h) };
  if (!window.beinvtLayerDebugInterval) window.beinvtLayerDebugInterval = window.setInterval(() => { forceOuterCardSize(); applyPersistentDebugLayerSizes(false); updateDebugLayerLabelsSoft(); }, 650);
  if (!window.beinvtOuterCardForceBurst) {
    let n = 0;
    window.beinvtOuterCardForceBurst = window.setInterval(() => { forceOuterCardSize(); applyPersistentDebugLayerSizes(false); if (++n > 25) clearInterval(window.beinvtOuterCardForceBurst); }, 200);
  }
  document.addEventListener("keydown", ev => {
    if (layerDebugRuntimeConfig().showShortcut && ev.altKey && ev.key && ev.key.toLowerCase() === "d") {
      ev.preventDefault();
      if (!isLayerDebugConfigEnabled()) return;
      setDebugLayerLabels(!isDebugLayerLabelsOn());
    }
  });
  forceOuterCardSize();
  applyPersistentDebugLayerSizes(false);
  refreshDebugLayerLabelsSoon();
}

function nearestCleanupContainer(el) {
  if (!el) return null;
  return el.closest(".beinvtCard,details,fieldset,.section,.card,.panel,aside") || el.parentElement;
}
function textLooksLikeOldPositionCard(text) {
  const t = String(text || "").replace(/\s+/g, " ").trim().toLowerCase();
  return (
    (t.includes("selected") && t.includes("font size") && t.includes("visible") && t.includes("lock") && /\bx\b/.test(t) && /\by\b/.test(t) && /\bw\b/.test(t) && /\bh\b/.test(t)) ||
    (t.includes("position") && t.includes("size") && t.includes("rot") && t.includes("font size")) ||
    (t.includes("grid") && t.includes("snap") && t.includes("safe")) ||
    (t.includes("safe margin") && (t.includes("show safe") || t.includes("safe zone"))) ||
    t.includes("print calibration")
  );
}
function markDuplicateSettingsElement(el) {
  if (!el || el.classList.contains("beinvtSettingsPanel") || el.closest(".beinvtSettingsPanel")) return;
  if (el.closest("#canvasHost") || el.closest("#stageDataWrap") || el.closest("#stageLabelHost")) return;
  if (el.closest(".topbar") || el.closest(".toolbar") || el.closest("header")) return;
  el.classList.add("beinvtDuplicateSettings");
  el.setAttribute("aria-hidden", "true");
}
function removeDuplicateRightMenuControls() {
  const primary = findSettingsPanel();
  if (!primary) return;
  const duplicateIds = [
    "selectedName", "x", "y", "w", "h", "rot", "fontSize", "lockToggle", "visibleToggle",
    "safeToggle", "safeMargin", "safeValue", "gridToggle", "snapToggle", "snapGridToggle", "gridPx", "snapPx",
    "printCalibration", "saveCalibration", "measuredW", "measuredH", "calStatus"
  ];
  for (const id of duplicateIds) {
    document.querySelectorAll('[id="' + id + '"]').forEach(el => {
      if (primary.contains(el)) return;
      const box = nearestCleanupContainer(el);
      markDuplicateSettingsElement(box || el);
    });
  }
  document.querySelectorAll("aside.panel,.panel.sidebar,.settingsPanel,aside,.section,.card,details,fieldset").forEach(el => {
    if (!el || el === primary || primary.contains(el)) return;
    if (el.closest("#canvasHost") || el.closest("#stageDataWrap") || el.closest("#stageLabelHost")) return;
    if (textLooksLikeOldPositionCard(el.textContent || "")) markDuplicateSettingsElement(el);
  });
}

function objectDisplayName(id) {
  if (labelType === "WRAP") {
    return {
      WO_QR: "WO QR", WO: "WO", CROP: "Crop", INTERNAL: "Internal ID", SCION: "Scion", SCION_PATENT: "Scion Patent",
      ROOTSTOCK: "Rootstock", ROOTSTOCK_PATENT: "Rootstock Patent", LOT: "Lot", ADDRESS: "Address", LOT_QR: "Lot QR", LOGO: "SG Logo", WARNING: "Warning"
    }[id] || id;
  }
  return { WO: "Work Order", QR: "WO QR", ITEM: "Pot Stake Item", WEEK: "Week" }[id] || id;
}
function renderObjectPanel() {
  const panel = $("objectPanel");
  if (!panel || !layout || !layout.objects) return;
  if (!layout.objects[selectedId]) selectedId = defaultSelectedId(labelType);
  panel.innerHTML = "";
  if ($("objectsModeNote")) $("objectsModeNote").textContent = labelType === "WRAP" ? "Wrap Tie" : "Pot Stake";
  for (const id of objectOrder()) {
    const o = layout.objects[id];
    if (!o) continue;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "objectBtn" + (selectedId === id ? " active" : "") + (o.visible === false ? " hiddenObj" : "");
    btn.innerHTML = `<span>${escapeHtml(objectDisplayName(id))}</span><span class="badge">${o.visible === false ? "HIDDEN" : (o.locked ? "LOCKED" : "UNLOCKED")}</span>`;
    btn.onclick = () => selectObject(id, true);
    panel.appendChild(btn);
  }
}
function startPanelWatchdog() {
  let passes = 0;
  const tick = () => {
    passes++;
    ensureLeftPanel();
    removeDuplicateRightMenuControls();
    renderObjectPanel();
    syncControls();
    if (passes > 40) clearInterval(timer);
  };
  const timer = setInterval(tick, 200);
  tick();
}

function ensureStageShell() {
  const host = $("canvasHost");
  if (!host) return null;
  if (!$("stageLabelHost")) {
    host.innerHTML = "";
    const data = document.createElement("div");
    data.id = "stageDataWrap";
    data.innerHTML = '<div id="stageDataSearchRow"><input id="stageSearch" placeholder="Search labels..."></div><div class="stageTableScroll"><table class="table" id="stageRowsTable"><thead><tr id="stageRowsHead"></tr></thead><tbody id="stageRowsBody"></tbody></table></div>';
    const labelHost = document.createElement("div");
    labelHost.id = "stageLabelHost";
    host.appendChild(data);
    host.appendChild(labelHost);
    const oldBody = $("rowsBody");
    if (oldBody) {
      const oldSection = oldBody.closest(".section") || oldBody.closest("table") || oldBody.parentElement;
      if (oldSection) oldSection.style.display = "none";
    }
    const stageSearch = $("stageSearch");
    if (stageSearch) {
      stageSearch.value = ($("search") && $("search").value) || "";
      stageSearch.addEventListener("input", () => {
        if ($("search")) $("search").value = stageSearch.value;
        currentRowIndex = 0;
        renderRows();
        renderCanvas();
      });
    }
  }
  dockStageAwayFromLeftPanel();
  return $("stageLabelHost");
}
function resetZoomToAutoMax() {
  const zoomInput = $("zoom");
  zoomAutoModeKey = "";
  if (zoomInput) {
    zoomInput.dataset.beinvtManualZoom = "0";
    zoomInput.dataset.beinvtZoomMode = "";
  }
}

function applyZoomSliderCap(labelHost) {
  const zoomInput = $("zoom");
  const s = sizePx();
  const host = labelHost || $("stageLabelHost");
  const hostW = Math.max(1, (host && host.clientWidth) || window.innerWidth || 900);
  const hostH = Math.max(1, (host && host.clientHeight) || window.innerHeight || 500);
  const metaW = labelType === "WRAP" ? 200 : 0;
  const metaH = labelType === "POT" ? 112 : 0;
  const availableW = labelType === "WRAP" ? hostW - metaW - 22 : hostW - 12;
  const availableH = labelType === "POT" ? hostH - metaH - 16 : hostH - 12;
  const maxByW = availableW / Math.max(1, s.w);
  const maxByH = availableH / Math.max(1, s.h);
  const hardMax = labelType === "WRAP" ? 5.0 : 2.15;
  const max = clamp(Math.min(maxByW, maxByH, hardMax), 0.35, hardMax);

  if (zoomInput) {
    zoomInput.min = "0.25";
    zoomInput.step = "0.01";
    zoomInput.max = max.toFixed(2);

    const modeKey = labelType;
    const manual = zoomInput.dataset.beinvtManualZoom === "1" && zoomInput.dataset.beinvtZoomMode === modeKey;
    let current = Number(zoomInput.value || max);

    // Default load and template switches open at the largest usable zoom.
    // Once the user moves the slider, preserve that choice but clamp it so
    // the slider never has a dead/unusable range.
    if (!manual) {
      zoomInput.value = max.toFixed(2);
      zoomInput.dataset.beinvtManualZoom = "0";
      zoomInput.dataset.beinvtZoomMode = modeKey;
      zoomAutoModeKey = modeKey;
      current = max;
    } else {
      if (!Number.isFinite(current) || current > max) current = max;
      if (current < 0.25) current = 0.25;
      zoomInput.value = current.toFixed(2);
    }
  }
  return zoomInput ? Number(zoomInput.value || max) : max;
}

function renderAll() {
  applyModeClass();
  removeGitHubWorkflowText();
  ensureLeftPanel();
  dockStageAwayFromLeftPanel();
  removeDuplicateRightMenuControls();
  ensureModeTabs();
  updateModeTabs();
  renderRows();
  renderCanvas();
  dockStageAwayFromLeftPanel();
  applyPersistentDebugLayerSizes(false);
  renderObjectPanel();
  syncControls();
  renderPresetList();
  renderQueue();
  updateUndoButtons();
  refreshDebugLayerLabelsSoon();
}

function woSortNumber(row) {
  const m = String((row && row.wo) || "").match(/(\d+)/g);
  if (!m || !m.length) return -1;
  const n = parseInt(m[m.length - 1], 10);
  return Number.isFinite(n) ? n : -1;
}
function compareWoRowsDescending(a, b) {
  const bn = woSortNumber(b);
  const an = woSortNumber(a);
  if (bn !== an) return bn - an;
  return String((b && b.wo) || "").localeCompare(String((a && a.wo) || ""), undefined, { numeric: true, sensitivity: "base" });
}
function sortRowsLatestFirst(list) {
  return (list || []).slice().sort(compareWoRowsDescending);
}

function renderRows() {
  ensureStageShell();
  const q = (($("stageSearch") && $("stageSearch").value) || ($("search") && $("search").value) || "").toLowerCase();
  if ($("search") && $("stageSearch") && $("search").value !== $("stageSearch").value) $("search").value = $("stageSearch").value;
  filteredRows = sortRowsLatestFirst(rows.filter(r => {
    if (labelType === "POT") {
      if (cleanDisplay(r.scion)) return false;
      if (POT_EXCLUDED_ACTIVITIES.some(rx => rx.test(cleanDisplay(r.act)))) return false;
    }
    return Object.values(r).join(" ").toLowerCase().includes(q);
  }));
  if (currentRowIndex >= filteredRows.length) currentRowIndex = 0;
  const head = $("stageRowsHead");
  if (head) head.innerHTML = labelType === "POT" ? potHeaderHtml() : wrapHeaderHtml();
  renderRowBody($("stageRowsBody"));
}
function potHeaderHtml() {
  return "<th style='width:14%'>WO</th><th style='width:28%'>Activity</th><th style='width:32%'>Item / Rootstock</th><th style='width:14%'>Color</th><th style='width:8%'>Labels</th><th style='width:4%'></th>";
}
function wrapHeaderHtml() {
  return "<th style='width:8%'>WO</th><th style='width:13%'>Activity</th><th style='width:11%'>Crop</th><th style='width:12%'>Scion</th><th style='width:12%'>Rootstock</th><th style='width:10%'>Scion Patent</th><th style='width:10%'>Rootstock Patent</th><th style='width:9%'>Internal ID</th><th style='width:8%'>Color</th><th style='width:4%'>Labels</th><th style='width:3%'></th>";
}
function cell(v) {
  return escapeHtml(capClean(v));
}
function buildRowHtml(r) {
  if (labelType === "POT") {
    return `<td>${cell(r.wo)}</td><td>${cell(r.act)}</td><td>${cell(derivedRootstock(r) || displayPotItem(r))}</td><td>${cell(r.labelColor)}</td><td>${escapeHtml(displayLabelsNeeded(r))}</td><td><button type="button">Add</button></td>`;
  }
  return `<td>${cell(r.wo)}</td><td>${cell(r.act)}</td><td>${cell(r.crop)}</td><td>${cell(wrapScionText(r))}</td><td>${cell(wrapRootstockText(r))}</td><td>${cell(r.scionPatent)}</td><td>${cell(r.rootstockPatent)}</td><td>${cell(r.internalId)}</td><td>${cell(r.labelColor)}</td><td>${escapeHtml(displayLabelsNeeded(r))}</td><td><button type="button">Add</button></td>`;
}
function renderRowBody(tbody) {
  if (!tbody) return;
  tbody.innerHTML = "";
  filteredRows.slice(0, 400).forEach((r, i) => {
    const tr = document.createElement("tr");
    if (i === currentRowIndex) tr.className = "active";
    tr.innerHTML = buildRowHtml(r);
    tr.onclick = ev => {
      if (ev.target.tagName === "BUTTON") { addToQueue(r); return; }
      currentRowIndex = i;
      renderRows();
      renderCanvas();
    };
    tbody.appendChild(tr);
  });
}

function currentPotAutoKey() {
  const row = currentRow();
  return [labelType, row.wo || "", displayPotItem(row), currentWeekNumber()].join("|");
}
function syncPotAutoLayout() {
  if (labelType !== "POT" || !layout) return;
  const key = currentPotAutoKey();
  if (potAutoLayoutKey === key) return;
  applyPotAutoStack();
  potAutoLayoutKey = key;
}
function applyPotAutoStack() {
  if (labelType !== "POT" || !layout || !layout.objects) return;
  const objs = layout.objects;
  const bottomLimit = 350;
  if (objs.WO) Object.assign(objs.WO, { x: 3, y: 8, w: 66, h: 18, rot: 0, alignH: "center", alignV: "middle" });
  if (objs.QR) {
    objs.QR.rot = 0;
    objs.QR.w = clamp(Number(objs.QR.w || 48), 34, 50);
    objs.QR.h = clamp(Number(objs.QR.h || 48), 34, 50);
    objs.QR.x = Math.round((72 - objs.QR.w) / 2);
    objs.QR.y = Number(objs.WO.y || 8) + Number(objs.WO.h || 18) + 3;
  }
  if (objs.WEEK) Object.assign(objs.WEEK, { x: 11, y: bottomLimit - 24, w: 50, h: 24, rot: 0, alignH: "center", alignV: "middle" });
  if (objs.ITEM) {
    objs.ITEM.x = 2;
    objs.ITEM.w = 68;
    objs.ITEM.rot = 90;
    objs.ITEM.alignH = "center";
    objs.ITEM.alignV = "middle";
    objs.ITEM.y = Number(objs.QR.y || 30) + Number(objs.QR.h || 48) + 3;
    objs.ITEM.h = Math.max(52, Number(objs.WEEK.y || bottomLimit - 24) - objs.ITEM.y - 4);
  }
  clampAllObjects();
}
function renderCanvas() {
  const labelHost = ensureStageShell();
  if (!labelHost || !layout) return;
  labelHost.innerHTML = "";
  if (labelType === "POT") syncPotAutoLayout();
  if (labelType === "WRAP") applyWrapDataAwareStack(currentRow());
  const s = sizePx();
  const zoom = applyZoomSliderCap(labelHost);
  const row = currentRow();
  const cm = colorMeta(row.labelColor || "");
  const stack = document.createElement("div");
  stack.className = "stageStack";
  const previewRow = document.createElement("div");
  previewRow.className = "labelPreviewRow " + (labelType === "POT" ? "potPreviewRow" : "wrapPreviewRow");
  const meta = document.createElement("div");
  meta.className = "stageMeta";
  meta.innerHTML = `<span class="metaPill colorPill" style="background:${escapeHtml(cm.bg)};color:${escapeHtml(cm.fg)};border-color:${escapeHtml(cm.fg === "#ffffff" ? "rgba(255,255,255,.35)" : "rgba(17,24,39,.2)")}">Label Color <b style="color:${escapeHtml(cm.fg)}">${escapeHtml(cm.label)}</b></span><span class="metaPill">Qty <b>${escapeHtml(displayLabelsNeeded(row))}</b></span>`;
  const frame = document.createElement("div");
  frame.className = "stageFrame";
  frame.style.width = Math.ceil(s.w * zoom) + "px";
  frame.style.height = Math.ceil(s.h * zoom) + "px";
  const stage = document.createElement("div");
  stage.className = "stageInner";
  stage.style.width = s.w + "px";
  stage.style.height = s.h + "px";
  stage.style.transform = `scale(${zoom})`;
  const canvas = document.createElement("div");
  canvas.className = "labelCanvas";
  canvas.style.width = s.w + "px";
  canvas.style.height = s.h + "px";
  stage.appendChild(canvas);
  frame.appendChild(stage);
  if (showGrid) addGrid(canvas);
  if (showSafeZone) addSafeZone(canvas);
  for (const id of objectOrder()) {
    const o = layout.objects[id];
    if (!shouldRenderObject(id, row)) continue;
    const obj = document.createElement("div");
    obj.className = "obj" + (selectedId === id ? " selected" : "") + (o.locked ? " locked" : "");
    obj.dataset.id = id;
    Object.assign(obj.style, { left: o.x + "px", top: (labelType === "WRAP" && id === "LOGO" ? logoTopForRow(o, row) : o.y) + "px", width: o.w + "px", height: o.h + "px" });
    if (labelType === "WRAP") obj.appendChild(makeWrapObjectInner(id, row, o));
    else if (id === "QR") renderQrInto(obj, row.wo);
    else obj.appendChild(makeTextInner(id, row, o));
    canvas.appendChild(obj);
    attachObjectEvents(obj);
  }
  previewRow.appendChild(meta);
  previewRow.appendChild(frame);
  stack.appendChild(previewRow);
  labelHost.appendChild(stack);
  autoFitAllTextSoon();
  applyPersistentDebugLayerSizes(false);
  refreshDebugLayerLabelsSoon();
}
function addGrid(canvas) {
  const gp = Number((layout && layout.gridPx) || 4);
  const grid = document.createElement("div");
  grid.className = "gridOverlay";
  grid.style.backgroundImage = "linear-gradient(to right, rgba(2,6,23,.28) 1px, transparent 1px),linear-gradient(to bottom, rgba(2,6,23,.28) 1px, transparent 1px)";
  grid.style.backgroundSize = `${gp}px ${gp}px`;
  canvas.appendChild(grid);
}
function addSafeZone(canvas) {
  const s = sizePx();
  const m = Number((layout && layout.safeMarginPx) || 0);
  const safe = document.createElement("div");
  safe.className = "safeZone";
  safe.style.left = m + "px";
  safe.style.top = m + "px";
  safe.style.width = Math.max(1, s.w - 2 * m) + "px";
  safe.style.height = Math.max(1, s.h - 2 * m) + "px";
  canvas.appendChild(safe);
}
function makeTextInner(id, row, o) {
  const inner = document.createElement("div");
  inner.className = "inner" + (id === "ITEM" ? " potItemInner" : "");
  inner.dataset.textId = id;
  inner.textContent = labelText(id, row);
  inner.style.fontSize = (o.fontSize || 16) + "px";
  inner.style.fontFamily = `"${o.fontFamily || "Times New Roman"}", Georgia, serif`;
  inner.style.justifyContent = alignH(o.alignH);
  inner.style.alignItems = alignV(o.alignV);
  inner.style.textAlign = "center";
  applyInnerRotation(inner, o);
  return inner;
}
function applyInnerRotation(inner, o) {
  const r = ((Number(o.rot || 0) % 360) + 360) % 360;
  const swap = r === 90 || r === 270;
  inner.style.left = swap ? ((o.w - o.h) / 2) + "px" : "0px";
  inner.style.top = swap ? ((o.h - o.w) / 2) + "px" : "0px";
  inner.style.width = (swap ? o.h : o.w) + "px";
  inner.style.height = (swap ? o.w : o.h) + "px";
  inner.style.transform = `rotate(${Number(o.rot || 0)}deg)`;
}
function renderQrInto(el, text) {
  const img = document.createElement("img");
  img.src = qrUrl(text);
  img.alt = "QR";
  img.onerror = () => {
    el.innerHTML = "";
    const c = document.createElement("canvas");
    el.appendChild(c);
    if (window.BEINVT_QR_FALLBACK) window.BEINVT_QR_FALLBACK.draw(c, text);
  };
  el.appendChild(img);
}
function makeWrapObjectInner(id, row, o) {
  const holder = document.createElement("div");
  holder.style.position = "absolute";
  holder.style.inset = "0";
  holder.style.overflow = "hidden";
  if (id === "WO_QR") { renderQrInto(holder, wrapLeftQrText(row)); return holder; }
  if (id === "LOT_QR") { const txt = wrapRightQrText(row); if (txt) renderQrInto(holder, txt); return holder; }
  if (id === "LOGO") return makeLogoInner(row);
  const text = wrapObjectText(id, row);
  const inner = document.createElement("div");
  inner.className = "wrapTextInner" + (["WO", "CROP", "INTERNAL", "WARNING"].includes(id) ? " leftText" : "") + (["SCION_PATENT", "ROOTSTOCK_PATENT", "LOT", "ADDRESS", "WARNING"].includes(id) ? " smallText" : "") + (id === "WARNING" ? " warningText" : "");
  inner.dataset.textId = id;
  inner.style.fontSize = (o.fontSize || 8) + "px";
  inner.style.justifyContent = alignH(o.alignH);
  inner.style.alignItems = alignV(o.alignV);
  inner.style.textAlign = o.alignH === "left" ? "left" : o.alignH === "right" ? "right" : "center";
  if (id === "ROOTSTOCK") inner.innerHTML = `<span class="wrapOn">on</span>${escapeHtml(wrapRootstockText(row))}`;
  else inner.textContent = text;
  if (!text && !["ADDRESS", "WARNING"].includes(id)) holder.parentElement?.classList?.add("emptyText");
  holder.appendChild(inner);
  return holder;
}
function makeLogoInner(row) {
  const c = document.createElement("div");
  const urls = logoUrlsForRow(row);
  c.className = "wrapLogo" + (urls.length > 1 ? " genevaStackedLogo" : "");
  urls.forEach((url, idx) => {
    const img = document.createElement("img");
    img.src = url;
    img.alt = idx === 0 ? "SG" : "Geneva";
    img.onerror = () => { img.style.display = "none"; };
    c.appendChild(img);
  });
  return c;
}
function alignH(v) {
  return v === "left" ? "flex-start" : v === "right" ? "flex-end" : "center";
}
function alignV(v) {
  return v === "top" ? "flex-start" : v === "bottom" ? "flex-end" : "center";
}

function autoFitAllTextSoon() {
  autoFitAllText();
  requestAnimationFrame(autoFitAllText);
  setTimeout(autoFitAllText, 80);
  setTimeout(autoFitAllText, 220);
}
function autoFitAllText() {
  if (!layout) return;
  if (labelType === "POT") autoFitPotText();
  else autoFitWrapText();
}
function fits(el) {
  return el.scrollWidth <= el.clientWidth + 1 && el.scrollHeight <= el.clientHeight + 1;
}
function autoFitPotText() {
  for (const id of ["WO", "ITEM", "WEEK"]) {
    const obj = document.querySelector(`.obj[data-id="${id}"]`);
    const inner = obj && obj.querySelector(".inner");
    const o = layout.objects[id];
    if (!obj || !inner || !o) continue;
    const r = ((Number(o.rot || 0) % 360) + 360) % 360;
    const swap = r === 90 || r === 270;
    const maxW = swap ? o.h : o.w;
    const maxH = swap ? o.w : o.h;
    inner.style.width = maxW + "px";
    inner.style.height = maxH + "px";
    if (id === "ITEM") {
      inner.style.wordBreak = "normal";
      inner.style.overflowWrap = "normal";
      inner.style.whiteSpace = "normal";
    }
    let lo = 5, hi = id === "ITEM" ? 96 : 48, best = lo;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      inner.style.fontSize = mid + "px";
      if (fits(inner)) { best = mid; lo = mid + 1; }
      else hi = mid - 1;
    }
    inner.style.fontSize = best + "px";
    o.fontSize = best;
  }
}
function autoFitWrapText() {
  const ranges = {
    WO: [16, 6], CROP: [11, 5], INTERNAL: [11, 5],
    SCION: [28, 7], ROOTSTOCK: [28, 7],
    SCION_PATENT: [6, 3], ROOTSTOCK_PATENT: [6, 3], LOT: [6.5, 3], ADDRESS: [5.6, 3], WARNING: [3.6, 2.1]
  };
  for (const [id, range] of Object.entries(ranges)) {
    const obj = document.querySelector(`.obj[data-id="${id}"]`);
    const inner = obj && obj.querySelector(".wrapTextInner");
    const o = layout.objects[id];
    if (!obj || !inner || !o) continue;
    if (!inner.textContent.trim() && id !== "ADDRESS" && id !== "WARNING") continue;
    let hi = range[0], lo = range[1], best = lo;
    for (let fs = hi; fs >= lo; fs -= 0.2) {
      inner.style.fontSize = fs.toFixed(1) + "px";
      if (fits(inner)) { best = fs; break; }
    }
    inner.style.fontSize = best.toFixed(1) + "px";
    o.fontSize = Number(best.toFixed(1));
  }
}

function attachObjectEvents(el) {
  const id = el.dataset.id;
  el.addEventListener("pointerdown", ev => {
    ev.stopPropagation();
    selectObject(id, false);
    if (!layout.objects[id] || layout.objects[id].locked || ev.target.classList.contains("handle")) return;
    startMove(ev, el, id);
  });
  for (const dir of ["n", "s", "e", "w", "ne", "nw", "se", "sw"]) {
    const handle = document.createElement("div");
    handle.className = "handle " + dir;
    handle.dataset.dir = dir;
    handle.addEventListener("pointerdown", ev => {
      ev.stopPropagation();
      ev.preventDefault();
      selectObject(id, false);
      if (!layout.objects[id] || layout.objects[id].locked) return;
      startResize(ev, el, id, dir);
    });
    el.appendChild(handle);
  }
}
function labelBounds() {
  return sizePx();
}
function activeBottomLimit() {
  const b = labelBounds();
  return labelType === "POT" ? Math.min(350, b.h) : b.h;
}
function gridSnapVal(v) {
  if (!$('snapGridToggle') || !$('snapGridToggle').checked) return v;
  const g = Number((layout && layout.gridPx) || ($("gridPx") && $("gridPx").value) || 4);
  return Math.round(v / g) * g;
}
function startMove(ev, el, id) {
  pushHistory();
  const o = layout.objects[id];
  const start = { x: ev.clientX, y: ev.clientY, ox: o.x, oy: o.y };
  let raf = 0, last = ev;
  function apply(e) {
    const zoom = Number(($("zoom") && $("zoom").value) || 1);
    let nx = gridSnapVal(start.ox + (e.clientX - start.x) / zoom);
    let ny = gridSnapVal(start.oy + (e.clientY - start.y) / zoom);
    const sn = snapRect({ x: nx, y: ny, w: o.w, h: o.h }, id);
    o.x = Math.round(sn.x);
    o.y = Math.round(sn.y);
    clampObject(id);
    el.style.left = o.x + "px";
    el.style.top = o.y + "px";
    syncControls();
    drawGuides(sn.guides);
  }
  function move(e) { last = e; if (raf) return; raf = requestAnimationFrame(() => { raf = 0; apply(last); }); }
  function up() {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", up);
    clearGuides();
    saveWorkingLayout();
    renderAll();
  }
  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", up);
}
function startResize(ev, el, id, dir) {
  pushHistory();
  const o = layout.objects[id];
  const start = { x: ev.clientX, y: ev.clientY, ox: o.x, oy: o.y, ow: o.w, oh: o.h };
  let raf = 0, last = ev;
  function apply(e) {
    const zoom = Number(($("zoom") && $("zoom").value) || 1);
    const dx = (e.clientX - start.x) / zoom;
    const dy = (e.clientY - start.y) / zoom;
    let x = start.ox, y = start.oy, w = start.ow, h = start.oh;
    if (dir.includes("e")) w = start.ow + dx;
    if (dir.includes("s")) h = start.oh + dy;
    if (dir.includes("w")) { w = start.ow - dx; x = start.ox + dx; }
    if (dir.includes("n")) { h = start.oh - dy; y = start.oy + dy; }
    w = Math.max(4, gridSnapVal(w));
    h = Math.max(4, gridSnapVal(h));
    x = gridSnapVal(x);
    y = gridSnapVal(y);
    const b = labelBounds();
    const limH = activeBottomLimit();
    x = clamp(x, 0, Math.max(0, b.w - w));
    y = clamp(y, 0, Math.max(0, limH - h));
    w = Math.min(w, b.w - x);
    h = Math.min(h, limH - y);
    const sn = snapRect({ x, y, w, h }, id);
    Object.assign(o, { x: Math.round(sn.x), y: Math.round(sn.y), w: Math.round(sn.w), h: Math.round(sn.h) });
    Object.assign(el.style, { left: o.x + "px", top: o.y + "px", width: o.w + "px", height: o.h + "px" });
    syncControls();
    drawGuides(sn.guides);
  }
  function move(e) { last = e; if (raf) return; raf = requestAnimationFrame(() => { raf = 0; apply(last); }); }
  function up() {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", up);
    clearGuides();
    saveWorkingLayout();
    renderAll();
  }
  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", up);
}
function snapRect(r, id) {
  if (!$('snapToggle') || !$('snapToggle').checked) return { ...r, guides: [] };
  const th = Number((layout && layout.snapPx) || ($("snapPx") && $("snapPx").value) || 5);
  const b = labelBounds();
  const xs = [0, b.w / 2, b.w];
  const ys = [0, b.h / 2, b.h];
  for (const [oid, o] of Object.entries(layout.objects)) {
    if (oid === id || o.visible === false) continue;
    xs.push(o.x, o.x + o.w / 2, o.x + o.w);
    ys.push(o.y, o.y + o.h / 2, o.y + o.h);
  }
  const rx = [r.x, r.x + r.w / 2, r.x + r.w];
  const ry = [r.y, r.y + r.h / 2, r.y + r.h];
  const guides = [];
  let bx = null, bd = Infinity, bi = 0;
  xs.forEach(xv => rx.forEach((rv, i) => { const d = Math.abs(rv - xv); if (d < bd && d <= th) { bd = d; bx = xv; bi = i; } }));
  if (bx !== null) { if (bi === 0) r.x = bx; if (bi === 1) r.x = bx - r.w / 2; if (bi === 2) r.x = bx - r.w; guides.push({ type: "v", pos: bx }); }
  let by = null, yd = Infinity, yi = 0;
  ys.forEach(yv => ry.forEach((rv, i) => { const d = Math.abs(rv - yv); if (d < yd && d <= th) { yd = d; by = yv; yi = i; } }));
  if (by !== null) { if (yi === 0) r.y = by; if (yi === 1) r.y = by - r.h / 2; if (yi === 2) r.y = by - r.h; guides.push({ type: "h", pos: by }); }
  const limH = activeBottomLimit();
  r.x = clamp(r.x, 0, Math.max(0, b.w - r.w));
  r.y = clamp(r.y, 0, Math.max(0, limH - r.h));
  return { ...r, guides };
}
function drawGuides(guides) {
  clearGuides();
  const canvas = document.querySelector(".labelCanvas");
  if (!canvas) return;
  for (const g of guides || []) {
    const d = document.createElement("div");
    d.className = "guide " + g.type;
    if (g.type === "v") d.style.left = g.pos + "px";
    else d.style.top = g.pos + "px";
    canvas.appendChild(d);
  }
}
function clearGuides() {
  document.querySelectorAll(".guide").forEach(x => x.remove());
}
function clampObject(id) {
  if (!layout || !layout.objects || !layout.objects[id]) return;
  const o = layout.objects[id];
  const b = labelBounds();
  const limH = activeBottomLimit();
  o.w = clamp(Number(o.w || 10), 4, b.w);
  o.h = clamp(Number(o.h || 10), 4, limH);
  o.x = clamp(Number(o.x || 0), 0, Math.max(0, b.w - o.w));
  o.y = clamp(Number(o.y || 0), 0, Math.max(0, limH - o.h));
}
function clampAllObjects() {
  if (!layout || !layout.objects) return;
  Object.keys(layout.objects).forEach(clampObject);
}
function selectObject(id, rerenderCanvas = true) {
  if (!layout || !layout.objects[id]) return;
  selectedId = id;
  renderObjectPanel();
  syncControls();
  if (rerenderCanvas) renderCanvas();
}
function syncControls() {
  if (!layout || !layout.objects) return;
  if (!layout.objects[selectedId]) selectedId = defaultSelectedId(labelType);
  const o = layout.objects[selectedId];
  if (!o) return;
  if ($("selectedName")) $("selectedName").textContent = objectDisplayName(selectedId);
  for (const k of ["x", "y", "w", "h", "rot", "fontSize"]) {
    const inp = $(k);
    if (!inp) continue;
    inp.value = k === "fontSize" ? Number(o[k] || 0) : Math.round(Number(o[k] || 0));
  }
  if ($("fontSize")) $("fontSize").disabled = isImageObject(selectedId);
  if ($("lockToggle")) $("lockToggle").checked = !!o.locked;
  if ($("visibleToggle")) $("visibleToggle").checked = o.visible !== false;
  if ($("safeToggle")) $("safeToggle").checked = showSafeZone;
  if ($("gridToggle")) $("gridToggle").checked = showGrid;
  if ($("safeMargin")) $("safeMargin").value = Number(layout.safeMarginPx || 0);
  if ($("safeValue")) $("safeValue").textContent = "";
  if ($("gridPx")) $("gridPx").value = Number(layout.gridPx || 4);
  if ($("snapPx")) $("snapPx").value = Number(layout.snapPx || 5);
}
function applyControls() {
  if (!layout || !layout.objects) return;
  if (!layout.objects[selectedId]) selectedId = defaultSelectedId(labelType);
  pushHistory();
  const o = layout.objects[selectedId];
  for (const k of ["x", "y", "w", "h", "rot"]) {
    const inp = $(k);
    const val = Number(inp && inp.value);
    if (Number.isFinite(val)) o[k] = val;
  }
  if (!isImageObject(selectedId)) {
    const fs = Number($("fontSize") && $("fontSize").value);
    if (Number.isFinite(fs) && fs > 0) o.fontSize = fs;
    o.fontFamily = "Times New Roman";
  }
  if ($("lockToggle")) o.locked = $("lockToggle").checked;
  if ($("visibleToggle")) o.visible = $("visibleToggle").checked;
  if ($("safeMargin")) layout.safeMarginPx = Number($("safeMargin").value || 0);
  if ($("gridPx")) layout.gridPx = Number($("gridPx").value || 4);
  if ($("snapPx")) layout.snapPx = Number($("snapPx").value || 5);
  clampObject(selectedId);
  saveWorkingLayout();
  renderAll();
}

function addToQueue(row = currentRow()) {
  queue.push({ id: Date.now() + "_" + Math.random().toString(16).slice(2), row: clone(row), qty: Math.max(1, parseInt(row.labelsNeeded || "1", 10) || 1) });
  saveQueue();
  renderQueue();
}
function saveQueue() {
  localStorage.setItem("beinvtPrintQueue", JSON.stringify(queue));
}
function renderQueue() {
  const holder = $("queueList");
  if (!holder) return;
  holder.innerHTML = "";
  if (!queue.length) { holder.innerHTML = '<div class="small">Queue is empty.</div>'; return; }
  queue.forEach(item => {
    const d = document.createElement("div");
    d.className = "queueItem";
    d.innerHTML = `<div><b>${escapeHtml(capClean(item.row.wo))}</b><div class="small">${escapeHtml(capClean(item.row.scion || item.row.rootstock || item.row.crop))}</div><div class="small">${escapeHtml(capClean(item.row.labelColor))} - Qty ${escapeHtml(displayLabelsNeeded(item.row))}</div></div><input type="number" min="1" value="${escapeHtml(item.qty)}"><button type="button" class="danger">x</button>`;
    d.querySelector("input").onchange = ev => { item.qty = Math.max(1, parseInt(ev.target.value || "1", 10) || 1); saveQueue(); };
    d.querySelector("button").onclick = () => { queue = queue.filter(x => x.id !== item.id); saveQueue(); renderQueue(); };
    holder.appendChild(d);
  });
}
function renderPresetList() {
  const select = $("presetSelect");
  if (!select) return;
  const names = Object.keys(presets).sort();
  select.innerHTML = '<option value="">Select saved preset...</option>' + names.map(n => `<option>${escapeHtml(n)}</option>`).join("");
}
function savePreset() {
  const name = prompt("Preset name:", layout.name || `${labelType} Custom`);
  if (!name) return;
  layout.name = name;
  presets[name] = clone(layout);
  localStorage.setItem("beinvtLayoutPresets", JSON.stringify(presets));
  renderPresetList();
}
function loadPreset() {
  const name = $("presetSelect") && $("presetSelect").value;
  if (name && presets[name]) setLayout(presets[name]);
}
function deletePreset() {
  const name = $("presetSelect") && $("presetSelect").value;
  if (name && confirm(`Delete preset "${name}"?`)) {
    delete presets[name];
    localStorage.setItem("beinvtLayoutPresets", JSON.stringify(presets));
    renderPresetList();
  }
}
function exportLayout() {
  if ($("layoutJson")) $("layoutJson").value = JSON.stringify(layout, null, 2);
}
function importLayout() {
  try {
    const obj = JSON.parse($("layoutJson").value);
    if (!obj.objects) throw new Error("Layout missing objects");
    setLayout(obj);
  } catch (e) {
    alert("Import failed: " + e.message);
  }
}
function downloadLayout() {
  const blob = new Blob([JSON.stringify(layout, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = (layout.name || "label-layout").replace(/[^\w-]+/g, "_") + ".json";
  a.click();
  URL.revokeObjectURL(a.href);
}
function resetLayout() {
  if (confirm("Reset current label type?")) setLayout(DEFAULT_LAYOUTS[labelType] || fallbackLayout(labelType));
}
function printCalibration() {
  const w = window.open("", "_blank");
  w.document.write("<!doctype html><style>@page{size:2in 2in;margin:0}body{margin:0}.sq{width:1in;height:1in;border:2px solid #000;margin:.25in;font:12px Arial;display:flex;align-items:center;justify-content:center}</style><div class='sq'>1in x 1in</div><script>setTimeout(()=>print(),200)<\/script>");
  w.document.close();
}
function saveCalibration() {
  const mw = Number(($("measuredW") && $("measuredW").value) || 1);
  const mh = Number(($("measuredH") && $("measuredH").value) || 1);
  if (mw > 0 && mh > 0) {
    calibration = { scaleX: 1 / mw, scaleY: 1 / mh };
    localStorage.setItem("beinvtCalibration", JSON.stringify(calibration));
    if ($("calStatus")) $("calStatus").textContent = `Saved: X ${calibration.scaleX.toFixed(4)}, Y ${calibration.scaleY.toFixed(4)}`;
  }
}
function printLabel() {
  printRows([{ row: currentRow(), qty: 1 }]);
}
function printQueue() {
  if (!queue.length) { alert("Queue is empty."); return; }
  printRows(queue);
}
function printRows(items) {
  if (labelType === "POT") applyPotAutoStack();
  autoFitAllText();
  const s = LABEL_SIZES[labelType];
  const b = sizePx();
  const win = window.open("", "_blank");
  let pages = "";
  items.forEach(item => {
    for (let i = 0; i < Math.max(1, item.qty || 1); i++) pages += renderPrintPage(item.row, b);
  });
  win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Print Labels</title><style>@page{size:${s.widthIn}in ${s.heightIn}in;margin:0}html,body{margin:0;padding:0;background:#fff}.page{position:relative;width:${b.w}px;height:${b.h}px;overflow:hidden;background:#fff;color:#000;page-break-after:always;break-after:page;transform-origin:0 0;transform:scale(${calibration.scaleX},${calibration.scaleY})}*{box-sizing:border-box}</style></head><body>${pages}<script>setTimeout(()=>print(),300)<\/script></body></html>`);
  win.document.close();
}
function renderPrintPage(row) {
  if (labelType === "WRAP") applyWrapDataAwareStack(row);
  let out = '<div class="page">';
  for (const id of objectOrder()) {
    const o = layout.objects[id];
    if (!shouldRenderObject(id, row)) continue;
    if (labelType !== "WRAP" && id === "WEEK" && !row.week) continue;
    const top = labelType === "WRAP" && id === "LOGO" ? logoTopForRow(o, row) : o.y;
    const outer = `position:absolute;left:${o.x}px;top:${top}px;width:${o.w}px;height:${o.h}px;overflow:hidden;`;
    if (labelType === "WRAP") out += `<div style="${outer}">${printWrapObjectInner(id, row, o)}</div>`;
    else if (id === "QR") out += `<div style="${outer}"><img src="${qrUrl(row.wo)}" style="width:100%;height:100%;image-rendering:pixelated"></div>`;
    else out += `<div style="${outer}">${printTextInner(id, row, o)}</div>`;
  }
  return out + "</div>";
}
function printTextInner(id, row, o) {
  const r = ((Number(o.rot || 0) % 360) + 360) % 360;
  const swap = r === 90 || r === 270;
  const left = swap ? ((o.w - o.h) / 2) : 0;
  const top = swap ? ((o.h - o.w) / 2) : 0;
  const w = swap ? o.h : o.w;
  const h = swap ? o.w : o.h;
  const wrap = id === "ITEM" ? "white-space:normal;word-break:normal;overflow-wrap:normal;line-height:.9;padding:0;" : "white-space:nowrap;line-height:.95;";
  return `<div style="position:absolute;left:${left}px;top:${top}px;width:${w}px;height:${h}px;display:flex;align-items:${alignV(o.alignV)};justify-content:${alignH(o.alignH)};overflow:hidden;text-align:center;${wrap}text-transform:uppercase;font-family:'Times New Roman',Georgia,serif;font-weight:900;font-size:${o.fontSize || 16}px;transform-origin:center center;transform:rotate(${o.rot || 0}deg);">${escapeHtml(labelText(id, row))}</div>`;
}
function printWrapObjectInner(id, row, o) {
  if (id === "WO_QR") return `<img src="${qrUrl(wrapLeftQrText(row))}" style="width:100%;height:100%;image-rendering:pixelated">`;
  if (id === "LOT_QR") { const txt = wrapRightQrText(row); return txt ? `<img src="${qrUrl(txt)}" style="width:100%;height:100%;image-rendering:pixelated">` : ""; }
  if (id === "LOGO") {
    const urls = logoUrlsForRow(row);
    if (urls.length > 1) {
      const imgs = urls.map((url, idx) => `<img src="${escapeHtml(url)}" alt="${idx === 0 ? 'SG' : 'Geneva'}" style="width:100%;height:calc(50% - 1px);object-fit:contain;image-rendering:auto;display:block;" onerror="this.style.display='none'">`).join("");
      return `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;overflow:hidden;">${imgs}</div>`;
    }
    return `<img src="${escapeHtml(urls[0] || SG_LOGO_URL)}" style="width:100%;height:100%;object-fit:contain;image-rendering:auto" onerror="this.outerHTML='SG'">`;
  }
  const textAlign = o.alignH === "left" ? "left" : o.alignH === "right" ? "right" : "center";
  const base = `position:absolute;inset:0;display:flex;align-items:${alignV(o.alignV)};justify-content:${alignH(o.alignH)};overflow:hidden;text-align:${textAlign};white-space:normal;word-break:normal;overflow-wrap:normal;font-family:'Times New Roman',Georgia,serif;font-weight:900;font-size:${o.fontSize || 8}px;line-height:.86;padding:0 1px;color:#000;`;
  if (id === "ROOTSTOCK") return `<div style="${base}text-transform:uppercase"><span style="font-size:.68em;margin-right:.18em;text-transform:none!important;">on</span>${escapeHtml(wrapRootstockText(row))}</div>`;
  if (id === "WARNING") return `<div style="${base}white-space:pre-line;line-height:1.05;text-transform:uppercase;align-items:center;">${escapeHtml(WRAP_WARNING)}</div>`;
  return `<div style="${base}text-transform:uppercase;">${escapeHtml(wrapObjectText(id, row))}</div>`;
}

function bindDirectionalButtons() {
  const map = { nudgeUp: [0, -1], nUp: [0, -1], upBtn: [0, -1], nudgeDown: [0, 1], nD: [0, 1], downBtn: [0, 1], nudgeLeft: [-1, 0], nL: [-1, 0], leftBtn: [-1, 0], nudgeRight: [1, 0], nR: [1, 0], rightBtn: [1, 0] };
  Object.entries(map).forEach(([id, delta]) => {
    const el = $(id);
    if (el && !el.dataset.nudgeBound) {
      el.dataset.nudgeBound = "1";
      el.onclick = () => nudgeSelected(delta[0], delta[1]);
    }
  });
}
function nudgeSelected(dx, dy) {
  const o = layout && layout.objects && layout.objects[selectedId];
  if (!o || o.locked) return;
  pushHistory();
  o.x += dx;
  o.y += dy;
  clampObject(selectedId);
  saveWorkingLayout();
  renderAll();
}
function initEvents() {
  window.addEventListener("resize", dockStageAwayFromLeftPanel);
  ensureLeftPanel();
  removeDuplicateRightMenuControls();
  ensureModeTabs();
  bindDirectionalButtons();
  if ($("labelType")) $("labelType").onchange = ev => { labelType = ev.target.value; selectedId = defaultSelectedId(labelType); undoStack = []; redoStack = []; setLayout(loadWorkingLayout(labelType), false); };
  if ($("zoom")) $("zoom").oninput = function() { this.dataset.beinvtManualZoom = "1"; this.dataset.beinvtZoomMode = labelType; renderCanvas(); };
  if ($("search")) $("search").oninput = function () { if ($("stageSearch")) $("stageSearch").value = this.value; currentRowIndex = 0; renderRows(); renderCanvas(); };
  if ($("safeToggle")) $("safeToggle").onchange = ev => { showSafeZone = ev.target.checked; renderCanvas(); };
  if ($("gridToggle")) $("gridToggle").onchange = ev => { showGrid = ev.target.checked; renderCanvas(); };
  if ($("gridPx")) $("gridPx").onchange = applyControls;
  if ($("snapPx")) $("snapPx").onchange = applyControls;
  if ($("safeMargin")) $("safeMargin").onchange = applyControls;
  for (const id of ["x", "y", "w", "h", "rot", "fontSize"]) {
    const inp = $(id);
    if (inp) {
      inp.onchange = applyControls;
      inp.onkeydown = ev => { if (ev.key === "Enter") applyControls(); };
    }
  }
  if ($("lockToggle")) $("lockToggle").onchange = applyControls;
  if ($("visibleToggle")) $("visibleToggle").onchange = applyControls;
  if ($("savePreset")) $("savePreset").onclick = savePreset;
  if ($("loadPreset")) $("loadPreset").onclick = loadPreset;
  if ($("deletePreset")) $("deletePreset").onclick = deletePreset;
  if ($("exportLayout")) $("exportLayout").onclick = exportLayout;
  if ($("importLayout")) $("importLayout").onclick = importLayout;
  if ($("downloadLayout")) $("downloadLayout").onclick = downloadLayout;
  if ($("resetLayout")) $("resetLayout").onclick = resetLayout;
  if ($("printCalibration")) $("printCalibration").onclick = printCalibration;
  if ($("saveCalibration")) $("saveCalibration").onclick = saveCalibration;
  if ($("testMode")) $("testMode").onclick = () => { testMode = !testMode; $("testMode").classList.toggle("good", testMode); renderCanvas(); };
  if ($("printLabel")) $("printLabel").onclick = printLabel;
  if ($("printQueue")) $("printQueue").onclick = printQueue;
  if ($("addCurrent")) $("addCurrent").onclick = () => addToQueue();
  if ($("clearQueue")) $("clearQueue").onclick = () => { queue = []; saveQueue(); renderQueue(); };
  if ($("undoBtn")) $("undoBtn").onclick = undo;
  if ($("redoBtn")) $("redoBtn").onclick = redo;
  document.addEventListener("keydown", ev => {
    const tag = document.activeElement && document.activeElement.tagName;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
    const mod = ev.ctrlKey || ev.metaKey;
    if (mod && ev.key.toLowerCase() === "z") { ev.preventDefault(); ev.shiftKey ? redo() : undo(); return; }
    if (mod && ev.key.toLowerCase() === "y") { ev.preventDefault(); redo(); return; }
    const step = ev.shiftKey ? 10 : 1;
    if (ev.key === "ArrowUp") { ev.preventDefault(); nudgeSelected(0, -step); }
    else if (ev.key === "ArrowDown") { ev.preventDefault(); nudgeSelected(0, step); }
    else if (ev.key === "ArrowLeft") { ev.preventDefault(); nudgeSelected(-step, 0); }
    else if (ev.key === "ArrowRight") { ev.preventDefault(); nudgeSelected(step, 0); }
  });
  window.addEventListener("resize", () => { applyZoomSliderCap($("stageLabelHost")); renderCanvas(); });
}
function boot() {
  removeGitHubWorkflowText();
  loadDefaults();
  layout = loadWorkingLayout(labelType);
  ensureLeftPanel();
  removeDuplicateRightMenuControls();
  initEvents();
  installDebugLayerLabels();
  loadCsv().catch(console.warn).finally(() => {
    renderAll();
    startPanelWatchdog();
  });
}
boot();
