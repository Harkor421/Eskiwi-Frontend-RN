import React from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { ScrollView, StyleSheet, View } from 'react-native';
import AppText from '../../components/AppText';
import Screen from '../../components/Screen';
import UserCard from '../../components/UserCard';
import colors from '../../config/colors';
import { DeleteButton } from '../buttons';


const CancelSubscription = ({ navigation, route}) => {
  const { t } = useTranslation(); // Initialize useTranslation hook
  const user = route.params;
  return (
    <Screen style={{ backgroundColor: colors.primary }}>
      <ScrollView>
        <View style={styles.creatorContainer}>
          <UserCard
            banner={{uri: user.bannerUri}}
            avatar={{uri: user.avatarUri}}
            name={user.displayName}
            username={user.username}
          />
          <AppText style={styles.separator}>------------------</AppText>
          <DeleteButton
            title={t('cancelSubscription.cancelSubscription')} 
            onPress={() => navigation.navigate("CancelSubscription")}
            style={styles.cancelSub}
          />
          <AppText style={styles.bio} numberOfLines={3} ellipsizeMode="tail">
            {t('cancelSubscription.bio')} 
          </AppText>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  creatorContainer: {
    alignItems: 'center',
    marginTop: 10,
    padding: 15,
  },
  separator: {
    color: colors.terciary,
    fontSize: 35,
    marginTop: "2%",
    fontFamily: 'GeistMono-Light'
  },
  bio: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: "2%",
    marginBottom: '4%',
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    minHeight: 300, // Adjust as per your design
    padding: 20,
  },
  tabContentText: {
    fontSize: 18,
    color: colors.black,
  },
  cancelSub: {
    width: '80%'
  },
});

export default CancelSubscription;
