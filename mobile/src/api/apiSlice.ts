import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { auth } from '../config/firebaseConfig';
import { setCredentials, logout } from '../store/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://10.0.2.2:3000', // Android Emulator
    prepareHeaders: (headers, { getState }) => {
        // Use PartialState to avoid importing RootState from store.ts directory
        const token = (getState() as { auth: { token: string | null } }).auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // console.log('401 detected, attempting to refresh token...');
        // Try to get a new token from Firebase
        const user = auth.currentUser;
        if (user) {
            try {
                const newToken = await user.getIdToken(true);
                // Store the new token
                api.dispatch(setCredentials({ user: { uid: user.uid, email: user.email }, token: newToken }));
                // console.log('Token refreshed successfully. Retrying request...');
                // Retry the initial query
                result = await baseQuery(args, api, extraOptions);
            } catch (refreshError) {
                // console.error('Token refresh failed', refreshError);
                api.dispatch(logout());
            }
        } else {
            // console.log('No user to refresh token for. Logging out.');
            api.dispatch(logout());
        }
    }
    return result;
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Notifications'],
    endpoints: (builder) => ({
        getNotifications: builder.query<any[], void>({
            query: () => '/notifications',
            providesTags: ['Notifications'],
        }),
        createNotification: builder.mutation<void, { title: string; body: string }>({
            query: (body) => ({
                url: '/notifications',
                method: 'POST',
                body,
            }),
            async onQueryStarted(newNotification, { dispatch, queryFulfilled }) {
                // Optimistic Update: Immediately add to local cache
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getNotifications', undefined, (draft) => {
                        draft.unshift({
                            id: 'temp-' + Date.now(), // Temporary ID
                            ...newNotification,
                            timestamp: new Date().toISOString(),
                            status: 'pending', // Assume pending initially
                        });
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo(); // Rollback on failure
                }
            },
            invalidatesTags: ['Notifications'], // Still refetch to get real ID/status from server
        }),
        registerToken: builder.mutation<void, { token: string }>({
            query: (body) => ({
                url: '/notifications/register-token',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useCreateNotificationMutation,
    useRegisterTokenMutation,
} = apiSlice;
