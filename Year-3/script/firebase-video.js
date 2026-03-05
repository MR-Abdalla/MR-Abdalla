// script/firebase-video.js
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "viduo-corss.firebaseapp.com",
  projectId: "viduo-corss",
  storageBucket: "viduo-corss.firebasestorage.app",
  messagingSenderId: "485896854659",
  appId: "1:485896854659:web:f0a618235eb4d9e9784fb6"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("videos-container");
  if (!container) return;


function createVideoCard(video) {
  const videoCard = document.createElement("div");
  videoCard.classList.add("video-card");

  videoCard.innerHTML = `
    <a href="subscribe.html?videoId=${video.id}" class="video-link">
      <img src="${video.image || 'default-image.jpg'}"
           class="video-img"
           loading="lazy" />
      <div class="video-info">
        <h3 class="video-title">${video.title || ""}</h3>
        <p class="video-description">${video.description || ""}</p>
      </div>
    </a>
  `;

  return videoCard;
}





  container.innerHTML = `
    <div class="videos-section">
      <h2 class="section-title"><img width="30" height="30" src="https://img.icons8.com/3d-fluency/94/workshop.png" alt="workshop"/> ورش العمل </h2>
      <div class="slider-wrapper">
        <button class="arrow left" data-target="workshops-container">&#10094;</button>
        <div class="slider" id="workshops-container"></div>
        <button class="arrow right" data-target="workshops-container">&#10095;</button>
      </div>
    </div>

       <!-- المحاضرات (جريد عادي) -->
    <div class="videos-section">
      <div class="lectures-grid" id="lectures-container"></div>
    </div>
  `;

  const lecturesContainer = document.getElementById("lectures-container");
  const workshopsContainer = document.getElementById("workshops-container");

  // ✅ Loading Skeleton
  function showLoading(target) {
    for (let i = 0; i < 5; i++) {
      const skeleton = document.createElement("div");
      skeleton.classList.add("video-card", "skeleton");
      target.appendChild(skeleton);
    }
  }

  showLoading(workshopsContainer);
  showLoading(lecturesContainer);

  try {

    const videosRef = collection(db, "videos");
    const q = query(videosRef, where("grade", "==", "3"));
    const snapshot = await getDocs(q);

    // امسح الـ skeleton بعد التحميل
    workshopsContainer.innerHTML = "";
    lecturesContainer.innerHTML = "";

    if (snapshot.empty) {
      container.innerHTML += `<p class="no-videos">لا توجد فيديوهات</p>`;
      return;
    }

    const videos = [];
    snapshot.forEach(doc => {
      videos.push({ id: doc.id, ...doc.data() });
    });

    videos.sort((a, b) => (a.number || 0) - (b.number || 0));

    // فصل الورش
const lectures = videos.filter(v =>
  !(v.title?.includes("ورشه") || v.title?.includes("ورشة"))
);

const workshops = videos.filter(v =>
  (v.title?.includes("ورشه") || v.title?.includes("ورشة"))
);

// عرض الورش زي ما هي
workshops.forEach(video => {
  const videoCard = createVideoCard(video);
  workshopsContainer.appendChild(videoCard);
});

// 🟢 تقسيم المحاضرات لفصول (كل 14)
const chunkSize = 15;

for (let i = 0; i < lectures.length; i += chunkSize) {

  const chapterNumber = Math.floor(i / chunkSize) + 1;
  const chapterVideos = lectures.slice(i, i + chunkSize);

  const sliderId = `chapter-slider-${chapterNumber}`;

  const chapterSection = document.createElement("div");
  chapterSection.classList.add("videos-section");

  chapterSection.innerHTML = `
    <h2 class="section-title"><img width="30" height="30" src="https://img.icons8.com/external-xnimrodx-lineal-color-xnimrodx/64/external-books-online-learning-xnimrodx-lineal-color-xnimrodx.png" alt="external-books-online-learning-xnimrodx-lineal-color-xnimrodx"/> الفصل ${chapterNumber}</h2>
    <div class="slider-wrapper">
      <button class="arrow left" data-target="${sliderId}">&#10094;</button>
      <div class="slider" id="${sliderId}"></div>
      <button class="arrow right" data-target="${sliderId}">&#10095;</button>
    </div>
  `;

  const sliderContainer = chapterSection.querySelector(".slider");

  chapterVideos.forEach(video => {
    const videoCard = createVideoCard(video);
    sliderContainer.appendChild(videoCard);
  });

  container.appendChild(chapterSection);
}


  } catch (error) {
    console.error(error);
  }
});


// ✅ تحريك الأسهم
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("arrow")) {
    const slider = document.getElementById(e.target.dataset.target);
    const amount = 320;

    slider.scrollBy({
      left: e.target.classList.contains("left") ? -amount : amount,
      behavior: "smooth"
    });
  }
});