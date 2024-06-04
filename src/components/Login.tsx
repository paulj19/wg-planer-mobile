import * as React from "react";
import { Button } from "react-native-paper";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import {
  URL_AUTHORIZATION,
  URL_GET_TOKEN,
  URL_REVOKE_TOKEN,
} from "util/UrlPaths";
import { authProps } from "features/auth/AuthProps";
import { getToken } from "features/auth/AuthenticationRequests";
import { updateAndStoreAuthToken } from "features/auth/AuthTokenStorage";
import { AuthContext } from "App";
import { isDeviceDesktop } from "util/Device";

let discovery: any;
let redirectUri: any;

export default function Login({ navigation, route }) {
  const { authContext } = React.useContext(AuthContext);
  let useProxy = true;
  if (isDeviceDesktop()) {
    useProxy = false;
  }

  WebBrowser.maybeCompleteAuthSession();

  // discovery = AuthSession.useAutoDiscovery(URL_AUTH_SERVER);
  discovery = React.useMemo(
    () => ({
      authorizationEndpoint: URL_AUTHORIZATION,
      tokenEndpoint: URL_GET_TOKEN,
      revocationEndpoint: URL_REVOKE_TOKEN,
      projectNameForProxy: "@paulo48/wg-planer-mobile",
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
    if (request && route.params?.promptWindow) {
      promptAsync(useProxy);
    }
  }, [request]);

  React.useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
    });

    if (response) {
      if (response.error) {
        console.error("getting authCode failed: " + response.error);
      }
      if (response.type === "success") {
        getToken(discovery.tokenEndpoint, response.params.code, redirectUri)
          .then((apiResponse) => {
            console.log("API RESponse", apiResponse);
            updateAndStoreAuthToken(apiResponse);
            authContext.signIn({ newLogin: true });
          })
          .catch((e) => {
            console.error("getToken failed after gettting authCode: " + e);
          });
      }
    }
  }, [discovery, request, response]);

  return (
    <Button
      mode="contained-tonal"
      style={{
        width: "75%",
      }}
      onPress={() => promptAsync(useProxy)}
      disabled={!request}
    >
      LOGIN
    </Button>
  );
}
