import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('QA Visual Automatizado - VISTA.md', () => {
    const screenshotsDir = path.join(process.cwd(), 'public', 'docs', 'screenshots');

    test.beforeAll(() => {
        if (!fs.existsSync(screenshotsDir)) {
            fs.mkdirSync(screenshotsDir, { recursive: true });
        }
    });

    const vistas = [
        { name: 'tutor-clases-nueva', url: '/clases/nueva' },
        { name: 'admin-estudiantes', url: '/estudiantes' }
    ];

    for (const vista of vistas) {
        test(`Captura de pantalla Desktop & Mobile para ${vista.name}`, async ({ page }) => {
            // Set viewport for Desktop
            await page.setViewportSize({ width: 1440, height: 900 });
            await page.goto(vista.url);
            await page.waitForTimeout(1000); // Wait for anims
            await page.screenshot({ path: path.join(screenshotsDir, `${vista.name}-desktop.png`), fullPage: true });

            // Set viewport for Mobile
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto(vista.url);
            await page.waitForTimeout(1000); // Wait for anims
            await page.screenshot({ path: path.join(screenshotsDir, `${vista.name}-mobile.png`), fullPage: true });
        });
    }
});
