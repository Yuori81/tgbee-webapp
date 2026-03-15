// ═══════════════════════════════════
// TG Bee — Shared UI Components
// ═══════════════════════════════════

import { C, F } from '../styles/tokens';

// ── App Header ──
export function AppHeader({ stars = 0, username = "@username" }) {
  return (
    <div style={{ height: 56, background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #1a5fa8, #2ea6ff)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "0 2px 10px rgba(46,166,255,0.3)" }}>📊</div>
        <div style={{ fontFamily: F.h, fontSize: 13, fontWeight: 700, color: C.text }}>TG Bee</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, background: "linear-gradient(90deg, rgba(245,166,35,.14), rgba(245,166,35,.07))", border: "1px solid rgba(245,166,35,.22)", borderRadius: 20, padding: "3px 9px", fontSize: 12, fontWeight: 700, color: C.amber }}>★ {stars}</div>
        <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{username}</div>
      </div>
    </div>
  );
}

// ── Tab Bar ──
export function TabBar({ active, onChange }) {
  const tabs = [
    { id: "cabinet", label: "Кабинет" },
    { id: "ideas", label: "Идеи" },
    { id: "search", label: "Поиск" },
    { id: "profile", label: "Профиль" },
  ];
  return (
    <div style={{ height: 42, background: C.surface, display: "flex", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
      {tabs.map(t => (
        <div key={t.id} onClick={() => onChange(t.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: t.id === "ideas" ? 11 : 12, fontWeight: 600, color: active === t.id ? C.accent : C.muted, cursor: "pointer", position: "relative", fontFamily: F.b, transition: "color 0.2s" }}>
          {t.label}
          {active === t.id && <div style={{ position: "absolute", bottom: 0, left: 6, right: 6, height: 2, background: C.accent, borderRadius: "2px 2px 0 0" }} />}
        </div>
      ))}
    </div>
  );
}

// ── Button ──
export function Btn({ variant = "primary", size = "lg", children, onClick, disabled, style: ex }) {
  const h = { lg: 52, md: 46, sm: 42 };
  const fs = { lg: 14.5, md: 13.5, sm: 13 };
  const base = {
    width: "100%", height: h[size], border: "none", borderRadius: 14,
    fontFamily: F.b, fontSize: fs[size], fontWeight: 700,
    cursor: disabled ? "default" : "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    position: "relative", overflow: "hidden",
    opacity: disabled ? 0.5 : 1, transition: "all 0.2s", ...ex,
  };
  const variants = {
    primary: { background: "linear-gradient(135deg, #1f6fbe, #2ea6ff)", color: "#fff", boxShadow: "0 4px 18px rgba(46,166,255,.3), inset 0 1px 0 rgba(255,255,255,.12)" },
    secondary: { background: C.surface2, color: C.text, border: `1px solid rgba(255,255,255,.1)` },
    ghost: { background: "transparent", color: C.muted, border: `1px solid ${C.border}`, fontWeight: 500 },
    purple: { background: "linear-gradient(135deg, #5a3a8a, #9b7fe8, #7b5dc8)", color: "#fff", boxShadow: "0 4px 20px rgba(155,127,232,.3), inset 0 1px 0 rgba(255,255,255,.12)" },
    green: { background: "linear-gradient(135deg, #2a8a45, #4dca6b)", color: "#fff", boxShadow: "0 4px 18px rgba(77,202,107,.3)" },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant] }}>
      {children}
    </button>
  );
}

// ── Free Pill ──
export function FreePill() {
  return (
    <span style={{ background: "rgba(77,202,107,.2)", border: "1px solid rgba(77,202,107,.3)", color: C.green, fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: ".04em" }}>
      бесплатно
    </span>
  );
}

// ── Divider ──
export function Divider({ text }) {
  const l = { flex: 1, height: 1, background: C.border };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 18px", color: C.muted, fontSize: 11 }}>
      <div style={l} />{text}<div style={l} />
    </div>
  );
}

// ── Nav Header (with back button) ──
export function NavHeader({ title, onBack }) {
  return (
    <div style={{ height: 52, background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12, padding: "0 16px", flexShrink: 0 }}>
      <div onClick={onBack} style={{ width: 32, height: 32, borderRadius: 10, background: C.surface2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: C.accent, cursor: "pointer" }}>←</div>
      <div style={{ fontFamily: F.h, fontSize: 13, fontWeight: 700, color: C.text }}>{title}</div>
    </div>
  );
}

// ── Section Label ──
export function SectionLabel({ children, style: ex }) {
  return (
    <div style={{ fontFamily: F.h, fontSize: 10, fontWeight: 600, color: C.muted, letterSpacing: ".09em", textTransform: "uppercase", ...ex }}>
      {children}
    </div>
  );
}

// ── Card ──
export function Card({ children, style: ex }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, ...ex }}>
      {children}
    </div>
  );
}

// ── Placeholder Screen ──
export function Placeholder({ title, icon, desc, onBack }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {onBack && <NavHeader title={title} onBack={onBack} />}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24 }}>
        <div style={{ fontSize: 48, opacity: 0.3 }}>{icon || "🚧"}</div>
        <div style={{ fontFamily: F.h, fontSize: 16, fontWeight: 700, color: C.text, textAlign: "center" }}>{title}</div>
        <div style={{ fontSize: 13, color: C.muted, textAlign: "center", lineHeight: 1.6 }}>{desc || "Следующее обновление"}</div>
      </div>
    </div>
  );
}
