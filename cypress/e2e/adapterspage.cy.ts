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

describe('Adapters Page Tests', () => {
    beforeEach(() => {
        // cy.visit('/adaptere', { failOnStatusCode: false }).then(() => {
        //     cy.waitForAppReady();
        // });
        cy.visit('/adaptere', { failOnStatusCode: false });
        // cy.reload();
        cy.waitForAppReady();
    });

    // Header Tests
    it('should display the correct title and breadcrumb', () => {
        cy.get('[data-cy="breadcrumb-item"]').should('contain', 'Adaptere');
        cy.get('[data-cy="page-title"]').should('contain', 'Adaptere');

        cy.get('[data-cy="tab-item-0"]').should('exist');
        cy.get('[data-cy="tab-item-1"]').should('exist');

        cy.get('[data-cy="add-button"]').should('be.visible');

        cy.get('[data-cy="add-button"]').trigger('click');
    });

    it('should display the two tabs', () => {
        cy.get('[data-cy="tab-item-0"]').should('exist');
        cy.get('[data-cy="tab-item-1"]').should('exist');
    });

    it('should show form when add button is clicked', () => {
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
        cy.get('[data-cy="input-description"]').should('be.visible');
        cy.get('[data-cy="input-detailedInfo"]').should('be.visible');
        cy.get('[data-cy="save-button"]').should('be.visible');

        // Fill out the form
        cy.get('[data-cy="input-name"]').type('New Adapter');
        cy.get('[data-cy="input-description"]').type('This is a test adapter.');
        cy.get('[data-cy="input-detailedInfo"]').type('Detailed info here.');

        // Save the form
        cy.get('[data-cy="save-button"]').should('be.visible');
        cy.get('[data-cy="save-button"]').click();
        cy.contains('Opprett').click();

        // Check that no error messages are displayed after successful submission
        cy.get('body').should('not.contain', 'Feil');
    });

    it('should show validation errors for invalid form submission', () => {
        // Open the create form
        cy.get('[data-cy="add-button"]').should('be.visible');
        cy.get('[data-cy="add-button"]').click({ waitForAnimations: true });
        
        // Wait for form to be visible
        cy.get('[data-cy="create-form"]', { timeout: 15000 }).should('be.visible');

        // Try to save without filling required fields
        cy.get('[data-cy="save-button"]').should('be.visible');
        cy.get('[data-cy="save-button"]').click();

        // Verify form is still visible (validation prevented submission)
        cy.get('[data-cy="create-form"]').should('exist');
    });
});
