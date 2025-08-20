
        // تفعيل القائمة المنسدلة عند النقر على أيقونة القائمة
document.getElementById('menuToggle').addEventListener('click', function() {
    this.classList.toggle('active');
});



document.addEventListener("DOMContentLoaded", function () {
    const columns = document.querySelectorAll(".footer-column h4");
    columns.forEach(column => {
        column.addEventListener("click", function () {
            let parent = this.parentElement;
            parent.classList.toggle("open");
        });
    });
});





function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("show");
}








  document.addEventListener("DOMContentLoaded", () => {
    const courseTitle = "كورس الشهر الثاني - المراجعة النهائية - ازهر"; // اسم الكورس الحالي
    const subscribed = JSON.parse(localStorage.getItem("subscribedCourses") || "[]");

    const card = document.querySelector('.card'); // تأكد أنها الكارد الخاصة بالكورس ده

    if (subscribed.includes(courseTitle)) {
      card.querySelector('.btn-subscribe').style.display = 'none';
      card.querySelector('.btn-access').style.display = 'inline-block';
    } else {
      card.querySelector('.btn-subscribe').style.display = 'inline-block';
      card.querySelector('.btn-access').style.display = 'none';
    }
  });


