import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Modal,
  RefreshControl,
  ScrollView
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useSelector } from 'react-redux';
import { COLORS, ENUMS, THEME } from '../../common';
import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';
import AsyncStorage from '@react-native-community/async-storage';
import { ethers } from 'ethers';
import Transaction from './Transaction';
import moment from 'moment';
import { SocketContext } from '../../App';
import socketDisconnectMessage from '../../components/CustomHook/socketDisconnectMessage';
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
import { store } from '../../store';
import { storeNetworkInfo } from '../../redux/action/wallet';
import { getERC20Balance, getUserTransactionListFromLocalDb, saveDB } from '../../utils/helperMethod';
import { getRealmInstance } from '../../utils/realmDbCreation';
import IntroSlider from './IntroSlider';
import { BlurView } from "@react-native-community/blur";
import { BalanceShimmer, TransactionShimmer } from '../../components/Shimmer';

function Dashboard({ navigation }) {
  const [userAddress, setUserAddress] = useState('');
  const socketConnection = useContext(SocketContext);
  const [balance, setBalance] = useState(0);
  const [balanceError, setBalanceError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTransactionLoading, setTransactionLoading] = useState(false);
  const [transactionRecord, setTransactionRecord] = useState([]);
  const [networkSwitchModal, setNetworkSwitchModal] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const userAddressRef = useRef('');
  let currentNetwork = useSelector((state) => state.walletReducer.currentNetwork)
  socketDisconnectMessage(socketConnection.connectionStatus);
  let selectedTheme = useSelector((state) => state.walletReducer.theme)
  const theme = THEME[selectedTheme];

  useEffect(() => {
    const checkIntro = async () => {
      const hasSeenIntro = await AsyncStorage.getItem("hasSeenIntro");
      if (!hasSeenIntro) {
        setShowIntro(true);
      }
    };
    checkIntro();
  }, []);




  const closeIntro = async () => {
    setShowIntro(false);
    await AsyncStorage.setItem("hasSeenIntro", "true");
  };


  useEffect(() => {
    if (!isEmpty(currentNetwork)) {
      setupLocalData()
    }
  }, [currentNetwork])

  setupLocalData = async () => {

    try {
      let isConnected = await checkInternetConnectivity()
      if (!isConnected) {
        alert(ErrorMessages.GENERIC.NO_INTERNET_ERROR)
        return
      }
      setIsLoading(true);
      setTransactionLoading(true)
      let address = await AsyncStorage.getItem('address');
      setUserAddress(address)
      let provider = new ethers.providers.JsonRpcProvider(currentNetwork.rpcUrl)
      let balance = await getERC20Balance(address, currentNetwork.contractAddress, provider)

      let uniqueArr = await getUserTransactionListFromLocalDb(currentNetwork.name)
      setTransactionRecord(uniqueArr);
      setBalance(balance);
      if (uniqueArr.length === 0) {
        getUserTransactionListFromApi(transactionRecord, address)
      }
      setIsLoading(false);
      userAddressRef.current = currentNetwork
    }
    catch (e) {
      console.log("catch", e)
      setIsLoading(false);
      setTransactionLoading(false)
    }
  }

  useEffect(() => {
    if (!isEmpty(transactionRecord)) {
      console.log("dataaaaa in hookk transction record", transactionRecord)
      getUserTransactionListFromApi(transactionRecord, userAddress)
    }
  }, [transactionRecord])



  let getUserTransactionListFromApi = async (newTransactionRecord, userAddress) => {

    try {
      // Set loading state to true before making the API request

      // Make API request to fetch transaction data
      let { data } = await getLimitedTransactionList({ walletAddress: userAddress, network: currentNetwork.name });
      console.log("data.data.walle", data.data.wallet)

      // Filter out records that are already present in the local database
      const filteredApiRecords = data.data.wallet.filter(apiRecord => {
        return !newTransactionRecord.find(localDbRecord => localDbRecord.transactionHash === apiRecord.transactionHash);
      });
      // // Store filtered records in the local database
      if (filteredApiRecords.length > 0) {
        for (var i = 0; i < filteredApiRecords.length; i++) {

          let saveResponse = await saveDB(
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
          if (saveResponse) {
            let uniqueArr = await getUserTransactionListFromLocalDb(currentNetwork.name)
            setTransactionRecord(uniqueArr);
          }
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
        // console.log("reeeee", data, data.network, currentNetwork.name)
        setupDbAtTransactionReceived(data)

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

      });
    }
  }, [userAddress, socketConnection.isSocketConnected]);

  setupDbAtTransactionReceived = async (data) => {
    try {
      let saveResponse = await saveDB(
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
      if (saveResponse) {
        let uniqueArr = await getUserTransactionListFromLocalDb(currentNetwork.name)
        setTransactionRecord(uniqueArr);
      }
    }
    catch (e) {

    }

  }


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



  // Method to retrieve data from the local database
  const getFromDB = async () => {

    try {

      let currentNetwork = userAddressRef.current
      let provider = new ethers.providers.JsonRpcProvider(currentNetwork.rpcUrl)
      const realm = getRealmInstance()
      // Retrieve pending transactions from the database
      const pendingEntries = realm
        .objects('TransactionsHistorySchema')
        .filtered('network == $0 AND transactionStatus == "Pending"', currentNetwork.name) // Filter by network and status


      // If there are pending transactions, check their status
      if (pendingEntries.length > 0) {
        pendingEntries.forEach(async entry => {
          let status;
          try {
            // Verify the status of the transaction from an external provider
            status = await verifyTransactionSuccess(provider, entry.transactionHash);


            // Update transaction status based on verification result
            if (status === 1) {
              console.log("entry.transactionHash, status", entry.transactionHash, status)
              // If transaction is successful, update status to 'Success'
              try {
                await updateTransactionStatus(entry.transactionHash, status);
                realm.write(async () => {
                  entry.transactionStatus = 'Success';
                  // Update user transaction list from local database
                  let uniqueArr = await getUserTransactionListFromLocalDb(currentNetwork.name)
                  setTransactionRecord(uniqueArr);
                });
              }
              catch (e) {
                console.log("status updated", e)
              }
            } else if (status === 0) {
              // If transaction failed, update status to 'Fail'
              updateTransactionStatus(status, entry.transactionHash);
              realm.write(async () => {
                entry.transactionStatus = 'Fail';
                // Update user transaction list from local database
                let uniqueArr = await getUserTransactionListFromLocalDb(currentNetwork.name)
                setTransactionRecord(uniqueArr);
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
      console.log("verify transaction error", error, error.response.data)
      throw error;
    }
  };

  let updateTransactionStatus = async (transactionHash, status) => {
    // console.log("sanchaaa",
    //   console.log("userrr", userAddress))


    try {
      let userAddress = await AsyncStorage.getItem('address');

      await updateUserTransactionStatus({
        walletAddress: userAddress,
        transactionHash: transactionHash,
        status: status
      })
      // console.log("transaction verify")
    }
    catch (e) {
      console.log("update transaction status error", e, e.response.data)
      throw e

    }

  }
  onRefresh = async () => {
    setRefreshing(true);
    await setupLocalData();
    setRefreshing(false);
  };



  return (

    <React.Fragment>
      <StatusBarNU
        backgroundColor={theme?.BACKGROUND_COLOR}
      />

      <Modal visible={showIntro} animationType="fade" transparent={true}>
        <View style={[styles.modalBackground]}>
        <BlurView style={styles.absoluteBlur} blurType="dark" blurAmount={1} />

          <View style={[styles.introContainer, { backgroundColor: COLORS.BALANCE_CARD_BACKGROUND }]}>
            <IntroSlider theme={theme} onDone={closeIntro} />
          </View>
        </View>
      </Modal>



      <View style={[styles.mainContainer, { backgroundColor: theme?.BACKGROUND_COLOR }]}>
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme?.PRIMARY_COLOR || '#007AFF'}
              colors={[theme?.PRIMARY_COLOR || '#007AFF']}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {isLoading === true ?
            <BalanceShimmer selectedTheme={selectedTheme} /> :
            <BalanceCard
              switchNetwork={() => {
                setNetworkSwitchModal(true)
              }}
              selectedTheme={selectedTheme}
              isLoading={isLoading}
              balance={balance}
              userAddress={userAddress}
              copy={() => {
                Clipboard.setString(userAddress);
                DropDownHolder.alert('Success', 'Copy', `The wallet address has been copied successfully.`);
              }}
              currentNetwork={currentNetwork}
              balanceError={balanceError}
            />
          }

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
          />

          <TransactionRefreshAndView
            selectedTheme={selectedTheme}
            viewAll={() => navigation.navigate(`${ENUMS.SCREENS.ALL_TRANSACTION}`)}
            refresh={() => onRefresh()}
          />

          {isTransactionLoading === true ?
            <TransactionShimmer selectedTheme={selectedTheme} /> :
            transactionRecord.length > 0 ?
              <FlatList
                data={transactionRecord}
                keyExtractor={(item, index) => index.toString()}
                inverted={false}
                scrollEnabled={false}  // Disable FlatList scrolling since parent ScrollView handles it
                renderItem={({ item }) => (
                  <Transaction
                    userAddress={userAddress}
                    navigation={navigation}
                    selectedTheme={selectedTheme}
                    item={item}
                  />
                )}
              /> :
              <NoTransactionFound theme={theme} />
          }
        </ScrollView>
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  introContainer: {
    width: "90%",
    height: "50%",
    backgroundColor: "white", // White box for the intro slider
    borderRadius: 10,

    padding: 16,
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  absoluteBlur: {
    ...StyleSheet.absoluteFillObject, // Covers the entire screen
  },



});

export default Dashboard;
