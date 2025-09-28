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
                    const courseObj = activatedCourses[courseName];

                    // نتأكد إن الكورس لسه صالح
                    if (Date.now() < courseObj.expiry) {
                        const li = document.createElement('li');
                        const a = document.createElement('a');

                        a.href = courseObj.link;
                        a.textContent = courseName;
                        a.target = "_blank";

                        li.appendChild(a);
                        list.appendChild(li);
                    }
                });
            } catch (err) {
                console.error('خطأ في قراءة activatedCourses:', err);
                list.innerHTML = '<li>حدث خطأ في تحميل الكورسات</li>';
            }
        }

        // عرض اسم الطالب
        document.addEventListener('DOMContentLoaded', function() {
            const studentData = JSON.parse(localStorage.getItem('studentData') || '{}');
            const studentName = studentData.name || 'طالبنا العزيز';
            document.getElementById('studentName').textContent = studentName;
        });
