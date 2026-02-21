import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../config/colors';
import useTimeAgo from '../../hooks/useTimeAgo';
import routes from '../../navigation/routes';
import AppText from '../AppText';
import ListItem from './ListItem';

function ReplyItem({ reply, navigation }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const elapsedTime = useTimeAgo(reply.reply.createdAt);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.replyContainer}>
      <View style={styles.listItemContainer}>
          <ListItem
            title={reply.user.username}
            subTitle={`${elapsedTime}`}
            avatar={{uri: reply.user.avatarUri}}
            avatarSize={35}
            subTitleStyle={{fontSize: 10}}
            showVerified={true}
            navigate={() => {
              navigation.navigate(routes.CREATOR_DETAILS, reply.user);
            }}
          />
        </View>
      <AppText style={styles.replyText} numberOfLines={isExpanded ? undefined : 3} ellipsizeMode="tail">
        {reply.reply.text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  replyContainer: {
    marginVertical: 4,
    marginLeft: "17%",
    padding: 10,
  },
  replyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  replyUser: {
    color: colors.white,
    fontWeight: '500',
  },
  replyTime: {
    color: '#7A7A83',
  },
  replyText: {
    color: colors.white,
    marginTop: 5,
    fontSize: 14,
  },
  replyInteractions: {
    flexDirection: 'row',
    marginTop: 5,
  },
  listItemContainer:{
    marginBottom: 10,
  },
  viewMore: {
    color: '#7A7A83',
    textDecorationLine: 'underline',
  },
});

export default ReplyItem;
