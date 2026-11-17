// Usage: node scripts/bench.cjs [tier]   Relative cost per frame in software rendering (lower is better).
// Not a real frame rate: use it to compare before and after a change.
const {chromium}=require('playwright');const tier=process.argv[2]||'high';
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:1280,height:720}});
await p.goto(`http://localhost:4173/?capture&q=${tier}`,{waitUntil:'load'});await p.waitForFunction(()=>typeof window.__frame==='function');await p.waitForTimeout(1200);
const out=await p.evaluate(()=>{const gl=document.getElementById('gl').getContext('webgl2');const px=new Uint8Array(4);const res={};
 for(const [name,f] of [['chapter 0',0],['chapter 2',2],['travel 2.5',2.5],['chapter 7',7]]){window.__frame(f,20,0);gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,px);
  const t0=performance.now();for(let k=0;k<4;k++){window.__frame(f,20+k/30,f%1?0.6:0);gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,px)}res[name]=Math.round((performance.now()-t0)/4)}
 return res});
console.log(tier,JSON.stringify(out),'ms/frame');await b.close()})();
