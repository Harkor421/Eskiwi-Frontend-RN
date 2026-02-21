import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as Yup from 'yup';
import authApi from '../api/auth';
import userApi from '../api/user';
import AuthContext from '../auth/context';
import authStorage from '../auth/storage';
import AppText from '../components/AppText';
import { AppForm, AppFormField, ErrorMessage, SubmitButton } from '../components/forms';
import Screen from '../components/Screen';
import colors from '../config/colors';
import { registerForPushNotificationsAsync } from '../hooks/useNotifications';
import BannedModal from '../components/modals/BannedModal';

function LoginScreen({ navigation }) {
  const { t } = useTranslation();  // Initialize the translation hook
  const authContext = useContext(AuthContext);
  const [loginFailed, setLoginFailed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Validation schema with translations
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required(t('validation.required', { field: t('loginScreen.emailLabel') }))
      .email(t('loginScreen.invalidEmail'))
      .label(t('loginScreen.emailLabel')),
    password: Yup.string()
      .required(t('validation.required', { field: t('loginScreen.passwordLabel') }))
      .label(t('loginScreen.passwordLabel')),
  });

  const handleSubmit = async ({ email, password }) => {
    try {
      const result = await authApi.login({ email, password });

      if (!result.ok) {
          if (result.data.error === "not validated") { 
            navigation.navigate("EmailVerification", {email, password});
            return;
          }

          if (result.data.error === "banned user") {
            setModalVisible(true);
            return;
          }

        setLoginFailed(true);
        return;
      }

      setLoginFailed(false);
      authStorage.storeToken(result.data.accessToken);
      const user = await authApi.getUser();
      const expoToken = await registerForPushNotificationsAsync();
      await userApi.uploadExpotoken(expoToken);
      authContext.setUser(user.data);
    } catch (error) {
      setLoginFailed(true);
      console.error('Login error:', error);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("RecoverPassword");
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <Screen style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'position' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 70}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Image style={styles.logo} source={require('../assets/ESKIWI.png')} />
          <View style={styles.loginbox}>
            <View style={styles.content}>
              <Image style={styles.signinlogo} source={require('../assets/sign-in-logo.png')} />
              <AppText style={styles.headerText}>{t('loginScreen.headerText')}</AppText>
              <AppText style={styles.description} numberOfLines={3} ellipsizeMode="tail">
                {t('loginScreen.description')}
              </AppText>

              <AppForm
                initialValues={{ email: '', password: '' }}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}  // Pass the translated validation schema
              >
                <AppText style={styles.fieldTitle}>{t('loginScreen.emailLabel')}</AppText>
                <AppFormField
                  autoCapitalize="none"
                  name="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  icon={require('../assets/mail-icon.png')}
                  placeholder={t('loginScreen.emailPlaceholder')}
                  placeholderTextColor={'#7A7A83'}
                />
                <View style={styles.passwordContainer}>
                  <AppText style={styles.fieldTitle}>{t('loginScreen.passwordLabel')}</AppText>
                  <TouchableOpacity onPress={handleForgotPassword}>
                    <AppText style={styles.forgotPassword}>{t('loginScreen.forgotPassword')}</AppText>
                  </TouchableOpacity>
                </View>
                <AppFormField
                  name="password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="default"
                  icon={require('../assets/lock-icon.png')}
                  textContentType="password"
                  secureTextEntry
                  placeholder={t('loginScreen.passwordPlaceholder')}
                  placeholderTextColor={'#7A7A83'}
                />
                <ErrorMessage error={t('loginScreen.errorMessage')} visible={loginFailed} />
                <View style={styles.submitButtonContainer}>
                  <SubmitButton title={t('loginScreen.submitButton')} />
                </View>
              </AppForm>
              <View style={styles.registerContainer}>
                <AppText style={styles.registerText}>{t('loginScreen.notRegistered')}</AppText>
                <TouchableOpacity onPress={handleRegister}>
                  <AppText style={styles.registerLink}>{t('loginScreen.registerHere')}</AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <BannedModal
            modalVisible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            title={t('loginScreen.bannedMessage')}
            buttonText={t('loginScreen.okButton')}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: '5%',
    paddingBottom: '20%', // Increase padding at the bottom for better scrollability
  },
  logo: {
    width: "35%",
    height: 100,
    marginTop: 50,
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
    width: "97%",
    alignSelf: 'center',
    paddingVertical: '5%',
  },
  content: {
    flex: 1,
    paddingHorizontal: "5%",
  },
  fieldTitle: {
    color: colors.white,
    fontSize: 14
  },
  forgotPassword: {
    color: '#52525B',
    fontWeight: '500',
    fontSize: 12,
    textAlign: 'right',
    textDecorationLine: 'underline',
  },
  description: {
    color: '#7A7A83',
    fontSize: 14,
    paddingHorizontal: 15,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: '10%',
  },
  passwordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submitButtonContainer: {
    marginTop: "8%",
  },
  registerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: colors.white,
    fontSize: 14,
    marginBottom: 5,
  },
  registerLink: {
    color: "#7A7A83",
    fontSize: 14,
    fontWeight: 500,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
