# BEINVT Label Designer v3

GitHub Pages-ready BarTender-style label designer.

## Included features

- Undo / redo stack
- Grid overlay
- Snap-to-grid
- Snap guides to label edges, centers, and other objects
- Multi-label print queue
- Quantity expansion for print jobs
- Browser layout presets
- Layout import/export/download JSON
- GitHub workflow scaffold for committing exported presets
- Print calibration helper
- Safe-zone overlay
- Object panel with lock/unlock and show/hide
- Editable X/Y/W/H/rotation/font-size controls
- Worst-case test mode
- Local QR fallback path using `vendor/qrcode.min.js`
- Data separated in `data/labels.csv`

## Run locally

```bash
python3 -m http.server 8080
```

Open:

```text
http://localhost:8080
```

## GitHub Pages

Upload the folder contents to a GitHub repo, then enable Pages from the repository settings.

## Data

CSV stays separate here:

```text
data/labels.csv
```

The workflow `.github/workflows/update-label-data.yml` refreshes it from the NetSuite CSV URL.

## Layouts

Bundled layout files:

```text
layouts/pot-standard.json
layouts/wrap-standard.json
```

Exported presets can be saved into `layouts/` and committed to GitHub.
