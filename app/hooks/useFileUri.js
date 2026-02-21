// hooks/useFileUri.js
import { useState } from 'react';
import RNFS from 'react-native-fs';

const useFileUri = () => {
    const [fileUri, setFileUri] = useState(null);

    const getFileUri = async (uri) => {
        if (uri.startsWith('ph://')) {
            try {
                const destPath = `${RNFS.CachesDirectoryPath}/MyPic_${Date.now()}.jpg`;
                await RNFS.copyAssetsFileIOS(uri, destPath, 0, 0);
                return `file://${destPath}`;
            } catch (error) {
                console.error('Error copying asset:', error);
                return uri;
            }
        }
        return uri;
    };

    return { fileUri, getFileUri };
};

export default useFileUri;
