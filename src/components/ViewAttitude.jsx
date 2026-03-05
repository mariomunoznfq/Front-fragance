import React, { useState } from 'react';

function ViewAttitude({ onNext, onBack, userData, setUserData }) {
  // Leemos si ya había elegido algo antes (por si le da al botón "Atrás")
  const [selected, setSelected] = useState(
    userData.attitude && userData.attitude.length > 20 ? 'IA TEXT' : (userData.attitude || null)
  );
  // Guardamos el texto libre del usuario
  const [customText, setCustomText] = useState(
    userData.attitude && userData.attitude.length > 20 ? userData.attitude : ''
  );

  // Las 6 actitudes de tu contrato API + la opción IA
  const actitudes = [
    { id: 7, icon: '🤖', title: 'IA TEXT', desc: 'Escribe cómo te sientes y la IA decidirá.' },
    { id: 2, icon: '🧘', title: 'RELAJACION', desc: 'Calma, paz y fluidez.' },
    { id: 3, icon: '✨', title: 'SOFISTICACION', desc: 'Elegancia en cada detalle.' },
    { id: 4, icon: '🔥', title: 'ATREVIMIENTO', desc: 'Rompiendo las reglas.' },
    { id: 5, icon: '😉', title: 'COQUETERIA', desc: 'Seducción y magnetismo.' },
    { id: 6, icon: '⚡', title: 'ENERGIA', desc: 'Vitalidad pura y movimiento.' },
    { id: 1, icon: '🛡️', title: 'SEGURIDAD', desc: 'Confianza y paso firme.' },
  ];

  const handleSelect = (title) => {
    setSelected(title);
    if (title !== 'IA TEXT') {
      setCustomText(''); // Limpiamos el texto si elige una predefinida
    }
  };

  const handleNext = () => {
    // Si eligió IA TEXT, guardamos su parrafada. Si no, guardamos el título de la pastilla.
    const finalAttitude = selected === 'IA TEXT' ? customText : selected.toLowerCase();
    
    setUserData(prev => ({ ...prev, attitude: finalAttitude }));
    onNext();
  };

  // Bloqueamos el botón "Siguiente" si no ha elegido nada, o si eligió IA pero no ha escrito nada
  const isNextDisabled = !selected || (selected === 'IA TEXT' && customText.trim().length < 5);

  return (
    <main className="view-ethereal fade-in" style={{ background: 'linear-gradient(180deg, #050510 0%, #100520 100%)' }}>
      
      <div className="flare flare-1" style={{ background: 'rgba(0, 255, 255, 0.15)', top: '-10%', left: '10%' }}></div>
      <div className="flare flare-4" style={{ background: 'rgba(128, 0, 255, 0.2)', bottom: '-15%', right: '5%' }}></div>

      <header className="header-dark">
        <div className="logo-text"><strong>IN</strong> ESSENCE AI</div>
        <button className="btn-icon" onClick={onBack}>✕</button>
      </header>

      <div className="progress-tabs">
        <div className="tab active" style={{ borderColor: 'var(--cyan-glow)', color: 'var(--cyan-glow)' }}>ACTITUD</div>
        <div className="tab">PLAN</div>
        <div className="tab">LOOK</div>
      </div>

      <div className="question-header">
        <h2>¿CUÁL ES TU <span className="text-glow">VIBRA</span>?</h2>
        <p>Define tu estado de ánimo de hoy.</p>
      </div>

      <div className="options-cloud scrollable">
        {actitudes.map((item) => (
          <div key={item.id} style={{ width: '100%' }}>
            <button 
              className={`glass-pill pill-row ${selected === item.title ? 'selected' : ''}`}
              onClick={() => handleSelect(item.title)}
              style={selected === item.title ? { borderColor: 'var(--cyan-glow)', boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)' } : {}}
            >
              <span className="pill-icon">{item.icon}</span>
              <div className="pill-text-group">
                <span className="pill-title">{item.title}</span>
                <span className="pill-desc">{item.desc}</span>
              </div>
            </button>

            {/* Si el usuario pincha en IA TEXT, desplegamos la caja de texto justo debajo */}
            {selected === 'IA TEXT' && item.title === 'IA TEXT' && (
              <div className="custom-input-card">
                <textarea 
                  placeholder="Ej: Hoy me siento con ganas de relajarme y leer un libro en el sofá..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  autoFocus
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <footer className="footer-dark footer-double">
        <button className="btn-text btn-secondary" onClick={onBack}>ATRÁS</button>
        <button 
          className={`btn-text ${!isNextDisabled ? 'active' : ''}`} 
          style={!isNextDisabled ? { background: 'var(--cyan-glow)', color: '#000', boxShadow: '0 0 20px var(--cyan-glow)' } : { opacity: 0.5 }}
          onClick={!isNextDisabled ? handleNext : null}
          disabled={isNextDisabled}
        >
          SIGUIENTE
        </button>
      </footer>
    </main>
  );
}

export default ViewAttitude;