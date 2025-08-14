// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your testA files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Set up MSW for server-side requests
if (Cypress.env('VITE_MOCK_CYPRESS')) {
    // This will be available to the Node.js environment
    process.env.VITE_MOCK_CYPRESS = 'true';
}

// Alternatively you can use CommonJS syntax:
// require('./commands')
