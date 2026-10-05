const DEFAULTS = {
 body:{title:"🫶 גוף",subtitle:"נשימה, שחרור ותנועה",items:[
  {id:"b1",emoji:"🌬️",name:"נשימה 4–6",desc:"שאיפה רגועה ל־4 שניות ונשיפה איטית ל־6. חזרי בקצב שנעים לך."},
  {id:"b2",emoji:"🤲",name:"כיווץ והרפיית שרירים",desc:"כווצי בעדינות ידיים וכתפיים לכמה שניות, שחררי, והמשיכי לרגליים וללסת."},
  {id:"b3",emoji:"💃",name:"ריקוד בחדר",desc:"שימי שיר שאת אוהבת וזוזי בחופשיות במשך דקה או שתיים."},
  {id:"b4",emoji:"✨",name:"ניעור ושחרור",desc:"נערי בעדינות ידיים, כתפיים ורגליים ואז עצרי ושימי לב לגוף."},
  {id:"b5",emoji:"🙆‍♀️",name:"מתיחות רגועות",desc:"מתחי ידיים, גלגלי כתפיים ושחררי את הלסת בעדינות."}
 ]},
 thought:{title:"💭 מחשבה",subtitle:"מסגור מחדש ומחשבות שעוזרות",items:[
  {id:"t1",emoji:"☁️",name:"מחשבה היא לא עובדה",desc:"אמרי: יש לי עכשיו מחשבה שכולם ישפטו אותי. אני לא באמת יודעת מה הם חושבים."},
  {id:"t2",emoji:"🌈",name:"מותר לי לטעות",desc:"אני רוצה להצליח, אבל לא חייבת להיות מושלמת. מותר להתבלבל ולהמשיך."},
  {id:"t3",emoji:"💜",name:"אני יכולה גם עם לחץ",desc:"אמרי: אני יכולה להיות לחוצה ועדיין לעשות את זה."},
  {id:"t4",emoji:"👣",name:"רק הצעד הבא",desc:"במקום לחשוב על כל האירוע, התמקדי רק בצעד או במשפט הבא."},
  {id:"t5",emoji:"🔎",name:"מסגור מחדש",desc:"זה אולי יהיה לא נעים אם אתבלבל, אבל אוכל לעצור, לנשום ולהמשיך."}
 ]},
 mind:{title:"🌿 מיינדפולנס",subtitle:"חושים, קרקוע וכאן ועכשיו",items:[
  {id:"m1",emoji:"🦶",name:"רגליים על הרצפה",desc:"הרגישי את העקבים, האצבעות ומשקל הגוף. מצאי שלוש נקודות מגע."},
  {id:"m2",emoji:"🔵",name:"צורות בחדר",desc:"מצאי חמש צורות שונות בחדר ותני לעיניים לעבור ביניהן לאט."},
  {id:"m3",emoji:"🎨",name:"ציד צבעים",desc:"בחרי צבע וחפשי חמישה דברים בחדר שיש בהם אותו."},
  {id:"m4",emoji:"🎧",name:"הקשבה לצלילים",desc:"מצאי שלושה צלילים קרובים ואז שניים רחוקים."},
  {id:"m5",emoji:"🖐️",name:"5–4–3–2–1",desc:"5 דברים שאת רואה, 4 במגע, 3 שאת שומעת, 2 שאת מריחה ו־1 שאת טועמת או מדמיינת."}
 ]}
};

const KEYS=["body","thought","mind"];
let selected={body:[],thought:[],mind:[]};
let custom=JSON.parse(localStorage.getItem("libiluxCustom")||'{"body":[],"thought":[],"mind":[]}');
KEYS.forEach(k=>{ if(!Array.isArray(custom[k])) custom[k]=[]; });

function items(k){ return DEFAULTS[k].items.concat(custom[k]); }
function show(id){ document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active")); document.getElementById(id).classList.add("active"); window.scrollTo({top:0,behavior:"smooth"}); }

function renderCategories(){
 const host=document.getElementById("categories"); host.innerHTML="";
 KEYS.forEach(k=>{
  const wrap=document.createElement("section"); wrap.className=`category ${k}`;
  wrap.innerHTML=`<button class="categoryHead"><span class="badge">${selected[k].length}/2</span><h2>${DEFAULTS[k].title}</h2><p>${DEFAULTS[k].subtitle} ›</p></button>
  <div class="categoryBody"><p class="hint">בחרי ריטואל אחד או שניים. אחרי שתי בחירות לא ניתן לבחור שלישי עד שמבטלים אחת.</p><div class="warning">אפשר לבחור עד שני ריטואלים בלבד 💜</div><div class="choices"></div>
  <details class="addArea"><summary>＋ הוספת ריטואל חדש מהטיפול</summary><div class="addFields"><input class="newName" placeholder="שם קצר לריטואל"><input class="newDesc" placeholder="מה עושים?"><button class="secondary addBtn">הוסיפי למאגר ✨</button></div></details></div>`;
  wrap.querySelector(".categoryHead").onclick=()=>wrap.classList.toggle("open");
  const choices=wrap.querySelector(".choices");
  items(k).forEach(r=>{
   const lab=document.createElement("label"); lab.className="ritualChoice";
   lab.innerHTML=`<input type="checkbox" ${selected[k].includes(r.id)?"checked":""}><div class="choiceCard"><b>${r.emoji} ${r.name}</b><span>${r.desc}</span></div>`;
   const cb=lab.querySelector("input");
   cb.onchange=()=>{
    if(cb.checked && selected[k].length>=2){
      cb.checked=false; const w=wrap.querySelector(".warning"); w.classList.add("show"); setTimeout(()=>w.classList.remove("show"),1800); return;
    }
    if(cb.checked) selected[k].push(r.id); else selected[k]=selected[k].filter(id=>id!==r.id);
    updateSummary(); renderCategoriesPreserveOpen(k);
   };
   choices.appendChild(lab);
  });
  wrap.querySelector(".addBtn").onclick=()=>{
    const name=wrap.querySelector(".newName").value.trim(), desc=wrap.querySelector(".newDesc").value.trim();
    if(!name||!desc) return;
    custom[k].push({id:"c"+Date.now(),emoji:"✨",name,desc});
    localStorage.setItem("libiluxCustom",JSON.stringify(custom));
    renderCategoriesPreserveOpen(k);
  };
  host.appendChild(wrap);
 });
}
function renderCategoriesPreserveOpen(openKey){
 renderCategories();
 const target=document.querySelector(`.category.${openKey}`); if(target) target.classList.add("open");
 updateSummary();
}
function findRitual(k,id){ return items(k).find(r=>r.id===id); }
function updateSummary(){
 let total=0, html="";
 KEYS.forEach(k=>{ total+=selected[k].length; selected[k].forEach(id=>{const r=findRitual(k,id); if(r) html+=`<span class="pill">${r.emoji} ${r.name}</span>`;}); });
 document.getElementById("selectedPills").innerHTML=html;
 const valid=KEYS.every(k=>selected[k].length>=1 && selected[k].length<=2);
 document.getElementById("playBtn").disabled=!valid;
 document.getElementById("status").textContent=valid?`מוכנה! בחרת ${total} ריטואלים משלוש הקטגוריות.`:"בחרי לפחות ריטואל אחד מכל קטגוריה.";
}
document.getElementById("playBtn").onclick=()=>{
 const list=document.getElementById("ceremonyList"); list.innerHTML="";
 KEYS.forEach(k=>selected[k].forEach(id=>{
   const r=findRitual(k,id); if(!r)return;
   const card=document.createElement("article"); card.className="ritualRun";
   card.innerHTML=`<div class="emoji">${r.emoji}</div><div><h3>${r.name}</h3><p>${r.desc}</p><label><input type="checkbox"> ביצעתי ✓</label></div>`;
   card.querySelector("input").onchange=e=>{card.classList.toggle("done",e.target.checked); updateFinish();};
   list.appendChild(card);
 }));
 document.getElementById("finishBtn").disabled=true; show("ceremony");
};
function updateFinish(){
 const all=[...document.querySelectorAll("#ceremonyList input")];
 document.getElementById("finishBtn").disabled=!(all.length && all.every(x=>x.checked));
}
document.getElementById("backBtn").onclick=()=>show("home");
document.getElementById("finishBtn").onclick=()=>{show("final"); sparkle();};
document.getElementById("againBtn").onclick=()=>{selected={body:[],thought:[],mind:[]};renderCategories();updateSummary();show("home");};
function sparkle(){
 const box=document.getElementById("sparkles"); box.innerHTML="";
 for(let i=0;i<36;i++){
  const s=document.createElement("span"); s.className="spark"; s.textContent=Math.random()>.45?"✦":"♥";
  s.style.left=(Math.random()*100)+"vw"; s.style.fontSize=(12+Math.random()*18)+"px";
  s.style.animationDuration=(2.2+Math.random()*2)+"s"; s.style.animationDelay=(Math.random()*.8)+"s";
  box.appendChild(s); setTimeout(()=>s.remove(),5200);
 }
}
renderCategories(); updateSummary();
