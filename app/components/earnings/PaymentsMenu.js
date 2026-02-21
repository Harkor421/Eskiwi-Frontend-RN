import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { ScrollView, StyleSheet, View } from 'react-native';

import AuthContext from '../../auth/context';
import colors from '../../config/colors';
import SettingNavigationComponent from '../accountSettings/SettingNavigationComponent';
import AppText from '../AppText';

function PaymentsMenu({ navigation }) {
    const { user, setUser } = useContext(AuthContext);
    const { t } = useTranslation(); // Initialize the useTranslation hook

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.centeredView}>
                    <AppText style={styles.headerText}>{t('paymentsMenu.title')}</AppText>
                    <View style={styles.settingsContainer}>
                         <SettingNavigationComponent
                            logo={require("../../assets/payment-history.png")}
                            title={t('paymentsMenu.paymentHistory')}
                            text={t('paymentsMenu.paymentHistoryDescription')}
                            onPress={() => navigation.navigate("TransactionHistory")}
                            isFirst={true}
                        />
                        <SettingNavigationComponent
                            logo={require("../../assets/earnings-icon.png")}
                            title={t('paymentsMenu.earnings')}
                            text={t('paymentsMenu.earningsDescription')}
                            onPress={() => navigation.navigate("EarningsScreen")}
                        />
                    </View>
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

export default PaymentsMenu;
