/* Bestell Smart – GitHub-Safari-Test, 13.10.2026.
 * Kein neuer Scrollcontainer und keine Scrollsperre.
 * Unterbindet nur die Abwärts-Wischgeste am bereits erreichten Seitenanfang,
 * die sonst Safaris Pull-to-Refresh auslösen kann.
 * Berührt keine Eingaben und keine separat scrollbareren Overlays.
 */
(function () {
  'use strict';
  let startY = null;
  let startX = null;
  let startOben = false;

  function dokumentOben() {
    const seite = document.scrollingElement || document.documentElement;
    return seite.scrollTop <= 0;
  }

  document.addEventListener('touchstart', function (ereignis) {
    startY = null;
    startX = null;
    startOben = false;

    if (ereignis.touches.length !== 1 || !dokumentOben()) return;
    const element = ereignis.target;
    if (element instanceof Element) {
      // Eigene Scrollbereiche und Textbearbeitung unverändert lassen.
      if (element.closest('.eingabeOverlay, input, textarea, select, [contenteditable]')) return;
    }
    startY = ereignis.touches[0].clientY;
    startX = ereignis.touches[0].clientX;
    startOben = true;
  }, { passive: true, capture: true });

  document.addEventListener('touchmove', function (ereignis) {
    if (!startOben || startY === null || ereignis.touches.length !== 1) return;
    const deltaY = ereignis.touches[0].clientY - startY;
    const deltaX = ereignis.touches[0].clientX - startX;

    // Nur eine tatsächliche Abwärtsbewegung direkt am oberen Rand abfangen.
    // Normales Aufwärtsscrollen bleibt vollständig unangetastet.
    if (deltaY > 8 && deltaY > Math.abs(deltaX) && dokumentOben() && ereignis.cancelable) {
      ereignis.preventDefault();
    }
  }, { passive: false, capture: true });

  document.addEventListener('touchend', function () {
    startOben = false;
  }, { passive: true, capture: true });
  document.addEventListener('touchcancel', function () {
    startOben = false;
  }, { passive: true, capture: true });
})();
