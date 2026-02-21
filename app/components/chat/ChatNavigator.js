import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import React, { useLayoutEffect } from 'react';
import ChatScreen from '../../screens/ChatScreen';
import DirectMessage from './DirectMessageScreen';
import ShowImage from './ImageViewer';
import colors from '../../config/colors';

const Stack = createStackNavigator();

const ChatNavigator = ({ navigation, route }) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'ChatScreen';
    if (routeName === 'DirectMessageScreen' || routeName === "ShowImage") {
      navigation.setOptions({ headerShown: false, tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ headerShown: true, tabBarStyle: {  borderTopColor: colors.terciary, borderTopWidth: 2} });
    }
  }, [navigation, route]);

  return (
    <Stack.Navigator
      screenOptions={{ gestureEnabled: true}}
      presentation="modal"
    >
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DirectMessageScreen"
        component={DirectMessage}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
          headerShown: false, // Hide header for DirectMessageScreen
        }}
      />
      <Stack.Screen 
        name="ShowImage" 
        component={ShowImage} 
        options={{
          headerShown: false,
          gestureEnabled: true,
          animationEnabled: true, // Ensures animation is smooth
          presentation: 'transparentModal', // Modal-style presentation
          cardStyleInterpolator: TransitionPresets.ScaleFromCenterAndroid.cardStyleInterpolator, // Smooth zoom effect
          transitionSpec: {
            open: {
              animation: 'timing',
              config: { duration: 500 }, // Smooth animation duration for zoom-in
            },
            close: {
              animation: 'timing',
              config: { duration: 250 }, // Smooth animation duration for zoom-out
            },
          },
          cardStyle: { backgroundColor: 'transparent' }, // Transparent background
        }} 
      />
    </Stack.Navigator>
  );
};

export default ChatNavigator;
