import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import chatsApi from '../../api/chats';
import AuthContext from '../../auth/context';
import colors from '../../config/colors';
import useToastMessage from '../../hooks/useToastMessage';
import AppText from '../AppText';
import { GemButton } from '../buttons';

function RuleItem({ title, price, frequency, benefits, edit, navigation, creator }) {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation(); // Initialize the translation function
    const {showError} = useToastMessage();
   
    const handleChatPress = async () => {
        const result = await chatsApi.createChat(creator.id);
        if(result.ok){
            console.log(result.data.chats[0]);
            navigation.navigate('ChatNavigator');
            navigation.navigate('DirectMessageScreen', result.data.chats[0]);
        }
        else
        {
            if(result.data.error === "payment failed")
            {
                showError("No tienes suficientes gemas");
                return;
            }
            showError("Ya tienes un chat con esta persona");
        
        }
    
    };

    const handleEditPress = () => {
        navigation.navigate("ProfileSettings");
        setTimeout(() => {
            navigation.navigate("ChatSettings");
        }, 300); // Adjust delay time as needed
    };

    // Determine the icon to display
    const buttonIcon = user.id === creator.id 
        ? require('../../assets/edit-icon.png') // Icon for editing settings
        : (edit ? require('../../assets/edit-icon.png') : require('../../assets/creator-icon.png'));

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <AppText style={styles.user} numberOfLines={1} ellipsizeMode="tail">
                    {title}
                </AppText>
                <View style={styles.priceContainer}>
                    <AppText style={styles.priceText} numberOfLines={1} ellipsizeMode="tail">
                        {`${price} gemas`}
                    </AppText>
                    <AppText style={styles.frequency} numberOfLines={1} ellipsizeMode="tail">
                        {frequency}
                    </AppText>
                </View>
            </View>
            <View style={styles.benefitsContainer}>
                {benefits.map((benefit, index) => (
                    <AppText key={index} style={styles.benefitText} ellipsizeMode="tail">
                        {`• ${benefit}`}
                    </AppText>
                ))}
            </View>
            <View style={styles.buttonContainer}>
                <GemButton
                    icon={buttonIcon}
                    title={
                        user.id === creator.id 
                            ? t('chatRules.editChatSettings') 
                            : (edit ? t('chatRules.editTier') : t('chatRules.createChatNow'))
                    }
                    iconPosition="left"
                    style={styles.subscribeButton}
                    onPress={user.id === creator.id ? handleEditPress : handleChatPress}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        marginBottom: 10,
        backgroundColor: colors.terciary,
        borderRadius: 10,
        marginTop: 20,
        padding: 25,
        width: "95%",
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    user: {
        color: colors.white,
        fontSize: 18,
        marginBottom: 2,
        fontWeight: '500',
        fontFamily: 'GeistMono-Bold',
        flex: 1,
    },
    priceText: {
        color: colors.white,
        fontSize: 18,
        marginBottom: 2,
        fontWeight: '500',
        fontFamily: 'GeistMono-Bold',
    },
    frequency: {
        color: '#7A7A83',
        fontSize: 12,
        marginBottom: 2,
        fontWeight: '500',
        fontFamily: 'GeistMono-Bold',
    },
    cancelText: {
        color: '#7A7A83',
        fontSize: 12,
        marginTop: 10,
        fontWeight: '500',
        fontFamily: 'GeistMono-Bold',
    },
    benefitsContainer: {
        marginTop: 10,
    },
    benefitText: {
        color: colors.white,
        fontSize: 12,
        marginVertical: 10,
        fontWeight: '500',
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    subscribeButton: {
        width: '100%',
    },
});

export default RuleItem;
