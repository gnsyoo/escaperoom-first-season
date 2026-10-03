import type {Dialogue} from './domain/game.ts';
import {prologue} from './domain/game.ts';
import {asset} from './content/art.ts';
import './prologue.css';

export default function Prologue({dialogue,text,brightness,notice,onNext,onSkip,onMenu}:{dialogue:Dialogue;text:string;brightness:number;notice:string;onNext:()=>void;onSkip:()=>void;onMenu:()=>void}){
 const scene=prologue.scenes.find(s=>s.id===dialogue.introScene)!;
 const index=prologue.scenes.indexOf(scene);
 return <section className="prologue" aria-label="인트로" data-scene={scene.id}>
  <img key={scene.assetId} className="prologue-art" src={asset(scene.assetId)} alt={scene.alt} style={{filter:`brightness(${brightness/100})`}}/>
  <div className="prologue-shade" aria-hidden="true"/>
  <header className="prologue-header"><div><small>PROLOGUE</small><strong>{prologue.title}</strong></div><button onClick={onSkip}>인트로 건너뛰기</button></header>
  <div className="prologue-scene-title"><p>{scene.time}</p><h1>{scene.title}</h1><div className="prologue-steps" aria-label={`${index+1}번째 장면 / ${prologue.scenes.length}`}>
   {prologue.scenes.map((s,i)=><span key={s.id} className={i===index?'current':i<index?'read':''} aria-hidden="true"/>)}
  </div></div>
  <div className="prologue-caption"><div className="prologue-speaker"><b>{dialogue.speaker}</b><span>{dialogue.speaker==='메시지'?'휴대전화':dialogue.speaker==='낯선 목소리'?'부두에서 들린 목소리':'끊어진 기억을 따라'}</span></div><button className="prologue-next" onClick={onNext} aria-label="다음 대사"><p>{text}</p><span>계속 <i aria-hidden="true">›</i></span></button></div>
  <footer className="prologue-footer"><span role="status">{notice||'진행은 자동으로 저장됩니다'}</span><button onClick={onMenu} aria-label="인트로 설정">설정</button></footer>
 </section>;
}
