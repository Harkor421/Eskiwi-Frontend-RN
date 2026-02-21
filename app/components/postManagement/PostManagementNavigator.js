// AccountNavigator.js
import { createStackNavigator } from "@react-navigation/stack";
import React from 'react';
import PostManagementScreen from "../../screens/PostManagementScreen";
import ManagementHeader from "../userManagement/ManagementHeader";
import ReportPost from "./ReportPost";
const Stack = createStackNavigator();

const PostManagementNavigator = ({ route }) => {
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
        name="PostManagementMenu"
        component={PostManagementScreen}
        initialParams={post} // Pass params here
      />
      
      <Stack.Screen
        name="ReportPost"
        component={ReportPost}
        initialParams={post} // Pass params here as well
      />
    </Stack.Navigator>
  );
};

export default PostManagementNavigator;
