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
  
  // Controla si vemos solo 3 o todas las fragancias
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Rascamos el nombre si existe
    const nombreRascado = getCookie('nombreUsuario'); 
    if (nombreRascado) {
      setUserName(decodeURIComponent(nombreRascado));
    }

    if (userData.fraganceData && Array.isArray(userData.fraganceData)) {
      
      // 🔥 MAGIA DE ORDENACIÓN: De mayor a menor porcentaje
      const sortedPerfumes = [...userData.fraganceData].sort((a, b) => {
        // Función para extraer el número (ej: "95%" -> 95). Si falla o pone "Unknown", devuelve 0.
        const getPorcentaje = (moodString) => {
          if (!moodString) return 0;
          const numero = parseInt(moodString.replace(/\D/g, ''), 10);
          return isNaN(numero) ? 0 : numero;
        };

        // Ordenamos restando el B menos el A (para que sea descendente: de mayor a menor)
        return getPorcentaje(b.Mood) - getPorcentaje(a.Mood);
      });

      setPerfumes(sortedPerfumes);
      
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
          
          <div style={{ position: 'relative', display: 'inline-block' }}>
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

            {/* 🔥 ETIQUETA DE PORCENTAJE EN EL DETALLE */}
            {selectedPerfume.Mood && (
              <div style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                background: 'var(--cyan-glow)',
                color: '#000',
                padding: '8px 15px',
                borderRadius: '30px',
                fontWeight: 'bold',
                fontSize: '1rem',
                boxShadow: '0 0 20px var(--cyan-glow)',
                transform: 'rotate(5deg)',
                zIndex: 10
              }}>
                {selectedPerfume.Mood} Match ✨
              </div>
            )}
          </div>
          
          <h2 style={{ color: 'white', marginTop: '30px', fontSize: '2rem' }}>{selectedPerfume.NameProduct || 'Sin Nombre'}</h2>
          <p style={{ color: 'var(--cyan-glow)', fontWeight: 'bold' }}>{selectedPerfume.Category || 'Esencia Única'}</p>
          <p style={{ color: 'white', opacity: 0.8, marginTop: '15px', maxWidth: '300px' }}>
            {selectedPerfume.Description || 'No hay descripción disponible para esta fragancia.'}
          </p>
          
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

  // --- VISTA B: LISTADO INICIAL ---
  const displayedPerfumes = showAll ? perfumes : perfumes.slice(0, 3);

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
          <>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '20px',
              maxWidth: '600px', 
              width: '100%', 
              margin: '0 auto'
            }}>
              {displayedPerfumes.map((p, index) => (
                <div key={index} onClick={() => setSelectedPerfume(p)} style={{ cursor: 'pointer', textAlign: 'center' }} className="fade-in">
                  
                  {/* CAJA RELATIVA PARA PODER POSICIONAR LA ETIQUETA FLOTANTE */}
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4' }}>
                    
                    {/* 🔥 ETIQUETA DE PORCENTAJE EN LA TARJETA PEQUEÑA */}
                    {p.Mood && (
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: 'var(--cyan-glow)',
                        color: '#000',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        boxShadow: '0 0 10px var(--cyan-glow)',
                        zIndex: 5
                      }}>
                        {p.Mood}
                      </div>
                    )}

                    {p.Image ? (
                       <img 
                        src={p.Image} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }} 
                        alt={p.NameProduct}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#333', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem' }}>
                          Sin Foto
                      </div>
                    )}
                  </div>

                  <h4 style={{ color: 'white', fontSize: '0.8rem', marginTop: '10px' }}>{p.NameProduct || 'Fragancia'}</h4>
                </div>
              ))}
            </div>

            {/* BOTÓN VER MÁS */}
            {perfumes.length > 3 && !showAll && (
              <button 
                className="btn-ghost fade-in" 
                onClick={() => setShowAll(true)} 
                style={{ 
                  marginTop: '30px', 
                  color: 'var(--cyan-glow)', 
                  borderColor: 'rgba(0, 255, 255, 0.5)',
                  maxWidth: '200px',
                  padding: '10px 20px',
                  borderRadius: '30px'
                }}
              >
                VER MÁS OPCIONES
              </button>
            )}
          </>
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