  // دالة فتح وإغلاق الشريط الجانبي
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            
            // تحميل الكورسات عند فتح الشريط الجانبي
            if (sidebar.classList.contains('active')) {
                loadActivatedCourses();
            }
            
            // إغلاق القائمة المنسدلة إذا كانت مفتوحة
            document.getElementById('dropdownMenu').classList.remove('active');
        }

        // دالة فتح وإغلاق القائمة المنسدلة
        function toggleDropdown() {
            document.getElementById('dropdownMenu').classList.toggle('active');
        }

        // دالة تحميل الكورسات المفعلة
        function loadActivatedCourses() {
            const list = document.getElementById('myCoursesList');
            list.innerHTML = ''; // تفريغ القائمة

            const data = localStorage.getItem('activatedCourses');
            if (!data) {
                list.innerHTML = '<li>لا توجد كورسات مفعّلة</li>';
                return;
            }

            try {
                const activatedCourses = JSON.parse(data);
                const courseNames = Object.keys(activatedCourses);

                if (courseNames.length === 0) {
                    list.innerHTML = '<li>لا توجد كورسات مفعّلة</li>';
                    return;
                }

                courseNames.forEach(courseName => {
                    const courseURL = activatedCourses[courseName];

                    const li = document.createElement('li');
                    const a = document.createElement('a');

                    a.href = courseURL;
                    a.textContent = courseName;
                    a.target = "_blank";

                    li.appendChild(a);
                    list.appendChild(li);
                });
            } catch (err) {
                console.error('خطأ في قراءة activatedCourses:', err);
                list.innerHTML = '<li>حدث خطأ في تحميل الكورسات</li>';
            }
        }

        // إغلاق القائمة المنسدلة عند النقر خارجها
        document.addEventListener('click', function(event) {
            const dropdownMenu = document.getElementById('dropdownMenu');
            const menuToggle = document.getElementById('menuToggle');
            
            if (!menuToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.remove('active');
            }
        });

        // تحميل الكورسات عند فتح الصفحة
        window.onload = loadActivatedCourses;