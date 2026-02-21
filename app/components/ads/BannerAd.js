import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { BANNER_AD_IOS, BANNER_AD_ANDROID } from '../../config/constants';

function BannerAdComponent({ style }) {
  const [adLoaded, setAdLoaded] = useState(false);
  let bannerId;

  // Use test ad unit IDs
  if (Platform.OS === 'android') {
    bannerId = BANNER_AD_ANDROID;
  } else {
    bannerId = BANNER_AD_IOS; 
  }

  return (
    <View style={[styles.adContainer, style, !adLoaded && styles.hidden]}>
      <BannerAd
        unitId={bannerId}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => setAdLoaded(true)}
        onAdFailedToLoad={() => setAdLoaded(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  hidden: {
    height: 0,
    overflow: 'hidden',
  },
  adContainer: {
    alignItems: 'center',
    width: '100%',
    padding: 30,
  },
});

export default BannerAdComponent;
