// cypress/support/commands.js
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('[data-testid=email]').type(email)
  cy.get('[data-testid=password]').type(password)
  cy.get('[data-testid=submit]').click()
})

Cypress.Commands.add('createFeed', (name, url) => {
  cy.get('[data-testid=add-feed]').click()
  cy.get('[data-testid=feed-name]').type(name)
  cy.get('[data-testid=feed-url]').type(url)
  cy.get('[data-testid=save-feed]').click()
})