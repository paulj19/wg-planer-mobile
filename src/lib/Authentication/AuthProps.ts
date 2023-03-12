import * as AuthSession from "expo-auth-session";

export const authProps = {
  clientId: "wg-planer",
  clientSecret: "secret",
  scopes: ["openid"],
  redirectUri: {
    scheme: "wg-planer",
    path: "/wg-planer/login",
    native: "wg-planer-mobile://wg-planer/login",
  },
};
