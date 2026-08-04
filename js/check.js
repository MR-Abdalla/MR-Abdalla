// ===== التحقق من تسجيل الدخول =====
(function checkStudentLogin() {
  // دالة للحصول على بيانات الطالب من localStorage
  function getStudentData() {
    try {
      const data = localStorage.getItem('studentData');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  // دالة لعرض رسالة وإعادة التوجيه
  function redirectToLogin() {
    // إنشاء عنصر overlay للتغطية
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(10px);
      z-index: 999999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'Tajawal', 'Segoe UI', sans-serif;
      color: white;
      padding: 20px;
      animation: fadeIn 0.5s ease;
    `;

    // إضافة أنيميشن
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      @keyframes countDown {
        from { stroke-dashoffset: 283; }
        to { stroke-dashoffset: 0; }
      }
    `;
    document.head.appendChild(style);

    // محتوى الرسالة
    overlay.innerHTML = `
      <div style="text-align: center; max-width: 500px; animation: pulse 2s ease-in-out infinite;">
        <div style="font-size: 5rem; margin-bottom: 20px;">
          <i class="fas fa-user-slash" style="color: #ff6b6b;"></i>
        </div>
        <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 10px; color: #fff;">
          ⚠️ غير مسجل بالمنصة
        </h1>
        <p style="font-size: 1.1rem; color: #aaa; margin-bottom: 30px; line-height: 1.8;">
          يرجى تسجيل الدخول أو إنشاء حساب جديد<br>
          للاستمرار في مشاهدة المحتوى
        </p>
        
        <!-- عداد العد التنازلي -->
        <div style="position: relative; width: 80px; height: 80px; margin: 0 auto 20px;">
          <svg viewBox="0 0 100 100" style="transform: rotate(-90deg); width: 80px; height: 80px;">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#333" stroke-width="6"/>
            <circle cx="50" cy="50" r="45" fill="none" stroke="#ff0000" stroke-width="6"
              stroke-dasharray="283" stroke-dashoffset="0"
              id="countdownCircle"
              style="animation: countDown 5s linear forwards;"/>
          </svg>
          <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.5rem; font-weight: 700; color: #fff;">
            <span id="countdownNumber">5</span>
          </span>
        </div>
        
        <p style="font-size: 0.9rem; color: #666;">
          سيتم توجيهك إلى صفحة التسجيل خلال <span id="countdownText">5</span> ثواني
        </p>
        
        <div style="margin-top: 25px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <a href="https://mr-abdala.vercel.app/" style="
            padding: 12px 30px;
            background: linear-gradient(135deg, #ff0000, #cc0000);
            color: white;
            border: none;
            border-radius: 30px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            text-decoration: none;
            transition: 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            <i class="fas fa-user-plus"></i> إنشاء حساب
          </a>
          <a href="https://mr-abdala.vercel.app/login.html" style="
            padding: 12px 30px;
            background: rgba(255,255,255,0.1);
            color: white;
            border: 2px solid rgba(255,255,255,0.2);
            border-radius: 30px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            text-decoration: none;
            transition: 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          " onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
            <i class="fas fa-sign-in-alt"></i> تسجيل دخول
          </a>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // بدء العد التنازلي
    let seconds = 5;
    const countdownNumber = document.getElementById('countdownNumber');
    const countdownText = document.getElementById('countdownText');

    const timer = setInterval(() => {
      seconds--;
      if (seconds >= 0) {
        countdownNumber.textContent = seconds;
        countdownText.textContent = seconds;
      }
      if (seconds <= 0) {
        clearInterval(timer);
        // التوجيه إلى صفحة إنشاء الحساب
        window.location.href = 'https://mr-abdala.vercel.app/';
      }
    }, 1000);

    // إضافة إمكانية إلغاء العد التنازلي بالضغط على زر
    overlay.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        clearInterval(timer);
      }
    });
  }

  // التحقق من وجود بيانات الطالب
  const studentData = getStudentData();
  
  // إذا لم توجد بيانات الطالب، اعرض الرسالة
  if (!studentData || !studentData.studentId) {
    // ننتظر قليلاً للتأكد من تحميل الصفحة
    if (document.readyState === 'complete') {
      redirectToLogin();
    } else {
      window.addEventListener('load', redirectToLogin);
    }
  }
})();