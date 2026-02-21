import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { ScrollView, StyleSheet, View } from 'react-native';
import userApi from '../../api/user';
import AuthContext from '../../auth/context';
import colors from '../../config/colors';
import { MAXIMUM_POST_DESCRIPTION_LENGTH, MAXIMUM_USERNAME_LENGTH } from '../../config/constants';
import AppText from '../AppText';
import UserCard from '../UserCard';
import BlackButton from '../buttons/BlackButton';
import EditInformationModal from '../modals/EditInformation';
import SettingComponent from './SettingComponent';
import UploadAvatar from './UploadAvatar'; // Import UploadAvatar component
import UploadBanner from './UploadBanner'; // Import UploadBanner component

function AccountSettings({ navigation }) {
    const { user, updateUser } = useContext(AuthContext);
    const [uploadAvatarModalVisible, setUploadAvatarModalVisible] = useState(false);
    const [uploadBannerModalVisible, setUploadBannerModalVisible] = useState(false);
    const [editInfoModalVisible, setEditInfoModalVisible] = useState(false);
    const [editUsernameModalVisible, setEditUsernameModalVisible] = useState(false);
    const [editDisplaynameModalVisible, setEditDisplaynameModalVisible] = useState(false); 

    const [modalTitle, setModalTitle] = useState("");
    const [modalButtonText, setModalButtonText] = useState("");

    const { t } = useTranslation(); 

    useEffect(() => {
        const fetchUserData = async () => {
            await updateUser();
        };
        fetchUserData();
    }, []);

    const showEditInfoModal = (title, buttonText) => {
        setModalTitle(title);
        setModalButtonText(buttonText);
        setEditInfoModalVisible(true);
    };

    const showEditUsernameModal = (title, buttonText) => {
        setModalTitle(title);
        setModalButtonText(buttonText);
        setEditUsernameModalVisible(true);
    };
    
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <AppText style={styles.headerText}>{t('accountSettings.editProfile')}</AppText>
                <View style={styles.centeredView}>
                    <UserCard 
                        banner={{ uri: user.bannerUri }} 
                        avatar={{ uri: user.avatarUri }}
                        name={user.displayName}
                        username={user.username}
                    />
                    <View style={styles.editButtons}>
                        <BlackButton
                            title={t('accountSettings.editAvatar')} 
                            style={styles.editPictures} 
                            icon={require("../../assets/edit-icon.png")}
                            onPress={() => setUploadAvatarModalVisible(true)} // Show avatar modal on button press
                        />
                        <BlackButton 
                            title={t('accountSettings.editCover')} 
                            style={styles.editPictures}
                            icon={require("../../assets/edit-icon.png")}
                            onPress={() => setUploadBannerModalVisible(true)} // Show banner modal on button press
                        />
                    </View>
                    <View style={styles.settingsContainer}>
                        <SettingComponent
                            title={t('accountSettings.name')}
                            text={user.displayName}
                            icon={require("../../assets/edit-icon.png")}
                            onPress={()=> setEditDisplaynameModalVisible(true)}
                        />
                        <View style={styles.separatorContainer}>
                            <View style={styles.separator} />
                        </View>
                        <SettingComponent
                            title={t('accountSettings.username')}
                            text={"@" + user.username}
                            icon={require("../../assets/edit-icon.png")}
                            onPress={() => showEditUsernameModal(t('accountSettings.editUsername'), t('accountSettings.saveUsername'))} // Show username modal
                        />
                        <View style={styles.separatorContainer}>
                            <View style={styles.separator} />
                        </View>
                        <SettingComponent
                            title={t('accountSettings.bio')}
                            onPress={() => showEditInfoModal(t('accountSettings.editBio'), t('accountSettings.saveBio'))}
                            text={user.description}
                            icon={require("../../assets/edit-icon.png")}
                        />
                        <View style={styles.separatorContainer}>
                            <View style={styles.separator} />
                        </View>
                        <SettingComponent
                            title={t('accountSettings.personalLink')}
                            text={`eskiwi.com/creator/${user.username}`}
                            icon={require("../../assets/edit-icon.png")}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Edit Description Modal */}
            <EditInformationModal 
                modalVisible={editInfoModalVisible} 
                onRequestClose={() => setEditInfoModalVisible(false)} 
                title={modalTitle}
                buttonText={modalButtonText}
                currentInfo={user.description}
                maxCharacters={MAXIMUM_POST_DESCRIPTION_LENGTH}
                apiCall={userApi.updateDescription}
                inputLabel={t('accountSettings.bio')} // Translated label
            />

            <EditInformationModal 
                modalVisible={editDisplaynameModalVisible} 
                onRequestClose={() => setEditDisplaynameModalVisible(false)} 
                title={t('accountSettings.editDisplayName')}
                buttonText={t('accountSettings.saveDisplayName')}
                currentInfo={user.displayName}
                maxCharacters={MAXIMUM_USERNAME_LENGTH}
                apiCall={userApi.updateDisplayName} 
                inputLabel={t('accountSettings.name')} 
            />


            {/* Edit Username Modal */}
            <EditInformationModal 
                modalVisible={editUsernameModalVisible} 
                onRequestClose={() => setEditUsernameModalVisible(false)} 
                title={t('accountSettings.editUsername')}
                buttonText={t('accountSettings.saveUsername')}
                currentInfo={user.username}
                maxCharacters={MAXIMUM_USERNAME_LENGTH}
                apiCall={userApi.updateUsername} // Pass the username update API call
                inputLabel={t('accountSettings.username')} // Translated label
            />

            <UploadAvatar isVisible={uploadAvatarModalVisible} onClose={() => setUploadAvatarModalVisible(false)} /> 
            <UploadBanner isVisible={uploadBannerModalVisible} onClose={() => setUploadBannerModalVisible(false)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    headerText: {
        fontSize: 20,
        color: colors.white,
        fontFamily: 'GeistMono-Bold',
        marginTop: "5%",
        marginLeft: "5%",
    },
    centeredView: {
        alignItems: 'center',
        padding: 20,
    },
    editButtons: {
        flexDirection: 'row',
        marginTop: 20,
    },
    settingsContainer: {
        backgroundColor: colors.secondary,
        borderRadius: 10,
        marginTop: "10%",
        width: "100%",
        padding: 20,
        borderTopColor: colors.terciary,
        borderTopWidth: 1,
        paddingHorizontal: 0,
    },
    separatorContainer: {
        width: '100%',
        position: 'relative',
        height: 1,
        marginVertical: 10,
    },
    separator: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: colors.terciary,
    },
    editPictures: {
        width: "50%",
        padding: "2.5%",
        borderRadius: 10,
        marginHorizontal: "2%",
    },
});

export default AccountSettings;
