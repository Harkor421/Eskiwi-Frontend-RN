import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import AuthContext from '../auth/context';
import SettingNavigationComponent from '../components/accountSettings/SettingNavigationComponent';
import DeletePostModal from '../components/postManagement/DeletePostModal';
import colors from '../config/colors';

function PostManagementScreen({ navigation, route }) {
    const { user } = useContext(AuthContext);
    const [isCreator, setIsCreator] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const { t } = useTranslation();

    // Retrieve the post from route params
    const post = route.params;

    // useEffect to check if user is the post creator or has admin role
    useEffect(() => {
        if (user?.id === post?.userId || user?.roles?.includes('admin')) {
            setIsCreator(true);
        } else {
            setIsCreator(false);
        }
    }, [user, post]);

    const handleDeletePost = () => {
        setModalVisible(true); // Open the modal when delete is clicked
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.centeredView}>
                    <View style={styles.settingsContainer}>
                        <SettingNavigationComponent
                            logo={require("../assets/flag-icon.png")}
                            title={t('postManagement.reportPostTitle')}
                            text={t('postManagement.reportPostDescription')}
                            isFirst={true}
                            onPress={() => navigation.navigate("ReportPost")}
                        />
                        {/* Show Delete option if the user owns the post or is an admin */}
                        {isCreator && (
                            <SettingNavigationComponent
                                logo={require("../assets/trash-icon.png")}
                                title={t('postManagement.deletePostTitle')}
                                text={t('postManagement.deletePostDescription')}
                                onPress={handleDeletePost} // Trigger modal on delete post press
                            />
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Delete Post Modal */}
            <DeletePostModal
                postID={post.id}
                navigation={navigation}
                modalVisible={modalVisible} 
                onRequestClose={() => setModalVisible(false)} 
                errorMessage={t('postManagement.deletePostConfirmation')} // You can customize this message
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    centeredView: {
        padding: 20,
    },
    settingsContainer: {
        backgroundColor: colors.secondary,
        borderRadius: 10,
        borderTopColor: colors.terciary,
        borderTopWidth: 1,
    },
});

export default PostManagementScreen;
