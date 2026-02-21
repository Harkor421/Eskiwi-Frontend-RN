import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from '../AppText';
import colors from '../../config/colors';
import useDateFormat from '../../hooks/useDateFormat';
import ListItem from '../items/ListItem';
import { useTranslation } from 'react-i18next';
import { getPriceByTier } from '../../utils/getPriceByTier';

function TransactionItem({ transaction }) {
    const { t } = useTranslation();
    const elapsedTime = useDateFormat(transaction.createdAt); // Using the date formatting hook
    const isPending = transaction.pending === true;

    // Determine the styles and text based on the transaction type
    const isIngoing = transaction.type === 'ingoing';
    const amountColor = isIngoing ? styles.ingoingAmount : styles.outgoingAmount;
    const stateColor = isPending ? styles.pending : styles.confirmed;
    const listTitle = isIngoing ? t("transactionItem.received") : t("transactionItem.sent");

    // Define transactionType constant based on transaction.transactionType
    const transactionType = (() => {
        switch (transaction.transactionType) {
            case 'chat_message':
                return t("transactionItem.chatMessage");
            case 'chat_request':
                return t("transactionItem.chatRequest");
            case 'comments':
                return t("transactionItem.postComment");
            case 'gem_purchase':
                return t("transactionItem.gemPurchase");
            case 'subscription_purchase':
                return t("transactionItem.subscriptionPurchase");
            default:
                return 'Transaction'; // Fallback in case of unexpected type
        }
    })();

    // Determine the amount and currency based on transaction type
    const isSubscriptionPurchase = transaction.transactionType === 'subscription_purchase';
    const amount = isSubscriptionPurchase ? getPriceByTier(transaction.gemAmount) : transaction.gemAmount; // Use the correct amount based on type
    const currency = isSubscriptionPurchase ? 'USD' : 'gemas'; // Set currency based on transaction type

    return (
        <TouchableOpacity style={styles.container}>
            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <ListItem
                        avatar={{ uri: transaction.from.avatarUri }}
                        title={listTitle}
                        subTitleStyle={{ fontSize: 12 }}
                        subTitle={`${transactionType} ${isIngoing ? t("transactionItem.from") : t("transactionItem.to")} @${transaction.from.username}`}
                    />
                </View>
                <View style={styles.details}>
                    <AppText style={styles.date}>{elapsedTime}</AppText>
                    <AppText style={[styles.state, stateColor]}>
                        {`${isPending ? t("transactionItem.pending") : t("transactionItem.confirmed")}`}
                    </AppText>
                    <AppText style={[styles.amount, amountColor]}>
                        {`${isIngoing ? `+${amount}` : `-${amount}`} ${currency}`}
                    </AppText>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.terciary,
        backgroundColor: colors.secondary,
        borderRadius: 10,
        marginBottom: 10,
    },
    details: {
        alignItems: 'flex-end',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    amount: {
        fontSize: 12,
    },
    state: {
        fontSize: 12,
        marginVertical: 5,
    },
    ingoingAmount: {
        color: colors.neon_green,
    },
    outgoingAmount: {
        color: colors.light_red,
    },
    pending: {
        color: colors.pending,
    },
    confirmed: {
        color: colors.neon_green,
    },
    date: {
        fontSize: 12,
        color: '#7A7A83',
        fontWeight: '600',
    },
});

export default TransactionItem;
