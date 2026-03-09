import React, { useState, useRef, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

// IMPORTA TU JSON AQUÍ (Ajusta la ruta si es necesario)
import perfumesData from '../perfumes_zara.json'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 1. EL BUSCADOR DE FOTOS DINÁMICO (A prueba de balas - INTACTO)
const obtenerFotosDinamicas = (gender) => {
  let searchCategory = '';
  if (gender === 'MAN') searchCategory = 'man';
  if (gender === 'WOMAN') searchCategory = 'woman';
  if (gender === 'BOYS' || gender === 'GIRLS') searchCategory = 'kids';

  let arrayPerfumes = perfumesData;
  
  if (!Array.isArray(perfumesData)) {
    const key = Object.keys(perfumesData).find(k => Array.isArray(perfumesData[k]));
    
    if (key) {
      arrayPerfumes = perfumesData[key];
    } else if (perfumesData.default && Array.isArray(perfumesData.default)) {
      arrayPerfumes = perfumesData.default;
    } else {
      console.error("No se encontró ningún Array válido en el JSON:", perfumesData);
      return []; 
    }
  }

  const perfumesValidos = arrayPerfumes.filter(
    (p) => p.Category && p.Category.toLowerCase().includes(searchCategory) && p.Image
  );

  if (perfumesValidos.length === 0) return [];

  const shuffled = perfumesValidos.sort(() => 0.5 - Math.random());
  const selectedPerfumes = shuffled.slice(0, 10);

  return selectedPerfumes.map((p, index) => ({
    id: index,
    url: p.Image,
    alt: p.NameProduct || "Perfume"
  }));
};

// 2. COMPONENTE DEL CARRUSEL (Estilo ZARA)
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

// 3. COMPONENTE PRINCIPAL DE LOOK (Estilo ZARA)
function ViewLookAnalysis({ onNext, onBack, userData, setUserData }) {
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDetectingLook, setIsDetectingLook] = useState(false);
  const [detectedLook, setDetectedLook] = useState(null);
  const fileInputRef = useRef(null);

  const looks = [
    { id: 6, title: 'IA SCAN', desc: 'Sube una foto y deja que la IA decida.' },
    { id: 2, title: 'ELEGANTE', desc: 'Traje, camisa o vestido sofisticado.' },
    { id: 3, title: 'DEPORTIVO', desc: 'Ropa técnica, chándal y zapatillas.' },
    { id: 4, title: 'URBAN', desc: 'Estilo callejero, oversize y moderno.' },
    { id: 5, title: 'HIPPIE', desc: 'Tejidos naturales, colores y estilo libre.' },
    { id: 1, title: 'CASUAL', desc: 'Vaqueros, ropa cómoda para el día a día.' },
  ];

  const handleSelect = (lookTitle) => {
    if (lookTitle === 'IA SCAN') {
      fileInputRef.current.click();
    } else {
      setSelected(lookTitle);
      setImagePreview(null);
      setDetectedLook(null); 
      setUserData(prev => ({ ...prev, look: lookTitle, lookImage: null }));
    }
  };

  const handleImageUpload = async (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      setIsDetectingLook(true); 
      setDetectedLook(null);
      const options = { maxSizeMB: 0.9, maxWidthOrHeight: 1200, useWebWorker: true };

      try {
        const compressedFile = await imageCompression(imageFile, options);
        const imageUrl = URL.createObjectURL(compressedFile);
        setImagePreview(imageUrl);
        setSelected('IA SCAN');
        setUserData(prev => ({ ...prev, look: 'IA SCAN', lookImage: compressedFile }));

        const formData = new FormData();
        formData.append('foto', compressedFile);

        const responseLook = await fetch(`${API_BASE_URL}/generateLook`, {
          method: 'POST',
          body: formData,
        });

        if (responseLook.ok) {
          const dataLook = await responseLook.json();
          setDetectedLook(dataLook.look); 
          setUserData(prev => ({ ...prev, look: dataLook.look })); 
        } else {
          setDetectedLook("Desconocido");
        }
      } catch (error) {
        console.error('Error al procesar la foto:', error);
        alert("Hubo un problemita procesando la foto.");
      } finally {
        setIsDetectingLook(false);
      }
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);

    try {
      const isKid = userData.gender === 'BOYS' || userData.gender === 'GIRLS';
      let responseFragance;

      if (isKid) {
        const fraganceParams = new URLSearchParams({
          color: userData.color || '', 
          superheroe: userData.superheroe || '',
          animal: userData.animal || '',
          genero: userData.gender || ''
        });
        const urlFragancia = `${API_BASE_URL}/generateFraganceKids?${fraganceParams.toString()}`;
        responseFragance = await fetch(urlFragancia, { method: 'GET' });

      } else {
        let finalLook = userData.look;
        let finalActitud = userData.attitude;
        let finalPlan = userData.plan;

        if (userData.lookImage) {
          const formData = new FormData();
          formData.append('foto', userData.lookImage);

          const responseLook = await fetch(`${API_BASE_URL}/generateLook`, {
            method: 'POST',
            body: formData,
          });
          if (responseLook.ok) {
            const dataLook = await responseLook.json();
            finalLook = dataLook.look; 
          }
        }

        const planesPredefinidos = ['FIESTA', 'TRABAJO', 'DEPORTE', 'CITA'];
        if (userData.plan && !planesPredefinidos.includes(userData.plan)) { 
          const planParams = new URLSearchParams({ descripcion: userData.plan });
          const responsePlan = await fetch(`${API_BASE_URL}/generatePlan?${planParams.toString()}`, { method: 'GET' });
          if (responsePlan.ok) {
            const dataPlan = await responsePlan.json();
            finalPlan = dataPlan.plan; 
          }
        }

        const actitudesPredefinidas = ['seguridad', 'relajacion', 'sofisticacion', 'atrevimiento', 'coqueteria', 'energia'];
        if (userData.attitude && !actitudesPredefinidas.includes(userData.attitude.toLowerCase())) {
           const actitudParams = new URLSearchParams({ descripcion: userData.attitude });
           const responseActitudText = await fetch(`${API_BASE_URL}/generateActitud?${actitudParams.toString()}`, { method: 'GET' });
           
           if (responseActitudText.ok) {
              const dataActitudText = await responseActitudText.json();
              finalActitud = dataActitudText.actitud;
           } else {
              console.error("Error al clasificar la actitud:", responseActitudText.status);
           }
        }

        const fraganceParams = new URLSearchParams({
          actitud: finalActitud || '', plan: finalPlan || '', look: finalLook || '', genero: userData.gender || ''
        });

        const urlFragancia = `${API_BASE_URL}/generateFraganceAdult?${fraganceParams.toString()}`;
        responseFragance = await fetch(urlFragancia, { method: 'GET' });
      }

      if (!responseFragance.ok) throw new Error(`Error en el servidor: ${responseFragance.status}`);
      
      const dataFragance = await responseFragance.json();
      setUserData(prev => ({ ...prev, fraganceData: dataFragance }));

      setIsLoading(false);
      onNext();

    } catch (error) {
      console.error('Error conectando con el backend:', error);
      alert("Hubo un error de conexión con el servidor. ¡Revisa la consola (F12)!");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingCarousel gender={userData.gender} />;
  }

  return (
    <main className="zara-view-analysis fade-in">
      <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />

      {/* Header Limpio */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div className="zara-logo" style={{ fontSize: '1.2rem' }}><strong>IN</strong> ESSENCE AI</div>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#000' }}>✕</button>
      </header>

      {/* Navegación por pasos (Tabs) */}
      <div className="zara-tabs">
        <div className="zara-tab">Actitud</div>
        <div className="zara-tab">Plan</div>
        <div className="zara-tab active">Look</div>
      </div>

      {/* Título de la sección */}
      <div className="zara-title-container">
        <h2 className="zara-title">¿Cuál es tu outfit?</h2>
        <p className="zara-subtitle">El estilo de hoy completa tu esencia.</p>
      </div>

      {/* Grid de Opciones o Foto Subida */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
        {imagePreview ? (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
            
            <img src={imagePreview} alt="Tu outfit" style={{ width: '100%', maxWidth: '280px', height: 'auto', objectFit: 'cover' }} />
            
            {isDetectingLook ? (
               <p style={{ color: '#000', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '10px' }}>
                 Escaneando prendas...
               </p>
            ) : (
               <div style={{ padding: '20px', border: '1px solid #e5e5e5', textAlign: 'center', width: '100%', maxWidth: '280px', boxSizing: 'border-box' }}>
                 <p className="zara-subtitle" style={{ fontSize: '0.7rem', letterSpacing: '2px', marginBottom: '10px' }}>LA IA HA DETECTADO UN LOOK</p>
                 <h3 className="zara-title" style={{ fontSize: '1.2rem', margin: 0 }}>
                   {detectedLook ? detectedLook.toUpperCase() : 'DESCONOCIDO'}
                 </h3>
               </div>
            )}
            <button className="zara-btn-back" onClick={() => handleSelect('IA SCAN')} style={{ border: '1px solid #000', padding: '12px 24px', color: '#000' }}>
              REPETIR FOTO
            </button>
          </div>
        ) : (
          <div className="zara-grid">
            {looks.map((item) => (
              <button 
                key={item.id}
                className={`zara-card ${selected === item.title ? 'selected' : ''}`}
                onClick={() => handleSelect(item.title)}
              >
                <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '0.9rem', letterSpacing: '1px', marginBottom: '4px' }}>{item.title}</div>
                  <div className="zara-card-desc">{item.desc}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer / Botones de Acción */}
      <footer className="zara-footer-analysis">
        <button className="zara-btn-back" onClick={onBack} disabled={isLoading || isDetectingLook}>
          ATRÁS
        </button>
        <button 
          className="zara-btn-next" 
          onClick={handleAnalyze}
          disabled={!selected || isLoading || isDetectingLook}
        >
          {isDetectingLook ? 'RECOMENDANDO...' : 'RECOMENDACIÓN'}
        </button>
      </footer>
    </main>
  );
}

export default ViewLookAnalysis;