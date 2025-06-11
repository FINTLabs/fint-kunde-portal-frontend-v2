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

// describe('template spec', () => {
//     it('passes', () => {
//         // cy.viewport(1280, 720);
//         cy.viewport('macbook-15'); // Simulate a 15-inch MacBook screen
//
//         cy.visit('http://localhost:3000/', { failOnStatusCode: false });
//     });
// });
describe('Access Page Tests', () => {
    beforeEach(() => {
        // Visit the root page before each testA
        // cy.viewport('macbook-15'); // Simulate a 15-inch MacBook screen

        cy.visit('http://localhost:3000/', { failOnStatusCode: false });
    });

    it('should load the root page and display the correct title', () => {
        cy.visit('http://localhost:3000/klienter/jennifer-another-test@client.fintlabs.no', {
            failOnStatusCode: false,
        });
        cy.get('[data-cy="page-title"]').should('exist');
    });

    it('display the alert (no access)', () => {
        cy.visit('http://localhost:3000/klienter/jennifer-another-test@client.fintlabs.no', {
            failOnStatusCode: false,
        });
        cy.get('.navds-alert').should(
            'contain',
            'Tilgangsstyring for komponenter er ikke aktivert'
        );
    });
    it('should display the component list (has access)', () => {
        cy.visit('http://localhost:3000/klienter/jennifer-test-test@client.fintlabs.no', {
            failOnStatusCode: false,
        });
        cy.get('.navds-r-pb > .navds-pageblock').should('contain', 'Tilgangsstyring');
    });

    it('should allow checking and unchecking components', () => {
        cy.visit('http://localhost:3000/klienter/jennifer-test-test@client.fintlabs.no', {
            failOnStatusCode: false,
        });
        cy.get('#checkbox-r2v').click();
        cy.get('.navds-alert').should('exist');
    });

    it('should visit a resource page and display the correct title', () => {
        cy.visit(
            'http://localhost:3000/tilgang/jennifer-test-test@client.fintlabs.no/administrasjon-fullmakt',
            {
                failOnStatusCode: false,
            }
        );
        cy.get('[data-cy="page-title"]').should('contain', 'Tilgang - klienter');
    });

    it('should allow checking and unchecking resources', () => {
        cy.visit(
            'http://localhost:3000/tilgang/jennifer-test-test@client.fintlabs.no/administrasjon-fullmakt',
            {
                failOnStatusCode: false,
            }
        );
        cy.get('#checkbox-rv').click();
        cy.get('.navds-alert').should('exist');
    });

    it('should visit a field page and display the correct title', () => {
        cy.visit(
            'http://localhost:3000/tilgang/jennifer@client.test/administrasjon-fullmakt/Fullmakt',
            {
                failOnStatusCode: false,
            }
        );
        cy.get('[data-cy="page-title"]').should('contain', 'jennifer@client.test');
    });

    it('should allow edit button click + cancel click', () => {
        cy.visit(
            'http://localhost:3000/tilgang/jennifer@client.test/administrasjon-fullmakt/Fullmakt',
            {
                failOnStatusCode: false,
            }
        );
        cy.get('[data-cy="edit-button"]').click();
        cy.get('[data-cy="save-button"]').should('exist');
        cy.get('[data-cy="cancel-button"]').click();
    });
    it('should include writable and multiple buttons', () => {
        cy.visit(
            'http://localhost:3000/tilgang/jennifer@client.test/administrasjon-fullmakt/Fullmakt',
            {
                failOnStatusCode: false,
            }
        );
        cy.get('[data-cy="confirm-button"]').should('exist');
    });
});
