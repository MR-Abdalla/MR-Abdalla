
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


// متغير لحفظ الرمز الحالي
let currentOTP = null;

// دالة توليد رمز عشوائي
function generateOTP() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // تجنب الأحرف/الأرقام المشابهة (مثل 0/O)
    let otp = '';
    
    for (let i = 0; i < 6; i++) { // رمز من 6 خانات
        otp += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    currentOTP = otp;
    document.getElementById('course-otp').textContent = otp;
    
    // إرسال الرمز إلى السيرفر (إن كنت بحاجة لحفظه)
    saveOTPToServer(otp); // ستقوم بتنفيذ هذه الدالة حسب نظامك
}

// دالة التحقق من الرمز (عند محاولة الدخول للكورس)
function validateOTP(enteredOTP) {
    if (!currentOTP) {
        alert('لم يتم توليد رمز بعد!');
        return false;
    }
    
    if (enteredOTP === currentOTP) {
        generateOTP(); // توليد رمز جديد بعد الاستخدام
        return true;
    } else {
        alert('رمز غير صحيح!');
        return false;
    }
}

// مثال لربطها بزر الدخول (تعديل HTML السابق)
document.querySelector('.btn-access').addEventListener('click', function(e) {
    e.preventDefault();
    const userOTP = prompt('أدخل رمز الدخول:');
    if (validateOTP(userOTP)) {
        window.location.href = "رابط_الكورس_الحقيقي";
    }
});

