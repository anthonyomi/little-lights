import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// FIREBASE CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCM5yrkzuDeX1Fhz8R3NJ18PuzbA7IK8CM",
  authDomain: "little-lights-church.firebaseapp.com",
  databaseURL: "https://little-lights-church-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "little-lights-church",
  storageBucket: "little-lights-church.firebasestorage.app",
  messagingSenderId: "327380416801",
  appId: "1:327380416801:web:a95833df74f9d473e36660",
};

const ADMIN_EMAIL = "anthony.omisade@yahoo.co.uk";

let firebaseApp = null, auth = null, db = null, storage = null;
function initFirebase() {
  if (firebaseApp) return;
  try {
    firebaseApp = window.firebase.initializeApp(FIREBASE_CONFIG);
    auth = window.firebase.auth();
    db = window.firebase.database();
    storage = window.firebase.storage();
  } catch (e) { console.error("Firebase init error", e); }
}

function getGoogleProvider() {
  const provider = new window.firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGO
// ─────────────────────────────────────────────────────────────────────────────
function LittleLightsLogo({ size = "full", theme = "dark", scale = 1 }) {
  // size: "full" = icon + stacked wordmark, "compact" = icon + single-line, "icon" = icon only
  // theme: "dark" (on dark bg), "light" (on white), "teal" (on teal)

  const iconSize = (size === "compact" ? 32 : size === "icon" ? 40 : 48) * scale;
  const cx = iconSize / 2, cy = iconSize / 2;
  const r1 = iconSize * 0.42, r2 = iconSize * 0.31, r3 = iconSize * 0.22, r4 = iconSize * 0.145;
  const rayLong = iconSize * 0.08, rayShort = iconSize * 0.065;
  const rayStart = iconSize * 0.5, rayDiagStart = iconSize * 0.44;

  const ringOpacity = theme === "light" ? 1 : theme === "teal" ? 0.18 : 0.18;
  const ring1Fill = theme === "light" ? "#FEF9C3" : theme === "teal" ? "white" : "#FEF9C3";
  const ring2Fill = theme === "light" ? "#FEF3C7" : theme === "teal" ? "white" : "#FEF3C7";
  const ring3Fill = theme === "light" ? "#FDE68A" : theme === "teal" ? "white" : "#FDE68A";
  const coreFill = theme === "teal" ? "#FDE68A" : "#F59E0B";
  const rayColor = theme === "light" ? "#F59E0B" : theme === "teal" ? "rgba(255,255,255,0.55)" : "#FCD34D";
  const diagRayColor = theme === "light" ? "#FCD34D" : theme === "teal" ? "rgba(255,255,255,0.35)" : "#FCD34D";

  const titleColor = theme === "light" ? "#1A2744" : "white";
  const subtitleColor = theme === "light" ? "#0284C7" : theme === "teal" ? "rgba(255,255,255,0.85)" : "#7DD3FC";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: size === "compact" ? 10 : 14 }}>
      {/* Icon */}
      <svg width={iconSize} height={iconSize} viewBox={`0 0 ${iconSize} ${iconSize}`} fill="none" style={{ flexShrink: 0 }}>
        <circle cx={cx} cy={cy} r={r1} fill={ring1Fill} opacity={theme === "light" ? 0.6 : ringOpacity * 1.2}/>
        <circle cx={cx} cy={cy} r={r2} fill={ring2Fill} opacity={theme === "light" ? 0.75 : ringOpacity * 1.5}/>
        <circle cx={cx} cy={cy} r={r3} fill={ring3Fill} opacity={theme === "light" ? 0.85 : ringOpacity * 2}/>
        <circle cx={cx} cy={cy} r={r4} fill={coreFill}/>
        {/* Child silhouette */}
        <circle cx={cx} cy={cy - r4 * 0.4} r={r4 * 0.38} fill="white"/>
        <path d={`M${cx - r4 * 0.75} ${cy + r4 * 0.85} Q${cx} ${cy + r4 * 0.2} ${cx + r4 * 0.75} ${cy + r4 * 0.85}`} fill="white"/>
        {/* Cardinal rays */}
        <line x1={cx} y1={cx - rayStart} x2={cx} y2={cx - rayStart + rayLong} stroke={rayColor} strokeWidth="2" strokeLinecap="round"/>
        <line x1={cx} y1={cx + rayStart} x2={cx} y2={cx + rayStart - rayLong} stroke={rayColor} strokeWidth="2" strokeLinecap="round"/>
        <line x1={cx - rayStart} y1={cy} x2={cx - rayStart + rayLong} y2={cy} stroke={rayColor} strokeWidth="2" strokeLinecap="round"/>
        <line x1={cx + rayStart} y1={cy} x2={cx + rayStart - rayLong} y2={cy} stroke={rayColor} strokeWidth="2" strokeLinecap="round"/>
        {/* Diagonal rays */}
        <line x1={cx - rayDiagStart} y1={cy - rayDiagStart} x2={cx - rayDiagStart + rayShort} y2={cy - rayDiagStart + rayShort} stroke={diagRayColor} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1={cx + rayDiagStart} y1={cy + rayDiagStart} x2={cx + rayDiagStart - rayShort} y2={cy + rayDiagStart - rayShort} stroke={diagRayColor} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1={cx + rayDiagStart} y1={cy - rayDiagStart} x2={cx + rayDiagStart - rayShort} y2={cy - rayDiagStart + rayShort} stroke={diagRayColor} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1={cx - rayDiagStart} y1={cy + rayDiagStart} x2={cx - rayDiagStart + rayShort} y2={cy + rayDiagStart - rayShort} stroke={diagRayColor} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>

      {/* Wordmark */}
      {size !== "icon" && (
        <div>
          <div style={{ fontFamily: SERIF, fontWeight: 400, color: titleColor, lineHeight: 1.1,
            fontSize: (size === "compact" ? 17 : 22) * scale, letterSpacing: ".01em" }}>Little</div>
          <div style={{ fontFamily: SERIF, fontWeight: 400, color: subtitleColor, lineHeight: 1.1,
            fontSize: (size === "compact" ? 17 : 22) * scale, letterSpacing: ".01em" }}>Lights</div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function getSundays(year, month) {
  const days = [], d = new Date(year, month, 1);
  while (d.getMonth() === month) { if (d.getDay() === 0) days.push(new Date(d)); d.setDate(d.getDate() + 1); }
  return days;
}
function dateKey(d) {
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${day}`;
}
function formatDate(d) { return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }); }
function formatShortDate(d) { return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
function formatStoredDate(str) {
  if (!str) return "—";
  const d = new Date(str);
  if (isNaN(d)) return str;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function stampNow() {
  const n = new Date();
  return n.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) + " · " + n.toTimeString().slice(0, 5);
}
function uid() { return "c" + Date.now() + Math.random().toString(36).slice(2, 6); }
function generateScanToken() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getAgeGroup(age) {
  const a = parseInt(age);
  if (isNaN(a)) return null;
  if (a <= 5) return { label: "Nursery", color: "#E0F2FE", text: "#0369A1" };
  return { label: "Juniors", color: "#F0FDF4", text: "#166534" };
}
function getAge(dob) {
  if (!dob) return null;
  const today = new Date(), birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// Returns live age from DOB if available, otherwise falls back to stored age
function liveAge(child) {
  if (child.dob) {
    const a = getAge(child.dob);
    if (a !== null) return a;
  }
  return parseInt(child.age) || 0;
}
function isBirthdayThisWeek(dob) {
  if (!dob) return false;
  const today = new Date();
  const birth = new Date(dob);
  const upcoming = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  const diff = (upcoming - today) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 7;
}
function weeksAbsent(childId, attendance, enrolled) {
  const sundays = [];
  const today = new Date();
  // Don't count weeks before the child was enrolled
  const enrolledDate = enrolled ? new Date(enrolled) : null;
  for (let i = 0; i < 8; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - d.getDay() - i * 7);
    // Skip any Sundays before the child's enrolled date
    if (enrolledDate && d < enrolledDate) break;
    sundays.push(dateKey(d));
  }
  let count = 0;
  for (const s of sundays) {
    if (attendance[s]?.[childId]) return count;
    count++;
  }
  return count;
}

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  bg: "#F0F7FF",
  sidebar: "#1A2744",
  sidebarAccent: "#253258",
  white: "#FFFFFF",
  teal: "#0284C7",
  tealLight: "#E0F2FE",
  tealDark: "#0369A1",
  slate50: "#F8FAFC",
  slate100: "#F1F5F9",
  slate200: "#E2E8F0",
  slate300: "#CBD5E1",
  slate400: "#94A3B8",
  slate500: "#64748B",
  slate600: "#475569",
  slate700: "#334155",
  slate800: "#1E293B",
  slate900: "#0F172A",
  red: "#EF4444",
  redLight: "#FEE2E2",
  amber: "#F59E0B",
  amberLight: "#FEF3C7",
  green: "#059669",
  greenLight: "#D1FAE5",
  blue: "#2563EB",
  blueLight: "#DBEAFE",
  coral: "#F97316",
  coralLight: "#FFEDD5",
  purple: "#7C3AED",
  purpleLight: "#EDE9FE",
};
const FONT = "'DM Sans', sans-serif";
const SERIF = "'DM Serif Display', serif";

// ─────────────────────────────────────────────────────────────────────────────
// SVG ICONS
// ─────────────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const paths = {
    checkin: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    children: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    dashboard: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    activity: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    settings: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    logout: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    plus: "M12 4v16m8-8H4",
    edit: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    trash: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
    download: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
    birthday: "M21 15.546c-.523 0-1.046.151-1.5.454a2.708 2.708 0 01-3 0 2.708 2.708 0 00-3 0 2.708 2.708 0 01-3 0 2.708 2.708 0 00-3 0 2.708 2.708 0 01-1.5-.454M9 6l3-3 3 3m-3-3v12",
    alert: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    siblings: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    chevronRight: "M9 5l7 7-7 7",
    qr: "M3 3h7v7H3V3zm1 1v5h5V4H4zm1 1h3v3H5V5zm8-2h7v7h-7V3zm1 1v5h5V4h-5zm1 1h3v3h-3V5zM3 13h7v7H3v-7zm1 1v5h5v-5H4zm1 1h3v3H5v-3zm8 0h2v2h-2v-2zm0 4h2v2h-2v-2zm-2-4h2v2h-2v-2zm4-2h2v2h-2v-2zm2 2h2v2h-2v-2zm0 2h-2v2h4v-4h-2v2zm-4 2h2v2h-2v-2z",
    scan: "M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm11-2h2v2h-2v-2zm-4 0h2v2h-2v-2zm2 4h2v2h-2v-2zm2 0h2v2h-2v-2zm0 2h-2v2h4v-4h-2v2zm-4-2h2v2h-2v-2z",
    share: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z",
    chevronDown: "M19 9l-7 7-7-7",
    x: "M6 18L18 6M6 6l12 12",
    check: "M5 13l4 4L19 7",
    mail: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    medical: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    eye: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    menu: "M4 6h16M4 12h16M4 18h16",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]?.split("M").filter(Boolean).map((p, i) => (
        <path key={i} d={"M" + p} />
      ))}
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// UI ATOMS
// ─────────────────────────────────────────────────────────────────────────────
const avatarColors = ["#0D9488","#3B82F6","#8B5CF6","#EC4899","#F59E0B","#10B981","#EF4444"];

function Avatar({ child, size = 40, photoUrl = null }) {
  const initials = child?.name ? child.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?";
  const bg = avatarColors[(child?.name?.charCodeAt(0) || 0) % avatarColors.length];
  if (photoUrl) return <img src={photoUrl} alt={child?.name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `2px solid ${T.slate200}` }} />;
  return <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600, fontSize: size * 0.35, flexShrink: 0, fontFamily: FONT, letterSpacing: ".02em" }}>{initials}</div>;
}

function usePhotoUrl(childId) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!childId || !storage) return;
    storage.ref(`photos/${childId}`).getDownloadURL().then(u => setUrl(u)).catch(() => setUrl(null));
  }, [childId]);
  return url;
}

// Lazy-loading avatar: only fetches the photo when the element scrolls into view.
// On low-RAM devices (Samsung Galaxy Tab A etc.) loading all 40+ photos at once
// causes Chrome to OOM-crash before the user sees anything.
function ChildAvatar({ child, size = 40 }) {
  const [visible, setVisible] = useState(false);
  const [url, setUrl] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // IntersectionObserver is available in all modern browsers incl. Android Chrome
    if (!("IntersectionObserver" in window)) { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: "200px" } // start loading a bit before it scrolls into view
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !child?.id || !storage) return;
    storage.ref(`photos/${child.id}`).getDownloadURL().then(u => setUrl(u)).catch(() => setUrl(null));
  }, [visible, child?.id]);

  return <span ref={ref}><Avatar child={child} size={size} photoUrl={url} /></span>;
}

function Badge({ label, color, bg }) {
  return <span style={{ display: "inline-flex", alignItems: "center", lineHeight: 1, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: bg || T.slate100, color: color || T.slate600, letterSpacing: ".02em", whiteSpace: "nowrap", verticalAlign: "middle" }}>{label}</span>;
}

function MedicalBadge() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, lineHeight: 1, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: T.amberLight, color: T.amber, whiteSpace: "nowrap", verticalAlign: "middle" }}>
      <span style={{ display: "inline-block", width: 10, height: 10, position: "relative", flexShrink: 0 }}>
        <span style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 2, background: T.amber, transform: "translateY(-50%)", borderRadius: 1 }} />
        <span style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: T.amber, transform: "translateX(-50%)", borderRadius: 1 }} />
      </span>
      Medical
    </span>
  );
}

function Btn({ onClick, variant = "primary", children, small, full, disabled, style: sx = {} }) {
  const styles = {
    primary: { bg: T.teal, color: "#fff", border: "none", shadow: "0 1px 3px rgba(13,148,136,.3)" },
    secondary: { bg: T.white, color: T.slate700, border: `1.5px solid ${T.slate200}`, shadow: "0 1px 2px rgba(0,0,0,.05)" },
    danger: { bg: T.redLight, color: T.red, border: "none", shadow: "none" },
    ghost: { bg: "transparent", color: T.slate500, border: "none", shadow: "none" },
  };
  const s = styles[variant] || styles.primary;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? T.slate100 : s.bg, color: disabled ? T.slate400 : s.color,
      border: s.border || "none", borderRadius: 8,
      padding: small ? "6px 14px" : "9px 18px",
      fontSize: small ? 13 : 14, fontWeight: 500, fontFamily: FONT,
      cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: s.shadow, transition: "all .15s",
      width: full ? "100%" : "auto", whiteSpace: "nowrap",
      display: "inline-flex", alignItems: "center", gap: 6,
      ...sx,
    }}>{children}</button>
  );
}

function Input({ label, value, onChange, type = "text", placeholder, readOnly, style: sx = {} }) {
  const inpStyle = { width: "100%", border: `1.5px solid ${T.slate200}`, borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: FONT, background: readOnly ? T.slate50 : T.white, color: T.slate800, outline: "none", boxSizing: "border-box", ...sx };
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.slate500, marginBottom: 5, textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</label>}
      <input type={type} value={value || ""} onChange={onChange} placeholder={placeholder} readOnly={readOnly} style={inpStyle} />
    </div>
  );
}

function Select({ label, value, onChange, children, style: sx = {} }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.slate500, marginBottom: 5, textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</label>}
      <select value={value} onChange={onChange} style={{ width: "100%", border: `1.5px solid ${T.slate200}`, borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: FONT, background: T.white, color: T.slate800, outline: "none", boxSizing: "border-box", ...sx }}>
        {children}
      </select>
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 3 }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.slate500, marginBottom: 5, textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</label>}
      <textarea value={value || ""} onChange={onChange} rows={rows} style={{ width: "100%", border: `1.5px solid ${T.slate200}`, borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: FONT, background: T.white, color: T.slate800, outline: "none", resize: "none", boxSizing: "border-box" }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DATE PICKER
// ─────────────────────────────────────────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS = Array.from({length: 31}, (_, i) => String(i+1).padStart(2,"0"));

function DatePicker({ label, value, onChange, dobMode = false, hasError = false, yearRange }) {
  // Parse initial value only — never reset from parent after mount
  const parse = v => {
    if (!v) return { d: "", m: "", y: "" };
    const p = v.split("-");
    return { y: p[0] || "", m: p[1] || "", d: p[2] || "" };
  };
  const [d, setD] = useState(() => parse(value).d);
  const [m, setM] = useState(() => parse(value).m);
  const [y, setY] = useState(() => parse(value).y);

  const cy = new Date().getFullYear();
  const years = dobMode
    ? Array.from({length: cy - 2013}, (_, i) => cy - i)
    : Array.from({length: yearRange || 10}, (_, i) => cy - i);

  const handleD = val => { setD(val); if (val && m && y) onChange(`${y}-${m}-${val}`); };
  const handleM = val => { setM(val); if (d && val && y) onChange(`${y}-${val}-${d}`); };
  const handleY = val => { setY(val); if (d && m && val) onChange(`${val}-${m}-${d}`); };

  const s = { border: `1.5px solid ${hasError ? T.red : T.slate200}`, borderRadius: 8, padding: "9px 8px", fontSize: 13, fontFamily: FONT, background: T.white, color: T.slate800, outline: "none", boxSizing: "border-box", width: "100%" };

  return (
    <div style={{ marginBottom: 0 }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.slate500, marginBottom: 5, textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</label>}
      <div style={{ display: "grid", gridTemplateColumns: "80px minmax(100px, 1fr) 90px", gap: 6 }}>
        <select style={s} value={d} onChange={e => handleD(e.target.value)}>
          <option value="">DD</option>
          {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
        </select>
        <select style={s} value={m} onChange={e => handleM(e.target.value)}>
          <option value="">Month</option>
          {MONTHS.map((mo, i) => <option key={mo} value={String(i+1).padStart(2,"0")}>{mo}</option>)}
        </select>
        <select style={s} value={y} onChange={e => handleY(e.target.value)}>
          <option value="">Year</option>
          {years.map(yr => <option key={yr} value={String(yr)}>{yr}</option>)}
        </select>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, wide, subtitle }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.5)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: T.white, borderRadius: 16, width: "100%", maxWidth: wide ? 700 : 500, maxHeight: "92vh", overflowY: "auto", overflowX: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,.2)", animation: "slideUp .2s ease" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.slate100}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: T.slate900, fontFamily: FONT }}>{title}</h2>
            {subtitle && <p style={{ margin: "3px 0 0", fontSize: 13, color: T.slate400 }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{ background: T.slate100, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.slate500, flexShrink: 0 }}>
            <Icon name="x" size={16} />
          </button>
        </div>
        <div className="modal-inner" style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHILD FORM
// ─────────────────────────────────────────────────────────────────────────────
function ChildForm({ initial, onSave, onClose, allChildren }) {
  const blank = { name: "", age: "", gender: "Girl", dob: "", medical: "No known conditions", parent1: "", parent1phone: "", parent2: "", parent2phone: "", collector1: "", collector2: "", notes: "", enrolled: dateKey(new Date()), siblings: [], visitor: false };
  const [form, setForm] = useState(initial || blank);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [siblingSearch, setSiblingSearch] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const fileRef = useRef();

  useEffect(() => {
    if (initial?.id && storage) {
      storage.ref(`photos/${initial.id}`).getDownloadURL().then(url => setPhotoPreview(url)).catch(() => {});
    }
  }, [initial?.id]);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setFormErrors(e => ({ ...e, [k]: null })); };

  const handlePhoto = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
    setForm(p => ({ ...p, _photoFile: file }));
  };

  const handleSave = async () => {
    // Validate mandatory fields
    const errors = {};
    if (!form.name.trim()) errors.name = "Full name is required";
    if (!form.dob) errors.dob = "Date of birth is required";
    if (!form.gender) errors.gender = "Gender is required";
    if (!form.parent1?.trim()) errors.parent1 = "Parent / Guardian 1 is required";
    if (!form.parent1phone?.trim()) errors.parent1phone = "Phone 1 is required";
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

    const id = form.id || uid();
    if (form._photoFile && storage) {
      setUploading(true);
      try { await storage.ref(`photos/${id}`).put(form._photoFile); } catch {}
      setUploading(false);
    }
    const { _photoFile, ...data } = form;
    const age = data.dob ? getAge(data.dob) : data.age;
    onSave({ ...data, id, age });
  };

  const toggleSibling = (sibId) => {
    const current = form.siblings || [];
    if (current.includes(sibId)) set("siblings", current.filter(s => s !== sibId));
    else set("siblings", [...current, sibId]);
  };

  const otherChildren = (allChildren || []).filter(c => c.id !== form.id);
  const filteredSiblings = otherChildren.filter(c =>
    !siblingSearch || c.name.toLowerCase().includes(siblingSearch.toLowerCase())
  );
  const selectedSiblings = otherChildren.filter(c => (form.siblings || []).includes(c.id));

  const lbl = (text, required) => (
    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.slate500, marginBottom: 5, textTransform: "uppercase", letterSpacing: ".06em" }}>
      {text}{required && <span style={{ color: T.red, marginLeft: 2 }}>*</span>}
    </label>
  );
  const errStyle = { fontSize: 12, color: T.red, marginTop: 4, marginBottom: 8 };

  return (
    <div style={{ fontFamily: FONT }}>
      {/* Photo */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, padding: 16, background: T.slate50, borderRadius: 12, border: `1px solid ${T.slate200}` }}>
        {photoPreview
          ? <img src={photoPreview} alt="preview" style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", border: `2px solid ${T.slate200}` }} />
          : <Avatar child={form} size={60} />
        }
        <div>
          <Btn variant="secondary" small onClick={() => fileRef.current.click()}>{photoPreview ? "Change photo" : "Upload photo"}</Btn>
          {photoPreview && <Btn variant="ghost" small onClick={() => { setPhotoPreview(null); setForm(p => ({ ...p, _photoFile: null })); }} style={{ marginLeft: 8, color: T.red }}>Remove</Btn>}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
          <p style={{ margin: "6px 0 0", fontSize: 12, color: T.slate400 }}>JPG, PNG or GIF</p>
        </div>
      </div>

      {/* Row 1: Full Name + Gender */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: "0 16px", marginBottom: 0 }}>
        <div style={{ marginBottom: 14 }}>
          {lbl("Full Name", true)}
          <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Emma Thompson"
            style={{ width: "100%", border: `1.5px solid ${formErrors.name ? T.red : T.slate200}`, borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: FONT, background: T.white, outline: "none", boxSizing: "border-box" }} />
          {formErrors.name && <p style={errStyle}>{formErrors.name}</p>}
        </div>
        <div style={{ marginBottom: 14 }}>
          {lbl("Gender", true)}
          <select value={form.gender} onChange={e => set("gender", e.target.value)}
            style={{ width: "100%", border: `1.5px solid ${formErrors.gender ? T.red : T.slate200}`, borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: FONT, background: T.white, outline: "none", boxSizing: "border-box" }}>
            <option>Girl</option><option>Boy</option>
          </select>
        </div>
      </div>

      {/* Row 2: Date of Birth + Age (auto-calculated) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: "0 16px", marginBottom: 0 }}>
        <div style={{ marginBottom: 14 }}>
          {lbl("Date of Birth", true)}
          <DatePicker
            value={form.dob || ""}
            dobMode
            hasError={!!formErrors.dob}
            onChange={dob => {
              set("dob", dob);
              const a = getAge(dob);
              if (a !== null) set("age", a);
            }}
          />
          {formErrors.dob && <p style={errStyle}>{formErrors.dob}</p>}
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.slate500, marginBottom: 5, textTransform: "uppercase", letterSpacing: ".06em" }}>Age</label>
          <input readOnly value={form.age !== "" ? `${form.age} yrs` : "—"} style={{ width: "100%", border: `1.5px solid ${T.slate200}`, borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: FONT, background: T.slate50, color: T.teal, fontWeight: 500, outline: "none", boxSizing: "border-box" }} />
        </div>
      </div>

      {/* Visitor toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: form.visitor ? "#F5F3FF" : T.slate50, border: `1.5px solid ${form.visitor ? "#C4B5FD" : T.slate200}`, borderRadius: 10, marginBottom: 14, cursor: "pointer" }}
        onClick={() => set("visitor", !form.visitor)}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: T.slate800 }}>
            {form.visitor ? "Visitor" : "Member"}
          </div>
          <div style={{ fontSize: 12, color: T.slate400, marginTop: 2 }}>
            {form.visitor ? "Attends occasionally — won't trigger absence alerts" : "Regular attender — absence alerts apply"}
          </div>
        </div>
        <div style={{ width: 44, height: 24, borderRadius: 12, background: form.visitor ? "#7C3AED" : T.slate200, position: "relative", transition: "background .2s", flexShrink: 0 }}>
          <div style={{ position: "absolute", top: 2, left: form.visitor ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,.2)", transition: "left .2s" }} />
        </div>
      </div>

      {/* Medical */}
      <div style={{ background: "#FFFBEB", border: `1.5px solid #FDE68A`, borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#92400E", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>Medical / Allergy Information</label>
        <textarea value={form.medical || ""} onChange={e => set("medical", e.target.value)} rows={2} style={{ width: "100%", border: "none", background: "transparent", fontSize: 14, resize: "none", outline: "none", fontFamily: FONT, boxSizing: "border-box", color: "#78350F" }} />
      </div>

      {/* Parent 1 row — mandatory */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0 16px" }}>
        <div style={{ marginBottom: 14 }}>
          {lbl("Parent / Guardian 1", true)}
          <input value={form.parent1 || ""} onChange={e => set("parent1", e.target.value)} placeholder="Full name"
            style={{ width: "100%", border: `1.5px solid ${formErrors.parent1 ? T.red : T.slate200}`, borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: FONT, background: T.white, outline: "none", boxSizing: "border-box" }} />
          {formErrors.parent1 && <p style={errStyle}>{formErrors.parent1}</p>}
        </div>
        <div style={{ marginBottom: 14 }}>
          {lbl("Phone 1", true)}
          <input type="tel" value={form.parent1phone || ""} onChange={e => set("parent1phone", e.target.value)} placeholder="07700 900000"
            style={{ width: "100%", border: `1.5px solid ${formErrors.parent1phone ? T.red : T.slate200}`, borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: FONT, background: T.white, outline: "none", boxSizing: "border-box" }} />
          {formErrors.parent1phone && <p style={errStyle}>{formErrors.parent1phone}</p>}
        </div>
      </div>

      {/* Parent 2 row — optional */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0 16px" }}>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.slate500, marginBottom: 5, textTransform: "uppercase", letterSpacing: ".06em" }}>Parent / Guardian 2 <span style={{ color: T.slate300, fontWeight: 400 }}>(optional)</span></label>
          <input value={form.parent2 || ""} onChange={e => set("parent2", e.target.value)} placeholder="Full name"
            style={{ width: "100%", border: `1.5px solid ${T.slate200}`, borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: FONT, background: T.white, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.slate500, marginBottom: 5, textTransform: "uppercase", letterSpacing: ".06em" }}>Phone 2 <span style={{ color: T.slate300, fontWeight: 400 }}>(optional)</span></label>
          <input type="tel" value={form.parent2phone || ""} onChange={e => set("parent2phone", e.target.value)} placeholder="07700 900000"
            style={{ width: "100%", border: `1.5px solid ${T.slate200}`, borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: FONT, background: T.white, outline: "none", boxSizing: "border-box" }} />
        </div>
      </div>

      {/* Approved collectors — optional */}
      <div style={{ background: "#F0FDF4", border: `1.5px solid #BBF7D0`, borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#166534", marginBottom: 2, textTransform: "uppercase", letterSpacing: ".06em" }}>Approved Collectors <span style={{ color: "#86EFAC", fontWeight: 400 }}>(optional)</span></label>
        <p style={{ margin: "0 0 10px", fontSize: 12, color: "#15803D" }}>People authorised to collect this child other than the parents.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0 16px" }}>
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#166534", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".06em" }}>Collector 1</label>
            <input value={form.collector1 || ""} onChange={e => set("collector1", e.target.value)} placeholder="Full name"
              style={{ width: "100%", border: `1.5px solid #BBF7D0`, borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: FONT, background: T.white, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#166534", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".06em" }}>Collector 2</label>
            <input value={form.collector2 || ""} onChange={e => set("collector2", e.target.value)} placeholder="Full name"
              style={{ width: "100%", border: `1.5px solid #BBF7D0`, borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: FONT, background: T.white, outline: "none", boxSizing: "border-box" }} />
          </div>
        </div>
      </div>

      {/* Teacher notes — optional */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.slate500, marginBottom: 5, textTransform: "uppercase", letterSpacing: ".06em" }}>Teacher Notes <span style={{ color: T.slate300, fontWeight: 400 }}>(optional)</span></label>
        <textarea value={form.notes || ""} onChange={e => set("notes", e.target.value)} rows={2}
          style={{ width: "100%", border: `1.5px solid ${T.slate200}`, borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: FONT, background: T.white, resize: "none", outline: "none", boxSizing: "border-box" }} />
      </div>

      {/* Siblings — searchable */}
      {otherChildren.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.slate500, marginBottom: 8, textTransform: "uppercase", letterSpacing: ".06em" }}>
            Siblings <span style={{ color: T.slate300, fontWeight: 400 }}>(optional)</span>
          </label>

          {/* Selected siblings */}
          {selectedSiblings.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              {selectedSiblings.map(c => (
                <button key={c.id} onClick={() => toggleSibling(c.id)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px 4px 6px", borderRadius: 20, border: `1.5px solid ${T.teal}`, background: T.tealLight, cursor: "pointer", fontSize: 13, color: T.tealDark, fontFamily: FONT, fontWeight: 500 }}>
                  <ChildAvatar child={c} size={20} />
                  {c.name}
                  <Icon name="x" size={12} color={T.tealDark} />
                </button>
              ))}
            </div>
          )}

          {/* Search */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}><Icon name="search" size={14} color={T.slate400} /></div>
            <input value={siblingSearch} onChange={e => setSiblingSearch(e.target.value)} placeholder="Search for a sibling by name…"
              style={{ width: "100%", border: `1.5px solid ${T.slate200}`, borderRadius: 8, padding: "8px 12px 8px 32px", fontSize: 13, fontFamily: FONT, background: T.white, outline: "none", boxSizing: "border-box" }} />
          </div>

          {/* Results */}
          {siblingSearch && (
            <div style={{ marginTop: 6, border: `1px solid ${T.slate200}`, borderRadius: 8, overflow: "hidden", maxHeight: 200, overflowY: "auto" }}>
              {filteredSiblings.length === 0 && <p style={{ padding: "10px 12px", fontSize: 13, color: T.slate400 }}>No children found.</p>}
              {filteredSiblings.map(c => {
                const isSelected = (form.siblings || []).includes(c.id);
                return (
                  <button key={c.id} onClick={() => { toggleSibling(c.id); setSiblingSearch(""); }}
                    style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", border: "none", borderBottom: `1px solid ${T.slate100}`, background: isSelected ? T.tealLight : T.white, cursor: "pointer", fontSize: 13, color: T.slate800, fontFamily: FONT, textAlign: "left" }}>
                    <ChildAvatar child={c} size={28} />
                    <span style={{ flex: 1 }}>{c.name} <span style={{ color: T.slate400 }}>· Age {c.age}</span></span>
                    {isSelected && <Icon name="check" size={14} color={T.teal} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8, borderTop: `1px solid ${T.slate100}` }}>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn onClick={handleSave} disabled={uploading}>{uploading ? "Uploading…" : initial ? "Save Changes" : "Add Child"}</Btn>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHILD DETAIL
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// QR CODE GENERATION (pure canvas, no library)
// ─────────────────────────────────────────────────────────────────────────────
function QRImage({ text, size = 200 }) {
  // Use api.qrserver.com — a reliable free public QR API, no CDN needed
  if (!text) return <div style={{ width: size, height: size, background: T.slate100, borderRadius: 8 }} />;
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&color=0F172A&bgcolor=FFFFFF&qzone=1&format=png`;
  return <img src={url} width={size} height={size} alt="QR Code" style={{ display: "block", borderRadius: 4 }} />;
}

function QRDisplay({ child, allChildren, onClose }) {
  // Get the family — child + all siblings
  const siblings = (child.siblings || []).map(id => allChildren.find(c => c.id === id)).filter(Boolean);
  const family = [child, ...siblings].sort((a, b) => (liveAge(b) || 0) - (liveAge(a) || 0));
  const isFamily = family.length > 1;

  // Use or generate a scan token — stored on the "eldest" child (first in sorted family)
  const tokenHolder = family[0];
  const scanToken = tokenHolder.scanToken || null;

  const qrText = scanToken ? `${window.location.origin}${window.location.pathname}?scan=${scanToken}` : "";
  // qrText is used by QRImage directly

  const [generating, setGenerating] = useState(!scanToken);

  useEffect(() => {
    if (!scanToken) {
      // Generate and save a new token
      const token = generateScanToken();
      db.ref(`children/${tokenHolder.id}/scanToken`).set(token).then(() => setGenerating(false));
      // Also save on all siblings so they all know the token
      for (const sib of siblings) {
        db.ref(`children/${sib.id}/scanToken`).set(token);
      }
    }
  }, []);

  const handleShare = async () => {
    if (!qrText) return;
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrText)}&color=0F172A&bgcolor=FFFFFF&qzone=1&format=png`;
    const fileName = `${isFamily ? family.map(c => c.name.split(" ")[0]).join("-") : child.name.replace(/ /g,"-")}-qr.png`;
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], fileName, { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `Little Lights QR — ${isFamily ? family.map(c => c.name.split(" ")[0]).join(", ") : child.name}` });
        return;
      }
    } catch {}
    // Fallback: open QR in new tab
    window.open(url, "_blank");
  };

  return (
    <div style={{ fontFamily: FONT, textAlign: "center" }}>
      {/* Family header */}
      <div style={{ background: T.slate50, borderRadius: 12, padding: "14px 16px", marginBottom: 20, border: `1px solid ${T.slate200}` }}>
        <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 600, color: T.slate500, textTransform: "uppercase", letterSpacing: ".06em" }}>
          {isFamily ? "Family QR Code" : "Child QR Code"}
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          {family.map(c => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 6, background: T.white, border: `1px solid ${T.slate200}`, borderRadius: 20, padding: "4px 10px 4px 4px" }}>
              <ChildAvatar child={c} size={24} />
              <span style={{ fontSize: 13, fontWeight: 500, color: T.slate800 }}>{c.name.split(" ")[0]}</span>
              <Badge label={getAgeGroup(liveAge(c))?.label || ""} bg={getAgeGroup(liveAge(c))?.color} color={getAgeGroup(liveAge(c))?.text} />
            </div>
          ))}
        </div>
      </div>

      {/* QR Code */}
      {generating ? (
        <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: T.slate400, fontSize: 14 }}>Generating QR code…</div>
      ) : (
        <div style={{ display: "inline-block", padding: 16, background: T.white, borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,.1)", border: `1px solid ${T.slate200}`, marginBottom: 20 }}>
          <QRImage text={qrText} size={200} />
        </div>
      )}

      <p style={{ fontSize: 13, color: T.slate400, marginBottom: 20, lineHeight: 1.5 }}>
        {isFamily ? `Share this QR code with the ${family[0].name.split(" ").slice(-1)[0]} family.` : `Share this QR code with ${child.name.split(" ")[0]}'s parent.`}
        <br/>The teacher will scan it on Sunday to check {isFamily ? "everyone" : "them"} in.
      </p>

      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <Btn variant="secondary" onClick={onClose}>Close</Btn>
        <Btn onClick={handleShare} disabled={generating}>
          <Icon name="share" size={14} />Share / Download
        </Btn>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QR SCANNER + FAMILY CONFIRMATION
// ─────────────────────────────────────────────────────────────────────────────
function QRScanner({ children, attendance, sessionKey, sessionAtt, teacherName, onClose, onCheckIn }) {
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState("");
  const [family, setFamily] = useState(null);
  const [selected, setSelected] = useState({});
  const [checking, setChecking] = useState(false);
  const [success, setSuccess] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const activeRef = useRef(true);
  const rafRef = useRef(null);
  const canvas = useRef(document.createElement("canvas"));
  const detectorRef = useRef(null);

  useEffect(() => {
    activeRef.current = true;

    const hasBarcodeDetector = "BarcodeDetector" in window;

    // Load jsQR from unpkg for Safari (BarcodeDetector not available on iOS Safari)
    const loadLibAndStart = () => {
      if (hasBarcodeDetector) {
        try {
          detectorRef.current = new window.BarcodeDetector({ formats: ["qr_code"] });
        } catch {}
        startCamera();
        return;
      }
      // Safari fallback: load jsQR from unpkg
      if (window.jsQR) { startCamera(); return; }
      const s = document.createElement("script");
      s.src = "https://unpkg.com/jsqr@1.4.0/dist/jsQR.js";
      s.onload = () => startCamera();
      s.onerror = () => {
        // Try jsdelivr as backup
        const s2 = document.createElement("script");
        s2.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js";
        s2.onload = () => startCamera();
        s2.onerror = () => setError("Could not load QR scanner. Please check your internet connection.");
        document.head.appendChild(s2);
      };
      document.head.appendChild(s);
    };

    const startCamera = async () => {
      if (!activeRef.current) return;
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } } });
      } catch {
        try { stream = await navigator.mediaDevices.getUserMedia({ video: true }); }
        catch { setError("Camera unavailable. Please allow camera access for littlelights.co in Settings."); return; }
      }
      if (!activeRef.current) { stream.getTracks().forEach(t => t.stop()); return; }
      streamRef.current = stream;
      const vid = videoRef.current;
      if (vid) { vid.srcObject = stream; vid.play().catch(() => {}); }
      const wait = setInterval(() => {
        const v = videoRef.current;
        if (v && v.videoWidth > 0) { clearInterval(wait); startScanLoop(); }
      }, 150);
    };

    loadLibAndStart();

    return () => {
      activeRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
      if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
  };

  // Use interval-based scanning — safer with async BarcodeDetector
  const scanIntervalRef = useRef(null);

  const startScanLoop = () => {
    if (scanIntervalRef.current) return;
    scanIntervalRef.current = setInterval(async () => {
      if (!activeRef.current) { clearInterval(scanIntervalRef.current); return; }
      const vid = videoRef.current;
      if (!vid || vid.videoWidth === 0) return;

      try {
        // Method 1: BarcodeDetector (Chrome/Android)
        if (detectorRef.current) {
          const codes = await detectorRef.current.detect(vid);
          if (codes.length > 0 && activeRef.current) {
            activeRef.current = false;
            clearInterval(scanIntervalRef.current);
            handleScan(codes[0].rawValue);
            return;
          }
        }
        // Method 2: jsQR (Safari/iOS fallback)
        else if (window.jsQR) {
          const c = canvas.current;
          c.width = vid.videoWidth;
          c.height = vid.videoHeight;
          const ctx = c.getContext("2d");
          ctx.drawImage(vid, 0, 0);
          const img = ctx.getImageData(0, 0, c.width, c.height);
          const code = window.jsQR(img.data, img.width, img.height, { inversionAttempts: "attemptBoth" });
          if (code?.data && activeRef.current) {
            activeRef.current = false;
            clearInterval(scanIntervalRef.current);
            handleScan(code.data);
          }
        }
      } catch {}
    }, 250);
  };

  const handleScan = (data) => {
    // Extract scan token from URL
    let token = null;
    try {
      const url = new URL(data);
      token = url.searchParams.get("scan");
    } catch { token = data; }

    if (!token) { setError("Invalid QR code."); return; }

    // Find child(ren) with this token
    const matched = children.filter(c => c.scanToken === token);
    if (!matched.length) { setError("QR code not recognised. Please check the child is registered."); return; }

    stopCamera();
    setScanning(false);

    // Build full family — start with matched children, add all their siblings,
    // then also add anyone whose siblings list includes a matched child
    const allIds = new Set();
    matched.forEach(c => {
      allIds.add(c.id);
      (c.siblings || []).forEach(id => allIds.add(id));
    });
    // Also catch any child who lists one of our matched children as a sibling
    // (handles case where token wasn't saved on all family members)
    children.forEach(c => {
      if ((c.siblings || []).some(id => allIds.has(id))) {
        allIds.add(c.id);
        (c.siblings || []).forEach(id => allIds.add(id));
      }
    });
    const familyList = children.filter(c => allIds.has(c.id))
      .sort((a, b) => (liveAge(b) || 0) - (liveAge(a) || 0));

    // Pre-select children who aren't already fully checked in/out
    const initSelected = {};
    familyList.forEach(c => {
      const rec = sessionAtt[c.id];
      // Pre-tick if not yet checked in today
      initSelected[c.id] = !rec;
    });
    setFamily(familyList);
    setSelected(initSelected);
  };

  const confirmCheckIn = async () => {
    setChecking(true);
    const toCheckIn = family.filter(c => selected[c.id] && !sessionAtt[c.id]);
    if (toCheckIn.length === 0) { setChecking(false); return; }
    // Build full day object with ALL children then write ONCE
    const day = { ...(attendance[sessionKey] || {}) };
    const stamp = stampNow();
    toCheckIn.forEach(child => {
      day[child.id] = { in: stamp, inTeacher: teacherName, out: null, outTeacher: null };
    });
    await db.ref(`attendance/${sessionKey}`).set(day);
    for (const child of toCheckIn) {
      try { await db.ref(`activityLog/${Date.now() + Math.random()}`).set({ action: "Check In", childName: child.name, teacher: teacherName, timestamp: Date.now(), time: stamp }); } catch {}
    }
    setSuccess(toCheckIn);
    setChecking(false);
    onCheckIn && onCheckIn();
    setTimeout(() => onClose(), 2500);
  };

  const toggleSelect = (id) => {
    const rec = sessionAtt[id];
    if (rec?.in && !rec?.out) return; // Already checked in — can't toggle
    setSelected(s => ({ ...s, [id]: !s[id] }));
  };

  const selectedCount = Object.values(selected).filter(Boolean).length;

  return (
    <div style={{ fontFamily: FONT }}>
      {scanning && (
        <div>
          <p style={{ fontSize: 13, color: T.slate500, marginBottom: 12, textAlign: "center" }}>
            Point the camera at a family's QR code
          </p>
          {/* Viewfinder */}
          <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "#000", marginBottom: 12 }}>
            <video ref={videoRef} style={{ width: "100%", display: "block", maxHeight: 320, objectFit: "cover" }} muted playsInline autoPlay />
            {/* Scan overlay */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", background: "rgba(0,0,0,.45)" }}>
              <div style={{ position: "relative", width: 210, height: 210, background: "transparent" }}>
                {/* Clear window */}
                <div style={{ position: "absolute", inset: 0, background: "transparent", borderRadius: 12, boxShadow: "0 0 0 1000px rgba(0,0,0,.45)" }} />
                {/* Corner accents — all inside the box */}
                <div style={{ position: "absolute", top: 0, left: 0, width: 28, height: 28, borderTop: "4px solid #0284C7", borderLeft: "4px solid #0284C7", borderRadius: "12px 0 0 0" }} />
                <div style={{ position: "absolute", top: 0, right: 0, width: 28, height: 28, borderTop: "4px solid #0284C7", borderRight: "4px solid #0284C7", borderRadius: "0 12px 0 0" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, width: 28, height: 28, borderBottom: "4px solid #0284C7", borderLeft: "4px solid #0284C7", borderRadius: "0 0 0 12px" }} />
                <div style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderBottom: "4px solid #0284C7", borderRight: "4px solid #0284C7", borderRadius: "0 0 12px 0" }} />
              </div>
            </div>
          </div>
          {error && (
            <div style={{ background: T.redLight, border: `1px solid ${T.red}30`, borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: 13, color: T.red, display: "flex", gap: 8, alignItems: "center" }}>
              <Icon name="alert" size={14} color={T.red} />{error}
            </div>
          )}
          <Btn variant="secondary" onClick={onClose} full>Cancel</Btn>
        </div>
      )}

      {family && !success && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: T.greenLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="check" size={18} color={T.green} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.slate800 }}>QR Code Scanned!</div>
              <div style={{ fontSize: 12, color: T.slate400 }}>Select who is here today</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {family.map(child => {
              const rec = sessionAtt[child.id];
              const alreadyIn = rec?.in && !rec?.out;
              const alreadyDone = rec?.in && rec?.out;
              const isSelected = selected[child.id];
              const group = getAgeGroup(liveAge(child));

              return (
                <div key={child.id} onClick={() => !alreadyIn && !alreadyDone && toggleSelect(child.id)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, border: `2px solid ${alreadyIn ? T.green : alreadyDone ? T.slate200 : isSelected ? T.teal : T.slate200}`, background: alreadyIn ? T.greenLight : alreadyDone ? T.slate50 : isSelected ? T.tealLight : T.white, cursor: alreadyIn || alreadyDone ? "default" : "pointer", transition: "all .15s" }}>
                  <ChildAvatar child={child} size={40} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: T.slate900 }}>{child.name}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                      {group && <Badge label={group.label} bg={group.color} color={group.text} />}
                      <Badge label={`Age ${liveAge(child)}`} bg={T.slate100} color={T.slate500} />
                      {child.medical && child.medical !== "No known conditions" && <MedicalBadge />}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    {alreadyIn && <Badge label="Already in" bg={T.greenLight} color={T.green} />}
                    {alreadyDone && <Badge label="Checked out" bg={T.slate100} color={T.slate500} />}
                    {!alreadyIn && !alreadyDone && (
                      <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${isSelected ? T.teal : T.slate300}`, background: isSelected ? T.teal : T.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {isSelected && <Icon name="check" size={14} color="#fff" />}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
            <Btn onClick={confirmCheckIn} disabled={checking || selectedCount === 0} full>
              {checking ? "Checking in…" : `Check In ${selectedCount > 0 ? selectedCount : ""} ${selectedCount === 1 ? "Child" : "Children"}`}
            </Btn>
          </div>
        </div>
      )}

      {success && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.greenLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Icon name="check" size={32} color={T.green} />
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 600, color: T.slate900 }}>Checked In!</h3>
          <div style={{ display: "flex", flex: 1, gap: 6, justifyContent: "center", flexWrap: "wrap", marginBottom: 8 }}>
            {success.map(c => <Badge key={c.id} label={c.name.split(" ")[0]} bg={T.tealLight} color={T.tealDark} />)}
          </div>
          <p style={{ fontSize: 13, color: T.slate400 }}>Closing automatically…</p>
        </div>
      )}
    </div>
  );
}

function ChildDetail({ child, onClose, onEdit, onDelete, allChildren, attendance }) {
  const photo = usePhotoUrl(child?.id);
  const group = getAgeGroup(liveAge(child));
  const absent = weeksAbsent(child.id, attendance, child.enrolled);
  const birthday = isBirthdayThisWeek(child.dob);
  const siblings = (child.siblings || []).map(id => allChildren.find(c => c.id === id)).filter(Boolean);
  const [showQR, setShowQR] = useState(false);

  return (
    <div style={{ fontFamily: FONT }}>
      {/* Header — hero banner with overlapping photo */}
      <div style={{ borderRadius: 14, border: `1px solid ${T.slate200}`, marginBottom: 20, overflow: "hidden" }}>
        {/* Banner */}
        <div style={{ background: `linear-gradient(135deg, ${T.teal} 0%, ${T.tealDark} 100%)`, height: 120 }} />
        {/* Photo row — sits below banner, photo pulled up via negative margin */}
        <div style={{ padding: "0 20px 16px", background: T.white }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
            {/* Photo pulled up to overlap the banner */}
            <div style={{ marginTop: -90, flexShrink: 0 }}>
              {photo
                ? <img src={photo} alt={child.name} style={{ width: 140, height: 140, borderRadius: "50%", objectFit: "cover", border: `4px solid ${T.white}`, boxShadow: "0 4px 20px rgba(0,0,0,.2)", display: "block" }} />
                : <div style={{ width: 140, height: 140, borderRadius: "50%", background: avatarColors[(child?.name?.charCodeAt(0) || 0) % avatarColors.length], display: "flex", alignItems: "center", justifyContent: "center", border: `4px solid ${T.white}`, boxShadow: "0 4px 20px rgba(0,0,0,.2)", fontSize: 44, fontWeight: 600, color: "white", fontFamily: FONT }}>
                    {child.name?.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}
                  </div>
              }
            </div>
            {/* Name & badges — aligned to bottom of photo */}
            <div style={{ paddingBottom: 4, paddingTop: 16, flex: 1, minWidth: 0 }}>
              <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 600, color: T.slate900, lineHeight: 1.2 }}>{child.name}</h3>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {group && <Badge label={group.label} bg={group.color} color={group.text} />}
                <Badge label={child.gender} bg={child.gender === "Boy" ? T.blueLight : "#FCE7F3"} color={child.gender === "Boy" ? T.blue : "#BE185D"} />
                <Badge label={`Age ${liveAge(child)}`} bg={T.slate100} color={T.slate600} />
                {birthday && <Badge label="Birthday this week!" bg="#FEF9C3" color="#854D0E" />}
                {absent >= 3 && <Badge label={`Absent ${absent} weeks`} bg={T.redLight} color={T.red} />}
              </div>
            </div>
          </div>
        </div>
        {/* Medical alert */}
        {child.medical && child.medical !== "No known conditions" && (
          <div style={{ display: "flex", gap: 10, background: "#FFFBEB", borderTop: `1.5px solid #FDE68A`, padding: "10px 20px", alignItems: "flex-start" }}>
            <Icon name="alert" size={16} color="#D97706" />
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#92400E", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 1 }}>Medical Alert</div>
              <p style={{ margin: 0, color: "#78350F", fontSize: 13 }}>{child.medical}</p>
            </div>
          </div>
        )}
      </div>



      {/* Info grid — DOB + Parent 1 + Parent 2 on one row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: 16 }}>
        <div style={{ background: T.slate50, borderRadius: 8, padding: "10px 12px", border: `1px solid ${T.slate200}` }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: T.slate400, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 2 }}>Date of Birth</div>
          <div style={{ fontSize: 14, color: T.slate800, fontWeight: 500 }}>{formatStoredDate(child.dob)}</div>
        </div>
        <div style={{ background: T.slate50, borderRadius: 8, padding: "10px 12px", border: `1px solid ${T.slate200}` }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: T.slate400, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>Parent / Guardian 1</div>
          <div style={{ fontSize: 14, color: T.slate800, fontWeight: 600, marginBottom: 3 }}>{child.parent1 || "—"}</div>
          {child.parent1phone && <div style={{ fontSize: 13, color: T.teal, fontWeight: 500 }}>{child.parent1phone}</div>}
        </div>
        {(child.parent2 || child.parent2phone) && (
          <div style={{ background: T.slate50, borderRadius: 8, padding: "10px 12px", border: `1px solid ${T.slate200}` }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: T.slate400, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>Parent / Guardian 2</div>
            <div style={{ fontSize: 14, color: T.slate800, fontWeight: 600, marginBottom: 3 }}>{child.parent2 || "—"}</div>
            {child.parent2phone && <div style={{ fontSize: 13, color: T.teal, fontWeight: 500 }}>{child.parent2phone}</div>}
          </div>
        )}
      </div>

      {/* Siblings */}
      {siblings.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: T.slate500, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>Siblings</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {siblings.map(s => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 8, background: T.tealLight, border: `1px solid ${T.teal}20` }}>
                <ChildAvatar child={s} size={24} />
                <span style={{ fontSize: 13, fontWeight: 500, color: T.tealDark }}>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Collectors */}
      {(child.collector1 || child.collector2) && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: T.slate500, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>Approved Collectors</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[child.collector1, child.collector2].filter(Boolean).map((name, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 8, background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#059669", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="children" size={12} color="white" />
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#166534" }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {child.notes && (
        <div style={{ background: T.slate50, border: "1px solid #E2E8F0", borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: T.slate500, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>Notes</div>
          <p style={{ margin: 0, color: T.slate700, fontSize: 14 }}>{child.notes}</p>
        </div>
      )}

      {child.enrolled && (
        <p style={{ fontSize: 12, color: T.slate400, margin: "0 0 12px" }}>
          Enrolled: {formatStoredDate(child.enrolled)}
        </p>
      )}
      <div style={{ display: "flex", gap: 10, justifyContent: "space-between", paddingTop: 8, borderTop: `1px solid ${T.slate100}`, flexWrap: "wrap" }}>
        <Btn variant="danger" small onClick={() => { if (window.confirm(`Remove ${child.name}?`)) { onDelete(child.id); onClose(); } }}>Delete</Btn>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="secondary" small onClick={() => setShowQR(true)}><Icon name="qr" size={14} />QR Code</Btn>
          <Btn variant="secondary" onClick={onEdit}><Icon name="edit" size={14} />Edit Profile</Btn>
        </div>
      </div>
      {showQR && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.5)", backdropFilter: "blur(4px)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: T.white, borderRadius: 20, padding: 28, width: "100%", maxWidth: 380, boxShadow: "0 25px 60px rgba(0,0,0,.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: T.slate900 }}>Family QR Code</h3>
              <button onClick={() => setShowQR(false)} style={{ background: T.slate100, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.slate500 }}><Icon name="x" size={16} /></button>
            </div>
            <QRDisplay child={child} allChildren={allChildren} onClose={() => setShowQR(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK-IN MANAGER (admin only)
// ─────────────────────────────────────────────────────────────────────────────
function CheckInManager({ children, attendance, sessionKey }) {
  const [resetting, setResetting] = useState({});
  const [confirmClear, setConfirmClear] = useState(false);
  const [msg, setMsg] = useState("");

  const sessionAtt = attendance[sessionKey] || {};
  const checkedInChildren = children.filter(c => sessionAtt[c.id]);
  const isSunday = new Date().getDay() === 0;

  const resetChild = async (child) => {
    setResetting(r => ({ ...r, [child.id]: true }));
    try {
      await db.ref(`attendance/${sessionKey}/${child.id}`).remove();
      setMsg(`${child.name.split(" ")[0]} reset.`);
      setTimeout(() => setMsg(""), 3000);
    } catch (e) { console.error(e); }
    setResetting(r => ({ ...r, [child.id]: false }));
  };

  const clearAll = async () => {
    try {
      await db.ref(`attendance/${sessionKey}`).remove();
      setMsg("All check-ins cleared.");
      setTimeout(() => setMsg(""), 4000);
    } catch (e) { console.error(e); }
    setConfirmClear(false);
  };

  return (
    <div style={{ background: T.white, border: `1px solid ${T.slate200}`, borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div>
          <h4 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.slate800 }}>Check-In Management</h4>
          <p style={{ margin: 0, fontSize: 11, color: T.slate400 }}>{isSunday ? "Today" : "Last Sunday"} · {checkedInChildren.length} children</p>
        </div>
        {checkedInChildren.length > 0 && !confirmClear && (
          <Btn variant="danger" small onClick={() => setConfirmClear(true)}>Clear All</Btn>
        )}
        {confirmClear && (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: T.red, fontWeight: 500 }}>Clear {checkedInChildren.length}?</span>
            <Btn variant="danger" small onClick={clearAll}>Yes</Btn>
            <Btn variant="secondary" small onClick={() => setConfirmClear(false)}>No</Btn>
          </div>
        )}
      </div>

      {msg && (
        <div style={{ display: "flex", gap: 6, alignItems: "center", background: T.greenLight, borderRadius: 6, padding: "6px 10px", marginBottom: 8, fontSize: 12, color: T.green, fontWeight: 500 }}>
          <Icon name="check" size={12} color={T.green} />{msg}
        </div>
      )}

      {checkedInChildren.length === 0 && (
        <p style={{ fontSize: 12, color: T.slate400, fontStyle: "italic", margin: 0 }}>No children checked in.</p>
      )}

      {/* Compact card grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
        {checkedInChildren.map(child => {
          const rec = sessionAtt[child.id];
          const isIn = rec?.in && !rec?.out;
          const isDone = rec?.in && rec?.out;
          return (
            <div key={child.id} style={{ background: T.slate50, borderRadius: 8, padding: "8px 10px", border: `1px solid ${T.slate200}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <ChildAvatar child={child} size={28} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 12, color: T.slate800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{child.name.split(" ")[0]}</div>
                  <div style={{ fontSize: 11, color: isIn ? T.teal : T.slate400 }}>{isIn ? `In ${rec.in?.split("·")[1]?.trim() || ""}` : isDone ? "Checked out" : ""}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {isDone && (
                  <button onClick={async () => {
                    setResetting(r => ({ ...r, [child.id]: true }));
                    await db.ref(`attendance/${sessionKey}/${child.id}`).update({ out: null, outTeacher: null, collectedBy: null });
                    setMsg(`${child.name.split(" ")[0]} back to checked in.`);
                    setTimeout(() => setMsg(""), 3000);
                    setResetting(r => ({ ...r, [child.id]: false }));
                  }} style={{ flex: 1, fontSize: 11, padding: "4px 6px", borderRadius: 6, border: `1px solid ${T.slate200}`, background: T.white, cursor: "pointer", fontFamily: FONT, color: T.slate600 }}>
                    Undo Out
                  </button>
                )}
                <button onClick={() => resetChild(child)} disabled={resetting[child.id]}
                  style={{ flex: 1, fontSize: 11, padding: "4px 6px", borderRadius: 6, border: "none", background: T.redLight, cursor: "pointer", fontFamily: FONT, color: T.red, fontWeight: 500 }}>
                  {resetting[child.id] ? "…" : "Reset"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN PANEL
// ─────────────────────────────────────────────────────────────────────────────
function AdminPanel({ currentUser, children = [], attendance = {}, sessionKey = "" }) {
  const [teachers, setTeachers] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const ref = db.ref("teachers");
    ref.on("value", snap => { const data = snap.val(); setTeachers(data ? Object.values(data) : []); });
    return () => ref.off();
  }, []);

  const registerSelf = async () => {
    if (!newName) { setError("Please enter your name."); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const u = auth.currentUser;
      await db.ref(`teachers/${u.uid}`).set({ uid: u.uid, name: newName, email: u.email });
      setSuccess(`Registered as ${newName}!`);
      setNewName("");
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const addTeacher = async () => {
    if (!newEmail || !newName) { setError("Please enter name and email."); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const tempPw = Math.random().toString(36).slice(2) + "Aa1!";
      const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_CONFIG.apiKey}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, password: tempPw, returnSecureToken: true }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error.message === "EMAIL_EXISTS" ? "That email is already registered." : data.error.message); setLoading(false); return; }
      await db.ref(`teachers/${data.localId}`).set({ uid: data.localId, name: newName, email: newEmail });
      await auth.sendPasswordResetEmail(newEmail);
      setSuccess(`Invite sent to ${newEmail}!`);
      setNewEmail(""); setNewName("");
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const removeTeacher = async t => {
    if (t.uid === currentUser.uid) { setError("You cannot remove yourself."); return; }
    if (!window.confirm(`Remove ${t.name}?`)) return;
    await db.ref(`teachers/${t.uid}`).remove();
  };

  const inp = { width: "100%", border: `1.5px solid ${T.slate200}`, borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: FONT, background: T.white, color: T.slate800, outline: "none", boxSizing: "border-box", marginBottom: 10 };
  const lbl = { display: "block", fontSize: 12, fontWeight: 500, color: T.slate500, marginBottom: 5, textTransform: "uppercase", letterSpacing: ".06em" };

  return (
    <div style={{ fontFamily: FONT }}>

      {/* ── 1. CURRENT TEACHERS ───────────────────────── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <h4 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.slate800 }}>Teachers ({teachers.length})</h4>
        </div>

        {!teachers.find(t => t.uid === currentUser.uid) && (
          <div style={{ background: T.tealLight, border: `1px solid ${T.teal}30`, borderRadius: 8, padding: 12, marginBottom: 10 }}>
            <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 500, color: T.tealDark }}>Register yourself first</p>
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ ...inp, marginBottom: 0, flex: 1 }} placeholder="Your full name" value={newName} onChange={e => { setNewName(e.target.value); setError(""); setSuccess(""); }} />
              <Btn onClick={registerSelf} disabled={loading} small>{loading ? "…" : "Register"}</Btn>
            </div>
          </div>
        )}

        {teachers.length === 0 && <p style={{ color: T.slate400, fontSize: 13 }}>No teachers added yet.</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {teachers.map(t => (
            <div key={t.uid} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: T.white, borderRadius: 8, border: `1px solid ${T.slate200}` }}>
              <Avatar child={{ name: t.name }} size={30} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 13, color: T.slate800 }}>{t.name} {t.uid === currentUser.uid && <Badge label="You" bg={T.tealLight} color={T.tealDark} />}</div>
                <div style={{ fontSize: 11, color: T.slate400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.email}</div>
              </div>
              {t.uid !== currentUser.uid && <Btn variant="danger" small onClick={() => removeTeacher(t)}>Remove</Btn>}
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. INVITE NEW TEACHER ──────────────────────── */}
      <div style={{ background: T.slate50, border: `1px solid ${T.slate200}`, borderRadius: 10, padding: 12, marginBottom: 16 }}>
        <h4 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600, color: T.slate800 }}>Invite a New Teacher</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 10px" }}>
          <div>
            <label style={lbl}>Name</label>
            <input style={inp} placeholder="Full name" value={newName} onChange={e => { setNewName(e.target.value); setError(""); setSuccess(""); }} />
          </div>
          <div>
            <label style={lbl}>Email</label>
            <input type="email" style={inp} placeholder="email@address.com" value={newEmail} onChange={e => { setNewEmail(e.target.value); setError(""); setSuccess(""); }} />
          </div>
        </div>
        {error && <p style={{ color: T.red, fontSize: 12, margin: "0 0 8px", display: "flex", alignItems: "center", gap: 5 }}><Icon name="alert" size={12} color={T.red} />{error}</p>}
        {success && <p style={{ color: T.green, fontSize: 12, margin: "0 0 8px", display: "flex", alignItems: "center", gap: 5 }}><Icon name="check" size={12} color={T.green} />{success}</p>}
        <Btn onClick={addTeacher} disabled={loading} full><Icon name="mail" size={13} />{loading ? "Sending…" : "Send Invite"}</Btn>
      </div>

      {/* ── 3. CHECK-IN MANAGEMENT ─────────────────────── */}
      <CheckInManager children={children} attendance={attendance} sessionKey={sessionKey} />

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true); setError("");
    try { await auth.signInWithEmailAndPassword(email, password); }
    catch { setError("Incorrect email or password. Please try again."); }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true); setError("");
    try {
      const result = await auth.signInWithPopup(getGoogleProvider());
      const u = result.user;
      // Check if this Google account is a registered teacher
      const snap = await db.ref("teachers").orderByChild("email").equalTo(u.email).once("value");
      if (!snap.exists() && u.email !== ADMIN_EMAIL) {
        // Not a registered teacher — sign them back out
        await auth.signOut();
        setError("Your Google account isn't set up as a teacher. Please ask your admin to invite you.");
        setGoogleLoading(false);
        return;
      }
      // If they're a teacher by email but don't have a UID entry yet, update it
      if (snap.exists()) {
        const teacherKey = Object.keys(snap.val())[0];
        const teacher = snap.val()[teacherKey];
        if (teacher.uid !== u.uid) {
          await db.ref(`teachers/${teacherKey}`).update({ uid: u.uid });
        }
      }
    } catch (e) {
      if (e.code !== "auth/popup-closed-by-user") {
        setError("Google sign-in failed. Please try again.");
      }
    }
    setGoogleLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, background: `linear-gradient(135deg, ${T.teal} 0%, ${T.tealDark} 60%, #1A2744 100%)`, padding: 20 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');
        * { box-sizing: border-box; }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        input:focus { outline: none; border-color: ${T.teal} !important; box-shadow: 0 0 0 3px ${T.teal}20 !important; }
      `}</style>

      {/* Centred card */}
      <div style={{ width: "100%", maxWidth: 420, animation: "slideUp .3s ease" }}>
        {/* Branding */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <LittleLightsLogo size="full" theme="teal" scale={1.4} />
          </div>
          <p style={{ margin: "12px 0 0", color: "rgba(255,255,255,.45)", fontSize: 12, fontStyle: "italic", textAlign: "center" }}>Let your light shine — Matthew 5:16</p>
        </div>

        {/* Form card */}
        <div style={{ background: T.white, borderRadius: 20, padding: "32px 28px", boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}>
          <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 600, color: T.slate900 }}>Welcome back</h2>
          <p style={{ margin: "0 0 24px", fontSize: 14, color: T.slate400 }}>Sign in to your teacher account</p>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.slate500, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>Email Address</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="you@email.com"
              style={{ width: "100%", border: `1.5px solid ${T.slate200}`, borderRadius: 8, padding: "11px 14px", fontSize: 15, fontFamily: FONT, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.slate500, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>Password</label>
            <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="••••••••"
              style={{ width: "100%", border: `1.5px solid ${T.slate200}`, borderRadius: 8, padding: "11px 14px", fontSize: 15, fontFamily: FONT, outline: "none", boxSizing: "border-box" }} />
          </div>
          {error && <p style={{ color: T.red, fontSize: 13, margin: "-12px 0 16px", display: "flex", alignItems: "center", gap: 6 }}><Icon name="alert" size={14} color={T.red} />{error}</p>}
          <button onClick={handleLogin} disabled={loading || googleLoading} style={{ width: "100%", padding: "12px", background: loading ? T.slate200 : T.teal, color: loading ? T.slate400 : "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 500, fontFamily: FONT, cursor: loading ? "not-allowed" : "pointer", marginBottom: 12 }}>
            {loading ? "Signing in…" : "Sign In"}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1, height: 1, background: T.slate200 }} />
            <span style={{ fontSize: 12, color: T.slate400, whiteSpace: "nowrap" }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: T.slate200 }} />
          </div>

          {/* Google button */}
          <button onClick={handleGoogleLogin} disabled={loading || googleLoading} style={{ width: "100%", padding: "11px", background: T.white, color: T.slate700, border: `1.5px solid ${T.slate200}`, borderRadius: 10, fontSize: 15, fontWeight: 500, fontFamily: FONT, cursor: googleLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: googleLoading ? .7 : 1 }}>
            {googleLoading ? "Signing in…" : (
              <>
                {/* Google G logo SVG */}
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT ATTENDANCE TO CSV
// ─────────────────────────────────────────────────────────────────────────────
function exportAttendanceCSV(children, attendance, year, month) {
  const sundays = getSundays(year, month);
  const monthName = new Date(year, month).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const headers = ["Name", "Age Group", ...sundays.map(s => formatShortDate(s)), "Total Attended"];
  const rows = children.map(child => {
    const group = getAgeGroup(liveAge(child));
    const attended = sundays.map(s => attendance[dateKey(s)]?.[child.id] ? "Yes" : "No");
    const total = attended.filter(a => a === "Yes").length;
    return [child.name, group?.label || "—", ...attended, total];
  });
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `LittleLights_Attendance_${monthName.replace(" ", "_")}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────────────────────
// ATTENDANCE CHART
// ─────────────────────────────────────────────────────────────────────────────
function AttendanceChart({ attendance }) {
  const weeks = [];
  const today = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - d.getDay() - i * 7);
    const key = dateKey(d);
    const count = attendance[key] ? Object.keys(attendance[key]).length : 0;
    weeks.push({ label: formatShortDate(d), count, key });
  }
  const max = Math.max(...weeks.map(w => w.count), 1);
  const chartH = 120;

  return (
    <div style={{ padding: "0 4px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: chartH, marginBottom: 8 }}>
        {weeks.map((w, i) => (
          <div key={w.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", position: "relative" }}
            title={`${w.label}: ${w.count} children`}>
            <div style={{ width: "100%", background: w.count > 0 ? T.teal : T.slate200, borderRadius: "4px 4px 0 0", height: `${Math.max((w.count / max) * 100, 4)}%`, transition: "height .3s ease", opacity: i < 4 ? .5 : i < 8 ? .75 : 1 }} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {weeks.map((w, i) => (
          <div key={w.key} style={{ flex: 1, fontSize: 9, color: T.slate400, textAlign: "center", overflow: "hidden", display: i % 3 === 2 ? "block" : "none" }}>{w.label}</div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PIE / DONUT CHARTS (pure SVG — no dependencies)
// ─────────────────────────────────────────────────────────────────────────────
function svgPieSlices(data, cx, cy, r, innerR, gap) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return [];
  let angle = -Math.PI / 2;
  return data.map(d => {
    const gapA = gap / r;
    const slice = (d.value / total) * Math.PI * 2 - gapA;
    const start = angle + gapA / 2;
    const end = start + slice;
    angle += slice + gapA;
    const cos1 = Math.cos(start), sin1 = Math.sin(start);
    const cos2 = Math.cos(end), sin2 = Math.sin(end);
    const large = slice > Math.PI ? 1 : 0;
    let path;
    if (innerR > 0) {
      path = [
        `M${cx + innerR * cos1},${cy + innerR * sin1}`,
        `L${cx + r * cos1},${cy + r * sin1}`,
        `A${r},${r} 0 ${large} 1 ${cx + r * cos2},${cy + r * sin2}`,
        `L${cx + innerR * cos2},${cy + innerR * sin2}`,
        `A${innerR},${innerR} 0 ${large} 0 ${cx + innerR * cos1},${cy + innerR * sin1}Z`
      ].join(' ');
    } else {
      path = [
        `M${cx},${cy}`,
        `L${cx + r * cos1},${cy + r * sin1}`,
        `A${r},${r} 0 ${large} 1 ${cx + r * cos2},${cy + r * sin2}Z`
      ].join(' ');
    }
    const midA = start + slice / 2;
    return { ...d, path, midA, pct: Math.round((d.value / total) * 100) };
  });
}

function GenderPieChart({ children }) {
  const boys = children.filter(c => c.gender === "Boy").length;
  const girls = children.filter(c => c.gender === "Girl").length;
  const data = [
    { name: "Girls", value: girls, color: "#EC4899" },
    { name: "Boys", value: boys, color: "#3B82F6" },
  ].filter(d => d.value > 0);
  if (!data.length) return <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", color: T.slate400, fontSize: 13 }}>No data yet</div>;
  const slices = svgPieSlices(data, 90, 80, 68, 0, 3);
  return (
    <div>
      <svg viewBox="0 0 180 160" style={{ width: "100%", overflow: "visible" }}>
        {slices.map((s, i) => (
          <g key={i}>
            <path d={s.path} fill={s.color} />
            {s.pct > 8 && <text x={90 + 50 * Math.cos(s.midA)} y={80 + 50 * Math.sin(s.midA)} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="600" fill="#fff" fontFamily="DM Sans, sans-serif">{s.pct}%</text>}
          </g>
        ))}
      </svg>
      <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
        {data.map(d => (
          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.slate600 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, display: "inline-block", flexShrink: 0 }} />
            {d.name}: <strong style={{ marginLeft: 2 }}>{d.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function GroupDonutChart({ children }) {
  const nursery = children.filter(c => liveAge(c) <= 5).length;
  const juniors = children.filter(c => liveAge(c) >= 6).length;
  const total = nursery + juniors;
  const data = [
    { name: "Nursery (0–5)", value: nursery, color: "#0284C7" },
    { name: "Juniors (6–11)", value: juniors, color: "#059669" },
  ].filter(d => d.value > 0);
  if (!data.length) return <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", color: T.slate400, fontSize: 13 }}>No data yet</div>;
  const slices = svgPieSlices(data, 90, 80, 68, 42, 4);
  return (
    <div>
      <svg viewBox="0 0 180 160" style={{ width: "100%", overflow: "visible" }}>
        {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} />)}
        <text x="90" y="75" textAnchor="middle" fontSize="22" fontWeight="700" fill="#1E293B" fontFamily="DM Sans, sans-serif">{total}</text>
        <text x="90" y="93" textAnchor="middle" fontSize="10" fill="#94A3B8" fontFamily="DM Sans, sans-serif">Total</text>
      </svg>
      <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
        {data.map(d => (
          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.slate600 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: d.color, display: "inline-block", flexShrink: 0 }} />
            {d.name}: <strong style={{ marginLeft: 2 }}>{d.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COLLECTOR MODAL
// ─────────────────────────────────────────────────────────────────────────────
function CollectorModal({ child, onConfirm, onClose }) {
  const [selected, setSelected] = useState(null);
  const [manualName, setManualName] = useState("");

  // Build list: parents first, then approved collectors, filtering blanks
  const options = [
    child.parent1, child.parent2,
    child.collector1, child.collector2,
  ].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i); // deduplicate

  const handleConfirm = () => {
    const name = selected === "__manual__" ? manualName.trim() : selected;
    if (!name) return;
    onConfirm(name);
  };

  const inp = { width: "100%", border: `1.5px solid ${T.slate200}`, borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: FONT, background: T.white, outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: T.slate50, borderRadius: 12, marginBottom: 20, border: `1px solid ${T.slate200}` }}>
        <ChildAvatar child={child} size={44} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: T.slate900 }}>{child.name}</div>
          <div style={{ fontSize: 13, color: T.slate400 }}>Who is collecting this child?</div>
        </div>
      </div>

      {options.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.slate500, marginBottom: 8, textTransform: "uppercase", letterSpacing: ".06em" }}>Select collector</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {options.map(name => (
              <button key={name} onClick={() => setSelected(name)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, border: `2px solid ${selected === name ? T.teal : T.slate200}`, background: selected === name ? T.tealLight : T.white, cursor: "pointer", fontFamily: FONT, textAlign: "left", transition: "all .15s" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: selected === name ? T.teal : T.slate200, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="children" size={14} color={selected === name ? "#fff" : T.slate500} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: T.slate800 }}>{name}</span>
                {selected === name && <Icon name="check" size={16} color={T.teal} style={{ marginLeft: "auto" }} />}
              </button>
            ))}
            <button onClick={() => setSelected("__manual__")}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, border: `2px solid ${selected === "__manual__" ? T.teal : T.slate200}`, background: selected === "__manual__" ? T.tealLight : T.white, cursor: "pointer", fontFamily: FONT, textAlign: "left", transition: "all .15s" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: selected === "__manual__" ? T.teal : T.slate200, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="edit" size={14} color={selected === "__manual__" ? "#fff" : T.slate500} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: T.slate800 }}>Someone else…</span>
            </button>
          </div>
        </div>
      )}

      {(selected === "__manual__" || options.length === 0) && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 10, background: "#FFFBEB", border: "1.5px solid #FDE68A", borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
            <Icon name="alert" size={16} color="#D97706" />
            <p style={{ margin: 0, fontSize: 13, color: "#92400E", fontWeight: 500 }}>
              Please confirm this person is approved to collect this child before proceeding.
            </p>
          </div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.slate500, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>
            {options.length === 0 ? "Collector name" : "Enter name"}
          </label>
          <input value={manualName} onChange={e => setManualName(e.target.value)}
            placeholder="Full name of collector" style={inp} autoFocus
            onKeyDown={e => e.key === "Enter" && handleConfirm()} />
        </div>
      )}

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8, borderTop: `1px solid ${T.slate100}` }}>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn onClick={handleConfirm} disabled={!selected && !manualName.trim()}>
          <Icon name="check" size={14} />Confirm Check-Out
        </Btn>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
function Sidebar({ tab, setTab, teacherName, onSignOut, isAdmin, mobile, onClose }) {
  const nav = [
    { id: "checkin", icon: "checkin", label: "Check-In" },
    { id: "children", icon: "children", label: "Children" },
    { id: "calendar", icon: "calendar", label: "Calendar" },
    { id: "dashboard", icon: "dashboard", label: "Dashboard" },
    { id: "activity", icon: "activity", label: "Activity Log" },
  ];

  return (
    <div style={{ width: mobile ? "100%" : 240, background: T.sidebar, display: "flex", flexDirection: "column", minHeight: "100vh", flexShrink: 0, position: mobile ? "relative" : "fixed", left: 0, top: 0, bottom: 0, zIndex: 200 }}>
      {/* Logo */}
      <div style={{ padding: "28px 20px 20px", borderBottom: `1px solid ${T.sidebarAccent}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <LittleLightsLogo size="compact" theme="dark" />
          {mobile && <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.slate400 }}><Icon name="x" size={20} /></button>}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        {nav.map(n => {
          const active = tab === n.id;
          return (
            <button key={n.id} onClick={() => { setTab(n.id); if (mobile) onClose(); }}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: active ? T.teal : "transparent", color: active ? "#fff" : T.slate400, cursor: "pointer", fontSize: 14, fontFamily: FONT, fontWeight: active ? 500 : 400, marginBottom: 2, textAlign: "left", transition: "all .15s" }}>
              <Icon name={n.icon} size={16} color={active ? "#fff" : T.slate500} />
              {n.label}
            </button>
          );
        })}

        {isAdmin && (
          <>
            <div style={{ height: 1, background: T.sidebarAccent, margin: "12px 0" }} />
            <button onClick={() => { setTab("admin"); if (mobile) onClose(); }}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: tab === "admin" ? T.teal : "transparent", color: tab === "admin" ? "#fff" : T.slate400, cursor: "pointer", fontSize: 14, fontFamily: FONT, fontWeight: tab === "admin" ? 500 : 400, textAlign: "left", transition: "all .15s" }}>
              <Icon name="settings" size={16} color={tab === "admin" ? "#fff" : T.slate500} />
              Admin
            </button>
          </>
        )}
      </nav>

      {/* User */}
      <div style={{ padding: "16px 12px", borderTop: `1px solid ${T.sidebarAccent}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, padding: "8px 12px" }}>
          <Avatar child={{ name: teacherName }} size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: T.slate300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{teacherName}</div>
            <div style={{ fontSize: 11, color: T.slate500 }}>{isAdmin ? "Admin" : "Teacher"}</div>
          </div>
        </div>
        <button onClick={onSignOut} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px", borderRadius: 8, border: "none", background: "transparent", color: T.slate500, cursor: "pointer", fontSize: 13, fontFamily: FONT }}>
          <Icon name="logout" size={15} color={T.slate500} />Sign Out
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [user, setUser] = useState(null);
  const [teacherName, setTeacherName] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [tab, setTabRaw] = useState("checkin");
  const setTab = (t) => { setTabRaw(t); window.scrollTo({ top: 0, behavior: "instant" }); };
  const [children, setChildren] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [activityLog, setActivityLog] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [collectorModal, setCollectorModal] = useState(null); // { childId }
  const [calMonth, setCalMonth] = useState(() => { const n = new Date(); return { y: n.getFullYear(), m: n.getMonth() }; });
  const [calOpen, setCalOpen] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  // Load Firebase
  useEffect(() => {
    if (window.firebase) { initFirebase(); setFirebaseReady(true); return; }
    const scripts = [
      "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js",
      "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js",
      "https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js",
      "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage-compat.js",
    ];
    let loaded = 0;
    scripts.forEach(src => {
      const s = document.createElement("script");
      s.src = src; s.async = false;
      s.onload = () => { if (++loaded === scripts.length) { initFirebase(); setFirebaseReady(true); } };
      document.head.appendChild(s);
    });
  }, []);

  // Auth
  useEffect(() => {
    if (!firebaseReady) return;
    const unsub = auth.onAuthStateChanged(async u => {
      setUser(u);
      if (u) {
        const snap = await db.ref(`teachers/${u.uid}`).get();
        setTeacherName(snap.exists() ? snap.val().name : u.email);
        // Scroll to top after login
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, [firebaseReady]);

  // Real-time listeners
  useEffect(() => {
    if (!firebaseReady || !user) return;
    setDataLoading(true);
    const childRef = db.ref("children");
    const logRef = db.ref("activityLog");

    // Attendance: split into two lightweight listeners instead of one full-history pull.
    //
    // Problem: attRef.on("value") downloads ALL historical attendance on every change,
    // which is ~17+ Sundays of data re-sent to the client each time anyone checks in.
    // On a 2 GB Samsung Galaxy Tab A this causes Chrome to OOM-crash immediately after login.
    //
    // Fix:
    //   1. sessionRef — real-time listener on ONLY today's session key (for live check-in counts)
    //   2. historyRef — one-time fetch of the last 13 Sundays (enough for 12-week chart + 8-week
    //      absence tracking). Not live — stale for the current day, which sessionRef covers.
    const sessionRef = db.ref(`attendance/${dateKey((() => { const d = new Date(); if (d.getDay() !== 0) d.setDate(d.getDate() - d.getDay()); return d; })())}`);
    const historyRef = db.ref("attendance").orderByKey().limitToLast(13);

    childRef.on("value", snap => { setChildren(snap.val() ? Object.values(snap.val()) : []); setDataLoading(false); });

    // Session listener: keeps current check-in data live
    sessionRef.on("value", snap => {
      const sessionKey = dateKey((() => { const d = new Date(); if (d.getDay() !== 0) d.setDate(d.getDate() - d.getDay()); return d; })());
      setAttendance(prev => ({ ...prev, [sessionKey]: snap.val() || {} }));
    });

    // History fetch: one-time, last 13 Sundays (for chart + absence display)
    historyRef.once("value", snap => {
      setAttendance(prev => ({ ...prev, ...(snap.val() || {}) }));
    });

    // Activity log: server-side limit to 100 — don't download the whole node and slice in JS
    logRef.orderByChild("timestamp").limitToLast(100).on("value", snap => {
      const data = snap.val();
      setActivityLog(data ? Object.values(data).sort((a,b) => b.timestamp - a.timestamp) : []);
    });

    return () => { childRef.off(); sessionRef.off(); logRef.off(); };
  }, [firebaseReady, user]);

  // Session
  const today = new Date();
  const sessionDate = (() => { const d = new Date(today); if (d.getDay() !== 0) d.setDate(d.getDate() - d.getDay()); return d; })();
  const sessionKey = dateKey(sessionDate);
  const todayKey = dateKey(today);
  const isSunday = today.getDay() === 0;
  const sundayLabel = isSunday ? "Total This Sunday" : "Total Last Sunday";
  const sessionAtt = attendance[sessionKey] || {};
  const checkedInNow = Object.values(sessionAtt).filter(a => a.in && !a.out).length;
  const totalToday = Object.keys(sessionAtt).length;
  const isAdmin = user?.email === ADMIN_EMAIL;

  const logActivity = async (action, childName, collectedBy) => {
    const entry = { action, childName, teacher: teacherName, timestamp: Date.now(), time: stampNow(), ...(collectedBy ? { collectedBy } : {}) };
    await db.ref(`activityLog/${Date.now()}`).set(entry);
  };

  const toggleIn = async childId => {
    const child = children.find(c => c.id === childId);
    const day = { ...(attendance[sessionKey] || {}) };
    const isCheckIn = !day[childId];
    if (day[childId]) {
      delete day[childId];
    } else {
      day[childId] = { in: stampNow(), inTeacher: teacherName, out: null, outTeacher: null };
    }
    // Save attendance first — always
    await db.ref(`attendance/${sessionKey}`).set(day);
    // Log activity separately — don't let it block check-in
    if (isCheckIn) { try { await logActivity("Check In", child?.name); } catch {} }
  };

  const checkOut = async (childId, collectorName) => {
    const child = children.find(c => c.id === childId);
    const rec = (attendance[sessionKey] || {})[childId];
    if (!rec) return;
    await db.ref(`attendance/${sessionKey}/${childId}`).update({ out: stampNow(), outTeacher: teacherName, collectedBy: collectorName || null });
    try { await logActivity("Check Out", child?.name, collectorName); } catch {}
  };

  const addOrUpdateChild = async form => {
    // Always recalculate and store the current age from DOB on save
    const updatedForm = form.dob ? { ...form, age: getAge(form.dob) ?? form.age } : form;
    await db.ref(`children/${form.id}`).set(updatedForm);
    // Update siblings bidirectionally
    if (form.siblings?.length) {
      for (const sibId of form.siblings) {
        const sib = children.find(c => c.id === sibId);
        if (sib) {
          const sibSiblings = Array.from(new Set([...(sib.siblings || []), form.id]));
          await db.ref(`children/${sibId}/siblings`).set(sibSiblings);
        }
      }
    }
    setModal(null);
  };

  const deleteChild = async id => {
    await db.ref(`children/${id}`).remove();
    if (storage) { try { await storage.ref(`photos/${id}`).delete(); } catch {} }
  };

  const handleSignOut = () => { auth.signOut(); setUser(null); setTeacherName(""); setChildren([]); setAttendance([]); };

  const filtered = children.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase())).sort((a, b) => a.name.split(" ")[0].localeCompare(b.name.split(" ")[0]));

  // Alerts
  const birthdays = children.filter(c => isBirthdayThisWeek(c.dob));
  const absentees = children.filter(c => !c.visitor && weeksAbsent(c.id, attendance, c.enrolled) >= 3);

  // Loading
  if (!firebaseReady || authLoading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.slate900, fontFamily: FONT }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap'); * { box-sizing: border-box; } @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      <div style={{ textAlign: "center", color: T.slate400 }}>
        <div style={{ width: 32, height: 32, border: `3px solid ${T.teal}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ fontSize: 14 }}>Loading…</p>
      </div>
    </div>
  );

  if (!user) return <LoginScreen />;

  const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
    @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
    ::-webkit-scrollbar { width: 6px } ::-webkit-scrollbar-thumb { background: ${T.slate300}; border-radius: 3px }
    input:focus, textarea:focus, select:focus { outline: none; border-color: ${T.teal} !important; box-shadow: 0 0 0 3px ${T.teal}20 !important; }
    button:hover { opacity: .9; }
    @media (max-width: 768px) {
      .sidebar { display: none !important; }
      .main-content { margin-left: 0 !important; padding-bottom: 80px !important; }
      .mobile-menu { display: flex !important; }
      .mobile-nav { display: flex !important; }
    }
    @media (min-width: 769px) {
      .mobile-nav { display: none !important; }
      .desktop-alerts { display: flex !important; }
      .mobile-alerts { display: none !important; }
    }
    @media (max-width: 768px) {
      .desktop-alerts { display: none !important; }
      .mobile-alerts { display: flex !important; }
    }
    /* Prevent horizontal overflow on mobile */
    @media (max-width: 480px) {
      .modal-inner { padding: 16px !important; }
    }
  `;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.bg, fontFamily: FONT }}>
      <style>{STYLES}</style>

      {/* Sidebar — desktop */}
      <div className="sidebar">
        <Sidebar tab={tab} setTab={t => { setTab(t); setSearch(""); }} teacherName={teacherName} onSignOut={handleSignOut} isAdmin={isAdmin} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebar && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex" }}>
          <div style={{ width: 280, background: T.sidebar }}>
            <Sidebar tab={tab} setTab={t => { setTab(t); setSearch(""); }} teacherName={teacherName} onSignOut={handleSignOut} isAdmin={isAdmin} mobile onClose={() => setMobileSidebar(false)} />
          </div>
          <div style={{ flex: 1, background: "rgba(0,0,0,.5)" }} onClick={() => setMobileSidebar(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="main-content" style={{ flex: 1, marginLeft: 240, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{ background: T.white, borderBottom: `1px solid ${T.slate200}`, flexShrink: 0, position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ height: 60, display: "flex", alignItems: "center", padding: "0 24px", gap: 16 }}>
            <button onClick={() => setMobileSidebar(true)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: T.slate600, padding: 4 }} className="mobile-menu">
              <Icon name="menu" size={20} />
            </button>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: T.slate800, textTransform: "capitalize" }}>
                {tab === "checkin" ? "Check-In" : tab === "activity" ? "Activity Log" : tab}
              </h2>
              <p style={{ margin: 0, fontSize: 12, color: T.slate400 }}>{formatDate(today)}</p>
            </div>
            {/* Desktop alerts — in topbar on desktop only */}
            <div className="desktop-alerts" style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {birthdays.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "#FEF9C3", borderRadius: 20, fontSize: 12, color: "#854D0E", fontWeight: 500 }}>
                  <Icon name="birthday" size={14} color="#D97706" />
                  {birthdays.length} birthday{birthdays.length > 1 ? "s" : ""} this week
                </div>
              )}
              {absentees.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", background: T.redLight, borderRadius: 20, fontSize: 12, color: T.red, fontWeight: 500 }}>
                  <Icon name="alert" size={14} color={T.red} />
                  {absentees.length} absent 3+ weeks
                </div>
              )}
            </div>
          </div>
          {/* Mobile alerts — slim banner below topbar, only visible on mobile */}
          {(birthdays.length > 0 || absentees.length > 0) && (
            <div className="mobile-alerts" style={{ display: "none", gap: 6, padding: "6px 16px 8px", flexWrap: "wrap" }}>
              {birthdays.length > 0 && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "#FEF9C3", borderRadius: 20, fontSize: 11, color: "#854D0E", fontWeight: 500 }}>
                  <Icon name="birthday" size={12} color="#D97706" />
                  {birthdays.length} birthday{birthdays.length > 1 ? "s" : ""} this week
                </div>
              )}
              {absentees.length > 0 && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", background: T.redLight, borderRadius: 20, fontSize: 11, color: T.red, fontWeight: 500 }}>
                  <Icon name="alert" size={12} color={T.red} />
                  {absentees.length} absent 3+ weeks
                </div>
              )}
            </div>
          )}
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: "20px 16px", maxWidth: 1100, width: "100%", animation: "slideUp .2s ease" }}>

          {/* ── DASHBOARD ───────────────────────────────────────────────────── */}
          {tab === "dashboard" && (
            <div>
              {(() => {
                const nurseryPresent = children.filter(c => liveAge(c) <= 5 && sessionAtt[c.id]?.in && !sessionAtt[c.id]?.out).length;
                const juniorsPresent = children.filter(c => liveAge(c) >= 6 && sessionAtt[c.id]?.in && !sessionAtt[c.id]?.out).length;
                const nurseryTotal = children.filter(c => liveAge(c) <= 5).length;
                const juniorsTotal = children.filter(c => liveAge(c) >= 6).length;
                return (<>
                  {/* Section 1: Today's attendance */}
                  <div style={{ marginBottom: 8 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: T.slate400, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Today's Attendance</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 20 }}>
                      {[
                        { label: "Present Now", value: checkedInNow, color: T.teal, bg: T.tealLight },
                        { label: sundayLabel, value: totalToday, color: T.blue, bg: T.blueLight },
                        { label: "Nursery (0-5) Present", value: nurseryPresent, color: "#0369A1", bg: "#E0F2FE" },
                        { label: "Juniors (6-11) Present", value: juniorsPresent, color: "#166534", bg: "#F0FDF4" },
                      ].map(s => (
                        <div key={s.label} style={{ background: T.white, borderRadius: 12, padding: "18px 16px", border: `1px solid ${T.slate200}`, boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
                          <div style={{ fontSize: 28, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.value}</div>
                          <div style={{ fontSize: 12, color: T.slate500, fontWeight: 500 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 2: Registered children */}
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: T.slate400, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Registered Children</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 20 }}>
                      {[
                        { label: "Total Registered", value: children.length, color: T.slate700, bg: T.slate100 },
                        { label: "Members", value: children.filter(c => !c.visitor).length, color: T.teal, bg: T.tealLight },
                        { label: "Visitors", value: children.filter(c => c.visitor).length, color: "#7C3AED", bg: "#F5F3FF" },
                        { label: "Nursery (0–5)", value: nurseryTotal, color: "#0369A1", bg: "#E0F2FE" },
                        { label: "Juniors (6–11)", value: juniorsTotal, color: "#166534", bg: "#F0FDF4" },
                      ].map(s => (
                        <div key={s.label} style={{ background: T.white, borderRadius: 12, padding: "18px 16px", border: `1px solid ${T.slate200}`, boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
                          <div style={{ fontSize: 28, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.value}</div>
                          <div style={{ fontSize: 12, color: T.slate500, fontWeight: 500 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>);
              })()}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 16 }}>
                {/* Gender split */}
                <div style={{ background: T.white, borderRadius: 12, padding: 20, border: `1px solid ${T.slate200}` }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: T.slate800 }}>Boys vs Girls</h3>
                  <p style={{ margin: "0 0 12px", fontSize: 12, color: T.slate400 }}>All registered children</p>
                  <GenderPieChart children={children} />
                </div>
                {/* Age group split */}
                <div style={{ background: T.white, borderRadius: 12, padding: 20, border: `1px solid ${T.slate200}` }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: T.slate800 }}>Nursery vs Juniors</h3>
                  <p style={{ margin: "0 0 12px", fontSize: 12, color: T.slate400 }}>All registered children</p>
                  <GroupDonutChart children={children} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
                {/* Attendance chart */}
                <div style={{ background: T.white, borderRadius: 12, padding: 20, border: `1px solid ${T.slate200}` }}>
                  <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: T.slate800 }}>Attendance — Last 12 Sundays</h3>
                  <AttendanceChart attendance={attendance} />
                </div>

                {/* Alerts */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {birthdays.length > 0 && (
                    <div style={{ background: T.white, borderRadius: 12, padding: 20, border: `1px solid ${T.slate200}` }}>
                      <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: T.slate800, display: "flex", alignItems: "center", gap: 8 }}>
                        <Icon name="birthday" size={16} color="#D97706" />Birthdays This Week
                      </h3>
                      {birthdays.map(c => (
                        <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <ChildAvatar child={c} size={32} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: T.slate800 }}>{c.name}</div>
                            <div style={{ fontSize: 12, color: T.slate400 }}>Turns {liveAge(c) + 1}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {absentees.length > 0 && (
                    <div style={{ background: T.white, borderRadius: 12, padding: 20, border: `1px solid ${T.slate200}` }}>
                      <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: T.slate800, display: "flex", alignItems: "center", gap: 8 }}>
                        <Icon name="alert" size={16} color={T.red} />Absent 3+ Weeks
                      </h3>
                      {absentees.map(c => (
                        <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <ChildAvatar child={c} size={32} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: T.slate800 }}>{c.name}</div>
                            <div style={{ fontSize: 12, color: T.red }}>{weeksAbsent(c.id, attendance, c.enrolled)} weeks absent</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── CHECK-IN ─────────────────────────────────────────────────────── */}
          {tab === "checkin" && (
            <div>
              {/* Stat widgets — checked in counts */}
              {(() => {
                const nurseryPresent = children.filter(c => liveAge(c) <= 5 && sessionAtt[c.id]?.in && !sessionAtt[c.id]?.out).length;
                const juniorsPresent = children.filter(c => liveAge(c) >= 6 && sessionAtt[c.id]?.in && !sessionAtt[c.id]?.out).length;
                return (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
                    {[
                      { label: "Present Now", value: checkedInNow, color: T.teal, bg: T.tealLight },
                      { label: sundayLabel, value: totalToday, color: T.blue, bg: T.blueLight },
                      { label: "Nursery (0-5) Present", value: nurseryPresent, color: "#0369A1", bg: "#E0F2FE" },
                      { label: "Juniors (6-11) Present", value: juniorsPresent, color: "#166534", bg: "#F0FDF4" },
                    ].map(s => (
                      <div key={s.label} style={{ background: T.white, borderRadius: 12, padding: "14px 12px", border: `1px solid ${T.slate200}`, boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
                        <div style={{ fontSize: 26, fontWeight: 700, color: s.color, marginBottom: 2 }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: T.slate500, fontWeight: 500, lineHeight: 1.3 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Search + Scan */}
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}><Icon name="search" size={16} color={T.slate400} /></div>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search children..."
                    style={{ width: "100%", padding: "10px 12px 10px 38px", border: `1.5px solid ${T.slate200}`, borderRadius: 10, fontSize: 14, fontFamily: FONT, background: T.white, outline: "none" }} />
                </div>
                <Btn onClick={() => setModal({ type: "scanner" })} style={{ flexShrink: 0, background: T.teal, color: "#fff", border: "none" }}>
                  <Icon name="scan" size={16} color="#fff" />Scan QR
                </Btn>
              </div>

              {dataLoading && <div style={{ textAlign: "center", padding: 60, color: T.slate400 }}>Loading…</div>}

              {/* Group by age */}
              {["Nursery", "Juniors"].map(groupName => {
                const groupChildren = filtered.filter(c => getAgeGroup(liveAge(c))?.label === groupName);
                if (!groupChildren.length) return null;
                return (
                  <div key={groupName === "Nursery" ? "Nursery (0–5)" : "Juniors (6–11)"} style={{ marginBottom: 28 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.slate500, textTransform: "uppercase", letterSpacing: ".08em" }}>{groupName === "Nursery" ? "Nursery (0–5)" : "Juniors (6–11)"}</h3>
                      <div style={{ flex: 1, height: 1, background: T.slate200 }} />
                      <span style={{ fontSize: 12, color: T.slate400 }}>{groupChildren.filter(c => sessionAtt[c.id]?.in && !sessionAtt[c.id]?.out).length}/{groupChildren.length} present</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {groupChildren.map(child => {
                        const rec = sessionAtt[child.id];
                        const isIn = rec?.in && !rec?.out;
                        const isDone = rec?.in && rec?.out;
                        const hasMedical = child.medical && child.medical !== "No known conditions";
                        return (
                          <div key={child.id} style={{ background: T.white, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, border: `1px solid ${hasMedical && !isIn && !isDone ? "#FDE68A" : isIn ? T.teal + "40" : T.slate200}`, boxShadow: "0 1px 3px rgba(0,0,0,.04)", background: isIn ? `${T.teal}05` : hasMedical && !isIn && !isDone ? "#FFFBEB" : T.white }}>
                            <ChildAvatar child={child} size={44} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                <span style={{ fontWeight: 600, fontSize: 15, color: T.slate900 }}>{child.name}</span>
                                {child.medical && child.medical !== "No known conditions" && <MedicalBadge />}
                                {isBirthdayThisWeek(child.dob) && <Badge label="Birthday" bg="#FEF9C3" color="#854D0E" />}
                              </div>
                              <div style={{ fontSize: 12, color: T.slate400, marginTop: 2 }}>Age {liveAge(child)} · {child.gender}</div>
                              {hasMedical && !isIn && !isDone && (
                                <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5, background: "#FEF3C7", borderRadius: 6, padding: "3px 8px", width: "fit-content" }}>
                                  <Icon name="alert" size={12} color="#D97706" />
                                  <span style={{ fontSize: 12, color: "#92400E", fontWeight: 600 }}>{child.medical}</span>
                                </div>
                              )}
                              {rec && (
                                <div style={{ fontSize: 12, marginTop: 4, lineHeight: 1.7 }}>
                                  <span style={{ color: T.teal, fontWeight: 500 }}>In: {rec.in}</span>
                                  {rec.inTeacher && <span style={{ color: T.slate400, fontStyle: "italic" }}> · {rec.inTeacher}</span>}
                                  {rec.out && (
                                    <><br/>
                                    <span style={{ color: T.coral, fontWeight: 500 }}>Out: {rec.out}</span>
                                    {rec.outTeacher && <span style={{ color: T.slate400, fontStyle: "italic" }}> · {rec.outTeacher}</span>}
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                              {!rec && <Btn small onClick={() => toggleIn(child.id)}>Check In</Btn>}
                              {isIn && (
                                <>
                                  <Badge label="Present" bg={T.greenLight} color={T.green} />
                                  <Btn variant="secondary" small onClick={() => setCollectorModal({ childId: child.id })}>Check Out</Btn>
                                </>
                              )}
                              {isDone && <Badge label="Checked Out" bg={T.slate100} color={T.slate500} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Unassigned (no age) */}
              {filtered.filter(c => !getAgeGroup(liveAge(c))).length > 0 && (
                <div style={{ marginBottom: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.slate400, textTransform: "uppercase", letterSpacing: ".08em" }}>No Age Group</h3>
                    <div style={{ flex: 1, height: 1, background: T.slate200 }} />
                  </div>
                  {filtered.filter(c => !getAgeGroup(liveAge(c))).map(child => {
                    const rec = sessionAtt[child.id];
                    const isIn = rec?.in && !rec?.out;
                    const isDone = rec?.in && rec?.out;
                    return (
                      <div key={child.id} style={{ background: T.white, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, border: `1px solid ${T.slate200}`, marginBottom: 8 }}>
                        <ChildAvatar child={child} size={44} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 15, color: T.slate900 }}>{child.name}</div>
                          <div style={{ fontSize: 12, color: T.slate400 }}>No age set — please edit profile</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                          {!rec && <Btn small onClick={() => toggleIn(child.id)}>Check In</Btn>}
                          {isIn && <><Badge label="Present" bg={T.greenLight} color={T.green} /><Btn variant="secondary" small onClick={() => setCollectorModal({ childId: child.id })}>Check Out</Btn></>}
                          {isDone && <Badge label="Checked Out" bg={T.slate100} color={T.slate500} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── CHILDREN ─────────────────────────────────────────────────────── */}
          {tab === "children" && (
            <div>
              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}><Icon name="search" size={16} color={T.slate400} /></div>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search children…"
                    style={{ width: "100%", padding: "10px 12px 10px 38px", border: `1.5px solid ${T.slate200}`, borderRadius: 10, fontSize: 14, fontFamily: FONT, background: T.white, outline: "none" }} />
                </div>
                <Btn onClick={() => setModal({ type: "add" })}><Icon name="plus" size={14} />Add Child</Btn>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
                {filtered.map(child => {
                  const group = getAgeGroup(liveAge(child));
                  const absent = weeksAbsent(child.id, attendance, child.enrolled);
                  const birthday = isBirthdayThisWeek(child.dob);
                  return (
                    <div key={child.id} onClick={() => setModal({ type: "view", payload: child })}
                      style={{ background: T.white, borderRadius: 12, padding: "16px", border: `1px solid ${T.slate200}`, cursor: "pointer", transition: "box-shadow .15s, transform .15s", boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,.1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,.04)"; e.currentTarget.style.transform = ""; }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <ChildAvatar child={child} size={44} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 15, color: T.slate900, marginBottom: 6 }}>{child.name}</div>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {group && <Badge label={group.label} bg={group.color} color={group.text} />}
                            <Badge label={`Age ${liveAge(child)}`} bg={T.slate100} color={T.slate500} />
                            {child.gender && <Badge label={child.gender} bg={child.gender === "Boy" ? T.blueLight : "#FCE7F3"} color={child.gender === "Boy" ? T.blue : "#BE185D"} />}
                            {child.visitor && <Badge label="Visitor" bg="#F5F3FF" color="#7C3AED" />}
                            {birthday && <Badge label="Birthday" bg="#FEF9C3" color="#854D0E" />}
                            {absent >= 3 && !child.visitor && <Badge label={`${absent}wk absent`} bg={T.redLight} color={T.red} />}
                            {child.medical && child.medical !== "No known conditions" && <MedicalBadge />}
                          </div>
                          {(child.parent1 || child.parent2) && <div style={{ fontSize: 12, color: T.slate400, marginTop: 8 }}>{[child.parent1, child.parent2].filter(Boolean).join(" · ")}</div>}
                          {(child.siblings || []).length > 0 && <div style={{ fontSize: 12, color: T.tealDark, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><Icon name="siblings" size={12} color={T.tealDark} />{(child.siblings || []).length} sibling{(child.siblings || []).length > 1 ? "s" : ""}</div>}
                        </div>
                        <Icon name="chevronRight" size={16} color={T.slate300} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── CALENDAR ─────────────────────────────────────────────────────── */}
          {tab === "calendar" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                <button onClick={() => setCalMonth(p => { const d = new Date(p.y, p.m - 1); return { y: d.getFullYear(), m: d.getMonth() }; })} style={{ background: T.white, border: `1.5px solid ${T.slate200}`, borderRadius: 8, width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.slate600 }}>
                  <Icon name="chevronRight" size={16} color={T.slate600} style={{ transform: "rotate(180deg)" }} />
                </button>
                <h2 style={{ flex: 1, margin: 0, fontSize: 18, fontWeight: 600, color: T.slate900 }}>
                  {new Date(calMonth.y, calMonth.m).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                </h2>
                <button onClick={() => setCalMonth(p => { const d = new Date(p.y, p.m + 1); return { y: d.getFullYear(), m: d.getMonth() }; })} style={{ background: T.white, border: `1.5px solid ${T.slate200}`, borderRadius: 8, width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="chevronRight" size={16} color={T.slate600} />
                </button>
                <Btn variant="secondary" onClick={() => exportAttendanceCSV(children, attendance, calMonth.y, calMonth.m)}>
                  <Icon name="download" size={14} />Export CSV
                </Btn>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {getSundays(calMonth.y, calMonth.m).map((sunday, i) => {
                  const key = dateKey(sunday);
                  const dayAtt = attendance[key] || {};
                  const count = Object.keys(dayAtt).length;
                  const isToday = key === todayKey;
                  const isOpen = calOpen === key;
                  return (
                    <div key={key} style={{ background: T.white, borderRadius: 12, border: `1px solid ${isToday ? T.teal : T.slate200}`, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
                      <div onClick={() => setCalOpen(isOpen ? null : key)} style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15, color: T.slate900, display: "flex", alignItems: "center", gap: 8 }}>
                            {isToday && <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.teal, display: "inline-block" }} />}
                            {formatDate(sunday)}
                          </div>
                          <div style={{ fontSize: 13, color: T.slate400, marginTop: 2 }}>
                            {count > 0 ? `${count} children attended` : "No records"}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          {count > 0 && <div style={{ background: T.tealLight, color: T.tealDark, borderRadius: 20, padding: "3px 14px", fontWeight: 600, fontSize: 14 }}>{count}</div>}
                          <Icon name={isOpen ? "chevronDown" : "chevronRight"} size={16} color={T.slate400} />
                        </div>
                      </div>

                      {isOpen && (
                        <div style={{ borderTop: `1px solid ${T.slate100}`, padding: "12px 20px" }}>
                          {count === 0 && <p style={{ color: T.slate400, fontSize: 14 }}>No attendance recorded.</p>}
                          {Object.entries(dayAtt).map(([cid, rec]) => {
                            const child = children.find(c => c.id === cid);
                            if (!child) return null;
                            return (
                              <div key={cid} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: `1px solid ${T.slate100}` }}>
                                <ChildAvatar child={child} size={32} />
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontWeight: 500, fontSize: 14, color: T.slate800 }}>{child.name}</div>
                                  <div style={{ fontSize: 12, color: T.slate400 }}>
                                    In: {rec.in} {rec.inTeacher && `· ${rec.inTeacher}`}
                                    {rec.out && ` · Out: ${rec.out} ${rec.outTeacher ? `· ${rec.outTeacher}` : ""}`}
                                  </div>
                                </div>
                                {!rec.out && <Badge label="Still here" bg={T.greenLight} color={T.green} />}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── ACTIVITY LOG ─────────────────────────────────────────────────── */}
          {tab === "activity" && (
            <div>
              <p style={{ fontSize: 13, color: T.slate400, marginBottom: 20 }}>A safeguarding record of all check-in and check-out activity.</p>
              {activityLog.length === 0 && <p style={{ color: T.slate400 }}>No activity recorded yet.</p>}
              <div style={{ background: T.white, borderRadius: 12, border: `1px solid ${T.slate200}`, overflow: "hidden" }}>
                {activityLog.map((entry, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 16px", borderBottom: i < activityLog.length - 1 ? `1px solid ${T.slate100}` : "none" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: entry.action === "Check In" ? T.greenLight : T.slate100, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name={entry.action === "Check In" ? "checkin" : "logout"} size={14} color={entry.action === "Check In" ? T.green : T.slate500} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: T.slate800 }}>{entry.childName}</div>
                      <div style={{ fontSize: 12, marginTop: 3, display: "flex", flexWrap: "wrap", gap: "2px 6px", alignItems: "center" }}>
                        <span style={{ color: entry.action === "Check In" ? T.green : T.coral, fontWeight: 600 }}>{entry.action}</span>
                        <span style={{ color: T.slate300 }}>·</span>
                        <span style={{ color: T.slate500 }}>{entry.action === "Check In" ? "Checked in by" : "Checked out by"}: <strong style={{ color: T.slate700 }}>{entry.teacher}</strong></span>
                        {entry.collectedBy && <>
                          <span style={{ color: T.slate300 }}>·</span>
                          <span style={{ color: T.teal, fontWeight: 600 }}>Collected by: {entry.collectedBy}</span>
                        </>}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 11, color: T.slate400 }}>{entry.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ADMIN ────────────────────────────────────────────────────────── */}
          {tab === "admin" && isAdmin && (
            <AdminPanel currentUser={user} children={children} attendance={attendance} sessionKey={sessionKey} />
          )}

        </div>
      </div>

      {/* Modals */}
      {modal?.type === "add" && (
        <Modal title="Add New Child" subtitle="Enter the child's details below" onClose={() => setModal(null)} wide>
          <ChildForm onSave={addOrUpdateChild} onClose={() => setModal(null)} allChildren={children} />
        </Modal>
      )}
      {modal?.type === "view" && (() => {
        const child = children.find(c => c.id === modal.payload.id) || modal.payload;
        return (
          <Modal onClose={() => setModal(null)} wide>
            <ChildDetail child={child} onClose={() => setModal(null)}
              onEdit={() => setModal({ type: "edit", payload: child })}
              onDelete={deleteChild} allChildren={children} attendance={attendance} />
          </Modal>
        );
      })()}
      {modal?.type === "edit" && (() => {
        const child = children.find(c => c.id === modal.payload.id) || modal.payload;
        return (
          <Modal title="Edit Profile" onClose={() => setModal(null)} wide>
            <ChildForm initial={child} onSave={addOrUpdateChild} onClose={() => setModal(null)} allChildren={children} />
          </Modal>
        );
      })()}

      {modal?.type === "scanner" && (
        <Modal title="Scan Family QR Code" onClose={() => setModal(null)}>
          <QRScanner
            children={children}
            attendance={attendance}
            sessionKey={sessionKey}
            sessionAtt={sessionAtt}
            teacherName={teacherName}
            onClose={() => setModal(null)}
            onCheckIn={() => {}}
          />
        </Modal>
      )}

      {collectorModal && (() => {
        const child = children.find(c => c.id === collectorModal.childId);
        if (!child) return null;
        return (
          <Modal title="Check-Out" subtitle={`Confirm collection for ${child.name}`} onClose={() => setCollectorModal(null)}>
            <CollectorModal
              child={child}
              onClose={() => setCollectorModal(null)}
              onConfirm={async collectorName => {
                await checkOut(child.id, collectorName);
                setCollectorModal(null);
              }}
            />
          </Modal>
        );
      })()}

      {/* Mobile bottom nav */}
      <div className="mobile-nav" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, background: T.white,
        borderTop: `1px solid ${T.slate200}`, zIndex: 200,
        display: "flex", justifyContent: "space-around",
        padding: "8px 0 env(safe-area-inset-bottom)",
        boxShadow: "0 -4px 20px rgba(0,0,0,.08)"
      }}>
        {[
          { id: "checkin", icon: "checkin", label: "Check-In" },
          { id: "children", icon: "children", label: "Children" },
          { id: "calendar", icon: "calendar", label: "Calendar" },
          { id: "dashboard", icon: "dashboard", label: "Dashboard" },
          { id: "activity", icon: "activity", label: "Log" },
        ].map(n => {
          const active = tab === n.id;
          return (
            <button key={n.id} onClick={() => { setTab(n.id); setSearch(""); }}
              style={{ flex: 1, border: "none", background: "none", cursor: "pointer", padding: "4px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, fontFamily: FONT }}>
              <div style={{ width: 44, height: 28, borderRadius: 14, background: active ? T.teal : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}>
                <Icon name={n.icon} size={17} color={active ? "#fff" : T.slate400} />
              </div>
              <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, color: active ? T.teal : T.slate400, letterSpacing: ".01em" }}>{n.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
