import { apiSlice } from '../api/apiSlice';

export const userSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () =>({ url: '/userprofile', method: 'get' }),
    })
  })
})

export const { useGetUserProfileQuery } = userSlice;

