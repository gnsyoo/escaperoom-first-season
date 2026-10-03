import {asset,icon,paintedIcons} from './content/art.ts';
export function Icon({name,light=false}:{name:string;light?:boolean}){return <img className={'icon '+(paintedIcons[name]?'painted-icon':light?'':'ink-icon')} src={paintedIcons[name]?asset(paintedIcons[name]):icon(name)} alt="" aria-hidden="true"/>;}
