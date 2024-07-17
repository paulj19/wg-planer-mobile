import { MOCK_BASE_URL, URL_INTROSPECT_TOKEN } from "util/UrlPaths";
import { http, HttpResponse } from 'msw'

const withMockBaseUrl = (path) => {
  return new URL(path, MOCK_BASE_URL).toString();
}

export const authHandlers = [
  http.get(URL_INTROSPECT_TOKEN, () => {
    return HttpResponse.json({active: true})
  }),
];
