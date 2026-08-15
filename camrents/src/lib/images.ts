/* ponytail: unified image sources — curated local product photography */

// ── Local fallback images ──
const SONY_BODY = "/sony_body.png";
const CANON_BODY = "/canon_body.png";
const NIKON_BODY = "/nikon_body.png";
const FUJI_BODY = "/fuji_body.png";
const CINEMA_CAM = "/sony_fx3.png";

const LENS_STANDARD = "/camera_lens.png";
const LENS_ZOOM = "/sony_24_70.png";
const LENS_TELEPHOTO = "/camera_lens.png";

const GIMBAL = "/camera_gimbal.png";
const FLASH = "/camera_flash.png";

export const IMAGES: Record<string, string | string[]> = {
  // Sony Bodies — mirrorless/cinema product shots
  "sony-a7iii": ["/sony_a7iii.png"],
  "sony-a7iv": ["/sony_a7iv.png"],
  "sony-fx3": [CINEMA_CAM],
  "sony-a7rv": ["/sony_a7rv.png"],

  // Sony Lenses — G Master series
  "sony-24-70-f2p8-gm2": [LENS_ZOOM],
  "sony-70-200-f2p8-gm2": [LENS_TELEPHOTO],
  "sony-50-f1p2-gm": [LENS_STANDARD],
  "sony-85-f1p4-gm": [LENS_STANDARD],

  // Canon Bodies
  "canon-r5": [CANON_BODY],
  "canon-r6-m2": [CANON_BODY],
  "canon-200d": [CANON_BODY],
  "canon-5d-m4": [CANON_BODY],

  // Canon Lenses
  "canon-rf-24-70-f2p8": [LENS_ZOOM],
  "canon-rf-70-200-f2p8": [LENS_TELEPHOTO],
  "canon-rf-50-f1p2": [LENS_STANDARD],
  "canon-ef-24-70-f2p8": [LENS_ZOOM],
  "canon-ef-70-200-f2p8": [LENS_TELEPHOTO],
  "canon-ef-50-f1p8": [LENS_STANDARD],

  // Nikon Bodies
  "nikon-z8": [NIKON_BODY],
  "nikon-z6-m2": [NIKON_BODY],
  "nikon-d850": [NIKON_BODY],

  // Nikon Lenses
  "nikon-z-24-70-f2p8": [LENS_ZOOM],
  "nikon-z-70-200-f2p8": [LENS_TELEPHOTO],
  "nikon-z-50-f1p8": [LENS_STANDARD],

  // Fujifilm
  "fujifilm-x-t5": [FUJI_BODY],
  "fuji-16-55-f2p8": [LENS_ZOOM],
  "fuji-50-140-f2p8": [LENS_TELEPHOTO],

  // Accessories
  "dji-rs3": [GIMBAL],
  "dji-rs3-pro": [GIMBAL],
  "godox-v860iii": [FLASH],

  hero: "/hero_bg.png",
  placeholder: "/camera_body.png",
} as const;
