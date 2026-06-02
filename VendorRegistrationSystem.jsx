import { useState, useEffect } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  bg: "#0A0E1A",
  surface: "#111827",
  surfaceElevated: "#1A2235",
  border: "#1E2D45",
  borderLight: "#243352",
  accent: "#0EA5E9",
  accentGlow: "rgba(14,165,233,0.15)",
  accentDim: "#0369A1",
  gold: "#F59E0B",
  goldGlow: "rgba(245,158,11,0.15)",
  green: "#10B981",
  greenGlow: "rgba(16,185,129,0.12)",
  red: "#EF4444",
  redGlow: "rgba(239,68,68,0.12)",
  amber: "#F59E0B",
  purple: "#8B5CF6",
  textPrimary: "#F1F5F9",
  textSecondary: "#94A3B8",
  textMuted: "#475569",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&family=Syne:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; color: ${C.textPrimary}; font-family: 'IBM Plex Sans Arabic', 'Syne', sans-serif; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }
  input, select, textarea { outline: none; font-family: inherit; }
  button { cursor: pointer; font-family: inherit; border: none; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
  @keyframes slideIn { from { transform: translateX(-12px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  .fade-in { animation: fadeIn 0.3s ease; }
  .slide-in { animation: slideIn 0.25s ease; }
`;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const ACTIVITIES = [
  { id: "ACT001", code: "ACT001", name_ar: "البترول والغاز", name_en: "Oil & Gas", description: "استيراد وتصدير المواد البترولية" },
  { id: "ACT002", code: "ACT002", name_ar: "المعدات الثقيلة", name_en: "Heavy Equipment", description: "توريد المعدات والآليات الثقيلة" },
  { id: "ACT003", code: "ACT003", name_ar: "الكيماويات", name_en: "Chemicals", description: "المواد الكيميائية الصناعية" },
  { id: "ACT004", code: "ACT004", name_ar: "قطع الغيار", name_en: "Spare Parts", description: "قطع غيار الآلات والمعدات" },
  { id: "ACT005", code: "ACT005", name_ar: "الخدمات اللوجستية", name_en: "Logistics", description: "الشحن والنقل والتخليص الجمركي" },
  { id: "ACT006", code: "ACT006", name_ar: "تقنية المعلومات", name_en: "IT Services", description: "البرمجيات والبنية التحتية" },
  { id: "ACT007", code: "ACT007", name_ar: "الإنشاءات", name_en: "Construction", description: "المقاولات والأعمال الإنشائية" },
];

const VENDORS = [
  { id: "V001", code: "V001", name_ar: "شركة الخليج للبترول", name_en: "Gulf Petroleum Co.", type: "Company", status: "Active", approval: "Approved", country: "Saudi Arabia", city: "Riyadh", phone: "+966-11-4567890", email: "info@gulfpetro.sa", website: "www.gulfpetro.sa", cr_number: "1010234567", tax_card: "TX-SA-2024-001", vat_number: "300234567800003", reg_date: "2022-03-15", activities: ["ACT001", "ACT004"], docs_expiry: "2025-12-31", notes: "مورد استراتيجي معتمد" },
  { id: "V002", code: "V002", name_ar: "مصنع الإمارات للمعدات", name_en: "Emirates Equipment Factory", type: "Factory", status: "Active", approval: "Approved", country: "UAE", city: "Dubai", phone: "+971-4-3456789", email: "sales@eef.ae", website: "www.eef.ae", cr_number: "AE-DXB-987654", tax_card: "TX-AE-2024-002", vat_number: "100987654300001", reg_date: "2021-07-20", activities: ["ACT002", "ACT004", "ACT007"], docs_expiry: "2026-06-30", notes: "" },
  { id: "V003", code: "V003", name_ar: "وكالة النيل للشحن", name_en: "Nile Shipping Agency", type: "Agent", status: "Suspended", approval: "Approved", country: "Egypt", city: "Alexandria", phone: "+20-3-4567891", email: "ops@nileshipping.eg", website: "www.nileshipping.eg", cr_number: "EG-ALX-112233", tax_card: "TX-EG-2024-003", vat_number: "200112233400002", reg_date: "2020-01-10", activities: ["ACT005"], docs_expiry: "2024-09-15", notes: "موقوف لانتهاء وثيقة التأمين" },
  { id: "V004", code: "V004", name_ar: "كيماويات الكويت المتحدة", name_en: "Kuwait United Chemicals", type: "Importer", status: "Active", approval: "Under Review", country: "Kuwait", city: "Kuwait City", phone: "+965-2-4567890", email: "procurement@kuc.kw", website: "www.kuc.kw", cr_number: "KW-2024-445566", tax_card: "TX-KW-2024-004", vat_number: "400445566500004", reg_date: "2024-02-28", activities: ["ACT003"], docs_expiry: "2026-02-28", notes: "طلب اعتماد جديد قيد المراجعة" },
  { id: "V005", code: "V005", name_ar: "تقنيات البحرين المتقدمة", name_en: "Bahrain Advanced Technologies", type: "Company", status: "Active", approval: "Approved", country: "Bahrain", city: "Manama", phone: "+973-1-7654321", email: "info@bat.bh", website: "www.bat.bh", cr_number: "BH-2023-778899", tax_card: "TX-BH-2023-005", vat_number: "500778899600005", reg_date: "2023-09-01", activities: ["ACT006", "ACT001"], docs_expiry: "2025-08-31", notes: "" },
  { id: "V006", code: "V006", name_ar: "مجموعة عُمان للإنشاء", name_en: "Oman Construction Group", type: "Company", status: "Blocked", approval: "Rejected", country: "Oman", city: "Muscat", phone: "+968-2-5678901", email: "info@ocg.om", website: "", cr_number: "OM-2022-334455", tax_card: "TX-OM-2022-006", vat_number: "600334455700006", reg_date: "2022-11-15", activities: ["ACT007"], docs_expiry: "2024-11-15", notes: "مرفوض – عدم استيفاء متطلبات الجودة" },
];

const DOCUMENTS = [
  { id: "D001", vendor_id: "V001", type: "Commercial Registration", name: "CR Certificate", expiry: "2025-12-31", status: "Valid", size: "1.2 MB" },
  { id: "D002", vendor_id: "V001", type: "Tax Card", name: "Tax Registration", expiry: "2025-06-30", status: "Expiring Soon", size: "0.8 MB" },
  { id: "D003", vendor_id: "V002", type: "Quality Certificate", name: "ISO 9001:2015", expiry: "2026-06-30", status: "Valid", size: "2.1 MB" },
  { id: "D004", vendor_id: "V003", type: "Insurance Policy", name: "Marine Insurance", expiry: "2024-09-15", status: "Expired", size: "3.4 MB" },
  { id: "D005", vendor_id: "V005", type: "VAT Certificate", name: "VAT Registration", expiry: "2025-08-31", status: "Expiring Soon", size: "0.6 MB" },
];

const USERS = [
  { id: 1, name: "Ahmed Al-Rashidi", role: "Admin", permissions: ["add", "edit", "delete", "approve", "print", "export"] },
  { id: 2, name: "Sara Al-Khalidi", role: "Purchasing", permissions: ["add", "edit", "print", "export"] },
  { id: 3, name: "Mohammed Farid", role: "Auditor", permissions: ["approve", "print", "export"] },
  { id: 4, name: "Layla Hassan", role: "Viewer", permissions: ["print"] },
];

const APPROVAL_LOG = [
  { id: 1, vendor_id: "V001", action: "Approved", user: "Ahmed Al-Rashidi", date: "2022-04-01", notes: "All documents verified" },
  { id: 2, vendor_id: "V003", action: "Suspended", user: "Mohammed Farid", date: "2024-09-16", notes: "Insurance expired" },
  { id: 3, vendor_id: "V004", action: "Under Review", user: "Sara Al-Khalidi", date: "2024-03-01", notes: "Awaiting financial clearance" },
  { id: 4, vendor_id: "V006", action: "Rejected", user: "Ahmed Al-Rashidi", date: "2023-01-10", notes: "Failed quality audit" },
];

// ─── ICONS (SVG inline) ───────────────────────────────────────────────────────
const Icon = ({ name, size = 16, color = "currentColor" }) => {
  const icons = {
    dashboard: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    vendors: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    activities: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    documents: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    approval: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    reports: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    database: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    export: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    filter: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    upload: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    warning: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    globe: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    chevronRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
    tag: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  };
  return icons[name] || null;
};

// ─── STATUS BADGES ────────────────────────────────────────────────────────────
const StatusBadge = ({ status, type = "vendor" }) => {
  const map = {
    Active: { color: C.green, bg: C.greenGlow, label: "نشط" },
    Suspended: { color: C.amber, bg: C.goldGlow, label: "موقوف" },
    Blocked: { color: C.red, bg: C.redGlow, label: "محظور" },
    Approved: { color: C.green, bg: C.greenGlow, label: "معتمد" },
    "Under Review": { color: C.accent, bg: C.accentGlow, label: "قيد المراجعة" },
    Rejected: { color: C.red, bg: C.redGlow, label: "مرفوض" },
    Valid: { color: C.green, bg: C.greenGlow, label: "سارٍ" },
    "Expiring Soon": { color: C.amber, bg: C.goldGlow, label: "ينتهي قريباً" },
    Expired: { color: C.red, bg: C.redGlow, label: "منتهي" },
  };
  const s = map[status] || { color: C.textMuted, bg: "transparent", label: status };
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}30`, padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: 0.3, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
};

// ─── METRIC CARD ─────────────────────────────────────────────────────────────
const MetricCard = ({ icon, label, value, sub, color = C.accent, trend }) => (
  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}, transparent)` }} />
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
      <div>
        <div style={{ color: C.textMuted, fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
        <div style={{ color: C.textPrimary, fontSize: 32, fontWeight: 800, lineHeight: 1, fontFamily: "JetBrains Mono, monospace" }}>{value}</div>
        {sub && <div style={{ color: C.textMuted, fontSize: 12, marginTop: 6 }}>{sub}</div>}
      </div>
      <div style={{ background: `${color}20`, borderRadius: 10, padding: 10, color }}>
        <Icon name={icon} size={20} color={color} />
      </div>
    </div>
    {trend && (
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}`, color: trend > 0 ? C.green : C.red, fontSize: 12, fontWeight: 600 }}>
        {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% مقارنة بالشهر الماضي
      </div>
    )}
  </div>
);

// ─── TABLE COMPONENT ──────────────────────────────────────────────────────────
const Table = ({ cols, rows, onRowClick }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr style={{ borderBottom: `1px solid ${C.border}` }}>
          {cols.map((col, i) => (
            <th key={i} style={{ padding: "10px 16px", textAlign: "right", color: C.textMuted, fontWeight: 600, fontSize: 11, letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap", background: C.surfaceElevated }}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} onClick={() => onRowClick && onRowClick(row)}
            style={{ borderBottom: `1px solid ${C.border}20`, cursor: onRowClick ? "pointer" : "default", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = C.surfaceElevated}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            {cols.map((col, ci) => (
              <td key={ci} style={{ padding: "12px 16px", color: C.textSecondary, whiteSpace: "nowrap" }}>
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    {rows.length === 0 && (
      <div style={{ textAlign: "center", padding: 40, color: C.textMuted }}>لا توجد بيانات مطابقة للبحث</div>
    )}
  </div>
);

// ─── MODAL ────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, width = 700 }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}
    onClick={e => e.target === e.currentTarget && onClose()}>
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, width: "100%", maxWidth: width, maxHeight: "90vh", overflow: "auto", animation: "fadeIn 0.2s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, background: C.surface, zIndex: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: C.textPrimary }}>{title}</div>
        <button onClick={onClose} style={{ background: C.surfaceElevated, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px", color: C.textSecondary }}>
          <Icon name="x" size={16} />
        </button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>
);

// ─── FORM FIELD ───────────────────────────────────────────────────────────────
const Field = ({ label, children, required }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", color: C.textSecondary, fontSize: 12, fontWeight: 600, marginBottom: 6, letterSpacing: 0.5 }}>
      {label} {required && <span style={{ color: C.red }}>*</span>}
    </label>
    {children}
  </div>
);
const Input = ({ ...props }) => (
  <input {...props} style={{ width: "100%", background: C.surfaceElevated, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", color: C.textPrimary, fontSize: 13, transition: "border-color 0.2s", ...props.style }}
    onFocus={e => e.target.style.borderColor = C.accent}
    onBlur={e => e.target.style.borderColor = C.border} />
);
const Select = ({ options, ...props }) => (
  <select {...props} style={{ width: "100%", background: C.surfaceElevated, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", color: C.textPrimary, fontSize: 13, ...props.style }}>
    {options.map((o, i) => <option key={i} value={o.value}>{o.label}</option>)}
  </select>
);

// ─── DATABASE SCHEMA VIEW ─────────────────────────────────────────────────────
const SchemaView = () => {
  const tables = [
    {
      name: "Vendors", color: C.accent,
      fields: [
        { name: "vendor_id", type: "INT PK IDENTITY", note: "Primary Key" },
        { name: "vendor_code", type: "VARCHAR(20)", note: "Unique | Auto-Generated" },
        { name: "name_ar", type: "NVARCHAR(200)", note: "NOT NULL" },
        { name: "name_en", type: "VARCHAR(200)", note: "NOT NULL" },
        { name: "vendor_type", type: "VARCHAR(50)", note: "Company/Factory/Agent/Individual/Importer" },
        { name: "status", type: "VARCHAR(20)", note: "Active/Suspended/Blocked" },
        { name: "approval_status", type: "VARCHAR(30)", note: "Pending/Under Review/Approved/Rejected" },
        { name: "country", type: "VARCHAR(100)", note: "" },
        { name: "city", type: "NVARCHAR(100)", note: "" },
        { name: "address", type: "NVARCHAR(500)", note: "" },
        { name: "phone_primary", type: "VARCHAR(30)", note: "" },
        { name: "phone_secondary", type: "VARCHAR(30)", note: "" },
        { name: "email", type: "VARCHAR(150)", note: "" },
        { name: "website", type: "VARCHAR(200)", note: "" },
        { name: "cr_number", type: "VARCHAR(50)", note: "Commercial Registration" },
        { name: "tax_card", type: "VARCHAR(50)", note: "" },
        { name: "vat_number", type: "VARCHAR(50)", note: "VAT Registration" },
        { name: "registration_date", type: "DATE", note: "" },
        { name: "notes", type: "NVARCHAR(MAX)", note: "" },
        { name: "created_by", type: "INT FK → Users", note: "" },
        { name: "created_at", type: "DATETIME", note: "DEFAULT GETDATE()" },
        { name: "updated_by", type: "INT FK → Users", note: "" },
        { name: "updated_at", type: "DATETIME", note: "" },
      ]
    },
    {
      name: "Activities", color: C.purple,
      fields: [
        { name: "activity_id", type: "INT PK IDENTITY", note: "" },
        { name: "activity_code", type: "VARCHAR(20)", note: "Unique" },
        { name: "name_ar", type: "NVARCHAR(200)", note: "NOT NULL" },
        { name: "name_en", type: "VARCHAR(200)", note: "NOT NULL" },
        { name: "description", type: "NVARCHAR(500)", note: "" },
        { name: "is_active", type: "BIT", note: "DEFAULT 1" },
      ]
    },
    {
      name: "Vendor_Activities", color: C.gold,
      fields: [
        { name: "id", type: "INT PK IDENTITY", note: "" },
        { name: "vendor_id", type: "INT FK → Vendors", note: "NOT NULL" },
        { name: "activity_id", type: "INT FK → Activities", note: "NOT NULL" },
        { name: "assigned_date", type: "DATE", note: "" },
        { name: "UNIQUE", type: "(vendor_id, activity_id)", note: "Composite Unique Key" },
      ]
    },
    {
      name: "Vendor_Documents", color: C.green,
      fields: [
        { name: "document_id", type: "INT PK IDENTITY", note: "" },
        { name: "vendor_id", type: "INT FK → Vendors", note: "NOT NULL" },
        { name: "doc_type", type: "VARCHAR(100)", note: "CR/TaxCard/VAT/Certificate/..." },
        { name: "doc_name", type: "NVARCHAR(200)", note: "" },
        { name: "file_path", type: "VARCHAR(500)", note: "Blob Storage / File System" },
        { name: "file_size", type: "VARCHAR(20)", note: "" },
        { name: "mime_type", type: "VARCHAR(100)", note: "" },
        { name: "issue_date", type: "DATE", note: "" },
        { name: "expiry_date", type: "DATE", note: "" },
        { name: "alert_days", type: "INT", note: "DEFAULT 30 (days before expiry)" },
        { name: "uploaded_by", type: "INT FK → Users", note: "" },
        { name: "uploaded_at", type: "DATETIME", note: "" },
      ]
    },
    {
      name: "Approval_Log", color: C.red,
      fields: [
        { name: "log_id", type: "INT PK IDENTITY", note: "" },
        { name: "vendor_id", type: "INT FK → Vendors", note: "" },
        { name: "action", type: "VARCHAR(50)", note: "Submitted/Approved/Rejected/Suspended" },
        { name: "from_status", type: "VARCHAR(30)", note: "" },
        { name: "to_status", type: "VARCHAR(30)", note: "" },
        { name: "notes", type: "NVARCHAR(MAX)", note: "" },
        { name: "action_by", type: "INT FK → Users", note: "" },
        { name: "action_date", type: "DATETIME", note: "DEFAULT GETDATE()" },
      ]
    },
    {
      name: "Users", color: C.purple,
      fields: [
        { name: "user_id", type: "INT PK IDENTITY", note: "" },
        { name: "username", type: "VARCHAR(100)", note: "Unique | NOT NULL" },
        { name: "full_name", type: "NVARCHAR(200)", note: "" },
        { name: "email", type: "VARCHAR(150)", note: "" },
        { name: "password_hash", type: "VARCHAR(256)", note: "BCrypt Hashed" },
        { name: "role", type: "VARCHAR(30)", note: "Admin/Purchasing/Auditor/Viewer" },
        { name: "is_active", type: "BIT", note: "DEFAULT 1" },
        { name: "last_login", type: "DATETIME", note: "" },
        { name: "created_at", type: "DATETIME", note: "" },
      ]
    },
    {
      name: "User_Permissions", color: C.amber,
      fields: [
        { name: "perm_id", type: "INT PK IDENTITY", note: "" },
        { name: "user_id", type: "INT FK → Users", note: "" },
        { name: "module", type: "VARCHAR(50)", note: "Vendors/Documents/Reports..." },
        { name: "can_add", type: "BIT", note: "DEFAULT 0" },
        { name: "can_edit", type: "BIT", note: "DEFAULT 0" },
        { name: "can_delete", type: "BIT", note: "DEFAULT 0" },
        { name: "can_approve", type: "BIT", note: "DEFAULT 0" },
        { name: "can_export", type: "BIT", note: "DEFAULT 0" },
        { name: "can_print", type: "BIT", note: "DEFAULT 0" },
      ]
    },
  ];

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {tables.map((table, ti) => (
          <div key={ti} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ background: `${table.color}18`, borderBottom: `1px solid ${table.color}40`, padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="database" size={14} color={table.color} />
              <span style={{ color: table.color, fontWeight: 700, fontSize: 13, fontFamily: "JetBrains Mono, monospace" }}>{table.name}</span>
            </div>
            <div style={{ padding: "8px 0" }}>
              {table.fields.map((f, fi) => (
                <div key={fi} style={{ display: "flex", justifyContent: "space-between", padding: "5px 16px", borderBottom: `1px solid ${C.border}10`, fontSize: 11 }}>
                  <span style={{ color: f.type.includes("PK") ? C.gold : f.type.includes("FK") ? C.accent : C.textPrimary, fontFamily: "JetBrains Mono, monospace", fontWeight: f.type.includes("PK") ? 700 : 400 }}>
                    {f.name}
                  </span>
                  <span style={{ color: C.textMuted, fontSize: 10 }}>{f.type}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* ERD Note */}
      <div style={{ marginTop: 20, background: C.surfaceElevated, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <div style={{ color: C.accent, fontWeight: 700, marginBottom: 12, fontSize: 13 }}>📐 ERD — العلاقات الجوهرية</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12, color: C.textSecondary }}>
          {[
            ["Vendors → Vendor_Activities", "One-to-Many", C.accent],
            ["Activities → Vendor_Activities", "One-to-Many", C.purple],
            ["Vendors → Vendor_Documents", "One-to-Many", C.green],
            ["Vendors → Approval_Log", "One-to-Many", C.red],
            ["Users → Vendors (created_by)", "One-to-Many", C.gold],
            ["Users → User_Permissions", "One-to-Many", C.amber],
          ].map(([rel, type, color], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: C.surface, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <div style={{ width: 3, height: 3, borderRadius: "50%", background: color, flexShrink: 0 }} />
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11 }}>{rel}</span>
              <span style={{ marginLeft: "auto", color, fontSize: 10, fontWeight: 600 }}>{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN APPLICATION ─────────────────────────────────────────────────────────
export default function VendorSystem() {
  const [page, setPage] = useState("dashboard");
  const [vendors, setVendors] = useState(VENDORS);
  const [activities] = useState(ACTIVITIES);
  const [searchQ, setSearchQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterActivity, setFilterActivity] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentUser] = useState(USERS[0]);
  const [lang, setLang] = useState("ar");
  const [notifications] = useState([
    { id: 1, type: "warning", msg: "وثيقة التأمين لـ 'وكالة النيل للشحن' منتهية", date: "منذ يومين" },
    { id: 2, type: "info", msg: "طلب اعتماد جديد من 'كيماويات الكويت' بانتظار المراجعة", date: "منذ 3 أيام" },
    { id: 3, type: "warning", msg: "البطاقة الضريبية لـ 'شركة الخليج' تنتهي خلال 60 يوماً", date: "منذ أسبوع" },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const filteredVendors = vendors.filter(v => {
    const q = searchQ.toLowerCase();
    const matchSearch = !q || v.name_ar.includes(searchQ) || v.name_en.toLowerCase().includes(q) || v.code.toLowerCase().includes(q) || v.cr_number.includes(q) || v.phone.includes(q);
    const matchStatus = filterStatus === "All" || v.status === filterStatus;
    const matchActivity = filterActivity === "All" || v.activities.includes(filterActivity);
    return matchSearch && matchStatus && matchActivity;
  });

  const stats = {
    total: vendors.length,
    active: vendors.filter(v => v.status === "Active").length,
    suspended: vendors.filter(v => v.status === "Suspended").length,
    underReview: vendors.filter(v => v.approval === "Under Review").length,
    expiredDocs: DOCUMENTS.filter(d => d.status === "Expired" || d.status === "Expiring Soon").length,
    totalActivities: activities.length,
  };

  const roleColor = { Admin: C.red, Purchasing: C.accent, Auditor: C.purple, Viewer: C.textMuted };

  const navItems = [
    { id: "dashboard", icon: "dashboard", label: "لوحة التحكم" },
    { id: "vendors", icon: "vendors", label: "الموردون" },
    { id: "activities", icon: "activities", label: "الأنشطة" },
    { id: "documents", icon: "documents", label: "المستندات" },
    { id: "approval", icon: "approval", label: "سجل الاعتماد" },
    { id: "search", icon: "search", label: "البحث المتقدم" },
    { id: "alerts", icon: "bell", label: "التنبيهات" },
    { id: "reports", icon: "reports", label: "التقارير" },
    { id: "users", icon: "users", label: "المستخدمون" },
    { id: "schema", icon: "database", label: "قاعدة البيانات" },
    { id: "sql", icon: "tag", label: "SQL Scripts" },
  ];

  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column" }}>
      <style>{css}</style>

      {/* TOP BAR */}
      <header style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentDim})`, borderRadius: 8, padding: "6px 10px", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="vendors" size={16} color="#fff" />
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>VRS</span>
          </div>
          <div>
            <div style={{ color: C.textPrimary, fontWeight: 700, fontSize: 14 }}>نظام إدارة سجل الموردين</div>
            <div style={{ color: C.textMuted, fontSize: 10, letterSpacing: 0.5 }}>VENDOR REGISTRATION SYSTEM · ENTERPRISE v2.0</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setLang(l => l === "ar" ? "en" : "ar")}
            style={{ background: C.surfaceElevated, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 14px", color: C.textSecondary, fontSize: 12, fontWeight: 600 }}>
            <Icon name="globe" size={13} /> {lang === "ar" ? "EN" : "عر"}
          </button>
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowNotifications(s => !s)}
              style={{ background: C.surfaceElevated, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px", color: C.textSecondary, display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="bell" size={16} />
              <span style={{ background: C.red, color: "#fff", borderRadius: 10, fontSize: 10, padding: "0 5px", fontWeight: 700 }}>{notifications.length}</span>
            </button>
            {showNotifications && (
              <div style={{ position: "absolute", top: 44, right: 0, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, width: 320, zIndex: 200, animation: "fadeIn 0.15s ease", overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 13, fontWeight: 700, color: C.textPrimary }}>التنبيهات والإشعارات</div>
                {notifications.map(n => (
                  <div key={n.id} style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}10`, display: "flex", gap: 10 }}>
                    <Icon name="warning" size={14} color={n.type === "warning" ? C.amber : C.accent} />
                    <div>
                      <div style={{ color: C.textSecondary, fontSize: 12 }}>{n.msg}</div>
                      <div style={{ color: C.textMuted, fontSize: 11, marginTop: 2 }}>{n.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${roleColor[currentUser.role]}25`, border: `2px solid ${roleColor[currentUser.role]}`, display: "flex", alignItems: "center", justifyContent: "center", color: roleColor[currentUser.role], fontWeight: 800, fontSize: 13 }}>
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div style={{ color: C.textPrimary, fontSize: 12, fontWeight: 600 }}>{currentUser.name}</div>
              <div style={{ color: roleColor[currentUser.role], fontSize: 10, fontWeight: 700 }}>{currentUser.role}</div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        {/* SIDEBAR */}
        <nav style={{ width: 220, background: C.surface, borderLeft: `1px solid ${C.border}`, padding: "16px 0", position: "sticky", top: 60, height: "calc(100vh - 60px)", overflowY: "auto", flexShrink: 0 }}>
          {navItems.map(item => {
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => setPage(item.id)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 20px", background: active ? `${C.accent}15` : "transparent", border: "none", borderRight: active ? `3px solid ${C.accent}` : "3px solid transparent", color: active ? C.accent : C.textMuted, fontSize: 13, fontWeight: active ? 700 : 400, transition: "all 0.15s", cursor: "pointer", textAlign: "right" }}>
                <Icon name={item.icon} size={16} color={active ? C.accent : C.textMuted} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, padding: 24, overflow: "auto" }}>

          {/* ── DASHBOARD ── */}
          {page === "dashboard" && (
            <div className="fade-in">
              <div style={{ marginBottom: 24 }}>
                <div style={{ color: C.textMuted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>OVERVIEW</div>
                <h1 style={{ color: C.textPrimary, fontSize: 22, fontWeight: 800 }}>لوحة التحكم الرئيسية</h1>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
                <MetricCard icon="vendors" label="إجمالي الموردين" value={stats.total} sub="في قاعدة البيانات" color={C.accent} trend={12} />
                <MetricCard icon="check" label="موردون نشطون" value={stats.active} sub="معتمدون وفعّالون" color={C.green} trend={5} />
                <MetricCard icon="warning" label="موقوف / محظور" value={stats.suspended} sub="يتطلب مراجعة" color={C.amber} />
                <MetricCard icon="approval" label="قيد الاعتماد" value={stats.underReview} sub="طلبات جديدة" color={C.purple} />
                <MetricCard icon="documents" label="وثائق منتهية" value={stats.expiredDocs} sub="تتطلب تجديداً عاجلاً" color={C.red} />
                <MetricCard icon="activities" label="الأنشطة المسجلة" value={stats.totalActivities} sub="في النظام" color={C.gold} />
              </div>

              {/* Recent Vendors Table */}
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 700, color: C.textPrimary }}>أحدث الموردين المسجلين</div>
                  <button onClick={() => setPage("vendors")} style={{ background: "none", border: "none", color: C.accent, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                    عرض الكل <Icon name="chevronRight" size={14} color={C.accent} />
                  </button>
                </div>
                <Table
                  cols={[
                    { label: "الكود", key: "code", render: r => <span style={{ fontFamily: "JetBrains Mono", color: C.accent, fontSize: 12 }}>{r.code}</span> },
                    { label: "اسم المورد", key: "name_ar" },
                    { label: "النوع", key: "type", render: r => <span style={{ color: C.textSecondary }}>{r.type}</span> },
                    { label: "الدولة", key: "country" },
                    { label: "الحالة", key: "status", render: r => <StatusBadge status={r.status} /> },
                    { label: "الاعتماد", key: "approval", render: r => <StatusBadge status={r.approval} /> },
                  ]}
                  rows={vendors.slice(0, 4)}
                  onRowClick={v => { setSelectedVendor(v); setPage("vendors"); }}
                />
              </div>

              {/* Notifications panel */}
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, fontWeight: 700, color: C.textPrimary }}>
                  ⚠️ تنبيهات النظام
                </div>
                {notifications.map(n => (
                  <div key={n.id} style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}10`, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ background: C.goldGlow, padding: 8, borderRadius: 8 }}>
                      <Icon name="warning" size={14} color={C.amber} />
                    </div>
                    <div>
                      <div style={{ color: C.textSecondary, fontSize: 13 }}>{n.msg}</div>
                      <div style={{ color: C.textMuted, fontSize: 11, marginTop: 2 }}>{n.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── VENDORS ── */}
          {page === "vendors" && (
            <div className="fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <div style={{ color: C.textMuted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>VENDOR MANAGEMENT</div>
                  <h1 style={{ color: C.textPrimary, fontSize: 22, fontWeight: 800 }}>إدارة الموردين</h1>
                </div>
                <button onClick={() => setShowAddModal(true)}
                  style={{ background: C.accent, border: "none", borderRadius: 10, padding: "10px 18px", color: "#fff", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <Icon name="plus" size={15} color="#fff" /> إضافة مورد
                </button>
              </div>

              {/* Search & Filter Bar */}
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 8, background: C.surfaceElevated, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 14px" }}>
                  <Icon name="search" size={15} color={C.textMuted} />
                  <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="بحث بالاسم، الكود، السجل التجاري، الهاتف..." style={{ background: "none", border: "none", color: C.textPrimary, fontSize: 13, width: "100%" }} />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                  style={{ background: C.surfaceElevated, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 14px", color: C.textSecondary, fontSize: 12 }}>
                  <option value="All">جميع الحالات</option>
                  <option value="Active">نشط</option>
                  <option value="Suspended">موقوف</option>
                  <option value="Blocked">محظور</option>
                </select>
                <select value={filterActivity} onChange={e => setFilterActivity(e.target.value)}
                  style={{ background: C.surfaceElevated, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 14px", color: C.textSecondary, fontSize: 12 }}>
                  <option value="All">جميع الأنشطة</option>
                  {activities.map(a => <option key={a.id} value={a.id}>{a.name_ar}</option>)}
                </select>
                <div style={{ color: C.textMuted, fontSize: 12 }}>
                  <span style={{ color: C.accent, fontWeight: 700 }}>{filteredVendors.length}</span> نتيجة
                </div>
                <button style={{ background: C.surfaceElevated, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 14px", color: C.textSecondary, display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                  <Icon name="export" size={14} /> Excel
                </button>
              </div>

              {/* Vendor Table */}
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                <Table
                  cols={[
                    { label: "الكود", key: "code", render: r => <span style={{ fontFamily: "JetBrains Mono", color: C.accent, fontSize: 12, fontWeight: 700 }}>{r.code}</span> },
                    { label: "الاسم عربي", key: "name_ar", render: r => <span style={{ color: C.textPrimary, fontWeight: 600 }}>{r.name_ar}</span> },
                    { label: "English Name", key: "name_en", render: r => <span style={{ color: C.textSecondary, fontSize: 12 }}>{r.name_en}</span> },
                    { label: "النوع", key: "type" },
                    { label: "الدولة", key: "country" },
                    { label: "الهاتف", key: "phone", render: r => <span style={{ fontFamily: "JetBrains Mono", fontSize: 12 }}>{r.phone}</span> },
                    { label: "الأنشطة", key: "activities", render: r => (
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {r.activities.slice(0, 2).map(aid => {
                          const a = activities.find(x => x.id === aid);
                          return a ? <span key={aid} style={{ background: C.accentGlow, color: C.accent, padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 600 }}>{a.name_ar}</span> : null;
                        })}
                        {r.activities.length > 2 && <span style={{ color: C.textMuted, fontSize: 11 }}>+{r.activities.length - 2}</span>}
                      </div>
                    )},
                    { label: "الحالة", key: "status", render: r => <StatusBadge status={r.status} /> },
                    { label: "الاعتماد", key: "approval", render: r => <StatusBadge status={r.approval} /> },
                    { label: "إجراءات", key: "actions", render: r => (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={e => { e.stopPropagation(); setSelectedVendor(r); }} style={{ background: C.accentGlow, border: `1px solid ${C.accent}30`, borderRadius: 6, padding: "4px 8px", color: C.accent }}>
                          <Icon name="eye" size={13} color={C.accent} />
                        </button>
                        <button style={{ background: C.goldGlow, border: `1px solid ${C.gold}30`, borderRadius: 6, padding: "4px 8px", color: C.gold }}>
                          <Icon name="edit" size={13} color={C.gold} />
                        </button>
                      </div>
                    )},
                  ]}
                  rows={filteredVendors}
                  onRowClick={v => setSelectedVendor(v)}
                />
              </div>
            </div>
          )}

          {/* ── ACTIVITIES ── */}
          {page === "activities" && (
            <div className="fade-in">
              <div style={{ marginBottom: 20 }}>
                <div style={{ color: C.textMuted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>ACTIVITY MANAGEMENT</div>
                <h1 style={{ color: C.textPrimary, fontSize: 22, fontWeight: 800 }}>إدارة الأنشطة</h1>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {activities.map(act => {
                  const count = vendors.filter(v => v.activities.includes(act.id)).length;
                  return (
                    <div key={act.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${C.purple}, transparent)` }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div>
                          <span style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: C.purple, fontWeight: 700 }}>{act.code}</span>
                          <div style={{ color: C.textPrimary, fontWeight: 700, fontSize: 15, marginTop: 2 }}>{act.name_ar}</div>
                          <div style={{ color: C.textSecondary, fontSize: 12, marginTop: 1 }}>{act.name_en}</div>
                        </div>
                        <div style={{ background: `${C.purple}20`, borderRadius: 8, padding: "6px 12px", textAlign: "center" }}>
                          <div style={{ color: C.purple, fontWeight: 800, fontSize: 20, fontFamily: "JetBrains Mono" }}>{count}</div>
                          <div style={{ color: C.textMuted, fontSize: 10 }}>مورد</div>
                        </div>
                      </div>
                      <div style={{ color: C.textMuted, fontSize: 12 }}>{act.description}</div>
                      <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {vendors.filter(v => v.activities.includes(act.id)).map(v => (
                          <span key={v.id} style={{ background: C.surfaceElevated, color: C.textSecondary, padding: "2px 8px", borderRadius: 8, fontSize: 10, border: `1px solid ${C.border}` }}>
                            {v.name_ar}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── DOCUMENTS ── */}
          {page === "documents" && (
            <div className="fade-in">
              <div style={{ marginBottom: 20 }}>
                <div style={{ color: C.textMuted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>DOCUMENT MANAGEMENT</div>
                <h1 style={{ color: C.textPrimary, fontSize: 22, fontWeight: 800 }}>إدارة المستندات</h1>
              </div>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                <Table
                  cols={[
                    { label: "المورد", key: "vendor_id", render: r => {
                      const v = vendors.find(x => x.id === r.vendor_id);
                      return <span style={{ color: C.textPrimary, fontWeight: 600 }}>{v?.name_ar}</span>;
                    }},
                    { label: "نوع الوثيقة", key: "type", render: r => (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Icon name="documents" size={13} color={C.accent} />
                        <span>{r.type}</span>
                      </div>
                    )},
                    { label: "اسم الملف", key: "name", render: r => <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: C.textSecondary }}>{r.name}</span> },
                    { label: "تاريخ الانتهاء", key: "expiry", render: r => <span style={{ fontFamily: "JetBrains Mono", fontSize: 12 }}>{r.expiry}</span> },
                    { label: "الحجم", key: "size", render: r => <span style={{ color: C.textMuted, fontSize: 12 }}>{r.size}</span> },
                    { label: "الحالة", key: "status", render: r => <StatusBadge status={r.status} /> },
                    { label: "إجراءات", key: "a", render: r => (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={{ background: C.accentGlow, border: `1px solid ${C.accent}30`, borderRadius: 6, padding: "4px 10px", color: C.accent, fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                          <Icon name="eye" size={12} color={C.accent} /> عرض
                        </button>
                        <button style={{ background: C.greenGlow, border: `1px solid ${C.green}30`, borderRadius: 6, padding: "4px 10px", color: C.green, fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                          <Icon name="export" size={12} color={C.green} /> تحميل
                        </button>
                      </div>
                    )},
                  ]}
                  rows={DOCUMENTS}
                />
              </div>
              {/* Upload Zone */}
              <div style={{ marginTop: 16, border: `2px dashed ${C.border}`, borderRadius: 12, padding: 32, textAlign: "center", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                <Icon name="upload" size={32} color={C.textMuted} />
                <div style={{ color: C.textMuted, marginTop: 8 }}>اسحب وأفلت الملفات هنا أو انقر للرفع</div>
                <div style={{ color: C.textMuted, fontSize: 11, marginTop: 4 }}>PDF, JPEG, PNG حتى 10MB</div>
              </div>
            </div>
          )}

          {/* ── APPROVAL LOG ── */}
          {page === "approval" && (
            <div className="fade-in">
              <div style={{ marginBottom: 20 }}>
                <div style={{ color: C.textMuted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>APPROVAL WORKFLOW</div>
                <h1 style={{ color: C.textPrimary, fontSize: 22, fontWeight: 800 }}>سجل الاعتماد والمراجعة</h1>
              </div>
              {/* Workflow diagram */}
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
                {[
                  { step: "تسجيل طلب", color: C.accent, icon: "plus" },
                  { step: "مراجعة أولية", color: C.purple, icon: "eye" },
                  { step: "اعتماد مالي", color: C.gold, icon: "check" },
                  { step: "اعتماد نهائي", color: C.green, icon: "approval" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ background: `${s.color}20`, border: `1px solid ${s.color}50`, borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 6 }}>
                      <Icon name={s.icon} size={14} color={s.color} />
                      <span style={{ color: s.color, fontSize: 12, fontWeight: 700 }}>{s.step}</span>
                    </div>
                    {i < 3 && <Icon name="chevronRight" size={16} color={C.textMuted} />}
                  </div>
                ))}
              </div>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                <Table
                  cols={[
                    { label: "المورد", key: "vendor_id", render: r => {
                      const v = vendors.find(x => x.id === r.vendor_id);
                      return <span style={{ color: C.textPrimary, fontWeight: 600 }}>{v?.name_ar}</span>;
                    }},
                    { label: "الإجراء", key: "action", render: r => <StatusBadge status={r.action} /> },
                    { label: "المسؤول", key: "user", render: r => <span style={{ color: C.textSecondary }}>{r.user}</span> },
                    { label: "التاريخ", key: "date", render: r => <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: C.textMuted }}>{r.date}</span> },
                    { label: "الملاحظات", key: "notes", render: r => <span style={{ color: C.textMuted, fontSize: 12 }}>{r.notes}</span> },
                  ]}
                  rows={APPROVAL_LOG}
                />
              </div>
            </div>
          )}

          {/* ── REPORTS ── */}
          {page === "reports" && (
            <div className="fade-in">
              <div style={{ marginBottom: 20 }}>
                <div style={{ color: C.textMuted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>REPORTS & ANALYTICS</div>
                <h1 style={{ color: C.textPrimary, fontSize: 22, fontWeight: 800 }}>التقارير والإحصائيات</h1>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 20 }}>
                {[
                  { title: "الموردون حسب النشاط", desc: "توزيع الموردين على الأنشطة المختلفة", icon: "activities", color: C.purple },
                  { title: "الموردون النشطون", desc: `${stats.active} مورد فعّال من أصل ${stats.total}`, icon: "check", color: C.green },
                  { title: "الموردون الموقوفون", desc: `${stats.suspended} مورد موقوف يتطلب مراجعة`, icon: "warning", color: C.amber },
                  { title: "المستندات المنتهية", desc: `${stats.expiredDocs} وثيقة تتطلب تجديداً`, icon: "documents", color: C.red },
                  { title: "الموردون الجدد", desc: "المضافون خلال الشهر الماضي", icon: "vendors", color: C.accent },
                  { title: "تقرير الاعتماد", desc: "سجل كامل بجميع قرارات الاعتماد", icon: "approval", color: C.gold },
                ].map((r, i) => (
                  <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, cursor: "pointer", transition: "border-color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = r.color}
                    onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                    <div style={{ background: `${r.color}15`, borderRadius: 10, padding: 10, display: "inline-flex", marginBottom: 12 }}>
                      <Icon name={r.icon} size={18} color={r.color} />
                    </div>
                    <div style={{ color: C.textPrimary, fontWeight: 700, marginBottom: 4 }}>{r.title}</div>
                    <div style={{ color: C.textMuted, fontSize: 12 }}>{r.desc}</div>
                    <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                      <button style={{ flex: 1, background: `${r.color}15`, border: `1px solid ${r.color}30`, borderRadius: 8, padding: "7px", color: r.color, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                        <Icon name="eye" size={12} color={r.color} /> عرض
                      </button>
                      <button style={{ flex: 1, background: C.surfaceElevated, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px", color: C.textSecondary, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                        <Icon name="export" size={12} /> Excel
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bar chart: vendors per activity */}
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ fontWeight: 700, color: C.textPrimary, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>توزيع الموردين حسب النشاط</span>
                  <button style={{ background: C.greenGlow, border: `1px solid ${C.green}30`, borderRadius: 8, padding: "5px 14px", color: C.green, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
                    <Icon name="export" size={12} color={C.green} /> Excel
                  </button>
                </div>
                {activities.map((act, idx) => {
                  const count = vendors.filter(v => v.activities.includes(act.id)).length;
                  const pct = Math.round((count / vendors.length) * 100);
                  const barColors = [C.accent, C.purple, C.green, C.gold, C.red, C.amber, "#06B6D4"];
                  return (
                    <div key={act.id} style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 130, flexShrink: 0 }}>
                        <div style={{ fontSize: 12, color: C.textSecondary, fontWeight: 600 }}>{act.name_ar}</div>
                        <div style={{ color: C.textMuted, fontSize: 10 }}>{act.name_en}</div>
                      </div>
                      <div style={{ flex: 1, height: 28, background: C.surfaceElevated, borderRadius: 6, overflow: "hidden" }}>
                        <div style={{ width: `${Math.max(4, pct)}%`, height: "100%", background: `linear-gradient(90deg, ${barColors[idx % barColors.length]}, ${barColors[idx % barColors.length]}88)`, borderRadius: 6, display: "flex", alignItems: "center", paddingRight: 8 }}>
                          {count > 0 && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, fontFamily: "JetBrains Mono", marginRight: 6 }}>{count}</span>}
                        </div>
                      </div>
                      <div style={{ width: 48, fontFamily: "JetBrains Mono", fontSize: 12, color: C.textMuted, flexShrink: 0 }}>{pct}%</div>
                    </div>
                  );
                })}
              </div>

              {/* KPI Summary */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
                {[
                  { label: "معدل الاعتماد", value: `${Math.round((vendors.filter(v=>v.approval==="Approved").length/vendors.length)*100)}%`, color: C.green },
                  { label: "معدل الموقوفين", value: `${Math.round((vendors.filter(v=>v.status!=="Active").length/vendors.length)*100)}%`, color: C.amber },
                  { label: "متوسط الأنشطة / مورد", value: (vendors.reduce((s,v)=>s+v.activities.length,0)/vendors.length).toFixed(1), color: C.accent },
                  { label: "وثائق تتطلب تجديد", value: DOCUMENTS.filter(d=>d.status!=="Valid").length, color: C.red },
                ].map((kpi, i) => (
                  <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, textAlign: "center" }}>
                    <div style={{ color: kpi.color, fontSize: 30, fontWeight: 900, fontFamily: "JetBrains Mono" }}>{kpi.value}</div>
                    <div style={{ color: C.textMuted, fontSize: 11, marginTop: 6 }}>{kpi.label}</div>
                  </div>
                ))}
              </div>

              {/* Suspended/Blocked report table */}
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 700, color: C.textPrimary }}>تقرير الموردين الموقوفين / المرفوضين</div>
                  <button style={{ background: C.redGlow, border: `1px solid ${C.red}30`, borderRadius: 8, padding: "5px 14px", color: C.red, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
                    <Icon name="documents" size={12} color={C.red} /> PDF
                  </button>
                </div>
                <Table
                  cols={[
                    { label: "الكود", key: "code", render: r => <span style={{ fontFamily: "JetBrains Mono", color: C.accent, fontSize: 12 }}>{r.code}</span> },
                    { label: "اسم المورد", key: "name_ar", render: r => <span style={{ color: C.textPrimary, fontWeight: 600 }}>{r.name_ar}</span> },
                    { label: "الدولة", key: "country" },
                    { label: "الحالة", key: "status", render: r => <StatusBadge status={r.status} /> },
                    { label: "الاعتماد", key: "approval", render: r => <StatusBadge status={r.approval} /> },
                    { label: "الملاحظات", key: "notes", render: r => <span style={{ color: C.textMuted, fontSize: 12 }}>{r.notes || "—"}</span> },
                  ]}
                  rows={vendors.filter(v => v.status !== "Active" || v.approval !== "Approved")}
                />
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {page === "users" && (
            <div className="fade-in">
              <div style={{ marginBottom: 20 }}>
                <div style={{ color: C.textMuted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>USER ADMINISTRATION</div>
                <h1 style={{ color: C.textPrimary, fontSize: 22, fontWeight: 800 }}>إدارة المستخدمين والصلاحيات</h1>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                {USERS.map(u => {
                  const perms = { add: "إضافة", edit: "تعديل", delete: "حذف", approve: "اعتماد", print: "طباعة", export: "تصدير" };
                  return (
                    <div key={u.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${roleColor[u.role]}, transparent)` }} />
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${roleColor[u.role]}20`, border: `2px solid ${roleColor[u.role]}`, display: "flex", alignItems: "center", justifyContent: "center", color: roleColor[u.role], fontWeight: 800, fontSize: 16 }}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ color: C.textPrimary, fontWeight: 700 }}>{u.name}</div>
                          <span style={{ background: `${roleColor[u.role]}20`, color: roleColor[u.role], padding: "2px 10px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>{u.role}</span>
                        </div>
                      </div>
                      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                        <div style={{ color: C.textMuted, fontSize: 11, marginBottom: 8, fontWeight: 600, letterSpacing: 0.5 }}>الصلاحيات</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {Object.entries(perms).map(([key, label]) => {
                            const has = u.permissions.includes(key);
                            return (
                              <span key={key} style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: has ? C.greenGlow : C.surfaceElevated, color: has ? C.green : C.textMuted, border: `1px solid ${has ? C.green + "30" : C.border}`, display: "flex", alignItems: "center", gap: 3 }}>
                                {has ? <Icon name="check" size={10} color={C.green} /> : <Icon name="x" size={10} color={C.textMuted} />}
                                {label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── ADVANCED SEARCH ── */}
          {page === "search" && (
            <div className="fade-in">
              <div style={{ marginBottom: 20 }}>
                <div style={{ color: C.textMuted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>ADVANCED SEARCH & FILTER</div>
                <h1 style={{ color: C.textPrimary, fontSize: 22, fontWeight: 800 }}>البحث المتقدم</h1>
              </div>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ color: C.accent, fontWeight: 700, marginBottom: 14, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="filter" size={14} color={C.accent} /> معايير البحث المتقدم
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
                  <Field label="اسم المورد (عربي / إنجليزي)"><Input placeholder="أدخل أي جزء من الاسم..." /></Field>
                  <Field label="كود المورد"><Input placeholder="V001, V002 ..." /></Field>
                  <Field label="نوع المورد">
                    <Select options={[{value:"",label:"الكل"},{value:"Company",label:"شركة"},{value:"Factory",label:"مصنع"},{value:"Agent",label:"وكيل"},{value:"Individual",label:"فرد"},{value:"Importer",label:"مستورد"}]} />
                  </Field>
                  <Field label="الحالة">
                    <Select options={[{value:"",label:"الكل"},{value:"Active",label:"نشط"},{value:"Suspended",label:"موقوف"},{value:"Blocked",label:"محظور"}]} />
                  </Field>
                  <Field label="حالة الاعتماد">
                    <Select options={[{value:"",label:"الكل"},{value:"Approved",label:"معتمد"},{value:"Under Review",label:"قيد المراجعة"},{value:"Rejected",label:"مرفوض"}]} />
                  </Field>
                  <Field label="الدولة">
                    <Select options={[{value:"",label:"الكل"},...["Saudi Arabia","UAE","Egypt","Kuwait","Bahrain","Oman","Qatar","Jordan"].map(c=>({value:c,label:c}))]} />
                  </Field>
                  <Field label="النشاط">
                    <Select options={[{value:"",label:"الكل"},...ACTIVITIES.map(a=>({value:a.id,label:a.name_ar}))]} />
                  </Field>
                  <Field label="رقم السجل التجاري"><Input placeholder="رقم السجل التجاري..." /></Field>
                  <Field label="رقم الهاتف"><Input placeholder="+966..." /></Field>
                  <Field label="تاريخ التسجيل من"><Input type="date" /></Field>
                  <Field label="تاريخ التسجيل إلى"><Input type="date" /></Field>
                  <Field label="حالة الوثائق">
                    <Select options={[{value:"",label:"الكل"},{value:"Valid",label:"سارية"},{value:"Expiring Soon",label:"تنتهي قريباً"},{value:"Expired",label:"منتهية"}]} />
                  </Field>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                  <button style={{ background: C.accent, border: "none", borderRadius: 10, padding: "11px 28px", color: "#fff", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon name="search" size={15} color="#fff" /> تنفيذ البحث
                  </button>
                  <button style={{ background: C.surfaceElevated, border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 20px", color: C.textSecondary, fontSize: 13 }}>
                    إعادة تعيين
                  </button>
                  <div style={{ marginRight: "auto", display: "flex", gap: 8 }}>
                    <button style={{ background: C.greenGlow, border: `1px solid ${C.green}30`, borderRadius: 10, padding: "11px 18px", color: C.green, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                      <Icon name="export" size={13} color={C.green} /> تصدير Excel
                    </button>
                    <button style={{ background: C.redGlow, border: `1px solid ${C.red}30`, borderRadius: 10, padding: "11px 18px", color: C.red, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                      <Icon name="documents" size={13} color={C.red} /> تصدير PDF
                    </button>
                  </div>
                </div>
              </div>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 700, color: C.textPrimary }}>نتائج البحث</div>
                  <span style={{ background: C.accentGlow, color: C.accent, padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{vendors.length} نتيجة</span>
                </div>
                <Table
                  cols={[
                    { label: "الكود", key: "code", render: r => <span style={{ fontFamily: "JetBrains Mono", color: C.accent, fontSize: 12, fontWeight: 700 }}>{r.code}</span> },
                    { label: "اسم المورد", key: "name_ar", render: r => <div><div style={{ color: C.textPrimary, fontWeight: 600 }}>{r.name_ar}</div><div style={{ color: C.textMuted, fontSize: 11 }}>{r.name_en}</div></div> },
                    { label: "النوع", key: "type", render: r => <span style={{ color: C.textSecondary, fontSize: 12 }}>{r.type}</span> },
                    { label: "الدولة / المدينة", key: "country", render: r => <div><div style={{ color: C.textSecondary, fontSize: 12 }}>{r.country}</div><div style={{ color: C.textMuted, fontSize: 11 }}>{r.city}</div></div> },
                    { label: "السجل التجاري", key: "cr_number", render: r => <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: C.textMuted }}>{r.cr_number}</span> },
                    { label: "الأنشطة", key: "activities", render: r => (
                      <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                        {r.activities.map(aid => {
                          const a = ACTIVITIES.find(x => x.id === aid);
                          return a ? <span key={aid} style={{ background: C.accentGlow, color: C.accent, padding: "1px 7px", borderRadius: 8, fontSize: 10, fontWeight: 600 }}>{a.name_ar}</span> : null;
                        })}
                      </div>
                    )},
                    { label: "الحالة", key: "status", render: r => <StatusBadge status={r.status} /> },
                    { label: "الاعتماد", key: "approval", render: r => <StatusBadge status={r.approval} /> },
                    { label: "انتهاء الوثائق", key: "docs_expiry", render: r => {
                      const today = new Date("2025-05-10"); const exp = new Date(r.docs_expiry);
                      const diff = Math.round((exp - today) / 86400000);
                      const color = diff < 0 ? C.red : diff < 60 ? C.amber : C.green;
                      return <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, color }}>{r.docs_expiry}</span>;
                    }},
                  ]}
                  rows={vendors}
                  onRowClick={v => setSelectedVendor(v)}
                />
              </div>
            </div>
          )}

          {/* ── ALERTS ── */}
          {page === "alerts" && (
            <div className="fade-in">
              <div style={{ marginBottom: 20 }}>
                <div style={{ color: C.textMuted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>ALERTS & NOTIFICATIONS</div>
                <h1 style={{ color: C.textPrimary, fontSize: 22, fontWeight: 800 }}>التنبيهات والإشعارات</h1>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
                {[
                  { label: "وثائق منتهية الصلاحية", value: 1, color: C.red, icon: "x" },
                  { label: "وثائق تنتهي خلال 60 يوم", value: 2, color: C.amber, icon: "warning" },
                  { label: "موردون موقوفون", value: vendors.filter(v=>v.status==="Suspended").length, color: C.amber, icon: "warning" },
                  { label: "طلبات اعتماد معلقة", value: vendors.filter(v=>v.approval==="Under Review").length, color: C.purple, icon: "approval" },
                  { label: "موردون محظورون", value: vendors.filter(v=>v.status==="Blocked").length, color: C.red, icon: "x" },
                ].map((a, i) => (
                  <div key={i} style={{ background: C.surface, border: `1px solid ${a.color}30`, borderRadius: 12, padding: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ color: C.textMuted, fontSize: 11, fontWeight: 600, lineHeight: 1.4 }}>{a.label}</div>
                      <div style={{ background: `${a.color}20`, borderRadius: 8, padding: 7 }}><Icon name={a.icon} size={14} color={a.color} /></div>
                    </div>
                    <div style={{ color: a.color, fontSize: 36, fontWeight: 900, fontFamily: "JetBrains Mono", marginTop: 8 }}>{a.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, fontWeight: 700, color: C.textPrimary, display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name="documents" size={16} color={C.amber} /> تتبع انتهاء صلاحية الوثائق
                </div>
                {DOCUMENTS.map(doc => {
                  const vendor = vendors.find(v => v.id === doc.vendor_id);
                  const statusColor = doc.status === "Expired" ? C.red : doc.status === "Expiring Soon" ? C.amber : C.green;
                  const today = new Date("2025-05-10");
                  const exp = new Date(doc.expiry);
                  const diffDays = Math.round((exp - today) / 86400000);
                  return (
                    <div key={doc.id} style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}10`, display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 4, alignSelf: "stretch", background: statusColor, borderRadius: 2, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ color: C.textPrimary, fontWeight: 600, fontSize: 13 }}>{vendor?.name_ar}</span>
                          <StatusBadge status={doc.status} />
                        </div>
                        <div style={{ display: "flex", gap: 16, fontSize: 12, color: C.textMuted }}>
                          <span style={{ color: C.accent }}>{doc.type}</span>
                          <span style={{ fontFamily: "JetBrains Mono" }}>ينتهي: {doc.expiry}</span>
                          <span style={{ color: statusColor, fontWeight: 700 }}>
                            {diffDays < 0 ? `منتهي منذ ${Math.abs(diffDays)} يوم` : `متبقي ${diffDays} يوم`}
                          </span>
                        </div>
                        <div style={{ marginTop: 8, height: 4, background: C.surfaceElevated, borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ width: `${Math.max(2, Math.min(100, (diffDays / 365) * 100))}%`, height: "100%", background: statusColor, borderRadius: 2 }} />
                        </div>
                      </div>
                      <button style={{ background: `${statusColor}15`, border: `1px solid ${statusColor}30`, borderRadius: 8, padding: "7px 14px", color: statusColor, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
                        تجديد الوثيقة
                      </button>
                    </div>
                  );
                })}
              </div>

              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
                <div style={{ fontWeight: 700, color: C.textPrimary, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name="bell" size={16} color={C.accent} /> إعدادات التنبيهات
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Field label="تنبيه انتهاء الوثائق (أيام قبل الانتهاء)"><Input defaultValue="30" /></Field>
                  <Field label="تنبيه إعادة التقييم الدوري (أيام)"><Input defaultValue="365" /></Field>
                  <Field label="تكرار إرسال التنبيه البريدي"><Input defaultValue="يومياً" /></Field>
                  <Field label="مستلم التنبيهات الافتراضي"><Input defaultValue="مدير المشتريات" /></Field>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
                  {[{label:"تنبيه بالبريد الإلكتروني",checked:true},{label:"تنبيه داخل النظام",checked:true},{label:"تنبيه SMS",checked:false}].map((opt,i) => (
                    <label key={i} style={{ display: "flex", alignItems: "center", gap: 6, color: C.textSecondary, fontSize: 13, cursor: "pointer" }}>
                      <input type="checkbox" defaultChecked={opt.checked} style={{ accentColor: C.accent }} /> {opt.label}
                    </label>
                  ))}
                  <button style={{ marginRight: "auto", background: C.accent, border: "none", borderRadius: 10, padding: "10px 22px", color: "#fff", fontWeight: 700, fontSize: 13 }}>
                    حفظ الإعدادات
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── SQL SCRIPTS ── */}
          {page === "sql" && (
            <div className="fade-in">
              <div style={{ marginBottom: 20 }}>
                <div style={{ color: C.textMuted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>SQL SERVER · ORACLE COMPATIBLE</div>
                <h1 style={{ color: C.textPrimary, fontSize: 22, fontWeight: 800 }}>SQL Scripts — DDL & Stored Procedures</h1>
              </div>
              {[
                {
                  title: "CREATE TABLE — Vendors",
                  color: C.accent,
                  code: `CREATE TABLE Vendors (
  vendor_id        INT           IDENTITY(1,1) PRIMARY KEY,
  vendor_code      VARCHAR(20)   NOT NULL UNIQUE,
  name_ar          NVARCHAR(200) NOT NULL,
  name_en          VARCHAR(200)  NOT NULL,
  vendor_type      VARCHAR(50)   CHECK (vendor_type IN
                   ('Company','Factory','Agent','Individual','Importer')),
  status           VARCHAR(20)   DEFAULT 'Active'
                   CHECK (status IN ('Active','Suspended','Blocked')),
  approval_status  VARCHAR(30)   DEFAULT 'Pending'
                   CHECK (approval_status IN
                   ('Pending','Under Review','Approved','Rejected')),
  country          VARCHAR(100),
  city             NVARCHAR(100),
  address          NVARCHAR(500),
  phone_primary    VARCHAR(30),
  phone_secondary  VARCHAR(30),
  email            VARCHAR(150),
  website          VARCHAR(200),
  cr_number        VARCHAR(50),
  tax_card         VARCHAR(50),
  vat_number       VARCHAR(50),
  registration_date DATE,
  notes            NVARCHAR(MAX),
  created_by       INT           REFERENCES Users(user_id),
  created_at       DATETIME      DEFAULT GETDATE(),
  updated_by       INT           REFERENCES Users(user_id),
  updated_at       DATETIME
);`
                },
                {
                  title: "CREATE TABLE — Activities & Vendor_Activities (Many-to-Many)",
                  color: C.purple,
                  code: `CREATE TABLE Activities (
  activity_id   INT           IDENTITY(1,1) PRIMARY KEY,
  activity_code VARCHAR(20)   NOT NULL UNIQUE,
  name_ar       NVARCHAR(200) NOT NULL,
  name_en       VARCHAR(200)  NOT NULL,
  description   NVARCHAR(500),
  is_active     BIT           DEFAULT 1
);

-- Junction table — enforces Many-to-Many with composite unique key
CREATE TABLE Vendor_Activities (
  id            INT  IDENTITY(1,1) PRIMARY KEY,
  vendor_id     INT  NOT NULL REFERENCES Vendors(vendor_id)
                     ON DELETE CASCADE,
  activity_id   INT  NOT NULL REFERENCES Activities(activity_id)
                     ON DELETE CASCADE,
  assigned_date DATE DEFAULT CAST(GETDATE() AS DATE),
  CONSTRAINT UQ_Vendor_Activity UNIQUE (vendor_id, activity_id)
);`
                },
                {
                  title: "CREATE TABLE — Vendor_Documents & Approval_Log",
                  color: C.green,
                  code: `CREATE TABLE Vendor_Documents (
  document_id   INT           IDENTITY(1,1) PRIMARY KEY,
  vendor_id     INT           NOT NULL REFERENCES Vendors(vendor_id)
                              ON DELETE CASCADE,
  doc_type      VARCHAR(100)  NOT NULL,
  doc_name      NVARCHAR(200),
  file_path     VARCHAR(500),
  file_size     VARCHAR(20),
  mime_type     VARCHAR(100),
  issue_date    DATE,
  expiry_date   DATE,
  alert_days    INT           DEFAULT 30,
  uploaded_by   INT           REFERENCES Users(user_id),
  uploaded_at   DATETIME      DEFAULT GETDATE()
);

CREATE TABLE Approval_Log (
  log_id        INT           IDENTITY(1,1) PRIMARY KEY,
  vendor_id     INT           NOT NULL REFERENCES Vendors(vendor_id),
  action        VARCHAR(50)   NOT NULL,
  from_status   VARCHAR(30),
  to_status     VARCHAR(30),
  notes         NVARCHAR(MAX),
  action_by     INT           REFERENCES Users(user_id),
  action_date   DATETIME      DEFAULT GETDATE()
);`
                },
                {
                  title: "CREATE TABLE — Users & User_Permissions (RBAC)",
                  color: C.gold,
                  code: `CREATE TABLE Users (
  user_id       INT           IDENTITY(1,1) PRIMARY KEY,
  username      VARCHAR(100)  NOT NULL UNIQUE,
  full_name     NVARCHAR(200),
  email         VARCHAR(150),
  password_hash VARCHAR(256)  NOT NULL,   -- BCrypt
  role          VARCHAR(30)   CHECK (role IN
                ('Admin','Purchasing','Auditor','Viewer')),
  is_active     BIT           DEFAULT 1,
  last_login    DATETIME,
  created_at    DATETIME      DEFAULT GETDATE()
);

CREATE TABLE User_Permissions (
  perm_id       INT     IDENTITY(1,1) PRIMARY KEY,
  user_id       INT     NOT NULL REFERENCES Users(user_id)
                        ON DELETE CASCADE,
  module        VARCHAR(50) NOT NULL,
  can_add       BIT     DEFAULT 0,
  can_edit      BIT     DEFAULT 0,
  can_delete    BIT     DEFAULT 0,
  can_approve   BIT     DEFAULT 0,
  can_export    BIT     DEFAULT 0,
  can_print     BIT     DEFAULT 0,
  CONSTRAINT UQ_UserModule UNIQUE (user_id, module)
);`
                },
                {
                  title: "STORED PROCEDURE — Approve / Reject Vendor",
                  color: C.amber,
                  code: `CREATE PROCEDURE sp_ApproveVendor
  @vendor_id    INT,
  @action       VARCHAR(30),   -- 'Approved' | 'Rejected' | 'Suspended'
  @notes        NVARCHAR(MAX),
  @action_by    INT
AS
BEGIN
  SET NOCOUNT ON;
  DECLARE @from_status VARCHAR(30);

  SELECT @from_status = approval_status
  FROM   Vendors WHERE vendor_id = @vendor_id;

  UPDATE Vendors
  SET    approval_status = @action,
         updated_by      = @action_by,
         updated_at      = GETDATE()
  WHERE  vendor_id = @vendor_id;

  INSERT INTO Approval_Log
    (vendor_id, action, from_status, to_status, notes, action_by)
  VALUES
    (@vendor_id, @action, @from_status, @action, @notes, @action_by);
END;`
                },
                {
                  title: "VIEW — Expiring Documents (Alert Feed)",
                  color: C.red,
                  code: `CREATE VIEW vw_ExpiringDocuments AS
SELECT
  v.vendor_code,
  v.name_ar,
  v.name_en,
  d.doc_type,
  d.doc_name,
  d.expiry_date,
  DATEDIFF(DAY, CAST(GETDATE() AS DATE), d.expiry_date) AS days_remaining,
  CASE
    WHEN d.expiry_date < CAST(GETDATE() AS DATE) THEN 'Expired'
    WHEN DATEDIFF(DAY, CAST(GETDATE() AS DATE), d.expiry_date) <= 30 THEN 'Critical'
    WHEN DATEDIFF(DAY, CAST(GETDATE() AS DATE), d.expiry_date) <= 60 THEN 'Warning'
    ELSE 'OK'
  END AS alert_level
FROM Vendor_Documents d
JOIN Vendors v ON v.vendor_id = d.vendor_id
WHERE d.expiry_date <= DATEADD(DAY, 60, GETDATE())
ORDER BY d.expiry_date ASC;

-- Usage:
-- SELECT * FROM vw_ExpiringDocuments WHERE alert_level IN ('Expired','Critical');`
                },
                {
                  title: "VIEW — Vendor Summary with Activity Count",
                  color: C.purple,
                  code: `CREATE VIEW vw_VendorSummary AS
SELECT
  v.vendor_id,
  v.vendor_code,
  v.name_ar,
  v.name_en,
  v.vendor_type,
  v.status,
  v.approval_status,
  v.country,
  v.city,
  v.phone_primary,
  v.email,
  v.registration_date,
  COUNT(va.activity_id)         AS activity_count,
  STRING_AGG(a.name_en, ', ')   AS activities,  -- SQL Server 2017+
  (SELECT COUNT(*) FROM Vendor_Documents d
   WHERE d.vendor_id = v.vendor_id
     AND d.expiry_date < GETDATE())             AS expired_docs_count
FROM Vendors v
LEFT JOIN Vendor_Activities va ON va.vendor_id = v.vendor_id
LEFT JOIN Activities a         ON a.activity_id = va.activity_id
GROUP BY
  v.vendor_id, v.vendor_code, v.name_ar, v.name_en, v.vendor_type,
  v.status, v.approval_status, v.country, v.city,
  v.phone_primary, v.email, v.registration_date;`
                },
              ].map((block, i) => (
                <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 16, overflow: "hidden" }}>
                  <div style={{ background: `${block.color}12`, borderBottom: `1px solid ${block.color}30`, padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Icon name="tag" size={13} color={block.color} />
                      <span style={{ color: block.color, fontWeight: 700, fontSize: 13 }}>{block.title}</span>
                    </div>
                    <button style={{ background: `${block.color}15`, border: `1px solid ${block.color}30`, borderRadius: 6, padding: "4px 12px", color: block.color, fontSize: 11, fontWeight: 700 }}>
                      نسخ
                    </button>
                  </div>
                  <pre style={{ padding: 20, margin: 0, color: C.textSecondary, fontSize: 12, fontFamily: "JetBrains Mono, monospace", lineHeight: 1.7, overflowX: "auto", whiteSpace: "pre", background: "transparent" }}>
                    {block.code.trim().split("\n").map((line, li) => {
                      const keywords = /\b(CREATE|TABLE|VIEW|PROCEDURE|SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|JOIN|LEFT|ON|SET|BEGIN|END|AS|WITH|INT|VARCHAR|NVARCHAR|DATE|DATETIME|BIT|NOT|NULL|DEFAULT|CHECK|UNIQUE|PRIMARY|KEY|REFERENCES|CONSTRAINT|IDENTITY|IN|CASE|WHEN|THEN|ELSE|AND|OR|BY|COUNT|INTO|VALUES|ORDER|GROUP|DECLARE)\b/g;
                      const comments = /(--[^\n]*)/g;
                      return (
                        <span key={li} style={{ display: "block" }}>
                          {line.replace(comments, (m) => `\x00${m}\x00`)
                               .split("\x00")
                               .map((seg, si) =>
                                 seg.startsWith("--")
                                   ? <span key={si} style={{ color: C.textMuted }}>{seg}</span>
                                   : <span key={si} dangerouslySetInnerHTML={{ __html: seg.replace(keywords, `<span style="color:${C.accent};font-weight:600">$1</span>`) }} />
                               )}
                        </span>
                      );
                    })}
                  </pre>
                </div>
              ))}
            </div>
          )}

          {/* ── DATABASE SCHEMA ── */}
          {page === "schema" && (
            <div className="fade-in">
              <div style={{ marginBottom: 20 }}>
                <div style={{ color: C.textMuted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>DATABASE DESIGN · SQL SERVER / ORACLE</div>
                <h1 style={{ color: C.textPrimary, fontSize: 22, fontWeight: 800 }}>تصميم قاعدة البيانات · ERD</h1>
              </div>
              {/* Architecture Recommendation */}
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ fontWeight: 700, color: C.textPrimary, marginBottom: 12 }}>🏗️ المعمارية المقترحة (Recommended Architecture)</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                  {[
                    { layer: "Frontend", tech: "React 18 + TypeScript", color: C.accent, detail: "Vite · Tailwind CSS · shadcn/ui" },
                    { layer: "Backend API", tech: "ASP.NET Core 8 Web API", color: C.purple, detail: "RESTful · JWT Auth · Swagger" },
                    { layer: "Database", tech: "SQL Server 2022", color: C.gold, detail: "Normalization · Stored Procs · Views" },
                    { layer: "File Storage", tech: "Azure Blob Storage", color: C.green, detail: "SAS Tokens · CDN Integration" },
                    { layer: "Auth & RBAC", tech: "ASP.NET Identity", color: C.red, detail: "Role-Based · Claims · Audit Trail" },
                    { layer: "Reporting", tech: "SSRS / FastReport", color: C.amber, detail: "PDF · Excel Export · Print" },
                  ].map((t, i) => (
                    <div key={i} style={{ background: C.surfaceElevated, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
                      <div style={{ color: t.color, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{t.layer}</div>
                      <div style={{ color: C.textPrimary, fontWeight: 700, fontSize: 13 }}>{t.tech}</div>
                      <div style={{ color: C.textMuted, fontSize: 11, marginTop: 4 }}>{t.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
              <SchemaView />
            </div>
          )}

        </main>
      </div>

      {/* ── VENDOR DETAIL MODAL ── */}
      {selectedVendor && (
        <Modal title={`تفاصيل المورد — ${selectedVendor.name_ar}`} onClose={() => setSelectedVendor(null)} width={800}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Left column */}
            <div>
              <div style={{ background: C.surfaceElevated, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
                <div style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, marginBottom: 12, letterSpacing: 1 }}>البيانات الأساسية</div>
                {[
                  ["كود المورد", selectedVendor.code, "JetBrains Mono"],
                  ["الاسم عربي", selectedVendor.name_ar],
                  ["English Name", selectedVendor.name_en],
                  ["نوع المورد", selectedVendor.type],
                  ["تاريخ التسجيل", selectedVendor.reg_date, "JetBrains Mono"],
                ].map(([label, val, font]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.border}20`, fontSize: 12 }}>
                    <span style={{ color: C.textMuted }}>{label}</span>
                    <span style={{ color: C.textPrimary, fontFamily: font || "inherit", fontWeight: 600 }}>{val}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: C.surfaceElevated, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
                <div style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, marginBottom: 12, letterSpacing: 1 }}>بيانات السجلات</div>
                {[
                  ["السجل التجاري", selectedVendor.cr_number],
                  ["البطاقة الضريبية", selectedVendor.tax_card],
                  ["رقم القيمة المضافة", selectedVendor.vat_number],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.border}20`, fontSize: 12 }}>
                    <span style={{ color: C.textMuted }}>{label}</span>
                    <span style={{ color: C.textPrimary, fontFamily: "JetBrains Mono", fontWeight: 600, fontSize: 11 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Right column */}
            <div>
              <div style={{ background: C.surfaceElevated, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
                <div style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, marginBottom: 12, letterSpacing: 1 }}>بيانات الاتصال</div>
                {[
                  ["الدولة", selectedVendor.country],
                  ["المدينة", selectedVendor.city],
                  ["الهاتف", selectedVendor.phone],
                  ["البريد الإلكتروني", selectedVendor.email],
                  ["الموقع الإلكتروني", selectedVendor.website || "—"],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.border}20`, fontSize: 12 }}>
                    <span style={{ color: C.textMuted }}>{label}</span>
                    <span style={{ color: C.textPrimary, fontFamily: "JetBrains Mono", fontSize: 11 }}>{val}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: C.surfaceElevated, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
                <div style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>الحالة والاعتماد</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <StatusBadge status={selectedVendor.status} />
                  <StatusBadge status={selectedVendor.approval} />
                </div>
                {selectedVendor.notes && (
                  <div style={{ marginTop: 10, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", color: C.textMuted, fontSize: 12 }}>
                    {selectedVendor.notes}
                  </div>
                )}
              </div>
              <div style={{ background: C.surfaceElevated, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
                <div style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>الأنشطة المرتبطة</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {selectedVendor.activities.map(aid => {
                    const a = activities.find(x => x.id === aid);
                    return a ? (
                      <span key={aid} style={{ background: C.accentGlow, color: C.accent, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: `1px solid ${C.accent}30` }}>
                        <Icon name="tag" size={10} color={C.accent} /> {a.name_ar}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
            <button style={{ flex: 1, background: C.accent, border: "none", borderRadius: 10, padding: "11px", color: "#fff", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Icon name="edit" size={14} color="#fff" /> تعديل بيانات المورد
            </button>
            <button style={{ background: C.surfaceElevated, border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 18px", color: C.textSecondary, display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
              <Icon name="export" size={14} /> PDF
            </button>
          </div>
        </Modal>
      )}

      {/* ── ADD VENDOR MODAL ── */}
      {showAddModal && (
        <Modal title="إضافة مورد جديد" onClose={() => setShowAddModal(false)} width={720}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="الاسم عربي" required><Input placeholder="اسم المورد بالعربية" /></Field>
            <Field label="English Name" required><Input placeholder="Vendor name in English" /></Field>
            <Field label="نوع المورد" required>
              <Select options={[{ value: "", label: "اختر النوع..." }, { value: "Company", label: "شركة" }, { value: "Factory", label: "مصنع" }, { value: "Agent", label: "وكيل" }, { value: "Individual", label: "فرد" }, { value: "Importer", label: "مستورد" }]} />
            </Field>
            <Field label="الدولة"><Input placeholder="الدولة" /></Field>
            <Field label="المدينة"><Input placeholder="المدينة" /></Field>
            <Field label="رقم الهاتف" required><Input placeholder="+966-XX-XXXXXXX" /></Field>
            <Field label="البريد الإلكتروني"><Input type="email" placeholder="email@domain.com" /></Field>
            <Field label="الموقع الإلكتروني"><Input placeholder="www.example.com" /></Field>
            <Field label="رقم السجل التجاري" required><Input placeholder="XXXXXXXXXX" /></Field>
            <Field label="البطاقة الضريبية"><Input placeholder="TX-XX-XXXX-XXX" /></Field>
            <Field label="رقم القيمة المضافة"><Input placeholder="رقم التسجيل بالقيمة المضافة" /></Field>
            <Field label="تاريخ التسجيل"><Input type="date" /></Field>
          </div>
          <Field label="الأنشطة المرتبطة">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {activities.map(a => (
                <label key={a.id} style={{ display: "flex", alignItems: "center", gap: 6, background: C.surfaceElevated, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, color: C.textSecondary }}>
                  <input type="checkbox" style={{ accentColor: C.accent }} /> {a.name_ar}
                </label>
              ))}
            </div>
          </Field>
          <Field label="ملاحظات">
            <textarea placeholder="ملاحظات إضافية..." rows={3} style={{ width: "100%", background: C.surfaceElevated, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", color: C.textPrimary, fontSize: 13, resize: "vertical" }} />
          </Field>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button style={{ flex: 1, background: C.accent, border: "none", borderRadius: 10, padding: 12, color: "#fff", fontWeight: 700, fontSize: 14 }}>حفظ وإرسال للاعتماد</button>
            <button onClick={() => setShowAddModal(false)} style={{ background: C.surfaceElevated, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 20px", color: C.textSecondary, fontSize: 13 }}>إلغاء</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
