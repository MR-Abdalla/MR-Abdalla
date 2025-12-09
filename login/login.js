   // تهيئة Firebase
        const firebaseConfig = {
            apiKey: "AIzaSyCPrQEr2OXfcjPyCRb5uT9KQKZjf5aBDg8",
            authDomain: "studint-code.firebaseapp.com",
            projectId: "studint-code",
            storageBucket: "studint-code.firebasestorage.app",
            messagingSenderId: "736980801683",
            appId: "1:736980801683:web:9e7b1f7caf90b39ded5566",
            measurementId: "G-JV9BQ5KTS9"
        };
        
        const app = firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();
        const db = firebase.firestore();

        // دوال عرض الرسائل
        function showError(message) {
            const errorAlert = document.getElementById('error-alert');
            const errorMessage = document.getElementById('error-message');
            
            errorMessage.textContent = message;
            errorAlert.style.display = 'block';
            document.getElementById('success-alert').style.display = 'none';
            
            setTimeout(() => {
                errorAlert.style.display = 'none';
            }, 5000);
        }
        
        function showSuccess(message) {
            const successAlert = document.getElementById('success-alert');
            const successMessage = document.getElementById('success-message');
            
            successMessage.textContent = message;
            successAlert.style.display = 'block';
            document.getElementById('error-alert').style.display = 'none';
            
            setTimeout(() => {
                successAlert.style.display = 'none';
            }, 3000);
        }
        
        function showDebugInfo(info) {
            const debugInfo = document.getElementById('debug-info');
            const debugContent = document.getElementById('debug-content');
            
            debugContent.textContent = info;
            debugInfo.style.display = 'block';
        }

        // دالة تسجيل الدخول المحسنة
        async function login() {
            const studentId = document.getElementById('login-id').value.trim();
            const password = document.getElementById('login-password').value;
            
            if (!studentId || !password) {
                showError('الرجاء إدخال الرقم التعريفي وكلمة المرور');
                return;
            }

            const loginBtn = document.getElementById('login-btn');
            const btnText = document.getElementById('btn-text');
            const btnLoading = document.getElementById('btn-loading');
            
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            loginBtn.disabled = true;

            try {
                const email = studentId + '@student.com';
                const userCredential = await auth.signInWithEmailAndPassword(email, password);

                const studentRef = db.collection("students").doc(studentId);
                const studentSnap = await studentRef.get();

                if (!studentSnap.exists) {
                    throw new Error("لم يتم العثور على بيانات الطالب");
                }

                const studentData = studentSnap.data();

                // 🔍 معلومات الجهاز
                const deviceInfo = {
                    deviceId: navigator.userAgent + "_" + navigator.platform,
                    deviceName: navigator.platform,
                    userAgent: navigator.userAgent,
                    deviceType: /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
                    loginTime: new Date().toLocaleString()
                };

                // 🧠 جلب IP
                const ipData = await fetch("https://api.ipify.org?format=json").then(r => r.json());
                deviceInfo.ip = ipData.ip;

                // 📍 جلب الموقع
                const location = await getLocation();

                // دخول مباشر بدون أي تحقق جهاز
            localStorage.setItem('studentData', JSON.stringify(studentData));
            showSuccess("تم تسجيل الدخول بنجاح!");
            setTimeout(() => redirectToGradePage(studentData), 2000);

               } catch (error) {
                   handleLoginError(error);
               } finally {
                      resetLoginButton();
                } 
             } 

        // 📍 تحديد الموقع
        async function getLocation() {
            return new Promise(resolve => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
                        () => resolve({ lat: null, lon: null }),
                        { enableHighAccuracy: true }
                    );
                } else {
                    resolve({ lat: null, lon: null });
                }
            });
        }

        // معالجة أخطاء التسجيل
        function handleLoginError(error) {
            let errorMessage = 'حدث خطأ أثناء تسجيل الدخول';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'لم يتم العثور على حساب بهذا الرقم التعريفي';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'كلمة المرور غير صحيحة';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'الرقم التعريفي غير صحيح';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'محاولات تسجيل دخول كثيرة، حاول لاحقاً';
                    break;
                default:
                    errorMessage = error.message || 'خطأ غير معروف';
            }
            
            showError(errorMessage);
            showDebugInfo('خطأ في كلمة السر أو ال ID');
        }

        // التوجيه إلى الصفحة حسب الصف
        function redirectToGradePage(studentData) {
            if (studentData && studentData.grade) {
                const grade = studentData.grade.trim().toLowerCase();
                let redirectUrl = '';

                if (grade.includes('اولي') || grade.includes('أولى')) {
                    redirectUrl = 'https://mr-abdala.vercel.app/Year-1/index.html';
                } else if (grade.includes('ثانية') || grade.includes('تاني') || grade.includes('تنيا')) {
                    redirectUrl = 'https://mr-abdala.vercel.app/Year-2/index.html';
                } else if (grade.includes('ثالثة') || grade.includes('تالت') || grade.includes('تلتا')) {
                    redirectUrl = 'https://mr-abdala.vercel.app/Year-3/index.html';
                } else {
                    console.warn('مرحلة غير معروفة:', grade);
                    return;
                }

                window.location.href = redirectUrl;
            }
        }

        // دوال مساعدة
        function resetLoginButton() {
            const loginBtn = document.getElementById('login-btn');
            const btnText = document.getElementById('btn-text');
            const btnLoading = document.getElementById('btn-loading');
            
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            loginBtn.disabled = false;
        }

        function displayStoredData(studentData) {
            const previewContent = document.getElementById('preview-content');
            const dataPreview = document.getElementById('data-preview');
            
            let html = '';
            for (const key in studentData) {
                if (studentData.hasOwnProperty(key)) {
                    html += `
                        <div class="data-item">
                            <span class="data-label">${key}:</span>
                            <span>${studentData[key]}</span>
                        </div>
                    `;
                }
            }
            
            previewContent.innerHTML = html;
            dataPreview.style.display = 'block';
        }

        function showForgotPassword() {
            const studentId = document.getElementById('login-id').value.trim();
            
            if (!studentId) {
                showError('الرجاء إدخال الرقم التعريفي لاستعادة كلمة المرور');
                return;
            }
            
            const email = studentId + '@student.com';
            
            auth.sendPasswordResetEmail(email)
                .then(() => {
                    showSuccess('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني');
                })
                .catch((error) => {
                    showError('حدث خطأ أثناء إرسال رابط الاستعادة: ' + error.message);
                });
        }

        // تهيئة الأحداث عند تحميل الصفحة
        document.addEventListener('DOMContentLoaded', function() {
            // إضافة event listeners
            document.getElementById('login-btn').addEventListener('click', login);
            
            // تفعيل Enter لتسجيل الدخول
            document.getElementById('login-password').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    login();
                }
            });

            // التحقق من وجود بيانات مسجلة مسبقاً
            const storedData = localStorage.getItem('studentData');
            if (storedData) {
                try {
                    const studentData = JSON.parse(storedData);
                    displayStoredData(studentData);
                } catch (e) {
                    console.error('خطأ في تحليل البيانات المخزنة:', e);
                }
            }
        });