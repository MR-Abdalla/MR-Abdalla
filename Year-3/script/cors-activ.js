import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBaezH8j4u0Kmum3poYuFk8LsGtVietnSM",
  authDomain: "viduo-corss.firebaseapp.com",
  projectId: "viduo-corss",
  storageBucket: "viduo-corss.firebasestorage.app",
  messagingSenderId: "485896854659",
  appId: "1:485896854659:web:f0a618235eb4d9e9784fb6",
  measurementId: "G-SVB0WMS9MW"
};

// init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get studentId from localStorage
const studentData = JSON.parse(localStorage.getItem("studentData"));
const studentId = studentData?.studentId;

// Load activated videos in slider
async function loadActivatedSlider() {
  const sliderInner = document.getElementById("sliderInner");

  if (!studentId) {
    sliderInner.innerHTML = `<p>لا يوجد كود طالب</p>`;
    return;
  }

  const q = query(collection(db, "activations"), where("studentId", "==", studentId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    sliderInner.innerHTML = `<p>لا توجد محاضرات مفعلة</p>`;
    return;
  }

  sliderInner.innerHTML = ""; // Clear loading state

  snapshot.forEach(doc => {
    const d = doc.data();
    const date = d.activatedAt?.toDate().toLocaleString("ar-EG") || "—";

    sliderInner.innerHTML += `
      <div class="slide-card">
        <h3>${d.lectureName}<i class="course-icon fas fa-atom"></i></h3>
        <p>تاريخ التفعيل: ${date}</p>

        <a class="btn-play" href="https://mr-abdala.vercel.app/Year-3/subscribe.html?videoId=${d.videoId}">
          تشغيل الفيديو
        </a>
      </div>
    `;
  });
}

// Run
loadActivatedSlider();