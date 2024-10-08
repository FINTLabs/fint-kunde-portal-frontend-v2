import { defineConfig } from 'cypress';

export default defineConfig({
    projectId: 'trg6th',
    e2e: {
        chromeWebSecurity: false,
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        viewportWidth: 1200,
        viewportHeight: 800,
    },
});
