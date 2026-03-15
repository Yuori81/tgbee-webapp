import { useState, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════
// TG Bee — Telegram Mini App  
// Шаг 2: Все экраны P1 (онбординг → кабинет → поиск → профиль → разбор) + PA воронка
// ═══════════════════════════════════════════════════════

const C = {
  bg: "#0e1621", surface: "#17212b", surface2: "#1e2d3d",
  border: "rgba(255,255,255,0.07)", text: "#e8f0f8", muted: "#6b8aaa",
  accent: "#2ea6ff", green: "#4dca6b", amber: "#f5a623",
  red: "#ff5252", gold: "#ffd166", purple: "#9b7fe8",
};
const F = { h: "'Unbounded', sans-serif", b: "'Geologica', sans-serif" };

// ═══════════ SHARED UI ═══════════

function AppHeader({ stars = 0, username = "@username" }) {
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

function TabBar({ active, onChange }) {
  const tabs = [{ id: "cabinet", label: "Кабинет" }, { id: "ideas", label: "Идеи" }, { id: "search", label: "Поиск" }, { id: "profile", label: "Профиль" }];
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

function Btn({ variant = "primary", size = "lg", children, onClick, disabled, style: ex }) {
  const h = { lg: 52, md: 46, sm: 42 }; const fs = { lg: 14.5, md: 13.5, sm: 13 };
  const base = { width: "100%", height: h[size], border: "none", borderRadius: 14, fontFamily: F.b, fontSize: fs[size], fontWeight: 700, cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, position: "relative", overflow: "hidden", opacity: disabled ? 0.5 : 1, transition: "all 0.2s", ...ex };
  const v = {
    primary: { background: "linear-gradient(135deg, #1f6fbe, #2ea6ff)", color: "#fff", boxShadow: "0 4px 18px rgba(46,166,255,.3), inset 0 1px 0 rgba(255,255,255,.12)" },
    secondary: { background: C.surface2, color: C.text, border: `1px solid rgba(255,255,255,.1)` },
    ghost: { background: "transparent", color: C.muted, border: `1px solid ${C.border}`, fontWeight: 500 },
    purple: { background: "linear-gradient(135deg, #5a3a8a, #9b7fe8, #7b5dc8)", color: "#fff", boxShadow: "0 4px 20px rgba(155,127,232,.3), inset 0 1px 0 rgba(255,255,255,.12)" },
    green: { background: "linear-gradient(135deg, #2a8a45, #4dca6b)", color: "#fff", boxShadow: "0 4px 18px rgba(77,202,107,.3)" },
  };
  return <button onClick={disabled ? undefined : onClick} style={{ ...base, ...v[variant] }}>{children}</button>;
}

function FreePill() {
  return <span style={{ background: "rgba(77,202,107,.2)", border: "1px solid rgba(77,202,107,.3)", color: C.green, fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: ".04em" }}>бесплатно</span>;
}

function Divider({ text }) {
  const l = { flex: 1, height: 1, background: C.border };
  return <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 18px", color: C.muted, fontSize: 11 }}><div style={l} />{text}<div style={l} /></div>;
}

function NavHeader({ title, onBack }) {
  return (
    <div style={{ height: 52, background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12, padding: "0 16px", flexShrink: 0 }}>
      <div onClick={onBack} style={{ width: 32, height: 32, borderRadius: 10, background: C.surface2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: C.accent, cursor: "pointer" }}>←</div>
      <div style={{ fontFamily: F.h, fontSize: 13, fontWeight: 700, color: C.text }}>{title}</div>
    </div>
  );
}

function SectionLabel({ children, style: ex }) {
  return <div style={{ fontFamily: F.h, fontSize: 10, fontWeight: 600, color: C.muted, letterSpacing: ".09em", textTransform: "uppercase", ...ex }}>{children}</div>;
}

function Card({ children, style: ex }) {
  return <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, ...ex }}>{children}</div>;
}

// ═══════════ P1-3: ОНБОРДИНГ ═══════════

function OnboardingScreen({ onStartAnalysis, onAudit, onSkip }) {
  const feats = [
    { icon: "📊", bg: "rgba(46,166,255,.12)", t: "Анализ канала по данным TGStat", free: true },
    { icon: "🤝", bg: "rgba(77,202,107,.1)", t: "Подбор каналов для взаимопиара" },
    { icon: "📣", bg: "rgba(245,166,35,.1)", t: "Подбор каналов для рекламы" },
    { icon: "📈", bg: "rgba(64,200,200,.1)", t: "Простые отчёты по росту" },
    { icon: "🔍", bg: "rgba(255,100,150,.1)", t: "Краткий разбор канала и воронки" },
  ];
  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "22px 18px 18px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 80% 20%, rgba(46,166,255,.1) 0%, transparent 70%), radial-gradient(ellipse 50% 80% at 10% 80%, rgba(77,202,107,.05) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(77,202,107,.1)", border: "1px solid rgba(77,202,107,.2)", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, color: C.green, letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 12 }}>✦ Новый пользователь</div>
        <div style={{ fontFamily: F.h, fontSize: 19, fontWeight: 800, color: C.text, lineHeight: 1.25, letterSpacing: "-.02em", marginBottom: 8 }}>
          Добро пожаловать<br />в <span style={{ color: C.accent }}>Кабинет роста!</span>
        </div>
        <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.55 }}>Всё, что нужно для роста вашего Telegram‑канала — в одном месте.</div>
      </div>
      <div style={{ padding: "0 18px 4px", display: "flex", flexDirection: "column" }}>
        <SectionLabel style={{ marginBottom: 10 }}>Что умеет сервис</SectionLabel>
        {feats.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: i < feats.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{f.icon}</div>
            <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.3 }}>{f.t}</div>
            {f.free && <div style={{ background: "rgba(77,202,107,.15)", border: "1px solid rgba(77,202,107,.25)", borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 800, color: C.green, textTransform: "uppercase" }}>FREE</div>}
          </div>
        ))}
      </div>
      <div style={{ padding: "16px 18px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
        <Btn onClick={onStartAnalysis}>📊 Первый анализ канала <FreePill /></Btn>
        <Btn variant="secondary" size="md" onClick={onAudit}>🔍 Разбор канала / воронки</Btn>
        <Divider text="уже знакомы?" />
        <Btn variant="ghost" size="sm" onClick={onSkip}>Перейти в Кабинет →</Btn>
      </div>
    </div>
  );
}

// ═══════════ P1-4: ПЕРВЫЙ АНАЛИЗ ═══════════

function FirstAnalysisScreen({ onBack, onAnalyze }) {
  const [link, setLink] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleAnalyze = () => {
    if (!link.trim()) return;
    setAnalyzing(true); setProgress(0);
    const iv = setInterval(() => {
      setProgress(p => { if (p >= 100) { clearInterval(iv); onAnalyze(link); return 100; } return p + Math.random() * 15 + 5; });
    }, 300);
  };

  if (analyzing) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 24 }}>
        <div style={{ position: "relative", width: 72, height: 72 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle, rgba(46,166,255,.15), transparent)", animation: "pulse 2s ease-in-out infinite" }} />
          <svg width="72" height="72" viewBox="0 0 72 72" style={{ animation: "spin 1.5s linear infinite" }}>
            <circle cx="36" cy="36" r="30" stroke={C.surface2} strokeWidth="4" fill="none" />
            <circle cx="36" cy="36" r="30" stroke={C.accent} strokeWidth="4" fill="none" strokeDasharray={`${Math.min(progress, 100) * 1.88} 188`} strokeLinecap="round" transform="rotate(-90 36 36)" style={{ transition: "stroke-dasharray 0.3s" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.h, fontSize: 14, fontWeight: 700, color: C.accent }}>{Math.min(Math.round(progress), 100)}%</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 4 }}>Анализируем канал…</div>
          <div style={{ fontSize: 12, color: C.muted }}>Получаем данные из TGStat</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <NavHeader title="Первый анализ" onBack={onBack} />
      <div style={{ padding: "20px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        <Card style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #4dca6b, rgba(77,202,107,.2), transparent)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>📊</span>
            <span style={{ fontFamily: F.h, fontSize: 15, fontWeight: 700, color: C.text }}>Бесплатный анализ</span>
            <FreePill />
          </div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.55 }}>Введите ссылку на Telegram-канал или @username — мы покажем ключевые метрики.</div>
        </Card>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18, opacity: 0.5 }}>🔗</span>
          <input type="text" value={link} onChange={e => setLink(e.target.value)} placeholder="@channel или t.me/channel" style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 14, fontFamily: F.b }} />
          {link && <div onClick={() => setLink("")} style={{ width: 24, height: 24, borderRadius: 8, background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: C.muted, cursor: "pointer" }}>✕</div>}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["@psychologist_pro", "@coach_anna", "@therapist_blog"].map(ex => (
            <div key={ex} onClick={() => setLink(ex)} style={{ background: "rgba(46,166,255,.08)", border: "1px solid rgba(46,166,255,.15)", borderRadius: 20, padding: "4px 10px", fontSize: 11, color: C.accent, cursor: "pointer", fontWeight: 500 }}>{ex}</div>
          ))}
        </div>
      </div>
      <div style={{ padding: "12px 16px 24px", flexShrink: 0 }}><Btn onClick={handleAnalyze} disabled={!link.trim()}>📊 Анализировать канал</Btn></div>
    </div>
  );
}

// ═══════════ P1-5: РЕЗУЛЬТАТ АНАЛИЗА ═══════════

function AnalysisResultScreen({ channel, onToCabinet, onAudit }) {
  const metrics = [
    { label: "Подписчики", value: "5,247", change: "+124", pos: true },
    { label: "Охват поста", value: "1,832", change: "+8%", pos: true },
    { label: "ER", value: "34.9%", change: "", pos: true },
    { label: "ER24", value: "28.1%", change: "-2%", pos: false },
    { label: "Индекс цит.", value: "12.4", change: "+0.8", pos: true },
    { label: "Постов/нед", value: "4.2", change: "", pos: true },
  ];
  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: F.h, fontSize: 13, fontWeight: 700, color: C.text }}>{channel || "@my_main_channel"}</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 4, borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 700, background: "rgba(77,202,107,.14)", border: "1.5px solid rgba(77,202,107,.28)", color: C.green }}>✓ Хорошо</div>
      </div>
      <div style={{ display: "flex", overflowX: "auto", background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "0 8px" }}>
        {["Обзор", "Динамика", "Аудитория", "Контент"].map((t, i) => (
          <div key={t} style={{ flexShrink: 0, padding: "9px 11px", fontSize: 11.5, fontWeight: 600, color: i === 0 ? C.accent : C.muted, position: "relative", whiteSpace: "nowrap", cursor: "pointer" }}>
            {t}{i === 0 && <div style={{ position: "absolute", bottom: 0, left: 5, right: 5, height: 2, background: C.accent, borderRadius: "2px 2px 0 0" }} />}
          </div>
        ))}
      </div>
      <div style={{ padding: "14px 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${C.green}, rgba(77,202,107,.2), transparent)` }} />
          <div style={{ fontFamily: F.h, fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>Результат анализа</div>
          <div style={{ fontSize: 12, color: C.muted }}>Данные TGStat · обновлено только что</div>
        </Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {metrics.map((m, i) => (
            <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 10px", textAlign: "center" }}>
              <div style={{ fontFamily: F.h, fontSize: 16, fontWeight: 700, color: C.text }}>{m.value}</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{m.label}</div>
              {m.change && <div style={{ fontSize: 10, fontWeight: 700, marginTop: 3, color: m.pos ? C.green : C.red }}>{m.change}</div>}
            </div>
          ))}
        </div>
        <Card>
          <div style={{ fontFamily: F.h, fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 10 }}>💡 Рекомендации</div>
          {["Увеличьте частоту публикаций до 5-6 в неделю", "Попробуйте взаимопиар — ваш ER позволяет", "Хороший индекс цитирования — используйте для рекламы"].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 0", fontSize: 12.5, color: "rgba(232,240,248,.8)", lineHeight: 1.5 }}>
              <span style={{ width: 18, height: 18, borderRadius: 6, flexShrink: 0, background: "rgba(46,166,255,.12)", border: "1px solid rgba(46,166,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.accent, fontWeight: 700 }}>{i + 1}</span>{r}
            </div>
          ))}
        </Card>
        <Btn onClick={onToCabinet}>Перейти в Кабинет →</Btn>
        <Btn variant="purple" size="md" onClick={onAudit}>🔍 Бесплатный разбор канала</Btn>
      </div>
    </div>
  );
}

// ═══════════ P1-6: КАБИНЕТ ═══════════

function CabinetScreen({ onNavigate, channel }) {
  const ch = channel || { username: "@my_main_channel", subs: "5.2k" };
  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: F.h, fontSize: 13, fontWeight: 700, color: C.text }}>{ch.username}</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{ch.subs} подписчиков</div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 4, borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 700, background: "rgba(77,202,107,.14)", border: "1.5px solid rgba(77,202,107,.28)", color: C.green }}>✓ Хорошо</div>
      </div>
      <div style={{ display: "flex", overflowX: "auto", background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "0 8px" }}>
        {["Обзор", "Метрики", "Динамика", "Аудитория", "Контент"].map((t, i) => (
          <div key={t} style={{ flexShrink: 0, padding: "9px 11px", fontSize: 11.5, fontWeight: 600, color: i === 0 ? C.accent : C.muted, position: "relative", whiteSpace: "nowrap" }}>
            {t}{i === 0 && <div style={{ position: "absolute", bottom: 0, left: 5, right: 5, height: 2, background: C.accent, borderRadius: "2px 2px 0 0" }} />}
          </div>
        ))}
      </div>
      <div style={{ padding: "14px 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: "linear-gradient(135deg, rgba(46,166,255,.2), rgba(46,166,255,.08))", border: "1px solid rgba(46,166,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📊</div>
            <div>
              <div style={{ fontFamily: F.h, fontSize: 14, fontWeight: 700, color: C.text }}>Анализ канала</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Обновлено сегодня</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
            {[{ v: "5,247", l: "Подписч." }, { v: "34.9%", l: "ER" }, { v: "1,832", l: "Охват" }].map((m, i) => (
              <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 10px", textAlign: "center" }}>
                <div style={{ fontFamily: F.h, fontSize: 15, fontWeight: 700, color: C.text }}>{m.v}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{m.l}</div>
              </div>
            ))}
          </div>
          <Btn variant="primary" size="sm" onClick={() => onNavigate("analysis-result")}>Смотреть подробный анализ →</Btn>
        </Card>
        {/* PA-1 Audit entry */}
        <div style={{ background: "linear-gradient(135deg, rgba(155,127,232,.12), rgba(155,127,232,.04))", border: "1.5px solid rgba(155,127,232,.28)", borderRadius: 18, padding: "18px 16px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(155,127,232,.15), transparent 70%)", pointerEvents: "none" }} />
          <div style={{ fontSize: 10, fontWeight: 700, color: C.purple, letterSpacing: ".09em", textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.purple, boxShadow: "0 0 8px rgba(155,127,232,.6)", animation: "pulse 2s ease-in-out infinite" }} />Бесплатно
          </div>
          <div style={{ fontFamily: F.h, fontSize: 17, fontWeight: 800, color: C.text, lineHeight: 1.2, marginBottom: 8 }}>Разбор канала и воронки</div>
          <div style={{ fontSize: 13, color: "rgba(232,240,248,.7)", lineHeight: 1.6, marginBottom: 16 }}>Наш специалист посмотрит ваш канал, воронку и даст конкретные рекомендации.</div>
          {["Анализ контент-стратегии", "Разбор воронки продаж", "План роста на 30 дней"].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "rgba(200,168,255,.85)", marginBottom: 6 }}>
              <span style={{ width: 18, height: 18, borderRadius: 6, background: "rgba(155,127,232,.2)", border: "1px solid rgba(155,127,232,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.purple, fontWeight: 700 }}>✓</span>{f}
            </div>
          ))}
          <div style={{ marginTop: 14 }}><Btn variant="purple" onClick={() => onNavigate("audit")}>🎯 Получить разбор</Btn></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[{ icon: "🤝", label: "Взаимопиар", s: "vp-list" }, { icon: "📣", label: "Реклама", s: "ads-list" }, { icon: "📈", label: "Отчёт", s: "report" }, { icon: "🔍", label: "Разбор", s: "breakdown" }].map(a => (
            <div key={a.label} onClick={() => onNavigate(a.s)} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 12px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <span style={{ fontSize: 22 }}>{a.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{a.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════ P1-7: РАЗБОР КАНАЛА ═══════════

function BreakdownScreen({ onBack, onNavigate }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <NavHeader title="Разбор канала" onBack={onBack} />
      <div style={{ padding: "18px 16px 16px", background: `linear-gradient(180deg, ${C.surface} 0%, ${C.bg} 100%)`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(155,127,232,.12)", border: "1px solid rgba(155,127,232,.22)", borderRadius: 20, padding: "3px 10px", fontSize: 10, fontWeight: 700, color: C.purple, marginBottom: 10 }}>🔍 Разбор</div>
        <div style={{ fontFamily: F.h, fontSize: 17, fontWeight: 800, color: C.text, lineHeight: 1.2, marginBottom: 12 }}>Краткий разбор<br />канала и воронки</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #1a3a6b, #2ea6ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: F.h }}>MC</div>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>@my_channel</span>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 3, borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 700, background: "rgba(77,202,107,.14)", color: C.green }}>🟢 Перспективный</div>
        </div>
      </div>
      <div style={{ padding: "14px 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Block 1 */}
        <Card style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: C.green, borderRadius: "0 2px 2px 0" }} />
          <SectionLabel>01 · Состояние канала</SectionLabel>
          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "10px 0 8px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, boxShadow: `0 0 8px rgba(77,202,107,.5)`, animation: "pulse 2s ease-in-out infinite" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: C.green }}>Режим: активный рост</span>
          </div>
          <div style={{ fontSize: 13, color: "rgba(232,240,248,.75)", lineHeight: 1.6 }}>
            Канал в состоянии «рост»: аудитория увеличивается, <strong style={{ color: C.text }}>ER 11.2% выше среднего</strong> по нише (норма 5–8%). Сейчас подходящий момент для ВП и тестовой рекламы.
          </div>
        </Card>
        {/* Block 2 */}
        <Card style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: C.accent, borderRadius: "0 2px 2px 0" }} />
          <SectionLabel>02 · Текущая воронка</SectionLabel>
          {[{ icon: "🤝", l: "Взаимопиар", v: "3 кейса", sub: "+420 подп. / ВП", chip: "Активно", cc: C.green },
            { icon: "📣", l: "Реклама", v: "1 размещение", sub: "Мало данных", chip: "Тест", cc: C.amber },
            { icon: "🌱", l: "Органика", v: "+214 за 7 дней", sub: "Хороший уровень", chip: "Норма", cc: C.green }
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${r.cc}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{r.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{r.l}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginTop: 1 }}>{r.v}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{r.sub}</div>
              </div>
              <div style={{ background: `${r.cc}20`, border: `1px solid ${r.cc}40`, borderRadius: 20, padding: "3px 8px", fontSize: 10, fontWeight: 700, color: r.cc, flexShrink: 0 }}>{r.chip}</div>
            </div>
          ))}
        </Card>
        {/* Block 3 */}
        <Card style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: C.amber, borderRadius: "0 2px 2px 0" }} />
          <SectionLabel>03 · Шаги на 2–4 недели</SectionLabel>
          {[{ t: "Сделать 2–3 ВП с партнёрами уровня Green", s: "Подобранные каналы — в «Взаимопиар»" },
            { t: "Протестировать 1 площадку, бюджет до 3 000 ₽", s: "Площадки — в разделе «Реклама»" },
            { t: "Заполнить отчёт после каждого размещения", s: "Поможет выявить лучший канал" },
            { t: "Проверить ER через 2 недели", s: "Тревожный сигнал ниже 8% после ВП" }
          ].map((st, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 24, height: 24, borderRadius: 8, background: "rgba(245,166,35,.12)", border: "1px solid rgba(245,166,35,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.amber, flexShrink: 0 }}>{i + 1}</div>
              <div><div style={{ fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.4 }}>{st.t}</div><div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{st.s}</div></div>
            </div>
          ))}
        </Card>
        <SectionLabel>⚡ Следующий шаг</SectionLabel>
        {[{ icon: "🤝", t: "Подобрать партнёров для ВП", s: "vp-list" }, { icon: "📣", t: "Найти площадки для рекламы", s: "ads-list" }].map(a => (
          <div key={a.t} onClick={() => onNavigate(a.s)} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "13px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <span style={{ fontSize: 18 }}>{a.icon}</span>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: C.text }}>{a.t}</span>
            <span style={{ color: C.muted, fontSize: 16 }}>›</span>
          </div>
        ))}
        <div style={{ background: "rgba(46,166,255,.05)", border: `1px solid rgba(46,166,255,.12)`, borderRadius: 16, padding: 14, display: "flex", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(46,166,255,.1)", border: "1px solid rgba(46,166,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🤖</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, display: "flex", alignItems: "center", gap: 6 }}>ИИ‑разбор контента<span style={{ background: "rgba(245,166,35,.15)", border: "1px solid rgba(245,166,35,.25)", borderRadius: 20, padding: "1px 7px", fontSize: 9, fontWeight: 700, color: C.amber }}>Скоро</span></div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 3, lineHeight: 1.5 }}>В следующей версии ИИ проанализирует контент и даст персональные рекомендации.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════ P1-8: ПОИСК ═══════════

function SearchScreen({ onAnalyze }) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const history = [
    { handle: "@psylife_daily", ini: "PS", meta: "18.4k · ER 9.8%", bg: "linear-gradient(135deg,#1a3a6b,#2ea6ff)", v: "green" },
    { handle: "@finance_tricks", ini: "FT", meta: "34.8k · ER 2.4%", bg: "linear-gradient(135deg,#2a1a4a,#9b5de5)", v: "yellow" },
    { handle: "@mind_growth", ini: "MG", meta: "9.1k · ER 13.1%", bg: "linear-gradient(135deg,#1a3a2a,#3aaa5c)", v: "green" },
    { handle: "@biz_zone_ru", ini: "BZ", meta: "52.1k · ER 1.8%", bg: "linear-gradient(135deg,#3a1a1a,#c44040)", v: "red" },
  ];
  const vc = { green: C.green, yellow: C.gold, red: C.red };
  const handleSearch = () => { if (!query.trim()) return; setSearching(true); setTimeout(() => { setSearching(false); onAnalyze?.(query); }, 1500); };

  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 16px 16px", background: `linear-gradient(180deg, ${C.surface} 0%, ${C.bg} 100%)`, borderBottom: `1px solid ${C.border}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 100% 200% at 100% 0%, rgba(46,166,255,.07) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ fontFamily: F.h, fontSize: 17, fontWeight: 800, color: C.text, lineHeight: 1.2, marginBottom: 14 }}>Поиск и <span style={{ color: C.accent }}>анализ</span><br />каналов</div>
        <div style={{ display: "flex", gap: 9 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, fontWeight: 700, color: C.accent, opacity: 0.55, pointerEvents: "none" }}>@</span>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} placeholder="example_channel"
              style={{ width: "100%", height: 48, background: C.surface2, border: `1.5px solid ${query ? "rgba(46,166,255,.3)" : C.border}`, borderRadius: 13, padding: "0 40px", fontFamily: F.b, fontSize: 14.5, fontWeight: 500, color: C.text, outline: "none", transition: "border-color .18s" }} />
            {query && <div onClick={() => setQuery("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 20, height: 20, borderRadius: "50%", background: "rgba(107,138,170,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.muted, cursor: "pointer" }}>✕</div>}
          </div>
          <button onClick={handleSearch} disabled={!query.trim() || searching}
            style={{ height: 48, padding: "0 18px", border: "none", borderRadius: 13, background: query.trim() && !searching ? "linear-gradient(135deg,#1f6fbe,#2ea6ff)" : C.surface2, color: query.trim() && !searching ? "#fff" : "rgba(107,138,170,.5)", fontFamily: F.b, fontSize: 14, fontWeight: 700, cursor: query.trim() && !searching ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 6, flexShrink: 0, boxShadow: query.trim() && !searching ? "0 4px 14px rgba(46,166,255,.28)" : "none" }}>
            {searching ? <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.25)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} /> : "Анализ"}
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, fontWeight: 500, marginTop: 8, color: C.muted }}>
          <span>1‑й анализ: <strong style={{ color: C.green }}>0★</strong></span>
          <span style={{ color: C.border, fontSize: 16 }}>·</span>
          <span>Повторно: <strong style={{ color: C.amber }}>★ 3</strong> за канал</span>
        </div>
      </div>
      <div style={{ padding: "16px 16px 28px", display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionLabel>🕐 Недавно смотрели</SectionLabel>
        <Card style={{ padding: 0, overflow: "hidden" }}>
          {history.map((h, i) => (
            <div key={i} onClick={() => setQuery(h.handle)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderBottom: i < history.length - 1 ? `1px solid ${C.border}` : "none", cursor: "pointer" }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: h.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: F.h, flexShrink: 0 }}>{h.ini}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>{h.handle}</div>
                <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{h.meta}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: vc[h.v], boxShadow: `0 0 6px ${vc[h.v]}80` }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, padding: "3px 9px", borderRadius: 20, border: "1px solid rgba(46,166,255,.2)", background: "rgba(46,166,255,.07)" }}>Открыть →</div>
              </div>
            </div>
          ))}
        </Card>
        <SectionLabel style={{ marginTop: 4 }}>💡 Популярные ниши</SectionLabel>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["😌 Психология", "💰 Финансы", "🚀 Бизнес", "🎓 Обучение", "💪 ЗОЖ"].map(n => (
            <div key={n} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: 600, color: C.muted, cursor: "pointer" }}>{n}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════ P1-9: ПРОФИЛЬ ═══════════

function ProfileScreen({ onAudit, onNavigate }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 16px", background: `linear-gradient(180deg, ${C.surface} 0%, ${C.bg} 100%)`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg, #1a3a6b, #2ea6ff)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.h, fontSize: 18, fontWeight: 700, color: "#fff" }}>U</div>
          <div>
            <div style={{ fontFamily: F.h, fontSize: 15, fontWeight: 700, color: C.text }}>@username</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Участник с июля 2025</div>
          </div>
        </div>
        <div style={{ marginTop: 16, background: "rgba(245,166,35,.06)", border: "1px solid rgba(245,166,35,.18)", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 2 }}>Баланс Stars</div>
            <div style={{ fontFamily: F.h, fontSize: 28, fontWeight: 800, color: C.text }}>27<span style={{ fontSize: 16, color: C.amber, marginLeft: 2 }}>★</span></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <button style={{ background: "linear-gradient(135deg, rgba(245,166,35,.2), rgba(245,166,35,.08))", border: "1px solid rgba(245,166,35,.3)", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 700, color: C.amber, cursor: "pointer", fontFamily: F.b }}>Пополнить ★</button>
            <div style={{ fontSize: 11, color: C.muted }}>≈ 9 анализов</div>
          </div>
        </div>
      </div>
      <div style={{ padding: "16px 16px 28px", display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionLabel>⭐ Купить Stars</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[{ s: 20, p: "99 ₽", per: "4.95 ₽/★" }, { s: 50, p: "199 ₽", per: "3.98 ₽/★", hit: true }, { s: 100, p: "349 ₽", per: "3.49 ₽/★" }].map((pkg, i) => (
            <div key={i} style={{ background: pkg.hit ? "rgba(46,166,255,.06)" : C.surface, border: `1.5px solid ${pkg.hit ? "rgba(46,166,255,.3)" : C.border}`, borderRadius: 14, padding: "14px 8px", textAlign: "center", cursor: "pointer", position: "relative" }}>
              {pkg.hit && <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", background: C.accent, color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>Хит</div>}
              <div style={{ fontFamily: F.h, fontSize: 22, fontWeight: 800, color: C.text }}>{pkg.s}</div>
              <div style={{ fontSize: 11, color: C.amber, fontWeight: 700, marginTop: 2 }}>★ Stars</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginTop: 6 }}>{pkg.p}</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{pkg.per}</div>
            </div>
          ))}
        </div>
        <SectionLabel>🎁 Реферальная программа</SectionLabel>
        <Card>
          <div style={{ fontFamily: F.h, fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 6 }}>Приглашай друзей — получай Stars</div>
          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.55, marginBottom: 12 }}>За каждую активность реферала ты получаешь <strong style={{ color: C.text }}>бонусные ★ Stars</strong> на баланс.</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {["🤝 +5★ за регистрацию", "⚡ +2★ за анализ"].map(c => <div key={c} style={{ background: "rgba(245,166,35,.1)", border: "1px solid rgba(245,166,35,.2)", borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: C.amber }}>{c}</div>)}
          </div>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1, fontSize: 12, color: C.muted, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>t.me/tgbee_bot?start=ref_u9s3k</div>
            <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ background: "rgba(46,166,255,.1)", border: "1px solid rgba(46,166,255,.2)", borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 700, color: C.accent, cursor: "pointer", fontFamily: F.b, flexShrink: 0 }}>{copied ? "✓ Готово" : "📋 Скопировать"}</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10, textAlign: "center" }}>
              <div style={{ fontFamily: F.h, fontSize: 18, fontWeight: 700, color: C.text }}>3</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Приглашено</div>
            </div>
            <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10, textAlign: "center" }}>
              <div style={{ fontFamily: F.h, fontSize: 18, fontWeight: 700, color: C.gold }}>+11★</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Заработано</div>
            </div>
          </div>
        </Card>
        <SectionLabel>⚙️ Ещё</SectionLabel>
        <Card style={{ padding: 0, overflow: "hidden" }}>
          {[{ icon: "⭐", t: "Пополнить Stars", action: () => onNavigate?.("stars") }, { icon: "🔔", t: "Настройки уведомлений", action: () => onNavigate?.("notifications") }, { icon: "🏅", t: "Бейджи и кейсы", action: () => onNavigate?.("badges") }].map((s, i) => (
            <div key={i} onClick={s.action} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: i < 2 ? `1px solid ${C.border}` : "none", cursor: "pointer" }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.text }}>{s.t}</span>
              <span style={{ color: C.muted, fontSize: 16 }}>›</span>
            </div>
          ))}
        </Card>
        <SectionLabel>💬 Поддержка</SectionLabel>
        <Card style={{ padding: 0, overflow: "hidden" }}>
          {[{ icon: "💬", t: "Написать в поддержку" }, { icon: "🏢", t: "Агентские услуги", action: onAudit }].map((s, i) => (
            <div key={i} onClick={s.action} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: i === 0 ? `1px solid ${C.border}` : "none", cursor: "pointer" }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.text }}>{s.t}</span>
              <span style={{ color: C.muted, fontSize: 16 }}>›</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ═══════════ PA: ВОРОНКА АГЕНТСТВА ═══════════

function AuditFlowScreen({ onBack, onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const steps = [
    { title: "Ссылка на канал", q: "Укажите @username вашего канала", type: "input", ph: "@channel или t.me/channel" },
    { title: "Кто вы?", q: "Чем вы занимаетесь?", type: "choice", opts: ["Психолог", "Коуч", "Эксперт / консультант", "Другое"] },
    { title: "Доход", q: "Примерный доход в месяц?", type: "choice", opts: ["До 100 000 ₽", "100–300 000 ₽", "300–500 000 ₽", "Больше 500 000 ₽"] },
    { title: "Бюджет", q: "Сколько готовы вкладывать?", type: "choice", opts: ["До 30 000 ₽", "30–80 000 ₽", "80–150 000 ₽", "Больше 150 000 ₽"] },
    { title: "Опыт", q: "Что пробовали для продвижения?", type: "multi", opts: ["Взаимопиар", "Реклама в каналах", "Таргет", "Рилсы / YouTube", "Ничего"] },
    { title: "Боль", q: "Что мешает росту больше всего?", type: "choice", opts: ["Мало подписчиков", "Подписчики есть, клиентов нет", "Не знаю что публиковать", "Нет времени"] },
  ];
  const canNext = () => { const s = steps[step]; if (s.type === "input") return (answers[step] || "").trim().length > 0; if (s.type === "multi") return (answers[step] || []).length > 0; return answers[step] !== undefined; };
  const next = () => { if (step < steps.length - 1) setStep(step + 1); else { setDone(true); onComplete?.(answers); } };

  if (done) return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <NavHeader title="Заявка принята" onBack={onBack} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "24px 20px" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, rgba(155,127,232,.2), rgba(155,127,232,.05))", border: "2px solid rgba(155,127,232,.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>✅</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: F.h, fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 8 }}>Заявка принята!</div>
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>Специалист посмотрит канал и напишет в личку в течение 24 часов.</div>
        </div>
        <Card style={{ width: "100%" }}>
          {[{ icon: "✅", t: "Заявка принята", on: true }, { icon: "🔍", t: "Смотрим канал", on: false }, { icon: "💬", t: "Напишем в личку", on: false }].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", opacity: s.on ? 1 : 0.4, borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span><span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{s.t}</span>
            </div>
          ))}
        </Card>
        <Btn variant="ghost" size="md" onClick={onBack}>← В Кабинет</Btn>
      </div>
    </div>
  );

  const s = steps[step];
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <NavHeader title="Разбор канала" onBack={step === 0 ? onBack : () => setStep(step - 1)} />
      <div style={{ padding: "12px 16px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: C.purple, fontWeight: 700 }}>Шаг {step + 1} из {steps.length}</span>
          <span style={{ fontSize: 11, color: C.muted }}>{s.title}</span>
        </div>
        <div style={{ height: 3, background: C.surface2, borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${((step + 1) / steps.length) * 100}%`, background: `linear-gradient(90deg, #5a3a8a, ${C.purple})`, borderRadius: 2, transition: "width 0.3s" }} />
        </div>
      </div>
      <div style={{ padding: "20px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontFamily: F.h, fontSize: 16, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>{s.q}</div>
        {s.type === "input" && <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 14px" }}><input type="text" value={answers[step] || ""} onChange={e => setAnswers({ ...answers, [step]: e.target.value })} placeholder={s.ph} style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 14, fontFamily: F.b }} /></div>}
        {s.type === "choice" && s.opts.map(o => <div key={o} onClick={() => setAnswers({ ...answers, [step]: o })} style={{ background: answers[step] === o ? "rgba(155,127,232,.15)" : C.surface, border: `1.5px solid ${answers[step] === o ? "rgba(155,127,232,.4)" : C.border}`, borderRadius: 14, padding: "14px 16px", fontSize: 14, fontWeight: 600, color: answers[step] === o ? C.purple : C.text, cursor: "pointer" }}>{o}</div>)}
        {s.type === "multi" && s.opts.map(o => { const sel = (answers[step] || []).includes(o); return <div key={o} onClick={() => { const c = answers[step] || []; setAnswers({ ...answers, [step]: sel ? c.filter(v => v !== o) : [...c, o] }); }} style={{ background: sel ? "rgba(155,127,232,.15)" : C.surface, border: `1.5px solid ${sel ? "rgba(155,127,232,.4)" : C.border}`, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600, color: sel ? C.purple : C.text, cursor: "pointer" }}><div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${sel ? C.purple : C.muted}`, background: sel ? C.purple : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff" }}>{sel && "✓"}</div>{o}</div>; })}
        <div style={{ marginTop: "auto", display: "flex", gap: 8 }}>
          {step > 0 && <Btn variant="ghost" size="md" onClick={() => setStep(step - 1)} style={{ width: "auto", padding: "0 20px", flex: "0 0 auto" }}>←</Btn>}
          <Btn variant="purple" onClick={next} disabled={!canNext()}>{step < steps.length - 1 ? "Далее →" : "Отправить заявку"}</Btn>
        </div>
      </div>
    </div>
  );
}

// ═══════════ P2-1: ВП СПИСОК ПАРТНЁРОВ ═══════════

function VPListScreen({ onBack, onOpenCard }) {
  const partners = [
    { handle: "@psylife_daily", ini: "PS", bg: "linear-gradient(135deg,#1a3a6b,#2ea6ff)", badge: "⭐ Gold", badgeColor: C.gold, src: "VP‑база", case_: "3 ВП → +240 подп.", subs: "18.4k", er: "9.8%", reach: "4 200" },
    { handle: "@mind_growth", ini: "MG", bg: "linear-gradient(135deg,#1a3a2a,#3aaa5c)", badge: "🥈 Silver", badgeColor: "#a8c0d6", src: "VP‑база", case_: "1 ВП → +180 подп.", subs: "9.1k", er: "13.1%", reach: "2 800" },
    { handle: "@psy_growth_ru", ini: "PG", bg: "linear-gradient(135deg,#3a2a1a,#c89b6a)", badge: "🥉 Bronze", badgeColor: "#c89b6a", src: "TGStat", case_: "Новый, тематика 87%", subs: "6.8k", er: "11.4%", reach: "1 900" },
  ];
  const [filters, setFilters] = useState(["Похожий размер"]);
  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <NavHeader title="Взаимопиар" onBack={onBack} />
      <div style={{ padding: "14px 16px 10px" }}>
        <div style={{ fontFamily: F.h, fontSize: 14, fontWeight: 800, color: C.text, lineHeight: 1.25 }}>Партнёры для<br />взаимопиара</div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 5, lineHeight: 1.5 }}>Подобраны под ваш канал по тематике, размеру и результатам прошлых ВП.</div>
      </div>
      <div style={{ padding: "0 16px 12px", display: "flex", gap: 8, overflowX: "auto" }}>
        {["⚙️ Фильтры", "Похожий размер", "VP‑база", "TGStat"].map(f => (
          <div key={f} onClick={() => setFilters(p => p.includes(f) ? p.filter(x => x !== f) : [...p, f])}
            style={{ display: "flex", alignItems: "center", gap: 5, background: filters.includes(f) ? "rgba(46,166,255,.08)" : C.surface, border: `1px solid ${filters.includes(f) ? "rgba(46,166,255,.3)" : C.border}`, borderRadius: 20, padding: "6px 13px", fontSize: 12, fontWeight: 600, color: filters.includes(f) ? C.accent : C.muted, cursor: "pointer", flexShrink: 0 }}>{f}</div>
        ))}
      </div>
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {partners.map((p, i) => (
          <div key={i} onClick={() => onOpenCard?.(p)} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 14, cursor: "pointer", transition: "all .15s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: F.h, flexShrink: 0 }}>{p.ini}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>{p.handle}</div>
                <div style={{ display: "flex", gap: 5, marginTop: 3 }}>
                  <span style={{ background: `${p.badgeColor}20`, border: `1px solid ${p.badgeColor}40`, borderRadius: 20, padding: "1px 7px", fontSize: 10, fontWeight: 700, color: p.badgeColor }}>{p.badge}</span>
                  <span style={{ background: "rgba(46,166,255,.08)", border: "1px solid rgba(46,166,255,.15)", borderRadius: 20, padding: "1px 7px", fontSize: 10, fontWeight: 600, color: C.accent }}>{p.src}</span>
                </div>
              </div>
            </div>
            <div style={{ background: "rgba(77,202,107,.06)", border: "1px solid rgba(77,202,107,.12)", borderRadius: 10, padding: "8px 10px", fontSize: 12, color: "rgba(232,240,248,.8)", marginBottom: 8, lineHeight: 1.4 }}>🤝 {p.case_}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: C.muted, marginBottom: 10 }}>
              <span><strong style={{ color: C.text }}>{p.subs}</strong> subs</span><span>·</span>
              <span>ER <strong style={{ color: C.text }}>{p.er}</strong></span><span>·</span>
              <span>Охват <strong style={{ color: C.text }}>{p.reach}</strong></span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={e => e.stopPropagation()} style={{ flex: 1, height: 38, border: "none", borderRadius: 10, background: "rgba(46,166,255,.1)", color: C.accent, fontFamily: F.b, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>📲 Открыть канал</button>
              <button onClick={e => { e.stopPropagation(); onOpenCard?.(p); }} style={{ width: 38, height: 38, border: `1px solid ${C.border}`, borderRadius: 10, background: C.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, cursor: "pointer" }}>📊</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "14px 16px 24px" }}>
        <button style={{ width: "100%", height: 50, border: "1.5px solid rgba(255,209,102,.25)", borderRadius: 14, background: "linear-gradient(135deg,rgba(255,209,102,.12),rgba(245,166,35,.06))", color: C.gold, fontFamily: F.b, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>⭐ Показать ещё 7 каналов за 5★</button>
        <div style={{ fontSize: 11.5, color: C.muted, textAlign: "center", marginTop: 8 }}>Чем больше вариантов — тем выше шанс найти идеального партнёра</div>
      </div>
    </div>
  );
}

// ═══════════ P2-2: КАРТОЧКА ВП-ПАРТНЁРА ═══════════

function VPCardScreen({ partner, onBack }) {
  const p = partner || { handle: "@psylife_daily", ini: "PS", bg: "linear-gradient(135deg,#1a3a6b,#2ea6ff)", badge: "⭐ Gold", badgeColor: "#ffd166" };
  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <NavHeader title="Партнёр для ВП" onBack={onBack} />
      <div style={{ padding: "18px 16px", background: `linear-gradient(180deg, ${C.surface} 0%, ${C.bg} 100%)`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: F.h }}>{p.ini}</div>
          <div>
            <div style={{ fontFamily: F.h, fontSize: 15, fontWeight: 700, color: C.text }}>{p.handle}</div>
            <div style={{ display: "flex", gap: 5, marginTop: 4 }}>
              <span style={{ background: `${p.badgeColor}20`, border: `1px solid ${p.badgeColor}40`, borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 700, color: p.badgeColor }}>{p.badge}</span>
              <span style={{ background: "rgba(77,202,107,.14)", border: "1px solid rgba(77,202,107,.22)", borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 700, color: C.green }}>🟢 Перспективный</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: "14px 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionLabel>📊 Кратко о канале</SectionLabel>
        <Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
            {[{ v: p.subs || "18.4k", l: "Подписчики" }, { v: "4 200", l: "Охват поста" }, { v: p.er || "9.8%", l: "ER" }, { v: "15.2%", l: "ERR" }].map((m, i) => (
              <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 10px", textAlign: "center" }}>
                <div style={{ fontFamily: F.h, fontSize: 16, fontWeight: 700, color: C.text }}>{m.v}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{m.l}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(77,202,107,.06)", borderRadius: 10, padding: "8px 10px" }}>
            <span style={{ fontSize: 16 }}>📈</span>
            <div><div style={{ fontSize: 12, fontWeight: 700, color: C.green }}>Плавный рост</div><div style={{ fontSize: 11, color: C.muted }}>+1.2k подписчиков за 30 дней</div></div>
          </div>
        </Card>
        <SectionLabel>🤝 История ВП</SectionLabel>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>ВП-кейсы</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.green }}>3 кейса ✓</span>
          </div>
          {[{ icon: "🤝", t: "3 ВП → +240 подп. суммарно", sub: "Средний прирост: +80 подп." }, { icon: "⏱️", t: "Время ответа ~2ч", sub: "Обычно отвечает быстро" }].map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: `1px solid ${C.border}` }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(77,202,107,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{c.icon}</div>
              <div><div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{c.t}</div><div style={{ fontSize: 11, color: C.muted }}>{c.sub}</div></div>
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
            <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10, textAlign: "center" }}>
              <div style={{ fontFamily: F.h, fontSize: 16, fontWeight: 700, color: C.green }}>+240</div>
              <div style={{ fontSize: 10, color: C.muted }}>Подп. за все ВП</div>
            </div>
            <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10, textAlign: "center" }}>
              <div style={{ fontFamily: F.h, fontSize: 16, fontWeight: 700, color: C.green }}>100%</div>
              <div style={{ fontSize: 10, color: C.muted }}>Завершил</div>
            </div>
          </div>
        </Card>
        <SectionLabel>💡 Рекомендация</SectionLabel>
        <Card style={{ background: "rgba(77,202,107,.04)", borderColor: "rgba(77,202,107,.15)" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.green, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 6 }}>Вывод аналитика</div>
          <div style={{ fontSize: 13, color: "rgba(232,240,248,.8)", lineHeight: 1.6 }}>Канал вашего размера с <strong style={{ color: C.text }}>устойчивым ростом</strong> и хорошим ER. Рекомендуем начать с обмена постами — результат ~<strong style={{ color: C.text }}>+80 подписчиков</strong> за кейс.</div>
        </Card>
        <Btn variant="secondary" size="lg">📲 Открыть канал в Telegram</Btn>
        <Btn variant="ghost" size="sm">👁 Скрыть из рекомендаций</Btn>
      </div>
    </div>
  );
}

// ═══════════ P2-3: РЕКЛАМА СПИСОК ═══════════

function AdsListScreen({ onBack, onOpenCard }) {
  const ads = [
    { handle: "@biznes_blog", ini: "BZ", bg: "linear-gradient(135deg,#1a3a6b,#2ea6ff)", badge: "🥇 Gold", badgeColor: C.gold, goal: "Подписчики", case_: "2 кампании → цена подписчика 18 ₽", subs: "41.2k", er: "8.1%", trend: "📈 стабильный", budget: "до 10к" },
    { handle: "@marketolog_pro", ini: "MK", bg: "linear-gradient(135deg,#2a1a4a,#9b5de5)", badge: "🥈 Silver", badgeColor: "#a8c0d6", goal: "Охваты", case_: "CPM 75 ₽, охват 12 000", subs: "55k", er: "6.4%", trend: "📊 умеренный", budget: "10–30к" },
    { handle: "@psydaily_ru", ini: "PD", bg: "linear-gradient(135deg,#1a3a2a,#3aaa5c)", badge: "✨ Новый", badgeColor: C.accent, goal: "Подписчики", case_: "Нет кейсов, стоит протестировать", subs: "22k", er: "11.2%", trend: "📈 быстрый", budget: "до 10к" },
  ];
  const [fGoal, setFGoal] = useState("Подписчики");
  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <NavHeader title="Реклама" onBack={onBack} />
      <div style={{ padding: "14px 16px 10px" }}>
        <div style={{ fontFamily: F.h, fontSize: 14, fontWeight: 800, color: C.text, lineHeight: 1.25 }}>Рекламные площадки<br />под ваш канал</div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 5, lineHeight: 1.5 }}>По тематике, бюджету и результатам прошлых кампаний.</div>
      </div>
      {/* Filters */}
      <div style={{ padding: "0 16px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: C.muted, fontFamily: F.h, width: 45 }}>Цель</span>
          {["Подписчики", "Охваты", "Трафик"].map(g => (
            <div key={g} onClick={() => setFGoal(g)} style={{ background: fGoal === g ? "rgba(46,166,255,.08)" : C.surface, border: `1px solid ${fGoal === g ? "rgba(46,166,255,.3)" : C.border}`, borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 600, color: fGoal === g ? C.accent : C.muted, cursor: "pointer" }}>{g}</div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: C.muted, fontFamily: F.h, width: 45 }}>Бюджет</span>
          {["до 10к ₽", "10–30к", "30к+"].map((b, i) => (
            <div key={b} style={{ background: i === 0 ? "rgba(46,166,255,.08)" : C.surface, border: `1px solid ${i === 0 ? "rgba(46,166,255,.3)" : C.border}`, borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 600, color: i === 0 ? C.accent : C.muted, cursor: "pointer" }}>{b}</div>
          ))}
        </div>
      </div>
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {ads.map((a, i) => (
          <div key={i} onClick={() => onOpenCard?.(a)} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 14, cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: F.h, flexShrink: 0 }}>{a.ini}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>{a.handle}</div>
                <div style={{ display: "flex", gap: 5, marginTop: 3 }}>
                  <span style={{ background: `${a.badgeColor}20`, border: `1px solid ${a.badgeColor}40`, borderRadius: 20, padding: "1px 7px", fontSize: 10, fontWeight: 700, color: a.badgeColor }}>{a.badge}</span>
                  <span style={{ background: "rgba(77,202,107,.1)", border: "1px solid rgba(77,202,107,.18)", borderRadius: 20, padding: "1px 7px", fontSize: 10, fontWeight: 600, color: C.green }}>{a.goal}</span>
                </div>
              </div>
            </div>
            <div style={{ background: "rgba(245,166,35,.06)", border: "1px solid rgba(245,166,35,.12)", borderRadius: 10, padding: "8px 10px", fontSize: 12, color: "rgba(232,240,248,.8)", marginBottom: 8, lineHeight: 1.4 }}>📣 {a.case_}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: C.muted, flexWrap: "wrap", marginBottom: 10 }}>
              <span><strong style={{ color: C.text }}>{a.subs}</strong> subs</span><span>·</span>
              <span>ER <strong style={{ color: C.text }}>{a.er}</strong></span><span>·</span>
              <span>{a.trend}</span>
              <span style={{ marginLeft: "auto", background: "rgba(77,202,107,.1)", border: "1px solid rgba(77,202,107,.18)", borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 700, color: C.green }}>{a.budget}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={e => e.stopPropagation()} style={{ flex: 1, height: 38, border: "none", borderRadius: 10, background: "rgba(46,166,255,.1)", color: C.accent, fontFamily: F.b, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>📲 Открыть канал</button>
              <button onClick={e => { e.stopPropagation(); onOpenCard?.(a); }} style={{ width: 38, height: 38, border: `1px solid ${C.border}`, borderRadius: 10, background: C.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, cursor: "pointer" }}>📊</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "14px 16px 24px" }}>
        <button style={{ width: "100%", height: 50, border: "1.5px solid rgba(255,209,102,.25)", borderRadius: 14, background: "linear-gradient(135deg,rgba(255,209,102,.12),rgba(245,166,35,.06))", color: C.gold, fontFamily: F.b, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>⭐ Показать ещё площадки за 5★</button>
      </div>
    </div>
  );
}

// ═══════════ P2-4: КАРТОЧКА РЕКЛАМНОЙ ПЛОЩАДКИ ═══════════

function AdCardScreen({ ad, onBack }) {
  const a = ad || { handle: "@biznes_blog", ini: "BZ", bg: "linear-gradient(135deg,#1a3a6b,#2ea6ff)", badge: "🥇 Gold", badgeColor: "#ffd166", subs: "41.2k", er: "8.1%" };
  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <NavHeader title="Рекламная площадка" onBack={onBack} />
      <div style={{ padding: "18px 16px", background: `linear-gradient(180deg, ${C.surface} 0%, ${C.bg} 100%)`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: F.h }}>{a.ini}</div>
          <div>
            <div style={{ fontFamily: F.h, fontSize: 15, fontWeight: 700, color: C.text }}>{a.handle}</div>
            <div style={{ display: "flex", gap: 5, marginTop: 4 }}>
              <span style={{ background: `${a.badgeColor}20`, border: `1px solid ${a.badgeColor}40`, borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 700, color: a.badgeColor }}>{a.badge}</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: "14px 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionLabel>📊 Метрики канала</SectionLabel>
        <Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[{ v: a.subs || "41.2k", l: "Подписчики" }, { v: a.er || "8.1%", l: "ER" }, { v: "12 000", l: "Охват" }].map((m, i) => (
              <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 8px", textAlign: "center" }}>
                <div style={{ fontFamily: F.h, fontSize: 15, fontWeight: 700, color: C.text }}>{m.v}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{m.l}</div>
              </div>
            ))}
          </div>
        </Card>
        <SectionLabel>📣 История рекламы</SectionLabel>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Рекламные кейсы</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.amber }}>2 кампании</span>
          </div>
          {[{ l: "Цена подписчика", v: "18 ₽", c: C.green }, { l: "CPM", v: "75 ₽", c: C.text }, { l: "Средний охват", v: "12 000", c: C.text }].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 12, color: C.muted }}>{r.l}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: r.c }}>{r.v}</span>
            </div>
          ))}
        </Card>
        <SectionLabel>💡 Рекомендация</SectionLabel>
        <Card style={{ background: "rgba(245,166,35,.04)", borderColor: "rgba(245,166,35,.15)" }}>
          <div style={{ fontSize: 13, color: "rgba(232,240,248,.8)", lineHeight: 1.6 }}>Стабильная площадка с подтверждённой ценой подписчика <strong style={{ color: C.text }}>18 ₽</strong>. Рекомендуем для первого тестового размещения с бюджетом до 5 000 ₽.</div>
        </Card>
        <Btn variant="secondary" size="lg">📲 Открыть канал в Telegram</Btn>
        <Btn variant="ghost" size="sm">👁 Скрыть из рекомендаций</Btn>
      </div>
    </div>
  );
}

// ═══════════ P3-1: ОТЧЁТ ПО РОСТУ ═══════════

function ReportScreen({ onBack }) {
  const [period, setPeriod] = useState("30 дней");
  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <NavHeader title="Отчёт по росту" onBack={onBack} />
      {/* Period picker */}
      <div style={{ padding: "10px 16px", display: "flex", gap: 7 }}>
        {["7 дней", "30 дней", "90 дней"].map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{ flex: 1, height: 34, border: "none", borderRadius: 20, fontFamily: F.b, fontSize: 12.5, fontWeight: 700, cursor: "pointer", background: period === p ? "rgba(46,166,255,.14)" : C.surface, border: period === p ? "1.5px solid rgba(46,166,255,.35)" : `1px solid ${C.border}`, color: period === p ? C.accent : C.muted, boxShadow: period === p ? "0 0 12px rgba(46,166,255,.12)" : "none" }}>{p}</button>
        ))}
      </div>
      <div style={{ padding: "6px 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Summary */}
        <SectionLabel>📈 Итоги за {period}</SectionLabel>
        <Card style={{ padding: 0, overflow: "hidden", position: "relative" }}>
          <div style={{ height: 2, background: `linear-gradient(90deg, ${C.accent}, rgba(46,166,255,.2), transparent)` }} />
          {[
            { icon: "👥", label: "Подписчики", was: "2 300", now: "2 780", diff: "+480", color: C.green },
            { icon: "👁", label: "Охват постов", was: "1 400", now: "1 950", diff: "+550", color: C.accent },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${C.border}`, gap: 10 }}>
              <span style={{ fontSize: 20, width: 28, textAlign: "center", flexShrink: 0 }}>{r.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: C.muted }}>{r.label}</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text, marginTop: 2, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: C.muted }}>{r.was}</span>
                  <span style={{ color: C.muted }}>→</span>
                  <span>{r.now}</span>
                  <span style={{ color: r.color, fontSize: 12 }}>{r.diff}</span>
                </div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", gap: 10, background: "rgba(255,209,102,.03)" }}>
            <span style={{ fontSize: 20, width: 28, textAlign: "center", flexShrink: 0 }}>💰</span>
            <div>
              <div style={{ fontSize: 12, color: C.muted }}>Ср. цена подписчика (реклама)</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 3 }}>
                <span style={{ fontFamily: F.h, fontSize: 16, fontWeight: 700, color: C.gold }}>~23 ₽</span>
                <span style={{ fontSize: 11, color: C.muted }}>по 2 кампаниям</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Sources */}
        <SectionLabel>📊 Источники роста</SectionLabel>
        <Card>
          {[
            { icon: "🤝", label: "Взаимопиар", val: "+260 подп.", pct: 54, color: C.green, sub: "3 кейса с партнёрами" },
            { icon: "📣", label: "Реклама", val: "+170 подп.", pct: 35, color: C.accent, sub: "2 размещения" },
            { icon: "🌱", label: "Органика", val: "+50 подп.", pct: 11, color: C.muted, sub: "без вложений" },
          ].map((s, i) => (
            <div key={i} style={{ marginBottom: i < 2 ? 12 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{s.icon} {s.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.val}</span>
              </div>
              <div style={{ height: 6, background: C.surface2, borderRadius: 3, overflow: "hidden", marginBottom: 4 }}>
                <div style={{ height: "100%", width: `${s.pct}%`, background: s.color, borderRadius: 3, transition: "width 0.5s" }} />
              </div>
              <div style={{ fontSize: 11, color: C.muted }}>{s.pct}% роста · {s.sub}</div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>Итого за {period}</span>
            <span style={{ fontFamily: F.h, fontSize: 16, fontWeight: 700, color: C.green }}>+480</span>
          </div>
        </Card>

        {/* Recommendations */}
        <SectionLabel>💡 Рекомендации</SectionLabel>
        <Card>
          <div style={{ fontFamily: F.h, fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 8 }}>Что делать дальше</div>
          {[
            "Продолжить ВП с @psylife_daily и @mind_growth — лучший результат",
            "Уменьшить бюджет на @marketolog_pro — цена подписчика выше среднего",
            "Протестировать ещё 2 площадки для сравнения CPP",
            "Органика низкая — увеличьте частоту публикаций",
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 8, padding: "6px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 22, height: 22, borderRadius: 7, background: "rgba(46,166,255,.1)", border: "1px solid rgba(46,166,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: C.accent, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: 12.5, color: "rgba(232,240,248,.8)", lineHeight: 1.5 }}>{r}</div>
            </div>
          ))}
        </Card>

        {/* Reminder */}
        <div style={{ background: "rgba(46,166,255,.05)", border: `1px solid rgba(46,166,255,.12)`, borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>🔔</span>
          <span style={{ fontSize: 12, color: "rgba(232,240,248,.7)", lineHeight: 1.5 }}>Возвращайтесь к отчёту <strong style={{ color: C.text }}>каждые 2–4 недели</strong>, чтобы видеть динамику.</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════ PA-4: СТАТУС ЗАЯВКИ ═══════════

function StatusScreen({ onBack }) {
  const [status] = useState("working"); // "waiting" | "working" | "done"
  const timeline = [
    { icon: "✓", title: "Заявка принята", time: "18 июля, 9:41", done: true },
    { icon: status === "working" ? "🔍" : "✓", title: "Смотрим ваш канал", sub: status === "working" ? "Анализируем воронку, контент и трафик" : undefined, time: status !== "waiting" ? "18 июля, 11:20" : undefined, done: status === "done", active: status === "working" },
    { icon: status === "done" ? "✓" : "💬", title: status === "done" ? "Написали в личку" : "Напишем в личку", sub: status === "waiting" ? "В течение 1–2 рабочих дней" : undefined, time: status === "done" ? "19 июля, 10:15" : undefined, done: status === "done", waiting: status !== "done" },
  ];
  const pillColors = { waiting: { bg: "rgba(245,166,35,.1)", border: "rgba(245,166,35,.22)", color: C.amber, text: "Ожидает" }, working: { bg: "rgba(155,127,232,.1)", border: "rgba(155,127,232,.22)", color: C.purple, text: "В работе" }, done: { bg: "rgba(77,202,107,.1)", border: "rgba(77,202,107,.22)", color: C.green, text: "Ответили" } };
  const pill = pillColors[status];

  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <NavHeader title="Статус заявки" onBack={onBack} />
      {/* Hero */}
      <div style={{ padding: "18px 16px", background: `linear-gradient(180deg, ${C.surface} 0%, ${C.bg} 100%)`, borderBottom: `1px solid ${C.border}`, position: "relative" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: `${pill.color}20`, border: `1px solid ${pill.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{status === "done" ? "✅" : status === "working" ? "🔍" : "⏳"}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: C.muted }}>Агентство TG Bee</div>
            <div style={{ fontFamily: F.h, fontSize: 15, fontWeight: 700, color: C.text, lineHeight: 1.2, marginTop: 2 }}>{status === "done" ? "Разбор готов —\nпроверьте личку" : "Разбор канала\nи воронки"}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{status === "done" ? "Ответ получен 19 июля" : "Заявка от 18 июля"}</div>
          </div>
          <div style={{ background: pill.bg, border: `1px solid ${pill.border}`, borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: pill.color, height: "fit-content", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: pill.color }} />{pill.text}
          </div>
        </div>
      </div>

      <div style={{ padding: "14px 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Timeline */}
        <Card style={{ borderColor: `${pill.color}40` }}>
          {timeline.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 12, paddingBottom: i < timeline.length - 1 ? 16 : 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: t.done ? "rgba(77,202,107,.15)" : t.active ? `${C.purple}20` : "rgba(107,138,170,.08)", border: `1.5px solid ${t.done ? "rgba(77,202,107,.35)" : t.active ? `${C.purple}40` : "rgba(107,138,170,.15)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: t.done ? 12 : 14, color: t.done ? C.green : t.active ? C.purple : C.muted, fontWeight: 700 }}>{t.icon}</div>
                {i < timeline.length - 1 && <div style={{ width: 2, flex: 1, marginTop: 4, background: t.done ? "rgba(77,202,107,.3)" : "rgba(107,138,170,.12)", borderRadius: 1 }} />}
              </div>
              <div style={{ flex: 1, paddingTop: 2 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: t.done ? C.green : t.active ? C.purple : C.muted }}>{t.title}</div>
                {t.sub && <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2, lineHeight: 1.4 }}>{t.sub}</div>}
                {t.time && <div style={{ fontSize: 10, color: "rgba(107,138,170,.5)", marginTop: 3 }}>{t.time}</div>}
              </div>
            </div>
          ))}
          {status === "done" && (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <Btn variant="primary" size="md">💬 Открыть диалог в Telegram</Btn>
              <Btn variant="ghost" size="sm" onClick={onBack}>← Вернуться в кабинет</Btn>
            </div>
          )}
        </Card>

        {/* Recap */}
        <SectionLabel>📋 Ваши ответы</SectionLabel>
        <Card>
          {[
            { k: "Канал", v: "@my_channel" }, { k: "Кто вы", v: "Психолог" },
            { k: "Доход", v: "150–300 000 ₽" }, { k: "Бюджет", v: "20–50 000 ₽" },
            { k: "Что пробовали", v: "ВП, контент" }, { k: "Главная боль", v: "Подписчики есть, заявок нет" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ fontSize: 12, color: C.muted }}>{r.k}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.text, textAlign: "right", maxWidth: "55%" }}>{r.v}</span>
            </div>
          ))}
        </Card>

        {/* What to expect */}
        {status !== "done" && (
          <>
            <SectionLabel>⏭ Что будет дальше</SectionLabel>
            <Card>
              {["Посмотрим ваш канал и оценим воронку", "Напишем в личку с кратким разбором", "Предложим форматы работы или дадим рекомендации"].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, padding: "6px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: "rgba(155,127,232,.1)", border: "1px solid rgba(155,127,232,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: C.purple, flexShrink: 0 }}>{i + 1}</div>
                  <span style={{ fontSize: 12.5, color: "rgba(232,240,248,.8)", lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════ P3-2: ФОРМА ОТЗЫВА (ВП / РЕКЛАМА) ═══════════

function FeedbackFormScreen({ onBack, type = "vp" }) {
  const [subs, setSubs] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [pub, setPub] = useState(false);
  const [sent, setSent] = useState(false);
  const isVP = type === "vp";
  const partner = isVP ? { handle: "@psylife_daily", ini: "PS", bg: "linear-gradient(135deg,#1a3a6b,#2ea6ff)", meta: "18.4k подп. · 14 июля 2025" } : { handle: "@biznes_blog", ini: "BZ", bg: "linear-gradient(135deg,#1a3a6b,#2ea6ff)", meta: "41.2k подп. · CPP ~23 ₽ · 16 июля 2025" };
  const valid = subs > 0 && rating > 0;

  if (sent) return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <NavHeader title="Отчёт отправлен" onBack={onBack} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 24 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(77,202,107,.12)", border: "2px solid rgba(77,202,107,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>✅</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: F.h, fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 6 }}>Спасибо за отчёт!</div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>Ваш отзыв помогает другим пользователям и улучшает рекомендации.</div>
        </div>
        <Btn variant="ghost" size="md" onClick={onBack}>← Вернуться</Btn>
      </div>
    </div>
  );

  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <NavHeader title={isVP ? "Отчёт по ВП" : "Отчёт по рекламе"} onBack={onBack} />
      {/* Hero */}
      <div style={{ padding: "16px 16px 14px", background: `linear-gradient(180deg, ${C.surface} 0%, ${C.bg} 100%)`, borderBottom: `1px solid ${C.border}`, position: "relative" }}>
        <div style={{ fontFamily: F.h, fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 6 }}>{isVP ? "Как прошёл взаимопиар?" : "Как прошло размещение?"}</div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>Расскажите о результатах — это поможет другим и улучшит рекомендации.</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 12px" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: partner.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: F.h, flexShrink: 0 }}>{partner.ini}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{partner.handle}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{partner.meta}</div>
          </div>
          <div style={{ marginLeft: "auto", background: isVP ? "rgba(77,202,107,.1)" : "rgba(46,166,255,.1)", border: `1px solid ${isVP ? "rgba(77,202,107,.2)" : "rgba(46,166,255,.2)"}`, borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 700, color: isVP ? C.green : C.accent }}>{isVP ? "🤝 ВП" : "📣 Реклама"}</div>
        </div>
      </div>

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Subs count */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.red }} />Сколько подписчиков пришло?
          </div>
          <div style={{ display: "flex", alignItems: "center", background: C.surface, border: `1px solid ${subs > 0 ? "rgba(77,202,107,.35)" : C.border}`, borderRadius: 12, padding: "8px 12px", gap: 8 }}>
            <button onClick={() => setSubs(Math.max(0, subs - 10))} style={{ width: 32, height: 32, borderRadius: 8, background: C.surface2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: C.muted, cursor: "pointer" }}>−</button>
            <input type="number" value={subs} onChange={e => setSubs(Math.max(0, parseInt(e.target.value) || 0))} style={{ flex: 1, background: "transparent", border: "none", outline: "none", textAlign: "center", fontFamily: F.h, fontSize: 20, fontWeight: 700, color: subs > 0 ? C.green : C.text }} />
            <span style={{ fontSize: 12, color: C.muted }}>подп.</span>
            <button onClick={() => setSubs(subs + 10)} style={{ width: 32, height: 32, borderRadius: 8, background: C.surface2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: C.muted, cursor: "pointer" }}>+</button>
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Оценочно, за 3–5 дней после размещения</div>
        </div>

        {/* Rating */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.red }} />Оценка {isVP ? "партнёра" : "площадки"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {[1, 2, 3, 4, 5].map(s => (
              <span key={s} onClick={() => setRating(s)} style={{ fontSize: 28, cursor: "pointer", filter: s <= rating ? "none" : "grayscale(1) opacity(0.3)", transition: "all .15s" }}>⭐</span>
            ))}
            {rating > 0 && <span style={{ fontSize: 12, fontWeight: 700, color: C.gold, marginLeft: 8 }}>{rating} из 5</span>}
          </div>
        </div>

        {/* Comment */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>Комментарий <span style={{ fontSize: 10, color: C.muted, fontWeight: 400 }}>необязательно</span></div>
          <div style={{ position: "relative" }}>
            <textarea value={comment} onChange={e => setComment(e.target.value.slice(0, 500))} placeholder="Что понравилось / не понравилось, качество трафика…" maxLength={500}
              style={{ width: "100%", height: 80, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 12px", fontFamily: F.b, fontSize: 13, color: C.text, resize: "none", outline: "none" }} />
            <span style={{ position: "absolute", bottom: 8, right: 10, fontSize: 10, color: C.muted }}>{comment.length} / 500</span>
          </div>
        </div>

        {/* Checkbox */}
        <div onClick={() => setPub(!pub)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${pub ? C.accent : C.muted}`, background: pub ? C.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", transition: "all .15s" }}>{pub && "✓"}</div>
          <span style={{ fontSize: 12, color: C.muted, lineHeight: 1.4 }}>Можно показывать мой отзыв <strong style={{ color: C.text }}>другим пользователям</strong></span>
        </div>

        {/* TGStat note */}
        <div style={{ background: "rgba(46,166,255,.04)", border: `1px solid rgba(46,166,255,.1)`, borderRadius: 10, padding: "8px 10px", display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: C.muted }}>
          <span>ℹ️</span>Мы можем сверять цифры с TGStat, чтобы отсечь накрутки.
        </div>
      </div>

      <div style={{ padding: "0 16px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
        <Btn variant={valid ? "green" : "primary"} disabled={!valid} onClick={() => setSent(true)}>✓ Отправить отчёт</Btn>
        <Btn variant="ghost" size="sm" onClick={onBack}>Не сейчас</Btn>
      </div>
    </div>
  );
}

// ═══════════ P3-3: БЕЙДЖИ И КЕЙСЫ ═══════════

function BadgesScreen({ onBack }) {
  const badges = [
    { icon: "🥉", name: "Bronze", color: "#c89b6a", desc: "3+ проверенных отчётов", done: true },
    { icon: "🥈", name: "Silver", color: "#a8c0d6", desc: "10+ отчётов со стабильным ER", done: true },
    { icon: "🥇", name: "Gold", color: C.gold, desc: "20+ кейсов, оценка 4–5★", done: true },
    { icon: "🏆", name: "Legend", color: C.purple, desc: "Топ-автор сообщества · получен вчера", done: true },
  ];
  const cases = [
    { icon: "🤝", color: C.green, text: "ВП с @psylife_daily → +240 подп.", stars: 5, date: "14 июля" },
    { icon: "📣", color: C.accent, text: "Реклама @biznes_blog → +180 подп.", stars: 4, date: "16 июля" },
    { icon: "🤝", color: C.green, text: "ВП с @mind_growth → +160 подп.", stars: 5, date: "20 июля" },
  ];
  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <NavHeader title="Бейджи и кейсы" onBack={onBack} />
      {/* Profile hero */}
      <div style={{ padding: "18px 16px", background: `linear-gradient(180deg, ${C.surface} 0%, ${C.bg} 100%)`, borderBottom: `1px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 100% 80% at 50% -20%, rgba(255,209,102,.1) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ width: 56, height: 56, borderRadius: 18, background: `linear-gradient(135deg, #4a2a10, ${C.gold})`, boxShadow: "0 4px 20px rgba(255,209,102,.35)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.h, fontSize: 18, fontWeight: 700, color: "#fff" }}>АИ</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: F.h, fontSize: 15, fontWeight: 700, color: C.text }}>Алекс Иванов</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 3, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            @username <span style={{ background: "rgba(155,127,232,.15)", border: "1px solid rgba(155,127,232,.3)", borderRadius: 20, padding: "1px 7px", fontSize: 10, fontWeight: 700, color: C.purple }}>🏆 Legend</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
          {[{ v: "54", l: "Отчётов" }, { v: "+5.2k", l: "Подп. в кейсах", c: C.green }, { v: "148★", l: "Баланс", c: C.gold }].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: F.h, fontSize: 16, fontWeight: 700, color: s.c || C.text }}>{s.v}</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionLabel>🏅 Ваши бейджи</SectionLabel>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Полученные награды</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.gold }}>4 из 4 ✨</span>
          </div>
          {badges.map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none", background: b.name === "Legend" ? "rgba(155,127,232,.04)" : "transparent", borderRadius: b.name === "Legend" ? 8 : 0, margin: b.name === "Legend" ? "4px -4px 0" : 0, padding: b.name === "Legend" ? "10px 8px" : "8px 0" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${b.color}18`, border: `1px solid ${b.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{b.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: b.color }}>{b.name}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{b.done ? "Получен" : "Не получен"} · {b.desc}</div>
              </div>
            </div>
          ))}
        </Card>

        <SectionLabel>📋 Ваши кейсы роста</SectionLabel>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>История результатов</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.accent }}>54 кейса</span>
          </div>
          {cases.map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${c.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{c.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text, lineHeight: 1.3 }}>{c.text}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{"⭐".repeat(c.stars)}{"☆".repeat(5 - c.stars)} {c.stars}/5 · {c.date}</div>
              </div>
            </div>
          ))}
          <div style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: C.accent, padding: "8px 0", cursor: "pointer" }}>Показать все 54 кейса →</div>
        </Card>

        <div style={{ background: "rgba(46,166,255,.05)", border: `1px solid rgba(46,166,255,.12)`, borderRadius: 14, padding: "12px 14px", display: "flex", gap: 10 }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>🔗</span>
          <span style={{ fontSize: 12, color: "rgba(232,240,248,.7)", lineHeight: 1.5 }}>Ваш бейдж Legend и кейсы <strong style={{ color: C.text }}>видны другим пользователям</strong>. Реферальные переходы конвертируются на 40% выше среднего.</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════ STARS: ПОКУПКА / УСПЕХ / ОШИБКА ═══════════

function StarsScreen({ onBack, onSuccess }) {
  const [state, setState] = useState("shop"); // shop | paying | success | error
  const [selected, setSelected] = useState(1);
  const pkgs = [
    { stars: 10, desc: "1 анализ", price: "99 ₽", old: null },
    { stars: 50, desc: "5 анализов · экономия 20%", price: "399 ₽", old: "495 ₽", pop: true },
    { stars: 150, desc: "15 анализов · экономия 33%", price: "990 ₽", old: "1485 ₽" },
  ];

  const handleBuy = () => {
    setState("paying");
    setTimeout(() => setState(Math.random() > 0.3 ? "success" : "error"), 1800);
  };

  if (state === "success") return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <NavHeader title="Пополнить Stars" onBack={onBack} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "24px 20px" }}>
        <div style={{ fontSize: 56, animation: "pulse 1.5s ease-in-out infinite" }}>🎉</div>
        <div style={{ fontFamily: F.h, fontSize: 20, fontWeight: 800, color: C.text }}>Stars зачислены!</div>
        <div style={{ fontSize: 13, color: C.muted, textAlign: "center", lineHeight: 1.6 }}>{pkgs[selected].stars} Stars успешно добавлены на ваш счёт. Можно анализировать.</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ fontFamily: F.h, fontSize: 24, fontWeight: 800, color: C.amber }}>⭐ {pkgs[selected].stars + 12} Stars</div>
          <div style={{ fontSize: 12, color: C.green, fontWeight: 700 }}>+{pkgs[selected].stars} Stars добавлено</div>
        </div>
        <Card style={{ width: "100%", marginTop: 8 }}>
          {[{ k: "Пакет", v: `${pkgs[selected].stars} Stars` }, { k: "Сумма", v: pkgs[selected].price, c: C.green }, { k: "Дата", v: "Только что" }].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none", fontSize: 13 }}>
              <span style={{ color: C.muted }}>{r.k}</span>
              <span style={{ fontWeight: 700, color: r.c || C.text }}>{r.v}</span>
            </div>
          ))}
        </Card>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
          <Btn onClick={onBack}>📊 Запустить анализ</Btn>
          <Btn variant="ghost" size="sm" onClick={onBack}>← Вернуться в кабинет</Btn>
        </div>
      </div>
    </div>
  );

  if (state === "error") return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <NavHeader title="Пополнить Stars" onBack={onBack} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "24px 20px" }}>
        <div style={{ fontSize: 56 }}>😕</div>
        <div style={{ fontFamily: F.h, fontSize: 18, fontWeight: 800, color: C.text }}>Оплата не прошла</div>
        <div style={{ fontSize: 13, color: C.muted, textAlign: "center", lineHeight: 1.6 }}>Stars не были списаны. Деньги не ушли с вашего счёта.</div>
        <Card style={{ width: "100%", background: "rgba(255,82,82,.04)", borderColor: "rgba(255,82,82,.15)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 6 }}>Возможные причины:</div>
          {["Недостаточно средств", "Отменена в Telegram", "Временная ошибка сети"].map((r, i) => (
            <div key={i} style={{ fontSize: 12, color: C.muted, padding: "2px 0", display: "flex", gap: 6 }}>
              <span>·</span>{r}
            </div>
          ))}
        </Card>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
          <Btn onClick={() => setState("shop")}>↺ Попробовать снова</Btn>
          <Btn variant="ghost" size="sm" onClick={onBack}>Отмена</Btn>
        </div>
        <div style={{ fontSize: 12, color: "rgba(107,138,170,.5)", textAlign: "center", lineHeight: 1.6 }}>Если проблема повторяется — напишите в поддержку: @tgbee_support</div>
      </div>
    </div>
  );

  if (state === "paying") return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <NavHeader title="Пополнить Stars" onBack={onBack} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 24 }}>
        <div style={{ width: 56, height: 56, border: `3px solid ${C.surface2}`, borderTopColor: C.amber, borderRadius: "50%", animation: "spin .9s linear infinite" }} />
        <div style={{ fontSize: 14, color: C.muted, fontWeight: 500 }}>Обрабатываем оплату…</div>
      </div>
    </div>
  );

  // Shop
  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <NavHeader title="Пополнить Stars" onBack={onBack} />
      {/* Hero */}
      <div style={{ padding: "24px 16px 20px", textAlign: "center", background: "linear-gradient(180deg, rgba(245,166,35,.08) 0%, transparent 100%)", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ fontSize: 48, marginBottom: 10, filter: "drop-shadow(0 0 20px rgba(245,166,35,.5))" }}>⭐</div>
        <div style={{ fontFamily: F.h, fontSize: 18, fontWeight: 800, color: C.text }}>Telegram Stars</div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 5, lineHeight: 1.5 }}>Используйте Stars для повторных анализов каналов</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,166,35,.1)", border: "1px solid rgba(245,166,35,.2)", borderRadius: 20, padding: "5px 14px", fontSize: 13, fontWeight: 700, color: C.amber, marginTop: 12 }}>⭐ 12 Stars на балансе</div>
      </div>

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* What Stars give */}
        <Card>
          <SectionLabel style={{ marginBottom: 10 }}>Что даёт анализ</SectionLabel>
          {[
            { icon: "📊", bg: "rgba(46,166,255,.1)", t: "Полный анализ любого канала", s: "Метрики, динамика, ER, источники" },
            { icon: "🤖", bg: "rgba(155,127,232,.1)", t: "ИИ-вердикт и рекомендации", s: "Персональный разбор" },
            { icon: "🔍", bg: "rgba(77,202,107,.1)", t: "Подбор ВП и рекламных площадок", s: "Отфильтровано под вашу нишу" },
          ].map((w, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: w.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{w.icon}</div>
              <div><div style={{ fontSize: 13, color: C.text }}>{w.t}</div><div style={{ fontSize: 11.5, color: C.muted }}>{w.s}</div></div>
            </div>
          ))}
        </Card>

        {/* Packages */}
        <SectionLabel>Выберите пакет</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {pkgs.map((p, i) => (
            <div key={i} onClick={() => setSelected(i)} style={{
              background: p.pop ? "linear-gradient(135deg, rgba(245,166,35,.07), rgba(23,33,43,1))" : C.surface,
              border: `1.5px solid ${selected === i ? "rgba(245,166,35,.5)" : p.pop ? "rgba(245,166,35,.4)" : C.border}`,
              borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14,
              cursor: "pointer", transition: "all .18s", position: "relative", overflow: "hidden",
            }}>
              {p.pop && <div style={{ position: "absolute", top: 0, right: 16, fontFamily: F.h, fontSize: 8.5, fontWeight: 700, color: C.amber, background: "rgba(245,166,35,.15)", border: "1px solid rgba(245,166,35,.25)", borderRadius: "0 0 8px 8px", padding: "3px 8px" }}>Популярный</div>}
              <div style={{ fontSize: 22 }}>⭐</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F.h, fontSize: 16, fontWeight: 700, color: C.text }}>{p.stars} Stars</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{p.desc}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: F.h, fontSize: 16, fontWeight: 700, color: C.amber }}>{p.price}</div>
                {p.old && <div style={{ fontSize: 11, color: C.muted, textDecoration: "line-through", marginTop: 2 }}>{p.old}</div>}
              </div>
            </div>
          ))}
        </div>

        <Btn variant="primary" onClick={handleBuy} style={{ background: "linear-gradient(135deg, #c88a10, #f5a623)", boxShadow: "0 4px 18px rgba(245,166,35,.3)" }}>
          ⭐ Купить {pkgs[selected].stars} Stars за {pkgs[selected].price}
        </Btn>
        <div style={{ fontSize: 12, color: "rgba(107,138,170,.4)", textAlign: "center" }}>Оплата через Telegram · Безопасно</div>
      </div>
    </div>
  );
}

// ═══════════ НАСТРОЙКИ УВЕДОМЛЕНИЙ ═══════════

function NotificationsScreen({ onBack }) {
  const [settings, setSettings] = useState({
    analysis: true, status_change: true, reply: true, stars_low: true, news: false,
  });
  const toggle = k => setSettings(s => ({ ...s, [k]: !s[k] }));

  const Toggle = ({ on, onToggle }) => (
    <div onClick={onToggle} style={{
      width: 44, height: 24, borderRadius: 12, padding: 2, cursor: "pointer", transition: "all .2s",
      background: on ? "rgba(77,202,107,.5)" : "rgba(107,138,170,.15)",
      border: `1px solid ${on ? "rgba(77,202,107,.3)" : "rgba(107,138,170,.12)"}`,
      display: "flex", alignItems: on ? "center" : "center", justifyContent: on ? "flex-end" : "flex-start",
    }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: on ? "#fff" : "rgba(107,138,170,.5)", transition: "all .2s", boxShadow: on ? "0 1px 4px rgba(0,0,0,.3)" : "none" }} />
    </div>
  );

  const sections = [
    { title: "Анализ", items: [
      { k: "analysis", icon: "📊", bg: "rgba(46,166,255,.1)", name: "Анализ готов", desc: "Когда анализ канала завершён" },
    ]},
    { title: "Заявка на разбор", items: [
      { k: "status_change", icon: "🔍", bg: "rgba(155,127,232,.1)", name: "Статус изменён", desc: "Когда заявка перешла в работу" },
      { k: "reply", icon: "💬", bg: "rgba(77,202,107,.1)", name: "Написали в личку", desc: "Когда специалист ответил" },
    ]},
    { title: "Сервис", items: [
      { k: "stars_low", icon: "⭐", bg: "rgba(107,138,170,.08)", name: "Stars заканчиваются", desc: "Когда остаётся <5 Stars" },
      { k: "news", icon: "📰", bg: "rgba(107,138,170,.08)", name: "Новости сервиса", desc: "Обновления и новые функции" },
    ]},
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <NavHeader title="Уведомления" onBack={onBack} />
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
          Уведомления приходят в Telegram через <strong style={{ color: C.text }}>@tgbee_bot</strong>. Настройте, что именно хотите получать.
        </div>

        {sections.map((sec, si) => (
          <div key={si}>
            <SectionLabel style={{ marginBottom: 8 }}>{sec.title}</SectionLabel>
            <Card style={{ padding: 0, overflow: "hidden" }}>
              {sec.items.map((item, i) => (
                <div key={item.k} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{item.desc}</div>
                  </div>
                  <Toggle on={settings[item.k]} onToggle={() => toggle(item.k)} />
                </div>
              ))}
            </Card>
          </div>
        ))}

        <div style={{ background: "rgba(46,166,255,.04)", border: `1px solid rgba(46,166,255,.1)`, borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8, fontSize: 11.5, color: C.muted }}>
          <span>💡</span>Вы всегда можете изменить настройки позже в разделе Профиль.
        </div>
      </div>
    </div>
  );
}

// ═══════════ PLACEHOLDER ═══════════

function Placeholder({ title, icon, desc, onBack }) {
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

// ═══════════ MAIN APP ═══════════

export default function TGBeeApp() {
  const [screen, setScreen] = useState("onboarding");
  const [tab, setTab] = useState("cabinet");
  const [ch, setCh] = useState(null);
  const [isNew, setIsNew] = useState(true);
  const [selPartner, setSelPartner] = useState(null);
  const [selAd, setSelAd] = useState(null);

  const nav = useCallback(s => { setScreen(s); if (["cabinet", "cabinet-main"].includes(s)) setTab("cabinet"); if (s === "search") setTab("search"); if (s === "profile") setTab("profile"); }, []);
  const handleTab = t => { setTab(t); if (t === "cabinet") setScreen(isNew ? "onboarding" : "cabinet-main"); else if (t === "search") setScreen("search"); else if (t === "profile") setScreen("profile"); else if (t === "ideas") setScreen("ideas"); };

  const render = () => {
    switch (screen) {
      case "onboarding": return <OnboardingScreen onStartAnalysis={() => nav("first-analysis")} onAudit={() => nav("audit")} onSkip={() => { setIsNew(false); nav("cabinet-main"); }} />;
      case "first-analysis": return <FirstAnalysisScreen onBack={() => nav(isNew ? "onboarding" : "cabinet-main")} onAnalyze={l => { setCh({ username: l, subs: "—" }); nav("analysis-result"); }} />;
      case "analysis-result": return <AnalysisResultScreen channel={ch?.username} onToCabinet={() => { setIsNew(false); nav("cabinet-main"); }} onAudit={() => nav("audit")} />;
      case "cabinet-main": return <CabinetScreen channel={ch} onNavigate={s => s === "search" ? handleTab("search") : nav(s)} />;
      case "breakdown": return <BreakdownScreen onBack={() => nav("cabinet-main")} onNavigate={nav} />;
      case "search": return <SearchScreen onAnalyze={l => { setCh({ username: l, subs: "—" }); nav("analysis-result"); }} />;
      case "profile": return <ProfileScreen onAudit={() => nav("audit")} onNavigate={nav} />;
      case "audit": return <AuditFlowScreen onBack={() => nav(isNew ? "onboarding" : "cabinet-main")} onComplete={() => {}} />;
      case "ideas": return <Placeholder title="Идеи каналов" icon="💡" desc="Подборки каналов для роста." />;
      case "vp-list": return <VPListScreen onBack={() => nav("cabinet-main")} onOpenCard={p => { setSelPartner(p); nav("vp-card"); }} />;
      case "vp-card": return <VPCardScreen partner={selPartner} onBack={() => nav("vp-list")} />;
      case "ads-list": return <AdsListScreen onBack={() => nav("cabinet-main")} onOpenCard={a => { setSelAd(a); nav("ad-card"); }} />;
      case "ad-card": return <AdCardScreen ad={selAd} onBack={() => nav("ads-list")} />;
      case "report": return <ReportScreen onBack={() => nav("cabinet-main")} />;
      case "status": return <StatusScreen onBack={() => nav("cabinet-main")} />;
      case "feedback-form": return <FeedbackFormScreen onBack={() => nav("cabinet-main")} type="vp" />;
      case "badges": return <BadgesScreen onBack={() => { setScreen("profile"); setTab("profile"); }} />;
      case "stars": return <StarsScreen onBack={() => { setScreen("profile"); setTab("profile"); }} />;
      case "notifications": return <NotificationsScreen onBack={() => { setScreen("profile"); setTab("profile"); }} />;
      default: return <Placeholder title="404" icon="❓" />;
    }
  };

  const showTabs = !["first-analysis", "audit", "breakdown", "vp-list", "vp-card", "ads-list", "ad-card", "report", "status", "feedback-form", "badges", "stars", "notifications"].includes(screen);
  const showHdr = !["first-analysis", "audit", "breakdown", "vp-list", "vp-card", "ads-list", "ad-card", "report", "status", "feedback-form", "badges", "stars", "notifications"].includes(screen) || screen === "analysis-result";

  return (
    <div style={{ width: 375, height: 812, margin: "0 auto", background: C.bg, fontFamily: F.b, color: C.text, display: "flex", flexDirection: "column", borderRadius: 20, overflow: "hidden", boxShadow: "0 0 0 1px rgba(255,255,255,.07), 0 40px 90px rgba(0,0,0,.6), 0 0 80px rgba(46,166,255,.05)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700;800&family=Geologica:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes pulse { 0%,100% { transform:scale(1); opacity:.6; } 50% { transform:scale(1.2); opacity:1; } }
        * { margin:0; padding:0; box-sizing:border-box; scrollbar-width:none; }
        *::-webkit-scrollbar { display:none; }
        input::placeholder { color: #6b8aaa; }
      `}</style>
      {showHdr && <AppHeader />}
      {showTabs && <TabBar active={tab} onChange={handleTab} />}
      {render()}
    </div>
  );
}
