import {asset,icon} from './content/art.ts';
export type MapPlace={id:string;name:string;number:number;unlocked:boolean;known:boolean;reason?:string};
const warehouse=[[26,48],[27,22],[72,20],[72,49]];
const island=[[61,71],[24,48],[81,39],[92,53],[54,35],[40,25],[76,11],[57,19],[64,57],[47,78]];
const islandLabels=['창고','양식장','동굴','등대','분교','숲길','무전 초소','거처','발전기','선착장'];
export default function GraphicalMap({kind,places,current,onSelect}:{kind:'warehouse'|'island';places:MapPlace[];current:string;onSelect:(id:string)=>void}){
 const points=kind==='warehouse'?warehouse:island;
 const currentPlace=places.find(p=>p.id===current);
 return <section className={'graphic-map '+kind} aria-label={kind==='warehouse'?'창고 조감 지도':'연무도 탐색 지도'}>
  <div className="graphic-map-heading"><div><small>{kind==='warehouse'?'창고의 문과 통로':'연무도의 기록된 길'}</small><h3>{kind==='warehouse'?'창고 조감도':'연무도'}</h3></div><span className="map-compass" aria-hidden="true"><i/>N</span></div>
  <div className="graphic-map-viewport"><div className="graphic-map-board">
   <img className="graphic-map-image" src={asset(kind==='warehouse'?'CH01_WAREHOUSE_MAP_V02':'island_map')} alt={kind==='warehouse'?'지붕을 걷어낸 창고의 감금실, 사무실, 설비실, 적재장 그림':'해안, 숲과 시설을 내려다본 연무도 그림'}/>
   <svg className="graphic-map-routes" viewBox="0 0 100 120" preserveAspectRatio="none" aria-hidden="true"><polyline points={points.map(([x,y])=>x+','+y*1.2).join(' ')} fill="none" stroke="#fff0ba" strokeWidth="1.4" strokeDasharray="1.5 2" opacity=".6"/><polyline points={places.map((p,i)=>p.known?points[i][0]+','+points[i][1]*1.2:null).filter(Boolean).join(' ')} fill="none" stroke="#cf993e" strokeWidth="1.1"/></svg>
   {places.map((p,i)=><button key={p.id} className={'graphic-map-pin map-room '+(p.id===current?'current':'')+(p.unlocked?' open':' locked')+(kind==='island'?' island-pin pin-'+p.number:'')} style={{left:points[i][0]+'%',top:points[i][1]+'%'}} disabled={!p.unlocked} aria-label={p.number+' · '+(p.known?p.name:'미확인 장소')+' · '+(p.id===current?'현재 위치':p.unlocked?'이동':p.reason||'잠김')} aria-current={p.id===current?'location':undefined} onClick={()=>onSelect(p.id)}><b>{String(p.number).padStart(2,'0')}</b>{!p.unlocked&&<img src={icon('lock')} alt="" aria-hidden="true"/>}<span className={p.known?'map-pin-label':'sr-only'} aria-hidden="true">{kind==='island'?islandLabels[i]:p.name}</span><span className="sr-only">{p.name}</span></button>)}
  </div></div>
  <div className="graphic-map-caption"><span className="map-location-dot"/><div><small>현재 위치</small><strong>{currentPlace?.name}</strong></div><span>열린 표식을 눌러 이동</span></div>
  <p className="graphic-map-legend"><i className="current"/>현재 위치 <i className="open"/>열린 길 <i className="locked"/>잠긴 장소</p>
 </section>;
}
