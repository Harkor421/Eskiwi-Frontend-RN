import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Image as RNImage, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import colors from '../../config/colors';
import useTimeFormat from '../../hooks/useTimeFormat';
import AppText from '../AppText';
import { useTranslation } from 'react-i18next';

const ChatMessage = ({ message, currentUserId, navigation }) => {
    const isSent = message.clientId === currentUserId;
    const elapsed = useTimeFormat(message.createdAt);
    const [isLoading, setIsLoading] = useState(true);
    const gems = message.gems;
    const {t} = useTranslation();

    // Preload image when the component renders
    useEffect(() => {
        if (message.contents && message.contents.length > 0) {
            const firstContent = message.contents[0];
            if (firstContent) {
                // Prefetch the image for smoother rendering
                RNImage.prefetch(firstContent)
                    .then(() => setIsLoading(false)) // Image is loaded
                    .catch((error) => {
                        console.error('Error preloading image:', error);
                        setIsLoading(false);
                    });
            }
        } else {
            setIsLoading(false); // No image, set loading to false
        }
    }, [message.contents]);

    // Handle image press to navigate to a screen where the image is displayed fully
    const handleImagePress = () => {
        navigation.navigate("ShowImage", { imageUri: message.contents[0] });
    };

    // Function to determine whether to display an image or text message
    const renderContent = () => {
        if (message.contents && message.contents.length > 0) {
            const firstContent = message.contents[0];
            return (
                <TouchableOpacity onPress={handleImagePress}>
                    <View>
                        {/* Render text first, then the image if available */}
                        <AppText style={styles.messageText}>{message.text}</AppText>
                        {isLoading ? (
                            <ActivityIndicator size="small" color={colors.white} style={styles.image} />
                        ) : (
                            <FastImage
                                source={{ uri: firstContent }}
                                style={styles.image}
                            />
                        )}
                    </View>
                </TouchableOpacity>
            );
        }
        return <AppText style={styles.messageText}>{message.text}</AppText>; // Render text if no image
    };

    // Conditionally render special message centered
    if (message._id === '000000000000000000000000') {
        return (
            <View style={styles.centeredMessageWrapper}>
                <View style={styles.centeredMessageContainer}>
                    <AppText style={styles.specialMessageText}>{message.text}</AppText>
                    {/* Optionally render image or any other special content */}
                </View>
            </View>
        );
    }

    // Regular message rendering logic
    return (
        <View style={styles.messageWrapper}>
            <View style={[styles.messageContainer, isSent ? styles.sentMessage : styles.receivedMessage]}>
                <View style={styles.gemContainer}>
                    <Image source={require("../../assets/gem-fill-icon.png")} style={styles.gem} />
                    <AppText style={styles.gemText}>{gems > 0 ? `${gems} ${t("gems")}` : t('freeMessage')}</AppText>
                </View>
                {renderContent()}
            </View>
            <AppText style={[styles.timestamp, isSent ? styles.sentTimestamp : styles.receivedTimestamp]}>{elapsed}</AppText>
        </View>
    );
};

const styles = StyleSheet.create({
    messageWrapper: {
        marginVertical: 5,
    },
    centeredMessageWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredMessageContainer: {
        padding: 20,
        backgroundColor: colors.terciary,
        borderRadius: 10,
        alignItems: 'center',
    },
    specialMessageText: {
        fontSize: 14,
        color: colors.white,
        fontFamily: 'GeistMono-Bold',
        textAlign: 'center',
    },
    gemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    gem: {
        width: 15,
        height: 15,
        tintColor: '#FC5193',
    },
    gemText: {
        color: '#FC5193',
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 5,
    },
    messageContainer: {
        maxWidth: '70%',
        padding: 10,
        borderRadius: 10,
    },
    sentMessage: {
        alignSelf: 'flex-end',
        backgroundColor: colors.grayline,
        marginRight: 10,
    },
    receivedMessage: {
        alignSelf: 'flex-start',
        backgroundColor: colors.secondary,
        marginLeft: 10,
    },
    messageText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '500',
    },
    timestamp: {
        fontSize: 10,
        color: colors.white,
        marginTop: 4,
        fontWeight: '500',
    },
    sentTimestamp: {
        alignSelf: 'flex-end',
        marginRight: 10,
    },
    receivedTimestamp: {
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
    image: {
        width: 200, // Adjust the size as needed
        height: 200, 
        borderRadius: 10,
        marginVertical: 5,
    },
});

export default ChatMessage;
