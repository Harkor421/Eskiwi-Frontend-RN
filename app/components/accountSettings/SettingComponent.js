import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import colors from '../../config/colors';
import AppText from '../AppText';

const SettingComponent = ({ title, text, icon, onPress}) => {
    return (
    <View style = {{marginTop: 5, paddingHorizontal: 15,width: "100%"}}>
       <AppText style={styles.title}>{title}</AppText>
        <TouchableOpacity style={styles.touchable} onPress={onPress}>
            <View style={styles.settingBox}>
                <View style={styles.textContainer}>
                    <AppText style={styles.text}>{text}</AppText>
                </View>
                <View style={styles.logoContainer}>
                    <FastImage source={icon} style={styles.logoImg} />
                </View>
            </View>
        </TouchableOpacity>
    </View>
    );
}

const styles = StyleSheet.create({
    touchable: {
        width: '100%',
    },
    settingBox: {
        flexDirection: 'row', // Horizontal layout
        alignItems: 'center', // Center items vertically
        justifyContent: 'space-between', // Space between text and logo
        backgroundColor: colors.terciary, // Light gray background
        borderRadius: 8, // Rounded corners
        padding: 12, // Padding inside the box
        marginBottom: 15, // Example margin for spacing between components
    },
    textContainer: {
        flex: 1, 
    },
    title:{
        color: colors.white,
        marginLeft: "1%",
        marginBottom: "3%",
        fontSize: 15,
        fontWeight: 600,
    },
    text: {
        color: colors.white,
        fontWeight: 500,
        fontSize: 15,
    },
    logoContainer: {
        marginLeft: 10, // Example margin for spacing
    },
    logoImg: {
        width: 15, // Example width for logo
        height: 15, // Example height for logo
        resizeMode: 'contain', // Scale the image while maintaining aspect ratio
    },
});

export default SettingComponent;
