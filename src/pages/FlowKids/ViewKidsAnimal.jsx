import React, { useState, useEffect } from 'react';
import perfumesData from '../../data/perfumes_zara.json';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const obtenerFotosDinamicas = (gender) => {
  let keywords = [];
  if (gender === 'MAN') keywords = ['man'];
  if (gender === 'WOMAN') keywords = ['woman'];
  if (gender === 'BOYS') keywords = ['boy'];
  if (gender === 'GIRLS') keywords = ['girl'];

  let todosLosPerfumes = [];

  const extraerArrays = (nodo) => {
    if (Array.isArray(nodo)) {
      todosLosPerfumes = todosLosPerfumes.concat(nodo);
    } else if (nodo && typeof nodo === 'object') {
      Object.values(nodo).forEach(extraerArrays);
    }
  };

  extraerArrays(perfumesData);

  const perfumesValidos = todosLosPerfumes.filter((p) => {
    if (!p.Category || !p.Image) return false;
    const catLower = p.Category.toLowerCase();
    return keywords.some((kw) => catLower.includes(kw));
  });

  if (perfumesValidos.length === 0) return [];

  const shuffled = perfumesValidos.sort(() => 0.5 - Math.random());
  const selectedPerfumes = shuffled.slice(0, 10);

  return selectedPerfumes.map((p, index) => ({
    id: index,
    url: p.Image,
    alt: p.NameProduct || 'Perfume',
  }));
};

const LoadingCarousel = ({ gender }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fotosData, setFotosData] = useState([]);

  useEffect(() => {
    const fotos = obtenerFotosDinamicas(gender);
    if (fotos.length === 0) {
      setFotosData([
        {
          id: 1,
          url: 'https://static.zara.net/assets/public/a8d7/b27e/79c34c78b918/9962aec8f342/20210296999-e1/20210296999-e1.jpg',
          alt: 'Default',
        },
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
            <div
              style={{
                display: 'flex',
                height: '100%',
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            >
              {fotosData.map((foto) => (
                <div key={foto.id} style={{ minWidth: '100%', height: '100%' }}>
                  <img
                    src={foto.url}
                    alt={foto.alt}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{ padding: '0 20px', textAlign: 'center', marginTop: '30px' }}
        >
          <h2
            className="zara-title"
            style={{ fontSize: '1.2rem', letterSpacing: '4px' }}
          >
            PREPARANDO SELECCIÓN
          </h2>
          <p
            className="zara-subtitle"
            style={{
              marginTop: '15px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            Formulando la fragancia perfecta...
          </p>
        </div>
      </div>
    </main>
  );
};

function ViewKidsAnimal({ onNext, onBack, userData, setUserData }) {
  const [selected, setSelected] = useState(userData.animal || null);
  const [isLoading, setIsLoading] = useState(false);

  const [apiError, setApiError] = useState(null);

  const animals = [
    { id: 'perro', label: 'PERRO' },
    { id: 'gato', label: 'GATO' },
    { id: 'leon', label: 'LEÓN' },
    { id: 'delfin', label: 'DELFÍN' },
    { id: 'dinosaurio', label: 'DINOSAURIO' },
    { id: 'pajaro', label: 'PÁJARO' },
  ];

  const handleAnalyze = async () => {
    setIsLoading(true);
    setApiError(null);

    const updatedUserData = { ...userData, animal: selected };
    setUserData(updatedUserData);

    try {
      const fraganceParams = new URLSearchParams({
        color: updatedUserData.color || '',
        superheroe: updatedUserData.superheroe || '',
        animal: updatedUserData.animal || '',
        genero: updatedUserData.gender || '',
      });

      const urlFragancia = `${API_BASE_URL}/generateFraganceKids?${fraganceParams.toString()}`;

      const responseFragance = await fetch(urlFragancia, {
        method: 'GET',
        headers: { 'X-API-Key': API_KEY },
      });

      if (!responseFragance.ok) {
        let mensajeError = '';
        switch (responseFragance.status) {
          case 400:
            mensajeError = 'Datos incompletos o solicitud mal formada.';
            break;
          case 401:
            mensajeError = 'Falta la API Key o es inválida.';
            break;
          case 422:
            mensajeError =
              'Los parámetros enviados no tienen un formato válido.';
            break;
          case 429:
            mensajeError =
              'Has superado el límite de peticiones. Espera un momento.';
            break;
          case 500:
            mensajeError = 'Error interno del servidor. Inténtalo más tarde.';
            break;
          default:
            mensajeError = `Error inesperado en el servidor (${responseFragance.status}).`;
        }
        throw new Error(mensajeError);
      }

      const dataFragance = await responseFragance.json();

      if (
        !dataFragance ||
        dataFragance.error ||
        (Array.isArray(dataFragance) && dataFragance.length === 0)
      ) {
        throw new Error('La IA no ha devuelto ninguna fragancia');
      }

      setUserData((prev) => ({ ...prev, fraganceData: dataFragance }));
      setIsLoading(false);
      onNext();
    } catch (error) {
      console.error('Error conectando con el backend:', error);
      setIsLoading(false);
      setApiError(
        error.message ||
          'Error de conexión. Verifica tu internet e inténtalo de nuevo.'
      );
    }
  };

  if (apiError) {
    return (
      <main
        className="zara-view-analysis fade-in"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <h2
          className="zara-title"
          style={{ fontSize: '1.5rem', marginBottom: '15px' }}
        >
          ¡UPS! ALGO HA SALIDO MAL
        </h2>

        <p
          style={{
            color: '#757575',
            marginBottom: '30px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontSize: '0.85rem',
          }}
        >
          {apiError}
        </p>

        <button
          className="zara-btn-next"
          onClick={() => setApiError(null)}
          style={{ width: '100%', maxWidth: '300px' }}
        >
          VOLVER A INTENTAR
        </button>
      </main>
    );
  }

  if (isLoading) {
    return <LoadingCarousel gender={userData.gender} />;
  }

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
        <div className="zara-tab">Héroe</div>
        <div className="zara-tab active">Animal</div>
      </div>

      <div className="zara-title-container">
        <h2 className="zara-title">Tu animal favorito</h2>
        <p className="zara-subtitle">El toque final para tu fragancia.</p>
      </div>

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
          {animals.map((item) => (
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
        <button className="zara-btn-back" onClick={onBack} disabled={isLoading}>
          ATRÁS
        </button>
        <button
          className="zara-btn-next"
          onClick={handleAnalyze}
          disabled={!selected || isLoading}
          style={
            !selected || isLoading
              ? { opacity: 0.5, backgroundColor: '#f5f5f5', color: '#a0a0a0' }
              : {}
          }
        >
          {isLoading ? 'PROCESANDO...' : 'RECOMENDACIÓN'}
        </button>
      </footer>
    </main>
  );
}

export default ViewKidsAnimal;
