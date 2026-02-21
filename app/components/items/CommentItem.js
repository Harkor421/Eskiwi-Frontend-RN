import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import postsApi from '../../api/posts';
import colors from '../../config/colors';
import useTimeAgo from '../../hooks/useTimeAgo';
import routes from '../../navigation/routes';
import AppText from '../AppText';
import { LikeCommentButton } from '../buttons';
import { ReportModal } from '../modals';
import GemItem from './GemItem';
import ListItem from './ListItem';
import ReplyItem from './ReplyItem';

function CommentItem({ title, avatar, date, replyAmount, commentText, navigation, user, comment, isAdmin, onReply, reload }) {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReplies, setShowReplies] = useState(replyAmount > 0);
  const [visibleReplies, setVisibleReplies] = useState(3);
  const [replies, setReplies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreReplies, setHasMoreReplies] = useState(true);
  const elapsedTime = useTimeAgo(date);
  const [commentLikes, setCommentLikes] = useState(parseInt(comment.likes))



  const handleModalOpen = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
    if (!showReplies) {
      fetchReplies(); // Fetch replies when first showing
    }
  };

  const loadMoreReplies = () => {
    if (hasMoreReplies) {
      setCurrentPage(prevPage => prevPage + 1); // Increment page number
      setVisibleReplies(prevVisible => prevVisible + 3); // Update the visible replies count
    }
  };
  
  // Refactor the fetchReplies function to use the current page from state directly
  const fetchReplies = async (page) => {
    try {
      const response = await postsApi.getReplies(comment.id, page);
      const newReplies = response.data.replies || [];
      setReplies(prevReplies => [...prevReplies, ...newReplies]);
      setHasMoreReplies(newReplies.length >= 3); // Update based on API response
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };
  
  // Update useEffect to call fetchReplies based on the current page
  useEffect(() => {
    if (showReplies) {
      fetchReplies(currentPage);
    }
  }, [showReplies, currentPage]);
  
  const handleReply = () => {
    onReply(comment);
  };

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <View style={styles.listItemContainer}>
          <ListItem
            title={title}
            subTitle={elapsedTime}
            avatar={avatar}
            subTitleStyle={{fontSize: 12}}
            showVerified={true}
            navigate={() => {
              navigation.navigate(routes.CREATOR_DETAILS, user);
            }}
          />
        </View>
        <View style={styles.followButtonContainer}>
          {comment.gems > 0 && <GemItem gems={comment.gems} />}
        </View>
      </View>
      <View style={styles.commentContainer}>
        <View style={styles.commentRow}>
          <LikeCommentButton commentlikes = {commentLikes} setCommentLikes = {setCommentLikes} comment_id={comment.id}/>
          <View style={styles.textContainer}>
            <AppText style={styles.text} numberOfLines={isExpanded ? undefined : 1} ellipsizeMode="tail">
              {commentText}
            </AppText>
            <View style={styles.commentInteractions}>
            {commentText.length > 60 && (
                <TouchableOpacity onPress={toggleExpanded}>
                  <AppText style={styles.viewMore}>
                    {isExpanded ? t('commentItem.viewLess') : t('commentItem.viewMore')}
                  </AppText>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={handleReply}>
                <AppText style={styles.replyText}>{t('commentItem.reply')}</AppText>
              </TouchableOpacity>
              <AppText style={styles.likesText}>{t('commentItem.likes', { count: commentLikes })}</AppText>
              {isAdmin && (
                <TouchableOpacity onPress={handleModalOpen}>
                  <AppText style={styles.hideText}>{t('commentItem.hide')}</AppText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
      {replyAmount > 0 && (
        <TouchableOpacity onPress={toggleReplies}>
          <AppText style={styles.viewReplies}>
            {showReplies ? t('commentItem.hideReplies', { count: replyAmount }) : t('commentItem.viewReplies', { count: replyAmount })}
          </AppText>
        </TouchableOpacity>
      )}
      {showReplies && (
        <>
          <FlatList
            data={replies.slice(0, visibleReplies)}
            renderItem={({ item }) => <ReplyItem navigation={navigation} reply={item} />}
            keyExtractor={(item, index) => index.toString()}
          />
          {hasMoreReplies && (
            <TouchableOpacity onPress={loadMoreReplies}>
              <AppText style={styles.loadMoreReplies}>{t('commentItem.viewMoreReplies')}</AppText>
            </TouchableOpacity>
          )}
        </>
      )}
      <ReportModal modalVisible={modalVisible} onRequestClose={handleModalClose} comment={comment} comment_creator = {user} reload={reload} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    borderBottomColor: colors.terciary,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gemButton: {
    marginBottom: "5%",
    borderRadius: 30,
  },
  commentContainer: {
    marginBottom: 10,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: "1.1%",
  },
  textContainer: {
    flex: 1,
    flexShrink: 1,
    marginTop: 20,
  },
  text: {
    color: colors.white,
    marginLeft: 15,
    fontSize: 14,
  },
  replyText: {
    color: "#7A7A83",
    fontSize: 12,
  },
  viewMore: {
    color: "#7A7A83",
    fontSize: 12,
    textDecorationLine: 'underline',
    marginRight: 15,
  },
  likesText: {
    color: "#7A7A83",
    fontSize: 12,
    marginLeft: 15,
    textAlign: 'left',
  },
  hideText: {
    color: "#7A7A83",
    fontSize: 12,
    marginLeft: 15,
    textAlign: 'left',
  },
  viewReplies: {
    marginLeft: "19%",
    color: "#7A7A83",
    fontSize: 12,
    marginBottom: 15,
    textAlign: 'left',
  },
  loadMoreReplies: {
    color: "#7A7A83",
    fontSize: 12,
    marginVertical: 8,
    textAlign: 'left',
    marginLeft: "20%",
    marginBottom: 20,
  },
  followButtonContainer: {
    alignItems: 'flex-end',
    flex: 1,
  },
  listItemContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 15,
  },
  commentInteractions: {
    flexDirection: 'row',
    marginLeft: 15,
    marginTop: 10,
  },
});

export default CommentItem;
