import { MOCK_BASE_URL, URL_INTROSPECT_TOKEN } from "./../lib/UrlPaths";
import { rest } from "msw";

const withMockBaseUrl = (path) => {
  return new URL(path, MOCK_BASE_URL).toString();
}

export const authHandlers = [
  rest.post(URL_INTROSPECT_TOKEN, (req, res, ctx) => {
    return res(ctx.json({active: true}), ctx.status(200));
  }),
];
