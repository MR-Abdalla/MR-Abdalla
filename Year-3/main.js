import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    query, 
    where, 
    orderBy,
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// إعداد Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBaezH8j4u0Kmum3poYuFk8LsGtVietnSM",
    authDomain: "viduo-corss.firebaseapp.com",
    projectId: "viduo-corss",
    storageBucket: "viduo-corss.firebasestorage.app",
    messagingSenderId: "485896854659",
    appId: "1:485896854659:web:f0a618235eb4d9e9784fb6",
    measurementId: "G-SVB0WMS9MW"
};
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // === إدارة الحالة العامة ===
        const state = {
            currentTab: 'all',
            currentFilter: 'all',
            savedVideos: JSON.parse(localStorage.getItem('savedVideos')) || [],
            allVideos: [],
            studentData: JSON.parse(localStorage.getItem('studentData')) || {
                name: " ",
                studentId: "",
                grade: "3",
                school: "",
                governorate: ""
            },
            notifications: [],
            readNotifications: JSON.parse(localStorage.getItem('readNotifications')) || []
        };

        // === عناصر DOM ===
        // نظام الفيديوهات
        const videosGrid = document.getElementById("videosGrid");
        const savedCount = document.getElementById("savedCount");
        const pageTitle = document.getElementById("pageTitle");
        const studentInfo = document.getElementById("studentInfo");
        const userName = document.getElementById("userName");
        
        // نظام الإشعارات
        const notifBtn = document.getElementById('notifBtn');
        const notifBox = document.getElementById('notifBox');
        const notifDot = document.getElementById('notifDot');
        const notifBody = document.getElementById('notifBody');
        const notifCount = document.getElementById('notifCount');
        const markReadBtn = document.getElementById('markReadBtn');
        const notificationSound = document.getElementById('notificationSound');

        // === دوال نظام الفيديوهات ===
        
        function loadStudentData() {
            if (state.studentData) {
                studentInfo.innerHTML = `
                    <div class="student-name">${state.studentData.name}</div>
                    <div class="student-details">
                        <div> الكود: ${state.studentData.studentId}</div>
                        <div>الصف: ${state.studentData.grade}</div>
                        <div>المدرسة: ${state.studentData.school}</div>
                        <div>المحافظة: ${state.studentData.governorate}</div>
                    </div>
                `;
                
                userName.textContent = state.studentData.name;
            }
        }

        function getYoutubeId(url){
            const reg = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
            const m = url.match(reg);
            return (m && m[2].length===11) ? m[2] : null;
        }

        function toggleSaveVideo(videoId) {
            const index = state.savedVideos.indexOf(videoId);
            
            if (index === -1) {
                state.savedVideos.push(videoId);
            } else {
                state.savedVideos.splice(index, 1);
            }
            
            localStorage.setItem('savedVideos', JSON.stringify(state.savedVideos));
            updateSavedCount();
            renderVideos();
        }

        function updateSavedCount() {
            savedCount.textContent = state.savedVideos.length;
        }

        function extractNumberFromId(id) {
            const matches = id.match(/\d+/g);
            if (matches && matches.length > 0) {
                return parseInt(matches[0]);
            }
            return 0;
        }

        function renderVideos() {
            let videosToShow = [];
            
            if (state.currentTab === 'saved') {
                videosToShow = state.allVideos.filter(video => 
                    state.savedVideos.includes(video.id)
                );
            } else if (state.currentTab === 'all') {
                videosToShow = state.allVideos;
            } else {
                videosToShow = state.allVideos.filter(video => 
                    video.category === state.currentTab
                );
            }

            videosToShow.sort((a, b) => {
                const numA = extractNumberFromId(a.id);
                const numB = extractNumberFromId(b.id);
                return numA - numB;
            });
            
            if (videosToShow.length === 0) {
                videosGrid.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-video-slash"></i>
                        <p>${state.currentTab === 'saved' ? 'لا توجد فيديوهات محفوظة' : 'لا توجد فيديوهات متاحة'}</p>
                    </div>
                `;
                return;
            }
            
            videosGrid.innerHTML = '';
            
            videosToShow.forEach(video => {
                const isSaved = state.savedVideos.includes(video.id);
                const yId = getYoutubeId(video.link);
                const thumb = video.image && video.image.trim() !== "" 
                    ? video.image 
                    : (yId ? `https://img.youtube.com/vi/${yId}/hqdefault.jpg` : "");
                
                const card = document.createElement("div");
                card.className = `video-card ${isSaved ? 'saved' : ''}`;
                card.innerHTML = `
                    <div class="thumbnail-container">
                        ${thumb ? `<img src="${thumb}" class="thumbnail">` : 
                        `<div class="thumb-placeholder">
                            <i class="fas fa-play-circle"></i>
                        </div>`}
                    </div>

                    <div class="video-info">
                        <h3 class="video-title">${video.title}</h3>
                        <p class="video-desc">${video.description || "لا يوجد وصف متاح"}</p>
                        <button class="show-more">عرض المزيد</button>

                        <div class="video-actions">
                            <a href="subscribe.html?videoId=${video.id}" class="action-btn btn-primary">
                                <i class="fas fa-play"></i>
                                تشغيل
                            </a>
                            <button class="action-btn btn-secondary ${isSaved ? 'saved' : ''}" data-id="${video.id}">
                                <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i>
                                ${isSaved ? 'محفوظ' : 'حفظ'}
                            </button>
                        </div>
                    </div>
                `;

                card.querySelector(".show-more").addEventListener("click", function() {
                    const desc = card.querySelector(".video-desc");
                    if (desc.classList.contains("expanded")) {
                        desc.classList.remove("expanded");
                        this.textContent = "عرض المزيد";
                    } else {
                        desc.classList.add("expanded");
                        this.textContent = "عرض أقل";
                    }
                });

                videosGrid.appendChild(card);
            });

            document.querySelectorAll(".btn-secondary").forEach(btn => {
                btn.addEventListener("click", () => {
                    const videoId = btn.dataset.id;
                    toggleSaveVideo(videoId);
                });
            });
        }

        async function loadVideos(){
            try {
                const snap = await getDocs(query(
                    collection(db,"videos"),
                    where("grade","==","3")
                ));
                
                if (snap.empty) {
                    videosGrid.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-video-slash"></i>
                            <p>لا توجد فيديوهات متاحة حالياً</p>
                        </div>
                    `;
                    return;
                }
                
                state.allVideos = [];
                
                snap.forEach(docSnap => {
                    const v = docSnap.data();
                    const id = docSnap.id;

                    const date = v.timestamp?.toDate ? v.timestamp.toDate() : new Date();
                    const formattedDate = date.toLocaleDateString('ar-EG');
                    
                    state.allVideos.push({
                        id: id,
                        title: v.title,
                        description: v.description || "لا يوجد وصف متاح",
                        link: v.link,
                        image: v.image,
                        date: formattedDate,
                        category: v.category || 'physics',
                        duration: v.duration || '10:30',
                        views: Math.floor(Math.random() * 500) + 100
                    });
                });

                state.allVideos.sort((a, b) => {
                    const numA = extractNumberFromId(a.id);
                    const numB = extractNumberFromId(b.id);
                    return numA - numB;
                });
                
                updateSavedCount();
                renderVideos();
                
            } catch (error) {
                console.error("Error loading videos: ", error);
                videosGrid.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>حدث خطأ في تحميل الفيديوهات</p>
                    </div>
                `;
            }
        }

        // === دوال نظام الإشعارات ===

        function getUnreadCount() {
            return state.notifications.filter(notif => 
                !state.readNotifications.includes(notif.id)
            ).length;
        }

        function updateNotificationUI() {
            const unreadCount = getUnreadCount();
            notifDot.textContent = unreadCount > 9 ? '9+' : unreadCount;
            notifDot.style.display = unreadCount > 0 ? 'block' : 'none';
            notifCount.textContent = `${unreadCount} جديد`;
            
            if (unreadCount > 0) {
                notifBtn.classList.add('pulse');
            } else {
                notifBtn.classList.remove('pulse');
            }
        }

        function renderNotifications() {
            notifBody.innerHTML = '';
            
            if (state.notifications.length === 0) {
                notifBody.innerHTML = '<div class="notif-empty">لا توجد إشعارات</div>';
                return;
            }
            
            state.notifications.forEach((notification, index) => {
                const notifElement = document.createElement('div');
                notifElement.className = 'notif-msg';
                
                const isUnread = !state.readNotifications.includes(notification.id);
                if (isUnread) {
                    notifElement.classList.add('new');
                }
                
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

        function playNotificationSound() {
            try {
                notificationSound.currentTime = 0;
                notificationSound.play();
            } catch (error) {
                console.log("تعذر تشغيل صوت الإشعار:", error);
            }
        }

        function showNotificationEffects() {
            notifBtn.classList.add('shake');
            setTimeout(() => {
                notifBtn.classList.remove('shake');
            }, 500);
        }

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

        // === الأحداث والمستمعين ===

        // البحث
        document.querySelector('.search-input').addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.video-card');
            
            cards.forEach(card => {
                const title = card.querySelector('.video-title').textContent.toLowerCase();
                card.style.display = title.includes(searchTerm) ? 'block' : 'none';
            });
        });

        // تغيير التبويبات
        document.querySelectorAll('.nav-link[data-tab]').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                
                document.querySelectorAll('.nav-link').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                state.currentTab = tab.dataset.tab;
                pageTitle.textContent = 
                    state.currentTab === 'saved' ? 'الفيديوهات المحفوظة' : 
                    state.currentTab === 'physics' ? 'محاضرات الفيزياء' :
                    state.currentTab === 'math' ? 'محاضرات الرياضيات' : 'جميع المحاضرات';
                
                renderVideos();
            });
        });

        // نظام الإشعارات
        let isBoxOpen = false;

        notifBtn.addEventListener('click', () => {
            isBoxOpen = !isBoxOpen;
            notifBox.style.display = isBoxOpen ? 'block' : 'none';
        });

        markReadBtn.addEventListener('click', () => {
            state.notifications.forEach(notif => {
                if (!state.readNotifications.includes(notif.id)) {
                    state.readNotifications.push(notif.id);
                }
            });
            
            localStorage.setItem('readNotifications', JSON.stringify(state.readNotifications));
            updateNotificationUI();
            renderNotifications();
        });

        document.addEventListener('click', (e) => {
            const notifContainer = document.querySelector('.notif-container');
            if (!notifContainer.contains(e.target) && isBoxOpen) {
                notifBox.style.display = 'none';
                isBoxOpen = false;
            }
        });

        // === التحميل الأولي ===

        // تحميل الفيديوهات
        loadStudentData();
        loadVideos();

        // تحميل الإشعارات
        const notifQuery = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
        
        onSnapshot(notifQuery, (snapshot) => {
            const newNotifications = [];
            let hasNewNotifications = false;
            
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.grade === "3") { // إشعارات الصف الثالث
                    const notification = {
                        id: doc.id,
                        ...data
                    };
                    newNotifications.push(notification);
                    
                    if (!state.readNotifications.includes(doc.id)) {
                        hasNewNotifications = true;
                    }
                }
            });
            
            state.notifications = newNotifications;
            const unreadCount = getUnreadCount();
            updateNotificationUI();
            
            if (hasNewNotifications && !isBoxOpen && unreadCount > 0) {
                playNotificationSound();
                showNotificationEffects();
            }
            
            renderNotifications();
        });

        // === نظام تحديث الصفحة التلقائي ===
        let leaveTime = null;

        window.addEventListener("blur", () => {
            leaveTime = Date.now();
        });

        window.addEventListener("focus", () => {
            if (leaveTime) {
                const now = Date.now();
                const diffMinutes = (now - leaveTime) / 60000;
                
                if (diffMinutes > 5) {
                    location.reload();
                }
            }
        });