import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Reutilizamos tu array de fotos del LoadingCarousel original
const fotosData = [
  { id: 1, url: "https://static.zara.net/assets/public/910f/aa92/7d114758af38/3ee4cb0c51a2/20210295999-e1/20210295999-e1.jpg?ts=1771579120505&w=2400" },
  { id: 2, url: "https://static.zara.net/assets/public/6bcc/b26d/39a14d6f979c/6467f15eb51b/20210298999-e1/20210298999-e1.jpg?ts=1771579115174&w=2400" },
  { id: 3, url: "https://static.zara.net/assets/public/905c/85ba/8d2743bd8469/a6b79228ca01/20210622999-e1/20210622999-e1.jpg?ts=1771579124193&w=2400" }
];

const LoadingCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex === fotosData.length - 1 ? 0 : prevIndex + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="view-ethereal fade-in" style={{ background: 'linear-gradient(180deg, #050510 0%, #100520 100%)', justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="flare flare-1" style={{ background: 'rgba(0, 255, 255, 0.15)', top: '-10%', left: '10%' }}></div>
      <div className="flare flare-4" style={{ background: 'rgba(128, 0, 255, 0.2)', bottom: '-15%', right: '5%' }}></div>
      <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <div style={{ width: '220px', height: '300px', overflow: 'hidden', borderRadius: '20px', border: '2px solid var(--cyan-glow, #00ffff)', boxShadow: '0 0 30px rgba(0,255,255,0.2)', backgroundColor: '#fff' }}>
          <div style={{ display: 'flex', height: '100%', transform: `translateX(-${currentIndex * 100}%)`, transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' }}>
            {fotosData.map((foto) => (
              <div key={foto.id} style={{ minWidth: '100%', height: '100%' }}>
                <img src={foto.url} alt="Cargando" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '0 20px', textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '200', letterSpacing: '4px', marginTop: '30px', lineHeight: '1.4' }}>BUSCANDO LA <br/> <span className="text-glow">MAGIA</span></h2>
          <p style={{ color: 'var(--text-muted, #aaa)', marginTop: '15px', letterSpacing: '1px', animation: 'pulseOrb 1.5s infinite alternate' }}>
            Formulando la fragancia perfecta...
          </p>
        </div>
      </div>
    </main>
  );
};

function ViewKidsAnimal({ onNext, onBack, userData, setUserData }) {
  const [selected, setSelected] = useState(userData.kidsAnimal || null);
  const [isLoading, setIsLoading] = useState(false);

  const animals = [
    { id: 'perro', label: 'PERRO', icon: '🐶' },
    { id: 'gato', label: 'GATO', icon: '🐱' },
    { id: 'leon', label: 'LEÓN', icon: '🦁' },
    { id: 'delfin', label: 'DELFÍN', icon: '🐬' },
    { id: 'dinosaurio', label: 'DINOSAURIO', icon: '🦖' },
    { id: 'pajaro', label: 'PÁJARO', icon: '🐦' },
  ];

  const handleAnalyze = async () => {
    setIsLoading(true);
    
    // Guardamos la última selección en el estado local de React
    const updatedUserData = { ...userData, kidsAnimal: selected };
    setUserData(updatedUserData);

    try {
      const fraganceParams = new URLSearchParams({
        actitud: updatedUserData.kidsColor || '',
        plan: updatedUserData.kidsHero || '',
        look: updatedUserData.kidsAnimal || '',
        genero: updatedUserData.gender || ''
      });

      // 🔥 AQUÍ ESTÁ EL CAMBIO DE RUTA PARA NIÑOS
      const urlFragancia = `${API_BASE_URL}/generateFraganceKids?${fraganceParams.toString()}`;
      
      const responseFragance = await fetch(urlFragancia, { method: 'GET' });
      
      if (!responseFragance.ok) throw new Error(`Error: ${responseFragance.status}`);
      
      const dataFragance = await responseFragance.json();

      setUserData(prev => ({ ...prev, fraganceData: dataFragance }));
      setIsLoading(false);
      onNext();

    } catch (error) {
      console.error('Error conectando con el backend:', error);
      alert("Hubo un error de conexión con el servidor. ¡Revisa la consola!");
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingCarousel />;

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
        <div className="tab">HÉROE</div>
        <div className="tab active" style={{ borderColor: 'var(--cyan-glow)', color: 'var(--cyan-glow)' }}>ANIMAL</div>
      </div>

      <div className="question-header">
        <h2>TU <span className="text-glow">ANIMAL</span> FAVORITO</h2>
      </div>

      <div className="options-cloud scrollable">
        {animals.map((item) => (
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
        <button className="btn-text btn-secondary" onClick={onBack} disabled={isLoading}>ATRÁS</button>
        <button 
          className={`btn-text ${selected && !isLoading ? 'active' : ''}`} 
          style={selected && !isLoading ? { background: 'var(--cyan-glow)', color: '#000', boxShadow: '0 0 20px var(--cyan-glow)' } : { opacity: 0.5 }}
          onClick={selected && !isLoading ? handleAnalyze : null}
        >
          RECOMENDACIÓN
        </button>
      </footer>
    </main>
  );
}

export default ViewKidsAnimal;