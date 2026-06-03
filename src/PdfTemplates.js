// =====================================================================
// ATIMO PROJECT SRL - Template-uri PDF identice cu documentele originale
// Adăugați acest fișier în src/PdfTemplates.js
// =====================================================================

// ─── STYLES COMUNE PRINT ─────────────────────────────────────────────────────

export const PDF_PRINT_STYLES = `
@media print {
  body * { visibility: hidden; }
  .print-area, .print-area * { visibility: visible; }
  .print-area { position: fixed; left: 0; top: 0; width: 100%; }
  .no-print { display: none !important; }
}
.print-area {
  font-family: Arial, sans-serif;
  font-size: 10px;
  color: #000;
  background: #fff;
  padding: 15mm 15mm 10mm 15mm;
  max-width: 210mm;
  margin: 0 auto;
}
.atimo-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
  padding-bottom: 4px;
  border-bottom: 2px solid #E8501A;
}
.atimo-logo-area { display: flex; align-items: center; gap: 10px; }
.atimo-company-info { font-size: 8px; line-height: 1.4; }
.atimo-company-name { font-size: 12px; font-weight: bold; color: #E8501A; }
.atimo-badges { display: flex; gap: 4px; align-items: center; }
.atimo-badge { border: 1px solid #666; border-radius: 3px; padding: 1px 4px; font-size: 7px; text-align: center; }
.doc-annex { color: #E8501A; font-style: italic; font-size: 10px; margin-bottom: 4px; }
.doc-title { font-size: 12px; font-weight: bold; text-align: center; margin: 6px 0 2px; }
.doc-subtitle { font-size: 10px; text-align: center; margin-bottom: 2px; }
.doc-number { font-size: 10px; text-align: center; font-style: italic; margin-bottom: 8px; }
.main-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 9px; }
.main-table th, .main-table td { border: 1px solid #000; padding: 3px 5px; vertical-align: top; }
.main-table th { background: #f0f0f0; font-weight: bold; text-align: left; }
.nr-col { width: 6%; text-align: center; }
.info-col { width: 35%; }
.value-col { width: 59%; }
.section-title { font-size: 9px; font-weight: bold; margin: 6px 0 3px; }
.checklist-table { width: 100%; border-collapse: collapse; font-size: 8.5px; margin-bottom: 6px; }
.checklist-table th, .checklist-table td { border: 1px solid #000; padding: 2px 4px; vertical-align: middle; }
.checklist-table th { background: #f0f0f0; text-align: center; }
.op-col { width: 70%; }
.yn-col { width: 10%; text-align: center; }
.checkbox-mark { font-size: 11px; font-weight: bold; }
.signature-section { display: flex; justify-content: space-between; margin-top: 10px; font-size: 9px; }
.sig-box { width: 45%; }
.sig-line { border-top: 1px solid #000; margin-top: 30px; padding-top: 3px; font-size: 8px; }
.sig-img { max-width: 140px; max-height: 50px; object-fit: contain; display: block; }
.important-note { font-size: 8px; font-style: italic; margin: 4px 0; line-height: 1.4; }
.tabel-nr { font-size: 9px; font-weight: bold; text-align: center; margin: 4px 0 2px; }
.probe-table { width: 100%; border-collapse: collapse; font-size: 8.5px; margin-bottom: 6px; }
.probe-table th, .probe-table td { border: 1px solid #000; padding: 2px 4px; vertical-align: middle; text-align: center; }
.probe-table th { background: #f0f0f0; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.bold { font-weight: bold; }
.italic { font-style: italic; }
.orange { color: #E8501A; }
.footer-note { font-size: 7.5px; margin-top: 6px; line-height: 1.4; border-top: 1px solid #ccc; padding-top: 4px; }
.contract-art { margin-bottom: 8px; font-size: 9px; line-height: 1.5; }
.contract-art-title { font-weight: bold; font-style: italic; margin-bottom: 3px; }
.service-row { display: flex; align-items: center; gap: 6px; margin: 2px 0; font-size: 9px; }
.checkbox-sq { width: 10px; height: 10px; border: 1px solid #000; display: inline-flex; align-items: center; justify-content: center; font-size: 8px; flex-shrink: 0; }
`;

// ─── LOGO ATIMO SVG ──────────────────────────────────────────────────────────

const AtimoLogo = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div style={{ fontFamily: "Arial", fontWeight: "bold", fontSize: 18, color: "#E8501A", letterSpacing: 1 }}>atimo</div>
    <div style={{ fontSize: 6, color: "#666", textAlign: "center" }}>www.atimo.ro</div>
  </div>
);

const AtimoHeader = () => (
  <div className="atimo-header">
    <div className="atimo-logo-area">
      <AtimoLogo />
      <div className="atimo-company-info">
        <div className="atimo-company-name">ATIMO PROJECT S.R.L.</div>
        <div>Str. Grigore Silași, Nr. 7, Beclean, Bistrița-Năsăud</div>
        <div>Telefon: 0770 225 225 | Email: office@atimo.ro</div>
        <div>Web: www.atimo.ro</div>
      </div>
    </div>
    <div className="atimo-badges">
      <div className="atimo-badge" style={{ borderColor: "#003399" }}>
        <div style={{ fontSize: 6, fontWeight: "bold", color: "#003399" }}>ANRE</div>
        <div style={{ fontSize: 5 }}>Autorizat</div>
      </div>
      <div className="atimo-badge" style={{ borderColor: "#cc0000" }}>
        <div style={{ fontSize: 6, fontWeight: "bold", color: "#cc0000" }}>ISCIR</div>
        <div style={{ fontSize: 5 }}>Autorizat</div>
      </div>
    </div>
  </div>
);

// ─── HELPER: checkbox mark ────────────────────────────────────────────────────

const Chk = ({ val, target }) => (
  <span className="checkbox-mark">{val === target ? "X" : ""}</span>
);

const ChkBool = ({ val }) => (
  <span className="checkbox-mark">{val ? "X" : ""}</span>
);

// ─── VIU PDF TEMPLATE ─────────────────────────────────────────────────────────

export function ViuPDFTemplate({ r, client }) {
  const cl = r.checklist || {};
  const obs = r.checklist_obs || {};

  const VIU_OPS = [
    "Verificarea arzatoarelor si a starii imbinarilor si garniturilor de etansare aferente",
    "Verificarea stabilitatii conductelor montate aperent pe suporti",
    "Verificarea etanseitatii imbinarii conductelor si armaturilor la presiunea de lucru a gazului din instalatie, cu spuma de apa cu sapun sau cu alte tehnologii de verificare a etanseitatii",
    "Verificarea functionarii aparatelor de masura, control reglare si de siguranta",
    "Demontarea/ Debransarea aparatelor consumatoare de combustibili gazosi fara aprobare legala si a instalatiilor de utilizare a gazelor naturale aferente",
    "Verificarea functionarii echipamentului de reglare din instalatiile de utilizare",
    "Verificarea starii rasuflatorilor si a caminelor existente",
    "Verificarea documentelor prezentate de client, din care sa reiasa ca a fost efectuata curatarea cosurilor si a canalelor de evacuare a gazelor de ardere de catre operatorii economici autorizati, emise cu maximum 6 luni inainte de data verificarii tehnice",
    "Verificarea starii constructiilor care adapostesc statiile si posturile de reglare-masurare",
    "Verificarea documentelor, prezentate de client, care sa ateste efectuarea in termen a verificarii tehnice periodice a aparatelor consumatoare de combustibili gazosi de catre operatorii autorizati de ISCIR",
    "Verificarea tehnica a instalatiei comune de utilizare GN care deserveste mai multi clienti finali",
    "Verificarea faptului ca racordul flexibil montat in instalatia de utilizare este in termen de valabilitate",
    "Verificarea faptului ca detectorul/detectoarele automate de gaze montat/montate la locul de consum este/sunt in termen de valabilitate",
    "Verificarea existentei instructiunilor de utilizare a gazelor naturale, intocmite conform prevederilor Procedurii ANRE nr. 156/2020",
  ];

  const fmtDate = (d) => {
    if (!d) return "………………";
    return new Date(d).toLocaleDateString("ro-RO");
  };

  return (
    <div className="print-area">
      <AtimoHeader />

      <div className="doc-annex">
        Anexa 1 la Contractul de prestari servicii Nr. {r.contract_number || "………."} / Data {fmtDate(r.date)}
      </div>
      <div className="doc-title">FISA DE EVIDENTA</div>
      <div className="doc-subtitle">a lucrarilor periodice de verificare tehnica a instalatiei de utilizare a gazelor naturale</div>
      <div className="doc-number">Nr. {r.number} / Data {fmtDate(r.date)}</div>

      {/* Tabel date principale */}
      <table className="main-table">
        <tbody>
          <tr>
            <td className="nr-col">1</td>
            <td className="info-col">Date identificare client</td>
            <td className="value-col">
              <div>Nume: <strong>{client?.last_name}</strong></div>
              <div>Prenume: <strong>{client?.first_name}</strong></div>
            </td>
          </tr>
          <tr>
            <td className="nr-col">2</td>
            <td className="info-col">Adresa locului de consum</td>
            <td className="value-col">{r.consumption_address || client?.address}, {client?.city}, jud. {client?.county}</td>
          </tr>
          <tr>
            <td className="nr-col">3</td>
            <td className="info-col">Cod abonat</td>
            <td className="value-col">{client?.subscriber_code || ""}</td>
          </tr>
          <tr>
            <td className="nr-col">4</td>
            <td className="info-col">Cod loc consum</td>
            <td className="value-col">{client?.consumption_code || ""}</td>
          </tr>
          <tr>
            <td className="nr-col">5</td>
            <td className="info-col">Contractul de prestari servicii</td>
            <td className="value-col">Numar {r.contract_number || "………………………"} data {fmtDate(r.date)}</td>
          </tr>
          <tr>
            <td className="nr-col">6</td>
            <td className="info-col">Documentatie tehnica in baza careia se executa verificarea tehnica</td>
            <td className="value-col">{r.technical_doc || ""}</td>
          </tr>
          <tr>
            <td className="nr-col">7</td>
            <td className="info-col">Data ultimei verificari tehnice si scadentei pentru locul de consum</td>
            <td className="value-col">
              <div>Ultima verificare: <strong>{fmtDate(r.last_verification_date)}</strong></div>
              <div>Scadenta: <strong>{fmtDate(r.due_date)}</strong></div>
            </td>
          </tr>
          <tr>
            <td className="nr-col">8</td>
            <td className="info-col">Instalator autorizat din cadrul operatorului economic ANRE care efectueaza verificarea tehnica</td>
            <td className="value-col">
              Nume si Prenume <span className="bold italic">TIMOCE CLAUDIU VASILE</span> Legitimatie tip <span className="italic">EGIU</span><br />
              Nr. <span className="bold">405180124</span> anul <span className="bold">14.05.2023</span> Valabila pana la data de <span className="bold">13.05.2028</span>
            </td>
          </tr>
          <tr>
            <td className="nr-col">9</td>
            <td className="info-col">Aparate consumatoare de combustibili gazosi</td>
            <td className="value-col" style={{ padding: 0 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 8 }}>
                <thead>
                  <tr>
                    <th colSpan={2} style={{ border: "1px solid #000", padding: "2px 4px", background: "#f0f0f0" }}>Notificate de furnizorul de GN</th>
                    <th colSpan={2} style={{ border: "1px solid #000", padding: "2px 4px", background: "#f0f0f0" }}>Identificate la locul de consum</th>
                  </tr>
                  <tr>
                    <th style={{ border: "1px solid #000", padding: "2px 4px", background: "#f0f0f0" }}>Tip</th>
                    <th style={{ border: "1px solid #000", padding: "2px 4px", background: "#f0f0f0" }}>Debit nominal</th>
                    <th style={{ border: "1px solid #000", padding: "2px 4px", background: "#f0f0f0" }}>Tip</th>
                    <th style={{ border: "1px solid #000", padding: "2px 4px", background: "#f0f0f0" }}>Debit nominal</th>
                  </tr>
                </thead>
                <tbody>
                  {[0,1,2].map(i => (
                    <tr key={i}>
                      <td style={{ border: "1px solid #000", padding: "3px 4px" }}>{r.appliances?.[i]?.notified_type || ""}</td>
                      <td style={{ border: "1px solid #000", padding: "3px 4px" }}>{r.appliances?.[i]?.notified_flow || ""}</td>
                      <td style={{ border: "1px solid #000", padding: "3px 4px" }}>{r.appliances?.[i]?.identified_type || ""}</td>
                      <td style={{ border: "1px solid #000", padding: "3px 4px" }}>{r.appliances?.[i]?.identified_flow || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Tabelul 1 - situatii */}
      <div className="section-title">1. Verificarea tehnica a instalatiei de utilizare a gazelor naturale se realizeaza in urmatoarele situatii:</div>
      <div className="tabel-nr">Tabelul nr. 1</div>
      <table className="checklist-table">
        <thead>
          <tr>
            <th className="nr-col">Nr</th>
            <th className="op-col">Tip lucrare</th>
            <th>De completat</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-center">1</td>
            <td>La interval de maximum 2 ani</td>
            <td className="text-center"><Chk val={r.situation} target="interval" /></td>
          </tr>
          <tr>
            <td className="text-center">2</td>
            <td>La cererea clientului final</td>
            <td className="text-center"><Chk val={r.situation} target="cerere" /></td>
          </tr>
        </tbody>
      </table>

      {/* Tabelul 2 - tip instalatie */}
      <div className="tabel-nr">Tabelul nr. 2</div>
      <table className="checklist-table">
        <thead>
          <tr>
            <th className="nr-col">Nr</th>
            <th>De completat</th>
            <th style={{ width: "30%" }}>Observatii</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-center">1</td>
            <td>Verificarea tehnica a instalatiei individuale de utilizare a gazelor naturale</td>
            <td className="text-center"><Chk val={r.installation_type} target="Individuală" /></td>
          </tr>
          <tr>
            <td className="text-center">2</td>
            <td>Verificarea tehnica a instalatiei comune de utilizare a gazelor naturale</td>
            <td className="text-center"><Chk val={r.installation_type} target="Comună" /></td>
          </tr>
        </tbody>
      </table>

      {/* Tabelul 3 - operatiuni */}
      <div className="section-title">2. Operatiunile care s-au realizat in cazul verificarii tehnice a IUGN sunt prezentate in Tabelul nr. 3</div>
      <table className="checklist-table">
        <thead>
          <tr>
            <th className="nr-col">Nr</th>
            <th className="op-col">OPERATIUNI</th>
            <th className="yn-col">Da</th>
            <th className="yn-col">Nu</th>
            <th className="yn-col">Nu este cazul</th>
          </tr>
        </thead>
        <tbody>
          {VIU_OPS.map((op, i) => (
            <tr key={i}>
              <td className="text-center">{i + 1}</td>
              <td>{op}</td>
              <td className="text-center"><Chk val={cl[`v${i+1}`]} target="DA" /></td>
              <td className="text-center"><Chk val={cl[`v${i+1}`]} target="NU" /></td>
              <td className="text-center"><Chk val={cl[`v${i+1}`]} target="N/A" /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="important-note">
        <strong>IMPORTANT:</strong> Intretinerea, exploatarea si repararea instalatiilor de utilizare a gazelor naturale revin clientului final, care raspunde pentru buna functionare. Confirm ca au fost efectuate toate operatiile enumerate in tabelul nr.3. Confirm ca am primit un exemplar al instructiunilor de utilizare a gazelor naturale.
      </div>

      {/* Semnatura client dupa tabelul 3 */}
      <div style={{ margin: "6px 0", fontSize: 9 }}>
        <strong>Semnatura client</strong> ………………………………………
        {r.client_sig && <img src={r.client_sig} className="sig-img" alt="Semnatura client" style={{ display: "inline-block", marginLeft: 10, verticalAlign: "middle" }} />}
      </div>

      {/* Tabelul 4 - defecte */}
      <div className="section-title">3. Defectele constatate se mentioneaza in Tabelul nr. 4</div>
      <table className="checklist-table">
        <thead>
          <tr>
            <th className="nr-col">Nr</th>
            <th>Defect constatat</th>
            <th>Mod de remediere a defectelor</th>
            <th colSpan={2}>Defect remediat</th>
          </tr>
          <tr>
            <th></th><th></th><th></th>
            <th className="yn-col">Da</th>
            <th className="yn-col">Nu</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-center">1</td>
            <td>{r.defects || ""}</td>
            <td>{r.actions || ""}</td>
            <td></td><td></td>
          </tr>
          <tr>
            <td className="text-center">2</td>
            <td></td><td></td><td></td><td></td>
          </tr>
        </tbody>
      </table>

      {/* Tabelul 5 - conditii tehnice */}
      <div className="section-title">4. Conditiile tehnice de functionare se trec in Tabelul nr. 5</div>
      <table className="checklist-table">
        <thead>
          <tr>
            <th></th>
            <th className="yn-col">Da</th>
            <th className="yn-col">Nu</th>
            <th>Observatii</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Instalatia de utilizare a gazelor naturale indeplineste conditiile tehnice de functionare in siguranta, prevazute in prevederile normale tehnice</td>
            <td className="text-center"><Chk val={r.technical_conditions} target="Corespunzătoare" /></td>
            <td className="text-center"><Chk val={r.technical_conditions} target="Necorespunzătoare" /></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      {/* Tabelul 6 - aparate */}
      <div className="tabel-nr">Tabelul nr. 6</div>
      <table className="checklist-table">
        <thead>
          <tr>
            <th className="nr-col">Nr.</th>
            <th colSpan={2}>Aparate consumatoare de combustibili gazosi</th>
            <th colSpan={2}>Doc. curatare cosuri/canale evacuare gaze arse</th>
            <th colSpan={2}>Doc. verificare aparate consumatoare</th>
          </tr>
          <tr>
            <th></th>
            <th>Tip aparat</th><th>Debit nominal</th>
            <th>Nr.</th><th>Data</th>
            <th>Nr.</th><th>Data</th>
          </tr>
        </thead>
        <tbody>
          {[1,2,3].map(i => (
            <tr key={i}>
              <td className="text-center">{i}</td>
              <td></td><td></td><td></td><td></td><td></td><td></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tabelul 7 - concluzie */}
      <div className="section-title">5. Concluzie Tabelul nr. 7</div>
      <table className="checklist-table">
        <thead>
          <tr>
            <th></th>
            <th colSpan={2}>De completat</th>
            <th>Observatii</th>
          </tr>
          <tr>
            <th></th>
            <th className="yn-col">Da</th>
            <th className="yn-col">Nu</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Pe baza documentelor prezentate si a operatiunilor realizate in cadrul verificarii tehnice se constata ca instalatia de utilizare a gazelor naturale respecta prevederile normelor tehnice si poate functiona in conditii de siguranta</td>
            <td className="text-center"><Chk val={r.conclusion} target="ADMIS" /></td>
            <td className="text-center"><Chk val={r.conclusion} target="RESPINS" /></td>
            <td>{r.observations || ""}</td>
          </tr>
        </tbody>
      </table>

      {/* Semnaturi finale */}
      <div className="signature-section">
        <div className="sig-box">
          <div className="bold">Instalator autorizat care a efectuat verificarea tehnica,</div>
          <div>Nume si prenume <span className="bold italic">TIMOCE CLAUDIU VASILE</span></div>
          <div style={{ marginTop: 4 }}>Semnatura ………………………………</div>
        </div>
        <div className="sig-box">
          <div className="bold">Clientul final</div>
          <div>Nume si prenume <strong>{client?.last_name} {client?.first_name}</strong></div>
          <div style={{ marginTop: 4 }}>
            Semnatura ………………………………
            {r.client_sig && <img src={r.client_sig} className="sig-img" alt="" />}
          </div>
        </div>
      </div>

      <div className="footer-note">
        Prezenta fisa se intocmeste in 3 exemplare, cate unul pentru a) clientul final, b) operatorul economic autorizat ANRE, c) operatorul de sistem.
        Reprezentantul legal/Imputernicitul operatorului economic autorizat ANRE: <strong>ATIMO PROJECT S.R.L.</strong>
      </div>
    </div>
  );
}

// ─── RIU PDF TEMPLATE ─────────────────────────────────────────────────────────

export function RiuPDFTemplate({ r, client }) {
  const cl = r.checklist || {};

  const RIU_OPS = [
    "Verificarea arzatoarelor si a starii imbinarilor si garniturilor de etansare aferente",
    "Verificarea stabilitatii conductelor montate aperent pe suporti",
    "Verificarea etanseitatii imbinarii conductelor si armaturilor la presiunea de lucru a gazului din instalatie, cu spuma de apa cu sapun sau cu alte tehnologii de verificare a etanseitatii",
    "Verificarea functionarii aparatelor de masura, control reglare si de siguranta",
    "Demontarea/Debransarea aparatelor consumatoare de combustibili gazosi fara aprobare legala si a instalatiilor de utilizare a gazelor naturale aferente",
    "Verificarea functionarii echipamentului de reglare din instalatiile de utilizare",
    "Verificarea starii rasuflatorilor si a caminelor existente",
    "Verificarea documentelor prezentate de client, din care sa reiasa ca a fost efectuata curatarea cosurilor si a canalelor de evacuare a gazelor de ardere, emise cu maximum 6 luni inainte",
    "Verificarea starii constructiilor care adapostesc statiile si posturile de reglare-masurare",
    "Verificarea documentelor care sa ateste efectuarea in termen a verificarii tehnice periodice a aparatelor consumatoare de combustibili gazosi de catre operatorii autorizati de ISCIR",
    "Efectuarea probei de rezistenta la presiune, conform prevederilor normelor tehnice din domeniul GN, numai pentru partea de instalatie la care s-au facut inlocuiri/modificari",
    "Efectuarea probei de etanseitate la presiune, conform prevederilor normelor tehnice din domeniul GN, a intregii instalatii de utilizare a gazelor naturale",
    "Verificarea faptului ca racordul flexibil montat in instalatia de utilizare este in termen de valabilitate",
    "Verificarea faptului ca detectorul/detectoarele automate de gaze montat/montate la locul de consum este/sunt in termen de valabilitate",
    "Revizia tehnica a instalatiei comune de utilizare GN care deserveste mai multi clienti finali, cuprinsa intre statia sau postul de reglare si sistemele/mijloacele de masurare a GN",
    "Verificarea existentei instructiunilor de utilizare a gazelor naturale, intocmite conform prevederilor Procedurii ANRE nr. 156/2020",
  ];

  const fmtDate = (d) => {
    if (!d) return "………………";
    return new Date(d).toLocaleDateString("ro-RO");
  };

  return (
    <div className="print-area">
      <AtimoHeader />

      <div className="doc-annex">
        Anexa 2 la Contractul de prestari servicii nr. {r.contract_number || "………………………"} din data {fmtDate(r.date)}
      </div>
      <div className="doc-title">FISA DE EVIDENTA</div>
      <div className="doc-subtitle">a lucrarilor periodice de revizie tehnica a instalatiei de utilizare a gazelor naturale</div>
      <div className="doc-number">Nr. {r.number} din data {fmtDate(r.date)}</div>

      <table className="main-table">
        <tbody>
          <tr>
            <td className="nr-col">1</td>
            <td className="info-col">Date identificare client</td>
            <td className="value-col">
              <div>Nume: <strong>{client?.last_name}</strong></div>
              <div>Prenume: <strong>{client?.first_name}</strong></div>
            </td>
          </tr>
          <tr>
            <td className="nr-col">2</td>
            <td className="info-col">Adresa locului de consum</td>
            <td className="value-col">{r.consumption_address || client?.address}, localitate {client?.city}, jud. {client?.county}</td>
          </tr>
          <tr>
            <td className="nr-col">3</td>
            <td className="info-col">Cod abonat</td>
            <td className="value-col">{client?.subscriber_code || ""}</td>
          </tr>
          <tr>
            <td className="nr-col">4</td>
            <td className="info-col">Cod loc consum</td>
            <td className="value-col">{client?.consumption_code || ""}</td>
          </tr>
          <tr>
            <td className="nr-col">5</td>
            <td className="info-col">Contractul de prestari servicii</td>
            <td className="value-col">Numar {r.contract_number || "………………………"} data {fmtDate(r.date)}</td>
          </tr>
          <tr>
            <td className="nr-col">6</td>
            <td className="info-col">Documentatie tehnica in baza careia se executa verificarea tehnica</td>
            <td className="value-col">{r.technical_doc || ""}</td>
          </tr>
          <tr>
            <td className="nr-col">7</td>
            <td className="info-col">Data ultimei verificari tehnice si scadentei pentru locul de consum</td>
            <td className="value-col">
              <div>Ultima verificare: <strong>{fmtDate(r.last_verification_date)}</strong></div>
              <div>Scadenta: <strong>{fmtDate(r.due_date)}</strong></div>
            </td>
          </tr>
          <tr>
            <td className="nr-col">8</td>
            <td className="info-col">Instalator autorizat din cadrul operatorului economic ANRE care efectueaza revizia tehnica</td>
            <td className="value-col">
              Nume si Prenume <span className="bold italic">TIMOCE CLAUDIU VASILE</span> Legitimatie tip <span className="italic">EGIU</span><br />
              Nr. <span className="bold">405180124</span> anul <span className="bold">14.05.2023</span> Valabila pana la data de <span className="bold">13.05.2028</span>
            </td>
          </tr>
          <tr>
            <td className="nr-col">9</td>
            <td className="info-col">Aparate consumatoare de combustibili gazosi</td>
            <td className="value-col" style={{ padding: 0 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 8 }}>
                <thead>
                  <tr>
                    <th colSpan={2} style={{ border: "1px solid #000", padding: "2px 4px", background: "#f0f0f0" }}>Notificate de furnizorul de GN</th>
                    <th colSpan={2} style={{ border: "1px solid #000", padding: "2px 4px", background: "#f0f0f0" }}>Identificate la locul de consum</th>
                  </tr>
                  <tr>
                    {["Tip","Debit nominal","Tip","Debit nominal"].map((h,i) => (
                      <th key={i} style={{ border: "1px solid #000", padding: "2px 4px", background: "#f0f0f0" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[0,1,2].map(i => (
                    <tr key={i}>
                      <td style={{ border: "1px solid #000", padding: "3px 4px" }}></td>
                      <td style={{ border: "1px solid #000", padding: "3px 4px" }}></td>
                      <td style={{ border: "1px solid #000", padding: "3px 4px" }}></td>
                      <td style={{ border: "1px solid #000", padding: "3px 4px" }}></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td className="nr-col">10</td>
            <td className="info-col">Proces-verbal de demontare/montare a sistemului/mijlocului de masurare a gazelor naturale</td>
            <td className="value-col">Numar {r.meter_protocol_number || "………………"} data {fmtDate(r.meter_protocol_date)}</td>
          </tr>
        </tbody>
      </table>

      {/* Tabelul 1 */}
      <div className="section-title">1. Revizia tehnica a instalatiei de utilizare a gazelor naturale se realizeaza in urmatoarele situatii: Tabelul nr. 1</div>
      <table className="checklist-table">
        <thead>
          <tr><th className="nr-col">Nr</th><th>Tip lucrare</th><th>De completata</th></tr>
        </thead>
        <tbody>
          {[
            "La interval de maximum 10 ani",
            "Dupa orice intrerupere a utilizarii instalatiei de utilizare a gazelor naturale pentru o perioada de timp mai mare de 6 luni",
            "Dupa orice eveniment care poate afecta instalatia de utilizare",
            "La cererea clientului final"
          ].map((t, i) => (
            <tr key={i}>
              <td className="text-center">{i+1}</td>
              <td>{t}</td>
              <td className="text-center"></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tabelul 2 */}
      <div className="tabel-nr">Tabelul nr. 2</div>
      <table className="checklist-table">
        <thead>
          <tr><th className="nr-col">Nr</th><th>De completata</th><th>Observatii</th></tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-center">1</td>
            <td>Revizia tehnica a instalatiei individuale de utilizare a gazelor naturale</td>
            <td className="text-center"><Chk val={r.installation_type} target="Individuală" /></td>
          </tr>
          <tr>
            <td className="text-center">2</td>
            <td>Revizia tehnica a instalatiei comune de utilizare a gazelor naturale</td>
            <td className="text-center"><Chk val={r.installation_type} target="Comună" /></td>
          </tr>
        </tbody>
      </table>

      {/* Tabelul 3 - operatiuni */}
      <div className="section-title">2. Operatiunile care s-au realizat in cazul verificarii tehnice a IUGN sunt prezentate in Tabelul nr. 3</div>
      <table className="checklist-table">
        <thead>
          <tr>
            <th className="nr-col">Nr</th>
            <th className="op-col">OPERATIUNI</th>
            <th className="yn-col">Da</th>
            <th className="yn-col">Nu</th>
            <th className="yn-col">Nu este cazul</th>
          </tr>
        </thead>
        <tbody>
          {RIU_OPS.map((op, i) => (
            <tr key={i}>
              <td className="text-center">{i+1}</td>
              <td>{op}</td>
              <td className="text-center"><Chk val={cl[`v${i+1}`]} target="DA" /></td>
              <td className="text-center"><Chk val={cl[`v${i+1}`]} target="NU" /></td>
              <td className="text-center"><Chk val={cl[`v${i+1}`]} target="N/A" /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="important-note">
        <strong>IMPORTANT:</strong> Intretinerea, exploatarea si repararea instalatiilor de utilizare a gazelor naturale revin clientului final, care raspunde pentru buna lor functionare. Confirm ca au fost efectuate toate operatiile enumerate in tabelul nr.3; Confirm ca am primit un exemplar al instructiunilor de utilizare a gazelor naturale; Confirm ca mi s-a recomandat instalarea detectoarelor pentru monoxid/dioxid de carbon.
      </div>
      <div style={{ margin: "4px 0", fontSize: 9 }}>
        Semnatura client ………………………………………………
        {r.client_sig && <img src={r.client_sig} className="sig-img" alt="" style={{ display: "inline-block", marginLeft: 10, verticalAlign: "middle" }} />}
      </div>

      {/* Tabelul 4 - probe presiune */}
      <div className="section-title">3. Probe de etanseitate la presiune prevazute la pct. 12 si proba de rezistenta la presiune prevazuta la pct. 11 din Tabelul nr. 3 se efectueaza cu aer comprimat, iar rezultatul acestora se inscriu in Tabelul nr. 4</div>
      <table className="probe-table">
        <thead>
          <tr>
            <th rowSpan={2}>Nr.</th>
            <th rowSpan={2}></th>
            <th rowSpan={2}></th>
            <th colSpan={5}>Instalatie de utilizare a gazelor naturale</th>
          </tr>
          <tr>
            <th colSpan={2}>OL</th>
            <th>PE 100</th>
            <th colSpan={2}>PE 80</th>
          </tr>
          <tr>
            <th></th><th></th>
            <th>Amplasare instalatie de utilizare</th>
            <th>Subteran</th><th>Suprateran</th><th>Subteran</th><th>Subteran</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan={5} className="text-center">1</td>
            <td rowSpan={5}>Proba de rezistenta</td>
            <td>Regim de presiune - Medie presiune (bar)</td>
            <td colSpan={4} className="text-center">{r.pressure_resistance || ""}</td>
          </tr>
          <tr><td>Redusa presiune (bar)</td><td colSpan={4}></td></tr>
          <tr><td>Joasa presiune (bar)</td><td colSpan={4}></td></tr>
          <tr>
            <td>Rezultatul probei Admis</td>
            <td colSpan={4} className="text-center"><Chk val={r.test_result} target="Admis" /></td>
          </tr>
          <tr>
            <td>Respins</td>
            <td colSpan={4} className="text-center"><Chk val={r.test_result} target="Respins" /></td>
          </tr>
          <tr>
            <td rowSpan={5} className="text-center">2</td>
            <td rowSpan={5}>Proba de etanseitate</td>
            <td>Regim de presiune - Medie presiune (bar)</td>
            <td colSpan={4} className="text-center">{r.pressure_tightness || ""}</td>
          </tr>
          <tr><td>Redusa presiune (bar)</td><td colSpan={4}></td></tr>
          <tr><td>Joasa presiune (bar)</td><td colSpan={4}></td></tr>
          <tr><td>Rezultatul probei Admis</td><td colSpan={4} className="text-center"><Chk val={r.test_result} target="Admis" /></td></tr>
          <tr><td>Respins</td><td colSpan={4} className="text-center"><Chk val={r.test_result} target="Respins" /></td></tr>
        </tbody>
      </table>

      {/* Tabelul 5 - defecte */}
      <div className="section-title">4. Defectele constatate se mentioneaza in Tabelul nr. 5</div>
      <table className="checklist-table">
        <thead>
          <tr>
            <th className="nr-col">Nr</th>
            <th>Defect constatat</th>
            <th>Mod de remediere a defectelor</th>
            <th className="yn-col">Da</th>
            <th className="yn-col">Nu</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-center">1</td>
            <td>{r.defects || ""}</td>
            <td>{r.actions || ""}</td>
            <td></td><td></td>
          </tr>
          <tr><td className="text-center">2</td><td></td><td></td><td></td><td></td></tr>
        </tbody>
      </table>
      <div style={{ fontSize: 9, margin: "4px 0" }}>
        Confirm ca au fost efectuate probele enumerate mai sus. <strong>Semnatura client</strong> ……………………………
        {r.client_sig && <img src={r.client_sig} className="sig-img" alt="" style={{ display: "inline-block", marginLeft: 10, verticalAlign: "middle" }} />}
      </div>

      {/* Tabelul 6 - conditii tehnice */}
      <div className="section-title">5. Conditiile tehnice de functionare se trec in Tabelul nr. 6</div>
      <table className="checklist-table">
        <thead>
          <tr><th></th><th colSpan={2}>De completat</th><th>Observatii</th></tr>
          <tr><th></th><th className="yn-col">Da</th><th className="yn-col">Nu</th><th></th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Instalatia de utilizare a gazelor naturale indeplineste conditiile tehnice de functionare in siguranta, prevazute in prevederile normale tehnice</td>
            <td className="text-center"><Chk val={r.technical_conditions} target="Corespunzătoare" /></td>
            <td className="text-center"><Chk val={r.technical_conditions} target="Necorespunzătoare" /></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      {/* Tabelul 7 - aparate */}
      <div className="tabel-nr">Tabelul nr. 7</div>
      <table className="checklist-table">
        <thead>
          <tr>
            <th className="nr-col">Nr.</th>
            <th colSpan={2}>Aparate consumatoare de combustibili gazosi</th>
            <th colSpan={2}>Doc. curatare cosuri/canale evacuare gaze arse</th>
            <th colSpan={2}>Doc. verificare aparate consumatoare</th>
          </tr>
          <tr>
            <th></th>
            <th>Tip aparat</th><th>Debit nominal</th>
            <th>Nr.</th><th>Data</th>
            <th>Nr.</th><th>Data</th>
          </tr>
        </thead>
        <tbody>
          {[1,2,3].map(i => (
            <tr key={i}><td className="text-center">{i}</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          ))}
        </tbody>
      </table>

      {/* Tabelul 8 - concluzii */}
      <div className="section-title">6. Concluzii Tabelul nr. 8</div>
      <table className="checklist-table">
        <thead>
          <tr><th></th><th colSpan={2}>De completat</th><th>Observatii</th></tr>
          <tr><th></th><th className="yn-col">Da</th><th className="yn-col">Nu</th><th></th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Pe baza documentelor prezentate si a operatiunilor realizate in cadrul reviziei tehnice se constata ca instalatia de utilizare a gazelor naturale respecta prevederile normelor tehnice si poate functiona in conditii de siguranta</td>
            <td className="text-center"><Chk val={r.conclusion} target="ADMIS" /></td>
            <td className="text-center"><Chk val={r.conclusion} target="RESPINS" /></td>
            <td>{r.observations || ""}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ fontSize: 8, fontStyle: "italic", margin: "4px 0" }}>Nota: Varianta corecta se bifeaza cu "X".</div>

      <div className="signature-section">
        <div className="sig-box">
          <div className="bold">Instalator autorizat care a efectuat verificarea tehnica,</div>
          <div>Nume si prenume <span className="bold italic">TIMOCE CLAUDIU VASILE</span></div>
          <div style={{ marginTop: 4 }}>Semnatura ………………………………</div>
        </div>
        <div className="sig-box">
          <div className="bold">Clientul final</div>
          <div>Nume si prenume <strong>{client?.last_name} {client?.first_name}</strong></div>
          <div style={{ marginTop: 4 }}>
            Semnatura ………………………………
            {r.client_sig && <img src={r.client_sig} className="sig-img" alt="" />}
          </div>
        </div>
      </div>

      <div className="footer-note">
        Prezenta fisa se intocmeste in 3 exemplare, cate unul pentru a) clientul final/clientii finali, b) operatorul economic autorizat ANRE pentru executia instalatiei de utilizare a gazelor naturale, c) operatorul de sistem.
        Reprezentantul legal/Imputernicitul operatorului economic autorizat ANRE: <strong>ATIMO PROJECT S.R.L.</strong>
      </div>
    </div>
  );
}

// ─── CONTRACT PDF TEMPLATE ────────────────────────────────────────────────────

export function ContractPDFTemplate({ c, client }) {
  const fmtDate = (d) => {
    if (!d) return "………………";
    return new Date(d).toLocaleDateString("ro-RO");
  };

  const services = [
    { code: "T7", key: "vtp", label: "VTP - Verificare Tehnică Periodică a Centralei Termice, conform cerințelor legale în vigoare." },
    { code: "T6", key: "pif", label: "PIF - Punere în funcțiune a Centralei Termice, conform cerințelor legale în vigoare." },
    { code: "G4", key: "viu", label: "ViU - Verificare a Instalației de Utilizare Gaze Naturale, conform cerințelor legale în vigoare." },
    { code: "G5", key: "riu", label: "RiU - Revizia Instalației de Utilizare Gaze Naturale, conform cerințelor legale în vigoare." },
    { code: "G3", key: "detector", label: "Montaj Senzor de Gaz cu Electrovana, conform cerințelor ANRE legale în vigoare." },
    { code: "G6", key: "suplimentar", label: "Servicii Suplimentare Gaz, conform cerințelor ANRE legale în vigoare." },
    { code: "T11", key: "termostat", label: "Montaj Termostat, conform cerințelor ISCIR legale în vigoare." },
    { code: "T13", key: "filtru", label: "Montaj Filtru Magnetic, conform cerințelor ISCIR legale în vigoare." },
    { code: "UR", key: "urgenta", label: "Taxa Urgenta" },
    { code: "DE", key: "deplasare", label: "Tarif Deplasare" },
  ];

  const checkedServices = (c.services || []).filter(s => s.checked).map(s => s.label);
  const isChecked = (label) => checkedServices.some(l => l.toLowerCase().includes(label.toLowerCase().split(" ")[0].toLowerCase()));

  return (
    <div className="print-area">
      {/* Header cu antet complet */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, paddingBottom: 6, borderBottom: "2px solid #E8501A" }}>
        <div style={{ fontSize: 8, lineHeight: 1.4 }}>
          <div style={{ fontWeight: "bold", fontSize: 10 }}>ATIMO PROJECT S.R.L.</div>
          <div>Str. Grigore Silași, Nr. 7, Beclean, Bistrița-Năsăud</div>
          <div>Telefon: 0770 225 225 | Email: office@atimo.ro</div>
          <div>Web: www.atimo.ro</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontFamily: "Arial", fontWeight: "bold", fontSize: 20, color: "#E8501A" }}>atimo</div>
          <div style={{ display: "flex", gap: 4 }}>
            <div style={{ border: "1px solid #003399", borderRadius: 3, padding: "2px 4px", fontSize: 7, textAlign: "center" }}>
              <div style={{ fontWeight: "bold", color: "#003399" }}>ANRE</div>
              <div>Autorizat</div>
            </div>
            <div style={{ border: "1px solid #cc0000", borderRadius: 3, padding: "2px 4px", fontSize: 7, textAlign: "center" }}>
              <div style={{ fontWeight: "bold", color: "#cc0000" }}>ISCIR</div>
              <div>Autorizat</div>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 9, textAlign: "right" }}>
          <div style={{ fontWeight: "bold", color: "#E8501A", fontSize: 11 }}>CTR-V</div>
        </div>
      </div>

      <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 13, margin: "6px 0 2px" }}>CONTRACT DE PRESTĂRI SERVICII</div>
      <div style={{ textAlign: "center", fontSize: 10, marginBottom: 8 }}>
        Serie/Nr. <strong>{c.number}</strong> / Data: <strong>{fmtDate(c.date)}</strong>
      </div>

      <div className="contract-art">
        <div className="contract-art-title">Art I. Părțile contractante:</div>
        <div>
          Nume, prenume <strong>{client?.last_name} {client?.first_name}</strong>, localitatea <strong>{client?.city}</strong>,
          județul/sectorul <strong>{client?.county}</strong>, str. <strong>{client?.address}</strong>,
          telefon <strong>{client?.phone}</strong>, adresă email <strong>{client?.email}</strong>,
          identificat prin CI/BI <strong>{client?.id_series}</strong>, serie/număr <strong>{client?.id_series}/{client?.id_number}</strong>,
          cod numeric personal <strong>{client?.cnp}</strong>, denumit/ă în continuare <strong>beneficiar</strong>, a convenit la încheierea contractului
          nr. <strong>{c.number}</strong> de prestări servicii cu:
        </div>
        <div style={{ margin: "4px 0" }}>
          <strong>ATIMO PROJECT S.R.L.</strong>, având sediul social în loc. Beclean, str. Silași Grigore, nr. 7, sc. 1, ap. 2, jud. Bistrița-Năsăud,
          înregistrată la Registrul Comerțului cu nr. J2018000236062, CUI RO38992313, având cont IBAN RO81BTRLRONCRT0438376701
          la Banca Transilvania – Agenția Beclean, denumită în continuare <strong>prestator</strong>, persoană juridică, în calitate de firmă autorizată ANRE și ISCIR, pentru amplasamentul de mai jos:
        </div>
        <div>
          Amplasamentul: Localitatea <strong>{client?.city}</strong>, județul/sectorul <strong>{client?.county}</strong>,
          str. <strong>{client?.address}</strong>.
        </div>
      </div>

      <div className="contract-art">
        <div className="contract-art-title">Art. II. Obiectul contractului:</div>
        <div style={{ marginBottom: 4 }}>2.1 Serviciile ce urmează a fi prestate (se bifează opțiunea corespunzătoare):</div>
        {services.map((svc, i) => {
          const checked = isChecked(svc.key) || (c.services || []).some(s => s.checked && s.label.includes(svc.label.split(" - ")[0]));
          return (
            <div key={i} className="service-row">
              <span style={{ color: "#E8501A", minWidth: 25, fontSize: 8 }}>- {svc.code}</span>
              <span className="checkbox-sq">{checked ? "✓" : ""}</span>
              <span style={{ color: checked ? "#000" : "#666" }}>{svc.label}</span>
            </div>
          );
        })}
      </div>

      <div className="contract-art">
        <div className="contract-art-title">Art. III. Durata contractului:</div>
        <div>3.1 Durata executării serviciilor este de <strong>{c.duration || "___"}</strong> zile, începând de la data semnării prezentului contract.</div>
        <div>3.2 Prelungirea duratei contractului se poate realiza doar prin acordul scris al ambelor părți, prin act adițional.</div>
      </div>

      <div className="contract-art">
        <div className="contract-art-title">Art. IV. Prețul:</div>
        <div>4.1 Prețul total pentru serviciile contractate la Art. II este de: <strong>{c.total_price} lei (TVA inclus)</strong>.</div>
        <div>4.2 Plata se poate efectua integral sau în tranșe, conform înțelegerii între părți, astfel încât la finalizarea lucrării, toate obligațiile de plată să fie achitate.</div>
        <div>4.3 Modalitate plată: <strong>{c.payment_method}</strong>.</div>
      </div>

      <div className="contract-art">
        <div className="contract-art-title">Art. V. Obligațiile prestatorului:</div>
        <div>5.1 Prestatorul se obligă să furnizeze serviciile alese la Art. II în conformitate cu cerințele legale aplicabile și în termenul stabilit la Art. III.</div>
        <div>5.2 Prestatorul se obligă să utilizeze echipamente și personal calificat pentru executarea serviciilor.</div>
        <div>5.3 Prestatorul va asigura toate autorizările și avizele necesare pentru efectuarea serviciilor contractate.</div>
      </div>

      <div className="contract-art">
        <div className="contract-art-title">Art. VI. Obligațiile beneficiarului:</div>
        <div>6.1 Beneficiarul se obligă să permită accesul prestatorului în imobil pentru realizarea serviciilor contractate.</div>
        <div>6.2 Beneficiarul se obligă să furnizeze toate informațiile și documentele necesare pentru realizarea obiectului prezentului contract.</div>
        <div>6.3 Beneficiarul se obligă să îndeplinească obligațiile de plată către prestator în cuantumul și la termenele stabilite de comun acord.</div>
      </div>

      <div className="contract-art">
        <div className="contract-art-title">Art. VII. Alte clauze:</div>
        <div>7.1 Orice completări sau modificări ale prezentului contract vor fi valabile doar dacă sunt exprimate în scris și semnate de ambele părți, sub forma unor acte adiționale.</div>
        <div>7.2 Pentru nerespectarea totală sau parțială sau pentru executarea defectuoasă a vreuneia dintre clauzele contractuale, partea vinovată va fi responsabilă de plata daunelor-interese.</div>
        <div>7.3 Eventualele litigii vor fi soluționate pe cale amiabilă, iar dacă acest lucru este imposibil, litigiul va fi dedus spre soluționare instanței în a cărei rază teritorială se află sediul antreprenorului.</div>
        <div>7.4 Forța majoră, așa cum este definită de lege, exonerează de răspundere partea care o invocă, cu cerința notificării scrise prealabile în termen de 3 zile.</div>
      </div>

      <div style={{ fontSize: 9, margin: "4px 0" }}>
        Prezentul contract se întocmește în 2 (două) exemplare, și intră în vigoare astăzi <strong>{fmtDate(c.date)}</strong>, după semnarea lui de către ambele părți.
      </div>

      <div style={{ fontSize: 8, fontStyle: "italic", margin: "4px 0", lineHeight: 1.4 }}>
        <strong>Notă: GDPR</strong> — Dorim să vă notificăm că informațiile din acest contract vor fi tratate confidențial, în conformitate cu prevederile Regulamentului European 679/2016 privind protecția persoanelor fizice în ceea ce privește prelucrarea datelor cu caracter personal și libera circulație a acestor date (GDPR).
        Prin semnarea prezentului înscris vă exprimați acordul ca datele cu caracter personal conținute în cuprinsul Contractului de prestari servicii să fie utilizate în scopul îndeplinirii cerințelor dumneavoastră.
      </div>

      <div className="signature-section" style={{ marginTop: 12 }}>
        <div className="sig-box">
          <div className="bold">PRESTATOR: ATIMO PROJECT S.R.L.</div>
          <div>Timoce Claudiu-Vasile</div>
          {c.technician_sig
            ? <img src={c.technician_sig} className="sig-img" alt="" />
            : <div style={{ marginTop: 28, borderTop: "1px solid #000", paddingTop: 3, fontSize: 8 }}>Semnătură și ștampilă</div>
          }
        </div>
        <div className="sig-box">
          <div className="bold">BENEFICIAR:</div>
          <div>{client?.last_name} {client?.first_name}</div>
          {c.client_sig
            ? <img src={c.client_sig} className="sig-img" alt="" />
            : <div style={{ marginTop: 28, borderTop: "1px solid #000", paddingTop: 3, fontSize: 8 }}>Semnătură</div>
          }
        </div>
      </div>

      <div style={{ textAlign: "right", fontSize: 8, marginTop: 4, color: "#E8501A" }}>CTR-V 06-2025 &nbsp;&nbsp; 1/1</div>
    </div>
  );
}
