import React, { useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import Pinchable from 'react-native-pinchable';
import ActivityIndicator from '../ActivityIndicator'; // Adjust the path as necessary
import { GreenButton } from '../buttons';
import LinearGradient from 'react-native-linear-gradient'; // Import the LinearGradient component
import AppText from '../AppText';
import { useTranslation } from 'react-i18next';
import colors from '../../config/colors';
import { getPriceByTier } from '../../utils/getPriceByTier';
import routes from '../../navigation/routes';

const { width } = Dimensions.get('window'); // Screen width

const SwipeableImage = ({ images, isSubbed, tier, creator, navigation}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loadingImages, setLoadingImages] = useState(new Set());
    const {t} = useTranslation();
    
   // Update currentIndex when user swipes
    const handleScroll = (event) => {
        const newIndex = Math.floor(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(newIndex);
    };

    // Handle image load start
    const handleImageLoadStart = (index) => {
        setLoadingImages(prev => new Set(prev).add(index));
    };

    // Handle image load end
    const handleImageLoadEnd = (index) => {
        setLoadingImages(prev => {
            const updated = new Set(prev);
            updated.delete(index);
            return updated;
        });
    };

    const renderImage = ({ item, index }) => (
            <View style={styles.imageContainer}>
                <Pinchable style={styles.pinchable}>
                        <View style={styles.imageWrapper}>
                            <FastImage
                                style={styles.image}
                                source={{ uri: item,
                                    priority: FastImage.priority.high
                                 }}
                                resizeMode="cover"
                                onLoadStart={() => handleImageLoadStart(index)}
                                onLoad={() => handleImageLoadEnd(index)}
                            />
                            {!isSubbed && (
                                <>
                                    <LinearGradient
                                        colors={['rgba(32, 32, 36, 0.25)', 'rgba(32, 32, 36, 1)']}
                                        style={styles.gradient}
                                    />
                                    <View style={styles.buttonContainer}>
                                        <Image
                                            source={require('../../assets/key-lock.png')}
                                            style={styles.lockImage}
                                        />
                                        <AppText style = {styles.disclaimer}>{t("postImage.disclaimer")}</AppText>
                                        <GreenButton
                                            icon={require('../../assets/add-icon.png')}
                                            title={`${t("postImage.join")} ${getPriceByTier(tier)}$ USD`}
                                            onPress={()=> navigation.navigate(routes.CREATOR_DETAILS, creator)}
                                        />
                                    </View>
                                </>
                            )}
                        </View>
                </Pinchable>
            </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={images}
                renderItem={renderImage}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                onScroll={handleScroll}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
            />
            {images.length > 1 && (
                <View style={styles.indicatorContainer}>
                    {images.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                { opacity: currentIndex === index ? 1 : 0.5 }
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        height: width, 
        overflow: 'hidden',
    },
    imageContainer: {
        width: width,
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    pinchable: {
        width: '100%',
        height: '100%',
    },
    imageWrapper: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative', 
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%', 
    },
    buttonContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lockImage: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
        marginBottom: 10, 
    },
    disclaimer:{
        fontFamily: 'GeistMono-Bold',
        fontSize: 14,
        marginBottom: 10,
        marginHorizontal: 10,
        textAlign: 'center',
    },
    indicatorContainer: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        flexDirection: 'row',
    },
    indicator: {
        width: 5,
        height: 5,
        borderRadius: 4,
        backgroundColor: 'white',
        margin: 4,
    },
});

export default SwipeableImage;
