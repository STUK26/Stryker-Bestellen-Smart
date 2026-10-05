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
