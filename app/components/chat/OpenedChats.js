import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import React, { useCallback, useState } from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import chatsApi from '../../api/chats';
import colors from '../../config/colors';
import AppText from '../AppText';
import GemButton from '../buttons/GemButton';
import ChatPreview from './ChatPreview';

function OpenedChats({ navigation }) {
    const [hasChats, setHasChats] = useState(true);
    const [chats, setChats] = useState([]);

    // Fetch chats function
    const fetchChats = async () => {
        try {
            const result = await chatsApi.getChats(1);
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
                            pending={item.unread}
                            navigation={navigation}
                        />
                    )}
                    style={styles.flatList}
                    contentContainerStyle={styles.flatListContent}
                />
            ) : (
                <>
                    <Image source={require("../../assets/chat-email.png")} />
                    <AppText style={styles.header1}>No hay chats por ahora!</AppText>
                    <AppText style={styles.header2}>
                        Descubre nuevos o encuentra tus creadores favoritos y compra un chat con ellos
                    </AppText>
                    <GemButton
                        style={styles.findCreators}
                        icon={require("../../assets/diagonal-right-arrow.png")}
                        iconPosition={"right"}
                        title={"Encuentra creadores"}
                        onPress={() => navigation.navigate("SearchNavigator")}
                    />
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
        borderTopWidth: 1,
        borderTopColor: colors.terciary,
    },
    header1: {
        color: colors.white,
        fontSize: 20,
        marginTop: "8%",
    },
    header2: {
        color: colors.white,
        fontSize: 16,
        textAlign: 'center',
        marginTop: "2%",
    },
    findCreators: {
        marginTop: "10%",
        width: "80%",
        padding: "4%",
    },
});

export default OpenedChats;
