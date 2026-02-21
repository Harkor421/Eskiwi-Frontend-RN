import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../../config/colors';

const PlusButton = ({ onPress }) => (
  <TouchableOpacity style={styles.plusButton} onPress={onPress}>
    <Text style={styles.plusText}>+</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  plusButton: {
    width: '100%',
    paddingVertical: "30%",
    backgroundColor: colors.terciary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderColor: '#7A7A83',
    borderWidth: 1,
  },
  plusText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PlusButton;
