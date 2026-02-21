import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import postsApi from '../api/posts'; // Assume this fetches the data from the API
import ActivityIndicator from '../components/ActivityIndicator';
import BannerAdComponent from '../components/ads/BannerAd';
import AppText from '../components/AppText';
import AppButton from '../components/buttons/AppButton';
import PostItem from '../components/items/PostItem';
import colors from '../config/colors';
import useApi from '../hooks/useApi';

function CreatorPostFeed({ navigation, route }) {
  const userID= route.params;
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const flatListRef = useRef(null);

  

  const { t } = useTranslation('postfeed');

  const { data: posts, error, loading, request: loadPosts } = useApi(() => postsApi.getLatestUserPosts(userID, page));

  const scrollToTop = () => {
    flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    handleRefresh();
  };

  const renderItem = ({ item, index }) => {
    if (!item) return null; // Guard against undefined item
    else if ((index + 1) % 5 === 0) {
      return <BannerAdComponent style={styles.adCard} />;
    } else {
      return <PostItem item={item} index={index} navigation={navigation} />;
    }
  };

  useEffect(() => {
    loadPosts();
  }, [page]);

  useEffect(() => {
    if (posts && posts.posts) {
      setAllPosts((prevPosts) => (page === 1 ? posts.posts : [...prevPosts, ...posts.posts]));
    }
  }, [posts]);

  const handleRefresh = () => {
    setPage(1);
    setAllPosts([]);
    loadPosts();
  };

  return (
    <View style={styles.screen}>
      <ActivityIndicator visible={loading} />
      {error && (
        <>
          <AppText style={styles.errorText}>{t('errorText')}</AppText>
          <AppButton title={t('retryButton')} onPress={loadPosts} />
        </>
      )}
      <FlatList
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        ref={flatListRef}
        data={allPosts}
        keyExtractor={(item, index) => (item ? item.post.id.toString() + index : index.toString())}
        renderItem={renderItem}
        onEndReachedThreshold={0.2}
        onEndReached={() => setPage((prevPage) => prevPage + 1)}
        refreshing={loading}
        onRefresh={handleRefresh}
      />
      <TouchableOpacity style={styles.scrollToTopButton} onPress={scrollToTop}>
        <AppText style={styles.scrollToTopText}>Top</AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.primary,
  },
  errorText: {
    color: colors.white,
    textAlign: 'center',
  },
  adCard: {
    marginHorizontal: 10,
    marginBottom: 10,
    alignSelf: 'center',
    width: 300,
    height: 150,
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 25,
  },
  scrollToTopText: {
    color: colors.white,
  },
});

export default CreatorPostFeed;
