import content from '../../data/season.chapters.json' with {type:'json'};
export type Dialogue={id:string;speaker:string;text:string;portrait?:string};
export type Option={value:string;label:string};
export type Stage={id:string;number:number;title:string;view:number;kind:string;description:string;optional?:boolean;requires:string[];requiresItems?:string[];grant?:string[];consume?:string[];solution?:string|string[];controls?:{label:string;options:Option[]}[];options?:Option[];clue?:string;clueRefs:string[];note?:{id:string;title:string;body:string};dialogue:Dialogue[];hints:string[];setFlags?:Record<string,boolean>;choiceFlags?:Record<string,Record<string,boolean>>;evidence?:string;gotoView?:number;startDanger?:'cave'|'pursuit';endDanger?:boolean;endingOnChoice?:Record<string,string>;finishSeason?:boolean;rect:{x:number;y:number;w:number;h:number}};
export type Chapter={id:string;number:number;title:string;place:string;time:string;goal:string;closeup:string;views:string[];backgrounds:string[];intro:Dialogue[];summary:string;stages:Stage[]};
export type SeasonContent={items:Record<string,{name:string;asset:string;description:string}>;chapters:Chapter[];endings:Record<string,{title:string;asset:string;body:string}>};
export const season=content as unknown as SeasonContent;
export const stageById=new Map(season.chapters.flatMap(c=>c.stages).map(s=>[s.id,s]));
export type SeasonState={schema:2;version:'season-v1';chapter:number;view:number;furthest:number;done:string[];inventory:string[];evidence:string[];flags:Record<string,boolean>;queue:Dialogue[];history:Dialogue[];tide:number;visited:number[];seenEndings:string[];ending:string|null;danger:null|{kind:'cave'|'pursuit';elapsed:number;checkpoint:string};playSeconds:number};
export const chapterOf=(s:SeasonState)=>season.chapters[s.chapter];
export const complete=(s:SeasonState)=>chapterOf(s).stages.filter(p=>!p.optional).every(p=>s.done.includes(p.id));
export const available=(s:SeasonState)=>chapterOf(s).stages.filter(p=>!s.done.includes(p.id)&&p.requires.every(id=>s.done.includes(id)));
export const nextObjective=(s:SeasonState)=>s.ending?season.endings[s.ending].title:complete(s)?'다음 장으로 이동할 준비가 됐다':available(s).find(p=>!p.optional)?.title||chapterOf(s).goal;
export function newSeason():SeasonState{return {schema:2,version:'season-v1',chapter:0,view:0,furthest:0,done:[],inventory:['screwdriver','uv_lamp_ready'],evidence:[],flags:{},queue:season.chapters[0].intro,history:[],tide:0,visited:[0],seenEndings:[],ending:null,danger:null,playSeconds:0};}
export function tide(s:SeasonState){const n=s.tide%12;return {name:n<4?'썰물':n<6?'상승':n<10?'만조':'하강',remaining:n<4?4-n:n<6?6-n:n<10?10-n:12-n,entry:n===0};}
export function move(s:SeasonState,view:number):SeasonState{
 if(view===s.view||view<0||view>=chapterOf(s).views.length)return s;
 if(s.chapter===1&&view!==0&&!s.done.includes('CH03_P04'))return s;
 if(s.chapter===1&&view===2&&!s.done.includes('CH03_P14'))return s;
 if(s.chapter===2&&view>0&&!s.done.includes('CH04_P01'))return s;
 if(s.chapter===2&&view===3&&!s.done.includes('CH04_P11'))return s;
 if(s.chapter===3&&view===2&&!s.done.includes('CH05_P04'))return s;
 if(s.chapter===3&&view===3&&!s.done.includes('CH05_P08'))return s;
 if(s.chapter===4&&view===2&&!s.done.includes('CH06_P06'))return s;
 if(s.chapter===7&&view===1&&!s.done.includes('CH09_P08'))return s;
 return {...s,view,tide:s.danger?s.tide:(s.tide+1)%12};
}
export const waitTide=(s:SeasonState)=>s.danger?s:{...s,tide:(s.tide+1)%12};
export function visit(s:SeasonState,index:number):SeasonState{
 if(s.danger||index<0||index>s.furthest||s.furthest>=7&&index!==s.furthest)return s;
 return {...s,chapter:index,view:0,queue:[],ending:null};
}
export function advance(s:SeasonState):SeasonState{
 if(!complete(s)||s.chapter>=8)return s;
 const index=s.chapter+1;
 return {...s,chapter:index,view:0,furthest:Math.max(s.furthest,index),visited:Array.from(new Set([...s.visited,index])),queue:s.visited.includes(index)?[]:season.chapters[index].intro,tide:index===1?0:s.tide,danger:null};
}
export function rollback(s:SeasonState):SeasonState{
 if(!s.danger)return s;
 const snapshot=JSON.parse(s.danger.checkpoint) as SeasonState;
 return {...snapshot,playSeconds:s.playSeconds,danger:null,queue:[]};
}
export function retryEnding(s:SeasonState):SeasonState{
 return {...s,done:s.done.filter(id=>!['CH10_P19','CH10_P20'].includes(id)),ending:null,view:0,queue:[],flags:{...s.flags,peacefulDeparture:false}};
}
export function apply(s:SeasonState,p:Stage,input?:string|string[]):{state:SeasonState;message:string;ok:boolean}{
 const fail=(message:string)=>({state:s,message,ok:false});
 if(s.done.includes(p.id))return fail('이미 완료한 단계입니다. 기록은 수첩에서 다시 읽을 수 있습니다.');
 if(!chapterOf(s).stages.some(x=>x.id===p.id)||p.view!==s.view)return fail('해당 장소에서 조사하세요.');
 if(!p.requires.every(id=>s.done.includes(id)))return fail('앞선 단서를 먼저 확인하세요.');
 if(!(p.requiresItems||[]).every(id=>s.inventory.includes(id)))return fail('필요한 도구를 아직 갖고 있지 않습니다.');
 if(p.kind==='tide'&&!tide(s).entry)return fail('썰물 첫 칸에서 안전하게 들어갈 수 있습니다. 입구에서 기다려 조수를 맞추세요.');
 if(p.solution!==undefined){const a=Array.isArray(input)?input.join('|'):input,b=Array.isArray(p.solution)?p.solution.join('|'):p.solution;if(a!==b)return fail('표찰과 기록을 다시 맞춰 보세요. 도구와 진행 상태는 유지됩니다.');}
 if(p.kind==='choice'&&!p.options?.some(o=>o.value===input))return fail('선택지를 골라 주세요.');
 let n:SeasonState={...s,done:[...s.done,p.id],inventory:Array.from(new Set([...s.inventory.filter(id=>!p.consume?.includes(id)),...p.grant||[]])),flags:{...s.flags,...p.setFlags,...(typeof input==='string'?p.choiceFlags?.[input]:{})},evidence:Array.from(new Set([...s.evidence,...p.evidence?[p.evidence]:[]])),queue:[...s.queue,...p.dialogue],view:p.gotoView??s.view};
 if(p.startDanger)n={...n,danger:{kind:p.startDanger,elapsed:0,checkpoint:JSON.stringify({...s,queue:[]})}};
 if(p.endDanger)n={...n,danger:null};
 const branch=typeof input==='string'?p.endingOnChoice?.[input]:undefined;
 if(branch)n={...n,ending:branch,seenEndings:Array.from(new Set([...n.seenEndings,branch])),queue:[]};
 if(p.finishSeason){const ending=n.evidence.length===4&&n.flags.acknowledgedResponsibility&&n.flags.allRescued&&n.flags.peacefulDeparture?'T':'N';n={...n,ending,seenEndings:Array.from(new Set([...n.seenEndings,ending])),queue:[]};}
 return {state:n,message:p.evidence?'원본 기록 '+p.evidence+'을 보관했습니다.':p.grant?.length?p.grant.map(id=>season.items[id].name).join(', ')+' 획득':p.optional?'선택 원본을 확보했습니다.':'기록과 진행 상황을 저장했습니다.',ok:true};
}
export function restore(raw:unknown):SeasonState{
 if(!raw||typeof raw!=='object')throw new Error('읽을 수 없는 시즌 저장입니다.');
 const s=raw as SeasonState;
 if(s.schema!==2||s.version!=='season-v1'||!Number.isInteger(s.chapter)||s.chapter<0||s.chapter>8||!Number.isInteger(s.furthest)||s.furthest<s.chapter||s.furthest>8||!Array.isArray(s.done)||!s.done.every(id=>stageById.has(id))||!Array.isArray(s.inventory)||!s.inventory.every(id=>id in season.items)||!Array.isArray(s.evidence)||!s.evidence.every(id=>['E01','E02','E03','E04'].includes(id))||!Array.isArray(s.queue)||!s.flags||s.view<0||s.view>=season.chapters[s.chapter].views.length)throw new Error('시즌 저장 형식이 맞지 않습니다. 이전 사본을 선택하세요.');
 return structuredClone({...s,history:s.history||[]});
}
