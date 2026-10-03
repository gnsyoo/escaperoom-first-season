import {chromium} from './browser.mjs';
import assert from 'node:assert/strict';
const base=process.env.PYORYUDO_URL||'http://127.0.0.1:5173/';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});
 for(const route of ['ui-preview.html?screen=explore&focus=1','ui-preview.html?screen=inventory&focus=1','season-preview.html?screen=ch02-explore&focus=1','season-preview.html?screen=map&focus=1']){
  await page.goto(base+route);await page.locator('.game-shell').waitFor();
  await page.waitForFunction(()=>[...document.querySelectorAll('.game-header,.sheet-header')].every(e=>!getComputedStyle(e).backgroundImage.includes('metal-frame')));
  const headers=await page.locator('.game-header,.sheet-header').evaluateAll(els=>els.map(e=>getComputedStyle(e).backgroundImage));
  assert(headers.length>0);assert(headers.every(value=>!value.includes('metal-frame')),route);
 }
 console.log('HEADER FRAME REMOVAL VERIFIED 4 SCREENS');
}finally{await browser.close();}
