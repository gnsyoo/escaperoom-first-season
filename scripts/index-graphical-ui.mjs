import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const root='art/production/v01/';
const log=JSON.parse(readFileSync(root+'map-ui-generation-log.json','utf8'));
const plan=JSON.parse(readFileSync(root+'asset-plan-final.json','utf8'));
const manifest=JSON.parse(readFileSync(root+'manifest.json','utf8'));
for(const a of log.assets){
 const file=root+a.path,bytes=readFileSync(file),meta=await sharp(file).metadata();
 if(a.transparent&&!meta.hasAlpha)throw new Error('Transparent icon has no alpha: '+a.id);
 const entry={id:a.id,path:a.path,label:a.label,category:a.category,chapter:a.opaque?'CH01':'COMMON',transparent:a.transparent,status:'ready-art',exists:true,width:meta.width,height:meta.height,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),colorType:bytes[25],promptRef:'map-ui-generation-log.json#'+a.id};
 const index=manifest.assets.findIndex(x=>x.id===a.id);if(index<0)manifest.assets.push(entry);else manifest.assets[index]=entry;
 if(!plan.assets.some(x=>x.id===a.id))plan.assets.push({...entry,prompt:a.prompt});
}
manifest.counts={...manifest.counts,plannedRaster:plan.assets.length,generatedRaster:manifest.assets.filter(a=>a.path.endsWith('.png')).length};
writeFileSync(root+'manifest.json',JSON.stringify(manifest,null,2)+'\n');writeFileSync(root+'asset-plan-final.json',JSON.stringify(plan,null,2)+'\n');
const gallery=readFileSync(root+'gallery.html','utf8').replace(/const assets=\[[\s\S]*?\];const grid=/,'const assets='+JSON.stringify(manifest.assets.filter(a=>a.exists)).replaceAll('<','\\u003c')+';const grid=');writeFileSync(root+'gallery.html',gallery);
writeFileSync(root+'ASSET_INDEX.md','# 표류도 그래픽 리소스 목록\n\nPNG '+manifest.counts.generatedRaster+'장, SVG '+manifest.counts.svg+'개. 모든 한글 기능 라벨은 실제 Pretendard UI 레이어다.\n\n| ID | 용도 | 파일 | 원본 크기 |\n| --- | --- | --- | --- |\n'+manifest.assets.map(a=>'| '+a.id+' | '+a.label+' | [파일]('+a.path+') | '+(a.width?a.width+'×'+a.height:'SVG')+' |').join('\n')+'\n');
writeFileSync(root+'MAP_MENU_ART_README.md','# 지도와 소품 메뉴 그래픽 v02\n\n내장 image_gen으로 창고 조감도와 투명 소품 아이콘 8개를 별도로 제작했다. 기존 원본은 보존한다. 전체 프롬프트와 출처는 [제작 기록](map-ui-generation-log.json)에 저장한다.\n\n'+log.assets.map(a=>'- ['+a.label+']('+a.path+') — '+a.id).join('\n')+'\n\n창고와 섬의 그림 위에 열린 장소, 이동 경로, 현재 위치를 실제 버튼으로 합성한다. 생성된 그림 자체에는 정답·한글 기능 라벨을 넣지 않았다. 모든 메뉴의 글자는 Pretendard다. 탐색 배경의 기본은 화면 채우기이며 가장자리 단서를 읽는 전체 장면 보기를 별도로 제공한다. 좌표는 원본 비율을 유지한 장면 레이어 기준이므로 확대 보기에서 화면 밖으로 나간 대상은 전체 장면 보기 또는 조사 목록에서 접근한다.\n');
console.log('Map and painted menu icons indexed: '+manifest.counts.generatedRaster+' PNGs.');
