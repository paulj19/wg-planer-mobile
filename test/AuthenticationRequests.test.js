import axios from "../src/lib/axiosConfig";
import { getToken, refreshExpiredAccessToken } from "../src/api/AuthenticationRequests";
import MockAdapter from "axios-mock-adapter";
import { URL_REFRESH_TOKEN } from "../src/lib/UrlPaths";

const mock = new MockAdapter(axios);

test("should return valid api response from getToken request", async () => {
  const tokens = {
    access_token: "sam accessToken",
    refresh_token: "sam refreshToken",
    id_token: "sam idToken",
    expires_in: "1800",
    token_type: "sam tokenType",
    scope: "sam scope",
  };

  mock.onPost("/oauth2/token").reply(200, tokens);

  const responseAuthToken = await getToken(
    "/oauth2/token",
    "code",
    "redirectUri"
  );

  expect(responseAuthToken.access_token).toBe(tokens.access_token);
  expect(responseAuthToken.refresh_token).toBe(tokens.refresh_token);
  expect(responseAuthToken.id_token).toBe(tokens.id_token);
  expect(responseAuthToken.expires_in).toBe("1800");
  expect(responseAuthToken.token_type).toBe(tokens.token_type);
  expect(responseAuthToken.scope).toBe(tokens.scope);
});

test("should return valid api response from token refresh request", async () => {
  const tokens = {
    access_token: "sam accessToken",
    refresh_token: "sam refreshToken",
    id_token: "sam idToken",
    expires_in: "1800",
    token_type: "sam tokenType",
    scope: "sam scope",
  };

  mock.onPost(URL_REFRESH_TOKEN).reply(200, tokens);

  const responseAuthToken = await refreshExpiredAccessToken("refreshToken");

  expect(responseAuthToken.access_token).toBe(tokens.access_token);
  expect(responseAuthToken.refresh_token).toBe(tokens.refresh_token);
  expect(responseAuthToken.id_token).toBe(tokens.id_token);
  expect(responseAuthToken.expires_in).toBe("1800");
  expect(responseAuthToken.token_type).toBe(tokens.token_type);
  expect(responseAuthToken.scope).toBe(tokens.scope);
});
