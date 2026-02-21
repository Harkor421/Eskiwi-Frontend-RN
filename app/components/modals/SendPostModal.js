import { CommonActions } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Animated, Image, Modal, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import RNFS from 'react-native-fs';
import postsApi from '../../api/posts';
import colors from '../../config/colors';
import { compressImage } from '../../utils/imageUtils';
import SettingNavigationComponent from '../accountSettings/SettingNavigationComponent';
import AppText from '../AppText';
import { BlackButton, GemButton } from '../buttons';
import useToastMessage from '../../hooks/useToastMessage';
import { captureRef } from 'react-native-view-shot';
import ViewShot from 'react-native-view-shot';

const SendPostModal = ({ modalVisible, onRequestClose, postTitle, postDescription, images = [], navigation, tiers }) => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const progressAnim = useRef(new Animated.Value(0)).current;
    const { t } = useTranslation();
    const {showError} = useToastMessage();
    const [currentBlur, setCurrentBlur] = useState();
    const ref = useRef();

    
    // Helper function to convert ph:// URIs to file:// URIs
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

    // Update progress animation
    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: uploadProgress,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [uploadProgress]);


    // Submit function with fake progress simulation
    const handleSubmit = async () => {
        setIsUploading(true);
        setUploadProgress(0);
    
        const intervalId = setInterval(() => {
            setUploadProgress((prevProgress) => {
                const newProgress = Math.min(prevProgress + 10, 100);
                if (newProgress >= 100) {
                    clearInterval(intervalId);
                }
                return newProgress;
            });
        }, 100);
    
        try {
            const formData = new FormData();
            formData.append('title', postTitle);
            formData.append('description', postDescription);
            
            // Map the tiers array to access the value property and parse it to an integer
            const mappedTiers = tiers.map(tier => parseInt(tier.value, 10));
            const lowestTier = Math.min(...mappedTiers);  // Grab the highest value from the tiers
            
            console.log('Lowest tier:', lowestTier);
            formData.append('tier', lowestTier);  // Append only the highest tier value
        
            for (const [index, image] of images.entries()) {
                
                let fileUri = await getFileUri(image.uri);
                fileUri = await compressImage(fileUri, 4 * 1024 * 1024);
                formData.append('images', {
                    uri: fileUri,
                    type: image.type || 'image/jpeg',
                    name: `photo_${index}.jpg`,
                });

                         // Blur and append blurred images
                    setCurrentBlur(fileUri);
                    await delay(1000);

                    const blurredUri = await captureRef(ref, {
                        format: 'jpg',
                        quality: 1,
                    });

                    console.log(blurredUri);

                    formData.append('bluredImages', {
                        uri: blurredUri,
                        type: image.type || 'image/jpeg',
                        name: `blurred_photo_${index}.jpg`,
                    });
            }

    
            await new Promise((resolve) => setTimeout(resolve, 1000));
    
            const response = await postsApi.createPost(formData);
    
            if (response.ok) {
                navigation.navigate("Inicio");
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'Inicio' }],
                    })
                );
            } else {
                console.log(response);
                showError(response.data.error, "Error");
            }
    
            onRequestClose();
        } catch (error) {
            console.error('Error creating post:', error.message);
        } finally {
            setIsUploading(false);
        }
    };
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={onRequestClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <View style={styles.header}>
                            <View style={styles.headerLeft}>
                                <GemButton
                                    style={styles.rightGemButton}
                                    icon={require("../../assets/check-icon.png")}
                                    iconPosition={"right"}
                                    onPress={handleSubmit} // Handle submission
                                />
                                <AppText style={styles.headerTitle}>{t("sendPostModal.header")}</AppText>
                            </View>
                            <TouchableOpacity onPress={onRequestClose}>
                                <Image 
                                source={require('../../assets/close-icon.png')} 
                                style={styles.closeIcon} 
                                />
                            </TouchableOpacity>
                        </View>
                        <AppText style={styles.body}>{t("sendPostModal.disclaimer")}</AppText>
                        <View style={styles.centeredView}>
                            {isUploading ? (
                                <View style={styles.progressContainer}>
                                    <ViewShot ref={ref} options={{width: 100, height: 100}} >
                                        <Image
                                                style= {{width: 100, height: 100}}
                                                source={{uri: currentBlur}}
                                                blurRadius={40}
                                        />
                                    </ViewShot>
                                    <AppText style={styles.progressText}>{` ${t("sendPostModal.uploading")} ${uploadProgress}%`}</AppText>
                                    <ActivityIndicator style = {{marginTop: 30,}} size="20%" color={colors.white} />
                                </View>
                            ) : (
                                <>
                                    <SettingNavigationComponent
                                        useImage={true}
                                        logo={images[0]}
                                        title={postTitle}
                                        text={postDescription}
                                        disabled={true}
                                        secondLogo={require("../../assets/edit-icon.png")}
                                    />
                                    <View style={styles.settingsContainer}>
                                        <SettingNavigationComponent
                                            logo={require("../../assets/eye-icon.png")}
                                            title={t("sendPostModal.subscriptionTier")}
                                            text={tiers.map(tier => tier.label).join(', ')}
                                            disabled={true}
                                            onPress={() => navigation.navigate("AccountSettings")}
                                        />
                                    </View>
                                </>
                            )}
                        </View>
                        {!isUploading && ( // Add this to properly render buttons when not uploading
                        <View style={styles.buttonContainer}>
                            <GemButton
                                style={styles.sendCommentButton}
                                title={t("sendPostModal.publish")}
                                onPress={handleSubmit} // Handle submission
                                disabled={isUploading}
                            />
                            <BlackButton
                                style={styles.cancelButton}
                                title={t("sendPostModal.cancel")}
                                onPress={onRequestClose}
                            />
                        </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: "90%",
        maxHeight: "80%",
        backgroundColor: colors.primary,
        borderRadius: 10,
        padding: 10,
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    closeIcon: {
        width: 20,
        height: 20,
    },
    headerTitle: {
        fontSize: 18,
        marginLeft: 10,
        color: colors.white,
        fontFamily: 'GeistMono-Bold',
    },
    body: {
        fontSize: 14,
        fontWeight: '500',
        color: '#A1A1AA',
        marginVertical: 10,
        paddingHorizontal: 10,
    },
    centeredView: {
        marginTop: 20,
        padding: 5,
    },
    settingsContainer: {
        backgroundColor: colors.secondary,
        borderRadius: 10,
        marginTop: "10%",
    },
    progressContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    progressText: {
        marginTop: 10,
        fontSize: 16,
        color: colors.white,
        marginBottom: 10,
    },
    circleContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: 'center',
        borderTopColor: colors.terciary,
        borderTopWidth: 1,
        marginBottom: 10,
    },
    sendCommentButton: {
        width: "100%",
        marginVertical: 20,
    },
    cancelButton: {
        width: "100%",
    },
});

export default SendPostModal;
