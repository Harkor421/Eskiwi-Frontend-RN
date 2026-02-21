import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import notificationsApi from '../../api/notifications';
import AuthContext from '../../auth/context';
import colors from '../../config/colors';
import useApi from '../../hooks/useApi';
import routes from '../../navigation/routes';
import BlackButton from '../buttons/BlackButton';
import GemButton from '../buttons/GemButton';

const AccountHeader = ({ navigation }) => {
  const { user  } = useContext(AuthContext);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const { data: notifications, error, loading, request: loadNotifications } = useApi(() => notificationsApi.getNotifications());

  useEffect(() => {
    loadNotifications();

  }, []);

  useEffect(() => {
    if (notifications && notifications.notifications) {
      setHasNotifications(notifications.notifications.length > 0);
    }
  }, [notifications]);

  const updateUserAndNotifications = () => {

    loadNotifications();
  };

  useEffect(() => {
    const interval = setInterval(updateUserAndNotifications, 240000);
    return () => clearInterval(interval);
  }, []);

  const goToGemScreen = ()=>{
    navigation.navigate("Inicio");
    navigation.navigate("BuyGems");

  }

  return (
    <SafeAreaView style={styles.headerContainer} onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}>
      <BlackButton
        style={styles.leftGemButton} 
        icon={require("../../assets/left-arrow.png")}
        onPress={() => navigation.goBack()}
      />
      
      <TouchableOpacity style={styles.stardeos} onPress={() => navigation.navigate(routes.POST_FEED)}>
        <FastImage source={require('../../assets/Eskiwi-gem.png')} style={styles.stardeoslogo} />
      </TouchableOpacity>
      
      <GemButton 
        style={styles.rightGemButton} 
        icon={require("../../assets/gem-fill-icon.png")}
        iconPosition={"right"}
        onPress={goToGemScreen}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: "#27272A",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayline,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stardeoslogo: {
    width: 38,
    height: 38,
  },
});

export default AccountHeader;
