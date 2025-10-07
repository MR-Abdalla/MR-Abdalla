function nextVideo() {
  let videos = document.querySelectorAll(".video-item");
  let current = document.querySelector(".video-item.active");
  let currentIndex = Array.from(videos).indexOf(current);
  let nextIndex = currentIndex + 1;

  if (nextIndex < videos.length) {
    let nextVideo = videos[nextIndex];
    let videoId = nextVideo.getAttribute("onclick").match(/'(.*?)'/)[1];
    changeVideo(videoId, nextVideo);

    // افتح القائمة ثانية واحدة وبعدين اقفلها
    toggleSidebar(true);
    setTimeout(() => toggleSidebar(false), 1000);
  } else {
    alert("📌 لا يوجد فيديو بعد هذا");
  }
}

function prevVideo() {
  let videos = document.querySelectorAll(".video-item");
  let current = document.querySelector(".video-item.active");
  let currentIndex = Array.from(videos).indexOf(current);
  let prevIndex = currentIndex - 1;

  if (prevIndex >= 0) {
    let prevVideo = videos[prevIndex];
    let videoId = prevVideo.getAttribute("onclick").match(/'(.*?)'/)[1];
    changeVideo(videoId, prevVideo);

    // افتح القائمة ثانية واحدة وبعدين اقفلها
    toggleSidebar(true);
    setTimeout(() => toggleSidebar(false), 1000);
  } else {
    alert("📌 لا يوجد فيديو قبل هذا");
  }
}
function toggleSidebar(force) {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (force === true) {
    // افتح بالقوة
    sidebar.classList.add("active");
    overlay.classList.add("active");
  } else if (force === false) {
    // اقفل بالقوة
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  } else {
    // toggle عادي (زي ما كان عندك)
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
  }
}

function changeVideo(videoId, element) {
  // تحديث مصدر الفيديو الرئيسي
  document.getElementById("mainVideo").src = "https://www.youtube.com/embed/" + videoId;
  
  // إزالة النشاط من جميع العناصر
  const allItems = document.querySelectorAll('.video-item');
  allItems.forEach(item => item.classList.remove('active'));
  
  // إضافة النشاط للعنصر المحدد
  element.classList.add('active');
  
  // تحديث العنوان والوصف بناءً على الفيديو المحدد
  updateVideoInfo(element.querySelector('p').textContent);
  
  // إغلاق القائمة (الوضع العادي)
  toggleSidebar();
}

function updateVideoInfo(title) {
  const header = document.querySelector('.header');
  if (title === "المحاضرة الأولى") {
    header.querySelector('h2').textContent = "المحاضرة الأولى - التيارات الكهربائية";
    header.querySelector('p').textContent = "مدة المحاضرة: أسبوع فقط";
  } else if (title === "الواجب") {
    header.querySelector('h2').textContent = "الواجب العملي";
    header.querySelector('p').textContent = "مدة الواجب: 3 أيام";
  } 
}

// تعديل toggleSidebar عشان تستقبل حالة on/off
function toggleSidebar(force) {
  let sidebar = document.getElementById("sidebar");
  let overlay = document.getElementById("overlay");

  if (force === true) {
    sidebar.classList.add("open");
    overlay.style.display = "block";
  } else if (force === false) {
    sidebar.classList.remove("open");
    overlay.style.display = "none";
  } else {
    // الوضع العادي: toggle
    sidebar.classList.toggle("open");
    overlay.style.display = sidebar.classList.contains("open") ? "block" : "none";
  }
}

toggleSidebar(true);                 // افتح
setTimeout(() => toggleSidebar(false), 500);  // اقفل بعد ثانية