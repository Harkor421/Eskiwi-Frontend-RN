import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { ScrollView, StyleSheet, View, Linking } from 'react-native';

import userApi from '../../api/user';
import AuthContext from '../../auth/context';
import authStorage from '../../auth/storage';
import colors from '../../config/colors';
import { registerForPushNotificationsAsync } from '../../hooks/useNotifications';
import routes from '../../navigation/routes';
import AppText from '../AppText';
import DeleteButton from '../buttons/DeleteButton';
import SettingNavigationComponent from './SettingNavigationComponent';



function AccountScreen({ navigation }) {
    const { user, setUser } = useContext(AuthContext);
    const { t } = useTranslation(); // Initialize the useTranslation hook

    const handleLogOut = async () => {
        setUser(null);
        const expoToken = await registerForPushNotificationsAsync();
        const response = await userApi.deleteExpotoken(expoToken);
        authStorage.removeToken();
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.centeredView}>
                    <AppText style={styles.headerText}>{t('accountScreen.generalSettings')}</AppText>
                    <View style={styles.settingsContainer}>
                        <SettingNavigationComponent
                            logo={require("../../assets/edit-icon.png")}
                            title={t('accountScreen.editProfile')}
                            text={t('accountScreen.editProfileDescription')}
                            isFirst={true}
                            onPress={() => navigation.navigate(routes.ACCOUNT_SETTINGS)}
                        />
                        <SettingNavigationComponent
                            logo={require("../../assets/shield-icon.png")}
                            title={t('accountScreen.securitySettings')}
                            text={t('accountScreen.securitySettingsDescription')}
                            onPress={() => navigation.navigate(routes.ACCOUNT_SECURITY_SCREEN)}
                        />
                        <SettingNavigationComponent
                            logo={require("../../assets/notification-icon.png")}
                            title={t('accountScreen.notificationSettings')}
                            text={t('accountScreen.notificationSettingsDescription')}
                            onPress={() => navigation.navigate('NotificationSettings')}

                        />
                        <SettingNavigationComponent
                            logo={require("../../assets/chat-icon.png")}
                            title={t('accountScreen.languageSettings')}
                            text={t('accountScreen.languageSettingsDescription')}
                            onPress={() => navigation.navigate(routes.LANGUAGE_SETTINGS)}
                        />
                         <SettingNavigationComponent
                            logo={require("../../assets/trash-icon.png")}
                            title={t('accountScreen.deleteAccount')}
                            text={t('accountScreen.deleteAccountDescription')}
                            onPress={() => navigation.navigate("DeleteAccount")}
                        />
                    </View>
                    <AppText style={styles.headerText}>{t('accountScreen.creatorSettings')}</AppText>
                    <View style={styles.settingsContainer}>
                        <SettingNavigationComponent
                            logo={require("../../assets/money-icon.png")}
                            title={t('accountScreen.subscriptionSettings')}
                            text={t('accountScreen.subscriptionSettingsDescription')}
                            isFirst={true}
                            onPress={() => navigation.navigate(routes.SUBSCRIPTION_SETTINGS)}
                        />
                        <SettingNavigationComponent
                            logo={require("../../assets/chat-icon.png")}
                            title={t('accountScreen.chatSettings')}
                            text={t('accountScreen.chatSettingsDescription')}
                            onPress={() => navigation.navigate(routes.CHAT_SETTINGS)}

                        />

                    </View>
                    <AppText style={styles.headerText}>{t('accountScreen.support')}</AppText>
                    <View style={styles.settingsContainer}>
                        <SettingNavigationComponent
                            logo={require("../../assets/edit-icon.png")}
                            title={t('accountScreen.helpFaqs')}
                            text={t('accountScreen.helpFaqsDescription')}
                            isFirst={true}
                            onPress={()=>Linking.openURL('https://discord.gg/Cp55MPnDj8')}
                        />
                    </View>
                    <DeleteButton 
                        title={t('accountScreen.logout')}
                        style={styles.logOut} 
                        icon={require("../../assets/left-arrow.png")}
                        onPress={handleLogOut}
                    />
                </View>
            </ScrollView>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    headerText: {
        fontSize: 20,
        marginVertical: "10%",
        color: colors.white,
        fontFamily: "GeistMono-Bold"
    },
    centeredView: {
        padding: 20,
    },
    settingsContainer: {
        backgroundColor: colors.secondary,
        borderRadius: 10,
        borderTopColor: colors.terciary,
        borderTopWidth: 1,
    },
    logOut: {
        width: "100%",
        alignSelf: 'center',
        marginTop: "7%",
    },  
});

export default AccountScreen;
