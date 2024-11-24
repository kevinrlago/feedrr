// cypress/e2e/auth/login.cy.js
describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should login successfully', () => {
    cy.get('[data-testid=email]').type('test@example.com')
    cy.get('[data-testid=password]').type('password123')
    cy.get('[data-testid=submit]').click()
    cy.url().should('include', '/dashboard')
  })

  it('should show error with invalid credentials', () => {
    cy.get('[data-testid=email]').type('wrong@example.com')
    cy.get('[data-testid=password]').type('wrongpass')
    cy.get('[data-testid=submit]').click()
    cy.get('[data-testid=error-message]').should('be.visible')
  })
})