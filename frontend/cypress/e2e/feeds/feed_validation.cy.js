// cypress/e2e/feeds/feed_validation.cy.js
describe('Feed Validation', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123')
    cy.visit('/feeds/add')
  })

  it('should validate RSS URL', () => {
    cy.get('[data-testid=feed-url]').type('not-a-url')
    cy.get('[data-testid=save]').click()
    cy.get('[data-testid=url-error]').should('be.visible')
  })
})