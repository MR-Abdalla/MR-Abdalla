// ==========================================
// تخطي الحماية للمديرين - admin-override.js
// ==========================================

(function() {
    'use strict';

    // ===========================
    // 1. بيانات المديرين المسموح لهم
    // ===========================
    const ALLOWED_MANAGERS = ['6123', '4343'];

    // ===========================
    // 2. قراءة بيانات الطالب
    // ===========================
    function getStudentData() {
        try {
            const stored = localStorage.getItem('studentData') || localStorage.getItem('userData');
            if (!stored) return null;
            return JSON.parse(stored);
        } catch (e) {
            console.error('خطأ في قراءة بيانات الطالب:', e);
            return null;
        }
    }

    // ===========================
    // 3. التحقق من المدير
    // ===========================
    function isManager() {
        const student = getStudentData();
        if (!student) return false;
        const id = student.studentId || student.id || '';
        return ALLOWED_MANAGERS.includes(id.toString());
    }

    // ===========================
    // 4. عرض رسالة المدير
    // ===========================
    function showAdminMessage() {
        // إخفاء رسائل الخطأ القديمة
        const authMsg = document.getElementById('authMsg');
        if (authMsg) {
            authMsg.className = 'auth-msg admin';
            const span = authMsg.querySelector('span');
            if (span) {
                span.innerHTML = '👑 تم تشغيل الفيديو بواسطتك كمدير (تجاوز الحماية)';
            }
            authMsg.style.display = 'block';
        }

        // إظهار رسالة منبثقة
        showAdminToast('👑 تم تشغيل الفيديو بواسطتك كمدير');
    }

    // ===========================
    // 5. رسالة منبثقة للمدير
    // ===========================
    function showAdminToast(message) {
        const existing = document.getElementById('adminToast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'adminToast';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #ff0000, #cc0000);
            color: white;
            padding: 16px 30px;
            border-radius: 16px;
            font-family: 'Tajawal', sans-serif;
            font-weight: 700;
            font-size: 1.1rem;
            z-index: 99999;
            box-shadow: 0 8px 40px rgba(255,0,0,0.4);
            border: 2px solid rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            gap: 14px;
            animation: slideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            direction: rtl;
        `;

        toast.innerHTML = `
            <i class="fas fa-crown" style="font-size: 1.8rem; color: #ffd700;"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                cursor: pointer;
                font-size: 1.2rem;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            " onmouseover="this.style.background='rgba(255,255,255,0.4)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">✕</button>
        `;

        document.body.appendChild(toast);

        // إضافة الأنيميشن
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from { 
                    opacity: 0; 
                    transform: translateX(-50%) translateY(-30px) scale(0.95);
                }
                to { 
                    opacity: 1; 
                    transform: translateX(-50%) translateY(0) scale(1);
                }
            }
        `;
        document.head.appendChild(style);

        // اختفاء تلقائي بعد 8 ثواني
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(-50%) translateY(-20px)';
                setTimeout(() => toast.remove(), 500);
            }
        }, 8000);
    }

    // ===========================
    // 6. تخطي الكويز تلقائياً للمدير
    // ===========================
    function overrideQuiz() {
        // إذا كان المدير، نعتبر الكويز محلول
        if (!isManager()) return;

        // البحث عن أزرار الكويز
        const submitQuizBtn = document.getElementById('submitQuizBtn');
        const quizResult = document.getElementById('quizResult');

        if (submitQuizBtn && quizResult) {
            // محاكاة نجاح الكويز
            const totalQuestions = document.querySelectorAll('.quiz-question').length || 1;
            quizResult.innerHTML = `
                <div class="score pass" style="color: #34d399;">
                    🎯 ${totalQuestions}/${totalQuestions}
                </div>
                <div style="margin:8px 0;">النسبة: <strong>100%</strong></div>
                <div style="color: #34d399;">✅ ناجح (بصلاحية المدير)</div>
                <div style="margin-top:10px;font-size:0.85rem;color:var(--text-secondary);">
                    👑 تم تجاوز الكويز تلقائياً كمدير
                </div>
            `;
            quizResult.style.display = 'block';
            submitQuizBtn.style.display = 'none';

            // تحديد كل الخيارات كصحيحة
            document.querySelectorAll('.quiz-option').forEach(el => {
                el.style.borderColor = '#34d399';
                el.style.background = 'rgba(52, 211, 153, 0.1)';
            });

            // حفظ حالة الكويز
            const videoId = new URLSearchParams(window.location.search).get("videoId");
            if (videoId) {
                localStorage.setItem(`quiz_${videoId}_completed`, 'true');
                localStorage.setItem(`quiz_${videoId}_admin_override`, 'true');
            }
        }
    }

    // ===========================
    // 7. تخطي التفعيل للمدير
    // ===========================
    function overrideActivation() {
        if (!isManager()) return;

        const videoId = new URLSearchParams(window.location.search).get("videoId");
        if (videoId) {
            // وضع علامة التفعيل
            localStorage.setItem(`video_${videoId}`, 'true');
            localStorage.setItem(`video_${videoId}_admin_override`, 'true');
        }

        // تحديث واجهة التفعيل
        const authMsg = document.getElementById('authMsg');
        if (authMsg) {
            authMsg.className = 'auth-msg admin';
            const span = authMsg.querySelector('span');
            if (span) {
                span.innerHTML = '👑 تم التفعيل تلقائياً بصلاحية المدير';
            }
        }

        // تحديث حالة الخطوات
        document.querySelectorAll('#authSteps .step').forEach((el, i) => {
            el.classList.remove('active', 'completed');
            if (i === 0) el.classList.add('completed');
            if (i === 1) el.classList.add('completed');
            if (i === 2) el.classList.add('active');
        });

        // إخفاء حقل الكود
        const codeInput = document.getElementById('codeInput');
        if (codeInput) {
            codeInput.style.display = 'none';
            codeInput.value = 'ADMIN_OVERRIDE';
        }

        // تغيير زر التشغيل
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.className = 'auth-btn admin-btn';
            submitBtn.innerHTML = '<i class="fas fa-crown"></i> تشغيل كمدير';
            submitBtn.style.background = 'linear-gradient(135deg, #ffd700, #f59e0b)';
            submitBtn.style.border = '2px solid #ffd700';
            submitBtn.style.color = '#000';
        }

        // عرض رسالة المدير
        showAdminMessage();

        // تشغيل الفيديو تلقائياً بعد 1.5 ثانية
        setTimeout(() => {
            const playBtn = document.getElementById('submitBtn');
            if (playBtn) {
                playBtn.click();
            }
        }, 1500);
    }

    // ===========================
    // 8. تخطي الحماية بالكامل
    // ===========================
    function overrideAll() {
        if (!isManager()) {
            console.log('🔒 المستخدم ليس مديراً');
            return;
        }

        console.log('👑 تم اكتشاف مدير - تجاوز الحماية');

        // الانتظار قليلاً حتى تتحمّل الصفحة
        setTimeout(() => {
            // تخطي التفعيل
            overrideActivation();

            // تخطي الكويز بعد لحظة
            setTimeout(() => {
                overrideQuiz();
            }, 500);

            // عرض رسالة المدير
            showAdminToast('👑 تم تشغيل الفيديو بواسطتك كمدير');

        }, 300);
    }

    // ===========================
    // 9. تعديل زر التفعيل الأصلي
    // ===========================
    function modifySubmitButton() {
        if (!isManager()) return;

        const submitBtn = document.getElementById('submitBtn');
        if (!submitBtn) return;

        // حفظ الحدث الأصلي
        const originalClick = submitBtn.onclick;

        // استبدال الحدث
        submitBtn.onclick = function(e) {
            e.preventDefault();
            
            // إذا كان المدير
            if (isManager()) {
                // تشغيل الفيديو مباشرة
                const videoId = new URLSearchParams(window.location.search).get("videoId");
                if (videoId) {
                    // التأكد من التفعيل
                    localStorage.setItem(`video_${videoId}`, 'true');
                    localStorage.setItem(`video_${videoId}_admin_override`, 'true');
                    
                    // عرض رسالة
                    showAdminToast('👑 تم تشغيل الفيديو بواسطتك كمدير');
                    
                    // تشغيل الفيديو
                    const videoData = window.videoData || null;
                    if (videoData?.link) {
                        playVideoDirectly(videoData.link);
                    } else {
                        // محاولة العثور على رابط الفيديو
                        const link = document.querySelector('#videoPlayer iframe')?.src;
                        if (link) {
                            document.getElementById('videoPlayer').style.display = 'block';
                            document.getElementById('videoPlaceholder').style.display = 'none';
                        }
                    }
                }
                return;
            }

            // إذا ليس مدير، نفذ الحدث الأصلي
            if (originalClick) {
                originalClick.call(this, e);
            }
        };

        // تغيير مظهر الزر
        submitBtn.innerHTML = '<i class="fas fa-crown"></i> تشغيل كمدير';
        submitBtn.style.background = 'linear-gradient(135deg, #ffd700, #f59e0b)';
        submitBtn.style.border = '2px solid #ffd700';
        submitBtn.style.color = '#000';
        submitBtn.style.fontWeight = 'bold';
    }

    // ===========================
    // 10. تشغيل الفيديو مباشرة
    // ===========================
    function playVideoDirectly(link) {
        const videoPlayer = document.getElementById('videoPlayer');
        const videoPlaceholder = document.getElementById('videoPlaceholder');
        const videoTitleEl = document.getElementById('videoTitle');

        if (videoPlayer && link) {
            // استخراج رابط embed
            const embed = getEmbedLink(link);
            videoPlayer.innerHTML = `<iframe src="${embed}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            videoPlayer.style.display = 'block';
            if (videoPlaceholder) videoPlaceholder.style.display = 'none';
            
            // تحديث العنوان
            if (videoTitleEl) {
                const videoData = window.videoData || null;
                videoTitleEl.textContent = videoData?.title || 'فيديو المدير';
            }

            // التبديل إلى تبويب القائمة
            document.querySelector('[data-tab="list"]')?.click();

            showAdminToast('🎬 جاري تشغيل الفيديو...');
        }
    }

    // ===========================
    // 11. دالة استخراج YouTube ID
    // ===========================
    function extractYoutubeId(url) {
        if (!url) return null;
        const patterns = [
            /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
            /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
            /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
            /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/
        ];
        for (const p of patterns) {
            const match = url.match(p);
            if (match) return match[1];
        }
        return null;
    }

    function getEmbedLink(link) {
        const id = extractYoutubeId(link);
        if (id) {
            return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&showinfo=0`;
        }
        if (link?.includes('embed')) return link;
        return link;
    }

    // ===========================
    // 12. إضافة CSS إضافي للمدير
    // ===========================
    function injectAdminStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .auth-msg.admin {
                background: rgba(255, 215, 0, 0.15);
                border: 2px solid #ffd700;
                color: #ffd700;
                border-radius: 12px;
                padding: 14px 20px;
                margin-top: 12px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .auth-msg.admin i {
                font-size: 1.2rem;
            }

            .admin-btn {
                background: linear-gradient(135deg, #ffd700, #f59e0b) !important;
                border: 2px solid #ffd700 !important;
                color: #000 !important;
                font-weight: 700 !important;
                box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3) !important;
                transition: all 0.3s ease !important;
            }

            .admin-btn:hover {
                transform: scale(1.05) !important;
                box-shadow: 0 8px 40px rgba(255, 215, 0, 0.5) !important;
            }

            .badge-admin {
                background: linear-gradient(135deg, #ffd700, #f59e0b);
                color: #000;
                padding: 4px 12px;
                border-radius: 20px;
                font-weight: 700;
                font-size: 0.75rem;
                display: inline-block;
            }

            .score.pass {
                background: rgba(255, 215, 0, 0.1);
                border: 2px solid #ffd700;
                color: #ffd700;
                padding: 10px 20px;
                border-radius: 12px;
                font-weight: 700;
            }
        `;
        document.head.appendChild(style);
    }

    // ===========================
    // 13. التشغيل الرئيسي
    // ===========================
    function init() {
        // إضافة الـ CSS
        injectAdminStyles();

        // التحقق من المدير
        if (isManager()) {
            console.log('👑 تم اكتشاف مدير (6123 أو 4343)');
            
            // تخطي كل الحماية
            overrideAll();

            // تعديل زر التفعيل
            setTimeout(modifySubmitButton, 500);

            // مراقبة تحميل الفيديو
            const observer = new MutationObserver(() => {
                if (document.getElementById('videoPlayer')) {
                    overrideAll();
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });

        } else {
            console.log('🔒 مستخدم عادي - الحماية تعمل');
        }
    }

    // ===========================
    // 14. تشغيل عند تحميل الصفحة
    // ===========================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();