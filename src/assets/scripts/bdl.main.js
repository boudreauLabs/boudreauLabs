document.addEventListener("DOMContentLoaded", () => {
  console.log('ready', ScrollMagic);

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
