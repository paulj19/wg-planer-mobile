import * as React from "react";
import { Button } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { Platform } from "react-native";
import {
  URL_AUTHORIZATION,
  URL_GET_TOKEN,
  URL_REVOKE_TOKEN,
} from "../lib/UrlPaths";
import { authProps } from "../lib/Authentication/AuthProps";
import { getToken } from "../api/AuthenticationRequests";
import { updateAndStoreAuthToken } from "../lib/Authentication/AuthTokenStorage";

let discovery: any;
let redirectUri: any;

export default function Login({setIsTokenLoaded}) {
  const useProxy = Platform.select({ web: false, default: true });

  WebBrowser.maybeCompleteAuthSession();

  // discovery = AuthSession.useAutoDiscovery(URL_AUTH_SERVER);
  discovery = React.useMemo(
    () => ({
      authorizationEndpoint: URL_AUTHORIZATION,
      tokenEndpoint: URL_GET_TOKEN,
      revocationEndpoint: URL_REVOKE_TOKEN,
    }),
    []
  );
  redirectUri = AuthSession.makeRedirectUri({
    scheme: authProps.redirectUri.scheme,
    path: authProps.redirectUri.path,
    native: authProps.redirectUri.native,
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: authProps.clientId,
      responseType: AuthSession.ResponseType.Code,
      redirectUri,
      scopes: authProps.scopes,
      usePKCE: false,
    },
    discovery
  );

  React.useEffect(() => {
    if (response) {
      if (response.error) {
        console.error("getting authCode failed: " + response.error);
      }
      if (response.type === "success") {
        setIsTokenLoaded(false);
        getToken(discovery.tokenEndpoint, response.params.code, redirectUri)
          .then((apiResponse) => {
            updateAndStoreAuthToken(apiResponse);
            setIsTokenLoaded(true);
          })
          .catch((e) => {
            console.error("getToken failed after gettting authCode: " + e);
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
