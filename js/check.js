// ============================================
// التحقق التلقائي - localStorage + Firebase
// ============================================
document.addEventListener("DOMContentLoaded", async function () {
    // ====== 1. التحقق من localStorage ======
    let studentData = null;
    
    try {
        const stored = localStorage.getItem("studentData");
        if (stored) {
            studentData = JSON.parse(stored);
            console.log("📚 بيانات من localStorage:", studentData.name);
        }
    } catch (error) {
        console.warn("❌ خطأ في localStorage:", error);
    }

    // ====== 2. إذا كانت البيانات موجودة ======
    if (studentData && studentData.grade) {
        goToGradePage(studentData.grade, studentData.studentId);
        return;
    }

    // ====== 3. إذا لم توجد في localStorage، نتحقق من Firebase ======
    const studentId = localStorage.getItem("studentId");
    
    if (studentId) {
        console.log("🆔 studentId موجود:", studentId);
        
        try {
            // التحقق من وجود Firebase
            if (typeof firebase === 'undefined' || !firebase.firestore) {
                console.warn("⚠️ Firebase غير محمل");
                window.location.href = "/login/";
                return;
            }
            
            const db = firebase.firestore();
            const doc = await db.collection("students").doc(studentId).get();
            
            if (doc.exists) {
                const data = doc.data();
                console.log("☁️ بيانات من Firebase:", data.name);
                
                // حفظ في localStorage
                localStorage.setItem("studentData", JSON.stringify(data));
                
                if (data.grade) {
                    goToGradePage(data.grade, studentId);
                    return;
                }
            }
        } catch (error) {
            console.error("❌ خطأ Firebase:", error);
        }
        
        // فشل → تسجيل الدخول
        window.location.href = "/login/";
    } else {
        // لا بيانات → تسجيل
        console.log("❌ لا بيانات، التوجيه للتسجيل");
        window.location.href = "/registr/";
    }
});

// ============================================
// دالة التوجيه حسب الصف - مسارات صحيحة
// ============================================
function goToGradePage(grade, studentId) {
    const gradeMap = {
        'أولي بكالوريا': '/Year-1/',
        'تانية بكالوريا': '/Year-ba/',
        'تانية ثانوي أزهر': '/Year-az/',
        'تالتة ثانوي': '/Year-3/',
        'تلتا ثانوي': '/Year-3/',
        'ثالثة ثانوي': '/Year-3/'
    };

    // تنظيف اسم الصف
    const cleanGrade = grade?.trim() || '';
    let url = gradeMap[cleanGrade] || 'https://mr-abdala.vercel.app/';

    // إضافة studentId إذا كان موجوداً
    if (studentId) {
        // إزالة علامة الاستفهام إذا كانت موجودة في الرابط
        if (url.includes('?')) {
            url += `&studentId=${studentId}`;
        } else {
            url += `?studentId=${studentId}`;
        }
    }

    console.log("🚀 التوجيه إلى:", url);
    window.location.href = url;
}