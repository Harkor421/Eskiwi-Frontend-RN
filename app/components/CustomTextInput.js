import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import colors from '../config/colors';
import FastImage from 'react-native-fast-image';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

const CustomTextInput = ({
  icon,
  placeholder,
  value = '',
  onChangeText = () => {},
  onBlur,
  style,
  onSubmitEditing,
  onEndEditing,
  maxCharacters = 100,
  multiline = false,
  isNumeric = false, // New prop for numeric-only input
  keyboardType = 'default',
  useBottomSheet = false, // New prop to determine input type
}) => {
  const [inputHeight, setInputHeight] = useState(40);
  const [borderColor, setBorderColor] = useState('#202024');

  const handleChangeText = (text) => {
    onChangeText(text);

    if (text.length > maxCharacters) {
      setBorderColor(colors.light_red);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      setBorderColor('#202024');
    }
  };

  const inputProps = {
    placeholder,
    placeholderTextColor: '#7A7A83',
    onSubmitEditing,
    onEndEditing,
    value,
    onChangeText: handleChangeText,
    onBlur,
    multiline,
    keyboardType: isNumeric ? 'numeric' : keyboardType, // Conditionally set keyboard type
    onContentSizeChange: multiline ? (event) => {
      setInputHeight(event.nativeEvent.contentSize.height);
    } : undefined,
    style: [
      styles.textInput,
      { height: multiline ? Math.max(40, inputHeight) : 40 },
    ],
  };

  return (
    <View
      style={[
        styles.container,
        style,
        { borderColor: borderColor },
      ]}
    >
      <View style={styles.inputContainer}>
        {icon && <FastImage source={icon} style={styles.icon} />}
        
        {useBottomSheet ? (
          <BottomSheetTextInput
            {...inputProps}
          />
        ) : (
          <TextInput
            {...inputProps}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.terciary,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    width: 15,
    height: 15,
    marginRight: 10,
  },
  textInput: {
    fontFamily: 'WorkSans-Medium',
    flex: 1,
    color: colors.white,
    textAlignVertical: 'center',
    fontSize: 14,
  },
});

export default CustomTextInput;
