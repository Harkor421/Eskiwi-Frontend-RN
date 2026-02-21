import { createStackNavigator } from "@react-navigation/stack";
import React from 'react';
import ManageSubscriptionsScreen from "../../screens/ManageSubscriptionsScreen";
import AccountHeader from "../accountSettings/AccountHeader";
import CancelSubscription from "./CancelSubscription";

const Stack = createStackNavigator();

const SubscriptionNavigator = () => {
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
      <Stack.Screen name="ManageSubscriptionsScreen" component={ManageSubscriptionsScreen} />
      <Stack.Screen name="CancelSubscription" component={CancelSubscription} />
    </Stack.Navigator>
  );
};

export default SubscriptionNavigator;
