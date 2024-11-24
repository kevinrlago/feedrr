// cypress/e2e/notifications/notification_system.cy.js
describe('Notification System', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123')
  })

  it('should configure telegram notifications', () => {
    cy.visit('/settings/notifications/telegram')
    cy.get('[data-testid=bot-token]').type('test-token')
    cy.get('[data-testid=chat-id]').type('test-chat')
    cy.get('[data-testid=save-telegram]').click()
    cy.get('[data-testid=success-message]').should('be.visible')
  })

  it('should configure discord notifications', () => {
    cy.visit('/settings/notifications/discord')
    cy.get('[data-testid=webhook-url]').type('https://discord.webhook.test')
    cy.get('[data-testid=save-discord]').click()
    cy.get('[data-testid=success-message]').should('be.visible')
  })
})