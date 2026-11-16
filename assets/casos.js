/* Casos: "Ver los números y la captura" abre una ventana interna en vez de desplegar la tarjeta.
   Sin JavaScript queda el desplegable de siempre. */
(function () {
  var detalles = document.querySelectorAll('.detalle-caso');
  if (!detalles.length || typeof HTMLDialogElement !== 'function') return;

  var v = document.createElement('dialog');
  v.className = 'ventana-caso';
  v.setAttribute('aria-labelledby', 'ventana-titulo');
  v.innerHTML =
    '<button type="button" class="ventana-cerrar" aria-label="Cerrar">&times;</button>' +
    '<div class="ventana-cuerpo"></div>' +
    '<nav class="ventana-nav" aria-label="Otros casos">' +
      '<button type="button" class="ventana-flecha" data-paso="-1"><span aria-hidden="true">&larr;</span> <span class="ventana-flecha-txt"></span></button>' +
      '<p class="ventana-pos"></p>' +
      '<button type="button" class="ventana-flecha" data-paso="1"><span class="ventana-flecha-txt"></span> <span aria-hidden="true">&rarr;</span></button>' +
    '</nav>';
  document.body.appendChild(v);
  var cuerpo = v.querySelector('.ventana-cuerpo');
  var pos = v.querySelector('.ventana-pos');
  var flechas = v.querySelectorAll('.ventana-flecha');
  var origen = null, actual = 0;

  function rubro(caso) { return caso.querySelector('.chip').textContent.split('·')[0].trim(); }

  var casos = Array.prototype.map.call(detalles, function (d) {
    var caso = d.closest('.caso');
    var cifra = caso.querySelector('.cifra');
    return { d: d, caso: caso, cifra: cifra ? cifra.innerHTML : '', resumen: d.querySelector('summary') };
  });

  function mostrar(i, animar) {
    actual = (i + casos.length) % casos.length;
    var c = casos[actual], caso = c.caso;
    var cab = document.createElement('div');
    cab.className = 'ventana-cabeza';
    cab.innerHTML =
      '<p class="chip" id="ventana-titulo">' + caso.querySelector('.chip').textContent + '</p>' +
      '<p class="periodo">' + caso.querySelector('.periodo').textContent + '</p>' +
      '<p class="cifra">' + c.cifra + '</p>' +
      '<p class="lectura">' + caso.querySelector('.lectura').textContent + '</p>';
    cuerpo.innerHTML = '';
    cuerpo.appendChild(cab);
    Array.prototype.forEach.call(c.d.children, function (h) {
      if (h !== c.resumen) cuerpo.appendChild(h.cloneNode(true));
    });
    cuerpo.querySelectorAll('img[loading]').forEach(function (img) { img.removeAttribute('loading'); });
    pos.textContent = (actual + 1) + ' de ' + casos.length;
    [[0, -1, 'Caso anterior: '], [1, 1, 'Caso siguiente: ']].forEach(function (f) {
      var r = rubro(casos[(actual + f[1] + casos.length) % casos.length].caso);
      flechas[f[0]].querySelector('.ventana-flecha-txt').textContent = r;
      flechas[f[0]].setAttribute('aria-label', f[2] + r);
    });
    v.scrollTop = 0;
    if (animar) { cuerpo.classList.remove('cambia'); void cuerpo.offsetWidth; cuerpo.classList.add('cambia'); }
    if (typeof gtag === 'function') gtag('event', 'ver_caso', { caso: caso.id });
  }

  function cerrar() { v.close(); }
  v.querySelector('.ventana-cerrar').addEventListener('click', cerrar);
  v.addEventListener('click', function (e) { if (e.target === v) cerrar(); });
  v.addEventListener('close', function () { cuerpo.innerHTML = ''; if (origen) origen.focus(); });
  flechas.forEach(function (b) {
    b.addEventListener('click', function () { mostrar(actual + Number(b.dataset.paso), true); });
  });
  v.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); mostrar(actual + 1, true); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); mostrar(actual - 1, true); }
  });

  casos.forEach(function (c, i) {
    c.resumen.setAttribute('aria-haspopup', 'dialog');
    c.resumen.addEventListener('click', function (e) {
      e.preventDefault();
      origen = c.resumen;
      mostrar(i, false);
      v.showModal();
    });
  });
})();
