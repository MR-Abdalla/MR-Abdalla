 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
    import { getFirestore, collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

    const firebaseConfig = {
      apiKey: "AIzaSyBaezH8j4u0Kmum3poYuFk8LsGtVietnSM",
      authDomain: "viduo-corss.firebasestorage.app",
      projectId: "viduo-corss", 
    };
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const userGrade = "2"; // 👈 إشعارات تانية ثانوي

    // عناصر DOM
    const notifBtn = document.getElementById('notifBtn');
    const notifBox = document.getElementById('notifBox');
    const notifDot = document.getElementById('notifDot');
    const notifBody = document.getElementById('notifBody');
    const notifCount = document.getElementById('notifCount');
    const markReadBtn = document.getElementById('markReadBtn');
    const notificationSound = document.getElementById('notificationSound');

    // متغيرات الحالة
    let notifications = [];
    let isBoxOpen = false;

    // تحميل حالة القراءة من localStorage
    function loadReadNotifications() {
      const read = localStorage.getItem('readNotifications');
      return read ? new Set(JSON.parse(read)) : new Set();
    }

    // حفظ حالة القراءة في localStorage
    function saveReadNotifications(readNotifications) {
      localStorage.setItem('readNotifications', JSON.stringify([...readNotifications]));
    }

    // تهيئة حالة القراءة
    let readNotifications = loadReadNotifications();

    // حساب عدد الإشعارات غير المقروءة
    function getUnreadCount() {
      return notifications.filter(notif => !readNotifications.has(notif.id)).length;
    }

    // استعلام Firebase
    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));

    // الاستماع للتحديثات في الوقت الحقيقي
    onSnapshot(q, (snapshot) => {
      const newNotifications = [];
      let hasNewNotifications = false;
      
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.grade === userGrade) {
          const notification = {
            id: doc.id,
            ...data
          };
          newNotifications.push(notification);
          
          // التحقق مما إذا كانت هذه إشعاراً جديداً ولم يتم قراءته
          if (!readNotifications.has(doc.id)) {
            hasNewNotifications = true;
          }
        }
      });
      
      // تحديث حالة الإشعارات
      notifications = newNotifications;
      
      // تحديث العداد إذا كانت هناك إشعارات جديدة غير مقروءة
      const unreadCount = getUnreadCount();
      updateNotificationUI(unreadCount);
      
      if (hasNewNotifications && !isBoxOpen && unreadCount > 0) {
        playNotificationSound();
        showNotificationEffects();
      }
      
      renderNotifications();
    });

    // عرض الإشعارات في الجرس
    function renderNotifications() {
      notifBody.innerHTML = '';
      
      if (notifications.length === 0) {
        notifBody.innerHTML = '<div class="notif-empty">لا توجد إشعارات</div>';
        return;
      }
      
      notifications.forEach((notification, index) => {
        const notifElement = document.createElement('div');
        notifElement.className = 'notif-msg';
        
        // تحديد إذا كانت الإشعار غير مقروء
        const isUnread = !readNotifications.has(notification.id);
        if (isUnread) {
          notifElement.classList.add('new');
        }
        
        // تأخير ظهور الرسائل تدريجياً
        notifElement.style.animationDelay = `${index * 0.1}s`;
        
        const timeText = notification.createdAt ? 
          formatTime(notification.createdAt.toDate()) : 'الآن';
        
        notifElement.innerHTML = `
          <div class="notif-icon">${isUnread ? '🔔' : '📭'}</div>
          <div class="notif-content">
            <div class="notif-text">${notification.message || 'إشعار جديد'}</div>
            ${notification.link ? `<a href="${notification.link}" target="_blank" class="notif-link">📎 فتح الرابط</a>` : ""}
            <div class="notif-time">${timeText}</div>
          </div>
        `;
        
        notifBody.appendChild(notifElement);
      });
    }

    // تحديث واجهة الإشعارات
    function updateNotificationUI(unreadCount) {
      notifDot.textContent = unreadCount > 9 ? '9+' : unreadCount;
      notifDot.style.display = unreadCount > 0 ? 'block' : 'none';
      notifCount.textContent = `${unreadCount} جديد`;
      
      // إضافة أو إزالة تأثير النبض
      if (unreadCount > 0) {
        notifBtn.classList.add('pulse');
      } else {
        notifBtn.classList.remove('pulse');
      }
    }

    // تشغيل صوت الإشعار
    function playNotificationSound() {
      try {
        notificationSound.currentTime = 0;
        notificationSound.play();
      } catch (error) {
        console.log("تعذر تشغيل صوت الإشعار:", error);
      }
    }

    // عرض تأثيرات الإشعار الجديد
    function showNotificationEffects() {
      // اهتزاز الجرس
      notifBtn.classList.add('shake');
      setTimeout(() => {
        notifBtn.classList.remove('shake');
      }, 500);
    }

    // تنسيق الوقت
    function formatTime(date) {
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'الآن';
      if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
      if (diffHours < 24) return `منذ ${diffHours} ساعة`;
      if (diffDays < 7) return `منذ ${diffDays} يوم`;
      
      return date.toLocaleDateString('ar-EG');
    }

    // أحداث النقر
    notifBtn.addEventListener('click', () => {
      isBoxOpen = !isBoxOpen;
      notifBox.style.display = isBoxOpen ? 'block' : 'none';
    });

    markReadBtn.addEventListener('click', () => {
      // إضافة جميع الإشعارات الحالية إلى قائمة المقروء
      notifications.forEach(notif => {
        readNotifications.add(notif.id);
      });
      
      // حفظ حالة القراءة
      saveReadNotifications(readNotifications);
      
      // تحديث الواجهة
      const unreadCount = getUnreadCount();
      updateNotificationUI(unreadCount);
      renderNotifications();
    });

    // إغلاق صندوق الإشعارات عند النقر خارجها
    document.addEventListener('click', (e) => {
      const notifContainer = document.querySelector('.notif-container');
      if (!notifContainer.contains(e.target) && isBoxOpen) {
        notifBox.style.display = 'none';
        isBoxOpen = false;
      }
    });

    // تحديث الواجهة عند التحميل الأولي
    const initialUnreadCount = getUnreadCount();
    updateNotificationUI(initialUnreadCount);