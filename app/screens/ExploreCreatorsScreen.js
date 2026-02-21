import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import { GemButton } from '../components/buttons';
import CustomTextInput from '../components/CustomTextInput';
import colors from '../config/colors';

function ExploreCreatorsScreen({ navigation }) {
    const [searchQuery, setSearchQuery] = useState(''); // Search state
    const { t } = useTranslation();

    // Handle search logic here
    const handleSearch = (query) => {
        setSearchQuery(query); // Ensure this updates the state correctly
    };

    // Navigate to the search results or another screen when "Enter" is pressed
    const handleEnterPress = () => {
        if (searchQuery.trim()) {
            // Navigate to a new screen with searchQuery as a parameter
            navigation.navigate('SearchCreatorList', searchQuery);
        }
    };

    return (
        <View style={styles.screen}>
            <ScrollView>
                <View style={styles.centeredContainer}>
                    <Image style={styles.icon} source={require("../assets/binoculars.png")} />
                    <AppText style={styles.headerTitle}>{t('exploreCreatorsScreen.headerTitle')}</AppText>
                    <AppText style={styles.subheaderTitle}>{t('exploreCreatorsScreen.subheaderTitle')}</AppText>
                </View>
                <View style={styles.searchContainer}>
                    <AppText style={styles.subheaderTitle2}>{t('exploreCreatorsScreen.searchPlaceholder')}</AppText>
                    <CustomTextInput
                        placeholder={t('exploreCreatorsScreen.searchPlaceholder')}
                        value={searchQuery} // Controlled input
                        onChangeText={handleSearch} // Updates the state
                        onSubmitEditing={handleEnterPress} // Handle "Enter" key press
                    />
                    <AppText style={styles.body}>{t('exploreCreatorsScreen.recommendationText')}</AppText>
                    <GemButton 
                        style={styles.rightGemButton} 
                        icon={require("../assets/gem-fill-icon.png")}
                        iconPosition={"left"}
                        title={t('exploreCreatorsScreen.suggestRandomCreator')}
                        onPress={() => {/* Add desired action here */}}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    centeredContainer: {
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 35,
    },
    icon: {
        width: 80,
        height: 80,
    },
    headerTitle: {
        fontSize: 24,
        marginVertical: 15,
        color: colors.white,
        fontFamily: 'GeistMono-Bold',
    },
    subheaderTitle: {
        fontSize: 14,
        color: colors.white,
        fontWeight: '500',
    },
    subheaderTitle2: {
        fontSize: 16,
        color: colors.white,
        fontWeight: '600',
        marginBottom: 20,
    },
    body: {
        fontSize: 16,
        color: colors.white,
        textAlign: 'center',
        marginVertical: 40,
    },
    searchContainer: {
        marginTop: 30,
        padding: 15,
    },
    rightGemButton: {
        width: "100%",
        padding: "4%", 
    },

});

export default ExploreCreatorsScreen;
