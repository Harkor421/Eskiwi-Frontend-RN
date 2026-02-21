import React, { useContext, useState } from 'react';
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import AuthContext from '../../auth/context';
import colors from '../../config/colors';
import AppText from '../AppText';
import { BlackButton, GemButton } from '../buttons';
import CustomTextInput from '../CustomTextInput';
import useToastMessage from '../../hooks/useToastMessage'
import { useTranslation } from 'react-i18next';

const EditInformationModal = ({ 
  modalVisible, 
  onRequestClose, 
  title, 
  buttonText, 
  currentInfo, // Generalized current value (e.g., description or username)
  apiCall,     // Pass the API function (e.g., updateDescription, updateUsername)
  inputLabel,   // Label for the input field
  maxCharacters,
}) => {
  const [info, setInfo] = useState(currentInfo); // Generalized state
  const { updateUser } = useContext(AuthContext);
  const {showError, showSuccess} = useToastMessage();
  const {t} = useTranslation();
  
  const handleSave = async () => {
    const response = await apiCall(info);  // Use the passed API function
    console.log(response);
    if (response.ok) {
      showSuccess("Se guardaron los cambios correctamente.", "¡Un éxito!")
      updateUser();
      onRequestClose();
    }else
    {
      showError(response.data.error, "Error")
    }
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
                onPress={() => {}}
              />
              <AppText style={styles.headerTitle}>{title || "Edit Information"}</AppText>
            </View>
            <TouchableOpacity onPress={onRequestClose}>
              <Image source={require('../../assets/close-icon.png')} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>

          {/* Input Field */}
          <AppText style={styles.subTitle}>{inputLabel}</AppText>
          <CustomTextInput
            placeholder={currentInfo} // Display the current information as a placeholder
            onChangeText={setInfo}
            value={info}
            multiline={false}
            maxCharacters={maxCharacters}
            style={styles.input}
          />

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <GemButton 
              style={styles.sendCommentButton} 
              title={buttonText || "Save"}
              onPress={handleSave}
            />  
            <BlackButton
              style={styles.cancelButton} 
              title="Cancel"
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
    fontSize: 14,
    marginLeft: 10,
    color: colors.white,
    fontFamily: 'GeistMono-Bold',
  },
  subTitle: {
    fontSize: 14,
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
    color: colors.white,
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

export default EditInformationModal;
