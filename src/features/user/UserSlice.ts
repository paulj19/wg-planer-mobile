import { GO_BACKEND, RESOURCE_SERVER_DEV, URL_POST_LOGIN } from "util/UrlPaths";
import { REHYDRATE } from "redux-persist";
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "features/api/apiSlice";
import AuthToken from "features/auth/AuthToken";
import { createSelector } from "@reduxjs/toolkit";
import { useState } from "react";

export const userSlice = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getPostLoginInfo: builder.query({
      query: () => ({
        url: URL_POST_LOGIN,
        method: "get",
      }),
    }),
    getPostLoginInfox: builder.query({
      query: () => ({
        url: URL_POST_LOGIN,
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

// const selectPostLoginInfoResult = userSlice.endpoints.getPostLoginInfo.select();
// export const postLoginInfo = createSelector(
//   selectPostLoginInfoResult,
//   (result) => result.data
// );
// export const selectPostLoginInfoByUserId = createSelector(
//   selectPostLoginInfoResult,
//   (state, userId) => userId,
//   (tasks, userId) => tasks.find((task) => task.Assigne === userId)
// );
// const selectUserProfileResult = userSlice.endpoints.getUserProfile.select();

// export const userprofilex = createSelector(selectUserProfileResult, result => result.data)

export const { useLazyGetPostLoginInfoQuery, useGetPostLoginInfoQuery, useGetPostLoginInfoxQuery } = userSlice;
