import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';

// 1. Foreground Handler (Heads-up Display)
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true, // Show basic alert
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true, // Show top banner
        shouldShowList: true, // Show in notification center
    }),
});

export function NotificationObserver() {
    const navigation = useNavigation<any>();
    const responseListener = useRef<Notifications.Subscription>(undefined);

    useEffect(() => {
        // 2. Quit State (Initial Notification)
        // Check if app was opened via a notification from a killed state
        Notifications.getLastNotificationResponseAsync().then((response) => {
            if (response?.notification.request.content.data) {
                // Navigate or handle deep link
                const data = response.notification.request.content.data;
                // console.log('App opened from killed state via notification:', data);
                // Navigate to list (or specific detail screen in future)
                navigation.navigate('NotificationList');
            }
        });

        // 3. Background/Foreground Interaction
        // User taps on notification while app is running or in background
        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            const data = response.notification.request.content.data;
            // console.log('Notification tapped:', data);
            // Navigate to list (or specific detail screen in future)
            navigation.navigate('NotificationList');
        });

        return () => {
            if (responseListener.current) {
                responseListener.current.remove();
            }
        };
    }, [navigation]);

    return null; // This component handles logic only
}
