import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React from 'react';
import { Animated } from "react-native";
import PostManagementNavigator from '../components/postManagement/PostManagementNavigator';
import UserManagementNavigator from '../components/userManagement/UserManagementNavigator';
import Comments from '../screens/Comments';
import CreatorPostFeed from "../screens/CreatorPostFeed";
import CreatorScreen from "../screens/CreatorScreen";
import PostFeed from "../screens/PostFeed";
import UniquePostScreen from "../screens/UniquePostScreen";
import Header from './Header';

const av = new Animated.Value(0);
av.addListener(() => {return});


const Stack = createStackNavigator();


const FeedNavigator = () => {
  
  return (
    <Stack.Navigator
      screenOptions={({ route, navigation }) => ({
        gestureEnabled: true,
        freezeOnBlur: false,
        animation: 'fade',
        headerShown: route.name !== 'Comments', // Hide header for Comments screen
        header: () => (
          route.name !== 'Comments' && ( // Show header for all screens except Comments
            <Header
              navigation={navigation}
              route={route}
              onInicioPress={() => {
                if (route.name === 'PostFeed') {
                  navigation.navigate('PostFeed');
                }
              }}
            />
          )
        ),
      })}
    >
      <Stack.Screen
        name="PostFeed"
        component={PostFeed}
      />
      <Stack.Screen
        name="UniquePost"
        component={UniquePostScreen}
      />
      <Stack.Screen
        name="Unique"
        component={UniquePostScreen}
        options={{...TransitionPresets.ScaleFromCenterAndroid,
        }}
      />
      <Stack.Screen
        name="CreatorDetails"
        component={CreatorScreen}
        options={{
          ...TransitionPresets.DefaultTransition,
        }}
      />
      <Stack.Screen
        name="CreatorPostFeed"
        component={CreatorPostFeed}
        options={{
          ...TransitionPresets.ScaleFromCenterAndroid,

        }}
      />

        <Stack.Screen
        name="UserManagement"
        component={UserManagementNavigator}
        options={{
          headerShown: false,  // Hide header for PostManagement screen
          ...TransitionPresets.ModalPresentationIOS,
          cardStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen
        name="PostManagement"
        component={PostManagementNavigator}
        options={{
          headerShown: false,  // Hide header for PostManagement screen
          ...TransitionPresets.ModalPresentationIOS,
          cardStyle: { backgroundColor: 'transparent' },
        }}
      />

    </Stack.Navigator>
  );
};

export default FeedNavigator;
