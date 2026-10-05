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

function artikelSuchen(quelle = 'manuell') {

      const suchwert = document
        .getElementById('suche')
        .value
        .trim();

      const ergebnis =
        document.getElementById('ergebnis');

      if (!suchwert) {

        ergebnis.innerHTML = '';
        return;

      }

      const treffer = artikelstamm.find(item =>
        item.artikelnummer === suchwert ||
        item.barcode === suchwert
      );


      if (treffer) {

        aktuellerArtikel = treffer;

        ergebnis.innerHTML =
          '<p><strong>Artikelnummer:</strong> ' +
          treffer.artikelnummer +
          '</p>' +

          '<p><strong>Bezeichnung:</strong> ' +
          treffer.bezeichnung +
          '</p>' +

          '<div class="mengeFavoritZeile">' +
          '<p>' +
          '<label>Menge: </label>' +

          '<input ' +
          'type="number" ' +
          'id="menge" ' +
          'inputmode="numeric" ' +
          'value="1" ' +
          'min="1" ' +
          'style="width:60px;">' +

          '</p>' +
          '<span id="favoritStern"></span>' +
          '</div>' +

          '<button onclick="zurBestellung()">' +
          'Zur Bestellung' +
          '</button>';

        favoritSternAktualisieren();
        return;

      }


      aktuellerArtikel = null;
      unbekannterBarcode = suchwert;

      if (quelle === 'scanner') {
        ergebnis.innerHTML =
          '<p><strong>Artikel nicht bekannt.</strong></p>' +
          '<p>Barcode: ' + unbekannterBarcode + '</p>' +
          '<button type="button" id="manuellArtikelAufnehmenBtn" onclick="artikelAufnehmen()">' +
          '<svg class="uiIcon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/></svg>' +
          '<span>Artikel aufnehmen</span>' +
          '</button>';
      } else {
        ergebnis.innerHTML =
          '<p><strong>Artikel nicht bekannt.</strong></p>' +
          '<p>Artikelnummer: ' + suchwert + '</p>' +
          '<button type="button" id="manuellArtikelAufnehmenBtn" onclick="artikelAufnehmen(\'manuell\')">' +
          '<svg class="uiIcon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/></svg>' +
          '<span>Artikel aufnehmen</span>' +
          '</button>';
      }

    }
