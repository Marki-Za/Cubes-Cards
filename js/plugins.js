/* Ініціалізація сторонніх Vanilla JS-плагінів: Typed.js, Fancybox, Swiper, AOS */
document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-youtube-facade]").forEach((button) => {
    button.addEventListener("click", () => {
      const videoId = button.dataset.videoId;
      if (!videoId) return;
      const iframe = document.createElement("iframe");
      iframe.className = "h-full w-full border-0";
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1`;
      iframe.title = "Відеоогляд настільних ігор";
      iframe.loading = "eager";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.allowFullscreen = true;
      button.replaceWith(iframe);
      iframe.focus();
    });
  });

  const typedStrings = [
    "Настільні ігри для всієї родини.",
    "Кубики, карти і гарна компанія.",
    "Збери друзів — зіграй сьогодні."
  ];
  const typedElement = document.getElementById("typed-text");

  if (typedElement && typeof Typed !== "undefined") {
    if (reduceMotion) {
      typedElement.textContent = typedStrings[0];
    } else {
      new Typed("#typed-text", {
        strings: typedStrings,
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 1800,
        startDelay: 400,
        loop: true
      });
    }
  }

  if (document.querySelector('[data-fancybox="gallery"]') && typeof Fancybox !== "undefined") {
    Fancybox.bind('[data-fancybox="gallery"]', {
      Carousel: { transition: "fade" },
      Images: { Panzoom: { maxScale: 3 } },
      Thumbs: { autoStart: true }
    });
  }

  if (document.querySelector(".reviews-swiper") && typeof Swiper !== "undefined") {
    new Swiper(".reviews-swiper", {
      loop: true,
      spaceBetween: 24,
      speed: 600,
      grabCursor: true,
      autoplay: reduceMotion ? false : {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: { el: ".reviews-swiper .swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".reviews-swiper .swiper-button-next",
        prevEl: ".reviews-swiper .swiper-button-prev"
      },
      keyboard: { enabled: true },
      a11y: {
        prevSlideMessage: "Попередній відгук",
        nextSlideMessage: "Наступний відгук",
        paginationBulletMessage: "Перейти до відгуку {{index}}"
      },
      breakpoints: {
        320: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });
  }

  if (document.querySelector("[data-aos]") && typeof AOS !== "undefined") {
    AOS.init({
      once: true,
      duration: 700,
      offset: 80,
      disable: () => reduceMotion
    });
  }
});
