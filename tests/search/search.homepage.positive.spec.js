import { test, expect } from '@playwright/test';
import { HomePage } from '../../page_objects/HomePage.js';
import { ListingsPage } from '../../page_objects/ListingsPage.js';
import { apiCreateListing } from '../../api/ListingsApi.js';
import { apiGetLoginToken } from '../../api/UsersApi.js';

test.describe('Home Page Search Feature Positive Tests', () => {
  let homePage, listingsPage;
  let listingResponse;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    listingsPage = new ListingsPage(page);

    await page.goto('/');
    await homePage.darkModeSwitch.click();
  });

  test('Should search by keyword', async ( {request }, testInfo) => {
    const accessToken = await apiGetLoginToken(
      request,
      testInfo.project.use.env.adminEmail,
      testInfo.project.use.env.adminPassword
    );
    listingResponse = await apiCreateListing(request, accessToken);

    const keyword = listingResponse.title;
    const expectedAmount = 1;

    await homePage.fillKeywordSearchField(keyword);
    await homePage.startSearchButton.click();

    await expect(listingsPage.estateObject.resultTitle.first()).toBeVisible();
    await expect(listingsPage.estateObject.resultTitle.first()).toContainText(
      keyword,
      {
        timeout: 5000,
      }
    );
    await expect(listingsPage.estateObject.resultFrame).toHaveCount(
      expectedAmount
    );
  });

  test('Should search by bedrooms', async ({ page }) => {
    const searchBedroomsNum = 2;

    await homePage.selectMinimumBedroomsSearchOption(searchBedroomsNum);
    await homePage.startSearchButton.click();
    await page.waitForURL(`/**bedrooms=${searchBedroomsNum}**`);

    await expect(
      listingsPage.estateObject.resultBedrooms.first()
    ).toBeVisible();

    const resultBedroomsCounter =
      await listingsPage.estateObject.resultBedrooms.count();
    for (let i = 0; i < resultBedroomsCounter; i++) {
      let textContent = await listingsPage.estateObject.resultBedrooms
        .nth(i)
        .innerText();
      let match = parseInt(textContent.split(':')[1].trim(), 10);

      expect(match).toBeGreaterThanOrEqual(searchBedroomsNum);
    }
  });

  test('Should search by city', async ({ page, request }, testInfo) => {
    const accessToken = await apiGetLoginToken(
      request,
      testInfo.project.use.env.adminEmail,
      testInfo.project.use.env.adminPassword
    );
    listingResponse = await apiCreateListing(request, accessToken);
    const city = listingResponse.city;
    const cityURL = city.replaceAll(' ', '+');

    await homePage.fillCitySearchField(city);
    await homePage.startSearchButton.click();
    await page.waitForURL(`/**${cityURL}**`);

    await expect(listingsPage.estateObject.resultCity.first()).toContainText(
      city,
      { timeout: 6000 }
    );
  });

  test('Should search by price', async ({ page }) => {
    let minValue = 200000;
    let maxValue = 1000000;

    minValue = Math.floor(minValue / 100000) * 100000;
    maxValue = Math.ceil(maxValue / 100000) * 100000;

    await expect(homePage.animationElement.first()).toHaveCSS(
      'transform',
      'none',
      { timeout: 5000 }
    );

    await homePage.modifyPriceSearchRail(minValue, maxValue);
    const searchedMaxValue = await homePage.getCurrentMaxPriceNumber();
    const searchedMinValue = await homePage.getCurrentMinPriceNumber();
    await homePage.startSearchButton.click();

    await page.waitForURL(
      `/**?price=${searchedMinValue}-${searchedMaxValue}**`
    );
    await expect(listingsPage.estateObject.resultPrice.first()).toBeVisible();

    const resultPriceCount =
      await listingsPage.estateObject.resultPrice.count();
    for (let i = 0; i < resultPriceCount; i++) {
      let textContent = await listingsPage.estateObject.resultPrice
        .nth(i)
        .innerText();
      let match = parseInt(textContent.replace(/[^0-9]/g, ''), 10);

      expect(match).toBeGreaterThanOrEqual(searchedMinValue);
      expect(match).toBeLessThanOrEqual(searchedMaxValue);
    }
  });

  test.afterEach('Teardown', async ({ request }) => {
    if (listingResponse) {
      const objectId = listingResponse.id;
      await request.delete(`api/estate-objects/${objectId}`);
      listingResponse = undefined;
    }
  });
});
