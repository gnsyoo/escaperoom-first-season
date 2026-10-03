import {useEffect,useState} from 'react';
import type {RefObject} from 'react';
export default function useSceneFrame(ref:RefObject<HTMLElement|null>,enabled:boolean,fullScene:boolean){
 const [size,setSize]=useState({width:390,height:468});
 useEffect(()=>{if(!enabled||!ref.current)return;const el=ref.current;const measure=()=>{const fit=fullScene?Math.min:Math.max;const width=fit(el.clientWidth,el.clientHeight/1.2);setSize({width,height:width*1.2});};const observer=new ResizeObserver(measure);observer.observe(el);measure();return()=>observer.disconnect();},[ref,enabled,fullScene]);
 return size;
}
