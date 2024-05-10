import { RESOURCE_SERVER_DEV } from "util/UrlPaths";
import { REHYDRATE } from "redux-persist";
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "features/api/apiSlice";

export const floorSlice = createApi({
  reducerPath: "floorApi",
  baseQuery: axiosBaseQuery({ baseUrl: "http://192.168.1.9:8080" }),
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
          console.log("Result***", result?.data?.Id);
          dispatch(
            floorSlice.util.updateQueryData("getFloor", result?.data?.Id, (draft) => {
              Object.assign(draft, result?.data);
            })
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

export const { useGetFloorQuery, useCreateFloorMutation } = floorSlice;
