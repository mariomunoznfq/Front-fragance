import React, { useState, useEffect } from 'react';

// EL "RASCADOR" DE COOKIES
const getCookie = (nombreCookie) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${nombreCookie}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

function ViewResult({ userData, onReset }) {
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [perfumes, setPerfumes] = useState([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Rascamos el nombre si existe
    const nombreRascado = getCookie('nombreUsuario'); 
    if (nombreRascado) {
      setUserName(decodeURIComponent(nombreRascado));
    }

    if (userData.fraganceData && Array.isArray(userData.fraganceData)) {
      setPerfumes(userData.fraganceData);
    } else {
      console.warn("No se encontraron datos de fragancias en userData.");
    }
  }, [userData]);
  

  // --- VISTA A: DETALLE DE LA COLONIA ---
  if (selectedPerfume) {
    return (
      <main className="view-ethereal reveal-magic" style={{ background: '#000', textAlign: 'center' }}>
        <header className="header-dark">
          <button className="btn-icon" onClick={() => setSelectedPerfume(null)}>←</button>
          <div className="logo-text">DETALLE</div>
        </header>
        
        <div className="options-cloud scrollable" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {selectedPerfume.Image ? (
            <img 
              src={selectedPerfume.Image} 
              style={{ width: '100%', maxWidth: '300px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,255,255,0.2)' }} 
              alt={selectedPerfume.NameProduct}
            />
          ) : (
             <div style={{ width: '100%', maxWidth: '300px', height: '400px', borderRadius: '20px', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
               Imagen no disponible
             </div>
          )}
          
          <h2 style={{ color: 'white', marginTop: '20px', fontSize: '2rem' }}>{selectedPerfume.NameProduct || 'Sin Nombre'}</h2>
          <p style={{ color: 'var(--cyan-glow)', fontWeight: 'bold' }}>{selectedPerfume.Category || 'Esencia Única'}</p>
          <p style={{ color: 'white', opacity: 0.8, marginTop: '15px', maxWidth: '300px' }}>
            {selectedPerfume.Description || 'No hay descripción disponible para esta fragancia.'}
          </p>
          
          {/* ✅ MAGIA AQUÍ: El botón ahora abre el enlace en una pestaña nueva */}
          <button 
            className="btn-text active" 
            style={{ marginTop: '30px', width: '100%', maxWidth: '300px' }}
            onClick={() => {
              if (selectedPerfume.ProductLink) {
                window.open(selectedPerfume.ProductLink, '_blank');
              } else {
                alert("El enlace a la tienda no está disponible para este perfume.");
              }
            }}
          >
            LO QUIERO
          </button>

        </div>
      </main>
    );
  }

  // --- VISTA B: LISTADO INICIAL DE LAS 3 ---
  return (
    <main className="view-ethereal fade-in" style={{ background: 'linear-gradient(180deg, #050510 0%, #000 100%)' }}>
      <header className="header-dark">
        <div className="logo-text"><strong>IN</strong> ESSENCE AI</div>
      </header>

      <div className="question-header">
        <h2>TUS <span className="text-glow">FRAGANCIAS</span></h2>
        <p>Seleccionadas para {userName || userData.name || 'ti'}.</p>
      </div>

      <div className="options-cloud scrollable" style={{ padding: '10px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {perfumes.length === 0 ? (
           <div style={{ textAlign: 'center', color: 'white', marginTop: '50px' }}>
              <p>Esperando resultados de la IA...</p>
           </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '20px',
            maxWidth: '600px', 
            width: '100%', 
            margin: '0 auto'
          }}>
            {perfumes.map((p, index) => (
              <div key={index} onClick={() => setSelectedPerfume(p)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                {p.Image ? (
                   <img 
                    src={p.Image} 
                    style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }} 
                    alt={p.NameProduct}
                  />
                ) : (
                  <div style={{ width: '100%', aspectRatio: '3/4', background: '#333', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem' }}>
                      Sin Foto
                  </div>
                )}
                <h4 style={{ color: 'white', fontSize: '0.8rem', marginTop: '10px' }}>{p.NameProduct || 'Fragancia'}</h4>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="footer-dark" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <button className="btn-ghost" onClick={onReset} style={{ color: '#fff', borderColor: '#fff' }}>
          REPETIR TEST
        </button>
      </footer>
    </main>
  );
}

export default ViewResult;