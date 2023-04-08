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
    storage.save("auth-token", JSON.stringify(AuthToken));
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

function isAccessTokenExpired(): boolean {
  //will redirect to loginScreen when null
  if (AuthToken.expiryDate && AuthToken.expiryDate.getTime() < new Date().getTime()) {
    return true;
  }
  return false;
}

async function checkAndRefreshExpiredAccessToken(): Promise<void> {
  if (isAccessTokenExpired() && AuthToken.refreshToken) {
    const newAuthToken = await refreshExpiredAccessToken(
      AuthToken.refreshToken
    );
    if (newAuthToken) {
      AuthToken.fromApiResponse(newAuthToken);
      storeAuthToken();
    }
  }
}
