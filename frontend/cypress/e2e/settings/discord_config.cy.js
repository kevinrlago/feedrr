// cypress/e2e/settings/discord_config.cy.js
describe('Discord Configuration', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123')
    cy.visit('/settings/discord')
  })

  it('should add webhook', () => {
    cy.get('[data-testid=webhook-url]').type('https://discord.webhook.test')
    cy.get('[data-testid=save]').click()
    cy.get('[data-testid=success-message]').should('be.visible')
  })
})