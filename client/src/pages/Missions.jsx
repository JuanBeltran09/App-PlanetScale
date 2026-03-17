import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const S = {
  root: {
    minHeight: "100vh",
    background: "#020a18",
    color: "#e2e8f0",
    fontFamily: "'Syne', 'Segoe UI', sans-serif",
    padding: "40px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  title: {
    fontSize: "32px",
    fontWeight: 800,
    background: "linear-gradient(to right, #ec4899, #f43f5e)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  button: {
    background: "#e11d48",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "background 0.2s",
  },
  buttonSecondary: {
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  buttonDanger: {
    background: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  tableWrapper: {
    background: "#0b1628",
    border: "1px solid #1a2d4a",
    borderRadius: "12px",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  th: {
    padding: "16px 24px",
    background: "rgba(2,10,24,0.5)",
    color: "#94a3b8",
    fontFamily: "'Space Mono', monospace",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    borderBottom: "1px solid #1a2d4a",
  },
  td: {
    padding: "16px 24px",
    borderBottom: "1px solid #1a2d4a",
    color: "#e2e8f0",
    fontSize: "14px",
  },
  trHover: {
    cursor: "pointer",
    transition: "background 0.2s",
  },
  badge: (status) => {
    let colorObj = { bg: "rgba(148,163,184,0.1)", text: "#94a3b8", border: "rgba(148,163,184,0.2)" };
    if(status === 'active') colorObj = { bg: "rgba(245,158,11,0.1)", text: "#f59e0b", border: "rgba(245,158,11,0.2)" };
    if(status === 'completed') colorObj = { bg: "rgba(16,185,129,0.1)", text: "#10b981", border: "rgba(16,185,129,0.2)" };
    if(status === 'failed') colorObj = { bg: "rgba(239,68,68,0.1)", text: "#ef4444", border: "rgba(239,68,68,0.2)" };
    if(status === 'planned') colorObj = { bg: "rgba(99,102,241,0.1)", text: "#818cf8", border: "rgba(99,102,241,0.2)" };
    return {
      padding: "4px 8px",
      borderRadius: "999px",
      fontSize: "11px",
      fontFamily: "'Space Mono', monospace",
      background: colorObj.bg,
      color: colorObj.text,
      border: `1px solid ${colorObj.border}`,
    };
  },
  
  // Slide Over Panel
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    zIndex: 40,
  },
  panel: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    width: "500px",
    background: "#0b1628",
    borderLeft: "1px solid #1a2d4a",
    zIndex: 50,
    boxShadow: "-10px 0 30px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    transform: "translateX(100%)",
    transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  panelOpen: {
    transform: "translateX(0)",
  },
  panelHeader: {
    padding: "24px",
    borderBottom: "1px solid #1a2d4a",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  panelBody: {
    padding: "24px",
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  panelFooter: {
    padding: "24px",
    borderTop: "1px solid #1a2d4a",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
  },
  
  // Forms
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "12px",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  input: {
    background: "rgba(2,10,24,0.5)",
    border: "1px solid #1a2d4a",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    width: "100%",
  },
  textarea: {
    background: "rgba(2,10,24,0.5)",
    border: "1px solid #1a2d4a",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    minHeight: "100px",
    resize: "vertical",
  },
};

export default function Missions() {
  const [missions, setMissions] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Panel State
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    planet_id: "",
    ship_id: "",
    launch_date: "",
    return_date: "",
    objective: "",
    status: "planned",
    budget_usd: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [missionsRes, planetsRes, shipsRes] = await Promise.all([
        api.get("/missions"),
        api.get("/planets"),
        api.get("/ships")
      ]);
      setMissions(missionsRes.data);
      setPlanets(planetsRes.data);
      setShips(shipsRes.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openNewPanel = () => {
    setFormData({
      name: "",
      planet_id: planets.length > 0 ? planets[0].planet_id : "",
      ship_id: ships.length > 0 ? ships[0].ship_id : "",
      launch_date: "",
      return_date: "",
      objective: "",
      status: "planned",
      budget_usd: "",
    });
    setSelectedMission(null);
    setIsEditing(true);
    setIsPanelOpen(true);
  };

  const openEditPanel = (mission) => {
    if(!mission) return;
    setFormData({
      name: mission.name || "",
      planet_id: mission.planet_id || "",
      ship_id: mission.ship_id || "",
      launch_date: mission.launch_date ? mission.launch_date.split('T')[0] : "",
      return_date: mission.return_date ? mission.return_date.split('T')[0] : "",
      objective: mission.objective || "",
      status: mission.status || "planned",
      budget_usd: mission.budget_usd || "",
    });
    setSelectedMission(mission);
    setIsEditing(false);
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => {
      setSelectedMission(null);
      setIsEditing(false);
    }, 300);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedMission && isEditing) {
        await api.put(`/missions/${selectedMission.mission_id}`, formData);
      } else {
        await api.post("/missions", formData);
      }
      fetchData();
      closePanel();
    } catch (err) {
      alert("Error en la directiva: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`¿Abortar y borrar registro de la misión ${selectedMission.name}?`)) return;
    try {
      await api.delete(`/missions/${selectedMission.mission_id}`);
      fetchData();
      closePanel();
    } catch (err) {
      alert("No se puede purgar la misión: " + (err.response?.data?.message || err.message));
    }
  };

  const getPlanetName = (id) => planets.find(p => p.planet_id === id)?.name || "Desconocido";
  const getShipName = (id) => ships.find(s => s.ship_id === id)?.name || "Sin Asignar";

  if (loading && missions.length === 0) {
    return <div style={{...S.root, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Conectando con Control de Misión...</div>;
  }

  if (error) {
    return <div style={{...S.root, color: '#ef4444'}}>Error de transmisión: {error}</div>;
  }

  return (
    <div style={S.root}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Control de Misiones</h1>
          <p style={{ color: "#94a3b8", marginTop: "8px" }}>Gestión de operaciones cósmicas interplanetarias.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '6px 16px', borderRadius: '12px', border: '1px solid #1a2d4a', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Dashboard</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/planets" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='#10b981'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>Planetas</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/ships" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='#f59e0b'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>Naves</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/astronauts" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='#6366f1'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>Astronautas</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/experiments" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='#0284c7'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>Ciencia</Link>
        </div>
        <button 
          style={S.button}
          onMouseEnter={(e) => e.target.style.background = "#be123c"}
          onMouseLeave={(e) => e.target.style.background = "#e11d48"}
          onClick={openNewPanel}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Proponer Misión
        </button>
      </div>

      {/* Table */}
      <div style={S.tableWrapper}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Cód.</th>
              <th style={S.th}>Operación (Nombre)</th>
              <th style={S.th}>Destino (Planeta)</th>
              <th style={S.th}>Vehículo (Nave)</th>
              <th style={S.th}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {missions.map(m => (
              <tr 
                key={m.mission_id} 
                style={S.trHover}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                onClick={() => openEditPanel(m)}
              >
                <td style={{...S.td, fontFamily: "'Space Mono', monospace", color: "#64748b"}}>MSN-{m.mission_id}</td>
                <td style={{...S.td, fontWeight: 600}}>{m.name}</td>
                <td style={S.td}>{getPlanetName(m.planet_id)}</td>
                <td style={{...S.td, color: "#94a3b8"}}>{getShipName(m.ship_id)}</td>
                <td style={S.td}>
                  <span style={S.badge(m.status)}>
                    {m.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
            {missions.length === 0 && (
              <tr>
                <td colSpan="5" style={{...S.td, textAlign: "center", color: "#64748b", padding: "40px"}}>
                  Sin misiones en los registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Overlay Background */}
      {isPanelOpen && <div style={S.overlay} onClick={closePanel} />}

      {/* Slide Over Panel */}
      <div style={{...S.panel, ...(isPanelOpen ? S.panelOpen : {})}}>
        <div style={S.panelHeader}>
          <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
            {selectedMission ? (isEditing ? "Modificar Parámetros Misión" : "Briefing de la Misión") : "Aprobación de Vuelo"}
          </h2>
          <button style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }} onClick={closePanel}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div style={S.panelBody}>
          {(!isEditing && selectedMission) ? (
            /* VIEW MODE */
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ fontSize: "48px", textAlign: "center", padding: "20px 0", background: "rgba(225, 29, 72, 0.05)", borderRadius: "12px", border: "1px dashed rgba(225, 29, 72, 0.2)"}}>
                📡
              </div>
              
              <div>
                <div style={S.label}>Operación</div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#fff", marginTop: "4px" }}>
                  {selectedMission.name}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a" }}>
                  <div style={S.label}>Estado de la Directiva</div>
                  <div style={{ marginTop: "12px" }}>
                     <span style={S.badge(selectedMission.status)}>{selectedMission.status.toUpperCase()}</span>
                  </div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a" }}>
                  <div style={S.label}>Presupuesto Misión</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 600, marginTop: "8px", color: "#fcd34d" }}>
                    {selectedMission.budget_usd ? `$${parseInt(selectedMission.budget_usd).toLocaleString()}` : "Confidencial"}
                  </div>
                </div>
                
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a" }}>
                  <div style={S.label}>Destino / Sector</div>
                  <div style={{ fontWeight: "bold", marginTop: "8px", fontSize: "16px" }}>
                    {getPlanetName(selectedMission.planet_id)}
                  </div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a" }}>
                  <div style={S.label}>Vehículo Asignado</div>
                  <div style={{ fontWeight: "bold", marginTop: "8px", fontSize: "16px" }}>
                    {getShipName(selectedMission.ship_id)}
                  </div>
                </div>
                
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a" }}>
                  <div style={S.label}>Ventana de Lanzamiento</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", marginTop: "8px" }}>
                    {selectedMission.launch_date ? new Date(selectedMission.launch_date).toLocaleDateString() : "TBD"}
                  </div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a" }}>
                  <div style={S.label}>Retorno Estimado</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", marginTop: "8px" }}>
                    {selectedMission.return_date ? new Date(selectedMission.return_date).toLocaleDateString() : "TBD"}
                  </div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a", gridColumn: "span 2" }}>
                  <div style={S.label}>Objetivo Táctico</div>
                  <p style={{ marginTop: "8px", color: "#cbd5e1", lineHeight: 1.6 }}>{selectedMission.objective || "Sin detalles adicionales."}</p>
                </div>
              </div>
            </div>
          ) : (
            /* EDIT / CREATE FORM */
            <form id="mission-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={S.formGroup}>
                <label style={S.label}>Nombre de Operación *</label>
                <input required style={S.input} name="name" value={formData.name} onChange={handleInputChange} placeholder="Ej. Operación Artemis" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={S.formGroup}>
                  <label style={S.label}>Planeta Destino *</label>
                  <select required style={S.input} name="planet_id" value={formData.planet_id} onChange={handleInputChange}>
                    <option value="" disabled>Seleccione Planeta</option>
                    {planets.map(p => <option key={p.planet_id} value={p.planet_id}>{p.name}</option>)}
                  </select>
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Nave Asignada *</label>
                  <select required style={S.input} name="ship_id" value={formData.ship_id} onChange={handleInputChange}>
                    <option value="" disabled>Seleccione Nave</option>
                    {ships.map(s => <option key={s.ship_id} value={s.ship_id}>{s.name} ({s.status})</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={S.formGroup}>
                  <label style={S.label}>Propósito / Estado *</label>
                  <select required style={S.input} name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="planned">Planificada</option>
                    <option value="active">Activa (En curso)</option>
                    <option value="completed">Misión Cumplida</option>
                    <option value="failed">Abortada / Fracasada</option>
                  </select>
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Fondo Asignado ($ USD)</label>
                  <input type="number" step="1000" style={S.input} name="budget_usd" value={formData.budget_usd} onChange={handleInputChange} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={S.formGroup}>
                  <label style={S.label}>Lanzamiento T-Cero</label>
                  <input type="date" style={S.input} name="launch_date" value={formData.launch_date} onChange={handleInputChange} />
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Fecha Esperada Retorno</label>
                  <input type="date" style={S.input} name="return_date" value={formData.return_date} onChange={handleInputChange} />
                </div>
              </div>

              <div style={S.formGroup}>
                <label style={S.label}>Objetivo de la Misión</label>
                <textarea style={S.textarea} name="objective" value={formData.objective} onChange={handleInputChange} placeholder="Detalles de colonización, muestreo, etc." />
              </div>

            </form>
          )}
        </div>

        <div style={S.panelFooter}>
          {selectedMission && !isEditing && (
            <>
              <button type="button" style={{...S.buttonDanger, marginRight: "auto"}} onClick={handleDelete}>Borrar Expediente</button>
              <button type="button" style={S.buttonSecondary} onClick={() => setIsEditing(true)}>Reescribir Órdenes</button>
            </>
          )}
          {isEditing && (
            <>
              <button type="button" style={S.buttonSecondary} onClick={() => selectedMission ? setIsEditing(false) : closePanel()}>
                Cancelar
              </button>
              <button form="mission-form" type="submit" style={S.button}>
                Confirmar Directiva
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
