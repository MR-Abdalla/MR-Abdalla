// Your web app's Firebase configuration
        const firebaseConfig = {
          apiKey: "AIzaSyCPrQEr2OXfcjPyCRb5uT9KQKZjf5aBDg8",
          authDomain: "studint-code.firebaseapp.com",
          projectId: "studint-code",
          storageBucket: "studint-code.firebasestorage.app",
          messagingSenderId: "736980801683",
          appId: "1:736980801683:web:9e7b1f7caf90b39ded5566",
          measurementId: "G-JV9BQ5KTS9"
        };
        
        // Initialize Firebase
        const app = firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();
        const db = firebase.firestore();

        // User data object
        const userData = {
            name: '',
            studentPhone: '',
            parentPhone: '',
            grade: '',
            governorate: '',
            school: '',
            studentId: '',
            password: ''
        };

 function goToGradePage() {
            // Get the saved grade from userData
            const grade = userData.grade;
            
            // Redirect based on the selected grade
            if (grade === 'اولي ثانوي') {
                window.location.href = "https://mr-abdala.pages.dev/Year-1/index.html";
            } else if (grade === 'تنيا ثانوي') {
                window.location.href = "https://mr-abdala.pages.dev/Year-2/index.html";
            } else if (grade === 'تلتا ثانوي') {
                window.location.href = "https://mr-abdala.pages.dev/Year-3/index.html";
            }
        }

        // Select grade function
        function selectGrade(element, grade) {
            document.querySelectorAll('.grade-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            element.classList.add('selected');
            userData.grade = grade;
        }

        // Select governorate function
        function selectGov(element, gov) {
            document.querySelectorAll('.gov-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            element.classList.add('selected');
            userData.governorate = gov;
        }

        // Navigation functions
        let currentStep = 1;
        const steps = ['step1', 'step2', 'step3', 'success-card'];
        
       function nextStep() {
    if (currentStep < steps.length) {
        if (currentStep === 1) {
            userData.name = document.getElementById('student-name').value.trim();
            userData.studentPhone = document.getElementById('student-phone').value.trim();
            userData.parentPhone = document.getElementById('parent-phone').value.trim();

            // Regex تحقق أرقام الهاتف المصرية
            const phoneRegex = /^(010|011|012|015)[0-9]{8}$/;

            if (!userData.name || !userData.studentPhone || !userData.parentPhone || !userData.grade) {
                alert('الرجاء ملء جميع الحقول وتحديد الصف الدراسي');
                return;
            }

            if (!phoneRegex.test(userData.studentPhone)) {
                alert('رقم هاتف الطالب غير صحيح. يجب أن يكون 11 رقم ويبدأ بـ 010 أو 011 أو 012 أو 015');
                return;
            }

            if (!phoneRegex.test(userData.parentPhone)) {
                alert('رقم هاتف ولي الأمر غير صحيح. يجب أن يكون 11 رقم ويبدأ بـ 010 أو 011 أو 012 أو 015');
                return;
            }
        } else if (currentStep === 2) {
            userData.governorate = document.querySelector('.gov-btn.selected')?.getAttribute('onclick').match(/'([^']+)'/)[1];
            userData.school = document.getElementById('school-name').value.trim();

            if (!userData.governorate || !userData.school) {
                alert('الرجاء تحديد المحافظة واسم المدرسة');
                return;
            }
        }

        document.getElementById(steps[currentStep-1]).style.display = 'none';
        currentStep++;
        document.getElementById(steps[currentStep-1]).style.display = 'block';

        updateStepIndicator();
    }
}
        function prevStep() {
            if (currentStep > 1) {
                document.getElementById(steps[currentStep-1]).style.display = 'none';
                currentStep--;
                document.getElementById(steps[currentStep-1]).style.display = 'block';
                
                // Update step indicator
                updateStepIndicator();
            }
        }
        
        function updateStepIndicator() {
            document.querySelectorAll('.step').forEach((step, index) => {
                step.classList.remove('active', 'completed');
                if (index < currentStep - 1) {
                    step.classList.add('completed');
                } else if (index === currentStep - 1) {
                    step.classList.add('active');
                }
            });
            
            document.querySelectorAll('.step-line').forEach((line, index) => {
                line.classList.remove('active');
                if (index < currentStep - 2) {
                    line.classList.add('active');
                }
            });
        }

function generateRandomId() {
    // توليد رقم عشوائي من 4 أرقام (بين 1000 و 9999)
    return Math.floor(1000 + Math.random() * 9000).toString();
}

function register() {
    // توليد ال ID تلقائيا وتعيينه في userData
    userData.studentId = generateRandomId();
    
    // يمكنك تعطيل حقل الإدخال أو إخفائه إذا كنت تريد
    document.getElementById('student-id').value = userData.studentId;
    document.getElementById('student-id').disabled = true;

    userData.password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!userData.password || !confirmPassword) {
        alert('الرجاء ملء جميع الحقول');
        return;
    }

    if (userData.password !== confirmPassword) {
        alert('كلمة المرور غير متطابقة');
        return;
    }

    const email = userData.studentId + '@student.com';

    auth.createUserWithEmailAndPassword(email, userData.password)
        .then((userCredential) => {
             return db.collection('students').doc(userData.studentId).set({
                name: userData.name,
                studentPhone: userData.studentPhone,
                parentPhone: userData.parentPhone,
                grade: userData.grade,
                governorate: userData.governorate,
                school: userData.school,
                studentId: userData.studentId,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
    localStorage.setItem('studentData', JSON.stringify(userData));
    
    // إظهار بطاقة النجاح
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'none';
    document.getElementById('success-name').textContent = userData.name;
    document.getElementById('success-card').style.display = 'block';
    
    // إظهار رسالة بيانات الدخول (جديد)
    showCredentialsAlert(userData.studentId, userData.password);
})
        .catch((error) => {
            alert('حدث خطأ: ' + error.message);
        });
}



// تعيين الـ ID في الحقل بمجرد تحميل الصفحة
window.onload = function() {
    const studentIdField = document.getElementById('student-id');
    const generatedId = generateRandomId();
    studentIdField.value = generatedId;
    
    // تخزين الـ ID في userData (إذا كان كائن userData موجودًا مسبقًا)
    if (typeof userData !== 'undefined') {
        userData.studentId = generatedId;
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const studentIdField = document.getElementById('student-id');
    const generatedId = Math.floor(1000 + Math.random() * 9000).toString();
    studentIdField.value = generatedId;
    
    if (window.userData) {
        userData.studentId = generatedId;
    }
});




        // Show login form
        function showLogin() {
            document.getElementById('success-card').style.display = 'none';
            document.getElementById('login-form').style.display = 'block';
        }

        // Show register form
        function showRegister() {
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('step1').style.display = 'block';
            currentStep = 1;
            updateStepIndicator();
        }


 // Login function
function login() {
    const studentId = document.getElementById('login-id').value;
    const password = document.getElementById('login-password').value;

    if (!studentId || !password) {
        alert('الرجاء إدخال اسم المستخدم وكلمة المرور');
        return;
    }

    const email = studentId + '@student.com';

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            // استخدام studentId بدل UID
            return db.collection("students").doc(studentId).get();
        })
        .then((docSnap) => {
            if (docSnap.exists) {
                const studentData = docSnap.data();

                // حفظ البيانات في localStorage
                localStorage.setItem('studentData', JSON.stringify(studentData));

                // توجيه حسب الصف الدراسي
                const grade = studentData.grade;
                if (grade === 'اولي ثانوي') {
                    window.location.href = "https://mr-abdala.pages.dev/Year-1/index.html";
                } else if (grade === 'تنيا ثانوي') {
                    window.location.href = "https://mr-abdala.pages.dev/Year-2/index.html";
                } else if (grade === 'تلتا ثانوي') {
                    window.location.href = "https://mr-abdala.pages.dev/Year-3/index.html";
                } else {
                    alert("الصف الدراسي غير معروف. يرجى التواصل مع الإدارة.");
                }
            } else {
                alert("لم يتم العثور على بيانات الطالب.");
            }
        })
        .catch((error) => {
            alert('خطأ في تسجيل الدخول: ' + error.message);
        });
}

          function showLoginForm() {
            document.getElementById('step1').style.display = 'none';
            document.getElementById('step2').style.display = 'none';
            document.getElementById('step3').style.display = 'none';
            document.getElementById('success-card').style.display = 'none';
            document.getElementById('login-form').style.display = 'block';
        }


        // دالة لعرض البيانات
function showCredentialsAlert(id, password) {
    document.getElementById('display-id').textContent = id;
    document.getElementById('display-password').textContent = password;
    document.getElementById('credentials-alert').style.display = 'block';
}

// دالة نسخ النص
function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text)
        .then(() => alert("تم النسخ!"))
        .catch(() => alert("فشل النسخ"));
}

// دالة إغلاق التنبيه
function closeAlert() {
    document.getElementById('credentials-alert').style.display = 'none';
}




document.addEventListener("DOMContentLoaded", function () {
    const columns = document.querySelectorAll(".footer-column h4");
    columns.forEach(column => {
        column.addEventListener("click", function () {
            let parent = this.parentElement;
            parent.classList.toggle("open");
        });
    });
});