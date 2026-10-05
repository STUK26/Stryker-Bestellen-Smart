function favoritenLaden() {
  try {
    const daten = JSON.parse(localStorage.getItem(FAVORITEN_SPEICHER) || '[]');
    return Array.isArray(daten) ? daten : [];
  } catch (e) { return []; }
}
function favoritenSpeichern(daten) {
  localStorage.setItem(FAVORITEN_SPEICHER, JSON.stringify(daten));
}
function istFavorit(artikelnummer) {
  return favoritenLaden().some(f => String(f.artikelnummer) === String(artikelnummer));
}
function favoritSternAktualisieren() {
  const el = document.getElementById('favoritStern');
  if (!el || !aktuellerArtikel) return;
  el.innerHTML =
    '<button type="button" onclick="favoritUmschalten()" style="font-size:22px;padding:2px 8px;" title="Favorit">' +
    (istFavorit(aktuellerArtikel.artikelnummer) ? '⭐' : '☆') +
    '</button>';
}
function favoritUmschalten() {
  if (!aktuellerArtikel) return;
  let liste = favoritenLaden();
  const index = liste.findIndex(f => String(f.artikelnummer) === String(aktuellerArtikel.artikelnummer));
  if (index >= 0) {
    liste.splice(index, 1);
  } else {
    liste.push({
      artikelnummer: String(aktuellerArtikel.artikelnummer),
      bezeichnung: String(aktuellerArtikel.bezeichnung || '')
    });
  }
  favoritenSpeichern(liste);
  favoritSternAktualisieren();
}
function favoritenOeffnen() {
  Array.from(document.body.children).forEach(function(element) {
    if (element.id !== 'favoritenAnsicht' && element.tagName !== 'SCRIPT') {
      element.dataset.vorFavoriten = element.style.display || '';
      element.style.display = 'none';
    }
  });
  document.getElementById('favoritenAnsicht').style.display = 'block';
  favoritenRendern();
  window.scrollTo(0, 0);
}
function favoritenSchliessen() {
  Array.from(document.body.children).forEach(function(element) {
    if (element.id !== 'favoritenAnsicht' && element.tagName !== 'SCRIPT') {
      element.style.display = element.dataset.vorFavoriten || '';
      delete element.dataset.vorFavoriten;
    }
  });
  document.getElementById('favoritenAnsicht').style.display = 'none';
  window.scrollTo(0, 0);
}
function favoritenRendern() {
  const ziel = document.getElementById('favoritenListe');
  const liste = favoritenLaden();

  if (!liste.length) {
    ziel.innerHTML = '<p>Noch keine Favoriten gespeichert.</p>';
    return;
  }

  ziel.innerHTML = liste.map((f, i) =>
    '<div style="border-bottom:1px solid #ccc;padding:10px 0;">' +
      '<label>' +
        '<input type="checkbox" class="favCheck" data-index="' + i + '"> ' +
        '<strong>' + escapeHtml(String(f.artikelnummer)) + '</strong><br>' +
        escapeHtml(String(f.bezeichnung || '')) +
      '</label>' +
      '<div style="margin-top:6px;">' +
        'Menge: ' +
        '<button type="button" onclick="favoritMengeAendern(' + i + ',-1)">−</button> ' +
        '<input id="favMenge' + i + '" type="number" min="1" value="1" style="width:55px;text-align:center;"> ' +
        '<button type="button" onclick="favoritMengeAendern(' + i + ',1)">+</button> ' +
        '<button type="button" onclick="favoritEntfernen(' + i + ')">⭐ entfernen</button>' +
      '</div>' +
    '</div>'
  ).join('');
}
function favoritMengeAendern(index, delta) {
  const feld = document.getElementById('favMenge' + index);
  if (!feld) return;
  feld.value = Math.max(1, (parseInt(feld.value, 10) || 1) + delta);
}
function favoritEntfernen(index) {
  let liste = favoritenLaden();
  if (index < 0 || index >= liste.length) return;
  liste.splice(index, 1);
  favoritenSpeichern(liste);
  favoritenRendern();
}
function favoritenZurBestellung() {
  const liste = favoritenLaden();
  const auswahl = document.querySelectorAll('.favCheck:checked');

  if (!auswahl.length) {
    alert('Bitte mindestens einen Favoriten auswählen.');
    return;
  }

  auswahl.forEach(check => {
    const index = Number(check.dataset.index);
    const favorit = liste[index];
    if (!favorit) return;

    const feld = document.getElementById('favMenge' + index);
    const menge = Math.max(1, parseInt(feld.value, 10) || 1);
    const vorhanden = bestellung.find(item =>
      String(item.artikelnummer) === String(favorit.artikelnummer)
    );

    if (vorhanden) {
      vorhanden.menge += menge;
    } else {
      bestellung.push({
        artikelnummer: favorit.artikelnummer,
        bezeichnung: favorit.bezeichnung,
        menge: menge
      });
    }
  });

  bestellungSpeichern();
  bestellungAnzeigen();
  favoritenSchliessen();
}
