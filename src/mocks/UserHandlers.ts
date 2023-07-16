import { URL_USER_PROFILE } from "util/UrlPaths";
import { rest } from "msw";
import type { UserProfile } from "types";

const userprofile: UserProfile = {
  username: "Max Muster",
  email: "max@muster.de",
};

export const userHandlers = [
  rest.get(URL_USER_PROFILE, (req, res, ctx) => {
    return res(ctx.json(userprofile), ctx.status(200));
  }),
];
