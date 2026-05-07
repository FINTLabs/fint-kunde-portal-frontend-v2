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
    const waitForAdapterDetailsLoaded = () => {
        cy.get('[data-cy="details-Tittel"]', { timeout: 20000 }).should('be.visible');
        cy.get('[data-cy="details-Beskrivelse"]', { timeout: 20000 }).should('be.visible');
        cy.get('[data-cy^="component-toggle-"]', { timeout: 20000 }).should(
            'have.length.at.least',
            1
        );
    };

    // const openAdapterEditMode = (retriesLeft = 2) => {
    //     cy.get('[data-cy="edit-button"] button')
    //         .first()
    //         .should('be.visible')
    //         .and('not.be.disabled')
    //         .click({ force: true, waitForAnimations: true });
    //
    //     cy.get('body').then(($body) => {
    //         const editFieldExists = $body.find('[data-cy="details-edit-Tittel"]').length > 0;
    //         if (editFieldExists) return;
    //
    //         if (retriesLeft <= 0) {
    //             throw new Error(
    //                 'Edit mode did not open: [data-cy="details-edit-Tittel"] not found.'
    //             );
    //         }
    //
    //         cy.wait(500);
    //         openAdapterEditMode(retriesLeft - 1);
    //     });
    // };

    beforeEach(() => {
        cy.visit('/adapter/jennifer-another-test@adapter.fintlabs.no', { failOnStatusCode: false });
        cy.waitForAppReady();
        waitForAdapterDetailsLoaded();
    });

    it('should display the correct adapter name', () => {
        cy.contains('h2', 'jennifer-another-test').should('be.visible');
    });

    it('should navigate back to adapter list', () => {
        cy.contains('a', 'Adaptere')
            .should('have.attr', 'href', '/adaptere')
            .invoke('attr', 'href')
            .then((href) => {
                cy.visit(href as string, { failOnStatusCode: false });
            });
        cy.location('pathname', { timeout: 10000 }).should('eq', '/adaptere');
        cy.contains('h2', 'Adaptere').should('be.visible');
    });

    it('should display adapter details correctly', () => {
        cy.get('[data-cy="details-Tittel"]').should('contain', 'test');
        cy.get('[data-cy="details-Beskrivelse"]').should('contain', 'test');
    });

    it.skip('should allow updating adapter details', () => {
        // openAdapterEditMode();
        cy.get('[data-cy="details-edit-Tittel"]', { timeout: 20000 }).should('be.visible');
        cy.get('[data-cy="details-edit-Tittel"]', { timeout: 20000 }).clear();
        cy.get('[data-cy="details-edit-Tittel"]').type('testing new description');

        cy.get('[data-cy="edit-button"] button').first().click({ force: true });
        cy.get('[data-cy="details-Tittel"]').should('contain', 'testing new description');
    });

    it('should allow toggling components', () => {
        cy.get('[data-cy^="component-toggle-"]')
            .first()
            .should('be.visible')
            .and('not.be.disabled');
        cy.get('[data-cy^="component-toggle-"]').first().click({ force: true });
    });
});
