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

function changeVideo(videoId, element) {
  document.getElementById("mainVideo").src = "https://www.youtube.com/embed/" + videoId;

  // إزالة active من كل العناصر
  let items = document.querySelectorAll(".video-item");
  items.forEach(item => item.classList.remove("active"));

  // إضافة active للي اتضغط عليه أو اللي جاله من next/prev
  element.classList.add("active");
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