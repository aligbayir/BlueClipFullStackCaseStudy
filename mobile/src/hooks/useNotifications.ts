import { useGetNotificationsQuery, useCreateNotificationMutation } from '../api/apiSlice';

export const useNotifications = () => {
    const { data: notifications = [], isLoading, isError, refetch, isFetching } = useGetNotificationsQuery();
    const [createNotification, { isLoading: isCreating }] = useCreateNotificationMutation();

    return {
        notifications,
        isLoading,
        isError,
        refetch,
        isFetching,
        createNotification,
        isCreating,
    };
};
