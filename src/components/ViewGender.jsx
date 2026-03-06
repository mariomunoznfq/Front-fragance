import React, { useState } from 'react';

function ViewGender({ onNext, onBack, userData, setUserData }) {
  // Leemos si ya había elegido algo antes
  const [selected, setSelected] = useState(userData.gender || null);

  const handleSelect = (genderValue) => {
    setSelected(genderValue);
    // Guardamos la elección en la "mochila"
    setUserData(prev => ({ ...prev, gender: genderValue }));
  };

  return (
    <main className="view-ethereal fade-in" style={{ background: 'linear-gradient(180deg, #050510 0%, #100520 100%)' }}>
      
      <div className="flare flare-1" style={{ background: 'rgba(0, 255, 255, 0.15)', top: '-10%', left: '10%' }}></div>
      <div className="flare flare-4" style={{ background: 'rgba(128, 0, 255, 0.2)', bottom: '-15%', right: '5%' }}></div>

      <header className="header-dark">
        <div className="logo-text"><strong>IN</strong> ESSENCE AI</div>
        <button className="btn-icon" onClick={onBack}>✕</button>
      </header>

      <div className="question-header" style={{ marginTop: '10px' }}>
        <h2>¿PARA <span className="text-glow" style={{ textShadow: '0 0 15px var(--cyan-glow)' }}>QUIÉN</span> ES?</h2>
        <p>Para afinar la precisión de la IA.</p>
      </div>

      <div className="options-cloud scrollable">
        {/* BOTÓN MEN */}
        <button 
          className={`glass-pill pill-row ${selected === 'MAN' ? 'selected' : ''}`}
          onClick={() => handleSelect('MAN')}
          style={selected === 'MAN' ? { borderColor: 'var(--cyan-glow)', boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)' } : {}}
        >
          <span className="pill-icon">♂️</span>
          <div className="pill-text-group" style={{ textAlign: 'left' }}>
            <span className="pill-title">MAN</span>
          </div>
        </button>

        {/* BOTÓN WOMAN */}
        <button 
          className={`glass-pill pill-row ${selected === 'WOMAN' ? 'selected' : ''}`}
          onClick={() => handleSelect('WOMAN')}
          style={selected === 'WOMAN' ? { borderColor: 'var(--cyan-glow)', boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)' } : {}}
        >
          <span className="pill-icon">♀️</span>
          <div className="pill-text-group" style={{ textAlign: 'left' }}>
            <span className="pill-title">WOMAN</span>
          </div>
        </button>

        {/* BOTÓN BOYS */}
        <button 
          className={`glass-pill pill-row ${selected === 'BOYS' ? 'selected' : ''}`}
          onClick={() => handleSelect('BOYS')}
          style={selected === 'BOYS' ? { borderColor: 'var(--cyan-glow)', boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)' } : {}}
        >
          <span className="pill-icon">👦</span>
          <div className="pill-text-group" style={{ textAlign: 'left' }}>
            <span className="pill-title">BOYS</span>
          </div>
        </button>

        {/* BOTÓN GIRLS */}
        <button 
          className={`glass-pill pill-row ${selected === 'GIRLS' ? 'selected' : ''}`}
          onClick={() => handleSelect('GIRLS')}
          style={selected === 'GIRLS' ? { borderColor: 'var(--cyan-glow)', boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)' } : {}}
        >
          <span className="pill-icon">👧</span>
          <div className="pill-text-group" style={{ textAlign: 'left' }}>
            <span className="pill-title">GIRLS</span>
          </div>
        </button>
      </div>

      <footer className="footer-dark footer-double">
        <button className="btn-text btn-secondary" onClick={onBack}>ATRÁS</button>
        <button 
          className={`btn-text ${selected ? 'active' : ''}`} 
          style={selected ? { background: 'var(--cyan-glow)', color: '#000', boxShadow: '0 0 20px var(--cyan-glow)' } : { opacity: 0.5 }}
          onClick={selected ? onNext : null}
        >
          SIGUIENTE
        </button>
      </footer>
    </main>
  );
}

export default ViewGender;