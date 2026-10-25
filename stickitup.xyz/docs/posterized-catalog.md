# Posterized catalog integration

The poster source is https://www.posterized.in, explicitly confirmed by the user. Capture script: `node scripts/sync-posters.mjs --source https://www.posterized.in`.

Source records, all public variants, collection membership and original image URLs live under data/posters/. Product images are mirrored under public/poster-assets/. The sticker catalog is separate and unchanged. Endpoint checkpoints make interrupted captures resumable; remove checkpoints only when intentionally starting a new source snapshot.

The poster department uses the public captured catalog. Search, collections, sort, pagination, product details, all product photos and size/variant selectors are available. Purchases link to the original product on Posterized.in. Product photos can contain room scenes or multi-panel arrangements, so all AR appearances must be labelled product-photo previews, not clean print artwork.

`npm run build:poster-ar` generates one wall-plane GLB per captured source image and a same-origin normalized JPEG/PNG texture capped at 480 × 640. The GLB geometry is small and references its texture rather than embedding it, so all 2,642 models occupy only a few MB; the image textures are about 92 MB. Each preview starts at an estimated 30 cm width and can be resized in the AR viewer. This is not a print-size measurement or a cleaned-art extraction. The wall studio still composes multiple selected photos into one layout model on demand.

Wall studio retains templates, selection, keyboard movement, drag positioning, size/frame editing, room photos, browser-local saving and PNG export. Imported IDs use their own storage namespace so previous concept layouts remain untouched. Images are same-origin for canvas export and retain their aspect ratios.
