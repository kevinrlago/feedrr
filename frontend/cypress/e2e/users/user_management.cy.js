// cypress/e2e/users/user_management.cy.js
describe('User Management', () => {
  beforeEach(() => {
    cy.login('admin@example.com', 'adminpass123')
    cy.visit('/users')
  })

  it('should create new user', () => {
    cy.get('[data-testid=add-user]').click()
    cy.get('[data-testid=user-email]').type('newuser@example.com')
    cy.get('[data-testid=user-password]').type('password123')
    cy.get('[data-testid=user-role]').select('editor')
    cy.get('[data-testid=save-user]').click()
    cy.get('[data-testid=users-table]').should('contain', 'newuser@example.com')
  })

  it('should modify user roles', () => {
    cy.get('[data-testid=edit-user]').first().click()
    cy.get('[data-testid=user-role]').select('admin')
    cy.get('[data-testid=save-user]').click()
    cy.get('[data-testid=success-message]').should('be.visible')
  })
})