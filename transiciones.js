(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const scene = document.querySelector('.cinematic-scene');
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
  updateScrollEffects();
})();
