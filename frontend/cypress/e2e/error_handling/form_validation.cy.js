// frontend/cypress/e2e/error_handling/form_validation.cy.js
describe('Form Validation', () => {
    beforeEach(() => {
      cy.login('test@example.com', 'password123')
    })
  
    it('should validate required fields', () => {
      cy.visit('/feeds/add')
      cy.get('[data-testid=save-feed]').click()
      cy.get('[data-testid=name-error]').should('be.visible')
      cy.get('[data-testid=url-error]').should('be.visible')
    })
  
    it('should validate field formats', () => {
      cy.visit('/settings/notifications')
      cy.get('[data-testid=webhook-url]').type('invalid-url')
      cy.get('[data-testid=save-settings]').click()
      cy.get('[data-testid=url-format-error]').should('be.visible')
    })
  })