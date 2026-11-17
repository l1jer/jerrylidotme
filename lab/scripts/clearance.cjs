// Usage: node scripts/clearance.cjs   Flies the whole journey and reports how close the camera
// gets to each planet, as a multiple of its radius. Below 1 means the camera is inside it.
// Exits non-zero if the camera comes within 1.25 radii of any planet.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
let fail=false;
for(const [name,vp] of [['wide',{width:640,height:360}],['tall',{width:360,height:640}]]){
 const p=await b.newPage({viewport:vp});await p.goto('http://localhost:4173/?capture&q=low',{waitUntil:'load'});await p.waitForFunction(()=>typeof window.__frame==='function');await p.waitForTimeout(600);
 const res=await p.evaluate(()=>{const t=window.__three;const obs=t.theme.obstacles;const n=obs.length;const min=obs.map(()=>({k:1e9,f:0}));
  for(let f=0;f<=n-1+1e-6;f+=0.01){window.__frame(f,5,0);obs.forEach((o,i)=>{const k=t.camera.position.distanceTo(o.center)/o.radius;if(k<min[i].k)min[i]={k,f}})}
  return min.map(m=>({k:+m.k.toFixed(2),f:+m.f.toFixed(2)}))});
 const worst=Math.min(...res.map(r=>r.k));if(worst<1.25)fail=true;
 console.log(name,'closest approach per planet (radii @ chapter):',res.map(r=>`${r.k}@${r.f}`).join('  '),worst<1.25?'FAIL':'ok');await p.close()}
await b.close();process.exit(fail?1:0)})();
