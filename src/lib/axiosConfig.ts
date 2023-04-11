import axios from "axios";
import axiosRetry from "axios-retry";
import * as secureStorage from "Storage";
import { StoredItems } from "Storage";
import { BASE_URL_DEV, URL_GET_TOKEN, URL_INTROSPECT_TOKEN } from "./UrlPaths";
import { initializeMocks } from "./MockRequests";
import { checkAndRefreshExpiredAccessToken, clearAuthToken } from "./Authentication/AuthTokenStorage";
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
    //ignoring refresh url as same
    if (!config.url?.includes(URL_GET_TOKEN) && !config.url?.includes(URL_INTROSPECT_TOKEN)) {
      // console.log("REQ INTERCEPTOR ", config.url);
      // console.log("REQ INTERCEPTOR ", AuthToken.accessToken);
      await checkAndRefreshExpiredAccessToken().catch((e) =>
        console.error(
          "error occured while token refresh, continuing with request. " + e
        )
      );
      // console.log("REQ INTERCEPTOR NEW TOKEN ", AuthToken.accessToken);
      if (AuthToken.accessToken) {
        config.headers.authentication = "Bearer: ".concat(
          AuthToken.accessToken
        );
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
    if (error.response.status === 401) {
      //will RS send 401 for 400
      clearAuthToken()
      //navigate to login screen => ideally saving current stack
    }
    return Promise.reject(error);
  }
);

if (process.env.NODE_ENV == "development" || process.env.NODE_ENV == "test") {
  // initializeMocks(client);
}
export default client;
