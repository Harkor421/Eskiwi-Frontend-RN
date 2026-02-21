import { createStackNavigator } from "@react-navigation/stack";
import React from 'react';

import Header from "../../navigation/Header";
import CreatorScreen from "../../screens/CreatorScreen";
import ExploreCreatorsScreen from "../../screens/ExploreCreatorsScreen";
import UniquePostScreen from "../../screens/UniquePostScreen";
import SearchCreatorList from "./SearchCreatorList";
import { TransitionPresets } from "@react-navigation/stack";

const Stack = createStackNavigator();

const SearchNavigator = ({ navigation, route }) => {
  

  return (
    <Stack.Navigator
      screenOptions={({ route, navigation }) => ({
        gestureEnabled: true,
        freezeOnBlur: false,
        animation: 'fade',
        header: () => (
            <Header
              navigation={navigation}
              route={route}
            />
        ),
      })}
    >
      <Stack.Screen name="ExploreCreators" component={ExploreCreatorsScreen} />
      <Stack.Screen name="SearchCreatorList" component={SearchCreatorList} />
      <Stack.Screen name="CreatorDetails" component={CreatorScreen} />
      <Stack.Screen
        name="Unique"
        component={UniquePostScreen}
        options={{...TransitionPresets.ScaleFromCenterAndroid,
        }}
      />
    </Stack.Navigator>
  );
};

export default SearchNavigator;
