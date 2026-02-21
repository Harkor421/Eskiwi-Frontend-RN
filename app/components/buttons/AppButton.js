import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../config/colors';
import AppText from '../AppText';

function AppButton({ title, onPress, style }) {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <AppText style={styles.text}>{title}</AppText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        width: '100%',
        backgroundColor: "#FA3D86",
        borderColor: "#AF134F",
        borderWidth: 1,
        borderTopWidth: 2, // Added top border width
        borderTopColor: "#FF6FA3", // Added top border color
        flexDirection: 'row',
        shadowColor: '#FA3D86',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    text: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'GeistMono-Bold',
        marginRight: 10
    },
});

export default AppButton;
