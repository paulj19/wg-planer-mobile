import {
  GENERATE_CODE,
  GO_BACKEND,
  RESOURCE_SERVER_DEV,
  URL_POST_LOGIN,
} from "util/UrlPaths";
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
    generateCode: builder.mutation({
      query: (data) => ({
        url: GENERATE_CODE,
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      }),
    }),
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === REHYDRATE) {
      return action.payload?.[reducerPath];
    }
  },
});

export const { useGenerateCodeMutation } = userSlice;
