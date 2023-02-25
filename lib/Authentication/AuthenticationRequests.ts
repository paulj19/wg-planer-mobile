import axios from "./../axiosConfig";

export const getToken = (
  response: any,
  redirectUri: string,
  discovery: any,
  clientId: string,
  clientSecret: string,
  grantType: string,
): TokenDto => {
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
    });
};

// export function validate() {
//   return axios({
//     method: "post",
//     url: discovery,
//     auth: {
//       username: clientId,
//       password: clientSecret,
//     },
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     data: {
//       code: response.params.code,
//       client_id: clientId,
//       redirect_uri: redirectUri,
//       grant_type: grantType,
//     },
//   })
//     .then((response) => {
//       if (response?.data) {
//         const tokenDto: TokenDto = {
//           accessToken: response.data?.access_token,
//           refreshToken: response.data?.refresh_token,
//           idToken: response.data?.id_token, //todo remove
//           expiresIn: response.data?.expires_in,
//           tokenType: response.data?.token_type,
//           scope: response.data?.scope,
//         };
//         return tokenDto;
//       }
//     })
//     .catch((e) => {
//       console.log("Failed to load token: " + e);
//     });
// }
