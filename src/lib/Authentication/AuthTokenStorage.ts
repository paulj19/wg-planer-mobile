import * as storage from "../../util/storage/Store";
import AuthToken from "./AuthToken";
import {
  introspectToken,
  refreshExpiredAccessToken,
} from "../../api/AuthenticationRequests";

export async function loadAndRefreshAccessTokenIfExpired(): Promise<void> {
  //why did you think typescript would not do something
  await loadAuthToken();
  if (AuthToken.isAccessTokenPresent()) {
    const isAccessTokenValid_ = await introspectToken(AuthToken.accessToken!);
    if (!isAccessTokenValid_) {
      await refreshAccessToken();
    }
  }
}

export async function loadAuthToken(): Promise<void> {
  try {
    const tokens = await storage.getItem("auth-token");
    if (tokens) {
      AuthToken.fromStorage(tokens);
    }
  } catch (e) {
    throw Error("Error loading AuthToken: " + e);
  }
}

export async function clearAuthToken(): Promise<void> {
  AuthToken.clear();
  await storage.removeItem("auth-token");
}

export async function refreshAccessTokenIfExpired(): Promise<void> {
  if (isAccessTokenExpired()) {
    refreshAccessToken();
  }
}

export async function refreshAccessToken(): Promise<void> {
  if (AuthToken.refreshToken) {
    const newAuthToken = await refreshExpiredAccessToken(
      AuthToken.refreshToken
    );
    updateAndStoreAuthToken(newAuthToken);
  } else {
    throw new Error("Invalid accessToken and refreshToken not found");
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

export function storeAuthToken(): void {
  try {
    storage.setItem("auth-token", AuthToken);
  } catch (e) {
    throw Error("Error saving AuthToken: " + e);
  }
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
