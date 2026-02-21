import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../config/colors'; // Adjust the import path as necessary

const GradientBorderButton = ({ title, onPress, style, iconLeft, iconRight }) => {
    return (
        <TouchableOpacity onPress={onPress} style={style}>
            <LinearGradient
                colors={['#FF5093', '#9A37E7']} // Adjust the gradient colors as necessary
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.linearGradient}
            >
                <View style={styles.innerContainer}>
                    {iconLeft && <Image source={iconLeft} style={styles.icon} />}
                    <Text style={styles.buttonText}>{title}</Text>
                    {iconRight && <Image source={iconRight} style={styles.icon} />}
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    linearGradient: {
        borderRadius: 10, // Outer Border Radius
        padding: 2, // Border Width
    },
    innerContainer: {
        flexDirection: 'row', // To align icons and text horizontally
        borderRadius: 8, // Inner Border Radius
        backgroundColor: colors.black, // Inner background color
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10, // Add horizontal padding to avoid text/icon cutoff
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    icon: {
        width: 20, // Adjust the size of the icon as needed
        height: 20, // Adjust the size of the icon as needed
        marginHorizontal: 5, // Add margin to space out the icon from the text
    },
});

export default GradientBorderButton;
