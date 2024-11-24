// cypress/e2e/dashboard/dashboard_stats.cy.js
describe('Dashboard Statistics', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123')
    cy.visit('/dashboard')
  })

  it('should display correct statistics', () => {
    cy.get('[data-testid=total-feeds]').should('be.visible')
    cy.get('[data-testid=total-categories]').should('be.visible')
    cy.get('[data-testid=total-users]').should('be.visible')
  })

  it('should update realtime stats', () => {
    cy.createFeed('New Feed', 'https://example.com/feed')
    cy.visit('/dashboard')
    cy.get('[data-testid=total-feeds]').should('contain', '1')
  })
})