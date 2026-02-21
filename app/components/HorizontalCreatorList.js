import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { FlatList, StyleSheet, View, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import userApi from '../api/user';
import colors from '../config/colors';
import AppText from './AppText';
import BlackButton from './buttons/BlackButton';
import useFormatNumber from '../hooks/useFormatNumber';

const CreatorItem = ({ item, navigation }) => {

  const formatFollowers = useFormatNumber(item.followers);

  return (
    <TouchableOpacity 
      style={styles.itemContainer} 
      onPress={() => navigation.navigate("CreatorDetails", item)} // Pass the item to CreatorDetails screen
    >
      <View style={styles.item}>
        <FastImage
          style={styles.avatar}
          source={{uri: item.avatarUri}}
          defaultSource={require('../assets/default-profile-icon.png')}
        />
        <AppText style={styles.username} numberOfLines={1} ellipsizeMode={'tail'} >{item.username}</AppText>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source = {require('../assets/profile-icon.png')} style = {styles.followerIcon}/>
          <AppText style={styles.subcount}>{formatFollowers}</AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const renderItem = ({ item, navigation }) => {
  return <CreatorItem item={item} navigation={navigation} />; 
};

function HorizontalCreatorList({ navigation, refresh }) {
  const { t } = useTranslation(); 
  const [creators, setCreators] = useState(null);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await userApi.getTopCreators();
        setCreators(response.data.topCreators);
      } catch (error) {
        console.error('Error fetching creators:', error);
      }
    };

    fetchCreators();
  }, [refresh]);

  return (
    <View style={{ marginBottom: 25 }}>
      <View style={styles.header}>
        <AppText style={styles.headerTitle}>{t('horizontalCreatorList.headerTitle')}</AppText>
        <View style={styles.viewMoreContainer}>
          <BlackButton 
            title={t('horizontalCreatorList.viewMore')} 
            style={styles.viewMore} 
            onPress={() => navigation.navigate("SearchNavigator")}
          />
        </View>
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        maxToRenderPerBatch={5}
        data={creators}
        renderItem={({ item }) => renderItem({ item, navigation })} // Pass navigation to renderItem
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    marginHorizontal: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 15,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 18,
    color: colors.white,
    fontFamily: 'GeistMono-Bold',
  },
  viewMoreContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  followerIcon:{
    width: 8,
    height: 8,
    resizeMode: 'contain',
    tintColor: '#7A7A83',
    marginRight: 2,
  },  
  item: {
    width: 100,
    height: 100,
    backgroundColor: '#27272A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.terciary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 10,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: colors.black,
    marginBottom: 5,
  },
  username: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 3,
  },
  subcount: {
    color: '#7A7A83',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default HorizontalCreatorList;
