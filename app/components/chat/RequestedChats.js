import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import chatsApi from '../../api/chats';
import colors from '../../config/colors';
import AppText from '../AppText';
import ChatPreview from './ChatPreview';

function RequestedChats({ navigation }) {
    const [hasChats, setHasChats] = useState(true);
    const [chats, setChats] = useState([]);
    const {t} = useTranslation();

    // Fetch chats function
    const fetchChats = async () => {
        try {
            const result = await chatsApi.getRequests(1);
            setChats(result.data.chats);
            setHasChats(result.data.chats.length > 0);
        } catch (error) {
            console.error("Error fetching chats:", error);
            setHasChats(false);
        }
    };

    // Use useFocusEffect to re-fetch chats whenever the screen is focused
    useFocusEffect(
        useCallback(() => {
            fetchChats();
        }, [])
    );

    return (
        <View style={styles.container}>
            {hasChats ? (
                <FlatList
                    scrollEnabled={false}
                    data={chats}
                    keyExtractor={item => item.chat.id}
                    renderItem={({ item }) => (
                        <ChatPreview
                            chat={item.chat}
                            user={item.user}
                            navigation={navigation}
                            pending={item.unread}
                        />
                    )}
                    style={styles.flatList}
                    contentContainerStyle={styles.flatListContent}
                />
            ) : (
                <>
                    <Image source={require("../../assets/chat-email.png")} />
                    <AppText style={styles.header1}>{t('requestedChats.title')}</AppText>
                    <AppText style={styles.header2}>{t('requestedChats.description')}</AppText>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        marginTop: "10%",
        backgroundColor: colors.primary,
    },
    flatList: {
        width: '100%',
        backgroundColor: colors.primary,
        borderTopColor: colors.terciary,
        borderTopWidth: 1,
    },

    header1: {
        color: colors.white,
        fontFamily: 'GeistMono-Regular',
        fontSize: 18,
        marginTop: "8%",
        textAlign:'center',
    },
    header2: {
        color: colors.white,
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'GeistMono-Light',
        marginTop: "2%",
    },
    findCreators: {
        marginTop: "10%",
        width: "80%",
        padding: "4%",
    },
});

export default RequestedChats;
