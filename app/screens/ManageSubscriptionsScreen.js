import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, runOnJS } from 'react-native-reanimated';
import AppText from '../components/AppText';
import MySubscriptions from '../components/manageSubscriptions/MySubscriptions';
import Subscribers from '../components/manageSubscriptions/Subscribers'; // Assuming there's a component for Subscribers
import Screen from '../components/Screen';
import colors from '../config/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function ManageSubscriptionsScreen({ navigation }) {
    const { t } = useTranslation();
    const [selectedTab, setSelectedTab] = useState('subscriptions');
    const translateX = useSharedValue(0);

    const springConfig = {
        damping: 20,
        stiffness: 400,
        mass: 3,
        overshootClamping: true,
    };

    const handleTabPress = (tab) => {
        setSelectedTab(tab);
        if (tab === 'subscriptions') {
            translateX.value = withSpring(0, springConfig);
        } else {
            translateX.value = withSpring(-SCREEN_WIDTH, springConfig);
        }
    };

    const handleSwipe = (direction) => {
        if (direction === 'left' && selectedTab === 'subscriptions') {
            setSelectedTab('subscribers');
            translateX.value = withSpring(-SCREEN_WIDTH, springConfig);
        } else if (direction === 'right' && selectedTab === 'subscribers') {
            setSelectedTab('subscriptions');
            translateX.value = withSpring(0, springConfig);
        }
    };

    const gestureHandler = (event) => {
        const { translationX } = event.nativeEvent;

        if (translationX < -50 && selectedTab === 'subscriptions') {
            runOnJS(handleSwipe)('left');
        } else if (translationX > 50 && selectedTab === 'subscribers') {
            runOnJS(handleSwipe)('right');
        }
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }]
    }));

    return (
        <Screen style={styles.screen}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <ScrollView>
                    <View style={styles.switch}>
                        <TouchableWithoutFeedback onPress={() => handleTabPress('subscriptions')}>
                            <View style={[styles.tab, selectedTab === 'subscriptions' && styles.selected]}>
                                <AppText style={styles.title2}>{t('manageSubscriptions.subscriptions')}</AppText>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => handleTabPress('subscribers')}>
                            <View style={[styles.tab, selectedTab === 'subscribers' && styles.selected]}>
                                <AppText style={styles.title2}>{t('manageSubscriptions.subscribers')}</AppText>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                    <PanGestureHandler onGestureEvent={gestureHandler}>
                        <Animated.View style={[styles.contentContainer, animatedStyle]}>
                            {/* First Tab: My Subscriptions */}
                            <View style={{ width: SCREEN_WIDTH }}>
                                <MySubscriptions navigation={navigation} />
                            </View>

                            {/* Second Tab: Subscribers */}
                            <View style={{ width: SCREEN_WIDTH }}>
                                <Subscribers navigation={navigation} />
                            </View>
                        </Animated.View>
                    </PanGestureHandler>
                </ScrollView>
            </GestureHandlerRootView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    switch: {
        backgroundColor: colors.terciary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: "2%",
        marginTop: "8%",
        borderRadius: 10,
        padding: 8,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    selected: {
        backgroundColor: '#FA3D86',
        borderWidth: 1,
        borderTopColor: '#FF8FBA',
        borderColor: '#AF134F',
        borderRadius: 10,
    },
    title2: {
        color: colors.white,
        fontSize: 14,
        fontWeight: 600,
        fontFamily: 'GeistMono-Light',
    },
    contentContainer: {
        flexDirection: 'row',
        width: SCREEN_WIDTH * 2, // Since there are two tabs
    },
});

export default ManageSubscriptionsScreen;
