import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import colors from '../config/colors';

const CustomDropdown = ({ data, placeholder = 'Select an option...', onChange }) => {
  const [value, setValue] = useState([]);
  const [isFocus, setIsFocus] = useState(false);

  const handleChange = (item) => {
    const currentIndex = value.findIndex((val) => val === item.value);
    let updatedValue;

    if (currentIndex === -1) {
      // Item is not in the list, add it
      updatedValue = [...value, item.value];
    } else {
      // Item is already selected, remove it
      updatedValue = value.filter((val) => val !== item.value);
    }

    setValue(updatedValue);
    setIsFocus(false);
    
    if (onChange) {
      onChange(updatedValue); // Call the onChange prop with the updated values
    }
  };

  const concatenatedLabel = value
    .map((val) => data.find((item) => item.value === val)?.label) // Get the labels
    .filter(Boolean) // Remove any undefined values
    .join(', '); // Concatenate them with a comma

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
      placeholder={!isFocus ? (concatenatedLabel || placeholder) : '...'}
      value={value}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={handleChange}
    />
  );
};

export default CustomDropdown;

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