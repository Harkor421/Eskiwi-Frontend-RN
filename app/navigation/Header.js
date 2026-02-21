import * as Haptics from 'expo-haptics';
import React, { useContext, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthContext from '../auth/context';
import BlackButton from '../components/buttons/BlackButton';
import GemButton from '../components/buttons/GemButton';
import colors from '../config/colors';
import routes from './routes';

const Header = ({ navigation, route }) => {
  const { user } = useContext(AuthContext);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Define routes that should show the menu icon and drawer
  const mainHeaderRoutes = ['PostFeed', 'ChatNavigator', 'Notifications', 'Crear', 'ExploreCreators'];

  // Determine if the current route requires a main header
  const isMainHeader = mainHeaderRoutes.includes(route.name);

  const blackButtonIcon = isMainHeader ? require("../assets/menu-icon.png") : require("../assets/left-arrow.png");
  const blackButtonOnPress = isMainHeader ? () =>  {
    navigation.toggleDrawer()
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } : () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    navigation.goBack()
  };

  return (
    <SafeAreaView style={styles.headerContainer} onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}>
      <BlackButton
        style={styles.leftGemButton}
        icon={blackButtonIcon}
        onPress={blackButtonOnPress}
      />
      
      <View style={styles.centerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate(routes.POST_FEED)}>
          <Image source={require('../assets/Eskiwi-gem.png')} style={styles.stardeoslogo} />
        </TouchableOpacity>
      </View>
      
      <GemButton 
        style={styles.rightGemButton} 
        icon={require("../assets/gem-fill-icon.png")}
        onPress={() => navigation.navigate("BuyGems")}
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

export default Header;
