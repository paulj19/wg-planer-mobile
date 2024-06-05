import MockAdapter from "axios-mock-adapter";
import { PATH_LOGIN, PATH_VALIDATE_ACCESS_TOKEN, URL_POST_LOGIN } from "util/UrlPaths";

let mock;

export function initializeMocks(client) {
  console.log("initializing mocks");
  mock = new MockAdapter(client);
  // getToken();
  // validateAccessToken();
 // mockPostLoginInfo();
}

const mockUser = {
  id: "1",
  username: "test user",
  password: "Password123!",
  email: "testuser@email.com",
};

const getToken = () =>
  mock.onPost("/oauth2/token").reply(200, mockUser, {
    access_token:
      "eyJraWQiOiJkYzA3Y2Q0Mi1kYzBlLTRjMjItYWNiNi0yMGVlMDZhM2UwYjUiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImF1ZCI6IndnLXBsYW5lciIsIm5iZiI6MTY3NjgwMTY0MSwic2NvcGUiOlsib3BlbmlkIl0sImlzcyI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDgwIiwiZXhwIjoxNjc2ODAxOTQxLCJpYXQiOjE2NzY4MDE2NDF9.X-wpigNzt8-L9Lg6n25r5_pAGvViaTF5wfZ-Cr1byle9PRZWOFEHbnJYj98Vo1YxSVnEkLxXLour9x0ArTYsCQJfu1PK2f0gCv9R3Lqx2cF23vNW8n-JuDGjwtlaGAdlsR0yqz5OWMR7PT0gUdMJy63dH5_8ypR7oYxphHMQrVDN6RE0LTwn46cpMEb-GV6WjD-6nT7EcA2pveAwopbE8G3ZnAe8AkACUnmkMwqwSqvZdzgP5X1e283xlpDIveOY1ArNtilufBnV9lpd8rMt-dcfe27bNxhIh32it9eoKlzR1Dh7tXqTFvfpf_l_JD8RkjBYfT9Kgy-SldreyeI7gQ",
    refresh_token:
      "9fsVihzsajMAcOJAlWlXRwqZazPzcIhtHkeI4DqD7blrzSDgRtcFGdNkHnrazC6UBmNLhfKEeE2CtVbl2yTUAje-IuommT0MMJTlv9XvDo43-Wn9pU62U3hPgJqL--pE",
    id_token:
      "eyJraWQiOiJkYzA3Y2Q0Mi1kYzBlLTRjMjItYWNiNi0yMGVlMDZhM2UwYjUiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3Q6ODA4MCIsInN1YiI6ImFkbWluIiwiYXVkIjoid2ctcGxhbmVyIiwiZXhwIjoxNjc2ODAzNDQxLCJpYXQiOjE2NzY4MDE2NDEsImF6cCI6IndnLXBsYW5lciJ9.Gf1IigjqiWNoei_3Ld7n92AYUKwVhzLeuWae59B1mHky-0hNiIDRgwKJVwMECw-DHeauQZ_RmvNgZmX2p_VWbjRX2c2O7760JUKIM3tyCt3yMvHQrNaVTVdbfTYCISTIR4eVkBHdtS1UZ_MuIw6aV-u0IiMGecMBrjnCVp0UZ2cG4gFAWKaMP_wWxlo0jKTX2DwTwWdT2iyeNQ7Oop7Hsx-BZ2H2NOHvTQ1r4kyGQQfg9UVSEWNHhXRHjn5uU6-5zSYnOeIIG29HVXo6ceKTiQ_GMBC_yiJjmhkg60-L71zDU_JGELTgZtTBGmuipBzvpbQRDwnPla1mN7C5la-5Nw",
    expires_in: "2023-02-28T21:38:45.189Z",
    token_type: "Bearer",
    scope: "openid",
  });

const validateAccessToken = () =>
  mock.onGet(PATH_VALIDATE_ACCESS_TOKEN).reply(200, mockUser, {
    Authorization: "Bearer: newAccessToken123.",
    refresh_token: "refreshToken123!",
  });

export function mockPostLoginInfo() {
  mock.onGet(URL_POST_LOGIN).reply(200, {
    floor: {
      Id: "66603e2a00afb9bb44b3cadb",
      FloorName: "Awesome floor",
      Residents: null,
      Tasks: [
        { Id: "0", Name: "Gelbersack weg", AssignedTo: "" },
        { Id: "1", Name: "Mülltonne ", AssignedTo: "" },
        { Id: "2", Name: "Küche reinigen ", AssignedTo: "" },
        { Id: "3", Name: "Schwarz sack", AssignedTo: "" },
      ],
      Rooms: [
        { Id: "0", Number: "301", Order: 1, Resident: "" },
        { Id: "1", Number: "302", Order: 2, Resident: "" },
        { Id: "2", Number: "303", Order: 3, Resident: "" },
        { Id: "3", Number: "304", Order: 4, Resident: "" },
        { Id: "4", Number: "305", Order: 5, Resident: "" },
        { Id: "5", Number: "306", Order: 6, Resident: "" },
      ],
    },
    userprofile: {
      id: 1,
      username: "Paulo",
      email: "maxmuster@gmail.com",
      floorId: "66603e2a00afb9bb44b3cadb",
      oid: 1,
      authServer: "HOME_BREW",
    },
  });
}
