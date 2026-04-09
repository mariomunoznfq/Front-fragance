import React, { useState } from 'react';

function ViewKidsColor({ onNext, onBack, userData, setUserData }) {
  const [selected, setSelected] = useState(userData.color || null);

  const colors = [
    { id: 'rojo', label: 'ROJO' },
    { id: 'azul', label: 'AZUL' },
    { id: 'verde', label: 'VERDE' },
    { id: 'amarillo', label: 'AMARILLO' },
    { id: 'rosa', label: 'ROSA' },
    { id: 'naranja', label: 'NARANJA' },
  ];

  const handleSelect = (color) => {
    setSelected(color);
  };

  const handleNext = () => {
    setUserData((prev) => ({ ...prev, color: selected }));
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
        <div className="zara-tab active">Color</div>
        <div className="zara-tab">Héroe</div>
        <div className="zara-tab">Animal</div>
      </div>

      <div className="zara-title-container">
        <h2 className="zara-title">¿Cuál es tu color?</h2>
        <p className="zara-subtitle">
          El primer paso para tu fragancia mágica.
        </p>
      </div>

      {/* Lista de opciones (Estilo Grid de Zara) */}
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
          {colors.map((item) => (
            <button
              key={item.id}
              className={`zara-card ${selected === item.label ? 'selected' : ''}`}
              onClick={() => handleSelect(item.label)}
            >
              <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
              <div>
                <div
                  style={{
                    fontWeight: '500',
                    fontSize: '0.9rem',
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

export default ViewKidsColor;
