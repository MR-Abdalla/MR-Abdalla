const data = localStorage.getItem("studentData");

if (data) {
  const student = JSON.parse(data);

  // الاسم كامل
  const fullName = student.name;

  // أول كلمة بس
  const firstName = fullName.split(" ")[0];

  document.getElementById("studentName").textContent = firstName;

} else {
  document.getElementById("studentName").textContent = "طالب غير مسجل";
}
