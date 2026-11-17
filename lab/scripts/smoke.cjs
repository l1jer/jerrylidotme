// Usage: node scripts/smoke.cjs [baseUrl]   Live-mode check: no errors, scroll reaches the last chapter, keys work.
const {chromium}=require('playwright');const base=process.argv[2]||'http://localhost:4173/';
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
let fail=false;
for(const q of ['low','high']){const p=await b.newPage({viewport:{width:640,height:360}});const errs=[];
 p.on('pageerror',e=>errs.push(e.message.slice(0,200)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,200))});p.on('response',r=>r.status()>=400&&!/_vercel/.test(r.url())&&errs.push(r.status()+' '+r.url()));
 await p.goto(base+(base.includes('?')?'&':'?')+'q='+q,{waitUntil:'load'});await p.waitForTimeout(3000);
 const start=await p.evaluate(()=>document.getElementById('ch-title').textContent);
 await p.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await p.waitForTimeout(9000);
 const end=await p.evaluate(()=>({title:document.getElementById('ch-title').textContent,mail:!!document.querySelector('#ch-actions a[href^="mailto:"]'),cur:document.querySelector('#track [aria-current]')?.textContent,worldsHidden:document.getElementById('worlds').hidden}));
 await p.keyboard.press('ArrowUp');await p.waitForTimeout(6000);
 const up=await p.evaluate(()=>document.querySelector('#track [aria-current]')?.textContent);
 const ok=start==='Jerry Li'&&end.mail&&end.cur==='07Contact'&&up==='06Toolkit'&&errs.length===0;fail=fail||!ok;
 console.log(q,ok?'PASS':'FAIL',JSON.stringify({start,...end,up,errs}));await p.close()}
const html=await (await fetch(base)).text();const leak=/[\w.]+@gmail\.com/.test(html);console.log('email in HTML:',leak);
await b.close();process.exit(fail||leak?1:0)})();
