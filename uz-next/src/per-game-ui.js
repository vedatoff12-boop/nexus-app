import {exampleLabel,formatPerGameExample,isValidExample} from './per-game-example.js';
const backgrounds={lucky:'lucky-result.png',chicken:'chicken-result.png',chicken2:'chicken2-result.png',aviator:'aviator-result.png',tower:'tower-result.png',ice:'ice-result.png',balloon:'balloon-result.jpg'};
const cupMarkup=position=>`<svg class="cup-stage" viewBox="0 -24 503 248" aria-hidden="true"><defs>${[0,1,2].map(i=>`<clipPath id="example-cup-${i}"><path d="M${94+i*130} 5 L${174+i*130} 5 L${185+i*130} 115 L${70+i*130} 105 Z"/></clipPath>`).join('')}</defs><image href="assets/thimbles-center.png" width="503" height="224"/><rect x="48" y="0" width="410" height="215" rx="20" fill="#313644"/>${['left','center','right'].map((p,i)=>`<g class="example-cup ${position===p?'is-revealed':''}">${position===p?`<circle class="example-ball" cx="${127+i*130}" cy="104" r="13" fill="#fa303b" stroke="#ff949a" stroke-width="4"/>`:''}<g class="cup-lift"><image href="assets/thimbles-center.png" width="503" height="224" clip-path="url(#example-cup-${i})"/></g></g>`).join('')}</svg>`;
export function exampleMarkup(game,state){
 const label=exampleLabel(game);if(!label)return '';
 if(state.result!=null&&!isValidExample(game,state.result))state={...state,blocked:true};
 const result=state.blocked?null:state.result;
 const value=result?formatPerGameExample(result,game):'';
 const illustration=game==='thimbles'?cupMarkup(result?.kind==='cup'?result.position:null):`<img class="example-backdrop" src="assets/${backgrounds[game]}" alt=""/><span class="example-value ${game==='chicken'?'example-token':game==='chicken2'?'example-manhole':game==='tower'?'example-sign':''}" aria-hidden="true">${state.pending?'…':value||'—'}</span>`;
 const spoken=state.blocked?'Misol hozircha mavjud emas.':state.pending?'Kutilmoqda…':result?.kind==='cup'?`Qizil shar: ${{left:'chapda',center:'o‘rtada',right:'o‘ngda'}[result.position]}. Tasodifiy misol.`:value?`${label}: ${value}`:'Hali misol yaratilmagan.';
 return `<div class="example-card example-${game}">${illustration}<span class="example-tag">Tasodifiy misol</span></div><button type="button" class="primary" data-example ${state.blocked||state.pending||state.remaining>0?'disabled':''}>Tasodifiy misol yaratish</button><p class="example-warning">Tasodifiy qiymat. O‘yin natijasini bashorat qilmaydi</p><p class="example-label">${label}</p><p class="example-status" role="status" aria-live="polite">${spoken}</p><p class="example-cooldown" data-cooldown>${state.remaining>0?`Keyingi misol ${Math.ceil(state.remaining/1000)} soniyadan keyin.`:''}</p><p class="example-disclosure">Bepul mahalliy simulyatsiya. Daraja, depozit va signal xizmatiga bog‘liq emas.</p>`;
}
export const exampleSection=game=>exampleLabel(game)?'<section class="game-example" aria-label="Tasodifiy misol"></section>':'';
export function mountExample(host,game,simulation,{repeat=setInterval,stop=clearInterval}={}){
 simulation.enter(game);if(!host)return ()=>simulation.leave();
 const paint=()=>{host.innerHTML=exampleMarkup(game,simulation.state());};
 const click=e=>{if(e.target.closest('[data-example]'))simulation.request(paint);};host.addEventListener('click',click);paint();
 const interval=repeat(()=>{const s=simulation.state();host.querySelector('[data-example]').disabled=s.blocked||s.pending||s.remaining>0||(s.result!=null&&!isValidExample(game,s.result));host.querySelector('[data-cooldown]').textContent=s.remaining>0?`Keyingi misol ${Math.ceil(s.remaining/1000)} soniyadan keyin.`:'';},250);
 return ()=>{stop(interval);host.removeEventListener('click',click);simulation.leave();};
}
