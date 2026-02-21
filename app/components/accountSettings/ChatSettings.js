import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import userApi from '../../api/user';
import AuthContext from '../../auth/context';
import colors from '../../config/colors';
import { MAXIMUM_MESSAGE_LENGTH } from '../../config/constants';
import AppText from '../AppText';
import CustomTextInput from '../CustomTextInput';
import { GreenButton } from '../buttons';
import SuccessModal from '../modals/SuccessModal';

function ChatSettings({ navigation }) {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [newRule, setNewRule] = useState('');
    const [rules, setRules] = useState([]);
    const [gems, setGems] = useState(''); // State for gems input
    const [loadingRules, setLoadingRules] = useState(true); // State for loading rules
    const [error, setError] = useState(null); // State for error handling

    const fetchChatRules = async () => {
        setLoadingRules(true); 
        try {
            const response = await userApi.getChatRules(user.id); // Adjust this function to match your API
            if (response.ok) {
                setRules(response.data.rules); // Assuming response contains rules in data.rules
                setGems(response.data.price);
            } else {
                setError('Failed to fetch rules');
                console.error(response.data);
            }
        } catch (err) {
            setError('An error occurred while fetching rules');
            console.error(err);
        } finally {
            setLoadingRules(false); // Set loading to false
        }
    };

    useEffect(() => {
        fetchChatRules(); // Fetch chat rules on component mount
    }, []);

    const handleSaveTier = async () => {
        try {
            const gemsInt = parseInt(gems); // Convert gems to an integer

            // Check if the parsed integer is valid
            if (isNaN(gemsInt)) {
                console.error("Invalid gems value");
                return; // Exit if invalid
            }

            // Call the API to update chat settings with gems and rules
            const response = await userApi.updateChatRules(gemsInt, rules);

            if (response.ok) {
                setIsSuccessModalVisible(true);
            } else {
                console.error(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const closeSuccessModal = () => {
        setIsSuccessModalVisible(false);
    };

    const handleAddRule = () => {
        if (newRule.trim() !== '') {
            setRules([...rules, newRule]);
            setNewRule('');
        }
    };

    const handleRemoveRule = (index) => {
        const updatedRules = [...rules];
        updatedRules.splice(index, 1);
        setRules(updatedRules);
    };

    const renderTag = ({ item, index }) => (
        <View style={styles.tag}>
            <Text style={styles.tagText}>{item}</Text>
            <TouchableOpacity onPress={() => handleRemoveRule(index)} style={styles.removeButton}>
                <Text style={styles.removeText}>X</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <AppText style={styles.headerText}>{t('chatSettings.header')}</AppText>
                <View style={styles.centeredView}>
                    <View style={styles.settingsContainer}>
                        <View style={{ paddingHorizontal: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <AppText style={styles.title}>{t('chatSettings.gems')}</AppText>
                                <AppText style={styles.maximum}>{`${MAXIMUM_MESSAGE_LENGTH} ${t("chatSettings.characters")}`}</AppText>
                            </View>
                            <CustomTextInput
                                placeholder={`${gems}`}
                                multiline={false}
                                style={styles.input}
                                value={gems} // Bind the gems input to the state
                                onChangeText={setGems} // Update the state when text changes
                            />

                            <AppText style={[styles.title, { marginTop: 15 }]}>{t('chatSettings.rules')}</AppText>
                            <CustomTextInput
                                placeholder={t("chatSettings.rulePlaceholder")}
                                value={newRule}
                                style={styles.input}
                                onChangeText={setNewRule}
                                onSubmitEditing={handleAddRule} // Add rule when pressing Enter
                            />
                                <FlatList
                                    data={rules}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={renderTag}
                                    contentContainerStyle={styles.tagsContainer}
                                    scrollEnabled={false}
                                />
                        </View>

                        <View style={{ paddingHorizontal: 10, marginTop: 40 }}>
                            <GreenButton
                                style={styles.saveChanges}
                                title={t('chatSettings.saveSettings')}
                                icon={require("../../assets/check-icon.png")}
                                onPress={handleSaveTier}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
            <SuccessModal
                modalVisible={isSuccessModalVisible}
                onRequestClose={closeSuccessModal}
                title={t("settingSaveSuccessful")}
                buttonText={"Ok!"}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.white,
        fontFamily: 'GeistMono-Bold',
        marginTop: "5%",
        marginLeft: "5%",
    },
    centeredView: {
        alignItems: 'center',
        padding: 20,
    },
    scrollView: {
        flexGrow: 1,
    },
    settingsContainer: {
        backgroundColor: colors.secondary,
        borderRadius: 10,
        marginTop: "5%",
        width: "100%",
        padding: 20,
        borderTopColor: colors.terciary,
        borderTopWidth: 1,
    },
    title: {
        color: colors.white,
        fontSize: 14,
    },
    maximum: {
        color: '#52525B',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    input: {
        marginTop: 10,
        borderRadius: 5,
        backgroundColor: colors.terciary,
        paddingHorizontal: 10,
        height: 40,
        color: colors.white,
    },
    tagsContainer: {
        marginTop: 10,
    },
    tag: {
        backgroundColor: colors.primary,
        borderRadius: 5,
        marginVertical: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    tagText: {
        color: colors.white,
        fontSize: 12,
        fontFamily: 'GeistMono-Regular',
        flex: 1,
    },
    removeButton: {
        marginLeft: 10,
    },
    removeText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    saveChanges: {
        padding: 10,
    },
    errorText: {
        color: 'red', // Style for error messages
        textAlign: 'center',
        marginVertical: 10,
    },
});

export default ChatSettings;
