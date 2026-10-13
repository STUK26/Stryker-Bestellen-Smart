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


function verlaufLesen() {
  try {
    const daten = JSON.parse(localStorage.getItem(VERLAUF_SPEICHER) || '[]');
    return Array.isArray(daten) ? daten : [];
  } catch (fehler) {
    return [];
  }
}

function verlaufAnzeigen() {
  const bereich = document.getElementById('verlauf');
  const loeschButton = document.getElementById('verlaufAllesLoeschen');
  const eintraege = verlaufLesen();
  loeschButton.style.display = eintraege.length ? 'flex' : 'none';
  if (!eintraege.length) {
    bereich.textContent = 'Noch keine Bestellung an Outlook übergeben.';
    return;
  }
  bereich.innerHTML = eintraege.map((eintrag, index) => {
    const datum = new Date(eintrag.datum);
    const datumText = Number.isNaN(datum.getTime()) ? 'Datum unbekannt' : datum.toLocaleString('de-DE');
    const artikel = Array.isArray(eintrag.artikel) ? eintrag.artikel : [];
    return '<section class="favoritKarte verlaufKarte">' +
      '<div class="verlaufKopf"><div><div class="verlaufDatum">' + escapeHtml(datumText) + '</div>' +
      '<div>' + escapeHtml(eintrag.van || 'VAN unbekannt') + '</div></div></div>' +
      '<div class="verlaufStatus">' + escapeHtml(eintrag.status || 'An Outlook übergeben') + '</div>' +
      '<ul class="verlaufArtikel">' + artikel.map(item =>
        '<li><span class="verlaufMenge">' + escapeHtml(item.menge) + ' ×</span>' +
        '<span class="verlaufArtikelText"><strong>' + escapeHtml(item.artikelnummer) + '</strong>' +
        escapeHtml(item.bezeichnung || '') + '</span></li>'
      ).join('') + '</ul>' +
      '<div class="verlaufAktionen">' +
      '<button type="button" class="secondaryAction" onclick="verlaufErneutOutlook(' + index + ')">Erneut an Outlook</button>' +
      '<button type="button" class="bestellungEntfernen" onclick="verlaufEintragLoeschen(' + index + ')" aria-label="Bestellung löschen" title="Bestellung löschen">' +
      '<svg class="uiIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 10v7M14 10v7"/></svg></button></div></section>';
  }).join('');
}

function verlaufEintragLoeschen(index) {
  const eintraege = verlaufLesen();
  if (!Number.isInteger(index) || !eintraege[index]) return;
  if (!confirm('Diese Bestellung aus dem Verlauf löschen?')) return;
  eintraege.splice(index, 1);
  localStorage.setItem(VERLAUF_SPEICHER, JSON.stringify(eintraege));
  verlaufAnzeigen();
}

function verlaufAllesLoeschen() {
  const eintraege = verlaufLesen();
  if (!eintraege.length) return;
  if (!confirm('Wirklich den gesamten Bestellverlauf auf diesem Gerät löschen?')) return;
  if (!confirm('Letzte Bestätigung: Alle ' + eintraege.length + ' gespeicherten Bestellungen endgültig löschen?')) return;
  localStorage.removeItem(VERLAUF_SPEICHER);
  verlaufAnzeigen();
}

function verlaufErneutOutlook(index) {
  const eintrag = verlaufLesen()[index];
  if (!eintrag || !Array.isArray(eintrag.artikel) || !eintrag.artikel.length) {
    alert('Diese Bestellung enthält keine Artikel.');
    return;
  }
  const van = eintrag.van;
  if (!van) { alert('VAN der gespeicherten Bestellung fehlt.'); return; }
  const betreff = 'Bestellung ' + van;
  let mailtext = 'Hallo zusammen,\n\nbitte folgende Artikel für ' + van + ' bestellen:\n\n';
  eintrag.artikel.forEach(item => {
    mailtext += item.menge + ' x ' + item.artikelnummer + ' – ' + item.bezeichnung + '\n';
  });
  mailtext += '\nVielen Dank';
  const cc = ccHolen();
  const mailto = 'mailto:' + TEST_EMPFAENGER + '?subject=' + encodeURIComponent(betreff) +
    (cc ? '&cc=' + encodeURIComponent(cc) : '') + '&body=' + encodeURIComponent(mailtext);
  const outlookMobile = 'ms-outlook://compose?to=' + encodeURIComponent(TEST_EMPFAENGER) +
    (cc ? '&cc=' + encodeURIComponent(cc) : '') + '&subject=' + encodeURIComponent(betreff) +
    '&body=' + encodeURIComponent(mailtext);
  // Absichtlich weder Warenkorb noch Verlauf ändern.
  window.location.href = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? outlookMobile : mailto;
}
