// cypress/e2e/feeds/create_feed.cy.js
describe('Create Feed', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123')
    cy.visit('/feeds')
  })

  it('should create new feed', () => {
    cy.createFeed('Test Feed', 'https://example.com/rss')
    cy.get('[data-testid=feed-list]').should('contain', 'Test Feed')
  })

  it('should validate invalid feed URL', () => {
    cy.createFeed('Invalid Feed', 'not-a-url')
    cy.get('[data-testid=url-error]').should('be.visible')
  })
})