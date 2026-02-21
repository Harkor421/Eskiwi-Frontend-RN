import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View, Linking, Alert } from 'react-native';
import * as Yup from 'yup';
import authApi from '../api/auth';
import AuthContext from '../auth/context';
import AppText from '../components/AppText';
import CustomCheckBox from '../components/CustomCheckBox';
import { AppForm, AppFormField, ErrorMessage, SubmitButton } from '../components/forms';
import DatePicker from '../components/modals/DatePicker';
import SuccessModal from '../components/modals/SuccessModal'; // Import SuccessModal
import Screen from '../components/Screen';
import colors from '../config/colors';

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required().label('First Name'),
  lastname: Yup.string().required().label('Last Name'),
  username: Yup.string().required().label('Username'),
  email: Yup.string().required().email().label('Email'),
  displayName: Yup.string().required().label('Display Name'), 
  password: Yup.string().required().min(6).label('Password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

function RegisterScreen({ navigation }) {
  const { t } = useTranslation();
  const authContext = useContext(AuthContext);
  const [registrationFailed, setRegistrationFailed] = useState(false);
  const [birthdate, setBirthdate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State for SuccessModal
  const [termsAccepted, setTermsAccepted] = useState(false); // State for terms acceptance

  const handleSubmit = async ({ firstname, lastname, username, displayName, email, password }) => {
    if (!termsAccepted) {
      Alert.alert(t('registerScreen.termsRequired'));
      return;
    }
  
    // Calculate age
    const today = new Date();
    const age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    const isUnderage = age < 18 || (age === 18 && monthDiff < 0);
  
    if (isUnderage) {
      Alert.alert(t('registerScreen.ageRestrictionError'), t('registerScreen.ageRestrictionMessage'));
      return;
    }
  
    const result = await authApi.register({ firstname, lastname, username, displayName, email, password, birthdate });
    
    // Handle API errors and display them
    if (!result.ok) {
      setRegistrationFailed(true);
      Alert.alert(t('registerScreen.registrationError'), result.data.error || t('registerScreen.defaultErrorMessage')); // Display error message from API or a default message
      return;
    }
  
    setRegistrationFailed(false);
    console.log('Registration success:', result);
    setModalVisible(true);
  };
  

  const handleDateChange = (date) => {
    setBirthdate(date);
    setDatePickerVisible(false); // Hide the DatePicker after selecting a date
  };

  // Function to handle terms link
  const handleTermsLink = () => {
    Linking.openURL('https://eskiwi.com/terms'); // Replace with your actual terms URL
  };

  const formattedDate = birthdate.toDateString(); // Format the date to a readable string

  const handleCloseModal = () => {
    setModalVisible(false);
    navigation.navigate('Login'); // Navigate to a different screen if needed
  };

  return (
    <Screen style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'position' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 70}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Image
            style={styles.logo}
            source={require('../assets/ESKIWI.png')}
          />
          <View style={styles.loginbox}>
            <View style={styles.content}>
              <Image
                style={styles.signinlogo}
                source={require('../assets/sign-in-logo.png')}
              />
              <AppText style={styles.headerText}>{t('registerScreen.headerText')}</AppText>
              <AppText style={styles.description} numberOfLines={3} ellipsizeMode="tail">
                {t('registerScreen.description')}
              </AppText>

              <AppForm
                initialValues={{ firstname: '', lastname: '', displayName: '', username: '', email: '', password: '', confirmPassword: '', birthdate: '' }}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
              >
                <View style={styles.nameContainer}>
                  <View style={styles.nameField}>
                    <AppText style={styles.label}>{t('registerScreen.firstNameLabel')}</AppText>
                    <AppFormField
                      autoCapitalize="none"
                      name="firstname"
                      autoCorrect={false}
                      keyboardType="default"
                      placeholder={t('registerScreen.firstNamePlaceholder')}
                      placeholderTextColor={'#7A7A83'}
                    />
                  </View>
                  <View style={styles.nameField}>
                    <AppText style={styles.label}>{t('registerScreen.lastNameLabel')}</AppText>
                    <AppFormField
                      autoCapitalize="none"
                      name="lastname"
                      autoCorrect={false}
                      keyboardType="default"
                      placeholder={t('registerScreen.lastNamePlaceholder')}
                      placeholderTextColor={'#7A7A83'}
                    />
                  </View>
                </View>
                <AppText style={styles.label}>{t('registerScreen.displayNameLabel')}</AppText>
                  <AppFormField
                    autoCapitalize="none"
                    name="displayName"
                    autoCorrect={false}
                    keyboardType="default"
                    placeholder={t('registerScreen.displayNamePlaceholder')}
                    placeholderTextColor={'#7A7A83'}
                  />
                <AppText style={styles.label}>{t('registerScreen.usernameLabel')}</AppText>
                <AppFormField
                  autoCapitalize="none"
                  name="username"
                  autoCorrect={false}
                  keyboardType="default"
                  icon={require('../assets/user.png')}
                  placeholder={t('registerScreen.usernamePlaceholder')}
                  placeholderTextColor={'#7A7A83'}
                />
                <AppText style={styles.label}>{t('registerScreen.emailLabel')}</AppText>
                <AppFormField
                  autoCapitalize="none"
                  name="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  icon={require('../assets/mail-icon.png')}
                  placeholder={t('registerScreen.emailPlaceholder')}
                  placeholderTextColor={'#7A7A83'}
                  secureTextEntry= {false}
                />
                <AppText style={styles.label}>{t('registerScreen.passwordLabel')}</AppText>
                <AppFormField
                  name="password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="default"
                  icon={require('../assets/lock-icon.png')}
                  textContentType="password"
                  secureTextEntry
                  placeholder={t('registerScreen.passwordPlaceholder')}
                  placeholderTextColor={'#7A7A83'}
                />
                <AppText style={styles.label}>{t('registerScreen.confirmPasswordLabel')}</AppText>
                <AppFormField
                  name="confirmPassword"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="default"
                  icon={require('../assets/lock-icon.png')}
                  textContentType="password"
                  secureTextEntry
                  placeholder={t('registerScreen.confirmPasswordPlaceholder')}
                  placeholderTextColor={'#7A7A83'}
                />
                <AppText style={styles.label}>{t('registerScreen.birthdateLabel')}</AppText>
                <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
                  <AppFormField
                    name="birthdate"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="default"
                    value={formattedDate}
                    icon={require('../assets/calendar.png')}
                    placeholder={formattedDate || t('registerScreen.birthdatePlaceholder')}
                    placeholderTextColor={'#7A7A83'}
                    editable={false}
                  />
                </TouchableOpacity>
                <DatePicker
                  date={birthdate}
                  onDateChange={handleDateChange}
                  show={isDatePickerVisible}
                  onClose={() => setDatePickerVisible(false)}
                />
                <ErrorMessage error={t('registerScreen.errorMessage')} visible={registrationFailed} />
                
                <View style={styles.termsContainer}>
                  <CustomCheckBox
                    style={{marginBottom: 20,}} 
                    checked={termsAccepted} 
                    label={t("registerScreen.acceptTerms")} 
                    onChange={() => setTermsAccepted(!termsAccepted)} 
                  />
                  <TouchableOpacity onPress={handleTermsLink}>
                    <AppText style = {styles.terms}>{t("registerScreen.terms")}</AppText>
                  </TouchableOpacity>
                  <SubmitButton title={t('registerScreen.submitButton')} />
                </View>
              </AppForm>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <SuccessModal
        modalVisible={modalVisible}
        onRequestClose={handleCloseModal}
        title={"Tu cuenta se ha creado exitosamente!"}
        buttonText={"Inicia sesión"}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: "35%",
    height: 100,
    marginTop: 40,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.white,
    fontFamily: 'GeistMono-Bold',
    marginBottom: "5%",
    textAlign: 'center',
  },
  signinlogo: {
    marginTop: '3%',
    marginBottom: '4%',
    width: 50,
    height: 50,
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  loginbox: {
    borderRadius: 20,
    backgroundColor: colors.secondary,
    borderColor: colors.grayline,
    borderWidth: 1,
    width: "90%",
    alignSelf: 'center',
    paddingVertical: 20,
    marginBottom: "50%",
  },
  content: {
    paddingHorizontal: "5%",
  },
  description: {
    color: '#7A7A83',
    fontSize: 16,
    paddingHorizontal: 15,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: '10%',
  },
  nameContainer: {
    flexDirection: 'row',
  },
  nameField: {
    flex: 1,
    marginHorizontal: 4,
  },
  terms: {
    fontSize: 12,
    marginBottom: 20,
    color: colors.bluelink,
    textDecorationLine: 'underline',
  },
  label: {
    color: colors.white,
    fontWeight: 'bold',
  },
  termsContainer: {
    marginTop: "8%",
    alignItems: 'center', 
  },
});

export default RegisterScreen;
