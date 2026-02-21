import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import authApi from '../api/auth';
import userApi from '../api/user';
import AuthContext from '../auth/context';
import authStorage from '../auth/storage'; // Ensure you import the authStorage
import AppText from '../components/AppText';
import AppButton from '../components/buttons/AppButton';
import DigitInput from '../components/DigitInput';
import Screen from '../components/Screen';
import colors from '../config/colors';
import { registerForPushNotificationsAsync } from '../hooks/useNotifications';

function EmailVerificationScreen({ route, navigation }) {
  const [code, setCode] = useState(new Array(6).fill(''));
  const authContext = useContext(AuthContext);
  const { email, password, isPasswordChange} = route.params; // Ensure you access email and password from route params
  const { t } = useTranslation();
  const refs = useRef([]);

  useEffect(() => {
    const sendVerificationCode = async () => {
      try {
        const result = await authApi.sendVerificationCode(email);
        if (!result.ok) {
          console.log('Failed to send verification code:', result);
          return;
        }
        console.log('Verification code sent successfully');
      } catch (error) {
        console.error('Error sending verification code:', error);
      }
    };

    sendVerificationCode();
  }, [email]);

  const handleChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Automatically focus the next input field
    if (value && index < 5) {
      refs.current[index + 1].focus();
    }
  };

  const handleBackspace = (index) => {
    if (index > 0) {
      refs.current[index - 1].focus();
    }
  };

  const handleVerifyCode = async () => {
    const verificationCode = code.join('');
    
  
    try {
      let result;
  
      if (isPasswordChange) {
        
        result = await authApi.changePassword({email, code: verificationCode, password});
      } else {
        // For regular email verification
        result = await authApi.validateVerificationCode(email, verificationCode);
      }
  
      console.log(result);
      if (!result.ok) {
        Alert.alert(t('emailVerificationScreen.error'), t('emailVerificationScreen.invalidCode'));
        return;
      }
  
      if (!isPasswordChange) {
        // If it's not a password change, continue to login after verification
        result = await authApi.login({ email, password });
  
        if (!result.ok) {
          console.log('Login failed:', result);
          return;
        }
  
        if (result.data.verified === "false") { // if account isn't verified
          navigation.navigate("EmailVerification", { email });
          console.log("You have to verify your account");
          return;
        }
  
        console.log('Login success!');
  
        authStorage.storeToken(result.data.accessToken);
  
        const user = await authApi.getUser();
        const expoToken = await registerForPushNotificationsAsync();
        await userApi.uploadExpotoken(expoToken);
        authContext.setUser(user.data);
      } else {
        navigation.goBack(); 

        // Adding a timeout before navigation and closing the modal
        setTimeout(() => {
          try{
            navigation.goBack(); 
         }catch{

         }
        }, 100);  // 1-second delay (1000ms)
      }
  
    } catch (error) {
      console.error('Error validating verification code:', error);
    }
  };
  
  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image style={styles.logo} source={require('../assets/ESKIWI.png')} />
        <View style={styles.content}>
          <View style={styles.loginbox}>
            <Image style={styles.signinlogo} source={require('../assets/sign-in-logo.png')} />
            <AppText style={styles.description}>
              {t('emailVerificationScreen.description', { email })}
            </AppText>
          </View>
          <View style={styles.verificationContainer}>
            {code.map((digit, index) => (
              <DigitInput
                key={index}
                value={digit}
                onChange={(value) => handleChange(value, index)}
                onBackspace={() => handleBackspace(index)}
                ref={(ref) => refs.current[index] = ref}
                style={styles.digitInput}
              />
            ))}
          </View>
          <AppText style={styles.description}>
            {t('emailVerificationScreen.enterCode')}
          </AppText>
          <AppButton style = {{marginHorizontal: 10}} title={t('emailVerificationScreen.verifyButton')} onPress={handleVerifyCode} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 16,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: '50%',
    height: 100,
    marginTop: 50,
    resizeMode: 'contain',
  },
  signinlogo: {
    marginTop: 16,
    marginBottom: 16,
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  loginbox: {
    borderRadius: 20,
    backgroundColor: colors.secondary,
    borderColor: colors.grayline,
    borderWidth: 1,
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  verificationContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  digitInput: {
    width: 40,
    height: 40,
    marginHorizontal: 5,
    textAlign: 'center',
    fontSize: 18,
    borderWidth: 1,
    borderColor: colors.grayline,
  },
  description: {
    color: '#7A7A83',
    fontSize: 16,
    paddingHorizontal: 15,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default EmailVerificationScreen;
