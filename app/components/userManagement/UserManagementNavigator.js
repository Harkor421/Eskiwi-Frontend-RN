// AccountNavigator.js
import { createStackNavigator } from "@react-navigation/stack";
import React from 'react';
import UserManagementScreen from "../../screens/UserManagementScreen";
import ManagementHeader from "./ManagementHeader";
import ReportUser from "./ReportUser";

const Stack = createStackNavigator();

const UserManagementNavigator = ({ route }) => {
  // Retrieve params from the route
  const post = route.params || {};

  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerShown: true,
        gestureEnabled: true,
        freezeOnBlur: true,
        header: () => (
            <ManagementHeader
              navigation={navigation}
              route={route}
            />
        ),
      })}
    >
      <Stack.Screen
        name="UserManagementMenu"
        component={UserManagementScreen}
        initialParams={post} // Pass params here
      />
      
      <Stack.Screen
        name="ReportUser"
        component={ReportUser}
        initialParams={post} // Pass params here as well
      />
    </Stack.Navigator>
  );
};

export default UserManagementNavigator;
