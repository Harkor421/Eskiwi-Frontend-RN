import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { Dimensions, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import api from '../../api/user';
import AuthContext from '../../auth/context';
import colors from '../../config/colors';
import useToastMessage from '../../hooks/useToastMessage';
import AppText from '../AppText';
import AppButton from '../buttons/AppButton';
import BlackButton from '../buttons/BlackButton';
import GemButton from '../buttons/GemButton';
import ErrorModal from '../modals/ErrorModal'; // Import the ErrorModal

const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1 MB in bytes

const UploadAvatar = ({ isVisible, onClose }) => {
  const [imageUri, setImageUri] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { updateUser } = useContext(AuthContext);
  const { t } = useTranslation(); // Initialize translation hook
  const { showError } = useToastMessage();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      let { uri, base64 } = result.assets[0];
      let fileInfo = await FileSystem.getInfoAsync(uri);

      let compressRatio = 0.8;
      while (fileInfo.size > MAX_IMAGE_SIZE) {
        try {
          const manipResult = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 1024 } }],
            { base64: true, compress: compressRatio }
          );

          uri = manipResult.uri;
          base64 = manipResult.base64;
          fileInfo = await FileSystem.getInfoAsync(uri);

          compressRatio -= 0.1;

          if (compressRatio < 0.1) {
            setErrorMessage(t('accountSettings.imageTooLarge'));
            setErrorVisible(true);
            return;
          }
        } catch (error) {
          setErrorMessage(t('accountSettings.compressionError') + error.message);
          setErrorVisible(true);
          return;
        }
      }

      setImageUri(uri);
      setImageBase64(base64);
    }
  };

  const handleUpload = async () => {
    if (!imageUri) return;

    try {
      const formData = new FormData();
      formData.append('avatar', {
        uri: imageUri,
        name: 'avatar.jpg',
        type: 'image/jpeg',
      });

      const response = await api.updateAvatar(formData);
      console.log(response);
      if (response.ok) {
        onClose();
        updateUser();
      } else {
        showError(t('accountSettings.uploadError') + (response.data?.message || t('accountSettings.unknownError')), "Error")
        setErrorVisible(true);
      }
    } catch (error) {
      setErrorMessage(t('accountSettings.uploadError') + error.message);
      setErrorVisible(true);
      console.error('Failed to upload image:', error);
    }
  };

  const handleCancel = () => {
    setImageUri(null);
    setImageBase64(null);
    onClose();
  };

  const windowWidth = Dimensions.get('window').width;
  const imageSize = windowWidth * 0.5;

  return (
    <>
      <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={handleCancel}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <GemButton
                  icon={require('../../assets/upload-icon.png')}
                />
                <AppText style={styles.headerTitle}>{t('accountSettings.uploadAvatarTitle')}</AppText>
              </View>
              <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={24} color={colors.white} />
              </TouchableOpacity>
            </View>

            <AppText style={styles.body}>{t('accountSettings.avatarText')}</AppText>

            <View style={[styles.imageContainer, { width: imageSize, height: imageSize }]}>
              {imageUri && (
                <FastImage source={{ uri: imageUri }} style={styles.image} />
              )}
            </View>

            <View style={styles.buttonContainer}>
              <AppButton
                title={imageUri ? t('accountSettings.updateAvatar') : t('accountSettings.selectImage')}
                style={styles.button}
                onPress={imageUri ? handleUpload : pickImage}
              />
              <BlackButton title={t('accountSettings.cancel')} onPress={handleCancel} style={styles.cancelButton} />
            </View>
          </View>
        </View>
      </Modal>

      <ErrorModal
        modalVisible={errorVisible}
        onRequestClose={() => setErrorVisible(false)}
        errorMessage={errorMessage}
      />
    </>
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
    width: '85%',
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.terciary,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    padding: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    color: colors.white,
    fontFamily: 'GeistMono-Bold',
    marginLeft: 10,
  },

  closeButton: {
    padding: 10,
  },
  body: {
    fontSize: 15,
    fontWeight: '500',
    color: '#A1A1AA',
    marginVertical: 5,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.black,
    justifyContent: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  buttonContainer: {
    width: '100%',
    borderTopColor: colors.terciary,
    borderTopWidth: 1,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  button: {
    width: '90%',
    padding: '3%',
    marginVertical: 10,
  },
  cancelButton: {
    width: '90%',
    padding: '3%',
    marginTop: 10,
  },
});

export default UploadAvatar;
