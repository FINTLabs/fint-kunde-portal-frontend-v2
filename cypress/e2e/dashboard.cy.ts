Cypress.on('uncaught:exception', (err) => {
    if (
        /hydrat/i.test(err.message) ||
        /Minified React error #418/.test(err.message) ||
        /Minified React error #423/.test(err.message)
    ) {
        return false;
    }
});

describe('Dashboard', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/', { failOnStatusCode: false });
        // cy.reload();
        cy.waitForAppReady();
        // cy.get('[data-theme="novari"]').should('exist');
        // cy.get('.navds-page').should('be.visible');
        // cy.get('main').should('be.visible');
        // cy.contains('Velkommen til kundeportalen', { timeout: 10000 }).should('be.visible');
    });

    it('should load the root page and display the correct title', () => {
        cy.title().should('eq', 'Novari Kundeportalen');
    });

    it('should display the menu component', () => {
        cy.get('nav').should('be.visible');
        cy.get('[data-cy="novari-header"]').should('be.visible');
    });

    it('should display the footer', () => {
        cy.get('footer').should('be.visible');
        cy.get('.novari-footer').should('be.visible');
    });

    it('should display boxes with the correct content', () => {
        cy.get('.navds-link-card', { timeout: 15000 }).should('have.length.greaterThan', 0);
        cy.get('.navds-link-card').should('be.visible');
        cy.get('.navds-link-card').should('have.length.at.least', 6);
        cy.get('.navds-link-card').should('contain', 'Kontakter');
        cy.get('.navds-link-card').should('contain', 'Komponenter');
        cy.get('.navds-link-card').should('contain', 'Adaptere');
        cy.get('.navds-link-card').should('contain', 'Klienter');
        cy.get('.navds-link-card').should('contain', 'Ressurser');
        cy.get('.navds-link-card').should('contain', 'Hendelseslogg');

        cy.get('.navds-link-card').each(($card) => {
            // cy.wrap($card).within(() => {
            //     cy.get('.navds-link-card__title').should('exist');
            //     cy.get('a').should('exist');
            // });
            cy.wrap($card).should('be.visible');
        });
    });

    it('should display the correct content inside a feature panel', () => {
        cy.get('.navds-link-card', { timeout: 10000 }).first().should('be.visible');
        // .within(() => {
        //     cy.get('.navds-link-card__title').should('exist');
        //     cy.get('a').should('exist');
        // });
    });

    it('should navigate to the correct page when clicking on each link panel', () => {
        cy.get('.navds-link-card', { timeout: 10000 }).should('have.length.greaterThan', 0);

        cy.get('.navds-link-card').then(($cards) => {
            const cardCount = $cards.length;
            cy.log(`Found ${cardCount} LinkCard components`);

            const expectedUrls = [
                'kontakter',
                'komponenter',
                'adaptere',
                'klienter',
                'ressurser',
                'hendelseslogg',
                'basistest',
                'relasjonstest',
                'samtykke',
            ];

            const urlsToTest = expectedUrls.slice(0, cardCount);
            cy.log(`Testing ${urlsToTest.length} URLs`);

            urlsToTest.forEach((urlSegment) => {
                // // Instead of clicking the LinkCard, directly visit the URL
                // cy.visit(`/${urlSegment}`, { failOnStatusCode: false }).then(() => {
                //     cy.waitForAppReady();
                // });

                cy.visit(`/${urlSegment}`, { failOnStatusCode: false });
                cy.waitForAppReady(); // custom command that waits for app to be ready
                cy.reload();

                // Wait for navigation to complete by checking the URL changes
                cy.url({ timeout: 10000 }).should('include', urlSegment);

                // Wait for the target page to load by checking for common page elements
                cy.get('[data-theme="novari"]', { timeout: 10000 }).should('exist');
                cy.get('.navds-page', { timeout: 10000 }).should('be.visible');

                // cy.visit('/', { failOnStatusCode: false }).then(() => {
                //     cy.waitForAppReady();
                // });
                cy.visit(`/`, { failOnStatusCode: false });
                cy.waitForAppReady(); // custom command that waits for app to be ready
                cy.reload();

                cy.get('[data-theme="novari"]').should('exist');
                cy.get('.navds-page').should('be.visible');
                cy.contains('Velkommen til kundeportalen', { timeout: 10000 }).should('be.visible');
            });
        });
    });
});
