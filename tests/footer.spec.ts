import { test, expect } from '@playwright/test';
import { spawn } from 'child_process';

let hugoProcess: any;

test.beforeAll(async () => {
  // Start Hugo server in the project directory
  const projectDir = '/Users/mickey/Repository/github.com/mickeyzzc/themes/hugo-themes-pretext';
  hugoProcess = spawn('hugo', ['server'], { cwd: projectDir, stdio: ['ignore', 'pipe', 'pipe'] });

  // Wait for the server to start by listening for a URL in stdout
  await new Promise<void>((resolve) => {
    const onData = (data: Buffer) => {
      const str = data.toString();
      if (str.includes('http://') || str.includes('https://') || str.includes('Watching for changes')) {
        hugoProcess.stdout.off('data', onData);
        resolve();
      }
    };
    hugoProcess.stdout.on('data', onData);
  });
});

test.afterAll(() => {
  if (hugoProcess) {
    hugoProcess.kill();
  }
});

test('Footer displays copyright year and site title', async ({ page }) => {
  await page.goto('http://localhost:1313/');
  const year = new Date().getFullYear();
  const siteTitle = 'My New Hugo Project';
  // The footer uses a class on the footer element
  const footer = page.locator('footer.site-footer');
  await expect(footer).toContainText(`© ${year} ${siteTitle}`);
});
