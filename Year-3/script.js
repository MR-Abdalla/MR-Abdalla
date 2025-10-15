 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
    import { getFirestore, collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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

    // إدارة الحالة
    const state = {
        currentTab: 'all',
        currentFilter: 'all',
        savedVideos: JSON.parse(localStorage.getItem('savedVideos')) || [],
        allVideos: [],
        studentData: JSON.parse(localStorage.getItem('studentData')) || null
    };

    // تحميل بيانات الطالب
    function loadStudentData() {
        if (state.studentData) {
            // تحديث معلومات الطالب في الشريط الجانبي
            const studentInfo = document.getElementById('studentInfo');
            studentInfo.innerHTML = `
                <div class="student-name">${state.studentData.name}</div>
                <div class="student-details">
                    <div> الكود:${state.studentData.studentId}</div>
                    <div>الصف: ${state.studentData.grade}</div>
                    <div>المدرسة: ${state.studentData.school}</div>
                    <div>المحافظة: ${state.studentData.governorate}</div>
                </div>
            `;
            
            // تحديث الصورة الرمزية والاسم في الرأس
            document.getElementById('userAvatar').textContent = state.studentData.name.charAt(0);
            document.getElementById('userName').textContent = state.studentData.name;
        }
    }

    function getYoutubeId(url){
        const reg = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
        const m = url.match(reg);
        return (m && m[2].length===11) ? m[2] : null;
    }

    // حفظ الفيديو
    function toggleSaveVideo(videoId) {
        const index = state.savedVideos.indexOf(videoId);
        
        if (index === -1) {
            // إضافة إلى المحفوظات
            state.savedVideos.push(videoId);
        } else {
            // إزالة من المحفوظات
            state.savedVideos.splice(index, 1);
        }
        
        // حفظ في localStorage
        localStorage.setItem('savedVideos', JSON.stringify(state.savedVideos));
        
        // تحديث العداد
        updateSavedCount();
        
        // إعادة عرض الفيديوهات
        renderVideos();
    }

    // تحديث عداد المحفوظات
    function updateSavedCount() {
        const savedCount = document.getElementById('savedCount');
        savedCount.textContent = state.savedVideos.length;
    }

    // دالة لاستخراج الرقم من المعرف
    function extractNumberFromId(id) {
        // استخراج الأرقام من المعرف
        const matches = id.match(/\d+/g);
        if (matches && matches.length > 0) {
            return parseInt(matches[0]);
        }
        return 0; // إذا لم يوجد رقم، نرجع 0
    }

    // عرض الفيديوهات
    function renderVideos() {
        const grid = document.getElementById("videosGrid");
        
        let videosToShow = [];
        
        if (state.currentTab === 'saved') {
            // عرض المحفوظات فقط
            videosToShow = state.allVideos.filter(video => 
                state.savedVideos.includes(video.id)
            );
        } else {
            // عرض محاضرات مع الفلترة
            videosToShow = state.allVideos.filter(video => {
                if (state.currentFilter === 'all') return true;
                return video.category === state.currentFilter;
            });
        }

        // ترتيب الفيديوهات حسب الرقم المستخرج من المعرف
        videosToShow.sort((a, b) => {
            const numA = extractNumberFromId(a.id);
            const numB = extractNumberFromId(b.id);
            return numA - numB; // ترتيب تصاعدي من 1 إلى ما لا نهاية
        });
        
        if (videosToShow.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-video-slash"></i>
                    <p>${state.currentTab === 'saved' ? 'لا توجد فيديوهات محفوظة' : 'لا توجد فيديوهات متاحة'}</p>
                    <p>${state.currentTab === 'saved' ? 'احفظ بعض الفيديوهات لتظهر هنا' : 'سيتم إضافة فيديوهات جديدة قريباً'}</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = '';
        
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
                    ${thumb ? `<img src="${thumb}" alt="thumb" loading="lazy" class="thumbnail">` : 
                    `<div class="thumb-placeholder">
                        <i class="fas fa-play-circle"></i>
                    </div>`}
                </div>

                <div class="video-info">
                    <h3 class="video-title">${video.title}</h3>
                    <p class="video-desc">${video.description || "لا يوجد وصف متاح"}</p>
                    <button class="show-more">عرض المزيد</button>

                    <div class="video-meta">
                        <span><i class="far fa-clock"></i> ${video.date}</span>
                        <span class="video-order">المحاضرة ${extractNumberFromId(video.id)}</span>
                    </div>
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

            grid.appendChild(card);
        });

        // إضافة أحداث النقر لحفظ الفيديوهات
        document.querySelectorAll(".btn-secondary").forEach(btn => {
            btn.addEventListener("click", () => {
                const videoId = btn.dataset.id;
                toggleSaveVideo(videoId);
            });
        });
    }

    async function loadVideos(){
        const grid = document.getElementById("videosGrid");
        
        try {
            const snap = await getDocs(query(
                collection(db,"videos"),
                where("grade","==","3")
            ));
            
            if (snap.empty) {
                grid.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-video-slash"></i>
                        <p>لا توجد فيديوهات متاحة حالياً</p>
                        <p>سيتم إضافة فيديوهات جديدة قريباً</p>
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

            // ترتيب جميع الفيديوهات حسب الرقم المستخرج من المعرف
            state.allVideos.sort((a, b) => {
                const numA = extractNumberFromId(a.id);
                const numB = extractNumberFromId(b.id);
                return numA - numB; // ترتيب تصاعدي من 1 إلى ما لا نهاية
            });
            
            // تحديث العداد
            updateSavedCount();
            
            // عرض الفيديوهات
            renderVideos();
            
        } catch (error) {
            console.error("Error loading videos: ", error);
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>حدث خطأ في تحميل الفيديوهات</p>
                    <p>يرجى المحاولة مرة أخرى لاحقاً</p>
                </div>
            `;
        }
    }

    // البحث
    document.querySelector('.search-input').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.video-card');
        
        cards.forEach(card => {
            const title = card.querySelector('.video-title').textContent.toLowerCase();
            
            if (title.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // تغيير التبويبات
    document.querySelectorAll('.nav-link[data-tab]').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            
            // تحديث التبويب النشط
            document.querySelectorAll('.nav-link').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // تحديث الحالة
            state.currentTab = tab.dataset.tab;
            
            // تحديث عنوان الصفحة
            document.getElementById('pageTitle').textContent = 
                state.currentTab === 'saved' ? 'الفيديوهات المحفوظة' : 'محاضرات';
            
            // إعادة عرض الفيديوهات
            renderVideos();
            
            // إغلاق القائمة على الهواتف
            if (window.innerWidth <= 992) {
                closeMobileMenu();
            }
        });
    });

    // إدارة القائمة على الهواتف
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    function openMobileMenu() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMobileMenu() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    mobileMenuBtn.addEventListener('click', openMobileMenu);
    overlay.addEventListener('click', closeMobileMenu);
    
    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 && 
            !sidebar.contains(e.target) && 
            !mobileMenuBtn.contains(e.target) && 
            sidebar.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // التحميل الأولي
    loadStudentData();
    loadVideos();