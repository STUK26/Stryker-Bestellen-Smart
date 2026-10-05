let kameraStream = null;
let barcodeReader = null;
let scanBereit = false;
let scanTimeout = null;
let audioContext = null;

function scanStatusSetzen(text) {
  const status = document.getElementById('scanStatus');
  if (status) status.textContent = text || '';
}

function scanTimeoutStoppen() {
  if (scanTimeout) {
    clearTimeout(scanTimeout);
    scanTimeout = null;
  }
}

function scanBestaetigen() {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, audioContext.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.11);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.12);
  } catch (fehler) {
    console.log('Bestätigungston nicht verfügbar:', fehler);
  }

  if (navigator.vibrate) {
    navigator.vibrate(70);
  }
}

async function kameraOeffnen() {
  try {
    if (typeof ZXing === 'undefined') {
      alert('Barcode-Scanner konnte nicht geladen werden.');
      return;
    }

    const cameraBox = document.getElementById('cameraBox');
    const scanErgebnis = document.getElementById('scanErgebnis');
    const ergebnis = document.getElementById('ergebnis');
    if (ergebnis && scanErgebnis) scanErgebnis.appendChild(ergebnis);

    cameraBox.style.display = 'block';
    scanStatusSetzen('Barcode in den gelben Rahmen halten.');

    const hints = new Map();
    hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, [
      ZXing.BarcodeFormat.CODE_128,
      ZXing.BarcodeFormat.CODE_39,
      ZXing.BarcodeFormat.EAN_13,
      ZXing.BarcodeFormat.EAN_8,
      ZXing.BarcodeFormat.UPC_A,
      ZXing.BarcodeFormat.UPC_E,
      ZXing.BarcodeFormat.ITF
    ]);

    // Schwieriger gedruckte, blasse oder leicht beschädigte Barcodes intensiver prüfen.
    hints.set(ZXing.DecodeHintType.TRY_HARDER, true);

    barcodeReader = new ZXing.BrowserBarcodeReader(250, hints);
    scanBereit = false;

    const video = document.getElementById('video');
    const scanTrigger = document.getElementById('scanTrigger');

    scanTrigger.disabled = false;
    scanTrigger.innerHTML = '<svg class="uiIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M7 10v4M10 9v6M13 9v6M16 10v4"/></svg><span>SCANNEN</span>';

    scanTrigger.onclick = function () {
      scanTimeoutStoppen();

      try {
        if (!audioContext) {
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
      } catch (fehler) {}

      scanBereit = true;
      scanTrigger.disabled = true;
      scanTrigger.innerHTML = '<svg class="uiIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M7 10v4M10 9v6M13 9v6M16 10v4"/></svg><span>SCANNEN…</span>';
      scanStatusSetzen('Suche Barcode…');

      scanTimeout = setTimeout(function () {
        if (!scanBereit) return;

        scanBereit = false;
        scanTrigger.disabled = false;
        scanTrigger.innerHTML = '<svg class="uiIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M7 10v4M10 9v6M13 9v6M16 10v4"/></svg><span>SCANNEN</span>';
        scanStatusSetzen('Code nicht lesbar – bitte näher herangehen, Licht einschalten oder erneut scannen.');
      }, 8000);
    };

    barcodeReader.decodeFromVideoDevice(
      undefined,
      video,
      function (ergebnis, fehler) {
        if (!ergebnis || !scanBereit) return;

        const barcode = String(ergebnis.text || '').trim();
        if (!barcode) return;
        if (!/^[A-Za-z0-9-]{3,32}$/.test(barcode)) return;

        scanBereit = false;
        scanTimeoutStoppen();

        document.getElementById('suche').value = barcode;
        scanTrigger.disabled = false;
        scanTrigger.innerHTML = '<svg class="uiIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M7 10v4M10 9v6M13 9v6M16 10v4"/></svg><span>SCANNEN</span>';

        scanStatusSetzen('✓ Barcode erkannt');
        scanBestaetigen();
        artikelSuchen('scanner');
      }
    );

  } catch (fehler) {
    console.error(fehler);
    alert('Kamera konnte nicht geöffnet werden.');
    kameraSchliessen();
  }
}

async function kameraSchliessen() {
  scanBereit = false;
  scanTimeoutStoppen();
  scanStatusSetzen('');

  if (barcodeReader) {
    try { barcodeReader.reset(); } catch (fehler) {}
    barcodeReader = null;
  }

  const video = document.getElementById('video');
  if (video && video.srcObject) {
    video.srcObject.getTracks().forEach(function (track) {
      track.stop();
    });
    video.srcObject = null;
  }

  kameraStream = null;
  document.getElementById('cameraBox').style.display = 'none';

  const scanTrigger = document.getElementById('scanTrigger');
  scanTrigger.disabled = false;
  scanTrigger.innerHTML = '<svg class="uiIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M7 10v4M10 9v6M13 9v6M16 10v4"/></svg><span>SCANNEN</span>';

  if (!istMobil() && document.getElementById('manuelleEingabe').style.display !== 'none') {
    document.getElementById('suche').focus();
  }
}
async function lichtUmschalten() {
  try {
    const video = document.getElementById('video');

    if (!video.srcObject) {
      alert('Kamera ist nicht aktiv.');
      return;
    }

    const track = video.srcObject.getVideoTracks()[0];
    const caps = track.getCapabilities();

    if (!caps.torch) {
      alert('Licht ist auf diesem Gerät nicht verfügbar.');
      return;
    }

    const settings = track.getSettings();
    const lichtAn = !settings.torch;

    await track.applyConstraints({
      advanced: [{ torch: lichtAn }]
    });

    document.getElementById('torchBtn').innerHTML =
      lichtAn ? '<svg class="uiIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4"/><path d="M8.2 14.5A6 6 0 1 1 15.8 14.5C14.7 15.3 14 16.2 14 17h-4c0-.8-.7-1.7-1.8-2.5Z"/></svg><span>LICHT AUS</span>' : '<svg class="uiIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4"/><path d="M8.2 14.5A6 6 0 1 1 15.8 14.5C14.7 15.3 14 16.2 14 17h-4c0-.8-.7-1.7-1.8-2.5Z"/></svg><span>LICHT</span>';
      
  } catch (fehler) {
    console.error(fehler);
    alert('Licht konnte nicht geschaltet werden.');
  }

 }
