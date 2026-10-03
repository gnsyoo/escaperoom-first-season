import {writeFileSync,mkdirSync} from 'node:fs';
const dialogue=(speaker,text,portrait)=>({speaker,text,...(portrait?{portrait}:{})});
const note=(title,body)=>({title,body});
const control=(label,options)=>({label,options:options.map(x=>typeof x==='string'?{value:x,label:x}:{value:x[0],label:x[1]})});
const stage=(title,view,kind,description,extra={})=>({title,view,kind,description,...extra});
const take=(title,view,item,description)=>stage(title,view,'take',description,{grant:[item]});
const inspect=(title,view,body,extra={})=>stage(title,view,'inspect',body,{note:note(title,body),...extra});
const code=(title,view,description,solution,clueRefs)=>stage(title,view,'code',description,{solution,clueRefs});
const controls=(title,view,description,labels,options,solution,extra={})=>stage(title,view,'controls',description,{controls:labels.map((label,i)=>control(label,Array.isArray(options[0])&&Array.isArray(options[0][0])?options[i]:options)),solution,...extra});
const order=(title,view,description,options,solution,extra={})=>stage(title,view,'sequence',description,{options:options.map(x=>({value:x,label:x})),solution,...extra});
const use=(title,view,item,description,extra={})=>stage(title,view,'use',description,{solution:item,requiresItems:[item],...extra});
const exit=(view,description)=>stage('다음 길로 나아가기',view,'exit',description);
const chapters=[];

chapters.push({id:'CH02',number:2,title:'수면 아래',place:'폐양식장 관리동',time:'첫날 · 오후 17:10',goal:'수조를 안전 수위까지 낮추고 해안길을 열자',closeup:'CH02_PUMP_CLOSE',views:['관리동 사무실','양식 수조 구역','펌프실'],intro:[dialogue('도윤','창고를 나오자 바다가 보인다. 섬의 반대편으로 가려면 저 양식장을 지나야 한다.'),dialogue('스피커','물은 흔적을 지우지. 하지만 기록을 지우는 건 사람이야.')],summary:'강민석의 이름과 삭제된 관측 기록. 사고가 단순한 태풍 피해였다는 설명에 처음 균열이 생긴다.',stages:[
 inspect('관리동 안내판',0,'관리동에서 수조로, 수조에서 펌프실로 이어진다. 낮은 해안길은 수위 2 이하일 때만 통행 가능하다.'),
 take('작업 서랍의 공구',0,'pump_contact','서랍에서 펌프용 예비 접점을 발견했다.'),
 inspect('훼손 관리 일지',0,'9월 15일 관측치가 잉크로 지워져 있다. 확인란에는 강민석. 마지막 줄에는 “원본은 수조 수위와 함께 보관”이라고 적혔다.'),
 inspect('수조의 기준 눈금',1,'수위 눈금은 0~4. 현재 4, 통행 기준 2. 계기 표찰: 유입을 막고 순환을 닫은 뒤 우회로만 열면 표식 2에서 자동 정지.'),
 inspect('펌프 안전 절차',2,'정지 → 유입 닫기 → 순환 닫기 → 우회 열기 → 접점 복구 → 목표 눈금 지정 → 구동. 물이 있는 배관을 분리하지 않는다.'),
 controls('펌프 정지 확인',2,'회전음을 멈춘 뒤에만 접점 커버를 열 수 있다.',['펌프 전원'],[['OFF','정지'],['ON','구동']],['OFF'],{clueRefs:[5]}),
 stage('지워진 일지 복원',0,'controls','겹쳐 남은 원본 관측 수치를 UV로 확인하고 날짜 순서대로 기록한다.',{optional:true,requires:[3,6],requiresItems:['uv_lamp_ready'],controls:[control('9월 15일',['2','3','4']),control('9월 16일',['2','3','4'])],solution:['4','4'],clue:'UV 아래 두 원본 줄 모두 수위 4가 남아 있다. 축약 보고서에는 각각 2로 바뀌었다.',evidence:'E01',note:note('E01 · 원본 관측 일지','9월 15·16일 원본 수위 4 / 수정 보고서 2. 삭제된 확인란은 강민석. 날짜와 원본 수치가 같이 보이는 사본을 보관했다.')}),
 use('접점 커버 열기',2,'screwdriver','정지된 장치의 커버 나사를 풀자.',{requires:[6]}),
 use('펌프 접점 설치',2,'pump_contact','빈 소켓에 예비 접점을 설치한다.',{consume:['pump_contact']}),
 controls('배관 연결 맞추기',2,'두 개의 차단 밸브와 우회 레버를 표찰대로 맞춘다.',['유입','순환','우회'],[['closed','닫힘'],['open','열림']],['closed','closed','open'],{clueRefs:[5]}),
 controls('목표 수위 지정',2,'물이 완전히 빠지는 것이 목표가 아니다. 해안길 통행 표식을 읽자.',['목표 눈금'],['0','1','2','3','4'],['2'],{clueRefs:[1,4]}),
 stage('펌프 구동',2,'inspect','정지 상태에서 설정한 밸브와 목표 수위를 확인하고 구동한다.',{requires:[9,10,11],setFlags:{aquacultureDrained:true},dialogue:[dialogue('도윤','수위 2에서 멈췄다. 같은 눈금이 일지에서는 왜 다르게 적혔지?')]}),
 take('관측 시계',1,'tide_watch','수조 옆 점검함에서 조수 관측 시계를 챙겼다.'),
 inspect('조수 시계 사용법',1,'게임의 조수는 썰물 4칸 → 상승 2칸 → 만조 4칸 → 하강 2칸. 안전한 동굴 입장은 썰물 첫 칸에서. 조사와 대화는 칸을 진행시키지 않는다.'),
 inspect('민석의 최근 흔적',0,'급히 찢은 메모: “초소에 가면 송신부터 확인. 감시선은 아직 살아 있음.” 이곳에 다른 감금자가 있었다.'),
 code('해안길 잠금 패널',1,'패널 규칙은 목표 수위 한 자리 + 썰물 칸 수 한 자리다. 무작위 비밀번호가 아니다.','24',[4,14]),
 inspect('폐수 배관 표찰',2,'일반 해수 배관과 달리, 봉인된 관측 배관에 9월 15일 관리 서명이 있다. 폐수 흔적을 감춘 기록과 같은 날짜다.'),
 inspect('바뀐 보고서 사본',0,'“관측값 2, 대피 불필요.” 서명은 조사 담당 한도윤. 이름을 읽자 손끝이 떨린다.',{dialogue:[]}),
 stage('해안길의 첫 방송',1,'inspect','낮아진 수조 옆 안전 난간을 따라 밖으로 나간다.',{dialogue:[dialogue('스피커','그때도 보고서만 읽고 나갔나?'),dialogue('도윤','내 이름이 맞다. 하지만 이 문장을 쓴 날을 기억하지 못한다.')]}),
 exit(1,'조수 시계를 챙겨 해안 동굴의 안전 입구로 향한다.')
]});

chapters.push({id:'CH03',number:3,title:'바다가 닫히기 전에',place:'해안 동굴',time:'첫날 · 오후 17:40',goal:'썰물에 중계 열쇠를 회수하고 안전 선반으로 나오자',closeup:'CH03_MIRROR_CLOSE',views:['동굴 입구','반사판 통로','안전 대피 선반'],intro:[dialogue('도윤','길이 바위 아래로 이어진다. 시계의 썰물 표식이 통행 시간을 알려 줄 것이다.'),dialogue('스피커','물이 들어오면 낮은 길부터 사라진다. 그날에도 같았지.')],summary:'19:35 해안길 고립 표식과 20:05 구조 표식. 최초 대피 요청과 실제 구조 사이의 빈 시간이 드러난다.',stages:[
 inspect('입구의 안전 안내',0,'썰물 첫 칸에서 들어간다. 위험 구간의 수위 제한은 기본 180초, 여유 360초, 설정에서 해제 가능. 대화·퍼즐·메뉴를 읽는 동안 정지한다. 실패하면 입장 전 상태로 후퇴한다.'),
 inspect('바위의 대피 동선',0,'낮은 통로 → 빛 반사 표적 → 높은 선반. 높은 선반은 수위와 무관한 안전 지점이다.'),
 take('접힌 반사판',0,'reflector_disk','입구 정비함에서 반사판 한 장을 발견했다.'),
 stage('안전한 썰물에 입장',0,'tide','조수 시계가 썰물 첫 칸일 때 낮은 통로로 들어간다.',{gotoView:1,startDanger:'cave'}),
 inspect('반사판 방향 표식',1,'입사 방향에서 표적까지: 첫 거울 45°, 둘째 거울 90°, 마지막 거울 0°. 바위에 새겨진 세 화살표와 거울 축의 눈금이 대응한다.'),
 inspect('고정대의 빈 자리',1,'마지막 고정대만 비어 있다. 입구에서 챙긴 반사판이 축에 맞는다.'),
 use('마지막 반사판 설치',1,'reflector_disk','빈 축에 반사판을 끼우고 고정한다.',{consume:['reflector_disk']}),
 controls('빛의 경로 연결',1,'각 고정대의 눈금을 바위의 화살표와 맞춰 표적까지 빛을 보낸다.',['첫 거울','둘째 거울','마지막 거울'],['0','45','90'],['45','90','0'],{clueRefs:[5]}),
 inspect('빛으로 드러난 대피 표식',1,'침수 19:35 / 높은 선반 도착 20:05. 두 표식 사이에는 구조 작업 표시가 있다.'),
 code('중계함의 시각 잠금',1,'중계함 표찰: 높은 선반 도착 시각 HHMM. 벽에 실제 시각이 남아 있다.','2005',[9]),
 inspect('중계함 내부',1,'열쇠는 정비용 걸쇠에 고정되어 있다. 얇은 드라이버로 걸쇠를 열 수 있다.'),
 use('중계 열쇠 걸쇠 풀기',1,'screwdriver','중계함의 작은 걸쇠를 풀어 열쇠에 접근한다.'),
 take('등대 중계 열쇠',1,'relay_key','등대 중계 구역의 열쇠를 챙겼다.'),
 stage('높은 선반으로 탈출',1,'inspect','밝아진 표적 옆 난간을 따라 높은 선반으로 이동한다.',{gotoView:2,endDanger:true}),
 inspect('구조 흔적의 시간',2,'20:05라는 표식 아래 조사 업체의 장갑 자국이 남아 있다. 익숙한 흉터 모양과 닮았지만, 아직 자신의 흔적이라고 단정하지 않는다.'),
 inspect('낡은 주민 대피도',2,'해안길이 막힌 뒤 높은 숲길로 우회할 수 있었다. 그러나 분교 쪽 방송이 늦게 시작됐다고 적혀 있다.'),
 order('대피 경로 복원',2,'입구의 대피도와 실제 벽 표식을 순서대로 연결한다.',['낮은 통로','높은 선반','반사 표적'],['낮은 통로','반사 표적','높은 선반'],{clueRefs:[2]}),
 inspect('등대 안내 표찰',2,'회수한 중계 열쇠는 등대 입구 문에 맞는다. 육상 신호와 전체 지도를 확인할 수 있다.'),
 stage('살아남은 시간의 모순',2,'inspect','침수와 구조 사이의 시각을 수첩에 정리한다.',{dialogue:[dialogue('도윤','20:05에 누군가 이곳에 왔다. 대피 방송이 제때 나갔다면 이 통로에서 버틸 필요도 없었을 텐데.')]}),
 exit(2,'높은 안전 경로를 따라 등대로 이동한다.')
]});

chapters.push({id:'CH04',number:4,title:'꺼진 등대',place:'등대',time:'첫날 · 오후 18:15',goal:'중계 신호와 전체 섬 지도를 복구하자',closeup:'CH04_LENS_CLOSE',views:['등대 입구','중계 계단','렌즈실','기록실'],intro:[dialogue('도윤','등대가 보인다. 높은 곳에서 섬의 길과 방송 기록을 확인할 수 있을 것이다.')],summary:'대피 요청은 18:40에 접수됐다. 침수 19:35보다 충분히 빨랐지만, 방송 보류라는 별도 지시가 있었다.',stages:[
 use('등대 입구 문',0,'relay_key','중계 열쇠로 입구 문을 연다.',{consume:['relay_key']}),
 inspect('입구 중계 배선도',0,'전원 점검 → 축 접점 청소 → 수신 메시지 해독 → 렌즈 정렬 → 중계 복구. 렌즈 손잡이는 계단 정비함에 있다.'),
 inspect('계단 배전 표찰',1,'작업 전 전원은 OFF. 손잡이 소켓과 연결부를 정리한 후 ON. 케이블 파란 표식은 수신, 황색 표식은 육상 신호다.'),
 take('렌즈 조절 손잡이',1,'lens_crank','정비함에서 등대 렌즈의 조절 손잡이를 챙겼다.'),
 controls('작업 회로 분리',1,'정비 표찰대로 전원 상태를 맞춘다.',['전원'],[['OFF','정지'],['ON','가동']],['OFF'],{clueRefs:[3]}),
 use('렌즈 손잡이 설치',2,'lens_crank','빈 소켓에 조절 손잡이를 설치한다.',{consume:['lens_crank']}),
 inspect('모스 대응표와 수신지',2,'대응표: N = −· / E = · / W = ·−− / S = ···. 수신 순서: −·, ·, ·−−. 이 단말의 육상 표적 선택은 문자 순서와 같다.'),
 controls('수신 메시지 해독',2,'현장 대응표만으로 세 문자를 읽을 수 있다.',['첫 문자','둘째 문자','셋째 문자'],['N','E','W','S'],['N','E','W'],{clueRefs:[7]}),
 inspect('육상 표적의 방향',2,'방향 표적: 북쪽 분교, 동쪽 초소, 서쪽 숲길. 신호 확인 순서는 수신 메시지 N→E→W다.'),
 controls('렌즈 표적 정렬',2,'복구된 메시지 순서대로 육상 표적을 선택한다.',['1차 표적','2차 표적','3차 표적'],[['N','북 · 분교'],['E','동 · 초소'],['W','서 · 숲길']],['N','E','W'],{clueRefs:[8,9]}),
 stage('등대 중계 복구',2,'inspect','정렬한 렌즈와 수신 회로를 연결해 중계 확인 신호를 보낸다.',{setFlags:{lighthouseRestored:true},dialogue:[dialogue('스피커','이제 섬이 보이나. 네가 서명한 종이의 바깥도?')]}),
 inspect('기록실 위치 안내',1,'중계 확인 후 계단 아래 기록실 전기 잠금이 해제된다.'),
 inspect('섬 전체 지도',3,'양식장 → 동굴 → 등대 → 분교 → 높은 숲길 → 초소 → 거처 → 발전실 → 선착장. 낮은 해안길은 만조에 통행 불가.',{setFlags:{mapUnlocked:true}}),
 inspect('대피 요청 수신 기록',3,'9월 17일 18:40, 분교 측 대피 방송 요청 접수. 중계 장치 이상 없음. 요청을 전달한 시각과 실제 방송 시작 시각이 다르다.'),
 inspect('기록실 보관 규칙',3,'원본 접수지를 사진으로 남길 때는 시각을 HHMM으로 기록하고 원본 서명란을 함께 보관한다.'),
 code('접수지 보관함',3,'접수 시각 HHMM을 입력하면 원본 접수지에 접근한다.','1840',[14,15]),
 inspect('분교의 마지막 연락',3,'“아이들이 귀가하기 전에 대피 방송을 부탁합니다.” 발신인 윤서희. 이름은 당시 기록 속 인물이며 현재 생존자라는 뜻이 아니다.'),
 stage('원본 접수지 보관',3,'inspect','서명과 접수 시각이 함께 보이는 원본 사본을 수첩에 보관한다.',{optional:true,requires:[16,17],evidence:'E02',note:note('E02 · 대피 요청 원본','9월 17일 18:40 대피 방송 요청. 발신인 윤서희, 접수 서명과 중계 정상 확인이 한 장에 남아 있다.')}),
 stage('분교로 향할 이유',3,'inspect','동굴 침수 19:35와 대피 요청 18:40을 대조한다.',{requires:[17],dialogue:[dialogue('도윤','요청은 침수보다 55분 전에 들어왔다. 고장이 아니었다면, 누군가 방송을 멈춘 것이다.')]}),
 exit(3,'높은 길을 따라 윤서희가 마지막 연락을 남긴 분교로 이동한다.')
]});

// Remaining chapters are appended before the final writer below.
export {chapters,dialogue,note,control,stage,take,inspect,code,controls,order,use,exit};
