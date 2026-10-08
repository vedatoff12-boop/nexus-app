import {createPerGameExample} from './per-game-example.js';
const games=['lucky','chicken','thimbles','chicken2','aviator','tower','ice','balloon'];
const supportedSimulation=game=>games.includes(game);
const key='uz-random-examples-cooldown-v1';
/** Injectable RNG/clock/timers/storage; only cooldown deadlines persist, never results. */
export function createSimulation({rng=Math.random,now=Date.now,schedule=setTimeout,cancel=clearTimeout,storage}={}){
 let deadlines={},timer=null,epoch=0,active=null,result=null,pending=false,blocked=false;
 try{const raw=storage?.getItem(key);if(raw){const parsed=JSON.parse(raw);if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw Error('Invalid cooldown');for(const game of games)if(parsed[game]!==undefined){if(!Number.isFinite(parsed[game])||parsed[game]<0)throw Error('Invalid cooldown');deadlines[game]=parsed[game];}}}catch{blocked=true;}
 const state=()=>({game:active,result,pending,blocked,remaining:active?Math.max(0,(deadlines[active]||0)-now()):0});
 const leave=()=>{epoch++;if(timer!==null)cancel(timer);timer=null;active=null;pending=false;result=null;};
 const enter=game=>{leave();active=supportedSimulation(game)?game:null;return state();};
 const request=(onChange=()=>{})=>{
  if(!active||blocked||pending||state().remaining>0)return false;
  const game=active,token=epoch;
  try{
   const generated=createPerGameExample(game,rng),timestamp=now();if(!Number.isFinite(timestamp)||timestamp<0)throw Error('Invalid clock');
   const next={...deadlines,[game]:timestamp+30000};storage?.setItem(key,JSON.stringify(next));deadlines=next;result=null;
   if(game==='chicken'||game==='thimbles'){
    pending=true;timer=schedule(()=>{if(token!==epoch||active!==game)return;timer=null;pending=false;result=generated;onChange();},500);
   }else result=generated;
  }catch{blocked=true;}
  onChange();return !blocked;
 };
 return {enter,leave,state,request};
}
