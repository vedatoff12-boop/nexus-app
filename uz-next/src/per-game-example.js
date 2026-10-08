/** Reference-led example contracts; UI follows the parent-reviewed specification.
 * @typedef {{kind:'multiplier',game:string,value:number,illustrative:true}|{kind:'cup',game:'thimbles',position:'left'|'center'|'right',illustrative:true}|{kind:'integer',game:'tower',value:number,illustrative:true}|{kind:'unsupported',game:unknown,reason:'unknown-game'}} ExampleResult
 */
const multiplierGames=['lucky','chicken','chicken2','aviator','ice','balloon'];
function draw(rng){const value=rng();if(!Number.isFinite(value)||value<0||value>=1)throw new RangeError('RNG must return a finite number in [0,1)');return value;}
/** RNG must be explicitly injected. No default randomness or account/storage/network access. */
export function createPerGameExample(game,rng){
 if(multiplierGames.includes(game)){
  const central=draw(rng)<0.9;
  const value=((central?150:500)+Math.floor(draw(rng)*(central?151:101)))/100;
  return {kind:'multiplier',game,value,illustrative:true};
 }
 if(game==='thimbles')return {kind:'cup',game,position:['left','center','right'][Math.floor(draw(rng)*3)],illustrative:true};
 if(game==='tower')return {kind:'integer',game,value:3+Math.floor(draw(rng)*7),illustrative:true};
 return {kind:'unsupported',game,reason:'unknown-game'};
}
export function isValidExample(game,result){
 if(!result||typeof result!=='object'||Array.isArray(result)||result.game!==game||result.illustrative!==true)return false;
 const numeric=multiplierGames.includes(game)||game==='tower';
 const keys=Object.keys(result).sort().join(',');
 if(keys!==(numeric?'game,illustrative,kind,value':'game,illustrative,kind,position'))return false;
 if(multiplierGames.includes(game))return result.kind==='multiplier'&&Number.isFinite(result.value)&&result.value===Math.round(result.value*100)/100&&((result.value>=1.5&&result.value<=3)||(result.value>=5&&result.value<=6));
 if(game==='tower')return result.kind==='integer'&&Number.isInteger(result.value)&&result.value>=3&&result.value<=9;
 if(game==='thimbles')return result.kind==='cup'&&['left','center','right'].includes(result.position);
 return false;
}
export function formatPerGameExample(result,game=result?.game){
 if(!isValidExample(game,result))return '';
 if(result.kind==='multiplier')return result.value.toFixed(2)+'x';
 if(result.kind==='integer')return String(result.value);
 return '';
}

/** Labels describe the local example, never a monetary amount or game prediction. */
export function exampleLabel(game){
 if(game==='ice')return 'Tasodifiy bonus koeffitsiyenti misoli';
 if(game==='balloon')return 'Tasodifiy koeffitsiyent misoli';
 if(multiplierGames.includes(game))return 'Tasodifiy koeffitsiyent misoli';
 if(game==='thimbles')return 'Qizil shar joylashuvining tasodifiy misoli';
 if(game==='tower')return 'Tasodifiy son misoli';
 return '';
}
