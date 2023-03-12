import axios from "../src/lib/axiosConfig";
import AuthToken from "../src/lib/Authentication/AuthToken";
import { getToken, refreshExpiredAccessToken } from "../src/api/AuthenticationRequests";
import MockAdapter from "axios-mock-adapter";
import { URL_REFRESH_TOKEN } from "../src/lib/UrlPaths";

const mock = new MockAdapter(axios);

test("should return AuthToken from getToken request", async () => {
  const tokens = {
    access_token: "sam accessToken",
    refresh_token: "sam refreshToken",
    id_token: "sam idToken",
    expires_in: "299",
    token_type: "sam tokenType",
    scope: "sam scope",
  };
  const expectedAuthToken = new AuthToken(
    tokens.access_token,
    tokens.refresh_token,
    tokens.id_token,
    tokens.expires_in,
    tokens.token_type,
    tokens.scope
  );

  mock.onPost("/oauth2/token").reply(200, tokens);

  const responseAuthToken = await getToken(
    "/oauth2/token",
    "code",
    "redirectUri"
  );

  expect(responseAuthToken.accessToken).toBe(expectedAuthToken.accessToken);
  expect(responseAuthToken.refreshToken).toBe(expectedAuthToken.refreshToken);
  expect(responseAuthToken.idToken).toBe(expectedAuthToken.idToken);
  expect(responseAuthToken.expiryDate).toBeInstanceOf(Date);
  expect(responseAuthToken.tokenType).toBe(expectedAuthToken.tokenType);
  expect(responseAuthToken.scopes).toBe(expectedAuthToken.scopes);
});

test("should return AuthToken from token refresh request", async () => {
  const tokens = {
    access_token: "sam accessToken",
    refresh_token: "sam refreshToken",
    id_token: "sam idToken",
    expires_in: "299",
    token_type: "sam tokenType",
    scope: "sam scope",
  };
  const expectedAuthToken = new AuthToken(
    tokens.access_token,
    tokens.refresh_token,
    tokens.id_token,
    tokens.expires_in,
    tokens.token_type,
    tokens.scope
  );

  mock.onPost(URL_REFRESH_TOKEN).reply(200, tokens);

  const responseAuthToken = await refreshExpiredAccessToken("refreshToken");

  expect(responseAuthToken.accessToken).toBe(expectedAuthToken.accessToken);
  expect(responseAuthToken.refreshToken).toBe(expectedAuthToken.refreshToken);
  expect(responseAuthToken.idToken).toBe(expectedAuthToken.idToken);
  expect(responseAuthToken.expiryDate).toBeInstanceOf(Date);
  expect(responseAuthToken.tokenType).toBe(expectedAuthToken.tokenType);
  expect(responseAuthToken.scopes).toBe(expectedAuthToken.scopes);
});
