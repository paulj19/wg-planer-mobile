import axios from "../lib/axiosConfig";
import AuthToken from "../lib/Authentication/AuthToken";
import { URL_AUTH_SERVER, URL_REFRESH_TOKEN } from "../lib/UrlPaths";
import { authProps } from "../lib/Authentication/AuthProps";

export async function getToken(url: string, code: string, redirectUri: string): Promise<AuthToken> {
  return axios({
    method: "post",
    url: url,
    auth: {
      username: authProps.clientId,
      password: authProps.clientSecret,
    },
    headers: {
      "Content-Type": "application/x-w ww-form-urlencoded",
    },
    data: {
      code: code,
      client_id: authProps.clientId,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    },
  })
    .then((response) => AuthToken.fromApiResponse(response.data))
    .catch((e) => {
      throw Error("Failed to load token: " + e);
    });
}

export async function refreshExpiredAccessToken(
  refreshToken: string
): Promise<AuthToken> {
  return axios({
    method: "post",
    url: URL_REFRESH_TOKEN,
    auth: {
      username: authProps.clientId,
      password: authProps.clientSecret,
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    },
  })
    .then((response) => AuthToken.fromApiResponse(response.data))
    .catch((e) => {
      throw Error("accessToken refresh failed: " + e);
    });
}

// export async function introspectToken(token: string) {
//   return axios({
//     method: "post",
//     url: URL_AUTH_SERVER + "/oauth2/introspect",
//     auth: {
//       username: clientId,
//       password: clientSecret,
//     },
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     data: {
//       token: token,
//     },
//   })
//     .then((response) => String(response.data?.active) === "true")
//     .catch((e) => {
//       throw new Error("accessToken introspect failed: " + e);
//     });
// }
