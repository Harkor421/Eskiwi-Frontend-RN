import * as Haptics from 'expo-haptics';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import postsApi from '../api/posts';
import AppText from '../components/AppText';
import CustomTextInput from '../components/CustomTextInput';
import BannerAdComponent from '../components/ads/BannerAd';
import { BlackButton, GemButton } from '../components/buttons';
import { CommentItem } from '../components/items';
import AddGemsModal from '../components/modals/AddGemsModal';
import { Interactions } from '../components/post';
import colors from '../config/colors';
import { MAXIMUM_COMMENT_LENGTH } from '../config/constants';
import useApi from '../hooks/useApi';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useHaptics } from '../hooks/useHaptics';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop, BottomSheetFlatList} from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native'; 

function Comments({ navigation, sheetRef, postInformation, refreshPost }) {
  const { t } = useTranslation();
  const [comment, setComment] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const [gems, setGems] = useState(0);
  const [selectedComment, setSelectedComment] = useState(null);
  const [page, setPage] = useState(1);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true); 
  const explosionRef = useRef(null);
  const { triggerLongHaptic } = useHaptics();


  // Initialize comments with default empty array
  const { data, error, commentsloading, request: loadComments } = useApi(() => postsApi.getComments(postInformation.id, page));
  const isFocused = useIsFocused(); // Check if the screen is focused

  useEffect(() => {
    
      setComments([]); 
      setPage(1);
      loadComments();
  }, [postInformation]);
  
  useEffect(() => {
    // Manage tab bar visibility based on isFocused and isBottomSheetOpen
    if (isFocused && isBottomSheetOpen) {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'flex', borderTopColor: colors.terciary, borderTopWidth: 2 },
      });
    }
  }, [isFocused, isBottomSheetOpen]); // Listen to changes in both states

  // Fetch comments when data changes
  useEffect(() => {
    if (data && data.comments) {
      setComments((prevComments) => (page === 1 ? data.comments : [...prevComments, ...data.comments]));
  
      // Calculate if there are more pages by checking the total comments and the length of loaded comments
      if (data.totalComments && comments.length + data.comments.length >= data.totalComments) {
        setHasNextPage(false);  // No more pages to load
      } else {
        setHasNextPage(true);  // More pages available
      }
  
      setLoading(false);
    }
  }, [data]);
  

  // Load comments when the page changes
  useEffect(() => {
    if (hasNextPage) {
      loadComments();
    }
  }, [page]);

  const handleLoadMore = () => {

    if (!loading && hasNextPage) {
      setLoading(true);
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleAddGems = (count) => {
    setGems(gems + parseInt(count, 10));
  };

  const handleSubmitComment = async () => {
    if (comment.trim() === '') return;

    if (comment.length > MAXIMUM_COMMENT_LENGTH) {
      setError('Comment cannot exceed 160 characters.');
      return;
    }

    try {
      await postsApi.postComment(postInformation.id, comment, 0);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)

      setComment('');
      refreshPost();
      Keyboard.dismiss(); // Close the keyboard
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };

  const handleReplyComment = async () => {
    if (comment.trim() === '') return;

    if (comment.length > MAXIMUM_COMMENT_LENGTH) {
      return;
    }

    try {
      if (selectedComment) {
        // Reply to an existing comment
        await postsApi.replyToComment({ comment_id: selectedComment.id, text: comment });
        setSelectedComment(null); // Unselect the comment after replying
      } else {
        // Submit a new comment
        await handleSubmitComment();
      }
      setComment('');
      refreshPost();

      Keyboard.dismiss(); // Close the keyboard
    } catch (error) {
      console.error('Failed to submit comment or reply:', error);
    }
  };

  const handleReply = (comment) => {
    setSelectedComment(comment); // Update the selected comment
  };

  const onGemDonationSuccess = () => {
    explosionRef.current.start();
    triggerLongHaptic();
    setComments([]);
    setPage(1);
    loadComments();
    refreshPost();
  };

  const handleCloseSelectedComment = () => {
    setSelectedComment(null); 
  };

  const renderItem = ({ item, index }) => {
    if (!item) return null;
    if ((index + 1) % 5 === 0) {
      return <BannerAdComponent style={styles.adCard} />;
    }
    return (
      <CommentItem
        title={item.user.username}
        commentText={item.comment.text}
        date={item.comment.createdAt}
        avatar={{ uri: item.user.avatarUri }}
        likeAmount={item.comment.likes}
        replyAmount={item.comment.replies}
        navigation={navigation}
        user={item.user}
        comment={item.comment}
        isAdmin={true}
        onReply={handleReply}
        reload={loadComments}
      />
    );
  };
  const HandleComponent = useCallback(() => (
    <View style={styles.interactionContainer}>
      <Interactions post={postInformation} navigation={navigation} refreshPost={refreshPost} />
    </View>
  ), [postInformation, navigation, refreshPost]); // Add dependencies here

  
  return (
    <BottomSheet 
      ref={sheetRef} snapPoints={['50%', '95%']} onChange={(index) => {
        // Hide or show tab bar based on sheet position
        const isOpen = index >= 0; 
        setIsBottomSheetOpen(isOpen); 

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      enablePanDownToClose={true}
      handleComponent={HandleComponent}
      backgroundStyle= {{backgroundColor: colors.secondary}}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          opacity={0.6} 
          appearsOnIndex={0} 
          disappearsOnIndex={-1} 

        />
      )}
    > 
      <BottomSheetView style={styles.container}>
        {!modalVisible && (
            <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.select({  android: 100})}
        >
            <ConfettiCannon
              count={100}
              fallSpeed={5000}
              fadeOut
              origin={{ x: 0, y: -50 }}
              autoStart={false}
              ref={explosionRef}
            />
              <BottomSheetFlatList
              data={comments}
              keyExtractor={(item) => item.comment.id.toString()}
              renderItem={renderItem}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              refreshing={loading}
              onRefresh={() => {
                setComments([]);
                setPage(1); 
              }}
              ListFooterComponent={commentsloading ? <ActivityIndicator size="50%" style = {{marginTop: 20,}} color={colors.white} /> : null} // Show loading indicator at the bottom
            />
            <View style={styles.buttonContainer}>
              <GemButton
                title={t('comments.sendGems')}
                style={styles.sendGemButton}
                icon={require('../assets/gem-fill-icon.png')}
                iconPosition="left"
                onPress={() => setModalVisible(true)}
              />
            </View>
            {selectedComment && (
              <View style={styles.replyComment}>
                <Image style={styles.replyIcon} source={require('../assets/coments.png')} />
                <AppText numberOfLines={1} ellipsizeMode="tail" style={styles.replyText}>
                  {selectedComment.text}
                </AppText>
                <TouchableOpacity onPress={handleCloseSelectedComment}>
                  <Image source={require('../assets/close-icon.png')} style={styles.closeIcon} />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.inputContainer}>
              <CustomTextInput
                placeholder={t('comments.writeComment')}
                onSubmitEditing={handleReplyComment}  // Use handleReplyComment here
                multiline
                style={styles.input}
                value={comment}
                maxCharacters={MAXIMUM_COMMENT_LENGTH}
                onChangeText={setComment}
                useBottomSheet={true}
              />
              <BlackButton
                style={styles.sendCommentButton}
                icon={require('../assets/diagonal-right-arrow.png')}
                onPress={handleReplyComment}  // Use handleReplyComment here
              />
            </View>
          </KeyboardAvoidingView>
        )}
              <AddGemsModal
                modalVisible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                onAddGems={handleAddGems}
                commentContent={comment}
                post={postInformation}
                onSuccess={onGemDonationSuccess}
              />
      </BottomSheetView>
    </BottomSheet>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  interactionContainer:{
    backgroundColor: colors.primary,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  flatListContainer: {
    borderTopColor: colors.terciary,
    borderTopWidth: 1,
    backgroundColor: colors.secondary,
  },
  buttonContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.terciary,
    padding: 10,
    backgroundColor: colors.secondary,
    alignItems: 'center',
  },
  replyComment: {
    borderTopWidth: 1,
    borderTopColor: colors.terciary,
    padding: 10,
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyIcon: {
    marginRight: 10,
    height: 20,
    width: 20,
  },
  replyText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
    flex: 1, // Ensure the text takes available space
  },
  closeIcon: {
    height: 15,
    width: 15,
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.terciary,
    padding: 10,
    backgroundColor: colors.secondary,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: "100%",
    color: colors.white,
  },
  sendGemButton: {
    width: "95%",

  },
  sendCommentButton: {
    width: 48,
    height: 48,
    marginLeft: 10,
  },
  adCard: {
    alignItems: 'center',
    borderBottomColor: colors.terciary,
    borderBottomWidth: 1,
  },
  noCommentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    backgroundColor: colors.secondary,
  },
  noCommentsText: {
    color: colors.white,
    fontSize: 16,
  },

});

export default Comments;
