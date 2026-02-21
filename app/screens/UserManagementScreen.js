import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import AuthContext from '../auth/context';
import SettingNavigationComponent from '../components/accountSettings/SettingNavigationComponent';
import colors from '../config/colors';
import userApi from '../api/user';

function UserManagementScreen({ navigation, route }) {
    const { user } = useContext(AuthContext);
    const [isAdmin, setIsAdmin] = useState(false); // Renamed to match the role (Admin)
    const { t } = useTranslation();

    // Retrieve the creator from route params
    const creator = route.params;

    // Function to handle banning the user
    const banUser = async () => {
        try {
            const response = await userApi.banUser(creator.id);
            Alert.alert(t('userManagement.userBannedTitle'), t('userManagement.userBannedMessage'));
        } catch (error) {
            Alert.alert(t('userManagement.errorTitle'), t('userManagement.errorMessage'));
        }
    };

    // Show a confirmation alert before banning
    const confirmBanUser = () => {
        Alert.alert(
            t('userManagement.confirmBanTitle'), // Title of the alert
            t('userManagement.confirmBanMessage'), // Message inside the alert
            [
                {
                    text: t('userManagement.cancel'), // Cancel button
                    style: 'cancel',
                },
                {
                    text: t('userManagement.confirm'), // Confirm button
                    onPress: banUser, // Call banUser function on confirmation
                },
            ],
            { cancelable: false }
        );
    };

    // Check if the user is an admin
    useEffect(() => {
        if (user?.roles?.includes('admin')) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, [user, creator]);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.centeredView}>
                    <View style={styles.settingsContainer}>
                        <SettingNavigationComponent
                            logo={require("../assets/flag-icon.png")}
                            title={t('userManagement.reportUserTitle')}
                            text={t('userManagement.reportUserDescription')}
                            isFirst={true}
                            onPress={() => navigation.navigate("ReportUser")}
                        />
                        <SettingNavigationComponent
                            logo={require("../assets/forbidden-icon.png")}
                            title={t('userManagement.blockUserTitle')}
                            text={t('userManagement.blockUserDescription')}
                            isFirst={true}
                            onPress={() => navigation.navigate("ReportPost")}
                        />
                        {/* Show Ban option if the user is an admin */}
                        {isAdmin && (
                            <SettingNavigationComponent
                                logo={require("../assets/trash-icon.png")}
                                title={t('userManagement.deleteUserTitle')}
                                text={t('userManagement.deleteUserDescription')}
                                onPress={confirmBanUser} // Use confirmBanUser to show alert
                            />
                        )}
                    </View>
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
    centeredView: {
        padding: 20,
    },
    settingsContainer: {
        backgroundColor: colors.secondary,
        borderRadius: 10,
        borderTopColor: colors.terciary,
        borderTopWidth: 1,
    },
});

export default UserManagementScreen;
