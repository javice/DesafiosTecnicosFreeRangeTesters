import { devices, defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    testMatch: [
        '**/tests/test_01_backendTests.spec.ts',
        '**/tests/test_02_frontendTests.spec.ts',
        '**/tests/test_03_formTests.spec.ts'
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
        ['list'],
        ['html', { outputFolder: 'playwright-report' }],
    ],
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});