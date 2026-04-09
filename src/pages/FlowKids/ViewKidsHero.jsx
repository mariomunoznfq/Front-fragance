import React, { useState } from 'react';

function ViewKidsHero({ onNext, onBack, userData, setUserData }) {
  const [selected, setSelected] = useState(userData.superheroe || null);

  const heroes = [
    { id: 'spiderman', label: 'SPIDER-MAN' },
    { id: 'batman', label: 'BATMAN' },
    { id: 'superman', label: 'SUPERMAN' },
    { id: 'wonderwoman', label: 'WONDER WOMAN' },
    { id: 'ironman', label: 'CATWOMAN' },
    { id: 'capitanamerica', label: 'CAPITANA MARVEL' },
  ];

  const handleNext = () => {
    setUserData((prev) => ({ ...prev, superheroe: selected }));
    onNext();
  };

  return (
    <main className="zara-view-analysis fade-in">
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
        }}
      >
        <div className="zara-logo" style={{ fontSize: '1.2rem' }}>
          <strong>IN</strong> ESSENCE AI
        </div>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#000',
          }}
        >
          ✕
        </button>
      </header>

      <div className="zara-tabs">
        <div className="zara-tab">Color</div>
        <div className="zara-tab active">Héroe</div>
        <div className="zara-tab">Animal</div>
      </div>

      <div className="zara-title-container">
        <h2 className="zara-title">Tu súper héroe</h2>
        <p className="zara-subtitle">Elige a tu compañero de aventuras.</p>
      </div>

      {/* Grid de Héroes */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <div className="zara-grid">
          {heroes.map((item) => (
            <button
              key={item.id}
              className={`zara-card ${selected === item.label ? 'selected' : ''}`}
              onClick={() => setSelected(item.label)}
            >
              <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
              <div>
                <div
                  style={{
                    fontWeight: '500',
                    fontSize: '0.85rem',
                    letterSpacing: '1px',
                  }}
                >
                  {item.label}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <footer className="zara-footer-analysis">
        <button className="zara-btn-back" onClick={onBack}>
          ATRÁS
        </button>
        <button
          className="zara-btn-next"
          onClick={handleNext}
          disabled={!selected}
        >
          SIGUIENTE
        </button>
      </footer>
    </main>
  );
}

export default ViewKidsHero;
