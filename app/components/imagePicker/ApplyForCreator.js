import React, { useEffect, useState, useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import colors from '../../config/colors';
import AppText from '../AppText';
import { GemButton } from '../buttons';
import Screen from '../Screen';
import InstagramLogin from 'react-native-instagram-login';
import authApi from '../../api/auth';
import ErrorModal from '../modals/ErrorModal'; // Import the ErrorModal
import AuthContext from '../../auth/context';


const CLIENT_ID = '1068728098050491'; 
const CLIENT_SECRET = '1566780a5be0a019920e5442711285f6'; 
const REDIRECT_URI = 'https://eskiwi.com/'; 

WebBrowser.maybeCompleteAuthSession();

const onClear = () => {
    CookieManager.clearAll(true)
      .then((res) => {
        setToken(null);
      });
  };

function ApplyForCreator({ navigation, route }) {
    const { t } = useTranslation();
    const insRef = useRef();
    const [token, setToken] = useState(null);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const {updateUser} = useContext(AuthContext);

    useEffect(() => {
        const verifyToken = async () => {
            if (token) {
                console.log("Token updated:", token);
                try {
                    const response = await authApi.verifyCreator(token.access_token); 
                    if (response.data.approved === false){
                        setErrorMessage("Actualmente no cumples con los requisitos mínimos para ser creador en Eskiwi. Puedes volver a intentar cuando cumplas con todos los requisitos, o si lo prefieres, puedes optar por ser considerado en nuestra lista de espera.");
                        setErrorModalVisible(true); // Show the error modal
                    }
                    else{
                        updateUser();
                    }
                } catch (error) {
                    setErrorMessage("No cumples con los requisitos minimos para ser creador en Eskiwi, vuelve a intentar cuando cumplas todos los requisitos.");
                    setErrorModalVisible(true); // Show the error modal
                }
            }
        };

        verifyToken();
    }, [token]); 

    const handleRetry = () => {
        setErrorModalVisible(false);
        // You can implement any retry logic here, if needed.
    };

    return (
        <Screen style={styles.container}>
            <View style={styles.scrollContainer}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.centeredView}>
                        <AppText style={styles.header}>{"Aplica para Creador"}</AppText>
                        <Image 
                            source={require('../../assets/ouch.png')} 
                            style={styles.image} 
                        />
                        <AppText style={styles.body}>
                            {"Para poder crear contenido en Eskiwi debes aplicar como creador vinculando tu cuenta de Instagram. Tu cuenta debe tener más de 10,000 seguidores. En el caso de que no, serás ubicado en una lista de espera y se te notificará cuando tu solicitud sea procesada."}
                        </AppText>
                        <GemButton
                            title={"Vincula tu cuenta de Instagram"}
                            onPress={() => insRef.current.show()}
                            icon={require('../../assets/instagram.png')}
                        />
                        <InstagramLogin
                                ref={insRef}
                                appId={CLIENT_ID}
                                appSecret={CLIENT_SECRET}
                                redirectUrl={REDIRECT_URI}
                                scopes={['business_basic']}
                                onLoginSuccess={(token) => {
                                    setToken(token);
                                }}
                                onLoginFailure={(data) => {
                                    setErrorMessage("Login failed. Please try again.");
                                    setErrorModalVisible(true);
                                    console.log(data);
                                }}
                            />

                        <AppText style={styles.body2}>
                            {"Ten en cuenta que deberás tener una cuenta de creador o de empresa en Instagram para poder hacer la vinculación."}
                        </AppText>
                    </View>
                </ScrollView>
            </View>

            {/* Error Modal */}
            <ErrorModal
                modalVisible={errorModalVisible}
                onRequestClose={handleRetry}
                errorMessage={errorMessage}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    header: { 
        fontFamily: 'GeistMono-Bold',
        fontSize: 26,
        textAlign: 'center',
        marginVertical: 20,
    },  
    scrollContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    scrollView: {
        flexGrow: 1,
    },
    centeredView: {
        alignItems: 'center',
        padding: 20,
        justifyContent: 'center',
    },
    image: {
        width: 150,
        height: 150,
        marginVertical: 30,
        resizeMode: 'contain',
    },
    body: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 14,
    },
    body2: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 12,
        color: '#7A7A83',
    },
});

export default ApplyForCreator;
