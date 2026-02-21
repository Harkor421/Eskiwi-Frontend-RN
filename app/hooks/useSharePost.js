import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Share } from 'react-native';
import postsApi from '../api/posts';
const useSharePost = (post) => {
  const {t} = useTranslation();

  const handleShare = useCallback(async () => {
    try {
      await postsApi.sharePost(post.id);
      const result = await Share.share({
        message: `${t('shareText')} exp+eskiwi://post/${post.id}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared via specific activity type
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      console.log(error)
    }
  }, [post]);

  return handleShare;
};

export default useSharePost;
