import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRoute } from '@react-navigation/native'; // Import useRoute
import FastImage from 'react-native-fast-image';
import colors from '../../config/colors';
import AppText from '../AppText';
import CustomTextInput from '../CustomTextInput';
import { DeleteButton, GreenButton } from '../buttons';
import userApi from '../../api/user';
import CustomDropdown2 from '../CustomDropdown2';
import useToastMessage from '../../hooks/useToastMessage';

const tierPrices = [
    { label: '$5 USD', value: 1 },
    { label: '$10 USD', value: 2 },
    { label: '$25 USD', value: 3 },
    { label: '$50 USD', value: 4 },
    { label: '$100 USD', value: 5 },
];

function EditTier({ navigation }) {
    const { t } = useTranslation();
    const route = useRoute();
    const {showError}  = useToastMessage();

    const { isEdit } = route.params || {}; 

    const [name, setName] = useState('');
    const [benefit, setBenefit] = useState('');
    const [benefits, setBenefits] = useState([]);
    const [price, setPrice] = useState('');
    const [initPrice, setInitPrice] = useState(null);
    
    useEffect(() => {
        // If isEdit is true, load the information from the route params
        if (isEdit && route.params) {
            const { name, benefits, price } = route.params;
            setName(name || '');
            setBenefits(benefits || []);
            const matchedTier = tierPrices.find(tier => tier.value === price) || {};
            setInitPrice(matchedTier.label);
            setPrice(matchedTier.value || '');
        }
    }, [isEdit, route.params]);

    const handleAddBenefit = () => {
        if (benefit.trim()) {
            setBenefits((prevBenefits) => [...prevBenefits, benefit.trim()]);
            setBenefit('');
        }
    };

    const handleDeleteBenefit = (index) => {
        setBenefits((prevBenefits) => prevBenefits.filter((_, i) => i !== index));
    };

    const handleSaveTier = async () => {
        try {
            const response = isEdit
                ? await userApi.updateTier({ name, benefits, tier: price })
                : await userApi.createTier({ name, benefits, tier: price });
                
            if(response.ok)
            {
                navigation.goBack();
            }else{
                showError("Ya existe un tier con este precio", "Error")
            }
        } catch (error) {
            console.error('Error saving tier:', error);
        }
    };

    const handlePriceChange = (selectedItem) => {
        setPrice(selectedItem.value); 
    };

    const renderBenefitItem = ({ item, index }) => (
        <View style={styles.benefitItem}>
            <AppText style={styles.benefitText}>{item}</AppText>
            <TouchableOpacity onPress={() => handleDeleteBenefit(index)} style={styles.deleteButton}>
                <FastImage source={require('../../assets/trash-icon.png')} style={styles.deleteIcon} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.headerContainer}>
                    <AppText style={styles.title}>{isEdit ? t('editTier.editTier') : t('editTier.createTier')}</AppText>
                </View>
                <View style={styles.inputsContainer}>
                    <View style={styles.inputGroup}>
                        <AppText style={styles.subTitle}>{t('editTier.name')}</AppText>
                        <CustomTextInput
                            placeholder={t('editTier.name')}
                            value={name}
                            onChangeText={setName}
                            onSubmitEditing={() => console.log('Tier name submitted!')}
                            multiline={false}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <View style={styles.inputLabelContainer}>
                            <AppText style={styles.subTitle}>{t('editTier.price')}</AppText>
                            <AppText style={styles.priceRange}>{`5$-50$ ${t('editTier.perMonth')}`}</AppText>
                        </View>
                        <CustomDropdown2
                            data={tierPrices}
                            placeholder={initPrice}
                            value={tierPrices.find(tier => tier.value === price)?.label || initPrice}
                            multiple={false}
                            onChange={handlePriceChange}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <View style={styles.inputLabelContainer}>
                            <AppText style={styles.subTitle}>{t('editTier.addBenefit')}</AppText>
                            <AppText style={styles.charLimit}>{`50 ${t('editTier.characters')}`}</AppText>
                        </View>
                        <CustomTextInput
                            placeholder={t('editTier.addBenefit')}
                            value={benefit}
                            onChangeText={setBenefit}
                            onSubmitEditing={handleAddBenefit}
                            multiline={false}
                            style={styles.input}
                        />
                        <FlatList
                            data={benefits}
                            renderItem={renderBenefitItem}
                            keyExtractor={(item, index) => item.toString()}
                            style={styles.benefitList}
                            scrollEnabled={false}
                        />
                    </View>
                    <GreenButton
                        style={styles.saveTier}
                        title={t('editTier.save')}
                        icon={require('../../assets/check-icon.png')}
                        onPress={handleSaveTier}
                    />
                    <DeleteButton
                        style={styles.saveTier}
                        title={t('editTier.delete')}
                        icon={require("../../assets/trash-icon.png")}
                        onPress={() => {
                            navigation.goBack();
                        }}
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
    scrollContent: {
        padding: 20,
    },
    headerContainer: {
        marginTop: 20,
        marginLeft: 10,
    },
    inputsContainer: {
        marginTop: 30,
        backgroundColor: colors.secondary,
        padding: 15,
        borderRadius: 10,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        color: colors.white,
        fontSize: 20,
        fontWeight: '700',
        fontFamily: 'GeistMono-Bold',
    },
    subTitle: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '500',
    },
    priceRange: {
        color: '#52525B',
        fontSize: 14,
        marginBottom: 15,
        fontWeight: '400',
    },
    charLimit: {
        color: '#52525B',
        fontSize: 14,
        fontWeight: '400',
    },
    input: {
        marginTop: 10,
        borderRadius: 5,
        backgroundColor: colors.terciary,
        paddingHorizontal: 10,
        height: 40,
    },
    saveTier: {
        marginVertical: 5,
    },
    benefitList: {
        marginTop: 10,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.terciary,
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    benefitText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '400',
        flex: 1, 
    },
    deleteButton: {
        marginLeft: 10,
    },
    deleteIcon: {
        width: 15,
        height: 15,
    },
});

export default EditTier;
