import {
  ADD_NEW_RESIDENT,
  GENERATE_CODE,
  GO_BACKEND,
  RESOURCE_SERVER_DEV,
  SUBMIT_CODE,
  URL_POST_LOGIN,
  URL_REGISTER_NEW,
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
    submitCode: builder.mutation({
      query: (data) => ({
        url: SUBMIT_CODE,
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      }),
    }),
    addNewResident: builder.mutation({
      query: (data) => ({
        url: ADD_NEW_RESIDENT,
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      }),
    }),
    registerNewUser: builder.mutation({
      query: (data) => ({
        url: URL_REGISTER_NEW,
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

export const { useGenerateCodeMutation, useSubmitCodeMutation, useAddNewResidentMutation, useRegisterNewUserMutation } = userSlice;
