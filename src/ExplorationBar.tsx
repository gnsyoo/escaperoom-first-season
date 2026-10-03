import {Icon} from './GameIcon.tsx';
export default function ExplorationBar({place,view,fullScene,markers,onFit,onMarkers}:{place:string;view:string;fullScene:boolean;markers:boolean;onFit:()=>void;onMarkers:()=>void}){
 return <div className="scene-bar"><div><b>{place}</b><span>{view}</span></div><div className="scene-tools"><button className="scene-fit-button" aria-label={fullScene?'화면 채우기':'전체 장면 보기'} aria-pressed={fullScene} onClick={onFit}><Icon name="inspect"/>{fullScene?'화면 채우기':'전체 장면'}</button><button className={'marker-button '+(markers?'active':'')} onClick={onMarkers} aria-label="조사 표시" aria-pressed={markers}><Icon name="eye"/></button></div></div>;
}
