import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, View } from 'react-native';
import postsApi from '../../api/posts';
import colors from '../../config/colors'; // Ensure this file exists or replace with your color definitions
import AppText from '../AppText';
import { DeleteButton } from '../buttons';
import BlackButton from '../buttons/BlackButton'; // Import your BlackButton

const DeletePostModal = ({ modalVisible, onRequestClose, errorMessage, postID, navigation }) => {

  const {t} = useTranslation();

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
          </View>
          <AppText style={styles.body}>{errorMessage}</AppText>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <DeleteButton
              style={styles.retryButton}
              title={t("postManagement.deletePostConfirm")}
              onPress={async () => {
                const response = await postsApi.deletePost(postID);
                onRequestClose();        // Close the modal after retry
                navigation.goBack();    // Navigate back after timeout

                // Adding a timeout before navigation and closing the modal
                setTimeout(() => {
                  try{
                    navigation.goBack();    // Navigate back after timeout
                 }catch{

                 }
                }, 300);  // 1-second delay (1000ms)
              }}
            />
            <BlackButton
              style={styles.cancelButton}
              title={t("cancel")}
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
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  headerTitle: {
    fontSize: 18,
    color: colors.white,
    fontFamily: 'GeistMono-Bold',
  },
  body: {
    fontSize: 15,
    fontWeight: '500',
    color: '#A1A1AA',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  retryButton: {
    width: "90%",
    padding: "3%",
    marginBottom: 10,
  },
  cancelButton: {
    width: "90%",
    padding: "3%",
  },
});

export default DeletePostModal;
