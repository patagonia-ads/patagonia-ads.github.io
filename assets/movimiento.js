/* Movimiento del sitio: entrada 3D al scrollear, cifras que suben e inclinación con el mouse
   en las tarjetas que son links. Sin librerías. Si la persona pidió menos movimiento, no corre nada. */
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('mov');

  // 1. Entrada 3D: las piezas llegan inclinadas y se enderezan, en cascada por grilla
  document.querySelectorAll('.grilla, .marcador-lista').forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (h, i) { h.style.setProperty('--orden', i % 5); });
  });
  var piezas = document.querySelectorAll('.tarjeta, .preguntas details, .pasos li, .marcador-lista li');
  var vista = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('visto');
      vista.unobserve(e.target);
      e.target.querySelectorAll('.cifra, .cifra-m').forEach(contar);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
  piezas.forEach(function (p) { vista.observe(p); });

  // 2. Cifras que suben desde cero hasta el número real (el texto final ya está en el HTML)
  function contar(caja) {
    var el = caja.querySelector('.cn') || caja;
    var final = el.textContent.trim();
    var m = final.match(/^([^\d]*)([\d.]+(?:,\d+)?)(.*)$/);
    if (!m) return;
    var pre = m[1], suf = m[3], txt = m[2];
    var dec = txt.indexOf(',') > -1 ? txt.split(',')[1].length : 0;
    var meta = parseFloat(txt.replace(/\./g, '').replace(',', '.'));
    caja.setAttribute('aria-label', caja.textContent.trim());
    var t0 = null, dur = 1100;
    function paso(ts) {
      if (t0 === null) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + (meta * e).toFixed(dec).replace('.', ',') + suf;
      if (k < 1) requestAnimationFrame(paso); else el.textContent = final;
    }
    requestAnimationFrame(paso);
  }

  // 3. Inclinación 3D con el mouse, solo en tarjetas que son links (las que no lo son no deben parecerlo)
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('a.tarjeta').forEach(function (t) {
    t.addEventListener('pointermove', function (ev) {
      var r = t.getBoundingClientRect();
      var x = (ev.clientX - r.left) / r.width - 0.5, y = (ev.clientY - r.top) / r.height - 0.5;
      t.style.setProperty('--ry', (x * 7).toFixed(2) + 'deg');
      t.style.setProperty('--rx', (-y * 7).toFixed(2) + 'deg');
      t.classList.add('inclinada');
    });
    t.addEventListener('pointerleave', function () {
      t.style.setProperty('--rx', '0deg'); t.style.setProperty('--ry', '0deg');
      t.classList.remove('inclinada');
    });
  });
})();
