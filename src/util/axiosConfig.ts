import axios from "axios";
import axiosRetry from "axios-retry";
import {
  RESOURCE_SERVER_DEV,
  URL_GET_TOKEN,
  URL_INTROSPECT_TOKEN,
  URL_REGISTER_NEW,
} from "./UrlPaths";
import {
  clearAuthToken,
  refreshAccessTokenIfExpired,
} from "features/auth/AuthTokenStorage";
import AuthToken from "features/auth/AuthToken";
import { initializeMocks } from "mocks/MockRequests";

const client = axios.create({ baseURL: RESOURCE_SERVER_DEV });

axiosRetry(client, {
  retryDelay: (retryCount) => {
    return retryCount * 1000;
  },
  retryCondition: (error) => {
    // if retry condition is not specified, by default idempotent requests are retried
    return 500 <= error?.response?.status && error?.response?.status < 600;
  },
  retries: 3,
});

client.interceptors.request.use(
  async (config) => {
    //ignoring refresh url as same
    if (
      !config.url?.includes(URL_GET_TOKEN) &&
      !config.url?.includes(URL_INTROSPECT_TOKEN) &&
      !config.url?.includes(URL_REGISTER_NEW)
    ) {
      await refreshAccessTokenIfExpired().catch((e) =>
        console.error(
          "error occured while token refresh, continuing with request. " + e
        )
      );
      if (AuthToken.accessToken) {
        config.headers.Authorization = "Bearer ".concat(
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
    //only possibility? request interceptor sends req without accessToken when refresh fails
    if (error?.response?.status === 401) {
      //will RS send 401 for 400
      clearAuthToken();
      //navigate to login screen => ideally saving current stack
    }
    return Promise.reject(error);
  }
);

if (process.env.NODE_ENV == "development" || process.env.NODE_ENV == "test") {
  // initializeMocks(client);
}
export default client;
