import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageColors from 'react-native-image-colors';
import colors from '../config/colors';
import AppText from './AppText';
import { BlackButton } from './buttons';

// Default images
const defaultAvatar = require("../assets/default-profile-icon.png");

function UserCard({ banner, avatar, name, username, verticalDotPress }) {
    const [dominantColor, setDominantColor] = useState(colors.secondary);
    const [avatarError, setAvatarError] = useState(false);
    const [bannerError, setBannerError] = useState(false);

    useEffect(() => {
        const fetchDominantColor = async () => {
            try {
                const result = await ImageColors.getColors(avatar, {
                    fallback: colors.secondary,
                    cache: false,
                    key: 'unique_key',
                    quality: 'low'
                });

                if (result.platform === 'android') {
                    setDominantColor(result.vibrant);
                    console.log(result)
                } else {
                    setDominantColor(result.background);
                }
            } catch (error) {
                setDominantColor(colors.secondary);
            }
        };

        if (avatar && !avatarError) {
            fetchDominantColor();
        }
    }, [avatar, avatarError]);

    return (
        <View style={styles.container}>
            <View style={styles.bannerContainer}>
                {!bannerError ? (
                    <FastImage
                        source={banner}
                        style={styles.banner}
                        onError={() => setBannerError(true)}
                        
                    />
                ) : (
                    <View style={[styles.banner, { backgroundColor: colors.secondary }]} />
                )}
            </View>
            <BlackButton
                style={styles.button}
                icon={require("../assets/dots-vertical.png")}
                onPress={verticalDotPress} // Trigger verticalDotPress function when the button is pressed
            />
            <View style={[styles.avatarContainer, { shadowColor: dominantColor }]}>
                <FastImage
                    source={avatarError ? defaultAvatar : avatar}
                    style={styles.avatar}
                    onError={() => setAvatarError(true)}
                />
            </View>

            <View style={styles.userInfo}>
                <AppText style={styles.name}>{name}</AppText>
                <AppText style={styles.username}>{`@${username}`}</AppText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        position: 'relative',
    },
    bannerContainer: {
        width: '100%',
        height: 140,
        borderRadius: 10,
        overflow: 'hidden', // Ensure the banner fits within the container
    },
    banner: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover', // Ensure the image scales appropriately
    },
    button: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: colors.primary,
        padding: 10,
        width: 40,
        borderRadius: 5,
        elevation: 3,
    },
    avatarContainer: {
        position: 'absolute',
        bottom: "25%",
        left: '49%',
        transform: [{ translateX: -40 }],
        height: 90,
        width: 90,
        borderRadius: 10,
        borderWidth: 5,
        borderColor: colors.primary,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 20,
    },
    avatar: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
        borderRadius: 5,
    },
    userInfo: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: {
        marginTop: 50,
        fontSize: 22,
        color: colors.white,
        fontFamily: 'GeistMono-Bold',
    },
    username: {
        top: 5,
        fontSize: 14,
        color: '#7A7A83',
        fontWeight: 500,
    },
});

export default UserCard;
