import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import AuthContext from '../../auth/context';
import colors from '../../config/colors';
import AppText from '../AppText';
import CustomTextInput from '../CustomTextInput';
import { DeleteButton } from '../buttons';
import userApi from '../../api/user';
import useToastMessage from '../../hooks/useToastMessage';

function DeleteAccount({ navigation }) {
    
    const { t } = useTranslation();
    const { user, setUser } = useContext(AuthContext); 
    const [confirmationText, setConfirmationText] = useState('');
    const { showError } = useToastMessage();

    const deleteAccount = async () => {
        try {

            if (confirmationText !== user.username) {
                showError(t('deleteAccount.usernameMismatch'), t('deleteAccount.error')); 
                return;
            }
            
            const response = await userApi.deleteAccount(user.id);
            
            if (response.ok) {
                setUser(null); 
                navigation.navigate('Login');
            } else {
                Alert.alert(t('deleteAccount.error'), t('deleteAccount.failedToDelete'));
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            Alert.alert(t('deleteAccount.error'), t('deleteAccount.failedToDelete'));
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <AppText style={styles.headerText}>{t('deleteAccount.header')}</AppText>
                <View style={styles.centeredView}>
                    <View style={styles.settingsContainer}>
                        <View style={{ paddingHorizontal: 5 }}>
                            <AppText style={styles.title}>{t('deleteAccount.enterUsername')}</AppText>
                            <CustomTextInput
                                multiline={false}
                                style={styles.input}
                                value={confirmationText}
                                onChangeText={setConfirmationText}
                                placeholder={t('deleteAccount.usernamePlaceholder')}
                            />
                        </View>
                        <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
                            <DeleteButton
                                style={styles.saveChanges}
                                title={t('deleteAccount.deleteAccount')}
                                icon={require("../../assets/check-icon.png")}
                                onPress={deleteAccount}
                            />
                        </View>
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
    scrollView: {
        flexGrow: 1,
    },
    settingsContainer: {
        backgroundColor: colors.secondary,
        borderRadius: 10,
        marginTop: "5%",
        width: "100%",
        padding: 20,
        borderTopColor: colors.terciary,
        borderTopWidth: 1,
    },
    title: {
        color: colors.white,
        fontSize: 14,
    },
    input: {
        marginTop: 10,
        borderRadius: 5,
        backgroundColor: colors.terciary,
        paddingHorizontal: 10,
        height: 40,
        color: colors.white,
    },
    saveChanges: {
        padding: 10,
    },
});

export default DeleteAccount;
