import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

/* ─── Inline styles (no Tailwind dependency for the new design) ─── */
const S = {
  root: {
    minHeight: "100vh",
    background: "#020a18",
    color: "#e2e8f0",
    fontFamily: "'Syne', 'Segoe UI', sans-serif",
    overflowX: "hidden",
    position: "relative",
  },
  canvas: {
    position: "fixed",
    inset: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 0,
  },
  inner: { position: "relative", zIndex: 1 },

  /* Header */
  header: {
    padding: "20px 32px",
    borderBottom: "1px solid #1a2d4a",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(2,10,24,0.85)",
    backdropFilter: "blur(12px)",
  },
  headerBrand: { display: "flex", alignItems: "center", gap: 12 },
  headerTitle: {
    fontSize: 15,
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#fff",
  },
  headerSub: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 10,
    color: "#64748b",
    letterSpacing: "0.08em",
  },
  headerRight: { display: "flex", alignItems: "center", gap: 8 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#10b981",
    animation: "pulse 2s infinite",
  },
  clock: { fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#64748b" },
  live: { fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#0ea5e9", marginLeft: 8 },

  /* Main */
  main: { padding: "24px 32px", maxWidth: 1400, margin: "0 auto" },

  /* Stat grid */
  statGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 1,
    background: "#1a2d4a",
    border: "1px solid #1a2d4a",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
  },
  statCard: (accent) => ({
    display: "block",
    textDecoration: "none",
    background: "#0b1628",
    padding: "24px 20px",
    position: "relative",
    cursor: "pointer",
    transition: "background 0.2s",
  }),
  statLabel: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 9,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#64748b",
    marginBottom: 12,
  },
  statValue: { fontSize: 48, fontWeight: 800, color: "#fff", lineHeight: 1 },
  statSub: (c) => ({
    marginTop: 12,
    fontSize: 11,
    color: c,
    fontFamily: "'Space Mono', monospace",
  }),
  progressTrack: (c) => ({
    marginTop: 12,
    height: 3,
    borderRadius: 2,
    background: `${c}22`,
    overflow: "hidden",
  }),
  progressFill: (c, pct) => ({
    height: "100%",
    width: `${pct}%`,
    background: c,
    borderRadius: 2,
  }),
  statIcon: {
    position: "absolute",
    top: 20,
    right: 20,
    opacity: 0.12,
  },

  /* Charts row */
  chartsRow: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr 1fr",
    gap: 16,
    marginBottom: 16,
  },
  card: {
    background: "#0b1628",
    border: "1px solid #1a2d4a",
    borderRadius: 12,
    padding: 24,
  },
  cardTitle: { fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 20 },

  /* Bar chart */
  barWrap: { display: "flex", alignItems: "flex-end", gap: 10, height: 180 },
  barCol: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: 180 },
  barLabelRow: { display: "flex", gap: 10, marginTop: 8 },
  barName: {
    flex: 1,
    textAlign: "center",
    fontFamily: "'Space Mono', monospace",
    fontSize: 9,
    color: "#64748b",
    paddingTop: 6,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  /* Bottom row */
  bottomRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  telemGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 4 },
  telemCell: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid #1a2d4a",
    borderRadius: 8,
    padding: 12,
  },
  telemCellLabel: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 8,
    color: "#475569",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },

  /* Missions list */
  missionItem: { display: "flex", flexDirection: "column", gap: 5, paddingBottom: 12, borderBottom: "1px solid #0f2038" },

  /* Events */
  eventRow: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
    padding: "8px 0",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },

  /* Loading / error */
  loadWrap: {
    minHeight: "100vh",
    background: "#020a18",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loadText: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 16,
    color: "#0ea5e9",
    animation: "pulse 2s infinite",
  },
  errorWrap: {
    minHeight: "100vh",
    background: "#020a18",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  errorBox: {
    padding: 40,
    border: "1px solid #450a0a",
    background: "rgba(127,29,29,0.15)",
    borderRadius: 16,
    textAlign: "center",
    color: "#f87171",
  },
};

/* ─── Stars canvas ─── */
function StarsCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let raf;
    function resize() { c.width = window.innerWidth; c.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      r: Math.random() * 1.2 + 0.2,
      o: Math.random() * 0.6 + 0.1,
      s: Math.random() * 0.5 + 0.2,
    }));
    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, c.width, c.height);
      t += 0.01;
      stars.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148,163,184,${s.o * (0.7 + 0.3 * Math.sin(t * s.s))})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={S.canvas} />;
}

/* ─── Clock ─── */
function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toTimeString().slice(0, 8));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span style={S.clock}>{time}</span>;
}

/* ─── Animated bar ─── */
function Bar({ value, max, color, label }) {
  const [h, setH] = useState(0);
  const target = Math.round((value / max) * 160);
  useEffect(() => { const t = setTimeout(() => setH(target), 150); return () => clearTimeout(t); }, [target]);
  return (
    <div style={S.barCol}>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color, marginBottom: 4 }}>
        {(value / 1000).toFixed(1)}k
      </div>
      <div style={{ width: "100%", borderRadius: "4px 4px 0 0", background: color, height: h, transition: "height 1.2s cubic-bezier(.16,1,.3,1)" }} />
    </div>
  );
}

/* ─── Donut ─── */
function Donut({ segments }) {
  const r = 44, cx = 60, cy = 60, circ = 2 * Math.PI * r;
  let off = 0;
  return (
    <svg viewBox="0 0 120 120" width={120} height={120}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#0b1628" strokeWidth={20} />
      {segments.map((s, i) => {
        const dash = circ * (s.pct / 100);
        const gap = circ - dash;
        const offset = circ * (1 - off / 100) - circ * 0.25;
        off += s.pct;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth={16}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={offset} />
        );
      })}
    </svg>
  );
}

/* ─── Telemetry flicker ─── */
function TelemetryGrid() {
  const items = [
    { label: "Temperatura", val: "−87°C", color: "#0ea5e9" },
    { label: "Presión", val: "0.006 atm", color: "#6366f1" },
    { label: "Radiación", val: "142 mSv", color: "#f59e0b" },
    { label: "Velocidad", val: "28,000 km/h", color: "#10b981" },
  ];
  const [dim, setDim] = useState(-1);
  useEffect(() => {
    const id = setInterval(() => {
      const i = Math.floor(Math.random() * items.length);
      setDim(i);
      setTimeout(() => setDim(-1), 120);
    }, 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={S.telemGrid}>
      {items.map((t, i) => (
        <div key={i} style={S.telemCell}>
          <div style={S.telemCellLabel}>{t.label}</div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, fontWeight: 700, color: t.color, opacity: dim === i ? 0.3 : 1, transition: "opacity 0.1s" }}>
            {t.val}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Static mock data for charts (replace with API data as needed) ─── */
const BUDGETS = [
  { n: "Artemis", v: 4500, c: "#0ea5e9" },
  { n: "Apolo", v: 3200, c: "#6366f1" },
  { n: "Marte-X", v: 5100, c: "#10b981" },
  { n: "Voyager", v: 2800, c: "#f59e0b" },
  { n: "Hermes", v: 3900, c: "#ec4899" },
];
const DONUT_SEGS = [
  { pct: 65, color: "#10b981", label: "Exitosos" },
  { pct: 25, color: "#0ea5e9", label: "En Progreso" },
  { pct: 10, color: "#ef4444", label: "Fallidos" },
];
const ACTIVE_MISSIONS = [
  { name: "Artemis VII", prog: 78, color: "#0ea5e9", status: "En órbita" },
  { name: "Marte-X III", prog: 45, color: "#10b981", status: "Tránsito" },
  { name: "Voyager II-B", prog: 92, color: "#f59e0b", status: "Retorno" },
  { name: "Hermes XII", prog: 22, color: "#ec4899", status: "Lanzamiento" },
];
const EVENTS = [
  { time: "08:42", msg: "Marte-X III: corrección de trayectoria ejecutada", type: "info" },
  { time: "07:15", msg: "Artemis VII: experimento bio completado", type: "success" },
  { time: "06:03", msg: "Hermes XII: ventana de lanzamiento confirmada", type: "info" },
  { time: "04:58", msg: "Voyager II-B: señal débil — verificando antena", type: "warn" },
  { time: "03:22", msg: "Apolo XVI: misión completada exitosamente", type: "success" },
];
const EVENT_COLORS = { info: "#0ea5e9", success: "#10b981", warn: "#f59e0b" };

/* ─── Main Dashboard ─── */
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message));
  }, []);

  /* Google Fonts injection */
  useEffect(() => {
    if (document.getElementById("syne-font")) return;
    const link = document.createElement("link");
    link.id = "syne-font";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap";
    document.head.appendChild(link);
  }, []);

  if (error) {
    return (
      <div style={S.errorWrap}>
        <div style={S.errorBox}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Error de Conexión</h2>
          <p style={{ fontSize: 14 }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={S.loadWrap}>
        <div style={S.loadText}>Iniciando Sistemas de Control...</div>
      </div>
    );
  }

  const total = data.missions.total || 1;
  const maxBudget = Math.max(...BUDGETS.map((b) => b.v));

  return (
    <div style={S.root}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      <StarsCanvas />

      <div style={S.inner}>
        {/* ── Header ── */}
        <header style={S.header}>
          <div style={S.headerBrand}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.4" />
              <circle cx="16" cy="16" r="8" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.7" />
              <circle cx="16" cy="16" r="3" fill="#0ea5e9" />
              <line x1="2" y1="16" x2="30" y2="16" stroke="#0ea5e9" strokeWidth="0.5" opacity="0.3" />
              <line x1="16" y1="2" x2="16" y2="30" stroke="#0ea5e9" strokeWidth="0.5" opacity="0.3" />
            </svg>
            <div>
              <div style={S.headerTitle}>Misiones Espaciales</div>
              <div style={S.headerSub}>CONTROL CENTER v2.4.1</div>
            </div>
          </div>
          <div style={S.headerRight}>
            <div style={{ display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '6px 12px', borderRadius: '8px', border: '1px solid #1a2d4a', marginRight: '20px' }}>
              <Link to="/planets" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '12px', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='#10b981'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>Planetas</Link>
              <span style={{ color: '#334155', fontSize: '12px' }}>|</span>
              <Link to="/ships" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '12px', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='#f59e0b'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>Naves</Link>
              <span style={{ color: '#334155', fontSize: '12px' }}>|</span>
              <Link to="/astronauts" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '12px', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='#6366f1'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>Astronautas</Link>
              <span style={{ color: '#334155', fontSize: '12px' }}>|</span>
              <Link to="/missions" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '12px', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='#e11d48'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>Misiones</Link>
              <span style={{ color: '#334155', fontSize: '12px' }}>|</span>
              <Link to="/experiments" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '12px', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='#0284c7'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>Ciencia</Link>
            </div>
            <div style={S.dot} />
            <LiveClock />
            <span style={S.live}>● LIVE</span>
          </div>
        </header>

        <main style={S.main}>
          {/* ── Stat cards ── */}
          <div style={S.statGrid}>
            {/* Missions */}
            <Link 
              to="/missions" 
              style={{ ...S.statCard("#0ea5e9"), gridColumn: "span 2" }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#0b1628'}
            >
              <svg style={S.statIcon} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <div style={S.statLabel}>Misiones Totales</div>
              <div style={S.statValue}>{data.missions.total}</div>
              <div style={{ marginTop: 16 }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
                  <div style={{ height: 3, borderRadius: 2, background: "#3b82f6", flex: data.missions.planned || 1 }} />
                  <div style={{ height: 3, borderRadius: 2, background: "#10b981", flex: data.missions.active || 1 }} />
                  <div style={{ height: 3, borderRadius: 2, background: "#6366f1", flex: data.missions.completed || 1 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Space Mono',monospace", fontSize: 9, color: "#64748b" }}>
                  <span style={{ color: "#3b82f6" }}>{data.missions.planned} plan.</span>
                  <span style={{ color: "#10b981" }}>{data.missions.active} activ.</span>
                  <span style={{ color: "#6366f1" }}>{data.missions.completed} comp.</span>
                </div>
              </div>
            </Link>

            {/* Astronauts */}
            <Link 
              to="/astronauts" 
              style={S.statCard("#6366f1")}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#0b1628'}
            >
              <svg style={S.statIcon} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              <div style={S.statLabel}>Astronautas</div>
              <div style={S.statValue}>{data.astronauts}</div>
              <div style={S.statSub("#6366f1")}>Personal activo</div>
              <div style={S.progressTrack("#6366f1")}>
                <div style={S.progressFill("#6366f1", Math.min(100, Math.round((data.astronauts / 200) * 100)))} />
              </div>
            </Link>

            {/* Ships */}
            <Link 
              to="/ships" 
              style={S.statCard("#f59e0b")}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#0b1628'}
            >
              <svg style={S.statIcon} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5">
                <path d="M12 2l-4 10h8L12 2zM8 12l-4 8h16l-4-8H8z" />
              </svg>
              <div style={S.statLabel}>Flota de Naves</div>
              <div style={S.statValue}>{data.ships}</div>
              <div style={S.statSub("#f59e0b")}>Unidades operativas</div>
              <div style={S.progressTrack("#f59e0b")}>
                <div style={S.progressFill("#f59e0b", Math.min(100, Math.round((data.ships / 50) * 100)))} />
              </div>
            </Link>

            {/* Planets */}
            <Link 
              to="/planets" 
              style={S.statCard("#10b981")}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#0b1628'}
            >
              <svg style={S.statIcon} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" /><path d="M4.93 4.93l14.14 14.14" />
              </svg>
              <div style={S.statLabel}>Planetas</div>
              <div style={S.statValue}>{data.planets}</div>
              <div style={S.statSub("#10b981")}>Mundos catalogados</div>
              <div style={S.progressTrack("#10b981")}>
                <div style={S.progressFill("#10b981", Math.min(100, Math.round((data.planets / 30) * 100)))} />
              </div>
            </Link>

            {/* Experiments */}
            <Link 
              to="/experiments" 
              style={S.statCard("#ec4899")}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#0b1628'}
            >
              <svg style={S.statIcon} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="1.5">
                <path d="M10 2v7.31L4.75 19.9a2 2 0 001.79 2.1h10.92a2 2 0 001.79-2.1L14 9.31V2h-4z" />
              </svg>
              <div style={S.statLabel}>Experimentos</div>
              <div style={S.statValue}>{data.experiments}</div>
              <div style={S.statSub("#ec4899")}>Proyectos activos</div>
              <div style={S.progressTrack("#ec4899")}>
                <div style={S.progressFill("#ec4899", Math.min(100, Math.round((data.experiments / 300) * 100)))} />
              </div>
            </Link>
          </div>

        </main>
      </div>
    </div>
  );
}