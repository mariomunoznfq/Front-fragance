import { useState, useEffect } from 'react';
import ViewHome from './components/viewhome';
import ViewAttitude from './components/viewAttitude';
import ViewPlan from './components/viewPlan';
import './index.css'; // Importamos todo nuestro diseño

function App() {
  // 1. EL ESTADO: ¿En qué pantalla estamos? (Empezamos en la 1)
const [currentStep, setCurrentStep] = useState(1);

  // 2. LA MOCHILA: Aquí guardamos todo lo que elige el usuario
const [userData, setUserData] = useState({
    name: '',
    attitude: '',
    plan: ''
});

  // 3. EFECTO INICIAL: Simulamos el nombre aleatorio al cargar la app
useEffect(() => {
    const nombres = ['Mario', 'María'];
    const nombreAleatorio = nombres[Math.floor(Math.random() * nombres.length)];
    // Actualizamos la mochila solo con el nombre
    setUserData(prevData => ({ ...prevData, name: nombreAleatorio }));
}, []);

  
const goNext = () => setCurrentStep(prev => prev + 1);
const goBack = () => setCurrentStep(prev => prev - 1);
  const goHome = () => setCurrentStep(1); // Para el botón de la X (cerrar)

  
  return (
    <div className="app-container">
      
      {/* VISTA 1: INICIO */}
      {currentStep === 1 && (
        <ViewHome 
          userName={userData.name} 
          onNext={goNext} 
        />
      )}

      {/* VISTA 2: ACTITUD */}
      {currentStep === 2 && (
        <ViewAttitude 
          onNext={goNext} 
          onClose={goHome} 
          setUserData={setUserData} 
        />
      )}

      {/* VISTA 3: PLAN */}
      {currentStep === 3 && (
        <ViewPlan 
          onNext={goNext} 
          onBack={goBack} 
          setUserData={setUserData} 
        />
      )}
      
    </div>
  );
}

export default App;