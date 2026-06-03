import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";

// ─── CONSTANTE ────────────────────────────────────────────────────────────────

const COLORS = {
  primary: "#1B4F8A", primaryDark: "#0D3060", primaryLight: "#E8F0FA",
  accent: "#E8501A", accentLight: "#FDF0EB",
  success: "#2A7D4F", successLight: "#E8F5EE",
  warning: "#B87514", warningLight: "#FBF4E6",
  danger: "#C0392B", dangerLight: "#FDECEA",
  gray50: "#F7F8FA", gray100: "#EFF1F5", gray200: "#D9DCE4",
  gray400: "#9098A9", gray600: "#5A6478", gray800: "#2C3345", gray900: "#181D2B",
};

const SERVICE_TYPES = [
  "ViU - Verificare Instalație Utilizare",
  "RiU - Revizie Instalație Utilizare",
  "VTP - Verificare Tehnică Periodică",
  "PIF - Punere în Funcțiune",
  "Montaj detector gaze",
  "Montaj termostat",
  "Montaj filtru magnetic",
  "Servicii gaz suplimentare",
  "Taxă deplasare",
  "Taxă urgență",
];

const COUNTIES = ["Alba","Arad","Argeș","Bacău","Bihor","Bistrița-Năsăud","Botoșani","Brașov","Brăila","București","Buzău","Caraș-Severin","Călărași","Cluj","Constanța","Covasna","Dâmbovița","Dolj","Galați","Giurgiu","Gorj","Harghita","Hunedoara","Ialomița","Iași","Ilfov","Maramureș","Mehedinți","Mureș","Neamț","Olt","Prahova","Satu Mare","Sălaj","Sibiu","Suceava","Teleorman","Timiș","Tulcea","Vaslui","Vâlcea","Vrancea"];

const VIU_CHECKLIST = [
  { id: "v1", text: "Verificarea documentelor tehnice ale instalației" },
  { id: "v2", text: "Verificarea vizuală a conductelor și fitingurilor" },
  { id: "v3", text: "Verificarea etanșeității îmbinărilor" },
  { id: "v4", text: "Verificarea dispozitivelor de siguranță" },
  { id: "v5", text: "Verificarea aparatelor de utilizare" },
  { id: "v6", text: "Verificarea ventilației și evacuării gazelor arse" },
  { id: "v7", text: "Verificarea coșurilor de fum" },
  { id: "v8", text: "Verificarea contoarelor de gaz" },
  { id: "v9", text: "Verificarea robineților de închidere" },
  { id: "v10", text: "Verificarea marcajelor și etichetelor" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function today() { return new Date().toISOString().split("T")[0]; }
function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}
function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("ro-RO");
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'DM Sans', sans-serif; background: ${COLORS.gray50}; color: ${COLORS.gray800}; font-size: 14px; }
::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: ${COLORS.gray200}; border-radius: 3px; }
input,select,textarea,button { font-family: inherit; }
button { cursor: pointer; }

.app { display: flex; height: 100vh; overflow: hidden; }
.sidebar { width: 240px; background: ${COLORS.primaryDark}; display: flex; flex-direction: column; flex-shrink: 0; overflow-y: auto; }
.sidebar-logo { padding: 20px 20px 16px; border-bottom: 1px solid rgba(255,255,255,0.08); }
.logo-icon { width: 38px; height: 38px; background: rgba(255,255,255,0.15); border-radius: 9px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
.logo-name { font-size: 15px; font-weight: 600; color: #fff; }
.logo-sub { font-size: 11px; color: rgba(255,255,255,0.45); margin-top: 2px; }
.nav { padding: 12px 0; flex: 1; }
.nav-label { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; color: rgba(255,255,255,0.35); padding: 8px 20px 4px; text-transform: uppercase; }
.nav-btn { display: flex; align-items: center; gap: 10px; padding: 9px 20px; color: rgba(255,255,255,0.6); background: none; border: none; width: 100%; font-size: 14px; transition: all 0.15s; }
.nav-btn:hover { color: #fff; background: rgba(255,255,255,0.07); }
.nav-btn.active { color: #fff; background: rgba(255,255,255,0.13); }
.nav-badge { margin-left: auto; background: ${COLORS.accent}; color: #fff; font-size: 11px; padding: 1px 7px; border-radius: 10px; font-weight: 600; }
.sidebar-user { padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.08); }
.user-name { font-size: 13px; color: rgba(255,255,255,0.8); font-weight: 500; }
.user-role { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 2px; }
.logout-btn { display: flex; align-items: center; gap: 7px; padding: 8px 0 0; color: rgba(255,255,255,0.4); font-size: 12px; background: none; border: none; }
.logout-btn:hover { color: rgba(255,255,255,0.7); }

.main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.topbar { height: 56px; background: #fff; border-bottom: 1px solid ${COLORS.gray100}; display: flex; align-items: center; padding: 0 24px; gap: 16px; flex-shrink: 0; }
.topbar-title { font-size: 16px; font-weight: 600; flex: 1; }
.page { flex: 1; overflow-y: auto; padding: 24px; }

.btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; border: none; transition: all 0.15s; }
.btn-sm { padding: 5px 12px; font-size: 13px; border-radius: 6px; }
.btn-primary { background: ${COLORS.primary}; color: #fff; }
.btn-primary:hover { background: ${COLORS.primaryDark}; }
.btn-ghost { background: transparent; color: ${COLORS.gray600}; border: 1px solid ${COLORS.gray200}; }
.btn-ghost:hover { background: ${COLORS.gray100}; }
.btn-danger { background: ${COLORS.danger}; color: #fff; }
.btn-icon { padding: 7px; border-radius: 6px; background: transparent; border: 1px solid ${COLORS.gray200}; color: ${COLORS.gray600}; }
.btn-icon:hover { background: ${COLORS.gray100}; }

.card { background: #fff; border-radius: 12px; border: 1px solid ${COLORS.gray100}; }
.card-header { padding: 16px 20px 12px; border-bottom: 1px solid ${COLORS.gray100}; display: flex; align-items: center; gap: 10px; }
.card-title { font-size: 15px; font-weight: 600; flex: 1; }

.stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; margin-bottom: 24px; }
.stat { background: #fff; border-radius: 10px; border: 1px solid ${COLORS.gray100}; padding: 16px 20px; }
.stat.accent-stat { background: ${COLORS.primary}; border-color: ${COLORS.primary}; }
.stat-label { font-size: 12px; color: ${COLORS.gray400}; margin-bottom: 6px; }
.accent-stat .stat-label { color: rgba(255,255,255,0.6); }
.stat-val { font-size: 26px; font-weight: 600; line-height: 1; }
.accent-stat .stat-val { color: #fff; }
.stat-sub { font-size: 12px; color: ${COLORS.gray400}; margin-top: 4px; }
.accent-stat .stat-sub { color: rgba(255,255,255,0.5); }

table { width: 100%; border-collapse: collapse; }
thead th { padding: 10px 14px; font-size: 12px; font-weight: 600; color: ${COLORS.gray400}; text-align: left; background: ${COLORS.gray50}; border-bottom: 1px solid ${COLORS.gray100}; white-space: nowrap; }
tbody td { padding: 12px 14px; border-bottom: 1px solid ${COLORS.gray100}; }
tbody tr:last-child td { border-bottom: none; }
tbody tr:hover td { background: ${COLORS.gray50}; }
.tbl-wrap { overflow-x: auto; }

.badge { display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 20px; font-size: 12px; font-weight: 500; }
.b-blue { background: ${COLORS.primaryLight}; color: ${COLORS.primary}; }
.b-green { background: ${COLORS.successLight}; color: ${COLORS.success}; }
.b-orange { background: ${COLORS.warningLight}; color: ${COLORS.warning}; }
.b-red { background: ${COLORS.dangerLight}; color: ${COLORS.danger}; }
.b-gray { background: ${COLORS.gray100}; color: ${COLORS.gray600}; }

.filter-bar { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; }
.search-box { display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid ${COLORS.gray200}; border-radius: 8px; padding: 7px 12px; flex: 1; min-width: 200px; }
.search-box input { border: none; background: transparent; outline: none; flex: 1; font-size: 14px; }

.fgroup { display: flex; flex-direction: column; gap: 5px; }
.fgroup label { font-size: 12px; font-weight: 600; color: ${COLORS.gray600}; }
.fgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 14px; }
.span2 { grid-column: span 2; }
.spanfull { grid-column: 1 / -1; }
input[type=text],input[type=email],input[type=tel],input[type=date],input[type=number],input[type=password],select,textarea {
  padding: 9px 12px; border: 1px solid ${COLORS.gray200}; border-radius: 8px; font-size: 14px; color: ${COLORS.gray800}; background: #fff; width: 100%;
}
input:focus,select:focus,textarea:focus { outline: none; border-color: ${COLORS.primary}; box-shadow: 0 0 0 3px ${COLORS.primaryLight}; }
textarea { resize: vertical; min-height: 80px; }
.fsec { margin-bottom: 22px; }
.fsec-title { font-size: 11px; font-weight: 700; color: ${COLORS.gray400}; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid ${COLORS.gray100}; }

.modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal { background: #fff; border-radius: 16px; width: 100%; max-width: 700px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
.modal-lg { max-width: 880px; }
.modal-hdr { padding: 20px 24px 16px; border-bottom: 1px solid ${COLORS.gray100}; display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.modal-title { font-size: 16px; font-weight: 600; flex: 1; }
.modal-body { padding: 24px; overflow-y: auto; flex: 1; }
.modal-foot { padding: 16px 24px; border-top: 1px solid ${COLORS.gray100}; display: flex; justify-content: flex-end; gap: 8px; flex-shrink: 0; }

.tabs { display: flex; border-bottom: 2px solid ${COLORS.gray100}; margin-bottom: 20px; }
.tab { padding: 10px 18px; font-size: 14px; font-weight: 500; background: none; border: none; color: ${COLORS.gray400}; border-bottom: 2px solid transparent; margin-bottom: -2px; }
.tab.active { color: ${COLORS.primary}; border-bottom-color: ${COLORS.primary}; }
.tab:hover:not(.active) { color: ${COLORS.gray600}; }

.checklist-row { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid ${COLORS.gray100}; flex-wrap: wrap; }
.checklist-text { flex: 1; min-width: 200px; }
.check-opts { display: flex; gap: 10px; }
.check-opt { display: flex; align-items: center; gap: 4px; font-size: 13px; }
.check-opt input { width: auto; }

.sig-wrap { border: 2px dashed ${COLORS.gray200}; border-radius: 10px; background: ${COLORS.gray50}; position: relative; }
.sig-canvas { display: block; cursor: crosshair; touch-action: none; width: 100%; height: 150px; }
.sig-clear { position: absolute; top: 8px; right: 8px; }

.login-page { min-height: 100vh; background: ${COLORS.primaryDark}; display: flex; align-items: center; justify-content: center; padding: 20px; }
.login-card { background: #fff; border-radius: 20px; padding: 40px; width: 100%; max-width: 400px; }
.login-logo-name { font-size: 20px; font-weight: 700; color: ${COLORS.primaryDark}; margin-bottom: 2px; }
.login-logo-sub { font-size: 13px; color: ${COLORS.gray400}; margin-bottom: 28px; }
.login-title { font-size: 22px; font-weight: 600; margin-bottom: 4px; }
.login-sub { font-size: 14px; color: ${COLORS.gray400}; margin-bottom: 24px; }
.login-err { background: ${COLORS.dangerLight}; color: ${COLORS.danger}; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }

.alert { padding: 12px 16px; border-radius: 8px; font-size: 14px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
.alert-warn { background: ${COLORS.warningLight}; color: #744f0d; border: 1px solid #f5d48a; }

.empty { text-align: center; padding: 48px 20px; color: ${COLORS.gray400}; }

.spinner { display: inline-block; width: 20px; height: 20px; border: 2px solid ${COLORS.gray200}; border-top-color: ${COLORS.primary}; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-full { display: flex; align-items: center; justify-content: center; height: 200px; gap: 12px; color: ${COLORS.gray400}; }

/* PDF styles */
.pdf-wrap { background: #fff; padding: 36px; font-family: 'DM Sans', sans-serif; color: #000; }
.pdf-hdr { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 2px solid #1B4F8A; font-size: 12px; }
.pdf-co-name { font-size: 15px; font-weight: 700; color: #1B4F8A; margin-bottom: 3px; }
.pdf-doc-title { font-size: 17px; font-weight: 700; text-align: center; color: #1B4F8A; margin: 14px 0; text-transform: uppercase; letter-spacing: 0.04em; }
.pdf-sec { margin-bottom: 14px; }
.pdf-sec-title { font-size: 11px; font-weight: 700; color: #1B4F8A; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 7px; padding-bottom: 4px; border-bottom: 1px solid #cce0f5; }
.pdf-row { display: flex; gap: 12px; margin-bottom: 5px; font-size: 12px; }
.pdf-lbl { min-width: 170px; color: #666; }
.pdf-val { font-weight: 500; flex: 1; }
.pdf-table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 6px; }
.pdf-table th { background: #1B4F8A; color: #fff; padding: 5px 8px; text-align: left; }
.pdf-table td { padding: 5px 8px; border-bottom: 1px solid #eee; }
.pdf-table tr:nth-child(even) td { background: #f9f9f9; }
.pdf-sigs { display: flex; justify-content: space-between; margin-top: 28px; }
.pdf-sig-box { width: 190px; font-size: 12px; }
.pdf-sig-lbl { color: #666; margin-bottom: 6px; }
.pdf-sig-line { border-top: 1px solid #999; padding-top: 5px; color: #666; margin-top: 36px; }
.pdf-conclusion { padding: 8px 12px; border-radius: 6px; font-weight: 700; font-size: 14px; }

@media print {
  .modal-bg { position: static; background: none; padding: 0; }
  .modal { max-width: none; max-height: none; box-shadow: none; border-radius: 0; }
  .modal-hdr, .modal-foot { display: none; }
  .modal-body { padding: 0; overflow: visible; }
}
@media (max-width: 768px) {
  .sidebar { position: fixed; left: -240px; top: 0; bottom: 0; z-index: 500; transition: left 0.25s; }
  .sidebar.open { left: 0; box-shadow: 4px 0 20px rgba(0,0,0,0.3); }
  .page { padding: 16px; }
  .fgrid { grid-template-columns: 1fr; }
  .span2,.spanfull { grid-column: span 1; }
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

// ─── SIGNATURE PAD ────────────────────────────────────────────────────────────

function SigPad({ value, onChange, label }) {
  const ref = useRef(null);
  const drawing = useRef(false);
  const last = useRef(null);

  useEffect(() => {
    if (value && ref.current) {
      const img = new Image();
      img.onload = () => ref.current.getContext("2d").drawImage(img, 0, 0);
      img.src = value;
    }
  }, []);

  const getPos = (e) => {
    const r = ref.current.getBoundingClientRect();
    const sx = ref.current.width / r.width;
    const sy = ref.current.height / r.height;
    if (e.touches) return { x: (e.touches[0].clientX - r.left) * sx, y: (e.touches[0].clientY - r.top) * sy };
    return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy };
  };

  const start = (e) => { e.preventDefault(); drawing.current = true; last.current = getPos(e); };
  const move = (e) => {
    if (!drawing.current) return; e.preventDefault();
    const ctx = ref.current.getContext("2d");
    const pos = getPos(e);
    ctx.beginPath(); ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(pos.x, pos.y); ctx.strokeStyle = "#1B4F8A";
    ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.stroke();
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

// ─── PDF VIEWS ────────────────────────────────────────────────────────────────

function ContractPDF({ c, client }) {
  return (
    <div className="pdf-wrap">
      <div className="pdf-hdr">
        <div>
          <div className="pdf-co-name">ATIMO PROJECT SRL</div>
          <div>CUI: RO12345678 | J00/000/2010</div>
          <div>Tel: 0700 000 000 | atimo@atimo.ro</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 600 }}>CONTRACT NR. {c.number}</div>
          <div>Data: {formatDate(c.date)}</div>
        </div>
      </div>
      <div className="pdf-doc-title">Contract de prestări servicii tehnice</div>
      <div className="pdf-sec">
        <div className="pdf-sec-title">Beneficiar</div>
        <div className="pdf-row"><span className="pdf-lbl">Nume și prenume:</span><span className="pdf-val">{client?.last_name} {client?.first_name}</span></div>
        <div className="pdf-row"><span className="pdf-lbl">CNP:</span><span className="pdf-val">{client?.cnp || "-"}</span></div>
        <div className="pdf-row"><span className="pdf-lbl">Adresă:</span><span className="pdf-val">{client?.address}, {client?.city}, {client?.county}</span></div>
        <div className="pdf-row"><span className="pdf-lbl">Telefon:</span><span className="pdf-val">{client?.phone}</span></div>
      </div>
      <div className="pdf-sec">
        <div className="pdf-sec-title">Servicii contractate</div>
        {(c.services || []).filter(s => s.checked).map((s, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "3px 0" }}>
            <span>✓ {s.label}</span>
            {s.price && <span style={{ fontWeight: 600 }}>{s.price} RON</span>}
          </div>
        ))}
      </div>
      <div className="pdf-sec">
        <div className="pdf-sec-title">Termeni financiari</div>
        <div className="pdf-row"><span className="pdf-lbl">Valoare totală:</span><span className="pdf-val" style={{ fontSize: 14, fontWeight: 700, color: "#1B4F8A" }}>{c.total_price} RON</span></div>
        <div className="pdf-row"><span className="pdf-lbl">Modalitate plată:</span><span className="pdf-val">{c.payment_method}</span></div>
        <div className="pdf-row"><span className="pdf-lbl">Durată contract:</span><span className="pdf-val">{c.duration}</span></div>
      </div>
      <div className="pdf-sec" style={{ fontSize: 11, color: "#555", lineHeight: 1.5 }}>
        <div className="pdf-sec-title">Notă GDPR</div>
        Datele personale sunt prelucrate conform RGPD 679/2016 exclusiv în scopul executării contractului.
      </div>
      <div className="pdf-sigs">
        <div className="pdf-sig-box">
          <div className="pdf-sig-lbl">Prestator: ATIMO PROJECT SRL</div>
          {c.technician_sig && <img src={c.technician_sig} style={{ width: 140, height: 55, objectFit: "contain" }} alt="" />}
          <div className="pdf-sig-line">Semnătură și ștampilă</div>
        </div>
        <div className="pdf-sig-box">
          <div className="pdf-sig-lbl">Beneficiar: {client?.last_name} {client?.first_name}</div>
          {c.client_sig && <img src={c.client_sig} style={{ width: 140, height: 55, objectFit: "contain" }} alt="" />}
          <div className="pdf-sig-line">Semnătură</div>
        </div>
      </div>
    </div>
  );
}

function ViuPDF({ r, client }) {
  return (
    <div className="pdf-wrap">
      <div className="pdf-hdr">
        <div>
          <div className="pdf-co-name">ATIMO PROJECT SRL</div>
          <div>Instalator autorizat ANRE</div>
          <div>Tel: 0700 000 000 | atimo@atimo.ro</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 600 }}>RAPORT {r.type} NR. {r.number}</div>
          <div>Data: {formatDate(r.date)}</div>
        </div>
      </div>
      <div className="pdf-doc-title">Raport de {r.type === "ViU" ? "verificare" : "revizie"} a instalației de utilizare gaze naturale</div>
      <div className="pdf-sec">
        <div className="pdf-sec-title">Date client și instalație</div>
        <div className="pdf-row"><span className="pdf-lbl">Titular:</span><span className="pdf-val">{client?.last_name} {client?.first_name}</span></div>
        <div className="pdf-row"><span className="pdf-lbl">Adresă consum:</span><span className="pdf-val">{r.consumption_address || client?.address}</span></div>
        <div className="pdf-row"><span className="pdf-lbl">Cod abonat:</span><span className="pdf-val">{client?.subscriber_code || "-"}</span></div>
        <div className="pdf-row"><span className="pdf-lbl">Nr. contract:</span><span className="pdf-val">{r.contract_number || "-"}</span></div>
        <div className="pdf-row"><span className="pdf-lbl">Ultima verificare:</span><span className="pdf-val">{formatDate(r.last_verification_date)}</span></div>
        <div className="pdf-row"><span className="pdf-lbl">Dată scadentă:</span><span className="pdf-val" style={{ fontWeight: 700, color: "#C0392B" }}>{formatDate(r.due_date)}</span></div>
      </div>
      {r.type === "RiU" && (
        <div className="pdf-sec">
          <div className="pdf-sec-title">Date revizie</div>
          <div className="pdf-row"><span className="pdf-lbl">Protocol contor nr.:</span><span className="pdf-val">{r.meter_protocol_number || "-"}</span></div>
          <div className="pdf-row"><span className="pdf-lbl">Motiv revizie:</span><span className="pdf-val">{r.revision_reason || "-"}</span></div>
          <div className="pdf-row"><span className="pdf-lbl">Material instalație:</span><span className="pdf-val">{r.installation_material}</span></div>
          <div className="pdf-row"><span className="pdf-lbl">Amplasament:</span><span className="pdf-val">{r.installation_location}</span></div>
          <div className="pdf-row"><span className="pdf-lbl">Presiune rezistență:</span><span className="pdf-val">{r.pressure_resistance || "-"} bar</span></div>
          <div className="pdf-row"><span className="pdf-lbl">Rezultat test:</span><span className="pdf-val" style={{ fontWeight: 700 }}>{r.test_result}</span></div>
        </div>
      )}
      <div className="pdf-sec">
        <div className="pdf-sec-title">Operații de verificare</div>
        <table className="pdf-table">
          <thead><tr><th style={{ width: "60%" }}>Operație</th><th>Rezultat</th><th>Observații</th></tr></thead>
          <tbody>
            {VIU_CHECKLIST.map(item => {
              const cl = r.checklist || {};
              const obs = r.checklist_obs || {};
              return (
                <tr key={item.id}>
                  <td>{item.text}</td>
                  <td style={{ fontWeight: 600, color: cl[item.id] === "DA" ? "#2A7D4F" : cl[item.id] === "NU" ? "#C0392B" : "#888" }}>{cl[item.id] || "N/A"}</td>
                  <td>{obs[item.id] || ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="pdf-sec">
        <div className="pdf-sec-title">Concluzie</div>
        <div className="pdf-conclusion" style={{ background: r.conclusion === "ADMIS" ? "#E8F5EE" : r.conclusion === "RESPINS" ? "#FDECEA" : "#F7F8FA", color: r.conclusion === "ADMIS" ? "#2A7D4F" : r.conclusion === "RESPINS" ? "#C0392B" : "#666" }}>
          {r.conclusion || "Necompletat"}
        </div>
        {r.defects && <p style={{ marginTop: 8, fontSize: 12 }}><strong>Defecte:</strong> {r.defects}</p>}
        {r.actions && <p style={{ marginTop: 4, fontSize: 12 }}><strong>Acțiuni corective:</strong> {r.actions}</p>}
      </div>
      <div className="pdf-sigs">
        <div className="pdf-sig-box">
          <div className="pdf-sig-lbl">Instalator autorizat ATIMO</div>
          {r.technician_sig && <img src={r.technician_sig} style={{ width: 140, height: 55, objectFit: "contain" }} alt="" />}
          <div className="pdf-sig-line">Semnătură și ștampilă</div>
        </div>
        <div className="pdf-sig-box">
          <div className="pdf-sig-lbl">Client: {client?.last_name} {client?.first_name}</div>
          {r.client_sig && <img src={r.client_sig} style={{ width: 140, height: 55, objectFit: "contain" }} alt="" />}
          <div className="pdf-sig-line">Semnătură</div>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

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
        <div className="alert alert-warn">
          <Ic n="warn" s={16} />
          <strong>{urgent.length} client(i)</strong> cu ViU/RiU expirat în mai puțin de 14 zile!
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card">
          <div className="card-header"><Ic n="cal" s={16} /><span className="card-title">Lucrări de azi</span></div>
          {todayJobs.length === 0
            ? <div className="empty">Nicio lucrare azi</div>
            : todayJobs.map(j => {
                const cl = clients.find(c => c.id === j.client_id);
                return (
                  <div key={j.id} style={{ padding: "11px 20px", borderBottom: `1px solid ${COLORS.gray100}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{cl?.last_name} {cl?.first_name}</div>
                      <div style={{ fontSize: 12, color: COLORS.gray400 }}>{j.service_type}</div>
                    </div>
                    <span className={`badge ${j.status === "Finalizat" ? "b-green" : j.status === "In progres" ? "b-orange" : "b-blue"}`}>{j.status}</span>
                  </div>
                );
              })
          }
        </div>
        <div className="card">
          <div className="card-header"><Ic n="bell" s={16} /><span className="card-title">Expirări ViU în 60 zile</span></div>
          {expiring.length === 0
            ? <div className="empty">Nicio expirare iminentă</div>
            : expiring.slice(0, 8).map(c => {
                const diff = Math.ceil((new Date(c.next_viu_date) - new Date()) / 86400000);
                return (
                  <div key={c.id} style={{ padding: "11px 20px", borderBottom: `1px solid ${COLORS.gray100}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{c.last_name} {c.first_name}</div>
                      <div style={{ fontSize: 12, color: COLORS.gray400 }}>{c.city}</div>
                    </div>
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

// ─── CLIENTS ──────────────────────────────────────────────────────────────────

function Clients({ clients, setClients, jobs, userRole }) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | "new" | client object
  const [loading, setLoading] = useState(false);

  const filtered = clients.filter(c =>
    `${c.first_name} ${c.last_name} ${c.phone} ${c.email} ${c.city}`.toLowerCase().includes(search.toLowerCase())
  );

  const save = async (form) => {
    setLoading(true);
    if (form.id) {
      const { data } = await supabase.from("clients").update(form).eq("id", form.id).select().single();
      if (data) setClients(p => p.map(c => c.id === data.id ? data : c));
    } else {
      const { data } = await supabase.from("clients").insert(form).select().single();
      if (data) setClients(p => [...p, data]);
    }
    setLoading(false);
    setModal(null);
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
              {filtered.length === 0
                ? <tr><td colSpan={6}><div className="empty">Niciun client găsit</div></td></tr>
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
  const blank = { first_name: "", last_name: "", phone: "", email: "", cnp: "", id_series: "", id_number: "", address: "", city: "", county: "", subscriber_code: "", consumption_code: "", next_viu_date: "" };
  const [f, setF] = useState(client ? { ...client } : blank);
  const s = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <div className="modal-bg">
      <div className="modal modal-lg">
        <div className="modal-hdr"><Ic n="users" /><div className="modal-title">{client ? "Editare client" : "Client nou"}</div><button className="btn-icon" onClick={onClose}><Ic n="x" /></button></div>
        <div className="modal-body">
          <div className="fsec"><div className="fsec-title">Date personale</div>
            <div className="fgrid">
              <div className="fgroup"><label>Prenume *</label><input value={f.first_name} onChange={e => s("first_name", e.target.value)} /></div>
              <div className="fgroup"><label>Nume *</label><input value={f.last_name} onChange={e => s("last_name", e.target.value)} /></div>
              <div className="fgroup"><label>Telefon *</label><input type="tel" value={f.phone} onChange={e => s("phone", e.target.value)} /></div>
              <div className="fgroup"><label>Email</label><input type="email" value={f.email} onChange={e => s("email", e.target.value)} /></div>
              <div className="fgroup"><label>CNP</label><input value={f.cnp} onChange={e => s("cnp", e.target.value)} maxLength={13} /></div>
              <div className="fgroup"><label>CI serie</label><input value={f.id_series} onChange={e => s("id_series", e.target.value.toUpperCase())} maxLength={2} /></div>
              <div className="fgroup"><label>CI număr</label><input value={f.id_number} onChange={e => s("id_number", e.target.value)} maxLength={6} /></div>
            </div>
          </div>
          <div className="fsec"><div className="fsec-title">Adresă</div>
            <div className="fgrid">
              <div className="fgroup spanfull"><label>Adresă completă *</label><input value={f.address} onChange={e => s("address", e.target.value)} /></div>
              <div className="fgroup"><label>Localitate *</label><input value={f.city} onChange={e => s("city", e.target.value)} /></div>
              <div className="fgroup"><label>Județ</label>
                <select value={f.county} onChange={e => s("county", e.target.value)}>
                  <option value="">-- Selectați --</option>
                  {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="fsec"><div className="fsec-title">Date instalație gaze</div>
            <div className="fgrid">
              <div className="fgroup"><label>Cod abonat</label><input value={f.subscriber_code} onChange={e => s("subscriber_code", e.target.value)} /></div>
              <div className="fgroup"><label>Cod loc consum</label><input value={f.consumption_code} onChange={e => s("consumption_code", e.target.value)} /></div>
              <div className="fgroup"><label>Dată scadentă ViU</label><input type="date" value={f.next_viu_date} onChange={e => s("next_viu_date", e.target.value)} /></div>
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Anulare</button>
          <button className="btn btn-primary" disabled={loading} onClick={() => { if (!f.first_name || !f.last_name || !f.phone) return alert("Completați câmpurile obligatorii!"); onSave(f); }}>
            {loading ? <span className="spinner" /> : <><Ic n="check" s={14} /> Salvare</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── JOBS ─────────────────────────────────────────────────────────────────────

function Jobs({ clients, jobs, setJobs, reports, setReports, userRole }) {
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("toate");
  const [modal, setModal] = useState(null);
  const [viuModal, setViuModal] = useState(null);
  const [detailJob, setDetailJob] = useState(null);
  const [loading, setLoading] = useState(false);

  const filtered = jobs.filter(j => {
    const cl = clients.find(c => c.id === j.client_id);
    const name = cl ? `${cl.first_name} ${cl.last_name}` : "";
    return `${name} ${j.service_type}`.toLowerCase().includes(search.toLowerCase())
      && (statusF === "toate" || j.status === statusF);
  });

  const save = async (form) => {
    setLoading(true);
    if (form.id) {
      const { data } = await supabase.from("jobs").update(form).eq("id", form.id).select().single();
      if (data) setJobs(p => p.map(j => j.id === data.id ? data : j));
    } else {
      const { data } = await supabase.from("jobs").insert({ ...form, status: "Programat" }).select().single();
      if (data) setJobs(p => [...p, data]);
    }
    setLoading(false); setModal(null);
  };

  const updateStatus = async (id, status) => {
    await supabase.from("jobs").update({ status }).eq("id", id);
    setJobs(p => p.map(j => j.id === id ? { ...j, status } : j));
  };

  return (
    <div>
      <div className="filter-bar">
        <div className="search-box"><Ic n="search" s={15} /><input placeholder="Caută client sau tip serviciu..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <select value={statusF} onChange={e => setStatusF(e.target.value)} style={{ padding: "8px 12px", border: `1px solid ${COLORS.gray200}`, borderRadius: 8, background: "#fff" }}>
          <option value="toate">Toate statusurile</option>
          <option>Programat</option><option>In progres</option><option>Finalizat</option><option>Anulat</option>
        </select>
        <button className="btn btn-primary" onClick={() => setModal("new")}><Ic n="plus" s={15} /> Lucrare nouă</button>
      </div>
      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Client</th><th>Tip serviciu</th><th>Data</th><th>Tehnician</th><th>Status</th><th>Preț</th><th>Acțiuni</th></tr></thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={7}><div className="empty">Nicio lucrare găsită</div></td></tr>
                : filtered.map(j => {
                    const cl = clients.find(c => c.id === j.client_id);
                    return (
                      <tr key={j.id}>
                        <td><div style={{ fontWeight: 500 }}>{cl?.last_name} {cl?.first_name}</div><div style={{ fontSize: 12, color: COLORS.gray400 }}>{cl?.city}</div></td>
                        <td style={{ fontSize: 13 }}>{j.service_type}</td>
                        <td>{formatDate(j.date)}</td>
                        <td>{j.technician || "-"}</td>
                        <td>
                          <select value={j.status} onChange={e => updateStatus(j.id, e.target.value)} style={{ padding: "4px 8px", border: `1px solid ${COLORS.gray200}`, borderRadius: 6, fontSize: 12 }}>
                            <option>Programat</option><option>In progres</option><option>Finalizat</option><option>Anulat</option>
                          </select>
                        </td>
                        <td>{j.price ? `${j.price} RON` : "-"}</td>
                        <td>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button className="btn-icon" title="Raport ViU/RiU" onClick={() => setViuModal(j)} style={{ color: COLORS.primary }}><Ic n="filetxt" s={14} /></button>
                            <button className="btn-icon" onClick={() => setModal(j)}><Ic n="edit" s={14} /></button>
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
      {modal && <JobModal job={modal === "new" ? null : modal} clients={clients} loading={loading} onSave={save} onClose={() => setModal(null)} />}
     {viuModal && <ViuModal job={viuModal} clients={clients} onSave={async (r) => {
        const { data } = await supabase.from("reports").insert(r).select().single();
        if (data) {
          setReports(p => [...p, data]);
          const jobReports = await supabase.from("reports").select("*").order("date", { ascending: false });
          if (jobReports.data) setReports(jobReports.data);
        }
        setViuModal(null);
      }} onClose={() => setViuModal(null)} />}
    </div>
  );
}

function JobModal({ job, clients, loading, onSave, onClose }) {
  const blank = { client_id: "", service_type: "", date: today(), technician: "", price: "", observations: "" };
  const [f, setF] = useState(job ? { ...job } : blank);
  const s = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <div className="modal-bg">
      <div className="modal">
        <div className="modal-hdr"><Ic n="briefcase" /><div className="modal-title">{job ? "Editare lucrare" : "Lucrare nouă"}</div><button className="btn-icon" onClick={onClose}><Ic n="x" /></button></div>
        <div className="modal-body">
          <div className="fgrid">
            <div className="fgroup spanfull"><label>Client *</label>
              <select value={f.client_id} onChange={e => s("client_id", e.target.value)}>
                <option value="">-- Selectați clientul --</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.last_name} {c.first_name} – {c.city}</option>)}
              </select>
            </div>
            <div className="fgroup spanfull"><label>Tip serviciu *</label>
              <select value={f.service_type} onChange={e => s("service_type", e.target.value)}>
                <option value="">-- Selectați --</option>
                {SERVICE_TYPES.map(st => <option key={st}>{st}</option>)}
              </select>
            </div>
            <div className="fgroup"><label>Data *</label><input type="date" value={f.date} onChange={e => s("date", e.target.value)} /></div>
            <div className="fgroup"><label>Tehnician</label><input value={f.technician} onChange={e => s("technician", e.target.value)} /></div>
            <div className="fgroup"><label>Preț (RON)</label><input type="number" value={f.price} onChange={e => s("price", e.target.value)} /></div>
            <div className="fgroup spanfull"><label>Observații</label><textarea value={f.observations} onChange={e => s("observations", e.target.value)} /></div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Anulare</button>
          <button className="btn btn-primary" disabled={loading} onClick={() => { if (!f.client_id || !f.service_type || !f.date) return alert("Completați câmpurile obligatorii!"); onSave(f); }}>
            {loading ? <span className="spinner" /> : <><Ic n="check" s={14} /> Salvare</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── VIU/RIU FORM ─────────────────────────────────────────────────────────────

function ViuModal({ job, clients, onSave, onClose }) {
  const client = clients.find(c => c.id === job.client_id);
  const isRiu = job.service_type?.includes("RiU");
  const [tab, setTab] = useState("date");
  const [preview, setPreview] = useState(false);
  const [f, setF] = useState({
    type: isRiu ? "RiU" : "ViU",
    number: `${isRiu ? "RiU" : "ViU"}-${Date.now().toString().slice(-6)}`,
    job_id: job.id, client_id: job.client_id,
    date: today(), consumption_address: client?.address || "",
    contract_number: "", last_verification_date: "",
    due_date: addDays(today(), 365),
    inspection_type: "Periodică", installation_type: "Individuală",
    checklist: {}, checklist_obs: {},
    defects: "", actions: "", conclusion: "ADMIS", technical_conditions: "Corespunzătoare",
    client_sig: null, technician_sig: null,
    meter_protocol_number: "", meter_protocol_date: "",
    revision_reason: "", pressure_resistance: "", pressure_tightness: "",
    pressure_regime: "", installation_material: "OL", installation_location: "Suprateran", test_result: "Admis",
  });
  const s = (k, v) => setF(p => ({ ...p, [k]: v }));

  if (preview) return (
    <div className="modal-bg">
      <div className="modal modal-lg" style={{ maxWidth: 860 }}>
        <div className="modal-hdr">
          <Ic n="filetxt" /><div className="modal-title">Previzualizare {f.type} — {f.number}</div>
          <button className="btn btn-sm btn-ghost" style={{ marginRight: 4 }} onClick={() => window.print()}><Ic n="print" s={14} /> Tipărire</button>
          <button className="btn-icon" onClick={() => setPreview(false)}><Ic n="x" /></button>
        </div>
        <div className="modal-body" style={{ padding: 0 }}><ViuPDF r={f} client={client} /></div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={() => setPreview(false)}>Înapoi</button>
          <button className="btn btn-primary" onClick={() => onSave(f)}><Ic n="check" s={14} /> Salvare document</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-bg">
      <div className="modal modal-lg" style={{ maxWidth: 860 }}>
        <div className="modal-hdr"><Ic n="filetxt" /><div className="modal-title">Formular {f.type} — {client?.last_name} {client?.first_name}</div><button className="btn-icon" onClick={onClose}><Ic n="x" /></button></div>
        <div className="modal-body">
          <div className="tabs">
            {["date", "verificare", "concluzie", "semnaturi"].map(t => (
              <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                {t === "date" ? "Date instalație" : t === "verificare" ? "Operații" : t === "concluzie" ? "Concluzie" : "Semnături"}
              </button>
            ))}
          </div>

          {tab === "date" && <div className="fgrid">
            <div className="fgroup"><label>Tip raport</label><select value={f.type} onChange={e => s("type", e.target.value)}><option>ViU</option><option>RiU</option></select></div>
            <div className="fgroup"><label>Număr raport</label><input value={f.number} onChange={e => s("number", e.target.value)} /></div>
            <div className="fgroup"><label>Data</label><input type="date" value={f.date} onChange={e => s("date", e.target.value)} /></div>
            <div className="fgroup spanfull"><label>Adresă consum</label><input value={f.consumption_address} onChange={e => s("consumption_address", e.target.value)} /></div>
            <div className="fgroup"><label>Nr. contract</label><input value={f.contract_number} onChange={e => s("contract_number", e.target.value)} /></div>
            <div className="fgroup"><label>Ultima verificare</label><input type="date" value={f.last_verification_date} onChange={e => s("last_verification_date", e.target.value)} /></div>
            <div className="fgroup"><label>Dată scadentă</label><input type="date" value={f.due_date} onChange={e => s("due_date", e.target.value)} /></div>
            <div className="fgroup"><label>Tip inspecție</label><select value={f.inspection_type} onChange={e => s("inspection_type", e.target.value)}><option>Periodică</option><option>Aleatorie</option><option>La sesizare</option></select></div>
            <div className="fgroup"><label>Tip instalație</label><select value={f.installation_type} onChange={e => s("installation_type", e.target.value)}><option>Individuală</option><option>Comună</option></select></div>
            {f.type === "RiU" && <>
              <div className="fgroup"><label>Protocol contor nr.</label><input value={f.meter_protocol_number} onChange={e => s("meter_protocol_number", e.target.value)} /></div>
              <div className="fgroup"><label>Data protocol contor</label><input type="date" value={f.meter_protocol_date} onChange={e => s("meter_protocol_date", e.target.value)} /></div>
              <div className="fgroup spanfull"><label>Motiv revizie</label><input value={f.revision_reason} onChange={e => s("revision_reason", e.target.value)} /></div>
              <div className="fgroup"><label>Material instalație</label><select value={f.installation_material} onChange={e => s("installation_material", e.target.value)}><option>OL</option><option>PE100</option><option>PE80</option></select></div>
              <div className="fgroup"><label>Amplasament</label><select value={f.installation_location} onChange={e => s("installation_location", e.target.value)}><option>Suprateran</option><option>Subteran</option></select></div>
              <div className="fgroup"><label>Presiune rezistență (bar)</label><input type="number" step="0.1" value={f.pressure_resistance} onChange={e => s("pressure_resistance", e.target.value)} /></div>
              <div className="fgroup"><label>Presiune etanșeitate (bar)</label><input type="number" step="0.1" value={f.pressure_tightness} onChange={e => s("pressure_tightness", e.target.value)} /></div>
              <div className="fgroup"><label>Rezultat test</label><select value={f.test_result} onChange={e => s("test_result", e.target.value)}><option>Admis</option><option>Respins</option></select></div>
            </>}
          </div>}

          {tab === "verificare" && <div>
            <p style={{ fontSize: 13, color: COLORS.gray400, marginBottom: 14 }}>Selectați rezultatul fiecărei operații:</p>
            {VIU_CHECKLIST.map(item => (
              <div key={item.id} className="checklist-row">
                <div className="checklist-text">{item.text}</div>
                <div className="check-opts">
                  {["DA", "NU", "N/A"].map(opt => (
                    <label key={opt} className="check-opt">
                      <input type="radio" name={item.id} value={opt} checked={f.checklist[item.id] === opt} onChange={() => setF(p => ({ ...p, checklist: { ...p.checklist, [item.id]: opt } }))} />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
                <input style={{ width: 160 }} placeholder="Observații" value={f.checklist_obs[item.id] || ""} onChange={e => setF(p => ({ ...p, checklist_obs: { ...p.checklist_obs, [item.id]: e.target.value } }))} />
              </div>
            ))}
          </div>}

          {tab === "concluzie" && <div className="fgrid">
            <div className="fgroup spanfull"><label>Concluzie finală</label><select value={f.conclusion} onChange={e => s("conclusion", e.target.value)}><option>ADMIS</option><option>RESPINS</option><option>Condiționat</option></select></div>
            <div className="fgroup spanfull"><label>Defecte constatate</label><textarea value={f.defects} onChange={e => s("defects", e.target.value)} /></div>
            <div className="fgroup spanfull"><label>Acțiuni corective</label><textarea value={f.actions} onChange={e => s("actions", e.target.value)} /></div>
            <div className="fgroup spanfull"><label>Condiții tehnice exploatare</label><select value={f.technical_conditions} onChange={e => s("technical_conditions", e.target.value)}><option>Corespunzătoare</option><option>Necorespunzătoare</option><option>Parțial corespunzătoare</option></select></div>
          </div>}

          {tab === "semnaturi" && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <SigPad label="Semnătură client" value={f.client_sig} onChange={v => s("client_sig", v)} />
            <SigPad label="Semnătură tehnician" value={f.technician_sig} onChange={v => s("technician_sig", v)} />
          </div>}
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Anulare</button>
          <button className="btn btn-ghost" onClick={() => setPreview(true)}><Ic n="eye" s={14} /> Previzualizare</button>
          <button className="btn btn-primary" onClick={() => onSave(f)}><Ic n="check" s={14} /> Salvare raport</button>
        </div>
      </div>
    </div>
  );
}

// ─── CONTRACTS ────────────────────────────────────────────────────────────────

const CONTRACT_SERVICES = [
  "Verificare instalație utilizare gaze (ViU)",
  "Revizie instalație utilizare gaze (RiU)",
  "Verificare tehnică periodică (VTP)",
  "Punere în funcțiune (PIF)",
  "Montaj detector gaze",
  "Montaj termostat",
  "Montaj filtru magnetic",
  "Servicii gaz suplimentare",
];

function Contracts({ clients, contracts, setContracts }) {
  const [modal, setModal] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const save = async (form) => {
    setLoading(true);
    const { data } = await supabase.from("contracts").insert(form).select().single();
    if (data) setContracts(p => [...p, data]);
    setLoading(false); setModal(false);
  };

  return (
    <div>
      <div className="filter-bar">
        <button className="btn btn-primary" onClick={() => setModal(true)}><Ic n="plus" s={15} /> Contract nou</button>
      </div>
      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Nr. contract</th><th>Client</th><th>Data</th><th>Valoare</th><th>Acțiuni</th></tr></thead>
            <tbody>
              {contracts.length === 0
                ? <tr><td colSpan={5}><div className="empty">Niciun contract. Creați primul contract.</div></td></tr>
                : contracts.map(c => {
                    const cl = clients.find(cl => cl.id === c.client_id);
                    return (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 600, color: COLORS.primary }}>{c.number}</td>
                        <td>{cl?.last_name} {cl?.first_name}</td>
                        <td>{formatDate(c.date)}</td>
                        <td style={{ fontWeight: 600 }}>{c.total_price} RON</td>
                        <td><button className="btn btn-sm btn-ghost" onClick={() => setPreview({ c, client: cl })}><Ic n="eye" s={13} /> PDF</button></td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>
      </div>
      {modal && <ContractModal clients={clients} loading={loading} onSave={save} onClose={() => setModal(false)} />}
      {preview && (
        <div className="modal-bg">
          <div className="modal modal-lg" style={{ maxWidth: 860 }}>
            <div className="modal-hdr"><Ic n="doc" /><div className="modal-title">Contract {preview.c.number}</div>
              <button className="btn btn-sm btn-ghost" style={{ marginRight: 4 }} onClick={() => window.print()}><Ic n="print" s={14} /> Tipărire</button>
              <button className="btn-icon" onClick={() => setPreview(null)}><Ic n="x" /></button>
            </div>
            <div className="modal-body" style={{ padding: 0 }}><ContractPDF c={preview.c} client={preview.client} /></div>
            <div className="modal-foot"><button className="btn btn-ghost" onClick={() => setPreview(null)}>Închide</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function ContractModal({ clients, loading, onSave, onClose }) {
  const [tab, setTab] = useState("date");
  const [f, setF] = useState({
    client_id: "", number: `C-${Date.now().toString().slice(-6)}`, date: today(),
    total_price: "", payment_method: "Numerar", duration: "12 luni",
    services: CONTRACT_SERVICES.map(l => ({ label: l, checked: false, price: "" })),
    client_sig: null, technician_sig: null,
  });
  const s = (k, v) => setF(p => ({ ...p, [k]: v }));
  const toggleSvc = (i) => setF(p => ({ ...p, services: p.services.map((sv, idx) => idx === i ? { ...sv, checked: !sv.checked } : sv) }));
  const setSvcPrice = (i, v) => setF(p => ({ ...p, services: p.services.map((sv, idx) => idx === i ? { ...sv, price: v } : sv) }));

  return (
    <div className="modal-bg">
      <div className="modal modal-lg">
        <div className="modal-hdr"><Ic n="doc" /><div className="modal-title">Contract nou de prestări servicii</div><button className="btn-icon" onClick={onClose}><Ic n="x" /></button></div>
        <div className="modal-body">
          <div className="tabs">
            {["date", "servicii", "semnaturi"].map(t => (
              <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                {t === "date" ? "Date contract" : t === "servicii" ? "Servicii" : "Semnături"}
              </button>
            ))}
          </div>
          {tab === "date" && <div className="fgrid">
            <div className="fgroup spanfull"><label>Client *</label><select value={f.client_id} onChange={e => s("client_id", e.target.value)}><option value="">-- Selectați clientul --</option>{clients.map(c => <option key={c.id} value={c.id}>{c.last_name} {c.first_name}</option>)}</select></div>
            <div className="fgroup"><label>Nr. contract</label><input value={f.number} onChange={e => s("number", e.target.value)} /></div>
            <div className="fgroup"><label>Data</label><input type="date" value={f.date} onChange={e => s("date", e.target.value)} /></div>
            <div className="fgroup"><label>Valoare totală (RON) *</label><input type="number" value={f.total_price} onChange={e => s("total_price", e.target.value)} /></div>
            <div className="fgroup"><label>Modalitate plată</label><select value={f.payment_method} onChange={e => s("payment_method", e.target.value)}><option>Numerar</option><option>Transfer bancar</option><option>Card</option></select></div>
            <div className="fgroup"><label>Durată contract</label><input value={f.duration} onChange={e => s("duration", e.target.value)} /></div>
          </div>}
          {tab === "servicii" && <div>
            <p style={{ fontSize: 13, color: COLORS.gray400, marginBottom: 14 }}>Bifați serviciile incluse și introduceți prețul individual:</p>
            {f.services.map((sv, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: `1px solid ${COLORS.gray100}` }}>
                <input type="checkbox" checked={sv.checked} onChange={() => toggleSvc(i)} style={{ width: "auto" }} />
                <span style={{ flex: 1, fontSize: 14 }}>{sv.label}</span>
                {sv.checked && <input type="number" placeholder="Preț RON" value={sv.price} onChange={e => setSvcPrice(i, e.target.value)} style={{ width: 120 }} />}
              </div>
            ))}
          </div>}
          {tab === "semnaturi" && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <SigPad label="Semnătură beneficiar" value={f.client_sig} onChange={v => s("client_sig", v)} />
            <SigPad label="Semnătură prestator (ATIMO)" value={f.technician_sig} onChange={v => s("technician_sig", v)} />
          </div>}
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Anulare</button>
          <button className="btn btn-primary" disabled={loading} onClick={() => { if (!f.client_id || !f.total_price) return alert("Selectați clientul și introduceți valoarea!"); onSave(f); }}>
            {loading ? <span className="spinner" /> : <><Ic n="check" s={14} /> Salvare contract</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── REPORTS ──────────────────────────────────────────────────────────────────

function Reports({ reports, clients }) {
  const [view, setView] = useState(null);
  return (
    <div>
      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Tip / Nr.</th><th>Client</th><th>Data</th><th>Concluzie</th><th>Scadent</th><th>Acțiuni</th></tr></thead>
            <tbody>
              {reports.length === 0
                ? <tr><td colSpan={6}><div className="empty">Niciun raport ViU/RiU. Adăugați din modulul Lucrări.</div></td></tr>
                : reports.map(r => {
                    const cl = clients.find(c => c.id === r.client_id);
                    return (
                      <tr key={r.id}>
                        <td><span className={`badge ${r.type === "ViU" ? "b-blue" : "b-orange"}`}>{r.type}</span><span style={{ marginLeft: 8, fontFamily: "monospace", fontSize: 12 }}>{r.number}</span></td>
                        <td>{cl?.last_name} {cl?.first_name}</td>
                        <td>{formatDate(r.date)}</td>
                        <td><span className={`badge ${r.conclusion === "ADMIS" ? "b-green" : r.conclusion === "RESPINS" ? "b-red" : "b-gray"}`}>{r.conclusion || "N/A"}</span></td>
                        <td style={{ fontWeight: 500, color: COLORS.accent }}>{formatDate(r.due_date)}</td>
                        <td><button className="btn btn-sm btn-ghost" onClick={() => setView(r)}><Ic n="eye" s={13} /> Vizualizare</button></td>
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
          <div className="modal modal-lg" style={{ maxWidth: 860 }}>
            <div className="modal-hdr"><Ic n="filetxt" /><div className="modal-title">Raport {view.type} — {view.number}</div>
              <button className="btn btn-sm btn-ghost" style={{ marginRight: 4 }} onClick={() => window.print()}><Ic n="print" s={14} /> Tipărire</button>
              <button className="btn-icon" onClick={() => setView(null)}><Ic n="x" /></button>
            </div>
            <div className="modal-body" style={{ padding: 0 }}><ViuPDF r={view} client={clients.find(c => c.id === view.client_id)} /></div>
            <div className="modal-foot"><button className="btn btn-ghost" onClick={() => setView(null)}>Închide</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true); setErr("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pw });
    if (error) { setErr("Email sau parolă incorectă."); setLoading(false); return; }
    onLogin(data.user);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div style={{ width: 44, height: 44, background: COLORS.primary, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </div>
        <div className="login-logo-name">ATIMO PROJECT SRL</div>
        <div className="login-logo-sub">Sistem de management tehnic gaze naturale</div>
        <div className="login-title">Autentificare</div>
        <div className="login-sub">Introduceți datele contului dvs.</div>
        {err && <div className="login-err">{err}</div>}
        <form onSubmit={handle}>
          <div className="fgroup" style={{ marginBottom: 12 }}><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
          <div className="fgroup" style={{ marginBottom: 20 }}><label>Parolă</label><input type="password" value={pw} onChange={e => setPw(e.target.value)} required /></div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: 11 }} disabled={loading}>
            {loading ? <span className="spinner" /> : "Autentificare"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState(null);
  const [userMeta, setUserMeta] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [clients, setClients] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [reports, setReports] = useState([]);

  // Check existing session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); }
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load data when user logs in
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [c, j, co, r] = await Promise.all([
        supabase.from("clients").select("*").order("created_at", { ascending: false }),
        supabase.from("jobs").select("*").order("date", { ascending: false }),
        supabase.from("contracts").select("*").order("created_at", { ascending: false }),
        supabase.from("reports").select("*").order("date", { ascending: false }),
      ]);
      if (c.data) setClients(c.data);
      if (j.data) setJobs(j.data);
      if (co.data) setContracts(co.data);
      if (r.data) setReports(r.data);

      // Get user role from profiles table
      const { data: profile } = await supabase.from("profiles").select("role, name").eq("id", user.id).single();
      if (profile) setUserMeta(profile);
    };
    load();
  }, [user]);

  const logout = async () => { await supabase.auth.signOut(); setUser(null); setClients([]); setJobs([]); setContracts([]); setReports([]); };

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "clients", label: "Clienți", icon: "users" },
    { id: "jobs", label: "Lucrări", icon: "briefcase" },
    { id: "contracts", label: "Contracte", icon: "doc" },
    { id: "reports", label: "Rapoarte ViU/RiU", icon: "filetxt" },
  ];

  const titles = { dashboard: "Dashboard", clients: "Clienți", jobs: "Lucrări", contracts: "Contracte", reports: "Rapoarte ViU / RiU" };

  const expiring = clients.filter(c => { if (!c.next_viu_date) return false; const d = (new Date(c.next_viu_date) - new Date()) / 86400000; return d >= 0 && d <= 60; }).length;

  if (loading) return (
    <>
      <style>{styles}</style>
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
      </div>
    </>
  );

  if (!user) return (
    <>
      <style>{styles}</style>
      <Login onLogin={setUser} />
    </>
  );

  const role = userMeta?.role || "office";

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* Sidebar overlay for mobile */}
        {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 499 }} />}

        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-logo">
            <div className="logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div className="logo-name">ATIMO PROJECT</div>
            <div className="logo-sub">Servicii tehnice gaze</div>
          </div>
          <div className="nav">
            <div className="nav-label">Meniu principal</div>
            {nav.map(item => (
              <button key={item.id} className={`nav-btn ${page === item.id ? "active" : ""}`}
                onClick={() => { setPage(item.id); setSidebarOpen(false); }}>
                <Ic n={item.icon} s={17} />
                {item.label}
                {item.id === "reports" && expiring > 0 && <span className="nav-badge">{expiring}</span>}
              </button>
            ))}
          </div>
          <div className="sidebar-user">
            <div className="user-name">{userMeta?.name || user.email}</div>
            <div className="user-role">{role === "admin" ? "Administrator" : role === "office" ? "Birou" : "Tehnician"}</div>
            <button className="logout-btn" onClick={logout}><Ic n="logout" s={14} /> Deconectare</button>
          </div>
        </div>

        <div className="main">
          <div className="topbar">
            <button className="btn-icon" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ marginRight: 4 }} id="hamburger"><Ic n="menu" /></button>
            <div className="topbar-title">{titles[page]}</div>
            {expiring > 0 && (
              <button className="btn btn-sm" style={{ background: COLORS.warningLight, color: COLORS.warning, border: "none" }} onClick={() => setPage("reports")}>
                <Ic n="bell" s={14} /> {expiring} expirări
              </button>
            )}
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: COLORS.primaryLight, color: COLORS.primary, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
              {(userMeta?.name || user.email).slice(0, 2).toUpperCase()}
            </div>
          </div>

          <div className="page">
            {page === "dashboard" && <Dashboard clients={clients} jobs={jobs} reports={reports} />}
            {page === "clients" && <Clients clients={clients} setClients={setClients} jobs={jobs} userRole={role} />}
            {page === "jobs" && <Jobs clients={clients} jobs={jobs} setJobs={setJobs} reports={reports} setReports={setReports} userRole={role} />}
            {page === "contracts" && <Contracts clients={clients} contracts={contracts} setContracts={setContracts} />}
            {page === "reports" && <Reports reports={reports} clients={clients} />}
          </div>
        </div>
      </div>
    </>
  );
}
