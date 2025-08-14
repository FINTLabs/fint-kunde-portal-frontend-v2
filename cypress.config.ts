import { defineConfig } from 'cypress';

export default defineConfig({
    projectId: 'trg6th',
    e2e: {
        chromeWebSecurity: false,
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        env: {
            VITE_MOCK_CYPRESS: 'true',
        },
        viewportWidth: 1200,
        viewportHeight: 800,
    },
});
