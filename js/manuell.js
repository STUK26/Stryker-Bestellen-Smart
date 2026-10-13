function manuelleEingabeOeffnen() {
      const bereich = document.getElementById('manuelleEingabe');
      const suche = document.getElementById('suche');
      const ergebnis = document.getElementById('ergebnis');
      const innen = bereich.querySelector('.eingabeOverlayInnen');

      if (ergebnis && innen) innen.appendChild(ergebnis);
      bereich.style.display = 'block';
      suche.value = '';
      ergebnis.innerHTML = '';
      suche.focus();
    }

    function manuelleEingabeSchliessen() {
      const bereich = document.getElementById('manuelleEingabe');
      bereich.style.display = 'none';
      document.getElementById('ergebnis').innerHTML = '';
      document.getElementById('suche').value = '';
      aktuellerArtikel = null;
    }


// GitHub-Test: Tastaturtyp wechseln, ohne iOS-Fokus künstlich zu erzwingen.
// Nach dem Wechsel das Eingabefeld erneut antippen.
function tastaturModusWechseln() {
  const suche = document.getElementById('suche');
  const knopf = document.getElementById('tastaturWechsel');
  const hinweis = document.getElementById('tastaturHinweis');
  if (!suche || !knopf) return;
  const buchstaben = suche.getAttribute('inputmode') !== 'text';
  suche.blur();
  suche.setAttribute('inputmode', buchstaben ? 'text' : 'numeric');
  knopf.textContent = buchstaben ? '123' : 'ABC';
  knopf.setAttribute('aria-label', buchstaben ? 'Auf Zahlentastatur wechseln' : 'Auf Buchstabentastatur wechseln');
  if (hinweis) hinweis.style.display = 'block';
}
