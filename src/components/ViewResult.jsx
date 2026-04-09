import React, { useEffect, useState } from 'react';

// Helpers
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const parseMoodPercent = (moodString) => {
  if (!moodString) return 0;
  const n = parseInt(String(moodString).replace(/\D/g, ''), 10);
  return Number.isNaN(n) ? 0 : n;
};

const uniqueByName = (arr = []) =>
  arr.filter((item, i, a) => i === a.findIndex((x) => x.NameProduct === item.NameProduct));

const sortByMoodDesc = (arr = []) =>
  [...arr].sort((a, b) => parseMoodPercent(b.Mood) - parseMoodPercent(a.Mood));

function ViewResult({ userData = {}, onReset }) {
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [perfumes, setPerfumes] = useState([]);
  const [userName, setUserName] = useState('');
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const nameFromCookie = getCookie('nombreUsuario');
    if (nameFromCookie) setUserName(decodeURIComponent(nameFromCookie));

    const fraganceData = Array.isArray(userData.fraganceData)
      ? userData.fraganceData
      : [];

    if (fraganceData.length === 0) {
      console.warn('No se encontraron datos de fragancias en userData.');
      setPerfumes([]);
      return;
    }

    const unique = uniqueByName(fraganceData);
    const sorted = sortByMoodDesc(unique);
    setPerfumes(sorted);
  }, [userData]);

  // Mostrar detalle de una fragancia seleccionada
  if (selectedPerfume) {
    return (
      <main
        className="zara-view-analysis fade-in"
        style={{ backgroundColor: '#ffffff', color: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <button
            onClick={() => setSelectedPerfume(null)}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#000' }}
          >
            ←
          </button>
          <div className="zara-logo" style={{ fontSize: '1.2rem' }}><strong>IN</strong> ESSENCE AI</div>
        </header>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px', maxWidth: 800, margin: '0 auto', width: '100%' }}>
          <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: 400 }}>
            {selectedPerfume.Image ? (
              <img src={selectedPerfume.Image} style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }} alt={selectedPerfume.NameProduct} />
            ) : (
              <div style={{ width: '100%', aspectRatio: '3/4', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#757575', textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.8rem' }}>
                Sin Imagen
              </div>
            )}

            {selectedPerfume.Mood && (
              <div style={{ position: 'absolute', bottom: 20, right: 20, background: '#fff', color: '#000', padding: '10px 15px', fontWeight: 500, fontSize: '0.9rem', border: '1px solid #000', letterSpacing: 1, zIndex: 10 }}>
                {selectedPerfume.Mood} MATCH
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40, width: '100%' }}>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', fontWeight: 400, margin: '0 0 10px 0', textTransform: 'uppercase' }}>{selectedPerfume.NameProduct || 'Sin Nombre'}</h2>
            <p style={{ color: '#757575', textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.8rem', margin: '0 0 20px 0' }}>{selectedPerfume.Category || 'Esencia Única'}</p>
            <p style={{ color: '#333', lineHeight: 1.6, fontSize: '0.9rem', maxWidth: 500, margin: '0 auto 40px auto' }}>{selectedPerfume.Description || 'No hay descripción disponible para esta fragancia.'}</p>
          </div>

          <button
            className="zara-btn-next"
            style={{ width: '100%', maxWidth: 400, marginBottom: 40 }}
            onClick={() => {
              if (selectedPerfume.ProductLink) window.open(selectedPerfume.ProductLink, '_blank');
              else alert('El enlace a la tienda no está disponible para este perfume.');
            }}
          >
            AÑADIR A LA CESTA
          </button>
        </div>
      </main>
    );
  }

  // Listado inicial
  const displayedPerfumes = showMore ? perfumes.slice(0, 6) : perfumes.slice(0, 3);

  return (
    <main className="zara-view-analysis fade-in" style={{ backgroundColor: '#fff', color: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 40, paddingTop: 20 }}>
        <div className="zara-logo" style={{ fontSize: '1.2rem' }}><strong>IN</strong> ESSENCE AI</div>
      </header>

      <div className="zara-title-container" style={{ marginBottom: 50 }}>
        <h2 className="zara-title" style={{ fontSize: '2rem' }}>TU SELECCIÓN</h2>
        <p className="zara-subtitle" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Curada para {userName || userData.name || 'ti'}.</p>
      </div>

      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {perfumes.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#757575', marginTop: 50, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.8rem' }}>
            <p>Esperando resultados...</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 2, maxWidth: 800, width: '100%', margin: '0 auto' }}>
              {displayedPerfumes.map((p, i) => (
                <div key={i} onClick={() => setSelectedPerfume(p)} style={{ cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="fade-in">
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', backgroundColor: '#f5f5f5', overflow: 'hidden' }}>
                    {p.Mood && (
                      <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.9)', color: '#000', fontSize: '0.65rem', fontWeight: 500, padding: '4px 6px', letterSpacing: 1, border: '1px solid #e5e5e5', zIndex: 5 }}>{p.Mood}</div>
                    )}

                    {p.Image ? (
                      <img src={p.Image} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} alt={p.NameProduct} onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')} onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0a0a0', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>Sin Foto</div>
                    )}
                  </div>

                  <div style={{ padding: '15px 5px', width: '100%' }}>
                    <h4 style={{ color: '#000', fontSize: '0.75rem', margin: 0, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{p.NameProduct || 'Fragancia'}</h4>
                  </div>
                </div>
              ))}
            </div>

            {perfumes.length > 3 && (
              <button className="zara-btn-back fade-in" onClick={() => setShowMore(!showMore)} style={{ marginTop: 40, borderBottom: '1px solid #000', padding: '5px 0', color: '#000', fontWeight: 500 }}>{showMore ? 'VER MENOS' : 'VER MÁS'}</button>
            )}
          </>
        )}
      </div>

      <footer style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 60, paddingBottom: 40 }}>
        <button onClick={onReset} style={{ background: 'transparent', color: '#000', border: '1px solid #000', padding: '12px 24px', textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.75rem', cursor: 'pointer', borderRadius: 0 }}>Repetir Test</button>
      </footer>
    </main>
  );
}

export default ViewResult;