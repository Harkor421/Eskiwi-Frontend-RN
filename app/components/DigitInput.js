import React, { forwardRef } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import colors from '../config/colors';

const DigitInput = forwardRef(({ onChange, onBackspace, style, ...props }, ref) => {
  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === 'Backspace') {
      onBackspace();
    }
  };

  return (
    <TextInput
      ref={ref}
      style={[styles.input, style]}
      keyboardType="number-pad"
      maxLength={1}
      onChangeText={onChange}
      onKeyPress={handleKeyPress}
      {...props}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 2,
    borderBottomColor: colors.grayline,
    margin: 10,
    padding: 10,
    fontSize: 24,
    textAlign: 'center',
    color: colors.white,
  },
});

export default DigitInput;
