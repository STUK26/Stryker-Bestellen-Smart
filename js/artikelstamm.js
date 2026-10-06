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

async function artikelLaden() {

      try {

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error('HTTP-Fehler: ' + response.status);
        }

        artikelstamm = await response.json();

        document.getElementById('status').textContent =
          artikelstamm.length + ' Datensätze geladen.';

      } catch (fehler) {

        document.getElementById('status').textContent =
          'Fehler beim Laden: ' + fehler.message;

      }

    }


function artikelAufnehmen(quelle) {

      const ergebnis =
        document.getElementById('ergebnis');

      if (quelle === 'manuell') {
        const artikelnummer = unbekannterBarcode;
        ergebnis.innerHTML =
          '<h3>Neuer Artikel</h3>' +
          '<p>Artikelnummer: ' + artikelnummer + '</p>' +
          '<input type="text" id="neueBezeichnung" placeholder="Bezeichnung" autocomplete="off">' +
          '<p><button onclick="neuenArtikelVorschlagen(\'' + artikelnummer + '\', \'\')">Artikel vorschlagen</button></p>';
        document.getElementById('neueBezeichnung').focus();
        return;
      }

      ergebnis.innerHTML =
        '<h3>Neuen Artikel aufnehmen</h3>' +

        '<p>Barcode: ' +
        unbekannterBarcode +
        '</p>' +

        '<input ' +
        'type="text" ' +
        'id="neueArtikelnummer" ' +
        'placeholder="Artikelnummer" ' +
        'autocomplete="off">' +

        '<p>' +

        '<button onclick="artikelnummerPruefen()">' +
        'Weiter' +
        '</button>' +

        '</p>';

      document
        .getElementById('neueArtikelnummer')
        .focus();

    }


function artikelnummerPruefen() {

      const artikelnummer = document
        .getElementById('neueArtikelnummer')
        .value
        .trim();

      if (!artikelnummer) {

        alert('Bitte Artikelnummer eingeben.');
        return;

      }


      const bekannterArtikel =
        artikelstamm.find(item =>
          item.artikelnummer === artikelnummer
        );


      if (bekannterArtikel) {

        const ergebnis =
          document.getElementById('ergebnis');

        ergebnis.innerHTML =
          '<h3>Artikel bereits bekannt:</h3>' +

          '<p>Artikelnummer: ' +
          bekannterArtikel.artikelnummer +
          '</p>' +

          '<p>Bezeichnung: ' +
          bekannterArtikel.bezeichnung +
          '</p>' +

          '<p>Neuer Barcode: ' +
          unbekannterBarcode +
          '</p>' +

          '<button onclick="barcodeVorschlagen(\'' +
          bekannterArtikel.artikelnummer +
          '\', \'' +
          encodeURIComponent(
            bekannterArtikel.bezeichnung
          ) +
          '\', \'' +
          encodeURIComponent(
            unbekannterBarcode
          ) +
          '\')">' +
          'Barcode vorschlagen' +
          '</button>';

        return;

      }


      const ergebnis =
        document.getElementById('ergebnis');

      ergebnis.innerHTML =
        '<h3>Neuer Artikel</h3>' +

        '<p>Artikelnummer: ' +
        artikelnummer +
        '</p>' +

        '<p>Barcode: ' +
        unbekannterBarcode +
        '</p>' +

        '<input ' +
        'type="text" ' +
        'id="neueBezeichnung" ' +
        'placeholder="Bezeichnung" ' +
        'autocomplete="off">' +

        '<p>' +

        '<button onclick="neuenArtikelVorschlagen(\'' +
        artikelnummer +
        '\', \'' +
        encodeURIComponent(
          unbekannterBarcode
        ) +
        '\')">' +
        'Artikel vorschlagen' +
        '</button>' +

        '</p>';

    }


async function barcodeVorschlagen(
      artikelnummer,
      bezeichnungEncoded,
      barcodeEncoded
    ) {

      const bezeichnung =
        decodeURIComponent(bezeichnungEncoded);

      const barcode =
        decodeURIComponent(barcodeEncoded);

      await vorschlagSenden(
        artikelnummer,
        bezeichnung,
        barcode
      );

    }


async function neuenArtikelVorschlagen(
      artikelnummer,
      barcodeEncoded = ''
    ) {

      const bezeichnung = document
        .getElementById('neueBezeichnung')
        .value
        .trim();

      if (!bezeichnung) {

        alert('Bitte Bezeichnung eingeben.');
        return;

      }

      const barcode = barcodeEncoded
        ? decodeURIComponent(barcodeEncoded)
        : '';

      await vorschlagSenden(
        artikelnummer,
        bezeichnung,
        barcode
      );

    }


function vorschlagAlsBestellartikelAnzeigen(
      artikelnummer,
      bezeichnung,
      meldung
    ) {
      aktuellerArtikel = {
        artikelnummer: String(artikelnummer),
        bezeichnung: String(bezeichnung),
        barcode: String(unbekannterBarcode || '')
      };

      const ergebnis =
        document.getElementById('ergebnis');

      ergebnis.innerHTML =
        '<p><strong>' +
        meldung +
        '</strong></p>' +

        '<p><strong>Artikelnummer:</strong> ' +
        escapeHtml(aktuellerArtikel.artikelnummer) +
        '</p>' +

        '<p><strong>Bezeichnung:</strong> ' +
        escapeHtml(aktuellerArtikel.bezeichnung) +
        '</p>' +

        '<p>' +
        '<label>Menge: </label>' +
        '<input ' +
        'type="text" ' +
        'id="menge" ' +
        'inputmode="numeric" ' +
        'value="1" ' +
        'min="1" ' +
        'style="width:60px;">' +
        '</p>' +

        '<button type="button" id="vorschlagZurBestellungBtn" onclick="zurBestellung()">' +
        '<svg class="uiIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
        '<span>Zur Bestellung</span>' +
        '</button>';
    }


async function vorschlagSenden(
      artikelnummer,
      bezeichnung,
      barcode
    ) {

      const ergebnis =
        document.getElementById('ergebnis');

      const van = vanHolen();


      if (!van) {

        alert(
          'VAN ist noch nicht eingestellt.'
        );

        return;

      }


      try {

        const response = await fetch(API_URL, {

          method: 'POST',

          body: JSON.stringify({

            van: van,
            artikelnummer: artikelnummer,
            bezeichnung: bezeichnung,
            barcode: barcode

          })

        });


        if (!response.ok) {

          throw new Error(
            'HTTP-Fehler: ' +
            response.status
          );

        }


        const antwort =
          await response.json();


        if (antwort.bereitsVorhanden) {
          const meldung = 'Vorschlag bereits vorhanden.';
          vorschlagAlsBestellartikelAnzeigen(
            artikelnummer,
            bezeichnung,
            meldung
          );
        } else {
          const meldung = 'Vorschlag gespeichert.';
          vorschlagAlsBestellartikelAnzeigen(
            artikelnummer,
            bezeichnung,
            meldung
          );
        }


      } catch (fehler) {

        ergebnis.innerHTML =
          '<p><strong>Fehler beim Speichern:</strong> ' +
          fehler.message +
          '</p>';

      }

    }
