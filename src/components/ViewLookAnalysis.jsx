import React, { useState, useRef, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

// 🌟 AQUÍ ESTÁ LA MAGIA DEL .ENV (Ya no hay localhost hardcodeado)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("🔥 LA URL DEL BACKEND ES:", API_BASE_URL);

// 1. EL JSON CON LAS 20 FOTOS DE TUS COLONIAS (Mezcla de Hombre y Mujer)
const fotosData = [
  { id: 1, alt: "MAN BLUE SPIRIT SUMMER", url: "https://static.zara.net/assets/public/910f/aa92/7d114758af38/3ee4cb0c51a2/20210295999-e1/20210295999-e1.jpg?ts=1771579120505&w=2400" },
  { id: 2, alt: "SEOUL SUMMER EDT", url: "https://static.zara.net/assets/public/6bcc/b26d/39a14d6f979c/6467f15eb51b/20210298999-e1/20210298999-e1.jpg?ts=1771579115174&w=2400" },
  { id: 3, alt: "FOR HIM SOLAR EDP", url: "https://static.zara.net/assets/public/905c/85ba/8d2743bd8469/a6b79228ca01/20210622999-e1/20210622999-e1.jpg?ts=1771579124193&w=2400" },
  { id: 4, alt: "BOGOSS VIBRANT LEATHER SUMMER", url: "https://static.zara.net/assets/public/bda8/6314/b32a4ca5895e/acacca372c3c/20210969999-e1/20210969999-e1.jpg?ts=1771579123064&w=2400" },
  { id: 5, alt: "VIBRANT LEATHER BOGOSS COCO SUEDE", url: "https://static.zara.net/assets/public/7f99/601e/a6534b69a785/a19b95ec14a5/20210370999-e1/20210370999-e1.jpg?ts=1772005841784&w=2400" },
  { id: 6, alt: "VANILLA COLLECTION 02 UNIQUE", url: "https://static.zara.net/assets/public/dd50/45a2/471e4e889af3/101a8d35c637/20213033999-e1/20213033999-e1.jpg?ts=1771579125828&w=2400" },
  { id: 7, alt: "909 A FRAGRANCE BY ZARA", url: "https://static.zara.net/assets/public/b21b/0f17/aae2449d9f91/7eaada0dcb7d/20210378999-e1/20210378999-e1.jpg?ts=1763977320753&w=2400" },
  { id: 8, alt: "TOBACCO COLLECTION RICH WARM", url: "https://static.zara.net/assets/public/7ba3/fbf2/a217448eaa47/b9ff06c32cfa/20210472999-e1/20210472999-e1.jpg?ts=1754558628492&w=2400" },
  { id: 9, alt: "VIBRANT LEATHER EDP", url: "https://static.zara.net/assets/public/b817/a38c/c2cd46759bcc/0c8c7c93b168/20210721999-e1/20210721999-e1.jpg?ts=1754321430865&w=2400" },
  { id: 10, alt: "SAND DESERT AT SUNSET", url: "https://static.zara.net/assets/public/1c1b/af6c/dd9e49cfa1c3/b87e2c81449b/20220320999-e1/20220320999-e1.jpg?ts=1755862487152&w=2400" },
  { id: 11, alt: "SOLAR MANGO EDP", url: "https://static.zara.net/assets/public/f920/4fa3/dfeb4b3fa5d5/f5402a33578c/20110787999-e1/20110787999-e1.jpg?ts=1769008146837&w=2400" },
  { id: 12, alt: "EXOTIC MARACUJA EDP", url: "https://static.zara.net/assets/public/3df7/91b5/b9394c11a15e/ac9ea62eaa9e/20110788999-e1/20110788999-e1.jpg?ts=1768919548746&w=2400" },
  { id: 13, alt: "RED ZARA TEMPTATION VANILLE", url: "https://static.zara.net/assets/public/c382/c701/f13a4d74a879/74f4ec4fb9c9/20110603999-e1/20110603999-e1.jpg?ts=1769005587835&w=2400" },
  { id: 14, alt: "ELEGANTLY TOKYO EDP", url: "https://static.zara.net/assets/public/fef3/4538/4efd4fadb87a/7e1bbbb35260/20110709999-000-e1/20110709999-000-e1.jpg?ts=1767089131773&w=2400" },
  { id: 15, alt: "FASHIONABLY LONDON EDP", url: "https://static.zara.net/assets/public/0464/fc5c/70bc4534aaf5/d68e1608d1ae/20110711999-e1/20110711999-e1.jpg?ts=1756222658879&w=2400" },
  { id: 16, alt: "GARDENIA EDP", url: "https://static.zara.net/assets/public/12a6/b519/2a1c4f43a349/1d37ff8a388a/20120827999-000-e1/20120827999-000-e1.jpg?ts=1751877456384&w=2400" },
  { id: 17, alt: "ORCHID EDP", url: "https://static.zara.net/assets/public/023a/5f76/5ee144ee8e2c/4b44964739ed/20120823999-000-e1/20120823999-000-e1.jpg?ts=1750934416355&w=2400" },
  { id: 18, alt: "PEONY EDP", url: "https://static.zara.net/assets/public/8699/257b/07e54be5ac7d/64c13e14b496/20120831999-e1/20120831999-e1.jpg?ts=1770292264633&w=2400" },
  { id: 19, alt: "HIBISCUS EDP", url: "https://static.zara.net/assets/public/822c/631d/e4394490a902/759b0f093bb4/20120830999-e1/20120830999-e1.jpg?ts=1770292263852&w=2400" },
  { id: 20, alt: "VIBRANT CARAMEL EDP", url: "https://static.zara.net/assets/public/5b1a/85c1/71734898879d/0ab7aec5c628/20120612999-000-e1/20120612999-000-e1.jpg?ts=1738760913032&w=2400" }
];

// 2. EL COMPONENTE DEL CARRUSEL DE CARGA (AHORA DESLIZANTE)
const LoadingCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === fotosData.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000); // 2 segundos para que pase fluido

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="view-ethereal fade-in" style={{ background: 'linear-gradient(180deg, #050510 0%, #100520 100%)', justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div className="flare flare-1" style={{ background: 'rgba(0, 255, 255, 0.15)', top: '-10%', left: '10%' }}></div>
      <div className="flare flare-4" style={{ background: 'rgba(128, 0, 255, 0.2)', bottom: '-15%', right: '5%' }}></div>
      
      <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        
        {/* EL MARCO DEL CARRUSEL (Hace de ventana) */}
        <div style={{ 
          width: '220px', 
          height: '300px', 
          overflow: 'hidden', 
          borderRadius: '20px', 
          border: '2px solid var(--cyan-glow, #00ffff)', 
          boxShadow: '0 0 30px rgba(0,255,255,0.2)', 
          backgroundColor: '#fff' 
        }}>
          
          {/* LA CINTA TRANSPORTADORA */}
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
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }}
                />
              </div>
            ))}
          </div>

        </div>

        {/* LOS TEXTOS CON SU PADDING Y SALTO DE LÍNEA */}
        <div style={{ padding: '0 20px', textAlign: 'center' }}>
          <h2 style={{ 
            color: 'white', 
            fontSize: '1.5rem', 
            fontWeight: '200', 
            letterSpacing: '4px', 
            marginTop: '30px',
            lineHeight: '1.4' 
          }}>
            PREPARANDO TUS <br/> <span className="text-glow">ESENCIAS</span>
          </h2>
          <p style={{ 
            color: 'var(--text-muted, #aaa)', 
            marginTop: '15px', 
            letterSpacing: '1px', 
            animation: 'pulseOrb 1.5s infinite alternate' 
          }}>
            Formulando la fragancia perfecta...
          </p>
        </div>

      </div>
    </main>
  );
};

// 3. TU COMPONENTE PRINCIPAL DE LOOK
function ViewLookAnalysis({ onNext, onBack, userData, setUserData }) {
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [isDetectingLook, setIsDetectingLook] = useState(false);
  const [detectedLook, setDetectedLook] = useState(null);
  
  const fileInputRef = useRef(null);

  const looks = [
    { id: 6, icon: '🤖', title: 'IA SCAN', desc: 'Sube o hazte una foto y deja que la IA decida.' },
    { id: 2, icon: '👔', title: 'ELEGANTE', desc: 'Traje, camisa o vestido sofisticado.' },
    { id: 3, icon: '👟', title: 'DEPORTIVO', desc: 'Ropa técnica, chándal y zapatillas.' },
    { id: 4, icon: '🛹', title: 'URBAN', desc: 'Estilo callejero, oversize y moderno.' },
    { id: 5, icon: '🌻', title: 'HIPPIE', desc: 'Tejidos naturales, colores y estilo libre.' },
    { id: 1, icon: '👕', title: 'CASUAL', desc: 'Vaqueros, ropa cómoda para el día a día.' },
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

      const options = {
        maxSizeMB: 0.9,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(imageFile, options);
        const imageUrl = URL.createObjectURL(compressedFile);
        setImagePreview(imageUrl);
        setSelected('IA SCAN');
        setUserData(prev => ({ ...prev, look: 'IA SCAN', lookImage: compressedFile }));

        const formData = new FormData();
        formData.append('foto', compressedFile);

        // 🌟 USAMOS LA VARIABLE API_BASE_URL AQUÍ
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
      let finalLook = userData.look;
      let finalActitud = userData.attitude;
      let finalPlan = userData.plan;

      if (userData.lookImage) {
        const formData = new FormData();
        formData.append('foto', userData.lookImage);

        // 🌟 USAMOS LA VARIABLE API_BASE_URL AQUÍ
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
        // 🌟 USAMOS LA VARIABLE API_BASE_URL AQUÍ
        const responsePlan = await fetch(`${API_BASE_URL}/generatePlan?${planParams.toString()}`, {
          method: 'GET'
        });
        if (responsePlan.ok) {
          const dataPlan = await responsePlan.json();
          finalPlan = dataPlan.plan; 
        }
      }

      const actitudesPredefinidas = ['seguridad', 'relajacion', 'sofisticacion', 'atrevimiento', 'coqueteria', 'energia'];
      
      if (userData.attitude && !actitudesPredefinidas.includes(userData.attitude.toLowerCase())) {
         const actitudParams = new URLSearchParams({ descripcion: userData.attitude });
         
         // 🌟 USAMOS LA VARIABLE API_BASE_URL AQUÍ
         const responseActitudText = await fetch(`${API_BASE_URL}/generateActitud?${actitudParams.toString()}`, {
           method: 'GET'
         });
         
         if (responseActitudText.ok) {
            const dataActitudText = await responseActitudText.json();
            finalActitud = dataActitudText.actitud;
         } else {
            console.error("Error al clasificar la actitud:", responseActitudText.status);
         }
      }

      const fraganceParams = new URLSearchParams({
        actitud: finalActitud || '',
        plan: finalPlan || '',
        look: finalLook || '',
        genero: userData.gender || ''
      });

      // 🌟 USAMOS LA VARIABLE API_BASE_URL AQUÍ
      const urlFragancia = `${API_BASE_URL}/generateFragance?${fraganceParams.toString()}`;
      const responseFragance = await fetch(urlFragancia, {
        method: 'GET'
      });
      
      if (!responseFragance.ok) throw new Error(`Error generateFragance: ${responseFragance.status}`);
      
      const dataFragance = await responseFragance.json();

      setUserData(prev => ({ 
        ...prev, 
        fraganceData: dataFragance 
      }));

      setIsLoading(false);
      onNext();

    } catch (error) {
      console.error('Error conectando con el backend:', error);
      alert("Hubo un error de conexión con el servidor. ¡Revisa la consola (F12)!");
      setIsLoading(false);
    }
  };

  // --- RENDERIZAMOS EL NUEVO CARRUSEL DESLIZANTE CON LAS COLONIAS ZARA ---
  if (isLoading) {
    return <LoadingCarousel />;
  }

  // --- LA PANTALLA PRINCIPAL ---
  return (
    <main className="view-ethereal fade-in" style={{ background: 'linear-gradient(180deg, #050510 0%, #100520 100%)' }}>
      
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleImageUpload} 
      />

      <div className="flare flare-1" style={{ background: 'rgba(0, 255, 255, 0.15)', top: '-10%', left: '10%' }}></div>
      <div className="flare flare-4" style={{ background: 'rgba(128, 0, 255, 0.2)', bottom: '-15%', right: '5%' }}></div>

      <header className="header-dark">
        <div className="logo-text"><strong>IN</strong> ESSENCE AI</div>
        <button className="btn-icon" onClick={onBack}>✕</button>
      </header>

      <div className="progress-tabs">
        <div className="tab">ACTITUD</div>
        <div className="tab">PLAN</div>
        <div className="tab active" style={{ borderColor: 'var(--cyan-glow)', color: 'var(--cyan-glow)' }}>LOOK</div>
      </div>

      <div className="question-header">
        <h2>¿CUÁL ES TU <span className="text-glow" style={{ textShadow: '0 0 15px var(--cyan-glow)' }}>OUTFIT</span>?</h2>
        <p>El estilo de hoy completa tu esencia.</p>
      </div>

      <div className="options-cloud scrollable">
        {imagePreview ? (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
            
            <img 
              src={imagePreview} 
              alt="Tu outfit" 
              style={{ width: '220px', height: '300px', objectFit: 'cover', borderRadius: '20px', border: '2px solid var(--cyan-glow)', boxShadow: '0 0 30px rgba(0,255,255,0.2)' }} 
            />
            
            {isDetectingLook ? (
               <p style={{ color: 'var(--cyan-glow)', fontSize: '1.2rem', animation: 'pulseOrb 1.5s infinite alternate' }}>
                 Escaneando prendas...
               </p>
            ) : (
               <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px 30px', borderRadius: '30px', border: '1px solid rgba(0, 255, 255, 0.5)', textAlign: 'center' }}>
                 <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '5px' }}>LA IA HA DETECTADO UN LOOK</p>
                 <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'white', letterSpacing: '2px' }}>
                   <span className="text-glow">{detectedLook ? detectedLook.toUpperCase() : 'DESCONOCIDO'}</span>
                 </h3>
               </div>
            )}

            <button className="btn-ghost" onClick={() => handleSelect('IA SCAN')} style={{ marginTop: '10px', maxWidth: '200px', padding: '10px' }}>
              REPETIR FOTO
            </button>
          </div>
        ) : (
          looks.map((item) => (
            <button 
              key={item.id}
              className={`glass-pill pill-row ${selected === item.title ? 'selected' : ''}`}
              onClick={() => handleSelect(item.title)}
              style={selected === item.title ? { borderColor: 'var(--cyan-glow)', boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)' } : {}}
            >
              <span className="pill-icon">{item.icon}</span>
              <div className="pill-text-group" style={{ textAlign: 'left' }}>
                <span className="pill-title">{item.title}</span>
                <span className="pill-desc">{item.desc}</span>
              </div>
            </button>
          ))
        )}
      </div>

      <footer className="footer-dark footer-double">
        <button className="btn-text btn-secondary" onClick={onBack} disabled={isLoading || isDetectingLook}>ATRÁS</button>
        <button 
          className={`btn-text ${selected && !isLoading && !isDetectingLook ? 'active' : ''}`} 
          style={selected && !isLoading && !isDetectingLook ? { background: 'var(--cyan-glow)', color: '#000', boxShadow: '0 0 20px var(--cyan-glow)' } : { opacity: 0.5 }}
          onClick={selected && !isLoading && !isDetectingLook ? handleAnalyze : null}
        >
          {isDetectingLook ? 'RECOMENDANDO...' : 'RECOMENDACIÓN'}
        </button>
      </footer>
    </main>
  );
}

export default ViewLookAnalysis;