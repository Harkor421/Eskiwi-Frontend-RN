import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, View } from 'react-native';
import postsApi from '../api/posts'; // Replace with your actual API utility for fetching posts
import AppText from '../components/AppText';
import PostItem from '../components/items/PostItem';
import Comments from './Comments'; // Import the Comments component
import colors from '../config/colors';

function UniquePostScreen({ route, navigation }) {
  const { id } = route.params; // Get the post ID from the route
  const [postData, setPostData] = useState(null); // State to store post data
  const [loading, setLoading] = useState(true);   // State to handle loading
  const [error, setError] = useState(false);      // State to handle errors
  const [selectedPost, setSelectedPost] = useState(null); 
  const bottomSheetRef = useRef(null); // Ref for the bottom sheet

  // Fetch post data based on the id when the component mounts
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        const response = await postsApi.getPost(id); // Call your API to get post by id
        if (response.ok) {
          setPostData(response.data.posts[0]); // Set the post data in state
        } else {
          setError(true); // Handle error if response fails
        }
      } catch (error) {
        console.error('Error fetching post data:', error);
        setError(true);
      } finally {
        setLoading(false); // Stop loading once the request completes
      }
    };

    fetchPostData();
  }, [id]); 

  // Function to refresh post data when needed (e.g., after adding a comment)
  const refreshPost = async () => {
    if (!selectedPost) return; 

    const response = await postsApi.getPost(selectedPost.id);
    const updatedPost = response.data.posts[0]; // Get the updated post

    if (updatedPost) {
      setPostData(updatedPost);
    }

  };

  // Open comment modal for the post
  const openComments = (post) => {
    setSelectedPost(post.post);

    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(1); // Open the bottom sheet when comments are clicked
    }
  };

  // Render function for each item in the list
  const renderItem = ({ item, index }) => (
    <PostItem
      item={item}
      index={index}
      refreshPost={refreshPost}
      navigation={navigation}
      onCommentPress={() => openComments(item)} // Handle comment press
    />
  );

  // Show loading indicator while data is being fetched
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.white} />
      </View>
    );
  }

  // Show error message if there's an issue with the API call
  if (error || !postData) {
    return (
      <View style={styles.errorContainer}>
        <Image source={require("../assets/ouch.png")} style={{ width: 150, height: 150 }} />
        <AppText style={styles.errorText}>Ouch!</AppText>
        <AppText style={styles.errorText2}>Parece ser que esta publicación ya no existe.</AppText>
      </View>
    );
  }

  // Once data is fetched, display the post content
  return (
    <View style={styles.container}>
      <FlatList
        data={[postData]} // Wrapping postData in an array for FlatList
        keyExtractor={(item) => item.post.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      {selectedPost && (
        <Comments
          postInformation={postData.post}
          sheetRef={bottomSheetRef}
          navigation={navigation}
          refreshPost={refreshPost} // Pass the refresh function
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  errorText: {
    marginTop: 10,
    color: colors.white,
    fontSize: 30,
    fontFamily: 'GeistMono-Bold',
  },
  errorText2: {
    marginTop: 10,
    color: colors.white,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
    fontFamily: 'GeistMono-Regular',
  },
});

export default UniquePostScreen;
