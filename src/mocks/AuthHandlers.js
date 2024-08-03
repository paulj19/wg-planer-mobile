import { MOCK_BASE_URL, URL_INTROSPECT_TOKEN, URL_REGISTER_NEW } from "util/UrlPaths";
import { http, HttpResponse } from "msw";

const withMockBaseUrl = (path) => {
  return new URL(path, MOCK_BASE_URL).toString();
};

export const authHandlers = [
  http.get(URL_INTROSPECT_TOKEN, () => {
    return HttpResponse.json({ active: true });
  }),
  // http.post(URL_REGISTER_NEW, () => {
  //   console.log("Register new user");
  //   return HttpResponse.json({
  //       id: 13,
  //       username: "Max Musterman",
  //       email: "max.mustermann@gmail.com",
  //       floorId: "669fca69d244526d709f6d76",
  //       oid: 13,
  //       authServer: "HOME_BREW",
  //     })
  // }),
];
