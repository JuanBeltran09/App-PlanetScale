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
    background: "linear-gradient(to right, #6366f1, #a855f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  button: {
    background: "#6366f1",
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
  badge: (specialty) => {
    let colorObj = { bg: "rgba(148,163,184,0.1)", text: "#94a3b8", border: "rgba(148,163,184,0.2)" };
    if((specialty || '').toLowerCase().includes("piloto")) colorObj = { bg: "rgba(245,158,11,0.1)", text: "#f59e0b", border: "rgba(245,158,11,0.2)" };
    if((specialty || '').toLowerCase().includes("inge")) colorObj = { bg: "rgba(16,185,129,0.1)", text: "#10b981", border: "rgba(16,185,129,0.2)" };
    if((specialty || '').toLowerCase().includes("coman")) colorObj = { bg: "rgba(99,102,241,0.1)", text: "#818cf8", border: "rgba(99,102,241,0.2)" };
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
};

export default function Astronauts() {
  const [astronauts, setAstronauts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Panel State
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedAstronaut, setSelectedAstronaut] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    specialty: "",
    nationality: "",
    email: "",
    hire_date: "",
    space_hours: 0,
  });

  const fetchAstronauts = () => {
    setLoading(true);
    api.get("/astronauts")
      .then((res) => {
        setAstronauts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAstronauts();
  }, []);

  const openNewPanel = () => {
    setFormData({
      first_name: "",
      last_name: "",
      specialty: "",
      nationality: "",
      email: "",
      hire_date: "",
      space_hours: 0,
    });
    setSelectedAstronaut(null);
    setIsEditing(true);
    setIsPanelOpen(true);
  };

  const openEditPanel = (astro) => {
    if(!astro) return;
    setFormData({
      first_name: astro.first_name || "",
      last_name: astro.last_name || "",
      specialty: astro.specialty || "",
      nationality: astro.nationality || "",
      email: astro.email || "",
      hire_date: astro.hire_date ? astro.hire_date.split('T')[0] : "",
      space_hours: astro.space_hours || 0,
    });
    setSelectedAstronaut(astro);
    setIsEditing(false);
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => {
      setSelectedAstronaut(null);
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
      if (selectedAstronaut && isEditing) {
        await api.put(`/astronauts/${selectedAstronaut.astronaut_id}`, formData);
      } else {
        await api.post("/astronauts", formData);
      }
      fetchAstronauts();
      closePanel();
    } catch (err) {
      alert("Error guardando: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`¿Estás seguro de eliminar a ${selectedAstronaut.first_name}?`)) return;
    try {
      await api.delete(`/astronauts/${selectedAstronaut.astronaut_id}`);
      fetchAstronauts();
      closePanel();
    } catch (err) {
      alert("No se puede eliminar: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading && astronauts.length === 0) {
    return <div style={{...S.root, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Buscando personal humano...</div>;
  }

  if (error) {
    return <div style={{...S.root, color: '#ef4444'}}>Error: {error}</div>;
  }

  return (
    <div style={S.root}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Tripulación Activa</h1>
          <p style={{ color: "#94a3b8", marginTop: "8px" }}>Directorio de astronautas, ingenieros y científicos de la flota.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '6px 16px', borderRadius: '12px', border: '1px solid #1a2d4a', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Dashboard</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/planets" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='#10b981'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>Planetas</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/ships" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='#f59e0b'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>Naves</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/missions" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='#e11d48'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>Misiones</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/experiments" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='#0284c7'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>Ciencia</Link>
        </div>
        <button 
          style={S.button}
          onMouseEnter={(e) => e.target.style.background = "#4f46e5"}
          onMouseLeave={(e) => e.target.style.background = "#6366f1"}
          onClick={openNewPanel}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Reclutar Astronauta
        </button>
      </div>

      {/* Table */}
      <div style={S.tableWrapper}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>ID</th>
              <th style={S.th}>Nombre Completo</th>
              <th style={S.th}>Especialidad</th>
              <th style={S.th}>Nacionalidad</th>
              <th style={S.th}>Horas de Vuelo</th>
            </tr>
          </thead>
          <tbody>
            {astronauts.map(a => (
              <tr 
                key={a.astronaut_id} 
                style={S.trHover}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                onClick={() => openEditPanel(a)}
              >
                <td style={{...S.td, fontFamily: "'Space Mono', monospace", color: "#64748b"}}>#{a.astronaut_id}</td>
                <td style={{...S.td, fontWeight: 600}}>{a.first_name} {a.last_name}</td>
                <td style={S.td}>
                  <span style={S.badge(a.specialty)}>
                    {(a.specialty || 'GENERAL').toUpperCase()}
                  </span>
                </td>
                <td style={S.td}>{a.nationality || '-'}</td>
                <td style={{...S.td, fontFamily: "'Space Mono', monospace"}}>{a.space_hours} hrs</td>
              </tr>
            ))}
            {astronauts.length === 0 && (
              <tr>
                <td colSpan="5" style={{...S.td, textAlign: "center", color: "#64748b", padding: "40px"}}>
                  Nadie ha pasado las pruebas de aptitud física aún.
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
            {selectedAstronaut ? (isEditing ? "Editar Perfil" : "Expediente de Astronauta") : "Alta de Personal"}
          </h2>
          <button style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }} onClick={closePanel}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div style={S.panelBody}>
          {(!isEditing && selectedAstronaut) ? (
            /* VIEW MODE */
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ fontSize: "48px", textAlign: "center", padding: "20px 0", background: "rgba(99, 102, 241, 0.05)", borderRadius: "12px", border: "1px dashed rgba(99, 102, 241, 0.2)"}}>
                👨‍🚀
              </div>
              
              <div>
                <div style={S.label}>Nombre y Apellidos</div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#fff", marginTop: "4px" }}>
                  {selectedAstronaut.first_name} {selectedAstronaut.last_name}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a" }}>
                  <div style={S.label}>Especialidad Principal</div>
                  <div style={{ fontWeight: 600, marginTop: "8px", color: "#818cf8" }}>{selectedAstronaut.specialty || "-"}</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a" }}>
                  <div style={S.label}>Nacionalidad</div>
                  <div style={{ fontWeight: 600, marginTop: "8px" }}>{selectedAstronaut.nationality || "-"}</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a", gridColumn: "span 2" }}>
                  <div style={S.label}>Contacto Oficial (COMSEC)</div>
                  <div style={{ fontWeight: 400, marginTop: "8px", color: "#94a3b8" }}>{selectedAstronaut.email || "Confidencial"}</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a" }}>
                  <div style={S.label}>Fecha de Reclutamiento</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", marginTop: "8px" }}>
                    {selectedAstronaut.hire_date ? new Date(selectedAstronaut.hire_date).toLocaleDateString() : "-"}
                  </div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a" }}>
                  <div style={S.label}>Horas Vuelo / EVA</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", marginTop: "8px", fontSize: "16px", color: "#fff" }}>
                    {selectedAstronaut.space_hours} <span style={{fontSize: "12px", color: "#64748b"}}>hrs</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* EDIT / CREATE FORM */
            <form id="astronaut-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={S.formGroup}>
                  <label style={S.label}>Nombres *</label>
                  <input required style={S.input} name="first_name" value={formData.first_name} onChange={handleInputChange} placeholder="Neil" />
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Apellidos *</label>
                  <input required style={S.input} name="last_name" value={formData.last_name} onChange={handleInputChange} placeholder="Armstrong" />
                </div>
              </div>

              <div style={S.formGroup}>
                <label style={S.label}>Especialidad</label>
                <input style={S.input} name="specialty" value={formData.specialty} onChange={handleInputChange} placeholder="Comandante, Piloto, Ingeniero..." />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={S.formGroup}>
                  <label style={S.label}>Nacionalidad</label>
                  <input style={S.input} name="nationality" value={formData.nationality} onChange={handleInputChange} placeholder="EEUU, Japón, ESA..." />
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Fecha Contratación</label>
                  <input type="date" style={S.input} name="hire_date" value={formData.hire_date} onChange={handleInputChange} />
                </div>
              </div>

              <div style={S.formGroup}>
                <label style={S.label}>Email Misión (Opcional)</label>
                <input type="email" style={S.input} name="email" value={formData.email} onChange={handleInputChange} placeholder="n.armstrong@space.com" />
              </div>

              <div style={S.formGroup}>
                <label style={S.label}>Horas de Vuelo Acumuladas</label>
                <input type="number" style={S.input} name="space_hours" value={formData.space_hours} onChange={handleInputChange} min="0" />
              </div>

            </form>
          )}
        </div>

        <div style={S.panelFooter}>
          {selectedAstronaut && !isEditing && (
            <>
              <button type="button" style={{...S.buttonDanger, marginRight: "auto"}} onClick={handleDelete}>Baja de Personal</button>
              <button type="button" style={S.buttonSecondary} onClick={() => setIsEditing(true)}>Actualizar Datos</button>
            </>
          )}
          {isEditing && (
            <>
              <button type="button" style={S.buttonSecondary} onClick={() => selectedAstronaut ? setIsEditing(false) : closePanel()}>
                Cancelar
              </button>
              <button form="astronaut-form" type="submit" style={S.button}>
                Guardar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
