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
    background: "linear-gradient(to right, #0ea5e9, #38bdf8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  button: {
    background: "#0284c7",
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
  badge: (result) => {
    let colorObj = { bg: "rgba(148,163,184,0.1)", text: "#94a3b8", border: "rgba(148,163,184,0.2)" };
    if(result === 'success') colorObj = { bg: "rgba(16,185,129,0.1)", text: "#10b981", border: "rgba(16,185,129,0.2)" };
    if(result === 'partial') colorObj = { bg: "rgba(245,158,11,0.1)", text: "#f59e0b", border: "rgba(245,158,11,0.2)" };
    if(result === 'failure') colorObj = { bg: "rgba(239,68,68,0.1)", text: "#ef4444", border: "rgba(239,68,68,0.2)" };
    if(result === 'pending') colorObj = { bg: "rgba(14,165,233,0.1)", text: "#38bdf8", border: "rgba(14,165,233,0.2)" };
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

export default function Experiments() {
  const [experiments, setExperiments] = useState([]);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Panel State
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    mission_id: "",
    name: "",
    type: "",
    result: "pending",
    data_points: "",
    findings: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expRes, missRes] = await Promise.all([
        api.get("/experiments"),
        api.get("/missions")
      ]);
      setExperiments(expRes.data);
      setMissions(missRes.data);
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
      mission_id: missions.length > 0 ? missions[0].mission_id : "",
      name: "",
      type: "",
      result: "pending",
      data_points: "",
      findings: "",
    });
    setSelectedExperiment(null);
    setIsEditing(true);
    setIsPanelOpen(true);
  };

  const openEditPanel = (exp) => {
    if(!exp) return;
    setFormData({
      mission_id: exp.mission_id || "",
      name: exp.name || "",
      type: exp.type || "",
      result: exp.result || "pending",
      data_points: exp.data_points || "",
      findings: exp.findings || "",
    });
    setSelectedExperiment(exp);
    setIsEditing(false);
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => {
      setSelectedExperiment(null);
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
      const payload = {
        ...formData,
        // Convert to integer or null
        data_points: formData.data_points ? parseInt(formData.data_points) : null
      };

      if (selectedExperiment && isEditing) {
        await api.put(`/experiments/${selectedExperiment.experiment_id}`, payload);
      } else {
        await api.post("/experiments", payload);
      }
      fetchData();
      closePanel();
    } catch (err) {
      alert("Error en sistema de telemetría: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`¿Borrar los datos del experimento ${selectedExperiment.name}?`)) return;
    try {
      await api.delete(`/experiments/${selectedExperiment.experiment_id}`);
      fetchData();
      closePanel();
    } catch (err) {
      alert("No se puede borrar el archivo: " + (err.response?.data?.message || err.message));
    }
  };

  const getMissionName = (id) => missions.find(m => m.mission_id === id)?.name || "Misión Desconocida";

  if (loading && experiments.length === 0) {
    return <div style={{...S.root, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Descifrando paquetes de datos de ciencia...</div>;
  }

  if (error) {
    return <div style={{...S.root, color: '#ef4444'}}>Falla de lectura: {error}</div>;
  }

  return (
    <div style={S.root}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Registros Científicos</h1>
          <p style={{ color: "#94a3b8", marginTop: "8px" }}>Análisis, botánica, espectrometría y hallazgos cósmicos.</p>
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
          <Link to="/missions" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='#e11d48'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>Misiones</Link>
        </div>
        <button 
          style={S.button}
          onMouseEnter={(e) => e.target.style.background = "#0369a1"}
          onMouseLeave={(e) => e.target.style.background = "#0284c7"}
          onClick={openNewPanel}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Nuevo Ensayo
        </button>
      </div>

      {/* Table */}
      <div style={S.tableWrapper}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Expediente</th>
              <th style={S.th}>Nombre del Ensayo</th>
              <th style={S.th}>Clasificación (Tipo)</th>
              <th style={S.th}>Misión Base</th>
              <th style={S.th}>Resultado</th>
            </tr>
          </thead>
          <tbody>
            {experiments.map(e => (
              <tr 
                key={e.experiment_id} 
                style={S.trHover}
                onMouseEnter={(ev) => ev.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={(ev) => ev.currentTarget.style.background = "transparent"}
                onClick={() => openEditPanel(e)}
              >
                <td style={{...S.td, fontFamily: "'Space Mono', monospace", color: "#64748b"}}>EX-{e.experiment_id}</td>
                <td style={{...S.td, fontWeight: 600}}>{e.name}</td>
                <td style={S.td}>{e.type || 'General'}</td>
                <td style={{...S.td, color: "#94a3b8"}}>{getMissionName(e.mission_id)}</td>
                <td style={S.td}>
                  <span style={S.badge(e.result || 'pending')}>
                    {(e.result || 'pending').toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
            {experiments.length === 0 && (
              <tr>
                <td colSpan="5" style={{...S.td, textAlign: "center", color: "#64748b", padding: "40px"}}>
                  Sin literatura científica almacenada aún.
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
            {selectedExperiment ? (isEditing ? "Corregir Paper" : "Analíticas del Ensayo") : "Registrar Hipótesis"}
          </h2>
          <button style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }} onClick={closePanel}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div style={S.panelBody}>
          {(!isEditing && selectedExperiment) ? (
            /* VIEW MODE */
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ fontSize: "48px", textAlign: "center", padding: "20px 0", background: "rgba(14, 165, 233, 0.05)", borderRadius: "12px", border: "1px dashed rgba(14, 165, 233, 0.2)"}}>
                🧬
              </div>
              
              <div>
                <div style={S.label}>Título del Experimento</div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#fff", marginTop: "4px" }}>
                  {selectedExperiment.name}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a" }}>
                  <div style={S.label}>Dictamen (Status)</div>
                  <div style={{ marginTop: "12px" }}>
                     <span style={S.badge(selectedExperiment.result || 'pending')}>{(selectedExperiment.result || 'pending').toUpperCase()}</span>
                  </div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a" }}>
                  <div style={S.label}>Campo (Tipo)</div>
                  <div style={{ fontWeight: 600, marginTop: "8px", color: "#38bdf8" }}>{selectedExperiment.type || "Multidisciplinar"}</div>
                </div>
                
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a", gridColumn: "span 2" }}>
                  <div style={S.label}>Misión Origen</div>
                  <div style={{ fontWeight: "bold", marginTop: "8px", fontSize: "16px" }}>
                    {getMissionName(selectedExperiment.mission_id)}
                  </div>
                </div>
                
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a", gridColumn: "span 2" }}>
                  <div style={S.label}>Puntos de Datos Capturados (Mbs)</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", marginTop: "8px", fontSize: "16px" }}>
                    {selectedExperiment.data_points ? selectedExperiment.data_points.toLocaleString() : "0"} <span style={{fontSize: "12px", color:"#64748b"}}>unidades</span>
                  </div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a", gridColumn: "span 2" }}>
                  <div style={S.label}>Hallazgos / Conclusión</div>
                  <p style={{ marginTop: "8px", color: "#cbd5e1", lineHeight: 1.6 }}>{selectedExperiment.findings || "Análisis en curso o sin notas concluyentes."}</p>
                </div>
              </div>
            </div>
          ) : (
            /* EDIT / CREATE FORM */
            <form id="exp-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={S.formGroup}>
                <label style={S.label}>Título del Ensayo *</label>
                <input required style={S.input} name="name" value={formData.name} onChange={handleInputChange} placeholder="Ej. Cultivo Hidropónico Lunar" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={S.formGroup}>
                  <label style={S.label}>Enlazado a Misión *</label>
                  <select required style={S.input} name="mission_id" value={formData.mission_id} onChange={handleInputChange}>
                    <option value="" disabled>Seleccione Misión</option>
                    {missions.map(m => <option key={m.mission_id} value={m.mission_id}>{m.name}</option>)}
                  </select>
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Resultado (Status) *</label>
                  <select required style={S.input} name="result" value={formData.result} onChange={handleInputChange}>
                    <option value="pending">Pendiente / Analizando</option>
                    <option value="success">Éxito Absoluto</option>
                    <option value="partial">Éxito Parcial</option>
                    <option value="failure">Fallo / Datos Anómalos</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={S.formGroup}>
                  <label style={S.label}>Rama Científica (Tipo)</label>
                  <input style={S.input} name="type" value={formData.type} onChange={handleInputChange} placeholder="Biología, Física..." />
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Puntos de Datos (Numérico)</label>
                  <input type="number" style={S.input} name="data_points" value={formData.data_points} onChange={handleInputChange} />
                </div>
              </div>

              <div style={S.formGroup}>
                <label style={S.label}>Conclusiones / Hallazgos</label>
                <textarea style={S.textarea} name="findings" value={formData.findings} onChange={handleInputChange} placeholder="Las muestras indican..." />
              </div>

            </form>
          )}
        </div>

        <div style={S.panelFooter}>
          {selectedExperiment && !isEditing && (
            <>
              <button type="button" style={{...S.buttonDanger, marginRight: "auto"}} onClick={handleDelete}>Destruir Registros</button>
              <button type="button" style={S.buttonSecondary} onClick={() => setIsEditing(true)}>Reclasificar Info</button>
            </>
          )}
          {isEditing && (
            <>
              <button type="button" style={S.buttonSecondary} onClick={() => selectedExperiment ? setIsEditing(false) : closePanel()}>
                Cancelar
              </button>
              <button form="exp-form" type="submit" style={S.button}>
                Almacenar Datos
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
