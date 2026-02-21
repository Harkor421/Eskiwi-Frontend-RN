import React from 'react';
import { Image, StyleSheet, TextInput, View } from 'react-native';

import colors from '../config/colors';

function AppTextInput({ icon, ...otherProps }) {
    return (
        <View style={styles.container}>
            {icon && <Image source={icon} style={styles.icon} />}
            <TextInput style={styles.textInput} {...otherProps} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.terciary,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: 'center',  // Align items in the center
        justifyContent: 'flex-start',  // Align items to the start
        width: '100%',
        padding: 15,
        marginVertical: 10,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#202024',
    },
    textInput: {
        flex: 1,  // Take up remaining space
        color: colors.white,
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
    }
});

export default AppTextInput;
