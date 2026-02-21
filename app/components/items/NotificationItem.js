import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import colors from '../../config/colors';
import routes from '../../navigation/routes';
import AppText from '../AppText';
import { GemButton } from '../buttons';
import ListItem from './ListItem';

function NotificationItem({ notification, navigation }) {
  const { t } = useTranslation();

  // Function to return the notification icon based on the notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'newPost':
        return require("../../assets/edit-icon.png"); // Icon for new post
      case 'Like':
        return require("../../assets/fav-icon.png"); // Icon for likes
      case 'Follow':
        return require("../../assets/profile-icon.png"); // Icon for new followers
      case 'Comment':
        return require("../../assets/chat-icon.png"); // Icon for comments
      default:
        return require("../../assets/default-profile-icon.png"); // Default icon
    }
  };

  // Function to return the notification text based on the notification type
  const getNotificationText = (type) => {
    switch (type) {
      case 'newPost':
        return t('notification.newPost');
      case 'Like':
        return t('notification.newLike');
      case 'Follow':
        return t('notification.newFollow');
      case 'Comment':
        return t('notification.newComment');
      default:
        return t('notification.unknown');
    }
  };

  // Function to determine the button text based on the notification type
  const getButtonText = (type) => {
    switch (type) {
      case 'newPost':
        return t('notification.viewPost');
      case 'Like':
        return t('notification.viewLike');
      case 'Comment':
        return t('notification.viewComment');
      case 'Follow':
        return t('notification.viewProfile');
      default:
        return t('notification.viewDetails');
    }
  };

   // Conditionally set the avatar based on the notification type
   const avatarUri =
   notification.type === 'Like' || notification.type === 'Comment' || notification.type === 'Follow'
     ? notification.user.avatarUri // Show user's avatar for Like and Comment notifications
     : notification.post?.content[0]; // Show post's image for other types

  // Conditionally provide interactions only for post-related notifications
  const shouldShowPostInteractions = ['newPost'].includes(notification.type);
  
  const subTitle =
  notification.type === 'Comment'
    ? notification.comment.text // Show comment text for Comment notifications
    : notification.type === 'Follow'
    ? notification.user.description // Show user description for Follow notifications
    : notification.post?.description; // Show post description for other types

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {/* Use the dynamic icon */}
        <Image
          style={styles.notiIcon}
          source={getNotificationIcon(notification.type)}
        />
      </View>
      <View style={styles.notificationContainer}>
        <View style={styles.userHeader}>
          <View style={styles.userHeaderInside}>
            <AppText style={styles.username}>{`@${notification.user.username}`}</AppText>
            <AppText style={styles.notiTypeText}>{getNotificationText(notification.type)}</AppText>
          </View>
          <View style={{ alignItems: 'flex-end', flex: 1, marginLeft: 15 }}>
            {/* Show button with dynamic text */}
            <GemButton
            title={getButtonText(notification.type)}
            onPress={() => {
              if (notification.type === 'Follow') {
                // Navigate to Creator Details if it's a follow notification
                navigation.navigate(routes.CREATOR_DETAILS, notification.user);
              } else {
                // Navigate to the post for other notification types
                navigation.navigate("UniquePost", { id: notification.post.id });
              }
            }}
          />
          </View>
        </View>
        <View style={styles.userContainer}>
        <ListItem
            title={notification.type === 'Comment' || notification.type === 'newPost' ? notification.post?.title : notification.user.displayName}
            subTitle={subTitle} 
            avatar={{ uri: avatarUri }}
            interactions={shouldShowPostInteractions ? notification.post : null}
            showVerified={true}
            navigate={() => {
              navigation.navigate(routes.CREATOR_DETAILS, notification.user);
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#27272A',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.terciary
  },
  iconContainer:{
    flex: 1,
    marginTop: "2.5%",
    alignItems: 'center',
    justifyContent: ' center',
    marginHorizontal: 10,
  },
  notiIcon:{
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },
  notificationContainer: {
    flexDirection: 'column', 
    paddingHorizontal: 20,
  },
  userHeader:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  userHeaderInside:{
    flexDirection: 'column',
  },
  username:{
    color: colors.white,
    fontWeight: 400,
    fontSize: 14,
  },
  notiTypeText:{
    color: '#7A7A83',
    fontSize: 12,
    fontWeight: 600,
  },    
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.terciary,
    padding: 10,
    borderRadius: 15
  },

});
export default NotificationItem;
