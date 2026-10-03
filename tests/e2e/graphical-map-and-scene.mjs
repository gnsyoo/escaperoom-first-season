import {chromium} from './browser.mjs';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.env.PYORYUDO_URL||'http://127.0.0.1:5173/';
const browser=await chromium.launch({headless:true}),results=[];mkdirSync('test-results',{recursive:true});
try{
 for(const viewport of [{width:320,height:568},{width:360,height:780},{width:390,height:844},{width:1280,height:900}]){
  const page=await browser.newPage({viewport});
  for(const family of ['legacy','season']){
   const entry=family==='legacy'?'ui-preview.html?screen=explore&focus=1':'season-preview.html?screen=ch02-explore&focus=1';
   await page.goto(base+entry);const frame=page.locator(family==='legacy'?'.scene-window':'.season-scene'),world=page.locator(family==='legacy'?'.scene-image-space':'.season-world');await world.waitFor();
   await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
   let f=await frame.boundingBox(),w=await world.boundingBox();assert(f&&w&&w.width>=f.width-1&&w.height>=f.height-1,family+' scene fills both edges');
   assert.equal(await frame.getAttribute('data-fit'),'fill');
   await page.getByRole('button',{name:'전체 장면 보기',exact:true}).click();
   await page.waitForFunction(({frame,world})=>{const f=document.querySelector(frame),w=document.querySelector(world);if(!f||!w||f.getAttribute('data-fit')!=='whole')return false;const a=f.getBoundingClientRect(),b=w.getBoundingClientRect();return b.width<=a.width+1&&b.height<=a.height+1;},{frame:family==='legacy'?'.scene-window':'.season-scene',world:family==='legacy'?'.scene-image-space':'.season-world'});
   f=await frame.boundingBox();w=await world.boundingBox();assert(f&&w&&w.width<=f.width+1&&w.height<=f.height+1,family+' complete scene is accessible');
   await page.getByRole('button',{name:'화면 채우기',exact:true}).click();
   await page.waitForFunction(({frame,world})=>{const f=document.querySelector(frame),w=document.querySelector(world);if(!f||!w||f.getAttribute('data-fit')!=='fill')return false;const a=f.getBoundingClientRect(),b=w.getBoundingClientRect();return b.width>=a.width-1&&b.height>=a.height-1;},{frame:family==='legacy'?'.scene-window':'.season-scene',world:family==='legacy'?'.scene-image-space':'.season-world'});
   assert(await page.locator('.bottom-nav .painted-icon').count()>=4);
   if(viewport.width===390)await page.screenshot({path:'test-results/graphical-'+family+'-explore.png',fullPage:true});
   await page.goto(base+(family==='legacy'?'ui-preview.html?screen=map&focus=1':'season-preview.html?screen=map&focus=1'));
   await page.locator('.graphic-map-image').waitFor();await page.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode()));});
   assert.equal(await page.locator('.floor-plan,.season-map-list').count(),0);
   assert.equal(await page.locator('.graphic-map-pin').count(),family==='legacy'?4:10);
   const expected=family==='legacy'?'ch01_warehouse_map_v02':'island_map_v01';assert.match(await page.locator('.graphic-map-image').getAttribute('src'),new RegExp(expected));
   if(viewport.width===390)await page.screenshot({path:'test-results/graphical-'+family+'-map.png',fullPage:true});
   const dest=page.locator('.graphic-map-pin:not(:disabled)').first();await dest.click();assert.equal(await page.getByRole('dialog').count(),0);
   results.push({family,viewport,status:'passed'});
  }await page.close();
 }
 writeFileSync('test-results/graphical-map-and-scene.json',JSON.stringify({status:'passed',base,results},null,2));console.log('GRAPHICAL MAP AND SCENE OK '+results.length);
}finally{await browser.close();}
