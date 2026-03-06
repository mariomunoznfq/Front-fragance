import React, { useState } from 'react';

function ViewKidsHero({ onNext, onBack, userData, setUserData }) {
  const [selected, setSelected] = useState(userData.kidsHero || null);

  const heroes = [
    { id: 'spiderman', label: 'SPIDER-MAN', icon: '🕸️' },
    { id: 'batman', label: 'BATMAN', icon: '🦇' },
    { id: 'superman', label: 'SUPERMAN', icon: '🦸‍♂️' },
    { id: 'wonderwoman', label: 'WONDER WOMAN', icon: '🦸‍♀️' },
    { id: 'ironman', label: 'CATWOMAN', icon: '🐱' },
    { id: 'capitanamerica', label: 'CAPITANA MARVEL', icon: '🦸‍♀️' },
  ];

  const handleNext = () => {
    setUserData(prev => ({ ...prev, kidsHero: selected }));
    onNext();
  };

  return (
    <main className="view-ethereal fade-in" style={{ background: 'linear-gradient(180deg, #050510 0%, #100520 100%)' }}>
      <div className="flare flare-1" style={{ background: 'rgba(0, 255, 255, 0.15)', top: '-10%', left: '10%' }}></div>
      <div className="flare flare-4" style={{ background: 'rgba(128, 0, 255, 0.2)', bottom: '-15%', right: '5%' }}></div>

      <header className="header-dark">
        <div className="logo-text"><strong>IN</strong> ESSENCE AI</div>
        <button className="btn-icon" onClick={onBack}>✕</button>
      </header>

      <div className="progress-tabs">
        <div className="tab">COLOR</div>
        <div className="tab active" style={{ borderColor: 'var(--cyan-glow)', color: 'var(--cyan-glow)' }}>HÉROE</div>
        <div className="tab">ANIMAL</div>
      </div>

      <div className="question-header">
        <h2>TU <span className="text-glow">SÚPER HÉROE</span> FAVORITO</h2>
      </div>

      <div className="options-cloud scrollable">
        {heroes.map((item) => (
          <button 
            key={item.id}
            className={`glass-pill pill-row ${selected === item.label ? 'selected' : ''}`}
            onClick={() => setSelected(item.label)}
            style={selected === item.label ? { borderColor: 'var(--cyan-glow)', boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)' } : {}}
          >
            <span className="pill-icon">{item.icon}</span>
            <div className="pill-text-group" style={{ textAlign: 'left' }}>
              <span className="pill-title">{item.label}</span>
            </div>
          </button>
        ))}
      </div>

      <footer className="footer-dark footer-double">
        <button className="btn-text btn-secondary" onClick={onBack}>ATRÁS</button>
        <button 
          className={`btn-text ${selected ? 'active' : ''}`} 
          style={selected ? { background: 'var(--cyan-glow)', color: '#000', boxShadow: '0 0 20px var(--cyan-glow)' } : { opacity: 0.5 }}
          onClick={selected ? handleNext : null}
        >
          SIGUIENTE
        </button>
      </footer>
    </main>
  );
}

export default ViewKidsHero;