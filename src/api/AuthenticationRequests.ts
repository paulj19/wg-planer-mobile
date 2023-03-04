import AuthToken from "../../TokenDto";
import { URL_AUTH_SERVER, URL_REFRESH_TOKEN } from "../UrlPaths";
import axios from "./../axiosConfig";
import {
  clientId,
  clientSecret,
  discovery,
  grantType,
  redirectUri,
} from "./Authentication";

export const getToken = (code: string): Promise<AuthToken> => {
  return axios({
    method: "post",
    url: discovery.tokenEndpoint,
    auth: {
      username: clientId,
      password: clientSecret,
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {
      code: code,
      client_id: clientId,
      redirect_uri: redirectUri,
      grant_type: grantType,
    },
  })
    .then((response) => extractTokensFromResponse(response))
    .catch((e) => {
      throw Error("Failed to load token: " + e);
    });
};

export async function introspectToken(token: string) {
  console.log("DD" + discovery);
  return axios({
    method: "post",
    url: URL_AUTH_SERVER + "/oauth2/introspect",
    auth: {
      username: clientId,
      password: clientSecret,
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {
      token: token,
    },
  })
    .then((response) => String(response.data?.active) === "true")
    .catch((e) => {
      throw new Error("accessToken introspect failed: " + e);
    });
}

export async function refreshExpiredAccessToken(
  refreshToken: string
): Promise<AuthToken> {
  return axios({
    method: "post",
    url: URL_REFRESH_TOKEN,
    auth: {
      username: clientId,
      password: clientSecret,
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    },
  })
    .then((response) => extractTokensFromResponse(response))
    .catch((e) => {
      throw Error("accessToken refresh failed: " + e);
    });
}

function extractTokensFromResponse(response: any): AuthToken {
response.data = null;
  if (response.data) {
    const tokenDto: AuthToken = {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      idToken: response.data.id_token,
      expiryDate: computeTokenExpiryDate(response.data.expires_in),
      tokenType: response.data.token_type,
      scope: response.data.scope,
    };
    return tokenDto;
  } else {
    throw Error("token response does not contain data");
  }
}

