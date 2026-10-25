import {readFileSync,statSync,existsSync} from 'node:fs';
let cache,stamp;
export function posterCatalog(){
 const base=new URL('../data/posters/',import.meta.url),manifestUrl=new URL('manifest.json',base),arManifestUrl=new URL('ar-models.json',base);
 const mtime=statSync(manifestUrl).mtimeMs+(existsSync(arManifestUrl)?statSync(arManifestUrl).mtimeMs:0);if(cache&&stamp===mtime)return cache;
 const read=name=>JSON.parse(readFileSync(new URL(name,base),'utf8'));
 const raw=read('catalog.json'),images=read('images.json'),manifest=read('manifest.json');
 const arModels=existsSync(arManifestUrl)?read('ar-models.json').records:{};
 const posterImage=source=>{const cached=images[source];if(!cached)return source;try{return existsSync(new URL(`../public${cached}`,import.meta.url))?cached:source;}catch{return source;}};
 const products=raw.products.map(p=>{const sources=(p.images||[]).filter(i=>images[i.src]||i.src);return {id:`posterized-${p.id}`,sourceId:p.id,title:p.title,handle:p.handle,type:p.product_type||'Catalog item',tags:p.tags||[],url:`https://www.posterized.in/products/${encodeURIComponent(p.handle)}`,images:sources.map(i=>posterImage(i.src)),arModels:sources.map(i=>arModels[images[i.src]]?{url:arModels[images[i.src]].glb,widthMm:arModels[images[i.src]].widthMm,heightMm:arModels[images[i.src]].heightMm}:null),variants:p.variants.map(v=>({id:String(v.id),title:v.title,price:Number(v.price),available:Boolean(v.available)}))};}).filter(p=>p.images.length);
 for(const product of products){const image=product.images[0],thumb=image.startsWith('/poster-assets/')?image.replace(/\.[^.]+$/,'.webp').replace('/poster-assets/','/poster-assets/thumbs/'):image;product.thumbnail=thumb.startsWith('/poster-assets/')&&existsSync(new URL('../public'+thumb,import.meta.url))?thumb:image;}
 const ids=new Set(products.map(p=>p.sourceId));
 const arManifest=existsSync(arManifestUrl)?read('ar-models.json'):null;
 cache={source:raw.source,capturedAt:manifest.capturedAt,manifest:{productCount:manifest.productCount,imageCount:manifest.imageCount,downloadedImageCount:manifest.downloadedImageCount,failedImages:manifest.failures.length,arModelCount:arManifest?.modelCount||0},products,collections:read('collections.json').collections.map(c=>({handle:c.handle,title:c.title,productIds:c.product_ids.filter(id=>ids.has(id)).map(id=>`posterized-${id}`)}))};stamp=mtime;return cache;
}
export function posterArModel(url){
 const match=String(url||'').match(/^\/poster-ar\/models\/([a-f0-9]{24})\.glb$/);if(!match)return null;
 const base=new URL('../data/posters/',import.meta.url),file=new URL('ar-models.json',base);if(!existsSync(file))return null;
 const records=JSON.parse(readFileSync(file,'utf8')).records,record=Object.values(records).find(item=>item.glb===url);return record?{url:record.glb,widthMm:record.widthMm,heightMm:record.heightMm}:null;
}
