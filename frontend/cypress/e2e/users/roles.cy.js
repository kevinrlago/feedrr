// cypress/e2e/users/roles.cy.js
describe('User Roles', () => {
  beforeEach(() => {
    cy.login('admin@example.com', 'adminpass123')
    cy.visit('/users')
  })

  it('should change user role', () => {
    cy.get('[data-testid=edit-user]').first().click()
    cy.get('[data-testid=role-select]').select('validator')
    cy.get('[data-testid=save]').click()
    cy.get('[data-testid=success-message]').should('be.visible')
  })
})