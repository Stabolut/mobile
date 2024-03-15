import React from 'react';
import {
    View,
    StyleSheet,

    ActivityIndicator


} from 'react-native';


function TransactionLoader({ isLoading, balance, userAddress, copy }) {

    return (
        <View style={styles.mainView}>
            <ActivityIndicator size="large" />
            {/* <Text style={{ fontFamily: "Poppins", fontSize: 13, fontWeight: "500", color: "white" }}>
          Please wait while we are loading the transaction...
        </Text> */}
        </View>
    );
}

const styles = StyleSheet.create({

    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
});
export default TransactionLoader;