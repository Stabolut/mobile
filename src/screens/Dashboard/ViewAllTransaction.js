import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    ActivityIndicator,
    ScrollView,
    Dimensions
} from 'react-native';
import { COLORS, ENUMS, Images, Str } from '../../common';
import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';
import AsyncStorage from '@react-native-community/async-storage';
import { ethers } from 'ethers';
import Header from '../../components/Header/Header';
import Transaction from './Transaction';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MnemonicsShowModal from '../../components/Modal/MnemonicsShowModal';
import uuid from 'react-native-uuid';
import Realm from 'realm';
import moment from 'moment';
import { SocketContext } from '../../App';
import socketDisconnectMessage from '../../components/CustomHook/socketDisconnectMessage';
import axios from 'axios';
import BalanceCard from './BalanceCard';
//import Clipboard from '@react-native-community/clipboard';
import DropDownHolder from '../../components/dropDownHolder';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SliderOption from './SliderOption';
import TransactionRefreshAndView from './TransactionRefreshAndView';
import NoTransactionFound from './NoTransactionFound';
import TransactionLoader from './TransactionLoader';
import { checkInternetConnectivity } from '../../utils/utils';
import { ErrorMessages } from '../../messages/errorMessage';

// const provider = new ethers.providers.JsonRpcProvider(Str.rpcUrl, {
//     chainId: 97,
// });

function AllTransaction({ navigation }) {
    const [userAddress, setUserAddress] = useState('');
    const socketConnection = useContext(SocketContext);
    const [privateKey, setPrivateKey] = useState('');
    const [balance, setBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isTransactionLoading, setTransactionLoading] = useState(false);
    const [transactionRecord, setTransactionRecord] = useState([]);
    const [visible, setVisible] = useState(false);
    const [transactionHash, setTransactionHash] = useState("")
    socketDisconnectMessage(socketConnection.connectionStatus);


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
            let {data} = await axios.post(`${Str.apiUrl}/wallet/transacions-list`, { walletAddress: userAddress })
            
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
                backgroundColor={COLORS.BACKGROUND_COLOR}
                barStyle="light-content"
            />
            <Header headerText="All Transactions" navigation={navigation}></Header>


            <View style={styles.mainContainer}>

                {
                    isTransactionLoading === true ? <TransactionLoader></TransactionLoader>
                        :
                        transactionRecord.length > 0 ?

                            <FlatList
                                data={transactionRecord}
                                keyExtractor={(item, index) => index.toString()}
                                inverted={false}
                                renderItem={({ item }) => (
                                    <View style={{ backgroundColor: COLORS.BALANCE_CARD_BACKGROUND, marginLeft: 8, marginRight: 8, borderRadius: 10, marginTop: 16 }}>
                                        <Transaction
                                            userAddress={userAddress}
                                            navigation={navigation}
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
        flex: 1,
        backgroundColor: COLORS.BACKGROUND_COLOR
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