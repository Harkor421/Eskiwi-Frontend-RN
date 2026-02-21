import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import colors from '../../config/colors';
import AppText from '../AppText';

function PostDescription({ title, description }) {
    const [showFullDescription, setShowFullDescription] = useState(false);
    const { t } = useTranslation();

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    // Define a threshold for when to show the "View More" button
    const descriptionLengthThreshold = 50; // Adjust this value as needed

    const isLongDescription = description.length > descriptionLengthThreshold;

    return (
        <View style={styles.container}>
            <AppText style={styles.postTitle} numberOfLines={1} ellipsizeMode="tail">
                {title}
            </AppText>
            <AppText 
                style={styles.postDescription} 
                numberOfLines={showFullDescription ? undefined : 1} 
                ellipsizeMode="tail"
            >
                {description}
            </AppText>
            {isLongDescription && (
                <TouchableOpacity onPress={toggleDescription}>
                    <AppText style={styles.viewMore}>
                        {showFullDescription ? t('postDescription.viewLess') : t('postDescription.viewMore')}
                    </AppText>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#27272A",
        borderColor: colors.terciary,
        borderWidth: 1,
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 6,
    },
    postTitle: {
        color: "#FC5193",
        fontSize: 18,
        marginBottom: 5,
        fontWeight: '600',
        fontFamily: 'GeistMono-SemiBold',
    },
    postDescription: {
        color: "#7A7A83",
        fontSize: 14,
        fontWeight: '500',
    },
    viewMore: {
        color: "#7A7A83",
        fontSize: 14,
        fontWeight: '500',
        textDecorationLine: 'underline',
        marginTop: 5,
    },
});

export default PostDescription;
