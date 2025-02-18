import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,

} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { isEmpty } from 'lodash';
import Realm from 'realm';
import { useState, useContext } from 'react';
import { ENUMS, COLORS, Str, THEME } from '../../../common';
import StatusBarNU from '../../../components/StatusBarNU/StatusBarNU';
import Header from '../../../components/Header/Header';
import AsyncStorage from '@react-native-community/async-storage';
import LoadingModal from '../../../components/LoadingModal/modal';
import { ethers } from 'ethers';
import axios from 'axios';
import SuccessModal from '../../../components/Modal/SuccessModal';
import QRCodeScanner from 'react-native-qrcode-scanner';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import uuid from 'react-native-uuid';
import { connect } from 'react-redux';
import { SocketContext } from '../../../App';
import socketDisconnectMessage from '../../../components/CustomHook/socketDisconnectMessage';
import Notes from '../../../components/Modal/Notes';
import ErrorMessage from '../../../components/ErrorComponent/ErrroMessage';
import SuccessMessage from '../../../components/SuccessComponent/SuccessMessage';
import { checkInternetConnectivity, errorMessageHandler } from '../../../utils/utils';
import { ErrorMessages } from '../../../messages/errorMessage';
import { useSelector } from 'react-redux';
import { transfer } from '../../../api/wallet';
import { getRealmInstance } from '../../../utils/realmDbCreation';

const getDecimalSeparator = () => {
  if (Platform.OS === 'ios') {
    return '.';
  } else {
    // For simplicity, let's assume using period for Android
    return '.';
  }
};


function Transfer({ navigation, route }) {
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState(0);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [visible, setVisible] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [transferHash, setTransferHash] = useState('');
  const [isSelected, setSelection] = useState(false);
  const [visibleNotes, setVisibleNotes] = useState(false)
  const [transactionNotes, setTransactionNotes] = useState("")
  const [timeoutId, setTimeoutId] = useState(null);
  const [accountInfo, setAccountInfo] = useState(null);
  const [wrongAccountMessage, setWrongAccountMessage] = useState(null);
  const [username, setUsername] = useState(false);
  const [account, setAccount] = useState("");
  const [isContactOnly, setIsContactOnly] = useState(false);
  let selectedTheme = useSelector((state) => state.walletReducer.theme)
  let currentNetwork = useSelector((state) => state.walletReducer.currentNetwork)
  // let provider = new ethers.providers.JsonRpcProvider(currentNetwork.rpcUrl)

  const theme = THEME[selectedTheme];

  const decimalSeparator = getDecimalSeparator();

  const socketConnection = useContext(SocketContext);
  socketDisconnectMessage(socketConnection.connectionStatus);
  useEffect(() => {
    //alert('i am connected 1');
    if (transferHash) {
      if (socketConnection.isSocketConnected && socketConnection.socket) {
        // alert('now hash');
        let date = new Date();
        socketConnection.socket.emit('transferEvent', {
          receiverAddress: username === true ? account : receiver,
          senderAddress: sender,
          amount: parseFloat(amount),
          date: date,
          transactionHash: transferHash,
          transactionNotes: transactionNotes,
          transactionType: "Transfer",
          network: currentNetwork.name
        });
      }
      return () => {
        socketConnection.socket.off('transferEvent');
      };
    }
  }, [transferHash]);

  // get user address
  useEffect(() => {
    getLocalAddress = async () => {
      let senderAddress = await AsyncStorage.getItem('address');
      setSender(senderAddress);
    };
    getLocalAddress();
  }, []);

  useEffect(() => {
    getLocalAddressReceiver = async () => {

      let contactOnly = await AsyncStorage.getItem("allowContact")

      if (contactOnly === "true") {
        setReceiver(route.params.receipent);
        setIsContactOnly(true)
      }
    };
    getLocalAddressReceiver();
  }, []);

  useEffect(() => {

    setVisibleNotes(isSelected)

  }, [isSelected]);




  checkValidation = () => {

    // Check Validation
    if (receiver === '' || receiver === null || receiver === undefined) {
      setIsError(true);
      setMessage("The recipient's address field must be filled in.");
      return false
    } else if (amount === '' || amount === null || amount === undefined) {
      setIsError(true);
      setMessage('The field for the amount must be completed.');
      return false
    } else if (sender === receiver || sender === account) {
      setIsError(true);
      setMessage('The transaction is invalid as you are attempting to send funds to your own account.');
      return false
    } else if (parseFloat(amount) < 0.01) {
      setIsError(true);
      setMessage(
        "It appears that the entered amount value is incorrect. Please ensure that the amount value is greater than 0.01",
      );
      return false
    }
    else {
      setIsError(false);
      return true
    }

  }
  // now we send funds
  const sendFunds = async () => {
    try {


      let isConnected = await checkInternetConnectivity()
      if (!isConnected) {
        alert(ErrorMessages.GENERIC.NO_INTERNET_ERROR)
        return

      }

      //
      let returnValue = checkValidation()
      if (!returnValue) return
      setIsLoading(true);
      setDisable(true);
      setMessage('');

      // Check balance
      const provider = new ethers.providers.JsonRpcProvider(currentNetwork.rpcUrl);
      const contract = new ethers.Contract(
        currentNetwork.contractAddress,
        Str.ABI,
        provider,
      );
      let balance = await contract.balanceOf(sender);
      balance = parseFloat(balance) / Str.TOKEN_DECIMAL
      let amountToSend = parseFloat(amount) * Str.TOKEN_DECIMAL;

      // if user balance less then sending amount
      // if (balance < (parseFloat(amount) + parseFloat(Str.fees))) {
      if (balance < parseFloat(amount)) {
        setIsError(true);
        // setMessage(`Insufficient balance to complete the transaction. The sending amount must include an additional ${Str.fees} USB tokens to cover the transaction fee.`);
        setMessage("Insufficient balance to complete the transaction.");
        setIsLoading(false);
        setDisable(false);
        return;
      }



      //  =======get signature=======//
      let privateKey = await AsyncStorage.getItem('privateKey');

      const wallet = new ethers.Wallet(privateKey);
      const nonce = await contract.countOf(sender);
      const validReceiverAddress = receiver?.replace(/^(xdc)/i, "0x");

      const transferHex = await contract.getTransferPreSignedHash(
        currentNetwork.contractAddress,
        username === true ? account : validReceiverAddress,
        amountToSend,
        Str.fees * Str.TOKEN_DECIMAL,
        parseInt(nonce),
      );

    

      const signature = await wallet.signMessage(
        ethers.utils.arrayify(transferHex),
      );
      //  =======get signature=======//
      // await axios.post(`${Str.apiUrl}/wallet/transfer-token`
      //hit api to transfer funds
      let { data } = await transfer({
        signature: signature,
        toAddress: username === true ? account : validReceiverAddress,
        amount: amountToSend, //TODO:Minus the fess Str.fees
        nonce: parseInt(nonce),
        senderAddress: sender,
        originalAmount: amount,
        transNotes: transactionNotes,
        network: currentNetwork.name
      })
      // set transaction to the state and we have useEffect which is call and socket emit notificatio
      setTransferHash(data.data.txnHash.transactionHash);

      let date = new Date();
      saveDB(date, data.data.txnHash.transactionHash);
      setIsLoading(false);
      setDisable(false);

      let formatDate = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
      navigation.replace(`${ENUMS.SCREENS.SUCCESS}`, {
        amount: parseFloat(amount),
        date: formatDate,
        transactionHash: data.data.txnHash.transactionHash,
        successType: 'Send',
      });
    } catch (e) {

      let msg = errorMessageHandler(e)
      setIsError(true);
      setIsLoading(false);
      setDisable(false);
      setMessage(msg);

    }
  };

  const openScanner = () => {
    // handleCameraPermission();
    setScannerOpen(true);
  };
  closeScanner = () => {
    setScannerOpen(false);
  };
  onSuccess = e => {
    setReceiver(e.data);
    // do something with the scanned QR code data
    closeScanner();
  };

  const saveDB = (date, transactionHash) => {

    try {
      const uniqueID = uuid.v4();

      // Create a new Realm with the transaction schema
      let realm = getRealmInstance()

      // Create a w transaction object with the current date
      const transactionObject = {
        uniqueKey: uniqueID,
        senderAddress: sender,
        receiverAddress: username === true ? account : receiver,
        amountToSend: parseFloat(amount),
        transactionStatus: 'Pending',
        sendDate: date,// date, // Set the date property to the current date
        transactionHash: transactionHash,
        transactionNotes: transactionNotes,
        network: currentNetwork.name,
        transactionType: 'Transfer'

      };
      // Save the transaction object to the Realm
      realm.write(() => {
        realm.create('TransactionsHistorySchema', transactionObject);
      });

    } catch (e) {
      console.log('Execption', e, e.data);
    }
  };

  return (
    <React.Fragment>

      <StatusBarNU
        backgroundColor={theme?.BACKGROUND_COLOR}

      />
      <Header theme={theme} headerText="Transfer USB" navigation={navigation}></Header>

      <SuccessModal
        visible={visible}
        onClose={() => {
          setVisible(true);
        }}></SuccessModal>

      {scannerOpen && (
        <QRCodeScanner onRead={onSuccess} cameraStyle={{ height: '100%' }} />
      )}

      <View style={[styles.mainContainer, { backgroundColor: theme?.BACKGROUND_COLOR, }]}>
        <ScrollView style={styles.scrollView}>
          <LoadingModal task={'Sending US₿...'} modalVisible={isLoading} />

          <View
            style={{
              padding: 16,
              marginTop: 30,
              flexDirection: 'column',

            }}>
            <View style={[styles.container]}>
              <Text style={[styles.lableText, { color: theme?.WHITE, }]}>Sender</Text>
              <TextInput
                value={sender}
                multiline={true}
                editable={false}
                style={{
                  flexWrap: 'nowrap',
                  marginTop: 4,
                  color: theme?.SMALL_HEADING_TEXT,
                }}
              />
              <View
                style={{
                  height: 1,
                  marginTop: 4,
                  backgroundColor: COLORS.BELOW_HEADING_TEXT,
                  marginTop: 4,
                }}></View>
            </View>

            <View style={[styles.container, { marginTop: 20 }]}>
              <Text style={[styles.lableText, { color: theme?.WHITE, }]}>Receiver Address or ID</Text>
              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  value={receiver}
                  editable={!isContactOnly}
                  onChangeText={newValue => {

                    setReceiver(newValue);
                    clearTimeout(timeoutId); // Clear any existing timeout
                    const newTimeoutId = setTimeout(async () => {

                      try {

                        let { data } = await axios.post(`${Str.apiUrl}/user/retrieve-user-by-wallet-or-username`, {
                          userID: newValue
                        });

                        if (!isEmpty(data.data)) {
                          console.log("ussss 1")
                          setWrongAccountMessage
                          setAccountInfo(`Receiver address is: ${data.data.account.substring(0, 6)?.replace(/^0x/i, "xdc")}... Username: ${data.data.username}`)
                          setUsername(true)
                          setAccount(data.data.account)


                        }
                        else {
                          // setWrongAccountMessage(data.message)
                          setAccountInfo(null)
                          setUsername(false)
                        }



                      }
                      catch (e) {

                        setAccountInfo(null)
                        setUsername(false)
                      }
                    }, 1000);
                    setTimeoutId(newTimeoutId);
                  }}
                  multiline={true}
                  placeholder={"Enter receiver's address"}
                  placeholderTextColor={theme?.SMALL_HEADING_TEXT}
                  style={{
                    flexWrap: 'nowrap',
                    marginTop: 4,
                    color: theme?.SMALL_HEADING_TEXT,
                    flex: 1,
                  }}
                />
                <TouchableOpacity onPress={openScanner} disabled={isContactOnly} style={{ justifyContent: 'center', opacity: isContactOnly === true ? 0.5 : 1 }}>
                  <MaterialCommunityIcons

                    style={{ marginLeft: 8 }}
                    name="qrcode-scan"
                    size={25}
                    color={theme?.WHITE}></MaterialCommunityIcons>
                </TouchableOpacity>
              </View>


              <View
                style={{
                  height: 1,
                  backgroundColor: COLORS.BELOW_HEADING_TEXT,
                  marginTop: 4,
                }}></View>

              {accountInfo && (


                <SuccessMessage message={accountInfo}></SuccessMessage>
              )}
              {wrongAccountMessage && (


                <ErrorMessage message={wrongAccountMessage}></ErrorMessage>
              )}


            </View>

            <View style={[styles.container, { marginTop: 20 }]}>
              <Text style={[styles.lableText, { color: theme?.WHITE }]}>Amount</Text>
              <TextInput
                keyboardType="numeric"
                value={amount}
                onChangeText={newValue => {
                  const formattedValue = newValue.replace(',', decimalSeparator);
                  setAmount(formattedValue);
                }}
                multiline={true}
                placeholder={'Enter amount to send'}
                placeholderTextColor={theme?.SMALL_HEADING_TEXT}
                style={{
                  flexWrap: 'nowrap',
                  marginTop: 4,
                  color: theme?.SMALL_HEADING_TEXT,
                }}
              />

              <View
                style={{
                  height: 1,
                  backgroundColor: COLORS.BELOW_HEADING_TEXT,
                  marginTop: 4,
                }}></View>
            </View>
            {isError && (
              <ErrorMessage message={message}></ErrorMessage>
            )}

            <View style={{ flexDirection: 'row' }}>
              <View style={{
                flex: 1, flexDirection: "row", padding: 10,
                marginTop: 20
              }}>

                <CheckBox
                  value={isSelected}
                  tintColors={{ true: theme?.WHITE, false: theme?.WHITE }}
                  onValueChange={newValue => {
                    // let check = checkValidation()
                    // if (check) {
                    setSelection(newValue)
                    // }
                  }} />
                <Text style={{ marginTop: Platform.OS === 'ios' ? 9 : 6, marginLeft: Platform.OS === 'ios' ? 8 : 0, color: theme?.WHITE }}>Add Notes</Text>
                <View style={{
                  flex: 1, justifyContent: "flex-end",
                  alignContent: "flex-end"
                }}>
                  <Text
                    style={[{ marginTop: 5, alignSelf: "flex-end", color: theme?.WHITE }, styles.lableText]}>
                    Fee: {Str.fees} US₿
                  </Text>
                </View>
              </View>
            </View>

            {
              transactionNotes && <View style={{
                borderRadius: 10, shadowOpacity: 0.25,
                marginTop: 12,
                shadowRadius: 4, backgroundColor: theme?.BALANCE_CARD_BACKGROUND,
                padding: 16
              }}>
                <View style={{ flexDirection: "row" }}><Text style={{ flex: 1, fontWeight: "bold", color: theme?.WHITE }}>Notes</Text>
                  <TouchableOpacity onPress={() => {
                    setSelection(true)
                    setVisibleNotes(true)
                  }}><Text style={{ color: theme?.WHITE }}>Edit</Text></TouchableOpacity>
                </View>
                <Text style={{ marginTop: 12, color: theme?.SMALL_HEADING_TEXT }}>{transactionNotes}</Text>






              </View>
            }


          </View>
          <View style={{ padding: 16 }}>
            <TouchableOpacity
              disabled={disable}
              onPress={sendFunds}
              style={styles.btnStyleSend}>
              <Text style={styles.textStyleSend}>Send</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <Notes theme={theme} transactionNotes={transactionNotes} visible={visibleNotes} onClose={() => {
        setVisibleNotes(false)
        setSelection(false)

      }}
        onContinue={(notes) => {
          setVisibleNotes(false)
          setSelection(false)
          setTransactionNotes(notes)
          //sendFunds()

        }}





      ></Notes>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },

  lableText: {

    fontSize: 16,
    fontFamily: 'Poppins'

  },
  container: {
    width: '100%',
    padding: 10,
    flexDirection: 'column',
  },
  btnStyleSend: {
    height: 50,
    width: '100%',
    backgroundColor: COLORS.BTN_BACKGROUND_COLOR,
    color: COLORS.WHITE,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },

  textStyleSend: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontFamily: "Poppins"
  },

  spinnerTextStyle: {
    color: '#FFF',
    fontFamily: 'Poppins',
  },
});

// export default Transfer;

function mapStateToProps(state) {
  return {
    isConnected: state.socketReducer.isConnected,
    socket: state.socketReducer.socket,
    // map state to props
  };
}
export default connect(mapStateToProps, {})(Transfer);
