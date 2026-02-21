import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Swipeable } from 'react-native-gesture-handler';
import colors from '../../config/colors';
import AppText from '../AppText';
import DeleteButton from '../buttons/DeleteButton';
import useFormatNumber from '../../hooks/useFormatNumber';

const defaultAvatar = require("../../assets/default-profile-icon.png");

function UserPreview({ user, navigation }) {
    const [imageError, setImageError] = useState(false);
    const {t} = useTranslation();
    
    const press = () => {
        navigation.navigate("CreatorDetails", user);
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const isImageValid = user.avatarUri && typeof user.avatarUri === 'string';

    return (

            <TouchableOpacity onPress={press} style={styles.container}>
                <FastImage
                    source={imageError || !isImageValid ? defaultAvatar : { uri: user.avatarUri }}
                    style={styles.avatar}
                    onError={handleImageError}
                />
                <View style={styles.content}>
                    <View style={styles.textContainer}>
                        <AppText style={styles.name}>{user.username}</AppText>
                        <AppText style={styles.email} numberOfLines={1} ellipsizeMode="tail">
                            {user.description}
                        </AppText>
                    </View>
                    <View style={styles.followerContainer}>
                        <AppText style={styles.followerText}>{`${useFormatNumber(user.followers)} ${t("followers")}`}</AppText>
                    </View>
                </View>
            </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    swipeableContainer: {
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    container: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.grayline,
        borderTopColor: colors.grayline,
        width: '100%',
    },
    avatar: {
        borderRadius: 8,
        borderWidth: 1,
        width: 50,
        height: 50,
        borderColor: colors.black,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.6,
        shadowRadius: 2,
        elevation: 5,
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
        marginBottom: 3,
    },
    email: {
        fontSize: 12,
        color: '#7A7A83',
        fontWeight: '500',
        flexShrink: 1,
    },
    followerContainer: {
        marginLeft: 10,
    },
    followerText: {
        fontSize: 12,
        color: '#7A7A83',
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

export default UserPreview;
