// frontend/cypress/e2e/users/user_permissions.cy.js
describe('User Permissions', () => {
    beforeEach(() => {
      cy.login('admin@example.com', 'adminpass123')
      cy.visit('/users/permissions')
    })
  
    it('should update user permissions', () => {
      cy.get('[data-testid=user-select]').first().click()
      cy.get('[data-testid=permission-manage-feeds]').click()
      cy.get('[data-testid=permission-manage-categories]').click()
      cy.get('[data-testid=save-permissions]').click()
      cy.get('[data-testid=success-message]').should('be.visible')
    })
  })