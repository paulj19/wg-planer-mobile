import { URL_USER_PROFILE } from "./../lib/UrlPaths";
import { rest } from "msw";
import type { UserProfile } from "../types/UserProfile";

const userprofile: UserProfile = {
  username: "Max Muster",
  email: "max@muster.de",
};

export const userHandlers = [
  rest.get(URL_USER_PROFILE, (req, res, ctx) => {
    console.log("URL_USER_PROFILE")
    return res(ctx.json(userprofile), ctx.status(200));
  }),
  rest.get("http://localhost/xxx", (req, res, ctx) => {
    console.log("XXX")
    return res(ctx.json(userprofile), ctx.status(200));
  }),
];
