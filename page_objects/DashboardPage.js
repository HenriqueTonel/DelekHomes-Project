export class DashboardPage {
  constructor(page) {
    this.fullUserNameText = page.locator('h6.MuiTypography-subtitle2');
    this.userRoleText = page
      .locator('p.MuiTypography-body2')
      .getByText('role:');
    this.userMenu = page.locator('button', {
      has: page.locator('div.MuiAvatar-circular'),
    });
    this.userMenuLogoutItem = page
      .locator('li[role="menuitem"]')
      .getByText('Logout');
this.estateObject = {
      resultFrame: page.locator('div.MuiGrid-grid-sm-6'),
      resultPrice: page
        .locator('div.MuiCard-root div.MuiBox-root div.MuiBox-root')
        .getByText('$'),
      resultFavoritesBox:  page.locator('div.MuiGrid-grid-sm-6').locator('svg'),
      resultTitle: page.locator('h5.MuiTypography-h5'),
      resultSqft: page.locator('div.MuiGrid-grid-xs-6').getByText('Sqft: '),
      resultBedrooms: page
        .locator('div.MuiGrid-grid-xs-6')
        .getByText('Bedrooms: '),
      resultCity: page.locator('div.MuiGrid-grid-xs-6').getByText('City: '),
      resultZip: page.locator('div.MuiGrid-grid-xs-6').getByText('Zip/Code: '),
      resultGarage: page.locator('div.MuiGrid-grid-xs-6').getByText('Garage: '),
      resultBathrooms: page
        .locator('div.MuiGrid-grid-xs-6')
        .getByText('Bathrooms: '),
      resultState: page.locator('div.MuiGrid-grid-xs-6').getByText('State: '),
      moreInfoButton: page.locator('a').getByText('More Info'),
    };
  }
}
