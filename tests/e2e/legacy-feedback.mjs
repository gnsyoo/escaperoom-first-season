import {chromium} from './browser.mjs';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.env.PYORYUDO_URL||'http://127.0.0.1:5173/';
const browser=await chromium.launch({headless:true}),results=[];
mkdirSync('test-results',{recursive:true});
try{
 for(const viewport of [{width:320,height:568},{width:360,height:780},{width:1280,height:900}]){
  const page=await browser.newPage({viewport});
  const button=name=>page.getByRole('button',{name,exact:true});
  await page.goto(base);await button('새로운 기억').waitFor();
  assert.doesNotMatch(await page.locator('.title-footnote').innerText(),/체험판/);
  await button('게임 홈').click();assert.equal(await page.locator('.chapter-card').count(),10);
  await button('타이틀로 돌아가기').click();await button('새로운 기억').click();
  while(await button('다음 대사').count())await button('다음 대사').click();
  await page.locator('.hotspot[aria-label="손목의 결박"]').click();
  await page.getByRole('dialog').getByRole('button',{name:'닫기',exact:true}).click();
  await page.locator('.toast').waitFor();
  const toast=await page.locator('.toast').boundingBox(),game=await page.locator('.game-shell').boundingBox();
  assert(toast&&game&&toast.x>=game.x&&toast.x+toast.width<=game.x+game.width+1&&toast.y>=0&&toast.y+toast.height<=viewport.height,'success notice fits game frame');
  await page.goto(base+'ui-preview.html?screen=puzzle-code&focus=1');
  const dialog=page.getByRole('dialog');await dialog.getByRole('button',{name:'지우기',exact:true}).click();
  for(const digit of '714')await dialog.getByRole('button',{name:digit,exact:true}).click();
  await dialog.getByRole('button',{name:'잠금 해제',exact:true}).click();
  const notice=dialog.getByRole('status');await notice.waitFor();
  await dialog.locator('.sheet-scroll').evaluate(el=>{el.scrollTop=el.scrollHeight;});
  const r=await notice.boundingBox();assert(r&&r.y>=0&&r.y+r.height<=viewport.height,'wrong-answer notice remains visible after scrolling');
  await page.screenshot({path:'test-results/ch01-feedback-'+viewport.width+'.png'});
  results.push({viewport,status:'passed',checks:['ten chapter home cards','full-season title','success notice inside game frame','wrong-answer notice outside scrolling puzzle']});
  await page.close();
 }
 writeFileSync('test-results/legacy-feedback.json',JSON.stringify({status:'passed',base,results},null,2));console.log('CH01 FEEDBACK AND HOME OK '+results.length);
}finally{await browser.close();}
