import React from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import { COLORS } from '../../common';


function NoTransactionFound({ transfer, showKey, receive, purchase }) {

    return (
        <View style={styles.mainView}>

            <Text style={styles.transactionNotFoundTextStyle}>
                No transactions found!
            </Text>

        </View>


    );
}

const styles = StyleSheet.create({

    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
       
    },

    transactionNotFoundTextStyle: {
        color: COLORS.WHITE,
        fontFamily:
            'Poppins',
        fontSize: 14,
       

    },




});
export default NoTransactionFound;