import * as React from "react";
import { Button, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import axios from "./../axiosConfig";
import { tokenDto, TokenDto } from "./../../TokenDto";
import * as AuthSession from "expo-auth-session";
import { Platform } from "react-native";
import { URL_AUTH_SERVER } from "./../UrlPaths";
import * as secureStorage from "../../util/storage/SecureStore";
import { StoredItems } from "../../util/storage/SecureStore";
import { AuthContext } from "../../App.js";

const clientId = "wg-planer";
const clientSecret = "secret";
const grantType = "authorization_code";

export default function LoginScreen() {
  const useProxy = Platform.select({ web: false, default: true });
  const authContext = React.useContext(AuthContext);

  WebBrowser.maybeCompleteAuthSession();

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "wg-planer",
    path: "/wg-planer/login",
    native: "wg-planer-mobile://wg-planer/login",
  });

  const discovery = AuthSession.useAutoDiscovery(URL_AUTH_SERVER);
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      responseType: AuthSession.ResponseType.Code,
      redirectUri,
      scopes: ["openid"],
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
        authInfo = getToken(response, redirectUri, discovery)
          .then(async (r) => {
            await Promise.allSettled([
              secureStorage.save(StoredItems.ACCESS_TOKEN, r.accessToken),
              secureStorage.save(StoredItems.REFRESH_TOKEN, r.refreshToken),
              secureStorage.save(StoredItems.ID_TOKEN, r.idToken),
              secureStorage.save(StoredItems.TOKEN_TYPE, r.tokenType),
              secureStorage.save(StoredItems.EXPIRES_IN, r.expiresIn),
              secureStorage.save(StoredItems.SCOPE, r.scope),
            ]);
  console.log("XXCC" + r);
  console.log(authContext.signIn(r));
            return r;
          })
          .catch((e) => {
            console.error(e);
          });
      }
    }

  }, [discovery, request, response]);

  // console.log("XXX: " + xxx.signIn);
// xxx.signIn(authInfo);
  return (
    <Button
      title="Login"
      disabled={!request}
      onPress={() => promptAsync(useProxy)} //todo take useProxy from Authentication
    />
  );
}

export const getToken = async (
  response: any,
  redirectUri: string,
  discovery: any
): Promise<TokenDto> => {
  return axios({
    method: "post",
    url: discovery.tokenEndpoint,
    auth: {
      username: clientId,
      password: clientSecret,
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {
      code: response.params.code,
      client_id: clientId,
      redirect_uri: redirectUri,
      grant_type: grantType,
    },
  })
    .then((response) => {
      console.log("RESPONSE" + response);
      //todo test will catch catch a npe
      if (response?.data) {
        const tokenDto: TokenDto = {
          accessToken: response.data?.access_token,
          refreshToken: response.data?.refresh_token,
          idToken: response.data?.id_token, //todo remove
          expiresIn: response.data?.expires_in,
          tokenType: response.data?.token_type,
          scope: response.data?.scope,
        };
        return tokenDto;
      }
    })
    .catch((e) => {
      console.log("Failed to load token: " + e);
      return null;
    });
};
