import { URL_POST_LOGIN, URL_USER_PROFILE } from "util/UrlPaths";
import type { UserProfile } from "types/types";
import { http, HttpResponse } from 'msw'
import floorStub from "./stubs/floorStub";

const userprofile: UserProfile = {
  id: 423,
  username: "Max Muster",
  email: "max@muster.de",
};

export const userHandlers = [
  // rest.get(URL_USER_PROFILE, (req, res, ctx) => {
  //   return res(ctx.json(userprofile), ctx.status(200));
  // }),

  // rest.get(URL_POST_LOGIN, (req, res, ctx) => {
  // http.get(URL_POST_LOGIN, () => {
  //   return res(ctx.json({
  //   floor: floorStub,
  //   userprofile: {
  //     id: 1,
  //     username: "Max Musterman",
  //     email: "maxmuster@gmail.com",
  //     floorId: "66603e2a00afb9bb44b3cadb",
  //     oid: 1,
  //     authServer: "HOME_BREW",
  //   },
  // }), ctx.status(200))
  // })
];
