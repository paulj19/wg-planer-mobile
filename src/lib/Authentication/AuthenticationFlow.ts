import AuthToken from "../../TokenDto";
import { loadAllTokens, saveAllTokens } from "../../util/storage/Store";
import { refreshExpiredAccessToken } from "./AuthenticationRequests";

export async function loadAndRefreshAccessTokenIfExpired(): Promise<AuthToken> {
  try {
    let tokens: AuthToken = await loadAllTokens();
    console.log("&&&" + JSON.stringify(tokens));

    if (tokens?.expiryDate?.getTime() > new Date().getTime()) {
      return tokens;
    }
    console.log("XXX" + tokens);
    const newTokens: AuthToken = await refreshExpiredAccessToken(
      tokens.refreshToken
    );

    saveAllTokens(newTokens); //TODO test if needs to be cleared
    return newTokens;
  } catch (e) {
    throw Error("expired accessToken refresh failed: " + e);
  }
}
