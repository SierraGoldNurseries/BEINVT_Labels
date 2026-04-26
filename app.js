const APP_VERSION = "7.3.0-zoom-objects-table-guides";
const INCH = 96;
const LABEL_SIZES = { POT:{widthIn:.75,heightIn:5}, WRAP:{widthIn:5,heightIn:.5} };
const SG_LOGO_URL = "https://11150895.app.netsuite.com/core/media/media.nl?id=154769&c=11150895&h=gz_jC4_Zsi8evEFt-sGPjDNJhRvthM-3uNCqvPr8uc5CrgD1&fcts=20251229204334&whence=";
const WRAP_ADDRESS = "SIERRA GOLD NURSERIES YUBA CITY, CA 95991";
const WRAP_BENCH_LINE = "";
const WRAP_WARNING = "WARNING: ASEXUAL\nREPRODUCTION OF SCIONS,\nBUDS, OR CUTTINGS\nWHETHER FOR SALE\nOR OWN USE IS\nPROHIBITED UNDER\nU.S. PLANT PATENT LAWS.\nSALES OUTSIDE THE\nU.S. ARE PROHIBITED.";

/*
  APP.JS ONLY UPDATE
  - Injects required CSS fixes so you do not need to replace styles.css.
  - Uses built-in v4 POT defaults even if old layout JSON files are still in repo.
  - Clears old saved working layouts once for this app version.
*/

(function injectV4Css(){
  const css = `
    .labelCanvas{background:#fff;color:#000;position:relative;overflow:hidden;border:1px solid rgba(0,0,0,.5);box-shadow:0 20px 50px rgba(0,0,0,.35)}
    .stageInner{position:absolute;left:0;top:0;transform-origin:left top}
    .stageFrame{position:relative;flex:0 0 auto;display:block;overflow:visible}
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
    .stageMeta{display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:center;margin:0;padding:8px 10px;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:rgba(18,26,44,.98);color:#e5e7eb}
    .stageStack{display:flex;flex-direction:column;align-items:center;gap:16px;width:100%;padding-top:8px}
    .labelPreviewRow{display:flex;align-items:center;justify-content:center;gap:18px;max-width:none;min-width:max-content;flex-wrap:nowrap;overflow:visible}
    .labelPreviewRow .stageMeta{flex:0 0 154px;max-width:154px;align-self:center;display:flex;flex-direction:column;align-items:stretch;justify-content:center;position:relative;z-index:40}
    .stageMeta .metaPill{display:flex;gap:6px;align-items:center;justify-content:space-between;padding:6px 9px;border-radius:10px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.04);font-size:12px;line-height:1.1;white-space:nowrap}
    .stageMeta .metaPill.colorPill{font-weight:700}
    .stageMeta b{color:#fff}
    @media(max-width:980px){.labelPreviewRow{flex-direction:column;min-width:0}.labelPreviewRow .stageMeta{flex:0 0 auto;max-width:none;width:min(100%,360px);flex-direction:row;align-items:center}.stageMeta .metaPill{flex:1}}
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
    .wrapWoBlock,.wrapMainBlock,.wrapQrBlock,.wrapWarningBlock{position:absolute;inset:0;display:flex;overflow:hidden}
    .wrapWoBlock{align-items:stretch;gap:3px;padding:2px 2px}
    .wrapWoQr{width:38px;height:38px;flex:0 0 38px;display:flex;align-items:center;justify-content:center;margin:auto 0}
    .wrapWoQr img,.wrapLotQr img,.wrapLogo img{width:100%;height:100%;display:block;image-rendering:pixelated}
    .wrapWoText{display:flex;flex-direction:column;justify-content:space-between;align-items:flex-start;line-height:.86;min-width:0;flex:1;height:100%;text-transform:uppercase;font-family:"Times New Roman",Georgia,serif;font-weight:900}
    .wrapWoText .wo{font-size:17px}
    .wrapWoText .crop{font-size:13px}
    .wrapWoText .internal{font-size:12px}
    .wrapMainBlock{flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:2px 3px 1px;line-height:.86;text-transform:uppercase;font-family:"Times New Roman",Georgia,serif;font-weight:900}
    .wrapMainBlock .scionLine,.wrapMainBlock .rootLine{display:block;width:100%;white-space:normal;word-break:break-word;overflow-wrap:anywhere;max-width:100%}
    .wrapMainBlock .scionLine{font-size:24px}
    .wrapMainBlock .rootLine{font-size:24px}
    .wrapMainBlock .royaltyLine{display:block;width:100%;white-space:normal;word-break:break-word;overflow-wrap:anywhere;max-width:100%;font-size:6px;line-height:.94;margin-top:0}
    .wrapMainBlock .rootLine .on{font-size:.68em;margin-right:.18em}
    .wrapMainBlock .patentLine,.wrapMainBlock .benchLine,.wrapMainBlock .addressLine{display:block;width:100%;white-space:normal;word-break:break-word;overflow-wrap:anywhere;max-width:100%}
    .wrapMainBlock .patentLine{font-size:8px;line-height:.94;margin-top:0}
    .wrapMainBlock .benchLine{font-size:6.2px;line-height:.94;margin-top:0}
    .wrapMainBlock .addressLine{font-size:6.2px;line-height:.94;margin-top:0}
    .wrapQrBlock{align-items:center;justify-content:center;gap:2px;padding:1px 1px}
    .wrapLotQr{width:34px;height:34px;flex:0 0 34px}
    .wrapLogo{width:20px;height:20px;flex:0 0 20px;display:flex;align-items:center;justify-content:center}
    .wrapLogo img{object-fit:contain!important;image-rendering:auto!important}
    .wrapLogoFallback{font-size:8px;font-weight:900;border:1px solid #000;border-radius:999px;padding:1px 3px;line-height:1}
    .wrapWarningBlock{align-items:center;justify-content:flex-start;padding:1px 2px;white-space:pre-line;text-align:left;text-transform:uppercase;font-family:"Times New Roman",Georgia,serif;font-weight:900;font-size:4.8px;line-height:.82;background:#fff}
    /* v6.4 overrides */
    .stageStack{gap:10px!important}
    .stageMeta{margin-top:6px!important;margin-bottom:0!important;background:#121a2c!important;position:relative!important;z-index:25!important}
    .table,.table thead,.table thead tr,.table thead th{background:#121a2c!important;opacity:1!important}
    .table thead,.table thead tr{position:sticky!important;top:0!important;z-index:49!important}
    .table thead th{background-clip:padding-box!important;box-shadow:0 2px 0 rgba(0,0,0,.45)!important}
    .table tbody td{background:#0f172a!important}
    .table,.tableWrap,.tableContainer,.rowsWrap,.rowsContainer,#rowsWrap,#rowsContainer{width:100%!important;max-width:none!important}
    .table{table-layout:fixed!important}
    #canvasHost,.canvasHost{overflow:hidden!important;width:100%!important}

    /* v6.7 stage/table layout and side meta */
    .stageWrap{display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;padding:10px!important;gap:10px!important;overflow:hidden!important;background:radial-gradient(circle at center, rgba(255,255,255,.08), rgba(255,255,255,.02))!important}
    #canvasHost{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:10px!important;min-height:0!important;height:100%!important}
    body.beinvt-label-pot #canvasHost{flex-direction:row!important;align-items:stretch!important;min-height:calc(100vh - 190px)!important}
    #stageDataWrap{width:100%;flex:0 0 300px;max-height:44vh;min-height:210px;background:#0f172a;border:1px solid rgba(255,255,255,.14);border-radius:12px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 8px 24px rgba(0,0,0,.25)}
    body.beinvt-label-pot #stageDataWrap{order:1;width:62%;max-width:none;min-width:460px;flex:1 1 62%;align-self:stretch;height:auto;max-height:none;min-height:calc(100vh - 210px)}
    body.beinvt-label-wrap #stageDataWrap{flex:0 0 clamp(420px,64vh,640px);max-height:none;min-height:420px}
    #stageDataSearchRow{padding:8px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;gap:8px;align-items:center;background:#121a2c}
    #stageSearch{height:34px;width:100%;border-radius:9px;border:1px solid rgba(255,255,255,.14);background:#0b1220;color:#e5e7eb;padding:7px 10px;font-size:13px}
    .stageTableScroll{flex:1;overflow:auto;background:#0f172a;position:relative}
    #stageRowsTable{width:100%!important;min-width:780px!important;table-layout:fixed!important;border-collapse:separate!important;border-spacing:0!important;background:#0f172a!important}
    body.beinvt-label-wrap #stageRowsTable{min-width:1040px!important}
    body.beinvt-label-pot #stageRowsTable{min-width:980px!important}
    #stageRowsTable thead,#stageRowsTable thead tr,#stageRowsTable thead th{background:#121a2c!important;opacity:1!important;color:#e5e7eb!important}
    #stageRowsTable thead th{position:sticky!important;top:0!important;z-index:100!important;background-clip:padding-box!important;box-shadow:0 2px 0 rgba(0,0,0,.55)!important}
    #stageRowsTable tbody td{background:#0f172a!important;opacity:1!important;color:#e5e7eb!important;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    #stageRowsTable tr.active td{background:rgba(96,165,250,.20)!important}
    #stageRowsTable tr:hover td{background:rgba(255,255,255,.06)!important}
    #stageLabelHost{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;padding:8px}
    body.beinvt-label-pot #stageLabelHost{order:2;flex:0 0 min(360px,38%);justify-content:center;align-items:flex-start;min-width:260px;padding-top:0}
    #stageLabelHost .stageStack{padding-top:0!important;gap:8px!important;align-items:center!important;justify-content:flex-start!important}
    .wrapMainBlock .rootLine .on{text-transform:none!important}
    .wrapMainBlock .benchLine:empty{display:none!important}

    body.beinvt-label-wrap #stageLabelHost{align-items:flex-end!important;justify-content:center!important;min-height:96px!important;padding-bottom:2px!important}
    body.beinvt-label-wrap #stageLabelHost .stageStack{justify-content:flex-end!important}
    body.beinvt-label-wrap .wrapPreviewRow{align-items:flex-end!important}
    .wrapTextInner{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden;white-space:normal;word-break:break-word;overflow-wrap:anywhere;line-height:.86;text-transform:uppercase;font-family:"Times New Roman",Georgia,serif;font-weight:900;padding:0 1px}
    .wrapTextInner.leftText{align-items:center;justify-content:flex-start;text-align:left}
    .wrapTextInner.smallText{line-height:.94}
    .wrapTextInner.rootstockInner{text-transform:none!important}
    .wrapTextInner .wrapOn{font-size:.68em;margin-right:.18em;text-transform:none!important}
    .objectBtn{min-width:0!important;white-space:normal!important;line-height:1.1!important}
    #objectPanel{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:6px!important}
    body.beinvt-label-wrap #objectPanel{grid-template-columns:repeat(2,minmax(0,1fr))!important}
    .settingsGroupTabs{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 10px 0;padding:8px;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:rgba(15,23,42,.72);position:sticky;top:0;z-index:30}
    .settingsGroupTab{border:1px solid rgba(255,255,255,.16);border-radius:999px;background:rgba(255,255,255,.05);color:#e5e7eb;padding:7px 10px;font-size:12px;font-weight:800;cursor:pointer}
    .settingsGroupTab.active{border-color:#60a5fa;background:rgba(96,165,250,.20);color:#fff}
    .beinvt-settings-compact .section[data-settings-group].beinvt-hidden-section{display:none!important}
    .beinvt-settings-compact .section[data-settings-group]{margin-bottom:10px!important}

    @media(max-width:1100px){body.beinvt-label-pot #canvasHost{flex-direction:column!important;min-height:0!important}body.beinvt-label-pot #stageDataWrap{width:100%;max-width:none;min-width:0;flex:0 0 clamp(360px,58vh,620px);height:auto;min-height:360px}body.beinvt-label-pot #stageLabelHost{flex:0 0 auto;min-width:0}}
  `;
  const tag = document.createElement("style");
  tag.setAttribute("data-beinvt-v4-css", "1");
  tag.textContent = css;
  document.head.appendChild(tag);
})();

(function injectNoOverlapCss(){
  const css = `
    *{box-sizing:border-box!important}
    html,body{min-width:0!important;overflow:hidden!important}
    body{--beinvt-top-offset:118px;background:#0b1020!important}
    .beinvt-main-shell{display:grid!important;grid-template-columns:minmax(300px,360px) minmax(0,1fr)!important;gap:12px!important;align-items:stretch!important;width:100%!important;max-width:100vw!important;height:calc(100vh - var(--beinvt-top-offset))!important;min-height:520px!important;overflow:hidden!important;padding:8px 10px!important}
    .beinvt-main-shell > aside.panel,.beinvt-left-settings-panel{order:1!important;grid-column:1!important;width:100%!important;min-width:0!important;max-width:none!important;height:100%!important;max-height:none!important;overflow:auto!important;position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;z-index:10!important;margin:0!important;float:none!important;transform:none!important}
    .beinvt-main-shell > .stageWrap,.beinvt-stage-main{order:2!important;grid-column:2!important;width:100%!important;min-width:0!important;max-width:none!important;height:100%!important;max-height:none!important;overflow:hidden!important;margin:0!important;position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;z-index:1!important;float:none!important;transform:none!important}
    .stageWrap{display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;padding:8px!important;gap:8px!important;overflow:hidden!important;min-width:0!important;background:radial-gradient(circle at center, rgba(255,255,255,.08), rgba(255,255,255,.02))!important}
    #canvasHost{display:grid!important;gap:10px!important;width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;overflow:hidden!important;align-items:stretch!important}
    body.beinvt-label-pot #canvasHost{grid-template-columns:minmax(560px,1fr) minmax(248px,340px)!important;grid-template-rows:1fr!important;min-height:0!important}
    body.beinvt-label-wrap #canvasHost{grid-template-columns:1fr!important;grid-template-rows:minmax(430px,1fr) 118px!important;min-height:0!important}
    #stageDataWrap{order:1!important;grid-column:auto!important;grid-row:auto!important;width:100%!important;min-width:0!important;max-width:none!important;height:100%!important;min-height:0!important;max-height:none!important;flex:unset!important;align-self:stretch!important;overflow:hidden!important;border-radius:12px!important;position:relative!important;z-index:1!important}
    body.beinvt-label-pot #stageDataWrap{grid-column:1!important;grid-row:1!important;min-width:0!important;width:100%!important;flex:unset!important;min-height:0!important;height:100%!important;max-height:none!important}
    body.beinvt-label-wrap #stageDataWrap{grid-column:1!important;grid-row:1!important;min-height:0!important;height:100%!important;max-height:none!important;flex:unset!important}
    .stageTableScroll{width:100%!important;height:100%!important;min-height:0!important;overflow:auto!important;position:relative!important}
    #stageRowsTable{width:100%!important;min-width:920px!important;table-layout:fixed!important}
    body.beinvt-label-pot #stageRowsTable{min-width:1040px!important}
    body.beinvt-label-wrap #stageRowsTable{min-width:1060px!important}
    #stageLabelHost{order:2!important;grid-column:auto!important;grid-row:auto!important;min-width:0!important;min-height:0!important;width:100%!important;height:100%!important;max-height:none!important;display:flex!important;overflow:hidden!important;position:relative!important;z-index:1!important;padding:6px!important;background:transparent!important}
    body.beinvt-label-pot #stageLabelHost{grid-column:2!important;grid-row:1!important;align-items:flex-start!important;justify-content:center!important;min-width:0!important;flex:unset!important;padding-top:4px!important}
    body.beinvt-label-wrap #stageLabelHost{grid-column:1!important;grid-row:2!important;align-items:flex-start!important;justify-content:center!important;min-height:0!important;padding-top:8px!important;padding-bottom:0!important;flex:unset!important}
    #stageLabelHost .stageStack{width:100%!important;height:100%!important;max-height:100%!important;min-width:0!important;min-height:0!important;display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:8px!important;padding:0!important;overflow:hidden!important}
    body.beinvt-label-wrap #stageLabelHost .stageStack{justify-content:flex-start!important}
    .labelPreviewRow{max-width:100%!important;min-width:0!important;width:auto!important;display:flex!important;flex-wrap:nowrap!important;overflow:hidden!important;gap:12px!important;align-items:center!important;justify-content:center!important}
    body.beinvt-label-pot .labelPreviewRow{flex-direction:column!important;width:100%!important;gap:10px!important;align-items:center!important;justify-content:flex-start!important}
    body.beinvt-label-wrap .labelPreviewRow{flex-direction:row!important;width:100%!important;gap:14px!important;align-items:flex-start!important;justify-content:center!important}
    .stageFrame{overflow:visible!important;max-width:100%!important;max-height:100%!important;flex:0 0 auto!important}
    .labelPreviewRow .stageMeta{display:flex!important;flex:0 0 auto!important;width:240px!important;max-width:240px!important;min-width:220px!important;align-self:center!important;gap:8px!important;padding:8px!important;z-index:5!important}
    body.beinvt-label-pot .labelPreviewRow .stageMeta{width:100%!important;max-width:300px!important;min-width:240px!important;flex-direction:column!important;align-items:stretch!important;order:1!important}
    body.beinvt-label-pot .stageFrame{order:2!important}
    body.beinvt-label-wrap .labelPreviewRow .stageMeta{width:260px!important;max-width:260px!important;min-width:240px!important;flex-direction:column!important;align-items:stretch!important}
    .stageMeta .metaPill{width:100%!important;min-width:0!important;font-size:13px!important;padding:8px 10px!important;white-space:nowrap!important}
    #objectPanel{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:6px!important;width:100%!important;min-width:0!important}
    body.beinvt-label-wrap #objectPanel{grid-template-columns:repeat(2,minmax(0,1fr))!important}
    .objectBtn{min-width:0!important;max-width:100%!important;white-space:normal!important;overflow:hidden!important;line-height:1.1!important}
    .objectBtn span:first-child{overflow:hidden!important;text-overflow:ellipsis!important}
    .settingsGroupTabs{display:flex!important;flex-wrap:wrap!important;gap:6px!important;margin:0 0 10px 0!important;padding:8px!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:12px!important;background:rgba(15,23,42,.95)!important;position:sticky!important;top:0!important;z-index:40!important}
    .settingsGroupTab{border:1px solid rgba(255,255,255,.16)!important;border-radius:999px!important;background:rgba(255,255,255,.05)!important;color:#e5e7eb!important;padding:7px 10px!important;font-size:12px!important;font-weight:800!important;cursor:pointer!important;max-width:145px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
    .settingsGroupTab.active{border-color:#60a5fa!important;background:rgba(96,165,250,.22)!important;color:#fff!important}
    .beinvt-settings-compact .section[data-settings-group].beinvt-hidden-section{display:none!important}
    .beinvt-settings-compact .section[data-settings-group]{margin-bottom:10px!important;position:relative!important;z-index:1!important}
    .beinvt-legacy-data-section{display:none!important}
    .wrapTextInner{position:absolute!important;inset:0!important;display:flex!important;align-items:center!important;justify-content:center!important;text-align:center!important;overflow:hidden!important;white-space:normal!important;word-break:break-word!important;overflow-wrap:anywhere!important;line-height:.82!important;text-transform:uppercase!important;font-family:"Times New Roman",Georgia,serif!important;font-weight:900!important;padding:0 1px!important}
    .wrapTextInner.leftText{justify-content:flex-start!important;text-align:left!important}
    .wrapTextInner.smallText{line-height:.88!important}
    .wrapTextInner.rootstockInner{text-transform:none!important;white-space:nowrap!important;line-height:.82!important}
    .wrapTextInner .wrapOn{font-size:.62em!important;margin-right:.16em!important;text-transform:none!important;display:inline-block!important;vertical-align:baseline!important}
    @media(max-width:1180px){.beinvt-main-shell{grid-template-columns:1fr!important;grid-template-rows:auto 1fr!important;height:auto!important;min-height:0!important;overflow:auto!important}.beinvt-main-shell > aside.panel,.beinvt-left-settings-panel{grid-column:1!important;grid-row:1!important;max-height:260px!important}.beinvt-main-shell > .stageWrap,.beinvt-stage-main{grid-column:1!important;grid-row:2!important;height:calc(100vh - 360px)!important;min-height:520px!important}body.beinvt-label-pot #canvasHost{grid-template-columns:1fr!important;grid-template-rows:minmax(340px,1fr) auto!important}body.beinvt-label-pot #stageDataWrap{grid-column:1!important;grid-row:1!important}body.beinvt-label-pot #stageLabelHost{grid-column:1!important;grid-row:2!important;min-height:320px!important}}
  `;
  const tag = document.createElement("style");
  tag.setAttribute("data-beinvt-no-overlap-css", "1");
  tag.textContent = css;
  document.head.appendChild(tag);
})();

if(localStorage.getItem("beinvtAppVersion") !== APP_VERSION){
  localStorage.removeItem("beinvtWorkingLayout_POT");
  localStorage.removeItem("beinvtWorkingLayout_WRAP");
  localStorage.removeItem("beinvtSettingsGroup");
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
const POT_OBJECT_ORDER=["WO","QR","ITEM","WEEK"];
const WRAP_OBJECT_ORDER=["WO_QR","WO","CROP","INTERNAL","SCION","SCION_ROYALTY","ROOTSTOCK","ROOTSTOCK_ROYALTY","LOT","ADDRESS","LOT_QR","LOGO","WARNING"];
const IMAGE_OBJECT_IDS=new Set(["QR","WO_QR","LOT_QR","LOGO"]);
function cleanDisplay(v){
  const s=String(v??"").trim();
  if(!s) return "";
  if(/^-?\s*none\s*-?$/i.test(s)) return "";
  return s;
}
function capClean(v){ return cap(cleanDisplay(v)); }
function objectOrder(type=labelType){ return type==="WRAP"?WRAP_OBJECT_ORDER:POT_OBJECT_ORDER; }
function defaultSelectedId(type=labelType){ return type==="WRAP"?"SCION":"ITEM"; }
function isImageObject(id){ return IMAGE_OBJECT_IDS.has(id); }

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
    name:"Pot Standard restored",
    labelType:"POT",
    safeMarginPx:5,
    gridPx:4,
    objects:{
      WO:{x:3,y:8,w:66,h:18,rot:0,fontSize:16,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      QR:{x:11,y:30,w:50,h:50,rot:0,locked:false,visible:true},
      ITEM:{x:2,y:84,w:68,h:230,rot:90,fontSize:22,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      WEEK:{x:11,y:320,w:50,h:24,rot:0,fontSize:18,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"}
    }
  };
  return {
    name:"Wrap Tie Standard",
    labelType:"WRAP",
    safeMarginPx:3,
    gridPx:4,
    objects:{
      WO_QR:{x:2,y:6,w:36,h:36,rot:0,locked:false,visible:true},
      WO:{x:41,y:3,w:69,h:12,rot:0,fontSize:13,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"left",alignV:"middle"},
      CROP:{x:41,y:17,w:69,h:12,rot:0,fontSize:10,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"left",alignV:"middle"},
      INTERNAL:{x:41,y:31,w:69,h:12,rot:0,fontSize:9,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"left",alignV:"middle"},
      SCION:{x:114,y:2,w:240,h:16,rot:0,fontSize:22,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      SCION_ROYALTY:{x:114,y:18,w:240,h:4,rot:0,fontSize:4.4,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      ROOTSTOCK:{x:114,y:22,w:240,h:16,rot:0,fontSize:22,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      ROOTSTOCK_ROYALTY:{x:114,y:38,w:240,h:4,rot:0,fontSize:4.4,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      LOT:{x:114,y:42,w:240,h:3,rot:0,fontSize:3.4,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      ADDRESS:{x:114,y:45,w:240,h:3,rot:0,fontSize:3.4,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      LOT_QR:{x:358,y:7,w:33,h:33,rot:0,locked:false,visible:true},
      LOGO:{x:394,y:14,w:19,h:19,rot:0,locked:false,visible:true},
      WARNING:{x:418,y:3,w:60,h:42,rot:0,fontSize:4.0,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"left",alignV:"middle"}
    }
  };
}

function normalizeLayoutObject(baseObj, savedObj){
  return Object.assign({}, baseObj||{}, savedObj||{});
}
function normalizeLayout(src){
  const type=(src&&src.labelType)||labelType||"POT";
  const base=fallbackLayout(type);
  if(!src||!src.objects) return base;
  if(type==="WRAP" && !src.objects.SCION){
    return base;
  }
  const out=Object.assign({}, base, src, {labelType:type, objects:{}});
  for(const id of objectOrder(type)){
    out.objects[id]=normalizeLayoutObject(base.objects[id], src.objects[id]);
  }
  return out;
}

function setLayout(n,keepHist=true){
  if(keepHist)pushHistory();
  layout=normalizeLayout(clone(n));
  labelType=layout.labelType||labelType;
  if(!layout.objects[selectedId]) selectedId=defaultSelectedId(labelType);
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
    if(s)return normalizeLayout(JSON.parse(s));
  }catch(e){}
  return normalizeLayout(clone(DEFAULT_LAYOUTS[type]||fallbackLayout(type)));
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

function normCsvKey(s){
  return String(s||"").toLowerCase().replace(/[^a-z0-9]+/g,"");
}
function csvVal(o,names){
  for(const name of names){
    if(Object.prototype.hasOwnProperty.call(o,name) && String(o[name]||"").trim()) return o[name];
  }
  const want=names.map(normCsvKey);
  for(const [k,v] of Object.entries(o)){
    if(String(v||"").trim() && want.includes(normCsvKey(k))) return v;
  }
  return "";
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
      wo:csvVal(o,["Work Order","WO"])||"",
      act,
      crop:csvVal(o,["Crop"])||"",
      name:csvVal(o,["Name","Item Name"])||"",
      scion:csvVal(o,["Scion"])||"",
      rootstock:csvVal(o,["Rootstock","Root Stock"])||"",
      internalId:csvVal(o,["Internal ID","InternalID","Item Internal ID"])||"",
      lotNumber:csvVal(o,["Lot Number","Lot","Lot #"])||"",
      scionPatent:csvVal(o,["Scion Patent","Scion Patent Number"])||"",
      rootstockPatent:csvVal(o,["Rootstock Patent","Rootstock Patent Number","Root Stock Patent"])||"",
      scionRoyalty:csvVal(o,["Scion Royalty","Scion Royalty Fee","Scion Royalty Amount","Scion Royalty Rate"])||"",
      rootstockRoyalty:csvVal(o,["Rootstock Royalty","Root Stock Royalty","Rootstock Royalty Fee","Rootstock Royalty Amount","Rootstock Royalty Rate"])||"",
      tray:csvVal(o,["Tray Type"])||"",
      labelColor:csvVal(o,["Label Color","Color"])||"",
      quantity:csvVal(o,["Quantity","Qty"])||"1",
      labelsNeeded:normalizeLabelCount(csvVal(o,["Labels Needed","Labels","Label Qty"])||"1"),
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
    scionRoyalty:"SCION ROYALTY",
    rootstockRoyalty:"ROOTSTOCK ROYALTY",
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
    scionRoyalty:"",
    rootstockRoyalty:"",
    labelsNeeded:"1"
  };
}

function potWarningText(){ return ""; }
function patentPieces(row){ return []; }
function potLotQrText(row){ return String(row.wo||"").trim(); }
function splitLotParts(row){
  return String((row&&row.lotNumber)||"").split("|").map(s=>String(s||"").trim()).filter(Boolean);
}
function isRschScion(row){
  return /rsch\s*scion/i.test(String((row&&row.scion)||"")) || /rsch\s*scion/i.test(String((row&&row.name)||""));
}
function isRschRootstock(row){
  return /rsch\s*rootstock/i.test(String((row&&row.rootstock)||"")) || /rsch\s*rootstock/i.test(String((row&&row.name)||""));
}
function derivedScion(row){
  const raw=String((row&&row.scion)||"").trim();
  const parts=splitLotParts(row);
  if(isRschScion(row)) return String(parts[0]||raw||row.crop||"").trim();
  return raw || String((row&&row.crop)||"").trim();
}
function derivedRootstock(row){
  const raw=String((row&&row.rootstock)||"").trim();
  const parts=splitLotParts(row);
  if(isRschRootstock(row)){
    return String(parts[1]||parts[0]||raw||"").trim();
  }
  return raw || String((row&&row.scion)||"").trim();
}
function isRschRow(row){
  return isRschScion(row) || isRschRootstock(row) || /rsch/i.test(String((row&&row.scion)||"")+" "+String((row&&row.rootstock)||"")+" "+String((row&&row.name)||""));
}
function displayPotItem(row){
  const olive=/olive/i.test(row.crop||"");
  const scion=cleanDisplay(derivedScion(row));
  const rootstock=cleanDisplay(derivedRootstock(row));
  const crop=cleanDisplay(row.crop);
  let txt=olive?(scion||rootstock||crop||"ITEM"):(rootstock||scion||crop||"ITEM");
  if(/^platinum\s+pistachio\s+rootstock$/i.test(String(txt||"").trim())) txt = "Platinum";
  return cap(txt);
}
function labelText(id,row){
  if(id==="WO")return cap(row.wo||"WO");
  if(id==="ITEM"){
    if(labelType==="WRAP") return cap(derivedRootstock(row)||derivedScion(row)||row.crop||"ITEM");
    return displayPotItem(row);
  }
  if(id==="WEEK")return cap(currentWeekNumber());
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
    selectedId=defaultSelectedId(labelType);
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
  applyModeClass();
}

function applyModeClass(){
  if(!document.body) return;
  document.body.classList.toggle("beinvt-label-pot",labelType==="POT");
  document.body.classList.toggle("beinvt-label-wrap",labelType==="WRAP");
}

function removeGitHubWorkflowText(){
  const needle="To commit a preset to GitHub: export/download JSON, then use the included manual GitHub workflow Commit layout preset.";
  document.querySelectorAll("body *").forEach(el=>{
    if(!el||["SCRIPT","STYLE"].includes(el.tagName)) return;
    if(el.dataset && el.dataset.beinvtGitTextRemoved) return;
    [...el.childNodes].forEach(n=>{
      if(n.nodeType===3 && String(n.nodeValue||"").includes(needle)){
        n.nodeValue=String(n.nodeValue||"").replace(needle,"").trim();
        if(el.dataset) el.dataset.beinvtGitTextRemoved="1";
      }
    });
    if(el.children.length===0 && String(el.textContent||"").trim()===needle) el.remove();
  });
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
  const wo=objs.WO, qr=objs.QR, item=objs.ITEM, week=objs.WEEK;
  if(wo){wo.rot=0; wo.x=3; wo.y=8; wo.w=66; wo.h=18;}
  if(qr){qr.rot=0; qr.w=clamp(Number(qr.w||50),34,50); qr.h=clamp(Number(qr.h||50),34,50); qr.x=Math.round((72-qr.w)/2); qr.y=(wo?Number(wo.y||0)+Number(wo.h||18)+1:27);}
  if(week){week.rot=0; week.w=50; week.h=24; week.x=Math.round((72-week.w)/2); week.y=Math.max(0,limit-week.h);}
  if(item){
    item.x=2; item.w=68; item.rot=90; item.alignH='center'; item.alignV='middle';
    item.y=(qr?Number(qr.y||0)+Number(qr.h||0)+1:83);
    const targetBottom=week?Number(week.y||limit):limit;
    item.h=Math.max(38,targetBottom-Number(item.y||0)-2);
  }
  clampAllObjects();
}

let __potTightenPass=false;
function tightenPotLayoutAfterFit(){ return false; }

function hasAnyId(sec,ids){
  return ids.some(id=>sec.querySelector && sec.querySelector('#'+id));
}
function sectionContainsText(sec,patterns){
  const t=String(sec&&sec.textContent||'').toLowerCase();
  return patterns.some(p=>t.includes(String(p).toLowerCase()));
}
function isLegacyDataSection(sec){
  if(!sec) return false;
  if(sec.querySelector && (sec.querySelector('#rowsBody') || sec.querySelector('#rowsTable') || sec.querySelector('#search'))) return true;
  const h=sec.querySelector && sec.querySelector('h1,h2,h3,h4,.sectionTitle,.title');
  const title=String((h&&h.textContent)||sec.getAttribute('aria-label')||'').trim().toLowerCase();
  return title==='data' && sectionContainsText(sec,['search labels','work order','activity']);
}
function hideLegacyDataSections(){
  document.querySelectorAll('.section').forEach(sec=>{
    if(isLegacyDataSection(sec)){
      sec.classList.add('beinvt-legacy-data-section');
      sec.style.display='none';
    }
  });
}
function ensureMainLayoutNoOverlap(){
  const stage=document.querySelector('.stageWrap') || ($('canvasHost') && $('canvasHost').closest('.stageWrap'));
  const panels=[...document.querySelectorAll('aside.panel,.panel.sidebar,.settingsPanel')];
  const panel=panels.find(p=>p.querySelector('#objectPanel')||p.querySelector('#queueList')||p.querySelector('#presetSelect')||p.querySelector('#layoutJson'))||panels[0];
  if(!stage||!panel||panel===stage||stage.contains(panel)) return;
  let parent=stage.parentElement;
  if(!parent) return;
  try{
    if(panel.parentElement!==parent) parent.insertBefore(panel,stage);
    else if([...parent.children].indexOf(panel)>[...parent.children].indexOf(stage)) parent.insertBefore(panel,stage);
  }catch(e){}
  parent.classList.add('beinvt-main-shell');
  stage.classList.add('beinvt-stage-main');
  panel.classList.add('beinvt-left-settings-panel');
  panel.style.position='relative';
  panel.style.transform='none';
  panel.style.float='none';
  stage.style.position='relative';
  stage.style.transform='none';
  stage.style.float='none';
}
function classifySettingsSection(sec,idx){
  if(!sec) return `Settings ${idx+1}`;
  if(hasAnyId(sec,['objectPanel','selectedName'])) return 'Objects';
  if(hasAnyId(sec,['x','y','w','h','rot','fontSize','centerH','centerV','centerBoth'])) return 'Object Position';
  if(hasAnyId(sec,['safeToggle','gridToggle','gridPx','safeMargin','snapToggle','snapPx','snapGridToggle'])) return 'Guides & Snap';
  if(hasAnyId(sec,['queueList','addCurrent','clearQueue'])) return 'Print Queue';
  if(hasAnyId(sec,['presetSelect','savePreset','loadPreset','deletePreset'])) return 'Presets';
  if(hasAnyId(sec,['layoutJson','exportLayout','importLayout','downloadLayout','resetLayout'])) return 'Layout JSON';
  if(hasAnyId(sec,['printCalibration','saveCalibration','measuredW','measuredH'])) return 'Calibration';
  if(hasAnyId(sec,['printLabel','printQueue','testMode'])) return 'Print Actions';
  if(isLegacyDataSection(sec)) return 'Data';
  const raw=(sec.querySelector('h1,h2,h3,h4,.sectionTitle,.title')||{}).textContent||sec.getAttribute('aria-label')||'';
  const clean=String(raw||'').trim().replace(/\s+/g,' ');
  if(clean && !/^settings\s*\d+$/i.test(clean)) return clean.slice(0,28);
  const txt=String(sec.textContent||'').toLowerCase();
  if(txt.includes('preset')) return 'Presets';
  if(txt.includes('queue')) return 'Print Queue';
  if(txt.includes('calibration')) return 'Calibration';
  if(txt.includes('safe')||txt.includes('grid')||txt.includes('snap')) return 'Guides & Snap';
  if(txt.includes('selected')||txt.includes('object')) return 'Objects';
  return `Settings ${idx+1}`;
}
function settingsSectionTitle(sec,idx){
  return classifySettingsSection(sec,idx);
}
function activateSettingsGroup(idx){
  const tabs=document.querySelectorAll(".settingsGroupTab[data-settings-group]");
  const secs=document.querySelectorAll(".section[data-settings-group]");
  tabs.forEach(t=>t.classList.toggle("active",t.dataset.settingsGroup===String(idx)));
  secs.forEach(sec=>sec.classList.toggle("beinvt-hidden-section",sec.dataset.settingsGroup!==String(idx)));
  localStorage.setItem("beinvtSettingsGroup",String(idx));
}
function ensureSettingsGroups(){
  hideLegacyDataSections();
  const panel=document.querySelector("aside.panel")||document.querySelector(".panel.sidebar")||document.querySelector(".settingsPanel");
  if(!panel) return;
  let sections=[];
  try{ sections=[...panel.querySelectorAll(":scope > .section")]; }catch(e){ sections=[...panel.querySelectorAll(".section")].filter(sec=>sec.parentElement===panel); }
  sections=sections.filter(sec=>!isLegacyDataSection(sec)&&sec.style.display!=="none"&&!sec.classList.contains("beinvt-legacy-data-section")&&!sec.querySelector("#stageRowsTable")&&!sec.closest("#canvasHost"));
  if(sections.length<2) return;
  panel.classList.add("beinvt-settings-compact");
  let tabs=panel.querySelector("#settingsGroupTabs");
  if(!tabs){
    tabs=document.createElement("div");
    tabs.id="settingsGroupTabs";
    tabs.className="settingsGroupTabs";
    panel.insertBefore(tabs,sections[0]);
  }
  tabs.innerHTML="";
  sections.forEach((sec,idx)=>{
    sec.dataset.settingsGroup=String(idx);
    const btn=document.createElement("button");
    btn.type="button";
    btn.className="settingsGroupTab";
    btn.dataset.settingsGroup=String(idx);
    btn.textContent=settingsSectionTitle(sec,idx);
    btn.onclick=()=>activateSettingsGroup(idx);
    tabs.appendChild(btn);
  });
  const saved=Number(localStorage.getItem("beinvtSettingsGroup")||0);
  activateSettingsGroup(Number.isFinite(saved)&&saved>=0&&saved<sections.length?saved:0);
}

function renderAll(){
  applyModeClass();
  removeGitHubWorkflowText();
  ensureModeTabs();
  ensureStageShell();
  hideLegacyDataSections();
  ensureMainLayoutNoOverlap();
  ensureSettingsGroups();
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

function ensureStageShell(){
  const host=$("canvasHost");
  if(!host) return null;
  if(!$("stageLabelHost")){
    host.innerHTML="";
    const data=document.createElement("div");
    data.id="stageDataWrap";
    data.innerHTML=`<div id="stageDataSearchRow"><input id="stageSearch" placeholder="Search labels..."/></div><div class="stageTableScroll"><table class="table" id="stageRowsTable"><thead><tr id="stageRowsHead"></tr></thead><tbody id="stageRowsBody"></tbody></table></div>`;
    const labelHost=document.createElement("div");
    labelHost.id="stageLabelHost";
    host.appendChild(data);
    host.appendChild(labelHost);
    const oldBody=$("rowsBody");
    if(oldBody){
      const oldSection=oldBody.closest(".section");
      if(oldSection){ oldSection.classList.add("beinvt-legacy-data-section"); oldSection.style.display="none"; }
      else { const oldWrap=oldBody.closest("table,div"); if(oldWrap) oldWrap.style.display="none"; }
    }
    hideLegacyDataSections();
    ensureMainLayoutNoOverlap();
    const stageSearch=$("stageSearch");
    if(stageSearch){
      stageSearch.value=($("search")&&$("search").value)||"";
      stageSearch.addEventListener("input",function(){
        if($("search")) $("search").value=stageSearch.value;
        renderRows();
      });
    }
  }
  return $("stageLabelHost");
}

function effectiveStageZoom(requested,s,labelHost){
  let z=Number(requested||1);
  if(!isFinite(z)||z<=0) z=1;
  const hostW=Math.max(1,(labelHost&&labelHost.clientWidth)||window.innerWidth||900);
  const hostH=Math.max(1,(labelHost&&labelHost.clientHeight)||window.innerHeight||500);
  const metaW=labelType==="WRAP"?274:0;
  const metaH=labelType==="POT"?92:0;
  const gap=labelType==="WRAP"?18:10;
  const pad=26;
  let maxByW=(hostW-metaW-gap-pad)/Math.max(1,s.w);
  let maxByH=(hostH-metaH-gap-pad)/Math.max(1,s.h);
  const hardMax=labelType==="WRAP"?1.08:1.18;
  if(labelType==="POT"){
    maxByW=(hostW-pad)/Math.max(1,s.w);
    maxByH=(hostH-metaH-gap-pad)/Math.max(1,s.h);
  }
  const maxZ=Math.max(0.22,Math.min(hardMax,maxByW,maxByH));
  const out=clamp(z,0.22,maxZ);
  if($('zoom') && Number($('zoom').value)>maxZ) $('zoom').title=`Zoom is capped at ${maxZ.toFixed(2)} so the layout does not overlap or create extra scrollbars.`;
  return out;
}

function renderCanvas(){
  const labelHost=ensureStageShell();
  if(!labelHost) return;
  labelHost.innerHTML="";
  syncPotAutoLayout();
  const s=sizePx(), zoom=effectiveStageZoom(Number(($("zoom")&&$("zoom").value)||1),s,labelHost);
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
  const stageFrame=document.createElement("div");
  stageFrame.className="stageFrame";
  stageFrame.style.width=Math.ceil(s.w*zoom)+"px";
  stageFrame.style.height=Math.ceil(s.h*zoom)+"px";

  const stage=document.createElement("div");
  stage.className="stageInner";
  stage.style.width=s.w+"px";
  stage.style.height=s.h+"px";
  stage.style.transformOrigin="left top";
  stage.style.transform=`scale(${zoom})`;

  const lab=document.createElement("div");
  lab.className="labelCanvas";
  lab.style.width=s.w+"px";
  lab.style.height=s.h+"px";
  stage.appendChild(lab);
  stageFrame.appendChild(stage);

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

  for(const id of objectOrder()){
    const o=layout.objects[id];
    if(!o||o.visible===false)continue;
    const el=document.createElement("div");
    el.className="obj"+(selectedId===id?" selected":"")+(o.locked?" locked":"");
    el.dataset.id=id;
    Object.assign(el.style,{left:o.x+"px",top:o.y+"px",width:o.w+"px",height:o.h+"px"});
    if(labelType==="WRAP"){
      el.appendChild(makeWrapObjectInner(id,row,o));
    }else{
      if(id==="QR") renderQrInto(el,row.wo);
      else el.appendChild(makeTextInner(id,row,o));
    }
    lab.appendChild(el);
    attachObjectEvents(el);
  }

  const previewRow=document.createElement("div");
  previewRow.className="labelPreviewRow "+(labelType==="POT"?"potPreviewRow":"wrapPreviewRow");
  previewRow.appendChild(meta);
  previewRow.appendChild(stageFrame);
  stack.appendChild(previewRow);
  labelHost.appendChild(stack);
  autoFitTextObjects();
  autoFitWrapPreview();
}

function makeTextInner(id,row,o){
  const c=document.createElement("div");
  c.className="inner";
  c.dataset.textId=id;
  c.textContent=labelText(id,row);
  c.style.fontSize=(o.fontSize||16)+"px";
  c.style.fontFamily=`"${o.fontFamily||"Times New Roman"}", Georgia, serif`;
  c.style.justifyContent=alignH(o.alignH);
  c.style.alignItems=alignV(o.alignV);
  c.style.textAlign="center";
  if(id==="ITEM"){
    c.style.justifyContent='center';
    c.style.alignItems='center';
    c.style.whiteSpace="normal";
    c.style.wordBreak="break-word";
    c.style.overflowWrap="anywhere";
    c.style.lineHeight="0.88";
    c.style.padding="0px";
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

function wrapLeftQrText(row){
  return String(row.wo||"").trim() || " ";
}
function wrapRightQrText(row){
  if(isRschRow(row)) return "";
  const lot=String(row.lotNumber||"").trim();
  const wo=String(row.wo||"").trim();
  return lot ? `LOT ${lot} | ${wo}` : (wo || " ");
}
function wrapScionText(row){
  return capClean(cleanDisplay(derivedScion(row)) || cleanDisplay(row.crop) || cleanDisplay(derivedRootstock(row)) || "ITEM");
}
function wrapRootstockText(row){
  let txt=cleanDisplay(derivedRootstock(row)) || cleanDisplay(derivedScion(row)) || cleanDisplay(row.crop) || "ROOTSTOCK";
  if(/^platinum\s+pistachio\s+rootstock$/i.test(String(txt||"").trim())) txt = "Platinum";
  return capClean(txt);
}
function wrapLotLine(row){
  if(isRschRow(row)) return "";
  return capClean(row.lotNumber);
}
function cleanRoyaltyText(v){
  return capClean(v);
}
function wrapScionRoyaltyText(row){
  return cleanRoyaltyText(row.scionRoyalty || row.scionPatent || "");
}
function wrapRootstockRoyaltyText(row){
  return cleanRoyaltyText(row.rootstockRoyalty || row.rootstockPatent || "");
}
function wrapPatentText(row){
  const parts=[];
  const sr=wrapScionRoyaltyText(row);
  const rr=wrapRootstockRoyaltyText(row);
  if(sr) parts.push(sr);
  if(rr) parts.push(rr);
  return parts.join(" | ");
}
function wrapObjectText(id,row){
  if(id==="WO") return capClean(row.wo);
  if(id==="CROP") return capClean(row.crop);
  if(id==="INTERNAL") return capClean(row.internalId);
  if(id==="SCION") return wrapScionText(row);
  if(id==="SCION_ROYALTY") return wrapScionRoyaltyText(row);
  if(id==="ROOTSTOCK") return wrapRootstockText(row);
  if(id==="ROOTSTOCK_ROYALTY") return wrapRootstockRoyaltyText(row);
  if(id==="LOT") return wrapLotLine(row);
  if(id==="ADDRESS") return WRAP_ADDRESS;
  if(id==="WARNING") return WRAP_WARNING;
  return "";
}
function makeWrapTextInner(id,row,o){
  const c=document.createElement("div");
  c.className="wrapTextInner"+(id==="ROOTSTOCK"?" rootstockInner":"")+(["WO","CROP","INTERNAL","WARNING"].includes(id)?" leftText":"")+(["SCION_ROYALTY","ROOTSTOCK_ROYALTY","LOT","ADDRESS","WARNING"].includes(id)?" smallText":"");
  c.style.fontSize=(o.fontSize||8)+"px";
  c.style.justifyContent=alignH(o.alignH);
  c.style.alignItems=alignV(o.alignV);
  c.style.textAlign=(o.alignH==="left"?"left":o.alignH==="right"?"right":"center");
  if(id==="ROOTSTOCK") c.innerHTML=`<span class="wrapOn">on</span>${escapeHtml(wrapRootstockText(row))}`;
  else c.textContent=wrapObjectText(id,row);
  return c;
}
function makeSgLogoInner(){
  const c=document.createElement("div");
  c.className="wrapLogo";
  c.style.width="100%";
  c.style.height="100%";
  c.style.flex="0 0 auto";
  const img=document.createElement("img");
  img.src=SG_LOGO_URL;
  img.alt="SG";
  img.onerror=function(){ c.innerHTML='<div class="wrapLogoFallback">SG</div>'; };
  c.appendChild(img);
  return c;
}
function makeWrapObjectInner(id,row,o){
  const c=document.createElement("div");
  c.style.position="absolute";
  c.style.inset="0";
  c.style.overflow="hidden";
  if(id==="WO_QR"){ renderQrInto(c,wrapLeftQrText(row)); return c; }
  if(id==="LOT_QR"){ const qrText=wrapRightQrText(row); if(qrText) renderQrInto(c,qrText); return c; }
  if(id==="LOGO") return makeSgLogoInner();
  return makeWrapTextInner(id,row,o);
}

function makeWrapWoInner(row){
  const c=document.createElement("div");
  c.className="wrapWoBlock";
  const qr=document.createElement("div");
  qr.className="wrapWoQr";
  renderQrInto(qr,wrapLeftQrText(row));
  const t=document.createElement("div");
  t.className="wrapWoText";
  t.innerHTML=`<div class="wo">${escapeHtml(cap(row.wo||""))}</div><div class="crop">${escapeHtml(cap(row.crop||""))}</div><div class="internal">${escapeHtml(cap(row.internalId||""))}</div>`;
  c.appendChild(qr); c.appendChild(t);
  return c;
}
function makeWrapMainInner(row){
  const c=document.createElement("div");
  c.className="wrapMainBlock";
  const scionRoyalty=wrapScionRoyaltyText(row);
  const rootstockRoyalty=wrapRootstockRoyaltyText(row);
  const lotLine=wrapLotLine(row);
  c.innerHTML=`<div class="scionLine">${escapeHtml(wrapScionText(row))}</div>${scionRoyalty?`<div class="royaltyLine scionRoyaltyLine">${escapeHtml(scionRoyalty)}</div>`:""}<div class="rootLine"><span class="on">on</span>${escapeHtml(wrapRootstockText(row))}</div>${rootstockRoyalty?`<div class="royaltyLine rootstockRoyaltyLine">${escapeHtml(rootstockRoyalty)}</div>`:""}${lotLine?`<div class="benchLine">${escapeHtml(lotLine)}</div>`:""}<div class="addressLine">${escapeHtml(WRAP_ADDRESS)}</div>`;
  return c;
}
function makeWrapQrInner(row){
  const c=document.createElement("div");
  c.className="wrapQrBlock";
  const qrText=wrapRightQrText(row);
  if(qrText){
    const qr=document.createElement("div");
    qr.className="wrapLotQr";
    renderQrInto(qr,qrText);
    c.appendChild(qr);
  }
  const logo=document.createElement("div");
  logo.className="wrapLogo";
  const img=document.createElement("img");
  img.src=SG_LOGO_URL;
  img.alt="SG";
  img.onerror=function(){ logo.innerHTML='<div class="wrapLogoFallback">SG</div>'; };
  logo.appendChild(img);
  c.appendChild(logo);
  return c;
}
function makeWrapWarningInner(){
  const c=document.createElement("div");
  c.className="wrapWarningBlock";
  c.textContent=WRAP_WARNING;
  return c;
}
function printWrapInner(id,row,o){
  const outer=`position:absolute;left:0;top:0;width:${o.w}px;height:${o.h}px;overflow:hidden;`;
  if(id==="WO") return `<div style="${outer}display:flex;align-items:stretch;gap:3px;padding:2px 2px;font-family:'Times New Roman',Georgia,serif;text-transform:uppercase;font-weight:900;"><div style="width:38px;height:38px;flex:0 0 38px;margin:auto 0;"><img src="${qrUrl(wrapLeftQrText(row))}" style="width:100%;height:100%;image-rendering:pixelated"/></div><div style="display:flex;flex-direction:column;justify-content:space-between;align-items:flex-start;height:100%;line-height:.86;min-width:0;flex:1;"><div style="font-size:14px;">${escapeHtml(cap(row.wo||""))}</div><div style="font-size:11px;">${escapeHtml(cap(row.crop||""))}</div><div style="font-size:10px;">${escapeHtml(cap(row.internalId||""))}</div></div></div>`;
  if(id==="ITEM") {
    const lotLine=wrapLotLine(row);
    const scionRoyalty=wrapScionRoyaltyText(row);
    const rootstockRoyalty=wrapRootstockRoyaltyText(row);
    return `<div style="${outer}display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:2px 3px 1px;font-family:'Times New Roman',Georgia,serif;text-transform:uppercase;font-weight:900;line-height:.86;"><div style="font-size:15px;white-space:normal;word-break:break-word;overflow-wrap:anywhere;max-width:100%;">${escapeHtml(wrapScionText(row))}</div>${scionRoyalty?`<div style="font-size:5px;line-height:.94;margin-top:0;white-space:normal;word-break:break-word;overflow-wrap:anywhere;max-width:100%;">${escapeHtml(scionRoyalty)}</div>`:""}<div style="font-size:15px;white-space:normal;word-break:break-word;overflow-wrap:anywhere;max-width:100%;"><span style="font-size:.68em;margin-right:.18em;text-transform:none!important;">on</span>${escapeHtml(wrapRootstockText(row))}</div>${rootstockRoyalty?`<div style="font-size:5px;line-height:.94;margin-top:0;white-space:normal;word-break:break-word;overflow-wrap:anywhere;max-width:100%;">${escapeHtml(rootstockRoyalty)}</div>`:""}${lotLine?`<div style="font-size:4.7px;line-height:.94;margin-top:0;white-space:normal;word-break:break-word;overflow-wrap:anywhere;max-width:100%;">${escapeHtml(lotLine)}</div>`:""}<div style="font-size:4.7px;line-height:.94;margin-top:0;white-space:normal;word-break:break-word;overflow-wrap:anywhere;max-width:100%;">${escapeHtml(WRAP_ADDRESS)}</div></div>`;
  }
  if(id==="QR") { const qrText=wrapRightQrText(row); return `<div style="${outer}display:flex;align-items:center;justify-content:center;gap:2px;padding:1px 1px;">${qrText?`<div style="width:34px;height:34px;flex:0 0 34px;"><img src="${qrUrl(qrText)}" style="width:100%;height:100%;image-rendering:pixelated"/></div>`:""}<div style="width:20px;height:20px;flex:0 0 20px;display:flex;align-items:center;justify-content:center;"><img src="${escapeHtml(SG_LOGO_URL)}" style="width:100%;height:100%;object-fit:contain;image-rendering:auto" onerror="this.outerHTML='SG'"/></div></div>`; }
  if(id==="WEEK") return `<div style="${outer}display:flex;align-items:center;justify-content:flex-start;padding:1px 2px;white-space:pre-line;text-align:left;text-transform:uppercase;font-family:'Times New Roman',Georgia,serif;font-weight:900;font-size:4.3px;line-height:.82;">${escapeHtml(WRAP_WARNING)}</div>`;
  return "";
}

function alignH(v){return v==="left"?"flex-start":v==="right"?"flex-end":"center"}
function alignV(v){return v==="top"?"flex-start":v==="bottom"?"flex-end":"center"}

function autoFitTextObjects(){
  if(labelType==="WRAP") return;
  for(const id of["WO","ITEM","WEEK"]){
    const e=document.querySelector(`.obj[data-id="${id}"]`);
    if(!e)continue;
    const c=e.firstElementChild;
    if(!c)continue;
    const o=layout.objects[id], r=((Number(o.rot||0)%360)+360)%360, swap=(r===90||r===270);
    const maxW=swap?o.h:o.w, maxH=swap?o.w:o.h;
    let lo=6, hi=(id==="ITEM"?160:80), best=6;
    while(lo<=hi){
      const mid=Math.floor((lo+hi)/2);
      c.style.fontSize=mid+"px";
      if(c.scrollWidth<=maxW && c.scrollHeight<=maxH){best=mid;lo=mid+1}
      else hi=mid-1;
    }
    c.style.fontSize=best+"px";
    if(o) o.fontSize=best;
  }
}

function wrapBlockFits(el){
  return el.scrollWidth<=el.clientWidth+1 && el.scrollHeight<=el.clientHeight+1;
}
function autoFitWrapPreview(){
  if(labelType!=="WRAP") return;
  const ranges={
    WO:[14,8], CROP:[11,7], INTERNAL:[10,7],
    SCION:[24,7], ROOTSTOCK:[24,7],
    SCION_ROYALTY:[5.4,3.5], ROOTSTOCK_ROYALTY:[5.4,3.5],
    LOT:[4.8,3.2], ADDRESS:[4.8,3.2], WARNING:[4.5,3.2]
  };
  Object.entries(ranges).forEach(([id,range])=>{
    const obj=document.querySelector(`.obj[data-id="${id}"]`);
    const inner=obj&&obj.querySelector('.wrapTextInner');
    if(!obj||!inner) return;
    let fs=range[0], min=range[1];
    for(; fs>=min; fs-=0.2){
      inner.style.fontSize=fs.toFixed(1)+'px';
      if(wrapBlockFits(obj)) break;
    }
    if(layout&&layout.objects&&layout.objects[id]) layout.objects[id].fontSize=parseFloat(inner.style.fontSize)||layout.objects[id].fontSize;
  });
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

function objectDisplayName(id){
  if(labelType==="WRAP"){
    const names={WO_QR:"WO QR",WO:"WO",CROP:"Crop",INTERNAL:"Internal ID",SCION:"Scion",SCION_ROYALTY:"Scion Royalty",ROOTSTOCK:"Rootstock",ROOTSTOCK_ROYALTY:"Rootstock Royalty",LOT:"Lot",ADDRESS:"Address",LOT_QR:"Lot QR",LOGO:"SG Logo",WARNING:"Warning"};
    return names[id]||id;
  }
  if(labelType==="POT"){
    if(id==="WO") return "Work Order";
    if(id==="ITEM") return "Pot Stake Item";
    if(id==="QR") return "WO QR";
    if(id==="WEEK") return "Week";
  }
  return id;
}
function renderObjectPanel(){
  const h=$("objectPanel");
  if(!h)return;
  if(!layout.objects[selectedId]) selectedId=defaultSelectedId(labelType);
  h.innerHTML="";
  for(const id of objectOrder()){
    const o=layout.objects[id];
    if(!o) continue;
    const b=document.createElement("button");
    b.className="objectBtn"+(selectedId===id?" active":"");
    b.innerHTML=`<span>${escapeHtml(objectDisplayName(id))}</span><span class="badge">${o.locked?"LOCKED":"UNLOCKED"}</span>`;
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
  if(!layout.objects[selectedId]) selectedId=defaultSelectedId(labelType);
  const o=layout.objects[selectedId];
  if(!o)return;
  if($("selectedName")) $("selectedName").textContent=objectDisplayName(selectedId);
  for(const k of["x","y","w","h","rot","fontSize"]){
    const inp=$(k);
    if(inp)inp.value=Math.round(Number(o[k]||0));
  }
  if($("fontSize")) $("fontSize").disabled=isImageObject(selectedId);
  if($("lockToggle")) $("lockToggle").checked=!!o.locked;
  if($("visibleToggle")) $("visibleToggle").checked=o.visible!==false;
  if($("safeMargin")) $("safeMargin").value=Number(layout.safeMarginPx||0);
  if($("safeValue")) $("safeValue").textContent=Number(layout.safeMarginPx||0)+"px";
  if($("gridPx")) $("gridPx").value=Number(layout.gridPx||4);
}

function applyControls(){
  if(!layout.objects[selectedId]) selectedId=defaultSelectedId(labelType);
  pushHistory();
  const o=layout.objects[selectedId];
  for(const k of["x","y","w","h","rot"]){
    const inp=$(k);
    const v=Number(inp&&inp.value);
    if(isFinite(v))o[k]=v;
  }
  if(!isImageObject(selectedId)){
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
  const o=layout.objects[selectedId],b=labelBounds(),limH=activeBottomLimit();
  if(axis==="h"||axis==="both")o.x=Math.round((b.w-o.w)/2);
  if(axis==="v"||axis==="both")o.y=Math.round((limH-o.h)/2);
  clampObject(selectedId);
  saveWorkingLayout();
  renderAll();
}


function cellText(v){ return escapeHtml(capClean(v)); }
function isExcludedPotActivity(act){
  const a=String(act||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
  return /pres*ships*sorting/.test(a) || /shippings*request/.test(a) || /propagations*materials*processing/.test(a);
}
function potTableItemText(r){
  return cleanDisplay(derivedRootstock(r)) || cleanDisplay(displayPotItem(r)) || cleanDisplay(derivedScion(r)) || cleanDisplay(r.crop);
}
function buildRowHtml(r){
  if(labelType==="POT"){
    return `<td>${cellText(r.wo)}</td><td>${cellText(r.act)}</td><td>${cellText(potTableItemText(r))}</td><td>${cellText(r.labelColor)}</td><td>${escapeHtml(displayLabelsNeeded(r))}</td><td><button>Add</button></td>`;
  }
  return `<td>${cellText(r.wo)}</td><td>${cellText(r.crop)}</td><td>${cellText(wrapScionText(r))}</td><td>${cellText(wrapRootstockText(r))}</td><td>${cellText(r.internalId)}</td><td>${cellText(r.labelColor)}</td><td>${escapeHtml(displayLabelsNeeded(r))}</td><td><button>Add</button></td>`;
}
function renderRowBody(tb){
  if(!tb) return;
  tb.innerHTML="";
  filteredRows.slice(0,300).forEach((r,i)=>{
    const tr=document.createElement("tr");
    if(i===currentRowIndex)tr.className="active";
    tr.innerHTML=buildRowHtml(r);
    tr.onclick=e=>{
      if(e.target.tagName==="BUTTON"){addToQueue(r);return}
      currentRowIndex=i;
      renderRows();
      renderCanvas();
    };
    tb.appendChild(tr);
  });
}
function renderRows(){
  ensureStageShell();
  const q=(($("stageSearch")&&$("stageSearch").value)||($("search")&&$("search").value)||"").toLowerCase();
  if($("search") && $("stageSearch") && $("search").value!==$("stageSearch").value) $("search").value=$("stageSearch").value;
  filteredRows=rows.filter(r=>{
    if(labelType==="POT"){
      if(cleanDisplay(r.scion)) return false;
      if(isExcludedPotActivity(r.act)) return false;
    }
    return Object.values(r).join(" ").toLowerCase().includes(q);
  });
  if(currentRowIndex>=filteredRows.length)currentRowIndex=0;
  const headerHtml=labelType==="POT"
    ? "<th style='width:14%'>WO</th><th style='width:22%'>Activity</th><th style='width:34%'>Item / Rootstock</th><th style='width:14%'>Color</th><th style='width:10%'>Labels</th><th style='width:6%'></th>"
    : "<th style='width:12%'>WO</th><th style='width:12%'>Crop</th><th style='width:20%'>Scion</th><th style='width:20%'>Rootstock</th><th style='width:12%'>Internal ID</th><th style='width:10%'>Color</th><th style='width:8%'>Labels</th><th style='width:6%'></th>";
  const stageHead=$("stageRowsHead");
  if(stageHead) stageHead.innerHTML=headerHtml;
  const oldHead=document.querySelector("aside.panel .table thead tr");
  if(oldHead) oldHead.innerHTML=headerHtml;
  renderRowBody($("stageRowsBody"));
  renderRowBody($("rowsBody"));
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
    d.innerHTML=`<div><b>${escapeHtml(cap(q.row.wo))}</b><div class="small">${escapeHtml(capClean(q.row.scion||""))} ${cleanDisplay(q.row.rootstock)?"| "+escapeHtml(capClean(q.row.rootstock)):""}</div><div class="small">${escapeHtml(capClean(q.row.labelColor||""))} • Qty ${escapeHtml(displayLabelsNeeded(q.row))}</div></div><input type="number" min="1" value="${q.qty}"><button class="danger">x</button>`;
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
  for(const id of objectOrder()){
    const o=layout.objects[id];
    if(!o||o.visible===false)continue;
    if(labelType!=="WRAP" && id==="WEEK"&&!row.week)continue;
    const outer=`position:absolute;left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;overflow:hidden;`;
    if(labelType==="WRAP") out+=`<div style="${outer}">${printWrapObjectInner(id,row,o)}</div>`;
    else if(id==="QR") out+=`<div style="${outer}"><img src="${qrUrl(row.wo)}" style="width:100%;height:100%;image-rendering:pixelated"/></div>`;
    else out+=`<div style="${outer}">${printTextInner(id,row,o)}</div>`;
  }
  return out+"</div>";
}
function printWrapObjectInner(id,row,o){
  if(id==="WO_QR") return `<img src="${qrUrl(wrapLeftQrText(row))}" style="width:100%;height:100%;image-rendering:pixelated"/>`;
  if(id==="LOT_QR") { const qrText=wrapRightQrText(row); return qrText?`<img src="${qrUrl(qrText)}" style="width:100%;height:100%;image-rendering:pixelated"/>`:""; }
  if(id==="LOGO") return `<img src="${escapeHtml(SG_LOGO_URL)}" style="width:100%;height:100%;object-fit:contain;image-rendering:auto" onerror="this.outerHTML='SG'"/>`;
  const alignHVal=alignH(o.alignH), alignVVal=alignV(o.alignV);
  const textAlign=o.alignH==="left"?"left":o.alignH==="right"?"right":"center";
  const common=`position:absolute;inset:0;display:flex;align-items:${alignVVal};justify-content:${alignHVal};overflow:hidden;text-align:${textAlign};white-space:normal;word-break:break-word;overflow-wrap:anywhere;font-family:'Times New Roman',Georgia,serif;font-weight:900;font-size:${o.fontSize||8}px;line-height:.86;padding:0 1px;`;
  if(id==="ROOTSTOCK") return `<div style="${common}text-transform:none;"><span style="font-size:.68em;margin-right:.18em;text-transform:none!important;">on</span>${escapeHtml(wrapRootstockText(row))}</div>`;
  if(id==="WARNING") return `<div style="${common}text-transform:uppercase;white-space:pre-line;line-height:.82;">${escapeHtml(WRAP_WARNING)}</div>`;
  return `<div style="${common}text-transform:uppercase;">${escapeHtml(wrapObjectText(id,row))}</div>`;
}

function printTextInner(id,row,o){
  const r=((Number(o.rot||0)%360)+360)%360, swap=(r===90||r===270);
  const left=swap?((o.w-o.h)/2):0, top=swap?((o.h-o.w)/2):0, w=swap?o.h:o.w, h=swap?o.w:o.h;
  const white=id==="ITEM"?"white-space:normal;word-break:break-word;overflow-wrap:anywhere;line-height:.88;padding:0;":"white-space:nowrap;";
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
  ensureStageShell();
  hideLegacyDataSections();
  ensureMainLayoutNoOverlap();
  ensureSettingsGroups();
  removeGitHubWorkflowText();
  bindDirectionalButtons();
  if($("labelType")) $("labelType").onchange=e=>{labelType=e.target.value;selectedId=defaultSelectedId(labelType);undoStack=[];redoStack=[];setLayout(loadWorkingLayout(labelType),false); renderRows(); updateModeTabs();};
  if($("zoom")) $("zoom").oninput=renderCanvas;
  if($("search")) $("search").oninput=function(){ if($("stageSearch")) $("stageSearch").value=this.value; renderRows(); };
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
  removeGitHubWorkflowText();
  loadDefaults().then(()=>{
    layout=loadWorkingLayout(labelType);
    initEvents();
    loadCsv().catch(console.warn).finally(renderAll);
  });
}

/* --------------------------------------------------------------------------
   v7.1.0 override layer
   - fills bottom space by sizing the main shell to the viewport
   - keeps Objects visible as the default settings group
   - removes useless zoom range beyond the real maximum
   - gives Wrap Ties about 25% of the stage area to the label preview
   - tightens wrap-tie object defaults so individual boxes do not overlap
   -------------------------------------------------------------------------- */
(function injectV710Css(){
  const css = `
    body{--beinvt-top-offset:96px!important;overflow:hidden!important}
    .beinvt-main-shell{grid-template-columns:minmax(340px,400px) minmax(0,1fr)!important;gap:10px!important;padding:6px 10px 10px!important;min-height:0!important;height:calc(100vh - var(--beinvt-top-offset))!important;overflow:hidden!important}
    .beinvt-main-shell > aside.panel,.beinvt-left-settings-panel{height:100%!important;max-height:none!important;overflow:auto!important;min-width:0!important;width:100%!important}
    .beinvt-main-shell > .stageWrap,.beinvt-stage-main{height:100%!important;min-height:0!important;overflow:hidden!important}
    #canvasHost{height:100%!important;min-height:0!important;overflow:hidden!important}
    body.beinvt-label-pot #canvasHost{grid-template-columns:minmax(0,1fr) minmax(250px,340px)!important;grid-template-rows:1fr!important}
    body.beinvt-label-wrap #canvasHost{grid-template-columns:1fr!important;grid-template-rows:minmax(0,3fr) minmax(142px,1fr)!important}
    #stageDataWrap{height:100%!important;min-height:0!important;max-height:none!important;overflow:hidden!important}
    body.beinvt-label-pot #stageDataWrap,body.beinvt-label-wrap #stageDataWrap{height:100%!important;min-height:0!important;max-height:none!important}
    .stageTableScroll{overflow-y:auto!important;overflow-x:hidden!important;min-height:0!important;height:100%!important}
    #stageRowsTable,body.beinvt-label-pot #stageRowsTable,body.beinvt-label-wrap #stageRowsTable{width:100%!important;min-width:0!important;table-layout:fixed!important}
    #stageRowsTable th,#stageRowsTable td{min-width:0!important;max-width:none!important}
    body.beinvt-label-wrap #stageLabelHost{min-height:142px!important;height:100%!important;align-items:flex-start!important;justify-content:center!important;padding:8px 6px 4px!important;overflow:hidden!important}
    body.beinvt-label-pot #stageLabelHost{height:100%!important;min-height:0!important;overflow:hidden!important;padding:4px 6px!important}
    body.beinvt-label-wrap #stageLabelHost .stageStack,body.beinvt-label-pot #stageLabelHost .stageStack{height:100%!important;min-height:0!important;overflow:hidden!important}
    body.beinvt-label-wrap .labelPreviewRow{width:100%!important;max-width:100%!important;gap:10px!important;justify-content:center!important;align-items:flex-start!important;overflow:hidden!important}
    body.beinvt-label-wrap .labelPreviewRow .stageMeta{width:235px!important;min-width:220px!important;max-width:235px!important;align-self:flex-start!important}
    body.beinvt-label-pot .labelPreviewRow .stageMeta{width:100%!important;min-width:240px!important;max-width:310px!important}
    .stageMeta .metaPill{min-height:34px!important}
    #objectPanel{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:6px!important;width:100%!important}
    body.beinvt-label-wrap #objectPanel{grid-template-columns:repeat(2,minmax(0,1fr))!important}
    .objectBtn{display:flex!important;flex-direction:column!important;gap:4px!important;align-items:flex-start!important;justify-content:center!important;min-height:42px!important;white-space:normal!important;overflow:hidden!important}
    .objectBtn span:first-child{display:block!important;width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important}
    .objectBtn .badge{max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important}
    .wrapTextInner,.wrapTextInner.rootstockInner{white-space:normal!important;word-break:break-word!important;overflow-wrap:anywhere!important;line-height:.78!important;min-width:0!important;max-width:100%!important}
    .wrapTextInner.smallText{line-height:.84!important}
    .wrapTextInner .wrapOn{white-space:nowrap!important;display:inline!important}
    input#zoom{max-width:180px!important;accent-color:#5b7cfa}
    @media(max-width:1180px){.beinvt-main-shell{height:auto!important;min-height:0!important;overflow:auto!important}.beinvt-main-shell > aside.panel,.beinvt-left-settings-panel{max-height:300px!important}body.beinvt-label-wrap #canvasHost{grid-template-rows:minmax(260px,3fr) minmax(142px,1fr)!important}}
  `;
  const tag = document.createElement('style');
  tag.setAttribute('data-beinvt-v710-css','1');
  tag.textContent = css;
  document.head.appendChild(tag);
})();

function fallbackLayout(t){
  if(t==="POT") return {
    name:"Pot Standard restored",
    labelType:"POT",
    safeMarginPx:5,
    gridPx:4,
    objects:{
      WO:{x:3,y:8,w:66,h:18,rot:0,fontSize:16,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      QR:{x:11,y:30,w:50,h:50,rot:0,locked:false,visible:true},
      ITEM:{x:2,y:84,w:68,h:230,rot:90,fontSize:22,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      WEEK:{x:11,y:320,w:50,h:24,rot:0,fontSize:18,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"}
    }
  };
  return {
    name:"Wrap Tie Standard - individual objects no overlap",
    labelType:"WRAP",
    safeMarginPx:3,
    gridPx:4,
    objects:{
      WO_QR:{x:2,y:5,w:38,h:38,rot:0,locked:false,visible:true},
      WO:{x:42,y:3,w:68,h:11,rot:0,fontSize:13,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"left",alignV:"middle"},
      CROP:{x:42,y:17,w:68,h:10,rot:0,fontSize:10,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"left",alignV:"middle"},
      INTERNAL:{x:42,y:31,w:68,h:10,rot:0,fontSize:9,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"left",alignV:"middle"},
      SCION:{x:114,y:1,w:238,h:13,rot:0,fontSize:19,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      SCION_ROYALTY:{x:114,y:14,w:238,h:4,rot:0,fontSize:4,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      ROOTSTOCK:{x:114,y:19,w:238,h:13,rot:0,fontSize:19,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      ROOTSTOCK_ROYALTY:{x:114,y:32,w:238,h:4,rot:0,fontSize:4,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      LOT:{x:114,y:37,w:238,h:4,rot:0,fontSize:3.8,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      ADDRESS:{x:114,y:42,w:238,h:5,rot:0,fontSize:3.8,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      LOT_QR:{x:356,y:7,w:34,h:34,rot:0,locked:false,visible:true},
      LOGO:{x:393,y:14,w:20,h:20,rot:0,locked:false,visible:true},
      WARNING:{x:418,y:2,w:60,h:44,rot:0,fontSize:4,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"left",alignV:"middle"}
    }
  };
}

function syncViewportFit(){
  const shell=document.querySelector('.beinvt-main-shell');
  if(!shell) return;
  const top=Math.max(0,Math.round(shell.getBoundingClientRect().top));
  const h=Math.max(520,Math.round(window.innerHeight-top-8));
  document.body.style.setProperty('--beinvt-top-offset', top+'px');
  shell.style.height=h+'px';
  shell.style.minHeight='0';
  const stage=document.querySelector('.beinvt-stage-main,.stageWrap');
  if(stage){ stage.style.height='100%'; stage.style.minHeight='0'; }
}

function ensureMainLayoutNoOverlap(){
  const stage=document.querySelector('.stageWrap') || ($('canvasHost') && $('canvasHost').closest('.stageWrap'));
  const panels=[...document.querySelectorAll('aside.panel,.panel.sidebar,.settingsPanel')];
  const panel=panels.find(p=>p.querySelector('#objectPanel')||p.querySelector('#queueList')||p.querySelector('#presetSelect')||p.querySelector('#layoutJson'))||panels[0];
  if(!stage||!panel||panel===stage||stage.contains(panel)) return;
  const parent=stage.parentElement;
  if(!parent) return;
  try{
    if(panel.parentElement!==parent) parent.insertBefore(panel,stage);
    else if([...parent.children].indexOf(panel)>[...parent.children].indexOf(stage)) parent.insertBefore(panel,stage);
  }catch(e){}
  parent.classList.add('beinvt-main-shell');
  stage.classList.add('beinvt-stage-main');
  panel.classList.add('beinvt-left-settings-panel');
  panel.style.position='relative';
  panel.style.transform='none';
  panel.style.float='none';
  stage.style.position='relative';
  stage.style.transform='none';
  stage.style.float='none';
  syncViewportFit();
}

function activateSettingsGroup(idx){
  const tabs=[...document.querySelectorAll('.settingsGroupTab[data-settings-group]')];
  const secs=[...document.querySelectorAll('.section[data-settings-group]')];
  if(!secs.length) return;
  let target=Number(idx);
  if(!Number.isFinite(target)||target<0||target>=secs.length) target=0;
  tabs.forEach(t=>t.classList.toggle('active',t.dataset.settingsGroup===String(target)));
  secs.forEach(sec=>sec.classList.toggle('beinvt-hidden-section',sec.dataset.settingsGroup!==String(target)));
  localStorage.setItem('beinvtSettingsGroup',String(target));
}

function ensureSettingsGroups(){
  hideLegacyDataSections();
  const panel=document.querySelector('aside.panel')||document.querySelector('.panel.sidebar')||document.querySelector('.settingsPanel');
  if(!panel) return;
  let sections=[];
  try{ sections=[...panel.querySelectorAll(':scope > .section')]; }catch(e){ sections=[...panel.querySelectorAll('.section')].filter(sec=>sec.parentElement===panel); }
  sections=sections.filter(sec=>!isLegacyDataSection(sec)&&sec.style.display!=="none"&&!sec.classList.contains('beinvt-legacy-data-section')&&!sec.querySelector('#stageRowsTable')&&!sec.closest('#canvasHost'));
  if(sections.length<2) return;
  panel.classList.add('beinvt-settings-compact');
  let tabs=panel.querySelector('#settingsGroupTabs');
  if(!tabs){
    tabs=document.createElement('div');
    tabs.id='settingsGroupTabs';
    tabs.className='settingsGroupTabs';
    panel.insertBefore(tabs,sections[0]);
  }
  tabs.innerHTML='';
  const titles=sections.map((sec,idx)=>settingsSectionTitle(sec,idx));
  sections.forEach((sec,idx)=>{
    sec.dataset.settingsGroup=String(idx);
    sec.dataset.settingsTitle=titles[idx];
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='settingsGroupTab';
    btn.dataset.settingsGroup=String(idx);
    btn.textContent=titles[idx];
    btn.onclick=()=>activateSettingsGroup(idx);
    tabs.appendChild(btn);
  });
  const objectIdx=Math.max(0,titles.findIndex(t=>/^objects$/i.test(t)));
  const savedRaw=localStorage.getItem('beinvtSettingsGroup');
  const saved=savedRaw==null?NaN:Number(savedRaw);
  const target=(Number.isFinite(saved)&&saved>=0&&saved<sections.length)?saved:objectIdx;
  activateSettingsGroup(target);
}

function updateZoomSliderMax(maxZ){
  const z=$('zoom');
  if(!z) return;
  const safeMax=Math.max(0.25,Number(maxZ)||1);
  z.min='0.25';
  z.max=safeMax.toFixed(2);
  z.step='0.01';
  if(Number(z.value)>safeMax) z.value=safeMax.toFixed(2);
  z.title=`Zoom range is capped at ${safeMax.toFixed(2)} so it will not create blank space or scrollbars.`;
}

function effectiveStageZoom(requested,s,labelHost){
  let z=Number(requested||1);
  if(!isFinite(z)||z<=0) z=1;
  syncViewportFit();
  const hostW=Math.max(1,(labelHost&&labelHost.clientWidth)||window.innerWidth||900);
  const hostH=Math.max(1,(labelHost&&labelHost.clientHeight)||window.innerHeight||500);
  const pad=22;
  let maxByW, maxByH, hardMax;
  if(labelType==='WRAP'){
    const metaW=245, gap=12;
    maxByW=(hostW-metaW-gap-pad)/Math.max(1,s.w);
    maxByH=(hostH-pad)/Math.max(1,s.h);
    hardMax=1.55;
  }else{
    const metaH=92, gap=10;
    maxByW=(hostW-pad)/Math.max(1,s.w);
    maxByH=(hostH-metaH-gap-pad)/Math.max(1,s.h);
    hardMax=1.24;
  }
  const maxZ=Math.max(0.25,Math.min(hardMax,maxByW,maxByH));
  updateZoomSliderMax(maxZ);
  return clamp(Number(($('zoom')&&$('zoom').value)||z),0.25,maxZ);
}

function makeWrapTextInner(id,row,o){
  const c=document.createElement('div');
  c.className='wrapTextInner'+(id==='ROOTSTOCK'?' rootstockInner':'')+(['WO','CROP','INTERNAL','WARNING'].includes(id)?' leftText':'')+(['SCION_ROYALTY','ROOTSTOCK_ROYALTY','LOT','ADDRESS','WARNING'].includes(id)?' smallText':'');
  c.style.fontSize=(o.fontSize||8)+'px';
  c.style.justifyContent=alignH(o.alignH);
  c.style.alignItems=alignV(o.alignV);
  c.style.textAlign=(o.alignH==='left'?'left':o.alignH==='right'?'right':'center');
  c.style.whiteSpace='normal';
  c.style.wordBreak='break-word';
  c.style.overflowWrap='anywhere';
  c.style.lineHeight=(['SCION','ROOTSTOCK'].includes(id)?'.78':'.84');
  if(id==='ROOTSTOCK') c.innerHTML=`<span class="wrapOn">on</span>${escapeHtml(wrapRootstockText(row))}`;
  else c.textContent=wrapObjectText(id,row);
  return c;
}

function autoFitWrapPreview(){
  if(labelType!=='WRAP') return;
  const ranges={
    WO:[13,6.5], CROP:[10,6], INTERNAL:[9,6],
    SCION:[20,4.2], ROOTSTOCK:[20,4.2],
    SCION_ROYALTY:[4.4,2.8], ROOTSTOCK_ROYALTY:[4.4,2.8],
    LOT:[4.2,2.8], ADDRESS:[4.2,2.8], WARNING:[4.2,2.8]
  };
  Object.entries(ranges).forEach(([id,range])=>{
    const obj=document.querySelector(`.obj[data-id="${id}"]`);
    const inner=obj&&obj.querySelector('.wrapTextInner');
    if(!obj||!inner) return;
    inner.style.whiteSpace='normal';
    inner.style.wordBreak='break-word';
    inner.style.overflowWrap='anywhere';
    let fs=range[0], min=range[1], best=min;
    for(; fs>=min; fs-=0.2){
      inner.style.fontSize=fs.toFixed(1)+'px';
      if(inner.scrollWidth<=obj.clientWidth+1 && inner.scrollHeight<=obj.clientHeight+1){ best=fs; break; }
    }
    inner.style.fontSize=best.toFixed(1)+'px';
    if(layout&&layout.objects&&layout.objects[id]) layout.objects[id].fontSize=parseFloat(inner.style.fontSize)||layout.objects[id].fontSize;
  });
}

function isPotHiddenActivity(act){
  const s=String(act||'').toLowerCase().replace(/[^a-z0-9]+/g,' ');
  return s.includes('pre ship sorting') || s.includes('shipping request') || s.includes('propagation material processing');
}

function renderRows(){
  ensureStageShell();
  const q=(($('stageSearch')&&$('stageSearch').value)||($('search')&&$('search').value)||'').toLowerCase();
  if($('search') && $('stageSearch') && $('search').value!==$('stageSearch').value) $('search').value=$('stageSearch').value;
  filteredRows=rows.filter(r=>{
    if(labelType==='POT'){
      if(cleanDisplay(r.scion)) return false;
      if(isPotHiddenActivity(r.act)) return false;
    }
    return Object.values(r).map(cleanDisplay).join(' ').toLowerCase().includes(q);
  });
  if(currentRowIndex>=filteredRows.length) currentRowIndex=0;
  const headerHtml=labelType==='POT'
    ? "<th style='width:17%'>WO</th><th style='width:24%'>Activity</th><th style='width:31%'>Item / Rootstock</th><th style='width:14%'>Color</th><th style='width:9%'>Labels</th><th style='width:5%'></th>"
    : "<th style='width:12%'>WO</th><th style='width:11%'>Crop</th><th style='width:22%'>Scion</th><th style='width:22%'>Rootstock</th><th style='width:11%'>Internal ID</th><th style='width:10%'>Color</th><th style='width:7%'>Labels</th><th style='width:5%'></th>";
  const stageHead=$('stageRowsHead');
  if(stageHead) stageHead.innerHTML=headerHtml;
  const oldHead=document.querySelector('aside.panel .table thead tr');
  if(oldHead) oldHead.innerHTML=headerHtml;
  renderRowBody($('stageRowsBody'));
  renderRowBody($('rowsBody'));
}

function renderAll(){
  applyModeClass();
  removeGitHubWorkflowText();
  ensureModeTabs();
  ensureStageShell();
  hideLegacyDataSections();
  ensureMainLayoutNoOverlap();
  ensureSettingsGroups();
  syncViewportFit();
  updateModeTabs();
  if($('labelType')) $('labelType').value=labelType;
  if($('safeToggle')) $('safeToggle').checked=showSafeZone;
  if($('gridToggle')) $('gridToggle').checked=showGrid;
  renderRows();
  renderCanvas();
  renderObjectPanel();
  syncControls();
  renderPresetList();
  renderQueue();
  updateUndoButtons();
  syncViewportFit();
}

window.addEventListener('resize',()=>{
  syncViewportFit();
  const z=$('zoom');
  if(z) renderCanvas();
});

boot();

/* --------------------------------------------------------------------------
   v7.2.0 override layer
   - pins Objects panel open at the top so it cannot disappear behind grouped tabs
   - sizes the left settings/menu and table/label split to use bottom space cleanly
   - caps the zoom range to the real usable max, so the slider has no dead/blank area
   - gives Wrap Ties more label-preview space and fits/wraps text by default after layout
   -------------------------------------------------------------------------- */
(function injectV720Css(){
  const css = `
    body{overflow:hidden!important}
    .beinvt-main-shell{grid-template-columns:minmax(390px,450px) minmax(0,1fr)!important;gap:10px!important;padding:6px 10px 10px!important;height:calc(100vh - var(--beinvt-top-offset,96px))!important;min-height:0!important;overflow:hidden!important}
    .beinvt-main-shell > aside.panel,.beinvt-left-settings-panel{height:100%!important;max-height:none!important;overflow:auto!important;min-width:0!important;width:100%!important;padding-bottom:10px!important}
    .beinvt-main-shell > .stageWrap,.beinvt-stage-main{height:100%!important;min-height:0!important;overflow:hidden!important}
    #canvasHost{height:100%!important;min-height:0!important;overflow:hidden!important}
    body.beinvt-label-pot #canvasHost{grid-template-columns:minmax(0,1fr) minmax(260px,345px)!important;grid-template-rows:1fr!important}
    body.beinvt-label-wrap #canvasHost{grid-template-columns:1fr!important;grid-template-rows:minmax(0,2fr) minmax(190px,1.35fr)!important}
    body.beinvt-label-wrap #stageDataWrap{height:100%!important;min-height:0!important;max-height:none!important;overflow:hidden!important}
    body.beinvt-label-wrap #stageLabelHost{min-height:190px!important;height:100%!important;align-items:flex-start!important;justify-content:center!important;padding:8px 6px 4px!important;overflow:hidden!important}
    body.beinvt-label-pot #stageDataWrap,body.beinvt-label-pot #stageLabelHost{height:100%!important;min-height:0!important;max-height:none!important;overflow:hidden!important}
    .stageTableScroll{overflow-y:auto!important;overflow-x:hidden!important;min-height:0!important;height:100%!important}
    #stageRowsTable,body.beinvt-label-pot #stageRowsTable,body.beinvt-label-wrap #stageRowsTable{width:100%!important;min-width:0!important;table-layout:fixed!important}
    #stageRowsTable th,#stageRowsTable td{min-width:0!important;max-width:none!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
    body.beinvt-label-wrap .labelPreviewRow{width:100%!important;max-width:100%!important;gap:10px!important;justify-content:center!important;align-items:flex-start!important;overflow:hidden!important}
    body.beinvt-label-wrap .labelPreviewRow .stageMeta{width:255px!important;min-width:235px!important;max-width:255px!important;align-self:flex-start!important;flex:0 0 255px!important}
    body.beinvt-label-pot .labelPreviewRow .stageMeta{width:100%!important;min-width:250px!important;max-width:320px!important;flex:0 0 auto!important}
    .stageMeta .metaPill{min-height:34px!important;padding:8px 10px!important}
    .beinvt-settings-compact .section[data-settings-group].beinvt-pinned-objects-section{display:block!important;visibility:visible!important;opacity:1!important;margin-bottom:10px!important}
    .beinvt-pinned-objects-section{display:block!important;visibility:visible!important;opacity:1!important;border:1px solid rgba(96,165,250,.22)!important;border-radius:12px!important;background:rgba(15,23,42,.55)!important;padding:10px!important}
    .beinvt-pinned-objects-section h2,.beinvt-pinned-objects-section h3,.beinvt-pinned-objects-section h4{margin-top:0!important}
    #objectPanel{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:6px!important;width:100%!important;min-height:48px!important}
    body.beinvt-label-wrap #objectPanel{grid-template-columns:repeat(2,minmax(0,1fr))!important}
    .objectBtn{display:flex!important;flex-direction:column!important;gap:4px!important;align-items:flex-start!important;justify-content:center!important;min-height:42px!important;white-space:normal!important;overflow:hidden!important}
    .objectBtn span:first-child{display:block!important;width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important}
    .objectBtn .badge{max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important}
    .wrapTextInner,.wrapTextInner.rootstockInner{white-space:normal!important;word-break:break-word!important;overflow-wrap:anywhere!important;line-height:.76!important;min-width:0!important;max-width:100%!important;max-height:100%!important;padding:0 1px!important}
    .wrapTextInner.smallText{line-height:.82!important}
    .wrapTextInner.leftText{justify-content:flex-start!important;text-align:left!important}
    .wrapTextInner .wrapOn{white-space:nowrap!important;display:inline!important;font-size:.62em!important;margin-right:.16em!important;text-transform:none!important}
    input#zoom{max-width:160px!important;accent-color:#5b7cfa!important}
    @media(max-width:1180px){.beinvt-main-shell{grid-template-columns:1fr!important;height:auto!important;min-height:0!important;overflow:auto!important}.beinvt-main-shell > aside.panel,.beinvt-left-settings-panel{max-height:340px!important}.beinvt-main-shell > .stageWrap,.beinvt-stage-main{height:calc(100vh - 390px)!important;min-height:540px!important}body.beinvt-label-wrap #canvasHost{grid-template-rows:minmax(240px,2fr) minmax(190px,1.35fr)!important}}
  `;
  const old=document.querySelector('style[data-beinvt-v720-css]');
  if(old) old.remove();
  const tag=document.createElement('style');
  tag.setAttribute('data-beinvt-v720-css','1');
  tag.textContent=css;
  document.head.appendChild(tag);
})();

function fallbackLayout(t){
  if(t==="POT") return {
    name:"Pot Standard restored",
    labelType:"POT",
    safeMarginPx:5,
    gridPx:4,
    objects:{
      WO:{x:3,y:8,w:66,h:18,rot:0,fontSize:16,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      QR:{x:11,y:30,w:50,h:50,rot:0,locked:false,visible:true},
      ITEM:{x:2,y:84,w:68,h:230,rot:90,fontSize:22,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      WEEK:{x:11,y:320,w:50,h:24,rot:0,fontSize:18,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"}
    }
  };
  return {
    name:"Wrap Tie Standard - default fitted individual objects",
    labelType:"WRAP",
    safeMarginPx:3,
    gridPx:4,
    objects:{
      WO_QR:{x:2,y:5,w:38,h:38,rot:0,locked:false,visible:true},
      WO:{x:42,y:2,w:68,h:12,rot:0,fontSize:13,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"left",alignV:"middle"},
      CROP:{x:42,y:15,w:68,h:11,rot:0,fontSize:10,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"left",alignV:"middle"},
      INTERNAL:{x:42,y:29,w:68,h:12,rot:0,fontSize:10,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"left",alignV:"middle"},
      SCION:{x:114,y:1,w:238,h:15,rot:0,fontSize:20,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      SCION_ROYALTY:{x:114,y:16,w:238,h:4,rot:0,fontSize:3.8,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      ROOTSTOCK:{x:114,y:20,w:238,h:16,rot:0,fontSize:20,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      ROOTSTOCK_ROYALTY:{x:114,y:36,w:238,h:4,rot:0,fontSize:3.8,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      LOT:{x:114,y:40,w:238,h:3,rot:0,fontSize:3,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      ADDRESS:{x:114,y:43,w:238,h:4,rot:0,fontSize:3.2,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"center",alignV:"middle"},
      LOT_QR:{x:356,y:6,w:36,h:36,rot:0,locked:false,visible:true},
      LOGO:{x:395,y:13,w:22,h:22,rot:0,locked:false,visible:true},
      WARNING:{x:421,y:2,w:57,h:44,rot:0,fontSize:3.2,fontFamily:"Times New Roman",locked:false,visible:true,alignH:"left",alignV:"middle"}
    }
  };
}

function pinObjectsSection(){
  let panel=document.querySelector('.beinvt-left-settings-panel')||document.querySelector('aside.panel')||document.querySelector('.panel.sidebar')||document.querySelector('.settingsPanel');
  if(!panel) return;
  let objPanel=document.getElementById('objectPanel');
  let objSection=objPanel && objPanel.closest('.section');
  if(!objSection){
    objSection=document.createElement('div');
    objSection.className='section beinvt-created-objects-section';
    objSection.innerHTML='<h3>Objects</h3><div id="objectPanel"></div>';
    const tabs=panel.querySelector('#settingsGroupTabs');
    if(tabs && tabs.nextSibling) panel.insertBefore(objSection,tabs.nextSibling);
    else panel.insertBefore(objSection,panel.firstChild);
    objPanel=document.getElementById('objectPanel');
  }
  objSection.classList.add('beinvt-pinned-objects-section');
  objSection.classList.remove('beinvt-hidden-section');
  objSection.style.display='block';
  objSection.style.visibility='visible';
  objSection.style.opacity='1';
  let heading=objSection.querySelector('h1,h2,h3,h4,.sectionTitle,.title');
  if(!heading){
    heading=document.createElement('h3');
    objSection.insertBefore(heading,objSection.firstChild);
  }
  heading.textContent='Objects';
  const tabs=panel.querySelector('#settingsGroupTabs');
  if(tabs && objSection.previousElementSibling!==tabs){
    panel.insertBefore(objSection,tabs.nextSibling);
  }else if(!tabs && objSection!==panel.firstElementChild){
    panel.insertBefore(objSection,panel.firstChild);
  }
}

function ensureSettingsGroups(){
  hideLegacyDataSections();
  const panel=document.querySelector('.beinvt-left-settings-panel')||document.querySelector('aside.panel')||document.querySelector('.panel.sidebar')||document.querySelector('.settingsPanel');
  if(!panel) return;
  let sections=[];
  try{ sections=[...panel.querySelectorAll(':scope > .section')]; }catch(e){ sections=[...panel.querySelectorAll('.section')].filter(sec=>sec.parentElement===panel); }
  sections=sections.filter(sec=>!isLegacyDataSection(sec)&&sec.style.display!=="none"&&!sec.classList.contains('beinvt-legacy-data-section')&&!sec.querySelector('#stageRowsTable')&&!sec.closest('#canvasHost'));
  if(sections.length<1) return;
  panel.classList.add('beinvt-settings-compact');
  let tabs=panel.querySelector('#settingsGroupTabs');
  if(!tabs){
    tabs=document.createElement('div');
    tabs.id='settingsGroupTabs';
    tabs.className='settingsGroupTabs';
    panel.insertBefore(tabs,sections[0]);
  }
  tabs.innerHTML='';
  const titles=sections.map((sec,idx)=>settingsSectionTitle(sec,idx));
  sections.forEach((sec,idx)=>{
    sec.dataset.settingsGroup=String(idx);
    sec.dataset.settingsTitle=titles[idx];
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='settingsGroupTab';
    btn.dataset.settingsGroup=String(idx);
    btn.textContent=titles[idx];
    btn.onclick=()=>activateSettingsGroup(idx);
    tabs.appendChild(btn);
  });
  const savedRaw=localStorage.getItem('beinvtSettingsGroup');
  const saved=savedRaw==null?NaN:Number(savedRaw);
  const target=(Number.isFinite(saved)&&saved>=0&&saved<sections.length)?saved:0;
  activateSettingsGroup(target);
  pinObjectsSection();
}

function updateZoomSliderMax(maxZ){
  const z=$('zoom');
  if(!z) return;
  const safeMax=Math.max(0.25,Number(maxZ)||1);
  z.min='0.25';
  z.max=safeMax.toFixed(2);
  z.step='0.01';
  if(!Number.isFinite(Number(z.value)) || Number(z.value)>safeMax) z.value=safeMax.toFixed(2);
  z.title=`Zoom max is ${safeMax.toFixed(2)} so the slider has no dead area.`;
}

function effectiveStageZoom(requested,s,labelHost){
  let z=Number(requested||1);
  if(!isFinite(z)||z<=0) z=1;
  syncViewportFit();
  const hostW=Math.max(1,(labelHost&&labelHost.clientWidth)||window.innerWidth||900);
  const hostH=Math.max(1,(labelHost&&labelHost.clientHeight)||window.innerHeight||500);
  const pad=20;
  let maxByW, maxByH, hardMax;
  if(labelType==='WRAP'){
    const metaW=265, gap=12;
    maxByW=(hostW-metaW-gap-pad)/Math.max(1,s.w);
    maxByH=(hostH-pad)/Math.max(1,s.h);
    hardMax=1.75;
  }else{
    const metaH=92, gap=10;
    maxByW=(hostW-pad)/Math.max(1,s.w);
    maxByH=(hostH-metaH-gap-pad)/Math.max(1,s.h);
    hardMax=1.28;
  }
  const maxZ=Math.max(0.25,Math.min(hardMax,maxByW,maxByH));
  updateZoomSliderMax(maxZ);
  const slider=$('zoom');
  const sliderValue=slider?Number(slider.value):z;
  return clamp(Number.isFinite(sliderValue)?sliderValue:z,0.25,maxZ);
}

function makeWrapTextInner(id,row,o){
  const c=document.createElement('div');
  c.className='wrapTextInner'+(id==='ROOTSTOCK'?' rootstockInner':'')+(['WO','CROP','INTERNAL','WARNING'].includes(id)?' leftText':'')+(['SCION_ROYALTY','ROOTSTOCK_ROYALTY','LOT','ADDRESS','WARNING'].includes(id)?' smallText':'');
  c.style.fontSize=(o.fontSize||8)+'px';
  c.style.justifyContent=alignH(o.alignH);
  c.style.alignItems=alignV(o.alignV);
  c.style.textAlign=(o.alignH==='left'?'left':o.alignH==='right'?'right':'center');
  c.style.whiteSpace='normal';
  c.style.wordBreak='break-word';
  c.style.overflowWrap='anywhere';
  c.style.maxWidth='100%';
  c.style.maxHeight='100%';
  c.style.lineHeight=(['SCION','ROOTSTOCK'].includes(id)?'.76':'.82');
  if(id==='ROOTSTOCK') c.innerHTML=`<span class="wrapOn">on</span>${escapeHtml(wrapRootstockText(row))}`;
  else c.textContent=wrapObjectText(id,row);
  return c;
}

function fitOneWrapObject(id,range){
  const obj=document.querySelector(`.obj[data-id="${id}"]`);
  const inner=obj&&obj.querySelector('.wrapTextInner');
  if(!obj||!inner) return;
  inner.style.whiteSpace='normal';
  inner.style.wordBreak='break-word';
  inner.style.overflowWrap='anywhere';
  inner.style.maxWidth='100%';
  inner.style.maxHeight='100%';
  let fs=range[0], min=range[1], best=min;
  // Start at the largest size and shrink only until both width and height fit.
  for(; fs>=min; fs-=0.1){
    inner.style.fontSize=fs.toFixed(1)+'px';
    // Force layout read.
    const fits=inner.scrollWidth<=obj.clientWidth+1 && inner.scrollHeight<=obj.clientHeight+1;
    if(fits){ best=fs; break; }
  }
  inner.style.fontSize=best.toFixed(1)+'px';
  if(layout&&layout.objects&&layout.objects[id]) layout.objects[id].fontSize=parseFloat(inner.style.fontSize)||layout.objects[id].fontSize;
}

function autoFitWrapPreview(){
  if(labelType!=='WRAP') return;
  const ranges={
    WO:[14,5.8], CROP:[11,5.5], INTERNAL:[10.5,5.5],
    SCION:[24,4.0], ROOTSTOCK:[24,4.0],
    SCION_ROYALTY:[4.8,2.2], ROOTSTOCK_ROYALTY:[4.8,2.2],
    LOT:[4.0,2.0], ADDRESS:[4.0,2.0], WARNING:[3.6,1.8]
  };
  Object.entries(ranges).forEach(([id,range])=>fitOneWrapObject(id,range));
}

function scheduleWrapAutoFit(){
  if(labelType!=='WRAP') return;
  requestAnimationFrame(()=>{
    autoFitWrapPreview();
    requestAnimationFrame(()=>autoFitWrapPreview());
  });
}

function syncViewportFit(){
  const shell=document.querySelector('.beinvt-main-shell');
  if(!shell) return;
  const top=Math.max(0,Math.round(shell.getBoundingClientRect().top));
  const h=Math.max(560,Math.round(window.innerHeight-top-8));
  document.body.style.setProperty('--beinvt-top-offset', top+'px');
  shell.style.height=h+'px';
  shell.style.minHeight='0';
  const stage=document.querySelector('.beinvt-stage-main,.stageWrap');
  if(stage){ stage.style.height='100%'; stage.style.minHeight='0'; }
}

(function installV720RuntimeFixes(){
  const previousRenderCanvas=renderCanvas;
  renderCanvas=function(){
    previousRenderCanvas();
    pinObjectsSection();
    scheduleWrapAutoFit();
  };
  const previousRenderObjectPanel=renderObjectPanel;
  renderObjectPanel=function(){
    pinObjectsSection();
    previousRenderObjectPanel();
    pinObjectsSection();
  };
  requestAnimationFrame(()=>{
    ensureMainLayoutNoOverlap();
    ensureSettingsGroups();
    pinObjectsSection();
    renderObjectPanel();
    scheduleWrapAutoFit();
    const z=$('zoom');
    if(z) renderCanvas();
  });
})();


/* --------------------------------------------------------------------------
   v7.3.0 final override layer
   Fixes requested in latest notes:
   - removes dead zoom-slider range by syncing slider max to the actual usable zoom
   - centers Wrap Tie label preview lower in its preview area
   - increases Wrap Tie render table height by about 25% from v7.2
   - keeps Objects always visible at the top of the left menu
   - adds Activity Code, Scion Patent, Rootstock Patent to Wrap Tie render table
   - hides Center H/V/Both and compacts guide/snap controls into rows/two columns
   -------------------------------------------------------------------------- */
(function injectV730Css(){
  const old=document.querySelector('style[data-beinvt-v730-css]');
  if(old) old.remove();
  const css = `
    body{overflow:hidden!important}
    .beinvt-main-shell{grid-template-columns:minmax(430px,510px) minmax(0,1fr)!important;gap:10px!important;padding:6px 10px 10px!important;height:calc(100vh - var(--beinvt-top-offset,96px))!important;min-height:0!important;overflow:hidden!important}
    .beinvt-main-shell > aside.panel,.beinvt-left-settings-panel{height:100%!important;max-height:none!important;overflow:auto!important;min-width:0!important;width:100%!important;padding-bottom:10px!important}
    .beinvt-main-shell > .stageWrap,.beinvt-stage-main{height:100%!important;min-height:0!important;overflow:hidden!important}
    #canvasHost{height:100%!important;min-height:0!important;overflow:hidden!important;display:grid!important;gap:10px!important}
    body.beinvt-label-pot #canvasHost{grid-template-columns:minmax(0,1fr) minmax(260px,345px)!important;grid-template-rows:1fr!important}
    body.beinvt-label-wrap #canvasHost{grid-template-columns:1fr!important;grid-template-rows:minmax(0,2.5fr) minmax(172px,1fr)!important}
    #stageDataWrap{height:100%!important;min-height:0!important;max-height:none!important;overflow:hidden!important}
    body.beinvt-label-wrap #stageDataWrap{height:100%!important;min-height:0!important;max-height:none!important;overflow:hidden!important}
    body.beinvt-label-wrap #stageLabelHost{height:100%!important;min-height:172px!important;align-items:center!important;justify-content:center!important;padding:14px 6px 6px!important;overflow:hidden!important}
    body.beinvt-label-wrap #stageLabelHost .stageStack{justify-content:center!important;align-items:center!important;height:100%!important}
    body.beinvt-label-wrap .labelPreviewRow{width:100%!important;max-width:100%!important;gap:10px!important;justify-content:center!important;align-items:center!important;overflow:hidden!important}
    body.beinvt-label-wrap .labelPreviewRow .stageMeta{width:240px!important;min-width:220px!important;max-width:240px!important;align-self:center!important;flex:0 0 240px!important}
    body.beinvt-label-pot #stageDataWrap,body.beinvt-label-pot #stageLabelHost{height:100%!important;min-height:0!important;max-height:none!important;overflow:hidden!important}
    body.beinvt-label-pot .labelPreviewRow .stageMeta{width:100%!important;min-width:250px!important;max-width:320px!important;flex:0 0 auto!important}
    .stageTableScroll{overflow-y:auto!important;overflow-x:hidden!important;min-height:0!important;height:100%!important}
    #stageRowsTable,body.beinvt-label-pot #stageRowsTable,body.beinvt-label-wrap #stageRowsTable{width:100%!important;min-width:0!important;table-layout:fixed!important}
    #stageRowsTable th,#stageRowsTable td{min-width:0!important;max-width:none!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;padding-left:7px!important;padding-right:7px!important}
    body.beinvt-label-wrap #stageRowsTable th,body.beinvt-label-wrap #stageRowsTable td{font-size:11px!important;padding-left:5px!important;padding-right:5px!important}
    .stageMeta .metaPill{min-height:34px!important;padding:8px 10px!important}

    .beinvt-pinned-objects-section{display:block!important;visibility:visible!important;opacity:1!important;border:1px solid rgba(96,165,250,.35)!important;border-radius:12px!important;background:rgba(15,23,42,.82)!important;padding:10px!important;margin:0 0 10px 0!important;position:relative!important;z-index:80!important;max-height:270px!important;overflow:auto!important}
    .beinvt-pinned-objects-section h2,.beinvt-pinned-objects-section h3,.beinvt-pinned-objects-section h4{margin:0 0 8px 0!important;color:#fff!important;font-size:15px!important;letter-spacing:.02em!important}
    .beinvt-settings-compact .section[data-settings-group].beinvt-pinned-objects-section,.beinvt-settings-compact .beinvt-pinned-objects-section.beinvt-hidden-section{display:block!important;visibility:visible!important;opacity:1!important}
    #objectPanel{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:6px!important;width:100%!important;min-height:52px!important}
    body.beinvt-label-wrap #objectPanel{grid-template-columns:repeat(2,minmax(0,1fr))!important}
    .objectBtn{display:flex!important;flex-direction:column!important;gap:4px!important;align-items:flex-start!important;justify-content:center!important;min-height:42px!important;white-space:normal!important;overflow:hidden!important;border-radius:10px!important}
    .objectBtn span:first-child{display:block!important;width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important;line-height:1.08!important}
    .objectBtn .badge{max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:10px!important}

    #centerH,#centerV,#centerBoth{display:none!important}
    .beinvt-guide-toggles{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important;margin:8px 0!important}
    .beinvt-guide-toggles > *,.beinvt-guide-numbers > *{min-width:0!important}
    .beinvt-guide-numbers{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;margin:8px 0!important}
    .beinvt-control-card{border:1px solid rgba(255,255,255,.12)!important;border-radius:10px!important;background:rgba(255,255,255,.04)!important;padding:8px!important;display:flex!important;align-items:center!important;gap:7px!important;min-height:36px!important;overflow:hidden!important}
    .beinvt-control-card input[type='number'],.beinvt-control-card input[type='text']{width:100%!important;min-width:0!important}
    .settingsGroupTabs{display:flex!important;flex-wrap:wrap!important;gap:6px!important;margin:0 0 10px 0!important;padding:8px!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:12px!important;background:rgba(15,23,42,.95)!important;position:relative!important;top:auto!important;z-index:40!important}
    .settingsGroupTab{border:1px solid rgba(255,255,255,.16)!important;border-radius:999px!important;background:rgba(255,255,255,.05)!important;color:#e5e7eb!important;padding:7px 10px!important;font-size:12px!important;font-weight:800!important;cursor:pointer!important;max-width:170px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
    .settingsGroupTab.active{border-color:#60a5fa!important;background:rgba(96,165,250,.22)!important;color:#fff!important}
    .beinvt-settings-compact .section[data-settings-group].beinvt-hidden-section:not(.beinvt-pinned-objects-section){display:none!important}
    .beinvt-settings-compact .section[data-settings-group]{margin-bottom:10px!important;position:relative!important;z-index:1!important}

    .wrapTextInner,.wrapTextInner.rootstockInner{white-space:normal!important;word-break:break-word!important;overflow-wrap:anywhere!important;line-height:.74!important;min-width:0!important;max-width:100%!important;max-height:100%!important;padding:0 1px!important;box-sizing:border-box!important}
    .wrapTextInner.smallText{line-height:.80!important}
    .wrapTextInner.leftText{justify-content:flex-start!important;text-align:left!important}
    .wrapTextInner .wrapOn{white-space:nowrap!important;display:inline!important;font-size:.62em!important;margin-right:.16em!important;text-transform:none!important}
    input#zoom{max-width:210px!important;min-width:150px!important;accent-color:#5b7cfa!important}
    @media(max-width:1180px){.beinvt-main-shell{grid-template-columns:1fr!important;height:auto!important;min-height:0!important;overflow:auto!important}.beinvt-main-shell > aside.panel,.beinvt-left-settings-panel{max-height:380px!important}.beinvt-main-shell > .stageWrap,.beinvt-stage-main{height:calc(100vh - 430px)!important;min-height:560px!important}body.beinvt-label-wrap #canvasHost{grid-template-rows:minmax(300px,2.5fr) minmax(170px,1fr)!important}}
  `;
  const tag=document.createElement('style');
  tag.setAttribute('data-beinvt-v730-css','1');
  tag.textContent=css;
  document.head.appendChild(tag);
})();

function panelHost(){
  return document.querySelector('.beinvt-left-settings-panel') || document.querySelector('aside.panel') || document.querySelector('.panel.sidebar') || document.querySelector('.settingsPanel');
}
function hasAnyId(sec,ids){
  return !!(sec && ids.some(id=>sec.querySelector('#'+id)));
}
function isLegacyDataSection(sec){
  return !!(sec && (sec.querySelector('#rowsBody') || sec.querySelector('#stageRowsTable') || sec.closest('#canvasHost')));
}
function hideLegacyDataSections(){
  document.querySelectorAll('.section').forEach(sec=>{
    if(isLegacyDataSection(sec)){
      sec.classList.add('beinvt-legacy-data-section');
      sec.style.display='none';
    }
  });
}
function fieldForControl(id){
  const el=$(id);
  if(!el) return null;
  return el.closest('label') || el.closest('.field') || el.closest('.control') || el.closest('.formRow') || el.closest('.row') || el.parentElement;
}
function makeControlCard(node){
  if(!node || node.classList.contains('beinvt-control-card')) return node;
  node.classList.add('beinvt-control-card');
  return node;
}
function ensureGuideControlLayout(){
  const panel=panelHost();
  if(!panel) return;
  let guideSec=[...panel.querySelectorAll('.section')].find(sec=>hasAnyId(sec,['safeToggle','gridToggle','snapToggle','snapGridToggle','gridPx','snapPx','safeMargin']));
  if(!guideSec){
    guideSec=document.createElement('div');
    guideSec.className='section';
    guideSec.innerHTML='<h3>Guides & Snap</h3>';
    panel.appendChild(guideSec);
  }
  let h=guideSec.querySelector('h1,h2,h3,h4,.sectionTitle,.title');
  if(!h){ h=document.createElement('h3'); guideSec.insertBefore(h,guideSec.firstChild); }
  h.textContent='Guides & Snap';
  let toggles=guideSec.querySelector('#beinvtGuideToggles');
  if(!toggles){
    toggles=document.createElement('div');
    toggles.id='beinvtGuideToggles';
    toggles.className='beinvt-guide-toggles';
    h.insertAdjacentElement('afterend',toggles);
  }
  ['gridToggle','snapToggle','snapGridToggle'].forEach(id=>{
    const field=fieldForControl(id);
    if(field) toggles.appendChild(makeControlCard(field));
  });
  let nums=guideSec.querySelector('#beinvtGuideNumbers');
  if(!nums){
    nums=document.createElement('div');
    nums.id='beinvtGuideNumbers';
    nums.className='beinvt-guide-numbers';
    toggles.insertAdjacentElement('afterend',nums);
  }
  ['gridPx','snapPx'].forEach(id=>{
    const field=fieldForControl(id);
    if(field) nums.appendChild(makeControlCard(field));
  });
  ['centerH','centerV','centerBoth'].forEach(id=>{ const el=$(id); if(el) el.style.display='none'; });
}
function settingsSectionTitle(sec,idx){
  if(!sec) return `Settings ${idx+1}`;
  if(sec.classList.contains('beinvt-pinned-objects-section') || hasAnyId(sec,['objectPanel','selectedName'])) return 'Objects';
  if(hasAnyId(sec,['x','y','w','h','rot','fontSize'])) return 'Position & Size';
  if(hasAnyId(sec,['safeToggle','gridToggle','gridPx','safeMargin','snapToggle','snapPx','snapGridToggle'])) return 'Guides & Snap';
  if(hasAnyId(sec,['queueList','addCurrent','clearQueue','printQueue'])) return 'Queue & Print';
  if(hasAnyId(sec,['presetSelect','savePreset','loadPreset','deletePreset','layoutJson','exportLayout','importLayout','downloadLayout','resetLayout'])) return 'Presets & Layout';
  if(hasAnyId(sec,['printCalibration','saveCalibration','measuredW','measuredH','calStatus'])) return 'Calibration';
  if(hasAnyId(sec,['testMode','printLabel'])) return 'Actions';
  const heading=sec.querySelector('h1,h2,h3,h4,.sectionTitle,.title');
  const raw=(heading&&heading.textContent)||sec.getAttribute('aria-label')||'';
  const cleaned=String(raw||'').trim().replace(/settings\s*\d+/ig,'').replace(/\s+/g,' ');
  const fallbacks=['General','Position & Size','Guides & Snap','Presets & Layout','Queue & Print','Calibration','Actions','Advanced'];
  return cleaned ? cleaned.slice(0,32) : (fallbacks[idx] || 'More Options');
}
function activateSettingsGroup(idx){
  const tabs=document.querySelectorAll('.settingsGroupTab[data-settings-group]');
  const secs=document.querySelectorAll('.section[data-settings-group]');
  tabs.forEach(t=>t.classList.toggle('active',t.dataset.settingsGroup===String(idx)));
  secs.forEach(sec=>{
    if(sec.classList.contains('beinvt-pinned-objects-section')){
      sec.classList.remove('beinvt-hidden-section');
      sec.style.display='block';
      return;
    }
    sec.classList.toggle('beinvt-hidden-section',sec.dataset.settingsGroup!==String(idx));
  });
  localStorage.setItem('beinvtSettingsGroup',String(idx));
}
function pinObjectsSection(){
  const panel=panelHost();
  if(!panel) return;
  let objPanel=document.getElementById('objectPanel');
  let objSection=objPanel && objPanel.closest('.section');
  if(!objSection){
    objSection=document.createElement('div');
    objSection.className='section beinvt-created-objects-section';
    objSection.innerHTML='<h3>Objects</h3><div id="objectPanel"></div>';
    objPanel=objSection.querySelector('#objectPanel');
  }
  objSection.classList.add('beinvt-pinned-objects-section');
  objSection.classList.remove('beinvt-hidden-section');
  objSection.removeAttribute('data-settings-group');
  objSection.style.display='block';
  objSection.style.visibility='visible';
  objSection.style.opacity='1';
  let heading=objSection.querySelector('h1,h2,h3,h4,.sectionTitle,.title');
  if(!heading){
    heading=document.createElement('h3');
    objSection.insertBefore(heading,objSection.firstChild);
  }
  heading.textContent='Objects';
  if(objSection.parentElement!==panel || panel.firstElementChild!==objSection){
    panel.insertBefore(objSection,panel.firstElementChild);
  }
}
function ensureSettingsGroups(){
  hideLegacyDataSections();
  const panel=panelHost();
  if(!panel) return;
  pinObjectsSection();
  ensureGuideControlLayout();
  let sections=[];
  try{ sections=[...panel.querySelectorAll(':scope > .section')]; }
  catch(e){ sections=[...panel.querySelectorAll('.section')].filter(sec=>sec.parentElement===panel); }
  const objSection=panel.querySelector('.beinvt-pinned-objects-section');
  sections=sections.filter(sec=>sec!==objSection && !isLegacyDataSection(sec) && sec.style.display!=='none' && !sec.classList.contains('beinvt-legacy-data-section') && !sec.querySelector('#stageRowsTable') && !sec.closest('#canvasHost'));
  panel.classList.add('beinvt-settings-compact');
  let tabs=panel.querySelector('#settingsGroupTabs');
  if(!tabs){
    tabs=document.createElement('div');
    tabs.id='settingsGroupTabs';
    tabs.className='settingsGroupTabs';
  }
  if(objSection && tabs.previousElementSibling!==objSection){
    panel.insertBefore(tabs,objSection.nextSibling);
  }else if(!objSection && panel.firstElementChild!==tabs){
    panel.insertBefore(tabs,panel.firstChild);
  }
  tabs.innerHTML='';
  sections.forEach((sec,idx)=>{
    sec.dataset.settingsGroup=String(idx);
    const title=settingsSectionTitle(sec,idx);
    sec.dataset.settingsTitle=title;
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='settingsGroupTab';
    btn.dataset.settingsGroup=String(idx);
    btn.textContent=title;
    btn.onclick=()=>activateSettingsGroup(idx);
    tabs.appendChild(btn);
  });
  const saved=Number(localStorage.getItem('beinvtSettingsGroup')||0);
  const target=(Number.isFinite(saved)&&saved>=0&&saved<sections.length)?saved:0;
  if(sections.length) activateSettingsGroup(target);
  pinObjectsSection();
}

function updateZoomSliderMax(maxZ){
  const z=$('zoom');
  if(!z) return;
  const safeMax=Math.max(0.35,Number(maxZ)||1);
  const current=Number(z.value);
  z.min='0.35';
  z.max=safeMax.toFixed(2);
  z.step='0.01';
  if(!Number.isFinite(current) || current>safeMax) z.value=safeMax.toFixed(2);
  if(Number(z.value)<0.35) z.value='0.35';
  z.title=`Usable zoom range: 0.35 to ${safeMax.toFixed(2)}`;
}
function effectiveStageZoom(requested,s,labelHost){
  let z=Number(requested||1);
  if(!isFinite(z)||z<=0) z=1;
  syncViewportFit();
  const hostW=Math.max(1,(labelHost&&labelHost.clientWidth)||window.innerWidth||900);
  const hostH=Math.max(1,(labelHost&&labelHost.clientHeight)||window.innerHeight||500);
  let maxByW, maxByH, hardMax;
  if(labelType==='WRAP'){
    const metaW=245, gap=10, pad=16;
    maxByW=(hostW-metaW-gap-pad)/Math.max(1,s.w);
    maxByH=(hostH-20)/Math.max(1,s.h);
    hardMax=2.35;
  }else{
    const metaH=92, gap=10, pad=18;
    maxByW=(hostW-pad)/Math.max(1,s.w);
    maxByH=(hostH-metaH-gap-pad)/Math.max(1,s.h);
    hardMax=1.45;
  }
  const maxZ=Math.max(0.35,Math.min(hardMax,maxByW,maxByH));
  updateZoomSliderMax(maxZ);
  const slider=$('zoom');
  const sliderValue=slider?Number(slider.value):z;
  return clamp(Number.isFinite(sliderValue)?sliderValue:z,0.35,maxZ);
}
function normalizeZoomSliderNow(){
  const z=$('zoom');
  if(!z) return;
  const s=sizePx();
  const host=$('stageLabelHost') || document.body;
  effectiveStageZoom(Number(z.value)||1,s,host);
}

function cellText(v){ return escapeHtml(capClean(v)); }
function blockedPotActivity(act){
  return /pre[-\s]*ship\s*sorting|shipping\s*request|propagation\s*material\s*processing/i.test(String(act||''));
}
function buildRowHtml(r){
  if(labelType==='POT'){
    return `<td>${cellText(r.wo)}</td><td>${cellText(r.act)}</td><td>${cellText(derivedRootstock(r)||displayPotItem(r)||'')}</td><td>${cellText(r.labelColor)}</td><td>${escapeHtml(displayLabelsNeeded(r))}</td><td><button>Add</button></td>`;
  }
  return `<td>${cellText(r.wo)}</td><td>${cellText(r.act)}</td><td>${cellText(r.crop)}</td><td>${cellText(wrapScionText(r))}</td><td>${cellText(wrapRootstockText(r))}</td><td>${cellText(r.scionPatent)}</td><td>${cellText(r.rootstockPatent)}</td><td>${cellText(r.internalId)}</td><td>${cellText(r.labelColor)}</td><td>${escapeHtml(displayLabelsNeeded(r))}</td><td><button>Add</button></td>`;
}
function renderRows(){
  ensureStageShell();
  const q=((($('stageSearch')&&$('stageSearch').value)||($('search')&&$('search').value)||'')+'').toLowerCase();
  if($('search') && $('stageSearch') && $('search').value!==$('stageSearch').value) $('search').value=$('stageSearch').value;
  filteredRows=rows.filter(r=>{
    if(labelType==='POT'){
      if(cleanDisplay(r.scion)) return false;
      if(blockedPotActivity(r.act)) return false;
    }
    return Object.values(r).join(' ').toLowerCase().includes(q);
  });
  if(currentRowIndex>=filteredRows.length) currentRowIndex=0;
  const headerHtml=labelType==='POT'
    ? "<th style='width:16%'>WO</th><th style='width:26%'>Activity</th><th style='width:30%'>Item / Rootstock</th><th style='width:14%'>Color</th><th style='width:9%'>Labels</th><th style='width:5%'></th>"
    : "<th style='width:9%'>WO</th><th style='width:12%'>Activity</th><th style='width:9%'>Crop</th><th style='width:14%'>Scion</th><th style='width:14%'>Rootstock</th><th style='width:10%'>Scion Patent</th><th style='width:10%'>Rootstock Patent</th><th style='width:8%'>Internal ID</th><th style='width:6%'>Color</th><th style='width:5%'>Labels</th><th style='width:3%'></th>";
  const stageHead=$('stageRowsHead');
  if(stageHead) stageHead.innerHTML=headerHtml;
  const oldHead=document.querySelector('aside.panel .table thead tr');
  if(oldHead) oldHead.innerHTML=headerHtml;
  renderRowBody($('stageRowsBody'));
  renderRowBody($('rowsBody'));
}

function fitOneWrapObject(id,range){
  const obj=document.querySelector(`.obj[data-id="${id}"]`);
  const inner=obj&&obj.querySelector('.wrapTextInner');
  if(!obj||!inner) return;
  inner.style.whiteSpace='normal';
  inner.style.wordBreak='break-word';
  inner.style.overflowWrap='anywhere';
  inner.style.maxWidth='100%';
  inner.style.maxHeight='100%';
  inner.style.boxSizing='border-box';
  let fs=range[0], min=range[1], best=min;
  for(; fs>=min; fs-=0.1){
    inner.style.fontSize=fs.toFixed(1)+'px';
    const fits=inner.scrollWidth<=obj.clientWidth+1 && inner.scrollHeight<=obj.clientHeight+1;
    if(fits){ best=fs; break; }
  }
  inner.style.fontSize=best.toFixed(1)+'px';
  if(layout&&layout.objects&&layout.objects[id]) layout.objects[id].fontSize=parseFloat(inner.style.fontSize)||layout.objects[id].fontSize;
}
function autoFitWrapPreview(){
  if(labelType!=='WRAP') return;
  const ranges={
    WO:[14,5.8], CROP:[11,5.5], INTERNAL:[10.5,5.5],
    SCION:[25,4.0], ROOTSTOCK:[25,4.0],
    SCION_ROYALTY:[4.8,2.1], ROOTSTOCK_ROYALTY:[4.8,2.1],
    LOT:[4.2,2.0], ADDRESS:[4.2,2.0], WARNING:[3.6,1.7]
  };
  Object.entries(ranges).forEach(([id,range])=>fitOneWrapObject(id,range));
}
function scheduleWrapAutoFit(){
  if(labelType!=='WRAP') return;
  requestAnimationFrame(()=>{
    autoFitWrapPreview();
    requestAnimationFrame(()=>{
      autoFitWrapPreview();
      setTimeout(autoFitWrapPreview,80);
      setTimeout(autoFitWrapPreview,200);
    });
  });
}

(function installV730RuntimeFixes(){
  const prevRenderCanvas=renderCanvas;
  renderCanvas=function(){
    prevRenderCanvas();
    pinObjectsSection();
    ensureGuideControlLayout();
    normalizeZoomSliderNow();
    scheduleWrapAutoFit();
  };
  const prevRenderObjectPanel=renderObjectPanel;
  renderObjectPanel=function(){
    pinObjectsSection();
    prevRenderObjectPanel();
    pinObjectsSection();
  };
  const prevRenderAll=renderAll;
  renderAll=function(){
    prevRenderAll();
    pinObjectsSection();
    ensureSettingsGroups();
    renderObjectPanel();
    normalizeZoomSliderNow();
    scheduleWrapAutoFit();
  };
  window.addEventListener('resize',()=>{ syncViewportFit(); normalizeZoomSliderNow(); renderCanvas(); });
  requestAnimationFrame(()=>{
    syncViewportFit();
    pinObjectsSection();
    ensureSettingsGroups();
    renderObjectPanel();
    renderRows();
    normalizeZoomSliderNow();
    scheduleWrapAutoFit();
  });
})();
