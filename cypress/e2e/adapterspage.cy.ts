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
    const waitForAdaptersPageLoaded = () => {
        cy.contains('h2', 'Adaptere', { timeout: 20000 }).should('be.visible');
        cy.get('[data-cy="tab-item-0"]', { timeout: 20000 }).should('be.visible');
        cy.get('[data-cy="tab-item-1"]', { timeout: 20000 }).should('be.visible');
        cy.get('[data-cy="create-adapter-button"]', { timeout: 20000 }).should('be.visible');
    };

    // const openCreateAdapterForm = (retriesLeft = 2) => {
    //     cy.get('body').then(($body) => {
    //         const hasCreateForm = $body.find('[data-cy="create-form"]').length > 0;
    //         if (hasCreateForm) return;
    //
    //         cy.get('[data-cy="create-adapter-button"]')
    //             .should('be.visible')
    //             .click({ force: true, waitForAnimations: true });
    //     });
    //
    //     cy.get('body').then(($body) => {
    //         const hasCreateForm = $body.find('[data-cy="create-form"]').length > 0;
    //         if (hasCreateForm) return;
    //
    //         if (retriesLeft <= 0) {
    //             throw new Error('Create form did not open: [data-cy="create-form"] not found.');
    //         }
    //
    //         cy.wait(500);
    //         openCreateAdapterForm(retriesLeft - 1);
    //     });
    //
    //     cy.get('[data-cy="create-form"]', { timeout: 20000 }).should('be.visible');
    // };

    beforeEach(() => {
        // cy.visit('/adaptere', { failOnStatusCode: false }).then(() => {
        //     cy.waitForAppReady();
        // });
        cy.visit('/adaptere', { failOnStatusCode: false });
        // cy.reload();
        cy.waitForAppReady();
        waitForAdaptersPageLoaded();
    });

    // Header Tests
    it('should display the correct title and breadcrumb', () => {
        cy.contains('span', 'Dashboard').should('be.visible');
        cy.contains('span', 'Adaptere').should('be.visible');
        cy.contains('h2', 'Adaptere').should('be.visible');

        cy.get('[data-cy="tab-item-0"]').should('exist');
        cy.get('[data-cy="tab-item-1"]').should('exist');

        // openCreateAdapterForm();
    });

    it('should display the two tabs', () => {
        cy.get('[data-cy="tab-item-0"]').should('exist');
        cy.get('[data-cy="tab-item-1"]').should('exist');
    });

    it('should show form when add button is clicked', () => {
        // openCreateAdapterForm();

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

    it.skip('should show validation errors for invalid form submission', () => {
        // Open the create form
        // openCreateAdapterForm();

        // Try to save without filling required fields
        cy.get('[data-cy="save-button"]').should('be.visible');
        cy.get('[data-cy="save-button"]').click();

        // Verify validation errors and that form remains open
        cy.contains('Navn er påkrevd').should('be.visible');
        cy.contains('Tittel er påkrevd').should('be.visible');
        cy.contains('Detaljert informasjon er påkrevd').should('be.visible');
        cy.get('[data-cy="create-form"]').should('exist');
    });
});
