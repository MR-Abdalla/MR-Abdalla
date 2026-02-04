    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
    import { 
      getFirestore, collection, getDocs
    } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

    const firebaseConfig = {
      apiKey: "AIzaSyCC5aNDvRjMZFle2tFp3vY6kb74kjVp7Dg",
      authDomain: "subscriptions-f84ee.firebaseapp.com",
      projectId: "subscriptions-f84ee",
      storageBucket: "subscriptions-f84ee.firebasestorage.app",
      messagingSenderId: "425125909485",
      appId: "1:425125909485:web:1dcdf4989d35e5e53c8de4",
      measurementId: "G-B6X1XTLM6Q"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // إدارة القائمة الجانبية
    const sidebar = document.getElementById('sidebar');

  

  

    // تحميل الكورسات
    async function loadCourses() {
      const list = document.getElementById("coursesList");
      
      try {
        const querySnapshot = await getDocs(collection(db, "courses-2"));
        
        // إذا لم يكن هناك كورسات
        if (querySnapshot.empty) {
          list.innerHTML = `
            <div class="no-courses">
              <i class="fas fa-book-open"></i>
              <h3>لا توجد كورسات متاحة حالياً</h3>
              <p>يرجى العودة لاحقاً أو التواصل مع الإدارة لإضافة كورسات جديدة.</p>
            </div>
          `;
          return;
        }
        
        // مسح رسالة التحميل
        list.innerHTML = '';
        
       querySnapshot.forEach(doc => {
  const data = doc.data();
  const courseId = doc.id;
  
  // تنسيق السعر
  const price = data.price ? `${data.price} جنيه` : 'مجاني';
  
  // تنسيق التاريخ
  const date = data.createdAt ? data.createdAt : 'غير محدد';
  
 const formattedDate = new Date(date).toLocaleDateString("ar-EG", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric"
});


  // إنشاء البطاقة
  const courseCard = document.createElement('div');
  courseCard.className = 'course-card';
  courseCard.innerHTML = `
    <div class="course-image">
      <img src="${data.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'}" alt="${data.title || 'صورة الكورس'}">
    </div>
    <div class="course-content">
      <h3 class="course-title">${data.title || 'عنوان الكورس'}</h3>
      <p class="course-description">${data.description || 'وصف الكورس غير متوفر حالياً.'}</p>
      
      <div class="course-meta">
        <div class="course-price">${price}</div>
        <div class="course-date">
          <i class="far fa-calendar-alt"></i> ${formattedDate}
        </div>
      </div>
      
      <button class="course-btn" onclick="openCourse('${courseId}')">
        <i class="fas fa-play-circle"></i> دخول
      </button>
    </div>
  `;
  
  list.appendChild(courseCard);
});

        
      } catch (error) {
        console.error("حدث خطأ في تحميل الكورسات: ", error);
        list.innerHTML = `
          <div class="no-courses">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>حدث خطأ في تحميل الكورسات</h3>
            <p>يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.</p>
          </div>
        `;
      }
    }

    window.openCourse = function(id) {
      window.location.href = "course.html?id=" + id;
    }

    // تحميل الكورسات عند فتح الصفحة
    document.addEventListener('DOMContentLoaded', loadCourses);

const studentData = JSON.parse(localStorage.getItem("studentData"));

if (studentData && studentData.avatar) {
    document.getElementById("userAvatar").src = studentData.avatar;
}
