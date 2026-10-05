const API_URL =
      'https://script.google.com/macros/s/AKfycbx9oXcfdmay6RtCI22A18t2TNGghcccYvSlBJ5pu0_E5E2jfSknkWMBqQAUFEhkm3Pv-w/exec';

    const BESTELLUNG_SPEICHER =
      'strykerBestellenSmart_bestellung';

    const VAN_SPEICHER =
      'strykerBestellenSmart_van';
    
    const VERLAUF_SPEICHER =
  'strykerBestellenSmart_verlauf';

    const FAVORITEN_SPEICHER =
      'strykerBestellenSmart_favoriten';

    const CC_AKTIV_SPEICHER =
      'strykerBestellenSmart_cc_aktiv';

    const CC_EMAIL_SPEICHER =
      'strykerBestellenSmart_cc_email';

    const TEST_EMPFAENGER =
      'procareservicegsa@stryker.com';

    let artikelstamm = [];
    let unbekannterBarcode = '';
    let aktuellerArtikel = null;
    let bestellung = [];


    /*
     * =====================================================
     * VAN
     * =====================================================
     */

    


    


    


    


    


    


    /*
     * =====================================================
     * ARTIKELSTAMM
     * =====================================================
     */

    


    /*
     * =====================================================
     * BESTELLUNG LADEN / SPEICHERN
     * =====================================================
     */

    /*
     * =====================================================
     * UNBEKANNTEN ARTIKEL AUFNEHMEN
     * =====================================================
     */

    


    


    


    


    


    


    /*
     * =====================================================
     * ENTER / SCANNER
     * =====================================================
     */

    document
      .getElementById('suche')
      .addEventListener(
        'keydown',
        function(event) {

          if (event.key === 'Enter') {

            event.preventDefault();

            artikelSuchen();

          }

        }
      );


    /*
     * =====================================================
     * START
     * =====================================================
     */


function istMobil() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
} 
  

    vanLaden();
bestellungLaden();
verlaufAnzeigen();
artikelLaden();
