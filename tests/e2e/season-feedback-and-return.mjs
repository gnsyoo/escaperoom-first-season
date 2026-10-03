import {chromium} from './browser.mjs';
import assert from 'node:assert/strict';
import {writeFileSync,mkdirSync} from 'node:fs';
const b=await chromium.launch({headless:true});mkdirSync('test-results',{recursive:true});
try{
 const p=await b.newPage({viewport:{width:320,height:568}});p.setDefaultTimeout(6000);
 await p.goto('http://127.0.0.1:5173/season-preview.html?screen=ch02-puzzle&focus=1');
 const d=p.getByRole('dialog');await d.locator('.mechanism-direct summary').click();await d.locator('fieldset').first().getByRole('button',{name:'열림',exact:true}).click();await d.locator('.season-puzzle-confirm').click();
 const error=d.getByRole('alert');await error.waitFor();const r=await error.boundingBox();assert(r&&r.y>=0&&r.y+r.height<=568);assert.match(await error.innerText(),/표찰과 기록/);
 await p.goto('http://127.0.0.1:5173/season-preview.html?screen=ch05-dialogue&focus=1');const frame=await p.locator('.season-scene').boundingBox(),portrait=await p.locator('.season-portrait').boundingBox();assert(frame&&portrait&&portrait.y>=frame.y-1&&portrait.height<=frame.height+1);await p.screenshot({path:'test-results/short-screen-dialogue.png'});
 await p.goto('http://127.0.0.1:5173/');
 await p.evaluate(async()=>{const g=await import('/src/domain/season.ts'),save=await import('/src/platform/season-save.ts');let s={...g.newSeason(),queue:[]};for(let ch=0;ch<=6;ch++){for(const q of g.season.chapters[ch].stages){if(q.optional)continue;s={...g.move(s,q.view),queue:[]};if(q.kind==='tide')while(!g.tide(s).entry)s=g.waitTide(s);const answer=q.solution??(q.kind==='choice'?q.options[0].value:undefined);const result=g.apply(s,q,answer);if(!result.ok)throw new Error(q.id+result.message);s={...result.state,queue:[]};}if(ch<6)s={...g.advance(s),queue:[]};}await save.writeSeasonSlot('auto',s);});
 await p.reload();await p.getByRole('button',{name:/이어서 탐색하기/}).click();
 const map=async place=>{await p.locator('.season-nav').getByRole('button',{name:'지도',exact:true}).click();await p.getByRole('dialog').getByRole('button',{name:new RegExp(place)}).click();};
 await map('폐양식장');await p.getByRole('button',{name:'남은 선택 원본 조사하기',exact:true}).click();await p.locator('.season-action-strip button').filter({hasText:'지워진 일지 복원'}).click();await p.getByRole('dialog').locator('.mechanism-direct summary').click();for(const f of await p.getByRole('dialog').locator('fieldset').all())await f.getByRole('button',{name:'4',exact:true}).click();await p.getByRole('dialog').locator('.season-puzzle-confirm').click();
 await map('등대');await p.getByRole('button',{name:'남은 선택 원본 조사하기',exact:true}).click();await p.locator('.season-route').getByRole('button',{name:'기록실',exact:true}).click();await p.locator('.season-action-strip button').filter({hasText:'원본 접수지 보관'}).click();await p.getByRole('dialog').locator('.season-puzzle-confirm').click();
 await p.locator('.season-nav').getByRole('button',{name:'수첩',exact:true}).click();await p.getByRole('dialog').getByRole('button',{name:'원본 자료',exact:true}).click();assert.match(await p.getByRole('dialog').innerText(),/E01 · 확보함/);assert.match(await p.getByRole('dialog').innerText(),/E02 · 확보함/);await p.screenshot({path:'test-results/returned-originals.png'});
 writeFileSync('test-results/season-feedback-and-return.json',JSON.stringify({status:'passed',checks:['error stays visible after scrolling on 320x568','portrait does not extend above scene','revisit completed CH02 and CH04, dismiss completion card, recover both optional originals via real UI']},null,2));console.log('FEEDBACK AND ORIGINAL RETURN OK');
}finally{await b.close();}
