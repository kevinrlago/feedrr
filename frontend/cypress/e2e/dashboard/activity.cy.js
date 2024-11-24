// cypress/e2e/dashboard/activity.cy.js
describe('Dashboard Activity', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123')
    cy.visit('/dashboard')
  })

  it('should display recent activity', () => {
    cy.get('[data-testid=activity-feed]').should('be.visible')
    cy.get('[data-testid=activity-item]').should('have.length.at.least', 1)
  })
})