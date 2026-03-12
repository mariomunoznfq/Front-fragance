import React from 'react';
import ViewLookAnalysis from './ViewLookAnalysis';

describe('Test Unitario Básico: Componente ViewLookAnalysis', () => {
  
  it('1. Renderiza los textos principales y la tarjeta de IA SCAN', () => {
    // Montamos el componente igual que hicimos en ViewGender
    cy.mount(
      <ViewLookAnalysis 
        userData={{ gender: 'WOMAN' }} 
        setUserData={() => {}} 
        onNext={() => {}} 
        onBack={() => {}} 
      />
    );

    // Comprobamos visualmente que la sección de IA existe
    cy.contains('¿Cuál es tu outfit?').should('be.visible');
    cy.contains('IA SCAN').should('be.visible');
    cy.contains('Sube una foto').should('be.visible');
  });

  it('2. Permite seleccionar un look manual (ej. ELEGANTE) y se marca visualmente', () => {
    cy.mount(
      <ViewLookAnalysis 
        userData={{ gender: 'WOMAN' }} 
        setUserData={() => {}} 
        onNext={() => {}} 
        onBack={() => {}} 
      />
    );

    // Hacemos clic en una tarjeta normal para ver si la interfaz reacciona
    cy.contains('button', 'ELEGANTE').click();

    // Comprobamos que se le añade la clase 'selected', igual que en los géneros
    cy.contains('button', 'ELEGANTE').should('have.class', 'selected');
  });

});