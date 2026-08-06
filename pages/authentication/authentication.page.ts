import { BasePage } from '../base.page';
import { expect, Locator, Page } from '@playwright/test';

export class AuthenticationPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginBranding: Locator;
  readonly errorAlert: Locator;

  readonly usernameField = () => this.page.getByPlaceholder('Username');
  readonly passwordField = () => this.page.getByPlaceholder('Password');

  constructor(page: Page) {
    super(page);
    this.usernameInput = this.page.getByPlaceholder('Username');
    this.passwordInput = this.page.getByPlaceholder('Password');
    this.loginButton = this.page.getByRole('button', { name: /login/i });
    this.loginBranding = this.page.locator('.orangehrm-login-branding, img[alt="company-branding"]');
    this.errorAlert = this.page.getByText(/invalid credentials/i);
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.goto('/web/index.php/auth/login');
    const loginUrl = this.page.url();
    await this.usernameInput.waitFor({ state: 'visible', timeout: 30000 });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL((u) => u.toString() !== loginUrl, { timeout: 30000 });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.usernameInput).toBeVisible({ timeout: 30000 });
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async expectLoginError(): Promise<void> {
    await expect(this.errorAlert).toBeVisible({ timeout: 30000 });
  }
}