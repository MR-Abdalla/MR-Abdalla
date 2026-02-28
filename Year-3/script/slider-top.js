



const track = document.querySelector(".slider-track");
const slides = document.querySelectorAll(".slide");
const dotsContainer = document.querySelector(".dots");

let current = 0;
let interval;
const duration = 9000; // 4 ثواني

/* إنشاء الدوتس */
slides.forEach((_, i) => {
  const dot = document.createElement("div");
  dot.classList.add("dot");

  const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");

  const circle = document.createElementNS("http://www.w3.org/2000/svg","circle");
 

  svg.appendChild(circle);
  dot.appendChild(svg);
  dotsContainer.appendChild(dot);

  dot.addEventListener("click",()=>{
    goToSlide(i);
  });
});

const dots = document.querySelectorAll(".dot");

/* تشغيل التحميل الدائري */
function startProgress(){
  const circle = dots[current].querySelector("circle");

  circle.style.transition="none";
  circle.style.strokeDashoffset="63";

  requestAnimationFrame(()=>{
    circle.style.transition=`stroke-dashoffset ${duration}ms linear`;
    circle.style.strokeDashoffset="0";
  });
}

function goToSlide(index){
  clearInterval(interval);

  dots[current].classList.remove("active");
  dots[current].querySelector("circle").style.strokeDashoffset="63";

  current = index;

  track.style.transform = `translateX(-${current * 100}%)`;

  dots[current].classList.add("active");

  startProgress();
  autoSlide();
}

function autoSlide(){
  interval = setInterval(()=>{

    if(current === slides.length - 1){
      clearInterval(interval); // يقف عند آخر سلايد
      return;
    }

    current++;
    goToSlide(current);

  }, duration);
}

/* تشغيل أول مرة */
goToSlide(0);


/* ================= Swipe Support ================= */

let startX = 0;
let currentTranslate = 0;
let isDragging = false;

const slider = document.querySelector(".hero-slider");

slider.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  isDragging = true;
  clearInterval(interval); // يوقف الأوتو وقت السحب
});

slider.addEventListener("touchmove", e => {
  if(!isDragging) return;

  const currentX = e.touches[0].clientX;
  const diff = currentX - startX;

  track.style.transition = "none";
  track.style.transform =
    `translateX(calc(-${current * 100}% + ${diff}px))`;
});

slider.addEventListener("touchend", e => {
  isDragging = false;

  const endX = e.changedTouches[0].clientX;
  const diff = endX - startX;

  track.style.transition =
    "transform 0.6s cubic-bezier(.77,0,.18,1)";

  if(diff < -80 && current < slides.length - 1){
    current++;
  }
  else if(diff > 80 && current > 0){
    current--;
  }

  goToSlide(current);
});