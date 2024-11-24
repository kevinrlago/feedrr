// cypress/e2e/auth/password_reset.cy.js
describe('Password Reset', () => {
  it('should request password reset', () => {
    cy.visit('/forgot-password')
    cy.get('[data-testid=email]').type('test@example.com')
    cy.get('[data-testid=submit]').click()
    cy.get('[data-testid=success-message]').should('contain', 'reset link sent')
  })
})