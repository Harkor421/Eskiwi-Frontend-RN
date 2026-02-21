import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View, Platform, Linking} from 'react-native';
import { MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view';
import FastImage from 'react-native-fast-image';
import userApi from '../api/user';
import AppText from '../components/AppText';
import UserCard from '../components/UserCard';
import FollowButton from '../components/buttons/FollowButton';
import ProductItem from '../components/items/ProductItem';
import RuleItem from '../components/items/RuleItem';
import colors from '../config/colors';
import GridView from './GridView';
import { getPriceByTier } from '../utils/getPriceByTier';
import Purchases from 'react-native-purchases';
import { RC_APPLE_KEY } from '../config/constants';
import AuthContext from '../auth/context';
import { useContext } from 'react';
import useToastMessage from '../hooks/useToastMessage';
import useFormatNumber from '../hooks/useFormatNumber';

const HEADER_HEIGHT = 450;


const tabBar = props => (
  <MaterialTabBar
    {...props}
    indicatorStyle={{ backgroundColor: '#FA3D86' }}
    style={{ backgroundColor: colors.secondary }}
    labelStyle={styles.labelText}
    inactiveColor={colors.white}
    activeColor={colors.white}
  />
);


const ProductsTab = ({ creator, navigation }) => {
  const { t } = useTranslation();
  const [tiers, setTiers] = useState([]);
  const { user } = useContext(AuthContext);
  const isCreator = user.id === creator.id;
  const { showError, showSuccess } = useToastMessage();

  const handleSub = async (tier, isSubscribed) => {
    try {


      if (isCreator) {
        navigation.navigate("ProfileSettings");
        setTimeout(() => {
          navigation.navigate("AccountSettings");
        }, 300); 
        return;
      }


      if (isSubscribed) {
        // Send management URL for cancellation
        const managementUrl = Platform.OS === 'android'
          ? 'https://play.google.com/store/account/subscriptions' // Google Play URL for Android
          : 'https://apps.apple.com/account/subscriptions'; // Apple subscriptions management URL for iOS
  
        Linking.openURL(managementUrl);
        return; 
      }
  
      // Continue with subscription process if not subscribed
      const availableGroupNumber = await userApi.getAvailableSubscription();
      if (Platform.OS === 'android') {
        Purchases.configure({ apiKey: RC_ANDROID_KEY, appUserID: user.id });
      } else {
        Purchases.configure({ apiKey: RC_APPLE_KEY, appUserID: user.id });
      }
  
      const parsedTier = parseInt(tier, 10);
  
      const r = await userApi.createSubscriptionToCreator({
        tier: parsedTier,
        creator_id: creator.id,
        product_id: `Group${availableGroupNumber.data.group}_Tier_${parsedTier}`
      });
      console.log(`Group${availableGroupNumber.data.group}_Tier_${parsedTier}`);
      // Fetch available subscription products
      const fetchedProducts = await Purchases.getProducts(
        [`Group${availableGroupNumber.data.group}_Tier_${parsedTier}`],
        Purchases.PRODUCT_CATEGORY.SUBSCRIPTION
      );
  
      if (fetchedProducts.length > 0) {
        const selectedProduct = fetchedProducts[0];
        console.log(`Selected product for purchase: ${selectedProduct.identifier}`);
  
        // Initiate the purchase
        const purchaseResult = await Purchases.purchaseProduct(selectedProduct.identifier);
  
        if (purchaseResult.customerInfo.activeSubscriptions.length > 0) {
          console.log('Purchase successful:', purchaseResult);
          showSuccess(t('purchase.success'));
          fetchTiers();
        } else {
          console.log('No active subscription after purchase');
          showError(t('purchase.failed'));
        }
      } else {
        console.log('No products available for purchase');
        showError(t('creatorScreen.noProducts'));
      }
    } catch (e) {
      console.error('Failed to purchase product', e);
      showError(t('gemScreen.purchaseError'));
    }
  };
  
  const fetchTiers = async () => {
    try {
      const response = await userApi.getTiers(creator.id);
      setTiers(response.data.tiers || []); 
    } catch (error) {
      console.error('Failed to fetch tiers:', error);
      showError(t('tierScreen.fetchError'));
    }
  };

  useEffect(() => {

    fetchTiers();
  }, [creator.id]);

  const renderItem = ({ item }) => (
    <ProductItem
      key={item.id}
      title={item.name}
      price={`$${getPriceByTier(item.tier)} USD`}
      frequency={t('productScreen.perMonth')}
      benefits={item.benefits}
      isSubscribed={item.subscribed}
      onPress={() => handleSub(item.tier, item.subscribed)} 
      edit={isCreator}
    />
  );

  return (
    <Tabs.FlatList
      data={tiers}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.tabContent}
    />
  );
};

const ChatTab = ({ navigation, creator }) => {
  const { t } = useTranslation();
  const [rules, setRules] = useState([]); // State to hold the rules
  const [price, setPrice] = useState(0); // State to hold the price if needed

  // Effect to fetch rules from API
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await userApi.getChatRules(creator.id);
        setRules(response.data.rules || []); // Set rules to an empty array if null
        setPrice(response.data.price);
      } catch (error) {
        console.error('Failed to fetch rules:', error);
      } finally {
      }
    };

    fetchRules();
  }, []); // Empty dependency array means this runs once on mount


  return (
    <Tabs.ScrollView contentContainerStyle = {{alignItems: 'center'}}>
      {rules.length > 0 ? (  // Check if rules array is not empty
        <RuleItem
          title={"Reglas de chat"}
          price={price}
          frequency="por mensaje"
          benefits={rules}
          navigation={navigation}
          creator={creator}
        />
      ) : (
        <AppText style={styles.noRulesText}>{t('Este creador no tiene los chats habilitados')}</AppText>
      )}
    </Tabs.ScrollView>
  );
};


const Header = ({ user, navigation }) => {
  const { t } = useTranslation();
  const [followers, setFollowers] = useState(parseInt(user.followers, 10));

  
  const handleVerticalDotPress = () => {
    navigation.navigate("UserManagement", user);
  };

  

  return (
    <View style={styles.header}>
      <UserCard
        banner={{ uri: user.bannerUri, priority: FastImage.priority.high }}
        avatar={{ uri: user.avatarUri, priority: FastImage.priority.high}}
        name={user.displayName}
        username={user.username}
        verticalDotPress={handleVerticalDotPress}
      />
      <View style={styles.statsContainer}>
        <AppText style={styles.followers}>
          {t('creatorScreen.followers', { count: useFormatNumber(followers) })} {/* Use the followers state */}
        </AppText>
      </View>

      <FollowButton
        creatorId={user.id}
        navigation={navigation}
        followers={followers}
        onFollowersChange={setFollowers} 
      />

      <AppText style={styles.separator}>------------------</AppText>

      {user.description && user.description.trim() !== '' && (
        <AppText style={styles.bio} numberOfLines={3} ellipsizeMode="tail">
          {user.description}
        </AppText>
      )}
    </View>
  );
};


const CreatorScreen = ({ route, navigation }) => {
  const [user] = useState(route.params || null);
  const [loading, setLoading] = useState(!route.params);

  const { t } = useTranslation();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.white} />
      </View>
    );
  }

  return (
    <Tabs.Container
      renderHeader={() => <Header navigation = {navigation} user={user} />}
      headerHeight={HEADER_HEIGHT}
      renderTabBar={tabBar}
    >
      <Tabs.Tab label={t('creatorScreen.posts')} name="Posts">
        <GridView navigation={navigation} userID={user.id} />
      </Tabs.Tab>
      <Tabs.Tab label={t('creatorScreen.subscriptions')} name="Subscriptions">
        <ProductsTab creator={user} navigation={navigation}/>
      </Tabs.Tab>
      <Tabs.Tab label={t('creatorScreen.chat')} name="Chat">
        <ChatTab creator = {user} navigation={navigation} />
      </Tabs.Tab>
    </Tabs.Container>
  );
};

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    width: '100%',
    backgroundColor: colors.secondary,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  followers: {
    color: "#7A7A83",
    fontSize: 14,
    marginBottom: 20,
  },
  separator: {
    color: colors.terciary,
    fontSize: 30,
    marginHorizontal: 10,
  },
  bio: {
    color: '#7A7A83',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  tabContent: {
    flexGrow: 1,
    padding: 20,
    marginTop: 20,
  },
  tabContentText: {
    fontSize: 18,
    color: colors.black,
  },
  labelText: {
    fontSize: 12, // Adjust this value to resize the labels
    color: colors.white,
    fontFamily: 'GeistMono-Bold',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  noRulesText:{
    fontFamily: 'GeistMono-Bold',
    fontSize: 12,
    marginTop: 80,
  }
});

export default CreatorScreen;
