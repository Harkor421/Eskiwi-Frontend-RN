import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, View } from 'react-native';
import postsApi from '../../api/posts';
import AuthContext from '../../auth/context';
import colors from '../../config/colors';
import AppText from '../AppText';
import CustomCheckBox from '../CustomCheckBox';
import { BlackButton, DeleteButton } from '../buttons';

const ReportModal = ({ modalVisible, onRequestClose, comment, comment_creator, reload }) => {
    
    const { user } = useContext(AuthContext);
    const {t} = useTranslation();

    const [reportOptions, setReportOptions] = useState({
        inappropriateContent: false,
        spam: false,
        harassment: false,
        violence: false,
        hateSpeech: false,
        nudity: false,
        copyrightViolation: false,
        other: false,
    });

    const handleReportAction = () => {
  
    };

    const handleHideComment = async () => {
      const response = await postsApi.deleteComment(comment.id);
      console.log(response);
      if(response.ok)
      {
        onRequestClose();
        reload();
      }
    };

    const toggleReportOption = (option) => {
        setReportOptions({ ...reportOptions, [option]: !reportOptions[option] });
    };

    // Check if the user has 'admin' or 'creator' role
    const hasAdminOrCreatorRole = user.roles && (user.roles.includes('admin') || comment_creator.Id === user.Id);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={onRequestClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalView}>
                    {/* Header */}
                    <View style={styles.header}>
                        <AppText style={styles.modalText}>{t("reportComment.title")}</AppText>
                    </View>

                    {/* Report Options */}
                    <View style={styles.reportOptions}>
                        <View style={styles.optionContainer}>
                            <CustomCheckBox
                                checked={reportOptions.inappropriateContent}
                                onChange={() => toggleReportOption('inappropriateContent')}
                            />
                            <AppText style={styles.optionText}>{t("reportComment.innapropiate")}</AppText>
                        </View>
                        <View style={styles.optionContainer}>
                            <CustomCheckBox
                                checked={reportOptions.harassment}
                                onChange={() => toggleReportOption('harassment')}
                            />
                            <AppText style={styles.optionText}>{t("reportComment.harassment")}</AppText>
                        </View>
                        <View style={styles.optionContainer}>
                            <CustomCheckBox
                                checked={reportOptions.violence}
                                onChange={() => toggleReportOption('violence')}
                            />
                            <AppText style={styles.optionText}>{t("reportComment.violence")}</AppText>
                        </View>
                        <View style={styles.optionContainer}>
                            <CustomCheckBox
                                checked={reportOptions.hateSpeech}
                                onChange={() => toggleReportOption('hateSpeech')}
                            />
                            <AppText style={styles.optionText}>{t("reportComment.hateSpeech")}</AppText>
                        </View>
                        <View style={styles.optionContainer}>
                            <CustomCheckBox
                                checked={reportOptions.nudity}
                                onChange={() => toggleReportOption('nudity')}
                            />
                            <AppText style={styles.optionText}>{t("reportComment.nudeSpeech")}</AppText>
                        </View>
                        <View style={styles.optionContainer}>
                            <CustomCheckBox
                                checked={reportOptions.copyrightViolation}
                                onChange={() => toggleReportOption('copyrightViolation')}
                            />
                            <AppText style={styles.optionText}>{t("reportComment.copyright")}</AppText>
                        </View>
                    </View>
                    <View style = {{width: "100%"}}>
                    {/* Render "Ocultar Comentario" button if user has admin or creator role */}
                    {hasAdminOrCreatorRole && (
                        <DeleteButton title={"Ocultar Comentario"} onPress={handleHideComment} style={{ marginBottom: 10 }} />
                    )}

                    <DeleteButton title={"Reportar"} onPress={handleReportAction} style={{ marginBottom: 10 }} />
                    <BlackButton title={"Cerrar"} onPress={onRequestClose} />
                    </View>
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
    modalView: {
        width: 300,
        backgroundColor: colors.secondary,
        borderRadius: 10,
        alignItems: 'center',
        padding: 20,
    },
    header: {
        marginBottom: 15,
        backgroundColor: colors.primary,
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    modalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.white,
    },
    reportOptions: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 15,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    optionText: {
        flex: 1,
        marginLeft: 20,
        fontSize: 12,
        color: colors.white,
        fontFamily: 'GeistMono-Regular',
    },
});

export default ReportModal;
