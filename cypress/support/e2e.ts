/// <reference types="cypress" />

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

// Start MSW in Cypress
import { setupWorker } from 'msw/browser';
import { handlers } from '../mocks/handlers';

const worker = setupWorker(...handlers);

before(() => {
    return worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
            url: '/mockServiceWorker.js',
        },
    }).catch((error) => {
        // Log error but don't fail the test suite
        // This allows tests to continue even if MSW fails to initialize
        console.warn('MSW failed to start:', error);
    });
});

after(() => {
    worker.stop();
});

// Reset handlers between tests
beforeEach(() => {
    worker.resetHandlers();
});

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
        interface Chainable {
            waitForAppReady(): Chainable<void>;
            waitForSearchInput(): Chainable<void>;
            waitForSelect(selector: string): Chainable<void>;
        }
    }
}

Cypress.Commands.add('waitForAppReady', () => {
    cy.reload();
    // Wait for shell to mount
    cy.get('[data-theme="novari"]').should('exist');
    cy.get('.navds-page').should('be.visible');
    cy.get('main').should('be.visible');
    // If you render a spinner during data load, wait for it to vanish
    //cy.get('[data-cy="spinner"]', { timeout: 15000 }).should('not.exist');
});

Cypress.Commands.add('waitForSearchInput', () => {
    // Wait for the search input to be visible and ready for interaction
    cy.get('[data-cy="search-input"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy="search-input"]').should('not.be.disabled');
    cy.get('[data-cy="search-input"]').should('be.enabled');

    // Optional: Wait for any loading states to complete
    cy.get('[data-cy="search-input"]').should('not.have.attr', 'aria-busy', 'true');
});

Cypress.Commands.add('waitForSelect', (selector: string) => {
    // Wait for the select element to be visible and ready for interaction
    cy.get(selector, { timeout: 10000 }).should('be.visible');

    // Wait for the select to be enabled (not disabled)
    cy.get(selector, { timeout: 10000 }).should('not.be.disabled');
    cy.get(selector).should('be.enabled');

    // Wait for options to be loaded (check that select has options)
    cy.get(selector).should('have.descendants', 'option');
    cy.get(selector).find('option').should('have.length.at.least', 1);

    // Wait for any loading states to complete
    cy.get(selector).should('not.have.attr', 'aria-busy', 'true');

    // Additional check: ensure the select is not disabled by checking the disabled attribute
    cy.get(selector).should('not.have.attr', 'disabled');
});

// Stop the run on first failure
// afterEach(function () {
//     const t = this.currentTest;
//     if (t && t.state === 'failed') {
//         // eslint-disable-next-line no-console
//         console.log('Test failed:', t.title);
//         Cypress.stop(); // available in Cypress 13.13+
//     }
// });
// Alternatively you can use CommonJS syntax:
// require('./commands')
