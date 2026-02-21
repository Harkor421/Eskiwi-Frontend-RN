import React, { useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Swipeable } from 'react-native-gesture-handler';
import colors from '../../config/colors';
import useDateFormat from '../../hooks/useDateFormat';
import AppText from '../AppText';
import DeleteButton from '../buttons/DeleteButton';

const defaultAvatar = require("../../assets/default-profile-icon.png");

function ChatPreview({ chat, user, pending, navigation }) {
    const swipeableRef = useRef(null);
    const [imageError, setImageError] = useState(false);
    const elapsedTime = useDateFormat(chat.lastSentAt);

    const renderRightActions = () => (
        <View style={styles.rightAction}>
            <DeleteButton icon={require("../../assets/trash-icon.png")} />
        </View>
    );

    const press = () => {
        navigation.navigate("DirectMessageScreen", { chat, user });
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const isImageValid = user.avatarUri && typeof user.avatarUri === 'string';

    return (
        <Swipeable
            ref={swipeableRef}
            friction={1}
            rightThreshold={50}
            renderRightActions={renderRightActions}
            containerStyle={styles.swipeableContainer}
        >
            <TouchableOpacity onPress={press} style={styles.container}>
                <FastImage
                    source={{ uri: user.avatarUri }}
                    style={styles.avatar}
                    defaultSource={defaultAvatar}
                    onError={handleImageError}
                />
                <View style={styles.content}>
                    <View style={styles.textContainer}>
                        <AppText style={styles.name}>{user.username}</AppText>
                        <AppText
                            style={[
                                styles.message,
                                pending > 0 && styles.pendingMessage
                            ]}
                            numberOfLines={1}
                            ellipsizeMode="tail" // Ensure ellipsis is applied at the tail
                        >
                            {chat.lastMessage}
                        </AppText>
                    </View>
                    <View style={styles.details}>
                        <AppText style={styles.date}>{elapsedTime}</AppText>
                        <View style={styles.pendingContainer}>
                            {pending > 0 ? (
                                <View style={styles.pendingBadge}>
                                    <AppText style={styles.pendingText}>{pending}</AppText>
                                </View>
                            ) : (
                                <View style={styles.placeholderBadge} /> // Placeholder view for consistent layout
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    swipeableContainer: {
        alignItems: 'center',
        backgroundColor: colors.secondary,
    },
    container: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.terciary,
        width: '100%',
    },
    avatar: {
        borderRadius: 8,
        borderWidth: 1,
        width: 50,
        height: 50,
        borderColor: colors.black,
        marginRight: 10,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.white,
        fontFamily: 'GeistMono',
        marginBottom: 3,
    },
    message: {
        fontSize: 12,
        color: '#7A7A83',
        fontWeight: '500',
        flexShrink: 1, // Allow the message to shrink to fit the available space
    },
    pendingMessage: {
        fontSize: 12,
        color: colors.white,
        fontWeight: '700',
    },
    details: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginLeft: 10, // Ensure some spacing between text and the date/details
    },
    date: {
        fontSize: 10,
        color: '#7A7A83',
        fontWeight: '500',
    },
    pendingContainer: {
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 20, // Minimum height to ensure consistent layout
    },
    pendingBadge: {
        backgroundColor: '#FC5193',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderBadge: {
        height: 20, // Set height of the placeholder to match pending badge size
        width: 20, // Same as the pending badge's approximate size
        opacity: 0, // Make the placeholder invisible
    },
    pendingText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '500',
    },
    rightAction: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
        marginLeft: 10,
    },
});

export default ChatPreview;
