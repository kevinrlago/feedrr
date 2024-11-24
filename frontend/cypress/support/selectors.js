// cypress/support/selectors.js
export const selectors = {
  login: {
    email: '[data-testid=email]',
    password: '[data-testid=password]',
    submit: '[data-testid=submit]'
  },
  feeds: {
    list: '[data-testid=feed-list]',
    addButton: '[data-testid=add-feed]'
  }
  // ... más selectores
}