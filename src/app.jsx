import React from 'react';
import { useState, useEffect } from 'react';
import ViewGender from './components/ViewGender'; // Ya estaba importado, ¡perfecto!
import ViewHome from './components/ViewHome';
import ViewAttitude from './components/ViewAttitude';
import ViewPlan from './components/ViewPlan';
import ViewLookAnalysis from './components/ViewLookAnalysis'; 
import ViewResult from './components/ViewResult'; 
import './index.css';

function App() {
  // 1. EL ESTADO: Controlamos la navegación
  const [currentStep, setCurrentStep] = useState(1);

  // 2. LA MOCHILA: Añadimos 'gender' y 'fraganceData' para que no falte nada
  const [userData, setUserData] = useState({
    name: '',
    gender: '',    // <--- Nueva propiedad
    attitude: '',
    plan: '',
    look: '',
    lookImage: null,
    fraganceData: null // Para guardar lo que responda el back
  });


  // 4. FUNCIONES DE NAVEGACIÓN
  const goNext = () => setCurrentStep(prev => prev + 1);
  const goBack = () => setCurrentStep(prev => prev - 1);
  const goHome = () => setCurrentStep(1); 
  
  const resetApp = () => {
    setUserData({ name: userData.name, gender: '', attitude: '', plan: '', look: '', lookImage: null, fraganceData: null });
    setCurrentStep(1); 
  };

  // 5. RENDERIZADO CON EL NUEVO PASO 2
  return (
    <div className="app-container">
      
      {/* VISTA 1: INICIO (Buenos días) */}
      {currentStep === 1 && (
        <ViewHome 
          userName={userData.name} 
          onNext={goNext} 
        />
      )}

      {/* VISTA 2: GÉNERO (Nueva pantalla insertada) */}
      {currentStep === 2 && (
        <ViewGender 
          onNext={goNext} 
          onBack={goBack} 
          userData={userData}
          setUserData={setUserData} 
        />
      )}

      {/* VISTA 3: ACTITUD (Ahora es el paso 3) */}
      {currentStep === 3 && (
        <ViewAttitude 
          onNext={goNext} 
          onBack={goBack} // Cambiado de goHome a goBack para que vuelva al género
          setUserData={setUserData} 
          userData={userData}
        />
      )}

      {/* VISTA 4: PLAN (Ahora es el paso 4) */}
      {currentStep === 4 && (
        <ViewPlan 
          onNext={goNext} 
          onBack={goBack} 
          setUserData={setUserData} 
          userData={userData}
        />
      )}

      {/* VISTA 5: LOOK (Ahora es el paso 5) */}
      {currentStep === 5 && (
        <ViewLookAnalysis 
          onNext={goNext} 
          onBack={goBack} 
          userData={userData} 
          setUserData={setUserData} 
        />
      )}

      {/* VISTA 6: RESULTADO FINAL (Ahora es el paso 6) */}
      {currentStep === 6 && (
        <ViewResult 
          userData={userData} 
          onReset={resetApp} 
        />
      )}
      
    </div>
  );
}

export default App;