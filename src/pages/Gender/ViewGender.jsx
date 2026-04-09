import React, { useState } from 'react';
import ReactGA from 'react-ga4';

function ViewGender({ onNext, onBack, userData, setUserData }) {
  const [selected, setSelected] = useState(userData.gender || null);

  const handleSelect = (genderValue) => {
    setSelected(genderValue);
    setUserData((prev) => ({ ...prev, gender: genderValue }));
  };

  const genders = [
    { id: 'WOMAN', label: 'WOMAN' },
    { id: 'MAN', label: 'MAN' },
    { id: 'GIRLS', label: 'GIRLS' },
    { id: 'BOYS', label: 'BOYS' },
  ];

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

      <div className="zara-title-container" style={{ marginTop: '20px' }}>
        <h2 className="zara-title">¿Para quién es?</h2>
        <p className="zara-subtitle">Para afinar la precisión de la IA.</p>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '400px',
          margin: '0 auto',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            width: '100%',
          }}
        >
          {genders.map((item) => (
            <button
              key={item.id}
              className={`zara-card ${selected === item.id ? 'selected' : ''}`}
              onClick={() => handleSelect(item.id)}
              style={{
                justifyContent: 'center',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontWeight: '500',
                  fontSize: '1rem',
                  letterSpacing: '2px',
                }}
              >
                {item.label}
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
          onClick={() => {
            ReactGA.event({
              category: 'Navegacion',
              action: 'Seleccion_Genero',
              label: selected,
            });

            onNext();
          }}
          disabled={!selected}
        >
          SIGUIENTE
        </button>
      </footer>
    </main>
  );
}

export default ViewGender;
