import * as ImagePicker from 'expo-image-picker';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import chats from '../../api/chats';
import AuthContext from '../../auth/context';
import authStorage from '../../auth/storage';
import colors from '../../config/colors';
import { MAXIMUM_MESSAGE_LENGTH } from '../../config/constants';
import { compressImage } from '../../utils/imageUtils';
import AppText from '../AppText';
import CustomTextInput from '../CustomTextInput';
import { BlackButton, DeleteButton } from '../buttons';
import GemButton from '../buttons/GemButton';
import GreenButton from '../buttons/GreenButton';
import ListItem from '../items/ListItem';
import ChatMessage from './ChatMessage';
import userApi from '../../api/user';
import { useTranslation } from 'react-i18next';

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

function DirectMessage({ navigation, route }) {
    const { chat, user } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const socketRef = useRef(null); // Use ref to store the WebSocket connection
    const flatListRef = useRef(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const client_user = useContext(AuthContext);
    const {updateUser} = useContext(AuthContext);
    const [isFocused, setFocus] = useState(false);
    const [chatPrice, setChatPrice] = useState('');
    const [isFirstMessage, setIsFirstMessage] = useState(false);
    const {t} = useTranslation();

    let messageCounter = 0;

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const { uri } = result.assets[0];
            setSelectedImages(prevImages => [...prevImages, uri]);
        }
    };

    const fetchMessages = async (pageNum = 1) => {
        try {
            const response = await chats.getMessages(chat.id, pageNum);
            const newMessages = response.data.messages;

            if(newMessages.length < 2  && pageNum === 1){
                setIsFirstMessage(true);
            }

            if(newMessages.length > 2  && pageNum === 1){
                setIsFirstMessage(false);
            }

            if (newMessages.length === 0) {
                setHasMore(false);
            } else {
                // Prepend older messages to the top
                setMessages(prevMessages => [ ...prevMessages, ...newMessages,]);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleAcceptRequest = async () =>{
        await chats.acceptChatRequest(chat.id);
        navigation.navigate("ChatScreen");
    };

    const handleDenyRequest = async () =>{
        const result = await chats.denyChatRequest(chat.id);
        if(result.ok){
            navigation.navigate("ChatScreen");
            return;
        }
        updateUser();
    }

    const connectWebSocket = async () => {
        try {
            await chats.createRoom(chat.id);
            const result = await userApi.getChatRules(chat.creatorId);
            setChatPrice(result.data.price);

            const jwtToken = await authStorage.getToken();
            const ws = new WebSocket(`wss://eskiwi.com/api/v1/ws/joinRoom/${chat.id}?token=${jwtToken}`);
    
            ws.onopen = () => {
                //console.log('Connected to the server');
            };
    
            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log(event);
                message.id = `${Date.now()}-${messageCounter++}`;
                setMessages(prevMessages => [message, ...prevMessages]);
                if(messageCounter > 0){
                    setIsFirstMessage(false);
                }
                updateUser();

            };

            ws.onclose = () => {
                //console.log('Disconnected from the server');
                setTimeout(() => {
                    if(isFocused)
                        {
                            ws.close();
                            connectWebSocket();
                        }
                }, 1000);
            };
    
            // Store the WebSocket instance in the ref
            socketRef.current = ws;
        } catch (error) {
            //console.error('Error connecting to WebSocket:', error);
            // Optional: Retry connecting after a delay if an error occurs
            setTimeout(() => {
                //console.log('Retrying connection...');
                connectWebSocket();
            }, 1000); // 5000 ms = 5 seconds
        }
    };
    
    useEffect(() => {
        fetchMessages();
        connectWebSocket();
        setFocus(true);
        updateUser();

        return () => {
            // Clean up WebSocket connection when component unmounts
            if (socketRef.current) {
                setFocus(false);
                socketRef.current.close();
                //console.log('WebSocket connection closed'); 
            }
        };
    }, []);

    const groupMessagesByDate = (messages) => {
        return messages.reduce((groupedMessages, message) => {
          const messageDate = new Date(message.createdAt).toLocaleDateString(); // Format date to a string
          if (!groupedMessages[messageDate]) {
            groupedMessages[messageDate] = [];
          }
          groupedMessages[messageDate].push(message);
          return groupedMessages;
        }, {});
      };
      
      
      const DateSeparator = ({ date }) => {
        // Split the date string into parts
        const [month, day, year] = date.split('/');
    
        // Create a new Date object using the parts
        const parsedDate = new Date(`${year}-${month}-${day}`);
    
        // Check if the date is valid
        const isValidDate = !isNaN(parsedDate.getTime());
        
        // If not a valid date, don't render the component
        if (!isValidDate) {
            return null;
        }
    
        // Format date for display (optional)
        const formattedDate = parsedDate.toLocaleDateString(); // You can customize the locale and options here
    
        return (
            <View style={styles.dateSeparator}>
                <AppText style={styles.dateText}>{formattedDate}</AppText>
            </View>
        );
    };
    
      
      const renderGroupedMessages = () => {
        const groupedMessages = groupMessagesByDate(messages);
      
        let messageItems = [];
      
        Object.keys(groupedMessages).forEach((date) => {      
          groupedMessages[date].forEach((message) => {
            messageItems.push({ type: 'message', ...message }); // Push each message after the date
          });
          messageItems.push({ type: 'date', date }); // Push the date first

        });
      
        return messageItems;
      };
      
            

    const sendImage = async () => {
        if (selectedImages.length === 0) return;

        try {
            const imageUrls = [];
            
            // Upload each image and store the URLs
            for (let imageUri of selectedImages) {
                const formData = new FormData();
                imageUri = await compressImage(imageUri, 2 * 1024 * 1024); // Set max size to 4 MB
                formData.append('images', {
                    uri: imageUri,
                    type: 'image/jpeg',
                    name: `photo_${Date.now()}.jpg`,
                });

                const response = await chats.sendImage(formData);
                imageUrls.push(response.data.Urls[0]);
            }

            // Create a message object with the image URLs and optional text
            const message = {
                text: newMessage.trim(), // Include text if any
                contents: imageUrls,
                gems: isFirstMessage || chat.creatorId === client_user.user.id ? 0 : chatPrice,
            };

            // Check if the WebSocket connection is open, and send the message
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify(message));
            }

            // Clear inputs after sending the message
            setNewMessage('');
            setSelectedImages([]);
            Keyboard.dismiss();
        } catch (error) {
            console.error('Error sending image:', error);
        }
    };

    const handleSendMessage = async () => {
        const trimmedMessage = newMessage.trim();
    
        // Check if the message exceeds the 180 character limit
        if (trimmedMessage.length > MAXIMUM_MESSAGE_LENGTH) {
            alert(`Message exceeds ${MAXIMUM_MESSAGE_LENGTH} characters.`);
            return;
        }
    
        // If there are selected images, send them with the optional text
        if (selectedImages.length > 0) {
            await sendImage();
            console.log("send image")
        } 
        // If there are no selected images but there is text, send just the text message
        else if (trimmedMessage) {

            const message = {
                text: trimmedMessage,
                gems: isFirstMessage || chat.creatorId === client_user.user.id ? 0 : chatPrice, 
            };
            
    
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify(message));
            }
    
            setNewMessage('');
            Keyboard.dismiss();
        }
    };
    
    const renderItem = ({ item }) => {
        if (item.type === 'date') {
          return <DateSeparator date={item.date} />;
        } else {
          return (
            <ChatMessage
              message={item}
              currentUserId={client_user.user.id}
              creator_id={chat.creatorId}
              navigation={navigation}
            />
          );
        }
      };

      const scrollViewRef = useRef(null);
      const [keyboardVisible, setKeyboardVisible] = useState(false);
  
      useEffect(() => {
          const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
              setKeyboardVisible(true);
              if (scrollViewRef.current) {
                  scrollViewRef.current.scrollToEnd({ animated: false }); // Scroll to the bottom when the keyboard is shown
              }
          });
  
          const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
              setKeyboardVisible(false);
          });
  
          return () => {
              keyboardDidHideListener.remove();
              keyboardDidShowListener.remove();
          };
      }, []);
      
    const handleLoadMoreMessages = () => {
        if (hasMore) {
            setPage(prevPage => {
                const newPage = prevPage + 1;
                fetchMessages(newPage);
                return newPage;
            });
        }
    };

    return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={selectedImages.length > 0 ? 60 : 60} // Adjust offset
                >
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => {
                        setFocus(false);
                        navigation.goBack()
                        }}>
                        <Image source={require("../../assets/down-arrow.png")} style={styles.back} />
                    </TouchableOpacity>
                    <View style={styles.content}>
                        <View style={styles.listItemContainer}>
                            <ListItem
                                title={user.displayName}
                                subTitle={`@${user.username}`}
                                avatar={{ uri: user.avatarUri }}
                                avatarSize={40}
                                
                            />
                        </View>
                        <View style={styles.details}>
                            {client_user.user.id === chat.creatorId ? (
                                <DeleteButton
                                    icon={require("../../assets/help-icon.png")}
                                    onPress={handleSendMessage}
                                    iconPosition='left'
                                    title={t("DirectMessageScreen.report")}
                                />
                            ) : (
                                <GemButton
                                    icon={require("../../assets/gem-fill-icon.png")}
                                    onPress={() => navigation.navigate("BuyGems")}
                                    iconPosition='left'
                                    title={`${t("DirectMessageScreen.gemsLeft")}: ${client_user.user.gems}`}
                                />
                            )}
                        </View>
                    </View>
                </View>

                {(chat.creatorId !== client_user.user.id)  && isFirstMessage && (
                    <View style={styles.firstMessageContainer}>
                        <Image style={styles.eskiwiIcon} source={require('../../assets/Eskiwi-gem.png')} />
                        <AppText style={styles.noGems}>{t("DirectMessageScreen.firstMessage")}</AppText>
                        <AppText style={styles.buyGems}>{t("DirectMessageScreen.firstMessageDescription")}</AppText>
                        <DeleteButton
                        style={{marginTop: 20,}}
                        title={t("DirectMessageScreen.refund")}
                        onPress={handleDenyRequest}
                        />
                    </View>
                )}

            {selectedImages.length > 0 ? (
            
                <ScrollView 
                ref={scrollViewRef}
                style={styles.selectedImagesWrapper}
                contentContainerStyle={{ flexGrow: 1 }} // Ensures the ScrollView can expand

                >
                    <View style={styles.selectedImagesContainer}>
                        {selectedImages.map((imageUri, index) => (
                                <FastImage source={{ uri: imageUri }} style={styles.selectedImage} />
                        ))}
                    </View>
                    <BlackButton
                    title={"Crop"}
                    style={styles.deleteButton} 
                    />
                    <DeleteButton 
                        title={"Cancel"}
                        style={styles.deleteButton} 
                        onPress={() => setSelectedImages([])} 
                    />
                </ScrollView>
                ) : (
                    <View style={styles.messageListWrapper}>
                        <FlatList
                            ref={flatListRef}
                            data={renderGroupedMessages()}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            contentContainerStyle={styles.messageList}
                            onEndReached={handleLoadMoreMessages}
                            onEndReachedThreshold={0.4}
                            inverted
                        />
                    </View>
                )}

                {(chat.request && chat.creatorId !== client_user.user.id) || !chat.request ? (
                    <View style={styles.inputContainer}>
                        <CustomTextInput
                            style={styles.commentInput}
                            placeholder={`Escribe por ${isFirstMessage || chat.creatorId === client_user.user.id ? 0 : chatPrice} gemas`}
                            placeholderTextColor={colors.light}
                            multiline
                            numberOfLines={4}
                            value={newMessage}
                            maxCharacters={MAXIMUM_MESSAGE_LENGTH}
                            onChangeText={setNewMessage}
                        />
                            <GemButton
                                style={styles.greenButton}
                                icon={require("../../assets/clip-icon.png")}
                                onPress={handlePickImage}
                            />
                            <GemButton
                                style={styles.greenButton}
                                icon={require("../../assets/diagonal-right-arrow.png")}
                                onPress={handleSendMessage}
                            />
                    </View>
                ) : null}

                {chat.request && chat.creatorId === client_user.user.id && (
                    <View style={styles.requestInteraction}>
                        <GreenButton
                            style={styles.requestButton}
                            icon={require('../../assets/check-icon.png')}
                            title={t("DirectMessageScreen.acceptRequest")}
                            onPress={handleAcceptRequest}
                        />
                        <DeleteButton
                            style={styles.requestButton}
                            icon={require('../../assets/close-icon.png')}
                            title={t("DirectMessageScreen.denyRequest")}
                            onPress={handleDenyRequest}
                        />
                    </View>
                )}
            </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.secondary
    },
    container: {
        flex: 1,        
    },
    headerContainer: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.grayline,
        borderTopColor: colors.grayline,
        width: '100%',
        backgroundColor: colors.secondary,
        marginTop: Platform.OS === 'android' ? 20 : 0, // Add marginTop for Android
    },
    back: {
        width: 20,
        height: 20,
        marginRight: "5%",
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    listItemContainer: {
        flex: 1,
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.white,
    },
    username: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#7A7A83',
    },
    details: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    donateGems: {
        paddingVertical: "5%",
        width: "80%",
    },
    firstMessageContainer: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.secondary,
    },
    eskiwiIcon: {
        height: 40,
        width: 40,
    },
    noGems: {
        color: colors.white,
        fontSize: 14,
        fontFamily: 'GeistMono-Bold',
        marginTop: 10,
        textAlign: 'center'
    },
    buyGems: {
        color: '#7A7A83',
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center'
    },
    selectedImagesWrapper: {
        flex: 1,
    },
    selectedImagesContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20%'
    },
    dateSeparator: {
        alignItems: 'center',
        marginVertical: 10,
      },
      dateText: {
        color: "#7A7A83",
        padding: 5,
        borderRadius: 20,
        fontSize: 12,
        fontFamily: 'GeistMono-Regular'
      },
    selectedImage: {
        width: deviceWidth-20,
        height: deviceHeight/2,
        resizeMode: 'contain',
        borderRadius: 5,
    },
    deleteButton: {
        margin: 10,
    },
    messageListWrapper: {
        flex: 1,
        backgroundColor: colors.primary
    },
    messageList: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: colors.primary,
        justifyContent: 'flex-end'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: colors.secondary,
    },
    commentInput: {
        flex: 1,
        height: "100%",
        color: colors.white,
    },
    greenButton: {
        width: "13.5%",
        height: 48,
        marginHorizontal: 5,
    },
    requestInteraction: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.secondary,
        borderTopColor: colors.terciary,
        borderTopWidth: 1,
        padding: 10,
    },
    requestButton:{
        width: "99%",
        marginVertical: 5,
    },
});

export default DirectMessage;
