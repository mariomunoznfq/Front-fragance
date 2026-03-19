import React from 'react';

function ViewHome({ userName, onNext }) {
  return (
    <main className="zara-view-home fade-in">
      <header className="zara-header">
        <h1 className="zara-logo"><strong>IN</strong> ESSENCE AI</h1>
      </header>

      <div className="zara-center-stage">
        <div className="zara-greeting-texts">
          <h2 className="zara-text-morning">Buenos días{userName ? `, ${userName}` : ''}</h2>
          <p className="zara-text-question">¿Qué perfume usamos hoy?</p>
        </div>
      </div>
      
      <footer className="zara-footer">
        <button className="zara-btn-ghost" onClick={onNext}>
          Descubrir mi fragancia
        </button>
      </footer>
    </main>
  );
}

export default ViewHome;