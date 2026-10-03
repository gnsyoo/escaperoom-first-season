import {chromium} from './browser.mjs';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.env.PYORYUDO_URL||'http://127.0.0.1:5173/',browser=await chromium.launch({headless:true}),results=[],errors=[];
mkdirSync('test-results',{recursive:true});
try{
 for(const viewport of [{width:320,height:568},{width:360,height:780},{width:390,height:844},{width:1280,height:900}]){
  const page=await browser.newPage({viewport});page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'ui-preview.html?screen=explore&focus=1');await page.locator('.scene-bar').waitFor();
  const legacy=await page.locator('.scene-tools').evaluate(el=>({names:[...el.querySelectorAll('button')].map(b=>b.getAttribute('aria-label')),y:el.getBoundingClientRect().y-document.querySelector('.game-shell').getBoundingClientRect().y}));
  for(let chapter=2;chapter<=10;chapter++){
   const id='ch'+String(chapter).padStart(2,'0');await page.goto(base+'season-preview.html?screen='+id+'-explore&focus=1');await page.locator('.season-world').waitFor();
   const tools=await page.locator('.scene-tools').evaluate(el=>({names:[...el.querySelectorAll('button')].map(b=>b.getAttribute('aria-label')),y:el.getBoundingClientRect().y-document.querySelector('.game-shell').getBoundingClientRect().y}));
   assert.deepEqual(tools.names,legacy.names);assert(Math.abs(tools.y-legacy.y)<2,JSON.stringify({chapter,viewport,legacy,tools}));
   const marker=page.getByRole('button',{name:'조사 표시',exact:true});assert.equal(await marker.getAttribute('aria-pressed'),'false');assert.equal(await page.locator('.season-action-strip').count(),0);
   const targets=page.locator('.season-target'),before=await targets.count();assert(before>0,id);
   await marker.click();assert.equal(await marker.getAttribute('aria-pressed'),'true');assert.equal(await targets.count(),before);
   await marker.click();assert.equal(await marker.getAttribute('aria-pressed'),'false');assert.equal(await targets.count(),before);
   await page.getByRole('button',{name:'전체 장면 보기',exact:true}).click();
   await page.waitForFunction(()=>{const f=document.querySelector('.season-scene').getBoundingClientRect(),w=document.querySelector('.season-world').getBoundingClientRect();return w.width<=f.width+1&&w.height<=f.height+1;});
   const title=await targets.first().getAttribute('aria-label');await targets.first().click();await page.getByRole('dialog',{name:title,exact:true}).waitFor();
   await page.getByRole('dialog').getByRole('button',{name:'닫기',exact:true}).click();
   await page.getByRole('button',{name:'조사 목록',exact:true}).click();await page.locator('.season-action-strip').getByRole('button',{name:new RegExp(title)}).first().click();await page.getByRole('dialog',{name:title,exact:true}).waitFor();
   await page.getByRole('dialog').getByRole('button',{name:'닫기',exact:true}).click();assert.equal(await marker.getAttribute('aria-pressed'),'false');assert.equal(await page.locator('.season-action-strip').count(),0);
   results.push({chapter,viewport,status:'passed',checks:['shared toolbar position','marker toggles only visuals','background tap with marker off','independent investigation list']});
   if(chapter===2&&viewport.width===390)await page.screenshot({path:'test-results/consistent-ch02-exploration.png'});
  }await page.close();
 }
 assert.deepEqual(errors,[]);writeFileSync('test-results/consistent-exploration.json',JSON.stringify({status:'passed',results,errors},null,2));console.log('CONSISTENT EXPLORATION PASSED '+results.length);
}finally{await browser.close();}
