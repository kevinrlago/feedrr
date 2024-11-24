// cypress/e2e/integration/api_health.cy.js
describe('API Health Check', () => {
  it('backend api is healthy', () => {
    cy.request(Cypress.env('apiUrl') + '/health').then((response) => {
      expect(response.status).to.eq(200)
    })
  })
})