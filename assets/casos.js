/* Casos: "Ver los números y la captura" abre una ventana interna en vez de desplegar la tarjeta.
   Sin JavaScript queda el desplegable de siempre. */
(function () {
  var detalles = document.querySelectorAll('.detalle-caso');
  if (!detalles.length || typeof HTMLDialogElement !== 'function') return;

  var v = document.createElement('dialog');
  v.className = 'ventana-caso';
  v.setAttribute('aria-labelledby', 'ventana-titulo');
  v.innerHTML = '<button type="button" class="ventana-cerrar" aria-label="Cerrar">&times;</button><div class="ventana-cuerpo"></div>';
  document.body.appendChild(v);
  var cuerpo = v.querySelector('.ventana-cuerpo');
  var origen = null;

  function cerrar() { v.close(); }
  v.querySelector('.ventana-cerrar').addEventListener('click', cerrar);
  v.addEventListener('click', function (e) { if (e.target === v) cerrar(); });
  v.addEventListener('close', function () { cuerpo.innerHTML = ''; if (origen) origen.focus(); });

  detalles.forEach(function (d) {
    var caso = d.closest('.caso');
    var cifra = caso.querySelector('.cifra');
    var cifraFinal = cifra ? cifra.innerHTML : '';
    var resumen = d.querySelector('summary');
    resumen.setAttribute('aria-haspopup', 'dialog');
    resumen.addEventListener('click', function (e) {
      e.preventDefault();
      origen = resumen;
      var cab = document.createElement('div');
      cab.className = 'ventana-cabeza';
      cab.innerHTML =
        '<p class="chip" id="ventana-titulo">' + caso.querySelector('.chip').textContent + '</p>' +
        '<p class="periodo">' + caso.querySelector('.periodo').textContent + '</p>' +
        '<p class="cifra">' + cifraFinal + '</p>' +
        '<p class="lectura">' + caso.querySelector('.lectura').textContent + '</p>';
      cuerpo.innerHTML = '';
      cuerpo.appendChild(cab);
      Array.prototype.forEach.call(d.children, function (h) {
        if (h !== resumen) cuerpo.appendChild(h.cloneNode(true));
      });
      cuerpo.querySelectorAll('img[loading]').forEach(function (i) { i.removeAttribute('loading'); });
      v.showModal();
      v.scrollTop = 0;
      if (typeof gtag === 'function') gtag('event', 'ver_caso', { caso: caso.id });
    });
  });
})();
