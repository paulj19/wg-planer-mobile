// import { refreshExpiredAccessToken } from "api/AuthenticationRequests";
// import AuthToken from "./AuthToken";

// export async function loadAndRefreshAccessTokenIfExpired(): Promise<AuthToken> {
//   try {
//     let authToken: AuthToken = await AuthToken.load();

//     if (!authToken.isAccessTokenExpired()) {
//       return authToken;
//     }

//     const newAuthToken: AuthToken = await refreshExpiredAccessToken(
//       tokens.refreshToken
//     );

//     saveAllTokens(newTokens); //TODO test if needs to be cleared
//     return newTokens;
//   } catch (e) {
//     throw Error("expired accessToken refresh failed: " + e);
//   }
// }
