        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyB2Mqw0khgC17QEfvhLgw7RM40eSYHh-yA",
            authDomain: "abdalla-elsayd.firebaseapp.com",
            projectId: "abdalla-elsayd",
            storageBucket: "abdalla-elsayd.appspot.com",
            messagingSenderId: "419918533531",
            appId: "1:419918533531:web:a65d365cac57246872473e",
            measurementId: "G-946RK4Y853"
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
                window.location.href = "first-grade.html";
            } else if (grade === 'تنيا ثانوي') {
                window.location.href = "second-grade.html";
            } else if (grade === 'تلتا ثانوي') {
                window.location.href = "third-grade.html";
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
                // Validate current step before proceeding
                if (currentStep === 1) {
                    userData.name = document.getElementById('student-name').value;
                    userData.studentPhone = document.getElementById('student-phone').value;
                    userData.parentPhone = document.getElementById('parent-phone').value;
                    
                    if (!userData.name || !userData.studentPhone || !userData.parentPhone || !userData.grade) {
                        alert('الرجاء ملء جميع الحقول وتحديد الصف الدراسي');
                        return;
                    }
                } else if (currentStep === 2) {
                    userData.governorate = document.querySelector('.gov-btn.selected')?.getAttribute('onclick').match(/'([^']+)'/)[1];
                    userData.school = document.getElementById('school-name').value;
                    
                    if (!userData.governorate || !userData.school) {
                        alert('الرجاء تحديد المحافظة واسم المدرسة');
                        return;
                    }
                }
                
                document.getElementById(steps[currentStep-1]).style.display = 'none';
                currentStep++;
                document.getElementById(steps[currentStep-1]).style.display = 'block';
                
                // Update step indicator
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

function register() {
    userData.studentId = document.getElementById('student-id').value;
    userData.password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!userData.studentId || !userData.password || !confirmPassword) {
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
            return db.collection('students').doc(userCredential.user.uid).set({
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
            // ✅ حفظ البيانات في Local Storage
            localStorage.setItem('studentData', JSON.stringify(userData));

            // ✅ إظهار بطاقة النجاح
            document.getElementById('step1').style.display = 'none';
            document.getElementById('step2').style.display = 'none';
            document.getElementById('step3').style.display = 'none';

            document.getElementById('success-name').textContent = userData.name;
            document.getElementById('success-card').style.display = 'block';
        })
        .catch((error) => {
            alert('ID مستخدم بالفعل');
        });
}


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
        .then((userCredential) => {
            const uid = userCredential.user.uid;

            // الآن نحصل على بيانات الطالب من Firestore
            return db.collection("students").doc(uid).get();
        })
        .then((docSnap) => {
            if (docSnap.exists) {
                const studentData = docSnap.data();
                const grade = studentData.grade;

                // توجيه حسب الصف الدراسي
                if (grade === 'اولي ثانوي') {
                    window.location.href = "first-grade.html";
                } else if (grade === 'تنيا ثانوي') {
                    window.location.href = "second-grade.html";
                } else if (grade === 'تلتا ثانوي') {
                    window.location.href = "third-grade.html";
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

