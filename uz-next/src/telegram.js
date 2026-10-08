/** UI bridge only. Host detection is not authentication or proof of paid access. */
export function isTelegramLaunch(tg) {
  return !!tg && typeof tg.platform === 'string' && tg.platform !== '' && tg.platform !== 'unknown';
}
export function telegramBackTarget(page) {
  return ['game','levels'].includes(page) ? 'games' : 'home';
}
export function connectTelegram({tg,app,getPage,navigate,events,fallbackHeight}) {
  if (!isTelegramLaunch(tg)) return {embedded:false,ready(){},dispose(){}};
  app.classList.add('embedded');
  const px=value=>`${Number.isFinite(value)&&value>0?value:0}px`;
  const update=()=>{
    for(const [key,value] of Object.entries({
      '--tg-safe-top':tg.safeAreaInset?.top,
      '--tg-safe-bottom':tg.safeAreaInset?.bottom,
      '--tg-content-safe-top':tg.contentSafeAreaInset?.top,
      '--tg-content-safe-bottom':tg.contentSafeAreaInset?.bottom,
      '--app-viewport-height':tg.viewportStableHeight>0?tg.viewportStableHeight:fallbackHeight(),
    })) app.style.setProperty(key,px(value));
  };
  const viewportChanged=data=>{if(data?.isStateStable!==false)update();};
  const back=()=>navigate(telegramBackTarget(getPage()));
  const syncBack=()=>getPage()==='home'?tg.BackButton?.hide():tg.BackButton?.show();
  const subscriptions=[['safeAreaChanged',update],['contentSafeAreaChanged',update],['viewportChanged',viewportChanged]];
  subscriptions.forEach(([name,fn])=>tg.onEvent?.(name,fn));
  tg.BackButton?.onClick(back);events.addEventListener('hashchange',syncBack);
  update();syncBack();
  return {embedded:true,ready(){tg.ready?.();tg.expand?.();update();},dispose(){subscriptions.forEach(([name,fn])=>tg.offEvent?.(name,fn));tg.BackButton?.offClick?.(back);events.removeEventListener('hashchange',syncBack);}};
}
