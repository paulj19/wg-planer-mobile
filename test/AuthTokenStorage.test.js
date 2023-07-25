import axios from "../src/lib/axiosConfig";
import * as storage from "../src/util/storage/Store";
import AuthToken from "../src/lib/Authentication/AuthToken";
import { aStorage } from "../src/util/storage/AsyncStorage";
import { initJestPlatformMock } from "./common_mocks";
import {
  loadAndRefreshAccessTokenIfExpired,
  loadAuthToken,
  storeAuthToken,
} from "../src/lib/Authentication/AuthTokenStorage";
import MockAdapter from "axios-mock-adapter";
import { URL_REFRESH_TOKEN } from "../src/lib/UrlPaths";
import { server } from "./../src/mocks/server";

const mock = new MockAdapter(axios);

describe("AuthTokenStorage", () => {
  beforeAll(() => server.listen());
  beforeEach(() => AuthToken.clear());
  afterEach(() => server.resetHandlers())
  beforeAll(() => server.close());

  it("loads into AuthToken", async () => {
    initMockData();
    initJestPlatformMock();
    initJestLoadMock();
    await loadAuthToken();
    expect(AuthToken.accessToken).toBe(storedAuthToken._accessToken);
    expect(AuthToken.refreshToken).toBe(storedAuthToken._refreshToken);
    expect(AuthToken.idToken).toBe(storedAuthToken._idToken);
    expect(AuthToken.expiryDate).toBeInstanceOf(Date);
    expect(AuthToken.tokenType).toBe(storedAuthToken._tokenType);
    expect(AuthToken.scope).toBe(storedAuthToken._scope);
  });

  it("stores AuthToken", async () => {
    initAllMocks();

    storeAuthToken();
    await loadAuthToken();

    expect(AuthToken.accessToken).toBe(storedAuthToken._accessToken);
    expect(AuthToken.refreshToken).toBe(storedAuthToken._refreshToken);
    expect(AuthToken.idToken).toBe(storedAuthToken._idToken);
    expect(AuthToken.expiryDate).toBeInstanceOf(Date);
    expect(AuthToken.tokenType).toBe(storedAuthToken._tokenType);
    expect(AuthToken.scope).toBe(storedAuthToken._scope);
  });

  it("returns null when authToken not stored", async () => {
    initJestPlatformMock();
    jest.spyOn(storage, "getItem").mockReturnValue(Promise.resolve(null));
    await loadAndRefreshAccessTokenIfExpired();
    expect(AuthToken.accessToken).toBeNull();
    expect(AuthToken.refreshToken).toBeNull();
    expect(AuthToken.idToken).toBeNull();
    expect(AuthToken.expiryDate).toBeNull();
    expect(AuthToken.tokenType).toBeNull();
    expect(AuthToken.scope).toBeNull();
  });

  it("loads non-expired authToken", async () => {
    initJestPlatformMock();
    const date = new Date();
    date.setSeconds(date.getSeconds() + 20);
    const expectedAuthToken = {
      _accessToken: "sam accessToken old",
      _refreshToken: "sam refreshToken old",
      _idToken: "sam idToken old",
      _expiryDate: date,
      _tokenType: "sam tokenType old",
      _scope: "sam scope old",
    };
    jest
      .spyOn(storage, "getItem")
      .mockReturnValue(Promise.resolve(expectedAuthToken));
    await loadAndRefreshAccessTokenIfExpired();
    expect(AuthToken.accessToken).toBe(expectedAuthToken._accessToken);
    expect(AuthToken.refreshToken).toBe(expectedAuthToken._refreshToken);
    expect(AuthToken.idToken).toBe(expectedAuthToken._idToken);
    expect(AuthToken.expiryDate).toBeInstanceOf(Date);
    expect(AuthToken.tokenType).toBe(expectedAuthToken._tokenType);
    expect(AuthToken.scope).toBe(expectedAuthToken._scope);
  });

  it("refreshes old expired authToken", async () => {
    initAllMocks();
    const responseTokens = {
      access_token: "new accessToken",
      refresh_token: "new refreshToken",
      id_token: "new idToken",
      expires_in: "1800",
      token_type: "new tokenType",
      scope: "new scope",
    };
    mock.onPost(URL_REFRESH_TOKEN).reply(200, responseTokens);
    expect(AuthToken.accessToken).toBeNull();
    await loadAndRefreshAccessTokenIfExpired();
    expect(AuthToken.accessToken).toBe(responseTokens.access_token);
    expect(AuthToken.refreshToken).toBe(responseTokens.refresh_token);
    expect(AuthToken.idToken).toBe(responseTokens.id_token);
    expect(AuthToken.expiryDate).toBeInstanceOf(Date);
    expect(AuthToken.tokenType).toBe(responseTokens.token_type);
    expect(AuthToken.scope).toBe(responseTokens.scope);
  });
});

const initAllMocks = () => {
  initMockData();
  initJestMocks();
};

const initJestMocks = () => {
  initJestLoadMock();
  initJestSaveMock();
  initJestPlatformMock();
};

const initJestLoadMock = () => {
  jest
    .spyOn(storage, "getItem")
    .mockReturnValue(Promise.resolve(storedAuthToken));
};

const initJestSaveMock = () => {
  jest.spyOn(aStorage, "setItem").mockReturnValue(Promise.resolve());
};

const initMockData = () => {
  storedAuthToken = {
    _accessToken: "sam accessToken",
    _refreshToken: "sam refreshToken",
    _idToken: "sam idToken",
    _expiryDate: new Date("2023-02-28T21:38:45.189Z"),
    _tokenType: "sam tokenType",
    _scope: "sam scope",
  };
};
