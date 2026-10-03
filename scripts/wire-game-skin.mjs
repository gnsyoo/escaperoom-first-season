import {readFileSync,writeFileSync} from 'node:fs';
let app=readFileSync('src/SeasonApp.tsx','utf8');
app=app.replace("import './season.css';","import './season.css';\nimport MechanismControls from './MechanismControls.tsx';\nimport './game-skin.css';");
app=app.replace("function Panel({title,close,children}:{title:string;close:()=>void;children:ReactNode})","function Panel({title,close,children,notice}:{title:string;close:()=>void;children:ReactNode;notice?:string})");
app=app.replace('<div className="sheet-scroll">{children}</div></dialog>','{notice&&<p className="season-modal-message" role="alert">{notice}</p>}<div className="sheet-scroll">{children}</div></dialog>');
app=app.replace('}[modal]} close={close}>','}[modal]} close={close} notice={notice}>');
app=app.replace('{notice&&<p className="modal-notice" role="status">{notice}</p>}','');
app=app.replace('{notice&&<p className="season-notice" role="status">{notice}</p>}','{notice&&<div className="season-notice" role="status" aria-live="polite"><Icon name="document" light/><span>{notice}</span><button onClick={()=>setNotice(\'\')} aria-label="안내 닫기">×</button></div>}');
app=app.replace("['controls','use','combine','sequence','code'].includes(p.kind)","['use','combine','sequence','code'].includes(p.kind)");
app=app.replace("{p.kind==='controls'&&p.controls?.map((ctrl,i)=>", "{false&&p.kind==='controls'&&p.controls?.map((ctrl,i)=>");
app=app.replace('<p className="season-puzzle-description">{p.description}</p>','{p.kind===\'controls\'&&<MechanismControls stage={p} image={c.closeup} values={values} onChange={v=>{setValues(v);ping();}}/>}<p className="season-puzzle-description">{p.description}</p>');
app=app.replace('className="primary full" disabled={p.kind','className="primary full season-puzzle-confirm" disabled={p.kind');
app=app.replace('aria-label="잠금 번호"','aria-label="번호 입력"');
app=app.replace("p.kind==='code'?'잠금 입력'", "p.kind==='code'?'번호 확인'");
app=app.replace("const current=active.find", "useEffect(()=>{if(!notice||modal)return;const t=setTimeout(()=>setNotice(''),8000);return()=>clearTimeout(t);},[notice,modal]);\n const current=active.find");
writeFileSync('src/SeasonApp.tsx',app);
for(const file of ['src/main.tsx','src/ui-preview.tsx']){let s=readFileSync(file,'utf8');if(!s.includes('game-skin.css'))s=s.replace("import './styles.css';","import './styles.css';\nimport './game-skin.css';");writeFileSync(file,s);}
console.log('Graphic game skin, interactive dials and visible feedback connected.');
