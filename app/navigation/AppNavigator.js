import React, { useState } from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import colors from '../config/colors';
import FeedNavigator from "./FeedNavigator";
import Header from './Header';
import NotificationScreen from '../screens/NotificationScreen';
import ChatNavigator from '../components/chat/ChatNavigator';
import SearchNavigator from '../components/exploreCreator/SearchNavigator';
import BuyGemsNavigator from '../components/buyGems/BuyGemsNavigator';
import CreatePostNavigator from '../components/imagePicker/CreatePostNavigator';
import AuthContext from '../auth/context';
import { useContext, useEffect } from 'react';

const Tab = createBottomTabNavigator();
const { width: screenWidth } = Dimensions.get('window'); // Get screen width
const indicatorWidth = screenWidth / 5; // Calculate focus view indicator width

const AppNavigator = () => {

  const { user, updateUser } = useContext(AuthContext);
  // Set up interval to run updateUser every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      updateUser(); // Call the updateUser function every 20 seconds
    }, 20000); // 20000 milliseconds = 20 seconds

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [updateUser]);
  
  const renderIcon = (source, focused, hasBadge = false, badgeCount = 0) => (
    <View style={{ alignItems: 'center' }}>
      {focused && <View style={{ height: 2, backgroundColor: '#FC5193', width: indicatorWidth, marginBottom: 4, position: 'absolute', bottom: "140%" }} />}
      <View style={{ position: 'relative' }}>
        <Image
          source={source}
          style={{
            width: 22,
            height: 22,
            tintColor: focused ? '#FC5193' : colors.white,
          }}
        />
        {hasBadge && badgeCount > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{badgeCount}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        detachInactiveScreens: true,
        tabBarInactiveBackgroundColor: colors.secondary,
        tabBarActiveBackgroundColor: colors.secondary,
        tabBarIconStyle: {
          alignSelf: 'center',
        },
        tabBarStyle: {
          borderTopColor: colors.terciary, borderTopWidth: 2,
        }
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={FeedNavigator}
        options={{
          headerShown: false,
          title: 'Inicio', // Set title for this screen
          tabBarIcon: ({ focused }) => renderIcon(require("../assets/home-icon.png"), focused),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                handlePress();
                props.onPress();
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="SearchNavigator"
        component={SearchNavigator}
        options={({ navigation, route }) => ({
          headerShown: false,
          title: 'Buscar', // Set title for this screen
          header: () => <Header navigation={navigation} route={route} />,
          tabBarIcon: ({ focused }) => renderIcon(require("../assets/search.png"), focused),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                handlePress();
                props.onPress();
              }}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Crear"
        component={CreatePostNavigator}
        options={{
          headerShown: false,
          title: 'Crear', // Set title for this screen
          tabBarIcon: ({ focused }) => renderIcon(require("../assets/add-icon.png"), focused),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                handlePress();
                props.onPress();
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={({ navigation, route }) => ({
          headerShown: true,
          title: 'Notificaciones', // Set title for this screen
          header: () => <Header navigation={navigation} route={route} />,
          tabBarIcon: ({ focused }) => renderIcon(
            require("../assets/notification-icon.png"),
            focused,
            true, // Show badge for notifications
            user.pendingNotifications // Example badge count, you can replace this with dynamic count
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                handlePress();
                props.onPress();
              }}
            />
          ),
        })}
      />
      <Tab.Screen
        name="ChatNavigator"
        component={ChatNavigator}
        options={({ navigation, route }) => ({
          headerShown: true,
          title: 'Chats', // Set title for this screen
          header: () => <Header navigation={navigation} route={route}/>,
          tabBarIcon: ({ focused }) => renderIcon(require("../assets/mail-icon.png"),
            focused,
            true, // Show badge for notifications
            user.pendingMessages),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                handlePress();
                props.onPress();
              }}
            />
          ),
        })}
      />
      <Tab.Screen
        name="BuyGems"
        component={BuyGemsNavigator}
        options={{
          tabBarButton: () => null,
          headerShown: false,
          tabBarVisible: false,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FC5193',
    borderRadius: 8,
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default AppNavigator;
