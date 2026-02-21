import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Image } from 'react-native';
import AppText from '../components/AppText';
import BlackButton from '../components/buttons/BlackButton';
import CustomLineChart from '../components/earnings/CustomLineChart'; // Import the new component
import Screen from '../components/Screen';
import colors from '../config/colors';
import userApi from '../api/user';

function EarningsScreen() {
  const [data1, setData1] = useState([]);
  const [gems1, setGems1] = useState();

  const [data2, setData2] = useState([]);
  const [gems2, setGems2] = useState();


  const fetchGemEarnings = async () => {
    try {
      const response = await userApi.getGemEarnings(); // Adjust this function to match your API
      if (response.ok) {
        setData1(response.data.dayTransactions);
        setGems1(response.data.totalValid);
      } else {
        console.error(response.data);
      }
    } catch (err) {
      console.error('An error occurred while fetching rules', err);
    }
  };

  const fetchSubEarnings = async () => {
    try {
      const response = await userApi.getSubEarnings(); // Adjust this function to match your API
      if (response.ok) {
        console.log(response.data.dayTransactions);
        setData2(response.data.dayTransactions);
        setGems2(response.data.totalValid);
      } else {
        console.error(response.data);
      }
    } catch (err) {
      console.error('An error occurred while fetching rules', err);
    }
  };

  useEffect(() => {
    fetchGemEarnings();
    fetchSubEarnings();
  }, []);

  // Utility function to format numbers with commas
  const formatNumberWithCommas = (number) => {
    if (number === undefined || number === null) return '0'; // Handle undefined or null values
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView>
        <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 10, alignItems: 'center' }}>
          <AppText style={styles.title}>Tus ingresos</AppText>
          <View style={styles.viewMoreContainer}>
            <BlackButton title="Ajustes" style={styles.viewMore} />
          </View>
        </View>

        <View style={styles.totalContainer}>
          <AppText style={styles.title}>Ingresos totales</AppText>
          <AppText style={styles.title2}>${formatNumberWithCommas((gems1/100)+ gems2/2)} USD</AppText>
          <AppText style={styles.description}>Las métricas de ingresos se actualizan cada dos días.</AppText>
        </View>

        <View style={styles.totalContainer}>
          <AppText style={styles.title}>Gemas recibidas</AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <Image source={require('../assets/gem-icon.png')} style={{ width: 15, height: 15, marginRight: 10 }} />
            <AppText style={styles.title2}>{formatNumberWithCommas(gems1)}</AppText>
          </View>
        </View>



        <View style={styles.container}>
          <AppText style={styles.title}>Ingresos en gemas</AppText>
          <CustomLineChart data={data1} />
        </View>

        <View style={styles.totalContainer}>
          <AppText style={styles.title}>Dinero en suscripciones</AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <AppText style={styles.title2}>{`${formatNumberWithCommas(gems2/2)} USD`}</AppText>
          </View>
        </View>

        <View style={styles.container}>
          <AppText style={styles.title}>Ingresos en suscripciones</AppText>
          <CustomLineChart data={data2} />
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
  totalContainer: {
    flex: 1,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    marginTop: "10%",
    borderRadius: 10,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    paddingVertical: 20,
  },
  description: {
    color: '#7A7A83',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 10,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: "10%",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    color: colors.white,
    marginBottom: 5,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'GeistMono-Bold',
  },
  title2: {
    color: colors.white,
    fontSize: 20,
    fontFamily: 'GeistMono-Bold',
  },
  viewMoreContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  viewMore: {
    width: "50%",
    padding: "3%",
    marginRight: 10,
    borderRadius: 8,
  },
});

export default EarningsScreen;
