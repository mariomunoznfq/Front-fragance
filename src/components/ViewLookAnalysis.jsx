import React, { useState, useRef, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

// IMPORTA TU JSON AQUÍ (Ajusta la ruta si es necesario)
import perfumesData from '../perfumes_zara.json'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

// =========================================
// 1. EL BUSCADOR DE FOTOS DINÁMICO (A PRUEBA DE BALAS)
// =========================================
const obtenerFotosDinamicas = (gender) => {
  let keywords = [];
  if (gender === 'MAN') keywords = ['man', 'hombre'];
  if (gender === 'WOMAN') keywords = ['woman', 'mujer'];
  if (gender === 'BOYS') keywords = ['boy', 'kid', 'niño'];
  if (gender === 'GIRLS') keywords = ['girl', 'kid', 'niña'];

  // 🔥 EL RECOLECTOR ABSOLUTO 🔥
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

  // Barajamos y sacamos 10
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
// 3. COMPONENTE PRINCIPAL DE LOOK (Estilo ZARA)
// =========================================
function ViewLookAnalysis({ onNext, onBack, userData, setUserData }) {
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDetectingLook, setIsDetectingLook] = useState(false);
  const [detectedLook, setDetectedLook] = useState(null);
  const fileInputRef = useRef(null);

  // NUEVO: Estado para controlar cuando la IA falla o se queda sin tokens
  const [hasError, setHasError] = useState(false);

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
      if (imageFile.size > 5 * 1024 * 1024) {
        alert("La foto es demasiado pesada. El tamaño máximo permitido es de 5MB.");
        e.target.value = null; 
        return;
      }

      setIsDetectingLook(true); 
      setDetectedLook(null);
      setHasError(false); // Reseteamos el error por si acaso
      const options = { maxSizeMB: 0.9, maxWidthOrHeight: 1200, useWebWorker: true };

      try {
        const compressedFile = await imageCompression(imageFile, options);
        const imageUrl = URL.createObjectURL(compressedFile);
        setImagePreview(imageUrl);
        setSelected('IA SCAN');
        setUserData(prev => ({ ...prev, look: 'IA SCAN', lookImage: compressedFile }));

        const formData = new FormData();
        formData.append('foto', compressedFile);

        // 1. FETCH CON AUTH-TOKEN AL SUBIR LA IMAGEN
        const responseLook = await fetch(`${API_BASE_URL}/generateLook`, {
          method: 'POST',
          headers: {
            'auth-token': API_KEY
          },
          body: formData,
        });

        if (responseLook.ok) {
          const dataLook = await responseLook.json();
          // Controlamos que realmente haya devuelto un look
          if (!dataLook || !dataLook.look) throw new Error("Sin respuesta de la IA");
          setDetectedLook(dataLook.look); 
          setUserData(prev => ({ ...prev, look: dataLook.look })); 
        } else {
          setDetectedLook("Desconocido");
        }
      } catch (error) {
        console.error('Error al procesar la foto:', error);
        // Si falla la IA detectando la foto, mostramos un aviso pero le dejamos elegir manual
        alert("Nuestra IA está un poco saturada ahora mismo y no ha podido analizar tu foto. Por favor, selecciona un look manualmente.");
        setSelected(null);
        setImagePreview(null);
      } finally {
        setIsDetectingLook(false);
      }
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setHasError(false);

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
        
        // 2. FETCH CON AUTH-TOKEN EN FRAGANCIA NIÑOS
        responseFragance = await fetch(urlFragancia, { 
          method: 'GET',
          headers: { 'auth-token': API_KEY }
        });

      } else {
        let finalLook = userData.look;
        let finalActitud = userData.attitude;
        let finalPlan = userData.plan;

        if (userData.lookImage && !detectedLook) {
          const formData = new FormData();
          formData.append('foto', userData.lookImage);

          // 3. FETCH CON AUTH-TOKEN SI SUBIÓ FOTO PERO NO SE PROCESÓ PREVIAMENTE
          const responseLook = await fetch(`${API_BASE_URL}/generateLook`, {
            method: 'POST',
            headers: { 'auth-token': API_KEY },
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
          // 4. FETCH CON AUTH-TOKEN AL GENERAR PLAN PERSONALIZADO
          const responsePlan = await fetch(`${API_BASE_URL}/generatePlan?${planParams.toString()}`, { 
            method: 'GET',
            headers: { 'auth-token': API_KEY }
          });
          if (responsePlan.ok) {
            const dataPlan = await responsePlan.json();
            finalPlan = dataPlan.plan; 
          }
        }

        const actitudesPredefinidas = ['seguridad', 'relajacion', 'sofisticacion', 'atrevimiento', 'coqueteria', 'energia'];
        if (userData.attitude && !actitudesPredefinidas.includes(userData.attitude.toLowerCase())) {
           const actitudParams = new URLSearchParams({ descripcion: userData.attitude });
           // 5. FETCH CON AUTH-TOKEN AL GENERAR ACTITUD PERSONALIZADA
           const responseActitudText = await fetch(`${API_BASE_URL}/generateActitud?${actitudParams.toString()}`, { 
             method: 'GET',
             headers: { 'auth-token': API_KEY }
           });
           
           if (responseActitudText.ok) {
              const dataActitudText = await responseActitudText.json();
              finalActitud = dataActitudText.actitud;
           }
        }

        const fraganceParams = new URLSearchParams({
          actitud: finalActitud || '', plan: finalPlan || '', look: finalLook || '', genero: userData.gender || ''
        });

        const urlFragancia = `${API_BASE_URL}/generateFraganceAdult?${fraganceParams.toString()}`;
        // 6. FETCH CON AUTH-TOKEN AL GENERAR FRAGANCIA ADULTOS
        responseFragance = await fetch(urlFragancia, { 
          method: 'GET',
          headers: { 'auth-token': API_KEY }
        });
      }

      if (!responseFragance.ok) throw new Error(`Error en el servidor: ${responseFragance.status}`);
      
      const dataFragance = await responseFragance.json();
      
      // NUEVO: Verificamos si la IA falló o devolvió un objeto vacío/inválido
      if (!dataFragance || dataFragance.error || (Array.isArray(dataFragance) && dataFragance.length === 0)) {
        throw new Error("La IA no ha devuelto ninguna fragancia");
      }

      setUserData(prev => ({ ...prev, fraganceData: dataFragance }));
      setIsLoading(false);
      onNext();

    } catch (error) {
      console.error('Error conectando con el backend:', error);
      setIsLoading(false);
      setHasError(true); // MOSTRAMOS LA PANTALLA DE ERROR
    }
  };

  // NUEVO: Pantalla de Error
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

  return (
    <main className="zara-view-analysis fade-in">
      <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div className="zara-logo" style={{ fontSize: '1.2rem' }}><strong>IN</strong> ESSENCE AI</div>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#000' }}>✕</button>
      </header>

      <div className="zara-tabs">
        <div className="zara-tab">Actitud</div>
        <div className="zara-tab">Plan</div>
        <div className="zara-tab active">Look</div>
      </div>

      <div className="zara-title-container">
        <h2 className="zara-title">¿Cuál es tu outfit?</h2>
        <p className="zara-subtitle">El estilo de hoy completa tu esencia.</p>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
        {imagePreview ? (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
            
            <img src={imagePreview} alt="Tu outfit" style={{ width: '100%', maxWidth: '280px', height: 'auto', objectFit: 'cover' }} />
            
            {isDetectingLook ? (
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '15px' }}>
                 <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <circle cx="12" cy="12" r="10" stroke="#e5e5e5" strokeWidth="2"/>
                   <path d="M12 2a10 10 0 0 1 10 10" stroke="#000" strokeWidth="2" strokeLinecap="round">
                     <animateTransform 
                       attributeName="transform" 
                       type="rotate" 
                       from="0 12 12" 
                       to="360 12 12" 
                       dur="0.8s" 
                       repeatCount="indefinite" 
                     />
                   </path>
                 </svg>
                 <p style={{ color: '#757575', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '12px', marginBottom: '0' }}>
                   Analizando...
                 </p>
               </div>
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