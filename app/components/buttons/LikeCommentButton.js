import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import postsApi from '../../api/posts';
import BlackButton from './BlackButton';

function LikeCommentButton({ commentLikes, setCommentLikes, comment_id }) {
  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(commentLikes || 0);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await postsApi.getCommentLike(comment_id);
        setLiked(response.data.liked);
        // Update local likes based on the fetched status
        if (response.data.liked) {
          setLocalLikes(commentLikes + 1); // Increment if liked
        } else {
          setLocalLikes(commentLikes); // Maintain the same if not liked
        }
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    fetchLikeStatus();
  }, [comment_id, commentLikes]);

  const handleLikePress = async () => {
    try {
      if (liked) {
        // Unlike the comment
        await postsApi.unlikeComment(comment_id);
        setLocalLikes(prevLikes => prevLikes - 1); // Decrement local likes
      } else {
        // Like the comment
        await postsApi.likeComment(comment_id);
        setLocalLikes(prevLikes => prevLikes + 1); // Increment local likes
      }
      // Toggle liked state
      setLiked(prevLiked => !prevLiked);
      // Add haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      // Sync the new like count back to parent
      setCommentLikes(prevLikes => liked ? prevLikes - 1 : prevLikes + 1); // Sync back to parent state
    } catch (error) {
      console.error('Error liking/unliking comment:', error);
      // Optionally, handle errors
    }
  };

  return (
    <BlackButton
      style={styles.likeButton}
      icon={
        liked
          ? require("../../assets/fav-icon-red.png")
          : require("../../assets/fav-icon.png")
      }
      onPress={handleLikePress}
    />
  );
}

const styles = StyleSheet.create({
  likeButton: {
    alignSelf: 'center',
    marginTop: 20,
    right: "1.2%",
  },
});

export default LikeCommentButton;
