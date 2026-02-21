import React, { useContext, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import routes from '../../navigation/routes';
import PlusButton from "../buttons/PlusButton"; // Adjust the import path as needed
import ProductItem from "../items/ProductItem";
import Screen from "../Screen";
import userApi from '../../api/user';
import AuthContext from '../../auth/context';
import { getPriceByTier } from '../../utils/getPriceByTier';

const SubscriptionSettings = ({ navigation }) => {
  const [subscriptions, setSubscriptions] = useState([]); // State for subscriptions
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const { user } = useContext(AuthContext);

  const handleAddProduct = () => {
    navigation.navigate(routes.EDIT_TIER); // Use routes constant for EditTier
  };

  // Use useFocusEffect to refetch subscriptions when screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchSubscriptions = async () => {
        try {
          const response = await userApi.getTiers(user.id);
          setSubscriptions(response.data.tiers);
        } catch (error) {
          console.error("Error fetching subscriptions:", error);
          setError("Failed to load subscriptions."); // Handle error
        } finally {
          setLoading(false); // Set loading to false once the fetch is done
        }
      };

      fetchSubscriptions(); // Call the function when screen is focused

    }, [user]) // Dependency on user to ensure correct user data
  );

  return (
    <View style={styles.tabContent}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {subscriptions.map(subscription => (
          <ProductItem 
            key={subscription.id} 
            title={subscription.name}
            price={`$${getPriceByTier(subscription.tier)} USD`} // Use the tier-based price here
            frequency={subscription.frequency || 'por mes'} 
            benefits={subscription.benefits || []} 
            edit={true} 
            onPress={() => navigation.navigate(routes.EDIT_TIER, {
              isEdit: true, 
              name: subscription.name,
              benefits: subscription.benefits,
              price: subscription.tier,
            })}
          />
        ))}
        <PlusButton onPress={handleAddProduct} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  itemContainer: {
    marginBottom: 20,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    color: 'gray',
  },
  itemBenefit: {
    fontSize: 12,
  },
});

export default SubscriptionSettings;
