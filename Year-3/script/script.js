const menu = document.getElementById("menu");

function showMenu() {
  if (window.scrollY > 200) {
    menu.classList.add("active");
  } else {
    menu.classList.remove("active");
  }
}

window.addEventListener("scroll", showMenu);


document.addEventListener("DOMContentLoaded", () => {

  const modal = document.getElementById("instructions-modal");
  const okBtn = document.getElementById("instructions-ok");

  if(localStorage.getItem("instructionsSeen")){
    modal.style.display = "none";
  }

  okBtn.onclick = () => {
    localStorage.setItem("instructionsSeen","true");
    modal.style.display = "none";
  };

});