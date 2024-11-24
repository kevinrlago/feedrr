// cypress/e2e/settings/notifications.cy.js
describe('Notification Settings', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123')
    cy.visit('/settings/notifications')
  })

  it('should toggle notification preferences', () => {
    cy.get('[data-testid=email-notifications]').click()
    cy.get('[data-testid=telegram-notifications]').click()
    cy.get('[data-testid=save-notifications]').click()
    cy.get('[data-testid=success-message]').should('be.visible')
  })
})