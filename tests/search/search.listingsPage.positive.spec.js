import { test } from '../../fixtures/fixtures.js';
import { expect } from '@playwright/test';
import { HomePage } from '../../page_objects/HomePage.js';
import { ListingsPage } from '../../page_objects/ListingsPage.js';
import { EstateObjectPage } from '../../page_objects/EstateObjectPage.js';

test.describe('Featured Listings Page Search Feature Positive Tests', () => {
  let homePage, listingsPage, estateObjectPage;

  let resultTitle,
    resultSqftText,
    resultBedroomsText,
    resultGarageText,
    resultBathroomsText,
    resultSqftNum,
    resultBedroomsNum,
    resultGarageNum,
    resultBathroomsNum,
    objectTitle,
    objectSquareFeetText,
    objectBedroomsText,
    objectGarageText,
    objectBathroomsText,
    objectSquareFeetNum,
    objectBedroomsNum,
    objectGarageNum,
    objectBathroomsNum;

  test.beforeEach(async ({ adminAuthenticatedPage }, testInfo) => {
    homePage = new HomePage(adminAuthenticatedPage);
    listingsPage = new ListingsPage(adminAuthenticatedPage);
    estateObjectPage = new EstateObjectPage(adminAuthenticatedPage);

    await adminAuthenticatedPage.goto(
      `${testInfo.project.use.env.baseUrl}/featured-listings`
    );
    await homePage.darkModeSwitch.click();
  });

  test('Should search by keyword', async ({ createdListing }) => {
    const keyword = createdListing.title;
    const expectedAmount = 1;

    await listingsPage.fillKeywordSearchField(keyword);
    await listingsPage.startSearchButton.click();

    await expect(listingsPage.estateObject.resultTitle.first()).toBeVisible();
    await expect(listingsPage.estateObject.resultTitle.first()).toContainText(
      keyword,
      { timeout: 5000 }
    );
    await expect(listingsPage.estateObject.resultFrame).toHaveCount(
      expectedAmount
    );
  });

  test('Should search by bedrooms', async ({}) => {
    const searchBedroomsNum = 2;

    await listingsPage.selectMinimumBedroomsSearchOption(searchBedroomsNum);
    await listingsPage.startSearchButton.click();
    await listingsPage.page.waitForURL(`/**bedrooms=${searchBedroomsNum}**`);

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
    resultTitle = await listingsPage.estateObject.resultTitle
      .first()
      .textContent();
    resultSqftText = await listingsPage.estateObject.resultSqft
      .first()
      .textContent();
    resultBedroomsText = await listingsPage.estateObject.resultBedrooms
      .first()
      .textContent();
    resultGarageText = await listingsPage.estateObject.resultGarage
      .first()
      .textContent();
    resultBathroomsText = await listingsPage.estateObject.resultBathrooms
      .first()
      .textContent();
    resultSqftNum = parseInt(resultSqftText.replace(/[^0-9]/g, ''), 10);
    resultBedroomsNum = parseInt(resultBedroomsText.replace(/[^0-9]/g, ''), 10);
    resultGarageNum = parseInt(resultGarageText.replace(/[^0-9]/g, ''), 10);
    resultBathroomsNum = parseInt(
      resultBathroomsText.replace(/[^0-9]/g, ''),
      10
    );

    await listingsPage.estateObject.moreInfoButton.first().click();

    objectTitle = await estateObjectPage.objectTitle.textContent();
    objectSquareFeetText =
      await estateObjectPage.objectSquareFeet.textContent();
    objectBedroomsText = await estateObjectPage.objectBedrooms.textContent();
    objectGarageText = await estateObjectPage.objectGarage.textContent();
    objectBathroomsText = await estateObjectPage.objectBathrooms.textContent();
    objectSquareFeetNum = parseInt(
      objectSquareFeetText.replace(/[^0-9]/g, ''),
      10
    );
    objectBedroomsNum = parseInt(objectBedroomsText.replace(/[^0-9]/g, ''), 10);
    objectGarageNum = parseInt(objectGarageText.replace(/[^0-9]/g, ''), 10);
    objectBathroomsNum = parseInt(
      objectBathroomsText.replace(/[^0-9]/g, ''),
      10
    );

    expect(objectTitle).toBe(resultTitle);
    expect(objectSquareFeetNum).toBe(resultSqftNum);
    expect(objectBedroomsNum).toBe(resultBedroomsNum);
    expect(objectGarageNum).toBe(resultGarageNum);
    expect(objectBathroomsNum).toBe(resultBathroomsNum);
  });

  test('Should search by city', async ({ createdListing }) => {
    const city = createdListing.city;
    const cityURL = createdListing.city.replaceAll(' ', '+');

    await listingsPage.fillCitySearchField(city);
    await listingsPage.startSearchButton.click();
    await listingsPage.page.waitForURL(`/**${cityURL}**`);

    await expect(listingsPage.estateObject.resultCity.first()).toContainText(
      city
    );

    const resultCityCounter =
      await listingsPage.estateObject.resultCity.count();

    for (let i = 1; i < resultCityCounter; i++) {
      await expect(listingsPage.estateObject.resultCity.nth(i)).toContainText(
        city
      );
    }

    resultTitle = await listingsPage.estateObject.resultTitle
      .first()
      .textContent();
    resultSqftText = await listingsPage.estateObject.resultSqft
      .first()
      .textContent();
    resultBedroomsText = await listingsPage.estateObject.resultBedrooms
      .first()
      .textContent();
    resultGarageText = await listingsPage.estateObject.resultGarage
      .first()
      .textContent();
    resultBathroomsText = await listingsPage.estateObject.resultBathrooms
      .first()
      .textContent();
    resultSqftNum = parseInt(resultSqftText.replace(/[^0-9]/g, ''), 10);
    resultBedroomsNum = parseInt(resultBedroomsText.replace(/[^0-9]/g, ''), 10);
    resultGarageNum = parseInt(resultGarageText.replace(/[^0-9]/g, ''), 10);
    resultBathroomsNum = parseInt(
      resultBathroomsText.replace(/[^0-9]/g, ''),
      10
    );

    await listingsPage.estateObject.moreInfoButton.first().click();

    objectTitle = await estateObjectPage.objectTitle.textContent();
    objectSquareFeetText =
      await estateObjectPage.objectSquareFeet.textContent();
    objectBedroomsText = await estateObjectPage.objectBedrooms.textContent();
    objectGarageText = await estateObjectPage.objectGarage.textContent();
    objectBathroomsText = await estateObjectPage.objectBathrooms.textContent();
    objectSquareFeetNum = parseInt(
      objectSquareFeetText.replace(/[^0-9]/g, ''),
      10
    );
    objectBedroomsNum = parseInt(objectBedroomsText.replace(/[^0-9]/g, ''), 10);
    objectGarageNum = parseInt(objectGarageText.replace(/[^0-9]/g, ''), 10);
    objectBathroomsNum = parseInt(
      objectBathroomsText.replace(/[^0-9]/g, ''),
      10
    );

    expect(objectTitle).toBe(resultTitle);
    expect(objectSquareFeetNum).toBe(resultSqftNum);
    expect(objectBedroomsNum).toBe(resultBedroomsNum);
    expect(objectGarageNum).toBe(resultGarageNum);
    expect(objectBathroomsNum).toBe(resultBathroomsNum);
  });

  test('Should search by price', async ({ adminAuthenticatedPage }) => {
    let minValue = 200000;
    let maxValue = 1000000;

    minValue = Math.floor(minValue / 100000) * 100000;
    maxValue = Math.ceil(maxValue / 100000) * 100000;

    await listingsPage.modifyPriceSearchRail(minValue, maxValue);
    const searchedMaxValue = await listingsPage.getCurrentMaxPriceNumber();
    const searchedMinValue = await listingsPage.getCurrentMinPriceNumber();
    await listingsPage.startSearchButton.click();

    await adminAuthenticatedPage.waitForURL(
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
  test.afterAll('Teardown', async ({ request, createdListing }) => {
    const objectId = createdListing.id;
    await request.delete(`api/estate-objects/${objectId}`);
  });
});
