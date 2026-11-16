(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('[data-depth]');
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  let frame = 0;
  let observer;

  function paintDepth() {
    frame = 0;
    const { top, bottom } = hero.getBoundingClientRect();
    if (bottom <= 0 || top > innerHeight) return;
    hero.style.setProperty('--depth-shift', Math.min(16, Math.max(0, -top * .1)) + 'px');
  }

  function requestDepth() {
    if (!frame) frame = requestAnimationFrame(paintDepth);
  }

  function syncMotion() {
    observer?.disconnect();
    if (hero) {
      removeEventListener('scroll', requestDepth);
      removeEventListener('resize', requestDepth);
      cancelAnimationFrame(frame);
      frame = 0;
      hero.style.removeProperty('--depth-shift');
      if (!preference.matches) {
        addEventListener('scroll', requestDepth, { passive: true });
        addEventListener('resize', requestDepth);
        requestDepth();
      }
    }
    if (preference.matches || !('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    }, { threshold: .12 });
    for (const element of reveals) {
      if (!element.classList.contains('is-revealed')) observer.observe(element);
    }
  }

  preference.addEventListener('change', syncMotion);
  syncMotion();

  const gallery = document.querySelector('[data-gallery]');
  const dialog = document.querySelector('[data-photo-dialog]');
  if (!gallery || !dialog?.showModal) return;

  const entries = [...gallery.querySelectorAll('[data-lightbox]')];
  const image = dialog.querySelector('img');
  const caption = dialog.querySelector('[data-photo-caption]');
  const counter = dialog.querySelector('.lightbox-counter');
  const rail = dialog.querySelector('[data-photo-rail]');
  const stage = dialog.querySelector('[data-photo-stage]');
  const close = dialog.querySelector('.lightbox-close');
  let thumbnails = [];
  let current = 0;
  let opener;
  let start;

  function select(index) {
    current = (index + entries.length) % entries.length;
    const { lightbox, photoLabel } = entries[current].dataset;
    image.src = lightbox;
    image.alt = photoLabel;
    caption.textContent = photoLabel;
    counter.textContent = (current + 1) + ' / ' + entries.length;
    thumbnails.forEach((thumbnail, i) => {
      if (i === current) thumbnail.setAttribute('aria-current', 'true');
      else thumbnail.removeAttribute('aria-current');
    });
    const active = thumbnails[current];
    if (active.offsetLeft < rail.scrollLeft) rail.scrollLeft = active.offsetLeft;
    if (active.offsetLeft + active.offsetWidth > rail.scrollLeft + rail.clientWidth) {
      rail.scrollLeft = active.offsetLeft + active.offsetWidth - rail.clientWidth;
    }
    if (!preference.matches && image.animate) {
      image.getAnimations().forEach(animation => animation.cancel());
      image.animate([{ opacity: .72 }, { opacity: 1 }], { duration: 180 });
    }
  }

  function buildThumbnails() {
    thumbnails = entries.map((entry, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', 'Foto ' + (index + 1) + ': ' + entry.dataset.photoLabel);
      const thumb = document.createElement('img');
      thumb.src = entry.dataset.thumb;
      thumb.alt = '';
      thumb.loading = 'lazy';
      thumb.decoding = 'async';
      button.append(thumb);
      button.addEventListener('click', () => select(index));
      return button;
    });
    rail.append(...thumbnails);
  }

  entries.forEach((entry, index) => {
    if (entry.hidden) return;
    entry.addEventListener('click', () => {
      opener = entry;
      if (!thumbnails.length) buildThumbnails();
      dialog.showModal();
      document.body.classList.add('no-scroll');
      select(index);
      close.focus();
    });
  });

  close.addEventListener('click', () => dialog.close());
  dialog.querySelector('.lightbox-prev').addEventListener('click', () => select(current - 1));
  dialog.querySelector('.lightbox-next').addEventListener('click', () => select(current + 1));
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('no-scroll');
    start = null;
    opener?.focus({ preventScroll: true });
  });
  dialog.addEventListener('keydown', event => {
    if (rail.contains(event.target) || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    select(current + (event.key === 'ArrowRight' ? 1 : -1));
  });
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch' || event.target.closest('button')) return;
    start = { id: event.pointerId, x: event.clientX, y: event.clientY };
    stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointercancel', () => { start = null; });
  stage.addEventListener('pointerup', event => {
    if (!start || event.pointerId !== start.id) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    start = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) select(current + (dx < 0 ? 1 : -1));
  });
})();
