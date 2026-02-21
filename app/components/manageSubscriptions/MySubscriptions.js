import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { FlatList, Image, StyleSheet, View } from 'react-native';
import colors from '../../config/colors';
import AppText from '../AppText';
import GemButton from '../buttons/GemButton';
import SubscriptionPreview from './SubscriptionPreview';
import userApi from '../../api/user';
import AuthContext from '../../auth/context';

function MySubscriptions({ navigation }) {
    const { t } = useTranslation(); 
    const { user } = useContext(AuthContext);
    const [members, setMembers] = useState([]);
    const [hasSubscriptions, setHasSubscriptions] = useState(false);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await userApi.getMySubscriptions(1); 
                setMembers(response.data.subscriptions);
                console.log(response.data.subscriptions)
                setHasSubscriptions(response.data.subscriptions.length > 0); // Check for subscriptions
            } catch (error) {
                console.error("Error fetching subscriptions:", error);
            }
        };

        if (user) {
            fetchSubscriptions(); 
        }
    }, [user]);

    return (
        <View style={styles.container}>
            {hasSubscriptions ? (
                <FlatList
                    scrollEnabled={false}
                    data={members}
                    keyExtractor={item => item.creator.id.toString()} 
                    renderItem={({ item }) => (
                        <SubscriptionPreview
                            name={item.creator.username}
                            avatar={{ uri: item.creator.avatarUri }}
                            tier={item.tier}
                            date={item.date}
                            navigation={navigation}
                        />
                    )}
                    style={styles.flatList}
                    contentContainerStyle={styles.flatListContent}
                />
            ) : (
                <>
                    <Image source={require("../../assets/chat-email.png")} />
                    <AppText style={styles.header1}>{t('mySubscriptions.noSubscriptions')}</AppText>
                    <AppText style={styles.header2}>{t('mySubscriptions.discoverCreators')}</AppText>
                    <GemButton 
                        style={styles.findCreators} 
                        icon={require("../../assets/diagonal-right-arrow.png")}
                        iconPosition={"right"}
                        title={t('mySubscriptions.findCreators')} 
                        onPress={() => navigation.navigate("SearchNavigator")}
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        marginTop: "10%",
    },
    flatList: {
        width: '100%',
    },
 
    header1: {
        color: colors.white,
        fontSize: 20,
        marginTop: "8%",
    },
    header2: {
        color: colors.white,
        fontSize: 16,
        textAlign: 'center',
        marginTop: "2%",
    },
    findCreators: {
        marginTop: "10%",
        width: "80%",
        padding: "4%", 
    },
});

export default MySubscriptions;
