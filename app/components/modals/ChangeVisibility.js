import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import colors from '../../config/colors';
import AppText from '../AppText';
import { BlackButton, GemButton } from '../buttons';
import { useTranslation } from 'react-i18next';
import CustomDropdown from '../CustomDropdown';
import userApi from '../../api/user';
import { useContext } from 'react';
import AuthContext from '../../auth/context';

const ChangeVisibility = forwardRef(({ modalVisible, onRequestClose, onSelectTier }, ref) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedVisibilityOptions, setSelectedVisibilityOptions] = useState([]);
  const [visibilityOptions, setVisibilityOptions] = useState([]);
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  useImperativeHandle(ref, () => ({
    getTitle: () => title,
    getDescription: () => description,
    getVisibilityOptions: () => selectedVisibilityOptions,
    clearFields: () => {
      setTitle('');
      setDescription('');
      setSelectedVisibilityOptions([]);
    }
  }));

  useEffect(() => {
    const fetchVisibilityOptions = async () => {
      try {
        const response = await userApi.getTiers(user.id);
        const options = response.data.tiers.map(option => ({
          label: option.name,
          value: option.tier,
        }));

        const defaultOption = {
          label: t('changeVisibility.visibleForAll'),
          value: 0,
        };

        setVisibilityOptions([defaultOption, ...options]);
      } catch (error) {
        console.error('Failed to fetch visibility options:', error);
      }
    };

    if (modalVisible) {
      fetchVisibilityOptions();
    }
  }, [modalVisible, user.id, t]);

  const handleSave = () => {
    console.log('Selected Visibility Options:', selectedVisibilityOptions); 
  
    if (selectedVisibilityOptions.length > 0) {

      console.log('Selected Tiers:', selectedVisibilityOptions); 
      onSelectTier(selectedVisibilityOptions); 
    } else {
      console.warn('No visibility options selected'); 
    }
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
              <AppText style={styles.headerTitle}>{t("changeVisibility.title")}</AppText>
            </View>
            <TouchableOpacity onPress={onRequestClose}>
              <Image source={require('../../assets/close-icon.png')} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>

          {/* Subtitle */}
          <View style={{ flexDirection: 'column', marginHorizontal: 10 }}>
            <AppText style={styles.subTitle}>{t("changeVisibility.subtitle")}</AppText>
            <CustomDropdown
              data={visibilityOptions}
              placeholder={t('changeVisibility.placeholder')}
              multiple={true}
              onChange={(selectedOptions) => {
                // Find the selected options' labels and values from visibilityOptions
                const updatedSelectedOptions = selectedOptions.map((selectedValue) => {
                  const selectedOption = visibilityOptions.find(
                    (option) => option.value === selectedValue
                  );
                  return selectedOption ? { label: selectedOption.label, value: selectedOption.value } : null;
                }).filter(Boolean); // Filter out any null values
            
                setSelectedVisibilityOptions(updatedSelectedOptions);
              }}
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <GemButton 
              style={styles.sendCommentButton} 
              title={t("saveChanges")}
              onPress={handleSave} // Use handleSave to return selected tier
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
    fontSize: 12,
    color: colors.white,
    fontWeight: 500,
    marginVertical: 12,
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
    marginVertical: 15,
  },
  cancelButton: {
    width: "90%",
  },
});

export default ChangeVisibility;
