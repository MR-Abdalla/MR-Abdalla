import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBaezH8j4u0Kmum3poYuFk8LsGtVietnSM",
  authDomain: "viduo-corss.firebaseapp.com",
  projectId: "viduo-corss",
  storageBucket: "viduo-corss.firebasestorage.app",
  messagingSenderId: "485896854659",
  appId: "1:485896854659:web:f0a618235eb4d9e9784fb6",
  measurementId: "G-SVB0WMS9MW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ------------------------------------------------------
//     FUNCTION: Load Lectures (Fast with Cache)
// ------------------------------------------------------
async function loadLectures() {
  const container = document.getElementById("lectures");

  // ✔️ 1 — هل في بيانات محفوظة من قبل؟
  const cachedData = localStorage.getItem("cachedLectures");

  if (cachedData) {
    console.log("📦 Loaded from CACHE");
    const lectures = JSON.parse(cachedData);
    renderLectures(lectures);
    return;
  }

  // ❌ 2 — أول مرة → تحميل من Firestore
  console.log("🔥 Fetching from FIRESTORE...");
  const colRef = collection(db, "lectures");   // اسم مجموعتك
  const snapshot = await getDocs(colRef);

  const lectures = [];
  snapshot.forEach(doc => {
    lectures.push({
      id: doc.id,
      ...doc.data()
    });
  });

  // ✔️ 3 — حفظ البيانات للفتح القادم
  localStorage.setItem("cachedLectures", JSON.stringify(lectures));

  // ✔️ 4 — عرض الدروس
  renderLectures(lectures);
}

// ------------------------------------------------------
//     FUNCTION: Render UI
// ------------------------------------------------------
function renderLectures(list) {
  const container = document.getElementById("lectures");
  container.innerHTML = "";

  list.forEach(item => {
    const box = document.createElement("div");
    box.className = "lecture-item";

    box.innerHTML = `
      <img src="${item.image}" loading="lazy" class="lecture-img">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    `;

    container.appendChild(box);
  });
}

// ------------------------------------------------------
//     RUN
// ------------------------------------------------------
window.onload = loadLectures;