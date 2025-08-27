export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('[name="email"]');
    this.passwordInput = page.locator('[name="password"]');
    this.loginButton = page.locator('button.css-wmpqfy');
  }

  /**
   * Fills the login form with the input values
   * @param {string} email - Desired email
   * @param {string} password - Desired password
   */
  async fillLoginFields(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }
}
