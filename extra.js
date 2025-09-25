
// extra.js — Add-on for multi-language transliteration + fixed Hebrew mappings

// --- Fixed Hebrew spellings for key figures ---
const FIXED_NAMES = {
  "Donald Trump": "דונלד טראמפ",
  "Messiah ben David": "משיח בן דוד",
  "Jesus": "ישוע",
  "Moses": "משה",
  "David": "דוד"
  // ➕ 주인님 필요하면 더 추가 가능
};

// --- Hebrew letter values ---
const HVAL = {
  "א":1,"ב":2,"ג":3,"ד":4,"ה":5,"ו":6,"ז":7,"ח":8,"ט":9,
  "י":10,"כ":20,"ך":20,"ל":30,"מ":40,"ם":40,"נ":50,"ן":50,"ס":60,"ע":70,
  "פ":80,"ף":80,"צ":90,"ץ":90,"ק":100,"ר":200,"ש":300,"ת":400
};

// --- Transliteration for Latin (English/romanized) ---
function latinToHebrew(src){
  let s = src.toLowerCase();
  s = s.replace(/sh/g,"ש").replace(/ts/g,"צ").replace(/ch/g,"ח").replace(/kh/g,"ח").replace(/th/g,"ת").replace(/ph/g,"פ");
  const map = {
    a:"א", e:"א", i:"י", o:"ו", u:"ו",
    b:"ב", c:"כ", d:"ד", f:"פ", g:"ג",
    h:"ה", j:"ז", k:"כ", l:"ל", m:"מ", n:"נ",
    p:"פ", q:"ק", r:"ר", s:"ס", t:"ת", v:"ו",
    w:"ו", x:"קס", y:"י", z:"ז"
  };
  let out=""; for(const ch of s){ out += (map[ch]||""); }
  return out;
}

// --- Simple Hangul → Latin → Hebrew ---
function hangulToHebrew(korean){
  // TODO: 개선 가능. 현재는 자모 단순 분리 후 대응.
  try {
    const latin = korean.normalize("NFD"); // 임시: 한글 → 분해 문자열
    return latinToHebrew(latin);
  } catch(e) { return ""; }
}

// --- Japanese / Chinese placeholder (발음 기반 로마자화 필요) ---
function eastAsiaToHebrew(txt){
  // 실제 발음 로마자화는 복잡하지만, 임시로 문자 자체를 라틴으로 취급
  return latinToHebrew(txt);
}

// --- Auto transliteration chooser ---
function translitAuto(raw){
  if(!raw) return "";
  if(FIXED_NAMES[raw]) return FIXED_NAMES[raw];     // ✅ 고정 매핑 우선
  if(/[\u0590-\u05FF]/.test(raw)) return raw;       // 이미 히브리어면 그대로
  if(/[가-힣]/.test(raw)) return hangulToHebrew(raw);   // 한글
  if(/[\u4E00-\u9FFF]/.test(raw) || /[\u3040-\u30FF]/.test(raw)) 
    return eastAsiaToHebrew(raw);                   // 중국어 / 일본어
  return latinToHebrew(raw);                        // 기본 라틴
}

// --- Hebrew sum calculator (재사용) ---
function sumHebrew(hebrew){
  let total=0; for(const ch of hebrew){ const v=HVAL[ch]; if(v) total+=v; }
  return total;
}

// --- Hook 기존 onTrans, onCalc 함수에 자동 연결 ---
(function(){
  const origOnTrans = window.onTrans;
  window.onTrans = function(){
    const raw=document.getElementById("raw").value.trim();
    document.getElementById("heb").value = translitAuto(raw);
    if(origOnTrans) origOnTrans();
  };
})();
