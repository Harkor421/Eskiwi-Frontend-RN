import React, { useEffect, useState, useRef } from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import { useTranslation } from 'react-i18next';
import useApi from '../hooks/useApi';
import colors from '../config/colors';
import PostItem from '../components/items/PostItem';
import HorizontalCreatorList from '../components/HorizontalCreatorList';
import postsApi from '../api/posts';
import Comments from './Comments';
import AppText from '../components/AppText';
import { GemButton } from '../components/buttons';

function PostFeed({ navigation }) {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const flatListRef = useRef(null);
  const [selectedPost, setSelectedPost] = useState(null); 
  const bottomSheetRef = useRef(null);

  const { data, error, loading, request: loadPosts } = useApi(() => postsApi.getRecommendedUserPosts(page));

  useEffect(() => {
    loadPosts();
  }, [page]);

  useEffect(() => {
    if (data && data.posts) {
      setPosts((prevPosts) => (page === 1 ? data.posts : [...prevPosts, ...data.posts]));
    }
  }, [data]);

  const handleRefresh = () => {
    setPage(1);
    setPosts([]);
  };

  const openComments = (post) => {
    setSelectedPost(post.post);

    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(0);
    }
  };

  const refreshPost = async () => {
    if (!selectedPost) return;
    const response = await postsApi.getPost(selectedPost.id);
    const updatedPost = response.data.posts[0].post;

    const postExists = posts.some(post => post.post.id === updatedPost.id);

    if (postExists) {
      setPosts((prevPosts) => 
        prevPosts.map(post => post.post.id === updatedPost.id ? { ...post, post: updatedPost } : post)
      );
    } else {
      console.log("Post not found in current state. Adding to the list.");
      setPosts(prevPosts => [...prevPosts, { post: updatedPost }]);
    }

    setSelectedPost(updatedPost);
  };

  const renderItem = ({ item }) => (
    <PostItem onCommentPress={() => openComments(item)} item={item} refreshPost={refreshPost} navigation={navigation} />
  );

  const EmptyList = () => (
    <View style={styles.emptyListContainer}>
      <AppText style={styles.emptyListText}>Estás al día!</AppText>
      <Image source = {require('../assets/ouch.png')} style = {{width: 100, height: 100}}/>
      <GemButton
      style={{marginTop: 20}}
      title={"Refrescar"}
      onPress={handleRefresh}
      />
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        ref={flatListRef}
        data={posts} 
        keyExtractor={(item) => item.post.id.toString()}
        renderItem={renderItem}
        onEndReachedThreshold={0.2}
        onEndReached={() => setPage(prevPage => prevPage + 1)}
        refreshing={loading}
        onRefresh={handleRefresh}
        ListHeaderComponent={<HorizontalCreatorList navigation={navigation} refresh={handleRefresh} />}
        ListEmptyComponent={EmptyList} // Display when no posts are available
      />
      {selectedPost && (
        <Comments
          postInformation={selectedPost}
          sheetRef={bottomSheetRef}
          navigation={navigation}
          refreshPost={refreshPost}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyListText: {
    color: colors.white,
    fontSize: 22,
    fontFamily: 'GeistMono-Bold',
    marginBottom: 20,
    textAlign: 'center',
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

export default PostFeed;
