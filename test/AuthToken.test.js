import AuthToken from "../src/lib/Authentication/AuthToken";
import { Platform } from "react-native";
import * as storage from "../src/util/storage/Store";
import { aStorage } from "../src/util/storage/AsyncStorage";

test("should compute correct expiryDate", () => {
  const dateNow = new Date("2023-02-28T21:38:45.189Z");
  const expiryDate = AuthToken.computeTokenExpiryDate(dateNow, 1800);
  expect(expiryDate).toStrictEqual(new Date("2023-02-28T22:08:25.189Z"));
});

test("should compute correct expiryDate", () => {
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

test("should set expiryDate correctly", () => {
  const dateNow = new Date();
  const authToken = new AuthToken("", "", "", 0, "", "");
  authToken.expiryDate = 1800;
  const expiryDate = AuthToken.computeTokenExpiryDate(dateNow, 1800);
  expect(authToken.expiryDate).toBeInstanceOf(Date);
  expect(authToken.expiryDate.getFullYear()).toStrictEqual(
    expiryDate.getFullYear()
  );
  expect(authToken.expiryDate.getMonth()).toStrictEqual(expiryDate.getMonth());
  expect(authToken.expiryDate.getDay()).toStrictEqual(expiryDate.getDay());
  expect(authToken.expiryDate.getHours()).toStrictEqual(expiryDate.getHours());
  expect(authToken.expiryDate.getMinutes()).toStrictEqual(
    expiryDate.getMinutes()
  );
});

test("should return valid AuthToken", async () => {
  const storedAuthToken = {
    _accessToken: "sam accessToken",
    _refreshToken: "sam refreshToken",
    _idToken: "sam idToken",
    _expiresIn: "299",
    _tokenType: "sam tokenType",
    _scope: "sam scope",
  };
  jest.spyOn(storage, "load").mockReturnValue(Promise.resolve(storedAuthToken));
  const authToken = await AuthToken.loadAllTokens();
  expect(authToken.accessToken).toBe(storedAuthToken._accessToken);
  expect(authToken.refreshToken).toBe(storedAuthToken._refreshToken);
  expect(authToken.idToken).toBe(storedAuthToken._idToken);
  expect(authToken.expiryDate).toBeInstanceOf(Date);
  expect(authToken.tokenType).toBe(storedAuthToken._tokenType);
  expect(authToken.scope).toBe(storedAuthToken._scope);
});

test("should save and return AuthToken", async () => {
  const storedAuthToken = {
    _accessToken: "sam accessToken",
    _refreshToken: "sam refreshToken",
    _idToken: "sam idToken",
    _expiresIn: "299",
    _tokenType: "sam tokenType",
    _scope: "sam scope",
  };
  const authToken = new AuthToken(
    storedAuthToken._accessToken,
    storedAuthToken._refreshToken,
    storedAuthToken._idToken,
    storedAuthToken._expiresIn,
    storedAuthToken._tokenType,
    storedAuthToken._scope
  );
  jest.mock("react-native/Libraries/Utilities/Platform", () => ({
    OS: "web", // or 'ios'
    select: () => null,
  }));
  jest.spyOn(storage, "load").mockReturnValue(Promise.resolve(storedAuthToken));
  jest.spyOn(aStorage, "save").mockReturnValue(Promise.resolve());
  console.log("OOO" + JSON.stringify(await storage.load("")));
  console.log("XXX " + JSON.stringify(await storage.load("auth_token")));

  await authToken.save(authToken);
  const savedAuthToken = await AuthToken.load();

  expect(savedAuthToken.accessToken).toBe(storedAuthToken._accessToken);
  expect(savedAuthToken.refreshToken).toBe(storedAuthToken._refreshToken);
  expect(savedAuthToken.idToken).toBe(storedAuthToken._idToken);
  expect(savedAuthToken.expiryDate).toBeInstanceOf(Date);
  expect(savedAuthToken.tokenType).toBe(storedAuthToken._tokenType);
  expect(savedAuthToken.scope).toBe(storedAuthToken._scope);
});


