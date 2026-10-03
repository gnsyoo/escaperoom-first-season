import {readFileSync,writeFileSync} from 'node:fs';
const root='art/production/v01/';
const log=JSON.parse(readFileSync(root+'season-generation-log.json','utf8'));
const plan=JSON.parse(readFileSync(root+'asset-plan-final.json','utf8'));
const manifest=JSON.parse(readFileSync(root+'manifest.json','utf8'));
for(const a of log.assets){
 const {source,toolMode,...entry}=a;
 if(!plan.assets.some(x=>x.id===a.id))plan.assets.push(entry);
 if(!manifest.assets.some(x=>x.id===a.id)){const b=readFileSync(root+a.path);manifest.assets.push({...entry,prompt:undefined,exists:true,width:b.readUInt32BE(16),height:b.readUInt32BE(20),bytes:b.length,colorType:b[25],promptRef:'season-generation-log.json#'+a.id});}
}
manifest.counts={...manifest.counts,plannedRaster:plan.assets.length,generatedRaster:manifest.assets.filter(a=>a.path.endsWith('.png')).length};
writeFileSync(root+'asset-plan-final.json',JSON.stringify(plan,null,2)+'\n');
writeFileSync(root+'manifest.json',JSON.stringify(manifest,null,2)+'\n');
const gallery=readFileSync(root+'gallery.html','utf8').replace(/const assets=\[[\s\S]*?\];const grid=/,'const assets='+JSON.stringify(manifest.assets.filter(a=>a.exists)).replaceAll('<','\\u003c')+';const grid=');writeFileSync(root+'gallery.html',gallery);
writeFileSync(root+'ASSET_INDEX.md','# 표류도 그래픽 리소스 목록\n\nPNG '+manifest.counts.generatedRaster+'장, SVG '+manifest.counts.svg+'개. 신규 9장 장치 확대 이미지는 내장 image_gen으로 제작했다. 한글과 기능 라벨은 실제 Pretendard UI 레이어에 표시한다.\n\n| ID | 용도 | 파일 | 원본 크기 |\n| --- | --- | --- | --- |\n'+manifest.assets.map(a=>'| '+a.id+' | '+a.label+' | [파일]('+a.path+') | '+(a.width?a.width+'×'+a.height:'SVG')+' |').join('\n')+'\n');
writeFileSync(root+'SEASON_ART_README.md','# 2장부터 10장 장치 확대 이미지\n\n'+log.assets.map(a=>'- ['+a.label+']('+a.path+') — '+a.id).join('\n')+'\n\n원본 배경 30종, 미래 아이템과 기존 인물 초상, 엔딩 CG를 이 9종과 함께 사용한다. 신규 확대 PNG는 각 장의 펌프, 거울, 렌즈, 자료 보관함, 덫, 무전기, 모니터, 발전기, 보트 연결부다. 이미지는 원본을 보존하고 앱에서 비율을 유지해 표시한다.\n\n생성 모드: 내장 image_gen. 정확한 프롬프트와 원본 출처는 [제작 기록](season-generation-log.json)에 저장했다. 신규 이미지의 별도 QA는 사용자 요청에 따라 실행하지 않았다. 기존 1장 리소스와 화면은 보존했다.\n');
console.log('Season art indexed for runtime and delivery.');
