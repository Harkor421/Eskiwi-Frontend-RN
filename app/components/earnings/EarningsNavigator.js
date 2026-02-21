// AccountNavigator.js
import { createStackNavigator } from "@react-navigation/stack";
import React from 'react';
import EarningsScreen from "../../screens/EarningsScreen";
import AccountHeader from "../accountSettings/AccountHeader";
import PaymentsMenu from "./PaymentsMenu";
import TransactionHistory from "./TransactionHistory";

const Stack = createStackNavigator();

const EarningNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerShown: true,
        gestureEnabled: true,
        freezeOnBlur: true,
        header: () => (
            <AccountHeader navigation={navigation}/>
        ),
      }
    )}
      
    >

      <Stack.Screen name="PaymentsMenu" component={PaymentsMenu} />
      <Stack.Screen name="EarningsScreen" component={EarningsScreen} />
      <Stack.Screen name="TransactionHistory" component={TransactionHistory} />

    </Stack.Navigator>
  );
};

export default EarningNavigator;
