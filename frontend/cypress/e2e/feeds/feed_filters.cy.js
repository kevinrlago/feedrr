// cypress/e2e/feeds/feed_filters.cy.js
describe('Feed Filters', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123')
    cy.visit('/feeds/1/filters')
  })

  it('should add whitelist word', () => {
    cy.get('[data-testid=filter-word]').type('python')
    cy.get('[data-testid=add-whitelist]').click()
    cy.get('[data-testid=whitelist]').should('contain', 'python')
  })

  it('should add blacklist word', () => {
    cy.get('[data-testid=filter-word]').type('spam')
    cy.get('[data-testid=add-blacklist]').click()
    cy.get('[data-testid=blacklist]').should('contain', 'spam')
  })
})