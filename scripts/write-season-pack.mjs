import {chapters} from './season-story-revisions.mjs';
import {writeFileSync,mkdirSync,readFileSync} from 'node:fs';
const root='art/production/v01';
const item=(name,asset,description)=>({name,asset,description});
const items={
 screwdriver:item('드라이버','screwdriver','창고에서 챙긴 작은 십자 드라이버. 커버와 걸쇠에 쓴다.'),
 uv_lamp_ready:item('전지가 든 UV 램프','uv_lamp_ready','겹쳐 남은 기록을 읽을 수 있는 램프.'),
 pump_contact:item('펌프 예비 접점','radio_connector','펌프 제어 소켓에 맞는 교체 부품.'),
 repair_rope:item('임시 보수 끈','rope','보행교 판자를 고정할 길고 마른 끈.'),
 bridge_kit:item('다리 보수 묶음','repair_plank','끈과 판자를 결합한 보행교 보수 도구.'),
 tide_watch:item('조수 관측 시계','tide_watch','이동과 기다리기로 진행하는 가상 조수 표시.'),
 relay_key:item('등대 중계 열쇠','relay_key','등대 입구 잠금을 여는 열쇠.'),
 reflector_disk:item('반사판','reflector_disk','동굴의 마지막 거울 축에 설치한다.'),
 lens_crank:item('렌즈 조절 손잡이','lens_crank','등대 렌즈의 빈 축에 설치한다.'),
 archive_key:item('자료실 열쇠','archive_key','분교 자료실의 문을 연다.'),
 safety_pin:item('장치 안전핀','safety_pin','장력을 풀기 전에 덫의 정지 고리를 고정한다.'),
 repair_plank:item('보수 판자','repair_plank','끈과 조합해 보행교를 복구한다.'),
 radio_connector:item('무전기 예비 접점','radio_connector','가상 무전 회로의 교체 접점.'),
 backup_drive:item('원본 백업 드라이브','backup_drive','CCTV 원본과 시계 오차를 함께 보존한다.'),
 generator_fuse:item('발전기 예비 퓨즈','generator_fuse','가상 발전기 점검 소켓에 쓰는 부품.'),
 fuel_hose:item('연료 호스','fuel_hose','가상 보트 정비 퍼즐의 교체 호스.'),
 contact_tool:item('접점 정리 도구','contact_tool','보트 시동 접점을 정리하는 도구.'),
 boat_key:item('보트 시동 열쇠','boat_key','수리와 점검을 끝낸 뒤 시동에 쓴다.')
};
const letters=['A','B','C','D'];
for(const c of chapters){
 c.backgrounds=c.views.map((_,i)=>c.id+'_'+letters[i]);
 let previous=null;
 c.stages.forEach((s,i)=>{
  s.id=c.id+'_P'+String(i+1).padStart(2,'0');s.number=i+1;
  s.requires=(s.requires|| (previous?[previous]:[])).map(x=>typeof x==='number'?c.id+'_P'+String(x).padStart(2,'0'):x);
  s.clueRefs=(s.clueRefs||[]).map(x=>c.id+'_P'+String(x).padStart(2,'0'));
  s.rect={x:.16+(i%3)*.23,y:.25+(i%4)*.10,w:.19,h:.09};
  s.dialogue=(s.dialogue||[]).map((x,j)=>({...x,id:s.id+'_D'+j}));
  if(s.note)s.note.id=s.id;
  const answer=Array.isArray(s.solution)?s.solution.map(x=>s.controls?.flatMap(c=>c.options).find(o=>o.value===x)?.label||x).join(' → '):s.options?.find(o=>o.value===s.solution)?.label||s.solution;
  s.hints=[s.kind==='use'?'표찰과 가지고 있는 도구의 모양을 먼저 대응해 보세요.':s.optional?'원본 날짜와 수치를 수정본과 비교하세요.':'이 장소에서 앞서 수첩에 남긴 기록과 표찰을 먼저 읽어 보세요.',s.clue||s.clueRefs.map(id=>c.stages.find((_,n)=>c.id+'_P'+String(n+1).padStart(2,'0')===id)?.description).filter(Boolean).join('\n')||s.description,answer?'필요한 조작: '+(items[answer]?.name||answer):s.description];
  if(!s.optional)previous=s.id;
 });
 c.intro=c.intro.map((x,i)=>({...x,id:c.id+'_INTRO'+i}));
}
const endings={T:{title:'진실의 해안',asset:'ending_truth',body:'모두가 섬을 벗어났다. 관측 원본, 대피 요청, 보류 서명과 원본 영상이 수정 보고서 옆에 공개된다. 도윤은 확인 없이 서명한 책임을 인정하고 조사에 응한다. 뒤늦은 구조도 지워지지 않는다. 태오는 납치의 책임을 진술한다. 서희를 포함한 피해자 여섯 명의 이름이 다시 기록된다.'},N:{title:'남겨진 파도',asset:'ending_partial',body:'보트는 섬을 벗어났고 확인한 기록은 보존됐다. 그러나 회수하지 못한 원본 또는 도윤이 설명하지 않은 책임 때문에 사건의 전체 결론은 아직 열려 있다. 서린과 혜진은 각자의 자료를 공개하며 조사를 이어 간다.'},B:{title:'끊어진 신호',asset:'ending_silence',body:'충돌 중 부두 중계 장치가 손상됐다. 녹색 신호가 끊기고 출항 창을 놓쳤다. 아직 아무도 섬을 벗어나지 못했다. 마지막 대면 직전으로 돌아가 원본과 안전 신호를 지킬 수 있다.'}};
mkdirSync('data',{recursive:true});writeFileSync('data/season.chapters.json',JSON.stringify({schemaVersion:2,version:'season-v1',title:'표류도 기억의 해안',items,endings,chapters},null,2)+'\n');
mkdirSync('docs/chapters',{recursive:true});
for(const c of chapters){
 let md='# '+c.number+'장 '+c.title+'\n\n'+c.place+'에서 '+c.goal+'라는 목표를 진행한다. '+c.summary+'\n\n## 장면과 그래픽\n\n'+c.views.map((v,i)=>'- '+v+': `'+c.backgrounds[i]+'`, `backgrounds/'+c.id.toLowerCase()+'/'+c.backgrounds[i].toLowerCase()+'_v01.png`. 전체 그림을 유지하고 하단 UI와 구분한다.').join('\n')+'\n\n확대 퍼즐은 `'+c.closeup+'`를 사용한다. 이미지 안 숫자나 한글은 넣지 않고 실제 조작 레이어에 Pretendard로 렌더링한다. 밝은 중간톤, 마른 표면, 제한된 녹과 마모를 유지한다. 각 화면은 배경 5:6, 확대 퍼즐 1:1, 초상 투명 PNG를 원본 비율로 배치한다.\n\n## 도입 대사\n\n'+c.intro.map(x=>'> '+x.speaker+': '+x.text).join('\n\n')+'\n\n## 20개 진행 단계\n\n';
 for(const s of c.stages){md+='### '+s.number+' '+s.title+'\n\n`'+s.id+'` · '+c.views[s.view]+' · '+s.kind+(s.optional?' · 선택 기록':' · 필수')+'\n\n'+s.description+'\n\n선행: '+(s.requires.join(', ')||'장 도입')+'. 도구: '+(s.requiresItems||[]).map(x=>items[x].name).join(', ')+'.\n\n';if(s.clue)md+='현장 단서: '+s.clue+'\n\n';if(s.solution)md+='정답 또는 조작 순서: `'+JSON.stringify(s.solution)+'`. 실패 시 도구 및 진행 상태를 보존한다.\n\n';if(s.options)md+='선택지: '+s.options.map(o=>o.label).join(' / ')+'.\n\n';if(s.grant)md+='획득: '+s.grant.map(x=>items[x].name).join(', ')+'.\n\n';if(s.consume)md+='성공 후 소모: '+s.consume.map(x=>items[x].name).join(', ')+'.\n\n';if(s.evidence)md+='영구 기록: '+s.evidence+'.\n\n';if(s.dialogue.length)md+=s.dialogue.map(x=>'> '+x.speaker+': '+x.text).join('\n\n')+'\n\n';md+='힌트 1: '+s.hints[0]+'\n\n힌트 2: '+s.hints[1]+'\n\n힌트 3: '+s.hints[2]+'\n\n';}
 md+='## UI와 전환\n\n상단에는 장 제목, 현재 장면과 자동 저장 상태를 표시한다. 목표 아래 배경 위 조사 지점을 최소 44px로 배치한다. 선행 조건이 충족된 지점만 제목을 노출한다. 조사 목록에서 동일한 행동에 접근할 수 있다. 아래에는 장면 이동, 조수, 인벤토리·수첩·지도·힌트·설정 도구 모음을 둔다. 대사는 화자, 본문, 다음 버튼과 2D 초상으로 표현한다. 확대 퍼즐에는 실제 버튼·입력·순서 조합 및 현장 단서를 제공한다. 해결된 자료는 수첩에 남고 지점에서 다시 읽을 수 있다.\n\n완료 카드에서 다음 장으로 이동한다. 8장까지 이미 진행한 장소로 재방문하여 선택 원본을 확보할 수 있다. 9장 이후 이전 장소 접근은 폭풍으로 제한되며 수첩은 계속 읽을 수 있다.\n';
 writeFileSync('docs/chapters/'+c.id+'_STORY_PUZZLES_UI.md',md);
}
const story=`# 2장부터 10장까지 시즌 확장 구현 가이드

기존 1장의 밝고 적당히 낡은 현대 2D 미스터리 연출을 이어서 9개 장, 180개 진행 단계를 구성한다. 1장 25개를 포함한 전체 흐름은 205개 단계다. 검은방 3은 긴장감과 조사 중심 리듬의 분위기만 참고하며 인물, 장면, 퍼즐과 UI는 이 프로젝트의 창작물이다. 전 UI는 로컬 Pretendard Variable을 사용한다.

## 사건과 인물

가상의 연무도와 해담개발을 배경으로 한다. 8년 전 9월 15일 위험 관측, 16일 보고서 축약과 도윤의 서명, 17일 폭풍이 있었다. 18:40 윤서희의 대피 요청, 19:10 강민석의 보류 전달, 19:35 해안 침수, 20:05 한도윤의 수동 방송 순이다. 불법 폐수와 은폐, 지연된 대피로 주민 여섯 명이 사망했으나 공식 결론은 주민 거부와 자연재해를 탓했다.

한도윤 31세는 당시 신입 기록 담당자다. 상급자의 지시로 확인 없이 축약본에 서명했고 뒤늦게 원본을 복사해 구조를 도왔다. 구조는 앞선 책임을 지우지 않는다. 납치 과정의 부상 이후 부분적인 기억 공백이 있으며 의학 진단이나 모든 기억의 회복을 단정하지 않는다. 윤태오 34세는 시설 기사이자 당시 25세 보조 교사 윤서희의 오빠다. 진실을 요구하지만 납치와 감시의 책임은 별개로 남는다. 오혜진 39세는 검토 메일을 보관한 보고서 검토자, 박서린 29세는 당시 봉사자이며 현재 기자, 강민석 46세는 운영 지시를 전달한 담당자다.

## 장별 흐름

${chapters.map(c=>'- '+c.number+'장 '+c.title+' — '+c.summary).join('\n')}

## 원본과 엔딩

E01 관측 원본은 2장 UV 복원 선택 조사, E02 요청 원본은 4장 선택 보관, E03 보류 서명은 7장 필수, E04 CCTV는 8장 필수다. 8장에서 책임을 인정하고 9장에서 동료를 모두 구출하며 네 원본을 지킨 뒤 10장에서 비폭력 출항을 고르면 진실의 해안에 도달한다. 비폭력 출항에서 조건이 빠지면 남겨진 파도, 장치를 손상시키는 충돌 선택은 끊어진 신호다. 폭력 분기는 대면 전 재시도로 복귀한다. 엔딩 목록은 실제 본 엔딩만 표시한다.

## 조수와 위험 구간

일반 조수는 행동 칸 12개다. 썰물 4, 상승 2, 만조 4, 하강 2이며 성공한 이동과 기다림만 1칸 진행한다. 조사와 실패 입력은 진행시키지 않는다. 3장 입장은 썰물 첫 칸을 요구한다. 동굴 제한 기본 180초, 여유 360초, 해제 가능. 9장 경보 제한 기본 90초, 여유 180초, 해제 가능. 대화, 모든 메뉴 및 문서 읽기, 확대 퍼즐과 브라우저 비활성 동안 정지한다. 타임아웃 또는 후퇴는 구간 진입 직전의 전체 상태로 복원하므로 소모품과 기록이 소실되지 않는다. 위험 구간 동안 일반 조수는 고정된다.

## 웹 구현과 모바일 인계

1장의 기존 저장 DB를 유지하고 2장 이후는 별도의 시즌 저장 DB에서 관리한다. 장 완료 버튼으로 연속 이동한다. 자동 저장과 3개 수동 슬롯, 이전 저장 사본을 제공한다. 데이터는 data/season.chapters.json, 단계별 결과는 원자적으로 소비·획득·기록한다. 중복 조작은 보상을 추가 지급하지 않는다. 화면은 터치 입력과 실제 HTML 버튼으로 구현해 웹과 WebView에서 같은 동작을 사용한다. 모바일 앱 패키징, 서명과 스토어 출시는 이후 별도 작업이다.

세로 360×780을 기본 이미지 내보내기 기준으로 삼으며 3배 PNG는 1080×2340이다. 긴 메뉴는 스크롤한다. 작은 화면에서도 버튼 44px 이상을 확보한다. 배경 전체를 보존하는 contain 방식이며 캐릭터는 원본 비율을 유지한다. 대화 16px, 본문 14~18px, 기능 라벨 12px 이상이다. 밝기·글자 크기·위험 시간·음량을 설정에서 조절한다. 보이는 한글은 모두 폰트 레이어이고 AI 배경에는 기능 텍스트를 굽지 않는다.

## 파일 인계와 제작 상태

각 장의 상세 문서는 docs/chapters에 있으며 개발자는 해당 문서와 JSON을 같이 읽는다. 기존 배경 30종과 미래 도구, 인물, 엔딩 이미지를 재사용하고 각 장의 핵심 장치 확대 PNG 9종을 추가했다. 실제 React 화면의 PNG는 art/ui-screens/season-v02에 저장한다. 사용자 요청에 따라 추가 테스트 및 시각 QA는 실행하지 않는다. 문서의 규칙은 구현 요구이며 검증 완료 선언이 아니다.
`;
writeFileSync('docs/08_SEASON_CH02_CH10.md',story);
writeFileSync('docs/chapters/README.md','# 2장부터 10장까지 상세 문서\n\n'+chapters.map(c=>'- ['+c.number+'장 '+c.title+']('+c.id+'_STORY_PUZZLES_UI.md)').join('\n')+'\n');
console.log('Season content and chapter handoff documents written.');
