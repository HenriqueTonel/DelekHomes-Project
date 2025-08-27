import { test as base, request } from '@playwright/test';
import { apiGetLoginToken } from '../api/UsersApi';
import apiCreateListing from '../api/ListingsApi';

export const test = base.extend({
  adminAuthenticatedPage: async ({ browser }, use, testInfo) => {
    const apiClient = await request.newContext();
    const adminToken = await apiGetLoginToken(
      apiClient,
      testInfo.project.use.env.adminEmail,
      testInfo.project.use.env.adminPassword
    );
    const context = await browser.newContext();
    await context.addInitScript((tokenValue) => {
      window.localStorage.setItem('accessToken', tokenValue);
    }, adminToken);

    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  createdListing: async ({}, use, testInfo) => {
    const apiClient = await request.newContext();
    const adminToken = await apiGetLoginToken(
      apiClient,
      testInfo.project.use.env.adminEmail,
      testInfo.project.use.env.adminPassword
    );
    const listing = await apiCreateListing(apiClient, adminToken);
    await use(listing);
    await apiClient.dispose();
  },
});
