import * as Haptics from 'expo-haptics'; // Import Haptics
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import AuthContext from '../../auth/context';
import AppText from '../../components/AppText';
import colors from '../../config/colors';
import useToastMessage from '../../hooks/useToastMessage';
import { useHaptics } from '../../hooks/useHaptics';
import { GemButton } from '../buttons';

function GemSuccess({ navigation, route }) {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation(); 
    const { showSuccess } = useToastMessage();
    const { triggerLongHaptic } = useHaptics();  
    const gems = route.params;

    useEffect(() => {
        triggerLongHaptic();
    }, []);

    return (
        <View style={styles.container}>
            <ConfettiCannon 
                count={100} 
                fallSpeed={5000}
                fadeOut={true} 
                origin={{ x: 0, y: -50 }} 
            />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.header}>
                    <Image style = {styles.icon} source = {require("../../assets/hand-cross-finger-heart.png")}/>
                    <AppText style={styles.headerText}>{t("gemSuccess.title")}</AppText>
                    <AppText style={styles.headerSubtitle}>
                        {t("gemSuccess.description")}
                    </AppText>
                    <View style = {{marginTop: "20%", alignItems: 'center'}}>               
                        <Image style = {styles.icon} source = {require("../../assets/Eskiwi-gem.png")}/>
                        <AppText style={styles.gemAmount}>{gems}</AppText>
                        <GemButton
                            title={t("gemSuccess.enjoy")}
                            style={{marginTop: 30, width: 200,}}
                            onPress={()=>navigation.goBack()}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary,
        flex: 1,
    },
    header: {
        alignItems: 'center',
        marginVertical: 20,
        padding: 20,
    },
    icon:{
        width: 100,
        height: 100
    },
    headerText: {
        textAlign: 'center',
        color: colors.white,
        fontSize: 35,
        fontFamily: 'GeistMono-Regular'
    },
    headerSubtitle: {
        color: colors.white,
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center',
    },
    scrollViewContent: {
        width: '100%',
        justifyContent: 'center',
    },
    gemAmount:{
        fontSize: 30,
        fontFamily: 'GeistMono-Regular'
    },
    gemItemsContainer: {
        backgroundColor: colors.secondary, 
        borderRadius: 10,
        marginHorizontal: 20,
        padding: 10, // Add some padding for better layout
    },
});

export default GemSuccess;
