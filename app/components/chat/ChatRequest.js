import React, { useState } from 'react';
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import colors from '../../config/colors'; // Ensure this file exists or replace with your color definitions
import AppText from '../AppText';
import { BlackButton, GemButton } from '../buttons';
import CustomTextInput from '../CustomTextInput';

const ChatRequest = ({ modalVisible, onRequestClose}) => {
  const [gemCount, setGemCount] = useState('');


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <GemButton 
                style={styles.rightGemButton} 
                icon={require("../../assets/gem-fill-icon.png")}
                onPress={() => {/* Add desired action here */}}
              />
              <AppText style={styles.headerTitle}>Add Gems</AppText>
            </View>
            <TouchableOpacity onPress={onRequestClose}>
              <Image source={require('../../assets/close-icon.png')} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
          <AppText style={styles.body}>Add gems to your favourite creators</AppText>

          <AppText style={styles.subTitle}>Add gems</AppText>
          <CustomTextInput
            placeholder={"Ex: 100 gems"} // Use translation key
            onSubmitEditing={() => console.log('Submitted!')}
            multiline={false}
            style={styles.input}
          />
          
          <AppText style={styles.subTitle}>Comment</AppText>
          <CustomTextInput
            placeholder={"Tu comentario"} // Use translation key
            onSubmitEditing={() => console.log('Submitted!')}
            multiline={false}
            style={styles.input}
          />

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <GemButton 
              style={styles.sendCommentButton} 
              title={"Send comment"}
              onPress={() => {/* Add desired action here */}}
            />  
            <BlackButton
              style={styles.cancelButton} 
              title={"Cancel"}
              onPress={onRequestClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: "85%",
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10, // Added horizontal padding
    justifyContent: 'space-between', // Distribute space between elements
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  headerTitle: {
    fontSize: 18,
    marginLeft: 10,
    color: colors.white,
    fontFamily: 'GeistMono-Bold',
  },
  body: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A1A1AA',
    marginVertical: 20,
    paddingHorizontal: 10, // Added horizontal padding
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.white,
    marginVertical: 12,
    paddingHorizontal: 10, // Added horizontal padding
  },
  input: {
    borderRadius: 5,
    backgroundColor: colors.terciary,
    paddingHorizontal: 10,
    height: 40,
    marginHorizontal: 10, // Added horizontal margin
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    borderTopColor: colors.terciary,
    borderTopWidth: 1,
    marginBottom: 20,
  },

  sendCommentButton: {
    width: "90%",
    padding: "3%", 
    marginVertical: 15,
  },
  cancelButton: {
    width: "90%",
    padding: "3%", 
  },
});

export default ChatRequest;
