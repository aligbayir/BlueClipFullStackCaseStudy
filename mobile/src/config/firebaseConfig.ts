// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import Constants from 'expo-constants';
// @ts-ignore
import { getAuth, initializeAuth, Auth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Fallback for different Expo environments (Go vs Build)
const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};

const firebaseConfig = {
    apiKey: extra.firebaseApiKey,
    authDomain: extra.firebaseAuthDomain,
    projectId: extra.firebaseProjectId,
    storageBucket: extra.firebaseStorageBucket,
    messagingSenderId: extra.firebaseMessagingSenderId,
    appId: extra.firebaseAppId,
};

if (!extra.firebaseApiKey) {
    // console.error('CRITICAL: Firebase API Key is missing on the client side.');
}

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;

if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
} else {
    app = getApp();
    auth = getAuth(app);
}

export { app, auth };
