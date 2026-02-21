import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../config/colors';
import AppText from '../AppText';

const ReplyMessage = ({ message, isSent, timestamp, messageReplied }) => {
    return (
        <View style={styles.messageWrapper}>
            <View style={[styles.messageContainer, isSent ? styles.sentMessage : styles.receivedMessage]}>
                <View style={[styles.repliedMessageContainer, isSent ? styles.sentReplyContainer : styles.receivedReplyContainer]}>
                    <View style={styles.verticalBar} />
                    <View style={styles.repliedMessageTextContainer}>
                        <AppText style={styles.repliedMessageUser}>Harkor</AppText>
                        <AppText style={styles.repliedMessageText} numberOfLines={1} ellipsizeMode="tail">{messageReplied}</AppText>
                    </View>
                </View>
                <AppText style={styles.messageText}>{message}</AppText>
            </View>
            <AppText style={[styles.timestamp, isSent ? styles.sentTimestamp : styles.receivedTimestamp]}>{timestamp}</AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    messageWrapper: {
        marginVertical: 5,
    },
    messageContainer: {
        maxWidth: '70%',
        padding: 10,
        borderRadius: 10,
    },
    sentMessage: {
        alignSelf: 'flex-end',
        backgroundColor: colors.grayline,
        marginRight: 10,
    },
    receivedMessage: {
        alignSelf: 'flex-start',
        backgroundColor: colors.secondary,
        marginLeft: 10,
    },
    verticalBar: {
        width: 1,
        height: '100%',
        backgroundColor: '#FC5193',
    },
    messageText: {
        color: colors.white,
        fontSize: 14,
        marginTop: 10,
        fontWeight: 500,
    },
    repliedMessageContainer: {
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    sentReplyContainer: {
        backgroundColor: colors.grayline,
    },
    receivedReplyContainer: {
        backgroundColor: colors.secondary,
    },
    repliedMessageTextContainer: {
        marginLeft: 5,
        marginRight: 5,
    },
    repliedMessageUser: {
        color: colors.white,
        fontSize: 15,
        fontWeight: 500,
    },
    repliedMessageText: {
        color: '#7A7A83',
        fontSize: 12,
        fontWeight: 500,
    },
    timestamp: {
        fontSize: 10,
        color: colors.white,
        marginTop: 4,
        fontWeight: 500,
    },
    sentTimestamp: {
        alignSelf: 'flex-end',
        marginRight: 10,
        fontWeight: 500,
    },
    receivedTimestamp: {
        alignSelf: 'flex-start',
        marginLeft: 10,
        fontWeight: 500,
    },
});

export default ReplyMessage;
