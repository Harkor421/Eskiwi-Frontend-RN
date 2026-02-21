import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../config/colors';
import AppText from '../AppText';
import { GemButton, DeleteButton} from '../buttons';
import { useTranslation } from 'react-i18next';

function ProductItem({ title, price, frequency, benefits, edit, onPress, isSubscribed }) {

  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.user} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </AppText>
        <View style={styles.priceContainer}>
          <AppText style={styles.priceText} numberOfLines={1} ellipsizeMode="tail">
            {price}
          </AppText>
          <AppText style={styles.frequency} numberOfLines={1} ellipsizeMode="tail">
            {frequency}
          </AppText>
        </View>
      </View>
      <View style={styles.benefitsContainer}>
        {benefits.map((benefit, index) => (
          <AppText key={index} style={styles.benefitText} ellipsizeMode="tail">
            {`• ${benefit}`}
          </AppText>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        {isSubscribed ? (
          <DeleteButton
            title={t("productItem.cancelSub")}
            style={styles.subscribeButton}
            onPress={onPress}
            icon={require('../../assets/trash-icon.png')}
          />
        ) : (
          <GemButton
            icon={edit ? require('../../assets/edit-icon.png') : require('../../assets/creator-icon.png')}
            title={edit ? t("productItem.edit") : t("productItem.subscribe")}
            iconPosition="left"
            style={styles.subscribeButton}
            onPress={onPress}
          />
        )}
        <AppText style={styles.cancelText} numberOfLines={1} ellipsizeMode="tail">
          {t("productItem.cancelAnyTime")}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginBottom: 10,
    backgroundColor: colors.terciary,
    borderRadius: 10,
    padding: 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  user: {
    color: colors.white,
    fontSize: 18,
    marginBottom: 2,
    fontWeight: '500',
    fontFamily: 'GeistMono-Bold',
    flex: 1,
  },
  priceText: {
    color: colors.white,
    fontSize: 18,
    marginBottom: 2,
    fontWeight: '500',
    fontFamily: 'GeistMono-Bold',
  },
  frequency: {
    color: '#7A7A83',
    fontSize: 12,
    marginBottom: 2,
    fontWeight: '500',
    fontFamily: 'GeistMono-Bold',
  },
  cancelText: {
    color: '#7A7A83',
    fontSize: 12,
    marginTop: 10,
    fontWeight: '500',
    fontFamily: 'GeistMono-Bold',
  },

  benefitsContainer: {
    marginTop: 10,
  },
  benefitText: {
    color: colors.white,
    fontSize: 14,
    marginVertical: 10,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  subscribeButton: {
    width: '100%',
    padding: '3%',
  },
});

export default ProductItem;
