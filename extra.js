const HVAL = {
  "א":1,"ב":2,"ג":3,"ד":4,"ה":5,"ו":6,"ז":7,"ח":8,"ט":9,
  "י":10,"כ":20,"ך":20,"ל":30,"מ":40,"ם":40,"נ":50,"ן":50,
  "ס":60,"ע":70,"פ":80,"ף":80,"צ":90,"ץ":90,"ק":100,"ר":200,"ש":300,"ת":400
};

function latinToHebrew(src){
  let s = src.toLowerCase();
  s = s.replace(/sh/g,"ש").replace(/ts/g,"צ").replace(/ch/g,"ח")
       .replace(/kh/g,"ח").replace(/th/g,"ת").replace(/ph/g,"פ");
  const map = {
    a:"א", e:"א", i:"י", o:"ו", u:"ו",
    b:"ב", c:"כ", d:"ד", f:"פ", g:"ג", h:"ה",
    j:"ז", k:"כ", l:"ל", m:"מ", n:"נ", p:"פ",
    q:"ק", r:"ר", s:"ס", t:"ת", v:"ו", w:"ו",
    x:"קס", y:"י", z:"ז"
  };
  let out=""; 
  for(const ch of s){ out += (map[ch]||""); }
  return out;
}

function toHebrewUniversal(raw){
  if(!raw) return "";
  if(/[\u0590-\u05FF]/.test(raw)) return raw;

  if(/[가-힣]/.test(raw)){
    if(window.Romanizer){
      const romanized = Romanizer.romanize(raw);
      return latinToHebrew(romanized);
    }
  }

  if(/[\u3040-\u30FF]/.test(raw)){
    if(window.wanakana){
      const romanized = wanakana.toRomaji(raw);
      return latinToHebrew(romanized);
    }
  }

  if(/[\u4E00-\u9FFF]/.test(raw)){
    if(window.pinyinPro){
      const romanized = pinyinPro.pinyin(raw, { toneType: 'none' });
      return latinToHebrew(romanized);
    }
  }

  return latinToHebrew(raw);
}

window.toHebrewUniversal = toHebrewUniversal;
