import axios from "../src/lib/axiosConfig";
import AuthToken from "../src/lib/Authentication/AuthToken";
import * as storage from "../src/util/storage/Store";
import { aStorage } from "../src/util/storage/AsyncStorage";
import MockAdapter from "axios-mock-adapter";
import { URL_REFRESH_TOKEN } from "../src/lib/UrlPaths";

let storedAuthToken;
let expectedAuthToken;
const mock = new MockAdapter(axios);

describe("AuthToken", () => {
  it("computes correct expiryDate", () => {
    const dateNow = new Date("2023-02-28T21:38:45.189Z");
    const expiryDate = AuthToken.computeTokenExpiryDate(dateNow, 1800);
    expect(expiryDate).toStrictEqual(new Date("2023-02-28T22:08:25.189Z"));
  });

  it("computes correct expiryDate", () => {
    const dateNow = new Date("2023-02-28T21:38:45.189Z");
    const authToken = new AuthToken(
      "authtoken",
      "refreshToken",
      "",
      dateNow,
      "",
      ""
    );
    expect(authToken.expiryDate).toStrictEqual(dateNow);
  });

  it("sets expiryDate correctly", () => {
    const dateNow = new Date();
    const authToken = new AuthToken("", "", "", 0, "", "");
    authToken.expiryDate = 1800;
    const expiryDate = AuthToken.computeTokenExpiryDate(dateNow, 1800);
    expect(authToken.expiryDate).toBeInstanceOf(Date);
    expect(authToken.expiryDate.getFullYear()).toStrictEqual(
      expiryDate.getFullYear()
    );
    expect(authToken.expiryDate.getMonth()).toStrictEqual(
      expiryDate.getMonth()
    );
    expect(authToken.expiryDate.getDay()).toStrictEqual(expiryDate.getDay());
    expect(authToken.expiryDate.getHours()).toStrictEqual(
      expiryDate.getHours()
    );
    expect(authToken.expiryDate.getMinutes()).toStrictEqual(
      expiryDate.getMinutes()
    );
  });

  it("loads valid AuthToken", async () => {
    initMockData();
    initJestLoadMock();
    const loadedAuthToken = await AuthToken.load();
    expect(loadedAuthToken).toStrictEqual(expectedAuthToken);
  });

  it("saves and returns AuthToken", async () => {
    initAllMocks();

    await expectedAuthToken.save(storedAuthToken);
    const loadedAuthToken = await AuthToken.load();

    expect(loadedAuthToken).toStrictEqual(expectedAuthToken);
  });

  it("loads and returns new authToken as old expired", async () => {
    initAllMocks();

    const responseTokens = {
      access_token: "sam accessToken",
      refresh_token: "sam refreshToken",
      id_token: "sam idToken",
      expires_in: "1800",
      token_type: "sam tokenType",
      scope: "sam scope",
    };
    const expectedAuthToken = new AuthToken(
      responseTokens.access_token,
      responseTokens.refresh_token,
      responseTokens.id_token,
      responseTokens.expires_in,
      responseTokens.token_type,
      responseTokens.scope
    );
    mock.onPost(URL_REFRESH_TOKEN).reply(200, responseTokens);

    const loadedAuthToken =
      await AuthToken.loadAndRefreshAccessTokenIfExpired();

    expect(loadedAuthToken.accessToken).toBe(expectedAuthToken.accessToken);
    expect(loadedAuthToken.refreshToken).toBe(expectedAuthToken.refreshToken);
    expect(loadedAuthToken.idToken).toBe(expectedAuthToken.idToken);
    expect(loadedAuthToken.expiryDate).toBeInstanceOf(Date);
    expect(loadedAuthToken.tokenType).toBe(expectedAuthToken.tokenType);
    expect(loadedAuthToken.scope).toBe(expectedAuthToken.scope);
  });

  it("loads and returns old authToken as not expired", async () => {
    initJestPlatformMock();

    const date = new Date();
    date.setSeconds(date.getSeconds() + 20);

    const expectedAuthToken  = {
      _accessToken: "sam accessToken old",
      _refreshToken: "sam refreshToken old",
      _idToken: "sam idToken old",
      _expiryDate: date,
      _tokenType: "sam tokenType old",
      _scope: "sam scope old",
    };
    jest
      .spyOn(storage, "load")
      .mockReturnValue(Promise.resolve(expectedAuthToken));

    const loadedAuthToken =
      await AuthToken.loadAndRefreshAccessTokenIfExpired();

    expect(loadedAuthToken.accessToken).toBe(expectedAuthToken._accessToken);
    expect(loadedAuthToken.refreshToken).toBe(expectedAuthToken._refreshToken);
    expect(loadedAuthToken.idToken).toBe(expectedAuthToken._idToken);
    expect(loadedAuthToken.expiryDate).toBeInstanceOf(Date);
    expect(loadedAuthToken.tokenType).toBe(expectedAuthToken._tokenType);
    expect(loadedAuthToken.scope).toBe(expectedAuthToken._scope);
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
  jest.spyOn(storage, "load").mockReturnValue(Promise.resolve(storedAuthToken));
};
const initJestSaveMock = () => {
  jest.spyOn(aStorage, "save").mockReturnValue(Promise.resolve());
};
const initJestPlatformMock = () => {
  jest.mock("react-native/Libraries/Utilities/Platform", () => ({
    OS: "web", // or 'ios'
    select: () => null,
  }));
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
