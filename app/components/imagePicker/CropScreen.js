import React, { useState } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import colors from '../../config/colors'; // Adjust path if necessary
import routes from '../../navigation/routes';

const CROP_SIZE = 300; // Adjust this value as needed

const CropScreen = ({ route, navigation }) => {
    const { uri } = route.params;
    const [croppedUri, setCroppedUri] = useState(null);

    const handleCrop = () => {
        ImagePicker.openCropper({
            path: uri,
            width: CROP_SIZE,
            height: CROP_SIZE,
            cropping: true,
            cropperCircleOverlay: false, // Set this to true if you want a circular crop overlay
        }).then(image => {
            setCroppedUri(image.path);
        }).catch(error => {
            Alert.alert('Error', 'Failed to crop image');
        });
    };

    const handleConfirm = () => {
        if (croppedUri) {
            navigation.navigate(routes.CREATE_POST_SCREEN, { croppedUri });
        } else {
            Alert.alert('Error', 'No image to save');
        }
    };

    return (
        <View style={styles.container}>
            {croppedUri ? (
                <Image source={{ uri: croppedUri }} style={styles.croppedImage} />
            ) : (
                <Image source={{ uri }} style={styles.image} />
            )}
            <TouchableOpacity style={styles.cropButton} onPress={handleCrop}>
                <Image source={require('../../assets/crop-icon.png')} style={styles.cropIcon} />
            </TouchableOpacity>
            {croppedUri && (
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                    <Image source={require('../../assets/check-icon.png')} style={styles.confirmIcon} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
    },
    image: {
        width: CROP_SIZE,
        height: CROP_SIZE,
        borderRadius: 10,
    },
    croppedImage: {
        width: CROP_SIZE,
        height: CROP_SIZE,
        borderRadius: 10,
        marginBottom: 20,
    },
    cropButton: {
        position: 'absolute',
        bottom: 70,
        right: 20,
        backgroundColor: colors.primary,
        borderRadius: 50,
        padding: 10,
    },
    cropIcon: {
        width: 30,
        height: 30,
    },
    confirmButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: colors.primary,
        borderRadius: 50,
        padding: 10,
    },
    confirmIcon: {
        width: 30,
        height: 30,
    },
});

export default CropScreen;
