import {exampleLabel,formatPerGameExample,isValidExample} from './per-game-example.js';
const backgrounds={lucky:'lucky-result.png',chicken:'chicken-result.png',chicken2:'chicken2-result.png',aviator:'aviator-result.png',tower:'tower-result.png',ice:'ice-result.png',balloon:'balloon-result.jpg'};
const cupMarkup=position=>`<svg class="cup-stage" viewBox="0 -24 503 248" aria-hidden="true"><defs>${[0,1,2].map(i=>`<clipPath id="example-cup-${i}"><path d="M${94+i*130} 5 L${174+i*130} 5 L${185+i*130} 115 L${70+i*130} 105 Z"/></clipPath>`).join('')}</defs><image href="assets/thimbles-center.png" width="503" height="224"/><rect x="48" y="0" width="410" height="215" rx="20" fill="#313644"/>${['left','center','right'].map((p,i)=>`<g class="example-cup ${position===p?'is-revealed':''}">${position===p?`<circle class="example-ball" cx="${127+i*130}" cy="104" r="13" fill="#fa303b" stroke="#ff949a" stroke-width="4"/>`:''}<g class="cup-lift"><image href="assets/thimbles-center.png" width="503" height="224" clip-path="url(#example-cup-${i})"/></g></g>`).join('')}</svg>`;
export function countdownPresentation(state){
 const remaining=Math.max(0,Math.min(10000,state.remaining));
 const seconds=Math.ceil(remaining/1000);
 if(state.blocked)return {seconds:0,value:'—',caption:'Misol mavjud emas',unit:'',ready:false,progress:0};
 if(state.pending&&seconds===0)return {seconds:0,value:'…',caption:'Kutilmoqda',unit:'',ready:false,progress:0};
 return seconds>0?{seconds,value:String(seconds).padStart(2,'0'),caption:'Keyingi misolgacha',unit:'soniya',ready:false,progress:remaining/100}:{seconds:0,value:'Tayyor',caption:'Yangi misol yaratish mumkin',unit:'',ready:true,progress:100};
}
const countdownMarkup=state=>{const c=countdownPresentation(state);return `<div class="example-countdown ${c.ready?'is-ready':''}" data-countdown ${state.blocked||state.pending||(!state.result&&state.remaining<=0)?'hidden ':''}role="timer" aria-live="off" aria-label="${c.caption} ${c.value} ${c.unit}"><div class="countdown-dial"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="countdown-track" cx="60" cy="60" r="52"/><circle class="countdown-progress" data-countdown-progress cx="60" cy="60" r="52" pathLength="100" stroke-dasharray="100" stroke-dashoffset="${100-c.progress}"/></svg><strong data-countdown-value aria-hidden="true">${c.value}</strong></div><span data-countdown-caption>${c.caption}</span><span data-countdown-unit>${c.unit}</span></div><span class="countdown-announcement" data-countdown-announcement role="status" aria-live="polite"></span>`;};
export function exampleMarkup(game,state){
 const label=exampleLabel(game);if(!label)return '';
 if(state.result!=null&&!isValidExample(game,state.result))state={...state,blocked:true};
 const result=state.blocked?null:state.result;
 const value=result?formatPerGameExample(result,game):'';
 const illustration=game==='thimbles'?cupMarkup(result?.kind==='cup'?result.position:null):`<img class="example-backdrop" src="assets/${backgrounds[game]}" alt=""/><span class="example-value ${game==='chicken'?'example-token':game==='chicken2'?'example-manhole':game==='tower'?'example-sign':''}" aria-hidden="true">${state.pending?'…':value||'—'}</span>`;
 const spoken=state.blocked?'Misol hozircha mavjud emas.':state.pending?'Kutilmoqda…':result?.kind==='cup'?`Qizil shar: ${{left:'chapda',center:'o‘rtada',right:'o‘ngda'}[result.position]}.`:value?`${label}: ${value}`:'';
 const card=result&&!state.pending?`<div class="example-card example-${game}">${illustration}</div>`:'';
 return `${card}${countdownMarkup(state)}<button type="button" class="primary" data-example ${state.blocked||state.pending||state.remaining>0?'disabled':''}>${state.pending?'Kutilmoqda…':'Signal olish'}</button><p class="example-status ${state.blocked?'':'countdown-announcement'}" role="status" aria-live="polite">${spoken}</p>`;
}
export const exampleSection=game=>exampleLabel(game)?'<section class="game-example" aria-label="Tasodifiy misol"></section>':'';
export function mountExample(host,game,simulation,{repeat=setInterval,stop=clearInterval}={}){
 simulation.enter(game);if(!host)return ()=>simulation.leave();
 const paint=()=>{host.innerHTML=exampleMarkup(game,simulation.state());};
 const click=e=>{if(e.target.closest('[data-example]')){let announced=false;simulation.request(()=>{paint();const s=simulation.state();if(!announced&&!s.blocked&&s.remaining>0){host.querySelector('[data-countdown-announcement]').textContent='Keyingi misol 10 soniyadan keyin.';announced=true;}});}};host.addEventListener('click',click);paint();
 let previous=countdownPresentation(simulation.state());
 const interval=repeat(()=>{
  let s=simulation.state();if(s.result!=null&&!isValidExample(game,s.result))s={...s,blocked:true};
  const c=countdownPresentation(s);
  host.querySelector('[data-example]').disabled=s.blocked||s.pending||s.remaining>0;
  // No result/live-region replacement and no per-tick screen-reader announcement.
  if(c.value!==previous.value||c.caption!==previous.caption){
   const timer=host.querySelector('[data-countdown]');timer.classList.toggle('is-ready',c.ready);timer.setAttribute('aria-label',`${c.caption} ${c.value} ${c.unit}`);
   host.querySelector('[data-countdown-caption]').textContent=c.caption;
   host.querySelector('[data-countdown-value]').textContent=c.value;
   host.querySelector('[data-countdown-unit]').textContent=c.unit;
  }
  if(c.progress!==previous.progress)host.querySelector('[data-countdown-progress]').setAttribute('stroke-dashoffset',String(100-c.progress));
  if(c.ready&&!previous.ready)host.querySelector('[data-countdown-announcement]').textContent='Yangi misol yaratish mumkin.';
  previous=c;
 },100);
 return ()=>{stop(interval);host.removeEventListener('click',click);simulation.leave();};
}
