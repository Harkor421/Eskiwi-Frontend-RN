import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

/**
 * Custom hook to handle push notifications.
 * @param {function} notificationListener - Optional callback for handling received notifications.
 * @returns {string | null} - Expo push token or null.
 */
export function useNotifications(notificationListener) {
  const [expoPushToken, setExpoPushToken] = useState(null);

  useEffect(() => {
    // Register for push notifications and get the token
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // Add notification listeners if provided
    if (notificationListener) {
      const notificationSubscription = Notifications.addNotificationReceivedListener(notificationListener);
      const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification response:', response);
      });

      // Clean up listeners on unmount
      return () => {
        notificationSubscription.remove();
        responseSubscription.remove();
      };
    }
  }, [notificationListener]);

  // Return the token for external usage
  return expoPushToken;
}

/**
 * Registers for push notifications and returns an Expo push token.
 * @returns {Promise<string | null>} - The Expo push token or null if registration fails.
 */
export const registerForPushNotificationsAsync = async () => {
  try {
    if (Device.isDevice) {
      // Get existing notification permissions status
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permissions if not granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      // Log if permissions are not granted
      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return null;
      }

      // Get Expo push token
      const { data: token } = await Notifications.getExpoPushTokenAsync({	
        'projectId': "4a15fd46-1cdd-41c2-a409-9cc90b20836e",
      });
      console.log('Push token:', token);
      
      // Return the token
      return token;
    } else {
      console.log('Must use a physical device for Push Notifications');
      return null;
    }
  } catch (error) {
    console.log("Error getting a push token:", error);
    return null;
  }
};
