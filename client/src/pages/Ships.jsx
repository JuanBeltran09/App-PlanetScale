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
    background: "linear-gradient(to right, #f59e0b, #fbbf24)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  button: {
    background: "#f59e0b",
    color: "#000",
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
    if(status === 'active') colorObj = { bg: "rgba(16,185,129,0.1)", text: "#10b981", border: "rgba(16,185,129,0.2)" };
    if(status === 'maintenance') colorObj = { bg: "rgba(245,158,11,0.1)", text: "#f59e0b", border: "rgba(245,158,11,0.2)" };
    if(status === 'retired') colorObj = { bg: "rgba(239,68,68,0.1)", text: "#ef4444", border: "rgba(239,68,68,0.2)" };
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

export default function Ships() {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Panel State
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedShip, setSelectedShip] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    crew_capacity: 1,
    max_speed_km_s: "",
    manufacture_year: "",
    status: "active",
  });

  const fetchShips = () => {
    setLoading(true);
    api.get("/ships")
      .then((res) => {
        setShips(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchShips();
  }, []);

  const openNewPanel = () => {
    setFormData({
      name: "",
      model: "",
      crew_capacity: 1,
      max_speed_km_s: "",
      manufacture_year: "",
      status: "active",
    });
    setSelectedShip(null);
    setIsEditing(true);
    setIsPanelOpen(true);
  };

  const openEditPanel = (ship) => {
    if(!ship) return;
    setFormData({
      name: ship.name || "",
      model: ship.model || "",
      crew_capacity: ship.crew_capacity || 1,
      max_speed_km_s: ship.max_speed_km_s || "",
      manufacture_year: ship.manufacture_year || "",
      status: ship.status || "active",
    });
    setSelectedShip(ship);
    setIsEditing(false);
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => {
      setSelectedShip(null);
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
      if (selectedShip && isEditing) {
        await api.put(`/ships/${selectedShip.ship_id}`, formData);
      } else {
        await api.post("/ships", formData);
      }
      fetchShips();
      closePanel();
    } catch (err) {
      alert("Error guardando el registro de nave: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`¿Proceder al desguace y eliminación de la nave ${selectedShip.name}?`)) return;
    try {
      await api.delete(`/ships/${selectedShip.ship_id}`);
      fetchShips();
      closePanel();
    } catch (err) {
      alert("No se puede eliminar: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading && ships.length === 0) {
    return <div style={{...S.root, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Activando radar perimetral...</div>;
  }

  if (error) {
    return <div style={{...S.root, color: '#ef4444'}}>Error: {error}</div>;
  }

  return (
    <div style={S.root}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Flota Espacial</h1>
          <p style={{ color: "#94a3b8", marginTop: "8px" }}>Inventario y estado de las naves operativas y retiradas de la agencia.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '6px 16px', borderRadius: '12px', border: '1px solid #1a2d4a', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Dashboard</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/planets" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='#10b981'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>Planetas</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/astronauts" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='#6366f1'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>Astronautas</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/missions" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='#e11d48'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>Misiones</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/experiments" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.target.style.color='#0284c7'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>Ciencia</Link>
        </div>
        <button 
          style={S.button}
          onMouseEnter={(e) => e.target.style.background = "#d97706"}
          onMouseLeave={(e) => e.target.style.background = "#f59e0b"}
          onClick={openNewPanel}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Registrar Nave
        </button>
      </div>

      {/* Table */}
      <div style={S.tableWrapper}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Folio</th>
              <th style={S.th}>Identificador (Nombre)</th>
              <th style={S.th}>Modelo</th>
              <th style={S.th}>Capacidad / Año</th>
              <th style={S.th}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {ships.map(s => (
              <tr 
                key={s.ship_id} 
                style={S.trHover}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                onClick={() => openEditPanel(s)}
              >
                <td style={{...S.td, fontFamily: "'Space Mono', monospace", color: "#64748b"}}>SH-{s.ship_id}</td>
                <td style={{...S.td, fontWeight: 600}}>{s.name}</td>
                <td style={S.td}>{s.model || '-'}</td>
                <td style={{...S.td, fontFamily: "'Space Mono', monospace", color: "#94a3b8"}}>
                  {s.crew_capacity} Pax <br/>
                  <span style={{fontSize: 10}}>{s.manufacture_year || 'Unknown'}</span>
                </td>
                <td style={S.td}>
                  <span style={S.badge(s.status)}>
                    {s.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
            {ships.length === 0 && (
              <tr>
                <td colSpan="5" style={{...S.td, textAlign: "center", color: "#64748b", padding: "40px"}}>
                  El hangar está completamente vacío.
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
            {selectedShip ? (isEditing ? "Reconfigurar Parámetros" : "Esquemático de la Nave") : "Añadir al Hangar"}
          </h2>
          <button style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }} onClick={closePanel}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div style={S.panelBody}>
          {(!isEditing && selectedShip) ? (
            /* VIEW MODE */
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ fontSize: "48px", textAlign: "center", padding: "20px 0", background: "rgba(245, 158, 11, 0.05)", borderRadius: "12px", border: "1px dashed rgba(245, 158, 11, 0.2)"}}>
                🛸
              </div>
              
              <div>
                <div style={S.label}>Designación de Flota</div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#fff", marginTop: "4px" }}>
                  {selectedShip.name}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a" }}>
                  <div style={S.label}>Estado Actual</div>
                  <div style={{ marginTop: "12px" }}>
                     <span style={S.badge(selectedShip.status)}>{selectedShip.status.toUpperCase()}</span>
                  </div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a" }}>
                  <div style={S.label}>Modelo / Chasis</div>
                  <div style={{ fontWeight: 600, marginTop: "8px", color: "#fcd34d" }}>{selectedShip.model || "Genérico"}</div>
                </div>
                
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a" }}>
                  <div style={S.label}>Capacidad Tripulación</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", marginTop: "8px", fontSize: "16px" }}>
                    {selectedShip.crew_capacity} Pax
                  </div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a" }}>
                  <div style={S.label}>Velocidad Máx.</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", marginTop: "8px", fontSize: "16px" }}>
                    {selectedShip.max_speed_km_s} <span style={{fontSize: "12px", color:"#64748b"}}>km/s</span>
                  </div>
                </div>
                
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid #1a2d4a", gridColumn: "span 2" }}>
                  <div style={S.label}>Año de Manufacturación / Puesta en servicio</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", marginTop: "8px" }}>
                    {selectedShip.manufacture_year || "Sin dato"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* EDIT / CREATE FORM */
            <form id="ship-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={S.formGroup}>
                <label style={S.label}>Nombre de Identificación *</label>
                <input required style={S.input} name="name" value={formData.name} onChange={handleInputChange} placeholder="Ej. Apollo 11, USS Enterprise" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={S.formGroup}>
                  <label style={S.label}>Modelo / Clase</label>
                  <input style={S.input} name="model" value={formData.model} onChange={handleInputChange} placeholder="Clase Saturn" />
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Estado en Flota *</label>
                  <select required style={S.input} name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="active">Activa (En servicio)</option>
                    <option value="maintenance">Mantenimiento</option>
                    <option value="retired">Retirada / Desguace</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={S.formGroup}>
                  <label style={S.label}>Tamaño tripulación</label>
                  <input type="number" style={S.input} name="crew_capacity" min="0" value={formData.crew_capacity} onChange={handleInputChange} />
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Vel. Max (km/s)</label>
                  <input type="number" step="0.01" style={S.input} name="max_speed_km_s" value={formData.max_speed_km_s} onChange={handleInputChange} />
                </div>
              </div>

              <div style={S.formGroup}>
                <label style={S.label}>Año de Manufacturación</label>
                <input type="number" style={S.input} name="manufacture_year" value={formData.manufacture_year} onChange={handleInputChange} placeholder="2024" />
              </div>

            </form>
          )}
        </div>

        <div style={S.panelFooter}>
          {selectedShip && !isEditing && (
            <>
              <button type="button" style={{...S.buttonDanger, marginRight: "auto"}} onClick={handleDelete}>Desguazar (Borrar)</button>
              <button type="button" style={S.buttonSecondary} onClick={() => setIsEditing(true)}>Reconfigurar</button>
            </>
          )}
          {isEditing && (
            <>
              <button type="button" style={S.buttonSecondary} onClick={() => selectedShip ? setIsEditing(false) : closePanel()}>
                Cancelar
              </button>
              <button form="ship-form" type="submit" style={S.button}>
                Ejecutar Cambios
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
