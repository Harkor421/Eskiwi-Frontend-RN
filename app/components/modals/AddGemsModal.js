import React, { useContext, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import postsApi from '../../api/posts';
import AuthContext from '../../auth/context';
import colors from '../../config/colors';
import { MAXIMUM_COMMENT_GEM_AMOUNT, MAXIMUM_COMMENT_LENGTH } from '../../config/constants';
import useToastMessage from '../../hooks/useToastMessage';
import AppText from '../AppText';
import { BlackButton, GemButton } from '../buttons';
import CustomTextInput from '../CustomTextInput';
import { useTranslation } from 'react-i18next';
import useFormattedNumber from '../../hooks/useFormattedNumber';

const AddGemsModal = ({ modalVisible, onRequestClose, commentContent, post, onSuccess }) => {
  const [gemCount, setGemCount] = useState('');
  const [comment2, setComment2] = useState(commentContent);
  const {user} = useContext(AuthContext);
  const {showError} = useToastMessage();
  const {t} = useTranslation();
  const formatNumber = useFormattedNumber();

  const handleAddGems = async () => {
    const gems = parseInt(gemCount, 10); 
    const response = await postsApi.postComment(post.id, comment2, gems);
    if(response.ok){
      onRequestClose();
      onSuccess();
    }
    else{
      showError(`No se ha podido completar la donación`, "Error")
    }
    console.log(response);

  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onRequestClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={styles.modalView} 
            keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <GemButton 
                  style={styles.rightGemButton} 
                  icon={require("../../assets/gem-fill-icon.png")}
                />
                <AppText style={styles.headerTitle}>{t("addGems.title")}</AppText>
              </View>
              <TouchableOpacity onPress={onRequestClose}>
                <Image source={require('../../assets/close-icon.png')} style={styles.closeIcon} />
              </TouchableOpacity>
            </View>

            <AppText style={styles.body}>{t("addGems.description")}</AppText>
            <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <AppText style={styles.subTitle}>{t("addGems.title")}</AppText>
              <AppText style={styles.availableGems}>{`${t("addGems.availableGems")} ${formatNumber(user.gems)} ${t("gems")}`}</AppText>

            </View>
                  <CustomTextInput
                    icon={require('../../assets/gem-icon.png')}
                    placeholder="Ex: 100 gems"
                    multiline={false}
                    maxCharacters={MAXIMUM_COMMENT_GEM_AMOUNT} 
                    value={gemCount}
                    isNumeric={true} 
                    onChangeText={setGemCount}
                    style={styles.input}
                  />
            <AppText style={styles.subTitle}>{t("addGems.comment")}</AppText>
              <CustomTextInput
                placeholder={commentContent}
                maxCharacters={MAXIMUM_COMMENT_LENGTH}
                multiline={true}
                value={comment2}
                onChangeText={setComment2}
                style={styles.input2}
              />

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <GemButton 
                style={styles.sendCommentButton} 
                title={t("addGems.sendComment")}
                onPress={handleAddGems}
              />  
              <BlackButton
                style={styles.cancelButton} 
                title={t("cancel")}
                onPress={onRequestClose}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
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
    paddingVertical: 10,
    width: '85%',
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
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
  body: {
    fontSize: 12,
    color: '#A1A1AA',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  subTitle: {
    fontSize: 14,
    color: colors.white,
    fontWeight: 500,
    marginVertical: 12,
    paddingHorizontal: 10,
  },
  availableGems: {
    fontSize: 12,
    fontWeight: 500,
    color: '#52525B',
    marginVertical: 12,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  input: {
    borderRadius: 5,
    height: 40,
    marginHorizontal: 10,
  },
  input2: {
    borderRadius: 5,
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
    width: '90%',
    marginVertical: 15,
  },
  cancelButton: {
    width: '90%',
  },
});

export default AddGemsModal;
