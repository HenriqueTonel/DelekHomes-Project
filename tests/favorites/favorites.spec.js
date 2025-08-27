import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page_objects/LoginPage.js';
import { ListingsPage } from '../../page_objects/ListingsPage.js';
import { faker } from '@faker-js/faker';
import apiCreateListing from '../../api/ListingsApi.js';
import {
  apiGetLoginToken,
  apiRegisterNewUserAndReturnJson,
  apiChangeUserRoleById,
} from '../../api/UsersApi.js';

test.describe('Favorite objects tests', () => {
  let loginPage,
    listingsPage,
    registerResponse,
    adminToken,
    apiToken,
    listingResponse;

  test.beforeAll(async ({ request }, testInfo) => {
    const adminEmail = testInfo.project.use.env.adminEmail;
    const adminPassword = testInfo.project.use.env.adminPassword;
    const newUserEmail = faker.internet.email(
      faker.internet.email({
        firstName: faker.person.firstName(),
        provider: 'test.com',
        allowSpecialCharacters: true,
      })
    );
    const newUserPassword = faker.internet.password();
    registerResponse = await apiRegisterNewUserAndReturnJson(
      request,
      newUserEmail,
      true,
      newUserPassword
    );
    const newUserId = registerResponse.user.id;
    adminToken = await apiGetLoginToken(request, adminEmail, adminPassword);
    await apiChangeUserRoleById(request, adminToken, newUserId, 'realtor');
    apiToken = await apiGetLoginToken(request, newUserEmail, newUserPassword);
    listingResponse = await apiCreateListing(request, apiToken);
  });

  test.beforeEach(async ({ page }, testInfo) => {
    loginPage = new LoginPage(page);
    listingsPage = new ListingsPage(page);

    await page.goto(`${testInfo.project.use.env.baseUrl}/auth/login`);
    await loginPage.fillLoginFields(
      testInfo.project.use.env.adminEmail,
      testInfo.project.use.env.adminPassword
    );
    await loginPage.loginButton.click();
    await page.waitForURL('/dashboard/user/profile');
  });

  test('User should be able to add object to favorites', async ({ page }, testInfo) => {
    const objectTitle = await listingResponse.title;

    await page.goto(`${testInfo.project.use.env.baseUrl}/featured-listings`);

    const objectFrame = await listingsPage.estateObject.resultFrame.filter({
      hasText: objectTitle,
    });

    await objectFrame.locator('svg[width="1em"]').first().click();
    await expect(
      objectFrame.locator('svg[width="1em"] path').first()
    ).toHaveCSS('fill', 'rgb(255, 0, 0)', { timeout: 5000 });

    await listingsPage.dashboardButton.click();

    await expect(objectFrame.locator(`text=${objectTitle}`)).toBeVisible();
  });

  test.afterAll('Teardown', async ({ request }) => {
    const objectId = listingResponse.id;
    await request.delete(`api/estate-objects/${objectId}`);
  });
});
