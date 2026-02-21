import React from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';

import colors from '../config/colors';

function Screen({ children, style}) {
    return (
        <SafeAreaView style={[styles.screen, style]}>
            <View style={styles.container}>
                {children}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: colors.primary,
    },
    container: {
        flex: 1,
    }
});

export default Screen;
