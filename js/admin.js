// ==========================================
// شريط التنقل للمدير - ملف منفصل
// ==========================================

(function() {
    'use strict';

    // ===========================
    // 1. بيانات المديرين المسموح لهم
    // ===========================
    const ALLOWED_MANAGERS = ['6123', '4343'];

    // ===========================
    // 2. قراءة بيانات الطالب من localStorage
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
    // 3. التحقق من صلاحية المدير
    // ===========================
    function isManager() {
        const student = getStudentData();
        if (!student) return false;
        const id = student.studentId || student.id || '';
        return ALLOWED_MANAGERS.includes(id.toString());
    }

    // ===========================
    // 4. تحديد الصف الحالي من الرابط
    // ===========================
    function getCurrentGradeFromURL() {
        const path = window.location.pathname;
        if (path.includes('/Year-1/')) return 'أولي بكالوريا';
        if (path.includes('/Year-ba/')) return 'تانية بكالوريا';
        if (path.includes('/Year-az/')) return 'تانية ثانوي أزهر';
        if (path.includes('/Year-3/')) return 'تالتة ثانوي';
        const student = getStudentData();
        return student?.grade || '';
    }

    // ===========================
    // 5. تحديث grade في localStorage
    // ===========================
    function updateGradeInStorage(newGrade) {
        try {
            const student = getStudentData();
            if (!student) return false;
            student.grade = newGrade;
            const key = localStorage.getItem('studentData') ? 'studentData' : 'userData';
            localStorage.setItem(key, JSON.stringify(student));
            return true;
        } catch (e) {
            console.error('فشل تحديث الصف:', e);
            return false;
        }
    }

    // ===========================
    // 6. روابط الصفحات
    // ===========================
    function getGradeURL(grade) {
        const map = {
            'أولي بكالوريا': '/Year-1/',
            'تانية بكالوريا': '/Year-ba/',
            'تانية ثانوي أزهر': '/Year-az/',
            'تالتة ثانوي': '/Year-3/',
            'ثالثة ثانوي': '/Year-3/',
            'تلتا ثانوي': '/Year-3/'
        };
        return map[grade] || '/';
    }

    // ===========================
    // 7. بناء شريط التنقل في HTML
    // ===========================
    function createNavbarHTML() {
        const navbarHTML = `
            <div id="managerNavbar" style="display: none;">
                <div class="manager-navbar">
                    <div class="navbar-toggle" id="navbarToggle">
                        <i class="fas fa-chevron-up" id="toggleIcon"></i>
                        <span class="toggle-label">لوحة التحكم</span>
                    </div>
                    <div class="navbar-content" id="navbarContent">
                        <div class="navbar-inner">
                            <div class="navbar-brand">
                                <i class="fas fa-crown" style="color: #ff0000;"></i>
                                <span>مدير المنصة</span>
                            </div>
                            <div class="navbar-buttons" id="navbarButtons">
                                <!-- سيتم إضافة الأزرار بواسطة JavaScript -->
                            </div>
                            <div class="navbar-user">
                                <span class="user-badge">
                                    <i class="fas fa-user"></i>
                                    <span id="managerName">المدير</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', navbarHTML);
    }

    // ===========================
    // 8. بناء الأزرار
    // ===========================
    function buildButtons() {
        const currentGrade = getCurrentGradeFromURL();
        const student = getStudentData();
        const managerName = student?.name || 'المدير';

        // تحديث اسم المدير
        const nameSpan = document.getElementById('managerName');
        if (nameSpan) nameSpan.textContent = managerName;

        // قائمة الصفوف
        const grades = [
            'أولي بكالوريا',
            'تانية بكالوريا',
            'تانية ثانوي أزهر',
            'تالتة ثانوي'
        ];

        const buttonsContainer = document.getElementById('navbarButtons');
        if (!buttonsContainer) return;

        buttonsContainer.innerHTML = '';

        grades.forEach(grade => {
            const btn = document.createElement('button');
            const isActive = (grade === currentGrade);
            btn.className = `nav-btn ${isActive ? 'active' : ''}`;
            btn.textContent = grade;
            btn.title = `الانتقال إلى ${grade}`;

            btn.onclick = function(e) {
                e.preventDefault();
                const targetURL = getGradeURL(grade);
                updateGradeInStorage(grade);
                window.location.href = targetURL;
            };

            buttonsContainer.appendChild(btn);
        });
    }

    // ===========================
    // 9. نظام الطي والفتح
    // ===========================
    function setupToggle() {
        const toggleBtn = document.getElementById('navbarToggle');
        const content = document.getElementById('navbarContent');
        const icon = document.getElementById('toggleIcon');

        if (!toggleBtn || !content) return;

        // استعادة الحالة من localStorage
        const isCollapsed = localStorage.getItem('navbarCollapsed') === 'true';
        if (isCollapsed) {
            content.classList.add('collapsed');
            icon.className = 'fas fa-chevron-down';
        }

        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isNowCollapsed = content.classList.toggle('collapsed');
            
            icon.className = isNowCollapsed ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
            
            localStorage.setItem('navbarCollapsed', isNowCollapsed.toString());
        });
    }

    // ===========================
    // 10. إضافة الـ CSS الخاص بالشريط
    // ===========================
    function injectNavbarStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* ===== MANAGER NAVBAR ===== */
            #managerNavbar {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 9999;
                font-family: 'Tajawal', sans-serif;
            }

            .manager-navbar {
                background: var(--bg-secondary, #141414);
                border-top: 2px solid var(--primary, #ff0000);
                box-shadow: 0 -8px 32px rgba(0,0,0,0.6);
                backdrop-filter: blur(12px);
            }

            .navbar-toggle {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                padding: 8px 20px;
                cursor: pointer;
                background: rgba(255,0,0,0.05);
                border-bottom: 1px solid var(--border-color, #2a2a2a);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                color: var(--text-secondary, #aaaaaa);
                font-size: 0.85rem;
                user-select: none;
            }

            .navbar-toggle:hover {
                background: rgba(255,0,0,0.1);
                color: white;
            }

            .navbar-toggle i {
                font-size: 0.9rem;
                color: var(--primary, #ff0000);
                transition: transform 0.3s ease;
            }

            .toggle-label {
                font-weight: 600;
                letter-spacing: 0.5px;
            }

            .navbar-content {
                overflow: hidden;
                max-height: 200px;
                transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .navbar-content.collapsed {
                max-height: 0;
            }

            .navbar-inner {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 15px;
                padding: 12px 25px;
                background: var(--bg-secondary, #141414);
            }

            .navbar-brand {
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: 700;
                font-size: 0.95rem;
                color: white;
            }

            .navbar-brand i {
                font-size: 1.2rem;
            }

            .navbar-buttons {
                display: flex;
                align-items: center;
                gap: 8px;
                flex-wrap: wrap;
                flex: 1;
                justify-content: center;
            }

            .nav-btn {
                padding: 8px 20px;
                border: 1px solid var(--border-color, #2a2a2a);
                border-radius: 30px;
                background: transparent;
                color: var(--text-secondary, #aaaaaa);
                cursor: pointer;
                font-family: 'Tajawal', sans-serif;
                font-weight: 600;
                font-size: 0.85rem;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                white-space: nowrap;
            }

            .nav-btn:hover {
                border-color: var(--primary, #ff0000);
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(255,0,0,0.15);
            }

            .nav-btn.active {
                background: linear-gradient(135deg, #ff0000, #cc0000);
                border-color: var(--primary, #ff0000);
                color: white;
                box-shadow: 0 4px 20px rgba(255,0,0,0.3);
            }

            .navbar-user {
                display: flex;
                align-items: center;
            }

            .user-badge {
                display: flex;
                align-items: center;
                gap: 8px;
                background: rgba(255,255,255,0.05);
                padding: 6px 16px 6px 12px;
                border-radius: 40px;
                border: 1px solid var(--border-color, #2a2a2a);
                font-size: 0.85rem;
                color: var(--text-secondary, #aaaaaa);
            }

            .user-badge i {
                color: var(--primary, #ff0000);
                font-size: 0.9rem;
            }

            .user-badge span {
                color: white;
                font-weight: 600;
            }

            /* ===== RESPONSIVE ===== */
            @media (max-width: 768px) {
                .navbar-inner {
                    flex-direction: column;
                    align-items: stretch;
                    padding: 10px 15px;
                    gap: 10px;
                }

                .navbar-brand {
                    justify-content: center;
                    font-size: 0.85rem;
                }

                .navbar-buttons {
                    gap: 6px;
                    justify-content: center;
                }

                .nav-btn {
                    padding: 6px 14px;
                    font-size: 0.75rem;
                }

                .navbar-user {
                    justify-content: center;
                }

                .user-badge {
                    font-size: 0.75rem;
                    padding: 4px 12px 4px 8px;
                }

                .navbar-toggle {
                    padding: 6px 15px;
                    font-size: 0.75rem;
                }
            }

            @media (max-width: 480px) {
                .nav-btn {
                    padding: 5px 10px;
                    font-size: 0.65rem;
                }

                .navbar-brand {
                    font-size: 0.75rem;
                }

                .navbar-buttons {
                    gap: 4px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ===========================
    // 11. التشغيل الرئيسي
    // ===========================
    function init() {
        // التحقق من صلاحية المدير
        if (!isManager()) {
            console.log('🔒 غير مصرح لك بعرض شريط التنقل');
            return;
        }

        // إضافة الـ CSS
        injectNavbarStyles();

        // إضافة هيكل الشريط
        createNavbarHTML();

        // بناء الأزرار
        buildButtons();

        // تفعيل نظام الطي
        setupToggle();

        // إظهار الشريط
        document.getElementById('managerNavbar').style.display = 'block';

        console.log('✅ شريط التنقل تم تحميله بنجاح للمدير');
    }

    // ===========================
    // 12. تشغيل عند تحميل الصفحة
    // ===========================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();