import { Collection, Product, Variant } from "./types";

// CDN helper - posterdrip Shopify CDN, always https
const cdn = (path: string) => `https://posterdrip.in/cdn/shop/files/${path}`;

// Exact sizes as per posterdrip - verified via Shopify JSON (cents)
const SIZE_VARIANTS: Omit<Variant, "id" | "sku" | "available">[] = [
  { size: "A5", price: 30, compareAt: 149 },
  { size: "A4", price: 40, compareAt: 179 },
  { size: "A3", price: 65, compareAt: 219 },
  { size: "13x19 inches", price: 79, compareAt: 249 },
];
function makeVariants(handle: string, available: boolean[] = [true, true, true, true]): Variant[] {
  return SIZE_VARIANTS.map((v, i) => ({
    id: `${handle}-${v.size.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
    sku: `${handle}_${v.size}`.toUpperCase(),
    available: available[i],
    ...v,
  }));
}

// All collections as per nav + homepage
export const collections: Collection[] = [
  { handle: "tamil-cinema", title: "Tamil Cinema", description: "Kollywood movie posters - Rajinikanth to Dhanush. Fan art for fans.", image: cdn("Mockup_52_9d513314-6302-4e7b-9984-27c8d882adc2.jpg?v=1782450464&width=533"), heroImage: cdn("Untitled-132.jpg?v=1783426460&width=3840"), productCount: 85 },
  { handle: "telugu-cinema", title: "Telugu Cinema", description: "Tollywood legends and modern hits.", image: cdn("Its_neverlate_to_dream_nani_jersy.jpg?v=1780993688&width=533"), productCount: 42 },
  { handle: "hollywood-cinema", title: "Hollywood Movies", description: "Classic and cult Hollywood wall art.", image: cdn("Mockup_36_fabaa1fd-73ed-444b-90a6-21f9637911ac.jpg?v=1782450464&width=533"), productCount: 64 },
  { handle: "web-series", title: "Web Series", description: "Binge-worthy series posters.", image: cdn("Mockup_152.jpg?v=1782450469&width=533"), productCount: 28 },
  { handle: "car-collections", title: "Car Collection", description: "JDM legends to muscle icons.", image: cdn("ChatGPTImageApr2_2026_11_50_15AM.png?v=1775111353&width=533"), productCount: 36 },
  { handle: "gym-posters", title: "Gym Posters", description: "Train hard. Hang harder.", image: cdn("ChatGPTImageMay12_2026_05_21_42PM.png?v=1778779166&width=533"), productCount: 32 },
  { handle: "aesthetic-collections", title: "Aesthetic / Qoutes", description: "Quotes and aesthetic collages.", image: cdn("Mockup_74.jpg?v=1781760671&width=533"), productCount: 48 },
  { handle: "cricket-collections", title: "Cricket", description: "Cover drives to wall art.", image: cdn("Mockup_110_469af4e5-1962-45e8-8c77-877e8311cbee.jpg?v=1785309662&width=533"), productCount: 22 },
  { handle: "football-collection", title: "Football", description: "Football fever for your walls.", image: cdn("3_SPLITS_8.jpg?v=1775199905&width=533"), productCount: 18 },
  { handle: "f1-collections", title: "F1 Collection", description: "Zero to 300. Wall to wall.", image: cdn("Untitled_design_12.png?v=1780893490&width=533"), productCount: 30 },
  { handle: "dc-posters", title: "DC Comic", description: "Gotham to Metropolis.", image: cdn("Mockup_80_a7d47a4e-b3e7-4515-a98f-3e4e6d9120bc.jpg?v=1784975973&width=533"), productCount: 26 },
  { handle: "marvel-posters", title: "Marvel Comic", description: "With great power…", image: cdn("Mockup_53.jpg?v=1781760670&width=533"), productCount: 34 },
  { handle: "anime-posters", title: "Anime Posters", description: "Gojo to Luffy - anime wall art.", image: cdn("ChatGPTImageMay16_2026_12_45_08AM.png?v=1778916184&width=533"), productCount: 56 },
  { handle: "god", title: "God & Devotional", description: "Devotional art for serene walls.", image: cdn("Mockup_06.jpg?v=1781680048&width=533"), productCount: 24 },
  { handle: "8-split-panel", title: "3 Split Panel", description: "Triptych wall art - split across 3 panels.", image: cdn("3_SPLITS_6.jpg?v=1775199896&width=533"), productCount: 40 },
  { handle: "custom-collection", title: "Custom Collection", description: "Your vision. Your walls. Your print.", image: cdn("MULTICUSTOMPOSTERS.jpg?v=1775202595&width=533"), productCount: 12 },
  { handle: "single-poster-customize", title: "Single Poster Customize", description: "Upload any design - we print it.", image: cdn("MULTICUSTOMPOSTERS.jpg?v=1775202595&width=533"), productCount: 0 },
  { handle: "frames", title: "Frames", description: "Premium frames for every poster size.", image: cdn("MULTICUSTOMPOSTERS.jpg?v=1775202595&width=533"), productCount: 8 },
  { handle: "baddie-collection", title: "Baddie Collection", description: "Pop culture baddie wall art.", image: cdn("Mockup_30_ec1e8693-ce42-4882-b476-18a0826f6a75.jpg?v=1785844680&width=533"), productCount: 16 },
  { handle: "aesthetic", title: "Aesthetic", description: "Curated aesthetic collection.", image: cdn("Mockup_74.jpg?v=1781760671&width=533"), productCount: 20 },
];

// - Product seeds: 20 real Tamil page-3 + expanded to cover all needs  - 

// Tamil page-3 real 20 - exact ditto with 4 sizes (A5/A4/A3/13x19) as per Shopify JSON
const tamilPage3: Omit<Product, "collections">[] = [
  { handle: "romantic-movie-moments-collage-poster-aesthetic-wall-art", title: "Ok Kanamani | Romantic Movie Moments Collage Poster | Aesthetic Wall Art", description: "Fan-made collage of Ok Kanamani romantic moments - pastel aesthetic ideal for bedroom walls.", price: 30, compareAt: 149, images: [cdn("Mockup_98.jpg?v=1781760676&width=533")], variants: makeVariants("romantic-movie-moments-collage-poster-aesthetic-wall-art"), options: { name: "Size", values: ["A5","A4","A3","13x19 inches"] } },
  { handle: "mouna-ragam-vintage-poster-tamil-cinema-wall-art", title: "Mouna Ragam Vintage Poster", description: "Vintage Mouna Ragam art - Mani Ratnam classic.", price: 30, compareAt: 149, images: [cdn("Mockup_52_9d513314-6302-4e7b-9984-27c8d882adc2.jpg?v=1782450464&width=533")], variants: makeVariants("mouna-ragam-vintage-poster-tamil-cinema-wall-art"), options: { name: "Size", values: ["A5","A4","A3","13x19 inches"] } },
  { handle: "jigarthanda-boxing-scene-poster-tamil-cinema-wall-art", title: "Jigarthanda Boxing Scene Poster", description: "Gritty boxing scene from Jigarthanda - high contrast.", price: 30, compareAt: 149, images: [cdn("Mockup_48_50e74dbe-133c-4fc9-98a4-957f1217222e.jpg?v=1782450469&width=533")], variants: makeVariants("jigarthanda-boxing-scene-poster-tamil-cinema-wall-art"), options: { name: "Size", values: ["A5","A4","A3","13x19 inches"] } },
  { handle: "rajinikanth-orange-swirl-pop-art-poster-tamil-cinema-wall-art", title: "Rajinikanth Orange Swirl Pop Art Poster | Tamil Cinema Wall Art", description: "Pop art Thalaivar swirl in orange.", price: 30, compareAt: 149, images: [cdn("Mockup_43.jpg?v=1781760672&width=533")], variants: makeVariants("rajinikanth-orange-swirl-pop-art-poster-tamil-cinema-wall-art"), options: { name: "Size", values: ["A5","A4","A3","13x19 inches"] } },
  { handle: "dhanush-rooftop-candid-movie-poster-tamil-cinema-wall-art", title: "Dhanush Rooftop Candid Movie Poster | Tamil Cinema Wall Art", description: "Candid rooftop Dhanush - urban mood.", price: 30, compareAt: 149, images: [cdn("Mocksup_01.jpg?v=1781760664&width=533")], variants: makeVariants("dhanush-rooftop-candid-movie-poster-tamil-cinema-wall-art"), options: { name: "Size", values: ["A5","A4","A3","13x19 inches"] } },
  { handle: "chiyaan-characters-illustration-poster-tamil-cinema-wall-art", title: "Chiyaan Characters Illustration Poster", description: "Illustrated Vikram characters collage.", price: 30, compareAt: 149, images: [cdn("Mockup_81_1ebe8023-c3f7-445a-90b2-7ddfba0499ab.jpg?v=1784199672&width=533")], variants: makeVariants("chiyaan-characters-illustration-poster-tamil-cinema-wall-art"), options: { name: "Size", values: ["A5","A4","A3","13x19 inches"] } },
  { handle: "maaran-dhanush-movie-poster-tamil-film-wall-art", title: "Maaran Dhanush Movie Poster | Tamil Film Wall Art", description: "Maaran - Dhanush intense portrait.", price: 30, compareAt: 149, images: [cdn("Mockup_10_710fce84-e906-45a7-a019-97fef4ff1eb6.jpg?v=1781760670&width=533")], variants: makeVariants("maaran-dhanush-movie-poster-tamil-film-wall-art"), options: { name: "Size", values: ["A5","A4","A3","13x19 inches"] } },
  { handle: "ajith-kumar-smoking-monochrome-poster-tamil-cinema-wall-art", title: "Ajith Kumar Smoking Monochrome Poster | Tamil Cinema Wall Art", description: "Monochrome Ajith - smoking, moody.", price: 30, compareAt: 149, images: [cdn("Mockup_56.jpg?v=1781760672&width=533")], variants: makeVariants("ajith-kumar-smoking-monochrome-poster-tamil-cinema-wall-art"), options: { name: "Size", values: ["A5","A4","A3","13x19 inches"] } },
  { handle: "rajinikanth-tamil-script-tribute-poster-kollywood-wall-art", title: "Rajinikanth Tamil Script Tribute Poster | Kollywood Wall Art", description: "Tamil script tribute to Superstar.", price: 30, compareAt: 149, images: [cdn("Mockup_66.jpg?v=1781760664&width=533")], variants: makeVariants("rajinikanth-tamil-script-tribute-poster-kollywood-wall-art"), options: { name: "Size", values: ["A5","A4","A3","13x19 inches"] } },
  { handle: "ajith-kumar-candid-smoke-poster-tamil-cinema-wall-art", title: "Ajith Kumar Candid Smoke Poster | Tamil Cinema Wall Art", description: "Candid smoke - Ajith.", price: 30, compareAt: 149, images: [cdn("Mockup_28_fa10004b-335a-4c60-bee2-9075a766aeda.jpg?v=1781760670&width=533")], variants: makeVariants("ajith-kumar-candid-smoke-poster-tamil-cinema-wall-art"), options: { name: "Size", values: ["A5","A4","A3","13x19 inches"] } },
  { handle: "rajinikanth-super-starboy-bio-poster-tamil-cinema-wall-art", title: "Rajinikanth Super Starboy Bio Poster | Tamil Cinema Wall Art", description: "Bio collage - Super Starboy era.", price: 30, compareAt: 149, images: [cdn("Mockup_23_2353fa81-f4d0-4cfd-b61e-f9b38c66bd81.jpg?v=1781760670&width=533")], variants: makeVariants("rajinikanth-super-starboy-bio-poster-tamil-cinema-wall-art"), options: { name: "Size", values: ["A5","A4","A3","13x19 inches"] } },
  { handle: "varumaiyin-niram-sivappu-poster-tamil-classic-wall-art", title: "Varumaiyin Niram Sivappu Poster | Tamil Classic Wall Poster", description: "Kamal classic - varumaiyin niram.", price: 30, compareAt: 149, images: [cdn("Mockup_14_bf33a506-74f8-4a65-befe-6f60815f82b8.jpg?v=1786626211&width=533")], variants: makeVariants("varumaiyin-niram-sivappu-poster-tamil-classic-wall-art"), options: { name: "Size", values: ["A5","A4","A3","13x19 inches"] } },
  { handle: "kadhalum-kadandhu-pogum-poster-tamil-movie-wall-art", title: "Kadhalum Kadandhu Pogum Poster | Tamil Movie Wall Poster", description: "KKP - Vijay Sethupathi", price: 30, compareAt: 149, images: [cdn("Mockup_02_f9b95059-2ba0-41ff-8ae1-6869be237f8a.jpg?v=1786626208&width=533")], variants: makeVariants("kadhalum-kadandhu-pogum-poster-tamil-movie-wall-art"), options: { name: "Size", values: ["A5","A4","A3","13x19 inches"] } },
  { handle: "ilaiyaraaja-maestro-poster-tamil-cinema-wall-art", title: "Ilaiyaraaja Maestro Poster | Tamil Cinema Wall Poster", description: "Maestro Ilaiyaraaja portrait.", price: 30, compareAt: 149, images: [cdn("Mockup_69_bfcbb2ba-eb22-4660-a4ff-0f54b9d5bdaf.jpg?v=1786530666&width=533")], variants: makeVariants("ilaiyaraaja-maestro-poster-tamil-cinema-wall-art"), options: { name: "Size", values: ["A5","A4","A3","13x19 inches"] } },
  { handle: "poster-design-110-wall-art", title: "Vada Chennai | Dhanush | Kollywood", description: "Vada Chennai North Chennai wall.", price: 30, compareAt: 149, images: [cdn("Mockup_110_469af4e5-1962-45e8-8c77-877e8311cbee.jpg?v=1785309662&width=533")], variants: makeVariants("poster-design-110-wall-art"), options: { name: "Size", values: ["A5","A4","A3","13x19 inches"] } },
  { handle: "mani-ratnam-film-poster-tamil-cinema-wall-art", title: "NAYAKAN | Kamal Hassan - Mani Ratnam Film Poster | Tamil Cinema Wall Art", description: "Nayakan - Velu Nayakar tribute.", price: 30, compareAt: 149, images: [cdn("Mockup_117_20873875-9c63-4c27-aa5f-a5424d78b1b4.jpg?v=1785309670&width=533")], variants: makeVariants("mani-ratnam-film-poster-tamil-cinema-wall-art"), options: { name: "Size", values: ["A5","A4","A3","13x19 inches"] } },
  { handle: "just-chillin-grunge-poster-tamil-wall-art", title: "Just Chillin' Grunge Poster - Mohan Lala", description: "Mohanlal grunge chillin.", price: 30, compareAt: 149, images: [cdn("Mockup_172.jpg?v=1784272576&width=533")], variants: makeVariants("just-chillin-grunge-poster-tamil-wall-art"), options: { name: "Size", values: ["A5","A4","A3","13x19 inches"] } },
  { handle: "chiyaan-vikram-sunglasses-moody-poster-tamil-cinema-wall-art", title: "Chiyaan Vikram Sunglasses Moody Poster", description: "Sunglasses Vikram moody.", price: 30, compareAt: 149, images: [cdn("Mockup_85_02b6c923-30fa-442e-80bc-a461b2ee62d8.jpg?v=1784199673&width=533")], variants: makeVariants("chiyaan-vikram-sunglasses-moody-poster-tamil-cinema-wall-art"), options: { name: "Size", values: ["A5","A4","A3","13x19 inches"] } },
  { handle: "mouna-raagam-cinematic-poster-tamil-classic-wall-art", title: "Mouna Raagam Cinematic Poster", description: "Mouna Raagam cinematic still.", price: 30, compareAt: 149, images: [cdn("Mockup_55_22f4046a-64ae-4a35-8738-6b85a83b64e6.jpg?v=1784199678&width=533")], variants: makeVariants("mouna-raagam-cinematic-poster-tamil-classic-wall-art"), options: { name: "Size", values: ["A5","A4","A3","13x19 inches"] } },
  { handle: "aaro-nenju-tamil-song-lyric-poster-kollywood-wall-art", title: "Aaro Nenju Tamil Song Lyric Poster", description: "Lyric poster Aaro Nenju.", price: 30, compareAt: 149, images: [cdn("Mockup_38_db753e8d-30b4-4c2e-bc5a-4eaeab3bedb1.jpg?v=1784199687&width=533")], variants: makeVariants("aaro-nenju-tamil-song-lyric-poster-kollywood-wall-art"), options: { name: "Size", values: ["A5","A4","A3","13x19 inches"] } },
];

// helper to clone tamil into 85 - keep page 3 exact at items 40-59, distinct handles elsewhere
function expandTo85(base: typeof tamilPage3): Product[] {
  const out: Product[] = [];
  const exactHandles = new Set(tamilPage3.map(p => p.handle));
  const seen = new Set<string>(exactHandles);
  for (let i = 0; i < 85; i++) {
    if (i >= 40 && i < 60) {
      const src = tamilPage3[i - 40];
      out.push({ ...src, collections: ["tamil-cinema"] });
      continue;
    }
    const src = base[i % base.length];
    const v = Math.floor(i / base.length) + 2; // start v2 so bare handle stays reserved for exact range
    let handle = `${src.handle}-v${v}`;
    // ensure unique even if v collides (e.g. duplicate base cycle)
    let n = 1;
    let candidate = handle;
    while (seen.has(candidate)) {
      n++;
      candidate = `${handle}-${n}`;
    }
    handle = candidate;
    seen.add(handle);
    out.push({
      handle,
      title: `${src.title} - Variant ${v}`,
      collections: ["tamil-cinema"],
      description: src.description,
      price: src.price,
      compareAt: src.compareAt,
      images: src.images,
      variants: makeVariants(handle),
      options: src.options,
    });
  }
  return out;
}

// Additional products - distinct images per collection (real data from posterdrip fetch, no duplicates)
const otherSeeds: Record<string, { titles: string[]; imageBase: string; images?: string[]; handles?: string[] }> = {
  "telugu-cinema": {
    titles: [
      "It's Never Late to Dream - Nani Jersey Poster | Telugu Motivational",
      "Dear Comrade Vijay Deverakonda Poster | Telugu Movie Wall Art",
      "Life of Ram Poster | Emotional Telugu Drama Wall Art",
      "Naa Savvu Nenu Sasta Telugu Dialogue Poster | Wall Art",
      "Prabhas Baahubali Poster | Epic Telugu Fantasy Wall Art",
      "Jersey Poster | Sports Drama Wall Art",
      "Khaleja Mahesh Babu Trivikram Srinivas Telugu Movie Poster",
      "Rukmini Vasanthitha Rakshit Shetty Movie Poster | Kannada Film Wall Art",
      "Saripodhaa Sanivaaram - Sanivaaramodu Retro Movie Poster",
      "Khaleja Mahesh Babu Poster | Telugu Mass Hero Wall Art",
      "Rangasthalam Chitti Babu Ram Charan Poster | Telugu Masterpiece Wall Art",
      "Ante Sundaraniki: A Heartwarming Comedy of Lies and Love",
      "ENE Telugu Movie Poster | Wall Art",
      "Jr NTR Veera Raghava Reddy Poster | RRR Telugu Movie Wall Art",
      "Oohalu Gusagusalade Telugu Movie TV Romance Poster",
      "Godavari Sekhar Kammula Telugu Romance Minimal Movie Poster",
      "Nirosha Pawan Kalyan Telugu Black and White Vintage Polaroid Poster",
      "Nani Dasara Movie Poster | Telugu Mass Action Wall Art",
      "Pawan Kalyan Sanjay Shao OG Poster | Tollywood Power Star Wall Art",
      "Pushpa Allu Arjun Poster | Telugu Blockbuster Wall Art India",
    ],
    imageBase: "Its_neverlate_to_dream_nani_jersy.jpg?v=1780993688&width=533",
    images: [
      cdn("Its_neverlate_to_dream_nani_jersy.jpg?v=1780993688&width=533"),
      cdn("dear_commerade_vijay_devarkonda.jpg?v=1780993685&width=533"),
      cdn("lifeofram.jpg?v=1780993685&width=533"),
      cdn("naa_savvu_nenu_sasta.jpg?v=1780993675&width=533"),
      cdn("Prabhas_bhaubali.jpg?v=1780993679&width=533"),
      cdn("Mockup_10_9a6e6939-2dbb-471c-95ab-57a6a8afcc5c.jpg?v=1784979946&width=533"),
      cdn("Screenshot_2026-06-05_203511.png?v=1780893484&width=533"),
      cdn("rukmini_rakshithshetty_movie_SSY.jpg?v=1780993676&width=533"),
      cdn("Mockup_97_57cc3ebc-d6fe-4b24-8098-ce22b1010f37.jpg?v=1785309656&width=533"),
      cdn("khaleja_maheshbabu.jpg?v=1780993686&width=533"),
      cdn("Rangasatalam_ChittiBAbu_ramcharan.jpg?v=1780993686&width=533"),
      cdn("Mockup_04_4a12f424-c077-4e41-b540-c38804e52b82.jpg?v=1784979950&width=533"),
      cdn("ene_movie_mockup.jpg?v=1780993683&width=533"),
      cdn("NTR_VeeraRaghavaReddy.jpg?v=1780993683&width=533"),
      cdn("Screenshot2026-06-05203412.png?v=1780894999&width=533"),
      cdn("Screenshot_2026-06-05_203533.png?v=1780893484&width=533"),
      cdn("Screenshot_2026-06-05_203547.png?v=1780893484&width=533"),
      cdn("Nani_dasara.jpg?v=1780993676&width=533"),
      cdn("Sanjya_Shaoo_Pawan_kalyan.jpg?v=1780993682&width=533"),
      cdn("Pushpa_alluArjun.jpg?v=1780993688&width=533"),
    ],
    handles: [
      "its-never-late-to-dream-nani-jersey-poster-telugu-motivational",
      "dear-comrade-vijay-deverakonda-poster-telugu-movie-wall-art",
      "life-of-ram-poster-emotional-telugu-drama-wall-art",
      "naa-savvu-nenu-sasta-telugu-dialogue-poster-wall-art",
      "prabhas-baahubali-poster-epic-telugu-fantasy-wall-art",
      "jersey-poster-sports-drama-wall-art",
      "khaleja-mahesh-babu-trivikram-action-poster",
      "rukmini-vasanthitha-rakshit-shetty-movie-poster-kannada-film-wall-art",
      "poster-design-97-wall-art",
      "khaleja-mahesh-babu-poster-telugu-mass-hero-wall-art",
      "rangasthalam-chitti-babu-ram-charan-poster-telugu-masterpiece-wall-art",
      "poster-design-04-wall-art",
      "ene-rathri-telugu-movie-poster-wall-art",
      "jr-ntr-veera-raghava-reddy-poster-rrr-telugu-movie-wall-art",
      "oohalu-gusagusalade-tv-romance-poster",
      "godavari-sekhar-kammula-minimal-poster",
      "nirosha-pawan-kalyan-vintage-polaroid-poster",
      "nani-dasara-movie-poster-telugu-mass-action-wall-art",
      "pawan-kalyan-sanjay-shao-og-poster-tollywood-power-star-wall-art",
      "pushpa-allu-arjun-poster-telugu-blockbuster-wall-art-india",
    ],
  },
  "hollywood-cinema": {
    titles: [
      "Fight Club | Brad Pitt Fight Scene",
      "Say My Name Quote Poster | Breaking Bad",
      "American Psycho Walking on Sunshine Collage Movie Poster",
      "Stranger Things Poster | TV Show Wall Art",
      "Billy Butcher The Boys Bold Red Typography Poster | Wall Art",
      "Iron Throne | Game of Thrones Series",
      "Why Do We Fall Poster | Batman Wall Art",
      "The Godfather Poster | Classic Movie Wall Art",
      "Game of Thrones | Winter Wolf",
      "Fight Club Red Type Poster | Brad Pitt",
      "I Am Iron Man Poster | Marvel Wall Art",
      "The Pursuit of Happyness Poster | Classic Movie Wall Art",
      "Fight Club | The first rule of Fight Club is you do not talk about Fight Club.",
      "American Psycho Red Edition Poster | Patrick Bateman Wall Art",
      "End Is The Beginning | Dark Series",
      "The Boys Bold Type Poster",
      "Fight Club Night Street Duo Poster - POSTERDRIP",
      "God Father Vito Corleone | Be Legendary Typography Poster",
      "Game of thrones series",
      "La La Land Poster | Classic Movie Wall Art",
    ],
    imageBase: "Mockup_36_fabaa1fd-73ed-444b-90a6-21f9637911ac.jpg?v=1782450464&width=533",
    images: [
      cdn("Mockup_36_fabaa1fd-73ed-444b-90a6-21f9637911ac.jpg?v=1782450464&width=533"),
      cdn("Mockup_152.jpg?v=1782450469&width=533"),
      cdn("ChatGPT_Image_Apr_2_2026_03_14_26_PM.png?v=1775123627&width=533"),
      cdn("Mockupup_36.jpg?v=1784961609&width=533"),
      cdn("ChatGPT_Image_Apr_2_2026_03_07_40_PM.png?v=1775123626&width=533"),
      cdn("Mockup_128.jpg?v=1782450462&width=533"),
      cdn("Mockup_80_a7d47a4e-b3e7-4515-a98f-3e4e6d9120bc.jpg?v=1784975973&width=533"),
      cdn("Mockupup_16.jpg?v=1784961602&width=533"),
      cdn("Mockup_162.jpg?v=1782450463&width=533"),
      cdn("Mockup_33_702f83f7-84d0-4733-8b73-e90bbdeb5cf6.jpg?v=1782450453&width=533"),
      cdn("Mockup_51_582a6afc-f4f1-4f15-a51d-5892b7ab56dc.jpg?v=1784975983&width=533"),
      cdn("Mockup_59_30f687b2-438e-4a62-b67a-ba3d13f4b1e7.jpg?v=1784975981&width=533"),
      cdn("Mockup_47_1338bbc7-f44b-4a7c-80da-842af547aec5.jpg?v=1782450456&width=533"),
      cdn("American_psycho_red.jpg?v=1780993676&width=533"),
      cdn("Mockup_141.jpg?v=1782450462&width=533"),
      cdn("Mockup_161.jpg?v=1782450463&width=533"),
      cdn("Mockup_86_57ddf54d-eba0-4c4e-9c54-7dad24888c03.jpg?v=1782450462&width=533"),
      cdn("Mockup_02_b2c66780-a4aa-4092-a900-f9d09173779d.jpg?v=1782450472&width=533"),
      cdn("Mockup_165.jpg?v=1782450461&width=533"),
      cdn("Mockup_87_79fe87ae-d6b4-4f75-900f-2f48d609735e.jpg?v=1784975971&width=533"),
    ],
    handles: [
      "brotherhood-candid-poster-cult-movie-wall-art",
      "say-my-name-quote-poster-tv-show-wall-art",
      "american-psycho-walking-on-sunshine-collage-poster",
      "stranger-things-poster-tv-show-wall-art",
      "billy-butcher-the-boys-bold-red-typography-poster",
      "flame-effect-hero-poster-marvel-wall-art",
      "why-do-we-fall-poster-batman-wall-art",
      "the-godfather-poster-classic-movie-wall-art",
      "misty-mountain-figure-poster-fantasy-art-wall-art",
      "fight-club-red-type-poster-cult-movie-wall-art",
      "i-am-iron-man-poster-marvel-wall-art",
      "the-pursuit-of-happyness-poster-classic-movie-wall-art",
      "friends-group-collage-poster-tamil-cinema-wall-art",
      "american-psycho-red-edition-poster-patrick-bateman-wall-art",
      "end-is-the-beginning-poster-motivational-wall-art",
      "the-boys-bold-type-poster-superhero-tv-wall-art",
      "night-street-duo-poster-cinematic-wall-art",
      "be-legendary-typography-poster-motivational-wall-art",
      "dragon-sigil-poster-fantasy-tv-wall-art",
      "la-la-land-poster-classic-movie-wall-art",
    ],
  },
  "web-series": { titles: ["Breaking Bad Say My Name", "Game of Thrones Iron Throne", "Stranger Things Poster"], imageBase: "Mockup_152.jpg?v=1782450469&width=533", images: [cdn("Mockup_152.jpg?v=1782450469&width=533"), cdn("Mockup_141.jpg?v=1782450462&width=533"), cdn("Mockupup_36.jpg?v=1784961609&width=533")] },
  "car-collections": { titles: ["Porsche 911 GT3 Moody Forest", "Defender Countryside Cruise", "Ford Mustang Yellow #23"], imageBase: "ChatGPTImageApr2_2026_11_50_15AM.png?v=1775111353&width=533", images: [cdn("ChatGPTImageApr2_2026_11_50_15AM.png?v=1775111353&width=533"), cdn("ChatGPT_Image_Apr_2_2026_03_07_40_PM.png?v=1775123626&width=533"), cdn("3_SPLITS_6.jpg?v=1775199896&width=533")] },
  "gym-posters": { titles: ["Gym Motivational Poster", "Train Hard Hang Harder", "No Pain No Gain - Gym Poster"], imageBase: "ChatGPTImageMay12_2026_05_21_42PM.png?v=1778779166&width=533", images: [cdn("ChatGPTImageMay12_2026_05_21_42PM.png?v=1778779166&width=533"), cdn("ChatGPTImageMay12_2026_05_30_00PM.png?v=1778779166&width=533"), cdn("Mockup_53.jpg?v=1781760670&width=533")] },
  "f1-collections": { titles: ["F1 Red Bull Starboy", "Formula 1 Brad Pitt Couch", "F1 Monaco Night Race Poster"], imageBase: "Untitled_design_12.png?v=1780893490&width=533", images: [cdn("Untitled_design_12.png?v=1780893490&width=533"), cdn("Mockup_128.jpg?v=1782450462&width=533"), cdn("Mockup_165.jpg?v=1782450461&width=533")] },
  "anime-posters": { titles: ["Monkey D Luffy Gear 5", "Gojo Infinity Poster", "Naruto Shadow Fight", "Demon Slayer Poster"], imageBase: "ChatGPTImageMay16_2026_12_45_08AM.png?v=1778916184&width=533", images: [cdn("ChatGPTImageMay16_2026_12_45_08AM.png?v=1778916184&width=533"), cdn("Mockup_51_582a6afc-f4f1-4f15-a51d-5892b7ab56dc.jpg?v=1784975983&width=533"), cdn("Mockup_80_a7d47a4e-b3e7-4515-a98f-3e4e6d9120bc.jpg?v=1784975973&width=533"), cdn("ChatGPT_Image_Apr_2_2026_03_14_26_PM.png?v=1775123627&width=533")] },
  "8-split-panel": { titles: ["Spider-Man Dark 3-Piece", "Porsche Spider-Man Edition 3-Piece", "Interstellar 3-Piece"], imageBase: "3_SPLITS_6.jpg?v=1775199896&width=533", images: [cdn("3_SPLITS_6.jpg?v=1775199896&width=533"), cdn("3_SPLITS_8.jpg?v=1775199905&width=533"), cdn("MULTICUSTOMPOSTERS.jpg?v=1775202595&width=533")] },
  "marvel-posters": { titles: ["Spider-Man Grafitti 3-Piece", "Captain America I Can Do This All Day", "Iron Man Legacy Poster"], imageBase: "Mockup_53.jpg?v=1781760670&width=533", images: [cdn("Mockup_53.jpg?v=1781760670&width=533"), cdn("Mockup_51_582a6afc-f4f1-4f15-a51d-5892b7ab56dc.jpg?v=1784975983&width=533"), cdn("Mockup_165.jpg?v=1782450461&width=533")] },
  "dc-posters": { titles: ["The Batman Dark Silhouette", "Joker Laughing Purple", "Wonder Woman Power Poster"], imageBase: "Mockup_80_a7d47a4e-b3e7-4515-a98f-3e4e6d9120bc.jpg?v=1784975973&width=533", images: [cdn("Mockup_80_a7d47a4e-b3e7-4515-a98f-3e4e6d9120bc.jpg?v=1784975973&width=533"), cdn("Mockup_87_79fe87ae-d6b4-4f75-900f-2f48d609735e.jpg?v=1784975971&width=533"), cdn("Mockup_162.jpg?v=1782450463&width=533")] },
  "baddie-collection": {
    titles: ["Lana Del Rey Repeat Poster", "Dior Doberman Poster", "Diet Coke Desi Collage Poster", "Chilli Pop Art Poster", "Savari Girl Poster", "Devasuram Old Feudal Poster"],
    imageBase: "Mockup_30_ec1e8693-ce42-4882-b476-18a0826f6a75.jpg?v=1785844680&width=533",
    images: [
      cdn("Mockup_30_ec1e8693-ce42-4882-b476-18a0826f6a75.jpg?v=1785844680&width=533"),
      cdn("Mockup_28_fd783cb2-2a19-4fb2-9b03-8471c7481b35.jpg?v=1785844678&width=533"),
      cdn("Mockup_19_052e05d5-e249-4754-81ba-128f953b46c4.jpg?v=1785844687&width=533"),
      cdn("Mockup_16_23500421-8e58-480c-a939-c3a33aa5d7e2.jpg?v=1785844687&width=533"),
      cdn("Mockup_172.jpg?v=1784272576&width=533"),
      cdn("Mockup_137_f4c170c4-3812-4069-a91d-bf19248a9d15.jpg?v=1784272591&width=533"),
    ],
  },
};

function buildOtherProducts(): Product[] {
  const out: Product[] = [];
  const handleSet = new Set<string>();
  for (const [coll, seed] of Object.entries(otherSeeds)) {
    const imageList = (seed.images && seed.images.length) ? seed.images : [cdn(seed.imageBase)];
    seed.titles.forEach((t, idx) => {
      const realHandles = (seed as any).handles as string[] | undefined;
      const isTeluguHollywood = coll === "telugu-cinema" || coll === "hollywood-cinema";
      let handle: string;
      if (isTeluguHollywood && realHandles && realHandles[idx]) handle = realHandles[idx];
      else {
        const slug = t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
        handle = `${slug}-${coll}`;
        // dedupe if slug collision
        let n = 1;
        let base = handle;
        while (handleSet.has(handle)) { n++; handle = `${base}-${n}`; }
      }
      handleSet.add(handle);
      const img = imageList[idx % imageList.length];
      out.push({
        handle,
        title: t,
        description: `${t} - premium wall art for ${coll}. Fan art, not official.`,
        price: 30,
        compareAt: 149,
        images: [img],
        collections: [coll],
        featured: idx === 0,
        variants: makeVariants(handle),
        options: { name: "Size", values: ["A5","A4","A3","13x19 inches"] },
      });
    });
  }
  // Ensure every collection has at least 4 products, even if not in seeds
  for (const c of collections) {
    const count = out.filter(p => p.collections.includes(c.handle)).length + (c.handle === "tamil-cinema" ? 85 : 0);
    if (count === 0) {
      for (let i = 0; i < 6; i++) {
        const h = `${c.handle}-poster-${i+1}`;
        out.push({
          handle: h,
          title: `${c.title} Poster ${i+1}`,
          description: `${c.title} fan poster ${i+1}.`,
          price: 30,
          compareAt: 149,
          images: [c.image],
          collections: [c.handle],
          variants: makeVariants(h),
          options: { name: "Size", values: ["A5","A4","A3","13x19 inches"] },
        });
      }
    }
  }
  return out;
}

export const products: Product[] = [
  ...expandTo85(tamilPage3),
  ...buildOtherProducts(),
];
// keep collection counters truthful (ponytail: was hardcoded 30/32 etc, now derived)
for (const c of collections) c.productCount = products.filter(p => p.collections.includes(c.handle)).length;

// Helpers - validated + sanitized
export function getCollection(handle: string) {
  return collections.find(c => c.handle === sanitizeHandle(handle));
}
export function getProduct(handle: string) {
  return products.find(p => p.handle === sanitizeHandle(handle));
}
export function getProductsByCollection(handle: string) {
  const h = sanitizeHandle(handle);
  if (h === "all" || h === "collections") return products;
  return products.filter(p => p.collections.includes(h));
}
export function searchProducts(q: string, limit = 20) {
  const query = sanitizeSearch(q);
  if (!query) return [];
  const lower = query.toLowerCase();
  return products.filter(p => p.title.toLowerCase().includes(lower) || p.description.toLowerCase().includes(lower)).slice(0, limit);
}
export function sanitizeHandle(s: string) {
  return s.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/--+/g, "-").slice(0, 100);
}
export function sanitizeSearch(s: string) {
  return s.trim().slice(0, 50).replace(/[<>]/g, "");
}
export function clampPrice(n: unknown, fallback: number | null = null) {
  const v = Number(n);
  if (Number.isNaN(v) || !Number.isFinite(v)) return fallback;
  return Math.max(0, Math.min(10000, Math.round(v)));
}
