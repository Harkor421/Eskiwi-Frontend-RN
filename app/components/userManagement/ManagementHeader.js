import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import colors from '../../config/colors';

const ManagementHeader = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.swipeDownHandle}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={styles.grabHandle} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    swipeDownHandle: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: colors.primary,
    },
    grabHandle: {
        width: 40,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#cccccc',
        marginVertical: 10,
    },
});

export default ManagementHeader;
