/* Quadro de Cargas · Souza Engenharia · service worker
   Página: rede primeiro (atualizações do GitHub chegam na hora) e cache sem internet.
   Ícones e manifesto: cache primeiro. Chamadas ao Google Apps Script não passam por aqui. */
const CACHE='quadro-cargas-v1';
const ARQS=['./','./index.html','./manifest.json','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png','./icons/apple-touch-icon.png','./icons/favicon-32.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARQS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('quadro-cargas-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==self.location.origin)return;
  const guarda=res=>{if(res&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res};
  if(r.mode==='navigate'||/\.html?$/.test(u.pathname)||u.pathname.endsWith('/')){
    e.respondWith(fetch(r).then(guarda).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(guarda)));
});
