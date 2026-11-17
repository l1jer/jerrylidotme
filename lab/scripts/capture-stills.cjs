// Usage: node scripts/capture-stills.cjs [worlds] [WxH] [chapters]   e.g. voyage 1280x720 0,2,7
// Needs `npm run build && npx vite preview --port 4173` running. Output: lab/.capture/
const {chromium}=require('playwright');const fs=require('fs');const OUT=require('path').join(__dirname,'..','.capture');fs.mkdirSync(OUT,{recursive:true});
const worlds=(process.argv[2]||'voyage').split(',');
const size=(process.argv[3]||'1280x720').split('x').map(Number);
const only=process.argv[4]?process.argv[4].split(',').map(Number):null;
(async()=>{
const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--enable-webgl']});
for(const w of worlds){
  const p=await b.newPage({viewport:{width:size[0],height:size[1]}});
  p.on('pageerror',e=>console.log(w,'pageerror',e.message.slice(0,300)));
  p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')console.log(w,m.type(),m.text().slice(0,300))});
  await p.goto(`http://localhost:4173/?world=${w}&capture&q=${process.env.Q||"high"}`,{waitUntil:'load'});
  await p.waitForFunction(()=>typeof window.__frame==='function',null,{timeout:60000});
  await p.waitForTimeout(800);
  const n=await p.evaluate(()=>document.querySelectorAll('#track button').length);
  for(let i=0;i<n;i++){ if(only&&!only.includes(i))continue;
    const t0=Date.now();
    await p.evaluate(([i])=>{for(let k=0;k<4;k++)window.__frame(i,12+i*4.3+k/30,0)},[i]);
    await p.screenshot({path:`${OUT}/${w}-${size[0]}-${i}.jpg`,type:'jpeg',quality:88,timeout:120000});
    console.log(w,i,(Date.now()-t0)+'ms');
  }
  await p.close();
}
await b.close()})().catch(e=>{console.log('ERR',e.message.slice(0,400));process.exit(1)});
