import React from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import { COLORS } from '../../common';


function NoTransactionFound({theme }) {
    console.log("My theree",theme)

    return (
        <View style={styles.mainView}>

            <Text style={[styles.transactionNotFoundTextStyle,{color:theme?.WHITE}]}>
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
        
        fontFamily:'Poppins',
        fontSize: 14,
       

    },




});
export default NoTransactionFound;