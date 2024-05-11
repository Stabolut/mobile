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
import Clipboard from '@react-native-clipboard/clipboard';
import theme from '../../common/theme';
import { ThemeContext } from '../../navigation';
import { useSelector } from 'react-redux';


import { COLORS, ENUMS, Images, Str, THEME } from '../../common';
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

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SliderOption from './SliderOption';
import TransactionRefreshAndView from './TransactionRefreshAndView';
import NoTransactionFound from './NoTransactionFound';
import TransactionLoader from './TransactionLoader';
import { checkInternetConnectivity } from '../../utils/utils';
import { ErrorMessages } from '../../messages/errorMessage';


const provider = new ethers.providers.JsonRpcProvider(Str.rpcUrl, {
  chainId: 97,
});

function Dashboard({ navigation }) {
  const [userAddress, setUserAddress] = useState('');
  const socketConnection = useContext(SocketContext);
  const [privateKey, setPrivateKey] = useState('');
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransactionLoading, setTransactionLoading] = useState(false);
  const [transactionRecord, setTransactionRecord] = useState([]);
  const [visible, setVisible] = useState(false);
  // const [selectedTheme, setSelectedTheme] = useState("")
  socketDisconnectMessage(socketConnection.connectionStatus);
  let selectedTheme = useSelector((state) => state.authReducer.theme)
  const theme = THEME[selectedTheme];


  useEffect(() => {

    getLocalData();
    getFromDB();
  }, []);


  let getLocalData = async () => {

    getUserTransactionListFromLocalDb()
    let address = await AsyncStorage.getItem('address');
    let privateKey = await AsyncStorage.getItem('mnemonics');
    setUserAddress(address);
    setPrivateKey(privateKey);
  };


  // Method to retrieve data from the local database
  const getFromDB = async () => {
    try {
      // Define the schema for the transaction history database
      const transactionHistoryDBSchema = {
        name: 'TransactionsHistorySchema',
        properties: {
          uniqueKey: 'string',
          senderAddress: 'string',
          receiverAddress: 'string',
          amountToSend: 'double',
          transactionStatus: 'string',
          sendDate: 'date',
          transactionHash: 'string', // Unique identifier for transactions
          transactionNotes: 'string'
        },
      };

      // Open a connection to the Realm database
      const realm = await Realm.open({ schema: [transactionHistoryDBSchema] });

      // Retrieve pending transactions from the database
      const pendingEntries = realm
        .objects('TransactionsHistorySchema')
        .filtered('transactionStatus = "Pending"');

      // If there are pending transactions, check their status
      if (pendingEntries.length > 0) {
        pendingEntries.forEach(async entry => {
          let status;
          try {
            // Verify the status of the transaction from an external provider
            status = await verifyTransactionSuccess(provider, entry.transactionHash);

            // Update transaction status based on verification result
            if (status === 1) {
              // If transaction is successful, update status to 'Success'
              updateTransactionStatus(entry.transactionHash, status);
              realm.write(() => {
                entry.transactionStatus = 'Success';
                // Update user transaction list from local database
                getUserTransactionListFromLocalDb();
              });
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

      throw error;
    }
  };

  updateTransactionStatus = async (transactionHash, status) => {
    let isConnected = await checkInternetConnectivity()
    if (!isConnected) {
      alert(ErrorMessages.GENERIC.NO_INTERNET_ERROR)
      return

    }
    try {
      await axios.post(`${Str.apiUrl}/wallet/update-transaction-status`, {
        walletAddress: userAddress,
        transactionHash: transactionHash,
        status: status
      });
    }
    catch (e) {
    }

  }


  // Method to retrieve the transaction list of the user from the local database
  getUserTransactionListFromLocalDb = async () => {
    try {
      // Define the schema for the transaction history database
      const transactionHistoryDBSchema = {
        name: 'TransactionsHistorySchema',
        properties: {
          uniqueKey: 'string',
          senderAddress: 'string',
          receiverAddress: 'string',
          amountToSend: 'double',
          transactionStatus: 'string',
          sendDate: 'date',
          transactionHash: 'string', // Unique identifier for transactions
          transactionNotes: 'string'
        },
      };

      // Open a connection to the Realm database
      const realm = await Realm.open({ schema: [transactionHistoryDBSchema] });

      // Retrieve transaction data from the database and sort it by date in descending order
      let transaction = realm
        .objects('TransactionsHistorySchema')
        .sorted('sendDate', true);

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
      // Handle any errors that occur during database access
    }
  }








  // if user address get from localStorage then we get the balance of address
  useEffect(() => {
    if (userAddress) {
      getUserTransactionListFromApi()
      getERC20Balance(userAddress, Str.contractAddress);
    }
  }, [userAddress]);


  // get user balance
  let getERC20Balance = async (address, contractAddress) => {
    let isConnected = await checkInternetConnectivity()
    if (!isConnected) {
      alert(ErrorMessages.GENERIC.NO_INTERNET_ERROR)
      return

    }
    try {
      setIsLoading(true);
      const contract = new ethers.Contract(contractAddress, Str.ABI, provider);
      const balance = await contract.balanceOf(address);
      setBalance(balance / 1e2);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      alert('We are experiencing difficulties retrieving the balance at the moment.');
    }
  };



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
      let { data } = await axios.post(`${Str.apiUrl}/wallet/transacions-list-with-limit`, { walletAddress: userAddress });


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
            filteredApiRecords[i].notes
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





  // connecte socket and receive incoming transaction and store in DB
  useEffect(() => {
    if (socketConnection.isSocketConnected && userAddress) {
      socketConnection.socket.emit('addUser', { address: userAddress });
      socketConnection.socket.on('getTransaction', data => {


        saveDB(
          data.data.date,
          data.data.transactionHash,
          data.data.senderAddress,
          data.data.receiverAddress,
          data.data.amount,
          "Pending",
          data.data.transactionNotes
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
  }, [navigation]);

  const saveDB = (date, transactionHash, sender, receiver, amount, status, notes = "") => {


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
          transactionNotes: 'string'
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
        transactionNotes: notes
      };

      // Save the transaction object to the Realm
      realm.write(() => {
        realm.create('TransactionsHistorySchema', transactionObject);
      });
      getUserTransactionListFromLocalDb()
    } catch (e) {

    }
  };

  onRefresh = () => {

    getERC20Balance(userAddress, Str.contractAddress);
    getUserTransactionListFromApi()
  };

  return (
    <React.Fragment>



      <StatusBarNU
        backgroundColor={theme?.BACKGROUND_COLOR}
       

      />




      <View style={[styles.mainContainer, { backgroundColor: theme?.BACKGROUND_COLOR }]}>

        <BalanceCard selectedTheme={selectedTheme} isLoading={isLoading} balance={balance} userAddress={userAddress} copy={() => {

          Clipboard.setString(userAddress);
          DropDownHolder.alert('Success', 'Copy', `The wallet address has been copied successfully.`);
        }}></BalanceCard>





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




      <MnemonicsShowModal
        privateKey={privateKey}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}></MnemonicsShowModal>



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