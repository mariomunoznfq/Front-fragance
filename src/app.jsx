// probando husky 3

import React, { useState } from 'react';
import ViewGender from './pages/Gender/ViewGender';
import ViewHome from './pages/Home/ViewHome';
import ViewAttitude from './pages/FlowAdults/ViewAttitude';
import ViewPlan from './pages/FlowAdults/ViewPlan';
import ViewLookAnalysis from './pages/FlowAdults/ViewLookAnalysis'; 
import ViewResult from './pages/Result/ViewResult'; 

import ViewKidsColor from './pages/FlowKids/ViewKidsColor';
import ViewKidsHero from './pages/FlowKids/ViewKidsHero';
import ViewKidsAnimal from './pages/FlowKids/ViewKidsAnimal';

import './styles/index.css';

function App() {
  const [currentStep, setCurrentStep] = useState(1);

  // Añadimos las variables de los niños a la mochila
  const [userData, setUserData] = useState({
    na: '',
    gender: '',
    attitude: '',
    plan: '',
    look: '',
    lookImage: null,
    kidsColor: '',    // <--- Nuevo
    kidsHero: '',     // <--- Nuevo
    kidsAnimal: '',   // <--- Nuevo
    fraganceData: null
  });

  const goNext = () => setCurrentStep(prev => prev + 1);
  const goBack = () => setCurrentStep(prev => prev - 1);
  
  const resetApp = () => {
    setUserData({ 
      name: userData.name, gender: '', attitude: '', plan: '', look: '', 
      lookImage: null, kidsColor: '', kidsHero: '', kidsAnimal: '', fraganceData: null 
    });
    setCurrentStep(1); 
  };

  // Variable para saber en qué ruta estamos
  const isKid = userData.gender === 'BOYS' || userData.gender === 'GIRLS';

  return (
    <div className="app-container">
      
      {currentStep === 1 && <ViewHome userName={userData.name} onNext={goNext} />}

      {currentStep === 2 && (
        <ViewGender onNext={goNext} onBack={goBack} userData={userData} setUserData={setUserData} />
      )}

      {/* PASO 3: Actitud (Adultos) o Color (Niños) */}
      {currentStep === 3 && (
        isKid 
          ? <ViewKidsColor onNext={goNext} onBack={goBack} userData={userData} setUserData={setUserData} />
          : <ViewAttitude onNext={goNext} onBack={goBack} setUserData={setUserData} userData={userData} />
      )}

      {/* PASO 4: Plan (Adultos) o Superhéroe (Niños) */}
      {currentStep === 4 && (
        isKid
          ? <ViewKidsHero onNext={goNext} onBack={goBack} userData={userData} setUserData={setUserData} />
          : <ViewPlan onNext={goNext} onBack={goBack} setUserData={setUserData} userData={userData} />
      )}

      {/* PASO 5: Look (Adultos) o Animal (Niños) */}
      {currentStep === 5 && (
        isKid
          ? <ViewKidsAnimal onNext={goNext} onBack={goBack} userData={userData} setUserData={setUserData} />
          : <ViewLookAnalysis onNext={goNext} onBack={goBack} userData={userData} setUserData={setUserData} />
      )}

      {currentStep === 6 && <ViewResult userData={userData} onReset={resetApp} />}
      
    </div>
  );
}

export default App;