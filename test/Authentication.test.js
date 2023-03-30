import { URL_GET_TOKEN } from "../src/lib/UrlPaths";
import { initJestPlatformMock } from "./common_mocks";
import LoginScreen from "../src/lib/Authentication/Authentication";
import { render, screen } from "@testing-library/react"
import * as AuthSession from "expo-auth-session";

describe("AuthenticationFlow", () => {
  it("loads null token, logs in with username and pw, gets token, stores authToken and navigates to homescreen", () => {
    const serverResponseTokens = {
      access_token: "sam accessToken",
      refresh_token: "sam refreshToken",
      id_token: "sam idToken",
      expires_in: "1800",
      token_type: "sam tokenType",
      scope: "sam scope",
    };
    jest.spyOn(AuthSession, "makeRedirectUri").mockReturnValue("mockReturnUri");
    jest.spyOn(AuthSession, "useAuthRequest").mockReturnValue([null, {type: "success"}, null]);
    //
    //AuthSession.user
    //
    //
    // initJestPlatformMock();
    // jest.spyOn(storage, "load").mockReturnValue(Promise.resolve(null));
    // jest.spyOn(aStorage, "save").mockReturnValue(Promise.resolve());
    // mock.onPost(URL_GET_TOKEN).reply(200, serverResponseTokens); //will also mock getToken
    render(<LoginScreen/>);
    // screen.find
    //ponthunnu thazunnu --> homescreen
    //
  });

  it("loads non-expired token from storage, does not refresh or store and navigates to homescreen", () => {});

  it("loads expired access token, refreshes it, stores new token and navigates to homescreen", () => {});
  //login fails, shows error message gracefully
});
