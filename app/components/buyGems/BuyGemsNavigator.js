import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import React from 'react';
import GemScreen from "../../screens/GemScreen";
import AccountHeader from "../accountSettings/AccountHeader";
import GemSuccess from "./GemSuccess";

const Stack = createStackNavigator();

const BuyGemsNavigator = () => {
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
      <Stack.Screen name="BuyGemsScreen" component={GemScreen} />
      <Stack.Screen name="GemSuccess" component={GemSuccess} options={{...TransitionPresets.ScaleFromCenterAndroid,
        }} />

    </Stack.Navigator>
  );
};

export default BuyGemsNavigator;
