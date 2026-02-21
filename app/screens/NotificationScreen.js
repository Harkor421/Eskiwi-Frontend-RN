import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, RefreshControl, StyleSheet, View } from 'react-native';
import notificationsApi from '../api/notifications';
import AuthContext from '../auth/context';
import { ActivityIndicator } from 'react-native';
import AppText from '../components/AppText';
import BlackButton from '../components/buttons/BlackButton';
import NotificationItem from '../components/items/NotificationItem';
import colors from '../config/colors';
import useApi from '../hooks/useApi';

const MemoizedNotificationItem = React.memo(NotificationItem); // Memoize the NotificationItem component

function NotificationScreen({ navigation }) {
    const { t } = useTranslation();
    const { updateUser } = useContext(AuthContext);

    const [page, setPage] = useState(1);
    const [notifications, setNotifications] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isDataLoaded, setIsDataLoaded] = useState(false); // Track if data has been loaded
    const flatListRef = useRef(null);

    const { data, error, loading, request: loadNotifications } = useApi(() => notificationsApi.getNotifications(page));

    useEffect(() => {
        if (hasMore) {
            loadNotifications();
        }
    }, [page]);

    useEffect(() => {
        if (data && data.notifications) {
            setIsDataLoaded(true); // Set to true when data is loaded
            if (data.notifications.length === 0) {
                setHasMore(false);
            } else {
                // Update state only if new notifications are different
                setNotifications((prevNotifications) => {
                    const newNotifications = data.notifications.filter(
                        newNotification => !prevNotifications.some(prev => prev.id === newNotification.id)
                    );
                    return page === 1 ? newNotifications : [...prevNotifications, ...newNotifications];
                });
            }
        }
    }, [data]);

    const handleRefresh = () => {
        setPage(1);
        setNotifications([]);
        setHasMore(true);
        loadNotifications();
    };

    useFocusEffect(
        React.useCallback(() => {
            handleRefresh();
            if (flatListRef.current) {
                flatListRef.current.scrollToOffset({ offset: 0, animated: true });
            }
        }, [])
    );

    const renderItem = ({ item }) => (
        <MemoizedNotificationItem
            notification={item}
            isAdmin={false}
            onReply={handleReply}
            navigation={navigation}
        />
    );

    const handleReply = (notification) => {
        console.log('Replying to notification:', notification);
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <AppText style={styles.title}>{t('notification.title')}</AppText>
            <BlackButton
                title={t('notification.settings')}
                style={styles.viewMore}
                onPress={() => {
                    navigation.navigate("ProfileSettings");
                    setTimeout(() => {
                        navigation.navigate("NotificationSettings");
                    }, 300);
                }}
            />
        </View>
    );

    const renderEmptyComponent = () => (
        <View style={styles.emptyStateContainer}>
            <Image style={styles.icon} source={require("../assets/notification-email.png")} />
            <AppText style={styles.header1}>{t('notification.noNotifications')}</AppText>
            <AppText style={styles.header2}>{t('notification.discoverCreators')}</AppText>
        </View>
    );

    return (
        <View style={styles.screen}>
            <FlatList
                showsVerticalScrollIndicator={false}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                ref={flatListRef}
                data={notifications}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl style={{ borderColor: 'white' }} refreshing={loading} onRefresh={handleRefresh} />
                }
                onEndReachedThreshold={0.2}
                onEndReached={() => {
                    if (hasMore) {
                        setPage(prevPage => prevPage + 1);
                    }
                }}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={isDataLoaded && notifications.length === 0 ? renderEmptyComponent : null} // Check if data is loaded
                ListFooterComponent={
                    loading ? <ActivityIndicator size="small" color={colors.white} /> : null
                }
                contentContainerStyle={styles.flatListContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    headerContainer: {
        flexDirection: 'row',
        marginTop: 20,
        paddingHorizontal: 10,
        marginBottom: 30,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        color: colors.white,
        fontSize: 20,
        fontFamily: 'GeistMono-Bold',
    },
    viewMore: {
        marginRight: 10,
    },
    emptyStateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    header1: {
        color: colors.white,
        fontSize: 20,
        marginTop: 8,
    },
    header2: {
        color: colors.white,
        fontSize: 16,
        textAlign: 'center',
        marginTop: 2,
    },
    icon: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    flatListContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    loadingMoreText: {
        textAlign: 'center',
        paddingVertical: 10,
        color: colors.white,
    },
    errorText: {
        color: colors.white,
        textAlign: 'center',
    },
});

export default NotificationScreen;
