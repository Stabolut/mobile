import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Text
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useSelector } from 'react-redux';
import { COLORS, ENUMS, Str, THEME } from '../../common';
import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';
import AsyncStorage from '@react-native-community/async-storage';
import { ethers } from 'ethers';
import Transaction from './Transaction';
import MnemonicsShowModal from '../../components/Modal/MnemonicsShowModal';
import uuid from 'react-native-uuid';
import Realm from 'realm';
import moment from 'moment';
import { SocketContext } from '../../App';
import socketDisconnectMessage from '../../components/CustomHook/socketDisconnectMessage';
import axios from 'axios';
import BalanceCard from './BalanceCard';
// import Clipboard from '@react-native-community/clipboard';
import DropDownHolder from '../../components/dropDownHolder';
import SliderOption from './SliderOption';
import TransactionRefreshAndView from './TransactionRefreshAndView';
import NoTransactionFound from './NoTransactionFound';
import TransactionLoader from './TransactionLoader';
import { checkInternetConnectivity } from '../../utils/utils';
import { ErrorMessages } from '../../messages/errorMessage';
import SwitchNetworkModal from '../../components/Modal/SwitchNetworkModal';
import { networkConfig } from '../../common/NetworkConfig';
import { isEmpty } from 'lodash';
import { getLimitedTransactionList, updateUserTransactionStatus } from '../../api/wallet';
import RNFS from 'react-native-fs'; // FileSystem for React Native
import { store } from '../../store';
import { storeNetworkInfo } from '../../redux/action/wallet';

function Dashboard({ navigation }) {
  const [userAddress, setUserAddress] = useState('');
  const socketConnection = useContext(SocketContext);
  const [balance, setBalance] = useState(0);
  const [balanceError, setBalanceError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTransactionLoading, setTransactionLoading] = useState(false);
  const [transactionRecord, setTransactionRecord] = useState([]);
  const [networkSwitchModal, setNetworkSwitchModal] = useState(false);
  let selectedNetwork = useSelector((state) => state.walletReducer.currentNetwork)
  const [currentNetwork, setCurrentNetwork] = useState({});
  const [provider, setProvider] = useState({});
  // let provider = new ethers.providers.JsonRpcProvider(currentNetwork.rpcUrl)
  socketDisconnectMessage(socketConnection.connectionStatus);
  let selectedTheme = useSelector((state) => state.walletReducer.theme)
  const theme = THEME[selectedTheme];


  useEffect(() => {
    if (!isEmpty(selectedNetwork)) {
      setCurrentNetwork(selectedNetwork)
      let provider = new ethers.providers.JsonRpcProvider(currentNetwork.rpcUrl)
      setProvider(provider)
    }
  }, [selectedNetwork])


  useEffect(() => {
    if (!isEmpty(currentNetwork)) {
      console.log("currentNetwork", currentNetwork)
      getLocalData();
      getFromDB();
    }

  }, [currentNetwork]);

  let getLocalData = async () => {
    console.log("First call", currentNetwork)
    getUserTransactionListFromLocalDb()
    let address = await AsyncStorage.getItem('address');
    setUserAddress(address);

  };

  // if user address get from localStorage then we get the balance of address
  useEffect(() => {
    if (userAddress) {
      console.log("second call", userAddress, currentNetwork.contractAddress)
      getERC20Balance(userAddress, currentNetwork.contractAddress);
      getUserTransactionListFromApi()

    }
  }, [userAddress]);

  // get user balance
  let getERC20Balance = async (address, contractAddress) => {
    console.log("fourth call")
    let isConnected = await checkInternetConnectivity()
    if (!isConnected) {
      alert(ErrorMessages.GENERIC.NO_INTERNET_ERROR)
      return

    }
    try {
      setIsLoading(true);
      console.log("contractAddress", currentNetwork.rpcUrl, address, contractAddress)
      const contract = new ethers.Contract(contractAddress, Str.ABI, provider);
      const balance = await contract.balanceOf(address);
      console.log("balance", balance)
      setBalance(balance / 1e2);
      setIsLoading(false);
    } catch (e) {
      console.log("balance get error", e, provider)
      setBalanceError("-----")

      setIsLoading(false);

    }
  };

  // Method to retrieve the transaction list of the user from the local database
  getUserTransactionListFromLocalDb = async () => {
    try {
      console.log("third call")
      const realm = new Realm()
      // Retrieve transaction data from the database and sort it by date in descending order
      let transaction = realm
        .objects('TransactionsHistorySchema')
        .filtered(`network == $0`, currentNetwork.name)
        .sorted('sendDate', true);

      // console.log("currentNetwork.name", currentNetwork.name, transaction)
      // Remove duplicate transactions based on transactionHash
      const uniqueArr = [];
      const uniqueObj = {};

      // Iterate through transactions to filter out duplicates
      transaction.forEach((elem) => {
        if (!uniqueObj[elem.transactionHash]) {
          uniqueObj[elem.transactionHash] = true;
          uniqueArr.push(elem);
        }
      });

      // Set the unique transaction records in the state for further processing
      setTransactionRecord(uniqueArr);

    } catch (e) {
      console.log("error in get tra", e)
      // Handle any errors that occur during database access
    }
  }


  getUserTransactionListFromApi = async () => {

    // Check internet connectivity
    let isConnected = await checkInternetConnectivity();
    if (!isConnected) {
      // If there's no internet, display an alert and return
      alert(ErrorMessages.GENERIC.NO_INTERNET_ERROR);
      return;
    }

    try {
      // Set loading state to true before making the API request
      setTransactionLoading(true);

      // Make API request to fetch transaction data
      let { data } = await getLimitedTransactionList({ walletAddress: userAddress, network: currentNetwork.name });
      // Filter out records that are already present in the local database
      const filteredApiRecords = data.data.wallet.filter(apiRecord => {
        return !transactionRecord.find(localDbRecord => localDbRecord.transactionHash === apiRecord.transactionHash);
      });
      // Store filtered records in the local database
      if (filteredApiRecords.length > 0) {
        for (var i = 0; i < filteredApiRecords.length; i++) {

          saveDB(
            filteredApiRecords[i].sendDate,
            filteredApiRecords[i].transactionHash,
            filteredApiRecords[i].senderAddress,
            filteredApiRecords[i].receiverAddress,
            filteredApiRecords[i].amountToSend,
            filteredApiRecords[i].transactionStatus,
            filteredApiRecords[i].transactionNotes,
            filteredApiRecords[i].network,
            filteredApiRecords[i].transactionType
          );
        }
      }

      // Reset loading state to false after API request is completed
      setTransactionLoading(false);
    }
    catch (e) {
      // Handle errors by resetting loading state to false
      setTransactionLoading(false);
    }
  }







  // Method to retrieve data from the local database
  const getFromDB = async () => {
    try {
      //console.log("Fifth call")
      // console.log("i am call", currentNetwork.name)
      const realm = new Realm()
      // Retrieve pending transactions from the database
      const pendingEntries = realm
        .objects('TransactionsHistorySchema')
        .filtered('network == $0 AND transactionStatus == "Pending"', currentNetwork.name) // Filter by network and status

      console.log("pendingEntries", currentNetwork, currentNetwork.name)
      // If there are pending transactions, check their status
      if (pendingEntries.length > 0) {
        pendingEntries.forEach(async entry => {
          let status;
          try {
            // Verify the status of the transaction from an external provider
            status = await verifyTransactionSuccess(provider, entry.transactionHash);
            // console.log("statussssdddd", status)

            // Update transaction status based on verification result
            if (status === 1) {
              // If transaction is successful, update status to 'Success'
              try {
                await updateTransactionStatus(entry.transactionHash, status);
                realm.write(() => {
                  entry.transactionStatus = 'Success';
                  // Update user transaction list from local database
                  getUserTransactionListFromLocalDb();
                });
              }
              catch (e) {
                console.log("status updated")
              }
            } else if (status === 0) {
              // If transaction failed, update status to 'Fail'
              updateTransactionStatus(entry.transactionHash);
              realm.write(() => {
                entry.transactionStatus = 'Fail';
                // Update user transaction list from local database
                getUserTransactionListFromLocalDb();
              });
            }
          } catch (e) {
            // Handle any errors that occur during transaction verification
          }
        });
      }
    } catch (e) {
      // Handle any errors that occur during database access
    }
  };

  let verifyTransactionSuccess = async (provider, transactionHash) => {

    try {

      const transaction = await provider.getTransactionReceipt(transactionHash);
      return transaction.status;
    } catch (error) {
      console.log("verify transaction error", error)
      throw error;
    }
  };

  let updateTransactionStatus = async (transactionHash, status) => {
    let isConnected = await checkInternetConnectivity()
    if (!isConnected) {
      alert(ErrorMessages.GENERIC.NO_INTERNET_ERROR)
      return

    }
    try {
      //  console.log("ddcc", userAddress, transactionHash)
      await updateUserTransactionStatus({
        walletAddress: userAddress,
        transactionHash: transactionHash,
        status: status

      })

    }
    catch (e) {
      console.log("update transaction status error", e)
    }

  }

  // connecte socket and receive incoming transaction and store in DB
  useEffect(() => {
    if (socketConnection.isSocketConnected && userAddress) {
      socketConnection.socket.emit('addUser', { address: userAddress });
      socketConnection.socket.on('getTransaction', data => {
        // console.log("reeeee", data, data.network, currentNetwork.name)

        saveDB(
          data.data.date,
          data.data.transactionHash,
          data.data.senderAddress,
          data.data.receiverAddress,
          data.data.amount,
          "Pending",
          data.data.transactionNotes,
          data.data.network,
          data.data.transactionType

        );

        let formatDate = moment(data.data.date).format(
          'dddd, MMMM Do YYYY, h:mm:ss a',
        );

        // return () => {
        socketConnection.socket.off('getTransaction');
        navigation.navigate(`${ENUMS.SCREENS.SUCCESS}`, {
          amount: parseFloat(data.data.amount),
          date: formatDate,
          transactionHash: data.data.transactionHash,
        });
        // };
        getERC20Balance(userAddress, Str.contractAddress);
      });
    }
  }, [userAddress, socketConnection.isSocketConnected]);


  useEffect(() => {
    
  
      let interval = null;
      navigation.addListener('focus', () => {
        interval = setInterval(() => {
          getFromDB();
        }, 1000);
      });
      navigation.addListener('blur', () => {
        clearInterval(interval);
      });
    
  }, [navigation,currentNetwork]);



  const saveDB = (date, transactionHash, sender, receiver, amount, status, notes = "", network, transactionType) => {

    try {
      const uniqueID = uuid.v4();
      const transactionHistoryDBSchema = {
        name: 'TransactionsHistorySchema',
        properties: {
          uniqueKey: 'string',
          senderAddress: 'string',
          receiverAddress: 'string',
          amountToSend: 'double',
          transactionStatus: 'string',
          sendDate: 'date',
          transactionHash: 'string', // Add the date property
          transactionNotes: 'string',
          network: 'string',
          transactionType: 'string'
        },
      };
      // Create a new Realm with the transaction schema
      let realm;
      try {
        realm = new Realm({ schema: [transactionHistoryDBSchema] });
      } catch (e) {

      }

      // Create a w transaction object with the current date
      const transactionObject = {
        uniqueKey: uniqueID,
        senderAddress: sender,
        receiverAddress: receiver,
        amountToSend: parseFloat(amount),
        transactionStatus: status,
        sendDate: date, // Set the date property to the current date
        transactionHash: transactionHash,
        transactionNotes: notes,
        network: network || '',
        transactionType: transactionType || ''
      };

      // Save the transaction object to the Realm
      realm.write(() => {
        realm.create('TransactionsHistorySchema', transactionObject);
      });
      getUserTransactionListFromLocalDb()
    } catch (e) {
      console.log("transaction save error", e)

    }
  };

  useEffect(() => {
    if (!isEmpty(currentNetwork)) {
      getUserTransactionListFromLocalDb()
      onRefresh()
    }

  }, [currentNetwork]);

  onRefresh = () => {
    // getUserTransactionListFromLocalDb()
    getERC20Balance(userAddress, currentNetwork.contractAddress);
    getUserTransactionListFromApi()
  };




  return (
    <React.Fragment>
      <StatusBarNU
        backgroundColor={theme?.BACKGROUND_COLOR}
      />




      <View style={[styles.mainContainer, { backgroundColor: theme?.BACKGROUND_COLOR }]}>

        <BalanceCard switchNetwork={() => {
          setNetworkSwitchModal(true)
        }} selectedTheme={selectedTheme} isLoading={isLoading} balance={balance} userAddress={userAddress} copy={() => {

          Clipboard.setString(userAddress);
          DropDownHolder.alert('Success', 'Copy', `The wallet address has been copied successfully.`);
        }} currentNetwork={currentNetwork} balanceError={balanceError}></BalanceCard>





        <SliderOption
          balance={balance}
          selectedTheme={selectedTheme}
          transfer={async () => {
            let contactOnly = await AsyncStorage.getItem("allowContact")
            if (contactOnly === "true") {
              navigation.navigate(`${ENUMS.SCREENS.SHOW_CONTACT_LIST}`)
            }
            else {
              navigation.navigate(`${ENUMS.SCREENS.TRANSFER}`)
            }
          }}
          showKey={() => navigation.navigate(`${ENUMS.SCREENS.STAKE}`, { userAddress: userAddress, balance: balance ? balance : 0 })}
          receive={() => navigation.navigate(`${ENUMS.SCREENS.RECEIVE}`)}
          purchase={() => navigation?.navigate(ENUMS.SCREENS.SETTING)}
        >

        </SliderOption>
        <TransactionRefreshAndView selectedTheme={selectedTheme} viewAll={() => navigation.navigate(`${ENUMS.SCREENS.ALL_TRANSACTION}`)}
          refresh={() => this.onRefresh()}




        ></TransactionRefreshAndView>




        {
          isTransactionLoading === true ? <TransactionLoader></TransactionLoader>
            :
            transactionRecord.length > 0 ?

              <FlatList

                data={transactionRecord}
                keyExtractor={(item, index) => index.toString()}
                inverted={false}
                renderItem={({ item }) => (
                  <Transaction
                    userAddress={userAddress}
                    navigation={navigation}
                    selectedTheme={selectedTheme}
                    item={item}></Transaction>
                )}
              />
              : <NoTransactionFound theme={theme}></NoTransactionFound>
        }

        {/* </ScrollView> */}
      </View>

      {/* // Modal to change the network */}

      <SwitchNetworkModal

        visible={networkSwitchModal}
        switchNetworkCallback={async (item) => {
          store.dispatch(storeNetworkInfo(item))

        }}

        onClose={() => {
          setNetworkSwitchModal(false);
        }}
        theme={theme}
        data={networkConfig}
        currentNetwork={currentNetwork}


      ></SwitchNetworkModal>





    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,

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




});

export default Dashboard;