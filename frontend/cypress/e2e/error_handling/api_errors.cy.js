// frontend/cypress/e2e/error_handling/api_errors.cy.js
describe('API Error Handling', () => {
    beforeEach(() => {
      cy.login('test@example.com', 'password123')
    })
  
    it('should handle server errors gracefully', () => {
      cy.intercept('/api/feeds', { statusCode: 500 })
      cy.visit('/feeds')
      cy.get('[data-testid=server-error]').should('be.visible')
    })
  
    it('should handle unauthorized access', () => {
      cy.intercept('/api/admin/*', { statusCode: 403 })
      cy.visit('/admin')
      cy.get('[data-testid=unauthorized-error]').should('be.visible')
    })
  })