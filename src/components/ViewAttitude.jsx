import React, { useState } from 'react';

function ViewAttitude({ onNext, onBack, userData, setUserData }) {
  const [selected, setSelected] = useState(
    userData.attitude && userData.attitude.length > 20 ? 'IA TEXT' : (userData.attitude || null)
  );
  const [customText, setCustomText] = useState(
    userData.attitude && userData.attitude.length > 20 ? userData.attitude : ''
  );

  const actitudes = [
    { id: 7, title: 'IA TEXT', desc: 'Escribe cómo te sientes y la IA decidirá.' },
    { id: 2, title: 'RELAJACION', desc: 'Calma, paz y fluidez.' },
    { id: 3, title: 'SOFISTICACION', desc: 'Elegancia en cada detalle.' },
    { id: 4, title: 'ATREVIMIENTO', desc: 'Rompiendo las reglas.' },
    { id: 5, title: 'COQUETERIA', desc: 'Seducción y magnetismo.' },
    { id: 6, title: 'ENERGIA', desc: 'Vitalidad pura y movimiento.' },
    { id: 1, title: 'SEGURIDAD', desc: 'Confianza y paso firme.' },
  ];

  const handleSelect = (title) => {
    setSelected(title);
    if (title !== 'IA TEXT') {
      setCustomText(''); 
    }
  };

  const handleNext = () => {
    const finalAttitude = selected === 'IA TEXT' ? customText : selected.toLowerCase();
    setUserData(prev => ({ ...prev, attitude: finalAttitude }));
    onNext();
  };

  // AQUÍ ESTÁ EL PRIMER CAMBIO: Validamos que tenga entre 3 y 100 caracteres
  const isNextDisabled = !selected || (selected === 'IA TEXT' && (customText.trim().length < 3 || customText.trim().length > 100));

  return (
    <main className="zara-view-analysis fade-in">
      
      {/* Header Limpio */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div className="zara-logo" style={{ fontSize: '1.2rem' }}><strong>IN</strong> ESSENCE AI</div>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#000' }}>✕</button>
      </header>

      {/* Pestañas de progreso: Ahora ACTITUD es la activa */}
      <div className="zara-tabs">
        <div className="zara-tab active">Actitud</div>
        <div className="zara-tab">Plan</div>
        <div className="zara-tab">Look</div>
      </div>

      {/* Título de la sección */}
      <div className="zara-title-container">
        <h2 className="zara-title">¿Cuál es tu vibra?</h2>
        <p className="zara-subtitle">Define tu estado de ánimo de hoy.</p>
      </div>

      {/* Lista de opciones (Estilo Grid de Zara) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
        <div className="zara-grid">
          {actitudes.map((item) => (
            <div key={item.id} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              
              <button 
                className={`zara-card ${selected === item.title ? 'selected' : ''}`}
                onClick={() => handleSelect(item.title)}
              >
                <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '0.9rem', letterSpacing: '1px', marginBottom: '4px' }}>{item.title}</div>
                  <div className="zara-card-desc">{item.desc}</div>
                </div>
              </button>

              {/* TARJETA IA: Textarea limpio, cuadrado y minimalista */}
              {selected === 'IA TEXT' && item.title === 'IA TEXT' && (
                <div className="fade-in" style={{
                  marginTop: '-1px', // Para que se pegue al botón de arriba
                  border: '1px solid #000000',
                  borderTop: 'none',
                  backgroundColor: '#f9f9f9',
                  padding: '15px',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <textarea 
                    placeholder="Ej: Hoy me siento con ganas de relajarme y leer un libro en el sofá..."
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    autoFocus
                    // AQUÍ ESTÁ EL SEGUNDO CAMBIO: Límites en el input
                    minLength={3}
                    maxLength={100}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      color: '#000000',
                      outline: 'none',
                      resize: 'none',
                      height: '60px',
                      fontSize: '0.8rem',
                      fontFamily: 'inherit',
                      letterSpacing: '1px'
                    }}
                  />
                </div>
              )}

            </div>
          ))}
        </div>
      </div>

      {/* Footer / Botones de Acción */}
      <footer className="zara-footer-analysis">
        <button className="zara-btn-back" onClick={onBack}>
          ATRÁS
        </button>
        <button 
          className="zara-btn-next" 
          onClick={handleNext}
          disabled={isNextDisabled}
        >
          SIGUIENTE
        </button>
      </footer>
    </main>
  );
}

export default ViewAttitude;