// cypress/e2e/error_handling/error_states.cy.js
describe('Error Handling', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123')
  })

  it('should handle network errors gracefully', () => {
    cy.intercept('/api/feeds', { forceNetworkError: true })
    cy.visit('/feeds')
    cy.get('[data-testid=error-message]').should('be.visible')
  })

  it('should handle invalid form submissions', () => {
    cy.visit('/feeds/add')
    cy.get('[data-testid=save-feed]').click()
    cy.get('[data-testid=validation-error]').should('be.visible')
  })
})