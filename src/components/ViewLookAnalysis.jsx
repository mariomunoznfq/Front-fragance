import React, { useState, useRef, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 1. EL DICCIONARIO DEFINITIVO (10 reales de cada género sacadas de tu JSON)
const fotosPorGenero = {
  MAN: [
    { id: 1, alt: "MAN GREEN SAVAGE", url: "https://static.zara.net/assets/public/a8d7/b27e/79c34c78b918/9962aec8f342/20210296999-e1/20210296999-e1.jpg?ts=1771579111090&w=2400" },
    { id: 2, alt: "MAN BLUE SPIRIT", url: "https://static.zara.net/assets/public/910f/aa92/7d114758af38/3ee4cb0c51a2/20210295999-e1/20210295999-e1.jpg?ts=1771579120505&w=2400" },
    { id: 3, alt: "SEOUL SUMMER", url: "https://static.zara.net/assets/public/6bcc/b26d/39a14d6f979c/6467f15eb51b/20210298999-e1/20210298999-e1.jpg?ts=1771579115174&w=2400" },
    { id: 4, alt: "SUMMER DISCOVERY", url: "https://static.zara.net/assets/public/2858/4d3a/7d664c66b31f/c6d254e094df/20210985999-e1/20210985999-e1.jpg?ts=1772121634140&w=2400" },
    { id: 5, alt: "VANILLA 01", url: "https://static.zara.net/assets/public/ab4c/0619/ec0d4df0b425/1c2d2a3a4f95/20213029999-e1/20213029999-e1.jpg?ts=1772092948546&w=2400" },
    { id: 6, alt: "VANILLA 02 COLD", url: "https://static.zara.net/assets/public/0bdb/1e90/01fb49819385/478482593e14/20213038999-e1/20213038999-e1.jpg?ts=1772119481642&w=2400" },
    { id: 7, alt: "VANILLA 02 UNIQUE", url: "https://static.zara.net/assets/public/dd50/45a2/471e4e889af3/101a8d35c637/20213033999-e1/20213033999-e1.jpg?ts=1771579125828&w=2400" },
    { id: 8, alt: "909 A FRAGRANCE", url: "https://static.zara.net/assets/public/b21b/0f17/aae2449d9f91/7eaada0dcb7d/20210378999-e1/20210378999-e1.jpg?ts=1763977320753&w=2400" },
    { id: 9, alt: "TOBACCO", url: "https://static.zara.net/assets/public/7ba3/fbf2/a217448eaa47/b9ff06c32cfa/20210472999-e1/20210472999-e1.jpg?ts=1754558628492&w=2400" },
    { id: 10, alt: "VIBRANT LEATHER", url: "https://static.zara.net/assets/public/b817/a38c/c2cd46759bcc/0c8c7c93b168/20210721999-e1/20210721999-e1.jpg?ts=1754321430865&w=2400" }
  ],
  WOMAN: [
    { id: 11, alt: "RED TEMPTATION", url: "https://static.zara.net/assets/public/a7e3/955f/b98a4058a6b0/eec42e652fb8/20110359999-e1/20110359999-e1.jpg?ts=1740128573629&w=2400" },
    { id: 12, alt: "GOLDEN DECADE", url: "https://static.zara.net/assets/public/14d1/98ad/493f4b79b7ee/f5d8f7cd258d/20110873999-e1/20110873999-e1.jpg?ts=1740138201328&w=2400" },
    { id: 13, alt: "RED TEMP VANILLE", url: "https://static.zara.net/assets/public/c382/c701/f13a4d74a879/74f4ec4fb9c9/20110603999-e1/20110603999-e1.jpg?ts=1769005587835&w=2400" },
    { id: 14, alt: "RED TEMP TOBACCO", url: "https://static.zara.net/assets/public/cbd4/e735/906c448f9c93/19da0bfc4280/20110604999-e1/20110604999-e1.jpg?ts=1769005587931&w=2400" },
    { id: 15, alt: "VIBRANT CARAMEL", url: "https://static.zara.net/assets/public/5b1a/85c1/71734898879d/0ab7aec5c628/20120612999-000-e1/20120612999-000-e1.jpg?ts=1738760913032&w=2400" },
    { id: 16, alt: "VIOLET BLOSSOM", url: "https://static.zara.net/assets/public/7096/febe/f9ff432da1a6/32477d79810e/20120927999-e1/20120927999-e1.jpg?ts=1735562701568&w=2400" },
    { id: 17, alt: "BERRY NIGHTFALL", url: "https://static.zara.net/assets/public/219c/5af7/00df4f998275/453a3361aaa5/20120594999-e1/20120594999-e1.jpg?ts=1767771928954&w=2400" },
    { id: 18, alt: "RED VANILLA", url: "https://static.zara.net/assets/public/89d5/08db/927944269f89/04ff47705585/20120840999-e1/20120840999-e1.jpg?ts=1770292264017&w=2400" },
    { id: 19, alt: "ELEGANTLY TOKYO", url: "https://static.zara.net/assets/public/fef3/4538/4efd4fadb87a/7e1bbbb35260/20110709999-000-e1/20110709999-000-e1.jpg?ts=1767089131773&w=2400" },
    { id: 20, alt: "ENERGETICALLY NY", url: "https://static.zara.net/assets/public/0af0/6278/613d4d5892c5/49f566e637e2/20110710999-e1/20110710999-e1.jpg?ts=1730996813624&w=2400" }
  ],
  BOYS: [
    { id: 21, alt: "ZARA TEAM 67", url: "https://static.zara.net/assets/public/1f00/1f40/782943a68247/a5aa35890c06/20310509999-e3/20310509999-e3.jpg?ts=1770907310680&w=2400" },
    { id: 22, alt: "STITCH BODY", url: "https://static.zara.net/assets/public/6dc2/65da/6502486aa92f/87a50ae93f51/20330026999-000-e1/20330026999-000-e1.jpg?ts=1759480193459&w=2400" },
    { id: 23, alt: "STITCH ANGEL", url: "https://static.zara.net/assets/public/8e31/7845/998e4dc59a9f/7a51f7ea33c6/20310422999-e1/20310422999-e1.jpg?ts=1762331290221&w=2400" },
    { id: 24, alt: "LILO STITCH", url: "https://static.zara.net/assets/public/a1cf/a998/abfb4239aa0c/002275eab095/20310377999-e1/20310377999-e1.jpg?ts=1759419899449&w=2400" },
    { id: 25, alt: "STITCH MIST", url: "https://static.zara.net/assets/public/271d/e4a4/ddcd421bbc6f/568ad236c6a7/20320067999-e1/20320067999-e1.jpg?ts=1762331244995&w=2400" },
    { id: 26, alt: "ZARA BABY", url: "https://static.zara.net/assets/public/3d7b/63ae/cff04f928a07/c7bdebdf4081/20310440999-e1/20310440999-e1.jpg?ts=1762510342213&w=2400" },
    { id: 27, alt: "SPIDERMAN", url: "https://static.zara.net/assets/public/87be/ab22/d55c4450b56d/955f26c2d426/20310385999-e1/20310385999-e1.jpg?ts=1747737462557&w=2400" },
    { id: 28, alt: "IRON MAN", url: "https://static.zara.net/assets/public/9a5e/10a7/9b9e4a4a9830/9358893cd0d9/20310427999-e1/20310427999-e1.jpg?ts=1738259952159&w=2400" },
    { id: 29, alt: "MANDALORIAN", url: "https://static.zara.net/assets/public/b1dd/e6ef/b82c4514bfce/b776c46ab391/20310383999-e1/20310383999-e1.jpg?ts=1747737460396&w=2400" },
    { id: 30, alt: "HULK", url: "https://static.zara.net/assets/public/0c04/a80c/26b94cf980b1/81880d9c9f8d/20310428999-e1/20310428999-e1.jpg?ts=1749208286814&w=2400" }
  ],
  GIRLS: [
    { id: 31, alt: "ABUELA FAVORITA", url: "https://static.zara.net/assets/public/e6ae/6e9b/3370487c8e10/ac748afcc138/20320076999-e1/20320076999-e1.jpg?ts=1772554449122&w=2400" },
    { id: 32, alt: "LE PETIT LULLABY", url: "https://static.zara.net/assets/public/efa8/75a3/9a6c48398d2c/90f71ef31536/20310392999-e1/20310392999-e1.jpg?ts=1755684653141&w=2400" },
    { id: 33, alt: "FROZEN", url: "https://static.zara.net/assets/public/7726/e1cf/bd084d489ed0/d3b6a0deac54/20310340999-e1/20310340999-e1.jpg?ts=1762170025627&w=2400" },
    { id: 34, alt: "GABBYS DOLL", url: "https://static.zara.net/assets/public/efee/2fda/bd1141398733/2b86dd1f01ab/20310475999-e1/20310475999-e1.jpg?ts=1761907777571&w=2400" },
    { id: 35, alt: "HOLIDAY MOOD", url: "https://static.zara.net/assets/public/0454/6eed/11e443fc8035/19e6c0f8c03e/20310442999-e1/20310442999-e1.jpg?ts=1747739751400&w=2400" },
    { id: 36, alt: "STRANGER THINGS", url: "https://static.zara.net/assets/public/d93b/2f8a/0d3443a7b147/bfb3ffcc1e78/20310471999-e1/20310471999-e1.jpg?ts=1763728583200&w=2400" },
    { id: 37, alt: "BLUEY", url: "https://static.zara.net/assets/public/4d5c/bcb8/237240d1a373/cc872ac04a03/20310397999-e1/20310397999-e1.jpg?ts=1741160148343&w=2400" },
    { id: 38, alt: "HELLO KITTY", url: "https://static.zara.net/assets/public/ffaf/7713/9de2475f81c8/31525fc26b1b/20310381999-000-e1/20310381999-000-e1.jpg?ts=1747319107871&w=2400" },
    { id: 39, alt: "KUROMI", url: "https://static.zara.net/assets/public/2ff7/18b0/7f7d4ed6bc0d/4bacfee57275/20310461999-e1/20310461999-e1.jpg?ts=1764086148207&w=2400" },
    { id: 40, alt: "MY MELODY", url: "https://static.zara.net/assets/public/cb48/7e4c/492a4294b8cc/1ba297e30aa9/20310462999-e1/20310462999-e1.jpg?ts=1764086162045&w=2400" }
  ]
};

// 2. COMPONENTE DEL CARRUSEL
const LoadingCarousel = ({ gender }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Elegimos las fotos según el género. Si hay un error, cargamos WOMAN.
  const fotosData = fotosPorGenero[gender] || fotosPorGenero['WOMAN'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === fotosData.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000); 

    return () => clearInterval(interval);
  }, [fotosData.length]);

  return (
    <main className="view-ethereal fade-in" style={{ background: 'linear-gradient(180deg, #050510 0%, #100520 100%)', justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div className="flare flare-1" style={{ background: 'rgba(0, 255, 255, 0.15)', top: '-10%', left: '10%' }}></div>
      <div className="flare flare-4" style={{ background: 'rgba(128, 0, 255, 0.2)', bottom: '-15%', right: '5%' }}></div>
      
      <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        
        <div style={{ 
          width: '220px', 
          height: '300px', 
          overflow: 'hidden', 
          borderRadius: '20px', 
          border: '2px solid var(--cyan-glow, #00ffff)', 
          boxShadow: '0 0 30px rgba(0,255,255,0.2)', 
          backgroundColor: '#fff' 
        }}>
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
        </div>

        <div style={{ padding: '0 20px', textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '200', letterSpacing: '4px', marginTop: '30px', lineHeight: '1.4' }}>
            PREPARANDO TUS <br/> <span className="text-glow">ESENCIAS</span>
          </h2>
          <p style={{ 
            color: 'var(--text-muted, #aaa)', 
            marginTop: '15px', 
            letterSpacing: '1px', 
            animation: 'pulseOrb 1.5s infinite alternate',
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
            margin: '15px 0 0 0'
          }}>
            Formulando la fragancia perfecta...
          </p>
        </div>

      </div>
    </main>
  );
};

// 3. COMPONENTE PRINCIPAL DE LOOK
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
        actitud: finalActitud || '',
        plan: finalPlan || '',
        look: finalLook || '',
        genero: userData.gender || ''
      });

      const urlFragancia = `${API_BASE_URL}/generateFraganceAdult?${fraganceParams.toString()}`;
      const responseFragance = await fetch(urlFragancia, { method: 'GET' });
      
      if (!responseFragance.ok) throw new Error(`Error generateFragance: ${responseFragance.status}`);
      
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

  // 🔥 EL CARRUSEL SE ALIMENTA DEL GÉNERO
  if (isLoading) {
    return <LoadingCarousel gender={userData.gender} />;
  }

  // --- LA PANTALLA PRINCIPAL ---
  return (
    <main className="view-ethereal fade-in" style={{ background: 'linear-gradient(180deg, #050510 0%, #100520 100%)' }}>
      <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />
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
            <img src={imagePreview} alt="Tu outfit" style={{ width: '220px', height: '300px', objectFit: 'cover', borderRadius: '20px', border: '2px solid var(--cyan-glow)', boxShadow: '0 0 30px rgba(0,255,255,0.2)' }} />
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