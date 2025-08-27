import { faker } from '@faker-js/faker';

export class RegisterPage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.locator('[name="firstName"]');
    this.lastNameInput = page.locator('[name="lastName"]');
    this.emailInput = page.locator('[name="email"]');
    this.passwordInput = page.locator('[name="password"]');
    this.registerButton = page.locator('button:has-text("Register")');
    this.registerAsRealtorCheckbox = page.locator('input[type="checkbox"]')
  }

  /**
   * Will fill the register form with the input values
   * @param {string} firstName - Desired first name
   * @param {string} lastName - Desired last name
   * @param {string} email - Desired email
   * @param {string} password - Desired password
   * @param {boolean} isRealtor - Determines if the "Register as Realtor" checkbox will be checked
   */
  async fillRegisterForm(
    firstName = faker.person.firstName(),
    lastName = 'Test',
    email = faker.internet.email({
      "firstName": firstName,
      "provider": 'test.com',
      "allowSpecialCharacters": true,
    }),
    password = faker.internet.password(),
    isRealtor = false
  ) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    if (isRealtor) {
      this.registerAsRealtorCheckbox.check();
    }
  }
}
