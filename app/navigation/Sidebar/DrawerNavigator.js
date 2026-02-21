import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Dimensions, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import CustomDrawerContent from './DrawerCustomContent'; 
import AppText from '../../components/AppText';
import BlackButton from '../../components/buttons/BlackButton';
import AppNavigator from '../AppNavigator';
import AccountNavigator from '../../components/accountSettings/AccountNavigator';
import SubscriptionNavigator from '../../components/manageSubscriptions/SubscriptionNavigator';
import EarningsScreen from '../../screens/EarningsScreen';
import FavouriteScreen from '../../screens/FavouriteScreen';
import EarningNavigator from '../../components/earnings/EarningsNavigator';
import colors from '../../config/colors';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { width } = Dimensions.get('window');
  const { t } = useTranslation(); // Initialize the useTranslation hook

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props}/>}
      screenOptions={{
        drawerStyle: {
          borderTopColor: colors.terciary,
          borderTopWidth: 1,
          backgroundColor: '#27272A', 
          width: width * 0.8, 
        },
        drawerPosition: 'left',
        drawerType: 'front', 
        overlayColor: 'rgba(0, 0, 0, 0.7)', 
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={AppNavigator} 
        options={{
          headerShown: false,
          drawerIcon: () => (
            <BlackButton
              style={styles.button} 
              icon={require("../../assets/home-icon.png")}
            />  
          ),
          drawerLabel: () => (
            <AppText style={styles.text}>{t('drawerNavigator.home')}</AppText>
          ),
        }} 
      />
      <Drawer.Screen 
        name="Earnings" 
        component={EarningNavigator} 
        options={{
          headerShown: false,
          drawerIcon: () => (
            <BlackButton
              style={styles.button} 
              icon={require("../../assets/money-icon.png")}
            />  
          ),
          drawerLabel: () => (
            <AppText style={styles.text}>{t('drawerNavigator.earnings')}</AppText>
          ),
        }} 
      />
      {/** 
      <Drawer.Screen 
        name="Favourites" 
        component={FavouriteScreen} 
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (  
            <BlackButton
              style={styles.button} 
              icon={require("../../assets/fav-icon.png")}
            />          
          ),
          drawerLabel: () => (
            <AppText style={styles.text}>{t('drawerNavigator.favourites')}</AppText>
          ),
        }} 
      />
      */}
      <Drawer.Screen 
        name="ManageSubscriptions" 
        component={SubscriptionNavigator} 
        options={{
          headerShown: false,
          drawerIcon: () => (  
            <BlackButton
              style={styles.button} 
              icon={require("../../assets/manage-icon.png")}
            />          
          ),
          drawerLabel: () => (
            <AppText style={styles.text}>{t('drawerNavigator.manageSubscriptions')}</AppText>
          ),
        }} 
      />
      <Drawer.Screen 
        name="ProfileSettings" 
        component={AccountNavigator} 
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (  
            <BlackButton
              icon={require("../../assets/setting-icon.png")}
            />          
          ),
          drawerLabel: () => (
            <AppText style={styles.text}>{t('drawerNavigator.profileSettings')}</AppText>
          ),
        }} 
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#7A7A83',
    fontSize: 14,
    fontFamily: 'GeistMono-Bold'
  },
});

export default DrawerNavigator;
