const root=document.querySelector('#cart-review');
if(root){
 const q=selector=>root.querySelector(selector),$=selector=>document.querySelector(selector),status=q('#cart-ar-status');
 const stickerTypes=/^(Stickers|Bumper Sticker|Holographic stickers|Glitter Stickers|Infinity Stickers)$/;
 const cart=(()=>{try{return JSON.parse(localStorage.getItem('stickitup-cart-v1'))||[]}catch{return []}})();
 const items=[],placed=[],textures=new Map();let xrReady=false,xrStarted=false,activeSurface='auto',dragItem=null,moveMesh=null,movePointer=null,scene,camera,renderer,raycaster,textureLoader;
 const say=(text,error=false)=>{status.textContent=text;status.classList.toggle('is-error',error)};
 const safe=(value)=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 async function getJSON(url,options={}){const res=await fetch(url,{signal:AbortSignal.timeout(16000),...options});const data=await res.json();if(!res.ok)throw new Error(data.error||'Cart could not be loaded.');return data;}
 function script(url){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=url;s.crossOrigin='anonymous';if(url.includes('@8thwall/engine-binary'))s.dataset.preloadChunks='slam';s.onload=resolve;s.onerror=()=>reject(new Error('The AR engine could not load. Check your connection and try again.'));document.head.append(s);});}
 async function preload(){
  if(!window.THREE)await script('https://cdn.jsdelivr.net/npm/three@0.137.5/build/three.min.js');
  if(!window.XR8){const loaded=new Promise(resolve=>window.addEventListener('xrloaded',resolve,{once:true}));await script('https://cdn.jsdelivr.net/npm/@8thwall/engine-binary@1/dist/xr.js');if(!window.XR8)await Promise.race([loaded,new Promise((_,reject)=>setTimeout(()=>reject(new Error('The AR engine did not initialize.')),18000))]);}
  const cartQuote=await getJSON('/api/cart/quote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:cart})});
  for(const item of cartQuote.items.filter(item=>stickerTypes.test(item.product_type||'')))items.push({...item,asset:`/api/ar/image/${encodeURIComponent(item.handle)}?canvas=1`});
  const cards=q('#cart-ar-cards'),tray=q('#cart-ar-tray');
  if(!items.length){q('#cart-ar-empty').hidden=false;q('#cart-ar-start').disabled=true;say('No sticker products were found in this cart.',true);return;}
  for(const item of items){
   const card=document.createElement('div');card.className='cart-ar-card';card.setAttribute('aria-label',item.title);
   const pic=new Image();pic.alt=item.title;pic.src=item.asset;pic.loading='eager';card.append(pic);const count=document.createElement('small');count.textContent=`×${item.quantity}`;card.append(count);cards.append(card);
   const bubble=document.createElement('button');bubble.type='button';bubble.className='cart-ar-bubble';bubble.setAttribute('aria-label',`${item.title}, ${item.quantity} in cart. Tap to select or drag onto the surface.`);bubble.dataset.id=String(item.id);bubble.innerHTML=`<img src="${safe(item.asset)}" alt=""><small>${item.quantity}</small>`;bubble.addEventListener('click',()=>select(item.id));
   bubble.addEventListener('pointerdown',event=>{if(event.button!==0)return;event.preventDefault();bubble.setPointerCapture(event.pointerId);dragItem=item;moveMesh=null;select(item.id);say(`Drag ${item.title} from the tray onto your surface.`);});
   bubble.addEventListener('pointerup',event=>{if(!dragItem)return;const target=event.target,rect=q('#cart-ar-canvas').getBoundingClientRect();if(event.clientY>rect.top+100&&event.clientY<rect.bottom-80){placeAt(event.clientX,event.clientY,dragItem);}dragItem=null;});
   tray.append(bubble);
   const image=new Image();image.crossOrigin='anonymous';image.src=item.asset;await image.decode().catch(()=>{});textures.set(String(item.id),image);
  }
  q('#cart-ar-count').textContent=`${items.length} designs · tap a bubble to select, or drag it onto your surface.`;
  q('#cart-ar-start').disabled=false;
  say('3D review is ready. Tap View in AR when you want to open the camera.');
 }
 function select(id){q('#cart-ar-tray').querySelectorAll('.cart-ar-bubble').forEach(node=>node.setAttribute('aria-pressed',String(node.dataset.id===String(id))));const item=items.find(value=>String(value.id)===String(id));if(item){q('#cart-ar-count').textContent=`Selected ${item.title} · fixed preview width 7.62 cm.`;}}
 function modules(){
  const initialize=()=>{
   ({scene,camera,renderer}=XR8.Threejs.xrScene());renderer.autoClear=false;raycaster=new THREE.Raycaster();textureLoader=new THREE.TextureLoader();
   placed.length=0;let slots=0;for(const item of items){const image=textures.get(String(item.id));if(!image?.naturalWidth)continue;const texture=new THREE.Texture(image);texture.needsUpdate=true;if(THREE.SRGBColorSpace)texture.colorSpace=THREE.SRGBColorSpace;const width=.0762,height=width*image.naturalHeight/image.naturalWidth;const material=new THREE.MeshBasicMaterial({map:texture,transparent:true,side:THREE.DoubleSide,depthWrite:false}),geometry=new THREE.PlaneGeometry(width,height);for(let copy=0;copy<Math.min(Number(item.quantity)||1,25-slots);copy++){const mesh=new THREE.Mesh(geometry,material);mesh.visible=false;mesh.userData={id:String(item.id),width,height};scene.add(mesh);placed.push(mesh);slots++;}}
   XR8.XrController.updateCameraProjectionMatrix({origin:camera.position,facing:camera.quaternion});
  };
  return {name:'stickitup-cart-placement',onStart:()=>initialize(),onUpdate:({processCpuResult})=>{const tracking=processCpuResult?.reality?.trackingStatus;if(tracking==='NORMAL'&&!placed.some(mesh=>mesh.visible))say('Tracking is ready. Drag a sticker bubble onto the wall, screen, or surface.');else if(tracking==='LIMITED')say('Move the phone slowly over a well-lit surface with visible detail.');}};
 }
 function startCamera(){
  if(!xrReady||xrStarted)return;
  try{
   if(typeof DeviceMotionEvent!=='undefined'&&typeof DeviceMotionEvent.requestPermission==='function')DeviceMotionEvent.requestPermission().catch(()=>{});
   XR8.XrController.configure({scale:'absolute',disableWorldTracking:false});
   XR8.addCameraPipelineModules([XR8.GlTextureRenderer.pipelineModule(),XR8.Threejs.pipelineModule(),XR8.XrController.pipelineModule(),modules()]);
   q('#cart-ar-review').hidden=true;q('#cart-ar-live').hidden=false;document.body.classList.add('cart-ar-camera-on');
  XR8.run({canvas:q('#cart-ar-canvas'),allowedDevices:XR8.XrConfig.device().ANY});xrStarted=true;say('Allow camera access. Phone tilt sets upright vs flat; use the buttons below to override, then drag a sticker bubble onto your surface.');
  }catch(error){document.body.classList.remove('cart-ar-camera-on');q('#cart-ar-live').hidden=true;q('#cart-ar-review').hidden=false;say(error.message||'The AR camera could not start.',true);}
 }
 function pointFromScreen(clientX,clientY){
  const rect=q('#cart-ar-canvas').getBoundingClientRect(),x=(clientX-rect.left)/rect.width,y=(clientY-rect.top)/rect.height;
  if(x<0||x>1||y<0||y>1)return null;
  try{return XR8.XrController.hitTest(x,y,['FEATURE_POINT']).find(hit=>hit.position&&hit.type!=='UNSPECIFIED')||null;}catch{return null;}
 }
 function orient(mesh,hit){
  const direction=new THREE.Vector3().subVectors(camera.position,mesh.position);let mode=activeSurface;
  if(mode==='auto'){const view=new THREE.Vector3();camera.getWorldDirection(view);mode=Math.abs(view.y)>.42?'flat':'wall';}
  const normal=mode==='flat'?new THREE.Vector3(0,1,0):new THREE.Vector3(direction.x,0,direction.z).normalize();
  if(normal.lengthSq()<.01)normal.set(0,0,1);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),normal);
  mesh.position.y+=mode==='flat'?0.002:0;
 }
 function placeAt(clientX,clientY,item){
  const hit=pointFromScreen(clientX,clientY);if(!hit){say('No tracked surface point here yet. Move slowly over a textured, well-lit area, then try again.');return;}
  const key=String(item.id),count=placed.filter(mesh=>mesh.visible&&mesh.userData.id===key).length;
  if(count>=Number(item.quantity)){say('Every copy of this sticker in the cart is already placed.');return;}
  const mesh=placed.find(value=>!value.visible);if(!mesh){say('You have placed 25 stickers. Remove one before adding more.');return;}
  mesh.position.set(hit.position.x,hit.position.y,hit.position.z);orient(mesh,hit);mesh.userData.id=key;mesh.visible=true;select(key);say(`${item.title} placed. Drag another bubble to add it; drag a sticker to move it.`);
 }
 function pointerPosition(event){const rect=q('#cart-ar-canvas').getBoundingClientRect();return{x:(event.clientX-rect.left)/rect.width*2-1,y:-((event.clientY-rect.top)/rect.height)*2+1};}
 q('#cart-ar-start').addEventListener('click',startCamera);
 q('#cart-ar-close').addEventListener('click',()=>{try{XR8.stop();}catch{}xrStarted=false;document.body.classList.remove('cart-ar-camera-on');q('#cart-ar-live').hidden=true;q('#cart-ar-review').hidden=false;say('Camera closed. Your placements are kept while this page stays open.');});
 q('#cart-ar-live').addEventListener('click',event=>{const button=event.target.closest('[data-surface]');if(!button)return;activeSurface=button.dataset.surface;q('#cart-ar-live').querySelectorAll('[data-surface]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));say(activeSurface==='wall'?'Sticker faces the upright surface.':'Sticker lies on a flat horizontal surface.');});
 q('#cart-ar-canvas').addEventListener('pointerdown',event=>{if(!camera||!raycaster)return;const p=pointerPosition(event);raycaster.setFromCamera(p,camera);const hit=raycaster.intersectObjects(placed.filter(mesh=>mesh.visible),false)[0];moveMesh=hit?.object||null;movePointer=moveMesh?event.pointerId:null;});
 document.addEventListener('pointerup',event=>{if(dragItem){const rect=q('#cart-ar-canvas').getBoundingClientRect();if(event.clientX>=rect.left&&event.clientX<=rect.right&&event.clientY>rect.top+100&&event.clientY<rect.bottom-70)placeAt(event.clientX,event.clientY,dragItem);dragItem=null;return;}if(moveMesh&&movePointer===event.pointerId){const hit=pointFromScreen(event.clientX,event.clientY);if(hit){moveMesh.position.set(hit.position.x,hit.position.y,hit.position.z);orient(moveMesh,hit);say('Sticker moved.');}moveMesh=null;movePointer=null;return;}if(xrStarted&&event.target===q('#cart-ar-canvas')){const selected=q('#cart-ar-tray .cart-ar-bubble[aria-pressed=true]'),item=items.find(value=>String(value.id)===selected?.dataset.id);if(item)placeAt(event.clientX,event.clientY,item);}});
 preload().then(()=>{xrReady=true;}).catch(error=>say(error.message,true));
}
