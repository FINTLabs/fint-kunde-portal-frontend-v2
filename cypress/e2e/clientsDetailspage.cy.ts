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

describe('Clients Details Page Tests', () => {
    beforeEach(() => {
        // cy.visit('/klienter/jennifer-test-test@client.fintlabs.no', {
        //     failOnStatusCode: false,
        // }).then(() => {
        //     cy.waitForAppReady();
        // });
        cy.visit('/klienter/jennifer-test-test@client.fintlabs.no', { failOnStatusCode: false });
        // cy.reload();
        cy.waitForAppReady();
    });

    it('should display the correct adapter name', () => {
        cy.get('[data-cy="page-title"]').should('contain', 'testing');
    });

    it('should display client details correctly', () => {
        // cy.get('[data-cy="detail-name"]').should('contain', 'jennifer-another-test');
        cy.get('[data-cy="details-Tittel"]').should('contain', 'testing');
        cy.get('[data-cy="details-Beskrivelse"]').should('contain', 'Used for testing');
    });

    it('should allow updating client details', () => {
        cy.get('[data-cy="edit-button"]').find('button').first().should('be.visible');
        cy.get('[data-cy="edit-button"]').find('button').first().should('not.be.disabled');
        cy.get('[data-cy="edit-button"]').find('button').first().click({ waitForAnimations: true });
        // cy.wait(1000);

        cy.get('input[type="text"]').should('have.length.greaterThan', 0);
        cy.log('Edit mode activated successfully');
        cy.get('[data-cy="edit-button"]').find('button').first().click();
    });

    it('should allow toggling components', () => {
        cy.get('[data-cy="component-toggle-fullmakt"]').should('be.visible');
        cy.get('[data-cy="component-toggle-fullmakt"]').should('not.be.disabled');
        cy.get('[data-cy="component-toggle-fullmakt"]').click();
        // cy.get('.navds-alert').should('exist');
    });

    it('should display client details', function () {
        cy.get('svg[aria-labelledby="title-_r_e_"]').click();
        // Page title changed. The 'Rediger' (Edit) button has changed to 'Lagre' (Save).
        cy.title().should('eq', 'Lagre');
        // The 'Tittel' (Title) field now displays 'testing'.
        cy.get('#textField-_r_40_').should('have.value', 'testing');
        // The 'Beskrivelse' (Description) field now displays 'Used for testing'.
        cy.get('#textField-_r_41_').should('have.value', 'Used for testing');
        // The 'Velg modelversjon' (Select model version) field now displays 'V3'.
        cy.get('#select-_r_42_ > option').should('have.length', 2);
        // The 'Velg modelversjon' (Select model version) field now displays 'V3'.
        cy.get('#select-_r_42_').should('have.value', 'V3');
        // An alert message titled 'Endringen i klienten' (The change in the client) has appeared.
        cy.get('h2.aksel-base-alert__title').should('contain.text', 'Endringen i klienten');
        // The alert message content is 'For at endringen skal tre i kraft, må nytt token hentes fra klienten'.
        cy.get('div.aksel-body-long').should(
            'contain.text',
            'For at endringen skal tre i kraft, må nytt token hentes fra klienten'
        );

        cy.get('div.aksel-hgrid > div.aksel-hstack > button:nth-child(1)').click();
        cy.get('#select-_r_42_').select('V4');
        // The 'Velg modelversjon' (Select model version) field now displays 'V4'.
        cy.get('#select-_r_42_').should('have.value', 'V4');

        cy.get(
            'path[d="M4 3.25a.75.75 0 0 0-.75.75v16c0 .414.336.75.75.75h16a.75.75 0 0 0 .75-.75V6a.75.75 0 0 0-.22-.53l-2-2a.75.75 0 0 0-.53-.22zm15.25 3.06-1.56-1.56h-.94V7a.75.75 0 0 1-.75.75H8A.75.75 0 0 1 7.25 7V4.75h-2.5v14.5h1.5V11a.75.75 0 0 1 .75-.75h10a.75.75 0 0 1 .75.75v8.25h1.5zm-3 12.94h-8.5v-7.5h8.5zm-1-14.5v1.5h-6.5v-1.5zm-6 9.25a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75m0 3a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75"]'
        ).click();
    });
});
