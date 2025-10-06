/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err) => {
    if (
        /hydrat/i.test(err.message) ||
        /Minified React error #418/.test(err.message) ||
        /Minified React error #423/.test(err.message) ||
        /ResizeObserver loop completed with undelivered notifications/.test(err.message)
    ) {
        return false;
    }
});

describe('Adapter Form Validation Tests', () => {
    beforeEach(() => {
        cy.visit('/adaptere', { failOnStatusCode: false });
        // cy.reload();
        cy.waitForAppReady();
    });

    describe('Adapter Create Form - Basic Functionality', () => {
        it('should open the adapter create form', () => {
            // Click the add button
            cy.get('[data-cy="add-button"]').click();

            // Verify form is visible
            cy.get('[data-cy="create-form"]', { timeout: 10000 }).should('be.visible');

            // Verify form elements are present
            cy.get('[data-cy="input-name"]').should('be.visible');
            cy.get('[data-cy="input-description"]').should('be.visible');
            cy.get('[data-cy="input-detailedInfo"]').should('be.visible');
            cy.get('[data-cy="save-button"]').should('be.visible');
        });

        it('should display form fields correctly', () => {
            // Open form
            cy.get('[data-cy="add-button"]').click();
            cy.get('[data-cy="create-form"]', { timeout: 10000 }).should('be.visible');

            // Verify field labels are present (using label elements)
            cy.get('label').should('contain', 'Navn');
            cy.get('label').should('contain', 'Tittel');
            cy.get('label').should('contain', 'Beskrivelse');

            // Verify buttons
            cy.get('[data-cy="save-button"]').should('contain', 'Opprett');
            cy.get('button').contains('Avbryt').should('be.visible');
        });

        it('should allow typing in form fields', () => {
            // Open form
            cy.get('[data-cy="add-button"]').click();
            cy.get('[data-cy="create-form"]', { timeout: 10000 }).should('be.visible');

            // Type in name field
            cy.get('[data-cy="input-name"]').type('Test Adapter Name');
            cy.get('[data-cy="input-name"]').should('have.value', 'Test Adapter Name');

            // Type in description field
            cy.get('[data-cy="input-description"]').type('Test Description');
            cy.get('[data-cy="input-description"]').should('have.value', 'Test Description');

            // Type in detailed info field
            cy.get('[data-cy="input-detailedInfo"]').type('Test detailed information');
            cy.get('[data-cy="input-detailedInfo"]').should(
                'have.value',
                'Test detailed information'
            );
        });

        it('should clear form fields when cancel is clicked', () => {
            // Open form
            cy.get('[data-cy="add-button"]').click();
            cy.get('[data-cy="create-form"]', { timeout: 10000 }).should('be.visible');

            // Fill form fields
            cy.get('[data-cy="input-name"]').type('Test Adapter Name');
            cy.get('[data-cy="input-description"]').type('Test Description');
            cy.get('[data-cy="input-detailedInfo"]').type('Test detailed information');

            // Click cancel
            cy.get('button').contains('Avbryt').click();

            // Reopen form
            cy.get('[data-cy="add-button"]').click();
            cy.get('[data-cy="create-form"]', { timeout: 10000 }).should('be.visible');

            // Verify fields are cleared
            cy.get('[data-cy="input-name"]').should('have.value', '');
            cy.get('[data-cy="input-description"]').should('have.value', '');
            cy.get('[data-cy="input-detailedInfo"]').should('have.value', '');
        });
    });

    describe('Adapter Form Validation', () => {
        // beforeEach(() => {
        //     cy.visit('/adaptere/', { failOnStatusCode: false });
        //     cy.waitForAppReady(); // custom command that waits for app to be ready
        //     cy.reload();
        //     cy.get('[data-cy="add-button"]').click();
        //     cy.get('[data-cy="create-form"]', { timeout: 10000 }).should('be.visible');
        // });

        it('should allow submission when all fields are filled', () => {
            cy.get('[data-cy="add-button"]').click();
            cy.get('[data-cy="create-form"]', { timeout: 10000 }).should('be.visible');

            // Fill all required fields
            cy.get('[data-cy="input-name"]').type('Valid Adapter Name');
            cy.get('[data-cy="input-description"]').type('Valid Description');
            cy.get('[data-cy="input-detailedInfo"]').type('Valid detailed information');

            // Submit form
            cy.get('[data-cy="save-button"]').click();

            // Verify form submission
            cy.get('[data-cy="save-button"]').should('be.visible');
        });

        it('should handle form interaction correctly', () => {
            cy.get('[data-cy="add-button"]').click();
            cy.get('[data-cy="create-form"]', { timeout: 10000 }).should('be.visible');

            // Test typing and clearing individual fields
            cy.get('[data-cy="input-name"]').type('Test Name');
            cy.get('[data-cy="input-name"]').clear();
            cy.get('[data-cy="input-name"]').should('have.value', '');

            cy.get('[data-cy="input-description"]').type('Test Description');
            cy.get('[data-cy="input-description"]').clear();
            cy.get('[data-cy="input-description"]').should('have.value', '');

            cy.get('[data-cy="input-detailedInfo"]').type('Test Info');
            cy.get('[data-cy="input-detailedInfo"]').clear();
            cy.get('[data-cy="input-detailedInfo"]').should('have.value', '');
        });
    });

    describe('Adapter Form Accessibility', () => {
        it('should have proper form structure', () => {
            cy.get('[data-cy="add-button"]').click();
            cy.get('[data-cy="create-form"]', { timeout: 10000 }).should('be.visible');

            // Verify form heading
            cy.get('h2').should('contain', 'Opprett ny adapter');

            // Verify form fields have proper labels (using label elements)
            cy.get('label').should('contain', 'Navn');
            cy.get('label').should('contain', 'Tittel');
            cy.get('label').should('contain', 'Beskrivelse');
        });

        it('should support keyboard navigation', () => {
            cy.get('[data-cy="add-button"]').click();
            cy.get('[data-cy="create-form"]', { timeout: 10000 }).should('be.visible');

            // Focus first field
            cy.get('[data-cy="input-name"]').focus();
            cy.get('[data-cy="input-name"]').should('be.focused');

            // Test that fields can be focused individually (keyboard navigation simulation)
            cy.get('[data-cy="input-description"]').focus();
            cy.get('[data-cy="input-description"]').should('be.focused');

            // Test that fields can be focused individually (keyboard navigation simulation)
            cy.get('[data-cy="input-detailedInfo"]').focus();
            cy.get('[data-cy="input-detailedInfo"]').should('be.focused');
        });

        it('should have proper button accessibility', () => {
            cy.get('[data-cy="add-button"]').click();
            cy.get('[data-cy="create-form"]', { timeout: 10000 }).should('be.visible');

            // Verify buttons have proper titles/aria-labels
            cy.get('[data-cy="save-button"]').should('have.attr', 'title', 'Opprett');

            // Verify save button is focusable
            cy.get('[data-cy="save-button"]').focus();
            cy.get('[data-cy="save-button"]').should('be.focused');

            // Verify cancel button exists and is visible (but don't try to focus if it's not a button)
            cy.get('button').contains('Avbryt').should('be.visible');
        });
    });
});
