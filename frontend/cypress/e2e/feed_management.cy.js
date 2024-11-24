// frontend/cypress/e2e/feed_management.cy.js
describe('Feed Management', () => {
  it('can create new feed', () => {
    cy.visit('/feeds')
    cy.get('[data-testid=add-feed]').click()
    cy.get('input[name=name]').type('Test Feed')
    cy.get('button[type=submit]').click()
    cy.contains('Feed created successfully')
  })
})