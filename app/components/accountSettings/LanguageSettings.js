import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import AuthContext from '../../auth/context';
import colors from '../../config/colors';
import AppText from '../AppText';
import SuccessModal from '../modals/SuccessModal';
import LanguageComponent from './LanguageComponent';

function LanguageSettings({ navigation }) {
    const { t, i18n } = useTranslation(); // Initialize the useTranslation hook with i18n
    const { user } = useContext(AuthContext);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

    const handleSaveTier = () => {
        // Add desired action here
        setIsSuccessModalVisible(true);
    };

    const closeSuccessModal = () => {
        setIsSuccessModalVisible(false);
    };

    // Function to handle language change
    const changeLanguage = (lng) => {
        if (selectedLanguage !== lng) {
            setSelectedLanguage(lng); // Update the selected language
            i18n.changeLanguage(lng); // Change the language in i18next
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <AppText style={styles.headerText}>{t("languages.title")}</AppText>
                <View style={styles.centeredView}>
                    <View style={styles.settingsContainer}>
                        <LanguageComponent
                            title={t("languages.english")}
                            text={t("languages.english")}
                            logo={require("../../assets/flags/english.png")}
                            useImage={false}
                            isSelected={selectedLanguage === 'en'}
                            onPress={() => changeLanguage('en')} // Set language to English
                        />
                        <LanguageComponent
                            title={t("languages.spanish")}
                            text={t("languages.spanish")}
                            logo={require("../../assets/flags/spanish.png")}
                            useImage={false}
                            isSelected={selectedLanguage === 'es'}
                            onPress={() => changeLanguage('es')} // Set language to Spanish
                        />
                    </View>
                </View>
            </ScrollView>
            <SuccessModal
                modalVisible={isSuccessModalVisible}
                onRequestClose={closeSuccessModal}
            />
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
        borderTopColor: colors.terciary,
        borderTopWidth: 1,
    },
    title: {
        color: colors.white,
        marginLeft: "1%",
        marginBottom: "3%",
        fontSize: 15,
        fontWeight: '600',
    },
    input: {
        marginTop: 10,
        borderRadius: 5,
        backgroundColor: colors.terciary,
        paddingHorizontal: 10,
        height: 40,
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
    saveChanges: {
        padding: 10,
    },
});

export default LanguageSettings;
