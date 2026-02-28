import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";

import { 
  getFirestore, 
  doc, 
  getDoc 
} from 
"https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCPrQEr2OXfcjPyCRb5uT9KQKZjf5aBDg8",
  authDomain: "studint-code.firebaseapp.com",
  projectId: "studint-code",
  storageBucket: "studint-code.firebasestorage.app",
  messagingSenderId: "736980801683",
  appId: "1:736980801683:web:9e7b1f7caf90b39ded5566",
  measurementId: "G-JV9BQ5KTS9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// 🔴 رسالة المنع
function showBlockedMessage(message) {

  document.body.innerHTML = `
    <style>
      body{
        margin:0;
        font-family:'Cairo',sans-serif;
        background:linear-gradient(135deg,#0f172a,#1e293b,#0f172a);
        display:flex;
        align-items:center;
        justify-content:center;
        height:100vh;
        overflow:hidden;
      }

      .blocked-card{
        background:rgba(77, 36, 21, 0.05);
        backdrop-filter:blur(20px);
        border:1px solid rgba(173, 112, 20, 0.1);
        padding:50px 40px;
        border-radius:25px;
        text-align:center;
        color:white;
        width:90%;
        max-width:420px;
        box-shadow:0 20px 60px rgba(0,0,0,.6);
        animation:fadeUp .6s ease;
      }

      .icon{
        font-size:60px;
        margin-bottom:20px;
        animation:shake 1.5s infinite;
      }

      h2{
        margin:0 0 15px;
        font-size:22px;
        color:#ff4d4d;
      }

      p{
        opacity:.85;
        margin-bottom:25px;
      }

      .count{
        font-size:14px;
        opacity:.6;
      }

      .btn{
        margin-top:25px;
        padding:12px 25px;
        border:none;
        border-radius:12px;
        background:linear-gradient(45deg,#ff4d4d,#ff0000);
        color:white;
        cursor:pointer;
        font-size:14px;
        transition:.3s;
      }

      .btn:hover{
        transform:translateY(-3px);
        box-shadow:0 10px 25px rgba(255,0,0,.5);
      }

      @keyframes fadeUp{
        from{opacity:0; transform:translateY(40px);}
        to{opacity:1; transform:translateY(0);}
      }

      @keyframes shake{
        0%,100%{transform:rotate(0);}
        25%{transform:rotate(-5deg);}
        75%{transform:rotate(5deg);}
      }
    </style>

    <div class="blocked-card">
      <div class="icon">🚫</div>
      <h2>تم إيقاف الوصول</h2>
      <p>${message}</p>
      <div class="count" id="countdown">
        سيتم تحويلك خلال 5 ثواني...
      </div>
      <button class="btn" onclick="window.location.href='/index.html'">
        الرجوع الآن
      </button>
    </div>
  `;

  let seconds = 5;
  const timer = setInterval(() => {
    seconds--;
    const el = document.getElementById("countdown");
    if (el) el.textContent = `سيتم تحويلك خلال ${seconds} ثواني...`;

    if (seconds <= 0) {
      clearInterval(timer);
      window.location.href = "/index.html";
    }
  }, 1000);
}

// ✅ التحقق
document.addEventListener("DOMContentLoaded", async () => {

  const studentData = JSON.parse(localStorage.getItem("studentData"));

  if (!studentData || !studentData.studentId) {
    showBlockedMessage("أنت غير مسجل أو تم إقصاؤك من المنصة");
    return;
  }

  try {

    const studentRef = doc(db, "students", studentData.studentId);
    const studentSnap = await getDoc(studentRef);

    if (!studentSnap.exists()) {
      localStorage.removeItem("studentData");
      showBlockedMessage("أنت غير مسجل أو تم إقصاؤك من المنصة");
      return;
    }

    console.log("الطالب مسجل ✅");

  } catch (error) {
    console.error(error);
    showBlockedMessage("حدث خطأ أثناء التحقق من بياناتك");
  }

});