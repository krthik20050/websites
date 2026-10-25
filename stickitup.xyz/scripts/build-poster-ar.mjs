import {readFile,writeFile,mkdir,rename,stat} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';

const root=path.resolve(import.meta.dirname,'..'),dataRoot=path.join(root,'data/posters');
const publicRoot=path.join(root,'public'),modelRoot=path.join(publicRoot,'poster-ar/models'),textureRoot=path.join(publicRoot,'poster-ar/textures');
const sourceImages=JSON.parse(await readFile(path.join(dataRoot,'images.json'),'utf8'));
const capture=JSON.parse(await readFile(path.join(dataRoot,'manifest.json'),'utf8'));
if(capture.downloadedImageCount!==capture.imageCount||capture.failures.length)throw new Error('The Posterized source image capture must be complete first.');
await Promise.all([mkdir(modelRoot,{recursive:true}),mkdir(textureRoot,{recursive:true})]);

const modelWidthMm=300,records={},failures=[];
function makeGlb(widthMm,heightMm,imageUri,alpha){
 const w=widthMm/2000,h=heightMm/2000;
 const points=[[-w,-h,.0006],[w,-h,.0006],[w,h,.0006],[-w,h,.0006],[-w,-h,0],[w,-h,0],[w,h,0],[-w,h,0]];
 const positions=new Float32Array(points.flat()),normals=new Float32Array([0,0,1,0,0,1,0,0,1,0,0,1,0,0,-1,0,0,-1,0,0,-1,0,0,-1]);
 const uv=new Float32Array([0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0]);
 const indices=new Uint16Array([0,1,2,0,2,3,4,6,5,4,7,6]);
 const chunks=[Buffer.from(positions.buffer),Buffer.from(normals.buffer),Buffer.from(uv.buffer),Buffer.from(indices.buffer)];let offset=0;
 const views=chunks.map((chunk,index)=>{const view={buffer:0,byteOffset:offset,byteLength:chunk.length,...(index<3?{target:34962}:index===3?{target:34963}:{})};offset+=Math.ceil(chunk.length/4)*4;return view;});
 const bin=Buffer.concat(chunks.flatMap(chunk=>[chunk,Buffer.alloc((4-chunk.length%4)%4)]));
 const gltf={asset:{version:'2.0',generator:'Stick It Up Posterized AR Catalog'},scene:0,scenes:[{nodes:[0]}],nodes:[{mesh:0}],meshes:[{primitives:[{attributes:{POSITION:0,NORMAL:1,TEXCOORD_0:2},indices:3,material:0}]}],materials:[{pbrMetallicRoughness:{baseColorTexture:{index:0},metallicFactor:0,roughnessFactor:.92},...(alpha?{alphaMode:'BLEND'}:{}),doubleSided:true}],textures:[{sampler:0,source:0}],samplers:[{magFilter:9729,minFilter:9729,wrapS:33071,wrapT:33071}],images:[{uri:imageUri}],buffers:[{byteLength:bin.length}],bufferViews:views,accessors:[{bufferView:0,componentType:5126,count:8,type:'VEC3',min:[-w,-h,0],max:[w,h,.0006]},{bufferView:1,componentType:5126,count:8,type:'VEC3'},{bufferView:2,componentType:5126,count:8,type:'VEC2'},{bufferView:3,componentType:5123,count:12,type:'SCALAR'}]};
 const json=Buffer.from(JSON.stringify(gltf)),jsonPadded=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]),binPadded=Buffer.concat([bin,Buffer.alloc((4-bin.length%4)%4)]);
 const header=Buffer.alloc(12),jsonHeader=Buffer.alloc(8),binHeader=Buffer.alloc(8);header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);header.writeUInt32LE(12+8+jsonPadded.length+8+binPadded.length,8);jsonHeader.writeUInt32LE(jsonPadded.length,0);jsonHeader.writeUInt32LE(0x4e4f534a,4);binHeader.writeUInt32LE(binPadded.length,0);binHeader.writeUInt32LE(0x004e4942,4);
 return Buffer.concat([header,jsonHeader,jsonPadded,binHeader,binPadded]);
}

let cursor=0;
await Promise.all(Array.from({length:8},async()=>{
 while(cursor<Object.keys(sourceImages).length){const [sourceUrl,relative]=Object.entries(sourceImages)[cursor++];
  try{
   if(!relative.startsWith('/poster-assets/'))throw new Error('Image is outside the captured poster asset folder.');
   const original=path.resolve(publicRoot,'.'+relative);if(!original.startsWith(path.join(publicRoot,'poster-assets')+path.sep))throw new Error('Image path escaped the poster asset folder.');
   const meta=await sharp(original).metadata();if(!meta.width||!meta.height)throw new Error('Image dimensions are missing.');
   const id=path.basename(relative,path.extname(relative));if(!/^[a-f0-9]{24}$/.test(id))throw new Error('Unexpected captured image filename.');
   const thumb=path.join(publicRoot,'poster-assets','thumbs',id+'.webp'),thumbMeta=await sharp(thumb).metadata(),alpha=Boolean(thumbMeta.hasAlpha),textureExt=alpha?'png':'jpg',sidecar=path.join(textureRoot,id+'.'+textureExt);
   await sharp(thumb).rotate().resize(480,640,{fit:'inside',withoutEnlargement:true})[alpha?'png':'jpeg'](alpha?{compressionLevel:8}:{quality:86,mozjpeg:true}).toFile(sidecar+'.partial');await rename(sidecar+'.partial',sidecar);
   const textureUri='../textures/'+id+'.'+textureExt;
   const width=meta.orientation>=5&&meta.orientation<=8?meta.height:meta.width,height=meta.orientation>=5&&meta.orientation<=8?meta.width:meta.height;
   const physicalHeight=Math.round(modelWidthMm*height/width);if(physicalHeight<20||physicalHeight>1000)throw new Error('Image aspect ratio falls outside supported poster dimensions.');
   const file=path.join(modelRoot,id+'.glb'),temp=file+'.partial';await writeFile(temp,makeGlb(modelWidthMm,physicalHeight,textureUri,alpha));await rename(temp,file);
   records[relative]={sourceUrl,glb:'/poster-ar/models/'+id+'.glb',widthMm:modelWidthMm,heightMm:physicalHeight,aspectRatio:Number((width/height).toFixed(5)),texture:'/poster-ar/textures/'+id+'.'+textureExt,textureWidth:thumbMeta.width,textureHeight:thumbMeta.height};
  }catch(error){failures.push({image:relative,error:error.message});}
 }
}));
const output={version:1,source:capture.source,capturedAt:capture.capturedAt,generatedAt:new Date().toISOString(),modelCount:Object.keys(records).length,sourceImageCount:Object.keys(sourceImages).length,modelWidthMm,texturePolicy:'GLB geometry is local; each model references the captured same-origin JPEG/PNG photo. Product photos are previews, not print-ready artwork.',records,failures};
await writeFile(path.join(dataRoot,'ar-models.json'),JSON.stringify(output));
const [modelSizes,textureSizes]=await Promise.all([Promise.all(Object.values(records).map(item=>stat(path.join(publicRoot,item.glb)).then(s=>s.size))),Promise.all([...new Set(Object.values(records).map(item=>item.texture))].map(texture=>stat(path.join(publicRoot,texture)).then(s=>s.size)))]);
console.log(JSON.stringify({models:output.modelCount,sourceImages:output.sourceImageCount,failures:failures.length,modelBytes:modelSizes.reduce((sum,n)=>sum+n,0),textureBytes:textureSizes.reduce((sum,n)=>sum+n,0)}));
if(failures.length)process.exitCode=1;
