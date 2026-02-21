import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { LineChart } from "react-native-gifted-charts";
import colors from '../../config/colors';
import AppText from '../AppText';
import moment from 'moment';

const screenWidth = Dimensions.get('window').width;

const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const CustomLineChart = ({
    color = '#FA3D86',
    startFillColor = '#FA3D86',
    endFillColor = colors.terciary,
    dataPointsColor = '#FA3D86',
    thickness = 1,
    dataPointsWidth = 6,
    width = screenWidth * 0.8,
    data = [],
}) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (data.length) {
            const today = moment();
            const last30DaysData = data
                .filter(item => {
                    const day = moment(item.day);
                    return day.isSameOrAfter(today.clone().subtract(30, 'days'), 'day');
                })
                .sort((a, b) => new Date(a.day) - new Date(b.day));

            // Set chart data with actual values in thousands
            const formattedData = last30DaysData.map((item) => ({
                value: item.total, // Keep the total value as is
                label: moment(item.day).format('MM/DD')
            }));

            setChartData(formattedData);
        }
    }, [data]);

    // Calculate yAxisMaxValue and yAxisMinValue based on the chart data
    const yAxisMaxValue = Math.ceil(Math.max(...chartData.map(item => item.value)) / 1000) * 1000; // Round up to nearest thousand
    const yAxisMinValue = Math.floor(Math.min(...chartData.map(item => item.value)) / 1000) * 1000; // Round down to nearest thousand

    return (
        <View style={styles.container}>
            <LineChart
                data={chartData}
                color={color}
                isAnimated={false}
                animateOnDataChange={true}
                thickness={thickness}
                dataPointsColor={dataPointsColor}
                xAxisColor={'#7A7A83'}
                yAxisColor={'#7A7A83'}
                xAxisLabelTextStyle={{ color: colors.white }}
                yAxisTextStyle={{ color: colors.white }}
                hideDataPoints={true}
                hideRules
                startFillColor={startFillColor}
                endFillColor={endFillColor}
                dataPointsWidth={dataPointsWidth}
                areaChart
                scrollable={true}
                rulesType="solid"
                xAxisThickness={1}
                yAxisThickness={1}
                endSpacing={5}
                initialSpacing={2.5}
                startOpacity={0.4}
                endOpacity={0.2}
                scrollToEnd={true}
                spacing={40}
                pointerConfig={{
                    showPointerStrip: false,
                    pointerStripWidth: 2,
                    pointerColor: '#FA3D86',
                    radius: 6,
                    pointerLabelComponent: items => (
                        <View style={styles.pointerLabelContainer}>
                            <AppText style={styles.pointerLabelText}>{`${items[0].label}: `}</AppText>
                            <AppText style={styles.pointerLabelValue}>{formatNumberWithCommas(items[0].value)}</AppText>
                        </View>
                    ),
                }}
                width={width}
                yAxisMinValue={yAxisMinValue}
                yAxisMaxValue={yAxisMaxValue}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        width: "100%",
    },
    pointerLabelContainer: {
        backgroundColor: colors.secondary,
        borderRadius: 5,
        width: 80,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    pointerLabelText: {
        color: colors.white,
        fontSize: 12,
    },
    pointerLabelValue: {
        color: colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default CustomLineChart;
