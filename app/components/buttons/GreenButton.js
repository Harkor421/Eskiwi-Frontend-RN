import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import colors from '../../config/colors';
import AppText from '../AppText';

function GreenButton({ title, onPress, icon, iconPosition = 'left', style }) {
    return (
        <TouchableOpacity
            style={[styles.button, style, !title && styles.centeredButton]}
            onPress={onPress}
        >
            <View style={styles.contentWrapper}>
                {icon && iconPosition === 'left' && title && (
                    <FastImage source={icon} style={[styles.icon, styles.iconLeft]} />
                )}
                {title && (
                    <AppText style={[styles.text, iconPosition === 'right' && styles.textWithRightIcon]}>
                        {title}
                    </AppText>
                )}
                {icon && iconPosition === 'right' && title && (
                    <FastImage source={icon} style={[styles.icon, styles.iconRight]} />
                )}
                {icon && !title && (
                    <FastImage source={icon} style={styles.icon} />
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#10B77F", // Primary color for the GreenButton
        borderTopWidth: 1,
        borderTopColor: "#6EE7B7", // Slightly lighter shade for the top border
        shadowColor: '#10B77F1C', // Lighter shade for the shadow
        shadowOffset: {
            width: 1,
            height: 15,
        },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 7,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    centeredButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'GeistMono-Bold',
    },
    textWithRightIcon: {
        marginRight: 0,
        marginLeft: 10,
    },
    icon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    iconLeft: {
        marginRight: 10,
    },
    iconRight: {
        marginLeft: 10,
    },
    contentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default GreenButton;
