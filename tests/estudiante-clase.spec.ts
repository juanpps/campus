import { test, expect } from '@playwright/test';

test.describe('Flujo E2E - Visor de Clases Estudiante', () => {
    test('Debería cargar correctamente la interfaz y permitir marcar la clase como vista con micro-interacciones (Genius UX)', async ({ page }) => {
        // Interceptar llamadas a redes (Mockeo de DB requerido por política God Mode)
        await page.route('/api/drive/imagen/**', route => {
            route.fulfill({
                status: 200,
                contentType: 'image/svg+xml',
                body: '<svg xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ccc"/></svg>'
            });
        });

        // Navegar de forma independiente a la UI
        // Usamos el ID de mock para bypasear un fetch real a Firestore
        await page.goto('/clase/mock-test-id');

        // Validación Llama Vision UX (Touch Targets & Text Render)
        await expect(page.locator('h1')).toContainText('Clase Mock');
        await expect(page.locator('iframe')).toBeVisible();

        // Comprobar la micro-interacción y estado de error/loading
        const markBtn = page.getByTestId('mark-read-button');
        await expect(markBtn).toBeVisible();
        await expect(markBtn).toHaveText('Marcar como vista');

        // Simular el clic del estudiante
        await markBtn.click();

        // Validar estado local "loading" de Zustand o Hook
        await expect(markBtn).toContainText('Guardando...');
        await expect(markBtn).toBeDisabled();

        // Validar estado de éxito asíncrono y mutation UI (Verde Check)
        await expect(markBtn).toContainText('Vista', { timeout: 3000 });
        await expect(markBtn).toBeDisabled();
    });
});
