import React, { useState, useEffect } from 'react';

// IMPORTAMOS EL JSON PARA EL CARRUSEL DINÁMICO
import perfumesData from '../../data/perfumes_zara.json'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY; // <--- LÍNEA CORREGIDA PARA QUE FUNCIONE EL FETCH

// =========================================
// 1. EL BUSCADOR DE FOTOS DINÁMICO (A prueba de balas)
// =========================================
const obtenerFotosDinamicas = (gender) => {
  let keywords = [];
  // Ajustamos las palabras clave para que coincidan con la propiedad "Category" de tu JSON
  if (gender === 'MAN') keywords = ['man'];
  if (gender === 'WOMAN') keywords = ['woman'];
  if (gender === 'BOYS') keywords = ['boy'];
  if (gender === 'GIRLS') keywords = ['girl'];

  // 🔥 EL RECOLECTOR ABSOLUTO 🔥
  // Va a escanear todo el JSON, sin importar lo profundo que esté.
  let todosLosPerfumes = [];

  const extraerArrays = (nodo) => {
    if (Array.isArray(nodo)) {
      todosLosPerfumes = todosLosPerfumes.concat(nodo);
    } else if (nodo && typeof nodo === 'object') {
      Object.values(nodo).forEach(extraerArrays);
    }
  };

  // Lanzamos la recolección
  extraerArrays(perfumesData);

  // Ahora filtramos sobre TODOS los perfumes encontrados
  const perfumesValidos = todosLosPerfumes.filter((p) => {
    if (!p.Category || !p.Image) return false;
    const catLower = p.Category.toLowerCase();
    return keywords.some(kw => catLower.includes(kw));
  });

  if (perfumesValidos.length === 0) return [];

  // Barajamos y sacamos 10 aleatorios
  const shuffled = perfumesValidos.sort(() => 0.5 - Math.random());
  const selectedPerfumes = shuffled.slice(0, 10);

  return selectedPerfumes.map((p, index) => ({
    id: index,
    url: p.Image,
    alt: p.NameProduct || "Perfume"
  }));
};

// =========================================
// 2. COMPONENTE DEL CARRUSEL (Estilo ZARA)
// =========================================
const LoadingCarousel = ({ gender }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fotosData, setFotosData] = useState([]);

  useEffect(() => {
    const fotos = obtenerFotosDinamicas(gender);
    if (fotos.length === 0) {
      setFotosData([
        { id: 1, url: "https://static.zara.net/assets/public/a8d7/b27e/79c34c78b918/9962aec8f342/20210296999-e1/20210296999-e1.jpg", alt: "Default" }
      ]);
    } else {
      setFotosData(fotos);
    }
  }, [gender]);

  useEffect(() => {
    if (fotosData.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === fotosData.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000); 
    return () => clearInterval(interval);
  }, [fotosData.length]);

  return (
    <main className="zara-view-home fade-in">
      <div className="zara-center-stage">
        
        <div className="zara-loading-box">
          {fotosData.length > 0 && (
            <div style={{
              display: 'flex',
              height: '100%',
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' 
            }}>
              {fotosData.map((foto) => (
                <div key={foto.id} style={{ minWidth: '100%', height: '100%' }}>
                  <img 
                    src={foto.url} 
                    alt={foto.alt} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '0 20px', textAlign: 'center', marginTop: '30px' }}>
          <h2 className="zara-title" style={{ fontSize: '1.2rem', letterSpacing: '4px' }}>
            PREPARANDO SELECCIÓN
          </h2>
          <p className="zara-subtitle" style={{ marginTop: '15px', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Formulando la fragancia perfecta...
          </p>
        </div>

      </div>
    </main>
  );
};

// =========================================
// 3. COMPONENTE PRINCIPAL: ANIMAL (Estilo ZARA)
// =========================================
function ViewKidsAnimal({ onNext, onBack, userData, setUserData }) {
  const [selected, setSelected] = useState(userData.animal || null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para controlar el error de la IA
  const [hasError, setHasError] = useState(false);

  const animals = [
    { id: 'perro', label: 'PERRO'},
    { id: 'gato', label: 'GATO'},
    { id: 'leon', label: 'LEÓN'},
    { id: 'delfin', label: 'DELFÍN'},
    { id: 'dinosaurio', label: 'DINOSAURIO'},
    { id: 'pajaro', label: 'PÁJARO'},
  ];

  const handleAnalyze = async () => {
    setIsLoading(true);
    setHasError(false); // Reseteamos el estado de error por si acaso
    
    const updatedUserData = { ...userData, animal: selected };
    setUserData(updatedUserData);

    try {
      const fraganceParams = new URLSearchParams({
        color: updatedUserData.color || '',
        superheroe: updatedUserData.superheroe || '',
        animal: updatedUserData.animal || '',
        genero: updatedUserData.gender || ''
      });

      const urlFragancia = `${API_BASE_URL}/generateFraganceKids?${fraganceParams.toString()}`;
      
      const responseFragance = await fetch(urlFragancia, { 
          method: 'GET',
          headers: { 'X-API-Key': API_KEY }
        });
      
      if (!responseFragance.ok) throw new Error(`Error: ${responseFragance.status}`);
      
      const dataFragance = await responseFragance.json();

      // Verificamos si la IA falló o devolvió un objeto vacío/inválido
      if (!dataFragance || dataFragance.error || (Array.isArray(dataFragance) && dataFragance.length === 0)) {
        throw new Error("La IA no ha devuelto ninguna fragancia");
      }

      setUserData(prev => ({ ...prev, fraganceData: dataFragance }));
      setIsLoading(false);
      onNext();

    } catch (error) {
      console.error('Error conectando con el backend:', error);
      setIsLoading(false);
      setHasError(true); // MOSTRAMOS LA PANTALLA DE ERROR EN LUGAR DEL ALERT
    }
  };

  // Pantalla de Error
  if (hasError) {
    return (
      <main className="zara-view-analysis fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px', textAlign: 'center' }}>
        <h2 className="zara-title" style={{ fontSize: '1.5rem', marginBottom: '15px' }}>¡UPS! ALGO HA SALIDO MAL</h2>
        <button 
          className="zara-btn-next" 
          onClick={() => window.location.reload()} // Recarga la web y devuelve al Paso 1
          style={{ width: '100%', maxWidth: '300px' }}
        >
          VOLVER AL INICIO
        </button>
      </main>
    );
  }

  if (isLoading) {
    return <LoadingCarousel gender={userData.gender} />;
  }

  // --- LA PANTALLA PRINCIPAL ---
  return (
    <main className="zara-view-analysis fade-in">
      
      {/* Header Limpio */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div className="zara-logo" style={{ fontSize: '1.2rem' }}><strong>IN</strong> ESSENCE AI</div>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#000' }}>✕</button>
      </header>

      {/* Navegación por pasos (Tabs Niños) */}
      <div className="zara-tabs">
        <div className="zara-tab">Color</div>
        <div className="zara-tab">Héroe</div>
        <div className="zara-tab active">Animal</div>
      </div>

      {/* Título de la sección */}
      <div className="zara-title-container">
        <h2 className="zara-title">Tu animal favorito</h2>
        <p className="zara-subtitle">El toque final para tu fragancia.</p>
      </div>

      {/* Grid de Opciones (Botones Zara) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
        <div className="zara-grid">
          {animals.map((item) => (
            <button 
              key={item.id}
              className={`zara-card ${selected === item.label ? 'selected' : ''}`}
              onClick={() => setSelected(item.label)}
            >
              <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: '500', fontSize: '0.9rem', letterSpacing: '1px' }}>
                  {item.label}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer / Botones de Acción */}
      <footer className="zara-footer-analysis">
        <button className="zara-btn-back" onClick={onBack} disabled={isLoading}>
          ATRÁS
        </button>
        <button 
          className="zara-btn-next" 
          onClick={handleAnalyze}
          disabled={!selected || isLoading}
          style={(!selected || isLoading) ? { opacity: 0.5, backgroundColor: '#f5f5f5', color: '#a0a0a0' } : {}}
        >
          {isLoading ? 'PROCESANDO...' : 'RECOMENDACIÓN'}
        </button>
      </footer>

    </main>
  );
}

export default ViewKidsAnimal;