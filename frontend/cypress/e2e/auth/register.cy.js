// cypress/e2e/auth/register.cy.js
describe('Register', () => {
  beforeEach(() => {
    cy.visit('/register')
  })

  it('should register new user', () => {
    const email = `test${Date.now()}@example.com`
    cy.get('[data-testid=email]').type(email)
    cy.get('[data-testid=password]').type('password123')
    cy.get('[data-testid=confirm-password]').type('password123')
    cy.get('[data-testid=submit]').click()
    cy.url().should('include', '/dashboard')
  })
})