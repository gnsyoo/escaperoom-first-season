# 표류도 기억의 해안

웹에서 플레이하고 이후 모바일 앱으로 확장할 수 있는 현대 2D 미스터리 방탈출 게임이다. 검은방 3의 전반적인 긴장감만 참고하며 배경·인물·UI는 이 게임용 창작물이다. 적당히 낡고 건조하며 덜 어두운 해안 시설, 로컬 프리텐다드가 기준이다.

1장부터 10장까지 205개 진행 단계와 세 엔딩을 구현했다. 신규 180단계 중 입력·조합 문제의 69%가 사건의 기록이나 인물 상황에 직접 연결된다. 인벤토리·조합·수첩·대화 기록·지도·힌트·설정·자동 및 수동 저장이 작동한다. 게임용 금속 프레임과 황동 장식, 장치 위 다이얼, 인물 초상을 적용했고 반복 검토에서 발견한 조작 문제를 수정했다.

## 결과물

- [웹에서 게임 실행](https://gnsyoo.github.io/escaperoom-first-season/)
- [공개 완성 UI 갤러리](https://gnsyoo.github.io/escaperoom-first-season/art/ui-screens/season-v02/gallery.html)
- [GitHub 소스 저장소](https://github.com/gnsyoo/escaperoom-first-season)
- [2장부터 10장 상세 문서](docs/chapters/README.md)
- [시즌 스토리와 구현 가이드](docs/08_SEASON_CH02_CH10.md)
- [스토리 UI UX 개선 및 검증 범위](docs/09_STORY_UX_QUALITY.md)
- [그래픽 지도·소품 메뉴·배경 표시 기준](docs/10_GRAPHICAL_MAP_MENU.md)
- [현재 UI 완성 이미지 갤러리](art/ui-screens/season-v02/gallery.html)
- [원본 그래픽 갤러리](art/production/v01/gallery.html)
- [신규 9장 장치 이미지](art/production/v01/SEASON_ART_README.md)
- [이미지 프롬프트와 제작 출처](art/production/v01/season-generation-log.json)
- [1장 이전 화면 26종](art/ui-screens/v02/gallery.html)

원본 그래픽은 PNG 131개와 SVG 63개, 별도 게임 프레임 SVG 2개다. 새 창고 조감도와 투명 메뉴 소품 아이콘 8종을 포함한다. 웹 빌드는 WebP로 압축하며 원본은 보존한다. UI 갤러리와 개발 문서에는 정답과 엔딩의 스포일러가 있다. 기본 게임은 본 엔딩과 확인한 기록만 보여 준다.

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
node tests/e2e/season-feedback-and-return.mjs
node tests/e2e/legacy-feedback.mjs
node tests/e2e/graphical-map-and-scene.mjs
~~~

로컬 Chrome/Edge 또는 Playwright Chromium을 사용한다. PYORYUDO_BROWSER로 실행 파일 경로를 지정할 수 있다. 검사 파일을 실행할 때 개발 서버가 먼저 실행돼 있어야 한다. 원본 리소스와 최신 UI의 상태, 검증의 한계는 품질 문서에 기록한다.
