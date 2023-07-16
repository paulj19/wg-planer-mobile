import { MOCK_ENABLED } from "@env";

export const MOCK_BASE_URL = "http://localhost";
export const URL_AUTH_SERVER = "http://116.203.96.104:5000";
export const RESOURCE_SERVER_DEV = MOCK_ENABLED
  ? MOCK_BASE_URL
  : "http://116.203.96.104:8080";
export const PATH_VALIDATE_ACCESS_TOKEN = "/validate-access-token";
export const PATH_LOGIN = "/login";
export const URL_AUTHORIZATION = URL_AUTH_SERVER + "/oauth2/authorize";
export const URL_REFRESH_TOKEN = URL_AUTH_SERVER + "/oauth2/token";
export const URL_GET_TOKEN = URL_AUTH_SERVER + "/oauth2/token";
export const URL_REVOKE_TOKEN = URL_AUTH_SERVER + "/oauth2/revoke";
export const URL_INTROSPECT_TOKEN =
  (MOCK_ENABLED ? MOCK_BASE_URL : URL_AUTH_SERVER) + "/oauth2/introspect";
export const URL_REGISTER_NEW = RESOURCE_SERVER_DEV + "/register/new";
export const URL_USER_PROFILE = RESOURCE_SERVER_DEV + "/userprofile";
