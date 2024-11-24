// cypress/e2e/settings/telegram_config.cy.js
describe('Telegram Configuration', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123')
    cy.visit('/settings/telegram')
  })

  it('should configure bot token', () => {
    cy.get('[data-testid=bot-token]').type('test-token')
    cy.get('[data-testid=save]').click()
    cy.get('[data-testid=success-message]').should('be.visible')
  })
})