import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import userApi from '../../api/user';
import AuthContext from '../../auth/context';
import colors from '../../config/colors';
import TransactionItem from './TransactionItem'; // Import TransactionItem component
import AppText from '../AppText';

function TransactionHistory({ navigation }) {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Fetch transactions from the API with pagination
    const fetchTransactions = async (pageNumber) => {
        setLoading(true);
        try {
            const response = await userApi.getTransactionHistory(pageNumber);
            console.log(response.data.transactions);
            const newTransactions = response.data.transactions;

            // If no more transactions, set hasMore to false
            if (newTransactions.length === 0) {
                setHasMore(false);
            }

            setTransactions((prevTransactions) => [
                ...prevTransactions,
                ...newTransactions,
            ]);
        } catch (error) {
            console.error('Failed to fetch transactions', error);
        }
        setLoading(false);
    };

    // Fetch the initial transactions when the component mounts
    useEffect(() => {
        fetchTransactions(page);
    }, []);

    // Fetch more transactions when reaching the end of the list
    const loadMoreTransactions = () => {
        if (hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchTransactions(nextPage);
        }
    };

    // Render each transaction item using TransactionItem component
    const renderItem = ({ item }) => (
        <TransactionItem 
            transaction={item}
        />
    );

    // Render a loading indicator at the bottom of the list
    const renderFooter = () => {
        if (!loading) return null;
        return <ActivityIndicator size="20%" color={colors.white} style={styles.loader} />;
    };

    // FlatList header containing the user's gem balance
    const renderHeader = () => (
        <View style={styles.gemContainer}>
            <AppText style={styles.title}>Gemas disponibles</AppText>
            <AppText style={styles.gems}>{`${user.gems} gemas`}</AppText>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={transactions}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                contentContainerStyle={styles.flatListContent}
                onEndReached={loadMoreTransactions}
                onEndReachedThreshold={0.5}
                ListHeaderComponent={renderHeader} // Set the header component for the FlatList
                ListFooterComponent={renderFooter} // Show loading spinner when loading more items
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    gemContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    title: {
        fontFamily: 'GeistMono-Bold',
        fontSize: 18,
        color: colors.white,
    },
    gems: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: 600,
        color: colors.white,
    },
    flatListContent: {
        paddingHorizontal: 20,
    },
    loader: {
        marginVertical: 20,
    },
});

export default TransactionHistory;
