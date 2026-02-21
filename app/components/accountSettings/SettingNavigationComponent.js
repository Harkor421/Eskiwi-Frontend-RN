import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import colors from '../../config/colors';
import AppText from '../AppText';
import BlackButton from '../buttons/BlackButton';

const SettingNavigationComponent = ({ title, logo, text, onPress, isFirst, secondLogo, useImage, disabled }) => {
    if (disabled) {
        // Return a non-interactive view if disabled
        return (
            <View style={[styles.touchable, isFirst ? styles.firstTouchable : styles.nonFirstTouchable]}>
                <View style={styles.settingBox2}>
                    <View style={styles.logoContainer}>
                        {useImage ? (
                            <Image 
                                source={logo} 
                                style={styles.logoButton} 
                            />
                        ) : (
                            <BlackButton
                                style={styles.logoButton} 
                                icon={logo}
                                onPress={onPress} // No effect since it's disabled
                            />
                        )}
                    </View>
                    <View style={styles.contentContainer}>
                        <View style={styles.textAndImageContainer}>
                            <AppText style={styles.title}>{title}</AppText>
                            <Image 
                                source={secondLogo || require("../../assets/right-arrow.png")} 
                                style={styles.rightImage} 
                            />
                        </View>
                        <AppText style={styles.text}>{text}</AppText>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <TouchableOpacity 
            style={[styles.touchable, isFirst ? styles.firstTouchable : styles.nonFirstTouchable]} 
            onPress={onPress}
        >
            <View style={styles.settingBox}>
                <View style={styles.logoContainer}>
                    {useImage ? (
                        <Image 
                            source={logo} 
                            style={styles.logoButton} 
                        />
                    ) : (
                        <BlackButton
                            style={styles.logoButton} 
                            icon={logo} 
                            onPress={onPress}
                        />
                    )}
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.textAndImageContainer}>
                        <AppText style={styles.title}>{title}</AppText>
                        <Image 
                            source={secondLogo || require("../../assets/right-arrow.png")} 
                            style={styles.rightImage} 
                        />
                    </View>
                    <AppText style={styles.text}>{text}</AppText>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    touchable: {
        borderTopWidth: 1,
        borderTopColor: colors.terciary,
        overflow: 'hidden',
    },
    nontouchable: {
        overflow: 'hidden',
    },
    firstTouchable: {
        borderTopWidth: 0,
    },

    logoButton: {
        width: 50,
        height: 50,
        borderRadius: 8,
    },
    settingBox2: {
        flexDirection: 'row', 
        alignItems: 'center',
        backgroundColor: colors.secondary, 
        padding: 15, 
    },
    settingBox: {
        flexDirection: 'row', 
        alignItems: 'center',
        backgroundColor: colors.secondary, 
        borderRadius: 15,
        padding: 15, 
    },
    contentContainer: {
        flex: 1,
        marginLeft: 20,
    },
    textAndImageContainer: {
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        color: colors.white,
        fontWeight: '500',
        fontSize: 14,
    },
    rightImage: {
        width: 12, 
        height: 12,
        resizeMode: 'contain',
        marginLeft: 10, 
    },
    text: {
        color: '#7A7A83',
        fontWeight: '500',
        fontSize: 12,
        marginTop: 5, 
    },
});

export default SettingNavigationComponent;
