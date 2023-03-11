import AuthToken from "../src/lib/Authentication/AuthToken";
import * as storage from "../src/util/storage/Store";

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
