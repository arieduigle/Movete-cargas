const CACHE='movete-cargas-v15';
const ASSETS=['./','./index.html','./styles.css','./app.js?v=11','./monthly-plans.js?v=5','./repair-duplicates-2026.js?v=1'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;
 if(event.request.mode==='navigate'||/\.(?:js|css|html|webmanifest)$/.test(url.pathname)){
  event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{
   if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});}
   return response;
  }).catch(()=>caches.match(event.request).then(hit=>hit||caches.match('./index.html'))));
 }
});
