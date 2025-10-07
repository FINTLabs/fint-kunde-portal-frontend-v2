/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err) => {
    // Cypress and React Hydrating the document don't get along
    // for some unknown reason. Hopefully, we figure out why eventually
    // so we can remove this.
    // https://github.com/remix-run/remix/issues/4822#issuecomment-1679195650
    // https://github.com/cypress-io/cypress/issues/27204
    if (
        /hydrat/i.test(err.message) ||
        /Minified React error #418/.test(err.message) ||
        /Minified React error #423/.test(err.message)
    ) {
        return false;
    }
});

describe('Clients Page Tests', () => {
    beforeEach(() => {
        // cy.visit('/klienter', { failOnStatusCode: false }).then(() => {
        //     cy.waitForAppReady();
        // });
        cy.visit('/klienter', { failOnStatusCode: false });
        // cy.reload();
        cy.waitForAppReady();
    });

    // Header Tests
    it('should display the correct title and breadcrumb', () => {
        cy.get('[data-cy="breadcrumb-item"]').should('contain', 'Klienter');
        cy.get('[data-cy="page-title"]').should('contain', 'Klienter');
    });

    it('should display the two tabs', () => {
        cy.get('[data-cy="tab-item-0"]').should('exist');
        cy.get('[data-cy="tab-item-1"]').should('exist');
    });

    it('should allow creating a new client', () => {
        // Wait for button to be ready
        cy.get('[data-cy="add-button"]').should('be.visible');

        // Retry clicking until form appears
        cy.get('[data-cy="add-button"]').click({ waitForAnimations: true });

        // Check if form appeared, if not, retry
        cy.get('body').then(($body) => {
            if ($body.find('[data-cy="create-form"]').length === 0) {
                cy.log('Form not visible after first click, retrying...');
                cy.get('[data-cy="add-button"]').click({ waitForAnimations: true });
            }
        });

        // Check again and retry if needed
        cy.get('body').then(($body) => {
            if ($body.find('[data-cy="create-form"]').length === 0) {
                cy.log('Form still not visible, retrying again...');
                cy.get('[data-cy="add-button"]').click({ waitForAnimations: true });
            }
        });

        // Final check and retry
        cy.get('body').then(($body) => {
            if ($body.find('[data-cy="create-form"]').length === 0) {
                cy.log('Form still not visible, final retry...');
                cy.get('[data-cy="add-button"]').click({ waitForAnimations: true });
            }
        });

        // Now wait for form to be visible
        cy.get('[data-cy="create-form"]', { timeout: 15000 }).should('be.visible');

        // Verify form elements are present
        cy.get('[data-cy="input-name"]').should('be.visible');
        cy.get('[data-cy="input-title"]').should('be.visible');
        cy.get('[data-cy="input-note"]').should('be.visible');
        cy.get('[data-cy="save-button"]').should('be.visible');

        // Fill out the form
        cy.get('[data-cy="input-name"]').type('New Client');
        cy.get('[data-cy="input-title"]').type('This is a test client.');
        cy.get('[data-cy="input-note"]').type('Detailed info here.');

        // Save the form
        cy.get('[data-cy="save-button"]').should('be.visible');
        cy.get('[data-cy="save-button"]').click();
        // cy.contains('Opprett').click();

        //cy.url().should('include', '/klienter/New Client');
    });

    it.skip('should navigate to client details on row click', () => {
        // Try to find and click a row
        cy.get('body').then(($body) => {
            if ($body.find('[data-cy="details-row"]').length > 0) {
                cy.log('Detail rows found, attempting click...');
                cy.get('[data-cy="details-row"]').first().should('be.visible');
                cy.get('[data-cy="details-row"]').first().click({ waitForAnimations: true });
                cy.get('[data-cy="details-row"]').first().trigger('click');
            }
            // else {
            //     cy.log('No detail rows found, trying alternative approach...');
            //     // Try clicking on any clickable element
            //     cy.get('body').then(($body) => {
            //         const clickableElements = $body.find('tr, .navds-tabs__tab, [role="tab"]');
            //         if (clickableElements.length > 0) {
            //             cy.log(
            //                 `Found ${clickableElements.length} clickable elements, trying first one...`
            //             );
            //             cy.wrap(clickableElements.first()).click({ waitForAnimations: true });
            //         }
            //     });
            // }
        });

        cy.waitForAppReady();
        cy.url().should('include', '/klienter/');
    });
});
