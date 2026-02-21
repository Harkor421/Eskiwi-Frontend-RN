import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo. If not, install react-native-vector-icons
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import colors from '../config/colors';
import AppText from './AppText';

const CustomCheckBox = ({ label, checked, onChange, style }) => {
  // The component receives checked state and onChange handler from parent
  const toggleCheck = () => {
    onChange(!checked); // Toggle the check state and pass it to the parent
  };

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={toggleCheck}>
      <View style={[styles.checkBox, checked && styles.checkedBox]}>
        {checked && (
          <Ionicons name="checkmark" size={18} color="white" />
        )}
      </View>
      {label && <AppText style={styles.label}>{label}</AppText>}
    </TouchableOpacity>
  );
};

// Default styles for the CheckBox
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#FA3D86', // iOS-like blue
    borderRadius: 5, // Slightly rounded corners for iOS feel
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkedBox: {
    backgroundColor: '#FA3D86', // iOS-like blue when checked
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.white,
  },
});

export default CustomCheckBox;
