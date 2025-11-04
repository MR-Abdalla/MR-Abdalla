 const overlay = document.getElementById("overlay");
  const drawers = document.querySelectorAll(".drawer");
  const buttons = document.querySelectorAll("a[data-target]");

  // لما تدوس على أي زرار
  buttons.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const targetId = btn.getAttribute("data-target");
      document.getElementById(targetId).classList.add("show");
      overlay.style.display = "block";
    });
  });

  // قفل الدف لما تدوس على X أو الخلفية
  overlay.addEventListener("click", closeAll);
  drawers.forEach(d => d.querySelector(".close-btn").addEventListener("click", closeAll));

  function closeAll() {
    drawers.forEach(d => d.classList.remove("show"));
    overlay.style.display = "none";
  }