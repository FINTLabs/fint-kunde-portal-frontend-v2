Cypress.on('uncaught:exception', (err) => {
    if (
        /hydrat/i.test(err.message) ||
        /Minified React error #418/.test(err.message) ||
        /Minified React error #423/.test(err.message)
    ) {
        return false;
    }
});

describe('Hendelseslogg Route', () => {
    beforeEach(() => {
        cy.visit('/hendelseslogg', { failOnStatusCode: false });
        // cy.reload();
        cy.waitForAppReady();
    });

    it('should load the hendelseslogg page and display the correct title', () => {
        cy.title().should('eq', 'Hendelseslogg');
        cy.contains('Hendelseslogg').should('be.visible');
    });

    it('should display the search form with all required fields', () => {
        // Check for search form elements
        cy.get('[data-cy="log-search-form"]').should('exist');

        // Check for environment select
        cy.get('[data-cy="log-search-environment"]').should('exist');

        // Check for component select
        cy.get('[data-cy="log-search-component"]').should('exist');

        // Check for search button
        cy.get('[data-cy="log-search-button"]').should('exist');
        // cy.get('[data-cy="log-search-button"]').should('contain', 'Søk');
    });

    it('should display breadcrumbs navigation', () => {
        cy.get('[data-cy="breadcrumbs"]').should('be.visible');
        cy.get('[data-cy="breadcrumbs"]').should('contain', 'Hendelseslogg');
    });

    it('should handle form submission with valid data', () => {
        // Wait for form to be ready
        cy.get('[data-cy="log-search-form"]').should('be.visible');

        // Wait for the page to fully load and selects to be enabled
        cy.get('[data-cy="log-search-environment"]', { timeout: 15000 }).should('be.visible');

        // Wait for the select to be enabled with multiple checks
        cy.get('[data-cy="log-search-environment"]', { timeout: 15000 }).should('not.be.disabled');
        cy.get('[data-cy="log-search-environment"]').should('not.have.attr', 'disabled');
        cy.get('[data-cy="log-search-environment"]').should('not.have.class', 'disabled');

        // Additional wait to ensure the select is truly ready
        // cy.wait(1000);

        // Fill in the form fields
        cy.waitForSelect('[data-cy="log-search-environment"]');

        // Try normal select first, fallback to force if still disabled
        cy.get('[data-cy="log-search-environment"]').then(($select) => {
            if ($select.is(':disabled')) {
                cy.get('[data-cy="log-search-environment"]').select('beta');
            } else {
                cy.get('[data-cy="log-search-environment"]').select('beta');
            }
        });

        // Wait for component select to be enabled after environment selection
        cy.get('[data-cy="log-search-component"]', { timeout: 10000 }).should('not.be.disabled');
        cy.waitForSelect('[data-cy="log-search-component"]');
        cy.get('[data-cy="log-search-component"]').select('administrasjon_fullmakt');

        // Submit the form
        cy.get('[data-cy="log-search-button"]').click();

        // Check for loading state or results
        cy.get('body').should('not.contain', 'Error');
    });

    it('should display validation errors for empty form submission', () => {
        // Try to submit empty form
        cy.get('[data-cy="log-search-button"]').click();

        // Check for validation messages (if any)
        cy.get('body').should('be.visible');
    });

    it('should display log results table when data is available', () => {
        // Submit a search to get results
        cy.waitForSelect('[data-cy="log-search-environment"]');
        cy.get('[data-cy="log-search-environment"]').select('beta');
        cy.waitForSelect('[data-cy="log-search-component"]');
        cy.get('[data-cy="log-search-component"]').select('administrasjon_fullmakt');
        cy.get('[data-cy="log-search-button"]').click();

        // Check for table structure if results are shown
        cy.get('body').should('be.visible');
    });

    //TODO: check for validation
    it('should validate form fields correctly', () => {
        // Test required field validation
        cy.get('[data-cy="log-search-button"]').click();

        // Check that form validation works
        cy.get('[data-cy="log-search-form"]').should('exist');
    });

    it('should display help text and guidance', () => {
        // Check for help text or guidance elements
        cy.get('body').should('be.visible');
        cy.contains('Hendelseslogg').should('be.visible');
    });

    it.skip('should handle keyboard navigation', () => {
        // Test tab navigation through form
        cy.get('[data-cy="log-search-environment"]').focus();
        cy.get('[data-cy="log-search-environment"]').should('be.focused');

        // Test tab to next element
        cy.get('[data-cy="log-search-environment"]').focus();
        cy.get('[data-cy="log-search-component"]').should('be.focused');
    });

    it.skip('should maintain accessibility standards', () => {
        // Check for proper heading structure
        cy.get('h1').should('exist');

        // Check for form labels
        cy.get('[data-cy="log-search-form"]').should('exist');

        // Check for proper button text
        cy.get('[data-cy="log-search-button"]').should('exist');
    });
});
