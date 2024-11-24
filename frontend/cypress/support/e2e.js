import './commands'

// Prevent uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})