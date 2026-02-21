import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Button, Modal, Platform, StyleSheet, View } from 'react-native';
import colors from '../../config/colors';

const DatePicker = ({ date, onDateChange, show, onClose }) => {
  const [selectedDate, setSelectedDate] = React.useState(date);

  // Use this function to handle date changes
  const handleDateChange = (event, newDate) => {
    if (event.type === 'set') {
      setSelectedDate(newDate || date);
      // Do NOT call onClose here to keep the picker open on change
    } else if (event.type === 'dismissed') {
      onClose(); // Close the modal if dismissed
    }
  };

  // Function to handle Done button click
  const handleDone = () => {
    // Call onDateChange with the selected date and close the modal
    onDateChange(selectedDate);
    onClose();
  };

  return (
    <View>
      {Platform.OS === 'android' && show ? (  // Check show for Android
        <DateTimePicker
          value={selectedDate || date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      ) : (
        <Modal
          transparent={true}
          animationType="slide"
          visible={show}
          onRequestClose={onClose} // Close modal on back press
        >
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={selectedDate || date}
                mode="date"
                display="spinner"
                onChange={handleDateChange} // Ensure date changes are handled
              />
              <Button title="Done" onPress={handleDone} /> 
              <Button title="Cancel" onPress={onClose} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center',
  },
});

export default DatePicker;
