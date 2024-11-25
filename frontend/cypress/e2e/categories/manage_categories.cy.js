// cypress/e2e/categories/manage_categories.cy.js
describe('Category Management', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123')
    cy.visit('/categories')
  })

  it('should create new category', () => {
    cy.get('[data-testid=add-category]').click()
    cy.get('[data-testid=category-name]').type('New Category')
    cy.get('[data-testid=save-category]').click()
    cy.get('[data-testid=category-list]').should('contain', 'New Category')
  })

  it('should edit category', () => {
    cy.get('[data-testid=edit-category]').first().click()
    cy.get('[data-testid=category-name]').clear().type('Updated Category')
    cy.get('[data-testid=save-category]').click()
    cy.get('[data-testid=category-list]').should('contain', 'Updated Category')
  })
})