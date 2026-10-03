import {readFileSync,writeFileSync} from 'node:fs';
for(const file of ['src/main.tsx','src/season-preview.tsx']){let s=readFileSync(file,'utf8').replace("import './styles.css';\n",'');s="import './styles.css';\n"+s;writeFileSync(file,s);}
let s=readFileSync('src/SeasonApp.tsx','utf8');
const board="{p.kind==='controls'&&<MechanismControls stage={p} image={c.closeup} values={values} onChange={v=>{setValues(v);ping();}}/>}";
s=s.replace(board,'').replace('<p className="season-puzzle-description">{p.description}</p>','<p className="season-puzzle-description">{p.description}</p>'+board);writeFileSync('src/SeasonApp.tsx',s);
console.log('Stylesheet order and instructions before controls corrected.');
