
 const sidebar = document.getElementById('sidebar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const overlay = document.getElementById('overlay');

  // لما تضغط على الزر يفتح أو يقفل الشريط
  mobileMenuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
  });

  // لما تضغط على الـ overlay يقفل
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  });

  // التحكم في ظهور القائمة حسب المقاس
  function handleResize() {
    if (window.innerWidth > 1200) {
      // الكمبيوتر الكبير: تظهر دايمًا
      sidebar.classList.add('active');
      overlay.classList.remove('active');
    } else {
      // الموبايل والتابلت: تبقى مقفولة
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    }
  }

  // أول ما الصفحة تفتح
  handleResize();

  // لما تغير حجم الشاشة
  window.addEventListener('resize', handleResize);


// اسم المفتاح
const studentDataRaw = localStorage.getItem("studentData");

// أكواد الإدمن المسموح لهم يدخلوا أي مكان
const adminIds = ["3479", "9763", "7777"]; // 🔹 غيّر الأرقام دي أو زوّد عليها براحتك

if (!studentDataRaw) {
    // لو مفيش بيانات الطالب
    window.location.href = "https://mr-abdala.vercel.app/login/registr.html";
} else {
    try {
        const student = JSON.parse(studentDataRaw);
        const grade = student.grade?.trim();
        const studentId = student.studentId?.trim();
        const currentURL = window.location.href;

        // لو المستخدم أدمن.. يدخل من غير قيود
        if (adminIds.includes(studentId)) {
            console.log("✅ دخول إداري:", studentId);
            // مفيش أي قيود خالص
        } else {
            // تحقق من الصف الدراسي العادي
            if (grade === "تلتا ثانوي") {
                if (currentURL.includes("/Year-1/") || currentURL.includes("/Year-2/")) {
                    alert("🚫 غير مسموح لطلاب تالتة ثانوي بالدخول على الصفوف الأخرى");
                    window.location.href = "https://mr-abdala.vercel.app/Year-3/";
                }
            } 
            else if (grade === "تانيه ثانوي") {
                if (currentURL.includes("/Year-1/") || currentURL.includes("/Year-3/")) {
                    alert("🚫 غير مسموح لطلاب تانية ثانوي بالدخول على الصفوف الأخرى");
                    window.location.href = "https://mr-abdala.vercel.app/Year-2/";
                }
            } 
            else if (grade === "اولي ثانوي") {
                if (currentURL.includes("/Year-2/") || currentURL.includes("/Year-3/")) {
                    alert("🚫 غير مسموح لطلاب أولى ثانوي بالدخول على الصفوف الأخرى");
                    window.location.href = "https://mr-abdala.vercel.app/Year-1/";
                }
            } 
            else {
                console.warn("⚠️ الصف غير معروف:", grade);
            }
        }
    } catch (error) {
        console.error("❌ حصل خطأ في قراءة بيانات الطالب:", error);
        localStorage.removeItem("studentData");
        window.location.href = "https://mr-abdala.vercel.app/login/registr.html";
    }
}