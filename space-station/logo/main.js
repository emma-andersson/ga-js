const svgLogo = document.querySelector('#nasa-logo');



function animateLogo() {
  svgLogo.classList.add('play'); // the circle animation takes 1s

  const letters = svgLogo.querySelectorAll('.letters path');
  letters.forEach(function (letter, i) {
    let letterLength = letter.getTotalLength();
    letter.style.strokeDasharray = letterLength;
    letter.style.strokeDashoffset -= letterLength;

    const letterStrokeAnimation = new Promise((resolve, reject) => {
      setTimeout(function() {
        letter.style.opacity = 1; // needs to be hidden to begin with, otherwise the 1s transition is applied when initiating the strokeDashoffset
        letter.style.strokeDashoffset = 0;
        // console.log("animating", i);
        if (i === letters.length-1) {
          resolve();
        }
      }, 500 * (i+1));
    });
    function lettersFinishedAnimating() {
      setTimeout(function() {
        svgLogo.classList.add("fill-letters");
        setTimeout(function() {
          svgLogo.classList.add("animation-finished");
        }, 1000);
      }, 1000);
    }

    letterStrokeAnimation.then(lettersFinishedAnimating);
  });
}


animateLogo();