import { RESOURCE_SERVER_DEV } from "util/UrlPaths";
import { REHYDRATE } from "redux-persist";
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "features/api/apiSlice";
import AuthToken from "features/auth/AuthToken";
import { createSelector } from "@reduxjs/toolkit";
import { useState } from "react";

export const userSlice = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery({ baseUrl: RESOURCE_SERVER_DEV }),
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => ({
        url: "/userprofile",
        method: "get",
      }),
    }),
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === REHYDRATE) {
      return action.payload?.[reducerPath];
    }
  },
});

const selectUserProfileResult = userSlice.endpoints.getUserProfile.select();

export const userprofilex = createSelector(selectUserProfileResult, result => result.data)

export const { useLazyGetUserProfileQuery, useGetUserProfileQuery } = userSlice;

