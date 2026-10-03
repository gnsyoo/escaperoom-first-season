import content from '../../data/ch01.puzzles.json' with { type: 'json' };
import introContent from '../../data/prologue.json' with { type: 'json' };
export const prologue = introContent;

export type SceneId = 'R01' | 'R02' | 'R03' | 'R04';
export type Dialogue = { id:string; speaker:string; text:string; broadcast?:boolean; introScene?:string };
export type GameState = {
  schemaVersion:1; contentVersion:string; chapterId:'CH01';
  sceneId:SceneId; viewId:string; completedPuzzleIds:string[];
  inventory:Record<string,number>; evidenceIds:string[]; flags:Record<string,boolean>;
  readClueIds:string[]; seenDialogueIds:string[]; dialogueQueue:Dialogue[];
  visitedViews:string[]; playTimeMs:number;
};
export type Puzzle = typeof content.puzzles[number];
export const puzzles = content.puzzles;
export const itemNames = Object.fromEntries(content.items.map(i=>[i.id,i.name]));
export const has = (s:GameState, id:string) => s.completedPuzzleIds.includes(id);
export const owns = (s:GameState, id:string) => (s.inventory[id]||0)>0;
export const views:Record<SceneId,string[]> = { R01:['A','B','C','D'],R02:['A','B','C'],R03:['A','B','C'],R04:['A'] };

const dialogues:Record<string,Dialogue[]> = {
  start:[
    { id:'D01_001',speaker:'도윤',text:'손목이… 묶여 있다. 여긴 어디지?' },
    { id:'D01_002',speaker:'스피커',text:'기억해 내면 보내 줄게.',broadcast:true },
    { id:'D01_003',speaker:'도윤',text:'누구야? 내가 뭘 기억해야 한다는 거야?' }
  ],
  P03:[{id:'D01_004',speaker:'도윤',text:'풀렸다. 이 끈은 챙겨 두자.'}],
  P10:[{id:'D01_005',speaker:'도윤',text:'관리실이다. 여기라면 밖으로 나갈 방법이 있을지도.'}],
  P11:[{id:'D01_006',speaker:'도윤',text:'이 서명… 본 적이 있다. 그런데 이름이 떠오르지 않는다.'}],
  P15:[{id:'D01_007',speaker:'스피커',text:'불을 켜는 법은 기억하는군.',broadcast:true}],
  P23:[{id:'D01_008',speaker:'도윤',text:'맨눈으로는 안 보였던 숫자다. 순서는 명판에 있다.'}],
  P25:[{id:'D01_009',speaker:'도윤',text:'파도 소리… 건물 바깥은 섬이었어.'},{id:'D01_010',speaker:'스피커',text:'네가 떠난 곳을 기억하나?',broadcast:true}]
};
export const allDialogues:Dialogue[] = [...prologue.dialogues,...Object.values(dialogues).flat()];
export function newGame():GameState {
  return {schemaVersion:1,contentVersion:content.contentVersion,chapterId:'CH01',sceneId:'R01',viewId:'A',completedPuzzleIds:[],inventory:{},evidenceIds:[],flags:{},readClueIds:[],seenDialogueIds:[],dialogueQueue:[...prologue.dialogues,...dialogues.start],visitedViews:['R01_A'],playTimeMs:0};
}
export function advanceDialogue(s:GameState):GameState {
  const first=s.dialogueQueue[0];
  return first?{...s,seenDialogueIds:[...new Set([...s.seenDialogueIds,first.id])],dialogueQueue:s.dialogueQueue.slice(1)}:s;
}
export function skipPrologue(s:GameState):GameState {
  let next=s;
  while(next.dialogueQueue[0]?.introScene)next=advanceDialogue(next);
  return next;
}
export function canVisit(s:GameState,scene:SceneId,view:string):boolean {
  if(!views[scene]?.includes(view))return false;
  if(scene==='R01')return view==='A'||has(s,'P03');
  if(scene==='R02')return has(s,'P10');
  if(scene==='R03')return has(s,'P17');
  return has(s,'P21');
}
export function moveTo(s:GameState,scene:SceneId,view:string):GameState {
  if(s.dialogueQueue.length||!canVisit(s,scene,view))return s;
  return {...s,sceneId:scene,viewId:view,visitedViews:[...new Set([...s.visitedViews,scene+'_'+view])]};
}
export function readClue(s:GameState,id:string):GameState {
  return {...s,readClueIds:[...new Set([...s.readClueIds,id])]};
}
export function availablePuzzles(s:GameState):Puzzle[] {
  return puzzles.filter(p=>!has(s,p.id)&&p.requiresCompleted.every(id=>has(s,id))&&p.requiresItems.every(id=>owns(s,id)));
}
export function objective(s:GameState):string {
  if(has(s,'P25'))return '창고를 벗어났다';
  if(has(s,'P24'))return '열린 게이트로 밖으로 나가자';
  if(has(s,'P21'))return '명판을 조사하고 게이트를 열자';
  if(has(s,'P15'))return '설비실에서 출구로 가는 길을 찾자';
  if(has(s,'P10'))return '창고 설비의 전원을 복구하자';
  if(has(s,'P03'))return '관리실 문을 열 방법을 찾자';
  return '결박에서 벗어나자';
}
function correct(p:Puzzle, answer:unknown):boolean {
  if(p.mode==='combine')return Array.isArray(answer)&&answer.length===2&&JSON.stringify([...answer].sort())===JSON.stringify([...(p.expectedAnswer as string[])].sort());
  if(p.mode==='valves') {
    const a=answer as Record<string,unknown>|null,expected=p.expectedAnswer as Record<string,unknown>;
    return !!a&&typeof a==='object'&&['sea','tank','outlet'].every(key=>a[key]===expected[key]);
  }
  if(p.mode==='use') {
    const a=answer as Record<string,unknown>|null,expected=p.expectedAnswer as Record<string,unknown>;
    return !!a&&a.itemId===expected.itemId&&a.targetId===expected.targetId;
  }
  if(p.mode==='repeat')return typeof answer==='number'&&answer>=3;
  return JSON.stringify(answer)===JSON.stringify(p.expectedAnswer);
}
export type Result = { state:GameState; status:'success'|'repeat'|'blocked'|'wrong'; message:string; rewards:string[] };
export function attempt(s:GameState,puzzleId:string,answer:unknown):Result {
  const p=puzzles.find(p=>p.id===puzzleId);
  const fail=(status:Result['status'],message:string):Result=>({state:s,status,message,rewards:[]});
  if(!p)return fail('blocked','조사할 대상을 찾을 수 없다.');
  if(s.dialogueQueue.length)return fail('blocked','대화를 먼저 읽자.');
  if(p.location.sceneId!=='ANY'&&(s.sceneId!==p.location.sceneId||s.viewId!==p.location.viewId))return fail('blocked','그 장소에서 확인해야 한다.');
  if(has(s,p.id))return fail('repeat',p.repeatText);
  if(!p.requiresCompleted.every(id=>has(s,id))||!p.requiresItems.every(id=>owns(s,id)))return fail('blocked',p.failText);
  if(!correct(p,answer))return fail('wrong',p.failText);
  const inventory={...s.inventory};
  for(const id of p.effects.consumeItems){if((inventory[id]||0)<1)return fail('blocked','필요한 물건이 없다.');inventory[id]--;if(!inventory[id])delete inventory[id];}
  for(const id of p.effects.grantItems)inventory[id]=(inventory[id]||0)+1;
  const transition='transition' in p.effects?p.effects.transition:undefined;
  const sceneId=transition?transition.sceneId as SceneId:s.sceneId;
  const viewId=transition?transition.viewId:s.viewId;
  const queue=(dialogues[p.id]||[]).filter(d=>!s.seenDialogueIds.includes(d.id));
  const next:GameState={...s,sceneId,viewId,inventory,completedPuzzleIds:[...s.completedPuzzleIds,p.id],evidenceIds:[...new Set([...s.evidenceIds,...p.effects.grantEvidence])],flags:Object.assign({},s.flags,p.effects.setFlags),dialogueQueue:[...s.dialogueQueue,...queue],visitedViews:[...new Set([...s.visitedViews,sceneId+'_'+viewId])],readClueIds:[...new Set([...s.readClueIds,...(p.id==='P04'?['note_a']:[])])]};
  return {state:next,status:'success',message:p.successText,rewards:p.effects.grantItems};
}
export function validateState(value:unknown):GameState {
  if(!value||typeof value!=='object')throw new Error('저장 형식이 올바르지 않습니다.');
  const s=value as GameState;
  if(s.schemaVersion!==1||s.contentVersion!==content.contentVersion||s.chapterId!=='CH01')throw new Error('지원하지 않는 저장 버전입니다.');
  const strings=(x:unknown):x is string[]=>Array.isArray(x)&&x.every(v=>typeof v==='string')&&new Set(x).size===x.length;
  if(!strings(s.completedPuzzleIds)||s.completedPuzzleIds.some(id=>!puzzles.some(p=>p.id===id)))throw new Error('완료 기록이 손상됐습니다.');
  if(!s.inventory||Array.isArray(s.inventory)||Object.entries(s.inventory).some(([id,n])=>!(id in itemNames)||!Number.isSafeInteger(n)||n<1||n>1))throw new Error('아이템 기록이 손상됐습니다.');
  if(!strings(s.evidenceIds)||s.evidenceIds.some(id=>!['circuit_plan','drain_procedure','exit_cipher'].includes(id)))throw new Error('증거 기록이 손상됐습니다.');
  if(!strings(s.readClueIds)||s.readClueIds.some(id=>!['note_a','calendar','duty_roster','shelf_numbers'].includes(id)))throw new Error('단서 기록이 손상됐습니다.');
  const knownDialogue=new Set(allDialogues.map(d=>d.id));
  if(!strings(s.seenDialogueIds)||s.seenDialogueIds.some(id=>!knownDialogue.has(id))||!Array.isArray(s.dialogueQueue)||s.dialogueQueue.some(d=>!allDialogues.some(k=>k.id===d.id&&k.text===d.text&&k.speaker===d.speaker&&k.introScene===d.introScene)))throw new Error('대화 기록이 손상됐습니다.');
  if(new Set(s.dialogueQueue.map(d=>d.id)).size!==s.dialogueQueue.length||s.dialogueQueue.some(d=>s.seenDialogueIds.includes(d.id)))throw new Error('중복 대화 기록입니다.');
  if(!s.flags||Object.values(s.flags).some(v=>typeof v!=='boolean')||!strings(s.visitedViews)||s.visitedViews.some(key=>{const [scene,view]=key.split('_');return !canVisit(s,scene as SceneId,view);}))throw new Error('공간 기록이 손상됐습니다.');
  if(!Number.isFinite(s.playTimeMs)||s.playTimeMs<0||!canVisit(s,s.sceneId,s.viewId))throw new Error('접근할 수 없는 장소의 저장입니다.');
  const expectedInventory:Record<string,number>={}, expectedEvidence=new Set<string>(),expectedFlags:Record<string,boolean>={};
  const seen=new Set<string>();
  for(const id of s.completedPuzzleIds){
    const p=puzzles.find(p=>p.id===id)!;
    if(p.requiresCompleted.some(req=>!seen.has(req)))throw new Error('선행 퍼즐 기록이 없습니다.');
    if(p.requiresItems.some(item=>(expectedInventory[item]||0)<1))throw new Error('필수 아이템 획득 기록이 없습니다.');
    for(const item of p.effects.consumeItems){expectedInventory[item]--;if(!expectedInventory[item])delete expectedInventory[item];}
    for(const item of p.effects.grantItems)expectedInventory[item]=(expectedInventory[item]||0)+1;
    p.effects.grantEvidence.forEach(id=>expectedEvidence.add(id));
    Object.assign(expectedFlags,p.effects.setFlags);seen.add(id);
  }
  const sorted=(obj:Record<string,unknown>)=>JSON.stringify(Object.entries(obj).sort(([a],[b])=>a.localeCompare(b)));
  if(sorted(expectedInventory)!==sorted(s.inventory)||sorted(expectedFlags)!==sorted(s.flags)||JSON.stringify([...expectedEvidence].sort())!==JSON.stringify([...s.evidenceIds].sort()))throw new Error('보상과 진행 기록이 일치하지 않습니다.');
  return structuredClone(s);
}
