import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page_objects/LoginPage.js';
import { HomePage } from '../../page_objects/HomePage.js';
import { DashboardPage } from '../../page_objects/DashboardPage.js';
import {
  apiGetLoginToken,
  apiLogin,
  apiRegisterNewUserAndReturnJson,
} from '../../api/UsersApi.js';
import { faker } from '@faker-js/faker';

test.describe('Login', () => {
  let loginPage, homePage, dashboardPage;
  let newUserEmail,
    newUserPassword,
    newUserName,
    newUserSurname,
    newUserResponseBody;

  test.beforeEach(async ({ page, request }, testInfo) => {
    await page.goto(testInfo.project.use.env.baseUrl);
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    dashboardPage = new DashboardPage(page);

    if (
      !testInfo.title.includes('Should login with an existing Admin account')
    ) {
      newUserEmail = faker.internet.email({
        firstName: faker.person.firstName(),
        provider: 'test.com',
        allowSpecialCharacters: true,
      });
      newUserPassword = faker.internet.password();
      newUserName = faker.person.firstName();
      newUserSurname = 'Test';

      newUserResponseBody = await apiRegisterNewUserAndReturnJson(
        request,
        newUserEmail,
        false,
        newUserPassword,
        newUserSurname,
        newUserName
      );
    }
  });

  test('Should login with an existing Admin account', async ({
    page,
  }, testInfo) => {
    const adminEmail = testInfo.project.use.env.adminEmail;
    const adminPassword = testInfo.project.use.env.adminPassword;
    const displayRole = 'role: admin';

    await homePage.loginButton.click();

    await expect(page).toHaveURL('/auth/login', { timeout: 6000 });

    await loginPage.fillLoginFields(adminEmail, adminPassword);
    await loginPage.loginButton.click();

    const adminLoginResponse = await page.waitForResponse('/api/users/login');
    const adminLoginResponseBody = await adminLoginResponse.json();
    const adminFullName = `${adminLoginResponseBody.user.username} ${adminLoginResponseBody.user.user_surname}`;

    await expect(page).toHaveURL('/dashboard/user/profile', { timeout: 6000 });
    await expect(dashboardPage.fullUserNameText).toHaveText(adminFullName);
    await expect(dashboardPage.userRoleText).toHaveText(displayRole);
  });

  test('Should login with an existing User account', async ({ page }) => {
    const displayRole = 'role: user';

    await homePage.loginButton.click();

    await expect(page).toHaveURL('/auth/login', { timeout: 6000 });

    await loginPage.fillLoginFields(newUserEmail, newUserPassword);
    await loginPage.loginButton.click();

    const userFullName = `${newUserName} ${newUserSurname}`;

    await expect(page).toHaveURL('/dashboard/user/profile', { timeout: 6000 });
    await expect(dashboardPage.fullUserNameText).toHaveText(userFullName);
    await expect(dashboardPage.userRoleText).toHaveText(displayRole);
  });
  test('Should log out', async ({ page, request }, testInfo) => {
    await apiLogin(page, request, newUserEmail, newUserPassword);

    await page.goto(testInfo.project.use.env.baseUrl);

    await expect(homePage.dashboardButton).toBeVisible();

    await homePage.dashboardButton.click();

    await expect(page).toHaveURL('/dashboard/user/profile');

    await dashboardPage.userMenu.click();
    await dashboardPage.userMenuLogoutItem.click();

    await expect(page).toHaveURL('/auth/login');
  });

  test.afterEach('Teardown', async ({ request }, testInfo) => {
    if (newUserResponseBody) {
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
    newUserResponseBody = undefined;
  });
});
