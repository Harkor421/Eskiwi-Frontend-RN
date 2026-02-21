import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../config/colors'; // Ensure this file exists or replace with your color definitions
import AppText from '../AppText';
import { BlackButton } from '../buttons';

const PostModerationModal = ({ modalVisible, onRequestClose }) => {
  const [visible, setVisible] = useState(modalVisible);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity of 0

  useEffect(() => {
    if (modalVisible) {
      setVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100, // Duration of fade-in animation
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100, // Duration of fade-out animation
        useNativeDriver: true,
      }).start(() => setVisible(false)); // Hide the modal after fade-out
    }
  }, [modalVisible]);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none" // No default animation
      onRequestClose={onRequestClose}
    >
      <TouchableOpacity
        style={styles.modalContainer}
        onPress={onRequestClose} // Close modal on touch outside
      >
        <Animated.View style={[styles.modalView, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.moderationContainer}>
            <BlackButton icon={require('../../assets/flag-icon.png')} />
            <AppText style={styles.text}>Report this post</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moderationContainer}>
            <BlackButton icon={require('../../assets/trash-icon.png')} />
            <AppText style={styles.text}>Delete this post</AppText>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Position at the bottom
    alignItems: 'flex-end', // Align to the right
  },
  modalView: {
    width: '80%',
    backgroundColor: colors.terciary,
    borderRadius: 10,
    padding: 20,
    marginBottom: 30, // Add margin from the bottom
    marginRight: 20, // Add margin from the right
  },
  moderationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    fontFamily: 'GeistMono-Bold',
    fontSize: 14,
    color: '#7A7A83',
    marginLeft: 10,
  }
});

export default PostModerationModal;
