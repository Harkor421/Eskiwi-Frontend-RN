import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import { BlackButton, GemButton } from '../components/buttons';
import CustomTextInput from '../components/CustomTextInput';
import colors from '../config/colors';
import { useTranslation } from 'react-i18next';

const RecoverPassword = ({ navigation, onClose }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { t } = useTranslation();
  
  const handleSave = () => {
    // Simple validation
    if (!email || !newPassword || !confirmPassword) {
      Alert.alert(t('recoverPassword.error'), t('recoverPassword.allFieldsRequired'));
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t('recoverPassword.error'), t('recoverPassword.passwordMismatch'));
      return;
    }

    navigation.navigate("EmailVerification", { email: email, password: newPassword, isPasswordChange: true });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.modalContainer}>
      <AppText style={styles.title}>{t('recoverPassword.title')}</AppText>

      {/* Email Input */}
      <CustomTextInput
        placeholder={t('recoverPassword.emailPlaceholder')}
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
      />

      {/* New Password Input */}
      <CustomTextInput
        secureTextEntry={true}
        placeholder={t('recoverPassword.newPasswordPlaceholder')}
        style={styles.input}
        onChangeText={setNewPassword}
        value={newPassword}
      />

      {/* Confirm Password Input */}
      <CustomTextInput
        secureTextEntry={true}
        placeholder={t('recoverPassword.confirmPasswordPlaceholder')}
        style={styles.input}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
      />

      {/* Buttons */}
      <GemButton 
        style={styles.button} 
        title={t('recoverPassword.saveButton')} 
        onPress={handleSave}
      />  
      <BlackButton
        style={styles.button} 
        title={t('recoverPassword.cancelButton')} 
        onPress={handleCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 20,
  },
  title: {
    fontFamily: 'GeistMono-Bold',
    fontSize: 20,
    color: colors.white,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    marginBottom: 20,
    height: 50,
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    color: colors.white,
  },
  button: {
    width: '80%',
    marginVertical: 10,
  },
});

export default RecoverPassword;
