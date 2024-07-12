import { MOCK_ENABLED } from "@env";

export const MOCK_BASE_URL = "http://localhost";
export const URL_AUTH_SERVER = "http://192.168.0.108:8081";
// export const RESOURCE_SERVER_DEV = MOCK_ENABLED
//   ? MOCK_BASE_URL
//   : "http://192.168.33.184:8082";
export const RESOURCE_SERVER_DEV = "http://192.168.0.108:8082";
export const GO_BACKEND = "http://192.168.0.112:8080";
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
export const URL_POST_LOGIN = GO_BACKEND + "/post-login";
export const UPDATE_TASK = GO_BACKEND + "/update-task";
