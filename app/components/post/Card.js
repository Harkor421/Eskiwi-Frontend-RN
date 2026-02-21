import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, View } from 'react-native';
import colors from '../../config/colors';
import routes from '../../navigation/routes';
import GemButton from '../buttons/GemButton';
import { ListItem } from '../items';
import Interactions from '../post/Interactions';
import PostDescription from './PostDescription';
import SwipeableImage from './SwipeableImage'; // Adjust the path as necessary

const { width } = Dimensions.get('window');

function Card({ onPress, user, post, navigation, isSubbed, onCommentPress, refreshPost}) {
    const {t} = useTranslation();
    const buttonTitle = post.gems === 0 ? t("card.donate") : `${post.gems}`;

    return (
        <View style={styles.card}>
            <View style={styles.userContainer}>
                <View style={styles.listItemContainer}>
                    <ListItem
                        title={user.displayName}
                        subTitle={"@" + user.username}
                        avatar={{ uri: user.avatarUri }}
                        showVerified={true}
                        creator={user}
                        navigate={() => {
                            navigation.navigate(routes.CREATOR_DETAILS, user);
                        }}
                    />
                </View>
                <View style={styles.followButtonContainer}>
                    <GemButton
                        style={styles.followButton}
                        title={buttonTitle}
                        onPress={()=>navigation.navigate("BuyGems")}
                    />
                </View>
            </View>
            <View style={styles.imageContainer} onPress={onPress}>
                <SwipeableImage images={post.content} isSubbed={isSubbed} tier={post.tier} creator={user} navigation={navigation}/>
            </View>
            <Interactions 
                navigation={navigation} 
                refreshPost={refreshPost}
                post={post}
                showComments={onCommentPress}
            />
            <PostDescription title={post.title} description={post.description} />
            
        </View>
    );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    marginBottom: 20,
    overflow: 'hidden',
  },
  imageContainer: {
    width: width,
    height: width, // maintain 1:1 aspect ratio
  },
  userContainer: {
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  followButtonContainer: {
    alignItems: 'flex-end',
    flex: 1,
  },
  followButton: {
    marginRight: "8%",
  },
  listItemContainer: {
    flex: 1,
    marginBottom: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});

export default Card;
