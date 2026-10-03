import {useEffect,useState} from 'react';
import App from './App.tsx';
import SeasonApp from './SeasonApp.tsx';
import {newSeason} from './domain/season.ts';
import type {SeasonState} from './domain/season.ts';
import {clearSeason,getSeasonSlot,writeSeasonSlot} from './platform/season-save.ts';
export default function RootApp(){
 const [ready,setReady]=useState(false),[s,setState]=useState<SeasonState|null>(null),[fresh,setFresh]=useState(false),[error,setError]=useState('');
 useEffect(()=>{let live=true;getSeasonSlot('auto').then(slot=>{if(live&&slot)setState(slot.state);}).catch(async()=>{try{const backup=await getSeasonSlot('auto.backup');if(live&&backup){setState(backup.state);setError('직전 시즌 저장 사본을 불러왔습니다.');}}catch{if(live)setError('시즌 저장을 읽지 못했습니다. 기존 1장 저장으로 시작합니다.');}}).finally(()=>{if(live)setReady(true);});return()=>{live=false;};},[]);
 function startSeason(){const n=newSeason();setState(n);void writeSeasonSlot('auto',n).catch(()=>setError('시즌 저장에 실패했습니다. 저장 메뉴에서 다시 시도하세요.'));}
 async function restart(){try{await clearSeason();setFresh(true);setState(null);}catch{setError('저장을 초기화하지 못했습니다. 현재 여정을 유지합니다.');}}
 if(!ready)return <main className="game-shell" style={{justifyContent:'center',alignItems:'center'}}><p>섬의 기록을 불러오고 있습니다.</p></main>;
 return <>{error&&<button style={{position:'fixed',top:0,left:0,right:0,zIndex:1000,background:'#f2e4bf',color:'#364839',padding:10,fontSize:13}} onClick={()=>setError('')}>{error} · 닫기</button>}{s?<SeasonApp initial={s} onRestart={()=>void restart()}/>:<App startFresh={fresh} onChapterComplete={startSeason}/>}</>;
}
