// cypress/e2e/feeds/manage_feeds.cy.js
describe('Manage Feeds', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123')
    cy.visit('/feeds')
  })

  it('should edit feed', () => {
    cy.get('[data-testid=edit-feed]').first().click()
    cy.get('[data-testid=feed-name]').clear().type('Updated Feed')
    cy.get('[data-testid=save-feed]').click()
    cy.get('[data-testid=feed-list]').should('contain', 'Updated Feed')
  })

  it('should delete feed', () => {
    const feedName = 'Feed to Delete'
    cy.createFeed(feedName, 'https://example.com/rss')
    cy.get(`[data-testid=delete-${feedName}]`).click()
    cy.get('[data-testid=confirm-delete]').click()
    cy.get('[data-testid=feed-list]').should('not.contain', feedName)
  })
})