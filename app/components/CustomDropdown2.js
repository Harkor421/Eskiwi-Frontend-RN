import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import colors from '../config/colors';

const CustomDropdown2 = ({ data, placeholder = 'Select an option...', onChange,}) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const handleChange = (item) => {
    setValue(item.value);
    setIsFocus(false);
    if (onChange) {
      onChange(item); 
    }
  };

  return (
    <Dropdown
      style={[styles.dropdown, isFocus && { borderColor: colors.terciary }]}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      itemContainerStyle={styles.itemContainer}
      containerStyle={styles.listContainer}
      itemTextStyle={styles.itemLabel}
      data={data}
      mode='auto'
      maxHeight={300}
      activeColor={colors.secondary}
      labelField="label"
      valueField="value"
      placeholder={!isFocus ? placeholder : '...'}
      value={value}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={handleChange}
    />
  );
};

export default CustomDropdown2;

const styles = StyleSheet.create({
  dropdown: {
    height: 40,
    backgroundColor: colors.terciary,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  itemContainer: {
    backgroundColor: colors.terciary,
  },
  listContainer: {
    borderColor: colors.terciary,
    borderWidth: 1,
    backgroundColor: colors.terciary,
  },
  itemLabel: {
    fontSize: 12,
    fontFamily: 'GeistMono-Bold',
    color: "#7A7A83",
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#7A7A83",
  },
  selectedTextStyle: {
    fontSize: 14,
    color: colors.white,
  },
});