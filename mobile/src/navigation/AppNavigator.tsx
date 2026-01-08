import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import NotificationListScreen from '../screens/NotificationListScreen';
import CreateNotificationScreen from '../screens/CreateNotificationScreen';
import { useAuth } from '../hooks/useAuth';
import { NotificationObserver } from '../components/NotificationObserver';
import { TokenManager } from '../components/TokenManager';

const Stack = createNativeStackNavigator();

// 1. Auth Stack (Public)
function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#121212' } }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
}

// 2. App Stack (Protected)
function AppStack() {
    return (
        <>
            <TokenManager />
            <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#121212' } }}>
                <Stack.Screen name="NotificationList" component={NotificationListScreen} />
                <Stack.Screen name="CreateNotification" component={CreateNotificationScreen} />
            </Stack.Navigator>
        </>
    );
}

export default function AppNavigator() {
    // We use token existence to determine auth state
    const { isAuthenticated } = useAuth();

    return (
        <NavigationContainer>
            <NotificationObserver />
            {isAuthenticated ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
}
