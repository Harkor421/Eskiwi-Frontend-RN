import { useContext } from 'react';
import AuthContext from '../auth/context';
import authStorage from '../auth/storage';
import { registerForPushNotificationsAsync } from '../hooks/useNotifications'; // Adjust the import based on your project structure

const useLogout = () => {
  const { setUser } = useContext(AuthContext);

  const logout = async () => {
    try {
      setUser(null);
      await authStorage.removeToken();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return logout;
};

export default useLogout;
