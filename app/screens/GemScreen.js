import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import Purchases from 'react-native-purchases'; // Import RevenueCat Purchases
import AuthContext from '../auth/context';
import AppText from '../components/AppText';
import GemItem from '../components/buyGems/GemItem';
import Screen from '../components/Screen';
import colors from '../config/colors';
import { RC_APPLE_KEY, RC_ANDROID_KEY } from '../config/constants';
import useToastMessage from '../hooks/useToastMessage';

function GemScreen({ navigation }) {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation(); 
    const { showSuccess, showError } = useToastMessage(); // For showing messages
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            if(Platform.OS === 'android'){
                Purchases.configure({apiKey: RC_ANDROID_KEY, appUserID: user.id});
            }
            else{
                Purchases.configure({apiKey: RC_APPLE_KEY, appUserID: user.id});
            }
            try {
                const fetchedProducts = await Purchases.getProducts(['300.gems', '500.gems', '100.gems', '1500.gems', '10000.gems', '30000.gems', '5000.gems'], Purchases.PRODUCT_CATEGORY.NON_SUBSCRIPTION);    
                const sortedProducts = fetchedProducts.sort((a, b) => a.price - b.price);                     
                setProducts(sortedProducts);
            } catch (e) {
                console.error('Failed to fetch products', e);
                showError(t('gemScreen.fetchError')); 
            }
        };

        fetchProducts();
    }, []);

    const handleBuyPress = async (item) => {
        try {
            const purchase = await Purchases.purchaseProduct(item.identifier, null, Purchases.PRODUCT_CATEGORY.NON_SUBSCRIPTION);
            console.log('Purchase successful', purchase);
            navigation.navigate("GemSuccess", item.title); 
        } catch (e) {
            if (e.userCancelled) {
                console.log('User cancelled the purchase');
            } else {
                console.error('Purchase failed', e);
                showError(t('gemScreen.purchaseFailed')); 
            }
        }
    };

    return (
        <Screen style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.header}>
                    <AppText style={styles.headerText}>{t('gemScreen.headerTitle')}</AppText>
                    <AppText style={styles.headerSubtitle}>
                        {t('gemScreen.headerSubtitle')}
                    </AppText>
                </View>
                <View style={styles.gemItemsContainer}>
                    {products.map((item, index) => (
                        <GemItem
                            key={item.identifier} // Using product identifier as the key
                            price={`${item.priceString} ${item.currencyCode}`}
                            gems={`${item.title}`} // You can customize this as needed
                            isFirst={index === 0}
                            onPress={() => handleBuyPress(item)} // Trigger RevenueCat purchase
                        />
                    ))}
                </View>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary,
        flex: 1,
    },
    header: {
        alignItems: 'center',
        marginVertical: 20,
    },
    headerText: {
        textAlign: 'center',
        color: colors.white,
        fontSize: 45,
        fontFamily: 'GeistMono-Bold'
    },
    headerSubtitle: {
        color: colors.white,
        fontSize: 14,
        marginTop: 5,
        marginHorizontal: 20,
        textAlign: 'center',
    },
    scrollViewContent: {
        width: '100%',
        justifyContent: 'center',
    },
    gemItemsContainer: {
        backgroundColor: colors.secondary, 
        borderRadius: 10,
        marginHorizontal: 20,
    },
});

export default GemScreen;
