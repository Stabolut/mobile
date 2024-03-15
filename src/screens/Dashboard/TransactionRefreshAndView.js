import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import { COLORS } from '../../common';
import Feather from 'react-native-vector-icons/Feather';

function TransactionRefreshAndView({ viewAll, refresh }) {

    return (
        <View style={styles.mainView}>
            <View style={styles.transactionView}>
                <Text style={styles.transactionTextStyle}>Transactions</Text>
                <TouchableOpacity onPress={refresh}>
                    <Feather
                        name="refresh-ccw"
                        style={styles.arrowRefresh}
                        size={20}
                    />
                </TouchableOpacity>



            </View>

            <TouchableOpacity onPress={viewAll} style={{ flex: 1, justifyContent: "center" }}>
                <Text style={styles.viewAllTextStyle}>View All</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({

    mainView: {
        flexDirection: "row",
        flexDirection: "row",
        paddingLeft: 16,
        paddingRight: 16,
        marginTop: 16
    },
    transactionView: {
        alignSelf: "flex-start",
        flexDirection: "row",
        flex: 1,


        alignItems: "center"
    },
    transactionTextStyle: {
        fontSize: 18,
        color: COLORS.WHITE,
        fontWeight: "500",
        fontFamily: "Poppins",

    },
    viewAllTextStyle: {
        color: COLORS.WHITE,
        alignSelf: "flex-end",
        fontSize: 12,
        fontWeight: "400",
        fontFamily: "Poppins",
    },
    arrowRefresh: {
        color: COLORS.WHITE,
        marginLeft: 12
    },



});
export default TransactionRefreshAndView;