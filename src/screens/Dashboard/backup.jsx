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