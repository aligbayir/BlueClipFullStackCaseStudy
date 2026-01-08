import { useEffect, useRef } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { registerForPushNotificationsAsync, addTokenRefreshListener } from '../services/FirebaseMessagingService';
import { useRegisterTokenMutation } from '../api/apiSlice';
import * as Notifications from 'expo-notifications';

export function TokenManager() {
    const [registerTokenApi] = useRegisterTokenMutation();
    const tokenListener = useRef<Notifications.Subscription>(undefined);

    const syncToken = async (token: string) => {
        try {
            await registerTokenApi({ token }).unwrap();
            // console.log('Token synced with backend');
        } catch (error) {
            // console.error('Failed to sync token:', error);
        }
    };

    const handleInitialRegistration = async () => {
        const token = await registerForPushNotificationsAsync();
        if (token) {
            await syncToken(token);
        } else {
            // Permission denied or failure
            Alert.alert(
                'Notifications Disabled',
                'To receive updates, please enable push notifications in your settings.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Open Settings',
                        onPress: () => {
                            if (Platform.OS === 'ios') {
                                Linking.openURL('app-settings:');
                            } else {
                                Linking.openSettings();
                            }
                        }
                    }
                ]
            );
        }
    };

    useEffect(() => {
        // 1. Initial Check/Register on mount (which happens after login due to Navigator structure)
        handleInitialRegistration();

        // 2. Listen for Refreshes
        tokenListener.current = addTokenRefreshListener((newToken: string) => {
            syncToken(newToken);
        });

        return () => {
            if (tokenListener.current) {
                tokenListener.current.remove();
            }
        };
    }, []);

    return null;
}
