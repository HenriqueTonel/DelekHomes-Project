import { faker, fakerEN_US } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';

/**
 * Will create a new listing through API 
 * Default parameters create listing with valid random data
 * @param {*} apiClient 
 * @param {*} token - Access token to account under which the listing will be created. Must have authorization Realtor or Admin to perform creation successfully
 * @param {URL} images - Desired image to use
 * @param {number} lotSize 
 * @param {number} sqft 
 * @param {number} garage 
 * @param {number} bathrooms 
 * @param {number} bedrooms 
 * @param {number} price 
 * @param {number} zipCode 
 * @param {string} state 
 * @param {string} city 
 * @param {string} address 
 * @param {string} description 
 * @param {string} title 
 * @param {boolean} isPublished - Determines if listing will be published publically
 * @returns JSON file related to the newly created listing
 */
export default async function apiCreateListing(
  apiClient,
  token,
  images = fs.createReadStream(
    path.resolve(__dirname, '../testData/defaulthouse.jpeg')
  ),
  lotSize = faker.number.int({ min: 1, max: 9999 }),
  sqft = faker.number.int({ min: 1, max: 9999 }),
  garage = faker.number.int({ min: 1, max: 4 }),
  bathrooms = 2,
  bedrooms = faker.number.int({ min: 1, max: 4 }),
  price = faker.number.int({ min: 500000, max: 10000000 }),
  zipCode = fakerEN_US.location.zipCode(),
  state = fakerEN_US.location.state({ abbreviated: true }),
  city = `${fakerEN_US.location.city()} ${faker.number.int({
    min: 1,
    max: 999,
  })}`,
  address = fakerEN_US.location.streetAddress(),
  description = faker.lorem.paragraphs(2),
  title = `Henrique's Test House ${faker.number.int({ min: 1, max: 1000000 })}`,
  isPublished = true
) {
  const data = {
    images: images,
    lotSize: lotSize,
    sqft: sqft,
    garage: garage,
    bathrooms: bathrooms,
    bedrooms: bedrooms,
    price: price,
    zipCode: zipCode,
    state: state,
    city: city,
    address: address,
    description: description,
    title: title,
    isPublished: isPublished,
  };
  const apiCreateListingResponse = await apiClient.post(
    '/api/estate-objects',
    {
      multipart: data,
      Authorization: `Bearer ${token}`,
    }
  );
  return await apiCreateListingResponse.json();
}
