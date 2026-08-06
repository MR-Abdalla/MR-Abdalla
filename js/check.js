        // ============================================
// التحقق التلقائي - localStorage + Firebase
// ============================================
document.addEventListener("DOMContentLoaded", async function () {
    // ====== 1. التحقق من localStorage ======
    let data = null;
    
    try {
        const storedData = localStorage.getItem("studentData");
        if (storedData) {
            data = JSON.parse(storedData);
        }
    } catch (error) {
        console.warn("❌ خطأ في قراءة localStorage:", error);
    }

    // ====== 2. إذا كانت البيانات موجودة ======
    if (data && data.grade) {
        const grade = data.grade.trim().toLowerCase();
        console.log("📚 الصف المسترجع من localStorage:", grade);
        console.log("👤 الطالب:", data.name || "غير معروف");
        
        // التوجيه حسب الصف
        redirectToGrade(grade, data.studentId);
        return;
    }

    // ====== 3. إذا لم توجد في localStorage، نتحقق من Firebase ======
    const studentId = localStorage.getItem("studentId");
    
    if (studentId) {
        console.log("🆔 يوجد studentId في localStorage:", studentId);
        
        try {
            // تهيئة Firebase (إذا لم تكن موجودة)
            if (typeof firebase === 'undefined') {
                console.warn("⚠️ Firebase غير محمل، تخطي التحقق من السحاب");
                window.location.href = "/login/";
                return;
            }
            
            // جلب البيانات من Firebase
            const db = firebase.firestore();
            const docRef = db.collection("students").doc(studentId);
            const doc = await docRef.get();
            
            if (doc.exists) {
                const firebaseData = doc.data();
                console.log("☁️ تم جلب البيانات من Firebase:", firebaseData.name);
                
                // حفظ في localStorage للاستخدام المستقبلي
                localStorage.setItem("studentData", JSON.stringify(firebaseData));
                
                // التوجيه حسب الصف
                if (firebaseData.grade) {
                    redirectToGrade(firebaseData.grade, studentId);
                    return;
                }
            } else {
                console.warn("⚠️ لم يتم العثور على الطالب في Firebase");
            }
        } catch (error) {
            console.error("❌ خطأ في جلب البيانات من Firebase:", error);
        }
        
        // إذا فشل كل شيء، نوجه لتسجيل الدخول
        window.location.href = "/login/";
    } else {
        // لا يوجد بيانات نهائياً → صفحة التسجيل
        console.log("❌ لا يوجد بيانات طالب. التوجيه للتسجيل.");
        window.location.href = "/registr/";
    }
});

// ============================================
// دالة التوجيه حسب الصف
// ============================================
function redirectToGrade(grade, studentId) {
    const gradeLower = grade.trim().toLowerCase();
    let url = "";
   
    if (gradeLower.includes("ثانية") || gradeLower.includes("تاني") || gradeLower.includes("تنيا")) {
        url = "/Year-2/";
    } else if (gradeLower.includes("ثالثة") || gradeLower.includes("تالت") || gradeLower.includes("تلتا")) {
        url = "/Year-3/";
    } else {
        console.warn("⚠️ مرحلة غير معروفة:", grade);
        url = "https://mr-abdala.vercel.app/";
    }
    
    // إضافة معرف الطالب للرابط إذا كان موجوداً
    if (studentId) {
        url += `?studentId=${studentId}`;
    }
    
    console.log("🚀 التوجيه إلى:", url);
    window.location.href = url;
}