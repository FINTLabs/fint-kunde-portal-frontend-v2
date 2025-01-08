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
describe('Dashboard', () => {
    beforeEach(() => {
        // Visit the root page before each testA
        // cy.viewport('macbook-15'); // Simulate a 15-inch MacBook screen

        cy.visit('http://localhost:3000/', { failOnStatusCode: false });
    });

    it('should load the root page and display the correct title', () => {
        cy.title().should('eq', 'Novari Kundeportalen'); // Check the title
    });

    it('should display the menu component', () => {
        cy.get('header.navds-box').should('exist'); // Assuming the Menu component is rendered inside a <nav> element
    });

    it('should display the footer', () => {
        cy.get('footer').should('exist');
    });

    it('should display features loaded from the API', () => {
        // Assuming the features are rendered inside CustomLinkPanel components
        cy.get('.my-custom-panel').should('have.length.greaterThan', 0); // Ensuring there are panels loaded
    });

    it('should display the correct content inside a feature panel', () => {
        cy.get('.my-custom-panel')
            .first()
            .within(() => {
                cy.get('.panel-title').should('exist');
            });
    });

    it('should navigate to the correct page when clicking on each link panel', () => {
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

        // Loop through each panel
        expectedUrls.forEach((urlSegment, index) => {
            // Click on each panel based on its index
            cy.get('.my-custom-panel').eq(index).click();

            // Ensure the URL contains the expected segment
            cy.url().should('include', urlSegment);

            // Return to the home page to click on the next panel
            cy.visit('http://localhost:3000/', { failOnStatusCode: false });
        });
    });
});
