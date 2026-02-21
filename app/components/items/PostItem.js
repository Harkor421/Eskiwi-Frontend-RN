import React from 'react';
import Card from '../post/Card';

function PostItem({ item, index, navigation, onCommentPress, refreshPost}) {
  // Destructuring the post object correctly
  const { user, post, subbed } = item;
  const uniqueKey =  + '-' + index;

  return (
    <Card
      key={uniqueKey}
      onCommentPress = {onCommentPress}
      user={user}
      post = {post}
      refreshPost={refreshPost}
      isSubbed = {subbed}
      navigation={navigation}
    />
  );
}

export default React.memo(PostItem);
