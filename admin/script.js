// تكوين Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB2Mqw0khgC17QEfvhLgw7RM40eSYHh-yA",
    authDomain: "abdalla-elsayd.firebaseapp.com",
    projectId: "abdalla-elsayd",
    storageBucket: "abdalla-elsayd.appspot.com",
    messagingSenderId: "419918533531",
    appId: "1:419918533531:web:a65d365cac57246872473e",
    measurementId: "G-946RK4Y853"
};

// تهيئة Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// دالة تنسيق التاريخ
function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('ar-EG', options);
}

// تحميل بيانات الطالب عند فتح الصفحة
document.addEventListener('DOMContentLoaded', async function() {
    // التحقق من تسجيل الدخول
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            try {
                // جلب بيانات الطالب من Firestore
                const docRef = db.collection("students").doc(user.uid);
                const docSnap = await docRef.get();
                
                if (docSnap.exists) {
                    const studentData = docSnap.data();
                    displayStudentData(studentData);
                    
                    // تحديث وقت آخر دخول
                    await docRef.update({
                        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                    });
                } else {
                    alert("لو مش مسجل خش سجل");
                    window.location.href = "https://mr-abdala.pages.dev/login/index.html";
                }
            } catch (error) {
                console.error("Error loading student data:", error);
                alert("حدث خطأ أثناء تحميل البيانات. يرجى المحاولة لاحقاً.");
            }
        } 
    });
    
    // إضافة حدث لتسجيل الخروج
    document.getElementById('logout-btn').addEventListener('click', logout);
});

// عرض بيانات الطالب
function displayStudentData(data) {
    // المعلومات الأساسية
    document.getElementById('student-name').textContent = data.name || 'غير محدد';
    document.getElementById('student-grade').textContent = data.grade || 'غير محدد';
    document.getElementById('student-id').textContent = `ID: ${data.studentId || 'غير محدد'}`;
    document.getElementById('student-id-full').textContent = data.studentId || 'غير محدد';
    document.getElementById('student-governorate').textContent = data.governorate || 'غير محدد';
    document.getElementById('student-school').textContent = data.school || 'غير محدد';
    document.getElementById('student-phone').textContent = data.studentPhone || 'غير محدد';
    document.getElementById('parent-phone').textContent = data.parentPhone || 'غير محدد';
    
    // تنسيق الصف الدراسي
    const gradeMap = {
        'اولي ثانوي': 'الصف الأول الثانوي',
        'تنيا ثانوي': 'الصف الثاني الثانوي',
        'تلتا ثانوي': 'الصف الثالث الثانوي'
    };
    document.getElementById('student-grade-full').textContent = gradeMap[data.grade] || data.grade || 'غير محدد';
    
    // تحديث وقت آخر دخول
    const lastLogin = data.lastLogin ? new Date(data.lastLogin.toDate()) : new Date();
    document.getElementById('last-login').textContent = formatDate(lastLogin);
    
    // توجيه زر المنصة التعليمية حسب الصف الدراسي
    const platformBtn = document.getElementById('platform-btn');
    if (data.grade === 'اولي ثانوي') {
        platformBtn.addEventListener('click', () => window.location.href = "https://mr-abdala.pages.dev/Year-1/index.html");
    } else if (data.grade === 'تنيا ثانوي') {
        platformBtn.addEventListener('click', () => window.location.href = "https://mr-abdala.pages.dev/Year-2/index.html");
    } else if (data.grade === 'تلتا ثانوي') {
        platformBtn.addEventListener('click', () => window.location.href = "https://mr-abdala.pages.dev/Year-3/index.html");
    }
}

// تسجيل الخروج
function logout() {
    auth.signOut().then(() => {
        window.location.href = "login.html";
    }).catch((error) => {
        alert("حدث خطأ أثناء تسجيل الخروج. يرجى المحاولة مرة أخرى.");
        console.error("Logout error:", error);
    });
}