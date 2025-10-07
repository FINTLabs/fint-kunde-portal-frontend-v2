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

describe('Adapters Details Page Tests', () => {
    beforeEach(() => {
        // cy.visit('/adapter/jennifer-another-test@adapter.fintlabs.no', {
        //     failOnStatusCode: false }).then(() => {
        //     cy.waitForAppReady();
        // });
        cy.visit('/adapter/jennifer-another-test@adapter.fintlabs.no', { failOnStatusCode: false });
        cy.waitForAppReady();
    });

    it('should display the correct adapter name', () => {
        cy.get('[data-cy="page-title"]').should('contain', 'jennifer-another-test');
    });

    it('should navigate back to adapter list', () => {
        cy.get('[data-cy="back-button"]').click();
        // cy.reload();
        cy.waitForAppReady();
        cy.url().should('include', '/adapter');
    });

    it('should display adapter details correctly', () => {
        // cy.get('[data-cy="detail-name"]').should('contain', 'jennifer-another-test');
        cy.get('[data-cy="details-Tittel"]').should('contain', 'test');
        cy.get('[data-cy="details-Beskrivelse"]').should('contain', 'test');
    });

    it('should allow updating adapter details', () => {
        cy.get('[data-cy="edit-button"]').find('button').first().should('be.visible');
        cy.get('[data-cy="edit-button"]').find('button').first().should('not.be.disabled');
        cy.get('[data-cy="edit-button"]').find('button').first().click();

        cy.get('body').then(($body) => {
            if ($body.find('input[type="text"]').length > 0) {
                cy.log('Edit mode activated successfully');
                cy.get('input[type="text"]').should('have.length.greaterThan', 0);

                cy.get('[data-cy="details-edit-Tittel"]').clear();
                cy.get('[data-cy="details-edit-Tittel"]').type('testing new description');

                cy.get('[data-cy="edit-button"]').find('button').first().click();

                // cy.wait(3000);
                cy.get('.navds-alert').should('exist');
            } else {
                cy.log('Edit mode not activated - trying alternative approach');
                cy.get('[data-cy="edit-button"]').find('button').first().trigger('click');
                // cy.wait(2000);
                cy.get('input[type="text"]').should('have.length.greaterThan', 0);
            }
        });
    });

    it('should allow toggling components', () => {
        cy.get('[data-cy="component-toggle-fullmakt"]').should('be.visible');
        cy.get('[data-cy="component-toggle-fullmakt"]').should('not.be.disabled');
        cy.get('[data-cy="component-toggle-fullmakt"]').click();
        // cy.get('.navds-alert').should('exist');
    });
});
