import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import colors from '../../config/colors';
import AppText from '../AppText';
import { GemButton } from '../buttons';

const GemItem = ({price, gems, isFirst, onPress}) => {
    return (
        <View style={[styles.container, isFirst ? styles.firstItemContainer : null]}>
            <View style={styles.settingBox}>
                <View style={styles.textContainer}>
                    <Image style={styles.gemIcon} source={require('../../assets/Eskiwi-gem.png')} />
                    <AppText style={styles.gems}>{gems}</AppText>
                </View>
                <View style={styles.logoContainer}>
                    <GemButton
                        style={styles.buyButton}
                        title={price}
                        onPress={onPress}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderTopColor: colors.grayline,
        borderTopWidth: 1,
        paddingHorizontal: 8,
    },
    firstItemContainer: {
        borderTopWidth: 0,
    },
    gemIcon: {
        width: 45,
        height: 45,
    },
    settingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.secondary,
        padding: 12,
    },
    textContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    gems: {
        color: colors.white,
        fontWeight: '500',
        fontSize: 16,
        marginLeft: 10,
        fontFamily: 'GeistMono-Bold'
    },
    logoContainer: {
        flex: 1,
        alignItems: 'flex-end', // Aligns the logo container to the end of the row
    },
    buyButton: {
        width: "65%"
    },
});

export default GemItem;
