import AuthToken from "../src/lib/Authentication/AuthToken";

test("should compute correct expiryDate", () => {
  const dateNow = new Date("2023-02-28T21:38:45.189Z");
  const expiryDate = AuthToken.computeTokenExpiryDate(dateNow, 1800);
  expect(expiryDate).toStrictEqual(new Date("2023-02-28T22:08:25.189Z"));
});

test("should set expiryDate correctly", () => {
  const dateNow = new Date();
  const authToken = new AuthToken();
  authToken.expiryDate = 1800;
  const expiryDate = AuthToken.computeTokenExpiryDate(dateNow, 1800);
  expect(authToken.expiryDate).toBeInstanceOf(Date);
  expect(authToken.expiryDate.getFullYear()).toStrictEqual(expiryDate.getFullYear());
  expect(authToken.expiryDate.getMonth()).toStrictEqual(expiryDate.getMonth());
  expect(authToken.expiryDate.getDay()).toStrictEqual(expiryDate.getDay());
  expect(authToken.expiryDate.getHours()).toStrictEqual(expiryDate.getHours());
  expect(authToken.expiryDate.getMinutes()).toStrictEqual(expiryDate.getMinutes());
  expect(authToken.expiryDate.getSeconds()).toBeGreaterThanOrEqual(expiryDate.getMinutes());
});
