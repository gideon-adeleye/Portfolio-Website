  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('is-open');
    });
  }

  // CURSOR ORB ----------------------------------------------
const cursorOrb = document.querySelector('.cursor-orb');

if (cursorOrb) {
  let currentX = window.innerWidth / 2;
  let currentY = window.innerHeight / 2;
  let targetX = currentX;
  let targetY = currentY;
  const ease = 0.18;

  // show orb on first movement
  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    cursorOrb.style.opacity = 1;
  });

  function animateOrb() {
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;

    cursorOrb.style.transform =
      `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(animateOrb);
  }

  animateOrb();
}