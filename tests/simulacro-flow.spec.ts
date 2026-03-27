import { test, expect } from '@playwright/test';

test.describe('QA E2E - Simulacros Raptor Zero Trust', () => {
    test('Split-View: Validación de Timer y Envío ciego de pruebas', async ({ page }) => {
        // Interceptar el drive CDN proxy para renderizado veloz de QA
        await page.route('/api/drive/imagen/**', route => {
            route.fulfill({
                status: 200,
                contentType: 'image/svg+xml',
                body: '<svg xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ccc"/></svg>'
            });
        });

        // Mock API calificar (Test-Driven Development)
        await page.route('/api/simulacros/calificar', async (route) => {
            if (route.request().method() === 'POST') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ puntaje: 85, correctas: 8, total: 10, incorrectas: [1, 5] })
                });
            }
        });

        // Navegar y visualizar Split-View
        await page.goto('/simulacro/mock-test-id');

        // Heurística visual: Validar que existe el Timer superior
        const timerText = page.locator('text=59:');
        await expect(timerText).toBeVisible();

        // Seleccionar opciones (UI delegada generó botones circulares)
        // Clickeamos la Opción A de la pregunta 1
        const btnA = page.locator('button', { hasText: '^A$' }).first();
        await btnA.click();
        await expect(btnA).toHaveClass(/bg-primary/); // QA CSS Visual Feedback

        // Botón God Mode: Submit
        const btnSubmit = page.getByTestId('submit-simulacro');
        await btnSubmit.click();

        // Desactivar UI inmediatamente para no provocar race condition en Firebase
        await expect(btnSubmit).toBeDisabled();
        await expect(btnSubmit).toContainText('Evaluando en el Servidor');

        // Toast PWA nativo tras evaluación exitosa
        const successToast = page.locator('text=Simulacro evaluado con éxito');
        await expect(successToast).toBeVisible({ timeout: 4000 });
    });
});
