import * as storage from "../../util/storage/Store";
import AuthToken from "./AuthToken";
import { refreshExpiredAccessToken } from "../../api/AuthenticationRequests";

export async function loadAndRefreshAccessTokenIfExpired(): Promise<void> {
  try {
    //why did you think typescript would not do something
    await loadAuthToken();
    await checkAndRefreshExpiredAccessToken();
  } catch (e) {
    throw Error("Expired accessToken refresh failed: " + e);
  }
}

export function storeAuthToken(): void {
  try {
    storage.save("auth-token", AuthToken);
  } catch (e) {
    throw Error("Error saving AuthToken: " + e);
  }
}

export async function loadAuthToken(): Promise<void> {
  try {
    const tokens = await storage.load("auth-token");
    if (tokens) {
      AuthToken.fromStorage(tokens);
    }
  } catch (e) {
    throw Error("Error loading AuthToken: " + e);
  }
}

export async function clearAuthToken(): Promise<void> {
  AuthToken.clear();
  await storage.remove("auth-token");
}

function isAccessTokenExpired(): boolean {
  //first condition is imp bc it breaks the flow for non auth req
  if (
    AuthToken.expiryDate &&
    AuthToken.expiryDate.getTime() < new Date().getTime()
  ) {
    return true;
  }
  return false;
}

export async function checkAndRefreshExpiredAccessToken(): Promise<void> {
  if (isAccessTokenExpired() && AuthToken.refreshToken) {
    const newAuthToken = await refreshExpiredAccessToken(
      AuthToken.refreshToken
    );
    updateAndStoreAuthToken(newAuthToken);
  }
}

export function updateAndStoreAuthToken(newAuthToken: any) {
  if (newAuthToken) {
    AuthToken.fromApiResponse(newAuthToken);
    storeAuthToken();
  } else if (newAuthToken === null) {
    clearAuthToken();
  }
}
