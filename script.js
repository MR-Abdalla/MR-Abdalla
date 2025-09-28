
        // تفعيل القائمة المنسدلة عند النقر على أيقونة القائمة
document.getElementById('menuToggle').addEventListener('click', function() {
    this.classList.toggle('active');
});



document.addEventListener("DOMContentLoaded", function () {
    const columns = document.querySelectorAll(".footer-column h4");
    columns.forEach(column => {
        column.addEventListener("click", function () {
            let parent = this.parentElement;
            parent.classList.toggle("open");
        });
    });
});




        
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 10,
    loop: true,
    autoplay: {
        delay: 3500, // تغيير كل 3 ثوانٍ
        disableOnInteraction: false, // يستمر في العمل بعد التفاعل
    },
    speed: 2000, // سرعة التبديل
    });
    
    swiper.on('slideChangeTransitionStart', function () {
    var activeSlide = document.querySelector('.swiper-slide-active .overlay');
    if (activeSlide) {
        activeSlide.style.opacity = '0';
        activeSlide.style.transition = 'opacity 0.5s ease-in-out';
    }
    });
    
    swiper.on('slideChangeTransitionEnd', function () {
    var activeSlide = document.querySelector('.swiper-slide-active .overlay');
    if (activeSlide) {
        activeSlide.style.opacity = '1';
        activeSlide.style.transition = 'opacity 0.5s ease-in-out';
    }
    });
    
    // Adjust image sources for mobile devices
    swiper.on('init', function () {
    var slides = document.querySelectorAll('.swiper-slide picture source');
    slides.forEach(function (slide) {
        if (window.innerWidth <= 767) {
            slide.srcset = slide.srcset.replace('img-', 'image-small');
        }
    });
    });
    
    swiper.init();


  function loadActivatedCourses() {
    const list = document.getElementById('myCoursesList');
    list.innerHTML = ''; // تفريغ القائمة

    const data = localStorage.getItem('activatedCourses');
    if (!data) {
      list.innerHTML = '<li>لا توجد كورسات مفعّلة</li>';
      return;
    }

    try {
      const activatedCourses = JSON.parse(data);
      const courseNames = Object.keys(activatedCourses);

      if (courseNames.length === 0) {
        list.innerHTML = '<li>لا توجد كورسات مفعّلة</li>';
        return;
      }

      courseNames.forEach(courseName => {
        const courseObj = activatedCourses[courseName]; // {link, expiry}

        // نتأكد إن الكورس لسه صالح
        if (Date.now() < courseObj.expiry) {
          const li = document.createElement('li');
          const a = document.createElement('a');

          a.href = courseObj.link;       // استخدم الرابط المخزن
          a.textContent = courseName;    // اسم الكورس
          a.target = "_blank";           // يفتح في صفحة جديدة
          a.style.textDecoration = 'none';
          a.style.color = '#333';

          li.appendChild(a);
          list.appendChild(li);
        }
      });
    } catch (err) {
      console.error('خطأ في قراءة activatedCourses:', err);
      list.innerHTML = '<li>حدث خطأ في تحميل الكورسات</li>';
    }
  }

  // تحميل الكورسات عند فتح الصفحة
  window.onload = loadActivatedCourses;