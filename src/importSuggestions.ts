import type {Part} from './db';
/** Conservative matching: only complete identifier tokens, never substrings (W2 != W21). */
export function suggestParts(filename:string,parts:Part[]):Part[]{
 const normalize=(s:string)=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('de').replace(/[^a-z0-9]+/g,' ' ).trim();
 const tokens=` ${normalize(filename.replace(/\.[^.]+$/,''))} `;
 return parts.filter(p=>{
  const identifiers=[p.number,p.name].filter((s):s is string=>Boolean(s&&s.trim()));
  return identifiers.some(identifier=>{
   const value=normalize(identifier);
   if(value.length<3)return false;
   return tokens.includes(` ${value} `)|| (value.includes(' ')&&tokens.includes(` ${value.replace(/ /g,' ')} `));
  });
 });
}
