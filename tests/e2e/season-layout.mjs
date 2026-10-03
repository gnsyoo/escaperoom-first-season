import {chromium} from './browser.mjs';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
const b=await chromium.launch({headless:true}),results=[];mkdirSync('test-results',{recursive:true});
try{for(const viewport of [{width:320,height:568},{width:360,height:780},{width:390,height:844},{width:1280,height:900}]){
 const p=await b.newPage({viewport});
 for(const id of ['ch02-explore','ch02-puzzle','ch05-dialogue','ch06-inventory','ch08-puzzle','home','map','settings','evidence']){
  await p.goto('http://127.0.0.1:5173/season-preview.html?screen='+id+'&focus=1');await p.locator('.season-shell').waitFor();await p.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
  const result=await p.evaluate(()=>{const dialog=document.querySelector('dialog[open]'),root=dialog||document.querySelector('.season-shell');return {overflow:document.documentElement.scrollWidth>innerWidth,small:[...root.querySelectorAll('button')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&(r.width<43.8||r.height<43.8);}).map(e=>({text:e.innerText,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})),broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),font:getComputedStyle(root).fontFamily,navCols:getComputedStyle(document.querySelector('.season-nav')||document.body).gridTemplateColumns};});
  assert.equal(result.overflow,false,id+' width '+viewport.width);assert.deepEqual(result.small,[],id+' small touch target');assert.deepEqual(result.broken,[],id+' missing art');assert.match(result.font,/Pretendard/);results.push({id,viewport,status:'passed'});
 }await p.close();}
 writeFileSync('test-results/season-layout.json',JSON.stringify({status:'passed',results},null,2));console.log('SEASON LAYOUT OK '+results.length);
}finally{await b.close();}
