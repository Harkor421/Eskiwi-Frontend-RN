import * as Haptics from 'expo-haptics'; // Import Haptics module
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import postsApi from '../../api/posts';
import colors from '../../config/colors';
import useFormatNumber from '../../hooks/useFormatNumber'; // Import the format number hook
import AppText from '../AppText';

function LikeButton({ postID, initialLikes, refreshPost }) {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);

    // Update likes state when initialLikes changes
    useEffect(() => {
        setLikes(initialLikes);
    }, [initialLikes]);

    // Fetch the initial like status when the component mounts or postID changes
    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const response = await postsApi.getUserLike(postID);
                setIsLiked(response.data.liked);
            } catch (error) {
                console.error('Error fetching like status:', error);
            }
        };

        fetchLikeStatus();
    }, [postID, initialLikes]);

    const handleLikePress = async () => {
        try {
            if (isLiked) {
                await postsApi.unlikePost(postID);
                setLikes(prevLikes => prevLikes - 1); // Decrement likes count
            } else {
                const response = await postsApi.likePost(postID);
                console.log(response);
                setLikes(prevLikes => prevLikes + 1); // Increment likes count
            }
            setIsLiked(prevIsLiked => !prevIsLiked); // Toggle isLiked state
            refreshPost();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Add haptic feedback
        } catch (error) {
            console.error('Error liking/unliking post:', error);
            // Rollback UI changes on error
            setLikes(prevLikes => isLiked ? prevLikes + 1 : prevLikes - 1);
            setIsLiked(prevIsLiked => !prevIsLiked);
        }
    };

    // Use the custom hook to format the likes number
    const formattedLikes = useFormatNumber(likes);

    return (
        <TouchableOpacity style={styles.button} onPress={handleLikePress}>
            <Image
                style={[
                    styles.icon,
                    {
                        tintColor: isLiked ? "#FC5193" : colors.white // Pink if liked, white otherwise
                    }
                ]}
                source={require('../../assets/Like-icon.png')}
            />
            <AppText style={styles.text}>{formattedLikes}</AppText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    icon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginRight: 8,
    },
    text: {
        fontSize: 14,
        color: colors.white,
        fontWeight: 700,
        textAlign: 'center',
    },
});

export default LikeButton;
