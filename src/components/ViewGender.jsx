import React, { useState } from 'react';

function ViewGender({ onNext, onBack, userData, setUserData }) {
  const [selected, setSelected] = useState(userData.gender || null);

  const handleSelect = (genderValue) => {
    setSelected(genderValue);
    setUserData(prev => ({ ...prev, gender: genderValue }));
  };

  const genders = [
    { id: 'WOMAN', label: 'WOMAN' },
    { id: 'MAN', label: 'MAN' },
    { id: 'GIRLS', label: 'GIRLS' },
    { id: 'BOYS', label: 'BOYS' },
  ];

  return (
    <main className="zara-view-analysis fade-in">
      
      {/* Header Limpio */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div className="zara-logo" style={{ fontSize: '1.2rem' }}><strong>IN</strong> ESSENCE AI</div>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#000' }}>✕</button>
      </header>

      {/* En esta pantalla no hay pestañas de progreso, así que pasamos directo al título */}

      {/* Título de la sección */}
      <div className="zara-title-container" style={{ marginTop: '20px' }}>
        <h2 className="zara-title">¿Para quién es?</h2>
        <p className="zara-subtitle">Para afinar la precisión de la IA.</p>
      </div>

      {/* Lista de opciones (Estilo Grid de Zara, pero más limpio al no tener iconos/descripciones largas) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '400px', margin: '0 auto', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
          {genders.map((item) => (
            <button 
              key={item.id}
              className={`zara-card ${selected === item.id ? 'selected' : ''}`}
              onClick={() => handleSelect(item.id)}
              style={{ 
                justifyContent: 'center', // Centramos el texto para que parezca un botón de categoría de tienda
                padding: '24px', 
                textAlign: 'center' 
              }}
            >
              <div style={{ fontWeight: '500', fontSize: '1rem', letterSpacing: '2px' }}>
                {item.label}
              </div>
            </button>
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
          onClick={onNext}
          disabled={!selected}
        >
          SIGUIENTE
        </button>
      </footer>
    </main>
  );
}

export default ViewGender;