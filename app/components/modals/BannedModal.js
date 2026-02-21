import React from 'react';
import { Image, Modal, StyleSheet, View } from 'react-native';
import colors from '../../config/colors'; // Ensure this file exists or replace with your color definitions
import AppText from '../AppText';
import { DeleteButton } from '../buttons';

const BannedModal = ({ modalVisible, onRequestClose, title, buttonText }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
            <Image style = {styles.icon}source = {require("../../assets/ban-hammer-icon.png")}/>
            <AppText style={styles.title}>{"Lo sentimos"}</AppText>
            <AppText style={styles.successText}>{title}</AppText>
            <DeleteButton
            style = {styles.button}
            title={buttonText}
            onPress={onRequestClose}
            />
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
  icon:{
    width: 50,
    height: 50,
  },
  modalView: {
    width: '85%',
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: colors.white,
    fontFamily: 'GeistMono-Bold',
  },
  successText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 12,
    color: colors.white,
  },
  button:{
    marginTop: 20,
    padding: 10,
  },
});

export default BannedModal;
