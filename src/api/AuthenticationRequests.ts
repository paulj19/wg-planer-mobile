import axios from "../lib/axiosConfig";
import { URL_INTROSPECT_TOKEN, URL_REFRESH_TOKEN } from "../lib/UrlPaths";
import { authProps } from "../lib/Authentication/AuthProps";

export async function getToken(
  url: string,
  code: string,
  redirectUri: string
): Promise<any> {
  return axios({
    method: "post",
    url: url,
    auth: {
      username: authProps.clientId,
      password: authProps.clientSecret,
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {
      code: code,
      client_id: authProps.clientId,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    },
  })
    .then((response) => response.data)
    .catch((e) => {
      throw Error("Failed to load token: " + e);
    });
}

export async function refreshExpiredAccessToken(
  refreshToken: string
): Promise<any> {
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
    .then((response) => response.data)
    .catch((e) => {
      //refreshToken expired
      if (
        e.response?.status === 400 &&
        e.response?.data?.error === "invalid_grant"
      ) {
        return null;
      }
      throw Error("accessToken refresh failed: " + e);
    });
}

export async function introspectToken(accessToken: string) {
  return axios({
    method: "post",
    url: URL_INTROSPECT_TOKEN,
    auth: {
      username: authProps.clientId,
      password: authProps.clientSecret,
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {
      token: accessToken,
    },
  })
    .then((response) => String(response.data?.active) === "true")
    .catch((e) => {
      throw new Error("accessToken introspect failed: " + e);
    });
}

