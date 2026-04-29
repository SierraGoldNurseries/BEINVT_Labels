const APP_VERSION = "8.6.56_no_gaps_into_item_names";
const WRAP_QR_BALANCE_VERSION = "8.6.56";
const INCH = 96;
const LABEL_SIZES = {
  POT: { widthIn: 0.75, heightIn: 5 },
  WRAP: { widthIn: 5, heightIn: 0.75 },
  FIELD: { widthIn: 5, heightIn: 0.75 },
  SHIP: { widthIn: 5, heightIn: 0.75 }
};
const BASE_LABEL_SIZES = {
  POT: { widthIn: 0.75, heightIn: 5 },
  WRAP: { widthIn: 5, heightIn: 0.5 },
  FIELD: { widthIn: 5, heightIn: 0.5 },
  SHIP: { widthIn: 5, heightIn: 0.5 }
};
const LABEL_SIZE_PRESET_CONFIG = {
  storageKey: "beinvtLabelSizePresetPrefs_v8641",
  potWidthPresets: [0.5, 0.75, 1],
  wrapHeightPresets: [0.5, 0.75, 1]
};
const SG_LOGO_URL = "https://11150895.app.netsuite.com/core/media/media.nl?id=154769&c=11150895&h=gz_jC4_Zsi8evEFt-sGPjDNJhRvthM-3uNCqvPr8uc5CrgD1&fcts=20251229204334&whence=";
const GENEVA_SG_LOGO_URL = "https://11150895.app.netsuite.com/core/media/media.nl?id=260263&c=11150895&h=NMkHvroppy8Yi93204J1rZiq_7V-dJBmcFNuScfEc2hRzqB9";
const GENEVA_LOGO_SHIFT_Y = -1;

// Easy adjustment config for Finished Trees + Field Labels.
// Change these values at the top when you want to move/resize the SG logo
// or adjust the Label Color / Qty row below the label preview.
const WRAP_LIKE_PREVIEW_CONFIG = {
  logoX: 390,
  logoY: 4,
  logoWidth: 30,
  logoHeight: 50,
  fieldRowX: 0,
  fieldRowTextAlign: "left",
  metaBelowLabel: true,
  metaScaleWithZoom: true,
  metaMinScale: 0.72,
  metaMaxScale: 1.35,
  metaGapPx: 6,
  metaBelowHeightPx: 44,
  // Center keeps Finished Trees / Field / Shipping zoom-out anchored in the middle.
  // Use "left" only if you intentionally want the label preview locked to the left edge.
  previewAlign: "center",
  // Keep the label color/qty row glued to the label width when objects pane is hidden/shown.
  metaLockToLabelWidth: true
};

// Shared color config for ALL templates: Pot Stakes, Finished Trees, Field Labels, Shipping Labels.
// Matches the NetSuite Label Color list exactly, in list order.
// key = normalized NetSuite list value, label = display value, bg = label pill background, fg = text color.
const LABEL_COLOR_CONFIG = {
  "APPLE GREEN": { label: "Apple Green", bg: "#8db600", fg: "#111827" },
  "BLUE": { label: "Blue", bg: "#3b82f6", fg: "#ffffff" },
  "BROWN": { label: "Brown", bg: "#92400e", fg: "#ffffff" },
  "CORAL": { label: "Coral", bg: "#ff7f50", fg: "#111827" },
  "DARK BLUE": { label: "Dark Blue", bg: "#1e3a8a", fg: "#ffffff" },
  "DARK GREEN": { label: "Dark Green", bg: "#166534", fg: "#ffffff" },
  "DARK PURPLE": { label: "Dark Purple", bg: "#581c87", fg: "#ffffff" },
  "FUCHSIA": { label: "Fuchsia", bg: "#ff00ff", fg: "#111827" },
  "GOLD": { label: "Gold", bg: "#d4af37", fg: "#111827" },
  "GREY": { label: "Grey", bg: "#9ca3af", fg: "#111827" },
  "HOT PINK": { label: "Hot Pink", bg: "#ff69b4", fg: "#111827" },
  "LAVENDER": { label: "Lavender", bg: "#c4b5fd", fg: "#111827" },
  "LILAC": { label: "Lilac", bg: "#d8b4fe", fg: "#111827" },
  "LIME": { label: "Lime", bg: "#84cc16", fg: "#111827" },
  "MINT": { label: "Mint", bg: "#98ff98", fg: "#111827" },
  "ORANGE": { label: "Orange", bg: "#fb923c", fg: "#111827" },
  "PINK": { label: "Pink", bg: "#ec4899", fg: "#111827" },
  "RED": { label: "Red", bg: "#ef4444", fg: "#ffffff" },
  "TAN": { label: "Tan", bg: "#d2b48c", fg: "#111827" },
  "TURQUOISE": { label: "Turquoise", bg: "#40e0d0", fg: "#111827" },
  "WHITE": { label: "White", bg: "#ffffff", fg: "#111827" },
  "YELLOW": { label: "Yellow", bg: "#facc15", fg: "#111827" }
};

const LABEL_COLOR_ALIASES = {
  "GRAY": "GREY",
  "APPLEGREEN": "APPLE GREEN",
  "DARKBLUE": "DARK BLUE",
  "DARKGREEN": "DARK GREEN",
  "DARKPURPLE": "DARK PURPLE",
  "HOTPINK": "HOT PINK"
};

const OUTER_CARD_EXTRA_WIDTH = 0;
const TABLE_CARD_WIDTH_EXTRA_BY_LABEL = { POT: 196, WRAP: 194, FIELD: 194, SHIP: 194 }; // reference: target missing width; actual layout now fills to top menu right edge
const DEBUG_LAYER_LABELS_DEFAULT = false;

// UI theme config. Default is dark; the top-bar switch toggles light mode.
const UI_THEME_CONFIG = {
  storageKey: "beinvtUiTheme",
  defaultTheme: "dark",
  lightEmoji: "☀️",
  darkEmoji: "🌙"
};

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
  - v8.6.18: add topbar/left-panel toggles for object guide lines and hiding the left pane; hidden pane lets A use full T width.
  - v8.6.19: hide-pane toggle now hides only the real left object/settings pane (.beinvtSettingsPanel), never table/label cards.
  - v8.6.20: stop using body.beinvt-left-pane-hidden; remove stale broad hide CSS and hide only .beinvtSettingsPanel directly.
  - v8.6.21: when objects pane is hidden, move stageWrap to a fixed full-width stage below the topbar so table/label cannot be squeezed by the old left-column flex layout.
  - v8.6.22: wrap ties for olives/berries render scion-only center text; rootstock/on text is suppressed. Stage transform correction is disabled for stable table position.
  - v8.6.23: add Field Labels mode next to Finished Trees; Field uses Wrap layout with Row text instead of left WO QR and table filtered to Field Planting activities.
  - v8.6.24: stage is fixed beside the objects pane so the table cannot overlap it; Field Row marker uses a taller box with smaller upright portrait text.
  - v8.6.25: Field left object is renamed Row; Row text prints as one sideways word instead of stacked R/O/W.
  - v8.6.26: Field Row default X is -2; Finished Trees/Field SG Logo height is 50; left pane height is synced to the right stage bottom.
  - v8.6.27: Finished Trees/Field SG Logo defaults to x=390 and width=30; Field Row object can use negative X values.
  - v8.6.28: Field Row no longer allows negative X; Row text is left-aligned inside the Row object instead.
  - v8.6.29: Finished Trees/Field Labels show Label Color + Qty below the label and scale that meta row with zoom; top config controls logo/meta defaults.
  - v8.6.30: Wrap-like preview is left-aligned again when meta pills sit below the label; Shipping Labels mode reads BEINVT - Items.csv and shows CN/QS/Liner/Bud rows only.
  - v8.6.31: Shipping Labels hides WO/Lot objects, shifts logo + warning left, removes Qty pill, cleans topbar helper text, and avoids duplicate single-line scion/rootstock rendering.
  - v8.6.32: Adds one shared label-color config for all templates, aligns Shipping label color bar to the label width, and centers wrap-like zoom out behavior.
  - v8.6.37: Label color config now matches the NetSuite list exactly and preserves title-case display names.
  - v8.6.46: Removed Lock / Visible checkboxes from Position / Size; object card lock/eye icons now control those states.
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
  shiftRightFromLeftPanel: false,
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
  applyTo: ["POT", "WRAP", "FIELD"]
};
const LAYER_DEBUG_CONFIG = {
  enabled: false,
  movable: true,
  rememberPosition: true,
  defaultLeft: 18,
  defaultTop: 70,
  showShortcut: true
};

(function cleanupOldLeftPaneHideCssV8620(){
  try {
    if (document.body) document.body.classList.remove("beinvt-left-pane-hidden");
    document.querySelectorAll([
      'style[data-beinvt-v8618-guide-left-pane-toggle-css]',
      'style[data-beinvt-v8619-hide-objects-pane-only-css]',
      'style[data-beinvt-v8620-hide-objects-pane-direct-css]',
      'style[data-beinvt-v8621-hidden-pane-fixed-stage-css]'
    ].join(',')).forEach(el => el.remove());
    document.querySelectorAll('style').forEach(el => {
      const txt = String(el.textContent || '');
      if (txt.includes('body.beinvt-left-pane-hidden aside.panel') || txt.includes('body.beinvt-left-pane-hidden .panel.sidebar')) el.remove();
    });
  } catch (e) {}
})();
const WRAP_ADDRESS = "SIERRA GOLD NURSERIES YUBA CITY, CA 95991";
const WRAP_WARNING = "WARNING: ASEXUAL\nREPRODUCTION OF SCIONS,\nBUDS, OR CUTTINGS\nWHETHER FOR SALE\nOR OWN USE IS\nPROHIBITED UNDER\nU.S. PLANT PATENT LAWS.\nSALES OUTSIDE THE\nU.S. ARE PROHIBITED.";

const POT_OBJECT_ORDER = ["WO", "QR", "ITEM", "WEEK"];
const WRAP_OBJECT_ORDER = [
  "WO_QR", "WO", "CROP", "INTERNAL", "SCION", "SCION_PATENT", "ROOTSTOCK",
  "ROOTSTOCK_PATENT", "LOT", "ADDRESS", "LOT_QR", "LOGO", "WARNING"
];
const SHIPPING_OBJECT_ORDER = [
  "WO_QR", "CROP", "INTERNAL", "SCION", "SCION_PATENT", "ROOTSTOCK",
  "ROOTSTOCK_PATENT", "ADDRESS", "LOGO", "WARNING"
];
const IMAGE_OBJECT_IDS = new Set(["QR", "WO_QR", "LOT_QR", "LOGO"]);
const POT_EXCLUDED_ACTIVITIES = [
  /pre[-\s]*ship\s+sorting/i,
  /shipping\s+request/i,
  /propagation\s+material\s+processing/i
];

let DEFAULT_LAYOUTS = {};
let labelType = "POT";
let uiTheme = (localStorage.getItem(UI_THEME_CONFIG.storageKey) || UI_THEME_CONFIG.defaultTheme || "dark").toLowerCase() === "light" ? "light" : "dark";
let rows = [];
let filteredRows = [];
let labelRows = [];
let itemRows = [];
let currentRowIndex = 0;
let selectedId = "ITEM";
let layout = null;
let showSafeZone = true;
let showGrid = false;
let showObjectGuides = readJson("beinvtShowObjectGuides", true) !== false;
let leftPaneHidden = readJson("beinvtLeftPaneHidden", false) === true;
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
function readLabelSizePrefs() {
  try {
    const raw = localStorage.getItem(LABEL_SIZE_PRESET_CONFIG.storageKey);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}
function writeLabelSizePrefs(prefs) {
  try { localStorage.setItem(LABEL_SIZE_PRESET_CONFIG.storageKey, JSON.stringify(prefs || {})); } catch (e) {}
}
function normalizeInchesValue(v, fallback, min = 0.2, max = 12) {
  const n = Number(String(v ?? "").replace(/[^0-9.]/g, ""));
  const f = Number(fallback || 1);
  const raw = Number.isFinite(n) && n > 0 ? n : f;
  return Number(Math.max(min, Math.min(max, raw)).toFixed(2));
}
function labelSizeInches(type = labelType) {
  const base = LABEL_SIZES[type] || LABEL_SIZES.POT;
  const prefs = readLabelSizePrefs();
  const pref = prefs[type] || {};
  return {
    widthIn: normalizeInchesValue(pref.widthIn ?? pref.width, base.widthIn),
    heightIn: normalizeInchesValue(pref.heightIn ?? pref.height, base.heightIn)
  };
}
function saveLabelSizeInches(type, size) {
  const prefs = readLabelSizePrefs();
  const base = LABEL_SIZES[type] || LABEL_SIZES.POT;
  prefs[type] = {
    widthIn: normalizeInchesValue(size && size.widthIn, base.widthIn),
    heightIn: normalizeInchesValue(size && size.heightIn, base.heightIn)
  };
  writeLabelSizePrefs(prefs);
}
function baseLabelSizeInches(type = labelType) {
  return clone(BASE_LABEL_SIZES[type] || BASE_LABEL_SIZES.POT);
}
function labelSizeScaleFactors(type = labelType) {
  const base = baseLabelSizeInches(type);
  const cur = labelSizeInches(type);
  return {
    sx: cur.widthIn / Math.max(0.01, base.widthIn),
    sy: cur.heightIn / Math.max(0.01, base.heightIn),
    current: cur,
    base
  };
}
function formatPresetInches(v) {
  const n = Number(v || 0);
  return Number.isFinite(n) ? n.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1") : "";
}
function isQrSizeProtectedObject(id, type = labelType) {
  if (type === "FIELD" && id === "WO_QR") return false;
  return id === "QR" || id === "WO_QR" || id === "LOT_QR";
}
function scaleObjectNumber(v, factor, min = 0) {
  const n = Number(v || 0) * Number(factor || 1);
  return Math.max(min, Number(n.toFixed(1)));
}
function scaleLayoutForLabelSize(layoutObj, type, oldSize, newSize) {
  if (!layoutObj || !layoutObj.objects || !oldSize || !newSize) return layoutObj;
  const sx = normalizeInchesValue(newSize.widthIn, 1) / Math.max(0.01, normalizeInchesValue(oldSize.widthIn, 1));
  const sy = normalizeInchesValue(newSize.heightIn, 1) / Math.max(0.01, normalizeInchesValue(oldSize.heightIn, 1));
  if (!Number.isFinite(sx) || !Number.isFinite(sy) || sx <= 0 || sy <= 0) return layoutObj;
  const fontScale = type === "POT" ? sx : sy;
  Object.entries(layoutObj.objects).forEach(([id, o]) => {
    if (!o) return;
    o.x = scaleObjectNumber(o.x, sx, 0);
    o.y = scaleObjectNumber(o.y, sy, 0);
    if (isQrSizeProtectedObject(id, type)) {
      // QR codes must remain square. Pot presets change width, so QR size follows width.
      // Wrap-like presets only change height, so QR dimensions stay square and non-stretched.
      const sideScale = type === "POT" ? sx : Math.min(sx, sy);
      const oldSide = Math.max(4, Math.min(Number(o.w || 34), Number(o.h || 34)));
      const side = Math.max(12, Number((oldSide * sideScale).toFixed(1)));
      o.w = side;
      o.h = side;
    } else {
      o.w = scaleObjectNumber(o.w, sx, 4);
      o.h = scaleObjectNumber(o.h, sy, 4);
    }
    if (Number.isFinite(Number(o.fontSize)) && Number(o.fontSize) > 0) {
      o.fontSize = Number(Math.max(1.5, Number(o.fontSize) * fontScale).toFixed(1));
    }
  });
  layoutObj.safeMarginPx = scaleObjectNumber(layoutObj.safeMarginPx || 0, Math.min(sx, sy), 0);
  layoutObj.gridPx = Math.max(1, Math.round(Number(layoutObj.gridPx || 4) * Math.min(sx, sy)));
  layoutObj.snapPx = Math.max(1, Math.round(Number(layoutObj.snapPx || 5) * Math.min(sx, sy)));
  layoutObj.labelSize = clone(newSize);
  return layoutObj;
}
function scaleDefaultLayoutForCurrentSize(layoutObj, type) {
  const current = labelSizeInches(type);
  const base = baseLabelSizeInches(type);
  layoutObj.labelSize = clone(current);
  return scaleLayoutForLabelSize(layoutObj, type, base, current);
}
function wrapLikeQrBalanceKey(size) {
  const widthIn = formatPresetInches(size && size.widthIn);
  const heightIn = formatPresetInches(size && size.heightIn);
  return `${WRAP_QR_BALANCE_VERSION}|${widthIn}x${heightIn}`;
}
function wrapLikeQrSidePx(labelHeightPx, type, role) {
  const h = Math.max(36, Number(labelHeightPx || 48));
  // v8.6.54: use almost the full wrap-like label height so QR boxes print larger and less blurry.
  // The QR image itself now uses a high-resolution SVG with a tiny quiet zone, so the visible code
  // fills the object box instead of leaving the large white border seen before.
  const ratio = role === "single" ? 0.94 : 0.92;
  const preferred = Math.round(h * ratio);
  return clamp(preferred, 38, Math.max(38, Math.round(h - 4)));
}
function setWrapDefaultFont(o, id, px) {
  if (!o || !o[id] || o[id].manualFontSize) return;
  o[id].fontSize = Number(Math.max(2, px).toFixed(1));
}
function stackLeftInfoObjects(o, type, labelH, leftX, leftW, margin, gap, sy) {
  const ids = type === "SHIP" ? ["CROP", "INTERNAL"] : ["WO", "CROP", "INTERNAL"];
  const top = margin;
  // v8.6.55: keep the WO/Crop/Internal ID blocks tight so the left border sits
  // directly against the QR box and the vertical space can be used for larger text.
  const stackGap = Math.max(0, Math.round(0.6 * sy));
  const availableH = Math.max(12, labelH - (margin * 2) - (stackGap * Math.max(0, ids.length - 1)));
  const weights = ids.length === 2 ? [0.50, 0.50] : [0.35, 0.30, 0.35];
  let y = top;
  ids.forEach((id, idx) => {
    if (!o[id]) return;
    const last = idx === ids.length - 1;
    const h = last ? Math.max(4, labelH - margin - y) : Math.max(4, Math.round(availableH * weights[idx]));
    o[id].x = leftX;
    o[id].y = y;
    o[id].w = leftW;
    o[id].h = h;
    o[id].alignH = "left";
    o[id].alignV = "middle";
    y += h + stackGap;
  });
  if (o.WO && type === "SHIP") { o.WO.y = 0; o.WO.h = 0; }
  setWrapDefaultFont(o, "WO", 17.4 * sy);
  setWrapDefaultFont(o, "CROP", (type === "SHIP" ? 16.2 : 15.8) * sy);
  setWrapDefaultFont(o, "INTERNAL", (type === "SHIP" ? 17.2 : 16.8) * sy);
}
function rebalanceWrapLikeQrLayout(layoutObj, type) {
  if (!layoutObj || !layoutObj.objects || !isWrapLikeMode(type)) return layoutObj;
  const size = layoutObj.labelSize || labelSizeInches(type);
  const labelW = Math.round(normalizeInchesValue(size && size.widthIn, 5) * INCH);
  const labelH = Math.round(normalizeInchesValue(size && size.heightIn, 0.75) * INCH);
  const sx = labelW / Math.max(1, 5 * INCH);
  const sy = labelH / Math.max(1, 0.5 * INCH);
  const o = layoutObj.objects;
  const margin = Math.max(2, Math.round(2 * Math.min(sx, sy)));
  const gap = Math.max(2, Math.round(3 * Math.min(sx, sy)));
  const centerX = Math.round((type === "FIELD" ? 118 : 124) * sx);

  const logoW = Math.max(Math.round(30 * sx), Math.round(28 * Math.min(sx, sy)));
  const warningW = Math.max(Math.round(58 * sx), Math.round(54 * sx));
  if (o.LOGO) {
    o.LOGO.x = Math.max(centerX + 142, Math.round(labelW - warningW - logoW - gap - margin));
    o.LOGO.y = margin;
    o.LOGO.w = logoW;
    o.LOGO.h = Math.max(20, labelH - (margin * 2));
  }
  if (o.WARNING) {
    o.WARNING.x = Math.min(labelW - margin - 34, Math.round(Number((o.LOGO && o.LOGO.x) || (labelW - warningW - margin)) + Number((o.LOGO && o.LOGO.w) || logoW) + gap));
    o.WARNING.y = margin;
    o.WARNING.w = Math.max(34, labelW - o.WARNING.x - margin);
    o.WARNING.h = Math.max(20, labelH - (margin * 2));
  }

  const rightAnchor = Math.max(centerX + 135, Math.min(
    Number((o.LOGO && o.LOGO.x) || (labelW - warningW - logoW - gap - margin)),
    Number((o.WARNING && o.WARNING.x) || (labelW - warningW - margin))
  ));

  if (o.WO_QR && type === "FIELD") {
    o.WO_QR.x = margin;
    o.WO_QR.y = margin;
    o.WO_QR.w = Math.max(22, Math.round(28 * sx));
    o.WO_QR.h = Math.max(34, labelH - (margin * 2));
    if (!o.WO_QR.manualFontSize) o.WO_QR.fontSize = Number(Math.max(10, 13.5 * sy).toFixed(1));
  } else if (o.WO_QR && o.WO_QR.visible !== false) {
    const side = wrapLikeQrSidePx(labelH, type, type === "SHIP" ? "single" : "left");
    o.WO_QR.w = side;
    o.WO_QR.h = side;
    o.WO_QR.x = margin;
    o.WO_QR.y = Math.max(0, Math.round((labelH - side) / 2));
  }

  if (o.LOT_QR && type !== "SHIP" && o.LOT_QR.visible !== false) {
    const side = wrapLikeQrSidePx(labelH, type, type === "FIELD" ? "single" : "right");
    o.LOT_QR.w = side;
    o.LOT_QR.h = side;
    o.LOT_QR.x = Math.max(centerX + Math.round(112 * sx), Math.round(rightAnchor - gap - side));
    o.LOT_QR.y = Math.max(0, Math.round((labelH - side) / 2));
  }

  const leftTextStart = o.WO_QR && type !== "FIELD" && o.WO_QR.visible !== false
    ? Math.round(Number(o.WO_QR.x || 0) + Number(o.WO_QR.w || 0))
    : Math.round(Number((o.WO_QR && o.WO_QR.x) || margin) + Number((o.WO_QR && o.WO_QR.w) || (34 * sx)));
  // v8.6.56: no gap between the WO/Crop/Internal ID block and the item-name block.
  // The right border of the left info block now touches the left border of Scion/Rootstock.
  const leftTextWidth = Math.max(32, centerX - leftTextStart);
  stackLeftInfoObjects(o, type, labelH, leftTextStart, leftTextWidth, margin, gap, sy);

  const rightTextEdge = o.LOT_QR && type !== "SHIP" && o.LOT_QR.visible !== false
    // v8.6.56: item-name block touches the lot QR block on the right with no gap.
    ? Math.max(centerX + Math.round(100 * sx), Math.round(Number(o.LOT_QR.x || rightAnchor)))
    : Math.round(rightAnchor);
  const centerWidth = Math.max(110, rightTextEdge - centerX);
  ["SCION", "SCION_PATENT", "ROOTSTOCK", "ROOTSTOCK_PATENT", "LOT", "ADDRESS"].forEach(id => {
    if (!o[id]) return;
    o[id].x = centerX;
    o[id].w = centerWidth;
  });
  setWrapDefaultFont(o, "SCION", 22.5 * sy);
  setWrapDefaultFont(o, "ROOTSTOCK", 22.5 * sy);
  setWrapDefaultFont(o, "SCION_PATENT", 5.2 * sy);
  setWrapDefaultFont(o, "ROOTSTOCK_PATENT", 5.0 * sy);
  setWrapDefaultFont(o, "LOT", 6.6 * sy);
  setWrapDefaultFont(o, "ADDRESS", 5.1 * sy);
  setWrapDefaultFont(o, "WARNING", 3.65 * sy);

  layoutObj.__wrapQrBalanceKey = wrapLikeQrBalanceKey(size);
  return layoutObj;
}
function enforceWrapQrTextClearance(row) {
  if (!layout || !layout.objects || !isWrapLikeMode(labelType)) return;
  // applyWrapDataAwareStack rebuilds the scion/rootstock stack every render.
  // Re-apply QR clearance after that stack so big QR codes never overlap the names.
  rebalanceWrapLikeQrLayout(layout, labelType);
  const o = layout.objects;
  const gap = Math.max(2, Math.round(2 * Math.min(labelSizeScaleFactors(labelType).sx, labelSizeScaleFactors(labelType).sy)));
  const leftFlushGap = 0;
  const leftQr = o.WO_QR && labelType !== "FIELD" && shouldRenderObject("WO_QR", row) ? o.WO_QR : null;
  const rightQr = o.LOT_QR && labelType !== "SHIP" && shouldRenderObject("LOT_QR", row) ? o.LOT_QR : null;
  if (leftQr) {
    const minLeft = Math.round(Number(leftQr.x || 0) + Number(leftQr.w || 0) + leftFlushGap);
    ["WO", "CROP", "INTERNAL"].forEach(id => {
      if (!o[id]) return;
      const oldRight = Number(o[id].x || 0) + Number(o[id].w || 0);
      o[id].x = minLeft;
      o[id].w = Math.max(24, oldRight - minLeft);
    });
  }
  if (rightQr) {
    // v8.6.56: keep item names flush against the right-side lot QR box.
    const maxRight = Math.max(20, Math.round(Number(rightQr.x || 0)));
    ["SCION", "SCION_PATENT", "ROOTSTOCK", "ROOTSTOCK_PATENT", "LOT", "ADDRESS"].forEach(id => {
      if (!o[id]) return;
      o[id].w = Math.max(36, maxRight - Number(o[id].x || 0));
    });
  }
  clampAllObjects();
}
function wrapVerticalScale(type = labelType) {
  const base = baseLabelSizeInches(type);
  const cur = labelSizeInches(type);
  return cur.heightIn / Math.max(0.01, base.heightIn);
}
function wrapBasePx(v, type = labelType) {
  return Number((Number(v || 0) * wrapVerticalScale(type)).toFixed(1));
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
function isWrapLikeMode(type = labelType) {
  return type === "WRAP" || type === "FIELD" || type === "SHIP";
}
function isFieldMode(type = labelType) {
  return type === "FIELD";
}
function isShippingMode(type = labelType) {
  return type === "SHIP";
}
function isFieldPlantingRow(row) {
  return /^field\s+planting\b/i.test(cleanDisplay(row && row.act));
}
function objectOrder(type = labelType) {
  if (isShippingMode(type)) return SHIPPING_OBJECT_ORDER;
  return isWrapLikeMode(type) ? WRAP_OBJECT_ORDER : POT_OBJECT_ORDER;
}
function defaultSelectedId(type = labelType) {
  return isWrapLikeMode(type) ? "SCION" : "ITEM";
}
function isImageObject(id) {
  if (isFieldMode() && id === "WO_QR") return false;
  return IMAGE_OBJECT_IDS.has(id);
}
function sizePx(type = labelType) {
  const s = labelSizeInches(type);
  return { w: Math.round(s.widthIn * INCH), h: Math.round(s.heightIn * INCH) };
}

(function resetOldBrokenWorkingLayouts() {
  if (localStorage.getItem("beinvtAppVersion") !== APP_VERSION) {
    localStorage.removeItem("beinvtWorkingLayout_POT");
    localStorage.removeItem("beinvtWorkingLayout_WRAP");
    localStorage.removeItem("beinvtWorkingLayout_FIELD");
    localStorage.removeItem("beinvtWorkingLayout_SHIP");
    // Clear old debug-forced A sizes so the new 5% height trim and right-shift logic can apply.
    localStorage.removeItem("beinvtOuterCardDebugWidth_v8615");
    localStorage.removeItem("beinvtOuterCardDebugHeight_v8615");
    localStorage.removeItem("beinvtOuterCardDebugWidth_v8615");
    localStorage.removeItem("beinvtOuterCardDebugHeight_v8615");
    localStorage.removeItem("beinvtDebugLayerManualSizes");
    localStorage.removeItem("beinvtLayerManualSizes_v8612");
    localStorage.removeItem("beinvtLayerManualSizes_v8615");
    localStorage.removeItem("beinvtLayerManualSizes_v8616");
    // Remove the laggy free-form print size/orientation prefs from the abandoned v8.6.39/v8.6.40 path.
    // v8.6.41 uses simple, fixed presets only.
    localStorage.removeItem("beinvtPrintSizePrefs_v8640");
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

    aside.panel,.panel.sidebar,.settingsPanel{height:var(--beinvt-left-pane-height,1177px)!important;min-height:0!important;max-height:var(--beinvt-left-pane-height,1177px)!important;overflow:auto!important;background:#121429!important;border-right:1px solid rgba(255,255,255,.14)!important;width:730px!important;min-width:730px!important;max-width:730px!important;flex:0 0 730px!important}
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
    .sizePresetBtn.active{border-color:#22c55e!important;background:rgba(34,197,94,.20)!important;color:#dcfce7!important}
    body.beinvt-light-theme .sizePresetBtn.active{background:#dcfce7!important;border-color:#16a34a!important;color:#064e3b!important}
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
    .obj[data-id="QR"] img,.obj[data-id="WO_QR"] img,.obj[data-id="LOT_QR"] img{object-fit:fill!important}
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
      height:var(--beinvt-left-pane-height,1177px)!important;
      min-height:var(--beinvt-left-pane-height,1177px)!important;
      max-height:var(--beinvt-left-pane-height,1177px)!important;
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

(function injectGuideAndLeftPaneToggleV8618Css(){
  const css = `
    /* v8.6.18: hide yellow object guide lines and support full-width mode when left pane is hidden. */
    .modeTab.utilityTab{
      margin-left:4px!important;
      padding:7px 11px!important;
      border-radius:999px!important;
      white-space:nowrap!important;
    }
    .modeTab.utilityTab.good{
      border-color:#22c55e!important;
      background:rgba(34,197,94,.18)!important;
      color:#dcfce7!important;
    }
    body.beinvt-hide-object-guides .labelCanvas .obj{
      border-color:transparent!important;
      background:transparent!important;
      box-shadow:none!important;
    }
    body.beinvt-hide-object-guides .labelCanvas .obj.selected{
      border-color:transparent!important;
      background:transparent!important;
      box-shadow:none!important;
      outline:none!important;
    }
    body.beinvt-hide-object-guides .labelCanvas .obj.selected .handle{
      display:none!important;
    }
    body.beinvt-hide-object-guides .labelCanvas .safeZone,
    body.beinvt-hide-object-guides .labelCanvas .gridOverlay,
    body.beinvt-hide-object-guides .labelCanvas .guide{
      display:none!important;
    }
    /*
      v8.6.20: hide ONLY the real objects/settings pane.
      Do NOT use body.beinvt-left-pane-hidden or broad aside/.panel selectors;
      older versions used that broad class and it could affect table/label wrappers.
    */
    body.beinvt-objects-pane-hidden .beinvtSettingsPanel{
      display:none!important;
      visibility:hidden!important;
      width:0!important;
      min-width:0!important;
      max-width:0!important;
      flex:0 0 0px!important;
      flex-basis:0!important;
      padding:0!important;
      margin:0!important;
      border:0!important;
      overflow:hidden!important;
      pointer-events:none!important;
    }
    body.beinvt-objects-pane-hidden .stageWrap{
      margin-left:0!important;
    }
    body.beinvt-objects-pane-hidden .stageWrap,
    body.beinvt-objects-pane-hidden #canvasHost,
    body.beinvt-objects-pane-hidden #stageDataWrap,
    body.beinvt-objects-pane-hidden #stageLabelHost,
    body.beinvt-objects-pane-hidden .stageStack,
    body.beinvt-objects-pane-hidden .labelPreviewRow{
      display:flex!important;
      visibility:visible!important;
      opacity:1!important;
    }
    body.beinvt-objects-pane-hidden #stageDataWrap{
      flex:1 1 auto!important;
      min-width:0!important;
      max-width:none!important;
    }
  `;
  const tag = document.createElement("style");
  tag.setAttribute("data-beinvt-v8620-hide-objects-pane-direct-css", "1");
  tag.textContent = css;
  document.head.appendChild(tag);
})();

(function injectHiddenPaneFixedStageV8621Css(){
  const css = `
    /* v8.6.21: Hide Objects Pane should only hide the left objects/settings pane.
       The render stage is taken out of the old left-column flex layout and fixed
       under the top controls so the table/label cannot collapse or get squeezed. */
    body.beinvt-objects-pane-hidden{overflow:hidden!important}
    body.beinvt-objects-pane-hidden .beinvtSettingsPanel{
      display:none!important;visibility:hidden!important;width:0!important;min-width:0!important;max-width:0!important;
      flex:0 0 0px!important;flex-basis:0!important;padding:0!important;margin:0!important;border:0!important;
      overflow:hidden!important;pointer-events:none!important
    }
    body.beinvt-objects-pane-hidden .stageWrap{
      position:fixed!important;
      left:var(--beinvt-hidden-stage-left,0px)!important;
      top:var(--beinvt-hidden-stage-top,56px)!important;
      width:var(--beinvt-hidden-stage-width,calc(100vw - 4px))!important;
      min-width:var(--beinvt-hidden-stage-width,calc(100vw - 4px))!important;
      max-width:var(--beinvt-hidden-stage-width,calc(100vw - 4px))!important;
      height:var(--beinvt-hidden-stage-height,calc(100vh - 64px))!important;
      min-height:var(--beinvt-hidden-stage-height,calc(100vh - 64px))!important;
      max-height:var(--beinvt-hidden-stage-height,calc(100vh - 64px))!important;
      transform:none!important;margin:0!important;z-index:20!important;display:flex!important;visibility:visible!important;opacity:1!important;
      flex:0 0 var(--beinvt-hidden-stage-width,calc(100vw - 4px))!important;flex-basis:var(--beinvt-hidden-stage-width,calc(100vw - 4px))!important;
      box-sizing:border-box!important;overflow:hidden!important
    }
    body.beinvt-objects-pane-hidden #canvasHost{
      width:100%!important;min-width:0!important;max-width:100%!important;height:100%!important;min-height:0!important;max-height:100%!important;
      display:flex!important;visibility:visible!important;opacity:1!important;overflow:hidden!important;align-items:stretch!important;justify-content:stretch!important
    }
    body.beinvt-objects-pane-hidden.beinvt-label-pot #canvasHost{flex-direction:row!important}
    body.beinvt-objects-pane-hidden.beinvt-label-wrap #canvasHost{flex-direction:column!important}
    body.beinvt-objects-pane-hidden #stageDataWrap,
    body.beinvt-objects-pane-hidden #stageLabelHost,
    body.beinvt-objects-pane-hidden .stageStack,
    body.beinvt-objects-pane-hidden .labelPreviewRow{
      display:flex!important;visibility:visible!important;opacity:1!important
    }
    body.beinvt-objects-pane-hidden #stageDataWrap{min-width:0!important;max-width:none!important;overflow:hidden!important}
    body.beinvt-objects-pane-hidden.beinvt-label-pot #stageDataWrap{flex:1 1 auto!important;width:auto!important;height:100%!important}
    body.beinvt-objects-pane-hidden.beinvt-label-pot #stageLabelHost{flex:0 0 360px!important;width:360px!important;min-width:360px!important;max-width:360px!important;height:100%!important}
    body.beinvt-objects-pane-hidden.beinvt-label-wrap #stageDataWrap{width:100%!important;max-width:none!important;flex:0 0 clamp(390px,54vh,700px)!important}
    body.beinvt-objects-pane-hidden.beinvt-label-wrap #stageLabelHost{width:100%!important;max-width:none!important;flex:1 1 auto!important}
  `;
  const tag = document.createElement("style");
  tag.setAttribute("data-beinvt-v8621-hidden-pane-fixed-stage-css", "1");
  tag.textContent = css;
  document.head.appendChild(tag);
})();

(function injectStableStageAndFieldRowV8624Css(){
  const css = `
    /* v8.6.24: Keep render table/label stage outside the old flex flow so it cannot overlap the objects pane. */
    body.beinvt-stage-fixed .stageWrap{position:fixed!important;left:var(--beinvt-stage-fixed-left,730px)!important;top:var(--beinvt-stage-fixed-top,56px)!important;width:var(--beinvt-stage-fixed-width,1600px)!important;min-width:var(--beinvt-stage-fixed-width,1600px)!important;max-width:var(--beinvt-stage-fixed-width,1600px)!important;height:var(--beinvt-stage-fixed-height,1100px)!important;min-height:var(--beinvt-stage-fixed-height,1100px)!important;max-height:var(--beinvt-stage-fixed-height,1100px)!important;transform:none!important;margin:0!important;z-index:20!important;display:flex!important;visibility:visible!important;opacity:1!important;box-sizing:border-box!important;overflow:hidden!important;flex:0 0 var(--beinvt-stage-fixed-width,1600px)!important;flex-basis:var(--beinvt-stage-fixed-width,1600px)!important}
    body.beinvt-stage-fixed #canvasHost{width:100%!important;min-width:0!important;max-width:100%!important;height:100%!important;min-height:0!important;max-height:100%!important;display:flex!important;visibility:visible!important;opacity:1!important;overflow:hidden!important;align-items:stretch!important;justify-content:stretch!important}
    body.beinvt-stage-fixed.beinvt-label-pot #canvasHost{flex-direction:row!important}
    body.beinvt-stage-fixed.beinvt-label-wrap #canvasHost{flex-direction:column!important}
    body.beinvt-stage-fixed #stageDataWrap,body.beinvt-stage-fixed #stageLabelHost{display:flex!important;visibility:visible!important;opacity:1!important}
    body.beinvt-stage-fixed #stageDataWrap{min-width:0!important;max-width:none!important;overflow:hidden!important}
    body.beinvt-stage-fixed.beinvt-label-pot #stageDataWrap{flex:1 1 auto!important;width:auto!important;height:100%!important}
    body.beinvt-stage-fixed.beinvt-label-pot #stageLabelHost{flex:0 0 360px!important;width:360px!important;min-width:360px!important;max-width:360px!important;height:100%!important}
    body.beinvt-stage-fixed.beinvt-label-wrap #stageDataWrap{width:100%!important;max-width:none!important;flex:0 0 clamp(390px,54vh,700px)!important}
    body.beinvt-stage-fixed.beinvt-label-wrap #stageLabelHost{width:100%!important;max-width:none!important;flex:1 1 auto!important}
    .fieldRowText{font-size:13px!important;line-height:1!important;letter-spacing:0!important;padding:2px 0 0 0!important;writing-mode:horizontal-tb!important;text-orientation:mixed!important;transform:rotate(-90deg)!important;white-space:nowrap!important;overflow:visible!important;text-align:left!important}
  `;
  const tag = document.createElement("style");
  tag.setAttribute("data-beinvt-v8624-stable-stage-field-row-css", "1");
  tag.textContent = css;
  document.head.appendChild(tag);
})();

(function injectMetaBelowFinishedFieldV8629Css(){
  const css = `
    /* v8.6.32: Label Color / Qty sit under wrap-like labels at the exact label width. The whole preview group stays centered while zooming out. */
    body.beinvt-label-wrap #stageLabelHost{
      align-items:center!important;
      justify-content:center!important;
    }
    body.beinvt-label-wrap #stageLabelHost .stageStack{
      width:100%!important;
      max-width:100%!important;
      align-items:center!important;
      justify-content:flex-start!important;
    }
    body.beinvt-label-wrap .labelPreviewRow.wrapPreviewRow{
      flex-direction:column!important;
      gap:var(--beinvt-wrap-meta-gap,6px)!important;
      align-items:center!important;
      justify-content:center!important;
      width:100%!important;
      max-width:100%!important;
      overflow:visible!important;
    }
    body.beinvt-label-wrap .stageMeta.stageMetaBelowLabel{
      width:auto!important;
      min-width:0!important;
      max-width:none!important;
      flex:0 0 auto!important;
      flex-direction:row!important;
      align-items:stretch!important;
      justify-content:stretch!important;
      align-self:center!important;
      gap:6px!important;
      padding:5px!important;
      border-radius:12px!important;
      transform-origin:top center!important;
      will-change:transform!important;
    }
    body.beinvt-label-wrap .stageMeta.stageMetaBelowLabel .metaPill{
      flex:1 1 0!important;
      min-width:0!important;
      justify-content:space-between!important;
      padding:5px 7px!important;
      font-size:11px!important;
      line-height:1.05!important;
      border-radius:9px!important;
    }
    body.beinvt-label-wrap .stageMeta.stageMetaBelowLabel b{
      font-size:12px!important;
    }
  `;
  const tag = document.createElement("style");
  tag.setAttribute("data-beinvt-v8629-meta-below-finished-field-css", "1");
  tag.textContent = css;
  document.head.appendChild(tag);
})();

(function injectThemeAndAlignedMetaV8633Css(){
  const css = `
    /* v8.6.33 theme switch + fixed wrap-like preview/meta alignment. */
    .beinvtThemeSwitch{
      position:relative!important;display:inline-flex!important;align-items:center!important;gap:6px!important;
      width:58px!important;height:28px!important;padding:2px!important;border-radius:999px!important;
      border:1px solid rgba(255,255,255,.26)!important;background:#0b1024!important;color:#fff!important;
      box-shadow:inset 0 0 0 1px rgba(255,255,255,.04),0 2px 10px rgba(0,0,0,.24)!important;
      cursor:pointer!important;vertical-align:middle!important;overflow:hidden!important;
    }
    .beinvtThemeSwitch .trackEmoji{position:absolute!important;z-index:1!important;font-size:13px!important;line-height:1!important;opacity:.75!important;top:7px!important}
    .beinvtThemeSwitch .moon{left:8px!important}.beinvtThemeSwitch .sun{right:8px!important}
    .beinvtThemeSwitch .knob{
      position:absolute!important;z-index:2!important;left:3px!important;top:3px!important;width:22px!important;height:22px!important;
      border-radius:999px!important;background:#111827!important;color:#facc15!important;display:flex!important;align-items:center!important;justify-content:center!important;
      font-size:12px!important;box-shadow:0 2px 8px rgba(0,0,0,.45)!important;transition:transform .18s ease,background .18s ease,color .18s ease!important;
    }
    .beinvtThemeSwitch.light{background:#e5e7eb!important;border-color:rgba(17,24,39,.20)!important;color:#111827!important}
    .beinvtThemeSwitch.light .knob{transform:translateX(30px)!important;background:#ffffff!important;color:#eab308!important}
    body.beinvt-light-theme{background:#f4f7fb!important;color:#111827!important}
    body.beinvt-light-theme .topbar,body.beinvt-light-theme .toolbar,body.beinvt-light-theme header{background:#ffffff!important;color:#111827!important;border-color:rgba(15,23,42,.14)!important}
    body.beinvt-light-theme .stageWrap,body.beinvt-light-theme #canvasHost{background:#edf2f7!important;color:#111827!important}
    body.beinvt-light-theme #stageDataWrap,body.beinvt-light-theme #stageLabelHost,body.beinvt-light-theme .beinvtCard,body.beinvt-light-theme .settingsPanel,body.beinvt-light-theme aside.panel,body.beinvt-light-theme .panel.sidebar{background:#ffffff!important;color:#111827!important;border-color:rgba(15,23,42,.16)!important}
    body.beinvt-light-theme table,body.beinvt-light-theme tr,body.beinvt-light-theme td,body.beinvt-light-theme th{color:#111827!important;border-color:rgba(15,23,42,.12)!important}
    body.beinvt-light-theme tr.active,body.beinvt-light-theme tbody tr.active{background:#dbeafe!important;color:#111827!important}
    body.beinvt-light-theme input,body.beinvt-light-theme select,body.beinvt-light-theme textarea{background:#ffffff!important;color:#111827!important;border-color:rgba(15,23,42,.18)!important}
    body.beinvt-light-theme .modeTab,body.beinvt-light-theme button{background:#ffffff!important;color:#111827!important;border-color:rgba(15,23,42,.22)!important}
    body.beinvt-light-theme .modeTab.active,body.beinvt-light-theme button.good{background:#dbeafe!important;border-color:#2563eb!important;color:#0f172a!important}
    body.beinvt-light-theme .stageMeta{background:#ffffff!important;color:#111827!important;border-color:rgba(15,23,42,.18)!important}
    body.beinvt-light-theme .stageMeta .metaPill:not(.colorPill){background:#eef2ff!important;color:#111827!important;border-color:rgba(15,23,42,.14)!important}

    body.beinvt-label-wrap #stageLabelHost{align-items:flex-start!important;justify-content:flex-start!important;overflow:visible!important}
    body.beinvt-label-wrap #stageLabelHost .stageStack{width:100%!important;max-width:100%!important;align-items:flex-start!important;justify-content:flex-start!important;overflow:visible!important}
    body.beinvt-label-wrap .labelPreviewRow.wrapPreviewRow{
      flex-direction:column!important;align-items:flex-start!important;justify-content:flex-start!important;
      width:auto!important;max-width:100%!important;overflow:visible!important;margin:0!important;
    }
    body.beinvt-label-wrap .labelPreviewRow.wrapPreviewRow .stageFrame{
      max-width:none!important;align-self:flex-start!important;flex:0 0 auto!important;margin-left:0!important;margin-right:0!important;
      transform-origin:top left!important;
    }
    body.beinvt-label-wrap .stageMeta.stageMetaBelowLabel{
      align-self:flex-start!important;margin-left:0!important;margin-right:0!important;transform-origin:top left!important;
    }
    body.beinvt-objects-pane-hidden.beinvt-label-wrap #stageLabelHost .stageStack,
    body.beinvt-stage-fixed.beinvt-label-wrap #stageLabelHost .stageStack{align-items:flex-start!important;justify-content:flex-start!important}
  `;
  const tag = document.createElement("style");
  tag.setAttribute("data-beinvt-v8633-theme-aligned-meta-css", "1");
  tag.textContent = css;
  document.head.appendChild(tag);
})();

(function injectThemeFixLeftMetaV8634Css(){
  const css = `
    /* v8.6.34: fix uiTheme initialization and force wrap-like preview/meta to stay left-aligned without clipping. */
    body.beinvt-label-wrap #stageLabelHost{align-items:flex-start!important;justify-content:flex-start!important;overflow:visible!important}
    body.beinvt-label-wrap #stageLabelHost .stageStack{width:100%!important;max-width:100%!important;align-items:flex-start!important;justify-content:flex-start!important;overflow:visible!important}
    body.beinvt-label-wrap .labelPreviewRow.wrapPreviewRow{flex-direction:column!important;align-items:flex-start!important;justify-content:flex-start!important;width:auto!important;max-width:100%!important;margin:0!important;overflow:visible!important}
    body.beinvt-label-wrap .labelPreviewRow.wrapPreviewRow .stageFrame{align-self:flex-start!important;margin-left:0!important;margin-right:0!important;max-width:none!important;transform-origin:top left!important}
    body.beinvt-label-wrap .stageMeta.stageMetaBelowLabel{align-self:flex-start!important;margin-left:0!important;margin-right:0!important;transform-origin:top left!important}
    body.beinvt-objects-pane-hidden.beinvt-label-wrap #stageLabelHost .stageStack,
    body.beinvt-stage-fixed.beinvt-label-wrap #stageLabelHost .stageStack{align-items:flex-start!important;justify-content:flex-start!important}
  `;
  const tag = document.createElement("style");
  tag.setAttribute("data-beinvt-v8634-theme-fix-left-meta-css", "1");
  tag.textContent = css;
  document.head.appendChild(tag);
})();

(function injectWrapMetaFrameAlignmentV8635Css(){
  const css = `
    /* v8.6.35: keep the visible wrap-like label directly above the Label Color / Qty bar. */
    body.beinvt-label-wrap #stageLabelHost{
      align-items:flex-start!important;
      justify-content:flex-start!important;
      overflow:hidden!important;
    }
    body.beinvt-label-wrap #stageLabelHost .stageStack{
      align-items:flex-start!important;
      justify-content:flex-start!important;
      overflow:visible!important;
    }
    body.beinvt-label-wrap .labelPreviewRow.wrapPreviewRow{
      flex-direction:column!important;
      align-items:flex-start!important;
      justify-content:flex-start!important;
      margin-left:0!important;
      margin-right:auto!important;
      overflow:visible!important;
    }
    body.beinvt-label-wrap .labelPreviewRow.wrapPreviewRow .stageFrame{
      align-self:flex-start!important;
      margin-left:0!important;
      margin-right:0!important;
      transform-origin:top left!important;
      overflow:visible!important;
    }
    body.beinvt-label-wrap .labelPreviewRow.wrapPreviewRow .stageInner{
      transform-origin:0 0!important;
    }
    body.beinvt-label-wrap .stageMeta.stageMetaBelowLabel{
      align-self:flex-start!important;
      margin-left:0!important;
      margin-right:0!important;
      transform-origin:top left!important;
    }
  `;
  const tag = document.createElement("style");
  tag.setAttribute("data-beinvt-v8635-wrap-meta-frame-align-css", "1");
  tag.textContent = css;
  document.head.appendChild(tag);
})();


(function injectCenterZoomAndLightThemeV8636Css(){
  const css = `
    /* v8.6.36: Finished Trees / Field Labels / Shipping Labels zoom from center, and light theme now covers topbar + tables with dark text and visible borders. */
    body.beinvt-label-wrap #stageLabelHost{
      align-items:flex-start!important;
      justify-content:center!important;
      overflow:hidden!important;
    }
    body.beinvt-label-wrap #stageLabelHost .stageStack{
      width:100%!important;
      max-width:100%!important;
      align-items:center!important;
      justify-content:flex-start!important;
      overflow:visible!important;
    }
    body.beinvt-label-wrap .labelPreviewRow.wrapPreviewRow{
      flex-direction:column!important;
      align-items:center!important;
      justify-content:center!important;
      width:100%!important;
      max-width:100%!important;
      margin-left:auto!important;
      margin-right:auto!important;
      overflow:visible!important;
    }
    body.beinvt-label-wrap .labelPreviewRow.wrapPreviewRow .stageFrame{
      align-self:center!important;
      margin-left:auto!important;
      margin-right:auto!important;
      max-width:none!important;
      transform-origin:top center!important;
      overflow:visible!important;
    }
    body.beinvt-label-wrap .labelPreviewRow.wrapPreviewRow .stageInner{
      transform-origin:0 0!important;
    }
    body.beinvt-label-wrap .stageMeta.stageMetaBelowLabel{
      align-self:center!important;
      margin-left:auto!important;
      margin-right:auto!important;
      transform-origin:top center!important;
    }
    body.beinvt-objects-pane-hidden.beinvt-label-wrap #stageLabelHost .stageStack,
    body.beinvt-stage-fixed.beinvt-label-wrap #stageLabelHost .stageStack{
      align-items:center!important;
      justify-content:flex-start!important;
    }

    body.beinvt-light-theme,
    body.beinvt-light-theme *{
      scrollbar-color:#94a3b8 #f8fafc;
    }
    body.beinvt-light-theme{
      background:#f4f7fb!important;
      color:#111827!important;
    }
    body.beinvt-light-theme [data-beinvt-top-menu-ref="1"],
    body.beinvt-light-theme .beinvtTopMenuReference,
    body.beinvt-light-theme .topbar,
    body.beinvt-light-theme .toolbar,
    body.beinvt-light-theme header{
      background:#ffffff!important;
      color:#111827!important;
      border:1px solid rgba(15,23,42,.22)!important;
      box-shadow:0 4px 14px rgba(15,23,42,.10)!important;
    }
    body.beinvt-light-theme [data-beinvt-top-menu-ref="1"] *,
    body.beinvt-light-theme .beinvtTopMenuReference *,
    body.beinvt-light-theme .topbar *,
    body.beinvt-light-theme .toolbar *,
    body.beinvt-light-theme header *{
      color:#111827!important;
    }
    body.beinvt-light-theme #zoom{
      accent-color:#7c3aed!important;
    }
    body.beinvt-light-theme .modeTab,
    body.beinvt-light-theme .buttonRow button,
    body.beinvt-light-theme .beinvtCard button,
    body.beinvt-light-theme #stageRowsTable button,
    body.beinvt-light-theme button{
      background:#ffffff!important;
      color:#111827!important;
      border:1px solid rgba(15,23,42,.28)!important;
      box-shadow:0 1px 2px rgba(15,23,42,.08)!important;
    }
    body.beinvt-light-theme .modeTab.active,
    body.beinvt-light-theme .modeTab.utilityTab.good,
    body.beinvt-light-theme button.good{
      background:#dbeafe!important;
      border-color:#2563eb!important;
      color:#0f172a!important;
    }
    body.beinvt-light-theme .beinvtThemeSwitch{
      background:#e5e7eb!important;
      border-color:rgba(15,23,42,.26)!important;
    }
    body.beinvt-light-theme .beinvtThemeSwitch .trackEmoji,
    body.beinvt-light-theme .beinvtThemeSwitch .knob{
      color:#111827!important;
    }
    body.beinvt-light-theme .stageWrap,
    body.beinvt-light-theme #canvasHost{
      background:#edf2f7!important;
      color:#111827!important;
      border-color:rgba(15,23,42,.18)!important;
    }
    body.beinvt-light-theme #stageDataWrap,
    body.beinvt-light-theme #stageLabelHost,
    body.beinvt-light-theme .stageMeta,
    body.beinvt-light-theme .beinvtCard,
    body.beinvt-light-theme .settingsPanel,
    body.beinvt-light-theme aside.panel,
    body.beinvt-light-theme .panel.sidebar,
    body.beinvt-light-theme .beinvtSettingsPanel{
      background:#ffffff!important;
      color:#111827!important;
      border-color:rgba(15,23,42,.20)!important;
    }
    body.beinvt-light-theme .beinvtCardHeader,
    body.beinvt-light-theme .beinvtCardBody,
    body.beinvt-light-theme #objectsModeNote,
    body.beinvt-light-theme .small,
    body.beinvt-light-theme .smallNote,
    body.beinvt-light-theme .field label,
    body.beinvt-light-theme .checkRow label,
    body.beinvt-light-theme .checkItem,
    body.beinvt-light-theme .stageMeta b{
      color:#111827!important;
    }
    body.beinvt-light-theme .beinvtObjectsCard{
      background:#ffffff!important;
      box-shadow:0 8px 24px rgba(15,23,42,.12)!important;
    }
    body.beinvt-light-theme .objectBtn,
    body.beinvt-light-theme .queueItem,
    body.beinvt-light-theme .stageMeta .metaPill:not(.colorPill){
      background:#f8fafc!important;
      color:#111827!important;
      border-color:rgba(15,23,42,.22)!important;
    }
    body.beinvt-light-theme .objectBtn.active{
      background:#dbeafe!important;
      color:#0f172a!important;
      border-color:#2563eb!important;
    }
    body.beinvt-light-theme .objectBtn .badge{
      color:#111827!important;
      opacity:1!important;
    }
    body.beinvt-light-theme input,
    body.beinvt-light-theme select,
    body.beinvt-light-theme textarea,
    body.beinvt-light-theme #stageSearch,
    body.beinvt-light-theme #layoutJson{
      background:#ffffff!important;
      color:#111827!important;
      border:1px solid rgba(15,23,42,.28)!important;
    }
    body.beinvt-light-theme input::placeholder,
    body.beinvt-light-theme textarea::placeholder{
      color:#475569!important;
      opacity:1!important;
    }
    body.beinvt-light-theme #stageDataSearchRow{
      background:#f8fafc!important;
      border-bottom:1px solid rgba(15,23,42,.22)!important;
    }
    body.beinvt-light-theme .stageTableScroll{
      background:#ffffff!important;
      border-top:1px solid rgba(15,23,42,.14)!important;
    }
    body.beinvt-light-theme #stageRowsTable{
      background:#ffffff!important;
      color:#111827!important;
      border-collapse:separate!important;
      border-spacing:0!important;
      border:1px solid rgba(15,23,42,.18)!important;
    }
    body.beinvt-light-theme #stageRowsTable th{
      background:#e5e7eb!important;
      color:#111827!important;
      border-bottom:1px solid rgba(15,23,42,.28)!important;
      border-right:1px solid rgba(15,23,42,.18)!important;
    }
    body.beinvt-light-theme #stageRowsTable td{
      background:#ffffff!important;
      color:#111827!important;
      border-bottom:1px solid rgba(15,23,42,.14)!important;
      border-right:1px solid rgba(15,23,42,.10)!important;
    }
    body.beinvt-light-theme #stageRowsTable th:last-child,
    body.beinvt-light-theme #stageRowsTable td:last-child{
      border-right:0!important;
    }
    body.beinvt-light-theme #stageRowsTable tr.active td{
      background:#bfdbfe!important;
      color:#0f172a!important;
      border-bottom-color:rgba(37,99,235,.30)!important;
    }
    body.beinvt-light-theme #stageRowsTable tr:hover td{
      background:#e0f2fe!important;
      color:#0f172a!important;
    }
    body.beinvt-light-theme #stageRowsTable tr.active:hover td{
      background:#bfdbfe!important;
    }
  `;
  const tag = document.createElement("style");
  tag.setAttribute("data-beinvt-v8636-center-zoom-light-theme-css", "1");
  tag.textContent = css;
  document.head.appendChild(tag);
})();

(function injectQrClearanceFullWidthV8643Css(){
  const css = `
    /* v8.6.43: 1in wrap-like height presets keep full render-table width; preview can grow vertically instead of narrowing. */
    body.beinvt-label-wrap #stageLabelHost{
      overflow:visible!important;
    }
    body.beinvt-label-wrap .labelPreviewRow.wrapPreviewRow,
    body.beinvt-label-wrap .labelPreviewRow.wrapPreviewRow .stageFrame,
    body.beinvt-label-wrap .labelPreviewRow.wrapPreviewRow .stageInner{
      overflow:visible!important;
    }
    body.beinvt-label-wrap .obj[data-id="WO_QR"] img,
    body.beinvt-label-wrap .obj[data-id="LOT_QR"] img{
      width:100%!important;
      height:100%!important;
      object-fit:fill!important;
      image-rendering:pixelated!important;
    }
  `;
  const tag = document.createElement("style");
  tag.setAttribute("data-beinvt-v8643-qr-clearance-full-width-css", "1");
  tag.textContent = css;
  document.head.appendChild(tag);
})();

function fallbackLayout(type) {
  if (type === "POT") {
    const potLayout = {
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
    return scaleDefaultLayoutForCurrentSize(potLayout, "POT");
  }
  const wrapLayout = {
    name: type === "FIELD" ? "Field Labels Clean Default" : (type === "SHIP" ? "Shipping Labels Clean Default" : "Finished Trees Clean Default"),
    labelType: type === "FIELD" ? "FIELD" : (type === "SHIP" ? "SHIP" : "WRAP"),
    safeMarginPx: 3,
    gridPx: 4,
    snapPx: 5,
    objects: {
      WO_QR: { x: type === "FIELD" ? WRAP_LIKE_PREVIEW_CONFIG.fieldRowX : 2, y: type === "FIELD" ? 2 : 2, w: 44, h: type === "FIELD" ? 44 : 44, rot: 0, fontSize: type === "FIELD" ? 13.5 : undefined, locked: false, visible: true },
      WO: { x: 46, y: type === "SHIP" ? 0 : 1, w: 76, h: type === "SHIP" ? 0 : 16, rot: 0, fontSize: 17.4, fontFamily: "Times New Roman", locked: false, visible: type !== "SHIP", alignH: "left", alignV: "middle" },
      CROP: { x: 46, y: type === "SHIP" ? 3 : 17, w: 76, h: type === "SHIP" ? 22 : 14, rot: 0, fontSize: type === "SHIP" ? 16.2 : 15.8, fontFamily: "Times New Roman", locked: false, visible: true, alignH: "left", alignV: "middle" },
      INTERNAL: { x: 46, y: type === "SHIP" ? 25 : 32, w: 76, h: type === "SHIP" ? 22 : 16, rot: 0, fontSize: type === "SHIP" ? 17.2 : 16.8, fontFamily: "Times New Roman", locked: false, visible: true, alignH: "left", alignV: "middle" },
      SCION: { x: 124, y: 1, w: 224, h: 18, rot: 0, fontSize: 22.5, fontFamily: "Times New Roman", locked: false, visible: true, alignH: "center", alignV: "middle" },
      SCION_PATENT: { x: 124, y: 16, w: 224, h: 5, rot: 0, fontSize: 5.2, fontFamily: "Times New Roman", locked: false, visible: true, alignH: "center", alignV: "middle" },
      ROOTSTOCK: { x: 124, y: 19, w: 224, h: 18, rot: 0, fontSize: 22.5, fontFamily: "Times New Roman", locked: false, visible: true, alignH: "center", alignV: "middle" },
      ROOTSTOCK_PATENT: { x: 124, y: 36, w: 224, h: 5, rot: 0, fontSize: 5.0, fontFamily: "Times New Roman", locked: false, visible: true, alignH: "center", alignV: "middle" },
      LOT: { x: 124, y: 37, w: 224, h: 6, rot: 0, fontSize: 6.6, fontFamily: "Times New Roman", locked: false, visible: type !== "SHIP", alignH: "center", alignV: "middle" },
      ADDRESS: { x: 124, y: 43, w: 224, h: 5, rot: 0, fontSize: 5.1, fontFamily: "Times New Roman", locked: false, visible: true, alignH: "center", alignV: "middle" },
      LOT_QR: { x: 344, y: 2, w: 44, h: 44, rot: 0, locked: false, visible: type !== "SHIP" },
      LOGO: { x: WRAP_LIKE_PREVIEW_CONFIG.logoX, y: WRAP_LIKE_PREVIEW_CONFIG.logoY, w: WRAP_LIKE_PREVIEW_CONFIG.logoWidth, h: WRAP_LIKE_PREVIEW_CONFIG.logoHeight, rot: 0, locked: false, visible: true },
      WARNING: { x: 420, y: 2, w: 58, h: 44, rot: 0, fontSize: 3.65, fontFamily: "Times New Roman", locked: false, visible: true, alignH: "left", alignV: "middle" }
    }
  };
  return scaleDefaultLayoutForCurrentSize(wrapLayout, wrapLayout.labelType);
}

function normalizeLayout(src) {
  const rawType = (src && src.labelType) === "FIELD" ? "FIELD" : ((src && src.labelType) === "WRAP" ? "WRAP" : ((src && src.labelType) === "SHIP" ? "SHIP" : "POT"));
  const type = rawType;
  const base = fallbackLayout(type);
  const out = Object.assign({}, base, src || {}, { labelType: type, objects: {} });
  const sourceObjects = (src && src.objects) || {};
  for (const id of objectOrder(type)) {
    out.objects[id] = Object.assign({}, base.objects[id] || {}, sourceObjects[id] || {});
  }
  if (isWrapLikeMode(type) && sourceObjects.ITEM && !sourceObjects.SCION) {
    out.objects = clone(base.objects);
  }
  const scale = labelSizeScaleFactors(type);
  if (type === "FIELD" && out.objects && out.objects.WO_QR) {
    const labelH = Math.round(labelSizeInches(type).heightIn * INCH);
    out.objects.WO_QR.x = Number((2 * scale.sx).toFixed(1));
    out.objects.WO_QR.y = Number((2 * scale.sy).toFixed(1));
    out.objects.WO_QR.w = Number((28 * scale.sx).toFixed(1));
    out.objects.WO_QR.h = Math.max(34, Number((labelH - 4 * scale.sy).toFixed(1)));
    if (!out.objects.WO_QR.manualFontSize) out.objects.WO_QR.fontSize = Number((13.5 * scale.sy).toFixed(1));
    out.objects.WO_QR.rot = 0;
    out.objects.WO_QR.visible = true;
  }
  if (isWrapLikeMode(type) && out.objects && out.objects.LOGO) {
    out.objects.LOGO.x = Number((WRAP_LIKE_PREVIEW_CONFIG.logoX * scale.sx).toFixed(1));
    out.objects.LOGO.y = Number((WRAP_LIKE_PREVIEW_CONFIG.logoY * scale.sy).toFixed(1));
    out.objects.LOGO.w = Number((WRAP_LIKE_PREVIEW_CONFIG.logoWidth * scale.sx).toFixed(1));
    out.objects.LOGO.h = Number((WRAP_LIKE_PREVIEW_CONFIG.logoHeight * scale.sy).toFixed(1));
  }
  out.labelSize = labelSizeInches(type);
  if (isWrapLikeMode(type)) {
    const balanceKey = wrapLikeQrBalanceKey(out.labelSize);
    if (out.__wrapQrBalanceKey !== balanceKey) rebalanceWrapLikeQrLayout(out, type);
    out.__wrapQrBalanceKey = balanceKey;
  }
  return out;
}
function loadDefaults() {
  DEFAULT_LAYOUTS.POT = fallbackLayout("POT");
  DEFAULT_LAYOUTS.WRAP = fallbackLayout("WRAP");
  DEFAULT_LAYOUTS.FIELD = fallbackLayout("FIELD");
  DEFAULT_LAYOUTS.SHIP = fallbackLayout("SHIP");
}
function loadWorkingLayout(type) {
  try {
    const raw = localStorage.getItem("beinvtWorkingLayout_" + type);
    if (raw) return normalizeLayout(JSON.parse(raw));
  } catch (e) {}
  return normalizeLayout(DEFAULT_LAYOUTS[type] || fallbackLayout(type));
}
function saveWorkingLayout() {
  if (layout) {
    layout.labelSize = labelSizeInches(labelType);
    localStorage.setItem("beinvtWorkingLayout_" + labelType, JSON.stringify(layout));
  }
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
function shippingNameParts(name) {
  return String(name || "").split("|").map(s => cleanDisplay(s)).filter(Boolean);
}
function shippingNameSuffix(name) {
  const parts = shippingNameParts(name);
  return cleanDisplay(parts[parts.length - 1]);
}
function shippingTrayTypeFromName(name) {
  const parts = shippingNameParts(name);
  // Item name format: part1 | part2 | part3 | Tray Type | ... | Sales Format
  // The value after the 3rd pipe is the 4th segment.
  return cleanDisplay(parts[3]);
}
function controlledSalesFormat(value) {
  const raw = cleanDisplay(value).replace(/\s+/g, " ").trim();
  const compact = raw.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const map = {
    cn: "CN",
    qs: "QS",
    liner: "Liner",
    liners: "Liner",
    bud: "Bud",
    buds: "Bud"
  };
  return map[compact] || "";
}
function shippingSalesFormatFromName(name) {
  // Sales Format is controlled to fixed list values only: CN, QS, Liner, Bud.
  // The source value is the segment after the last pipe in the item name.
  return controlledSalesFormat(shippingNameSuffix(name));
}
function isShippingNameIncluded(name) {
  return !!shippingSalesFormatFromName(name);
}
function baseRowsForMode(type = labelType) {
  return isShippingMode(type) ? itemRows : labelRows;
}
async function fetchCsvTextOrEmpty(path) {
  try {
    const res = await fetch(path + "?cache=" + Date.now());
    if (!res.ok) return "";
    return await res.text();
  } catch (e) {
    return "";
  }
}
async function loadCsv() {
  const txt = await fetchCsvTextOrEmpty("data/labels.csv");
  const grid = parseCsv(txt);
  if (grid.length) {
    const headers = grid[0].map(x => String(x || "").trim());
    labelRows = grid.slice(1).map(line => {
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
  }
  const itemsTxt = await fetchCsvTextOrEmpty("data/BEINVT - Items.csv");
  const itemsGrid = parseCsv(itemsTxt);
  if (itemsGrid.length) {
    const headers = itemsGrid[0].map(x => String(x || "").trim());
    itemRows = itemsGrid.slice(1).map(line => {
      const raw = {};
      headers.forEach((h, i) => { raw[h] = line[i] || ""; });
      const name = csvVal(raw, ["Name", "Item Name"]);
      return {
        wo: "",
        act: "SHIPPING LABEL",
        crop: csvVal(raw, ["Crop"]),
        name,
        scion: csvVal(raw, ["Scion Item", "Scion"]),
        rootstock: csvVal(raw, ["Rootstock Item", "Rootstock", "Root Stock"]),
        internalId: csvVal(raw, ["Internal ID", "InternalID", "Item Internal ID"]),
        lotNumber: "",
        scionPatent: csvVal(raw, ["Scion Patent #", "Scion Patent", "Scion Patent Number", "Scion Royalty", "Scion Royalty Fee"]),
        rootstockPatent: csvVal(raw, ["Rootstock Patent #", "Rootstock Patent", "Rootstock Patent Number", "Root Stock Patent", "Rootstock Royalty", "Rootstock Royalty Fee"]),
        labelColor: csvVal(raw, ["Label Color", "Color"]) || "WHITE",
        quantity: "1",
        labelsNeeded: "1",
        week: currentWeekNumber(),
        trayType: shippingTrayTypeFromName(name),
        salesFormat: shippingSalesFormatFromName(name),
        shippingSuffix: shippingSalesFormatFromName(name)
      };
    }).filter(r => cleanDisplay(r.internalId) && isShippingNameIncluded(r.name));
  }
  rows = baseRowsForMode(labelType).slice();
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
      act: labelType === "FIELD" ? "FIELD PLANTING" : (labelType === "SHIP" ? "SHIPPING LABEL" : (labelType === "WRAP" ? "SHIPPING REQUEST" : "POTTING UP - 120MM")),
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
      trayType: "TEST TRAY",
      salesFormat: "CN",
      shippingSuffix: "CN",
      week: "52"
    };
  }
  return filteredRows[currentRowIndex] || rows[0] || {
    wo: "WO123456",
    act: "POTTING UP - 120MM",
    crop: labelType === "SHIP" ? "CHERRY" : "OLIVE",
    scion: labelType === "SHIP" ? "ROYAL LYNN" : "ARBEQUINA",
    rootstock: labelType === "SHIP" ? "GISELA 12" : "TEST ROOTSTOCK",
    internalId: "27047",
    lotNumber: labelType === "SHIP" ? "" : "2026",
    scionPatent: "",
    rootstockPatent: "",
    labelColor: "WHITE",
    quantity: "1",
    labelsNeeded: "1",
    trayType: "",
    salesFormat: "",
    shippingSuffix: "",
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
function isWrapScionOnlyCrop(row) {
  /*
    v8.6.22: Some wrap-tie crops are not rootstock/scion combinations.
    For olives and berry crops, the wrap tie should show the scion/variety only.
    Rootstock text and the literal "on" prefix are intentionally suppressed.
  */
  const crop = cleanDisplay(row && row.crop);
  return /\b(olive|olives|blueberr(?:y|ies)|blackberr(?:y|ies)|raspberr(?:y|ies)|strawberr(?:y|ies)|boysenberr(?:y|ies)|loganberr(?:y|ies)|marionberr(?:y|ies)|cranberr(?:y|ies)|gooseberr(?:y|ies)|elderberr(?:y|ies)|huckleberr(?:y|ies)|mulberr(?:y|ies)|currant|berry|berries)\b/i.test(crop);
}
function wrapScionText(row) {
  return capClean(derivedScion(row) || row.crop || derivedRootstock(row) || "ITEM");
}
function wrapRootstockText(row) {
  if (isWrapScionOnlyCrop(row)) return "";
  let txt = derivedRootstock(row) || derivedScion(row) || row.crop || "ROOTSTOCK";
  if (/^platinum\s+pistachio\s+rootstock$/i.test(txt)) txt = "Platinum";
  return capClean(txt);
}
function shippingSingleLineInfo(row) {
  if (!isShippingMode()) return null;
  const scionRaw = cleanDisplay(derivedScion(row));
  const rootRaw = cleanDisplay(derivedRootstock(row));
  if (scionRaw && !rootRaw) return {
    main: capClean(scionRaw),
    mainPatent: capClean(row && row.scionPatent),
    secondary: "",
    secondaryPatent: ""
  };
  if (!scionRaw && rootRaw) return {
    main: capClean(rootRaw),
    mainPatent: capClean(row && row.rootstockPatent),
    secondary: "",
    secondaryPatent: ""
  };
  return null;
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
  if (isShippingMode()) return cleanDisplay(row && row.internalId) || " ";
  return cleanDisplay(row && row.wo) || " ";
}
function wrapRightQrText(row) {
  if (isShippingMode() || isRschRow(row)) return "";
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
  const scionOnlyCrop = isWrapScionOnlyCrop(row);
  const shipSingle = shippingSingleLineInfo(row);
  if (id === "WO") return isShippingMode() ? "" : capClean(row.wo);
  if (id === "CROP") return capClean(row.crop);
  if (id === "INTERNAL") return capClean(row.internalId);
  if (id === "SCION") return shipSingle ? shipSingle.main : wrapScionText(row);
  if (scionOnlyCrop && (id === "SCION_PATENT" || id === "ROOTSTOCK" || id === "ROOTSTOCK_PATENT" || id === "LOT")) return "";
  if (id === "SCION_PATENT") return shipSingle ? shipSingle.mainPatent : capClean(row.scionPatent);
  if (id === "ROOTSTOCK") return shipSingle ? "" : wrapRootstockText(row);
  if (id === "ROOTSTOCK_PATENT") return shipSingle ? "" : capClean(row.rootstockPatent);
  if (id === "LOT") return isShippingMode() ? "" : wrapLotLine(row);
  if (id === "ADDRESS") return WRAP_ADDRESS;
  if (id === "WARNING") return WRAP_WARNING;
  return "";
}

function hasWrapObjectValue(id, row) {
  if (!isWrapLikeMode(labelType)) return true;
  if (isShippingMode() && (id === "WO" || id === "LOT" || id === "LOT_QR")) return false;
  if (isWrapScionOnlyCrop(row) && (id === "SCION_PATENT" || id === "ROOTSTOCK" || id === "ROOTSTOCK_PATENT" || id === "LOT")) return false;
  if (id === "SCION_PATENT" || id === "ROOTSTOCK_PATENT") return !!cleanDisplay(wrapObjectText(id, row));
  if (id === "ROOTSTOCK") return !!cleanDisplay(wrapObjectText(id, row));
  if (id === "LOT" || id === "LOT_QR") return !!cleanDisplay(wrapRightQrText(row)) || !!cleanDisplay(wrapObjectText("LOT", row));
  if (id === "WO") return !!cleanDisplay(wrapObjectText(id, row));
  return true;
}
function shouldRenderObject(id, row) {
  if (!layout || !layout.objects || !layout.objects[id] || layout.objects[id].visible === false) return false;
  return hasWrapObjectValue(id, row);
}
function applyWrapDataAwareStack(row) {
  if (!isWrapLikeMode(labelType) || !layout || !layout.objects) return;
  const o = layout.objects;
  const scionOnlyCrop = isWrapScionOnlyCrop(row);
  const shipSingle = shippingSingleLineInfo(row);
  const hasScionPatent = !scionOnlyCrop && !!cleanDisplay(wrapObjectText("SCION_PATENT", row));
  const hasRootstockPatent = !scionOnlyCrop && !!cleanDisplay(wrapObjectText("ROOTSTOCK_PATENT", row));
  const sy = wrapVerticalScale(labelType);
  const labelH = sizePx(labelType).h;
  const v = n => Number((Number(n || 0) * sy).toFixed(1));
  const mainX = 119, mainW = 234;
  ["SCION", "SCION_PATENT", "ROOTSTOCK", "ROOTSTOCK_PATENT", "LOT", "ADDRESS"].forEach(id => {
    if (o[id]) { o[id].x = mainX; o[id].w = mainW; o[id].rot = 0; o[id].alignH = "center"; o[id].alignV = "middle"; }
  });
  if (isShippingMode()) {
    if (o.SCION) { o.SCION.y = shipSingle ? v(8) : v(1); o.SCION.h = shipSingle ? v(20) : v(19); }
    if (o.SCION_PATENT) { o.SCION_PATENT.y = shipSingle ? v(28) : v(17); o.SCION_PATENT.h = cleanDisplay(wrapObjectText("SCION_PATENT", row)) ? v(6) : 0; }
    if (o.ROOTSTOCK) { o.ROOTSTOCK.y = shipSingle ? 0 : v(21); o.ROOTSTOCK.h = shipSingle ? 0 : v(17); }
    if (o.ROOTSTOCK_PATENT) { o.ROOTSTOCK_PATENT.y = shipSingle ? 0 : v(37); o.ROOTSTOCK_PATENT.h = shipSingle ? 0 : (cleanDisplay(wrapObjectText("ROOTSTOCK_PATENT", row)) ? v(6) : 0); }
    if (o.LOT) { o.LOT.y = 0; o.LOT.h = 0; }
    if (o.LOT_QR) { o.LOT_QR.x = 0; o.LOT_QR.y = 0; o.LOT_QR.w = 0; o.LOT_QR.h = 0; }
    if (o.LOGO) { o.LOGO.x = Math.max(0, Number(WRAP_LIKE_PREVIEW_CONFIG.logoX || 390) - 31); }
    if (o.WARNING) { o.WARNING.x = Math.max(0, Number((o.LOGO && o.LOGO.x) || 359) + Number((o.LOGO && o.LOGO.w) || WRAP_LIKE_PREVIEW_CONFIG.logoWidth || 30) + 3); o.WARNING.w = Math.max(40, 480 - o.WARNING.x - 2); }
    if (o.ADDRESS) { o.ADDRESS.y = v(43); o.ADDRESS.h = Math.max(v(5), labelH - o.ADDRESS.y); }
  }
  if (scionOnlyCrop) {
    if (o.SCION) {
      o.SCION.y = v(10);
      o.SCION.h = v(29);
      o.SCION.alignH = "center";
      o.SCION.alignV = "middle";
    }
    ["SCION_PATENT", "ROOTSTOCK", "ROOTSTOCK_PATENT", "LOT"].forEach(id => {
      if (o[id]) {
        o[id].y = 0;
        o[id].h = 0;
      }
    });
    if (o.ADDRESS) {
      o.ADDRESS.y = v(43);
      o.ADDRESS.h = Math.max(v(5), labelH - o.ADDRESS.y);
    }
    clampAllObjects();
    return;
  }
  let y = v(1);
  if (o.SCION) {
    o.SCION.y = y;
    o.SCION.h = hasScionPatent ? v(14) : (hasRootstockPatent ? v(17) : v(18));
    y += o.SCION.h;
  }
  if (o.SCION_PATENT) {
    o.SCION_PATENT.y = y;
    o.SCION_PATENT.h = hasScionPatent ? v(5) : 0;
    if (hasScionPatent) y += o.SCION_PATENT.h;
  }
  if (o.ROOTSTOCK) {
    o.ROOTSTOCK.y = y;
    o.ROOTSTOCK.h = hasRootstockPatent ? v(14) : (hasScionPatent ? v(17) : v(18));
    y += o.ROOTSTOCK.h;
  }
  if (o.ROOTSTOCK_PATENT) {
    o.ROOTSTOCK_PATENT.y = y;
    o.ROOTSTOCK_PATENT.h = hasRootstockPatent ? v(5) : 0;
    if (hasRootstockPatent) y += o.ROOTSTOCK_PATENT.h;
  }
  if (o.LOT) {
    o.LOT.y = y;
    o.LOT.h = (hasScionPatent || hasRootstockPatent) ? v(4) : v(6);
    y += o.LOT.h;
  }
  if (o.ADDRESS) {
    o.ADDRESS.y = y;
    o.ADDRESS.h = Math.max(v(4), labelH - y);
  }
  clampAllObjects();
}
function qrUrl(text) {
  const value = text || " ";
  // v8.6.54: SVG + larger size + tiny margin gives a sharp printed QR while filling the object box.
  return "https://quickchart.io/qr?format=svg&size=700&margin=1&ecLevel=M&text=" + encodeURIComponent(value);
}
function colorConfigKey(name) {
  return cleanDisplay(name).toUpperCase().replace(/\s+/g, " ").trim();
}
function colorMeta(name) {
  const raw = cleanDisplay(name);
  const normalized = colorConfigKey(raw);
  const directKey = LABEL_COLOR_ALIASES[normalized] || normalized;
  const direct = LABEL_COLOR_CONFIG[directKey];
  if (direct) return { ...direct, label: direct.label || raw || "Unknown" };

  // Also support compact keys if someone exports HOTPINK, DARKBLUE, etc.
  const compact = normalized.replace(/\s+/g, "");
  const aliasKey = LABEL_COLOR_ALIASES[compact] || compact;
  const matchKey = Object.keys(LABEL_COLOR_CONFIG).find(k => k.replace(/\s+/g, "") === aliasKey || k.replace(/\s+/g, "") === compact);
  if (matchKey) {
    const cfg = LABEL_COLOR_CONFIG[matchKey];
    return { ...cfg, label: cfg.label || raw || "Unknown" };
  }

  // Fallback: valid CSS color names still work, but keep the CSV/list display text.
  const cssProbe = raw.toLowerCase().trim();
  const probe = document.createElement("span");
  probe.style.color = cssProbe;
  if (probe.style.color) return { bg: cssProbe, fg: "#111827", label: raw || "Unknown" };
  return { bg: "rgba(255,255,255,.08)", fg: "#e5e7eb", label: raw || "Unknown" };
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
function cleanupTopbarExtraText() {
  const root = ($("modeTabs") && $("modeTabs").parentElement) || document.body;
  if (!root) return;
  root.querySelectorAll('label[for="labelType"]').forEach(el => el.remove());
  root.querySelectorAll('*').forEach(el => {
    if (!el || ["SCRIPT", "STYLE"].includes(el.tagName)) return;
    const txt = String(el.textContent || '').trim();
    if (!txt) return;
    if (/^label$/i.test(txt) && !el.querySelector('*')) el.remove();
    else if (/times\s+new\s+roman/i.test(txt) || /all\s+caps/i.test(txt)) el.remove();
  });
  [...root.childNodes].forEach(node => {
    if (node.nodeType !== 3) return;
    let txt = String(node.nodeValue || '');
    txt = txt.replace(/\bLabel\b/, '').replace(/Times New Roman\s*\+\s*ALL CAPS\.?/i, '').replace(/Times New Roman.*ALL CAPS\.?/i, '');
    node.nodeValue = txt;
  });
}
function removeWorstCaseTestButton() {
  const selectors = ["#testMode", "[data-testid='testMode']", "[data-mode='TEST']"].join(",");
  document.querySelectorAll(selectors).forEach(el => el.remove());
  document.querySelectorAll("button,a,span,label,div").forEach(el => {
    if (!el || ["SCRIPT", "STYLE"].includes(el.tagName)) return;
    const txt = String(el.textContent || "").trim();
    if (/worst[-\s]*case\s*test/i.test(txt)) {
      const btn = el.closest("button") || el;
      btn.remove();
    }
  });
}
function applyThemeClass() {
  if (!document.body) return;
  document.body.classList.toggle("beinvt-light-theme", uiTheme === "light");
  document.body.classList.toggle("beinvt-dark-theme", uiTheme !== "light");
}
function setUiTheme(nextTheme) {
  uiTheme = String(nextTheme || "dark").toLowerCase() === "light" ? "light" : "dark";
  localStorage.setItem(UI_THEME_CONFIG.storageKey, uiTheme);
  applyThemeClass();
  updateThemeToggleButton();
}
function toggleUiTheme() {
  setUiTheme(uiTheme === "light" ? "dark" : "light");
}
function updateThemeToggleButton() {
  const btn = $("beinvtThemeToggleBtn");
  if (!btn) return;
  const isLight = uiTheme === "light";
  btn.classList.toggle("light", isLight);
  btn.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  btn.setAttribute("title", isLight ? "Switch to dark theme" : "Switch to light theme");
  const knob = btn.querySelector(".knob");
  if (knob) knob.textContent = isLight ? UI_THEME_CONFIG.lightEmoji : UI_THEME_CONFIG.darkEmoji;
}
function findTopbarButtonByText(pattern) {
  const rx = pattern instanceof RegExp ? pattern : new RegExp(String(pattern || ""), "i");
  return [...document.querySelectorAll("button,a")].find(el => rx.test(String(el.textContent || "").trim()));
}
function ensureThemeToggleButton() {
  const printQueueBtn = $("printQueue") || findTopbarButtonByText(/^print\s+queue$/i);
  const parent = (printQueueBtn && printQueueBtn.parentNode) || (($("modeTabs") && $("modeTabs").parentNode) || null);
  if (!parent) return;
  let btn = $("beinvtThemeToggleBtn");
  if (!btn) {
    btn = document.createElement("button");
    btn.id = "beinvtThemeToggleBtn";
    btn.type = "button";
    btn.className = "beinvtThemeSwitch";
    btn.innerHTML = `<span class="trackEmoji moon">${UI_THEME_CONFIG.darkEmoji}</span><span class="trackEmoji sun">${UI_THEME_CONFIG.lightEmoji}</span><span class="knob"></span>`;
    btn.onclick = toggleUiTheme;
  }
  if (printQueueBtn && printQueueBtn.nextSibling !== btn) parent.insertBefore(btn, printQueueBtn.nextSibling);
  else if (!btn.parentNode) parent.appendChild(btn);
  updateThemeToggleButton();
}
function applyModeClass() {
  applyThemeClass();
  removeWorstCaseTestButton();
  document.body.classList.toggle("beinvt-label-pot", labelType === "POT");
  document.body.classList.toggle("beinvt-label-wrap", isWrapLikeMode(labelType));
  document.body.classList.toggle("beinvt-label-field", labelType === "FIELD");
  document.body.classList.toggle("beinvt-label-ship", labelType === "SHIP");
  document.body.classList.toggle("beinvt-hide-object-guides", !showObjectGuides);
  // v8.6.20: never use the old broad hide class. It can trigger stale CSS from older script runs.
  document.body.classList.remove("beinvt-left-pane-hidden");
  document.body.classList.toggle("beinvt-objects-pane-hidden", !!leftPaneHidden);
  applyObjectsPaneVisibility();
  updateTopbarUtilityButtons();
}
function getObjectsPanePanel() {
  let panel = document.querySelector(".beinvtSettingsPanel");
  if (panel) return panel;
  panel = findSettingsPanel();
  if (panel) panel.classList.add("beinvtSettingsPanel");
  return panel;
}
function clearObjectsPaneInlineHide(panel) {
  if (!panel) return;
  ["display", "visibility", "width", "min-width", "max-width", "flex", "flex-basis", "padding", "margin", "border", "overflow", "pointer-events"].forEach(prop => panel.style.removeProperty(prop));
  panel.removeAttribute("aria-hidden");
  panel.dataset.beinvtObjectsPaneHidden = "0";
}
function applyObjectsPaneVisibility() {
  const panel = getObjectsPanePanel();
  if (panel) {
    if (leftPaneHidden) {
      panel.classList.add("beinvtSettingsPanel");
      panel.dataset.beinvtObjectsPaneHidden = "1";
      panel.setAttribute("aria-hidden", "true");
      panel.style.setProperty("display", "none", "important");
      panel.style.setProperty("visibility", "hidden", "important");
      panel.style.setProperty("width", "0px", "important");
      panel.style.setProperty("min-width", "0px", "important");
      panel.style.setProperty("max-width", "0px", "important");
      panel.style.setProperty("flex", "0 0 0px", "important");
      panel.style.setProperty("flex-basis", "0px", "important");
      panel.style.setProperty("padding", "0px", "important");
      panel.style.setProperty("margin", "0px", "important");
      panel.style.setProperty("border", "0px", "important");
      panel.style.setProperty("overflow", "hidden", "important");
      panel.style.setProperty("pointer-events", "none", "important");
    } else {
      clearObjectsPaneInlineHide(panel);
    }
  }
  if (leftPaneHidden) {
    clearNormalStageFixedLayout();
    applyHiddenObjectsStageLayout();
  } else {
    clearHiddenObjectsStageLayout();
    applyNormalStageFixedLayout();
  }
}
function normalStageFixedBounds() {
  const top = topMenuBounds();
  const panel = getObjectsPanePanel() || findSettingsPanel();
  const vw = viewportWidthNow();
  const vh = viewportHeightNow();
  const topLeft = Math.max(0, Math.round((top && top.left) || 0));
  const topRight = Math.max(topLeft + 640, Math.round((top && top.right) || vw));
  const panelRect = panel && panel.getBoundingClientRect ? panel.getBoundingClientRect() : null;
  const left = Math.max(topLeft, Math.round((panelRect && panelRect.right) || topLeft) + 2);
  const topY = Math.max(0, Math.round(((top && top.bottom) || 48) + 6));
  const width = Math.max(640, topRight - left - 2);
  const height = Math.max(260, Math.floor(vh - topY - 4));
  return { left, top: topY, width, height };
}
function syncLeftPanelHeightToStageBottom(bounds) {
  const panel = getObjectsPanePanel() || findSettingsPanel();
  if (!panel || !bounds) return;
  const pr = panel.getBoundingClientRect();
  const panelTop = Number.isFinite(pr && pr.top) ? pr.top : bounds.top;
  const targetBottom = Math.round(bounds.top + bounds.height);
  const panelHeight = Math.max(260, Math.round(targetBottom - panelTop));
  document.documentElement.style.setProperty("--beinvt-left-pane-height", panelHeight + "px");
  panel.style.setProperty("height", panelHeight + "px", "important");
  panel.style.setProperty("min-height", panelHeight + "px", "important");
  panel.style.setProperty("max-height", panelHeight + "px", "important");
  panel.style.setProperty("overflow", "auto", "important");
}
function clearSyncedLeftPanelHeight() {
  const panel = getObjectsPanePanel() || findSettingsPanel();
  document.documentElement.style.removeProperty("--beinvt-left-pane-height");
  if (!panel) return;
  ["height", "min-height", "max-height"].forEach(prop => panel.style.removeProperty(prop));
}
function clearNormalStageFixedLayout(stage) {
  const el = stage || document.querySelector(".stageWrap") || ($("canvasHost") && $("canvasHost").parentElement);
  if (document.body) document.body.classList.remove("beinvt-stage-fixed");
  document.documentElement.style.removeProperty("--beinvt-stage-fixed-left");
  document.documentElement.style.removeProperty("--beinvt-stage-fixed-top");
  document.documentElement.style.removeProperty("--beinvt-stage-fixed-width");
  document.documentElement.style.removeProperty("--beinvt-stage-fixed-height");
  if (!el) return;
  ["position", "left", "top", "z-index", "transform", "will-change"].forEach(prop => el.style.removeProperty(prop));
}
function applyNormalStageFixedLayout() {
  const stage = document.querySelector(".stageWrap") || ($("canvasHost") && $("canvasHost").parentElement);
  if (!stage || leftPaneHidden) return;
  const b = normalStageFixedBounds();
  syncLeftPanelHeightToStageBottom(b);
  if (document.body) document.body.classList.add("beinvt-stage-fixed");
  document.documentElement.style.setProperty("--beinvt-stage-fixed-left", b.left + "px");
  document.documentElement.style.setProperty("--beinvt-stage-fixed-top", b.top + "px");
  document.documentElement.style.setProperty("--beinvt-stage-fixed-width", b.width + "px");
  document.documentElement.style.setProperty("--beinvt-stage-fixed-height", b.height + "px");
  stage.dataset.beinvtOuterCardTarget = b.width + "x" + b.height;
  stage.dataset.beinvtOuterCardWidthMode = "stableFixedBesideObjects";
  stage.style.setProperty("position", "fixed", "important");
  stage.style.setProperty("left", b.left + "px", "important");
  stage.style.setProperty("top", b.top + "px", "important");
  stage.style.setProperty("width", b.width + "px", "important");
  stage.style.setProperty("min-width", b.width + "px", "important");
  stage.style.setProperty("max-width", b.width + "px", "important");
  stage.style.setProperty("height", b.height + "px", "important");
  stage.style.setProperty("min-height", b.height + "px", "important");
  stage.style.setProperty("max-height", b.height + "px", "important");
  stage.style.setProperty("flex", "0 0 " + b.width + "px", "important");
  stage.style.setProperty("flex-basis", b.width + "px", "important");
  stage.style.setProperty("transform", "none", "important");
  stage.style.setProperty("will-change", "auto", "important");
  stage.style.setProperty("display", "flex", "important");
  stage.style.setProperty("visibility", "visible", "important");
  stage.style.setProperty("opacity", "1", "important");
  [$("canvasHost"), $("stageDataWrap"), $("stageLabelHost")].filter(Boolean).forEach(el => {
    el.style.setProperty("display", "flex", "important");
    el.style.setProperty("visibility", "visible", "important");
    el.style.setProperty("opacity", "1", "important");
  });
}
function hiddenObjectsStageBounds() {
  const top = topMenuBounds();
  const vw = viewportWidthNow();
  const vh = viewportHeightNow();
  const left = Math.max(0, Math.round((top && top.left) || 0));
  const topY = Math.max(0, Math.round(((top && top.bottom) || 48) + 6));
  const right = Math.max(left + 640, Math.round((top && top.right) || vw));
  const width = Math.max(640, right - left - 2);
  const height = Math.max(260, Math.floor(vh - topY - 4));
  return { left, top: topY, width, height };
}
function clearHiddenObjectsStageLayout(stage) {
  const el = stage || document.querySelector(".stageWrap") || ($("canvasHost") && $("canvasHost").parentElement);
  document.documentElement.style.removeProperty("--beinvt-hidden-stage-left");
  document.documentElement.style.removeProperty("--beinvt-hidden-stage-top");
  document.documentElement.style.removeProperty("--beinvt-hidden-stage-width");
  document.documentElement.style.removeProperty("--beinvt-hidden-stage-height");
  if (!el) return;
  ["position", "left", "top", "z-index", "transform", "will-change"].forEach(prop => el.style.removeProperty(prop));
}
function applyHiddenObjectsStageLayout() {
  const stage = document.querySelector(".stageWrap") || ($("canvasHost") && $("canvasHost").parentElement);
  if (!stage) return;
  const b = hiddenObjectsStageBounds();
  document.documentElement.style.setProperty("--beinvt-hidden-stage-left", b.left + "px");
  document.documentElement.style.setProperty("--beinvt-hidden-stage-top", b.top + "px");
  document.documentElement.style.setProperty("--beinvt-hidden-stage-width", b.width + "px");
  document.documentElement.style.setProperty("--beinvt-hidden-stage-height", b.height + "px");
  stage.dataset.beinvtOuterCardTarget = b.width + "x" + b.height;
  stage.dataset.beinvtOuterCardWidthMode = "hiddenObjectsFixed";
  stage.style.setProperty("position", "fixed", "important");
  stage.style.setProperty("left", b.left + "px", "important");
  stage.style.setProperty("top", b.top + "px", "important");
  stage.style.setProperty("width", b.width + "px", "important");
  stage.style.setProperty("min-width", b.width + "px", "important");
  stage.style.setProperty("max-width", b.width + "px", "important");
  stage.style.setProperty("height", b.height + "px", "important");
  stage.style.setProperty("min-height", b.height + "px", "important");
  stage.style.setProperty("max-height", b.height + "px", "important");
  stage.style.setProperty("flex", "0 0 " + b.width + "px", "important");
  stage.style.setProperty("flex-basis", b.width + "px", "important");
  stage.style.setProperty("transform", "none", "important");
  stage.style.setProperty("will-change", "auto", "important");
  stage.style.setProperty("display", "flex", "important");
  stage.style.setProperty("visibility", "visible", "important");
  stage.style.setProperty("opacity", "1", "important");
  [$("canvasHost"), $("stageDataWrap"), $("stageLabelHost")].filter(Boolean).forEach(el => {
    el.style.setProperty("display", "flex", "important");
    el.style.setProperty("visibility", "visible", "important");
    el.style.setProperty("opacity", "1", "important");
  });
}
function persistPreviewUiPrefs() {
  localStorage.setItem("beinvtShowObjectGuides", JSON.stringify(!!showObjectGuides));
  localStorage.setItem("beinvtLeftPaneHidden", JSON.stringify(!!leftPaneHidden));
}
function setObjectGuidesVisible(on) {
  showObjectGuides = !!on;
  persistPreviewUiPrefs();
  applyModeClass();
  syncControls();
  renderCanvas();
}
function setLeftPaneHidden(on) {
  const panel = getObjectsPanePanel();
  if (panel) panel.classList.add("beinvtSettingsPanel");
  leftPaneHidden = !!on;
  persistPreviewUiPrefs();
  if (document.body) document.body.classList.remove("beinvt-left-pane-hidden");
  applyModeClass();
  applyObjectsPaneVisibility();
  forceOuterCardSize();
  dockStageAwayFromLeftPanel();
  if (leftPaneHidden) applyHiddenObjectsStageLayout();
  renderCanvas();
  refreshDebugLayerLabelsSoon();
}
function updateTopbarUtilityButtons() {
  const leftBtn = $("leftPaneToggleBtn");
  if (leftBtn) {
    leftBtn.textContent = leftPaneHidden ? "Show Objects Pane" : "Hide Objects Pane";
    leftBtn.classList.toggle("good", !!leftPaneHidden);
  }
  const guidesBtn = $("objectGuidesTopBtn");
  if (guidesBtn) {
    guidesBtn.textContent = showObjectGuides ? "Hide Guides" : "Show Guides";
    guidesBtn.classList.toggle("good", !showObjectGuides);
  }
  updateThemeToggleButton();
  removeWorstCaseTestButton();
}
function ensureTopbarUtilityButtons(anchor) {
  const parent = anchor && anchor.parentNode;
  if (!parent) return;
  let leftBtn = $("leftPaneToggleBtn");
  if (!leftBtn) {
    leftBtn = document.createElement("button");
    leftBtn.id = "leftPaneToggleBtn";
    leftBtn.type = "button";
    leftBtn.className = "modeTab utilityTab";
    leftBtn.onclick = () => setLeftPaneHidden(!leftPaneHidden);
    parent.insertBefore(leftBtn, anchor.nextSibling);
  }
  let guidesBtn = $("objectGuidesTopBtn");
  if (!guidesBtn) {
    guidesBtn = document.createElement("button");
    guidesBtn.id = "objectGuidesTopBtn";
    guidesBtn.type = "button";
    guidesBtn.className = "modeTab utilityTab";
    guidesBtn.onclick = () => setObjectGuidesVisible(!showObjectGuides);
    parent.insertBefore(guidesBtn, leftBtn.nextSibling);
  }
  ensureThemeToggleButton();
  updateTopbarUtilityButtons();
}
function ensureModeTabs() {
  const sel = $("labelType");
  if (!sel) return;
  if (sel && !sel.querySelector('option[value="FIELD"]')) {
    const opt = document.createElement("option");
    opt.value = "FIELD";
    opt.textContent = "Field Labels";
    sel.appendChild(opt);
  }
  if ($("modeTabs")) {
    ensureTopbarUtilityButtons($("modeTabs"));
    updateTopbarUtilityButtons();
    return;
  }
  sel.style.display = "none";
  const tabs = document.createElement("div");
  tabs.id = "modeTabs";
  tabs.className = "modeTabs";
  tabs.innerHTML = '<button type="button" class="modeTab" data-mode="POT">Pot Stakes</button><button type="button" class="modeTab" data-mode="WRAP">Finished Trees</button><button type="button" class="modeTab" data-mode="FIELD">Field Labels</button><button type="button" class="modeTab" data-mode="SHIP">Shipping Labels</button>';
  sel.parentNode.insertBefore(tabs, sel.nextSibling);
  ensureTopbarUtilityButtons(tabs);
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
  if (panel.dataset.beinvtCleanPanel === "1" && panel.dataset.beinvtCleanPanelVersion === APP_VERSION) { applyObjectsPaneVisibility(); return; }
  panel.dataset.beinvtCleanPanel = "1";
  panel.dataset.beinvtCleanPanelVersion = APP_VERSION;
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
      </div>
    </section>
    <section class="beinvtCard" id="gridSection">
      <div class="beinvtCardHeader">Grid / Snap / Safe Zone</div>
      <div class="beinvtCardBody">
        <div class="checkRow">
          <label class="checkItem"><input id="safeToggle" type="checkbox"> Show Safe Zone</label>
          <label class="checkItem"><input id="objectGuidesToggle" type="checkbox"> Show Object Guides</label>
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
        <div id="labelSizePresetBox" style="margin-top:8px">
          <div class="smallNote" id="labelSizePresetNote"></div>
          <div class="buttonRow" id="labelSizePresetButtons" style="margin-top:6px"></div>
        </div>
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
  const hasControls = txt.includes("beinvt label designer") || txt.includes("pot stakes") || txt.includes("finished trees") || txt.includes("wrap ties") || txt.includes("field labels") || txt.includes("zoom") || txt.includes("print current") || txt.includes("print queue") || txt.includes("worst-case");
  return hasControls || !!el.querySelector("#modeTabs,#labelType,#zoom,#printLabel,#printQueue,#testMode,.modeTab,button");
}
function scoreTopControlBarCandidate(el) {
  const r = el.getBoundingClientRect();
  let score = Math.round(r.width * 10) - Math.round(r.top * 4) - Math.abs(Math.round(r.height) - 48);
  const txt = String(el.textContent || "").toLowerCase();
  if (txt.includes("beinvt label designer")) score += 9000;
  if (txt.includes("pot stakes") && (txt.includes("finished trees") || txt.includes("wrap ties") || txt.includes("field labels"))) score += 9000;
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
  const top = topMenuBounds();
  if (leftPaneHidden) return Math.max(0, Math.round((top && top.left) || 0) + gap);
  const panel = findSettingsPanel();
  if (panel) return Math.ceil(panel.getBoundingClientRect().right + gap);
  const stage = document.querySelector(".stageWrap") || ($("canvasHost") && $("canvasHost").parentElement);
  if (stage) return Math.max(0, Math.ceil(stage.getBoundingClientRect().left));
  return Math.max(0, Math.round((top && top.left) || 0) + gap);
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
  if (leftPaneHidden) return 0;
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
  // v8.6.22: Keep A visually stable. The stage/table was shifting left/right because
  // transform-based correction was recalculated during renders. Let the flex layout own
  // the physical left edge and only size A to the remaining top-menu width.
  const correction = 0;
  const actualLeft = naturalLeft;
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
  if (leftPaneHidden) {
    if (document.body) document.body.classList.remove("beinvt-left-pane-hidden");
    clearSyncedLeftPanelHeight();
    clearNormalStageFixedLayout(stage);
    applyHiddenObjectsStageLayout();
    return;
  }
  clearHiddenObjectsStageLayout(stage);
  applyNormalStageFixedLayout();
  applyPersistentDebugLayerSizes(false);
  return;

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
  stage.dataset.beinvtOuterCardShiftX = "0";

  stage.style.setProperty("box-sizing", "border-box", "important");
  stage.style.setProperty("position", "relative", "important");
  stage.style.setProperty("transform", "none", "important");
  stage.style.setProperty("will-change", "auto", "important");
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
  const stage = document.querySelector(".stageWrap") || ($("canvasHost") && $("canvasHost").parentElement);
  if (!stage) return;
  if (leftPaneHidden) {
    clearNormalStageFixedLayout(stage);
    applyHiddenObjectsStageLayout();
    return;
  }
  clearHiddenObjectsStageLayout(stage);
  applyNormalStageFixedLayout();
  applyPersistentDebugLayerSizes(false);
  return;
  const panel = findSettingsPanel();
  if (!panel) return;

  if (shouldForceOuterCardSize()) {
    forceOuterCardSize();
    applyPersistentDebugLayerSizes(false);
    return;
  }

  const metrics = outerCardLayoutMetrics(stage);
  const width = Math.max(300, metrics.availableWidth + Number(window.BEINVT_OUTER_CARD_EXTRA_WIDTH ?? OUTER_CARD_EXTRA_WIDTH ?? 0));
  const height = outerCardTargetHeight(stage);

  stage.dataset.beinvtOuterCardShiftX = "0";
  stage.style.setProperty("box-sizing", "border-box", "important");
  stage.style.setProperty("position", "relative", "important");
  stage.style.setProperty("transform", "none", "important");
  stage.style.setProperty("will-change", "auto", "important");
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
    "selectedName", "x", "y", "w", "h", "rot", "fontSize",
    "safeToggle", "safeMargin", "safeValue", "gridToggle", "snapToggle", "snapGridToggle", "gridPx", "snapPx",
    "printCalibration", "saveCalibration", "measuredW", "measuredH", "calStatus",
    "printWidthIn", "printHeightIn", "printOrientation", "resetPrintSize", "printSizeNote"
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
  if (isWrapLikeMode(labelType)) {
    return {
      WO_QR: labelType === "FIELD" ? "Row" : (labelType === "SHIP" ? "Internal ID QR" : "WO QR"), WO: "WO", CROP: "Crop", INTERNAL: "Internal ID", SCION: "Scion", SCION_PATENT: "Scion Patent",
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
  if ($("objectsModeNote")) $("objectsModeNote").textContent = labelType === "FIELD" ? "Field Label" : (labelType === "SHIP" ? "Shipping Label" : (labelType === "WRAP" ? "Finished Tree" : "Pot Stake"));
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
  const cfg = WRAP_LIKE_PREVIEW_CONFIG;
  const metaBelow = isWrapLikeMode(labelType) && cfg.metaBelowLabel !== false;
  const metaW = isWrapLikeMode(labelType) && !metaBelow ? 200 : 0;
  const metaH = labelType === "POT" ? 112 : (metaBelow ? Math.max(0, Number(cfg.metaBelowHeightPx || 44)) : 0);
  const availableW = isWrapLikeMode(labelType) ? hostW - metaW - 22 : hostW - 12;
  const availableH = labelType === "POT" ? hostH - metaH - 16 : hostH - metaH - 12;
  const maxByW = availableW / Math.max(1, s.w);
  const maxByH = availableH / Math.max(1, s.h);
  const hardMax = isWrapLikeMode(labelType) ? 5.0 : 2.15;
  // Wrap-like labels should stay full render-table width even when switching from 0.5in to 0.75in/1in height.
  // Height presets make the label taller, not narrower; the lower preview area has room to grow vertically.
  const fitRule = isWrapLikeMode(labelType) ? maxByW : Math.min(maxByW, maxByH);
  const max = clamp(Math.min(fitRule, hardMax), 0.35, hardMax);

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
  ensureThemeToggleButton();
  removeWorstCaseTestButton();
  cleanupTopbarExtraText();
  updateModeTabs();
  renderRows();
  renderCanvas();
  dockStageAwayFromLeftPanel();
  applyPersistentDebugLayerSizes(false);
  renderObjectPanel();
  syncControls();
  renderPresetList();
  renderLabelSizePresets();
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
  rows = baseRowsForMode(labelType).slice();
  const q = (($("stageSearch") && $("stageSearch").value) || ($("search") && $("search").value) || "").toLowerCase();
  if ($("search") && $("stageSearch") && $("search").value !== $("stageSearch").value) $("search").value = $("stageSearch").value;
  filteredRows = sortRowsLatestFirst(rows.filter(r => {
    if (labelType === "POT") {
      if (cleanDisplay(r.scion)) return false;
      if (POT_EXCLUDED_ACTIVITIES.some(rx => rx.test(cleanDisplay(r.act)))) return false;
    }
    if (labelType === "FIELD" && !isFieldPlantingRow(r)) return false;
    return Object.values(r).join(" ").toLowerCase().includes(q);
  }));
  if (currentRowIndex >= filteredRows.length) currentRowIndex = 0;
  const head = $("stageRowsHead");
  if (head) head.innerHTML = labelType === "POT" ? potHeaderHtml() : (labelType === "SHIP" ? shippingHeaderHtml() : wrapHeaderHtml());
  renderRowBody($("stageRowsBody"));
}
function potHeaderHtml() {
  return "<th style='width:14%'>WO</th><th style='width:28%'>Activity</th><th style='width:32%'>Item / Rootstock</th><th style='width:14%'>Color</th><th style='width:8%'>Labels</th><th style='width:4%'></th>";
}
function wrapHeaderHtml() {
  return "<th style='width:8%'>WO</th><th style='width:13%'>Activity</th><th style='width:11%'>Crop</th><th style='width:12%'>Scion</th><th style='width:12%'>Rootstock</th><th style='width:10%'>Scion Patent</th><th style='width:10%'>Rootstock Patent</th><th style='width:9%'>Internal ID</th><th style='width:8%'>Color</th><th style='width:4%'>Labels</th><th style='width:3%'></th>";
}
function shippingHeaderHtml() {
  return "<th style='width:12%'>Crop</th><th style='width:16%'>Scion</th><th style='width:14%'>Rootstock</th><th style='width:12%'>Tray Type</th><th style='width:12%'>Sales Format</th><th style='width:12%'>Scion Patent</th><th style='width:12%'>Rootstock Patent</th><th style='width:7%'>Color</th><th style='width:3%'></th>";
}
function cell(v) {
  return escapeHtml(capClean(v));
}
function buildRowHtml(r) {
  if (labelType === "POT") {
    return `<td>${cell(r.wo)}</td><td>${cell(r.act)}</td><td>${cell(derivedRootstock(r) || displayPotItem(r))}</td><td>${cell(r.labelColor)}</td><td>${escapeHtml(displayLabelsNeeded(r))}</td><td><button type="button">Add</button></td>`;
  }
  if (labelType === "SHIP") {
    return `<td>${cell(r.crop)}</td><td>${cell(wrapScionText(r))}</td><td>${cell(wrapRootstockText(r))}</td><td>${cell(r.trayType)}</td><td>${cell(r.salesFormat || r.shippingSuffix)}</td><td>${cell(r.scionPatent)}</td><td>${cell(r.rootstockPatent)}</td><td>${cell(r.labelColor)}</td><td><button type="button">Add</button></td>`;
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
function applyWrapLikeMetaPreviewLayout(meta, previewRow, zoom, s, frame) {
  if (!meta || !previewRow || !isWrapLikeMode(labelType)) return;
  const cfg = WRAP_LIKE_PREVIEW_CONFIG;
  if (cfg.metaBelowLabel === false) return;
  const rawScale = cfg.metaScaleWithZoom === false ? 1 : Number(zoom || 1);
  const scale = clamp(rawScale, Number(cfg.metaMinScale || 0.72), Number(cfg.metaMaxScale || 1.35));
  const labelVisibleW = Math.max(160, Math.ceil(Number(s && s.w || 480) * Number(zoom || 1)));
  const layoutW = Math.max(160, Math.ceil(labelVisibleW / Math.max(0.01, scale)));
  const leftLocked = (cfg.previewAlign || "left").toLowerCase() === "left";
  const align = leftLocked ? "flex-start" : "center";
  previewRow.style.setProperty("--beinvt-wrap-meta-gap", Math.max(0, Number(cfg.metaGapPx || 6)) + "px");
  previewRow.style.setProperty("align-items", align, "important");
  previewRow.style.setProperty("justify-content", align, "important");
  // For left-locked wrap-like labels, make the preview row exactly the visible label width.
  // This keeps the label and color/qty row glued together when hiding/showing objects pane.
  previewRow.style.setProperty("width", leftLocked ? (labelVisibleW + "px") : "100%", "important");
  previewRow.style.setProperty("max-width", "100%", "important");
  previewRow.style.setProperty("margin-left", leftLocked ? "0" : "auto", "important");
  previewRow.style.setProperty("margin-right", leftLocked ? "0" : "auto", "important");
  if (frame) {
    frame.style.setProperty("align-self", align, "important");
    frame.style.setProperty("margin-left", leftLocked ? "0" : "auto", "important");
    frame.style.setProperty("margin-right", leftLocked ? "0" : "auto", "important");
    frame.style.setProperty("max-width", "none", "important");
    // v8.6.35: stage itself scales from top-left so the visible label starts exactly
    // where the meta bar starts. This prevents the label from drifting/cropping left.
    frame.style.setProperty("transform-origin", "top left", "important");
  }
  meta.classList.add("stageMetaBelowLabel");
  // layoutW * scale = actual visible label width, so the color bar aligns exactly under the label.
  meta.style.setProperty("width", layoutW + "px", "important");
  meta.style.setProperty("min-width", layoutW + "px", "important");
  meta.style.setProperty("max-width", layoutW + "px", "important");
  meta.style.setProperty("align-self", align, "important");
  meta.style.setProperty("margin-left", leftLocked ? "0" : "auto", "important");
  meta.style.setProperty("margin-right", leftLocked ? "0" : "auto", "important");
  meta.style.setProperty("transform", "scale(" + scale.toFixed(3) + ")", "important");
  meta.style.setProperty("transform-origin", leftLocked ? "top left" : "top center", "important");
}

function renderCanvas() {
  const labelHost = ensureStageShell();
  if (!labelHost || !layout) return;
  labelHost.innerHTML = "";
  if (labelType === "POT") syncPotAutoLayout();
  if (isWrapLikeMode(labelType)) {
    applyWrapDataAwareStack(currentRow());
    enforceWrapQrTextClearance(currentRow());
  }
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
  meta.innerHTML = isShippingMode()
    ? `<span class="metaPill colorPill" style="background:${escapeHtml(cm.bg)};color:${escapeHtml(cm.fg)};border-color:${escapeHtml(cm.fg === "#ffffff" ? "rgba(255,255,255,.35)" : "rgba(17,24,39,.2)")}">Label Color <b style="color:${escapeHtml(cm.fg)}">${escapeHtml(cm.label)}</b></span>`
    : `<span class="metaPill colorPill" style="background:${escapeHtml(cm.bg)};color:${escapeHtml(cm.fg)};border-color:${escapeHtml(cm.fg === "#ffffff" ? "rgba(255,255,255,.35)" : "rgba(17,24,39,.2)")}">Label Color <b style="color:${escapeHtml(cm.fg)}">${escapeHtml(cm.label)}</b></span><span class="metaPill">Qty <b>${escapeHtml(displayLabelsNeeded(row))}</b></span>`;
  const frame = document.createElement("div");
  frame.className = "stageFrame";
  frame.style.width = Math.ceil(s.w * zoom) + "px";
  frame.style.height = Math.ceil(s.h * zoom) + "px";
  const stage = document.createElement("div");
  stage.className = "stageInner";
  stage.style.width = s.w + "px";
  stage.style.height = s.h + "px";
  stage.style.transform = `scale(${zoom})`;
  // v8.6.35: Use top-left scaling for the actual label so its visible left/right edges
  // match the Label Color / Qty bar exactly. The whole preview group is aligned by
  // its wrapper instead of letting the scaled label drift under the meta row.
  stage.style.transformOrigin = "0 0";
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
    Object.assign(obj.style, { left: o.x + "px", top: (isWrapLikeMode(labelType) && id === "LOGO" ? logoTopForRow(o, row) : o.y) + "px", width: o.w + "px", height: o.h + "px" });
    if (isWrapLikeMode(labelType)) obj.appendChild(makeWrapObjectInner(id, row, o));
    else if (id === "QR") renderQrInto(obj, row.wo);
    else obj.appendChild(makeTextInner(id, row, o));
    canvas.appendChild(obj);
    attachObjectEvents(obj);
  }
  if (isWrapLikeMode(labelType) && WRAP_LIKE_PREVIEW_CONFIG.metaBelowLabel !== false) {
    applyWrapLikeMetaPreviewLayout(meta, previewRow, zoom, s, frame);
    previewRow.appendChild(frame);
    previewRow.appendChild(meta);
  } else {
    previewRow.appendChild(meta);
    previewRow.appendChild(frame);
  }
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
function makeFieldRowInner(holder, o) {
  const inner = document.createElement("div");
  inner.className = "wrapTextInner fieldRowText";
  inner.dataset.textId = "ROW";
  inner.textContent = "ROW";
  const boxW = Math.max(1, Number((o && o.w) || 34));
  const boxH = Math.max(1, Number((o && o.h) || 44));
  const fs = Math.max(10, Math.min(13, Number((o && o.fontSize) || 13)));
  inner.style.position = "absolute";
  // Make a normal horizontal ROW word, then rotate the whole word sideways.
  // This prevents the previous stacked R / O / W portrait rendering.
  inner.style.left = ((boxW - boxH) / 2) + "px";
  inner.style.top = ((boxH - boxW) / 2) + "px";
  inner.style.width = boxH + "px";
  inner.style.height = boxW + "px";
  inner.style.display = "flex";
  // v8.6.28: align the sideways ROW word toward the visual left edge of the box.
  // Because the word is rotated -90deg, flex-start on the pre-rotated cross-axis
  // places it to the left visually while keeping ROW as one sideways word.
  inner.style.alignItems = "flex-start";
  inner.style.justifyContent = "center";
  inner.style.textAlign = WRAP_LIKE_PREVIEW_CONFIG.fieldRowTextAlign || "left";
  inner.style.fontFamily = "Times New Roman, Georgia, serif";
  inner.style.fontWeight = "900";
  inner.style.fontSize = fs + "px";
  inner.style.lineHeight = "1";
  inner.style.textTransform = "uppercase";
  inner.style.whiteSpace = "nowrap";
  inner.style.writingMode = "horizontal-tb";
  inner.style.textOrientation = "mixed";
  inner.style.letterSpacing = "0";
  inner.style.transformOrigin = "center center";
  inner.style.transform = "rotate(-90deg)";
  inner.style.padding = "2px 0 0 0";
  holder.appendChild(inner);
  return holder;
}
function makeWrapObjectInner(id, row, o) {
  const holder = document.createElement("div");
  holder.style.position = "absolute";
  holder.style.inset = "0";
  holder.style.overflow = "hidden";
  if (id === "WO_QR") { if (isFieldMode()) return makeFieldRowInner(holder, o); renderQrInto(holder, wrapLeftQrText(row)); return holder; }
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
  if (id === "ROOTSTOCK") {
    const rootText = wrapRootstockText(row);
    const shipSingle = shippingSingleLineInfo(row);
    inner.innerHTML = rootText && !shipSingle ? `<span class="wrapOn">on</span>${escapeHtml(rootText)}` : "";
  } else inner.textContent = text;
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
  // v8.6.48: Auto-fit is now display-only. It may temporarily shrink the visible
  // text so it does not overflow, but it never writes back to layout.objects[id].fontSize.
  // This keeps manually resized label fonts from snapping back after render/row change/print.
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

    const saved = Number(o.fontSize || (id === "ITEM" ? 30 : (id === "WEEK" ? 18 : 16)));
    const hi = Math.max(1, Math.min(saved, id === "ITEM" ? 96 : 48));
    let lo = 5;
    let low = lo;
    let high = Math.floor(hi);
    let best = Math.max(lo, Math.floor(hi));

    inner.style.fontSize = hi + "px";
    if (fits(inner)) {
      inner.style.fontSize = hi + "px";
      continue;
    }

    best = lo;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      inner.style.fontSize = mid + "px";
      if (fits(inner)) { best = mid; low = mid + 1; }
      else high = mid - 1;
    }
    inner.style.fontSize = best + "px";
  }
}
function autoFitWrapText() {
  // v8.6.48: Use the user's saved font size as the maximum and only shrink the
  // rendered DOM when needed. Do not overwrite o.fontSize.
  const ranges = {
    WO: [36, 5], CROP: [34, 4.2], INTERNAL: [36, 4.2],
    SCION: [42, 3.2], ROOTSTOCK: [42, 3.2],
    SCION_PATENT: [10, 2.6], ROOTSTOCK_PATENT: [10, 2.6], LOT: [11, 2.8], ADDRESS: [9, 2.6], WARNING: [5, 1.7]
  };
  for (const [id, range] of Object.entries(ranges)) {
    const obj = document.querySelector(`.obj[data-id="${id}"]`);
    const inner = obj && obj.querySelector(".wrapTextInner");
    const o = layout.objects[id];
    if (!obj || !inner || !o) continue;
    if (!inner.textContent.trim() && id !== "ADDRESS" && id !== "WARNING") continue;

    const saved = Number(o.fontSize || range[0]);
    const hi = Math.max(range[1], Math.min(saved, range[0]));
    const lo = range[1];
    let best = hi;

    inner.style.fontSize = hi.toFixed(1) + "px";
    if (fits(inner)) continue;

    best = lo;
    for (let fs = hi; fs >= lo; fs -= 0.2) {
      inner.style.fontSize = fs.toFixed(1) + "px";
      if (fits(inner)) { best = fs; break; }
    }
    inner.style.fontSize = best.toFixed(1) + "px";
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
  // v8.6.28: Keep Row / WO_QR inside the label bounds; use left-aligned Row text instead of negative X.
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
  if ($("safeToggle")) $("safeToggle").checked = showSafeZone;
  if ($("objectGuidesToggle")) $("objectGuidesToggle").checked = showObjectGuides;
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
    if (Number.isFinite(fs) && fs > 0) {
      o.fontSize = fs;
      o.manualFontSize = true;
    }
    o.fontFamily = "Times New Roman";
  }
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
function renderLabelSizePresets() {
  const box = $("labelSizePresetBox");
  const holder = $("labelSizePresetButtons");
  const note = $("labelSizePresetNote");
  if (!box || !holder) return;
  const current = labelSizeInches(labelType);
  const isPot = labelType === "POT";
  const options = isPot ? LABEL_SIZE_PRESET_CONFIG.potWidthPresets : LABEL_SIZE_PRESET_CONFIG.wrapHeightPresets;
  const currentValue = isPot ? current.widthIn : current.heightIn;
  if (note) {
    note.textContent = isPot
      ? `Pot stake width presets. Current print size: ${formatPresetInches(current.widthIn)}in × ${formatPresetInches(current.heightIn)}in.`
      : `${labelType === "SHIP" ? "Shipping" : (labelType === "FIELD" ? "Field" : "Finished tree")} label height presets. Current print size: ${formatPresetInches(current.widthIn)}in × ${formatPresetInches(current.heightIn)}in.`;
  }
  holder.innerHTML = "";
  options.forEach(v => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "sizePresetBtn" + (Math.abs(Number(v) - Number(currentValue)) < 0.001 ? " active" : "");
    btn.textContent = isPot ? `${formatPresetInches(v)}in Width` : `${formatPresetInches(v)}in Height`;
    btn.onclick = () => applyLabelSizePreset(v);
    holder.appendChild(btn);
  });
}
function applyLabelSizePreset(value) {
  const type = labelType;
  const oldSize = labelSizeInches(type);
  const numeric = Number(value || 0);
  if (!Number.isFinite(numeric) || numeric <= 0) return;
  const newSize = type === "POT"
    ? { widthIn: numeric, heightIn: oldSize.heightIn || (LABEL_SIZES.POT && LABEL_SIZES.POT.heightIn) || 5 }
    : { widthIn: oldSize.widthIn || 5, heightIn: numeric };
  if (Math.abs(oldSize.widthIn - newSize.widthIn) < 0.001 && Math.abs(oldSize.heightIn - newSize.heightIn) < 0.001) return;
  if (layout) {
    pushHistory();
    scaleLayoutForLabelSize(layout, type, oldSize, newSize);
    layout.labelSize = clone(newSize);
    if (isWrapLikeMode(type)) rebalanceWrapLikeQrLayout(layout, type);
  }
  saveLabelSizeInches(type, newSize);
  if (layout) saveWorkingLayout();
  resetZoomToAutoMax();
  renderAll();
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
function printFitRange(id) {
  const ranges = {
    WO: [36, 4.8], CROP: [34, 4.2], INTERNAL: [36, 4.2],
    SCION: [46, 3.2], ROOTSTOCK: [46, 3.2],
    SCION_PATENT: [10, 2.6], ROOTSTOCK_PATENT: [10, 2.6],
    LOT: [12, 2.8], ADDRESS: [10, 2.6], WARNING: [7, 1.7],
    ITEM: [96, 5], WEEK: [48, 5]
  };
  return ranges[id] || [48, 3];
}
function printFitAttrs(id, o) {
  const range = printFitRange(id);
  const max = Math.max(range[1], Math.min(Number(o && o.fontSize || range[0]), range[0]));
  const min = Math.max(1, Number(range[1] || 3));
  return `class="beinvtPrintFitText" data-fit-id="${escapeHtml(id)}" data-max-font="${max.toFixed(2)}" data-min-font="${min.toFixed(2)}"`;
}
function printAutoFitScript() {
  return `<script>
(function(){
  function n(v,f){v=parseFloat(v);return isFinite(v)?v:f;}
  function fits(el){return el.scrollWidth<=el.clientWidth+1&&el.scrollHeight<=el.clientHeight+1;}
  function fitOne(el){
    var hi=n(el.getAttribute('data-max-font'),n(getComputedStyle(el).fontSize,12));
    var lo=n(el.getAttribute('data-min-font'),2.5);
    if(hi<lo){var t=hi;hi=lo;lo=t;}
    var low=lo, high=hi, best=lo;
    el.style.fontSize=hi.toFixed(2)+'px';
    if(fits(el)) return;
    for(var i=0;i<24;i++){
      var mid=(low+high)/2;
      el.style.fontSize=mid.toFixed(2)+'px';
      if(fits(el)){best=mid;low=mid;} else {high=mid;}
    }
    el.style.fontSize=best.toFixed(2)+'px';
  }
  function fitAll(){document.querySelectorAll('.beinvtPrintFitText').forEach(fitOne);}
  function run(){fitAll();setTimeout(function(){fitAll();setTimeout(function(){window.print();},120);},80);}
  if(document.readyState==='complete') setTimeout(run,80);
  else window.addEventListener('load',function(){setTimeout(run,80);});
})();
<\/script>`;
}
function printRows(items) {
  if (labelType === "POT") applyPotAutoStack();
  autoFitAllText();
  const s = labelSizeInches(labelType);
  const b = sizePx();
  const win = window.open("", "_blank");
  let pages = "";
  items.forEach(item => {
    for (let i = 0; i < Math.max(1, item.qty || 1); i++) pages += renderPrintPage(item.row, b);
  });
  win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Print Labels</title><style>@page{size:${s.widthIn}in ${s.heightIn}in;margin:0}html,body{margin:0;padding:0;background:#fff}.page{position:relative;width:${b.w}px;height:${b.h}px;overflow:hidden;background:#fff;color:#000;page-break-after:always;break-after:page;transform-origin:0 0;transform:scale(${calibration.scaleX},${calibration.scaleY})}.beinvtPrintFitText{overflow:hidden}*{box-sizing:border-box}</style></head><body>${pages}${printAutoFitScript()}</body></html>`);
  win.document.close();
}
function renderPrintPage(row) {
  if (isWrapLikeMode(labelType)) {
    applyWrapDataAwareStack(row);
    enforceWrapQrTextClearance(row);
  }
  let out = '<div class="page">';
  for (const id of objectOrder()) {
    const o = layout.objects[id];
    if (!shouldRenderObject(id, row)) continue;
    if (!isWrapLikeMode(labelType) && id === "WEEK" && !row.week) continue;
    const top = isWrapLikeMode(labelType) && id === "LOGO" ? logoTopForRow(o, row) : o.y;
    const outer = `position:absolute;left:${o.x}px;top:${top}px;width:${o.w}px;height:${o.h}px;overflow:hidden;`;
    if (isWrapLikeMode(labelType)) out += `<div style="${outer}">${printWrapObjectInner(id, row, o)}</div>`;
    else if (id === "QR") out += `<div style="${outer}"><img src="${qrUrl(row.wo)}" style="width:100%;height:100%;object-fit:fill;image-rendering:pixelated"></div>`;
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
  return `<div ${printFitAttrs(id, o)} style="position:absolute;left:${left}px;top:${top}px;width:${w}px;height:${h}px;display:flex;align-items:${alignV(o.alignV)};justify-content:${alignH(o.alignH)};overflow:hidden;text-align:center;${wrap}text-transform:uppercase;font-family:'Times New Roman',Georgia,serif;font-weight:900;font-size:${o.fontSize || 16}px;transform-origin:center center;transform:rotate(${o.rot || 0}deg);">${escapeHtml(labelText(id, row))}</div>`;
}
function printWrapObjectInner(id, row, o) {
  if (id === "WO_QR" && isFieldMode()) {
    const boxW = Math.max(1, Number((o && o.w) || 34));
    const boxH = Math.max(1, Number((o && o.h) || 44));
    const fs = Math.max(10, Math.min(13, Number((o && o.fontSize) || 13)));
    const left = (boxW - boxH) / 2;
    const top = (boxH - boxW) / 2;
    return `<div style="position:absolute;left:${left}px;top:${top}px;width:${boxH}px;height:${boxW}px;display:flex;align-items:center;justify-content:center;text-align:center;font-family:'Times New Roman',Georgia,serif;font-weight:900;font-size:${fs}px;line-height:1;text-transform:uppercase;white-space:nowrap;writing-mode:horizontal-tb;text-orientation:mixed;color:#000;transform-origin:center center;transform:rotate(-90deg);">ROW</div>`;
  }
  if (id === "WO_QR") return `<img src="${qrUrl(wrapLeftQrText(row))}" style="width:100%;height:100%;object-fit:fill;image-rendering:pixelated">`;
  if (id === "LOT_QR") { const txt = wrapRightQrText(row); return txt ? `<img src="${qrUrl(txt)}" style="width:100%;height:100%;object-fit:fill;image-rendering:pixelated">` : ""; }
  if (id === "LOGO") {
    const urls = logoUrlsForRow(row);
    if (urls.length > 1) {
      const imgs = urls.map((url, idx) => `<img src="${escapeHtml(url)}" alt="${idx === 0 ? 'SG' : 'Geneva'}" style="width:100%;height:calc(50% - 1px);object-fit:contain;image-rendering:auto;display:block;" onerror="this.style.display='none'">`).join("");
      return `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;overflow:hidden;">${imgs}</div>`;
    }
    return `<img src="${escapeHtml(urls[0] || SG_LOGO_URL)}" style="width:100%;height:100%;object-fit:contain;image-rendering:auto" onerror="this.outerHTML='SG'">`;
  }
  const textAlign = o.alignH === "left" ? "left" : o.alignH === "right" ? "right" : "center";
  const lineHeight = (id === "WARNING") ? 1.0 : (id === "SCION" || id === "ROOTSTOCK" ? 0.94 : 0.98);
  const base = `position:absolute;inset:0;display:flex;align-items:${alignV(o.alignV)};justify-content:${alignH(o.alignH)};overflow:hidden;text-align:${textAlign};white-space:normal;word-break:normal;overflow-wrap:normal;font-family:'Times New Roman',Georgia,serif;font-weight:900;font-size:${o.fontSize || 8}px;line-height:${lineHeight};padding:0 1px;color:#000;`;
  if (id === "ROOTSTOCK") { const rootText = wrapRootstockText(row); const shipSingle = shippingSingleLineInfo(row); return (rootText && !shipSingle) ? `<div ${printFitAttrs(id, o)} style="${base}text-transform:uppercase"><span style="font-size:.68em;margin-right:.18em;text-transform:none!important;">on</span>${escapeHtml(rootText)}</div>` : ""; }
  if (id === "WARNING") return `<div ${printFitAttrs(id, o)} style="${base}white-space:pre-line;line-height:1.0;text-transform:uppercase;align-items:center;">${escapeHtml(WRAP_WARNING)}</div>`;
  return `<div ${printFitAttrs(id, o)} style="${base}text-transform:uppercase;">${escapeHtml(wrapObjectText(id, row))}</div>`;
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
  ensureThemeToggleButton();
  removeWorstCaseTestButton();
  bindDirectionalButtons();
  if ($("labelType")) $("labelType").onchange = ev => { labelType = ev.target.value; selectedId = defaultSelectedId(labelType); undoStack = []; redoStack = []; setLayout(loadWorkingLayout(labelType), false); };
  if ($("zoom")) $("zoom").oninput = function() { this.dataset.beinvtManualZoom = "1"; this.dataset.beinvtZoomMode = labelType; renderCanvas(); };
  if ($("search")) $("search").oninput = function () { if ($("stageSearch")) $("stageSearch").value = this.value; currentRowIndex = 0; renderRows(); renderCanvas(); };
  if ($("safeToggle")) $("safeToggle").onchange = ev => { showSafeZone = ev.target.checked; renderCanvas(); };
  if ($("objectGuidesToggle")) $("objectGuidesToggle").onchange = ev => { setObjectGuidesVisible(ev.target.checked); };
  if ($("gridToggle")) $("gridToggle").onchange = ev => { showGrid = ev.target.checked; renderCanvas(); };
  if ($("gridPx")) $("gridPx").onchange = applyControls;
  if ($("snapPx")) $("snapPx").onchange = applyControls;
  if ($("safeMargin")) $("safeMargin").onchange = applyControls;
  for (const id of ["x", "y", "w", "h", "rot", "fontSize"]) {
    const inp = $(id);
    if (inp) {
      inp.onchange = applyControls;
      inp.onkeydown = ev => { if (ev.key === "Enter") applyControls(); };
      if (id === "fontSize") {
        inp.oninput = ev => {
          if (!layout || !layout.objects || !layout.objects[selectedId] || isImageObject(selectedId)) return;
          const fs = Number(ev.target.value);
          if (!Number.isFinite(fs) || fs <= 0) return;
          layout.objects[selectedId].fontSize = fs;
          layout.objects[selectedId].manualFontSize = true;
          saveWorkingLayout();
          renderCanvas();
        };
      }
    }
  }
  if ($("savePreset")) $("savePreset").onclick = savePreset;
  if ($("loadPreset")) $("loadPreset").onclick = loadPreset;
  if ($("deletePreset")) $("deletePreset").onclick = deletePreset;
  if ($("exportLayout")) $("exportLayout").onclick = exportLayout;
  if ($("importLayout")) $("importLayout").onclick = importLayout;
  if ($("downloadLayout")) $("downloadLayout").onclick = downloadLayout;
  if ($("resetLayout")) $("resetLayout").onclick = resetLayout;
  if ($("printCalibration")) $("printCalibration").onclick = printCalibration;
  if ($("saveCalibration")) $("saveCalibration").onclick = saveCalibration;
  removeWorstCaseTestButton();
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
  window.addEventListener("resize", () => { if (leftPaneHidden) applyHiddenObjectsStageLayout(); else applyNormalStageFixedLayout(); applyZoomSliderCap($("stageLabelHost")); renderCanvas(); });
}

/* v8.6.44 GUI / DB / Import Printing improvements */
(function installGuiDbImportImprovementsV8644(){
  const MODE_STYLE_ID = "beinvt-v8644-gui-db-import-css";
  const PRESET_NOTES_PLACEHOLDER = "Used for Zebra printer, production layout, 1-inch wrap ties, etc.";

  function injectGuiDbCssV8644() {
    if (document.getElementById(MODE_STYLE_ID)) return;
    const css = `
      .modeTab[data-mode="POT"]{border-color:rgba(34,197,94,.55)!important;background:rgba(34,197,94,.18)!important;color:#dcfce7!important}
      .modeTab[data-mode="WRAP"]{border-color:rgba(59,130,246,.58)!important;background:rgba(59,130,246,.18)!important;color:#dbeafe!important}
      .modeTab[data-mode="FIELD"]{border-color:rgba(146,64,14,.60)!important;background:rgba(146,64,14,.20)!important;color:#fed7aa!important}
      .modeTab[data-mode="SHIP"]{border-color:rgba(168,85,247,.62)!important;background:rgba(168,85,247,.20)!important;color:#ede9fe!important}
      .modeTab[data-mode="POT"].active{background:#16a34a!important;border-color:#86efac!important;color:#fff!important;box-shadow:0 0 0 2px rgba(34,197,94,.24)!important}
      .modeTab[data-mode="WRAP"].active{background:#2563eb!important;border-color:#93c5fd!important;color:#fff!important;box-shadow:0 0 0 2px rgba(59,130,246,.24)!important}
      .modeTab[data-mode="FIELD"].active{background:#92400e!important;border-color:#fdba74!important;color:#fff!important;box-shadow:0 0 0 2px rgba(146,64,14,.24)!important}
      .modeTab[data-mode="SHIP"].active{background:#7e22ce!important;border-color:#d8b4fe!important;color:#fff!important;box-shadow:0 0 0 2px rgba(168,85,247,.24)!important}
      body.beinvt-light-theme .modeTab[data-mode="POT"]{background:#dcfce7!important;color:#14532d!important;border-color:#16a34a!important}
      body.beinvt-light-theme .modeTab[data-mode="WRAP"]{background:#dbeafe!important;color:#1e3a8a!important;border-color:#2563eb!important}
      body.beinvt-light-theme .modeTab[data-mode="FIELD"]{background:#ffedd5!important;color:#7c2d12!important;border-color:#92400e!important}
      body.beinvt-light-theme .modeTab[data-mode="SHIP"]{background:#f3e8ff!important;color:#581c87!important;border-color:#7e22ce!important}
      #stageRowsTable tr.active td{background:#2563eb!important;color:#fff!important;border-bottom-color:#1d4ed8!important;font-weight:900!important}
      #stageRowsTable tr.active:hover td{background:#1d4ed8!important;color:#fff!important}
      body.beinvt-light-theme #stageRowsTable tr.active td{background:#2563eb!important;color:#fff!important;border-bottom-color:#1e40af!important}
      .beinvtZoomPercent{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-width:48px!important;margin-left:6px!important;padding:5px 8px!important;border-radius:999px!important;border:1px solid rgba(255,255,255,.22)!important;background:#0d1022!important;color:#fff!important;font-weight:950!important;font-size:12px!important}
      body.beinvt-light-theme .beinvtZoomPercent{background:#eef2ff!important;color:#111827!important;border-color:rgba(15,23,42,.22)!important}
      .objectBtn .objectBtnTop{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:6px!important;width:100%!important}
      .objectBtn .objectIcons{display:inline-flex!important;gap:4px!important;align-items:center!important;font-size:13px!important;line-height:1!important}
      .objectIconBtn{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:22px!important;height:22px!important;border-radius:7px!important;border:1px solid rgba(255,255,255,.18)!important;background:rgba(255,255,255,.06)!important;cursor:pointer!important;user-select:none!important}
      .objectIconBtn:hover{background:rgba(255,255,255,.16)!important;transform:translateY(-1px)}
      .objectBtn .objectName{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .operatorHint{font-size:10px!important;color:#aeb7d5!important;font-weight:800!important;margin-top:3px!important}
      .queueToolbar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:8px}
      .queueColorGroup{border:1px solid rgba(255,255,255,.14);border-radius:12px;margin:8px 0;padding:8px;background:rgba(255,255,255,.035)}
      .queueColorGroupTitle{display:flex;align-items:center;justify-content:space-between;font-size:12px;font-weight:950;color:#fff;margin-bottom:6px}
      .queueItem{cursor:grab}
      .queueItem.dragging{opacity:.45;cursor:grabbing}
      .queueItem .dragHandle{font-size:16px;opacity:.75;margin-right:8px;cursor:grab}
      .queueItem .queueMain{display:flex;align-items:center;gap:6px;min-width:0;flex:1}
      .queueItem .queueText{min-width:0;overflow:hidden;text-overflow:ellipsis}
      .queueItem .queueActions{display:flex;gap:6px;align-items:center}
      .presetMetaGrid{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end;margin-top:8px}
      .presetMetaGrid textarea{width:100%;min-height:54px;resize:vertical;border:1px solid rgba(255,255,255,.14);background:#080b1a;color:#fff;border-radius:8px;padding:7px 8px;font-size:12px}
      .presetLockLabel{display:flex!important;align-items:center;gap:6px;white-space:nowrap;border:1px solid rgba(255,255,255,.14);border-radius:10px;padding:8px 10px;color:#e5e7eb;background:#0d1022;font-weight:900;font-size:12px}
      body.beinvt-light-theme .presetMetaGrid textarea,body.beinvt-light-theme .presetLockLabel{background:#fff!important;color:#111827!important;border-color:rgba(15,23,42,.18)!important}
      .importPrintOverlay{position:fixed;inset:0;z-index:1000000;display:none;align-items:center;justify-content:center;background:rgba(2,6,23,.62);backdrop-filter:blur(8px);padding:18px}
      .importPrintOverlay.open{display:flex}
      .importPrintModal{width:min(980px,96vw);max-height:92vh;overflow:auto;border:1px solid rgba(255,255,255,.18);border-radius:22px;background:linear-gradient(180deg,#151a35,#0b1024);color:#fff;box-shadow:0 24px 80px rgba(0,0,0,.58)}
      .importPrintHeader{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 20px;border-bottom:1px solid rgba(255,255,255,.12);background:rgba(15,20,42,.96);backdrop-filter:blur(10px)}
      .importPrintHeader h2{margin:0;font-size:20px;line-height:1.1}
      .importPrintHeader p{margin:4px 0 0;color:#aeb7d5;font-size:12px}
      .importPrintBody{padding:18px 20px;display:grid;grid-template-columns:1fr 1fr;gap:16px}
      .importPrintCard{border:1px solid rgba(255,255,255,.14);border-radius:16px;background:rgba(255,255,255,.04);padding:14px}
      .importPrintCard h3{margin:0 0 10px;font-size:14px}
      .importGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
      .importField label{display:block;font-size:11px;font-weight:900;color:#aeb7d5;margin:0 0 4px}
      .importField input,.importField select,.importField textarea{width:100%;border:1px solid rgba(255,255,255,.16);background:#070b1d;color:#fff;border-radius:10px;padding:9px 10px;font-size:13px}
      .importField textarea{min-height:160px;resize:vertical;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
      .importPrintFooter{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:16px 20px;border-top:1px solid rgba(255,255,255,.12);background:rgba(7,11,29,.86)}
      .importPrintFooter .buttonRow{justify-content:flex-end}
      .importPrimary{background:#2563eb!important;border-color:#93c5fd!important;color:#fff!important}
      .importClose{background:#111827!important}
      .importSample{min-height:96px;border:1px dashed rgba(255,255,255,.2);border-radius:12px;padding:10px;background:rgba(255,255,255,.03);font-size:12px;line-height:1.45;color:#e5e7eb}
      body.beinvt-light-theme .importPrintModal{background:#ffffff;color:#111827;border-color:rgba(15,23,42,.18)}
      body.beinvt-light-theme .importPrintHeader,body.beinvt-light-theme .importPrintFooter{background:rgba(255,255,255,.94);border-color:rgba(15,23,42,.14)}
      body.beinvt-light-theme .importPrintCard{background:#f8fafc;border-color:rgba(15,23,42,.12)}
      body.beinvt-light-theme .importField input,body.beinvt-light-theme .importField select,body.beinvt-light-theme .importField textarea{background:#fff;color:#111827;border-color:rgba(15,23,42,.18)}
      body.beinvt-light-theme .importSample{background:#f8fafc;color:#111827;border-color:rgba(15,23,42,.18)}
      @media(max-width:900px){.importPrintBody{grid-template-columns:1fr}.importGrid{grid-template-columns:1fr}}
    `;
    const tag = document.createElement("style");
    tag.id = MODE_STYLE_ID;
    tag.textContent = css;
    document.head.appendChild(tag);
  }

  function ensureZoomPercentV8644() {
    const zoom = $("zoom");
    if (!zoom || $("zoomPercent")) return;
    const span = document.createElement("span");
    span.id = "zoomPercent";
    span.className = "beinvtZoomPercent";
    span.textContent = "100%";
    zoom.insertAdjacentElement("afterend", span);
  }
  function updateZoomPercentV8644(value) {
    const zoom = $("zoom");
    const span = $("zoomPercent");
    const v = Number(value ?? (zoom && zoom.value) ?? 1);
    if (span) span.textContent = Math.round((Number.isFinite(v) ? v : 1) * 100) + "%";
  }

  function presetNotesFor(name) {
    const p = name && presets && presets[name];
    return cleanDisplay(p && (p.__presetNotes || p.presetNotes || ""));
  }
  function presetLockedFor(name) {
    const p = name && presets && presets[name];
    return !!(p && (p.__presetLocked || p.presetLocked));
  }
  function ensurePresetMetaControlsV8644() {
    const select = $("presetSelect");
    if (!select || $("presetNotes")) return;
    const wrap = document.createElement("div");
    wrap.className = "presetMetaGrid";
    wrap.innerHTML = `
      <div class="field"><label for="presetNotes">Preset Notes</label><textarea id="presetNotes" placeholder="${escapeHtml(PRESET_NOTES_PLACEHOLDER)}"></textarea></div>
      <label class="presetLockLabel"><input id="presetLocked" type="checkbox"> 🔒 Protect</label>
    `;
    const metaBox = $("labelSizePresetBox");
    if (metaBox) metaBox.insertAdjacentElement("afterend", wrap);
    else select.closest(".field").insertAdjacentElement("afterend", wrap);
    select.onchange = () => syncPresetMetaControlsV8644();
  }
  function syncPresetMetaControlsV8644() {
    const name = $("presetSelect") && $("presetSelect").value;
    if ($("presetNotes")) $("presetNotes").value = presetNotesFor(name);
    if ($("presetLocked")) $("presetLocked").checked = presetLockedFor(name);
  }

  function ensureQueueControlsV8644() {
    const qList = $("queueList");
    if (!qList || $("queueGroupColorToggle")) return;
    const toolbar = document.createElement("div");
    toolbar.className = "queueToolbar";
    toolbar.innerHTML = `<label class="checkItem"><input id="queueGroupColorToggle" type="checkbox"> Group by label color</label><span class="smallNote">Drag queue rows to change print order.</span>`;
    qList.parentElement.insertBefore(toolbar, qList);
    const chk = $("queueGroupColorToggle");
    if (chk) {
      chk.checked = readJson("beinvtQueueGroupByColor_v8644", false) === true;
      chk.onchange = () => {
        localStorage.setItem("beinvtQueueGroupByColor_v8644", JSON.stringify(!!chk.checked));
        renderQueue();
      };
    }
  }

  function modeColorNameV8644(type = labelType) {
    if (type === "POT") return "Pot Stake";
    if (type === "WRAP") return "Finished Tree";
    if (type === "FIELD") return "Field Label";
    if (type === "SHIP") return "Shipping Label";
    return type;
  }

  function objectDisplayNameV8644(id) {
    const mapWrap = {
      WO_QR: labelType === "FIELD" ? "Row Marker" : (labelType === "SHIP" ? "Resize Internal ID QR" : "Resize WO QR"),
      WO: "Move Work Order Text",
      CROP: "Move Crop Text",
      INTERNAL: "Move Internal ID Text",
      SCION: "Move Scion Text",
      SCION_PATENT: "Move Scion Patent Text",
      ROOTSTOCK: "Move Rootstock Text",
      ROOTSTOCK_PATENT: "Move Rootstock Patent Text",
      LOT: "Move Block / Lot Text",
      ADDRESS: "Move Nursery Address",
      LOT_QR: "Resize Lot QR",
      LOGO: "Logo Position",
      WARNING: "Warning Text"
    };
    const mapPot = {
      WO: "Move Work Order Text",
      QR: "Resize WO QR",
      ITEM: "Move Label Text",
      WEEK: "Move Week Text"
    };
    return (isWrapLikeMode(labelType) ? mapWrap : mapPot)[id] || id;
  }

  const originalObjectDisplayNameV8644 = objectDisplayName;
  objectDisplayName = function(id) {
    return objectDisplayNameV8644(id) || originalObjectDisplayNameV8644(id);
  };

  const originalRenderObjectPanelV8644 = renderObjectPanel;
  renderObjectPanel = function() {
    const panel = $("objectPanel");
    if (!panel || !layout || !layout.objects) return originalRenderObjectPanelV8644();
    if (!layout.objects[selectedId]) selectedId = defaultSelectedId(labelType);
    panel.innerHTML = "";
    if ($("objectsModeNote")) $("objectsModeNote").textContent = modeColorNameV8644(labelType);
    for (const id of objectOrder()) {
      const o = layout.objects[id];
      if (!o) continue;
      const visible = o.visible !== false;
      const locked = !!o.locked;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "objectBtn" + (selectedId === id ? " active" : "") + (!visible ? " hiddenObj" : "");
      btn.innerHTML = `<span class="objectBtnTop"><span class="objectName">${escapeHtml(objectDisplayName(id))}</span><span class="objectIcons" title="${visible ? "Visible" : "Hidden"} / ${locked ? "Locked" : "Unlocked"}"><span>${visible ? "👁️" : "🙈"}</span><span>${locked ? "🔒" : "🔓"}</span></span></span><span class="operatorHint">${visible ? "Visible" : "Hidden"} • ${locked ? "Locked" : "Unlocked"}</span>`;
      btn.onclick = () => selectObject(id, true);
      panel.appendChild(btn);
    }
  };

  const originalRenderPresetListV8644 = renderPresetList;
  renderPresetList = function() {
    const select = $("presetSelect");
    if (!select) return originalRenderPresetListV8644();
    const names = Object.keys(presets || {}).sort();
    select.innerHTML = '<option value="">Select saved preset...</option>' + names.map(n => `<option value="${escapeHtml(n)}">${presetLockedFor(n) ? "🔒 " : ""}${escapeHtml(n)}</option>`).join("");
    syncPresetMetaControlsV8644();
  };

  savePreset = function() {
    const defaultName = (layout && layout.name) || `${labelType} Custom`;
    const name = prompt("Preset name:", defaultName);
    if (!name) return;
    const existing = presets[name];
    if (existing && (existing.__presetLocked || existing.presetLocked)) {
      alert(`Preset "${name}" is protected. Unprotect it before overwriting.`);
      return;
    }
    layout.name = name;
    layout.__presetNotes = $("presetNotes") ? $("presetNotes").value : cleanDisplay(layout.__presetNotes);
    layout.__presetLocked = $("presetLocked") ? $("presetLocked").checked : !!layout.__presetLocked;
    presets[name] = clone(layout);
    localStorage.setItem("beinvtLayoutPresets", JSON.stringify(presets));
    renderPresetList();
  };
  loadPreset = function() {
    const name = $("presetSelect") && $("presetSelect").value;
    if (name && presets[name]) {
      setLayout(presets[name]);
      setTimeout(syncPresetMetaControlsV8644, 0);
    }
  };
  deletePreset = function() {
    const name = $("presetSelect") && $("presetSelect").value;
    if (!name) return;
    if (presetLockedFor(name)) {
      alert(`Preset "${name}" is protected and was not deleted.`);
      return;
    }
    if (confirm(`Delete preset "${name}"?`)) {
      delete presets[name];
      localStorage.setItem("beinvtLayoutPresets", JSON.stringify(presets));
      renderPresetList();
    }
  };

  const originalRenderQueueV8644 = renderQueue;
  renderQueue = function() {
    const holder = $("queueList");
    if (!holder) return originalRenderQueueV8644();
    ensureQueueControlsV8644();
    holder.innerHTML = "";
    if (!queue.length) { holder.innerHTML = '<div class="small">Queue is empty.</div>'; return; }
    const groupByColor = $("queueGroupColorToggle") && $("queueGroupColorToggle").checked;
    const groups = {};
    const order = [];
    queue.forEach(item => {
      const color = capClean(item.row && item.row.labelColor) || "NO COLOR";
      if (!groups[color]) { groups[color] = []; order.push(color); }
      groups[color].push(item);
    });
    const renderItem = (item) => {
      const d = document.createElement("div");
      d.className = "queueItem";
      d.draggable = true;
      d.dataset.queueId = item.id;
      const title = capClean((item.row && (item.row.wo || item.row.internalId || item.row.rootstock || item.row.scion || item.row.crop)) || "Manual Label");
      const subtitle = capClean(item.row && (item.row.scion || item.row.rootstock || item.row.crop || item.row.name));
      const color = capClean(item.row && item.row.labelColor) || "NO COLOR";
      d.innerHTML = `<div class="queueMain"><span class="dragHandle">☰</span><div class="queueText"><b>${escapeHtml(title)}</b><div class="small">${escapeHtml(subtitle)}</div><div class="small">${escapeHtml(color)} • Qty ${escapeHtml(item.qty || displayLabelsNeeded(item.row))}</div></div></div><div class="queueActions"><input type="number" min="1" value="${escapeHtml(item.qty)}"><button type="button" class="danger">x</button></div>`;
      d.querySelector("input").onchange = ev => { item.qty = Math.max(1, parseInt(ev.target.value || "1", 10) || 1); saveQueue(); };
      d.querySelector("button").onclick = () => { queue = queue.filter(x => x.id !== item.id); saveQueue(); renderQueue(); };
      d.addEventListener("dragstart", ev => { d.classList.add("dragging"); ev.dataTransfer.setData("text/plain", item.id); ev.dataTransfer.effectAllowed = "move"; });
      d.addEventListener("dragend", () => d.classList.remove("dragging"));
      d.addEventListener("dragover", ev => { ev.preventDefault(); ev.dataTransfer.dropEffect = "move"; });
      d.addEventListener("drop", ev => {
        ev.preventDefault();
        const draggedId = ev.dataTransfer.getData("text/plain");
        if (!draggedId || draggedId === item.id) return;
        const from = queue.findIndex(x => x.id === draggedId);
        const to = queue.findIndex(x => x.id === item.id);
        if (from < 0 || to < 0) return;
        const [moved] = queue.splice(from, 1);
        queue.splice(to, 0, moved);
        saveQueue();
        renderQueue();
      });
      return d;
    };
    if (groupByColor) {
      order.sort().forEach(color => {
        const box = document.createElement("div");
        box.className = "queueColorGroup";
        const count = groups[color].reduce((sum, x) => sum + Math.max(1, Number(x.qty || 1)), 0);
        box.innerHTML = `<div class="queueColorGroupTitle"><span>${escapeHtml(color)}</span><span>${count} label${count === 1 ? "" : "s"}</span></div>`;
        groups[color].forEach(item => box.appendChild(renderItem(item)));
        holder.appendChild(box);
      });
    } else {
      queue.forEach(item => holder.appendChild(renderItem(item)));
    }
  };

  const originalApplyZoomSliderCapV8644 = applyZoomSliderCap;
  applyZoomSliderCap = function(labelHost) {
    const z = originalApplyZoomSliderCapV8644(labelHost);
    updateZoomPercentV8644(z);
    return z;
  };

  const originalRenderAllV8644 = renderAll;
  renderAll = function() {
    originalRenderAllV8644();
    injectGuiDbCssV8644();
    ensureZoomPercentV8644();
    updateZoomPercentV8644();
    ensurePresetMetaControlsV8644();
    ensureQueueControlsV8644();
    ensureImportPrintingButtonV8644();
    updateOperatorLabelsV8644();
  };

  const originalEnsureLeftPanelV8644 = ensureLeftPanel;
  ensureLeftPanel = function() {
    originalEnsureLeftPanelV8644();
    ensurePresetMetaControlsV8644();
    ensureQueueControlsV8644();
    updateOperatorLabelsV8644();
  };

  const originalInitEventsV8644 = initEvents;
  initEvents = function() {
    originalInitEventsV8644();
    ensureImportPrintingButtonV8644();
    ensureZoomPercentV8644();
    if ($("presetSelect")) $("presetSelect").onchange = syncPresetMetaControlsV8644;
    if ($("queueGroupColorToggle")) $("queueGroupColorToggle").onchange = () => {
      localStorage.setItem("beinvtQueueGroupByColor_v8644", JSON.stringify($("queueGroupColorToggle").checked));
      renderQueue();
    };
  };

  const originalHasWrapObjectValueV8644 = hasWrapObjectValue;
  hasWrapObjectValue = function(id, row) {
    if (row && row.__importNoWo && (id === "WO" || id === "WO_QR" || id === "LOT" || id === "LOT_QR")) return false;
    return originalHasWrapObjectValueV8644(id, row);
  };
  const originalWrapObjectTextV8644 = wrapObjectText;
  wrapObjectText = function(id, row) {
    if (row && row.__importNoWo && id === "WO") return "";
    return originalWrapObjectTextV8644(id, row);
  };

  function updateOperatorLabelsV8644() {
    const pos = $("positionSection");
    if (pos) {
      const h = pos.querySelector(".beinvtCardHeader");
      if (h) h.textContent = "Move / Resize Selected Object";
    }
    const grid = $("gridSection");
    if (grid) {
      const h = grid.querySelector(".beinvtCardHeader");
      if (h) h.textContent = "Guides / Safe Print Area";
    }
    const labels = {
      x: "Move X",
      y: "Move Y",
      w: isImageObject(selectedId) ? "Resize Width" : "Text Box Width",
      h: isImageObject(selectedId) ? "Resize Height" : "Text Box Height",
      rot: "Rotate",
      fontSize: "Text Size",
      safeMargin: "Safe Margin",
      gridPx: "Grid Size",
      snapPx: "Snap Distance"
    };
    Object.entries(labels).forEach(([id, txt]) => {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) label.textContent = txt;
    });
  }

  function ensureImportPrintingButtonV8644() {
    if ($("importPrintingBtn")) return;
    const printQueueBtn = $("printQueue") || findTopbarButtonByText(/^print\s+queue$/i);
    const parent = (printQueueBtn && printQueueBtn.parentNode) || (($("modeTabs") && $("modeTabs").parentNode) || null);
    if (!parent) return;
    const btn = document.createElement("button");
    btn.id = "importPrintingBtn";
    btn.type = "button";
    btn.className = "modeTab utilityTab";
    btn.textContent = "Import Printing";
    btn.onclick = openImportPrintingModalV8644;
    if (printQueueBtn) parent.insertBefore(btn, printQueueBtn.nextSibling);
    else parent.appendChild(btn);
  }

  function ensureImportPrintingModalV8644() {
    let overlay = $("importPrintOverlay");
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.id = "importPrintOverlay";
    overlay.className = "importPrintOverlay";
    overlay.innerHTML = `
      <div class="importPrintModal" role="dialog" aria-modal="true" aria-labelledby="importPrintTitle">
        <div class="importPrintHeader">
          <div><h2 id="importPrintTitle">Import Printing</h2><p>Paste CSV/TSV data or type free-entry labels, then choose label style and size.</p></div>
          <button type="button" class="importClose" id="importPrintCloseTop">Close</button>
        </div>
        <div class="importPrintBody">
          <div class="importPrintCard">
            <h3>Label Setup</h3>
            <div class="importGrid">
              <div class="importField"><label for="importLabelType">Print As</label><select id="importLabelType"><option value="POT">Pot Stake</option><option value="WRAP">Wrap Tie</option></select></div>
              <div class="importField"><label for="importLabelSize">Label Size</label><select id="importLabelSize"></select></div>
              <div class="importField"><label for="importColor">Label Color</label><input id="importColor" placeholder="White, Blue, Pink..." value="White"></div>
              <div class="importField"><label for="importQty">Qty</label><input id="importQty" type="number" min="1" value="1"></div>
              <div class="importField"><label for="importSalesFormat">Sales Format</label><select id="importSalesFormat"><option value="">None</option><option>CN</option><option>QS</option><option>Liner</option><option>Bud</option></select></div>
              <div class="importField"><label for="importWo">WO</label><input id="importWo" placeholder="Optional"></div>
              <div class="importField"><label for="importCrop">Crop</label><input id="importCrop" placeholder="Cherry, Almond..."></div>
              <div class="importField"><label for="importInternal">Internal ID</label><input id="importInternal" placeholder="Optional"></div>
              <div class="importField"><label for="importScion">Scion / Custom Text</label><input id="importScion" placeholder="Custom text or scion"></div>
              <div class="importField"><label for="importRootstock">Rootstock</label><input id="importRootstock" placeholder="Rootstock or pot stake text"></div>
            </div>
          </div>
          <div class="importPrintCard">
            <h3>Paste CSV / TSV Data</h3>
            <div class="importField"><label for="importPaste">Accepted headers: crop, scion, rootstock, internal id, wo, color, qty, sales format</label><textarea id="importPaste" placeholder="Paste CSV or TSV here, or leave blank and use the free-entry fields."></textarea></div>
          </div>
          <div class="importPrintCard">
            <h3>Sample Behavior</h3>
            <div class="importSample" id="importSample">Pot Stake: rootstock/custom text only, no week number. Wrap Tie: crop/scion/rootstock/internal ID/WO when provided. If WO is blank, it prints like a shipping-style manual label without lot fields.</div>
          </div>
          <div class="importPrintCard">
            <h3>Parsed Rows</h3>
            <div class="importSample" id="importParsedRows">0 rows ready.</div>
          </div>
        </div>
        <div class="importPrintFooter">
          <span class="smallNote">Manual/import mode never requires lot fields.</span>
          <div class="buttonRow"><button type="button" id="importPrintPreviewBtn">Refresh Preview</button><button type="button" id="importPrintDoBtn" class="importPrimary">Print Imported Labels</button><button type="button" id="importPrintAddQueueBtn">Add to Queue</button><button type="button" id="importPrintCloseBottom">Cancel</button></div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    $("importPrintCloseTop").onclick = closeImportPrintingModalV8644;
    $("importPrintCloseBottom").onclick = closeImportPrintingModalV8644;
    $("importLabelType").onchange = () => { populateImportSizeOptionsV8644(); updateImportSampleV8644(); };
    ["importLabelSize","importColor","importQty","importSalesFormat","importWo","importCrop","importInternal","importScion","importRootstock","importPaste"].forEach(id => {
      const el = $(id);
      if (el) el.oninput = updateImportSampleV8644;
      if (el && el.tagName === "SELECT") el.onchange = updateImportSampleV8644;
    });
    $("importPrintPreviewBtn").onclick = updateImportSampleV8644;
    $("importPrintDoBtn").onclick = () => {
      const data = buildImportRowsV8644();
      if (!data.rows.length) { alert("Enter at least one manual row or paste CSV/TSV data."); return; }
      printImportRowsV8644(data.rows, data.type, data.size);
    };
    $("importPrintAddQueueBtn").onclick = () => {
      const data = buildImportRowsV8644();
      if (!data.rows.length) { alert("Enter at least one manual row or paste CSV/TSV data."); return; }
      data.rows.forEach(row => queue.push({ id: Date.now() + "_" + Math.random().toString(16).slice(2), row: clone(row), qty: Math.max(1, parseInt(row.labelsNeeded || "1", 10) || 1), importType: data.type, importSize: clone(data.size) }));
      saveQueue();
      renderQueue();
      closeImportPrintingModalV8644();
    };
    overlay.addEventListener("click", ev => { if (ev.target === overlay) closeImportPrintingModalV8644(); });
    return overlay;
  }

  function openImportPrintingModalV8644() {
    const overlay = ensureImportPrintingModalV8644();
    populateImportSizeOptionsV8644();
    updateImportSampleV8644();
    overlay.classList.add("open");
    setTimeout(() => { const el = $("importScion"); if (el) el.focus(); }, 30);
  }
  function closeImportPrintingModalV8644() {
    const overlay = $("importPrintOverlay");
    if (overlay) overlay.classList.remove("open");
  }
  function populateImportSizeOptionsV8644() {
    const type = ($("importLabelType") && $("importLabelType").value) || "POT";
    const select = $("importLabelSize");
    if (!select) return;
    const current = labelSizeInches(type);
    const opts = type === "POT"
      ? LABEL_SIZE_PRESET_CONFIG.potWidthPresets.map(w => ({ label: `${formatPresetInches(w)}in × 5in`, size: { widthIn: w, heightIn: current.heightIn || 5 } }))
      : LABEL_SIZE_PRESET_CONFIG.wrapHeightPresets.map(h => ({ label: `5in × ${formatPresetInches(h)}in`, size: { widthIn: 5, heightIn: h } }));
    select.innerHTML = opts.map(o => `<option value="${escapeHtml(JSON.stringify(o.size))}">${escapeHtml(o.label)}</option>`).join("");
    const match = opts.findIndex(o => Math.abs(o.size.widthIn - current.widthIn) < .001 && Math.abs(o.size.heightIn - current.heightIn) < .001);
    select.selectedIndex = match >= 0 ? match : 0;
  }
  function parseDelimitedImportV8644(text) {
    const raw = String(text || "").trim();
    if (!raw) return [];
    const lines = raw.split(/\r?\n/).filter(line => cleanDisplay(line));
    if (!lines.length) return [];
    const firstLine = lines[0] || "";
    const isTab = firstLine.includes("\t");
    const rows = isTab ? lines.map(line => line.split("\t")) : parseCsv(raw);
    if (!rows.length) return [];
    const headers = rows[0].map(h => cleanDisplay(h));
    const headerKeys = headers.map(normCsvKey);
    const acceptedHeaders = new Set([
      "crop", "scion", "rootstock", "rootstockitem", "rootstockname", "rootstocktext", "rootstockitemname", "rootstockstock",
      "rootstockid", "rootstockitemid", "rootstockitemnumber", "rootstocknumber", "rootstockvariety", "rootstockcultivar",
      "rootstockdescription", "rootstockpatent", "rootstockpatentnumber", "rootstockroyalty",
      "rootstockroyaltyfee", "rootstockpatentfee", "rootstockitemdescription", "rootstockitemname", "rootstockitem",
      "rootstock", "rootstock", "internal", "internalid", "id", "wo", "workorder", "color", "labelcolor", "qty", "quantity",
      "labels", "labelsneeded", "salesformat", "format", "custom", "customtext", "text"
    ]);
    const hasHeader = headerKeys.some(k => acceptedHeaders.has(k));
    const dataRows = hasHeader ? rows.slice(1) : rows;
    return dataRows.map(line => {
      const obj = {};
      if (hasHeader) {
        headers.forEach((h, i) => { obj[h || ("Column " + (i + 1))] = line[i] || ""; });
      } else {
        const cells = (line || []).map(v => cleanDisplay(v));
        obj.custom = cells[0] || "";
        obj.rootstock = cells[1] || "";
        obj.scion = cells[2] || "";
        obj["internal id"] = cells[3] || "";
        obj.wo = cells[4] || "";
        obj.crop = cells[5] || "";
      }
      obj.__hasImportHeader = hasHeader;
      return obj;
    }).filter(obj => Object.entries(obj).some(([k, v]) => k !== "__hasImportHeader" && cleanDisplay(v)));
  }
  function importValV8644(obj, names) {
    for (const name of names) {
      const hit = Object.keys(obj).find(k => normCsvKey(k) === normCsvKey(name));
      if (hit && cleanDisplay(obj[hit])) return cleanDisplay(obj[hit]);
    }
    return "";
  }
  function buildImportRowsV8644() {
    const type = ($("importLabelType") && $("importLabelType").value) || "POT";
    let size = labelSizeInches(type);
    try { size = JSON.parse(($("importLabelSize") && $("importLabelSize").value) || "{}"); } catch (e) {}
    const baseColor = cleanDisplay($("importColor") && $("importColor").value) || "White";
    const baseQty = Math.max(1, parseInt(($("importQty") && $("importQty").value) || "1", 10) || 1);
    const pasteRows = parseDelimitedImportV8644($("importPaste") && $("importPaste").value);
    const manualObj = {
      crop: cleanDisplay($("importCrop") && $("importCrop").value),
      scion: cleanDisplay($("importScion") && $("importScion").value),
      rootstock: cleanDisplay($("importRootstock") && $("importRootstock").value),
      internalId: cleanDisplay($("importInternal") && $("importInternal").value),
      wo: cleanDisplay($("importWo") && $("importWo").value),
      labelColor: baseColor,
      qty: baseQty,
      salesFormat: cleanDisplay($("importSalesFormat") && $("importSalesFormat").value),
      __hasImportHeader: false
    };
    const sourceRows = pasteRows.length ? pasteRows : [manualObj].filter(obj => Object.entries(obj).some(([k, v]) => k !== "__hasImportHeader" && cleanDisplay(v)));
    const rows = sourceRows.map(obj => {
      const crop = importValV8644(obj, ["Crop"]) || manualObj.crop;
      const explicitScion = importValV8644(obj, ["Scion", "Custom", "Custom Text", "Text"]);
      const explicitRootstock = importValV8644(obj, ["Rootstock", "Root Stock"]);
      const scion = explicitScion || manualObj.scion;
      const rootstock = explicitRootstock || manualObj.rootstock;
      const internalId = importValV8644(obj, ["Internal ID", "Internal", "ID"]) || manualObj.internalId;
      const wo = importValV8644(obj, ["WO", "Work Order"]) || manualObj.wo;
      const color = importValV8644(obj, ["Label Color", "Color"]) || baseColor;
      const qty = normalizeLabelCount(importValV8644(obj, ["Labels Needed", "Labels", "Qty", "Quantity"]) || baseQty);
      const sales = controlledSalesFormat(importValV8644(obj, ["Sales Format", "Format"]) || manualObj.salesFormat);
      const singleText = scion || rootstock || crop || internalId || wo || "CUSTOM";
      if (type === "POT") {
        const potText = rootstock || scion || crop || singleText;
        return {
          wo: wo || internalId || "",
          act: "MANUAL IMPORT",
          crop,
          scion: "",
          rootstock: potText,
          name: potText,
          internalId,
          lotNumber: "",
          scionPatent: "",
          rootstockPatent: "",
          labelColor: color,
          quantity: qty,
          labelsNeeded: qty,
          week: "",
          salesFormat: sales,
          __manualImport: true,
          __hideWeek: true
        };
      }
      return {
        wo,
        act: "MANUAL IMPORT",
        crop,
        scion,
        rootstock,
        name: [crop, scion, rootstock, sales].filter(Boolean).join(" | ") || singleText,
        internalId,
        lotNumber: "",
        scionPatent: "",
        rootstockPatent: "",
        labelColor: color,
        quantity: qty,
        labelsNeeded: qty,
        week: "",
        salesFormat: sales,
        __manualImport: true,
        __importHasScion: !!cleanDisplay(scion),
        __importHasRootstock: !!cleanDisplay(rootstock),
        __importNoWo: !cleanDisplay(wo),
        __importNoLot: true
      };
    });
    return { rows, type, size };
  }
  function updateImportSampleV8644() {
    const data = buildImportRowsV8644();
    const box = $("importParsedRows");
    if (box) {
      const preview = data.rows.slice(0, 5).map((r, i) => `${i + 1}. ${data.type === "POT" ? (r.rootstock || r.name) : [r.crop, r.scion, r.rootstock, r.internalId, r.wo].filter(Boolean).join(" / ")} (${r.labelColor}, qty ${r.labelsNeeded})`).join("<br>");
      box.innerHTML = data.rows.length ? `${data.rows.length} row${data.rows.length === 1 ? "" : "s"} ready.<br>${preview}` : "0 rows ready.";
    }
    const sample = $("importSample");
    if (sample) {
      sample.innerHTML = data.type === "POT"
        ? "Pot Stake mode: prints your rootstock/custom text in the pot stake layout. Week number is intentionally blank for imported/free-entry labels."
        : "Wrap Tie mode: uses Crop, Scion, Rootstock, Internal ID, and WO when supplied. If WO is blank, WO QR/WO text and lot fields are hidden so the left side shows Crop and Internal ID only.";
    }
  }
  function printImportRowsV8644(rows, type, size) {
    const oldType = labelType;
    const oldLayout = clone(layout);
    const oldSelected = selectedId;
    const oldSize = labelSizeInches(type);
    try {
      labelType = type;
      saveLabelSizeInches(type, size);
      selectedId = defaultSelectedId(type);
      layout = loadWorkingLayout(type);
      layout.labelSize = labelSizeInches(type);
      if (isWrapLikeMode(type)) rebalanceWrapLikeQrLayout(layout, type);
      printRows(rows.map(row => ({ row, qty: Math.max(1, parseInt(row.labelsNeeded || "1", 10) || 1) })));
    } finally {
      saveLabelSizeInches(type, oldSize);
      labelType = oldType;
      layout = oldLayout;
      selectedId = oldSelected;
      renderAll();
    }
  }

  const originalPrintQueueV8644 = printQueue;
  printQueue = function() {
    if (!queue.length) { alert("Queue is empty."); return; }
    const hasImportItems = queue.some(item => item && item.importType);
    if (!hasImportItems) return originalPrintQueueV8644();
    const groups = {};
    queue.forEach(item => {
      const type = item.importType || labelType;
      const size = item.importSize || labelSizeInches(type);
      const key = `${type}|${formatPresetInches(size.widthIn)}x${formatPresetInches(size.heightIn)}`;
      if (!groups[key]) groups[key] = { type, size, rows: [] };
      const row = clone(item.row || {});
      row.labelsNeeded = String(Math.max(1, parseInt(item.qty || row.labelsNeeded || "1", 10) || 1));
      row.quantity = row.labelsNeeded;
      groups[key].rows.push(row);
    });
    Object.values(groups).forEach(group => printImportRowsV8644(group.rows, group.type, group.size));
  };

  // Initialize immediately for already-rendered UI, then renderAll will keep it fresh.
  injectGuiDbCssV8644();
  setTimeout(() => {
    ensureZoomPercentV8644();
    ensurePresetMetaControlsV8644();
    ensureQueueControlsV8644();
    ensureImportPrintingButtonV8644();
    updateOperatorLabelsV8644();
    updateZoomPercentV8644();
  }, 0);
})();


/* v8.6.45 pot preview centering + clickable object icons + import header rules */
(function installPotCenterAndImportRulesV8645(){
  const STYLE_ID = "beinvt-v8645-pot-center-import-rules-css";
  function injectCssV8645() {
    if (document.getElementById(STYLE_ID)) return;
    const css = `
      body.beinvt-label-pot #stageLabelHost{
        align-items:center!important;
        justify-content:center!important;
        padding:8px!important;
      }
      body.beinvt-label-pot #stageLabelHost .stageStack{
        width:100%!important;
        height:100%!important;
        max-width:100%!important;
        align-items:center!important;
        justify-content:center!important;
      }
      body.beinvt-label-pot .labelPreviewRow.potPreviewRow{
        width:100%!important;
        max-width:100%!important;
        height:auto!important;
        flex-direction:column!important;
        align-items:center!important;
        justify-content:center!important;
        gap:8px!important;
        margin:0 auto!important;
      }
      body.beinvt-label-pot .labelPreviewRow.potPreviewRow .stageMeta{
        order:0!important;
        align-self:center!important;
        margin-left:auto!important;
        margin-right:auto!important;
        width:min(288px,100%)!important;
        max-width:288px!important;
      }
      body.beinvt-label-pot .labelPreviewRow.potPreviewRow .stageFrame{
        order:1!important;
        align-self:center!important;
        margin-left:auto!important;
        margin-right:auto!important;
        transform-origin:top center!important;
      }
      body.beinvt-label-pot .labelPreviewRow.potPreviewRow .stageInner{
        transform-origin:0 0!important;
      }
      .objectIconBtn{pointer-events:auto!important;}
      .objectIconBtn:focus{outline:2px solid rgba(147,197,253,.75)!important;outline-offset:1px!important;}
    `;
    const tag = document.createElement("style");
    tag.id = STYLE_ID;
    tag.textContent = css;
    document.head.appendChild(tag);
  }

  const previousRenderObjectPanel = renderObjectPanel;
  renderObjectPanel = function() {
    const panel = $("objectPanel");
    if (!panel || !layout || !layout.objects) return previousRenderObjectPanel();
    if (!layout.objects[selectedId]) selectedId = defaultSelectedId(labelType);
    panel.innerHTML = "";
    if ($("objectsModeNote")) $("objectsModeNote").textContent = isWrapLikeMode(labelType) ? (labelType === "SHIP" ? "Shipping Label" : (labelType === "FIELD" ? "Field Label" : "Finished Tree")) : "Pot Stake";
    for (const id of objectOrder()) {
      const o = layout.objects[id];
      if (!o) continue;
      const visible = o.visible !== false;
      const locked = !!o.locked;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "objectBtn" + (selectedId === id ? " active" : "") + (!visible ? " hiddenObj" : "");
      btn.innerHTML = `<span class="objectBtnTop"><span class="objectName">${escapeHtml(objectDisplayName(id))}</span><span class="objectIcons"><span class="objectIconBtn" role="button" tabindex="0" data-action="visible" title="${visible ? "Hide object" : "Show object"}">${visible ? "👁️" : "🙈"}</span><span class="objectIconBtn" role="button" tabindex="0" data-action="lock" title="${locked ? "Unlock object" : "Lock object"}">${locked ? "🔒" : "🔓"}</span></span></span><span class="operatorHint">${visible ? "Visible" : "Hidden"} • ${locked ? "Locked" : "Unlocked"}</span>`;
      btn.onclick = () => selectObject(id, true);
      btn.querySelectorAll(".objectIconBtn").forEach(icon => {
        const action = icon.getAttribute("data-action");
        const run = ev => {
          ev.preventDefault();
          ev.stopPropagation();
          selectedId = id;
          pushHistory();
          if (action === "visible") o.visible = o.visible === false;
          if (action === "lock") o.locked = !o.locked;
          saveWorkingLayout();
          renderObjectPanel();
          syncControls();
          renderCanvas();
        };
        icon.addEventListener("pointerdown", ev => ev.stopPropagation());
        icon.addEventListener("click", run);
        icon.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") run(ev); });
      });
      panel.appendChild(btn);
    }
  };

  const previousLabelText = labelText;
  labelText = function(id, row) {
    if (row && row.__manualImport) {
      if (id === "WEEK" && row.__hideWeek) return "";
      if (id === "ITEM") return capClean(row.rootstock || row.scion || row.name || row.crop || "CUSTOM");
      if (id === "WO") return capClean(row.wo || row.internalId || "");
    }
    return previousLabelText(id, row);
  };

  const previousHasWrapObjectValue = hasWrapObjectValue;
  hasWrapObjectValue = function(id, row) {
    if (row && row.__manualImport) {
      const scion = cleanDisplay(row.scion);
      const rootstock = cleanDisplay(row.rootstock);
      if (id === "SCION") return !!(scion || rootstock || cleanDisplay(row.crop) || cleanDisplay(row.name));
      if (id === "ROOTSTOCK") return !!(scion && rootstock);
      if (id === "SCION_PATENT" || id === "ROOTSTOCK_PATENT" || id === "LOT" || id === "LOT_QR") return false;
      if (row.__importNoWo && (id === "WO" || id === "WO_QR")) return false;
    }
    return previousHasWrapObjectValue(id, row);
  };

  const previousWrapObjectText = wrapObjectText;
  wrapObjectText = function(id, row) {
    if (row && row.__manualImport) {
      const scion = cleanDisplay(row.scion);
      const rootstock = cleanDisplay(row.rootstock);
      if (id === "SCION") return capClean(scion || rootstock || row.crop || row.name || "CUSTOM");
      if (id === "ROOTSTOCK") return scion && rootstock ? capClean(rootstock) : "";
      if (id === "SCION_PATENT" || id === "ROOTSTOCK_PATENT" || id === "LOT") return "";
      if (id === "WO") return capClean(row.wo);
      if (id === "CROP") return capClean(row.crop);
      if (id === "INTERNAL") return capClean(row.internalId);
    }
    return previousWrapObjectText(id, row);
  };

  const previousRenderAll = renderAll;
  renderAll = function() {
    previousRenderAll();
    injectCssV8645();
  };
  injectCssV8645();
})();

/* v8.6.58: Free Field Designer template + smaller warning fit. */
(function installFreeFieldDesignerV8658(){
  const FREE_TYPE = "FREE";
  const FREE_COPY_KEY = "beinvtFreeDesignerClipboard_v8658";
  const BARCODE_TYPES = ["code128", "code39", "ean13", "upca", "itf14", "datamatrix", "pdf417"];

  LABEL_SIZES.FREE = LABEL_SIZES.FREE || { widthIn: 4, heightIn: 2 };
  BASE_LABEL_SIZES.FREE = BASE_LABEL_SIZES.FREE || { widthIn: 4, heightIn: 2 };
  if (Array.isArray(OUTER_CARD_SIZE_CONFIG.applyTo) && !OUTER_CARD_SIZE_CONFIG.applyTo.includes(FREE_TYPE)) OUTER_CARD_SIZE_CONFIG.applyTo.push(FREE_TYPE);

  function isFreeMode(type = labelType) { return type === FREE_TYPE; }
  function freePrefixForType(type) { return type === "qr" ? "QR" : (type === "barcode" ? "BARCODE" : (type === "image" ? "IMAGE" : "TEXT")); }
  function freeObjectIds(layoutObj = layout) {
    if (!layoutObj || !layoutObj.objects) return [];
    const ids = Array.isArray(layoutObj.objectOrder) ? layoutObj.objectOrder.filter(id => layoutObj.objects[id]) : Object.keys(layoutObj.objects);
    Object.keys(layoutObj.objects).forEach(id => { if (!ids.includes(id)) ids.push(id); });
    return ids;
  }
  function freeDefaultObject(type, id, x, y) {
    if (type === "qr") return { type: "qr", x, y, w: 84, h: 84, rot: 0, value: "QR TEXT", locked: false, visible: true, alignH: "center", alignV: "middle" };
    if (type === "barcode") return { type: "barcode", x, y, w: 210, h: 58, rot: 0, value: "1234567890", barcodeType: "code128", showText: true, locked: false, visible: true, alignH: "center", alignV: "middle" };
    if (type === "image") return { type: "image", x, y, w: 120, h: 70, rot: 0, value: "", fit: "contain", locked: false, visible: true, alignH: "center", alignV: "middle" };
    return { type: "text", x, y, w: 210, h: 44, rot: 0, text: "TEXT FIELD", fontSize: 28, fontFamily: "Arial", bold: true, italic: false, underline: false, wrap: false, uppercase: false, autoFit: true, lineHeight: 1.0, letterSpacing: 0, locked: false, visible: true, alignH: "center", alignV: "middle" };
  }
  function normalizeFreeLayout(src) {
    const currentSize = labelSizeInches(FREE_TYPE);
    const base = {
      name: "Free Field Designer", labelType: FREE_TYPE, safeMarginPx: 4, gridPx: 4, snapPx: 4,
      labelSize: clone(currentSize), objectOrder: ["TEXT_1", "QR_1", "BARCODE_1"],
      objects: { TEXT_1: freeDefaultObject("text", "TEXT_1", 14, 12), QR_1: freeDefaultObject("qr", "QR_1", 242, 12), BARCODE_1: freeDefaultObject("barcode", "BARCODE_1", 14, 76) }
    };
    const sourceObjects = (src && src.objects) || base.objects;
    const ids = Array.isArray(src && src.objectOrder) && src.objectOrder.length ? src.objectOrder.slice() : Object.keys(sourceObjects);
    const out = Object.assign({}, base, src || {}, { labelType: FREE_TYPE, labelSize: clone(currentSize), objects: {}, objectOrder: [] });
    ids.forEach(id => {
      const incoming = sourceObjects[id]; if (!incoming) return;
      const type = incoming.type || (id.includes("QR") ? "qr" : (id.includes("BARCODE") ? "barcode" : "text"));
      const def = freeDefaultObject(type, id, Number(incoming.x || 10), Number(incoming.y || 10));
      const obj = Object.assign({}, def, incoming, { type });
      obj.x = Number(obj.x || 0); obj.y = Number(obj.y || 0); obj.w = Number(obj.w || def.w || 40); obj.h = Number(obj.h || def.h || 20); obj.rot = Number(obj.rot || 0);
      if (obj.type === "text") {
        obj.text = cleanDisplay(obj.text || obj.value || "TEXT FIELD");
        obj.fontSize = Math.max(1, Number(obj.fontSize || 24));
        obj.fontFamily = cleanDisplay(obj.fontFamily || "Arial");
        obj.lineHeight = Math.max(0.5, Math.min(3, Number(obj.lineHeight || 1)));
        obj.letterSpacing = Number(obj.letterSpacing || 0);
      } else obj.value = cleanDisplay(obj.value || obj.text || (obj.type === "barcode" ? "1234567890" : "QR TEXT"));
      out.objects[id] = obj; out.objectOrder.push(id);
    });
    if (!out.objectOrder.length) { out.objects.TEXT_1 = freeDefaultObject("text", "TEXT_1", 14, 12); out.objectOrder = ["TEXT_1"]; }
    return out;
  }
  function nextFreeId(type) { const p = freePrefixForType(type); let n = 1; while (layout && layout.objects && layout.objects[p + "_" + n]) n++; return p + "_" + n; }
  function freeObjectType(id) { const o = layout && layout.objects && layout.objects[id]; return (o && o.type) || "text"; }
  function freeHumanName(id) { const o = layout && layout.objects && layout.objects[id]; const type = (o && o.type) || "text"; return (type === "qr" ? "QR Code" : (type === "barcode" ? "Barcode" : (type === "image" ? "Image" : "Text"))) + " " + id.replace(/^[A-Z]+_?/, ""); }
  function barcodeUrl(value, type) { return "https://quickchart.io/barcode?type=" + encodeURIComponent(cleanDisplay(type || "code128").toLowerCase()) + "&text=" + encodeURIComponent(value || " "); }
  function freeTransformStyle(o) { const r = Number(o && o.rot || 0); return r ? "transform:rotate(" + r + "deg);transform-origin:center center;" : ""; }
  function safeFontName(v) { return cleanDisplay(v || "Arial").replace(/['";<>]/g, ""); }
  function freeTextCss(o, forPrint) {
    const textAlign = o.alignH === "left" ? "left" : (o.alignH === "right" ? "right" : "center");
    return "position:absolute;inset:0;display:flex;align-items:" + alignV(o.alignV) + ";justify-content:" + alignH(o.alignH) + ";overflow:hidden;text-align:" + textAlign + ";white-space:" + (o.wrap !== false ? "normal" : "nowrap") + ";word-break:normal;overflow-wrap:" + (o.wrap !== false ? "break-word" : "normal") + ";font-family:'" + safeFontName(o.fontFamily) + "',Arial,sans-serif;font-weight:" + (o.bold === false ? "400" : "900") + ";font-style:" + (o.italic ? "italic" : "normal") + ";text-decoration:" + (o.underline ? "underline" : "none") + ";font-size:" + Math.max(1, Number(o.fontSize || 24)) + "px;line-height:" + Math.max(0.5, Math.min(3, Number(o.lineHeight || 1))) + ";letter-spacing:" + Number(o.letterSpacing || 0) + "px;color:#000;text-transform:" + (o.uppercase ? "uppercase" : "none") + ";padding:" + (forPrint ? "0" : "0 1px") + ";" + freeTransformStyle(o);
  }
  function freeFitAttrs(id, o) { if (!o || o.type !== "text" || o.autoFit === false) return ""; const max = Math.max(1, Number(o.fontSize || 24)); const min = Math.max(1, Number(o.minFontSize || 3)); return "class=\"beinvtPrintFitText\" data-fit-id=\"" + escapeHtml(id) + "\" data-max-font=\"" + max.toFixed(2) + "\" data-min-font=\"" + min.toFixed(2) + "\""; }

  function makeFreeObjectInner(id, o) {
    const holder = document.createElement("div");
    holder.className = "freeObjectInner freeObjectType_" + (o.type || "text");
    holder.style.cssText = "position:absolute;inset:0;overflow:hidden;pointer-events:none;";
    if (o.type === "qr") { holder.style.cssText += freeTransformStyle(o); renderQrInto(holder, o.value || " "); return holder; }
    if (o.type === "barcode") {
      holder.style.cssText += freeTransformStyle(o);
      const img = document.createElement("img"); img.src = barcodeUrl(o.value || "1234567890", o.barcodeType || "code128"); img.alt = "Barcode"; img.style.cssText = "width:100%;height:100%;object-fit:fill;image-rendering:auto;";
      const fallback = document.createElement("div"); fallback.textContent = o.value || "1234567890"; fallback.style.cssText = "display:none;position:absolute;inset:0;align-items:center;justify-content:center;border:2px solid #000;font:900 12px Arial;color:#000;background:#fff;";
      img.onerror = () => { img.style.display = "none"; fallback.style.display = "flex"; };
      holder.appendChild(img); holder.appendChild(fallback); return holder;
    }
    if (o.type === "image") {
      holder.style.cssText += freeTransformStyle(o);
      if (cleanDisplay(o.value)) { const img = document.createElement("img"); img.src = o.value; img.alt = "Image"; img.style.cssText = "width:100%;height:100%;object-fit:" + (o.fit || "contain") + ";"; holder.appendChild(img); }
      return holder;
    }
    const inner = document.createElement("div"); inner.className = "freeTextInner"; inner.dataset.textId = id; inner.dataset.autofit = o.autoFit === false ? "false" : "true"; inner.textContent = o.text || ""; inner.style.cssText = freeTextCss(o, false); holder.appendChild(inner); return holder;
  }
  function printFreeObjectInner(id, o) {
    if (o.type === "qr") return '<div style="position:absolute;inset:0;overflow:hidden;' + freeTransformStyle(o) + '"><img src="' + qrUrl(o.value || " ") + '" style="width:100%;height:100%;object-fit:fill;image-rendering:pixelated"></div>';
    if (o.type === "barcode") return '<div style="position:absolute;inset:0;overflow:hidden;' + freeTransformStyle(o) + '"><img src="' + barcodeUrl(o.value || "1234567890", o.barcodeType || "code128") + '" style="width:100%;height:100%;object-fit:fill;image-rendering:auto"></div>';
    if (o.type === "image") return cleanDisplay(o.value) ? '<div style="position:absolute;inset:0;overflow:hidden;' + freeTransformStyle(o) + '"><img src="' + escapeHtml(o.value) + '" style="width:100%;height:100%;object-fit:' + escapeHtml(o.fit || "contain") + ';image-rendering:auto"></div>' : "";
    return '<div ' + freeFitAttrs(id, o) + ' style="' + freeTextCss(o, true) + '">' + escapeHtml(o.text || "") + '</div>';
  }
  function renderFreeCanvas() {
    const labelHost = ensureStageShell(); if (!labelHost || !layout) return;
    labelHost.innerHTML = ""; const dataWrap = $("stageDataWrap"); if (dataWrap) dataWrap.style.setProperty("display", "none", "important");
    const s = sizePx(FREE_TYPE); const zoom = applyZoomSliderCap(labelHost);
    const stack = document.createElement("div"); stack.className = "stageStack freeStageStack";
    const previewRow = document.createElement("div"); previewRow.className = "labelPreviewRow freePreviewRow";
    const frame = document.createElement("div"); frame.className = "stageFrame"; frame.style.width = Math.ceil(s.w * zoom) + "px"; frame.style.height = Math.ceil(s.h * zoom) + "px";
    const stage = document.createElement("div"); stage.className = "stageInner"; stage.style.width = s.w + "px"; stage.style.height = s.h + "px"; stage.style.transform = "scale(" + zoom + ")"; stage.style.transformOrigin = "0 0";
    const canvas = document.createElement("div"); canvas.className = "labelCanvas freeLabelCanvas"; canvas.style.width = s.w + "px"; canvas.style.height = s.h + "px";
    stage.appendChild(canvas); frame.appendChild(stage); if (showGrid) addGrid(canvas); if (showSafeZone) addSafeZone(canvas);
    freeObjectIds(layout).forEach(id => { const o = layout.objects[id]; if (!o || o.visible === false) return; const obj = document.createElement("div"); obj.className = "obj freeObj" + (selectedId === id ? " selected" : "") + (o.locked ? " locked" : ""); obj.dataset.id = id; Object.assign(obj.style, { left: o.x + "px", top: o.y + "px", width: o.w + "px", height: o.h + "px" }); obj.appendChild(makeFreeObjectInner(id, o)); canvas.appendChild(obj); attachObjectEvents(obj); });
    previewRow.appendChild(frame); stack.appendChild(previewRow); labelHost.appendChild(stack); autoFitFreeTextSoon(); applyPersistentDebugLayerSizes(false); refreshDebugLayerLabelsSoon();
  }
  function fitOneFreeText(el) { if (!el || el.dataset.autofit === "false") return; const obj = el.closest(".obj"); const o = obj && layout && layout.objects && layout.objects[obj.dataset.id]; if (!o || o.autoFit === false) return; const max = Math.max(1, Number(o.fontSize || 24)); const min = Math.max(1, Number(o.minFontSize || 3)); let low = min, high = max, best = min; el.style.fontSize = max + "px"; if (fits(el)) return; for (let i = 0; i < 24; i++) { const mid = (low + high) / 2; el.style.fontSize = mid.toFixed(2) + "px"; if (fits(el)) { best = mid; low = mid; } else high = mid; } el.style.fontSize = best.toFixed(2) + "px"; }
  function autoFitFreeText() { document.querySelectorAll(".freeTextInner").forEach(fitOneFreeText); }
  function autoFitFreeTextSoon() { autoFitFreeText(); requestAnimationFrame(autoFitFreeText); setTimeout(autoFitFreeText, 80); setTimeout(autoFitFreeText, 220); }

  const previousFallbackLayout = fallbackLayout; fallbackLayout = function(type) { return type === FREE_TYPE ? normalizeFreeLayout({ labelType: FREE_TYPE }) : previousFallbackLayout(type); };
  const previousNormalizeLayout = normalizeLayout; normalizeLayout = function(src) { return src && src.labelType === FREE_TYPE ? normalizeFreeLayout(src) : previousNormalizeLayout(src); };
  const previousObjectOrder = objectOrder; objectOrder = function(type = labelType) { return type === FREE_TYPE ? freeObjectIds(type === labelType ? layout : (DEFAULT_LAYOUTS.FREE || fallbackLayout(FREE_TYPE))) : previousObjectOrder(type); };
  const previousDefaultSelectedId = defaultSelectedId; defaultSelectedId = function(type = labelType) { return type === FREE_TYPE ? (objectOrder(FREE_TYPE)[0] || "TEXT_1") : previousDefaultSelectedId(type); };
  const previousIsImageObject = isImageObject; isImageObject = function(id) { return isFreeMode() ? ["qr", "barcode", "image"].includes(freeObjectType(id)) : previousIsImageObject(id); };
  const previousObjectDisplayName = objectDisplayName; objectDisplayName = function(id) { return isFreeMode() ? freeHumanName(id) : previousObjectDisplayName(id); };
  const previousApplyModeClass = applyModeClass; applyModeClass = function() { previousApplyModeClass(); if (document.body) document.body.classList.toggle("beinvt-label-free", isFreeMode()); };
  const previousEnsureModeTabs = ensureModeTabs; ensureModeTabs = function() { previousEnsureModeTabs(); const sel = $("labelType"); if (sel && !sel.querySelector('option[value="FREE"]')) { const opt = document.createElement("option"); opt.value = FREE_TYPE; opt.textContent = "Free Field"; sel.appendChild(opt); } const tabs = $("modeTabs"); if (tabs && !tabs.querySelector('[data-mode="FREE"]')) { const btn = document.createElement("button"); btn.type = "button"; btn.className = "modeTab"; btn.dataset.mode = FREE_TYPE; btn.textContent = "Free Field"; tabs.appendChild(btn); } };
  const previousRenderObjectPanel = renderObjectPanel; renderObjectPanel = function() { if (!isFreeMode()) return previousRenderObjectPanel(); const panel = $("objectPanel"); if (!panel || !layout || !layout.objects) return; if (!layout.objects[selectedId]) selectedId = defaultSelectedId(FREE_TYPE); panel.innerHTML = ""; if ($("objectsModeNote")) $("objectsModeNote").textContent = "Free Field"; freeObjectIds(layout).forEach(id => { const o = layout.objects[id]; const visible = o.visible !== false; const locked = !!o.locked; const btn = document.createElement("button"); btn.type = "button"; btn.className = "objectBtn" + (selectedId === id ? " active" : "") + (!visible ? " hiddenObj" : ""); btn.innerHTML = '<span class="objectBtnTop"><span class="objectName">' + escapeHtml(objectDisplayName(id)) + '</span><span class="objectIcons"><span class="objectIconBtn" role="button" tabindex="0" data-action="visible">' + (visible ? '👁️' : '🙈') + '</span><span class="objectIconBtn" role="button" tabindex="0" data-action="lock">' + (locked ? '🔒' : '🔓') + '</span></span></span><span class="operatorHint">' + (visible ? "Visible" : "Hidden") + " • " + (locked ? "Locked" : "Unlocked") + '</span>'; btn.onclick = () => selectObject(id, true); btn.querySelectorAll(".objectIconBtn").forEach(icon => { icon.onclick = ev => { ev.preventDefault(); ev.stopPropagation(); selectedId = id; pushHistory(); if (icon.dataset.action === "visible") o.visible = o.visible === false; if (icon.dataset.action === "lock") o.locked = !o.locked; saveWorkingLayout(); renderObjectPanel(); syncControls(); renderCanvas(); }; }); panel.appendChild(btn); }); };
  const previousRenderCanvas = renderCanvas; renderCanvas = function() { if (isFreeMode()) return renderFreeCanvas(); const dataWrap = $("stageDataWrap"); if (dataWrap) dataWrap.style.removeProperty("display"); return previousRenderCanvas(); };
  const previousAutoFitAllText = autoFitAllText; autoFitAllText = function() { return isFreeMode() ? autoFitFreeText() : previousAutoFitAllText(); };

  function freeControlsHtml() {
    const fonts = ["Arial", "Arial Black", "Times New Roman", "Georgia", "Verdana", "Tahoma", "Courier New", "Trebuchet MS", "Impact"].map(f => '<option value="' + escapeHtml(f) + '">' + escapeHtml(f) + '</option>').join("");
    const barcodes = BARCODE_TYPES.map(t => '<option value="' + escapeHtml(t) + '">' + escapeHtml(t.toUpperCase()) + '</option>').join("");
    return '<section class="beinvtCard" id="freeDesignerSection"><div class="beinvtCardHeader">Free Field Template <span class="smallNote">BarTender-style builder</span></div><div class="beinvtCardBody"><div class="compactGrid two"><div class="field"><label for="freeWidthIn">Label Width (in)</label><input id="freeWidthIn" type="number" min="0.2" max="12" step="0.01"></div><div class="field"><label for="freeHeightIn">Label Height (in)</label><input id="freeHeightIn" type="number" min="0.2" max="12" step="0.01"></div></div><div class="buttonRow" style="margin-top:8px"><button id="freeApplySize" type="button">Apply Label Size</button><button id="freeAddText" type="button">Add Text</button><button id="freeAddQr" type="button">Add QR</button><button id="freeAddBarcode" type="button">Add Barcode</button><button id="freeAddImage" type="button">Add Image URL</button></div><div class="field" style="margin-top:9px"><label for="freeObjText">Selected Text / QR / Barcode / Image URL</label><textarea id="freeObjText" style="min-height:70px;resize:vertical"></textarea></div><div class="compactGrid two" style="margin-top:8px"><div class="field"><label for="freeFontFamily">Font</label><select id="freeFontFamily">' + fonts + '</select></div><div class="field"><label for="freeBarcodeType">Barcode Type</label><select id="freeBarcodeType">' + barcodes + '</select></div></div><div class="compactGrid" style="margin-top:8px"><div class="field"><label for="freeAlignH">Horizontal Align</label><select id="freeAlignH"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></div><div class="field"><label for="freeAlignV">Vertical Align</label><select id="freeAlignV"><option value="top">Top</option><option value="middle">Middle</option><option value="bottom">Bottom</option></select></div><div class="field"><label for="freeLineHeight">Line Height</label><input id="freeLineHeight" type="number" min="0.5" max="3" step="0.05"></div><div class="field"><label for="freeLetterSpacing">Letter Space</label><input id="freeLetterSpacing" type="number" min="-5" max="20" step="0.1"></div></div><div class="checkRow" style="margin-top:9px"><label class="checkItem"><input id="freeBold" type="checkbox"> Bold</label><label class="checkItem"><input id="freeItalic" type="checkbox"> Italic</label><label class="checkItem"><input id="freeUnderline" type="checkbox"> Underline</label><label class="checkItem"><input id="freeWrap" type="checkbox"> Wrap Text</label><label class="checkItem"><input id="freeUppercase" type="checkbox"> Uppercase</label><label class="checkItem"><input id="freeAutoFit" type="checkbox"> Auto-fit to Box</label><label class="checkItem"><input id="freeShowBarcodeText" type="checkbox"> Barcode Text</label></div><div class="buttonRow" style="margin-top:9px"><button id="freeDuplicate" type="button">Duplicate</button><button id="freeCopy" type="button">Copy</button><button id="freePaste" type="button">Paste</button><button id="freeBringFront" type="button">Bring Front</button><button id="freeSendBack" type="button">Send Back</button><button id="freeDelete" class="danger" type="button">Delete</button></div><div class="smallNote" style="margin-top:8px">Tip: Ctrl+C / Ctrl+V copies and pastes selected boxes. Use Grid/Snap above for alignment.</div></div></section>';
  }
  function ensureFreeDesignerControls() { const panel = getObjectsPanePanel(); if (!panel || $("freeDesignerSection")) return; const pos = $("positionSection"); const wrap = document.createElement("div"); wrap.innerHTML = freeControlsHtml(); const sec = wrap.firstElementChild; if (pos && pos.parentElement) pos.parentElement.insertBefore(sec, pos.nextSibling); else panel.appendChild(sec); bindFreeDesignerControls(); }
  function bindFreeDesignerControls() { ["freeObjText", "freeFontFamily", "freeBarcodeType", "freeAlignH", "freeAlignV", "freeLineHeight", "freeLetterSpacing", "freeBold", "freeItalic", "freeUnderline", "freeWrap", "freeUppercase", "freeAutoFit", "freeShowBarcodeText"].forEach(id => { const el = $(id); if (!el) return; const evName = el.tagName === "TEXTAREA" || el.tagName === "INPUT" ? "input" : "change"; el.addEventListener(evName, applyFreeObjectControls); el.addEventListener("change", applyFreeObjectControls); }); const bind = (id, fn) => { const el = $(id); if (el) el.onclick = fn; }; bind("freeApplySize", applyFreeLabelSize); bind("freeAddText", () => addFreeObject("text")); bind("freeAddQr", () => addFreeObject("qr")); bind("freeAddBarcode", () => addFreeObject("barcode")); bind("freeAddImage", () => addFreeObject("image")); bind("freeDuplicate", duplicateFreeObject); bind("freeCopy", copyFreeObject); bind("freePaste", pasteFreeObject); bind("freeBringFront", () => moveFreeZ("front")); bind("freeSendBack", () => moveFreeZ("back")); bind("freeDelete", deleteFreeObject); }
  function updateFreeDesignerVisibility() { ensureFreeDesignerControls(); const sec = $("freeDesignerSection"); if (sec) sec.style.display = isFreeMode() ? "block" : "none"; const s = labelSizeInches(FREE_TYPE); if ($("freeWidthIn")) $("freeWidthIn").value = s.widthIn; if ($("freeHeightIn")) $("freeHeightIn").value = s.heightIn; }
  function syncFreeDesignerControls() { updateFreeDesignerVisibility(); if (!isFreeMode() || !layout || !layout.objects) return; const o = layout.objects[selectedId]; if (!o) return; if ($("freeObjText")) $("freeObjText").value = o.type === "text" ? (o.text || "") : (o.value || ""); if ($("freeFontFamily")) $("freeFontFamily").value = o.fontFamily || "Arial"; if ($("freeBarcodeType")) { $("freeBarcodeType").value = o.barcodeType || "code128"; $("freeBarcodeType").disabled = o.type !== "barcode"; } if ($("freeAlignH")) $("freeAlignH").value = o.alignH || "center"; if ($("freeAlignV")) $("freeAlignV").value = o.alignV || "middle"; if ($("freeLineHeight")) $("freeLineHeight").value = Number(o.lineHeight || 1); if ($("freeLetterSpacing")) $("freeLetterSpacing").value = Number(o.letterSpacing || 0); const textOnly = o.type === "text"; ["freeFontFamily", "freeLineHeight", "freeLetterSpacing", "freeBold", "freeItalic", "freeUnderline", "freeWrap", "freeUppercase", "freeAutoFit"].forEach(id => { if ($(id)) $(id).disabled = !textOnly; }); if ($("freeBold")) $("freeBold").checked = o.bold !== false; if ($("freeItalic")) $("freeItalic").checked = !!o.italic; if ($("freeUnderline")) $("freeUnderline").checked = !!o.underline; if ($("freeWrap")) $("freeWrap").checked = o.wrap !== false; if ($("freeUppercase")) $("freeUppercase").checked = !!o.uppercase; if ($("freeAutoFit")) $("freeAutoFit").checked = o.autoFit !== false; if ($("freeShowBarcodeText")) { $("freeShowBarcodeText").checked = o.showText !== false; $("freeShowBarcodeText").disabled = o.type !== "barcode"; } }
  function applyFreeLabelSize() { if (!isFreeMode()) return; const oldSize = labelSizeInches(FREE_TYPE); const w = normalizeInchesValue($("freeWidthIn") && $("freeWidthIn").value, oldSize.widthIn, 0.2, 12); const h = normalizeInchesValue($("freeHeightIn") && $("freeHeightIn").value, oldSize.heightIn, 0.2, 12); pushHistory(); saveLabelSizeInches(FREE_TYPE, { widthIn: w, heightIn: h }); if (layout) layout.labelSize = { widthIn: w, heightIn: h }; clampAllObjects(); resetZoomToAutoMax(); saveWorkingLayout(); renderAll(); }
  function addFreeObject(type) { if (!isFreeMode()) return; pushHistory(); const id = nextFreeId(type); const offset = freeObjectIds(layout).length * 8; layout.objects[id] = freeDefaultObject(type, id, 12 + (offset % 80), 12 + (offset % 60)); layout.objectOrder = freeObjectIds(layout).concat(id).filter((v, i, a) => a.indexOf(v) === i); selectedId = id; clampObject(id); saveWorkingLayout(); renderAll(); }
  function selectedFreeObjectClone() { return isFreeMode() && layout && layout.objects && layout.objects[selectedId] ? clone(layout.objects[selectedId]) : null; }
  function copyFreeObject() { const obj = selectedFreeObjectClone(); if (obj) localStorage.setItem(FREE_COPY_KEY, JSON.stringify(obj)); }
  function pasteFreeObject() { if (!isFreeMode()) return; let obj = null; try { obj = JSON.parse(localStorage.getItem(FREE_COPY_KEY) || "null"); } catch (e) {} if (!obj) return; pushHistory(); const id = nextFreeId(obj.type || "text"); obj.x = Number(obj.x || 0) + 10; obj.y = Number(obj.y || 0) + 10; layout.objects[id] = obj; layout.objectOrder = freeObjectIds(layout).concat(id).filter((v, i, a) => a.indexOf(v) === i); selectedId = id; clampObject(id); saveWorkingLayout(); renderAll(); }
  function duplicateFreeObject() { copyFreeObject(); pasteFreeObject(); }
  function deleteFreeObject() { if (!isFreeMode() || !layout || !layout.objects || !layout.objects[selectedId]) return; if (freeObjectIds(layout).length <= 1) { alert("Keep at least one object on the Free Field template."); return; } pushHistory(); delete layout.objects[selectedId]; layout.objectOrder = freeObjectIds(layout).filter(id => layout.objects[id]); selectedId = defaultSelectedId(FREE_TYPE); saveWorkingLayout(); renderAll(); }
  function moveFreeZ(where) { if (!isFreeMode() || !layout || !layout.objects[selectedId]) return; pushHistory(); const ids = freeObjectIds(layout).filter(id => id !== selectedId); layout.objectOrder = where === "front" ? ids.concat(selectedId) : [selectedId].concat(ids); saveWorkingLayout(); renderAll(); }
  function applyFreeObjectControls() { if (!isFreeMode() || !layout || !layout.objects || !layout.objects[selectedId] || window.beinvtFreeControlApplying) return; const o = layout.objects[selectedId]; pushHistory(); const textVal = $("freeObjText") ? $("freeObjText").value : ""; if (o.type === "text") o.text = textVal; else o.value = textVal; if (o.type === "text") { if ($("freeFontFamily")) o.fontFamily = $("freeFontFamily").value || "Arial"; if ($("freeLineHeight")) o.lineHeight = Number($("freeLineHeight").value || 1); if ($("freeLetterSpacing")) o.letterSpacing = Number($("freeLetterSpacing").value || 0); if ($("freeBold")) o.bold = $("freeBold").checked; if ($("freeItalic")) o.italic = $("freeItalic").checked; if ($("freeUnderline")) o.underline = $("freeUnderline").checked; if ($("freeWrap")) o.wrap = $("freeWrap").checked; if ($("freeUppercase")) o.uppercase = $("freeUppercase").checked; if ($("freeAutoFit")) o.autoFit = $("freeAutoFit").checked; } if (o.type === "barcode") { if ($("freeBarcodeType")) o.barcodeType = $("freeBarcodeType").value || "code128"; if ($("freeShowBarcodeText")) o.showText = $("freeShowBarcodeText").checked; } saveWorkingLayout(); renderCanvas(); }
  const previousSyncControls = syncControls; syncControls = function() { previousSyncControls(); window.beinvtFreeControlApplying = true; syncFreeDesignerControls(); window.beinvtFreeControlApplying = false; };
  const previousApplyControls = applyControls; applyControls = function() { if (!isFreeMode()) return previousApplyControls(); if (!layout || !layout.objects) return; if (!layout.objects[selectedId]) selectedId = defaultSelectedId(FREE_TYPE); const o = layout.objects[selectedId]; pushHistory(); for (const k of ["x", "y", "w", "h", "rot"]) { const inp = $(k); const val = Number(inp && inp.value); if (Number.isFinite(val)) o[k] = val; } const fs = Number($("fontSize") && $("fontSize").value); if (o.type === "text" && Number.isFinite(fs) && fs > 0) o.fontSize = fs; if ($("safeMargin")) layout.safeMarginPx = Number($("safeMargin").value || 0); if ($("gridPx")) layout.gridPx = Number($("gridPx").value || 4); if ($("snapPx")) layout.snapPx = Number($("snapPx").value || 4); clampObject(selectedId); saveWorkingLayout(); renderAll(); };
  const previousRenderAll = renderAll; renderAll = function() { previousRenderAll(); updateFreeDesignerVisibility(); };
  const previousPrintRows = printRows; printRows = function(items) { if (!isFreeMode()) return previousPrintRows(items); const s = labelSizeInches(FREE_TYPE); const b = sizePx(FREE_TYPE); const win = window.open("", "_blank"); const count = Math.max(1, (items && items.length) || 1); let pages = ""; for (let i = 0; i < count; i++) pages += renderFreePrintPage(); win.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Print Free Field Label</title><style>@page{size:' + s.widthIn + 'in ' + s.heightIn + 'in;margin:0}html,body{margin:0;padding:0;background:#fff}.page{position:relative;width:' + b.w + 'px;height:' + b.h + 'px;overflow:hidden;background:#fff;color:#000;page-break-after:always;break-after:page;transform-origin:0 0;transform:scale(' + calibration.scaleX + ',' + calibration.scaleY + ')}.beinvtPrintFitText{overflow:hidden}*{box-sizing:border-box}</style></head><body>' + pages + printAutoFitScript() + '</body></html>'); win.document.close(); };
  function renderFreePrintPage() { let out = '<div class="page">'; freeObjectIds(layout).forEach(id => { const o = layout.objects[id]; if (!o || o.visible === false) return; const outer = 'position:absolute;left:' + o.x + 'px;top:' + o.y + 'px;width:' + o.w + 'px;height:' + o.h + 'px;overflow:hidden;'; out += '<div style="' + outer + '">' + printFreeObjectInner(id, o) + '</div>'; }); return out + '</div>'; }

  const previousMakeWrapObjectInner = makeWrapObjectInner; makeWrapObjectInner = function(id, row, o) { if (id !== "WARNING") return previousMakeWrapObjectInner(id, row, o); const holder = document.createElement("div"); holder.style.cssText = "position:absolute;inset:0;overflow:hidden"; const inner = document.createElement("div"); inner.className = "wrapTextInner leftText smallText warningText"; inner.dataset.textId = id; inner.textContent = WRAP_WARNING; inner.style.fontSize = Math.max(1, Number(o.fontSize || 3.2) - 1) + "px"; inner.style.justifyContent = alignH(o.alignH); inner.style.alignItems = "center"; inner.style.textAlign = "left"; inner.style.lineHeight = "1"; holder.appendChild(inner); return holder; };
  const previousPrintWrapObjectInner = printWrapObjectInner; printWrapObjectInner = function(id, row, o) { if (id !== "WARNING") return previousPrintWrapObjectInner(id, row, o); const fs = Math.max(1, Number(o.fontSize || 3.2) - 1); const oo = Object.assign({}, o, { fontSize: fs }); const base = "position:absolute;inset:0;display:flex;align-items:center;justify-content:" + alignH(o.alignH) + ";overflow:hidden;text-align:left;white-space:pre-line;word-break:normal;overflow-wrap:normal;font-family:'Times New Roman',Georgia,serif;font-weight:900;font-size:" + fs + "px;line-height:1;padding:0 1px;color:#000;text-transform:uppercase;"; return '<div ' + printFitAttrs(id, oo) + ' style="' + base + '">' + escapeHtml(WRAP_WARNING) + '</div>'; };

  function injectFreeDesignerCss() { if ($("beinvt-v8658-free-designer-css")) return; const css = '.modeTab[data-mode="FREE"]{border-color:rgba(20,184,166,.65)!important;background:rgba(20,184,166,.20)!important;color:#ccfbf1!important}.modeTab[data-mode="FREE"].active{background:#0d9488!important;border-color:#5eead4!important;color:#fff!important;box-shadow:0 0 0 2px rgba(20,184,166,.18)!important}body.beinvt-label-free #stageDataWrap{display:none!important}body.beinvt-label-free #canvasHost{flex-direction:column!important;align-items:stretch!important;justify-content:stretch!important}body.beinvt-label-free #stageLabelHost{flex:1 1 auto!important;width:100%!important;height:100%!important;align-items:center!important;justify-content:center!important;padding:8px!important;display:flex!important;overflow:hidden!important}body.beinvt-stage-fixed.beinvt-label-free #stageDataWrap{display:none!important}body.beinvt-stage-fixed.beinvt-label-free #stageLabelHost{flex:1 1 auto!important;width:100%!important;height:100%!important;min-width:0!important;max-width:100%!important}body.beinvt-label-free .freeStageStack{width:100%!important;height:100%!important;align-items:center!important;justify-content:center!important;overflow:visible!important}body.beinvt-label-free .freePreviewRow{width:100%!important;max-width:100%!important;height:100%!important;align-items:center!important;justify-content:center!important;overflow:visible!important}.freeLabelCanvas{background:#fff!important}.freeObj .freeObjectInner img{display:block;width:100%;height:100%}#freeDesignerSection textarea{width:100%;border:1px solid rgba(255,255,255,.14);background:#080b1a;color:#fff;border-radius:8px;padding:7px 8px;font-size:13px;min-width:0}body.beinvt-light-theme #freeDesignerSection textarea{background:#fff!important;color:#111827!important;border-color:rgba(15,23,42,.22)!important}'; const tag = document.createElement("style"); tag.id = "beinvt-v8658-free-designer-css"; tag.textContent = css; document.head.appendChild(tag); }
  injectFreeDesignerCss();
  document.addEventListener("keydown", ev => { if (!isFreeMode()) return; const tag = document.activeElement && document.activeElement.tagName; if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return; const mod = ev.ctrlKey || ev.metaKey; if (mod && ev.key.toLowerCase() === "c") { ev.preventDefault(); copyFreeObject(); } if (mod && ev.key.toLowerCase() === "v") { ev.preventDefault(); pasteFreeObject(); } if ((ev.key === "Delete" || ev.key === "Backspace") && layout && layout.objects && layout.objects[selectedId]) { ev.preventDefault(); deleteFreeObject(); } }, true);
  window.BEINVT_FREE_DESIGNER = { add: addFreeObject, copy: copyFreeObject, paste: pasteFreeObject, duplicate: duplicateFreeObject, delete: deleteFreeObject };
})();

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

