import {
  GO_BACKEND,
  RESOURCE_SERVER_DEV,
  SET_EXPO_PUSH_TOKEN,
  TASK_REMINDER as REMIND_TASK,
  UPDATE_TASK,
  URL_POST_LOGIN,
  UPDATE_AVAILIBILITY,
  CREATE_TASK,
} from "util/UrlPaths";
import { REHYDRATE } from "redux-persist";
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "features/api/apiSlice";

export const floorSlice = createApi({
  reducerPath: "floorApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getFloor: builder.query({
      query: (floorId) => ({
        url: `/floor/${floorId}`,
        method: "get",
      }),
    }),
    createFloor: builder.mutation({
      query: (body) => {
        return {
          url: "/floor/",
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          data: body,
        };
      },
      async onQueryStarted({ ...data }, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            floorSlice.util.updateQueryData(
              "getFloor",
              result?.data?.Id,
              (draft) => {
                Object.assign(draft, result?.data);
              }
            )
          );
        } catch (e) {
          console.error(e);
        }
      },
    }),
    getPostLoginInfo: builder.query({
      query: () => ({
        url: URL_POST_LOGIN,
        method: "get",
      }),
    }),
    updateTask: builder.mutation({
      query: (data) => ({
        url: UPDATE_TASK,
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      }),
      async onQueryStarted({ ...data }, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            floorSlice.util.updateQueryData(
              "getPostLoginInfo",
              result?.data?.floor?.Id,
              (draft) => {
                Object.assign(draft.floor, result?.data);
              }
            )
          );
        } catch (e) {
          console.error(e);
        }
      },
    }),
    registerExpoPushToken: builder.mutation({
      query: (data) => ({
        url: SET_EXPO_PUSH_TOKEN,
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      }),
      async onQueryStarted({ ...data }, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            floorSlice.util.updateQueryData(
              "getPostLoginInfo",
              result?.data?.floor?.Id,
              (draft) => {
                Object.assign(draft.floor, result?.data);
              }
            )
          );
        } catch (e) {
          console.error(e);
        }
      },
    }),
    remindTask: builder.mutation({
      query: (data) => ({
        url: REMIND_TASK,
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      }),
      async onQueryStarted({ ...data }, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            floorSlice.util.updateQueryData(
              "getPostLoginInfo",
              result?.data?.floor?.Id,
              (draft) => {
                Object.assign(draft.floor, result?.data);
              }
            )
          );
        } catch (e) {
          console.error(e);
        }
      },
    }),
    updateAvailabilityStatus: builder.mutation({
      query: (data) => ({
        url: UPDATE_AVAILIBILITY,
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      }),
      async onQueryStarted({ ...data }, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            floorSlice.util.updateQueryData(
              "getPostLoginInfo",
              result?.data?.floor?.Id,
              (draft) => {
                Object.assign(draft.floor, result?.data);
              }
            )
          );
        } catch (e) {
          console.error(e);
        }
      },
    }),
    createTask: builder.mutation({
      query: (data) => ({
        url: CREATE_TASK,
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      }),
      async onQueryStarted({ ...data }, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            floorSlice.util.updateQueryData(
              "getPostLoginInfo",
              result?.data?.floor?.Id,
              (draft) => {
                Object.assign(draft.floor, result?.data);
              }
            )
          );
        } catch (e) {
          console.error(e);
        }
      },
    }),
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === REHYDRATE) {
      return action.payload?.[reducerPath];
    }
  },
});

export const {
  useGetFloorQuery,
  useCreateFloorMutation,
  useLazyGetPostLoginInfoQuery,
  useGetPostLoginInfoQuery,
  useUpdateTaskMutation,
  useRegisterExpoPushTokenMutation,
  useRemindTaskMutation,
  useUpdateAvailabilityStatusMutation,
  useCreateTaskMutation,
} = floorSlice;
