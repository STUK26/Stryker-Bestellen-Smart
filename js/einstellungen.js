function vanLaden() {
      let van = localStorage.getItem(VAN_SPEICHER) || '';

      if (van) {
        van = van.toUpperCase();
        localStorage.setItem(VAN_SPEICHER, van);
      }

      const footerVan = document.getElementById('footerVan');

      if (footerVan) {
        footerVan.textContent = van || 'VAN nicht gesetzt';
        const startVan=document.getElementById('startVan');
        if(startVan) startVan.textContent=van || 'VAN nicht gesetzt';
      }
    }


function vanHolen() {

      return (localStorage.getItem(VAN_SPEICHER) || '').toUpperCase();

    }


function einstellungenOeffnen() {
      document.getElementById('einstellungenAnsicht').style.display = 'block';
      document.getElementById('einstellungenButtonBereich').style.display = 'none';

      Array.from(document.body.children).forEach(function(element) {
        if (
          element.id !== 'einstellungenAnsicht' &&
          element.id !== 'einstellungenButtonBereich' &&
          element.tagName !== 'SCRIPT'
        ) {
          element.dataset.vorEinstellungen = element.style.display || '';
          element.style.display = 'none';
        }
      });

      document.getElementById('einstellungenVan').value = vanHolen();
      document.getElementById('ccAktiv').checked =
        localStorage.getItem(CC_AKTIV_SPEICHER) === 'true';
      document.getElementById('ccEmail').value =
        localStorage.getItem(CC_EMAIL_SPEICHER) || '';

      window.scrollTo(0, 0);
    }


function einstellungenSchliessen() {
      Array.from(document.body.children).forEach(function(element) {
        if (
          element.id !== 'einstellungenAnsicht' &&
          element.id !== 'einstellungenButtonBereich' &&
          element.tagName !== 'SCRIPT'
        ) {
          element.style.display = element.dataset.vorEinstellungen || '';
          delete element.dataset.vorEinstellungen;
        }
      });

      document.getElementById('einstellungenAnsicht').style.display = 'none';
      document.getElementById('einstellungenButtonBereich').style.display = 'block';
      window.scrollTo(0, 0);
    }


function einstellungenSpeichern() {
      const van = document
        .getElementById('einstellungenVan')
        .value
        .trim()
        .toUpperCase();

      const ccAktiv = document.getElementById('ccAktiv').checked;
      const ccEmail = document.getElementById('ccEmail').value.trim();

      if (!van) {
        alert('Bitte VAN eingeben.');
        return;
      }

      if (ccAktiv && !ccEmail) {
        alert('Bitte eine CC E-Mail-Adresse eingeben.');
        return;
      }

      if (ccAktiv && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ccEmail)) {
        alert('Bitte eine gültige CC E-Mail-Adresse eingeben.');
        return;
      }

      localStorage.setItem(VAN_SPEICHER, van);
      localStorage.setItem(CC_AKTIV_SPEICHER, String(ccAktiv));
      localStorage.setItem(CC_EMAIL_SPEICHER, ccEmail);

      vanLaden();
      document.getElementById('einstellungenVan').value = van;

      alert('Einstellungen gespeichert.');
    }


function ccHolen() {
      if (localStorage.getItem(CC_AKTIV_SPEICHER) !== 'true') {
        return '';
      }

      return localStorage.getItem(CC_EMAIL_SPEICHER) || '';
    }
