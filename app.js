window.AT = (() => {
  const WA = '5493512101172';
  const EMAIL = 'alquilerestemporadas01@gmail.com';
  const INSTAGRAM = 'https://www.instagram.com/alquilerestemporadas/';
  const FACEBOOK = 'https://www.facebook.com/RefugioSerrano.TalaHuasi';

  const icon = (name, hex) => `https://cdn.simpleicons.org/${name}/${hex}`;

  function renderHeader(active='') {
    const target = document.querySelector('[data-site-header]');
    if (!target) return;
    target.innerHTML = `
      <header class="site-header">
        <a class="brand" href="index.html" aria-label="Inicio Alquileres Temporales">
          <span class="brand-badges"><img src="assets/rs-badge.png" alt=""><img src="assets/lq-badge.png" alt=""></span>
          <span><b>ALQUILERES TEMPORALES</b><small>DESCANSÁ. DISFRUTÁ. CONECTÁ.</small></span>
        </a>
        <button class="menu-toggle" aria-label="Abrir menú">☰</button>
        <nav class="site-nav">
          <a class="${active==='home'?'active':''}" href="index.html">Inicio</a>
          <a class="${active==='refugio'?'active':''}" href="refugio-serrano.html">Refugio Serrano</a>
          <a class="${active==='quinta'?'active':''}" href="la-quinta.html">La Quinta</a>
          <a class="${active==='disponibilidad'?'active':''}" href="disponibilidad.html">Disponibilidad</a>
          <a class="${active==='quienes'?'active':''}" href="quienes-somos.html">Quiénes somos</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <div class="header-social">
          <a target="_blank" rel="noopener" href="${INSTAGRAM}" aria-label="Instagram"><img src="${icon('instagram','E4405F')}" alt="Instagram"></a>
          <a target="_blank" rel="noopener" href="${FACEBOOK}" aria-label="Facebook"><img src="${icon('facebook','1877F2')}" alt="Facebook"></a>
        </div>
        <a class="wa-pill" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=Hola%2C%20quisiera%20hacer%20una%20consulta."><img src="${icon('whatsapp','FFFFFF')}" alt=""> <span><b>Consultanos</b><small>351 2101172</small></span></a>
      </header>`;
    const toggle = target.querySelector('.menu-toggle');
    const nav = target.querySelector('.site-nav');
    toggle?.addEventListener('click', () => nav.classList.toggle('open'));
  }

  function renderFooter() {
    const footer = document.querySelector('[data-site-footer]');
    if (!footer) return;
    footer.innerHTML = `
      <footer class="site-footer" id="contacto">
        <div class="footer-brand">
          <span class="footer-badges"><img src="assets/rs-badge.png" alt="RS"><img src="assets/lq-badge.png" alt="LQ"></span>
          <span><b>ALQUILERES TEMPORALES</b><small>DESCANSÁ. DISFRUTÁ. CONECTÁ.</small></span>
        </div>
        <div class="footer-links">
          <a target="_blank" rel="noopener" href="https://wa.me/${WA}"><img src="${icon('whatsapp','FFFFFF')}" alt="">351 2101172</a>
          <a href="mailto:${EMAIL}"><img src="${icon('gmail','EA4335')}" alt="">${EMAIL}</a>
          <a target="_blank" rel="noopener" href="${INSTAGRAM}"><img src="${icon('instagram','FFFFFF')}" alt="">@alquilerestemporadas</a>
          <a target="_blank" rel="noopener" href="${FACEBOOK}"><img src="${icon('facebook','FFFFFF')}" alt="">Refugio Serrano</a>
        </div>
        <div class="footer-place"><b>Córdoba, Argentina</b><small>Siempre hay un buen lugar para volver.</small></div>
      <div class="footer-legal"><a href="quienes-somos.html">Quiénes somos</a><a href="terminos.html">Términos y condiciones</a><a href="privacidad.html">Privacidad</a><a href="contrato-refugio.html">Contrato Refugio</a><a href="acuerdo-la-quinta.html">Condiciones La Quinta</a></div></footer>`;
  }

  function renderContact() {
    const t = document.querySelector('[data-contact]');
    if (!t) return;
    t.innerHTML = `<section class="contact-band"><div><p class="eyebrow dark">CONTACTO DIRECTO</p><h2>¿Tenés alguna consulta?</h2><p>Escribinos por WhatsApp o mail y te respondemos a la brevedad.</p></div><div class="contact-actions"><a class="btn green" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=Hola%2C%20quisiera%20hacer%20una%20consulta."><img class="btn-icon" src="${icon('whatsapp','FFFFFF')}" alt=""> WhatsApp</a><a class="btn ghost" href="mailto:${EMAIL}"><img class="btn-icon" src="${icon('gmail','EA4335')}" alt=""> Email</a></div></section>`;
  }

  function setupLightbox() {
    const box = document.querySelector('.lightbox');
    const buttons = [...document.querySelectorAll('[data-lightbox]')];
    if (!box || !buttons.length) return;
    const img = box.querySelector('img');
    const counter = box.querySelector('.lightbox-counter');
    const sources = buttons.map(b => b.dataset.lightbox);
    let current = 0;
    const show = i => {
      current = (i + sources.length) % sources.length;
      img.src = sources[current];
      counter.textContent = `${current + 1} / ${sources.length}`;
      box.classList.add('open');
      document.body.classList.add('no-scroll');
    };
    buttons.forEach((b,i) => b.addEventListener('click', () => show(i)));
    box.querySelector('.lightbox-close').addEventListener('click', () => {box.classList.remove('open');document.body.classList.remove('no-scroll');});
    box.querySelector('.lightbox-prev').addEventListener('click', () => show(current-1));
    box.querySelector('.lightbox-next').addEventListener('click', () => show(current+1));
    box.addEventListener('click', e => { if (e.target === box) { box.classList.remove('open'); document.body.classList.remove('no-scroll'); }});
    addEventListener('keydown', e => {
      if (!box.classList.contains('open')) return;
      if (e.key === 'ArrowRight') show(current+1);
      if (e.key === 'ArrowLeft') show(current-1);
      if (e.key === 'Escape') {box.classList.remove('open');document.body.classList.remove('no-scroll');}
    });
  }

  function setupResponsiveVideo() {
    document.querySelectorAll('[data-responsive-video]').forEach(video => {
      const set = () => {
        const src = matchMedia('(max-width:700px)').matches ? video.dataset.mobileSrc : video.dataset.desktopSrc;
        if (video.dataset.loadedSrc === src) return;
        video.src = src;
        video.dataset.loadedSrc = src;
        video.load();
      };
      set();
      addEventListener('resize', set);
    });
  }

  function setupNewsletter() {
    document.querySelectorAll('[data-newsletter-form]').forEach(form => {
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const status = form.querySelector('[data-status]');
        const fd = new FormData(form);
        if (fd.get('consent') !== 'yes') {
          status.innerHTML = '<p class="status error">Necesitamos tu consentimiento para enviarte promociones.</p>';
          return;
        }
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        status.innerHTML = '<p class="status info">Guardando tus datos…</p>';
        try {
          await ATDB.addLead({ nombre: fd.get('name'), email: fd.get('email'), whatsapp: fd.get('phone'), acepta_promociones: true });
          form.reset();
          status.innerHTML = '<p class="status success">¡Listo! Quedaste registrado para recibir novedades y promociones.</p>';
        } catch (err) {
          console.error(err);
          status.innerHTML = '<p class="status error">No pudimos guardar tus datos. Intentá nuevamente en unos segundos.</p>';
        } finally { btn.disabled = false; }
      });
    });
  }

  function init() {
    renderFooter();
    renderContact();
    setupLightbox();
    setupResponsiveVideo();
    setupNewsletter();
  }
  document.addEventListener('DOMContentLoaded', init);

  return { renderHeader, wa: WA };
})();
