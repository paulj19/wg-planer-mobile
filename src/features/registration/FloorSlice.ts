import { RESOURCE_SERVER_DEV } from "util/UrlPaths";
import { REHYDRATE } from "redux-persist";
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "features/api/apiSlice";

export const floorSlice = createApi({
  reducerPath: "floorApi",
  baseQuery: axiosBaseQuery({ baseUrl: "http://192.168.1.9:8080" }),
  endpoints: (builder) => ({
    getFloor: builder.query({
      query: () => ({
        url: "http://192.168.1.9:8080/floor",
        method: "get",
      }),
    }),
    createFloor: builder.mutation({
      query: (body) => {
        console.log("Body", body);
        return {
          url: "/floor",
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          data: body,
        };
      },
    }),
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === REHYDRATE) {
      return action.payload?.[reducerPath];
    }
  },
});

export const { useGetFloorQuery, useCreateFloorMutation } = floorSlice;
