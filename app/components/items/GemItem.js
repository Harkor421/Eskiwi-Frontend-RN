import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import colors from '../../config/colors'
import AppText from '../AppText'

export default function GemItem({gems}) {
  return (
    <View style = {styles.container}>
        <Image style = {styles.gemIcon} source = {require('../../assets/gem-fill-icon.png')}/>
        <AppText style = {styles.gemAmount}>{gems}</AppText>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        borderRadius: 20,
        backgroundColor: colors.terciary,
        borderTopWidth: 0.8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderColor: "#52525B",
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    gemAmount: {
        color: colors.white,
        fontSize: 14,
        fontWeight: 500,
    },
    gemIcon:{
        width: 15,
        height: 15,
        marginRight: 5,
        resizeMode: 'contain'
    }
})