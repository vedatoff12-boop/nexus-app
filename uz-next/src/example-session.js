import {createPerGameExample} from './per-game-example.js';
const games=['lucky','chicken','thimbles','chicken2','aviator','tower','ice','balloon'];
const supportedSimulation=game=>games.includes(game);
export const COOLDOWN_MS=10000;
const key='uz-random-examples-cooldown-v2';
const legacyKey='uz-random-examples-cooldown-v1';
/** Only local example cooldowns persist. Results and account access never persist here. */
export function createSimulation({rng=Math.random,now=Date.now,schedule=setTimeout,cancel=clearTimeout,storage}={}){
 let deadlines={},timer=null,epoch=0,active=null,result=null,pending=false,blocked=false,lastNow=0;
 const readNow=()=>{const time=now();if(!Number.isFinite(time)||time<0||time>Number.MAX_SAFE_INTEGER-COOLDOWN_MS)throw Error('Invalid clock');lastNow=Math.max(lastNow,time);return lastNow;};
 const persist=next=>storage?.setItem(key,JSON.stringify({version:2,deadlines:next}));
 try{
  const time=readNow(),raw=storage?.getItem(key);
  const legacy=raw==null?storage?.getItem(legacyKey):null;
  if(raw!=null||legacy!=null){
   const parsed=JSON.parse(raw??legacy);
   if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw Error('Invalid cooldown');
   const source=raw!=null?parsed.deadlines:parsed;
   if(raw!=null&&parsed.version!==2)throw Error('Invalid cooldown version');
   if(!source||typeof source!=='object'||Array.isArray(source))throw Error('Invalid deadlines');
   for(const game of games)if(source[game]!==undefined){
    const deadline=source[game];if(!Number.isFinite(deadline)||deadline<0||deadline>Number.MAX_SAFE_INTEGER)throw Error('Invalid deadline');
    // Legacy expiry was request time + 30s. Preserve elapsed time when switching to 10s.
    deadlines[game]=Math.max(time,Math.min(time+COOLDOWN_MS,deadline-(raw==null?20000:0)));
   }
   // Write a versioned marker once; subsequent reloads never subtract 20s again.
   persist(deadlines);
  }
 }catch{blocked=true;}
 const state=()=>{let remaining=0;try{const time=readNow();remaining=active?Math.max(0,Math.min(COOLDOWN_MS,(deadlines[active]||0)-time)):0;}catch{blocked=true;}return {game:active,result,pending,blocked,remaining};};
 const leave=()=>{epoch++;if(timer!==null)cancel(timer);timer=null;active=null;pending=false;result=null;};
 const enter=game=>{leave();active=supportedSimulation(game)?game:null;return state();};
 const request=(onChange=()=>{})=>{
  const current=state();if(!active||current.blocked||pending||current.remaining>0)return false;
  const game=active,token=epoch;
  try{
   const generated=createPerGameExample(game,rng);
   const deliver=()=>{
    const next={...deadlines,[game]:readNow()+COOLDOWN_MS};
    persist(next);deadlines=next;pending=false;result=generated;
   };
   if(game==='chicken'||game==='thimbles'){
    result=null;pending=true;timer=schedule(()=>{
     if(token!==epoch||active!==game)return;
     timer=null;
     try{deliver();}catch{pending=false;blocked=true;}
     onChange();
    },500);
   }else deliver();
  }catch{blocked=true;}
  onChange();return !blocked;
 };
 return {enter,leave,state,request};
}
