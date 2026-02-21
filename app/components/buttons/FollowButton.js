import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import followApi from '../../api/follow';
import AuthContext from '../../auth/context';
import BlackButton from './BlackButton'; // Import BlackButton
import GemButton from './GemButton';

function FollowButton({ creatorId, navigation, followers, onFollowersChange }) {
    const [isFollowing, setIsFollowing] = useState(false);
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    
    useEffect(() => {
        const checkFollowStatus = async () => {
            try {
                const response = await followApi.checkFollow(creatorId);
                setIsFollowing(response.data.following);
            } catch (error) {
                console.error('Error checking follow status:', error);
            }
        };

        checkFollowStatus();
    }, [creatorId]);

    const handlePress = async () => {
        try {
            if (isFollowing) {
                await followApi.unfollow(creatorId);
                setIsFollowing(false);
                onFollowersChange(followers - 1); // Decrease followers count
            } else {
                await followApi.follow(creatorId);
                setIsFollowing(true);
                onFollowersChange(followers + 1); // Increase followers count
            }
        } catch (error) {
            console.error('Error following/unfollowing user:', error);
        }
    };


    // If the logged-in user is the creator, show "Edit Profile" instead of follow/unfollow button
    if (user?.id === creatorId) {
        return (
            <View style={styles.buttonContainer}>
                <BlackButton
                    title={t("followButton.editProfile")} // Assuming you have a translation for "Edit Profile"
                    icon={require("../../assets/edit-icon.png")} // Replace with appropriate icon
                    iconPosition='left'
                    style={styles.button}
                    onPress={() => {
                        navigation.navigate("ProfileSettings");
                        setTimeout(() => {
                        navigation.navigate("AccountSettings");
                        }, 300);
                    }} 
                />
            </View>
        );
    }

    return (
        <View style={styles.buttonContainer}>
            {isFollowing ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <BlackButton
                        title={t("followButton.unfollow")}
                        icon={require("../../assets/close-icon.png")}
                        style={{ marginRight: 10 }}
                        iconPosition='left'
                        onPress={handlePress}
                        tintColor={"#7A7A83"}
                    />
                </View>
            ) : (
                <GemButton
                    title={t("followButton.follow")}
                    icon={require("../../assets/creator-icon.png")}
                    iconPosition='left'
                    style={styles.button}
                    onPress={handlePress}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({

});

export default FollowButton;
