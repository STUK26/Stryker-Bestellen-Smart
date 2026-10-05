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
