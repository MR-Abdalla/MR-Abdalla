const menu = document.getElementById("menu");

function showMenu() {
  if (window.scrollY > 200) {
    menu.classList.add("active");
  } else {
    menu.classList.remove("active");
  }
}

window.addEventListener("scroll", showMenu);


