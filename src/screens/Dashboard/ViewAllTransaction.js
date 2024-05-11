import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Dimensions
} from 'react-native';
import { COLORS, THEME, Str } from '../../common';
import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';
import AsyncStorage from '@react-native-community/async-storage';
import { useSelector } from 'react-redux';

import Header from '../../components/Header/Header';
import Transaction from './Transaction';
import { SocketContext } from '../../App';
import socketDisconnectMessage from '../../components/CustomHook/socketDisconnectMessage';
import axios from 'axios';

import NoTransactionFound from './NoTransactionFound';
import TransactionLoader from './TransactionLoader';
import { checkInternetConnectivity } from '../../utils/utils';
import { ErrorMessages } from '../../messages/errorMessage';



function AllTransaction({ navigation }) {
    const [userAddress, setUserAddress] = useState('');
    const socketConnection = useContext(SocketContext);
    const [isTransactionLoading, setTransactionLoading] = useState(false);
    const [transactionRecord, setTransactionRecord] = useState([]);

    socketDisconnectMessage(socketConnection.connectionStatus);
    let selectedTheme = useSelector((state) => state.authReducer.theme)
    const theme = THEME[selectedTheme];


    useEffect(() => {

        getLocalData();

    }, []);


    let getLocalData = async () => {


        let address = await AsyncStorage.getItem('address');
        setUserAddress(address);
        if (address) {
            getUserTransactionListFromApi()

        }

    };


    getUserTransactionListFromApi = async () => {

        let isConnected = await checkInternetConnectivity()
        if (!isConnected) {
            alert(ErrorMessages.GENERIC.NO_INTERNET_ERROR)
            return

        }


        try {
            setTransactionLoading(true)
            let { data } = await axios.post(`${Str.apiUrl}/wallet/transacions-list`, { walletAddress: userAddress })

            setTransactionRecord(data.data.wallet)
            setTransactionLoading(false)

        }
        catch (e) {

            setTransactionLoading(false)
            alert("We seem to be encountering a problem in retrieving the transaction. It's possible that this issue is related to your internet connection.")

        }
    }








    return (
        <React.Fragment>


            <StatusBarNU
                backgroundColor={theme?.BACKGROUND_COLOR}
                
            />
            <Header headerText="All Transactions" theme={theme} navigation={navigation}></Header>


            <View style={[styles.mainContainer,{ backgroundColor: theme?.BACKGROUND_COLOR}]}>

                {
                    isTransactionLoading === true ? <TransactionLoader></TransactionLoader>
                        :
                        transactionRecord.length > 0 ?

                            <FlatList
                                data={transactionRecord}
                                keyExtractor={(item, index) => index.toString()}
                                inverted={false}
                                renderItem={({ item }) => (
                                    <View style={{ backgroundColor: theme?.BALANCE_CARD_BACKGROUND, marginLeft: 8, marginRight: 8, borderRadius: 10, marginTop: 16 }}>
                                        <Transaction
                                            userAddress={userAddress}
                                            navigation={navigation}
                                            selectedTheme={selectedTheme}
                                            item={item}></Transaction>
                                    </View>
                                )}
                            />
                            : <NoTransactionFound></NoTransactionFound>
                }
            </View>






        </React.Fragment>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },

    iconViewStyle: {
        width: Dimensions.get("window").width * 0.2098,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        borderColor: COLORS.SLIDER_BORDER_COLOR,
        borderWidth: 2

    },
    iconDesign: {
        fontWeight: "800"
    },
    textStyle: {
        color: COLORS.WHITE,
        fontSize: 12,
        marginTop: 6,
        fontFamily: "Poppins"
    },



});

export default AllTransaction;