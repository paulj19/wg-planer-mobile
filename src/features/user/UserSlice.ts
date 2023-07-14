import { RESOURCE_SERVER_DEV } from "../../lib/UrlPaths";
import { REHYDRATE } from "redux-persist";
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../api/apiSlice";

export const userSlice = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery({ baseUrl: RESOURCE_SERVER_DEV }),
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => ({ url: "/userprofile", method: "get" }),
    }),
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === REHYDRATE) {
      return action.payload?.[reducerPath];
    }
  },
});

export const { useGetUserProfileQuery } = userSlice;

