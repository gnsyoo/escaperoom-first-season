import {readFileSync,writeFileSync} from 'node:fs';
const data=JSON.parse(readFileSync('data/season.chapters.json','utf8'));
const stages=data.chapters.flatMap(c=>c.stages),linked=stages.filter(p=>p.storyLinked),inputs=stages.filter(p=>['controls','code','sequence','choice','combine'].includes(p.kind)),linkedInputs=inputs.filter(p=>p.storyLinked);
writeFileSync('docs/09_STORY_UX_QUALITY.md',`# 시즌 스토리와 UI UX 개선 기록

최신 사용자의 품질 목표를 반영한 현재 구현 기준이다. 이전의 검증 생략 요청보다 이후의 반복 검증 요청을 우선했다. 게임은 1장 25단계와 2장부터 10장 180단계, 총 205단계로 이어진다.

## 이야기와 연결된 문제

추론을 위한 입력·조합 문제 ${inputs.length}개 가운데 ${linkedInputs.length}개(${Math.round(linkedInputs.length/inputs.length*100)}%)가 사건 기록의 대조, 진술 확인 또는 인물의 구출 및 선택에 직접 연결된다. 전체 신규 180단계 가운데 ${linked.length}개(${Math.round(linked.length/180*100)}%)가 직접 이야기와 연결된다. 나머지는 도구 회수와 안전한 시설 정비다. storyLinked는 저자가 지정한 서사 연결 분류이며 재미나 난이도를 점수로 검증한 결과는 아니다. 각 단계의 storyPurpose에 구체적인 연결 이유를 기록했다.

일반 시설을 감시자가 일부러 암호방으로 바꿨다는 설정을 피했다. 학교는 관리일지에 근거한 비상 키박스, 등대와 방송 자료는 접수 시각 및 파일 번호의 조회, 피해자 자료는 날짜 색인이다. 동굴의 구조 시각은 문을 여는 암호가 아니라 수첩에 남기는 기록이다. 시설 무전기는 실제 주파수와 군용 난수표를 흉내 낸 수치 대신 등록 채널과 파일 색인을 사용한다. 출항은 같은 썰물 구간에서 바람과 항로 확인 신호를 기다린다.

## 사건의 현실적 근거

해담개발의 불법 폐수 흔적과 침수 위험 관측을 누락한 축약 보고서가 사업 중단을 피하려는 은폐 동기를 만든다. 9월 15일과 16일 기록 수정, 17일 대피 요청과 보류 지시, 늦은 방송과 침수로 사건이 이어진다. 양식장 수조의 숫자는 해당 시설의 눈금이며 펌프로 바다 전체의 수위를 낮추는 설정이 아니다. 배수는 분리된 작업 통로를 열고 실제 해안 통행은 조수 시계에 따른다. 제시한 기계 절차는 게임으로 단순화한 정비이며 실제 장비의 교육 자료는 아니다.

도윤은 조사 업체에서 일했다는 사실과 자신의 신원을 알고 있다. 8년 전의 구체적인 결정을 바로 떠올리지 못하는 상태에 최근 감금의 혼란이 겹친다. 원본을 읽는다고 기억이 완전히 복구되지 않으며 기억으로 빠진 증거를 채워 넣지 않는다. 태오의 장기간 감시 준비는 시설 기사로서의 접근 권한에서 비롯된다. 폭풍 때의 추격 신호는 기존 자동 경보이며 정체불명의 새 범인이 나타나는 설정은 없다. 도윤의 구조, 서명 책임, 태오의 납치는 각각 다르게 기록된다.

## 그래픽과 조작 개선

황동 장식, 나사, 금속 프레임, 종이 질감과 입체 버튼을 직접 제작한 벡터 및 CSS로 표현했다. 확대 장치 그림 위에 실제 클릭 가능한 다이얼을 얹고 별도의 정확한 버튼 선택도 제공한다. 전 글꼴은 로컬 Pretendard다. 인물 대화에서는 기존 초상을 사용하고 이동·조수 패널을 잠시 감춰 대사와 얼굴이 충분히 보이게 한다. 읽은 대화는 수첩에 저장된다.

성공 및 실패 메시지는 탐색 화면의 상단 가까이 표시한다. 퍼즐 오류는 스크롤 영역 밖의 고정 안내 줄에 나오므로 아래로 읽은 뒤 오답을 입력해도 보인다. 조작 확인은 퍼즐 하단에서 따라온다. 실패 시 도구는 소모되지 않고 중복 성공에는 보상이 추가되지 않는다. 접근성 이름에 장식 문자가 섞이던 문제를 도형으로 바꿨다.

작은 화면의 하단 메뉴가 두 줄로 갈라지는 문제, 헤더의 낮은 대비, 내보내기 목록이 화면 이미지에 섞이는 문제를 수정했다. 잠긴 문 내부는 먼저 열기 전까지 들어갈 수 없으며 원본 회수 재방문에서는 완료 카드를 닫아 선택 조사를 할 수 있다.

## 실행한 검증

10개 단위 검증에서 전체 진행, 잘못된 입력과 소모, 중복 지급, 저장 재생, 세 엔딩, 원본 재회수와 위험 후퇴를 다룬다. 실제 브라우저에서 1장 25단계와 신규 180단계를 입력·조합·사용으로 완주했다. 시즌은 320×568, 360×780, 390×844, 1280×900의 36개 화면 조합을 검사했다. 1장 화면 및 수동 저장·덮어쓰기·사본 복구도 기존 검사로 확인한다. 정확한 최신 실행 결과는 test-results에 생성되며 Git에는 검사 스크립트와 이 설명을 저장한다.

시각 검토에서 발견한 문제를 고친 후 해당 범위를 다시 확인했다. 이 결과는 사람에 의한 장시간 재미 평가, 실제 iOS·Android 기기, 접근성 보조 도구 전체 및 성우·음악의 검증을 대신하지 않는다. 현재 음악과 성우 음성은 없고 조작 효과음만 있다. 모바일 앱 패키징과 스토어 출시는 별도 단계다.

## 웹 배포

원본 PNG는 저장소의 art/production/v01에 보존한다. 실행용 WebP 122개는 약 34MB로 줄었으며 원본 약 245MB 대비 86% 감소했다. 배포 스크립트가 매 빌드 때 생성하므로 압축본을 따로 수정하지 않는다. GitHub Pages는 .github/workflows/pages.yml에서 테스트와 빌드를 거쳐 배포한다. GitHub의 공식 사용자 워크플로 방식에 따른다: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
`);
let spec=readFileSync('docs/08_SEASON_CH02_CH10.md','utf8').replace('사용자 요청에 따라 추가 테스트 및 시각 QA는 실행하지 않는다. 문서의 규칙은 구현 요구이며 검증 완료 선언이 아니다.','후속 사용자 요청에 따라 단위 및 브라우저 검증을 실행하고 시각·조작 문제를 수정했다. 최신 범위는 09_STORY_UX_QUALITY.md를 따른다.');writeFileSync('docs/08_SEASON_CH02_CH10.md',spec);
for(const c of data.chapters){const file='docs/chapters/'+c.id+'_STORY_PUZZLES_UI.md';let s=readFileSync(file,'utf8');s+='\n## 이야기 연결과 제작 기준\n\n'+c.stages.filter(p=>p.storyLinked).map(p=>'- '+p.number+' '+p.title+': '+p.storyPurpose).join('\n')+'\n\n이 장은 기존 배경과 인물, 신규 장치 확대 이미지 및 실제 조작 UI를 사용한다. 메뉴 읽기 중 위험 타이머가 멈춘다. 대화 기록, 선택 원본, 책임 선택은 이후 장과 저장에 연결된다.\n';writeFileSync(file,s);}
let ui=readFileSync('docs/07_UI_IMPLEMENTATION.md','utf8');ui='> 최신 시즌 전체 구현과 그래픽 UI 기준은 [시즌 확장](08_SEASON_CH02_CH10.md)과 [품질 개선](09_STORY_UX_QUALITY.md)을 따른다. 아래의 1장 v02 기록은 이전 제작 이력이다.\n\n'+ui;writeFileSync('docs/07_UI_IMPLEMENTATION.md',ui);
const readme=`# 표류도 기억의 해안

웹에서 플레이하고 이후 모바일 앱으로 확장할 수 있는 현대 2D 미스터리 방탈출 게임이다. 검은방 3의 전반적인 긴장감만 참고하며 배경·인물·UI는 이 게임용 창작물이다. 적당히 낡고 건조하며 덜 어두운 해안 시설, 로컬 프리텐다드가 기준이다.

1장부터 10장까지 205개 진행 단계와 세 엔딩을 구현했다. 신규 180단계 중 입력·조합 문제의 ${Math.round(linkedInputs.length/inputs.length*100)}%가 사건의 기록이나 인물 상황에 직접 연결된다. 인벤토리·조합·수첩·대화 기록·지도·힌트·설정·자동 및 수동 저장이 작동한다. 게임용 금속 프레임과 황동 장식, 장치 위 다이얼, 인물 초상을 적용했고 반복 검토에서 발견한 조작 문제를 수정했다.

## 결과물

- [2장부터 10장 상세 문서](docs/chapters/README.md)
- [시즌 스토리와 구현 가이드](docs/08_SEASON_CH02_CH10.md)
- [스토리 UI UX 개선 및 검증 범위](docs/09_STORY_UX_QUALITY.md)
- [현재 UI 완성 이미지 갤러리](art/ui-screens/season-v02/gallery.html)
- [원본 그래픽 갤러리](art/production/v01/gallery.html)
- [신규 9장 장치 이미지](art/production/v01/SEASON_ART_README.md)
- [이미지 프롬프트와 제작 출처](art/production/v01/season-generation-log.json)
- [1장 이전 화면 26종](art/ui-screens/v02/gallery.html)

원본 그래픽은 PNG 122개와 SVG 63개, 별도 게임 프레임 SVG 2개다. 웹 빌드는 WebP로 압축하며 원본은 보존한다. UI 갤러리와 개발 문서에는 정답과 엔딩의 스포일러가 있다. 기본 게임은 본 엔딩과 확인한 기록만 보여 준다.

## 실행

Node 24와 pnpm 11을 준비한다. 버전은 잠금 파일로 고정한다.

~~~text
pnpm install --frozen-lockfile
pnpm dev
~~~

게임은 http://127.0.0.1:5173/ , 제작 화면은 http://127.0.0.1:5173/season-preview.html 이다. 1장 완료 카드에서 2장으로 이어진다. 이미 진행한 시즌 저장이 있으면 홈 화면에서 계속할 수 있다.

~~~text
pnpm test
pnpm build
pnpm preview
~~~

빌드 결과는 dist에 생성된다. 자동 압축 이미지를 포함하며 정적 웹 서버로 실행한다. GitHub main 푸시 시 Pages 워크플로가 실행된다. 저장소 설정의 Pages 소스는 GitHub Actions로 지정한다. 앱 서명·모바일 스토어 출시는 구현 범위에 포함되지 않는다.

## 브라우저 검사

~~~text
node tests/e2e/playthrough.mjs
node tests/e2e/layout-and-save.mjs
node tests/e2e/season-playthrough.mjs
node tests/e2e/season-layout.mjs
~~~

로컬 Chrome/Edge 또는 Playwright Chromium을 사용한다. PYORYUDO_BROWSER로 실행 파일 경로를 지정할 수 있다. 검사 파일을 실행할 때 개발 서버가 먼저 실행돼 있어야 한다. 원본 리소스와 최신 UI의 상태, 검증의 한계는 품질 문서에 기록한다.
`;
writeFileSync('README.md',readme);
console.log(JSON.stringify({stages:180,storyLinked:linked.length,inputPuzzles:inputs.length,storyInputPuzzles:linkedInputs.length}));
