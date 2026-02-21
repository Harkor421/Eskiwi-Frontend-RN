import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import AppText from '../components/AppText';
import BlackButton from '../components/buttons/BlackButton';
import OpenedChats from '../components/chat/OpenedChats';
import RequestedChats from '../components/chat/RequestedChats';
import Screen from '../components/Screen';
import colors from '../config/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function ChatScreen({ navigation }) {
    const [selectedTab, setSelectedTab] = useState('chatsAbiertos');
    const { t } = useTranslation();
    const translateX = useSharedValue(0);

    const springConfig = {
        damping: 20,    // Higher value to reduce bounce
        stiffness: 400, // Higher value for a faster spring effect
        mass: 3,
        overshootClamping: true, // Prevent overshooting/bouncing effect
    };
    
    const handleTabPress = (tab) => {
        setSelectedTab(tab);
        if (tab === 'chatsAbiertos') {
            translateX.value = withSpring(0, springConfig);
        } else {
            translateX.value = withSpring(-SCREEN_WIDTH, springConfig);
        }
    };
    
    const handleSwipe = (direction) => {
        if (direction === 'left' && selectedTab === 'chatsAbiertos') {
            setSelectedTab('solicitudesChat');
            translateX.value = withSpring(-SCREEN_WIDTH, springConfig);
        } else if (direction === 'right' && selectedTab === 'solicitudesChat') {
            setSelectedTab('chatsAbiertos');
            translateX.value = withSpring(0, springConfig);
        }
    };
    
    const gestureHandler = (event) => {
        const { translationX } = event.nativeEvent;

        if (translationX < -50 && selectedTab === 'chatsAbiertos') {
            runOnJS(handleSwipe)('left');
        } else if (translationX > 50 && selectedTab === 'solicitudesChat') {
            runOnJS(handleSwipe)('right');
        }
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }]
    }));

    return (
        <View style={styles.screen}>
            <ScrollView>
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 10, alignItems: 'center' }}>
                        <AppText style={styles.title}>{t('chatScreen.title')}</AppText>
                        <View style={styles.viewMoreContainer}>
                            <BlackButton
                                title={t('chatScreen.settings')}
                                style={styles.viewMore}
                                onPress={() => {
                                    navigation.navigate("ProfileSettings");
                                    setTimeout(() => {
                                        navigation.navigate("ChatSettings");
                                    }, 200); // Adjust delay time (300ms) as needed
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles.switch}>
                        <TouchableWithoutFeedback onPress={() => handleTabPress('chatsAbiertos')}>
                            <View style={[styles.tab, selectedTab === 'chatsAbiertos' && styles.selected]}>
                                <AppText style={styles.title2}>{t('chatScreen.openChats')}</AppText>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => handleTabPress('solicitudesChat')}>
                            <View style={[styles.tab, selectedTab === 'solicitudesChat' && styles.selected]}>
                                <AppText style={styles.title2}>{t('chatScreen.chatRequests')}</AppText>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                    <Animated.View style={[styles.contentContainer, animatedStyle]}>
                        {/* First Tab: Opened Chats */}
                        <View style={{ width: SCREEN_WIDTH, flex: 1}}>
                            <OpenedChats navigation={navigation} />
                        </View>
                        {/* Second Tab: Chat Requests */}
                        <View style={{ width: SCREEN_WIDTH }}>
                            <RequestedChats navigation={navigation} />
                        </View>
                    </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    header: {
        paddingHorizontal: 10,
    },
    title: {
        color: colors.white,
        fontSize: 24,
        fontFamily: 'GeistMono-Bold'
    },
    viewMoreContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    switch: {
        backgroundColor: colors.terciary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
        fontSize: 16,
        fontFamily: 'GeistMono-Bold'
    },
    contentContainer: {
        flexDirection: 'row',
        width: SCREEN_WIDTH * 2, // Since there are two tabs
    },
});

export default ChatScreen;
