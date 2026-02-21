import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
function ActivityIndicator({visible = false}) {
    if(!visible) return null;

    return <LottieView style = {styles.loading}
    autoPlay
    loop
    source={require('../assets/animations/loading.json')}
    />   
}
const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'flex-start',
        justifyContent: 'center',
        flex: 1, 
        padding: 50, 
        backgroundColor: 'transparent'
      }
})

export default ActivityIndicator;