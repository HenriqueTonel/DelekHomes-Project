import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page_objects/LoginPage.js';
import { HomePage } from '../../page_objects/HomePage.js';
import { DashboardPage } from '../../page_objects/DashboardPage.js';
import { apiLogin, apiRegisterNewUserAndReturnJson } from '../../api/UsersApi.js';

test.describe('Login', () => {
  let loginPage, homePage, dashboardPage;
  let newUserEmail, newUserPassword, newUserName, newUserSurname;

  //beforeAll -> criar usuário
  //afterAll -> excluir usuário
  test.beforeAll(async (request, testInfo) => {
    const newUserResponse = await apiRegisterNewUserAndReturnJson(request, newUserEmail, false, newUserPassword,newUserSurname, newUserName);
    const newUserResponseBody = await newUserResponse.json();
    newUserEmail = newUserResponseBody.user.email;
    newUserPassword 
  });

  test.beforeEach(async ({ page }, testInfo) => {
    await page.goto(testInfo.project.use.env.baseUrl);
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('Should login with an existing Admin account', async ({
    page,
    request,
  }, testInfo) => {
    const adminEmail = testInfo.project.use.env.adminEmail;
    const adminPassword = testInfo.project.use.env.adminPassword;
    const displayRole = 'role: admin';

    await homePage.loginButton.click();

    expect(page).toHaveURL('/auth/login', { timeout: 6000 });

    await loginPage.fillLoginFields(adminEmail, adminPassword);
    await loginPage.loginButton.click();

    const adminLoginResponse = await page.waitForResponse('/api/users/login');
    const adminLoginResponseBody = await adminLoginResponse.json();
    const adminName = `${adminLoginResponseBody.user.username} ${adminLoginResponseBody.user.user_surname}`;

    expect(page).toHaveURL('/dashboard/user/profile', { timeout: 6000 });
    expect(dashboardPage.fullUserNameText).toHaveText(adminName);
    expect(dashboardPage.userRoleText).toHaveText(displayRole);
  });

  //Should login as user -> criar novo usuário no beforeAll


  test('Should log out', async ({ page, request }, testInfo) => {
    const adminEmail = testInfo.project.use.env.adminEmail;
    const adminPassword = testInfo.project.use.env.adminEmail;

    await apiLogin(page, request, adminEmail, adminPassword);
    await page.goto(testInfo.project.use.env.baseUrl);

    await 
  });
});
