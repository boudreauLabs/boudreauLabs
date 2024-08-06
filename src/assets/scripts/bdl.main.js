
document.addEventListener("DOMContentLoaded", () => {
  console.log('ready');


  // Forms
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  // https://getbootstrap.com/docs/5.3/forms/validation/
  const forms = document.querySelectorAll('.needs-validation');
  let tsValid = false;
  window.turnstileCallback = function () { tsValid = true; };
  window.turnstileErrorCallback = function () { tsValid = false; };
  if (forms.length) {
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (form.checkValidity() == false || tsValid == false) {
          event.preventDefault()
          event.stopPropagation()
        }
        form.classList.add('was-validated')
      }, false)
    })
  }

  // ScrollMagic
  // https://scrollmagic.io/docs/
	const scrollController = new ScrollMagic.Controller();
  const scrlFadeEls = document.getElementsByClassName('js-fadein');
  const progressEls = document.getElementsByClassName('js-progress');
  if (scrlFadeEls.length) {
    for (const fadeEl of scrlFadeEls) { // create a scene for each element
      new ScrollMagic.Scene({
        triggerElement: fadeEl,
        offset: 50,
        triggerHook: 0.9
      })
      .setClassToggle(fadeEl, 'visible')
      .addTo(scrollController);
    }
  }

  if (progressEls.length) {
    for (const progEl of progressEls) { // create a scene for each element
      new ScrollMagic.Scene({
        triggerElement: progEl,
        offset: 20,
        triggerHook: 0.9
      })
      .addTo(scrollController)
      .on('start', function (e) {
        let progressW = progEl.dataset.progressWidth;
        let prgressBar = progEl.querySelector('.progress-bar');
        prgressBar.style.width = progressW;
      });
    }
  }
  // ScrollMagic

  // Swiper
  // https://swiperjs.com/swiper-api
  const projectCarousells = document.getElementsByClassName('swiper');
  if (projectCarousells.length) {
    let slideOpts = {
      loop: false,
      autoplay: {
        delay: 5000,
      },
      slidesPerView: 1,
      spaceBetween: 12,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      pagination: {
        clickable: true,
        el: ".swiper-pagination",
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      speed: 1000,
    };
    for (const slider of projectCarousells) {
      new Swiper(slider, slideOpts);
    }
  }
  // Swiper

});
