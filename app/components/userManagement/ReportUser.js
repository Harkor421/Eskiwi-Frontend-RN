import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, View } from 'react-native';
import colors from '../../config/colors'; // Importing the same colors used in PostManagement
import AppText from '../AppText';
import { DeleteButton } from '../buttons';
import CustomCheckBox from '../CustomCheckBox'; // Adjust the path based on your folder structure


const ReportUser = () => {

  const {t} = useTranslation();
  const [selectedReasons, setSelectedReasons] = useState({
    spam: false,
    inappropriate: false,
    harassment: false,
    falseInfo: false,
    hateSpeech: false,
  });

  const handleReasonChange = (reason) => {
    setSelectedReasons((prev) => ({
      ...prev,
      [reason]: !prev[reason],
    }));
  };

  const handleSubmitReport = () => {
    const selected = Object.keys(selectedReasons).filter(
      (reason) => selectedReasons[reason]
    );

    if (selected.length === 0) {
      Alert.alert('Error', 'Please select at least one reason to report.');
      return;
    }

    Alert.alert('Report Submitted', `You reported the post for: ${selected.join(', ')}`);
  };

  return (
    <View style={styles.container}>
      <AppText style={styles.title}>{t('postManagement.reportReasons')}</AppText>
      <CustomCheckBox
        label={t('postManagement.spam')}
        checked={selectedReasons.spam}
        onChange={() => handleReasonChange('spam')}
      />
      <CustomCheckBox
        label={t('postManagement.inappropriate')}
        checked={selectedReasons.inappropriate}
        onChange={() => handleReasonChange('inappropriate')}
      />
      <CustomCheckBox
        label={t('postManagement.harassment')}
        checked={selectedReasons.harassment}
        onChange={() => handleReasonChange('harassment')}
      />
      <CustomCheckBox
        label={t('postManagement.falseInfo')}
        checked={selectedReasons.falseInfo}
        onChange={() => handleReasonChange('falseInfo')}
      />
      <CustomCheckBox
        label={t('postManagement.hateSpeech')}
        checked={selectedReasons.hateSpeech}
        onChange={() => handleReasonChange('hateSpeech')}
      />

      <View style={styles.submitButton}>
        <DeleteButton
        title={t('postManagement.sendReport')}
        onPress={handleSubmitReport}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary, // Use primary background color
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign:'center',
    fontFamily:'GeistMono-Regular',
    color: colors.white, // Use white for title text
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 20,
  },
});

export default ReportUser;
