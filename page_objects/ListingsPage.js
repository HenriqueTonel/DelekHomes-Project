export class ListingsPage {
  constructor(page) {
    this.page = page;
    this.loginButton = page.locator('[href="/auth/login"]');
    this.registerButton = page.locator('[href="/auth/register"]');
    this.featuredListingsButton = page.locator('[href="/featured-listings');
    this.dashboardButton = page.locator('[href="/dashboard"]');
    this.searchBox = page.getByRole('textbox', { name: 'Search' });
    this.bedroomsBox = page.getByRole('button', { name: 'Bedrooms' });
    this.bedroomsDropdownMenuOption = page.locator('li.MuiMenuItem-root');
    this.stateBox = page.getByRole('button', { name: 'State' });
    this.cityBox = page.getByRole('textbox', { name: 'City' });
    this.minThumb = page.locator('span[data-index="0"]');
    this.maxThumb = page.locator('span[data-index="1"]');
    this.priceRail = page.locator('span.MuiSlider-rail');
    this.startSearchButton = page.locator('button').getByText('Start Search');
    this.estateObject = {
      resultFrame: page.locator('div.MuiGrid-grid-sm-6'),
      resultPrice: page
        .locator('div.MuiCard-root div.MuiBox-root div.MuiBox-root')
        .getByText('$'),
      resultFavoritesBox: page
        .locator('div.MuiGrid-grid-sm-6')
        .locator('svg[width="1em"]')
        .first(),
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

    this.darkModeSwitch = page.locator('input[type="checkbox"]');
  }

  /**
   * Fills the search box with the input keyword
   * @param {string} str - Keyword that will fill the search box
   */
  async fillKeywordSearchField(str) {
    await this.searchBox.fill(str);
  }

  /**
   * Selects the minimun bedrooms value based on the input
   * @param {number} int - Desired minimum amount of bedrooms to use in search
   */
  async selectMinimumBedroomsSearchOption(int) {
    const bedroomsQuantity = `${int}+`;

    await this.bedroomsBox.click();
    await this.bedroomsDropdownMenuOption.getByText(bedroomsQuantity).click();
  }

  /**
   * Fills the city box with the input value
   * @param {string} str - Desired name of the city to use in the search
   */
  async fillCitySearchField(str) {
    await this.cityBox.fill(str);
  }

  /**
   * Will modify the price rail to suit the input values. Min must be less than max
   * @param {number} min - Desired minimum price to use in search
   * @param {number} max - Desired maximum price to use in search
   */
  async modifyPriceSearchRail(min, max) {
    const priceRailBox = await this.priceRail.boundingBox();

    let minCoordinate = (min / 100000) * (priceRailBox.width / 200);
    let maxCoordinate = (max / 100000) * (priceRailBox.width / 200);

    const x = priceRailBox.x;
    const y = priceRailBox.y;

    await this.minThumb.evaluate((el) => {
      el.style.pointerEvents = 'auto';
    });
    await this.maxThumb.evaluate((el) => {
      el.style.pointerEvents = 'auto';
    });
    if (min >= 10000000) {
      await this.maxThumb.hover();
      await this.page.mouse.down();
      await this.page.mouse.move(x + maxCoordinate, y);
      await this.page.mouse.up();

      await this.minThumb.hover();
      await this.page.mouse.down();
      await this.page.mouse.move(x + minCoordinate, y);
      await this.page.mouse.up();
    } else if (max <= 500000) {
      await this.minThumb.hover();
      await this.page.mouse.down();
      await this.page.mouse.move(x + minCoordinate, y);
      await this.page.mouse.up();

      await this.maxThumb.hover();
      await this.page.mouse.down();
      await this.page.mouse.move(x + maxCoordinate, y);
      await this.page.mouse.up();
    } else {
      await this.minThumb.hover();
      await this.page.mouse.down();
      await this.page.mouse.move(x + minCoordinate, y);
      await this.page.mouse.up();

      await this.maxThumb.hover();
      await this.page.mouse.down();
      await this.page.mouse.move(x + maxCoordinate, y);
      await this.page.mouse.up();
    }
  }
  async getCurrentMinPriceNumber() {
    const minThumbCurrentValueString = await this.minThumb
      .locator('input')
      .getAttribute('aria-valuenow');
    return Number(minThumbCurrentValueString);
  }

  async getCurrentMaxPriceNumber() {
    const maxThumbCurrentValueString = await this.maxThumb
      .locator('input')
      .getAttribute('aria-valuenow');
    return Number(maxThumbCurrentValueString);
  }
}
