import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import colors from '../../config/colors';
import AppText from '../AppText';
import BlackButton from '../buttons/BlackButton';

const LanguageComponent = ({ title, logo, text, onPress, isFirst, useImage, isSelected }) => {
    return (
        <TouchableOpacity 
            style={[styles.touchable, isFirst ? styles.firstTouchable : null]} 
            onPress={onPress}
            disabled={isSelected} // Disable if currently selected
        >
            <View style={styles.settingBox}>
                <View style={styles.logoContainer}>
                    {useImage ? (
                        <FastImage 
                            source={logo} // Assuming logo is the image source when useImage is true
                            style={styles.logoButton} 
                        />
                    ) : (
                        <BlackButton
                            style={styles.logoButton} 
                            icon={logo} // Conditionally render secondLogo if available
                        />
                    )}
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.textAndImageContainer}>
                        <AppText style={styles.title}>{title}</AppText>
                        <FastImage 
                            source={isSelected 
                                ? require("../../assets/check-icon.png") 
                                : require("../../assets/blank-check-icon.png")} 
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
        overflow: 'hidden', // Ensure contents do not overflow rounded corners
    },
    firstTouchable: {
        borderTopWidth: 0, // Remove borderTop for the first item
    },
    logoButton: {
        width: 50,
        height: 50,
        borderRadius: 8,
    },
    settingBox: {
        flexDirection: 'row', 
        alignItems: 'center',
        backgroundColor: colors.secondary, 
        borderRadius: 15, // Rounded corners for the whole component
        padding: 15, 
    },
    contentContainer: {
        flex: 1,
        marginLeft: 20,
    },
    textAndImageContainer: {
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'space-between', // Ensures items are spaced evenly in the row
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
        fontSize: 14,
        marginTop: 5, 
    },
});

export default LanguageComponent;
