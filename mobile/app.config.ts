import { ExpoConfig, ConfigContext } from 'expo/config';
import * as fs from 'fs';
import * as path from 'path';

export default ({ config }: ConfigContext): ExpoConfig => {
  const googleServicesPath = path.resolve(__dirname, 'google-services.json');
  const hasGoogleServices = fs.existsSync(googleServicesPath);

  return {
    ...config,
    name: 'mobile',
    slug: 'mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      package: 'com.blueclip.notificationapp',
      googleServicesFile: hasGoogleServices ? './google-services.json' : undefined,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      /* eas: {
        projectId: "your-eas-project-id"
      } */
    },
  };
};
