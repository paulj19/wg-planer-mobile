import * as React from "react";
import { Button } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { Platform } from "react-native";
import { URL_AUTH_SERVER } from "./../UrlPaths";
import * as storage from "../../util/storage/Store";
import { AuthContext } from "../../App.js";
import { getToken } from "./AuthenticationRequests";

export const clientId = "wg-planer";
export const clientSecret = "secret";
export const grantType = "authorization_code";
const scopes = ["openid"];
export let discovery: any;
export let redirectUri: any;

export default function LoginScreen() {
  const useProxy = Platform.select({ web: false, default: true });
  const authContext = React.useContext(AuthContext);

  WebBrowser.maybeCompleteAuthSession();

  redirectUri = AuthSession.makeRedirectUri({
    scheme: "wg-planer",
    path: "/wg-planer/login",
    native: "wg-planer-mobile://wg-planer/login",
  });

  discovery = AuthSession.useAutoDiscovery(URL_AUTH_SERVER);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      responseType: AuthSession.ResponseType.Code,
      redirectUri,
      scopes: scopes,
      usePKCE: false,
    },
    discovery
  );

  React.useEffect(() => {
    if (response) {
      if (response.error) {
        console.error(response.error);
      }
      if (response.type === "success") {
        // console.log("zzz" + getToken(response.params.code, redirectUri, discovery, clientId, clientSecret, grantType));
        getToken(response.params.code)
          .then(async (tokens) => {
            if (tokens) {
              await storage.saveAllTokens(tokens);
              authContext.signIn(tokens);
            }
          })
          .catch((e) => {
            console.error(e);
          });
      }
    }
  }, [discovery, request, response]);

  return (
    <Button
      title="Login"
      disabled={!request}
      onPress={() => promptAsync(useProxy)} //todo take useProxy from Authentication
    />
  );
}

