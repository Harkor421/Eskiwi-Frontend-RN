import { useNavigation } from '@react-navigation/native'; // For navigation
import React from "react";
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from "react-native-fast-image";
import Pinchable from 'react-native-pinchable';

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

const ShowImage = ({ route }) => {
    const navigation = useNavigation(); // Get navigation to go back
    const { imageUri } = route.params; // Extract imageUri from route.params

    // Function to close the image and go back
    const handleClose = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Image
                    source={require('../../assets/close-icon.png')} // Ensure you have a close icon in your assets
                    style={styles.closeIcon}
                />
            </TouchableOpacity>

            <Pinchable>
                <FastImage
                    source={{ uri: imageUri }} 
                    style={styles.image}
                    resizeMode="contain" // Ensure image fits nicely
                />
            </Pinchable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Ensures the view takes the full screen
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Adds a slightly dark background to simulate a modal
    },
    image: {
        height: deviceHeight,
        width: deviceWidth,
    },
    closeButton: {
        position: 'absolute',
        top: 40, // Position slightly below the top edge
        right: 20, // Position slightly inside from the right edge
        zIndex: 1, // Ensure it's above the image
    },
    closeIcon: {
        width: 20,
        height: 20,
    },
});

export default ShowImage;
