(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const scene = document.querySelector('.cinematic-scene');
  const petmoments = document.querySelector('.petmoments');
  const petCards = petmoments ? [...petmoments.querySelectorAll('.pm-card')] : [];
  const video = document.querySelector('.cinematic-video');

  if (video && !reducedMotion) {
    video.addEventListener('canplay', () => video.classList.add('is-ready'), { once: true });
    video.addEventListener('error', () => video.classList.remove('is-ready'));
    const playVideo = () => {
      if (video.readyState >= 2) video.play().catch(() => {});
    };
    playVideo();
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) video.pause();
      else playVideo();
    });
  }

  const revealItems = document.querySelectorAll('[data-reveal], .resource-card, .section-heading, .community-feature, .community-stat, .community-join');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -45px 0px' });
    revealItems.forEach(item => {
      if (!item.hasAttribute('data-reveal')) item.setAttribute('data-reveal', 'item');
      observer.observe(item);
    });
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  let ticking = false;
  const updateScrollEffects = () => {
    const scrollY = window.scrollY || 0;
    if (header) header.classList.toggle('is-scrolled', scrollY > 12);
    if (petmoments && !reducedMotion) {
      const rect = petmoments.getBoundingClientRect();
      const travel = Math.max(1, petmoments.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      petmoments.style.setProperty('--pm-progress', progress.toFixed(3));
      petCards.forEach((card, index) => {
        const x = parseFloat(getComputedStyle(card).getPropertyValue('--pm-x')) || 0;
        const y = parseFloat(getComputedStyle(card).getPropertyValue('--pm-y')) || 0;
        const z = parseFloat(getComputedStyle(card).getPropertyValue('--pm-z')) || 0;
        const rotation = parseFloat(getComputedStyle(card).getPropertyValue('--pm-r')) || 0;
        const scale = parseFloat(getComputedStyle(card).getPropertyValue('--pm-s')) || 1;
        const phase = progress * 2 - 1;
        const driftX = phase * (window.innerWidth < 760 ? 95 : 150) * (index % 2 ? -1 : 1);
        const driftY = phase * (index % 2 ? -28 : 22);
        card.style.transform = `translate3d(calc(-50% + ${x} + ${driftX}px), calc(-50% + ${y} + ${driftY}px), ${z + Math.sin(progress * Math.PI * 2 + index) * 70}px) rotateY(${rotation + phase * 8}deg) rotateZ(${rotation * .18}deg) scale(${scale})`;
      });
    }
    if (scene && !reducedMotion) {
      const rect = scene.getBoundingClientRect();
      const travel = Math.max(1, scene.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      scene.style.setProperty('--scene-progress', progress.toFixed(3));
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', updateScrollEffects, { passive: true });
  if (petmoments && !reducedMotion) {
    petCards.forEach((card, index) => {
      card.addEventListener('pointermove', event => {
        if (event.pointerType !== 'mouse') return;
        const rect = card.getBoundingClientRect();
        const rx = ((event.clientY - rect.top) / rect.height - .5) * -7;
        const ry = ((event.clientX - rect.left) / rect.width - .5) * 7;
        card.style.setProperty('--pm-rx', `${rx}deg`);
        card.style.setProperty('--pm-ry', `${ry}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--pm-rx');
        card.style.removeProperty('--pm-ry');
      });
    });
  }
  updateScrollEffects();
  if (petmoments && reducedMotion) petCards.forEach(card => { card.style.transform = 'translate3d(-50%,-50%,0) scale(.82)'; });
})();
