import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../config/colors';
import AppText from '../AppText';
import BlackButton from '../buttons/BlackButton';
import CustomSwitch from '../CustomSwitch';

const ToggleComponent = ({ 
    title, 
    logo, 
    text, 
    onPress,  // Handler for toggling
    isFirst, 
    isSelected 
}) => {
    return (
        <View 
            style={[styles.touchable, isFirst ? styles.firstTouchable : styles.nonFirstTouchable]} 
        >
            <View style={styles.settingBox}>
                <View style={styles.logoContainer}>
                    <BlackButton
                        style={styles.logoButton} 
                        icon={logo} 
                    />
                </View>
                <View style={styles.contentContainer}>
                    <AppText style={styles.title}>{title}</AppText>
                    <AppText style={styles.text}>{text}</AppText>
                </View>
                <View style={styles.switchContainer}>
                    <CustomSwitch 
                        isSelected={isSelected} 
                        onValueChange={onPress}  // Pass the toggle handler here
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    touchable: {
        borderTopWidth: 1,
        borderTopColor: colors.terciary,
        overflow: 'hidden',
        borderRadius: 15, 
    },
    firstTouchable: {
        borderTopWidth: 0, 
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
        borderRadius: 15, 
        paddingVertical: 15,
        paddingHorizontal: 15,
        justifyContent: 'space-between', // Distribute space between children
    },
    logoContainer: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginRight: 15, 
    },
    contentContainer: {
        flex: 1, // Take up available space between the logo and switch
        justifyContent: 'center',
        marginLeft: 15,
    },
    switchContainer: {
        justifyContent: 'flex-end', // Push the switch to the right
    },
    title: {
        color: colors.white,
        fontWeight: '500',
        fontSize: 14, 
    },
    text: {
        color: '#7A7A83',
        fontWeight: '500',
        fontSize: 12,
        marginTop: 5,
        flexWrap: 'wrap', 
    },
});

export default ToggleComponent;
