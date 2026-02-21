// AccountNavigator.js
import { createStackNavigator } from "@react-navigation/stack";
import React from 'react';
import AccountHeader from "./AccountHeader";
import AccountScreen from "./AccountScreen";
import AccountSecurityScreen from "./AccountSecurityScreen";
import AccountSettings from "./AccountSettings";
import ChatSettings from "./ChatSettings";
import EditTier from "./EditTier";
import LanguageSettings from "./LanguageSettings";
import SubscriptionSettings from "./SubscriptionSettings";
import UploadAvatarScreen from "./UploadAvatar";


import { Animated } from "react-native";
import EmailVerificationScreen from "../../screens/EmailVerificationScreen";
import DeleteAccount from "./DeleteAccount";
import EditPassword from "./EditPassword";
import NotificationSettings from "./NotificationSettings";

const av = new Animated.Value(0);
av.addListener(() => {return});

const Stack = createStackNavigator();

const AccountNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerShown: true,
        gestureEnabled: true,
        freezeOnBlur: true,
        header: () => (
          <AccountHeader navigation={navigation} title={route.name} />
        ),
      })}
    >
      <Stack.Screen name="AccountScreen" component={AccountScreen} />
      <Stack.Screen name="AccountSecurityScreen" component={AccountSecurityScreen} />
      <Stack.Screen name="AccountSettings" component={AccountSettings} />
      <Stack.Screen name="UploadAvatar" component={UploadAvatarScreen} />
      <Stack.Screen name="SubscriptionSettings" component={SubscriptionSettings} />
      <Stack.Screen name="EditTier" component={EditTier} />
      <Stack.Screen name="ChatSettings" component={ChatSettings} />
      <Stack.Screen name="LanguageSettings" component={LanguageSettings} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
      <Stack.Screen name="VerifyCode" component={EmailVerificationScreen} />
      <Stack.Screen name="EditPassword" component={EditPassword}/>
      <Stack.Screen name="DeleteAccount" component={DeleteAccount}/>



    </Stack.Navigator>
  );
};

export default AccountNavigator;
