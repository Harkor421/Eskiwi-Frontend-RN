import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import notifications from '../../api/notifications'; // Assume this is the module where API calls are handled
import AuthContext from '../../auth/context';
import colors from '../../config/colors';
import AppText from '../AppText';
import ToggleComponent from './ToggleComponent';

function NotificationSettings({ navigation }) {
    const { user } = useContext(AuthContext); // Get the current user context
    const [notificationSettings, setNotificationSettings] = useState(null); // State for storing notification settings
    
    const {t} = useTranslation(); // Initialize translation

    // Fetch notification settings from API
    useEffect(() => {
        const fetchNotificationSettings = async () => {
            try {
                const response = await notifications.getNotificationSettings(); // API call to fetch settings
                setNotificationSettings(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching notification settings:", error);
            }
        };

        fetchNotificationSettings();
    }, []);

    // Function to update notification settings when a toggle is switched
    const handleToggleChange = async (settingKey, newValue) => {
        const updatedSettings = { ...notificationSettings, [settingKey]: newValue };

        setNotificationSettings(updatedSettings); // Update local state

        // Send updated settings to the API
        try {
            const response = await notifications.updateNotificationSettings(updatedSettings);
            console.log(response);
        } catch (error) {
            console.error("Error updating notification settings:", error);
        }
    };

    if (!notificationSettings) return null; // Show nothing while loading

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <AppText style={styles.headerText}>{t('notificationSettings.title')}</AppText>
                <View style={styles.settingsContainer}>
                    <ToggleComponent
                        logo={require('../../assets/notification-icon.png')}
                        title={t('notificationSettings.unreadMessages.title')}
                        text={t('notificationSettings.unreadMessages.text')}
                        isSelected={notificationSettings.unreadMessages}
                        onPress={() => handleToggleChange('unreadMessages', !notificationSettings.unreadMessages)}
                    />
                    <ToggleComponent
                        logo={require('../../assets/notification-icon.png')}
                        title={t('notificationSettings.newPost.title')}
                        text={t('notificationSettings.newPost.text')}
                        isSelected={notificationSettings.newPost}
                        onPress={() => handleToggleChange('newPost', !notificationSettings.newPost)}
                    />
                    <ToggleComponent
                        logo={require('../../assets/notification-icon.png')}
                        title={t('notificationSettings.newAboutEskiwi.title')}
                        text={t('notificationSettings.newAboutEskiwi.text')}
                        isSelected={notificationSettings.newAboutEskiwi}
                        onPress={() => handleToggleChange('newAboutEskiwi', !notificationSettings.newAboutEskiwi)}
                    />
                </View>
                <AppText style={styles.headerText}>{t('notificationSettings.creatorNotifications')}</AppText>
                <View style={styles.settingsContainer2}>
                    <ToggleComponent
                        logo={require('../../assets/notification-icon.png')}
                        title={t('notificationSettings.newSub.title')}
                        text={t('notificationSettings.newSub.text')}
                        isSelected={notificationSettings.newSub}
                        onPress={() => handleToggleChange('newSub', !notificationSettings.newSub)}
                    />
                    <ToggleComponent
                        logo={require('../../assets/notification-icon.png')}
                        title={t('notificationSettings.newComment.title')}
                        text={t('notificationSettings.newComment.text')}
                        isSelected={notificationSettings.newComment}
                        onPress={() => handleToggleChange('newComment', !notificationSettings.newComment)}
                    />
                    <ToggleComponent
                        logo={require('../../assets/notification-icon.png')}
                        title={t('notificationSettings.newLike.title')}
                        text={t('notificationSettings.newLike.text')}
                        isSelected={notificationSettings.newLike}
                        onPress={() => handleToggleChange('newLike', !notificationSettings.newLike)}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    headerText: {
        marginVertical: 40,
        fontSize: 16,
        fontWeight: '600',
        color: colors.white,
        marginLeft: "5%",
        fontFamily: 'GeistMono-Regular'
    },
    scrollView: {
        flexGrow: 1,
    },
    settingsContainer: {
        backgroundColor: colors.secondary,
        borderRadius: 10,
        borderTopColor: colors.terciary,
        borderTopWidth: 1,
        marginHorizontal: 10,
    },
    settingsContainer2: {
        backgroundColor: colors.secondary,
        borderRadius: 10,
        borderTopColor: colors.terciary,
        borderTopWidth: 1,
        marginBottom: 40,
        marginHorizontal: 10,

    },
});

export default NotificationSettings;
