import axios from "./../axiosConfig";
import {
  clientId,
  clientSecret,
  discovery,
  grantType,
  redirectUri,
} from "./Authentication";

export const getToken = (code: string): TokenDto => {
  return (
    axios({
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
      .then((response) => {
        if (response?.data) {
          const tokenDto: TokenDto = {
            accessToken: response.data?.access_token,
            refreshToken: response.data?.refresh_token,
            idToken: response.data?.id_token,
            expiresIn: response.data?.expires_in,
            tokenType: response.data?.token_type,
            scope: response.data?.scope,
          };
          return tokenDto;
        }
      })
      // .then((r) => {console.log("xxxrr" + JSON.stringify(r)); return r;})
      .catch((e) => console.log("Failed to load token: " + e))
  );
};

export function introspectToken(
  token: string,
) {
  return axios({
    method: "post",
    url: discovery.discoveryDocument.introspection_endpoint,
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
    .then((response) => response.data?.active === "true")
    .catch((e) => console.log("Failed to load token: " + e));
}
