import Toast from 'react-native-toast-message';
import colors from '../config/colors';

const useToastMessage = () => {
  const showToast = (type, message, title = '') => {
    Toast.show({
      type: type,
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 60,
      bottomOffset: 40,
      text1Style: {fontFamily: 'GeistMono-Regular'},
      text2Style: {fontFamily: 'GeistMono-Regular', color: colors.black},

    });
  };

  const showSuccess = (message, title = 'Success') => {
    showToast('success', message, title);
  };

  const showError = (message, title = 'Error') => {
    showToast('error', message, title);
  };

  const showInfo = (message, title = 'Info') => {
    showToast('info', message, title);
  };

  return {
    showSuccess,
    showError,
    showInfo,
  };
};

export default useToastMessage;
