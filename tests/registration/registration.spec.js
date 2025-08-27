import { test, expect } from '@playwright/test';
import { apiGetLoginToken } from '../../api/UsersApi.js';
import { RegisterPage } from '../../page_objects/RegisterPage.js';
import { HomePage } from '../../page_objects/HomePage.js';
import { DashboardPage } from '../../page_objects/DashboardPage.js';
import { faker } from '@faker-js/faker';

test.describe('Registration scenarios', () => {
  let registerPage, homePage, dashboardPage;
  let newUserResponse;

  test.beforeEach(async ({ page }, testInfo) => {
    await page.goto(testInfo.project.use.env.baseUrl);
    registerPage = new RegisterPage(page);
    homePage = new HomePage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('Should register a new User', async ({ page }) => {
    const firstName = faker.person.firstName();
    const lastName = 'Test';
    const fullName = `${firstName} ${lastName}`;
    const displayRole = 'role: user';

    await homePage.registerButton.click();
    await registerPage.fillRegisterForm(firstName, lastName);
    await registerPage.registerButton.click();

    newUserResponse = await page.waitForResponse('/api/users/registration');

    await expect(page).toHaveURL('dashboard/user/profile', { timeout: 2000 });
    await expect(dashboardPage.fullUserNameText).toHaveText(fullName);
    await expect(dashboardPage.userRoleText).toHaveText(displayRole);
  });

  test('Should not register with an already registered email', async ({
    page,
  }, testInfo) => {
    const registeredEmail = testInfo.project.use.env.adminEmail;

    await homePage.registerButton.click();
    await registerPage.fillRegisterForm(
      undefined,
      undefined,
      registeredEmail,
      undefined
    );
    await registerPage.registerButton.click();

    const response = await page.waitForResponse(
      (res) =>
        res.url().includes('/api/users/registration') &&
        res.request().method() === 'POST'
    );
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.errors.username).toBe('Email must be unique.');
  });

  test('Should not register without filling in the required fields.', async ({
    page,
  }) => {
    await homePage.registerButton.click();
    await registerPage.registerButton.click();

    await expect(page.getByText('First name required')).toBeVisible();
    await expect(page.getByText('Last name required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test.afterEach('Teardown', async ({ request }, testInfo) => {
    if (newUserResponse) {
      const newUserResponseBody = await newUserResponse.json();
      const newUserId = newUserResponseBody.user.id;
      const adminToken = await apiGetLoginToken(
        request,
        testInfo.project.use.env.adminEmail,
        testInfo.project.use.env.adminPassword
      );
      await request.delete(`/api/users/${newUserId}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
    }
    newUserResponse = undefined;
  });
});
