import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor, AppDispatch } from './src/store/store';
import { ActivityIndicator, View } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/config/firebaseConfig';
import { setCredentials, logout } from './src/store/authSlice';

// Component to sync Firebase Auth state with Redux
function AuthSync() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        dispatch(setCredentials({ user: { uid: user.uid, email: user.email }, token }));
      } else {
        dispatch(logout());
      }
    });

    return unsubscribe;
  }, [dispatch]);

  return <AppNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#6C63FF" /></View>} persistor={persistor}>
        <SafeAreaProvider>
          <AuthSync />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
