import './styles.css';
import {createRoot} from 'react-dom/client';
import SeasonApp from './SeasonApp.tsx';
import type {SeasonReview} from './SeasonApp.tsx';
import {chapterOf,newSeason,season} from './domain/season.ts';
import type {SeasonState} from './domain/season.ts';
import './ui-preview.css';
// Authored presentation states only; this page never reads or writes player saves.
function presentation(index:number,count:number):SeasonState{
 let s=newSeason();s={...s,chapter:index,furthest:index,visited:Array.from({length:index+1},(_,i)=>i),queue:[]};
 const stages=season.chapters.flatMap((c,i)=>i<index?c.stages:i===index?c.stages.slice(0,count):[]);
 for(const p of stages){s.done.push(p.id);s.history.push(...p.dialogue);s.inventory=s.inventory.filter(id=>!p.consume?.includes(id));s.inventory=Array.from(new Set([...s.inventory,...p.grant||[]]));if(p.evidence)s.evidence.push(p.evidence);s.flags={...s.flags,...p.setFlags,...p.choiceFlags?.admit};}
 return s;
}
type Example={id:string;label:string;description:string;review:SeasonReview};
export const examples:Example[]=[];
const puzzleNumbers=[10,8,10,12,6,7,6,6,12];
const dialogueNumbers=[19,19,11,5,7,0,13,16,16];
for(let i=0;i<9;i++){
 const c=season.chapters[i],prefix=c.id.toLowerCase(),p=c.stages[puzzleNumbers[i]-1],base=presentation(i,p.number-1);base.view=p.view;
 examples.push({id:prefix+'-explore',label:c.number+'장 탐색',description:c.place+' · '+c.views[p.view],review:{state:base,screen:'game'}});
 const dp=c.stages[(dialogueNumbers[i]||1)-1],ds=presentation(i,Math.max(0,dp.number-1));ds.view=dp.view;ds.queue=dialogueNumbers[i]?dp.dialogue:c.intro;
 examples.push({id:prefix+'-dialogue',label:c.number+'장 대화',description:c.title+' · 인물과 이야기',review:{state:ds,screen:'game'}});
 examples.push({id:prefix+'-puzzle',label:c.number+'장 확대 퍼즐',description:p.title+' · 실제 조작 UI',review:{state:base,screen:'game',modal:'puzzle',stage:p.id,values:Array.isArray(p.solution)?p.solution:[],input:typeof p.solution==='string'?p.solution:undefined}});
 const itemStage=c.stages.find(q=>q.kind==='take')!,is=presentation(i,itemStage.number);is.view=itemStage.view;
 examples.push({id:prefix+'-inventory',label:c.number+'장 인벤토리',description:'장별 도구와 상세 설명',review:{state:is,screen:'game',modal:'inventory',selected:itemStage.grant![0]}});
 const ns=presentation(i,18);ns.view=c.stages[17].view;
 examples.push({id:prefix+'-notebook',label:c.number+'장 수첩',description:'확인한 기록만 모아 보기',review:{state:ns,screen:'game',modal:'notebook'}});
}
const late=presentation(6,17);late.view=3;
examples.push({id:'home',label:'시즌 게임 홈',description:'진행률과 열린 장소',review:{state:late,screen:'home'}});
examples.push({id:'map',label:'시즌 섬 지도',description:'폭풍 전 재방문과 기록 회수',review:{state:late,screen:'game',modal:'map'}});
examples.push({id:'settings',label:'시즌 설정',description:'프리텐다드 · 밝기 · 위험 시간',review:{state:late,screen:'game',modal:'settings'}});
examples.push({id:'evidence',label:'원본 자료 수첩',description:'E01부터 E04까지 원본 보관',review:{state:late,screen:'game',modal:'notebook',notebookTab:'evidence'}});
examples.push({id:'hint',label:'스피커 힌트',description:'세 단계 힌트 UI',review:{state:presentation(0,9),screen:'game',modal:'hint'}});
for(const id of ['T','N','B']){const s=presentation(8,id==='B'?18:20);s.ending=id;s.seenEndings=[id];examples.push({id:'ending-'+id.toLowerCase(),label:'엔딩 · '+season.endings[id].title,description:'마지막 선택의 결과',review:{state:s,screen:'game'}});}
const query=new URLSearchParams(location.search),example=examples.find(x=>x.id===query.get('screen'))||examples[0];
function Preview(){const game=<SeasonApp initial={example.review.state} review={example.review} onRestart={()=>{location.href='./index.html';}}/>;return query.get('focus')==='1'?game:<div className="review-workspace"><aside className="review-sidebar"><h1>표류도 시즌 화면</h1><p>제작용 스포일러가 있습니다.<br/>플레이어 저장에 영향을 주지 않습니다.</p><nav>{examples.map(e=><a aria-current={e.id===example.id?'page':undefined} key={e.id} href={'?screen='+e.id}>{e.label}<small>{e.description}</small></a>)}</nav></aside><div className="review-main">{game}</div></div>;}
document.body.classList.toggle('review-focus',query.get('focus')==='1');
createRoot(document.getElementById('root')!).render(<Preview/>);
