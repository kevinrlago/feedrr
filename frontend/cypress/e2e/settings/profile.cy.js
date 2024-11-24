// cypress/e2e/settings/profile.cy.js
describe('Profile Settings', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123')
    cy.visit('/settings/profile')
  })

  it('should update profile information', () => {
    cy.get('[data-testid=display-name]').clear().type('New Name')
    cy.get('[data-testid=save-profile]').click()
    cy.get('[data-testid=success-message]').should('be.visible')
  })
})