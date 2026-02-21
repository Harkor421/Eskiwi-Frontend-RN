// AccountNavigator.js
import { createStackNavigator } from "@react-navigation/stack";
import React from 'react';
import CreatePostScreen from "../../screens/CreatePostScreen";
import CropScreen from "./CropScreen";
import EditPostDetails from "./EditPostDetails";
import ApplyForCreator from "./ApplyForCreator";
import Header from "../../navigation/Header";
import AuthContext from "../../auth/context";
import { useContext } from "react";

const Stack = createStackNavigator();

const CreatePostNavigator = () => {

  const {user}= useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerShown: false,
        gestureEnabled: true,
        freezeOnBlur: true,
        header: () => (
            <Header
              navigation={navigation}
              route={route}
              onInicioPress={() => {
                if (route.name === 'PostFeed') {
                  navigation.navigate('PostFeed');
                }
              }}
            />
        ),
      })}
    >
      <Stack.Screen name="CreatePostScreen" component={CreatePostScreen} />
      <Stack.Screen name="CropScreen" component={CropScreen} />
      <Stack.Screen name="EditPostDetails" component={EditPostDetails} />


    </Stack.Navigator>
  );
};

export default CreatePostNavigator;
