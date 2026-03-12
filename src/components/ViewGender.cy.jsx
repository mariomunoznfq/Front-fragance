import React from 'react';
import ViewGender from './ViewGender';

describe('Test Unitario Básico: Componente ViewGender', () => {
  
  it('1. Renderiza los textos y botones principales', () => {
    // Montamos el componente pasándole datos vacíos y funciones huecas () => {}
    cy.mount(
      <ViewGender 
        userData={{ gender: null }} 
        setUserData={() => {}} 
        onNext={() => {}} 
        onBack={() => {}} 
      />
    );

    // Comprobamos visualmente que los elementos existen
    cy.contains('¿Para quién es?').should('be.visible');
    cy.contains('WOMAN').should('be.visible');
    cy.contains('MAN').should('be.visible');
  });

  it('2. Permite seleccionar una opción y se marca visualmente', () => {
    cy.mount(
      <ViewGender 
        userData={{ gender: null }} 
        setUserData={() => {}} 
        onNext={() => {}} 
        onBack={() => {}} 
      />
    );

    // Hacemos clic en el botón de mujer
    cy.contains('button', 'WOMAN').click();

    // Vamos a comprobar que al hacer clic se le añade la clase "selected".:
    cy.contains('button', 'WOMAN').should('have.class', 'selected');
  });

});