import {randomBytes} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import QRCode from 'qrcode';
import {getModelInfo} from './ar.mjs';
import {posterArModel} from './poster-catalog.mjs';
const handoffs=new Map(),MAX_HANDOFFS=64;
export function validPhoneOrigin(input){
 try{const url=new URL(input),host=url.hostname.toLowerCase();if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||url.pathname!=='/'||host==='localhost'||host.endsWith('.localhost')||host==='[::1]'||/^(127\.|0\.0\.0\.0$)/.test(host))return null;return url.origin;}catch{return null;}
}
export async function phonePreviewOrigin(){
 if(process.env.PHONE_PREVIEW_ORIGIN)return validPhoneOrigin(process.env.PHONE_PREVIEW_ORIGIN);
 try{return validPhoneOrigin(JSON.parse(await readFile(new URL('../artifacts/runtime/phone-preview.json',import.meta.url),'utf8')).origin);}catch{return null;}
}
export function createHandoff(input,origin){
 origin=validPhoneOrigin(origin);if(!origin)throw new Error('Start an HTTPS phone preview before generating a QR code.');
 const match=typeof input.model==='string'&&input.model.match(/^\/api\/ar\/models\/([a-f0-9]{64})\.glb$/),catalogModel=posterArModel(input.model),model=match&&getModelInfo(match[1])||catalogModel;if(!model)throw new Error('This model expired or is not in the captured catalog. Prepare the preview again.');
 for(const [id,value]of handoffs)if(value.expiresAt<=Date.now()||(value.modelId&&!getModelInfo(value.modelId))||(value.posterModel&&!posterArModel(value.posterModel)))handoffs.delete(id);
 while(handoffs.size>=MAX_HANDOFFS)handoffs.delete(handoffs.keys().next().value);
 const token=randomBytes(16).toString('hex'),url=`${origin}/pages/try-live?handoff=${token}`;
 const kind=['layout','poster-layout','poster-single'].includes(input.kind)?input.kind:'single';
 const value={modelId:match?.[1]||null,posterModel:catalogModel?input.model:null,modelUrl:model.url,title:String(input.title||'Your sticker preview').slice(0,160),widthMm:model.widthMm,heightMm:model.heightMm,kind,placement:input.placement==='wall'?'wall':'floor',measured:input.measured===true,expiresAt:model.expiresAt||Date.now()+30*60*1000,url};handoffs.set(token,value);
 return {url,qr:`/api/ar/handoffs/${token}/qr.png`,expiresAt:value.expiresAt};
}
export function getHandoff(token){
 const value=handoffs.get(token);if(!value)return null;const model=value.modelId?getModelInfo(value.modelId):posterArModel(value.posterModel);if(!model||value.expiresAt<=Date.now()){handoffs.delete(token);return null;}return {...model,url:value.modelUrl||model.url,title:value.title,kind:value.kind,placement:value.placement,measured:value.measured,expiresAt:value.expiresAt};
}
export async function handoffQr(token){if(!getHandoff(token))return null;return QRCode.toBuffer(handoffs.get(token).url,{type:'png',width:320,margin:4,errorCorrectionLevel:'M'});}
