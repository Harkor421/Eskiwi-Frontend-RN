import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Tabs } from 'react-native-collapsible-tab-view';
import FastImage from 'react-native-fast-image';
import postsApi from '../api/posts';

const { width } = Dimensions.get('window');

const GridView= ({ navigation, userID }) => {
  const [page, setPage] = useState(0);
  const [allPosts, setAllPosts] = useState([]);
  const { t } = useTranslation('postfeed');

  const { data: posts, loading, request: loadPosts } = useApi(() => postsApi.getLatestUserPosts(userID, page));

  const renderItem = ({ item }) => {
    if (!item) return <View style={[styles.gridItem, styles.invisibleItem]} />;
    const id = item.post.id;

    return (
      <View style={styles.gridItem}>
        <TouchableOpacity onPress={() => navigation.navigate('Unique', { id })}>
          <FastImage
            style={styles.image}
            source={{ uri: item.post.content[0], priority: FastImage.priority.high }}
            resizeMode="cover"
          />
          {item.post.content.length > 1 && (
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/blank-check-icon.png')}
                style={styles.logo2}
              />
              <Image
                source={require('../assets/blank-check-icon.png')}
                style={styles.logo}
              />
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };



  useEffect(() => {
    if (posts && posts.posts) {
      setAllPosts((prevPosts) => ([...prevPosts, ...posts.posts]));
    }
  }, [posts]);

  const handleRefresh = useCallback(() => {
    loadPosts();
  }, []);
  

  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [handleRefresh])
  );

  const keyExtractor = (item, index) => {
    if (!item || !item.post || !item.post.id) return index.toString();
    return item.post.id.toString() + index;
  };

  useEffect(() => {
    loadPosts();
  }, [page]);

  return (

    <Tabs.FlatList
    data={allPosts} // Directly use allPosts
    keyExtractor={keyExtractor}
    renderItem={renderItem}
    numColumns={3}
    onEndReachedThreshold={0.7}
    onEndReached={() => {
      setPage((prevPage) => prevPage + 1);
    }}
    refreshing={loading}
    onRefresh={handleRefresh}
    scrollEnabled={true}
  />
  

  );
}

const styles = StyleSheet.create({
  gridItem: {
    margin: 0.5,
  },
  invisibleItem: {
    backgroundColor: 'transparent',
  },
  image: {
    width: width / 3,
    height: width / 3,
  },
  logoContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    position: 'absolute',
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  logo2: {
    position: 'absolute',
    width: 20,
    height: 20,
    bottom: 6,
    left: 5,
    resizeMode: 'contain',
  },
  scrollContainer: {
    flexGrow: 1,
  },
});

export default GridView;
