import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Dimensions, Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import api from '../../api/user';
import AuthContext from '../../auth/context';
import colors from '../../config/colors';
import AppText from '../AppText';
import AppButton from '../buttons/AppButton';
import BlackButton from '../buttons/BlackButton';
import GemButton from '../buttons/GemButton';

const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 8 MB in bytes

const UploadBanner = ({ isVisible, onClose }) => {
  const [imageUri, setImageUri] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const { updateUser } = useContext(AuthContext);
  const {t} = useTranslation();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [730, 256],  // Aspect ratio for banner
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      let { uri, base64 } = result.assets[0];
      let fileInfo = await FileSystem.getInfoAsync(uri);

      let compressRatio = 0.8; // Initial compression ratio
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

          compressRatio -= 0.1; // Reduce the compression ratio for subsequent attempts

          if (compressRatio < 0.1) {
            // Avoid extremely low compression ratio which could degrade image quality significantly
            Alert.alert('Error', 'Image size exceeds the maximum limit of 8 MB.');
            return;
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to compress image: ' + error.message);
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
      formData.append("banner", {
        uri: imageUri,
        name: "banner.jpg", // You can change the name or get it from the file metadata
        type: "image/jpeg", // Assuming JPEG image
      });
  
      const response = await api.updateBanner(formData); 
  
      if (response.ok) {
        updateUser(); 
        onClose(); 
        updateUser();
      } else {
        Alert.alert('Error', 'Failed to upload banner: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload banner: ' + error.message);
      console.error('Failed to upload banner:', error);
    }
  };
  

  const handleCancel = () => {
    setImageUri(null);  // Clear the image preview
    setImageBase64(null);  // Clear the base64 data
    onClose();  // Close the modal
  };

  const windowWidth = Dimensions.get('window').width;
  const bannerWidth = windowWidth * 0.85; // Adjust width for the banner
  const bannerHeight = bannerWidth * (256 / 730); // Maintain aspect ratio

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={handleCancel}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <GemButton
                icon={require('../../assets/upload-icon.png')}
              />
              <AppText style={styles.headerTitle}>{t("accountSettings.bannerTitle")}</AppText>
            </View>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>

          <AppText style={styles.body}>{t("accountSettings.bannerText")}</AppText>

          <View style={[styles.imageContainer, { width: bannerWidth, height: bannerHeight }]}>
            {imageUri && (
              <Image source={{ uri: imageUri }} style={[styles.image, { width: bannerWidth, height: bannerHeight }]} />
            )}
          </View>
          <View style={styles.buttonContainer}>
            <AppButton
              title={imageUri ? t("accountSettings.bannerText") : t("accountSettings.selectImage")}
              style={styles.button}
              onPress={imageUri ? handleUpload : pickImage}
            />
            <BlackButton title="Cancel" onPress={handleCancel} style={styles.cancelButton} />
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
    width: '95%',
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
  uploadButton: {
    padding: '3%',
    width: '12%',
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

export default UploadBanner;
