// frontend/cypress/e2e/users/user_roles.cy.js
describe('User Roles', () => {
    beforeEach(() => {
      cy.login('admin@example.com', 'adminpass123')
      cy.visit('/users')
    })
  
    it('should change user role', () => {
      cy.get('[data-testid=edit-user]').first().click()
      cy.get('[data-testid=role-select]').click()
      cy.get('[data-testid=role-validator]').click()
      cy.get('[data-testid=save-user]').click()
      cy.get('[data-testid=success-message]').should('be.visible')
    })
  
    it('should restrict access based on role', () => {
      cy.login('user@example.com', 'userpass123')
      cy.visit('/admin')
      cy.get('[data-testid=access-denied]').should('be.visible')
    })
  })