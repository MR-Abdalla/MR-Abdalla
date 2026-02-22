class ImageSlider {
  constructor() {
    this.track = document.getElementById('sliderTrack');
    this.slides = document.querySelectorAll('.slide');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.dots = document.querySelectorAll('.dot');
    
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    
    this.init();
  }

  init() {
    this.updateSliderPosition();
    this.setupEventListeners();
    this.startAutoPlay();
  }

  setupEventListeners() {
    this.prevBtn.addEventListener('click', () => this.goToPrev());
    this.nextBtn.addEventListener('click', () => this.goToNext());

    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // لوحة المفاتيح
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.goToPrev();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.goToNext();
      }
    });

    // إيقاف التشغيل التلقائي عند التفاعل
    this.track.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.track.addEventListener('mouseleave', () => this.startAutoPlay());
  }

  goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= this.totalSlides) index = this.totalSlides - 1;
    
    this.currentIndex = index;
    this.updateSliderPosition();
    this.updateActiveDot();
  }

  goToPrev() {
    if (this.currentIndex > 0) {
      this.goToSlide(this.currentIndex - 1);
    } else {
      this.goToSlide(this.totalSlides - 1); // يرجع لآخر صورة
    }
  }

  goToNext() {
    if (this.currentIndex < this.totalSlides - 1) {
      this.goToSlide(this.currentIndex + 1);
    } else {
      this.goToSlide(0); // يرجع لأول صورة
    }
  }

  updateSliderPosition() {
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
  }

  updateActiveDot() {
    this.dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }



  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }
}

// تشغيل السلايدر
document.addEventListener('DOMContentLoaded', () => {
  new ImageSlider();
});