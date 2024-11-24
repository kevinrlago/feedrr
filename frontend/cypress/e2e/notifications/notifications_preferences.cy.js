// frontend/cypress/e2e/notifications/notification_preferences.cy.js
describe('Notification Preferences', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123')
    cy.visit('/settings/notifications')
  })

  it('should save user notification preferences', () => {
    cy.get('[data-testid=feed-notifications]').click()
    cy.get('[data-testid=mention-notifications]').click()
    cy.get('[data-testid=daily-digest]').click()
    cy.get('[data-testid=save-preferences]').click()
    cy.get('[data-testid=success-message]').should('be.visible')
  })

  it('should validate notification settings', () => {
    cy.get('[data-testid=email-notifications]').click()
    cy.get('[data-testid=email-input]').should('be.visible')
    cy.get('[data-testid=email-input]').type('invalid-email')
    cy.get('[data-testid=save-preferences]').click()
    cy.get('[data-testid=validation-error]').should('be.visible')
  })
})

