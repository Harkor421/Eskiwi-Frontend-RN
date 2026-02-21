import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import colors from '../../config/colors';
import AppText from '../AppText';

function BlackButton({ title, onPress, icon, iconPosition = 'left', style, tintColor }) {
    return (
        <TouchableOpacity 
            style={[styles.button, style, !title && styles.centeredButton]} 
            onPress={onPress}
        >
            <View style={styles.contentWrapper}>
                {icon && iconPosition === 'left' && title && (
                    <Image source={icon} style={[styles.icon, styles.iconLeft, { tintColor }]} />
                )}
                {title && (
                    <AppText style={[styles.text, iconPosition === 'right' && styles.textWithRightIcon]}>
                        {title}
                    </AppText>
                )}
                {icon && iconPosition === 'right' && title && (
                    <Image source={icon} style={[styles.icon, styles.iconRight, { tintColor }]} />
                )}
                {icon && !title && (
                    <Image source={icon} style={[styles.icon, { tintColor }]} />
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
        backgroundColor: "#27272A", // Black background
        borderTopWidth: 1, // Top border width
        borderTopColor: colors.terciary, // Top border color
        flexDirection: 'row',
        shadowColor: '#000000',
        shadowOffset: {
            width: 1,
            height: 5,
        },
        shadowOpacity: 0.32,
        shadowRadius: 4,
        elevation: 3,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    centeredButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#7A7A83', // Light gray text color
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'GeistMono-Bold',
    },
    textWithRightIcon: {
        marginRight: 0,
        marginLeft: 10,
    },
    icon: {
        width: 18,
        height: 18,
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

export default BlackButton;
