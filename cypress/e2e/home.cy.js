describe('Pantalla de inicio', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:5173')
  })

  it('debería mostrar el logo de IN ESSENCE AI', () => {
    cy.contains('IN ESSENCE AI').should('be.visible')
  })

  it('debería mostrar el botón de descubrir fragancia', () => {
    cy.contains('Descubrir mi fragancia').should('be.visible')
  })

  it('debería navegar a la siguiente pantalla al pulsar el botón', () => {
    cy.contains('Descubrir mi fragancia').click()
    cy.contains('¿Para quién es?').should('be.visible')
  })

})