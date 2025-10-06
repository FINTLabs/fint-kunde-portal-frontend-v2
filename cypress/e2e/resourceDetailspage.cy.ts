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

describe('Resource Details Page Tests', () => {
    beforeEach(() => {
        // cy.visit('/ressurser/udehenrik_fintlabs_no', { failOnStatusCode: false }).then(() => {
        //     cy.waitForAppReady();
        // });
        cy.visit('/ressurser/udehenrik_fintlabs_no', { failOnStatusCode: false });
        // cy.reload();
        cy.waitForAppReady();
    });

    // Cleanup after each test - log test results
    afterEach(function () {
        if (this.currentTest && this.currentTest.state === 'failed') {
            console.log('Test failed:', this.currentTest.title);
            return;
        }
    });

    it('should display the correct name', () => {
        cy.get('[data-cy="page-title"]').should('contain', 'Ressurser');
    });

    it('should navigate back to adapter list', () => {
        cy.get('[data-cy="back-button"]').click();
        cy.url().should('include', '/ressurser');
    });

    it('should display details correctly', () => {
        // cy.get('[data-cy="detail-name"]').should('contain', 'jennifer-another-test');
        cy.get('[data-cy="details-Name"]').should('contain', 'udehenrik_fintlabs_no');
        cy.get('[data-cy="details-resourceId"]').should('contain', 'udehenrik.fintlabs.no');
        cy.get('[data-cy="details-Beskrivelse"]').should('contain', 'yes');
    });

    it('should display the two tabs', () => {
        cy.get('[data-cy="tab-item-0"]').should('exist');
        cy.get('[data-cy="tab-item-1"]').should('exist');
    });

    it('should allow updating details', () => {
        cy.get('[data-cy="edit-button"]').click();
        cy.get('[data-cy="details-edit-Beskrivelse"]').should('exist');
        cy.get('[data-cy="details-edit-Beskrivelse"]').type('testing new description');
        cy.get('[data-cy="save-button"]').click();

        cy.get('.navds-alert').should('exist');
    });
});
