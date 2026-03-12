import React, { useState, useEffect } from 'react';

// EL "RASCADOR" DE COOKIES (Intacto)
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
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const nombreRascado = getCookie('nombreUsuario'); 
    if (nombreRascado) {
      setUserName(decodeURIComponent(nombreRascado));
    }

    if (userData.fraganceData && Array.isArray(userData.fraganceData)) {
      
      // 🔥 AQUÍ ESTÁ LA MAGIA: Limpiamos los duplicados usando el nombre del producto
      const fraganciasUnicas = userData.fraganceData.filter((perfume, index, arrayOriginal) => 
        index === arrayOriginal.findIndex((p) => p.NameProduct === perfume.NameProduct)
      );

      // Ahora ordenamos la lista que ya está limpia de duplicados
      const sortedPerfumes = [...fraganciasUnicas].sort((a, b) => {
        const getPorcentaje = (moodString) => {
          if (!moodString) return 0;
          const numero = parseInt(moodString.replace(/\D/g, ''), 10);
          return isNaN(numero) ? 0 : numero;
        };
        return getPorcentaje(b.Mood) - getPorcentaje(a.Mood);
      });
      
      setPerfumes(sortedPerfumes);
      
    } else {
      console.warn("No se encontraron datos de fragancias en userData.");
    }
  }, [userData]);
  
  // --- VISTA A: DETALLE DE LA COLONIA (Estilo Editorial) ---
  if (selectedPerfume) {
    return (
      <main className="zara-view-analysis fade-in" style={{ backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <button onClick={() => setSelectedPerfume(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#000' }}>←</button>
          <div className="zara-logo" style={{ fontSize: '1.2rem' }}><strong>IN</strong> ESSENCE AI</div>
        </header>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          
          <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '400px' }}>
            {selectedPerfume.Image ? (
              <img 
                src={selectedPerfume.Image} 
                style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }} 
                alt={selectedPerfume.NameProduct}
              />
            ) : (
               <div style={{ width: '100%', aspectRatio: '3/4', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#757575', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>
                 Sin Imagen
               </div>
            )}

            {/* Etiqueta de Porcentaje Zara Style (Cuadrada, blanca y negra) */}
            {selectedPerfume.Mood && (
              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                background: '#ffffff',
                color: '#000000',
                padding: '10px 15px',
                fontWeight: '500',
                fontSize: '0.9rem',
                border: '1px solid #000000',
                letterSpacing: '1px',
                zIndex: 10
              }}>
                {selectedPerfume.Mood} MATCH
              </div>
            )}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '40px', width: '100%' }}>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', fontWeight: '400', margin: '0 0 10px 0', textTransform: 'uppercase' }}>
              {selectedPerfume.NameProduct || 'Sin Nombre'}
            </h2>
            <p style={{ color: '#757575', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', margin: '0 0 20px 0' }}>
              {selectedPerfume.Category || 'Esencia Única'}
            </p>
            <p style={{ color: '#333333', lineHeight: '1.6', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto 40px auto' }}>
              {selectedPerfume.Description || 'No hay descripción disponible para esta fragancia.'}
            </p>
          </div>
          
          <button 
            className="zara-btn-next" 
            style={{ width: '100%', maxWidth: '400px', marginBottom: '40px' }}
            onClick={() => {
              if (selectedPerfume.ProductLink) {
                window.open(selectedPerfume.ProductLink, '_blank');
              } else {
                alert("El enlace a la tienda no está disponible para este perfume.");
              }
            }}
          >
            AÑADIR A LA CESTA
          </button>

        </div>
      </main>
    );
  }

  // --- VISTA B: LISTADO INICIAL (Estilo Colección) ---
  const displayedPerfumes = showMore ? perfumes.slice(0, 6) : perfumes.slice(0, 3);

  return (
    <main className="zara-view-analysis fade-in" style={{ backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <header style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '40px', paddingTop: '20px' }}>
        <div className="zara-logo" style={{ fontSize: '1.2rem' }}><strong>IN</strong> ESSENCE AI</div>
      </header>

      <div className="zara-title-container" style={{ marginBottom: '50px' }}>
        <h2 className="zara-title" style={{ fontSize: '2rem' }}>TU SELECCIÓN</h2>
        <p className="zara-subtitle" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
          Curada para {userName || userData.name || 'ti'}.
        </p>
      </div>

      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {perfumes.length === 0 ? (
           <div style={{ textAlign: 'center', color: '#757575', marginTop: '50px', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem' }}>
              <p>Esperando resultados...</p>
           </div>
        ) : (
          <>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', 
              gap: '2px', // Gap minúsculo para dar un efecto de revista de moda
              maxWidth: '800px', 
              width: '100%', 
              margin: '0 auto'
            }}>
              {displayedPerfumes.map((p, index) => (
                <div key={index} onClick={() => setSelectedPerfume(p)} style={{ cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="fade-in">
                  
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', backgroundColor: '#f5f5f5', overflow: 'hidden' }}>
                    
                    {/* Etiqueta flotante muy discreta */}
                    {p.Mood && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(255,255,255,0.9)',
                        color: '#000',
                        fontSize: '0.65rem',
                        fontWeight: '500',
                        padding: '4px 6px',
                        letterSpacing: '1px',
                        border: '1px solid #e5e5e5',
                        zIndex: 5
                      }}>
                        {p.Mood}
                      </div>
                    )}

                    {p.Image ? (
                       <img 
                        src={p.Image} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                        alt={p.NameProduct}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0a0a0', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          Sin Foto
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '15px 5px', width: '100%' }}>
                    <h4 style={{ 
                      color: '#000000', 
                      fontSize: '0.75rem', 
                      margin: '0',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      wordBreak: 'break-word', 
                      overflowWrap: 'anywhere'
                    }}>
                      {p.NameProduct || 'Fragancia'}
                    </h4>
                  </div>
                </div>
              ))}
            </div>

            {/* BOTÓN VER MÁS / VER MENOS */}
            {perfumes.length > 3 && (
              <button 
                className="zara-btn-back fade-in" 
                onClick={() => setShowMore(!showMore)} 
                style={{ 
                  marginTop: '40px', 
                  borderBottom: '1px solid #000',
                  padding: '5px 0',
                  color: '#000',
                  fontWeight: '500'
                }}
              >
                {showMore ? 'VER MENOS' : 'VER MÁS'}
              </button>
            )}
          </>
        )}
      </div>

      <footer style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '60px', paddingBottom: '40px' }}>
        <button 
          onClick={onReset} 
          style={{ 
            background: 'transparent', 
            color: '#000000', 
            border: '1px solid #000000', 
            padding: '12px 24px', 
            textTransform: 'uppercase', 
            letterSpacing: '2px', 
            fontSize: '0.75rem', 
            cursor: 'pointer',
            borderRadius: '0'
          }}
        >
          Repetir Test
        </button>
      </footer>
    </main>
  );
}

export default ViewResult;