import axios from "axios";
import axiosRetry from "axios-retry";
import * as secureStorage from "Storage";
import { StoredItems } from "Storage";
import { BASE_URL_DEV, URL_GET_TOKEN } from "./UrlPaths";
import { initializeMocks } from "./MockRequests";
import { checkAndRefreshExpiredAccessToken } from "./Authentication/AuthTokenStorage";
import AuthToken from "./Authentication/AuthToken";

const client = axios.create({ baseURL: BASE_URL_DEV });

axiosRetry(client, {
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 1000;
  },
  retryCondition: (error) => {
    // if retry condition is not specified, by default idempotent requests are retried
    return 500 <= error.response.status && error.response.status < 600;
  },
  retries: 3,
});

client.interceptors.request.use(
  async (config) => {
    //todo make this fetch and set parallel vs cost of making things parallel
    //do profiling, secure store has cache?
    //why await?
    // const accessToken = await secureStorage
    //   .load(StoredItems.ACCESS_TOKEN)
    //   .catch(() => null);
    // const refreshToken = await secureStorage
    //   .load(StoredItems.REFRESH_TOKEN)
    //   .catch(() => null);
    // if (accessToken) {
    //   config.headers.authentication = "Bearer: ".concat(accessToken);
    // }
    // if (refreshToken) {
    //   config.headers.refresh_token = refreshToken;
    // }
    //else if(not includes in non-auth urls) {
    //redirect to login page with correct nav.stack/can return to target url
    //}
    //ignoring refresh url as same
    if (!config.url?.includes(URL_GET_TOKEN)) {
      checkAndRefreshExpiredAccessToken();
      if (AuthToken.accessToken) {
        config.headers.authentication = "Bearer: ".concat(
          AuthToken.accessToken
        );
      }
      if (AuthToken.refreshToken) {
        config.headers.refresh_token = AuthToken.refreshToken;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
client.interceptors.response.use(
  async function (response) {
    return response;
  },
  function (error) {
    //todo cleanup
    //xxx if access token null, clear previous => only for /validate => clear in /validate
    //401 => login screen
    return Promise.reject(error);
  }
);

if (process.env.NODE_ENV == "development" || process.env.NODE_ENV == "test") {
  // initializeMocks(client);
}
export default client;
