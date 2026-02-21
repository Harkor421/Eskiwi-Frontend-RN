import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import colors from '../../config/colors';
import AppText from '../AppText';
import { DeleteButton } from '../buttons';
import FastImage from 'react-native-fast-image';
import { getPriceByTier } from '../../utils/getPriceByTier';

function SubscriptionPreview({ name, tier, avatar, tierInfo}) {
    const { t } = useTranslation(); 

    return (
            <TouchableOpacity style={styles.container}>
                <FastImage source={avatar} style={styles.avatar} />
                <View style={styles.content}>
                    <View style={styles.textContainer}>
                        <AppText style={styles.name}>{name}</AppText>
                        <AppText style={styles.message} numberOfLines={1}>{`$${getPriceByTier(tier)} USD por mes`}</AppText>
                    </View>
                    <View style={styles.details}>
                        <AppText style={styles.date}>{"Suscripción activa"}</AppText>
                    </View>
                </View>
            </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    swipeableContainer: {
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    container: {
        backgroundColor: colors.secondary,
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.grayline,
        borderTopColor: colors.grayline,
        width: '100%',
    },

    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 14,
        fontWeight: 600,
        color: colors.white,
        marginBottom: 3,
    },
    message: {
        fontSize: 12,
        color: colors.white,
        fontWeight: 500,
    },
    details: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    date: {
        fontSize: 10,
        color: '#7A7A83',
    },
    pendingContainer: {
        marginTop: 5,
    },
    pendingBadge: {
        backgroundColor: '#FC5193',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pendingText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '500',
    },
    rightAction: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 180,
        height: '100%',
    },
    avatar:{
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 10,
    }
});

export default SubscriptionPreview;
