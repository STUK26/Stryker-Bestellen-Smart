function bestellungLaden() {

      try {

        const gespeichert =
          localStorage.getItem(BESTELLUNG_SPEICHER);

        if (gespeichert) {

          const daten = JSON.parse(gespeichert);

          if (Array.isArray(daten)) {
            bestellung = daten;
          }

        }

      } catch (fehler) {

        bestellung = [];

      }

      bestellungAnzeigen();

    }


    function bestellungSpeichern() {

      localStorage.setItem(
        BESTELLUNG_SPEICHER,
        JSON.stringify(bestellung)
      );

    }




    /*
     * =====================================================
     * ARTIKEL SUCHEN
     * =====================================================
     */




    /*
     * =====================================================
     * ARTIKEL ZUR BESTELLUNG
     * =====================================================
     */

    function zurBestellung() {

      if (!aktuellerArtikel) {
        return;
      }

      const menge =
        parseInt(
          document.getElementById('menge').value,
          10
        );

      if (!menge || menge < 1) {

        alert('Bitte eine gültige Menge eingeben.');
        return;

      }

      const vorhanden = bestellung.find(item =>
        item.artikelnummer ===
        aktuellerArtikel.artikelnummer
      );


      if (vorhanden) {

        vorhanden.menge += menge;

      } else {

        bestellung.push({

          artikelnummer:
            aktuellerArtikel.artikelnummer,

          bezeichnung:
            aktuellerArtikel.bezeichnung,

          menge: menge

        });

      }


      bestellungSpeichern();
      bestellungAnzeigen();

      document.getElementById('suche').value = '';
      document.getElementById('ergebnis').innerHTML = '';

      aktuellerArtikel = null;

    if (istMobil()) {
  document.getElementById('suche').blur();
} else {
  document.getElementById('suche').focus();
}

    }


    function bestellungOeffnen() {
      document.getElementById('bestellungAnsicht').style.display = 'block';
      document.getElementById('bestellungButtonBereich').style.display = 'none';

      Array.from(document.body.children).forEach(function(element) {
        if (
          element.id !== 'bestellungAnsicht' &&
          element.id !== 'bestellungButtonBereich' &&
          element.tagName !== 'SCRIPT'
        ) {
          element.dataset.vorBestellung = element.style.display || '';
          element.style.display = 'none';
        }
      });

      bestellungAnzeigen();
      window.scrollTo(0, 0);
    }


    function bestellungSchliessen() {
      Array.from(document.body.children).forEach(function(element) {
        if (
          element.id !== 'bestellungAnsicht' &&
          element.id !== 'bestellungButtonBereich' &&
          element.tagName !== 'SCRIPT'
        ) {
          element.style.display = element.dataset.vorBestellung || '';
          delete element.dataset.vorBestellung;
        }
      });

      document.getElementById('bestellungAnsicht').style.display = 'none';
      document.getElementById('bestellungButtonBereich').style.display = 'block';
      bestellungButtonAktualisieren();
      window.scrollTo(0, 0);
    }


    function bestellungButtonAktualisieren() {
      const button = document.getElementById('bestellungBtn');

      if (button) {
        button.textContent = 'Zur Bestellung → (' + bestellung.length + ')';
      }
    }


    /*
     * =====================================================
     * BESTELLLISTE
     * =====================================================
     */

    function bestellungAnzeigen() {

      bestellungButtonAktualisieren();

      const bereich =
        document.getElementById('bestellliste');

      if (bestellung.length === 0) {

        bereich.innerHTML =
          'Noch keine Artikel in der Bestellung.';

        return;

      }

      let html = '';

      bestellung.forEach((item, index) => {

        html +=
          '<div style="margin-bottom:15px;">' +

          '<strong>' +
          item.artikelnummer +
          '</strong> – ' +
          item.bezeichnung +

          '<br><br>' +

          'Menge: ' +

          '<input ' +
          'type="number" ' +
          'min="1" ' +
          'value="' +
          item.menge +
          '" ' +
          'style="width:60px;" ' +
          'onchange="mengeAendern(' +
          index +
          ', this.value)">' +

          ' ' +

          '<button onclick="positionLoeschen(' +
          index +
          ')">' +
          'Löschen' +
          '</button>' +

          '</div>';

      });

      bereich.innerHTML = html;

    }


    function mengeAendern(index, neueMenge) {

      const menge =
        parseInt(neueMenge, 10);

      if (!menge || menge < 1) {

        alert('Die Menge muss mindestens 1 sein.');

        bestellungAnzeigen();
        return;

      }

      bestellung[index].menge = menge;

      bestellungSpeichern();


    }


    function positionLoeschen(index) {

      bestellung.splice(index, 1);

      bestellungSpeichern();
      bestellungAnzeigen();


    }


    /*
 * =====================================================
 * NEUE BESTELLUNG
 * =====================================================
 */

function neueBestellung() {

  if (bestellung.length === 0) {
    alert('Die Bestellung ist bereits leer.');
    return;
  }

  const bestaetigt = confirm(
    'Aktuelle Bestellung wirklich leeren?'
  );

  if (!bestaetigt) {
    return;
  }

  bestellung = [];

  bestellungSpeichern();
  bestellungAnzeigen();


  document.getElementById('suche').value = '';
  document.getElementById('ergebnis').innerHTML = '';
  document.getElementById('manuelleEingabe').style.display = 'none';

  aktuellerArtikel = null;



}
    
function verlaufOeffnen() {
  document.getElementById('verlaufAnsicht').style.display = 'block';
  document.getElementById('verlaufButtonBereich').style.display = 'none';

  Array.from(document.body.children).forEach(function(element) {
    if (
      element.id !== 'verlaufAnsicht' &&
      element.id !== 'verlaufButtonBereich' &&
      element.tagName !== 'SCRIPT'
    ) {
      element.dataset.vorVerlauf = element.style.display || '';
      element.style.display = 'none';
    }
  });

  verlaufAnzeigen();
  window.scrollTo(0, 0);
}

function verlaufSchliessen() {
  Array.from(document.body.children).forEach(function(element) {
    if (
      element.id !== 'verlaufAnsicht' &&
      element.id !== 'verlaufButtonBereich' &&
      element.tagName !== 'SCRIPT'
    ) {
      element.style.display = element.dataset.vorVerlauf || '';
      delete element.dataset.vorVerlauf;
    }
  });

  document.getElementById('verlaufAnsicht').style.display = 'none';
  document.getElementById('verlaufButtonBereich').style.display = 'block';
  window.scrollTo(0, 0);
}

/*
 * =====================================================
 * BESTELLUNG IM VERLAUF SPEICHERN
 * =====================================================
 */

function bestellungImVerlaufSpeichern() {

  const van = vanHolen();

  let verlauf = [];

  try {

    const gespeichert =
      localStorage.getItem(VERLAUF_SPEICHER);

    if (gespeichert) {
      verlauf = JSON.parse(gespeichert);
    }

    if (!Array.isArray(verlauf)) {
      verlauf = [];
    }

  } catch (fehler) {

    verlauf = [];

  }

verlauf.unshift({
  datum: new Date().toISOString(),
  van: van,
  status: 'An Outlook übergeben',
  artikel: JSON.parse(JSON.stringify(bestellung))
});

verlauf = verlauf.slice(0, 50);
  
  localStorage.setItem(
    VERLAUF_SPEICHER,
    JSON.stringify(verlauf)
  );

}
   /*
 * =====================================================
 * VERLAUF ANZEIGEN
 * =====================================================
 */

function verlaufAnzeigen() {

  const bereich =
    document.getElementById('verlauf');

  let verlauf = [];

  try {

    const gespeichert =
      localStorage.getItem(VERLAUF_SPEICHER);

    if (gespeichert) {
      verlauf = JSON.parse(gespeichert);
    }

    if (!Array.isArray(verlauf)) {
      verlauf = [];
    }

  } catch (fehler) {

    verlauf = [];

  }

  if (verlauf.length === 0) {

    bereich.innerHTML =
      'Noch keine Bestellung an Outlook übergeben.';

    return;

  }

  let html = '';

  verlauf.forEach(eintrag => {

    const datum =
      new Date(eintrag.datum).toLocaleString('de-DE');

    html +=
      '<div style="margin-bottom:20px;">' +

      '<strong>' +
      datum +
      ' – ' +
      eintrag.van +
      '</strong>' +

      '<br>' +
      eintrag.status +
      '<br><br>';

    eintrag.artikel.forEach(item => {

      html +=
        item.menge +
        ' x ' +
        item.artikelnummer +
        ' – ' +
        item.bezeichnung +
        '<br>';

    });

    html += '</div>';

  });

  bereich.innerHTML = html;

} 
/*
 * =====================================================
 * BESTELLUNG IN OUTLOOK ÖFFNEN
 * =====================================================
 */

function bestellungInOutlook() {

  const van = vanHolen();

  if (!van) {
    alert('VAN ist noch nicht eingestellt.');
    return;
  }

  if (bestellung.length === 0) {
    alert('Die Bestellung ist leer.');
    return;
  }

  const betreff =
    'Bestellung ' + van;

  let mailtext =
    'Hallo zusammen,\n\n' +
    'bitte folgende Artikel für ' +
    van +
    ' bestellen:\n\n';

  bestellung.forEach(item => {

    mailtext +=
      item.menge +
      ' x ' +
      item.artikelnummer +
      ' – ' +
      item.bezeichnung +
      '\n';

  });

  mailtext +=
    '\nVielen Dank';

  const cc = ccHolen();

  const mailto =
    'mailto:' +
    TEST_EMPFAENGER +
    '?subject=' +
    encodeURIComponent(betreff) +
    (cc ? '&cc=' + encodeURIComponent(cc) : '') +
    '&body=' +
    encodeURIComponent(mailtext);

  const outlookMobile =
    'ms-outlook://compose?to=' +
    encodeURIComponent(TEST_EMPFAENGER) +
    (cc ? '&cc=' + encodeURIComponent(cc) : '') +
    '&subject=' +
    encodeURIComponent(betreff) +
    '&body=' +
    encodeURIComponent(mailtext);

  bestellungImVerlaufSpeichern();
  verlaufAnzeigen();

  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    window.location.href = outlookMobile;
  } else {
    window.location.href = mailto;
  }

}
