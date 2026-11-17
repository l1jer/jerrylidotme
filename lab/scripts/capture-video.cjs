// Usage: node scripts/capture-video.cjs <world>   then: ffmpeg -framerate 24 -i .capture/frames-<world>/%04d.jpg -c:v libx264 -crf 28 -pix_fmt yuv420p out.mp4
// Renders a fly-through frame by frame (deterministic), one JPEG per frame.
const {chromium}=require('playwright');const fs=require('fs');
const world=process.argv[2];const W=1280,H=720,FPS=24,HOLD=1.25,TRAVEL=2.0,N=8;
const dir=require("path").join(__dirname,"..",".capture",`frames-${world}`);fs.rmSync(dir,{recursive:true,force:true});fs.mkdirSync(dir,{recursive:true});
const total=N*HOLD+(N-1)*TRAVEL;
const ss=x=>x*x*(3-2*x);
const fAt=t=>{let i=Math.floor(t/(HOLD+TRAVEL));let r=t-i*(HOLD+TRAVEL);if(i>=N-1&&r>=0)return N-1+0*r;return r<HOLD?i:i+ss((r-HOLD)/TRAVEL)};
(async()=>{
const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:W,height:H}});
p.on('pageerror',e=>console.log('pageerror',e.message.slice(0,200)));
await p.goto(`http://localhost:4173/?world=${world}&capture&q=${process.env.Q||"high"}`,{waitUntil:'load'});
await p.waitForFunction(()=>typeof window.__frame==='function');await p.waitForTimeout(1800);
const frames=Math.round(total*FPS);let prev=0,speed=0;const t0=Date.now();
for(let n=0;n<frames;n++){const t=n/FPS;const f=Math.min(N-1,fAt(t));speed+=((f-prev)*FPS-speed)*0.25;prev=f;
  await p.evaluate(([f,t,s,dt])=>window.__frame(f,t,s,dt),[f,10+t,speed,1/FPS]);
  await p.screenshot({path:`${dir}/${String(n).padStart(4,'0')}.jpg`,type:'jpeg',quality:92,timeout:120000});
  if(n%60===0)console.log(world,n+'/'+frames,Math.round((Date.now()-t0)/1000)+'s');}
console.log(world,'done',frames,'frames',Math.round((Date.now()-t0)/1000)+'s');
await b.close()})().catch(e=>{console.log('ERR',e.message.slice(0,300));process.exit(1)});
