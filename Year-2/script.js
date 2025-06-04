
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

