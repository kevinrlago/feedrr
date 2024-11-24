// frontend/cypress/e2e/notifications/notification_history.cy.js
describe('Notification History', () => {
    beforeEach(() => {
      cy.login('test@example.com', 'password123')
      cy.visit('/notifications/history')
    })
  
    it('should display notification history', () => {
      cy.get('[data-testid=notification-list]').should('be.visible')
      cy.get('[data-testid=notification-item]').should('have.length.gt', 0)
    })
  
    it('should filter notifications by type', () => {
      cy.get('[data-testid=filter-dropdown]').click()
      cy.get('[data-testid=filter-feed]').click()
      cy.get('[data-testid=notification-item]').should('have.length.gt', 0)
    })
  })