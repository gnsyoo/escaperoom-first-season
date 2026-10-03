import {restore} from '../domain/season.ts';
import type {SeasonState} from '../domain/season.ts';
export type SeasonSlot={id:string;savedAt:string;state:SeasonState};
const db=new Promise<IDBDatabase>((ok,no)=>{const r=indexedDB.open('pyoryudo-season',1);r.onupgradeneeded=()=>r.result.createObjectStore('slots',{keyPath:'id'});r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);});
export async function getSeasonSlot(id:string):Promise<SeasonSlot|null>{const d=await db;return new Promise((ok,no)=>{const r=d.transaction('slots').objectStore('slots').get(id);r.onsuccess=()=>{try{ok(r.result?{...r.result,state:restore(r.result.state)}:null);}catch(e){no(e);}};r.onerror=()=>no(r.error);});}
let tail:Promise<unknown>=Promise.resolve();
export function writeSeasonSlot(id:string,state:SeasonState):Promise<void>{const snapshot=restore(state);const p=tail.catch(()=>{}).then(async()=>{const d=await db;await new Promise<void>((ok,no)=>{const tx=d.transaction('slots','readwrite'),store=tx.objectStore('slots'),r=store.get(id);r.onsuccess=()=>{if(r.result)store.put({...r.result,id:id+'.backup'});store.put({id,savedAt:new Date().toISOString(),state:snapshot});};tx.oncomplete=()=>ok();tx.onerror=()=>no(tx.error);tx.onabort=()=>no(tx.error);});});tail=p;return p;}
export async function clearSeason(){await tail.catch(()=>{});const d=await db;return new Promise<void>((ok,no)=>{const tx=d.transaction('slots','readwrite');tx.objectStore('slots').clear();tx.oncomplete=()=>ok();tx.onerror=()=>no(tx.error);});}
