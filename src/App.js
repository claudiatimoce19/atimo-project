import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";

const COLORS = {
  primary: "#1B4F8A", primaryDark: "#0D3060", primaryLight: "#E8F0FA",
  accent: "#E8501A", success: "#2A7D4F", successLight: "#E8F5EE",
  warning: "#B87514", warningLight: "#FBF4E6",
  danger: "#C0392B", dangerLight: "#FDECEA",
  gray50: "#F7F8FA", gray100: "#EFF1F5", gray200: "#D9DCE4",
  gray400: "#9098A9", gray600: "#5A6478", gray800: "#2C3345", gray900: "#181D2B",
};

const SERVICE_TYPES = [
  "ViU - Verificare Instalație Utilizare","RiU - Revizie Instalație Utilizare",
  "VTP - Verificare Tehnică Periodică","PIF - Punere în Funcțiune",
  "Montaj detector gaze","Montaj termostat","Montaj filtru magnetic",
  "Servicii gaz suplimentare","Taxă deplasare","Taxă urgență",
];

const COUNTIES = ["Alba","Arad","Argeș","Bacău","Bihor","Bistrița-Năsăud","Botoșani","Brașov","Brăila","București","Buzău","Caraș-Severin","Călărași","Cluj","Constanța","Covasna","Dâmbovița","Dolj","Galați","Giurgiu","Gorj","Harghita","Hunedoara","Ialomița","Iași","Ilfov","Maramureș","Mehedinți","Mureș","Neamț","Olt","Prahova","Satu Mare","Sălaj","Sibiu","Suceava","Teleorman","Timiș","Tulcea","Vaslui","Vâlcea","Vrancea"];

const VIU_OPS = [
  "Verificarea arzatoarelor si a starii imbinarilor si garniturilor de etansare aferente",
  "Verificarea stabilitatii conductelor montate aperent pe suporti",
  "Verificarea etanseitatii imbinarii conductelor si armaturilor la presiunea de lucru a gazului din instalatie, cu spuma de apa cu sapun sau cu alte tehnologii",
  "Verificarea functionarii aparatelor de masura, control reglare si de siguranta",
  "Demontarea/Debransarea aparatelor consumatoare de combustibili gazosi fara aprobare legala si a instalatiilor aferente",
  "Verificarea functionarii echipamentului de reglare din instalatiile de utilizare",
  "Verificarea starii rasuflatorilor si a caminelor existente",
  "Verificarea documentelor prezentate de client privind curatarea cosurilor si a canalelor de evacuare a gazelor de ardere (max. 6 luni)",
  "Verificarea starii constructiilor care adapostesc statiile si posturile de reglare-masurare",
  "Verificarea documentelor care atesta verificarea tehnica periodica a aparatelor consumatoare de combustibili gazosi de catre operatorii autorizati ISCIR",
  "Verificarea tehnica a instalatiei comune de utilizare GN care deserveste mai multi clienti finali",
  "Verificarea faptului ca racordul flexibil montat in instalatia de utilizare este in termen de valabilitate",
  "Verificarea faptului ca detectorul/detectoarele automate de gaze montat/montate la locul de consum este/sunt in termen de valabilitate",
  "Verificarea existentei instructiunilor de utilizare a gazelor naturale, conform Procedurii ANRE nr. 156/2020",
];

const RIU_OPS = [
  "Verificarea arzatoarelor si a starii imbinarilor si garniturilor de etansare aferente",
  "Verificarea stabilitatii conductelor montate aperent pe suporti",
  "Verificarea etanseitatii imbinarii conductelor si armaturilor la presiunea de lucru a gazului din instalatie, cu spuma de apa cu sapun sau cu alte tehnologii",
  "Verificarea functionarii aparatelor de masura, control reglare si de siguranta",
  "Demontarea/Debransarea aparatelor consumatoare de combustibili gazosi fara aprobare legala si a instalatiilor aferente",
  "Verificarea functionarii echipamentului de reglare din instalatiile de utilizare",
  "Verificarea starii rasuflatorilor si a caminelor existente",
  "Verificarea documentelor prezentate de client privind curatarea cosurilor si a canalelor de evacuare a gazelor de ardere, emise cu maximum 6 luni inainte",
  "Verificarea starii constructiilor care adapostesc statiile si posturile de reglare-masurare",
  "Verificarea documentelor care atesta verificarea tehnica periodica a aparatelor consumatoare de combustibili gazosi de catre operatorii autorizati ISCIR",
  "Efectuarea probei de rezistenta la presiune, conform normelor tehnice GN, numai pentru partea de instalatie la care s-au facut inlocuiri/modificari",
  "Efectuarea probei de etanseitate la presiune, conform normelor tehnice GN, a intregii instalatii de utilizare a gazelor naturale",
  "Verificarea faptului ca racordul flexibil montat in instalatia de utilizare este in termen de valabilitate",
  "Verificarea faptului ca detectorul/detectoarele automate de gaze montat/montate la locul de consum este/sunt in termen de valabilitate",
  "Revizia tehnica a instalatiei comune de utilizare GN care deserveste mai multi clienti finali, cuprinsa intre statia sau postul de reglare si sistemele/mijloacele de masurare a GN",
  "Verificarea existentei instructiunilor de utilizare a gazelor naturale, conform Procedurii ANRE nr. 156/2020",
];

function today() { return new Date().toISOString().split("T")[0]; }
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate()+n); return x.toISOString().split("T")[0]; }
function fmt(d) { if(!d) return "………………"; return new Date(d).toLocaleDateString("ro-RO"); }
function fmtApp(d) { if(!d) return "-"; return new Date(d).toLocaleDateString("ro-RO"); }

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:${COLORS.gray50};color:${COLORS.gray800};font-size:14px;}
::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-thumb{background:${COLORS.gray200};border-radius:3px;}
input,select,textarea,button{font-family:inherit;}button{cursor:pointer;}
.app{display:flex;height:100vh;overflow:hidden;}
.sidebar{width:240px;background:${COLORS.primaryDark};display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto;}
.sidebar-logo{padding:20px 20px 16px;border-bottom:1px solid rgba(255,255,255,0.08);}
.logo-name{font-size:15px;font-weight:600;color:#fff;}
.logo-sub{font-size:11px;color:rgba(255,255,255,0.45);margin-top:2px;}
.nav{padding:12px 0;flex:1;}
.nav-label{font-size:10px;font-weight:600;letter-spacing:0.08em;color:rgba(255,255,255,0.35);padding:8px 20px 4px;text-transform:uppercase;}
.nav-btn{display:flex;align-items:center;gap:10px;padding:9px 20px;color:rgba(255,255,255,0.6);background:none;border:none;width:100%;font-size:14px;transition:all 0.15s;}
.nav-btn:hover{color:#fff;background:rgba(255,255,255,0.07);}
.nav-btn.active{color:#fff;background:rgba(255,255,255,0.13);}
.nav-badge{margin-left:auto;background:${COLORS.accent};color:#fff;font-size:11px;padding:1px 7px;border-radius:10px;font-weight:600;}
.sidebar-user{padding:16px 20px;border-top:1px solid rgba(255,255,255,0.08);}
.user-name{font-size:13px;color:rgba(255,255,255,0.8);font-weight:500;}
.user-role{font-size:11px;color:rgba(255,255,255,0.4);margin-top:2px;}
.logout-btn{display:flex;align-items:center;gap:7px;padding:8px 0 0;color:rgba(255,255,255,0.4);font-size:12px;background:none;border:none;}
.logout-btn:hover{color:rgba(255,255,255,0.7);}
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
.topbar{height:56px;background:#fff;border-bottom:1px solid ${COLORS.gray100};display:flex;align-items:center;padding:0 24px;gap:16px;flex-shrink:0;}
.topbar-title{font-size:16px;font-weight:600;flex:1;}
.page{flex:1;overflow-y:auto;padding:24px;}
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;font-size:14px;font-weight:500;border:none;transition:all 0.15s;}
.btn-sm{padding:5px 12px;font-size:13px;border-radius:6px;}
.btn-primary{background:${COLORS.primary};color:#fff;}.btn-primary:hover{background:${COLORS.primaryDark};}
.btn-ghost{background:transparent;color:${COLORS.gray600};border:1px solid ${COLORS.gray200};}.btn-ghost:hover{background:${COLORS.gray100};}
.btn-icon{padding:7px;border-radius:6px;background:transparent;border:1px solid ${COLORS.gray200};color:${COLORS.gray600};}
.btn-icon:hover{background:${COLORS.gray100};}
.card{background:#fff;border-radius:12px;border:1px solid ${COLORS.gray100};}
.card-header{padding:16px 20px 12px;border-bottom:1px solid ${COLORS.gray100};display:flex;align-items:center;gap:10px;}
.card-title{font-size:15px;font-weight:600;flex:1;}
.stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-bottom:24px;}
.stat{background:#fff;border-radius:10px;border:1px solid ${COLORS.gray100};padding:16px 20px;}
.stat.accent-stat{background:${COLORS.primary};border-color:${COLORS.primary};}
.stat-label{font-size:12px;color:${COLORS.gray400};margin-bottom:6px;}
.accent-stat .stat-label{color:rgba(255,255,255,0.6);}
.stat-val{font-size:26px;font-weight:600;line-height:1;}
.accent-stat .stat-val{color:#fff;}
.stat-sub{font-size:12px;color:${COLORS.gray400};margin-top:4px;}
.accent-stat .stat-sub{color:rgba(255,255,255,0.5);}
table{width:100%;border-collapse:collapse;}
thead th{padding:10px 14px;font-size:12px;font-weight:600;color:${COLORS.gray400};text-align:left;background:${COLORS.gray50};border-bottom:1px solid ${COLORS.gray100};white-space:nowrap;}
tbody td{padding:12px 14px;border-bottom:1px solid ${COLORS.gray100};}
tbody tr:last-child td{border-bottom:none;}
tbody tr:hover td{background:${COLORS.gray50};}
.tbl-wrap{overflow-x:auto;}
.badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:12px;font-weight:500;}
.b-blue{background:${COLORS.primaryLight};color:${COLORS.primary};}
.b-green{background:${COLORS.successLight};color:${COLORS.success};}
.b-orange{background:${COLORS.warningLight};color:${COLORS.warning};}
.b-red{background:${COLORS.dangerLight};color:${COLORS.danger};}
.b-gray{background:${COLORS.gray100};color:${COLORS.gray600};}
.filter-bar{display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;align-items:center;}
.search-box{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid ${COLORS.gray200};border-radius:8px;padding:7px 12px;flex:1;min-width:200px;}
.search-box input{border:none;background:transparent;outline:none;flex:1;font-size:14px;}
.fgroup{display:flex;flex-direction:column;gap:5px;}
.fgroup label{font-size:12px;font-weight:600;color:${COLORS.gray600};}
.fgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px;}
.spanfull{grid-column:1/-1;}
input[type=text],input[type=email],input[type=tel],input[type=date],input[type=number],input[type=password],select,textarea{padding:9px 12px;border:1px solid ${COLORS.gray200};border-radius:8px;font-size:14px;color:${COLORS.gray800};background:#fff;width:100%;}
input:focus,select:focus,textarea:focus{outline:none;border-color:${COLORS.primary};box-shadow:0 0 0 3px ${COLORS.primaryLight};}
textarea{resize:vertical;min-height:80px;}
.fsec{margin-bottom:22px;}
.fsec-title{font-size:11px;font-weight:700;color:${COLORS.gray400};text-transform:uppercase;letter-spacing:0.07em;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid ${COLORS.gray100};}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px;}
.modal{background:#fff;border-radius:16px;width:100%;max-width:700px;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.15);}
.modal-lg{max-width:900px;}
.modal-hdr{padding:20px 24px 16px;border-bottom:1px solid ${COLORS.gray100};display:flex;align-items:center;gap:10px;flex-shrink:0;}
.modal-title{font-size:16px;font-weight:600;flex:1;}
.modal-body{padding:24px;overflow-y:auto;flex:1;}
.modal-foot{padding:16px 24px;border-top:1px solid ${COLORS.gray100};display:flex;justify-content:flex-end;gap:8px;flex-shrink:0;}
.tabs{display:flex;border-bottom:2px solid ${COLORS.gray100};margin-bottom:20px;}
.tab{padding:10px 18px;font-size:14px;font-weight:500;background:none;border:none;color:${COLORS.gray400};border-bottom:2px solid transparent;margin-bottom:-2px;}
.tab.active{color:${COLORS.primary};border-bottom-color:${COLORS.primary};}
.tab:hover:not(.active){color:${COLORS.gray600};}
.checklist-row{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid ${COLORS.gray100};flex-wrap:wrap;}
.checklist-text{flex:1;min-width:200px;}
.check-opts{display:flex;gap:10px;}
.check-opt{display:flex;align-items:center;gap:4px;font-size:13px;}
.check-opt input{width:auto;}
.sig-wrap{border:2px dashed ${COLORS.gray200};border-radius:10px;background:${COLORS.gray50};position:relative;}
.sig-canvas{display:block;cursor:crosshair;touch-action:none;width:100%;height:150px;}
.sig-clear{position:absolute;top:8px;right:8px;}
.login-page{min-height:100vh;background:${COLORS.primaryDark};display:flex;align-items:center;justify-content:center;padding:20px;}
.login-card{background:#fff;border-radius:20px;padding:40px;width:100%;max-width:400px;}
.login-logo-name{font-size:20px;font-weight:700;color:${COLORS.primaryDark};margin-bottom:2px;}
.login-logo-sub{font-size:13px;color:${COLORS.gray400};margin-bottom:28px;}
.login-title{font-size:22px;font-weight:600;margin-bottom:4px;}
.login-sub{font-size:14px;color:${COLORS.gray400};margin-bottom:24px;}
.login-err{background:${COLORS.dangerLight};color:${COLORS.danger};padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:16px;}
.alert{padding:12px 16px;border-radius:8px;font-size:14px;margin-bottom:16px;display:flex;align-items:center;gap:8px;}
.alert-warn{background:${COLORS.warningLight};color:#744f0d;border:1px solid #f5d48a;}
.empty{text-align:center;padding:48px 20px;color:${COLORS.gray400};}
.spinner{display:inline-block;width:20px;height:20px;border:2px solid ${COLORS.gray200};border-top-color:${COLORS.primary};border-radius:50%;animation:spin 0.7s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
/* PDF print styles */
.print-area{font-family:Arial,sans-serif;font-size:10px;color:#000;background:#fff;padding:10mm 12mm;max-width:210mm;margin:0 auto;}
.atimo-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;padding-bottom:4px;border-bottom:2px solid #E8501A;}
.atimo-co{font-size:8px;line-height:1.4;}
.atimo-co-name{font-size:11px;font-weight:bold;color:#E8501A;}
.doc-annex{color:#E8501A;font-style:italic;font-size:9px;margin-bottom:3px;}
.doc-title{font-size:11px;font-weight:bold;text-align:center;margin:4px 0 2px;}
.doc-subtitle{font-size:9px;text-align:center;margin-bottom:2px;}
.doc-nr{font-size:9px;text-align:center;font-style:italic;margin-bottom:6px;}
.mt{width:100%;border-collapse:collapse;margin-bottom:6px;font-size:8.5px;}
.mt th,.mt td{border:1px solid #000;padding:2px 4px;vertical-align:top;}
.mt th{background:#f0f0f0;font-weight:bold;text-align:left;}
.ct{width:100%;border-collapse:collapse;font-size:8px;margin-bottom:5px;}
.ct th,.ct td{border:1px solid #000;padding:2px 3px;vertical-align:middle;}
.ct th{background:#f0f0f0;text-align:center;}
.sec-title{font-size:8.5px;font-weight:bold;margin:5px 0 2px;}
.tbl-nr{font-size:8.5px;font-weight:bold;text-align:center;margin:3px 0 2px;}
.chk{font-size:10px;font-weight:bold;}
.imp-note{font-size:7.5px;font-style:italic;margin:3px 0;line-height:1.4;}
.sig-area{display:flex;justify-content:space-between;margin-top:8px;font-size:8.5px;}
.sig-box{width:45%;}
.sig-img{max-width:130px;max-height:45px;object-fit:contain;display:block;}
.footer-note{font-size:7px;margin-top:5px;line-height:1.4;border-top:1px solid #ccc;padding-top:3px;}
.ctr-art{margin-bottom:6px;font-size:8.5px;line-height:1.5;}
.ctr-art-title{font-weight:bold;font-style:italic;margin-bottom:2px;}
.svc-row{display:flex;align-items:center;gap:5px;margin:1px 0;font-size:8.5px;}
.chk-sq{width:9px;height:9px;border:1px solid #000;display:inline-flex;align-items:center;justify-content:center;font-size:7px;flex-shrink:0;}
@media print{
  .modal-bg{position:static;background:none;padding:0;}
  .modal{max-width:none;max-height:none;box-shadow:none;border-radius:0;}
  .modal-hdr,.modal-foot{display:none;}
  .modal-body{padding:0;overflow:visible;}
  .no-print{display:none!important;}
}
@media(max-width:768px){
  .sidebar{position:fixed;left:-240px;top:0;bottom:0;z-index:500;transition:left 0.25s;}
  .sidebar.open{left:0;box-shadow:4px 0 20px rgba(0,0,0,0.3);}
  .page{padding:16px;}
  .fgrid{grid-template-columns:1fr;}
  .spanfull{grid-column:span 1;}
}
`;

// ─── ICON ─────────────────────────────────────────────────────────────────────

function Ic({ n, s = 18 }) {
  const p = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    users: <><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.85"/></>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></>,
    doc: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></>,
    filetxt: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash: <><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    check: <polyline points="20,6 9,12 4,9"/>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    cal: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    menu: <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    print: <><polyline points="6,9 6,2 18,2 18,9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></>,
    warn: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{p[n]}</svg>;
}

// ─── SIGNATURE PAD ───────────────────────────────────────────────────────────

function SigPad({ value, onChange, label }) {
  const ref = useRef(null);
  const drawing = useRef(false);
  const last = useRef(null);
  useEffect(() => {
    if (value && ref.current) { const img = new Image(); img.onload = () => ref.current.getContext("2d").drawImage(img, 0, 0); img.src = value; }
  }, []);
  const getPos = (e) => {
    const r = ref.current.getBoundingClientRect();
    const sx = ref.current.width / r.width, sy = ref.current.height / r.height;
    if (e.touches) return { x: (e.touches[0].clientX - r.left) * sx, y: (e.touches[0].clientY - r.top) * sy };
    return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy };
  };
  const start = (e) => { e.preventDefault(); drawing.current = true; last.current = getPos(e); };
  const move = (e) => {
    if (!drawing.current) return; e.preventDefault();
    const ctx = ref.current.getContext("2d"), pos = getPos(e);
    ctx.beginPath(); ctx.moveTo(last.current.x, last.current.y); ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#1B4F8A"; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.stroke();
    last.current = pos;
  };
  const end = () => { if (!drawing.current) return; drawing.current = false; onChange(ref.current.toDataURL()); };
  const clear = () => { ref.current.getContext("2d").clearRect(0, 0, 400, 150); onChange(null); };
  return (
    <div>
      {label && <label style={{ display: "block", marginBottom: 8, fontSize: 12, fontWeight: 600, color: COLORS.gray600 }}>{label}</label>}
      <div className="sig-wrap">
        <canvas ref={ref} className="sig-canvas" width={400} height={150}
          onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
          onTouchStart={start} onTouchMove={move} onTouchEnd={end} />
        <button className="btn btn-sm btn-ghost sig-clear" onClick={clear} type="button">Șterge</button>
      </div>
      <p style={{ fontSize: 11, color: COLORS.gray400, marginTop: 4 }}>Semnați în câmpul de mai sus cu mouse-ul sau degetul</p>
    </div>
  );
}

// ─── PDF: ANTET ATIMO ────────────────────────────────────────────────────────

function AtimoAntet() {
  return (
    <div className="atimo-hdr">
      <div className="atimo-co">
        <div className="atimo-co-name">ATIMO PROJECT S.R.L.</div>
        <div>Str. Grigore Silași, Nr. 7, Beclean, Bistrița-Năsăud</div>
        <div>Tel: 0770 225 225 | Email: office@atimo.ro | Web: www.atimo.ro</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ fontFamily: "Arial", fontWeight: "bold", fontSize: 18, color: "#E8501A" }}>atimo</div>
        <div style={{ display: "flex", gap: 3 }}>
          <div style={{ border: "1px solid #003399", borderRadius: 3, padding: "1px 3px", fontSize: 6, textAlign: "center" }}>
            <div style={{ fontWeight: "bold", color: "#003399" }}>ANRE</div><div>Autorizat</div>
          </div>
          <div style={{ border: "1px solid #cc0000", borderRadius: 3, padding: "1px 3px", fontSize: 6, textAlign: "center" }}>
            <div style={{ fontWeight: "bold", color: "#cc0000" }}>ISCIR</div><div>Autorizat</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chk({ val, target }) {
  return <span className="chk">{val === target ? "X" : ""}</span>;
}

// ─── PDF VIU ─────────────────────────────────────────────────────────────────

function ViuPDF({ r, client }) {
  const cl = r.checklist || {};
  const ops = r.type === "RiU" ? RIU_OPS : VIU_OPS;
  return (
    <div className="print-area">
      <AtimoAntet />
      <div className="doc-annex">Anexa {r.type === "RiU" ? "2" : "1"} la Contractul de prestari servicii nr. {r.contract_number || "………………"} din data {fmt(r.date)}</div>
      <div className="doc-title">FISA DE EVIDENTA</div>
      <div className="doc-subtitle">a lucrarilor periodice de {r.type === "RiU" ? "revizie" : "verificare"} tehnica a instalatiei de utilizare a gazelor naturale</div>
      <div className="doc-nr">Nr. {r.number} / Data {fmt(r.date)}</div>

      <table className="mt">
        <tbody>
          <tr>
            <td style={{ width: "5%" }}>1</td>
            <td style={{ width: "35%" }}>Date identificare client</td>
            <td>Nume: <strong>{client?.last_name}</strong> &nbsp; Prenume: <strong>{client?.first_name}</strong></td>
          </tr>
          <tr>
            <td>2</td>
            <td>Adresa locului de consum</td>
            <td>{r.consumption_address || client?.address}, localitate {client?.city}, jud. {client?.county}</td>
          </tr>
          <tr><td>3</td><td>Cod abonat</td><td>{client?.subscriber_code || ""}</td></tr>
          <tr><td>4</td><td>Cod loc consum</td><td>{client?.consumption_code || ""}</td></tr>
          <tr><td>5</td><td>Contractul de prestari servicii</td><td>Numar {r.contract_number || "………………"} data {fmt(r.date)}</td></tr>
          <tr><td>6</td><td>Documentatie tehnica in baza careia se executa verificarea tehnica</td><td></td></tr>
          <tr>
            <td>7</td>
            <td>Data ultimei verificari tehnice si scadentei pentru locul de consum</td>
            <td>Ultima verificare: <strong>{fmt(r.last_verification_date)}</strong> &nbsp; Scadenta: <strong>{fmt(r.due_date)}</strong></td>
          </tr>
          <tr>
            <td>8</td>
            <td>Instalator autorizat din cadrul operatorului economic ANRE care efectueaza {r.type === "RiU" ? "revizia" : "verificarea"} tehnica</td>
            <td>Nume si Prenume <strong><em>TIMOCE CLAUDIU VASILE</em></strong> Legitimatie tip <em>EGIU</em><br/>Nr. <strong>405180124</strong> anul <strong>14.05.2023</strong> Valabila pana la data de <strong>13.05.2028</strong></td>
          </tr>
          <tr>
            <td>9</td>
            <td>Aparate consumatoare de combustibili gazosi</td>
            <td style={{ padding: 0 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 8 }}>
                <thead>
                  <tr>
                    <th colSpan={2} style={{ border: "1px solid #000", padding: "2px 3px", background: "#f0f0f0" }}>Notificate de furnizorul de GN</th>
                    <th colSpan={2} style={{ border: "1px solid #000", padding: "2px 3px", background: "#f0f0f0" }}>Identificate la locul de consum</th>
                  </tr>
                  <tr>
                    {["Tip","Debit nominal","Tip","Debit nominal"].map((h,i) => (
                      <th key={i} style={{ border: "1px solid #000", padding: "2px 3px", background: "#f0f0f0" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[0,1,2].map(i => (
                    <tr key={i}>
                      {[0,1,2,3].map(j => <td key={j} style={{ border: "1px solid #000", padding: "3px 3px" }}></td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
          {r.type === "RiU" && (
            <tr>
              <td>10</td>
              <td>Proces-verbal de demontare/montare a sistemului/mijlocului de masurare a gazelor naturale</td>
              <td>Numar {r.meter_protocol_number || "………………"} data {fmt(r.meter_protocol_date)}</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Tabelul 1 - situatii */}
      <div className="sec-title">1. {r.type === "RiU" ? "Revizia" : "Verificarea"} tehnica a instalatiei de utilizare a gazelor naturale se realizeaza in urmatoarele situatii: Tabelul nr. 1</div>
      <table className="ct">
        <thead><tr><th style={{ width: "5%" }}>Nr</th><th>Tip lucrare</th><th style={{ width: "15%" }}>De completat</th></tr></thead>
        <tbody>
          {r.type === "RiU" ? [
            "La interval de maximum 10 ani",
            "Dupa orice intrerupere a utilizarii instalatiei pentru o perioada mai mare de 6 luni",
            "Dupa orice eveniment care poate afecta instalatia de utilizare",
            "La cererea clientului final"
          ].map((t,i) => (
            <tr key={i}><td style={{ textAlign: "center" }}>{i+1}</td><td>{t}</td><td style={{ textAlign: "center" }}></td></tr>
          )) : [
            "La interval de maximum 2 ani",
            "La cererea clientului final"
          ].map((t,i) => (
            <tr key={i}><td style={{ textAlign: "center" }}>{i+1}</td><td>{t}</td><td style={{ textAlign: "center" }}></td></tr>
          ))}
        </tbody>
      </table>

      {/* Tabelul 2 - tip instalatie */}
      <div className="tbl-nr">Tabelul nr. 2</div>
      <table className="ct">
        <thead><tr><th style={{ width: "5%" }}>Nr</th><th>De completat</th><th style={{ width: "15%" }}>Observatii</th></tr></thead>
        <tbody>
          <tr>
            <td style={{ textAlign: "center" }}>1</td>
            <td>{r.type === "RiU" ? "Revizia" : "Verificarea"} tehnica a instalatiei individuale de utilizare a gazelor naturale</td>
            <td style={{ textAlign: "center" }}><Chk val={r.installation_type} target="Individuală" /></td>
          </tr>
          <tr>
            <td style={{ textAlign: "center" }}>2</td>
            <td>{r.type === "RiU" ? "Revizia" : "Verificarea"} tehnica a instalatiei comune de utilizare a gazelor naturale</td>
            <td style={{ textAlign: "center" }}><Chk val={r.installation_type} target="Comună" /></td>
          </tr>
        </tbody>
      </table>

      {/* Tabelul 3 - operatiuni */}
      <div className="sec-title">2. Operatiunile care s-au realizat in cazul verificarii tehnice a IUGN sunt prezentate in Tabelul nr. 3</div>
      <table className="ct">
        <thead>
          <tr>
            <th style={{ width: "5%" }}>Nr</th>
            <th style={{ width: "65%" }}>OPERATIUNI</th>
            <th style={{ width: "10%" }}>Da</th>
            <th style={{ width: "10%" }}>Nu</th>
            <th style={{ width: "10%" }}>Nu este cazul</th>
          </tr>
        </thead>
        <tbody>
          {ops.map((op, i) => (
            <tr key={i}>
              <td style={{ textAlign: "center" }}>{i+1}</td>
              <td>{op}</td>
              <td style={{ textAlign: "center" }}><Chk val={cl[`v${i+1}`]} target="DA" /></td>
              <td style={{ textAlign: "center" }}><Chk val={cl[`v${i+1}`]} target="NU" /></td>
              <td style={{ textAlign: "center" }}><Chk val={cl[`v${i+1}`]} target="N/A" /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="imp-note">
        <strong>IMPORTANT:</strong> Intretinerea, exploatarea si repararea instalatiilor de utilizare a gazelor naturale revin clientului final, care raspunde pentru buna lor functionare.
        Confirm ca au fost efectuate toate operatiile enumerate in tabelul nr.3; Confirm ca am primit un exemplar al instructiunilor de utilizare a gazelor naturale;
        {r.type === "RiU" && " Confirm ca mi s-a recomandat instalarea detectoarelor pentru monoxid/dioxid de carbon."}
      </div>
      <div style={{ margin: "4px 0", fontSize: 8.5 }}>
        Semnatura client ……………………………………………………
        {r.client_sig && <img src={r.client_sig} className="sig-img" alt="" style={{ display: "inline-block", marginLeft: 8, verticalAlign: "middle" }} />}
      </div>

      {/* Probe presiune - doar RiU */}
      {r.type === "RiU" && (
        <>
          <div className="sec-title">3. Probe de etanseitate si rezistenta la presiune (Tabelul nr. 4)</div>
          <table className="ct">
            <thead>
              <tr>
                <th rowSpan={2} style={{ width: "5%" }}>Nr.</th>
                <th rowSpan={2} style={{ width: "15%" }}></th>
                <th rowSpan={2} style={{ width: "20%" }}></th>
                <th colSpan={2}>OL</th>
                <th>PE 100</th>
                <th>PE 80</th>
              </tr>
              <tr>
                <th>Subteran</th><th>Suprateran</th><th>Subteran</th><th>Subteran</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={3} style={{ textAlign: "center" }}>1</td>
                <td rowSpan={3}>Proba de rezistenta</td>
                <td>Regim presiune (bar)</td>
                <td colSpan={4} style={{ textAlign: "center" }}>{r.pressure_resistance || ""}</td>
              </tr>
              <tr>
                <td>Rezultatul probei Admis</td>
                <td colSpan={4} style={{ textAlign: "center" }}><Chk val={r.test_result} target="Admis" /></td>
              </tr>
              <tr>
                <td>Respins</td>
                <td colSpan={4} style={{ textAlign: "center" }}><Chk val={r.test_result} target="Respins" /></td>
              </tr>
              <tr>
                <td rowSpan={3} style={{ textAlign: "center" }}>2</td>
                <td rowSpan={3}>Proba de etanseitate</td>
                <td>Regim presiune (bar)</td>
                <td colSpan={4} style={{ textAlign: "center" }}>{r.pressure_tightness || ""}</td>
              </tr>
              <tr>
                <td>Rezultatul probei Admis</td>
                <td colSpan={4} style={{ textAlign: "center" }}><Chk val={r.test_result} target="Admis" /></td>
              </tr>
              <tr>
                <td>Respins</td>
                <td colSpan={4} style={{ textAlign: "center" }}><Chk val={r.test_result} target="Respins" /></td>
              </tr>
            </tbody>
          </table>
          <div style={{ fontSize: 8.5, margin: "3px 0" }}>
            Confirm ca au fost efectuate probele enumerate mai sus. <strong>Semnatura client</strong> ……………………………
            {r.client_sig && <img src={r.client_sig} className="sig-img" alt="" style={{ display: "inline-block", marginLeft: 8, verticalAlign: "middle" }} />}
          </div>
        </>
      )}

      {/* Defecte */}
      <div className="sec-title">{r.type === "RiU" ? "4" : "3"}. Defectele constatate se mentioneaza in Tabelul nr. {r.type === "RiU" ? "5" : "4"}</div>
      <table className="ct">
        <thead>
          <tr><th style={{ width: "5%" }}>Nr</th><th>Defect constatat</th><th>Mod de remediere a defectelor</th><th style={{ width: "8%" }}>Da</th><th style={{ width: "8%" }}>Nu</th></tr>
        </thead>
        <tbody>
          <tr><td style={{ textAlign: "center" }}>1</td><td>{r.defects || ""}</td><td>{r.actions || ""}</td><td></td><td></td></tr>
          <tr><td style={{ textAlign: "center" }}>2</td><td></td><td></td><td></td><td></td></tr>
        </tbody>
      </table>

      {/* Conditii tehnice */}
      <div className="sec-title">{r.type === "RiU" ? "5" : "4"}. Conditiile tehnice de functionare se trec in Tabelul nr. {r.type === "RiU" ? "6" : "5"}</div>
      <table className="ct">
        <thead><tr><th></th><th style={{ width: "10%" }}>Da</th><th style={{ width: "10%" }}>Nu</th><th style={{ width: "30%" }}>Observatii</th></tr></thead>
        <tbody>
          <tr>
            <td>Instalatia de utilizare a gazelor naturale indeplineste conditiile tehnice de functionare in siguranta, prevazute in prevederile normale tehnice</td>
            <td style={{ textAlign: "center" }}><Chk val={r.technical_conditions} target="Corespunzătoare" /></td>
            <td style={{ textAlign: "center" }}><Chk val={r.technical_conditions} target="Necorespunzătoare" /></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      {/* Aparate - tabelul 6/7 */}
      <div className="tbl-nr">Tabelul nr. {r.type === "RiU" ? "7" : "6"}</div>
      <table className="ct">
        <thead>
          <tr>
            <th style={{ width: "5%" }}>Nr.</th>
            <th colSpan={2}>Aparate consumatoare de combustibili gazosi</th>
            <th colSpan={2}>Doc. curatare cosuri/canale gaze arse</th>
            <th colSpan={2}>Doc. verificare aparate consumatoare</th>
          </tr>
          <tr><th></th><th>Tip aparat</th><th>Debit nominal</th><th>Nr.</th><th>Data</th><th>Nr.</th><th>Data</th></tr>
        </thead>
        <tbody>
          {[1,2,3].map(i => <tr key={i}><td style={{ textAlign: "center" }}>{i}</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>)}
        </tbody>
      </table>

      {/* Concluzie */}
      <div className="sec-title">{r.type === "RiU" ? "6" : "5"}. Concluzie Tabelul nr. {r.type === "RiU" ? "8" : "7"}</div>
      <table className="ct">
        <thead><tr><th></th><th style={{ width: "10%" }}>Da</th><th style={{ width: "10%" }}>Nu</th><th style={{ width: "30%" }}>Observatii</th></tr></thead>
        <tbody>
          <tr>
            <td>Pe baza documentelor prezentate si a operatiunilor realizate in cadrul {r.type === "RiU" ? "reviziei" : "verificarii"} tehnice se constata ca instalatia de utilizare a gazelor naturale respecta prevederile normelor tehnice si poate functiona in conditii de siguranta</td>
            <td style={{ textAlign: "center" }}><Chk val={r.conclusion} target="ADMIS" /></td>
            <td style={{ textAlign: "center" }}><Chk val={r.conclusion} target="RESPINS" /></td>
            <td>{r.observations || ""}</td>
          </tr>
        </tbody>
      </table>
      <div style={{ fontSize: 7.5, fontStyle: "italic", margin: "3px 0" }}>Nota: Varianta corecta se bifeaza cu "X".</div>

      <div className="sig-area">
        <div className="sig-box">
          <div style={{ fontWeight: "bold" }}>Instalator autorizat care a efectuat verificarea tehnica,</div>
          <div>Nume si prenume <strong><em>TIMOCE CLAUDIU VASILE</em></strong></div>
          <div style={{ marginTop: 4 }}>Semnatura …………………………………</div>
        </div>
        <div className="sig-box">
          <div style={{ fontWeight: "bold" }}>Clientul final</div>
          <div>Nume si prenume <strong>{client?.last_name} {client?.first_name}</strong></div>
          <div style={{ marginTop: 4 }}>
            Semnatura …………………………………
            {r.client_sig && <img src={r.client_sig} className="sig-img" alt="" />}
          </div>
        </div>
      </div>

      <div className="footer-note">
        Prezenta fisa se intocmeste in 3 exemplare, cate unul pentru: a) clientul final, b) operatorul economic autorizat ANRE, c) operatorul de sistem.
        Reprezentantul legal/Imputernicitul operatorului economic autorizat ANRE pentru executia instalatiei de utilizare a gazelor naturale: <strong>ATIMO PROJECT S.R.L.</strong>
      </div>
    </div>
  );
}

// ─── PDF CONTRACT ────────────────────────────────────────────────────────────

function ContractPDF({ c, client }) {
  const SVCS = [
    { code: "T7", label: "VTP - Verificare Tehnică Periodică a Centralei Termice, conform cerințelor legale în vigoare." },
    { code: "T6", label: "PIF - Punere în funcțiune a Centralei Termice, conform cerințelor legale în vigoare." },
    { code: "G4", label: "ViU - Verificare a Instalației de Utilizare Gaze Naturale, conform cerințelor legale în vigoare." },
    { code: "G5", label: "RiU - Revizia Instalației de Utilizare Gaze Naturale, conform cerințelor legale în vigoare." },
    { code: "G3", label: "Montaj Senzor de Gaz cu Electrovana, conform cerințelor ANRE legale în vigoare." },
    { code: "G6", label: "Servicii Suplimentare Gaz, conform cerințelor ANRE legale în vigoare." },
    { code: "T11", label: "Montaj Termostat, conform cerințelor ISCIR legale în vigoare." },
    { code: "T13", label: "Montaj Filtru Magnetic, conform cerințelor ISCIR legale în vigoare." },
    { code: "UR", label: "Taxa Urgenta" },
    { code: "DE", label: "Tarif Deplasare" },
  ];

  const checkedLabels = (c.services || []).filter(s => s.checked).map(s => s.label);
  const isChk = (svcLabel) => checkedLabels.some(l => l.toLowerCase().includes(svcLabel.split(" - ")[0].toLowerCase().split(" ")[0]));

  return (
    <div className="print-area">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, paddingBottom: 4, borderBottom: "2px solid #E8501A" }}>
        <div style={{ fontSize: 7.5, lineHeight: 1.4 }}>
          <div style={{ fontWeight: "bold", fontSize: 9, color: "#E8501A" }}>ATIMO PROJECT S.R.L.</div>
          <div>Str. Grigore Silași, Nr. 7, Beclean, Bistrița-Năsăud</div>
          <div>Tel: 0770 225 225 | Email: office@atimo.ro</div>
          <div>CUI: RO38992313 | J2018000236062</div>
          <div>IBAN: RO81BTRLRONCRT0438376701 Banca Transilvania</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ fontFamily: "Arial", fontWeight: "bold", fontSize: 18, color: "#E8501A" }}>atimo</div>
          <div style={{ display: "flex", gap: 3 }}>
            <div style={{ border: "1px solid #003399", borderRadius: 3, padding: "1px 3px", fontSize: 6 }}><div style={{ fontWeight: "bold", color: "#003399" }}>ANRE</div><div>Autorizat</div></div>
            <div style={{ border: "1px solid #cc0000", borderRadius: 3, padding: "1px 3px", fontSize: 6 }}><div style={{ fontWeight: "bold", color: "#cc0000" }}>ISCIR</div><div>Autorizat</div></div>
          </div>
        </div>
        <div style={{ fontSize: 9, textAlign: "right" }}>
          <div style={{ fontWeight: "bold", color: "#E8501A", fontSize: 11 }}>CTR-V</div>
          <div>06-2025</div>
        </div>
      </div>

      <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 12, margin: "5px 0 2px" }}>CONTRACT DE PRESTĂRI SERVICII</div>
      <div style={{ textAlign: "center", fontSize: 9, marginBottom: 7 }}>
        Serie/Nr. <strong>{c.number}</strong> / Data: <strong>{fmt(c.date)}</strong>
      </div>

      <div className="ctr-art">
        <div className="ctr-art-title">Art I. Părțile contractante:</div>
        <div>
          Nume, prenume <strong>{client?.last_name} {client?.first_name}</strong>, localitatea <strong>{client?.city}</strong>, județul/sectorul <strong>{client?.county}</strong>,
          str. <strong>{client?.address}</strong>, telefon <strong>{client?.phone}</strong>, adresă email <strong>{client?.email || "………………"}</strong>,
          identificat prin CI/BI serie/număr <strong>{client?.id_series}/{client?.id_number}</strong>,
          cod numeric personal <strong>{client?.cnp || "………………………"}</strong>, denumit/ă în continuare <strong>beneficiar</strong>, a convenit la încheierea contractului nr. <strong>{c.number}</strong> de prestări servicii cu:
        </div>
        <div style={{ marginTop: 3 }}>
          <strong>ATIMO PROJECT S.R.L.</strong>, având sediul social în loc. Beclean, str. Silași Grigore, nr. 7, sc. 1, ap. 2, jud. Bistrița-Năsăud,
          înregistrată la Registrul Comerțului cu nr. J2018000236062, CUI RO38992313, cont IBAN RO81BTRLRONCRT0438376701 la Banca Transilvania – Agenția Beclean,
          denumită în continuare <strong>prestator</strong>, persoană juridică, în calitate de firmă autorizată ANRE și ISCIR, pentru amplasamentul:
          Localitatea <strong>{client?.city}</strong>, județul <strong>{client?.county}</strong>, str. <strong>{client?.address}</strong>.
        </div>
      </div>

      <div className="ctr-art">
        <div className="ctr-art-title">Art. II. Obiectul contractului:</div>
        <div style={{ marginBottom: 3 }}>2.1 Serviciile ce urmează a fi prestate (se bifează opțiunea corespunzătoare):</div>
        {SVCS.map((svc, i) => {
          const checked = isChk(svc.label);
          return (
            <div key={i} className="svc-row">
              <span style={{ color: "#E8501A", minWidth: 24, fontSize: 8 }}>- {svc.code}</span>
              <span className="chk-sq">{checked ? "✓" : ""}</span>
              <span>{svc.label}</span>
            </div>
          );
        })}
      </div>

      <div className="ctr-art">
        <div className="ctr-art-title">Art. III. Durata contractului:</div>
        <div>3.1 Durata executării serviciilor este de <strong>{c.duration || "___"}</strong> zile, începând de la data semnării prezentului contract.</div>
        <div>3.2 Prelungirea duratei contractului se poate realiza doar prin acordul scris al ambelor părți, prin act adițional.</div>
      </div>

      <div className="ctr-art">
        <div className="ctr-art-title">Art. IV. Prețul:</div>
        <div>4.1 Prețul total pentru serviciile contractate la Art. II este de: <strong>{c.total_price} lei (TVA inclus)</strong>.</div>
        <div>4.2 Plata se poate efectua integral sau în tranșe, conform înțelegerii între părți, astfel încât la finalizarea lucrării, toate obligațiile de plată să fie achitate.</div>
        <div>4.3 Termenele și modalitățile de plată (<strong>{c.payment_method}</strong>) vor fi specificate în facturile emise de prestator.</div>
      </div>

      <div className="ctr-art">
        <div className="ctr-art-title">Art. V. Obligațiile prestatorului:</div>
        <div>5.1 Prestatorul se obligă să furnizeze serviciile alese la Art. II în conformitate cu cerințele legale aplicabile și în termenul stabilit la Art. III.</div>
        <div>5.2 Prestatorul se obligă să utilizeze echipamente și personal calificat pentru executarea serviciilor.</div>
        <div>5.3 Prestatorul va asigura toate autorizările și avizele necesare pentru efectuarea serviciilor contractate.</div>
      </div>

      <div className="ctr-art">
        <div className="ctr-art-title">Art. VI. Obligațiile beneficiarului:</div>
        <div>6.1 Beneficiarul se obligă să permită accesul prestatorului în imobil pentru realizarea serviciilor contractate.</div>
        <div>6.2 Beneficiarul se obligă să furnizeze toate informațiile și documentele necesare pentru realizarea obiectului prezentului contract.</div>
        <div>6.3 Beneficiarul se obligă să îndeplinească obligațiile de plată către prestator în cuantumul și la termenele stabilite de comun acord.</div>
      </div>

      <div className="ctr-art">
        <div className="ctr-art-title">Art. VII. Alte clauze:</div>
        <div>7.1 Orice completări sau modificări ale prezentului contract vor fi valabile doar dacă sunt exprimate în scris și semnate de ambele părți, sub forma unor acte adiționale.</div>
        <div>7.2 Pentru nerespectarea totală sau parțială sau pentru executarea defectuoasă a vreuneia dintre clauzele contractuale, partea vinovată va fi responsabilă de plata daunelor-interese.</div>
        <div>7.3 Eventualele litigii vor fi soluționate pe cale amiabilă, iar dacă este imposibil, litigiul va fi dedus spre soluționare instanței în a cărei rază teritorială se află sediul antreprenorului.</div>
        <div>7.4 Forța majoră, așa cum este definită de lege, exonerează de răspundere partea care o invocă, cu notificare scrisă în termen de 3 zile.</div>
      </div>

      <div style={{ fontSize: 8.5, margin: "4px 0" }}>
        Prezentul contract se întocmește în 2 (două) exemplare și intră în vigoare astăzi <strong>{fmt(c.date)}</strong>, după semnarea lui de către ambele părți.
      </div>

      <div style={{ fontSize: 7.5, fontStyle: "italic", margin: "3px 0", lineHeight: 1.4 }}>
        <strong>Notă: GDPR</strong> — Datele personale din acest contract vor fi tratate confidențial, conform Regulamentului European 679/2016 privind protecția persoanelor fizice în ceea ce privește prelucrarea datelor cu caracter personal.
        Prin semnarea prezentului înscris vă exprimați acordul ca datele cu caracter personal să fie utilizate în scopul îndeplinirii cerințelor dumneavoastră.
      </div>

      <div className="sig-area" style={{ marginTop: 10 }}>
        <div className="sig-box">
          <div style={{ fontWeight: "bold" }}>PRESTATOR: ATIMO PROJECT S.R.L.</div>
          <div>Timoce Claudiu-Vasile</div>
          {c.technician_sig
            ? <img src={c.technician_sig} className="sig-img" alt="" />
            : <div style={{ marginTop: 25, borderTop: "1px solid #000", paddingTop: 3, fontSize: 7.5 }}>Semnătură și ștampilă</div>
          }
        </div>
        <div className="sig-box">
          <div style={{ fontWeight: "bold" }}>BENEFICIAR:</div>
          <div>{client?.last_name} {client?.first_name}</div>
          {c.client_sig
            ? <img src={c.client_sig} className="sig-img" alt="" />
            : <div style={{ marginTop: 25, borderTop: "1px solid #000", paddingTop: 3, fontSize: 7.5 }}>Semnătură</div>
          }
        </div>
      </div>
      <div style={{ textAlign: "right", fontSize: 7.5, marginTop: 3, color: "#E8501A" }}>CTR-V 06-2025 &nbsp; 1/1</div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

function Dashboard({ clients, jobs, reports }) {
  const todayJobs = jobs.filter(j => j.date === today());
  const done = jobs.filter(j => j.status === "Finalizat").length;
  const inProg = jobs.filter(j => j.status === "In progres").length;
  const expiring = clients.filter(c => {
    if (!c.next_viu_date) return false;
    const diff = (new Date(c.next_viu_date) - new Date()) / 86400000;
    return diff >= 0 && diff <= 60;
  });
  const urgent = expiring.filter(c => (new Date(c.next_viu_date) - new Date()) / 86400000 <= 14);
  return (
    <div>
      <div className="stat-grid">
        <div className="stat accent-stat"><div className="stat-label">Clienți total</div><div className="stat-val">{clients.length}</div><div className="stat-sub">înregistrați</div></div>
        <div className="stat"><div className="stat-label">Lucrări azi</div><div className="stat-val">{todayJobs.length}</div><div className="stat-sub">programate</div></div>
        <div className="stat"><div className="stat-label">În progres</div><div className="stat-val">{inProg}</div><div className="stat-sub">active</div></div>
        <div className="stat"><div className="stat-label">Finalizate</div><div className="stat-val">{done}</div><div className="stat-sub">total</div></div>
        <div className="stat"><div className="stat-label">Rapoarte ViU/RiU</div><div className="stat-val">{reports.length}</div><div className="stat-sub">emise</div></div>
        <div className="stat"><div className="stat-label" style={{ color: expiring.length > 0 ? COLORS.warning : COLORS.gray400 }}>Expirări 60 zile</div><div className="stat-val" style={{ color: expiring.length > 0 ? COLORS.warning : "inherit" }}>{expiring.length}</div><div className="stat-sub">clienți</div></div>
      </div>
      {urgent.length > 0 && (
        <div className="alert alert-warn"><Ic n="warn" s={16} /><strong>{urgent.length} client(i)</strong> cu ViU/RiU expirat în mai puțin de 14 zile!</div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card">
          <div className="card-header"><Ic n="cal" s={16} /><span className="card-title">Lucrări de azi</span></div>
          {todayJobs.length === 0 ? <div className="empty">Nicio lucrare azi</div>
            : todayJobs.map(j => {
                const cl = clients.find(c => c.id === j.client_id);
                return (
                  <div key={j.id} style={{ padding: "11px 20px", borderBottom: `1px solid ${COLORS.gray100}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div><div style={{ fontWeight: 500 }}>{cl?.last_name} {cl?.first_name}</div><div style={{ fontSize: 12, color: COLORS.gray400 }}>{j.service_type}</div></div>
                    <span className={`badge ${j.status === "Finalizat" ? "b-green" : j.status === "In progres" ? "b-orange" : "b-blue"}`}>{j.status}</span>
                  </div>
                );
              })
          }
        </div>
        <div className="card">
          <div className="card-header"><Ic n="bell" s={16} /><span className="card-title">Expirări ViU în 60 zile</span></div>
          {expiring.length === 0 ? <div className="empty">Nicio expirare iminentă</div>
            : expiring.slice(0, 8).map(c => {
                const diff = Math.ceil((new Date(c.next_viu_date) - new Date()) / 86400000);
                return (
                  <div key={c.id} style={{ padding: "11px 20px", borderBottom: `1px solid ${COLORS.gray100}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div><div style={{ fontWeight: 500 }}>{c.last_name} {c.first_name}</div><div style={{ fontSize: 12, color: COLORS.gray400 }}>{c.city}</div></div>
                    <span className={`badge ${diff <= 14 ? "b-red" : "b-orange"}`}>{diff} zile</span>
                  </div>
                );
              })
          }
        </div>
      </div>
    </div>
  );
}

// ─── CLIENTS ─────────────────────────────────────────────────────────────────

function Clients({ clients, setClients, jobs, userRole }) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const filtered = clients.filter(c => `${c.first_name} ${c.last_name} ${c.phone} ${c.email} ${c.city}`.toLowerCase().includes(search.toLowerCase()));
  const save = async (form) => {
    setLoading(true);
    if (form.id) {
      const { data } = await supabase.from("clients").update(form).eq("id", form.id).select().single();
      if (data) setClients(p => p.map(c => c.id === data.id ? data : c));
    } else {
      const { data } = await supabase.from("clients").insert(form).select().single();
      if (data) setClients(p => [...p, data]);
    }
    setLoading(false); setModal(null);
  };
  const del = async (id) => {
    if (!window.confirm("Ștergeți clientul?")) return;
    await supabase.from("clients").delete().eq("id", id);
    setClients(p => p.filter(c => c.id !== id));
  };
  return (
    <div>
      <div className="filter-bar">
        <div className="search-box"><Ic n="search" s={15} /><input placeholder="Caută după nume, telefon, email..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <button className="btn btn-primary" onClick={() => setModal("new")}><Ic n="plus" s={15} /> Adaugă client</button>
      </div>
      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Nume</th><th>Telefon</th><th>Localitate</th><th>Lucrări</th><th>ViU scadent</th><th>Acțiuni</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={6}><div className="empty">Niciun client găsit</div></td></tr>
                : filtered.map(c => {
                    const diff = c.next_viu_date ? Math.ceil((new Date(c.next_viu_date) - new Date()) / 86400000) : null;
                    const jc = jobs.filter(j => j.client_id === c.id).length;
                    return (
                      <tr key={c.id}>
                        <td><div style={{ fontWeight: 500 }}>{c.last_name} {c.first_name}</div><div style={{ fontSize: 12, color: COLORS.gray400 }}>{c.cnp}</div></td>
                        <td>{c.phone}</td>
                        <td>{c.city}{c.county ? `, ${c.county}` : ""}</td>
                        <td><span className="badge b-blue">{jc}</span></td>
                        <td>{diff !== null ? <span className={`badge ${diff < 0 ? "b-red" : diff <= 14 ? "b-red" : diff <= 60 ? "b-orange" : "b-green"}`}>{diff < 0 ? `Expirat ${Math.abs(diff)}z` : `${diff} zile`}</span> : <span className="badge b-gray">-</span>}</td>
                        <td>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button className="btn-icon" onClick={() => setModal(c)}><Ic n="edit" s={14} /></button>
                            {userRole === "admin" && <button className="btn-icon" onClick={() => del(c.id)} style={{ color: COLORS.danger }}><Ic n="trash" s={14} /></button>}
                          </div>
                        </td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>
      </div>
      {modal && <ClientModal client={modal === "new" ? null : modal} loading={loading} onSave={save} onClose={() => setModal(null)} />}
    </div>
  );
}

function ClientModal({ client, loading, onSave, onClose }) {
  const blank = { first_name:"",last_name:"",phone:"",email:"",cnp:"",id_series:"",id_number:"",address:"",city:"",county:"",subscriber_code:"",consumption_code:"",next_viu_date:"" };
  const [f, setF] = useState(client ? {...client} : blank);
  const s = (k,v) => setF(p => ({...p,[k]:v}));
  return (
    <div className="modal-bg">
      <div className="modal" style={{ maxWidth: 800 }}>
        <div className="modal-hdr"><Ic n="users" /><div className="modal-title">{client ? "Editare client" : "Client nou"}</div><button className="btn-icon" onClick={onClose}><Ic n="x" /></button></div>
        <div className="modal-body">
          <div className="fsec"><div className="fsec-title">Date personale</div>
            <div className="fgrid">
              <div className="fgroup"><label>Prenume *</label><input value={f.first_name} onChange={e=>s("first_name",e.target.value)} /></div>
              <div className="fgroup"><label>Nume *</label><input value={f.last_name} onChange={e=>s("last_name",e.target.value)} /></div>
              <div className="fgroup"><label>Telefon *</label><input type="tel" value={f.phone} onChange={e=>s("phone",e.target.value)} /></div>
              <div className="fgroup"><label>Email</label><input type="email" value={f.email} onChange={e=>s("email",e.target.value)} /></div>
              <div className="fgroup"><label>CNP</label><input value={f.cnp} onChange={e=>s("cnp",e.target.value)} maxLength={13} /></div>
              <div className="fgroup"><label>CI serie</label><input value={f.id_series} onChange={e=>s("id_series",e.target.value.toUpperCase())} maxLength={2} /></div>
              <div className="fgroup"><label>CI număr</label><input value={f.id_number} onChange={e=>s("id_number",e.target.value)} maxLength={6} /></div>
            </div>
          </div>
          <div className="fsec"><div className="fsec-title">Adresă</div>
            <div className="fgrid">
              <div className="fgroup spanfull"><label>Adresă completă *</label><input value={f.address} onChange={e=>s("address",e.target.value)} /></div>
              <div className="fgroup"><label>Localitate *</label><input value={f.city} onChange={e=>s("city",e.target.value)} /></div>
              <div className="fgroup"><label>Județ</label>
                <select value={f.county} onChange={e=>s("county",e.target.value)}>
                  <option value="">-- Selectați --</option>
                  {COUNTIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="fsec"><div className="fsec-title">Date instalație gaze</div>
            <div className="fgrid">
              <div className="fgroup"><label>Cod abonat</label><input value={f.subscriber_code} onChange={e=>s("subscriber_code",e.target.value)} /></div>
              <div className="fgroup"><label>Cod loc consum</label><input value={f.consumption_code} onChange={e=>s("consumption_code",e.target.value)} /></div>
              <div className="fgroup"><label>Dată scadentă ViU</label><input type="date" value={f.next_viu_date} onChange={e=>s("next_viu_date",e.target.value)} /></div>
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Anulare</button>
          <button className="btn btn-primary" disabled={loading} onClick={()=>{if(!f.first_name||!f.last_name||!f.phone)return alert("Completați câmpurile obligatorii!");onSave(f);}}>
            {loading?<span className="spinner"/>:<><Ic n="check" s={14}/> Salvare</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── JOBS ────────────────────────────────────────────────────────────────────

function Jobs({ clients, jobs, setJobs, reports, setReports, userRole }) {
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("toate");
  const [modal, setModal] = useState(null);
  const [viuModal, setViuModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const filtered = jobs.filter(j => {
    const cl = clients.find(c => c.id === j.client_id);
    const name = cl ? `${cl.first_name} ${cl.last_name}` : "";
    return `${name} ${j.service_type}`.toLowerCase().includes(search.toLowerCase()) && (statusF === "toate" || j.status === statusF);
  });
  const save = async (form) => {
    setLoading(true);
    if (form.id) {
      const { data } = await supabase.from("jobs").update(form).eq("id", form.id).select().single();
      if (data) setJobs(p => p.map(j => j.id === data.id ? data : j));
    } else {
      const { data } = await supabase.from("jobs").insert({...form, status: "Programat"}).select().single();
      if (data) setJobs(p => [...p, data]);
    }
    setLoading(false); setModal(null);
  };
  const updateStatus = async (id, status) => {
    await supabase.from("jobs").update({status}).eq("id", id);
    setJobs(p => p.map(j => j.id === id ? {...j, status} : j));
  };
  return (
    <div>
      <div className="filter-bar">
        <div className="search-box"><Ic n="search" s={15} /><input placeholder="Caută client sau tip serviciu..." value={search} onChange={e=>setSearch(e.target.value)} /></div>
        <select value={statusF} onChange={e=>setStatusF(e.target.value)} style={{padding:"8px 12px",border:`1px solid ${COLORS.gray200}`,borderRadius:8,background:"#fff"}}>
          <option value="toate">Toate statusurile</option>
          <option>Programat</option><option>In progres</option><option>Finalizat</option><option>Anulat</option>
        </select>
        <button className="btn btn-primary" onClick={()=>setModal("new")}><Ic n="plus" s={15}/> Lucrare nouă</button>
      </div>
      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Client</th><th>Tip serviciu</th><th>Data</th><th>Tehnician</th><th>Status</th><th>Preț</th><th>Acțiuni</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={7}><div className="empty">Nicio lucrare găsită</div></td></tr>
                : filtered.map(j => {
                    const cl = clients.find(c => c.id === j.client_id);
                    return (
                      <tr key={j.id}>
                        <td><div style={{fontWeight:500}}>{cl?.last_name} {cl?.first_name}</div><div style={{fontSize:12,color:COLORS.gray400}}>{cl?.city}</div></td>
                        <td style={{fontSize:13}}>{j.service_type}</td>
                        <td>{fmtApp(j.date)}</td>
                        <td>{j.technician||"-"}</td>
                        <td>
                          <select value={j.status} onChange={e=>updateStatus(j.id,e.target.value)} style={{padding:"4px 8px",border:`1px solid ${COLORS.gray200}`,borderRadius:6,fontSize:12}}>
                            <option>Programat</option><option>In progres</option><option>Finalizat</option><option>Anulat</option>
                          </select>
                        </td>
                        <td>{j.price?`${j.price} RON`:"-"}</td>
                        <td>
                          <div style={{display:"flex",gap:4}}>
                            <button className="btn-icon" title="Raport ViU/RiU" onClick={()=>setViuModal(j)} style={{color:COLORS.primary}}><Ic n="filetxt" s={14}/></button>
                            <button className="btn-icon" onClick={()=>setModal(j)}><Ic n="edit" s={14}/></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>
      </div>
      {modal && <JobModal job={modal==="new"?null:modal} clients={clients} loading={loading} onSave={save} onClose={()=>setModal(null)} />}
      {viuModal && <ViuModal job={viuModal} clients={clients} onSave={async (r) => {
        const reportToSave = {
          job_id: r.job_id, client_id: r.client_id, type: r.type, number: r.number, date: r.date,
          consumption_address: r.consumption_address, contract_number: r.contract_number,
          last_verification_date: r.last_verification_date || null, due_date: r.due_date || null,
          inspection_type: r.inspection_type, installation_type: r.installation_type,
          checklist: r.checklist || {}, checklist_obs: r.checklist_obs || {},
          defects: r.defects, actions: r.actions, conclusion: r.conclusion,
          technical_conditions: r.technical_conditions,
          client_sig: r.client_sig || null, technician_sig: r.technician_sig || null,
          meter_protocol_number: r.meter_protocol_number, meter_protocol_date: r.meter_protocol_date || null,
          revision_reason: r.revision_reason,
          pressure_resistance: r.pressure_resistance || null, pressure_tightness: r.pressure_tightness || null,
          pressure_regime: r.pressure_regime || null,
          installation_material: r.installation_material, installation_location: r.installation_location,
          test_result: r.test_result,
        };
        const { data, error } = await supabase.from("reports").insert(reportToSave).select().single();
        if (error) { alert("Eroare: " + error.message); return; }
        if (data) setReports(p => [...p, data]);
        setViuModal(null);
      }} onClose={()=>setViuModal(null)} />}
    </div>
  );
}

function JobModal({ job, clients, loading, onSave, onClose }) {
  const blank = {client_id:"",service_type:"",date:today(),technician:"",price:"",observations:""};
  const [f,setF] = useState(job?{...job}:blank);
  const s = (k,v) => setF(p=>({...p,[k]:v}));
  return (
    <div className="modal-bg">
      <div className="modal">
        <div className="modal-hdr"><Ic n="briefcase"/><div className="modal-title">{job?"Editare lucrare":"Lucrare nouă"}</div><button className="btn-icon" onClick={onClose}><Ic n="x"/></button></div>
        <div className="modal-body">
          <div className="fgrid">
            <div className="fgroup spanfull"><label>Client *</label>
              <select value={f.client_id} onChange={e=>s("client_id",e.target.value)}>
                <option value="">-- Selectați clientul --</option>
                {clients.map(c=><option key={c.id} value={c.id}>{c.last_name} {c.first_name} – {c.city}</option>)}
              </select>
            </div>
            <div className="fgroup spanfull"><label>Tip serviciu *</label>
              <select value={f.service_type} onChange={e=>s("service_type",e.target.value)}>
                <option value="">-- Selectați --</option>
                {SERVICE_TYPES.map(st=><option key={st}>{st}</option>)}
              </select>
            </div>
            <div className="fgroup"><label>Data *</label><input type="date" value={f.date} onChange={e=>s("date",e.target.value)} /></div>
            <div className="fgroup"><label>Tehnician</label><input value={f.technician} onChange={e=>s("technician",e.target.value)} /></div>
            <div className="fgroup"><label>Preț (RON)</label><input type="number" value={f.price} onChange={e=>s("price",e.target.value)} /></div>
            <div className="fgroup spanfull"><label>Observații</label><textarea value={f.observations} onChange={e=>s("observations",e.target.value)} /></div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Anulare</button>
          <button className="btn btn-primary" disabled={loading} onClick={()=>{if(!f.client_id||!f.service_type||!f.date)return alert("Completați câmpurile obligatorii!");onSave(f);}}>
            {loading?<span className="spinner"/>:<><Ic n="check" s={14}/> Salvare</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── VIU/RIU FORM ────────────────────────────────────────────────────────────

function ViuModal({ job, clients, onSave, onClose }) {
  const client = clients.find(c => c.id === job.client_id);
  const isRiu = job.service_type?.includes("RiU");
  const [tab, setTab] = useState("date");
  const [preview, setPreview] = useState(false);
  const ops = isRiu ? RIU_OPS : VIU_OPS;
  const [f, setF] = useState({
    type: isRiu?"RiU":"ViU",
    number: `${isRiu?"RiU":"ViU"}-${Date.now().toString().slice(-6)}`,
    job_id: job.id, client_id: job.client_id,
    date: today(), consumption_address: client?.address||"",
    contract_number: "", last_verification_date: "",
    due_date: addDays(today(), isRiu?3650:730),
    inspection_type: "Periodică", installation_type: "Individuală",
    checklist: {}, checklist_obs: {},
    defects: "", actions: "", conclusion: "ADMIS", technical_conditions: "Corespunzătoare",
    client_sig: null, technician_sig: null,
    meter_protocol_number: "", meter_protocol_date: "", revision_reason: "",
    pressure_resistance: "", pressure_tightness: "", pressure_regime: "",
    installation_material: "OL", installation_location: "Suprateran", test_result: "Admis",
  });
  const s = (k,v) => setF(p=>({...p,[k]:v}));

  if (preview) return (
    <div className="modal-bg">
      <div className="modal modal-lg" style={{maxWidth:900}}>
        <div className="modal-hdr">
          <Ic n="filetxt"/><div className="modal-title">Previzualizare {f.type} — {f.number}</div>
          <button className="btn btn-sm btn-ghost no-print" style={{marginRight:4}} onClick={()=>window.print()}><Ic n="print" s={14}/> Tipărire</button>
          <button className="btn-icon no-print" onClick={()=>setPreview(false)}><Ic n="x"/></button>
        </div>
        <div className="modal-body" style={{padding:0}}><ViuPDF r={f} client={client} /></div>
        <div className="modal-foot no-print">
          <button className="btn btn-ghost" onClick={()=>setPreview(false)}>Înapoi</button>
          <button className="btn btn-primary" onClick={()=>onSave(f)}><Ic n="check" s={14}/> Salvare document</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-bg">
      <div className="modal modal-lg" style={{maxWidth:900}}>
        <div className="modal-hdr"><Ic n="filetxt"/><div className="modal-title">Formular {f.type} — {client?.last_name} {client?.first_name}</div><button className="btn-icon" onClick={onClose}><Ic n="x"/></button></div>
        <div className="modal-body">
          <div className="tabs">
            {["date","verificare","concluzie","semnaturi"].map(t=>(
              <button key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>
                {t==="date"?"Date instalație":t==="verificare"?"Operații":t==="concluzie"?"Concluzie":"Semnături"}
              </button>
            ))}
          </div>

          {tab==="date" && <div className="fgrid">
            <div className="fgroup"><label>Tip raport</label><select value={f.type} onChange={e=>s("type",e.target.value)}><option>ViU</option><option>RiU</option></select></div>
            <div className="fgroup"><label>Număr raport</label><input value={f.number} onChange={e=>s("number",e.target.value)} /></div>
            <div className="fgroup"><label>Data</label><input type="date" value={f.date} onChange={e=>s("date",e.target.value)} /></div>
            <div className="fgroup spanfull"><label>Adresă consum</label><input value={f.consumption_address} onChange={e=>s("consumption_address",e.target.value)} /></div>
            <div className="fgroup"><label>Nr. contract</label><input value={f.contract_number} onChange={e=>s("contract_number",e.target.value)} /></div>
            <div className="fgroup"><label>Ultima verificare</label><input type="date" value={f.last_verification_date} onChange={e=>s("last_verification_date",e.target.value)} /></div>
            <div className="fgroup"><label>Dată scadentă</label><input type="date" value={f.due_date} onChange={e=>s("due_date",e.target.value)} /></div>
            <div className="fgroup"><label>Tip inspecție</label><select value={f.inspection_type} onChange={e=>s("inspection_type",e.target.value)}><option>Periodică</option><option>Aleatorie</option><option>La sesizare</option></select></div>
            <div className="fgroup"><label>Tip instalație</label><select value={f.installation_type} onChange={e=>s("installation_type",e.target.value)}><option>Individuală</option><option>Comună</option></select></div>
            {f.type==="RiU" && <>
              <div className="fgroup"><label>Protocol contor nr.</label><input value={f.meter_protocol_number} onChange={e=>s("meter_protocol_number",e.target.value)} /></div>
              <div className="fgroup"><label>Data protocol contor</label><input type="date" value={f.meter_protocol_date} onChange={e=>s("meter_protocol_date",e.target.value)} /></div>
              <div className="fgroup spanfull"><label>Motiv revizie</label><input value={f.revision_reason} onChange={e=>s("revision_reason",e.target.value)} /></div>
              <div className="fgroup"><label>Material instalație</label><select value={f.installation_material} onChange={e=>s("installation_material",e.target.value)}><option>OL</option><option>PE100</option><option>PE80</option></select></div>
              <div className="fgroup"><label>Amplasament</label><select value={f.installation_location} onChange={e=>s("installation_location",e.target.value)}><option>Suprateran</option><option>Subteran</option></select></div>
              <div className="fgroup"><label>Presiune rezistență (bar)</label><input type="number" step="0.1" value={f.pressure_resistance} onChange={e=>s("pressure_resistance",e.target.value)} /></div>
              <div className="fgroup"><label>Presiune etanșeitate (bar)</label><input type="number" step="0.1" value={f.pressure_tightness} onChange={e=>s("pressure_tightness",e.target.value)} /></div>
              <div className="fgroup"><label>Rezultat test</label><select value={f.test_result} onChange={e=>s("test_result",e.target.value)}><option>Admis</option><option>Respins</option></select></div>
            </>}
          </div>}

          {tab==="verificare" && <div>
            <p style={{fontSize:13,color:COLORS.gray400,marginBottom:14}}>Selectați rezultatul fiecărei operații:</p>
            {ops.map((op,i) => {
              const id = `v${i+1}`;
              return (
                <div key={id} className="checklist-row">
                  <div className="checklist-text" style={{fontSize:13}}>{i+1}. {op}</div>
                  <div className="check-opts">
                    {["DA","NU","N/A"].map(opt=>(
                      <label key={opt} className="check-opt">
                        <input type="radio" name={id} value={opt} checked={f.checklist[id]===opt} onChange={()=>setF(p=>({...p,checklist:{...p.checklist,[id]:opt}}))} />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                  <input style={{width:150,fontSize:12}} placeholder="Obs." value={f.checklist_obs[id]||""} onChange={e=>setF(p=>({...p,checklist_obs:{...p.checklist_obs,[id]:e.target.value}}))} />
                </div>
              );
            })}
          </div>}

          {tab==="concluzie" && <div className="fgrid">
            <div className="fgroup spanfull"><label>Concluzie finală</label><select value={f.conclusion} onChange={e=>s("conclusion",e.target.value)}><option>ADMIS</option><option>RESPINS</option><option>Condiționat</option></select></div>
            <div className="fgroup spanfull"><label>Defecte constatate</label><textarea value={f.defects} onChange={e=>s("defects",e.target.value)} /></div>
            <div className="fgroup spanfull"><label>Acțiuni corective</label><textarea value={f.actions} onChange={e=>s("actions",e.target.value)} /></div>
            <div className="fgroup spanfull"><label>Condiții tehnice exploatare</label><select value={f.technical_conditions} onChange={e=>s("technical_conditions",e.target.value)}><option>Corespunzătoare</option><option>Necorespunzătoare</option><option>Parțial corespunzătoare</option></select></div>
          </div>}

          {tab==="semnaturi" && <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
            <SigPad label="Semnătură client" value={f.client_sig} onChange={v=>s("client_sig",v)} />
            <SigPad label="Semnătură tehnician" value={f.technician_sig} onChange={v=>s("technician_sig",v)} />
          </div>}
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Anulare</button>
          <button className="btn btn-ghost" onClick={()=>setPreview(true)}><Ic n="eye" s={14}/> Previzualizare</button>
          <button className="btn btn-primary" onClick={()=>onSave(f)}><Ic n="check" s={14}/> Salvare raport</button>
        </div>
      </div>
    </div>
  );
}

// ─── CONTRACTS ───────────────────────────────────────────────────────────────

const CONTRACT_SERVICES = [
  "VTP - Verificare Tehnică Periodică","PIF - Punere în Funcțiune",
  "ViU - Verificare Instalație Utilizare Gaze","RiU - Revizie Instalație Utilizare Gaze",
  "Montaj Senzor de Gaz cu Electrovana","Servicii Suplimentare Gaz",
  "Montaj Termostat","Montaj Filtru Magnetic","Taxa Urgenta","Tarif Deplasare",
];

function Contracts({ clients, contracts, setContracts, reports, setReports }) {
  const [modal, setModal] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  // After contract saved, if ViU or RiU selected, open report form pre-filled
  const [viuFromContract, setViuFromContract] = useState(null); // { contract, client }

  const save = async (form) => {
    setLoading(true);
    const { data } = await supabase.from("contracts").insert(form).select().single();
    if (data) {
      setContracts(p => [...p, data]);
      // Check if ViU or RiU is selected
      const hasViU = (form.services||[]).some(s => s.checked && s.label.includes("ViU"));
      const hasRiU = (form.services||[]).some(s => s.checked && s.label.includes("RiU"));
      const client = clients.find(c => c.id === form.client_id);
      if (hasViU || hasRiU) {
        setViuFromContract({
          contract: data,
          client,
          type: hasRiU ? "RiU" : "ViU",
        });
      }
    }
    setLoading(false); setModal(false);
  };

  const saveReport = async (r) => {
    const reportToSave = {
      job_id: null, client_id: r.client_id, type: r.type, number: r.number, date: r.date,
      consumption_address: r.consumption_address, contract_number: r.contract_number,
      last_verification_date: r.last_verification_date || null, due_date: r.due_date || null,
      inspection_type: r.inspection_type, installation_type: r.installation_type,
      checklist: r.checklist || {}, checklist_obs: r.checklist_obs || {},
      defects: r.defects, actions: r.actions, conclusion: r.conclusion,
      technical_conditions: r.technical_conditions,
      client_sig: r.client_sig || null, technician_sig: r.technician_sig || null,
      meter_protocol_number: r.meter_protocol_number, meter_protocol_date: r.meter_protocol_date || null,
      revision_reason: r.revision_reason,
      pressure_resistance: r.pressure_resistance || null, pressure_tightness: r.pressure_tightness || null,
      pressure_regime: r.pressure_regime || null,
      installation_material: r.installation_material, installation_location: r.installation_location,
      test_result: r.test_result,
    };
    const { data, error } = await supabase.from("reports").insert(reportToSave).select().single();
    if (error) { alert("Eroare raport: " + error.message); return; }
    if (data) setReports(p => [...p, data]);
    setViuFromContract(null);
  };

  return (
    <div>
      <div className="filter-bar">
        <button className="btn btn-primary" onClick={()=>setModal(true)}><Ic n="plus" s={15}/> Contract nou</button>
      </div>
      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Nr. contract</th><th>Client</th><th>Data</th><th>Valoare</th><th>Acțiuni</th></tr></thead>
            <tbody>
              {contracts.length===0 ? <tr><td colSpan={5}><div className="empty">Niciun contract. Creați primul contract.</div></td></tr>
                : contracts.map(c => {
                    const cl = clients.find(cl=>cl.id===c.client_id);
                    return (
                      <tr key={c.id}>
                        <td style={{fontWeight:600,color:COLORS.primary}}>{c.number}</td>
                        <td>{cl?.last_name} {cl?.first_name}</td>
                        <td>{fmtApp(c.date)}</td>
                        <td style={{fontWeight:600}}>{c.total_price} RON</td>
                        <td><button className="btn btn-sm btn-ghost" onClick={()=>setPreview({c,client:cl})}><Ic n="eye" s={13}/> PDF</button></td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>
      </div>
      {modal && <ContractModal clients={clients} loading={loading} onSave={save} onClose={()=>setModal(false)} />}

      {/* ViU/RiU form pre-filled from contract */}
      {viuFromContract && (
        <ViuModalFromContract
          contract={viuFromContract.contract}
          client={viuFromContract.client}
          type={viuFromContract.type}
          onSave={saveReport}
          onClose={()=>setViuFromContract(null)}
        />
      )}

      {preview && (
        <div className="modal-bg">
          <div className="modal modal-lg" style={{maxWidth:900}}>
            <div className="modal-hdr"><Ic n="doc"/><div className="modal-title">Contract {preview.c.number}</div>
              <button className="btn btn-sm btn-ghost no-print" style={{marginRight:4}} onClick={()=>window.print()}><Ic n="print" s={14}/> Tipărire</button>
              <button className="btn-icon no-print" onClick={()=>setPreview(null)}><Ic n="x"/></button>
            </div>
            <div className="modal-body" style={{padding:0}}><ContractPDF c={preview.c} client={preview.client} /></div>
            <div className="modal-foot no-print"><button className="btn btn-ghost" onClick={()=>setPreview(null)}>Închide</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function ContractModal({ clients, loading, onSave, onClose }) {
  const [tab, setTab] = useState("date");
  const [f, setF] = useState({
    client_id:"", number:`C-${Date.now().toString().slice(-6)}`, date:today(),
    total_price:"", payment_method:"Numerar", duration:"1",
    services: CONTRACT_SERVICES.map(l=>({label:l,checked:false,price:""})),
    client_sig:null, technician_sig:null,
  });
  const s = (k,v) => setF(p=>({...p,[k]:v}));
  const toggleSvc = (i) => setF(p=>({...p,services:p.services.map((sv,idx)=>idx===i?{...sv,checked:!sv.checked}:sv)}));
  const setSvcPrice = (i,v) => setF(p=>({...p,services:p.services.map((sv,idx)=>idx===i?{...sv,price:v}:sv)}));
  return (
    <div className="modal-bg">
      <div className="modal modal-lg">
        <div className="modal-hdr"><Ic n="doc"/><div className="modal-title">Contract nou de prestări servicii</div><button className="btn-icon" onClick={onClose}><Ic n="x"/></button></div>
        <div className="modal-body">
          <div className="tabs">
            {["date","servicii","semnaturi"].map(t=>(
              <button key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>
                {t==="date"?"Date contract":t==="servicii"?"Servicii":"Semnături"}
              </button>
            ))}
          </div>
          {tab==="date" && <div className="fgrid">
            <div className="fgroup spanfull"><label>Client *</label><select value={f.client_id} onChange={e=>s("client_id",e.target.value)}><option value="">-- Selectați clientul --</option>{clients.map(c=><option key={c.id} value={c.id}>{c.last_name} {c.first_name}</option>)}</select></div>
            <div className="fgroup"><label>Nr. contract</label><input value={f.number} onChange={e=>s("number",e.target.value)} /></div>
            <div className="fgroup"><label>Data</label><input type="date" value={f.date} onChange={e=>s("date",e.target.value)} /></div>
            <div className="fgroup"><label>Valoare totală (RON) *</label><input type="number" value={f.total_price} onChange={e=>s("total_price",e.target.value)} /></div>
            <div className="fgroup"><label>Modalitate plată</label><select value={f.payment_method} onChange={e=>s("payment_method",e.target.value)}><option>Numerar</option><option>Transfer bancar</option><option>Card</option></select></div>
            <div className="fgroup"><label>Durată executare (zile)</label><input value={f.duration} onChange={e=>s("duration",e.target.value)} /></div>
          </div>}
          {tab==="servicii" && <div>
            <p style={{fontSize:13,color:COLORS.gray400,marginBottom:14}}>Bifați serviciile incluse și introduceți prețul individual:</p>
            {f.services.map((sv,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:`1px solid ${COLORS.gray100}`}}>
                <input type="checkbox" checked={sv.checked} onChange={()=>toggleSvc(i)} style={{width:"auto"}} />
                <span style={{flex:1,fontSize:14}}>{sv.label}</span>
                {sv.checked && <input type="number" placeholder="Preț RON" value={sv.price} onChange={e=>setSvcPrice(i,e.target.value)} style={{width:120}} />}
              </div>
            ))}
          </div>}
          {tab==="semnaturi" && <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
            <SigPad label="Semnătură beneficiar" value={f.client_sig} onChange={v=>s("client_sig",v)} />
            <SigPad label="Semnătură prestator (ATIMO)" value={f.technician_sig} onChange={v=>s("technician_sig",v)} />
          </div>}
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Anulare</button>
          <button className="btn btn-primary" disabled={loading} onClick={()=>{if(!f.client_id||!f.total_price)return alert("Selectați clientul și introduceți valoarea!");onSave(f);}}>
            {loading?<span className="spinner"/>:<><Ic n="check" s={14}/> Salvare contract</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── VIU MODAL FROM CONTRACT ─────────────────────────────────────────────────
// Pre-fills data from contract: client, address, contract number, date, signature

function ViuModalFromContract({ contract, client, type, onSave, onClose }) {
  const isRiu = type === "RiU";
  const ops = isRiu ? RIU_OPS : VIU_OPS;
  const [tab, setTab] = useState("verificare");
  const [preview, setPreview] = useState(false);
  const [f, setF] = useState({
    type,
    number: `${type}-${Date.now().toString().slice(-6)}`,
    client_id: client?.id || "",
    date: contract.date || today(),
    consumption_address: client?.address || "",
    contract_number: contract.number || "",
    last_verification_date: "",
    due_date: addDays(contract.date || today(), isRiu ? 3650 : 730),
    inspection_type: "Periodică",
    installation_type: "Individuală",
    checklist: {}, checklist_obs: {},
    defects: "", actions: "", conclusion: "ADMIS",
    technical_conditions: "Corespunzătoare",
    // Semnătura clientului copiată automat din contract
    client_sig: contract.client_sig || null,
    technician_sig: contract.technician_sig || null,
    meter_protocol_number: "", meter_protocol_date: "", revision_reason: "",
    pressure_resistance: "", pressure_tightness: "", pressure_regime: "",
    installation_material: "OL", installation_location: "Suprateran", test_result: "Admis",
  });
  const s = (k,v) => setF(p=>({...p,[k]:v}));

  if (preview) return (
    <div className="modal-bg">
      <div className="modal modal-lg" style={{maxWidth:900}}>
        <div className="modal-hdr">
          <Ic n="filetxt"/><div className="modal-title">Previzualizare {f.type} — {f.number}</div>
          <button className="btn btn-sm btn-ghost no-print" style={{marginRight:4}} onClick={()=>window.print()}><Ic n="print" s={14}/> Tipărire</button>
          <button className="btn-icon no-print" onClick={()=>setPreview(false)}><Ic n="x"/></button>
        </div>
        <div className="modal-body" style={{padding:0}}><ViuPDF r={f} client={client} /></div>
        <div className="modal-foot no-print">
          <button className="btn btn-ghost" onClick={()=>setPreview(false)}>Înapoi</button>
          <button className="btn btn-primary" onClick={()=>onSave(f)}><Ic n="check" s={14}/> Salvare și finalizare</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-bg">
      <div className="modal modal-lg" style={{maxWidth:900}}>
        <div className="modal-hdr">
          <Ic n="filetxt"/>
          <div className="modal-title">
            Raport {type} — {client?.last_name} {client?.first_name}
            <span style={{fontSize:12,color:COLORS.gray400,marginLeft:8,fontWeight:400}}>generat din contractul {contract.number}</span>
          </div>
          <button className="btn-icon" onClick={onClose}><Ic n="x"/></button>
        </div>

        {/* Info banner */}
        <div style={{padding:"10px 24px",background:COLORS.primaryLight,borderBottom:`1px solid ${COLORS.gray100}`,fontSize:13,color:COLORS.primary,display:"flex",alignItems:"center",gap:8}}>
          <Ic n="check" s={15}/>
          Datele clientului, nr. contractului și semnătura au fost preluate automat din contract.
          {contract.client_sig && <span style={{color:COLORS.success}}>✓ Semnătură client inclusă</span>}
        </div>

        <div className="modal-body">
          <div className="tabs">
            {["verificare", isRiu?"presiune":null, "concluzie", "semnaturi"].filter(Boolean).map(t=>(
              <button key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>
                {t==="verificare"?"Operații verificare":t==="presiune"?"Probe presiune":t==="concluzie"?"Concluzie":"Semnături"}
              </button>
            ))}
          </div>

          {/* Date precompletate - vizualizare */}
          <div style={{background:COLORS.gray50,borderRadius:8,padding:"12px 16px",marginBottom:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:13}}>
            <div><span style={{color:COLORS.gray400}}>Client: </span><strong>{client?.last_name} {client?.first_name}</strong></div>
            <div><span style={{color:COLORS.gray400}}>Nr. contract: </span><strong>{contract.number}</strong></div>
            <div><span style={{color:COLORS.gray400}}>Adresă: </span><strong>{client?.address}, {client?.city}</strong></div>
            <div><span style={{color:COLORS.gray400}}>Data: </span><strong>{fmtApp(contract.date)}</strong></div>
            <div><span style={{color:COLORS.gray400}}>Scadent: </span>
              <input type="date" value={f.due_date} onChange={e=>s("due_date",e.target.value)} style={{padding:"2px 6px",fontSize:12,width:"auto"}} />
            </div>
            <div><span style={{color:COLORS.gray400}}>Ultima verificare: </span>
              <input type="date" value={f.last_verification_date} onChange={e=>s("last_verification_date",e.target.value)} style={{padding:"2px 6px",fontSize:12,width:"auto"}} />
            </div>
            <div><span style={{color:COLORS.gray400}}>Tip instalație: </span>
              <select value={f.installation_type} onChange={e=>s("installation_type",e.target.value)} style={{padding:"2px 6px",fontSize:12,width:"auto"}}>
                <option>Individuală</option><option>Comună</option>
              </select>
            </div>
            {isRiu && <div><span style={{color:COLORS.gray400}}>Protocol contor: </span>
              <input value={f.meter_protocol_number} onChange={e=>s("meter_protocol_number",e.target.value)} style={{padding:"2px 6px",fontSize:12,width:"auto"}} placeholder="Nr. protocol" />
            </div>}
          </div>

          {tab==="verificare" && <div>
            <p style={{fontSize:13,color:COLORS.gray400,marginBottom:14}}>Selectați rezultatul fiecărei operații:</p>
            {ops.map((op,i) => {
              const id = `v${i+1}`;
              return (
                <div key={id} className="checklist-row">
                  <div className="checklist-text" style={{fontSize:13}}>{i+1}. {op}</div>
                  <div className="check-opts">
                    {["DA","NU","N/A"].map(opt=>(
                      <label key={opt} className="check-opt">
                        <input type="radio" name={`ctr_${id}`} value={opt} checked={f.checklist[id]===opt} onChange={()=>setF(p=>({...p,checklist:{...p.checklist,[id]:opt}}))} />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                  <input style={{width:150,fontSize:12}} placeholder="Obs." value={f.checklist_obs[id]||""} onChange={e=>setF(p=>({...p,checklist_obs:{...p.checklist_obs,[id]:e.target.value}}))} />
                </div>
              );
            })}
          </div>}

          {tab==="presiune" && isRiu && <div className="fgrid">
            <div className="fgroup"><label>Material instalație</label><select value={f.installation_material} onChange={e=>s("installation_material",e.target.value)}><option>OL</option><option>PE100</option><option>PE80</option></select></div>
            <div className="fgroup"><label>Amplasament</label><select value={f.installation_location} onChange={e=>s("installation_location",e.target.value)}><option>Suprateran</option><option>Subteran</option></select></div>
            <div className="fgroup"><label>Motiv revizie</label><input value={f.revision_reason} onChange={e=>s("revision_reason",e.target.value)} /></div>
            <div className="fgroup"><label>Presiune rezistență (bar)</label><input type="number" step="0.1" value={f.pressure_resistance} onChange={e=>s("pressure_resistance",e.target.value)} /></div>
            <div className="fgroup"><label>Presiune etanșeitate (bar)</label><input type="number" step="0.1" value={f.pressure_tightness} onChange={e=>s("pressure_tightness",e.target.value)} /></div>
            <div className="fgroup"><label>Rezultat test</label><select value={f.test_result} onChange={e=>s("test_result",e.target.value)}><option>Admis</option><option>Respins</option></select></div>
          </div>}

          {tab==="concluzie" && <div className="fgrid">
            <div className="fgroup spanfull"><label>Concluzie finală</label><select value={f.conclusion} onChange={e=>s("conclusion",e.target.value)}><option>ADMIS</option><option>RESPINS</option><option>Condiționat</option></select></div>
            <div className="fgroup spanfull"><label>Defecte constatate</label><textarea value={f.defects} onChange={e=>s("defects",e.target.value)} /></div>
            <div className="fgroup spanfull"><label>Acțiuni corective</label><textarea value={f.actions} onChange={e=>s("actions",e.target.value)} /></div>
            <div className="fgroup spanfull"><label>Condiții tehnice exploatare</label><select value={f.technical_conditions} onChange={e=>s("technical_conditions",e.target.value)}><option>Corespunzătoare</option><option>Necorespunzătoare</option><option>Parțial corespunzătoare</option></select></div>
          </div>}

          {tab==="semnaturi" && <div>
            <div style={{background:COLORS.successLight,borderRadius:8,padding:"10px 14px",marginBottom:16,fontSize:13,color:COLORS.success}}>
              ✓ Semnătura clientului a fost preluată automat din contract. Puteți adăuga semnătura tehnicianului mai jos.
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
              <div>
                <label style={{display:"block",marginBottom:8,fontSize:12,fontWeight:600,color:COLORS.gray600}}>Semnătură client (din contract)</label>
                {f.client_sig
                  ? <div style={{border:`2px solid ${COLORS.success}`,borderRadius:10,padding:8,background:COLORS.successLight}}>
                      <img src={f.client_sig} style={{width:"100%",height:100,objectFit:"contain"}} alt="Semnătură client" />
                      <p style={{fontSize:11,color:COLORS.success,marginTop:4}}>✓ Semnătură preluată din contract</p>
                    </div>
                  : <SigPad label="" value={f.client_sig} onChange={v=>s("client_sig",v)} />
                }
              </div>
              <SigPad label="Semnătură tehnician" value={f.technician_sig} onChange={v=>s("technician_sig",v)} />
            </div>
          </div>}
        </div>

        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Anulare</button>
          <button className="btn btn-ghost" onClick={()=>setPreview(true)}><Ic n="eye" s={14}/> Previzualizare</button>
          <button className="btn btn-primary" onClick={()=>onSave(f)}>
            <Ic n="check" s={14}/> Salvare raport {type}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── REPORTS ─────────────────────────────────────────────────────────────────

function Reports({ reports, clients }) {
  const [view, setView] = useState(null);
  return (
    <div>
      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Tip / Nr.</th><th>Client</th><th>Data</th><th>Concluzie</th><th>Scadent</th><th>Acțiuni</th></tr></thead>
            <tbody>
              {reports.length===0 ? <tr><td colSpan={6}><div className="empty">Niciun raport ViU/RiU. Adăugați din modulul Lucrări.</div></td></tr>
                : reports.map(r => {
                    const cl = clients.find(c=>c.id===r.client_id);
                    return (
                      <tr key={r.id}>
                        <td><span className={`badge ${r.type==="ViU"?"b-blue":"b-orange"}`}>{r.type}</span><span style={{marginLeft:8,fontFamily:"monospace",fontSize:12}}>{r.number}</span></td>
                        <td>{cl?.last_name} {cl?.first_name}</td>
                        <td>{fmtApp(r.date)}</td>
                        <td><span className={`badge ${r.conclusion==="ADMIS"?"b-green":r.conclusion==="RESPINS"?"b-red":"b-gray"}`}>{r.conclusion||"N/A"}</span></td>
                        <td style={{fontWeight:500,color:COLORS.accent}}>{fmtApp(r.due_date)}</td>
                        <td><button className="btn btn-sm btn-ghost" onClick={()=>setView(r)}><Ic n="eye" s={13}/> Vizualizare</button></td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>
      </div>
      {view && (
        <div className="modal-bg">
          <div className="modal modal-lg" style={{maxWidth:900}}>
            <div className="modal-hdr"><Ic n="filetxt"/><div className="modal-title">Raport {view.type} — {view.number}</div>
              <button className="btn btn-sm btn-ghost no-print" style={{marginRight:4}} onClick={()=>window.print()}><Ic n="print" s={14}/> Tipărire</button>
              <button className="btn-icon no-print" onClick={()=>setView(null)}><Ic n="x"/></button>
            </div>
            <div className="modal-body" style={{padding:0}}><ViuPDF r={view} client={clients.find(c=>c.id===view.client_id)} /></div>
            <div className="modal-foot no-print"><button className="btn btn-ghost" onClick={()=>setView(null)}>Închide</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────

function Login({ onLogin }) {
  const [email,setEmail] = useState("");
  const [pw,setPw] = useState("");
  const [err,setErr] = useState("");
  const [loading,setLoading] = useState(false);
  const handle = async (e) => {
    e.preventDefault(); setLoading(true); setErr("");
    const { data, error } = await supabase.auth.signInWithPassword({email, password: pw});
    if (error) { setErr("Email sau parolă incorectă."); setLoading(false); return; }
    onLogin(data.user);
  };
  return (
    <div className="login-page">
      <div className="login-card">
        <div style={{width:44,height:44,background:COLORS.primary,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </div>
        <div className="login-logo-name">ATIMO PROJECT SRL</div>
        <div className="login-logo-sub">Sistem de management tehnic gaze naturale</div>
        <div className="login-title">Autentificare</div>
        <div className="login-sub">Introduceți datele contului dvs.</div>
        {err && <div className="login-err">{err}</div>}
        <form onSubmit={handle}>
          <div className="fgroup" style={{marginBottom:12}}><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
          <div className="fgroup" style={{marginBottom:20}}><label>Parolă</label><input type="password" value={pw} onChange={e=>setPw(e.target.value)} required /></div>
          <button type="submit" className="btn btn-primary" style={{width:"100%",justifyContent:"center",padding:11}} disabled={loading}>
            {loading?<span className="spinner"/>:"Autentificare"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── TECHNICIAN VIEW ─────────────────────────────────────────────────────────
// Interfață simplificată pentru tehnicieni - doar lucrările alocate lor

function TechnicianView({ user, userMeta, clients, jobs, setJobs, reports, setReports, logout }) {
  const [viuModal, setViuModal] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Tehnicianul vede doar lucrările alocate lui
  const myJobs = jobs.filter(j =>
    j.technician && j.technician.toLowerCase().includes((userMeta?.name||"").toLowerCase().split(" ")[0].toLowerCase())
    || j.technician === user.email
  );

  // Dacă nu are lucrări alocate după nume, arată toate lucrările nefinalizate
  const visibleJobs = myJobs.length > 0 ? myJobs : jobs.filter(j => j.status !== "Finalizat");

  const updateStatus = async (id, status) => {
    await supabase.from("jobs").update({status}).eq("id", id);
    setJobs(p => p.map(j => j.id === id ? {...j, status} : j));
  };

  const saveReport = async (r) => {
    const reportToSave = {
      job_id: r.job_id, client_id: r.client_id, type: r.type, number: r.number, date: r.date,
      consumption_address: r.consumption_address, contract_number: r.contract_number,
      last_verification_date: r.last_verification_date || null, due_date: r.due_date || null,
      inspection_type: r.inspection_type, installation_type: r.installation_type,
      checklist: r.checklist || {}, checklist_obs: r.checklist_obs || {},
      defects: r.defects, actions: r.actions, conclusion: r.conclusion,
      technical_conditions: r.technical_conditions,
      client_sig: r.client_sig || null, technician_sig: r.technician_sig || null,
      meter_protocol_number: r.meter_protocol_number, meter_protocol_date: r.meter_protocol_date || null,
      revision_reason: r.revision_reason,
      pressure_resistance: r.pressure_resistance || null, pressure_tightness: r.pressure_tightness || null,
      pressure_regime: r.pressure_regime || null,
      installation_material: r.installation_material, installation_location: r.installation_location,
      test_result: r.test_result,
    };
    const { data, error } = await supabase.from("reports").insert(reportToSave).select().single();
    if (error) { alert("Eroare: " + error.message); return; }
    if (data) {
      setReports(p => [...p, data]);
      // Marchează lucrarea ca finalizată
      if (r.job_id) updateStatus(r.job_id, "Finalizat");
    }
    setViuModal(null);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {sidebarOpen && <div onClick={()=>setSidebarOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:499}}/>}

        <div className={`sidebar ${sidebarOpen?"open":""}`}>
          <div className="sidebar-logo">
            <div style={{width:36,height:36,background:"rgba(255,255,255,0.15)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div className="logo-name">ATIMO PROJECT</div>
            <div className="logo-sub">Tehnician teren</div>
          </div>
          <div className="nav">
            <div className="nav-label">Lucrările mele</div>
            <div style={{padding:"8px 20px",fontSize:13,color:"rgba(255,255,255,0.5)"}}>
              {visibleJobs.filter(j=>j.status!=="Finalizat").length} lucrări active
            </div>
          </div>
          <div className="sidebar-user">
            <div className="user-name">{userMeta?.name||user.email}</div>
            <div className="user-role">Tehnician</div>
            <button className="logout-btn" onClick={logout}><Ic n="logout" s={14}/> Deconectare</button>
          </div>
        </div>

        <div className="main">
          <div className="topbar">
            <button className="btn-icon" onClick={()=>setSidebarOpen(!sidebarOpen)} style={{marginRight:4}}><Ic n="menu"/></button>
            <div className="topbar-title">Lucrările mele</div>
            <div style={{width:34,height:34,borderRadius:"50%",background:COLORS.primaryLight,color:COLORS.primary,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13}}>
              {(userMeta?.name||user.email).slice(0,2).toUpperCase()}
            </div>
          </div>

          <div className="page">
            {/* Statistici rapide */}
            <div className="stat-grid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
              <div className="stat accent-stat">
                <div className="stat-label">Total lucrări</div>
                <div className="stat-val">{visibleJobs.length}</div>
              </div>
              <div className="stat">
                <div className="stat-label">Active</div>
                <div className="stat-val" style={{color:COLORS.warning}}>{visibleJobs.filter(j=>j.status==="In progres"||j.status==="Programat").length}</div>
              </div>
              <div className="stat">
                <div className="stat-label">Finalizate</div>
                <div className="stat-val" style={{color:COLORS.success}}>{visibleJobs.filter(j=>j.status==="Finalizat").length}</div>
              </div>
            </div>

            {/* Lista lucrări */}
            {visibleJobs.length === 0 ? (
              <div className="empty" style={{marginTop:40}}>
                <div style={{fontSize:40,marginBottom:12}}>✓</div>
                <div style={{fontWeight:600,fontSize:16}}>Nicio lucrare alocată</div>
                <div style={{fontSize:14,color:COLORS.gray400,marginTop:4}}>Contactați administratorul pentru alocare lucrări</div>
              </div>
            ) : visibleJobs.map(j => {
              const cl = clients.find(c=>c.id===j.client_id);
              const jobReports = reports.filter(r=>r.job_id===j.id);
              const isViu = j.service_type?.includes("ViU");
              const isRiu = j.service_type?.includes("RiU");
              return (
                <div key={j.id} className="card" style={{marginBottom:12}}>
                  <div style={{padding:"16px 20px"}}>
                    {/* Header lucrare */}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                      <div>
                        <div style={{fontWeight:600,fontSize:16}}>{cl?.last_name} {cl?.first_name}</div>
                        <div style={{fontSize:13,color:COLORS.gray400,marginTop:2}}>{cl?.address}, {cl?.city}</div>
                        <div style={{fontSize:13,color:COLORS.gray600,marginTop:4}}>{j.service_type}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <span className={`badge ${j.status==="Finalizat"?"b-green":j.status==="In progres"?"b-orange":"b-blue"}`}>{j.status}</span>
                        <div style={{fontSize:12,color:COLORS.gray400,marginTop:4}}>{fmtApp(j.date)}</div>
                      </div>
                    </div>

                    {/* Date client */}
                    <div style={{background:COLORS.gray50,borderRadius:8,padding:"10px 14px",marginBottom:12,fontSize:13}}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                        <div><span style={{color:COLORS.gray400}}>Telefon: </span><strong>{cl?.phone}</strong></div>
                        <div><span style={{color:COLORS.gray400}}>Cod abonat: </span><strong>{cl?.subscriber_code||"-"}</strong></div>
                        <div><span style={{color:COLORS.gray400}}>Cod loc consum: </span><strong>{cl?.consumption_code||"-"}</strong></div>
                        {j.observations && <div className="spanfull"><span style={{color:COLORS.gray400}}>Obs: </span>{j.observations}</div>}
                      </div>
                    </div>

                    {/* Rapoarte existente */}
                    {jobReports.length > 0 && (
                      <div style={{marginBottom:12}}>
                        {jobReports.map(r => (
                          <div key={r.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",background:COLORS.successLight,borderRadius:8,marginBottom:4}}>
                            <div style={{fontSize:13}}>
                              <span className={`badge ${r.type==="ViU"?"b-blue":"b-orange"}`}>{r.type}</span>
                              <span style={{marginLeft:8,fontFamily:"monospace",fontSize:12}}>{r.number}</span>
                              <span style={{marginLeft:8,color:COLORS.success}}>✓ {r.conclusion}</span>
                            </div>
                            <ReportPrintButton r={r} client={cl} />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Acțiuni */}
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {(isViu||isRiu) && j.status !== "Finalizat" && (
                        <button className="btn btn-primary" onClick={()=>setViuModal(j)}>
                          <Ic n="filetxt" s={15}/> Completează {isRiu?"RiU":"ViU"}
                        </button>
                      )}
                      {j.status === "Programat" && (
                        <button className="btn btn-ghost" onClick={()=>updateStatus(j.id,"In progres")}>
                          ▶ Începe lucrarea
                        </button>
                      )}
                      {j.status === "In progres" && jobReports.length > 0 && (
                        <button className="btn btn-success" style={{background:COLORS.success,color:"#fff"}} onClick={()=>updateStatus(j.id,"Finalizat")}>
                          ✓ Marchează finalizat
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {viuModal && <ViuModal job={viuModal} clients={clients} onSave={saveReport} onClose={()=>setViuModal(null)} />}
      </div>
    </>
  );
}

// Buton print pentru tehnician
function ReportPrintButton({ r, client }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <button className="btn btn-sm btn-ghost" onClick={()=>setShow(true)}><Ic n="print" s={13}/> Tipărire</button>
      {show && (
        <div className="modal-bg">
          <div className="modal modal-lg" style={{maxWidth:900}}>
            <div className="modal-hdr">
              <Ic n="filetxt"/><div className="modal-title">Raport {r.type} — {r.number}</div>
              <button className="btn btn-sm btn-ghost no-print" style={{marginRight:4}} onClick={()=>window.print()}><Ic n="print" s={14}/> Tipărire</button>
              <button className="btn-icon no-print" onClick={()=>setShow(false)}><Ic n="x"/></button>
            </div>
            <div className="modal-body" style={{padding:0}}><ViuPDF r={r} client={client}/></div>
            <div className="modal-foot no-print"><button className="btn btn-ghost" onClick={()=>setShow(false)}>Închide</button></div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [user,setUser] = useState(null);
  const [userMeta,setUserMeta] = useState(null);
  const [page,setPage] = useState("dashboard");
  const [sidebarOpen,setSidebarOpen] = useState(false);
  const [loading,setLoading] = useState(true);
  const [clients,setClients] = useState([]);
  const [jobs,setJobs] = useState([]);
  const [contracts,setContracts] = useState([]);
  const [reports,setReports] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session?.user) setUser(session.user);
      setLoading(false);
    });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_,session)=>{setUser(session?.user??null);});
    return ()=>subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if(!user) return;
    const load = async () => {
      const {data:profile} = await supabase.from("profiles").select("role,name").eq("id",user.id).single();
      if(profile) setUserMeta(profile);

      const isTech = profile?.role === "technician";
      const [c,j,co,r] = await Promise.all([
        supabase.from("clients").select("*").order("created_at",{ascending:false}),
        // Tehnicianul încarcă toate job-urile (filtrăm în UI după nume)
        supabase.from("jobs").select("*").order("date",{ascending:false}),
        isTech ? {data:[]} : supabase.from("contracts").select("*").order("created_at",{ascending:false}),
        supabase.from("reports").select("*").order("date",{ascending:false}),
      ]);
      if(c.data) setClients(c.data);
      if(j.data) setJobs(j.data);
      if(co.data) setContracts(co.data);
      if(r.data) setReports(r.data);
    };
    load();
  }, [user]);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null); setUserMeta(null);
    setClients([]); setJobs([]); setContracts([]); setReports([]);
  };

  if(loading) return (
    <><style>{styles}</style>
      <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div className="spinner" style={{width:36,height:36,borderWidth:3}}/>
      </div>
    </>
  );

  if(!user) return (<><style>{styles}</style><Login onLogin={setUser}/></>);

  const role = userMeta?.role || "admin";

  // ── INTERFAȚĂ TEHNICIAN ──
  if(role === "technician") {
    return (
      <TechnicianView
        user={user}
        userMeta={userMeta}
        clients={clients}
        jobs={jobs}
        setJobs={setJobs}
        reports={reports}
        setReports={setReports}
        logout={logout}
      />
    );
  }

  // ── INTERFAȚĂ ADMIN ──
  const nav = [
    {id:"dashboard",label:"Dashboard",icon:"dashboard"},
    {id:"clients",label:"Clienți",icon:"users"},
    {id:"jobs",label:"Lucrări",icon:"briefcase"},
    {id:"contracts",label:"Contracte",icon:"doc"},
    {id:"reports",label:"Rapoarte ViU/RiU",icon:"filetxt"},
  ];
  const titles = {dashboard:"Dashboard",clients:"Clienți",jobs:"Lucrări",contracts:"Contracte",reports:"Rapoarte ViU / RiU"};
  const expiring = clients.filter(c=>{if(!c.next_viu_date)return false;const d=(new Date(c.next_viu_date)-new Date())/86400000;return d>=0&&d<=60;}).length;

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {sidebarOpen && <div onClick={()=>setSidebarOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:499}}/>}
        <div className={`sidebar ${sidebarOpen?"open":""}`}>
          <div className="sidebar-logo">
            <div style={{width:36,height:36,background:"rgba(255,255,255,0.15)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div className="logo-name">ATIMO PROJECT</div>
            <div className="logo-sub">Servicii tehnice gaze</div>
          </div>
          <div className="nav">
            <div className="nav-label">Meniu principal</div>
            {nav.map(item=>(
              <button key={item.id} className={`nav-btn ${page===item.id?"active":""}`} onClick={()=>{setPage(item.id);setSidebarOpen(false);}}>
                <Ic n={item.icon} s={17}/>{item.label}
                {item.id==="reports"&&expiring>0&&<span className="nav-badge">{expiring}</span>}
              </button>
            ))}
          </div>
          <div className="sidebar-user">
            <div className="user-name">{userMeta?.name||user.email}</div>
            <div className="user-role">Administrator</div>
            <button className="logout-btn" onClick={logout}><Ic n="logout" s={14}/> Deconectare</button>
          </div>
        </div>

        <div className="main">
          <div className="topbar">
            <button className="btn-icon" onClick={()=>setSidebarOpen(!sidebarOpen)} style={{marginRight:4}}><Ic n="menu"/></button>
            <div className="topbar-title">{titles[page]}</div>
            {expiring>0&&(
              <button className="btn btn-sm" style={{background:COLORS.warningLight,color:COLORS.warning,border:"none"}} onClick={()=>setPage("reports")}>
                <Ic n="bell" s={14}/> {expiring} expirări
              </button>
            )}
            <div style={{width:34,height:34,borderRadius:"50%",background:COLORS.primaryLight,color:COLORS.primary,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,flexShrink:0}}>
              {(userMeta?.name||user.email).slice(0,2).toUpperCase()}
            </div>
          </div>
          <div className="page">
            {page==="dashboard"&&<Dashboard clients={clients} jobs={jobs} reports={reports}/>}
            {page==="clients"&&<Clients clients={clients} setClients={setClients} jobs={jobs} userRole={role}/>}
            {page==="jobs"&&<Jobs clients={clients} jobs={jobs} setJobs={setJobs} reports={reports} setReports={setReports} userRole={role}/>}
            {page==="contracts"&&<Contracts clients={clients} contracts={contracts} setContracts={setContracts} reports={reports} setReports={setReports}/>}
            {page==="reports"&&<Reports reports={reports} clients={clients}/>}
          </div>
        </div>
      </div>
    </>
  );
}
