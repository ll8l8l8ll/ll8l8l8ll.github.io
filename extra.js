function latinToHebrew(src){
  let s = src.toLowerCase();
  s = s.replace(/sh/g,"ש").replace(/ts/g,"צ").replace(/ch/g,"ח").replace(/kh/g,"ח").replace(/th/g,"ת").replace(/ph/g,"פ");
  const map = {a:"א", e:"א", i:"י", o:"ו", u:"ו", b:"ב", c:"כ", d:"ד", f:"פ", g:"ג", h:"ה", j:"ז", k:"כ", l:"ל", m:"מ", n:"נ", p:"פ", q:"ק", r:"ר", s:"ס", t:"ת", v:"ו", w:"ו", x:"קס", y:"י", z:"ז"};
  let out=""; 
  for(const ch of s){ out += (map[ch]||""); }
  return out;
}

function toHebrewUniversal(raw){
  if(!raw) return "";
  if(/[\u0590-\u05FF]/.test(raw)) return raw;
  if(/[가-힣]/.test(raw) && window.Romanizer){
    try{ return latinToHebrew(new Romanizer(raw).romanize()); }catch(e){}
  }
  if(/[\u3040-\u30FF]/.test(raw) && window.wanakana){
    return latinToHebrew(wanakana.toRomaji(raw));
  }
  if(/[\u4E00-\u9FFF]/.test(raw) && window.pinyinPro){
    return latinToHebrew(pinyinPro.pinyin(raw, {toneType:"none"}));
  }
  return latinToHebrew(raw);
}

window.toHebrewUniversal = toHebrewUniversal;
