  

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