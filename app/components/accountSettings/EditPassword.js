import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import AuthContext from '../../auth/context';
import colors from '../../config/colors';
import AppText from '../AppText';
import { BlackButton, GemButton } from '../buttons';
import CustomTextInput from '../CustomTextInput';

const EditPassword = ({ navigation, onClose }) => {
  const { user } = useContext(AuthContext); // Assuming you have user info in context
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    // Simple validation
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Both password fields must be filled.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    navigation.navigate("VerifyCode", {email: user.email, password: newPassword, isPasswordChange: true})
    
  };

  const handleCancel = () => {
    // Close the modal without saving
    onClose();
  };

  return (
    <View style={styles.modalContainer}>
      <AppText style={styles.title}>Cambia tu contraseña</AppText>

      {/* New Password Input */}
      <CustomTextInput
        secureTextEntry={true}
        placeholder="New Password"
        style={styles.input}
        onChangeText={setNewPassword}
        value={newPassword}
      />

      {/* Confirm New Password Input */}
      <CustomTextInput
        secureTextEntry={true}
        placeholder="Repeat New Password"
        style={styles.input}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
      />

      {/* Buttons */}
      <GemButton 
        style={styles.button} 
        title="Save" 
        onPress={handleSave}
      />  
      <BlackButton
        style={styles.button} 
        title="Cancel" 
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

export default EditPassword;
