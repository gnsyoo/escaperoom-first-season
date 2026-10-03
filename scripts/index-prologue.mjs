import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const root='art/production/v01/';
const log=JSON.parse(readFileSync(root+'prologue-generation-log.json','utf8'));
const plan=JSON.parse(readFileSync(root+'asset-plan-final.json','utf8'));
const manifest=JSON.parse(readFileSync(root+'manifest.json','utf8'));
for(const a of log.assets){
 const bytes=readFileSync(root+a.path),meta=await sharp(bytes).metadata();
 const entry={id:a.id,path:a.path,label:a.label,category:a.category,chapter:'PROLOGUE',transparent:false,status:'ready-art',exists:true,width:meta.width,height:meta.height,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),colorType:bytes[25],promptRef:'prologue-generation-log.json#'+a.id};
 const i=manifest.assets.findIndex(x=>x.id===a.id);if(i<0)manifest.assets.push(entry);else manifest.assets[i]=entry;
 const p=plan.assets.findIndex(x=>x.id===a.id);if(p<0)plan.assets.push({...entry,prompt:a.prompt});else plan.assets[p]={...entry,prompt:a.prompt};
}
manifest.counts={...manifest.counts,plannedRaster:plan.assets.length,generatedRaster:manifest.assets.filter(a=>a.path.endsWith('.png')).length};
writeFileSync(root+'manifest.json',JSON.stringify(manifest,null,2)+'\n');writeFileSync(root+'asset-plan-final.json',JSON.stringify(plan,null,2)+'\n');
writeFileSync(root+'gallery.html',readFileSync(root+'gallery.html','utf8').replace(/const assets=\[[\s\S]*?\];const grid=/,'const assets='+JSON.stringify(manifest.assets.filter(a=>a.exists)).replaceAll('<','\\u003c')+';const grid='));
writeFileSync(root+'ASSET_INDEX.md','# 표류도 그래픽 리소스 목록\n\nPNG '+manifest.counts.generatedRaster+'장, SVG '+manifest.counts.svg+'개. 한글 기능 라벨은 실제 Pretendard UI 레이어다.\n\n| ID | 용도 | 파일 | 원본 크기 |\n| --- | --- | --- | --- |\n'+manifest.assets.map(a=>'| '+a.id+' | '+a.label+' | [파일]('+a.path+') | '+(a.width?a.width+'×'+a.height:'SVG')+' |').join('\n')+'\n');
console.log('Prologue art indexed: '+manifest.counts.generatedRaster+' PNGs.');
