import {chromium} from './browser.mjs';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const data=JSON.parse(readFileSync('data/season.chapters.json','utf8')),errors=[],failed=[],steps=[];
mkdirSync('test-results',{recursive:true});const browser=await chromium.launch({headless:true});let page;
try{
 page=await browser.newPage({viewport:{width:360,height:780}});page.setDefaultTimeout(6000);page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.status()+' '+r.url());});
 await page.goto('http://127.0.0.1:5173/');
 await page.evaluate(async()=>{const {newSeason}=await import('/src/domain/season.ts');const {writeSeasonSlot}=await import('/src/platform/season-save.ts');await writeSeasonSlot('auto',newSeason());});
 await page.reload();await page.getByRole('button',{name:/이어서 탐색하기/}).click();
 async function dialogue(){while(await page.locator('.season-dialogue .dialogue-next').count())await page.locator('.season-dialogue .dialogue-next').click();}
 for(const c of data.chapters){
  await dialogue();
  for(const p of c.stages){
   await page.locator('.season-route').getByRole('button',{name:c.views[p.view],exact:true}).click();
   if(p.kind==='tide'){for(let i=0;i<12;i++){if((await page.locator('.season-context').innerText()).includes('썰물 · 4칸'))break;await page.getByRole('button',{name:'기다리기',exact:true}).click();}}
   await page.getByRole('button',{name:'조사 목록',exact:true}).click();await page.locator('.season-action-strip button').filter({hasText:p.title}).first().click();
   const dialog=page.getByRole('dialog');
   if(p.kind==='controls'){
    await dialog.locator('.mechanism-direct summary').click();
    for(let i=0;i<p.controls.length;i++){const ctrl=p.controls[i],option=ctrl.options.find(o=>o.value===p.solution[i]);await dialog.locator('fieldset').nth(i).getByRole('button',{name:option.label,exact:true}).click();}
   }else if(p.kind==='code')await dialog.getByRole('textbox',{name:'번호 입력'}).fill(p.solution);
   else if(p.kind==='sequence')for(const v of p.solution)await dialog.locator('.season-options').getByRole('button',{name:v,exact:true}).click();
   else if(p.kind==='use')await dialog.locator('.item-slot').filter({hasText:data.items[p.solution].name}).first().click();
   else if(p.kind==='combine')for(const id of [...p.solution].reverse())await dialog.locator('.item-slot').filter({hasText:data.items[id].name}).first().click();
   if(p.kind==='choice')await dialog.getByRole('button',{name:p.options[0].label,exact:true}).click();
   else await dialog.locator('.season-puzzle-confirm').click();
   await dialog.waitFor({state:'hidden'});await dialogue();steps.push(p.id);
   if(p.id==='CH02_P09'||p.id==='CH08_P16'){await page.waitForTimeout(450);await page.reload();await page.getByRole('button',{name:/이어서 탐색하기/}).click();await dialogue();}
  }
  console.log('CHAPTER UI COMPLETE '+c.id);
  if(c.number<10)await page.getByRole('button',{name:/다음 장으로/}).click();
 }
 await page.locator('.season-ending').waitFor();assert.match(await page.locator('.season-ending').innerText(),/진실의 해안/);await page.screenshot({path:'test-results/season-truth-ending.png'});
 assert.equal(steps.length,180);assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 writeFileSync('test-results/season-playthrough.json',JSON.stringify({status:'passed',steps,checks:['actual UI input for all 180 stages','reverse item combination','reload after part consumption and responsibility choice','four originals and companions reach truth ending'],pageErrors:errors,failedResponses:failed},null,2));console.log('SEASON PLAYTHROUGH OK');
}catch(e){if(page)await page.screenshot({path:'test-results/season-playthrough-failure.png'});throw e;}finally{await browser.close();}
