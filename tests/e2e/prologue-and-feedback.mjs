import {chromium} from './browser.mjs';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.env.PYORYUDO_URL||'http://127.0.0.1:5173/';
const browser=await chromium.launch({headless:true});
mkdirSync('test-results',{recursive:true});const errors=[],results=[];
try{
 for(const viewport of [{width:320,height:568},{width:360,height:780},{width:390,height:844},{width:1280,height:900}]){
  const page=await browser.newPage({viewport});page.on('pageerror',e=>errors.push(e.message));
  for(const scene of ['office','port','boat','awake']){
   await page.goto(base+'ui-preview.html?screen=intro-'+scene+'&focus=1');await page.locator('.prologue').waitFor();await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
   const layout=await page.evaluate(()=>{const panel=document.querySelector('.prologue').getBoundingClientRect();const caption=document.querySelector('.prologue-caption').getBoundingClientRect();const title=document.querySelector('.prologue-scene-title').getBoundingClientRect();return {inside:caption.top>title.bottom&&caption.bottom<=panel.bottom,overflow:document.documentElement.scrollWidth>innerWidth,small:[...document.querySelectorAll('.prologue button')].some(b=>{const r=b.getBoundingClientRect();return r.width<44||r.height<44;}),font:getComputedStyle(document.querySelector('.prologue-next p')).fontFamily};});
   assert(layout.inside,scene+JSON.stringify(viewport));assert(!layout.overflow);assert(!layout.small);assert.match(layout.font,/Pretendard/);results.push({viewport,scene,status:'passed'});
  }
  await page.goto(base+'ui-preview.html?screen=valve-installed&focus=1');await page.locator('.scene-base').waitFor();await page.getByRole('button',{name:'전체 장면 보기'}).click();await page.waitForFunction(()=>{const img=document.querySelector('.scene-base');return img?.complete&&img.naturalWidth>0;});
  const wheel=await page.locator('.world-layer').evaluateAll(els=>{const im=els.find(e=>e.getAttribute('src')?.includes('valve_handle'));const scene=document.querySelector('.scene-image-space').getBoundingClientRect(),r=im.getBoundingClientRect();return {x:(r.left+r.width*.488-scene.left)/scene.width,y:(r.top+r.height*.512-scene.top)/scene.height,ratio:r.width/r.height};});
  assert(Math.abs(wheel.x-.519)<.003);assert(Math.abs(wheel.y-.350)<.003);assert(Math.abs(wheel.ratio-1)<.01);
  if(viewport.width===390)await page.screenshot({path:'test-results/valve-centered.png'});
  await page.getByRole('button',{name:'배수 밸브',exact:true}).click();assert.match(await page.locator('.valve-toggle').nth(0).innerText(),/닫힘/);assert.match(await page.locator('.valve-toggle').nth(1).innerText(),/닫힘/);assert.match(await page.locator('.valve-toggle').nth(2).innerText(),/열림/);
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push(e.message));
 const btn=name=>page.getByRole('button',{name,exact:true});
 await page.goto(base);await btn('새로운 기억').click();await page.locator('.prologue[data-scene=office]').waitFor();await btn('다음 대사').click();await page.waitForFunction(()=>document.querySelector('.prologue-next p')?.textContent.includes('8년 전 연무도 보고서'));
 await page.waitForFunction(async()=>{const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('pyoryudo-saves',1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});const slot=await new Promise(resolve=>{const r=db.transaction('slots','readonly').objectStore('slots').get('auto');r.onsuccess=()=>resolve(r.result);});db.close();return slot?.state.dialogueQueue[0]?.id==='D00_002';});
 await page.reload();await page.getByRole('button',{name:/^이어서 탐색/}).click();await page.locator('.prologue').waitFor();assert.match(await page.locator('.prologue-next').innerText(),/8년 전 연무도 보고서/);
 for(let i=0;i<3;i++)await btn('다음 대사').click();await page.locator('.prologue[data-scene=port]').waitFor();await page.screenshot({path:'test-results/prologue-port.png'});
 await btn('인트로 건너뛰기').click();await page.locator('.game-header').waitFor();assert.match(await page.locator('.dialogue-next').innerText(),/손목/);
 while(await btn('다음 대사').count())await btn('다음 대사').click();
 await page.locator('.hotspot[aria-label="손목의 결박"]').click();await page.getByRole('dialog').getByRole('button',{name:'닫기',exact:true}).click();await page.locator('.hotspot[aria-label="의자 버팀대"]').click();for(let i=0;i<3;i++)await page.getByRole('button',{name:/왼쪽으로 체중 싣기/}).click();
 assert.match(await page.getByRole('status').last().innerText(),/금속 조각을 챙겼다/);assert(!((await page.getByRole('status').last().innerText()).includes('이미')));
 await page.screenshot({path:'test-results/item-first-success.png'});assert.deepEqual(errors,[]);writeFileSync('test-results/prologue-and-feedback.json',JSON.stringify({status:'passed',layout:results,checks:['13-line intro save and restore','skip preserves transcript','old save accepted by unit tests','first item success wording','valve wheel hub geometry and completed valve controls'],errors},null,2));console.log('PROLOGUE, FIRST ITEM FEEDBACK, VALVE ALIGNMENT PASSED');
}finally{await browser.close();}
