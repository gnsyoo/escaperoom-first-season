import {readFileSync,writeFileSync} from 'node:fs';
const file='data/ch01.puzzles.json',content=JSON.parse(readFileSync(file,'utf8'));
const success=[
 '왼쪽 버팀대에 금이 가 있다. 같은 방향으로 체중을 실어 보자.',
 '금속 조각을 챙겼다.',
 '결박을 끊었다. 손목을 묶었던 끈을 챙겼다.',
 '선반의 쪽지를 챙겼다. 내용은 수첩에 기록했다.',
 '잠금함을 열었다.',
 '드라이버와 자석을 챙겼다.',
 '환기구 덮개를 열었다. 아래쪽에 열쇠가 보인다.',
 '끈에 자석을 묶어 자석 줄을 만들었다.',
 '관리실 열쇠를 건졌다.',
 '관리실 문을 열었다.',
 '회로도를 완성했다. 연결 순서를 수첩에 기록했다.',
 '예비 퓨즈를 챙겼다.',
 '배전함 커버를 열었다.',
 'F2에 예비 퓨즈를 설치했다.',
 '주차단기를 올렸다. 전원이 들어왔다.',
 '점검함을 열고 밸브 손잡이와 UV 램프를 챙겼다.',
 '설비실 문을 열었다.',
 '배터리 팩을 챙겼다.',
 '전지를 끼웠다. UV 램프가 작동한다.',
 '배수 작업 절차를 수첩에 기록했다.',
 '밸브 손잡이를 장착하고 배수를 구동했다. 물이 빠져 통로가 열렸다.',
 '황동 명판을 챙겼다.',
 'UV 빛으로 숨은 숫자를 확인했다. 수첩에 기록했다.',
 '게이트 잠금을 해제했다.',
 '게이트를 지나 창고 밖으로 나왔다.'
];
if(success.length!==content.puzzles.length)throw new Error('Success feedback count mismatch');
content.puzzles.forEach((p,i)=>p.successText=success[i]);
content.puzzles[0].repeatText='의자 왼쪽 버팀대에 금이 가 있다.';
writeFileSync(file,JSON.stringify(content,null,2)+'\n');
console.log('Separated first-success and repeat feedback for all 25 stages.');
