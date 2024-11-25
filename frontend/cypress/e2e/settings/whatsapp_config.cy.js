// cypress/e2e/settings/whatsapp_config.cy.js
describe('WhatsApp Configuration', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123')
    cy.visit('/settings/whatsapp')
  })

  it('should configure API key', () => {
    cy.get('[data-testid=api-key]').type('test-key')
    cy.get('[data-testid=save]').click()
    cy.get('[data-testid=success-message]').should('be.visible')
  })
})