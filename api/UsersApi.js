import { faker } from '@faker-js/faker';

/**
 * Will perform login through API with the credentials
 * No default parameters
 * @param {*} page
 * @param {*} apiClient
 * @param {string} email - Desired email to login with
 * @param {string} password - Desired password to login with
 */
async function apiLogin(page, apiClient, email, password) {
  const apiLoginResponse = await apiClient.post('/api/users/login', {
    data: {
      email: email,
      password: password,
    },
  });

  const apiLoginResponseJson = await apiLoginResponse.json();

  await page.evaluate(
    (token) => localStorage.setItem('accessToken', token),
    apiLoginResponseJson.accessToken
  );

  return apiLoginResponseJson;
}

/**
 * Registers a new user through the API and returns the JSON response
 * Default parameters create user with random valid data
 * @param {*} apiClient
 * @param {string} email
 * @param {boolean} isRealtor
 * @param {string} password
 * @param {string} user_surname
 * @param {string} username
 * @returns new user's JSON response
 */
async function apiRegisterNewUserAndReturnJson(
  apiClient,
  email = faker.internet.email({
    firstName: faker.person.firstName(),
    provider: 'test.com',
    allowSpecialCharacters: true,
  }),
  isRealtor = 'false',
  password = faker.internet.password(),
  user_surname = 'Test',
  username = faker.person.firstName()
) {
  const apiRegisterResponse = await apiClient.post('/api/users/registration', {
    data: {
      email: email,
      isRealtor: isRealtor.toString(),
      password: password,
      user_surname: user_surname,
      username: username,
    },
  });
  const apiRegisterResponseJson = apiRegisterResponse.json();
  return apiRegisterResponseJson;
}

/**
 * Will change the role of a user. Needs admin authorization and the desired user's Id.
 * @param {*} apiClient 
 * @param {*} adminToken 
 * @param {number} userId - users Id
 * @param {string} desiredRole - 'admin', 'realtor', 'user'
 * @returns JSON response
 */
async function apiChangeUserRoleById(
  apiClient,
  adminToken,
  userId,
  desiredRole
) {
  const apiEditUserRole = await apiClient.put(`api/user/roles`, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
    data: {
      userId: userId,
      newRoleTypes: desiredRole,
    },
  });
  const apiEditUserRoleJson = apiEditUserRole.json();
  return apiEditUserRoleJson;
}

/**
 * Will return an access token related to account
 * No default parameters
 * @param {*} apiClient
 * @param {string} email - Desired email to use as login data
 * @param {string} password - Desired password to use as login data
 * @returns an access token
 */
async function apiGetLoginToken(apiClient, email, password) {
  const apiLoginResponse = await apiClient.post('/api/users/login', {
    data: {
      email: email,
      password: password,
    },
  });

  const apiLoginResponseJson = await apiLoginResponse.json();
  return apiLoginResponseJson.accessToken;
}


export {
  apiLogin,
  apiGetLoginToken,
  apiRegisterNewUserAndReturnJson,
  apiChangeUserRoleById,
};
