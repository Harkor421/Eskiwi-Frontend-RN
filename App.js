import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Platform, ActivityIndicator, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import navigationTheme from './app/navigation/navigationTheme';
import AuthNavigator from './app/navigation/AuthNavigator';
import AuthContext from './app/auth/context';
import authApi from './app/api/auth';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DrawerNavigator from './app/navigation/Sidebar/DrawerNavigator';
import authStorage from './app/auth/storage';
import { navigationRef } from './app/navigation/rootNavigation';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

// Linking configuration
// Linking configuration with id parameter
const linking = {
  prefixes: [Linking.createURL('/'), 'https://eskiwi.com', 'exp+eskiwi://'],
  config: {
    screens: {
      Home: {
        screens: {
          Inicio: {
            screens: {
              CreatorDetails: 'profile/:id',  
              UniquePost: 'post/:id',         
            },
          },
          SearchNavigator: 'search',
          Crear: 'create',
          Notifications: 'notifications',
          ChatNavigator: 'chat',
        },
      },
    },
  },
};


export default function App() {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoadingError, setIsLoadingError] = useState(false);


  useEffect(() => {
    const restoreToken = async () => {
      try {
        const userData = await authStorage.getToken();
        if (userData) {
          const userUpdatedData = await authApi.getUser();
          setUser(userUpdatedData.data);
        }
      } catch (error) {
        console.error("Error restoring token:", error);
        setIsLoadingError(true);
      } finally {
        setIsReady(true);
      }
    };

    restoreToken();

  }, []);

  const updateUser = async () => {
    try {
      const result = await authApi.getUser();
      if (result.ok) {
        setUser(result.data);
      } else {
        console.error('Failed to update user:', result);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (!isReady) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  if (isLoadingError) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text>Error loading data</Text>
      </SafeAreaView>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, updateUser}}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <I18nextProvider i18n={i18n}>
            <NavigationContainer ref={navigationRef} linking={linking} theme={navigationTheme}>
              <SafeAreaView style={styles.container}>
                {user ? <DrawerNavigator /> : <AuthNavigator />}
              </SafeAreaView>
            </NavigationContainer>
        </I18nextProvider>
        <Toast />
      </GestureHandlerRootView>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#27272A",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#27272A",
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#27272A",
  },
});
