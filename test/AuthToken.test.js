import axios from "../src/lib/axiosConfig";
import AuthToken from "../src/lib/Authentication/AuthToken";
import * as storage from "../src/util/storage/Store";
import { aStorage } from "../src/util/storage/AsyncStorage";
import MockAdapter from "axios-mock-adapter";
import { URL_REFRESH_TOKEN } from "../src/lib/UrlPaths";
import { initJestPlatformMock } from "./common_mocks";

let storedAuthToken;
let expectedAuthToken;
const mock = new MockAdapter(axios);

describe("AuthToken", () => {
  beforeEach(() => {
    AuthToken.clear();
  });
  // it("computes correct expiryDate", () => {
  //   const dateNow = new Date("2023-02-28T21:38:45.189Z");
  //   const expiryDate = AuthT.computeTokenExpiryDate(dateNow, 1800);
  //   expect(expiryDate).toStrictEqual(new Date("2023-02-28T22:08:25.189Z"));
  // });

  it("stores raw from storage", () => {
    const dateNow = new Date("2023-02-28T21:38:45.189Z");
    const storedAuthToken = {
      _accessToken: "sam accessToken",
      _refreshToken: "sam refreshToken",
      _idToken: "sam idToken",
      _expiryDate: dateNow,
      _tokenType: "sam tokenType",
      _scope: "sam scope",
    };
    AuthToken.fromStorage(storedAuthToken);
    expect(AuthToken.expiryDate).toStrictEqual(dateNow);
  });

  // it("computes expiry date from api response", () => {
  //   const dateNow = new Date();
  //   const tokens = {
  //     access_token: "sam accessToken",
  //     refresh_token: "sam refreshToken",
  //     id_token: "sam idToken",
  //     expires_in: "1800",
  //     token_type: "sam tokenType",
  //     scope: "sam scope",
  //   };
  //   AuthToken.fromApiResponse(tokens);
  //   const computedExpiryDate = AuthToken.computeTokenExpiryDate(dateNow, 1800);
  //   expect(AuthToken.expiryDate).toBeInstanceOf(Date);
  //   expect(AuthToken.expiryDate.getFullYear()).toStrictEqual(
  //     computedExpiryDate.getFullYear()
  //   );
  //   expect(AuthToken.expiryDate.getMonth()).toStrictEqual(
  //     computedExpiryDate.getMonth()
  //   );
  //   expect(AuthToken.expiryDate.getDay()).toStrictEqual(computedExpiryDate.getDay());
  //   expect(AuthToken.expiryDate.getHours()).toStrictEqual(
  //     computedExpiryDate.getHours()
  //   );
  //   expect(AuthToken.expiryDate.getMinutes()).toStrictEqual(
  //     computedExpiryDate.getMinutes()
  //   );
  // });

  it("updates AuthToken from api response obj", async () => {
    const tokens = {
      access_token: "sam accessToken",
      refresh_token: "sam refreshToken",
      id_token: "sam idToken",
      expires_in: "1800",
      token_type: "sam tokenType",
      scope: "sam scope",
    };
    AuthToken.fromApiResponse(tokens);

    expect(AuthToken.accessToken).toBe(tokens.access_token);
    expect(AuthToken.refreshToken).toBe(tokens.refresh_token);
    expect(AuthToken.idToken).toBe(tokens.id_token);
    expect(AuthToken.expiryDate).toBeInstanceOf(Date);
    expect(AuthToken.tokenType).toBe(tokens.token_type);
    expect(AuthToken.scope).toBe(tokens.scope);
  });

  it("updates AuthToken from storaged authToken", async () => {
    const storedAuthToken = {
      _accessToken: "sam accessToken",
      _refreshToken: "sam refreshToken",
      _idToken: "sam idToken",
      _expiryDate: new Date("2023-02-28T21:38:45.189Z"),
      _tokenType: "sam tokenType",
      _scope: "sam scope",
    };
    AuthToken.fromStorage(storedAuthToken);

    expect(AuthToken.accessToken).toBe(storedAuthToken._accessToken);
    expect(AuthToken.refreshToken).toBe(storedAuthToken._refreshToken);
    expect(AuthToken.idToken).toBe(storedAuthToken._idToken);
    expect(AuthToken.expiryDate).toBeInstanceOf(Date);
    expect(AuthToken.tokenType).toBe(storedAuthToken._tokenType);
    expect(AuthToken.scope).toBe(storedAuthToken._scope);
  });

  // it("loads valid AuthToken", async () => {
  //   initMockData();
  //   initJestPlatformMock();
  //   initJestLoadMock();
  //   const loadedAuthToken = await AuthToken.load();
  //   expect(loadedAuthToken).toStrictEqual(expectedAuthToken);
  // });

  // it("saves and returns AuthToken", async () => {
  //   initAllMocks();

  //   await expectedAuthToken.save(storedAuthToken);
  //   const loadedAuthToken = await AuthToken.load();

  //   expect(loadedAuthToken).toStrictEqual(expectedAuthToken);
  // });
});

describe("loadAndRefreshAccessTokenIfExpired", () => {
  // it("returns null when authToken not stored", async () => {
  //   initJestPlatformMock();
  //   jest.spyOn(storage, "load").mockReturnValue(Promise.resolve(null));
  //   const loadedAuthToken =
  //     await AuthToken.loadAndRefreshAccessTokenIfExpired();
  //   expect(loadedAuthToken).toBeNull();
  // });
  // it("loads and returns old non-expired authToken", async () => {
  //   initJestPlatformMock();
  //   const date = new Date();
  //   date.setSeconds(date.getSeconds() + 20);
  //   const expectedAuthToken = {
  //     _accessToken: "sam accessToken old",
  //     _refreshToken: "sam refreshToken old",
  //     _idToken: "sam idToken old",
  //     _expiryDate: date,
  //     _tokenType: "sam tokenType old",
  //     _scope: "sam scope old",
  //   };
  //   jest
  //     .spyOn(storage, "load")
  //     .mockReturnValue(Promise.resolve(expectedAuthToken));
  //   const loadedAuthToken =
  //     await AuthToken.loadAndRefreshAccessTokenIfExpired();
  //   expect(loadedAuthToken.accessToken).toBe(expectedAuthToken._accessToken);
  //   expect(loadedAuthToken.refreshToken).toBe(expectedAuthToken._refreshToken);
  //   expect(loadedAuthToken.idToken).toBe(expectedAuthToken._idToken);
  //   expect(loadedAuthToken.expiryDate).toBeInstanceOf(Date);
  //   expect(loadedAuthToken.tokenType).toBe(expectedAuthToken._tokenType);
  //   expect(loadedAuthToken.scope).toBe(expectedAuthToken._scope);
  // });
  // it("loads and returns new authToken as old expired", async () => {
  //   initAllMocks();
  //   const responseTokens = {
  //     access_token: "sam accessToken",
  //     refresh_token: "sam refreshToken",
  //     id_token: "sam idToken",
  //     expires_in: "1800",
  //     token_type: "sam tokenType",
  //     scope: "sam scope",
  //   };
  //   const expectedAuthToken = new AuthToken(
  //     responseTokens.access_token,
  //     responseTokens.refresh_token,
  //     responseTokens.id_token,
  //     responseTokens.expires_in,
  //     responseTokens.token_type,
  //     responseTokens.scope
  //   );
  //   mock.onPost(URL_REFRESH_TOKEN).reply(200, responseTokens);
  //   const loadedAuthToken =
  //     await AuthToken.loadAndRefreshAccessTokenIfExpired();
  //   expect(loadedAuthToken.accessToken).toBe(expectedAuthToken.accessToken);
  //   expect(loadedAuthToken.refreshToken).toBe(expectedAuthToken.refreshToken);
  //   expect(loadedAuthToken.idToken).toBe(expectedAuthToken.idToken);
  //   expect(loadedAuthToken.expiryDate).toBeInstanceOf(Date);
  //   expect(loadedAuthToken.tokenType).toBe(expectedAuthToken.tokenType);
  //   expect(loadedAuthToken.scope).toBe(expectedAuthToken.scope);
  // });
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
  jest.spyOn(storage, "load").mockReturnValue(Promise.resolve(storedAuthToken));
};

const initJestSaveMock = () => {
  jest.spyOn(aStorage, "save").mockReturnValue(Promise.resolve());
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
  expectedAuthToken = new AuthToken(
    storedAuthToken._accessToken,
    storedAuthToken._refreshToken,
    storedAuthToken._idToken,
    storedAuthToken._expiryDate,
    storedAuthToken._tokenType,
    storedAuthToken._scope
  );
};
