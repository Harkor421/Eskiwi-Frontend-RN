import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import BlackButton from '../components/buttons/BlackButton';
import Screen from '../components/Screen';
import colors from '../config/colors';

function  FavouriteScreen({navigation}) {
    const [selectedTab, setSelectedTab] = useState('chatsAbiertos');

    return (
        <Screen style={styles.screen}>
            <ScrollView>
                <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 10, alignItems: 'center' }}>
                    <AppText style={styles.title}>Tus notificaciones</AppText>
                    <View style={styles.viewMoreContainer}>
                        <BlackButton title="Ajustes" style={styles.viewMore} />
                    </View>
                </View>
                <View style={styles.container}>
                <Image style = {styles.icon} source={require("../assets/notification-email.png")} />
                    <AppText style={styles.header1}>No hay notificaciones por ahora!</AppText>
                    <AppText style={styles.header2}>Descubre nuevos o encuentra tus creadores favoritos y compra un chat con ellos</AppText>
                </View>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        marginTop: "30%",
        backgroundColor: colors.primary,
    },
    findCreators: {
        marginTop: "10%",
        width: "80%",
        padding: "4%", 
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
    title: {
        color: colors.white,
        fontSize: 20,
        fontWeight: 700,
        fontFamily: 'GeistMono-Bold' 
    },
    viewMoreContainer: {
        flex: 1,
        alignItems: 'flex-end', // Align button to the right
    },
    viewMore: {
        // Adjust button styles as needed
        width: "50%",
        padding: "3%",
        marginRight: 10,
        borderRadius: 8,

    },
    switch: {
        backgroundColor: colors.terciary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: "2%",
        marginTop: "8%",
        borderRadius: 10,
        padding: 8,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    selected: {
        backgroundColor: '#FA3D86',
        borderWidth: 1,
        borderTopColor: '#FF8FBA',
        borderColor: '#AF134F',
        borderRadius: 10,
    },
    title2: {
        color: colors.white,
        fontSize: 17,
        fontWeight: 600,
        fontFamily: 'GeistMono-Light' 

    },
    icon:{
        width: 100,
        height: 100,
    },
});

export default FavouriteScreen;
