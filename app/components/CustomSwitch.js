import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';

const CustomSwitch = ({
  value = false,
  onValueChange,
  isSelected = false, // New prop for selection
  activeText = 'On',
  inactiveText = 'Off',
  activeColor = '#FA3D86',
  inactiveColor = '#e4e4e4',
  thumbColor = '#fff',
  switchWidth = 60,
  switchHeight = 30,
  borderRadius = 15,
  thumbSize = 20
}) => {
  const [isOn, setIsOn] = useState(value || isSelected);
  const [translateX] = useState(new Animated.Value(isOn ? switchWidth - thumbSize - 2 : 2));

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOn ? switchWidth - thumbSize - 2 : 2,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isOn, switchWidth, thumbSize]);

  useEffect(() => {
    // Update the switch state if the isSelected prop changes
    if (isSelected !== isOn) {
      setIsOn(isSelected);
    }
  }, [isSelected]);

  const toggleSwitch = () => {
    setIsOn(!isOn);
    onValueChange(!isOn);
  };

  return (
    <TouchableOpacity onPress={toggleSwitch} activeOpacity={0.8}>
      <View style={[
        styles.switchContainer,
        { width: switchWidth, height: switchHeight, borderRadius, backgroundColor: isOn ? activeColor : inactiveColor }
      ]}>
        <Animated.View style={[
          styles.thumb,
          {
            width: thumbSize,
            height: thumbSize,
            borderRadius: thumbSize / 2,
            backgroundColor: thumbColor,
            transform: [{ translateX }],
            // Add outer glow when the switch is on
            shadowColor: isOn ? '#FA3D8621' : 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: isOn ? 1 : 0,
            shadowRadius: 10,
            elevation: isOn ? 8 : 0, // For Android
          }
        ]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    justifyContent: 'center',
    padding: 2,
  },
  thumb: {
    position: 'absolute',
  },
});

export default CustomSwitch;
