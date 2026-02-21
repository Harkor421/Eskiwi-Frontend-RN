import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { ScrollView, StyleSheet, View } from 'react-native';
import AuthContext from '../../auth/context';
import colors from '../../config/colors';
import AppText from '../AppText';
import SettingComponent from './SettingComponent';

function AccountSecurityScreen({ navigation }) {
    const { t } = useTranslation(); // Initialize the useTranslation hook
    const { user } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <AppText style={styles.headerText}>{t('accountSecurityScreen.header')}</AppText>
                <View style={styles.centeredView}>
                    <View style={styles.settingsContainer}>
                        <SettingComponent
                            title={t('accountSecurityScreen.email')}
                            text={user.email}
                            icon={require("../../assets/edit-icon.png")}
                        />
                        <View style={styles.separatorContainer}>
                            <View style={styles.separator} />
                        </View>
                        <SettingComponent
                            title={t('accountSecurityScreen.password')}
                            text={t('accountSecurityScreen.passwordValue')}
                            icon={require("../../assets/edit-icon.png")}
                            onPress={()=> navigation.navigate("EditPassword")}
                        />
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
    headerText: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.white,
        fontFamily: 'GeistMono-Bold',
        marginTop: "5%",
        marginLeft: "5%",
    },
    centeredView: {
        alignItems: 'center',
        padding: 20,
    },
    settingsContainer: {
        backgroundColor: colors.secondary,
        borderRadius: 10,
        marginTop: "5%",
        width: "100%",
        padding: 20,
        borderTopColor: colors.terciary,
        borderTopWidth: 1,
        paddingHorizontal: 0, // Remove horizontal padding to ensure full-width separators
    },
    separatorContainer: {
        width: '100%',
        position: 'relative',
        height: 1,
        marginVertical: 10,
    },
    separator: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: colors.terciary,
    },
    editPictures: {
        width: "50%",
        padding: "2.5%",
        borderRadius: 10,
        marginHorizontal: "2%",
    },
});

export default AccountSecurityScreen;
