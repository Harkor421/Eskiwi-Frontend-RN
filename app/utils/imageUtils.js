// utils/imageUtils.js
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

export const compressImage = async (uri, maxSize = 4 * 1024 * 1024) => { // Default maxSize to 4 MB
    let fileInfo = await FileSystem.getInfoAsync(uri);
    let compressRatio = 0.99; // Start with a high initial compression ratio

    while (fileInfo.size > maxSize) {
        try {
            // Optionally, resize based on original dimensions to keep aspect ratio
            const originalDimensions = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 1024 } }],
                { base64: true }
            );

            uri = originalDimensions.uri;

            const manipResult = await ImageManipulator.manipulateAsync(
                uri,
                [],
                { base64: true, compress: compressRatio }
            );

            uri = manipResult.uri;
            fileInfo = await FileSystem.getInfoAsync(uri);

            // Dynamically adjust the compression ratio based on current size
            const ratioFactor = (fileInfo.size / maxSize);
            compressRatio = Math.max(0.9, compressRatio - 0.01 * ratioFactor); // Ensure not to go below 0.9

        } catch (error) {
            throw new Error('Failed to compress image: ' + error.message);
        }
    }

    // Final size check
    fileInfo = await FileSystem.getInfoAsync(uri);
    if (fileInfo.size > maxSize) {
        throw new Error('Image could not be compressed below the maximum size limit.');
    }

    return uri;
};
