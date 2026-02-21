import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AppText from '../AppText';
import colors from '../../config/colors';
import FastImage from 'react-native-fast-image';
import { isValidImageUrl } from '../../utils/isValidImage';


function ListItem({ 
  title, 
  subTitle, 
  avatar, 
  navigate, 
  avatarSize = 48,
  titleStyle = {},  
  subTitleStyle = {},
  interactions = null // New prop for interactions
}) {


  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.avatarContainer, { width: avatarSize, height: avatarSize }]}
        onPress={navigate}
      >
          <FastImage
            style={[styles.image, { width: avatarSize, height: avatarSize }]}
            source={avatar}
            defaultSource={require("../../assets/default-profile-icon.png")}
          />
      </TouchableOpacity>
      <View style={styles.userInfo}>
        <AppText style={[styles.user, titleStyle]} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </AppText>
        <View style={styles.usernameContainer}>
          {interactions ? (
            // Render different content based on interactions
            <View style={styles.interactionsContainer}>
              <Image 
                style={[styles.icon, { tintColor: '#7A7A83' }]} 
                source={require('../../assets/Like-icon.png')}
              />
              <AppText style={styles.interactionsText}>{interactions.likes}</AppText>

              <Image 
                style={[styles.icon, { tintColor: '#7A7A83' , marginLeft: 10 }]} 
                source={require('../../assets/coments.png')}
              />
              <AppText style={styles.interactionsText}>{interactions.comments}</AppText>

              <Image 
                style={[styles.icon, { tintColor: '#7A7A83' , marginLeft: 10 }]} 
                source={require('../../assets/diagonal-right-arrow.png')}
              />
              <AppText style={styles.interactionsText}>{interactions.shares}</AppText>

              <Image 
                style={[styles.icon, { tintColor: '#7A7A83' , marginLeft: 10 }]} 
                source={require('../../assets/save-icon.png')}
              />
              <AppText style={styles.interactionsText}>{interactions.saves}</AppText>
            </View>
          ) : (
            <AppText style={[styles.subTitle, subTitleStyle]} numberOfLines={1} ellipsizeMode="tail">
              {subTitle}
            </AppText>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  avatarContainer: {
    marginRight: 10, 
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.black,
  },
  user: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 500,
  },
  subTitle: {
    color: '#7A7A83',
    fontSize: 14,
    fontWeight: 500,
   },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  interactionsText: {
    color: '#7A7A83',
    fontSize: 13,
    marginLeft: 5, 
    marginRight: 5,
  },
  icon: {
    width: 15,
    height: 15,
  },
});

export default ListItem;
