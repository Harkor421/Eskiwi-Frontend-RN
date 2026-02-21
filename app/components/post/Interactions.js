import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import useFormatNumber from '../../hooks/useFormatNumber'; // Import the format number hook
import useSharePost from '../../hooks/useSharePost'; // Import the share post hook
import Interaction from './Interaction';
import LikeButton from './LikeButton'; // Ensure the path is correct

function Interactions({ navigation, post, showComments, refreshPost}) {
    const postID = post.id;

    // State to track the like, share, comment, and save counts
    const [likes, setLikes] = useState(post ? post.likes : 0);
    const [shares, setShares] = useState(post ? post.shares : 0);
    const [comments, setComments] = useState(post ? post.comments : 0);
    const [saves, setSaves] = useState(post ? post.saves : 0);

    // Update the state when post changes
    useEffect(() => {
        if (post) {
            setLikes(post.likes);
            setShares(post.shares);
            setComments(post.comments);
            setSaves(post.saves);
        }
    }, [post]);

    // Get the handleShare function from the hook
    const sharePost = useSharePost(post);

    // Increment the share count and call the sharePost function
    const handleShare = async () => {
        if (shares === post.shares) {
            await sharePost();
            refreshPost();
        }
    };

    // Use the custom hook to format numbers
    const formattedComments = useFormatNumber(comments);
    const formattedSaves = useFormatNumber(saves);
    const formattedShares = useFormatNumber(shares); // Use updated shares state

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <LikeButton postID={postID} initialLikes={likes} refreshPost={refreshPost} />
                {/* Other Interaction components */}
                <Interaction
                    image={require('../../assets/coments.png')}
                    onPress={showComments}
                    enabled={false}
                    text={formattedComments}
                    noTint={true}
                    style={styles.interaction}
                />
                <Interaction
                    image={require('../../assets/diagonal-right-arrow.png')}
                    onPress={handleShare} // Use the handleShare function
                    enabled={false}
                    noTint={true}
                    text={formattedShares} // Use formatted shares
                    style={styles.interaction}
                />
                <Interaction
                    image={require('../../assets/save-icon.png')}
                    onPress={() => console.log('Save pressed')}
                    enabled={false}
                    noTint={true}
                    text={formattedSaves}
                    style={styles.interaction}
                />
            </View>

            <Interaction
                image={require('../../assets/dots-vertical.png')}
                onPress={() => navigation.navigate("PostManagement", post)}
                enabled={false}
                noTint={true}
                style={[styles.rightInteraction]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingHorizontal: 10,
        marginTop: 10,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    interaction: {
        marginRight: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightInteraction: {
        marginLeft: 'auto',
        marginTop: '50%',
    },
});

export default Interactions;
