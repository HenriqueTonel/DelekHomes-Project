export class EstateObjectPage {
  constructor(page) {
    this.objectPrice = page
      .locator('div.MuiGrid-item MuiGrid-grid-xs-6')
      .getByText('Asking Price: ');
    this.objectTitle = page.locator('h3.MuiTypography-h3');
    this.objectSquareFeet = page
      .locator('div.MuiGrid-grid-xs-6')
      .getByText('Square Feet: ');
    this.objectBedrooms = page
      .locator('div.MuiGrid-grid-xs-6')
      .getByText('Bedrooms: ');
    this.objectGarage = page
      .locator('div.MuiGrid-grid-xs-6')
      .getByText('Garage: ');
    this.objectBathrooms = page
      .locator('div.MuiGrid-grid-xs-6')
      .getByText('Bathrooms: ');
  }
}
