document.addEventListener("DOMContentLoaded", () => {
  console.log('ready');

  // Forms
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')
  if (forms.length) {
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
  }

  // ScrollMagic
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

});
