import {PlaywrightTestConfig, devices} from '@playwright/test';

const config: PlaywrightTestConfig = {
    testDir: './tests',
    testMatch: [
        '**/tests/backendTests.spec.ts',
        '**/tests/frontendTests.spec.ts',
        '**/tests/formTests.spec.ts'
    ],
    timeout: 15000,
    retries: 1,
    use: {
        headless: true,
        viewport: { width: 1280, height: 720 },
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
    },
    reporter: [
        ['list'], // Reporter en la terminal
        ['html', { outputFolder: 'playwright-report' }], // Reporter HTML
    ],
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
};

export default config;