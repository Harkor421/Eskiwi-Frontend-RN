import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import AuthContext from '../../auth/context';
import colors from '../../config/colors';
import routes from '../../navigation/routes';
import SettingNavigationComponent from '../accountSettings/SettingNavigationComponent';
import AppText from '../AppText';
import { GemButton } from '../buttons';
import { ListItem } from '../items';
import AddInformation from '../modals/AddInformation';
import SendPostModal from '../modals/SendPostModal'; 
import SuccessModal from '../modals/SuccessModal';
import Screen from '../Screen';
import ChangeVisibility from '../modals/ChangeVisibility';

function EditPostDetails({ navigation, route }) {
    const { t } = useTranslation();
    const { user, setUser } = useContext(AuthContext);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [postTitle, setPostTitle] = useState(t("editPostDetails.addTitle"));
    const [postDescription, setPostDescription] = useState(t("editPostDetails.addDescription"));
    
    // Initialize tiers with objects containing label and value
    const [tiers, setTiers] = useState([{ label: t("editPostDetails.subscriptionDescription"), value: 0 }]); 

    const { imageUris } = route.params;

    const [addInfoModalVisible, setAddInfoModalVisible] = useState(false);
    const [sendPostModalVisible, setSendPostModalVisible] = useState(false);
    const [changeVisibilityModalVisible, setchangeVisibilityModalVisible] = useState(false);

    const [postInfo, setPostInfo] = useState({ title: '', description: '' });
    const addInfoRef = useRef(null); 

    const closeSuccessModal = () => {
        setIsSuccessModalVisible(false);
    };

    const openAddInfoModal = () => {
        setAddInfoModalVisible(true);
    };

    const closeAddInfoModal = () => {
        setAddInfoModalVisible(false);
    };

    const handleAddInfo = (info) => {
        setPostInfo(info);
        setPostTitle(info.title);
        setPostDescription(info.description);
    };
    
    const handleChangeVisibility = (tier) => {
        setTiers(tier);
    };

    const openSendPostModal = () => {
        setSendPostModalVisible(true);
    };

    const closeSendPostModal = () => {
        setSendPostModalVisible(false);
    };

    const closeChangeVisibilityModal = () => {
        setchangeVisibilityModalVisible(false);
    };

    const openChangeVisibilityModal = () => {
        setchangeVisibilityModalVisible(true);
    };

    return (
        <Screen style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require("../../assets/down-arrow.png")} style={styles.back} />
                </TouchableOpacity>
                <View style={styles.listItemContainer}>
                    <ListItem
                        title={t("createPostScreen.headerTitle")}
                        subTitle={`@${user.username}`}
                        avatar={{ uri: user.avatarUri }}
                        avatarSize={40}
                    />
                </View>
            </View>
            <View style={styles.scrollContainer}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.centeredView}>
                        <SettingNavigationComponent
                            useImage={true}
                            logo={imageUris[0]}
                            secondLogo={require("../../assets/edit-icon.png")}
                            title={postTitle}
                            text={postDescription}
                            isFirst={true}
                            onPress={openAddInfoModal} 
                        />
                        <AppText style={styles.headerText}>{t("editPostDetails.header")}</AppText>
                        <View style={styles.settingsContainer}>
                            <SettingNavigationComponent
                                logo={require("../../assets/eye-icon.png")}
                                title={t("editPostDetails.subscriptionTier")}
                                text={tiers.map(tier => tier.label).join(', ')} // Join labels into a string
                                isFirst={true}
                                onPress={openChangeVisibilityModal}
                            />
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <GemButton
                        title={t("next")}
                        style={styles.gemButton}
                        onPress={openSendPostModal} 
                    />
                </View>
            </View>
            <AddInformation
                ref={addInfoRef}
                modalVisible={addInfoModalVisible}
                onRequestClose={closeAddInfoModal}
                onAddInfo={handleAddInfo}
            />
            <SendPostModal
                navigation={navigation}
                modalVisible={sendPostModalVisible}
                onRequestClose={closeSendPostModal}
                images={imageUris}
                postTitle={postTitle}
                postDescription={postDescription}
                tiers={tiers}
            />
            <SuccessModal
                modalVisible={isSuccessModalVisible}
                onRequestClose={closeSuccessModal}
                title={"Post created successfully"}
                buttonText={"Ok!"}
            />
            <ChangeVisibility
                navigation={navigation}
                modalVisible={changeVisibilityModalVisible}
                onRequestClose={closeChangeVisibilityModal}
                onSelectTier={handleChangeVisibility}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    headerContainer: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.grayline,
        borderTopColor: colors.grayline,
        width: '100%',
        backgroundColor: colors.secondary,
    },
    back: {
        width: 20,
        height: 20,
        marginRight: "3%",
    },
    headerText: {
        marginTop: "5%",
        fontSize: 20,
        fontWeight: '700',
        color: colors.white,
        fontFamily: "GeistMono-Bold"
    },
    scrollContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    scrollView: {
        flexGrow: 1,
    },
    centeredView: {
        padding: 20,
    },
    settingsContainer: {
        backgroundColor: colors.secondary,
        borderRadius: 10,
        marginTop: "10%",
        borderTopColor: colors.terciary,
        borderTopWidth: 1,
    },
    listItemContainer: {
        flex: 1,
        alignItems: 'center',
    },
    buttonContainer: {
        alignItems: 'center',
        borderTopColor: colors.terciary,
        borderTopWidth: 1,
        paddingBottom: 20,
    },
    gemButton: {
        marginTop: 20,
        padding: 10,
        width: '95%',
    },
});

export default EditPostDetails;
