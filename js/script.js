const text = `علشان عمك أينشتاين بيقولك متقلقش الفيزياء مش مادة صعبة…
هي بس محتاجة حد يفهمك الصح ويبسّطلك الفكرة مفيش قوانين معقدة،
مفيش رموز تخوّفك، مفيش مسائل توقفك.
كل حاجة ليها طريقة… وكل فكرة ليها مفتاح 

ومع مستر عبدالله السيد هتفهم قبل ما تحفظ،
وهتحل قبل ما تتوتر، وهتبقى المادة اللي تجيبلك الدرجة النهائية
لأن لما الشرح يبقى صح… المستحيل بيبقى سهل 🚀`;

const mr = document.getElementById("typingText");
let i = 0;
let typingStarted = false;
let counterStarted = false;

function typeEffect() {
  if (i < text.length) {
    mr.innerHTML += text.charAt(i);
    i++;
    setTimeout(typeEffect, 25);
  }
}

function animateCounter(element) {
    const target = +element.textContent;
    element.textContent = 0;

    let current = 0;
    const increment = Math.ceil(target / 100);
    const speed = 20;

    const timer = setInterval(() => {
        current += increment;

        if (current >= target) {
            clearInterval(timer);

            if (target >= 1000) {
                element.textContent = (target / 1000).toFixed() + "K";
            } else {
                element.textContent = target;
            }

        } else {
            element.textContent = current;
        }
    }, speed);
}

/* Observer واحد شامل لكل العناصر */
const mainObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {

    // ✍️ تشغيل الكتابة
    if (entry.target.id === "typingText" && entry.isIntersecting && !typingStarted) {
      typingStarted = true;
      typeEffect();
    }

    // 🎨 تشغيل الفرشة
    if (entry.target.classList.contains("reveal") && entry.isIntersecting) {
      entry.target.classList.add("active");
      mainObserver.unobserve(entry.target);
    }

    // 🔢 تشغيل العدادات
    if (entry.target.classList.contains("subscribe") && entry.isIntersecting && !counterStarted) {
      counterStarted = true;
      animateCounter(document.getElementById("sab"));
      animateCounter(document.getElementById("plat"));
    }

  });
}, { threshold: 0.4 });

/* راقب النص والعناصر */
mainObserver.observe(mr);
document.querySelectorAll(".reveal").forEach(el => mainObserver.observe(el));
mainObserver.observe(document.querySelector(".subscribe"));


