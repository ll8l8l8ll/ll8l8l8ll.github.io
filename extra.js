const HVAL = {
  "א":1,"ב":2,"ג":3,"ד":4,"ה":5,"ו":6,"ז":7,"ח":8,"ט":9,
  "י":10,"כ":20,"ך":20,"ל":30,"מ":40,"ם":40,"נ":50,"ן":50,
  "ס":60,"ע":70,"פ":80,"ף":80,"צ":90,"ץ":90,"ק":100,"ר":200,"ש":300,"ת":400
};

function hangulToHebrew(src){
  const CHO = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
  const JUNG= ["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"];
  const JONG= ["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
  const mapCho = {"ㄱ":"ג","ㄲ":"ק","ㄴ":"נ","ㄷ":"ד","ㄸ":"ט","ㄹ":"ל","ㅁ":"מ","ㅂ":"ב","ㅃ":"פ","ㅅ":"ס","ㅆ":"ס","ㅇ":"ע","ㅈ":"ז","ㅉ":"ז","ㅊ":"צ","ㅋ":"ק","ㅌ":"ט","ㅍ":"פ","ㅎ":"ה"};
  const mapJung= {"ㅏ":"א","ㅑ":"יא","ㅓ":"א","ㅕ":"יא","ㅗ":"ו","ㅛ":"יו","ㅜ":"ו","ㅠ":"יו","ㅡ":"ו","ㅣ":"י","ㅐ":"א","ㅔ":"א","ㅚ":"וי","ㅟ":"וי","ㅘ":"וא","ㅝ":"וא","ㅞ":"וא","ㅢ":"וי"};
  const mapJong= {"":"", "ㄱ":"ך","ㄴ":"ן","ㄷ":"ד","ㄹ":"ל","ㅁ":"ם","ㅂ":"ב","ㅅ":"ס","ㅇ":"", "ㅈ":"ז","ㅊ":"צ","ㅋ":"ק","ㅌ":"ט","ㅍ":"ף","ㅎ":"ה"};
  let out="";
  for(const ch of src){
    const code = ch.charCodeAt(0);
    if(code>=0xAC00 && code<=0xD7A3){
      const sIndex = code - 0xAC00;
      const cho = CHO[Math.floor(sIndex/588)];
      const jung= JUNG[Math.floor((sIndex%588)/28)];
      const jong= JONG[sIndex%28];
      out += (mapCho[cho]||"") + (mapJung[jung]||"") + (mapJong[jong]||"");
    }else{
      out += ch;
    }
  }
  return out;
}

function asianToLatin(src){
  let out = "";
  for(const ch of src){
    const code = ch.charCodeAt(0);
    if(code>=0x3040 && code<=0x30FF){ 
      out += window.wanakana ? window.wanakana.toRomaji(ch) : ch;
    }else if(code>=0x4E00 && code<=0x9FFF){ 
      if(window.pinyinPro){
        out += window.pinyinPro.pinyin(ch, {toneType:"none"});
      }else{
        out += ch;
      }
    }else{
      out += ch;
    }
  }
  return out;
}

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
  if(/[가-힣]/.test(raw)) return hangulToHebrew(raw);
  if(/[\u3040-\u30FF]/.test(raw) || /[\u4E00-\u9FFF]/.test(raw)){
    const romanized = asianToLatin(raw);
    return latinToHebrew(romanized);
  }
  return latinToHebrew(raw);
}

window.toHebrewUniversal = toHebrewUniversal;
