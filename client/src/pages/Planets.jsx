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
    background: "linear-gradient(to right, #10b981, #34d399)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  button: {
    background: "#10b981",
    color: "#020a18",
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
  badge: (active) => ({
    padding: "4px 8px",
    borderRadius: "999px",
    fontSize: "11px",
    fontFamily: "'Space Mono', monospace",
    background: active ? "rgba(16, 185, 129, 0.1)" : "rgba(148, 163, 184, 0.1)",
    color: active ? "#10b981" : "#94a3b8",
    border: `1px solid ${active ? "rgba(16, 185, 129, 0.2)" : "rgba(148, 163, 184, 0.2)"}`,
  }),
  
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

export default function Planets() {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Panel State
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    type: "planet",
    distance_au: "",
    diameter_km: "",
    has_atmosphere: false,
    description: "",
  });

  const fetchPlanets = () => {
    setLoading(true);
    api.get("/planets")
      .then((res) => {
        setPlanets(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPlanets();
  }, []);

  const openNewPanel = () => {
    setFormData({
      name: "",
      type: "planet",
      distance_au: "",
      diameter_km: "",
      has_atmosphere: false,
      description: "",
    });
    setSelectedPlanet(null);
    setIsEditing(true);
    setIsPanelOpen(true);
  };

  const openEditPanel = (planet) => {
    if(!planet) return;
    setFormData({
      name: planet.name || "",
      type: planet.type || "planet",
      distance_au: planet.distance_au || "",
      diameter_km: planet.diameter_km || "",
      has_atmosphere: planet.has_atmosphere || false,
      description: planet.description || "",
    });
    setSelectedPlanet(planet);
    setIsEditing(false); // default to view mode
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => {
      setSelectedPlanet(null);
      setIsEditing(false);
    }, 300); // Wait for transition
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPlanet && isEditing) {
        // Update
        await api.put(`/planets/${selectedPlanet.planet_id}`, formData);
      } else {
        // Create
        await api.post("/planets", formData);
      }
      fetchPlanets();
      closePanel();
    } catch (err) {
      alert("Error guardando el planeta: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`¿Estás seguro de eliminar a ${selectedPlanet.name}?`)) return;
    
    try {
      await api.delete(`/planets/${selectedPlanet.planet_id}`);
      fetchPlanets();
      closePanel();
    } catch (err) {
      alert("No se puede eliminar: " + (err.response?.data?.message || err.message));
    }
  };

  // --- Render ---

  if (loading && planets.length === 0) {
    return <div style={{...S.root, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Cargando Sistema Solar...</div>;
  }

  if (error) {
    return <div style={{...S.root, color: '#ef4444'}}>Error: {error}</div>;
  }

  return (
    <div style={S.root}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Exploración Planetaria</h1>
          <p style={{ color: "#94a3b8", marginTop: "8px" }}>Gestiona los mundos descubiertos y su información atmosférica.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '6px 16px', borderRadius: '12px', border: '1px solid #1a2d4a', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Dashboard</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/ships" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='#f59e0b'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>Naves</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/astronauts" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='#6366f1'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>Astronautas</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/missions" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='#e11d48'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>Misiones</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/experiments" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='#0284c7'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>Ciencia</Link>
        </div>
        <button 
          style={S.button}
          onMouseEnter={(e) => e.target.style.background = "#059669"}
          onMouseLeave={(e) => e.target.style.background = "#10b981"}
          onClick={openNewPanel}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Nuevo Planeta
        </button>
      </div>

      {/* Table */}
      <div style={S.tableWrapper}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>ID</th>
              <th style={S.th}>Nombre</th>
              <th style={S.th}>Tipo</th>
              <th style={S.th}>Distancia (AU)</th>
              <th style={S.th}>Atmósfera</th>
            </tr>
          </thead>
          <tbody>
            {planets.map(p => (
              <tr 
                key={p.planet_id} 
                style={S.trHover}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                onClick={() => openEditPanel(p)}
              >
                <td style={{...S.td, fontFamily: "'Space Mono', monospace", color: "#64748b"}}>#{p.planet_id}</td>
                <td style={{...S.td, fontWeight: 600}}>{p.name}</td>
                <td style={S.td}>
                  <span style={S.badge(p.type === 'planet')}>
                    {p.type.toUpperCase()}
                  </span>
                </td>
                <td style={{...S.td, fontFamily: "'Space Mono', monospace"}}>{p.distance_au}</td>
                <td style={S.td}>
                  {p.has_atmosphere 
                    ? <span style={{ color: "#10b981" }}>Sí</span> 
                    : <span style={{ color: "#94a3b8" }}>No</span>}
                </td>
              </tr>
            ))}
            {planets.length === 0 && (
              <tr>
                <td colSpan="5" style={{...S.td, textAlign: "center", color: "#64748b", padding: "40px"}}>
                  No hay planetas registrados. Inicia la colonización añadiendo uno.
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
            {selectedPlanet ? (isEditing ? "Editar Planeta" : "Detalles del Planeta") : "Nuevo Registro Planetario"}
          </h2>
          <button style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }} onClick={closePanel}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div style={S.panelBody}>
          {(!isEditing && selectedPlanet) ? (
            /* VIEW MODE */
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ fontSize: "48px", textAlign: "center", padding: "20px 0", background: "rgba(16, 185, 129, 0.05)", borderRadius: "12px", border: "1px dashed rgba(16, 185, 129, 0.2)"}}>
                🪐
              </div>
              
              <div>
                <div style={S.label}>Nombre</div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#fff", marginTop: "4px" }}>{selectedPlanet.name}</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a" }}>
                  <div style={S.label}>Tipo</div>
                  <div style={{ fontWeight: 600, marginTop: "8px" }}>{selectedPlanet.type}</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a" }}>
                  <div style={S.label}>Atmósfera</div>
                  <div style={{ fontWeight: 600, marginTop: "8px", color: selectedPlanet.has_atmosphere ? "#10b981" : "#94a3b8" }}>
                    {selectedPlanet.has_atmosphere ? "Desarrollada" : "Inexistente"}
                  </div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a" }}>
                  <div style={S.label}>Distancia al Sol (AU)</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", marginTop: "8px" }}>{selectedPlanet.distance_au}</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a" }}>
                  <div style={S.label}>Diámetro (km)</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", marginTop: "8px" }}>{selectedPlanet.diameter_km}</div>
                </div>
              </div>

              <div>
                <div style={S.label}>Descripción</div>
                <p style={{ marginTop: "8px", color: "#cbd5e1", lineHeight: 1.6 }}>{selectedPlanet.description || "Sin información topográfica aún."}</p>
              </div>
            </div>
          ) : (
            /* EDIT / CREATE FORM */
            <form id="planet-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={S.formGroup}>
                <label style={S.label}>Nombre del Planeta *</label>
                <input required style={S.input} name="name" value={formData.name} onChange={handleInputChange} placeholder="Ej. Kepler-22b" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={S.formGroup}>
                  <label style={S.label}>Tipo *</label>
                  <select required style={S.input} name="type" value={formData.type} onChange={handleInputChange}>
                    <option value="planet">Planeta</option>
                    <option value="dwarf">Planeta Enano</option>
                    <option value="moon">Luna</option>
                    <option value="exoplanet">Exoplaneta</option>
                  </select>
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Distancia (AU)</label>
                  <input type="number" step="0.0001" style={S.input} name="distance_au" value={formData.distance_au} onChange={handleInputChange} placeholder="0.0000" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={S.formGroup}>
                  <label style={S.label}>Diámetro (km)</label>
                  <input type="number" style={S.input} name="diameter_km" value={formData.diameter_km} onChange={handleInputChange} placeholder="12742" />
                </div>
                
                <div style={{ ...S.formGroup, justifyContent: "center" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginTop: "16px" }}>
                    <input 
                      type="checkbox" 
                      name="has_atmosphere" 
                      checked={formData.has_atmosphere} 
                      onChange={handleInputChange} 
                      style={{ width: "20px", height: "20px", accentColor: "#10b981", cursor: "pointer" }}
                    />
                    <span style={{ color: "#e2e8f0", fontWeight: 600 }}>¿Tiene Atmósfera?</span>
                  </label>
                </div>
              </div>

              <div style={S.formGroup}>
                <label style={S.label}>Descripción y Características</label>
                <textarea style={S.textarea} name="description" value={formData.description} onChange={handleInputChange} placeholder="Información sobre relieve, clima, etc..." />
              </div>
            </form>
          )}
        </div>

        <div style={S.panelFooter}>
          {selectedPlanet && !isEditing && (
            <>
              <button type="button" style={{...S.buttonDanger, marginRight: "auto"}} onClick={handleDelete}>Eliminar</button>
              <button type="button" style={S.buttonSecondary} onClick={() => setIsEditing(true)}>Editar Datos</button>
            </>
          )}
          {isEditing && (
            <>
              <button type="button" style={S.buttonSecondary} onClick={() => selectedPlanet ? setIsEditing(false) : closePanel()}>
                Cancelar
              </button>
              <button form="planet-form" type="submit" style={S.button}>
                Guardar Planeta
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
