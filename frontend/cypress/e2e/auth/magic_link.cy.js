// cypress/e2e/auth/magic_link.cy.js
describe('Magic Link Login', () => {
  it('should request magic link', () => {
    cy.visit('/login')
    cy.get('[data-testid=magic-link]').click()
    cy.get('[data-testid=email]').type('test@example.com')
    cy.get('[data-testid=submit]').click()
    cy.get('[data-testid=success-message]').should('contain', 'magic link sent')
  })
})