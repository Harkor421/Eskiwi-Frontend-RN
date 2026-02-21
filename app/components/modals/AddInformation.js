import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import colors from '../../config/colors';
import { MAXIMUM_POST_DESCRIPTION_LENGTH, MAXIMUM_POST_TITLE_LENGTH } from '../../config/constants';
import AppText from '../AppText';
import { BlackButton, GemButton } from '../buttons';
import CustomTextInput from '../CustomTextInput';
import { useTranslation } from 'react-i18next';

const AddInformation = forwardRef(({ modalVisible, onRequestClose, onAddInfo }, ref) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const {t} = useTranslation();

  useImperativeHandle(ref, () => ({
    getTitle: () => title,
    getDescription: () => description,
    clearFields: () => {
      setTitle('');
      setDescription('');
    }
  }));

  const handleSend = () => {
    onAddInfo({ title, description });
    onRequestClose();
  };

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
                iconPosition={"right"}
                onPress={() => {/* Add desired action here */}}
              />
              <AppText style={styles.headerTitle}>{t("addInformation.title")}</AppText>
            </View>
            <TouchableOpacity onPress={onRequestClose}>
              <Image source={require('../../assets/close-icon.png')} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
          <View style = {{flexDirection: 'row'}}>
            <AppText style={styles.subTitle}>{t("addInformation.title2")}</AppText>
          </View>
          <CustomTextInput
            placeholder={t("addInformation.yourTitle")}
            value={title}
            onChangeText={setTitle}
            multiline={false}
            style={styles.input}
            maxCharacters={MAXIMUM_POST_TITLE_LENGTH}
          />
          
          <AppText style={styles.subTitle}>{t("addInformation.description")}</AppText>
          <CustomTextInput
            placeholder={t("addInformation.yourDescription")}
            value={description}
            onChangeText={setDescription}
            multiline={false}
            icon={require("../../assets/chat-icon.png")}
            style={styles.input2}
            maxCharacters={MAXIMUM_POST_DESCRIPTION_LENGTH}
          />

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <GemButton 
              style={styles.sendCommentButton} 
              title={t("saveChanges")}
              onPress={handleSend}
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
});

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
    paddingHorizontal: 10,
    justifyContent: 'space-between',
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
  subTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.white,
    marginVertical: 12,
    paddingHorizontal: 10,
  },
  input: {
    borderRadius: 5,
    backgroundColor: colors.terciary,
    paddingHorizontal: 10,
    height: 40,
    marginHorizontal: 10,
  },
  input2: {
    borderRadius: 5,
    backgroundColor: colors.terciary,
    paddingHorizontal: 10,
    height: 60,
    marginHorizontal: 10,
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

export default AddInformation;
