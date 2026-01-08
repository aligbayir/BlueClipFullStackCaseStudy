import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotificationsAsync() {
    // SDK 53+ Check: Push Notifications are disabled in Expo Go on Android
    if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
        // console.log('Detected Expo Go: Remote Push Notifications are disabled. Please use a Development Build.');
        return null;
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (!Device.isDevice && Platform.OS !== 'android') {
        // console.log('Must use physical device for Push Notifications');
        return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return null;
    }

    try {
        // In SDK 50+, projectId is in expoConfig
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

        let token;
        if (projectId) {
            token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
            // console.log('Expo Push Token:', token);
        } else {
            // Fallback to device push token if no EAS Project ID
            // console.log('No EAS Project ID found, skipping Expo Push Token fetch.');
            /* 
            // Optional: Get Device Push Token (FCM/APNS) instead
            const deviceToken = (await Notifications.getDevicePushTokenAsync()).data;
            // console.log('Device Push Token:', deviceToken);
            token = deviceToken; 
            */
            return null;
        }

        return token;
    } catch (e) {
        // console.error('Error fetching push token:', e);
        return null;
    }
}

// Listener for token refresh
export function addTokenRefreshListener(callback: (token: string) => void) {
    return Notifications.addPushTokenListener(({ data: token }) => {
        // console.log('Push token refreshed:', token);
        callback(token);
    });
}
