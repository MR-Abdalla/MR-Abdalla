import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  startAfter 
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// -----------------------------
// Firebase Config
// -----------------------------
const firebaseConfig = {
  apiKey: "AIzaSyBaezH8j4u0Kmum3poYuFk8LsGtVietnSM",
  authDomain: "viduo-corss.firebaseapp.com",
  projectId: "viduo-corss",
  storageBucket: "viduo-corss.firebasestorage.app",
  messagingSenderId: "485896854659",
  appId: "1:485896854659:web:f0a618235eb4d9e9784fb6",
  measurementId: "G-SVB0WMS9MW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// -----------------------------
// حماية المنصة
// -----------------------------
function showBlockedMessage(message) {
  document.body.innerHTML = `
    <style>
      body{margin:0;font-family:'Cairo',sans-serif;
        display:flex;align-items:center;justify-content:center;
        height:100vh;background:linear-gradient(135deg,#0f172a,#1e293b,#0f172a);}
      .blocked-card{
        background:rgba(255,255,255,0.05);backdrop-filter:blur(20px);
        border:1px solid rgba(255,255,255,0.1);padding:50px 40px;
        border-radius:25px;text-align:center;color:white;width:90%;max-width:420px;
        box-shadow:0 20px 60px rgba(0,0,0,.6);animation:fadeUp .6s ease;}
      .icon{font-size:60px;margin-bottom:20px;animation:shake 1.5s infinite;}
      h2{margin:0 0 15px;font-size:22px;color:#ff4d4d;}
      p{opacity:.85;margin-bottom:25px;}
      .count{font-size:14px;opacity:.6;}
      .btn{margin-top:25px;padding:12px 25px;border:none;border-radius:12px;
           background:linear-gradient(45deg,#ff4d4d,#ff0000);color:white;cursor:pointer;font-size:14px;
           transition:.3s;}
      .btn:hover{transform:translateY(-3px);box-shadow:0 10px 25px rgba(255,0,0,.5);}
      @keyframes fadeUp{from{opacity:0; transform:translateY(40px);}to{opacity:1; transform:translateY(0);}}
      @keyframes shake{0%,100%{transform:rotate(0);}25%{transform:rotate(-5deg);}75%{transform:rotate(5deg);}}
    </style>

    <div class="blocked-card">
      <div class="icon">🚫</div>
      <h2>تم إيقاف الوصول</h2>
      <p>${message}</p>
      <div class="count" id="countdown">سيتم تحويلك خلال 5 ثواني...</div>
      <button class="btn" onclick="window.location.href='/index.html'">الرجوع الآن</button>
    </div>
  `;

  let seconds = 5;
  const timer = setInterval(() => {
    seconds--;
    const el = document.getElementById("countdown");
    if(el) el.textContent = `سيتم تحويلك خلال ${seconds} ثواني...`;
    if(seconds <= 0){clearInterval(timer); window.location.href="/index.html";}
  },1000);
}

// -----------------------------
// التحقق من تسجيل الطالب
// -----------------------------
function checkStudent() {
  const studentData = JSON.parse(localStorage.getItem("studentData"));
  if(!studentData || !studentData.studentId){
    showBlockedMessage("أنت غير مسجل أو تم إقصاؤك من المنصة");
    return false;
  }
  return true;
}

// -----------------------------
// عرض Skeleton Loading
// -----------------------------
function renderSkeleton(count=3){
  const container = document.getElementById("lectures");
  container.innerHTML="";
  for(let i=0;i<count;i++){
    const sk = document.createElement("div");
    sk.className="skeleton";
    sk.innerHTML = `<div style="height:180px;background:#1e293b;margin:15px 0;border-radius:12px;animation:pulse 1.5s infinite;"></div>`;
    container.appendChild(sk);
  }
}

// -----------------------------
// Render الدروس
// -----------------------------
function renderLectures(list){
  const container = document.getElementById("lectures");
  container.innerHTML="";
  const fragment = document.createDocumentFragment();

  list.forEach(item=>{
    const box = document.createElement("div");
    box.className="lecture-item";
    box.innerHTML=`
      <img src="${item.image}" loading="lazy" decoding="async" class="lecture-img">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    `;
    fragment.appendChild(box);
  });

  container.appendChild(fragment);
}

// -----------------------------
// تحميل الدروس مع Pagination
// -----------------------------
let lastDoc = null;
let isLoading = false;

async function loadLectures(limitCount=6){
  if(!checkStudent()) return;

  const container = document.getElementById("lectures");
  renderSkeleton(limitCount);

  const cachedData = localStorage.getItem("cachedLectures");
  if(cachedData){
    console.log("📦 Loaded from CACHE");
    const lectures = JSON.parse(cachedData);
    renderLectures(lectures);
  }

  if(isLoading) return;
  isLoading = true;

  try{
    const colRef = collection(db,"lectures");
    let q = query(colRef, orderBy("title"), limit(limitCount));
    if(lastDoc) q = query(colRef, orderBy("title"), startAfter(lastDoc), limit(limitCount));

    const snapshot = await getDocs(q);
    const lectures=[];
    snapshot.forEach(doc=>{
      lectures.push({id:doc.id,...doc.data()});
    });

    if(snapshot.docs.length>0) lastDoc = snapshot.docs[snapshot.docs.length-1];
    if(!cachedData) localStorage.setItem("cachedLectures", JSON.stringify(lectures));

    renderLectures(lectures);

  }catch(err){
    console.error(err);
  }finally{
    isLoading=false;
  }
}

// -----------------------------
// Infinite Scroll
// -----------------------------
window.addEventListener("scroll",()=>{
  if(window.innerHeight + window.scrollY >= document.body.offsetHeight-200){
    loadLectures(6);
  }
});

// -----------------------------
// CSS Skeleton & Lecture Styles
// -----------------------------
const style = document.createElement("style");
style.innerHTML=`
.skeleton div{background:#1e293b;border-radius:12px;margin:15px 0;animation:pulse 1.5s infinite;}
@keyframes pulse{0%{opacity:0.4;}50%{opacity:0.8;}100%{opacity:0.4;}}
.lecture-item{background:#111827;padding:15px;border-radius:15px;margin:15px 0;transition:.3s;}
.lecture-item:hover{transform:translateY(-5px);}
.lecture-img{width:100%;border-radius:12px;}
`;
document.head.appendChild(style);

// -----------------------------
// RUN
// -----------------------------
document.addEventListener("DOMContentLoaded",()=>{
  loadLectures();
});