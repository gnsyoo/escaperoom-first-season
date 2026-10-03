# 지도와 소품 메뉴 그래픽 v02

내장 image_gen으로 창고 조감도와 투명 소품 아이콘 8개를 별도로 제작했다. 기존 원본은 보존한다. 전체 프롬프트와 출처는 [제작 기록](map-ui-generation-log.json)에 저장한다.

- [배낭](ui/painted/inventory_v02.png) — UI_INVENTORY_V02
- [수첩](ui/painted/notebook_v02.png) — UI_NOTEBOOK_V02
- [지도](ui/painted/map_v02.png) — UI_MAP_V02
- [방송 힌트](ui/painted/hint_v02.png) — UI_HINT_V02
- [기록 보관](ui/painted/save_v02.png) — UI_SAVE_V02
- [설정](ui/painted/settings_v02.png) — UI_SETTINGS_V02
- [조사](ui/painted/inspect_v02.png) — UI_INSPECT_V02
- [메뉴](ui/painted/menu_v02.png) — UI_MENU_V02
- [창고 조감 지도](map/ch01_warehouse_map_v02.png) — CH01_WAREHOUSE_MAP_V02

창고와 섬의 그림 위에 열린 장소, 이동 경로, 현재 위치를 실제 버튼으로 합성한다. 생성된 그림 자체에는 정답·한글 기능 라벨을 넣지 않았다. 모든 메뉴의 글자는 Pretendard다. 탐색 배경의 기본은 화면 채우기이며 가장자리 단서를 읽는 전체 장면 보기를 별도로 제공한다. 좌표는 원본 비율을 유지한 장면 레이어 기준이므로 확대 보기에서 화면 밖으로 나간 대상은 전체 장면 보기 또는 조사 목록에서 접근한다.
