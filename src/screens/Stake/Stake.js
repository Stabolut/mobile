import React, { useEffect, useReducer, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList
} from 'react-native';
import { COLORS, ENUMS, THEME, Str } from '../../common';
import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';
import Header from '../../components/Header/Header';
import TransactionLoader from '../Dashboard/TransactionLoader';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import ErrorMessage from '../../components/ErrorComponent/ErrroMessage';
import StakingBalance from './StakingBalance';
import { ErrorMessages } from '../../messages/errorMessage';
import { checkInternetConnectivity, errorMessageHandler } from '../../utils/utils';
import { useSelector } from 'react-redux';
import { getInStake, withdrawalToken } from '../../api/wallet';
import moment from 'moment';
import Realm from 'realm';
import uuid from 'react-native-uuid';
import { getRealmInstance } from '../../utils/realmDbCreation';





let initialState = {
  isLoading: false,
  isError: false,
  data: [],
  amount: 0,
  message: "",
  stakeReward: 0,
  apr: 0
}


let reducer = (currentState, action) => {
  switch (action.type) {
    case "fetch":
      return { ...initialState, isLoading: true, isError: false }
    case "fetchSuccess":
      return { ...currentState, isLoading: false, isError: false, data: action.payload.stakeList, amount: action.payload.stakeAmount, stakeReward: action.payload.stakeReward, apr: action.payload.apr }
    case "fetchFail":
      return { ...currentState, isLoading: false, isError: true, message: action.payload }
  }

}


function Stake(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [isError, setIsError] = useState(false);


  const [getObject, dispatch] = useReducer(reducer, initialState)
  let selectedTheme = useSelector((state) => state.walletReducer.theme)
  let currentNetwork = useSelector((state) => state.walletReducer.currentNetwork)
  const theme = THEME[selectedTheme];
  useEffect(() => {
    fetchStake()
  }, [])
  fetchStake = (async () => {

    let isConnected = await checkInternetConnectivity()
    if (!isConnected) {
      alert(ErrorMessages.GENERIC.NO_INTERNET_ERROR)
      return

    }

    dispatch({ type: "fetch", payload: {} })

    let address = await AsyncStorage.getItem('address');

    try {

      let data = await getInStake({ account: address, network: currentNetwork.name })
      console.log("data.data.data.stake[0].stakeBucketsList", data.data.data.stake[0].stakeBucketsList)

      if (data.data.data.stake[0].totalRewardOnStake === 0) {
        setDisable(true)
      }
      else {
        setDisable(false)
      }
      dispatch({ type: "fetchSuccess", payload: { stakeList: data.data.data.stake[0].stakeBucketsList, stakeAmount: data.data.data.stake[0].totalAmountInStake, stakeReward: data.data.data.stake[0].totalRewardOnStake, apr: data.data.data.apr } })
    }
    catch (e) {
      let msg = errorMessageHandler(e)
      dispatch({ type: "fetchFail", payload: msg })
      return;
    }


  })

  let withdrawToken = async () => {
    // now we send funds

    try {

      let isConnected = await checkInternetConnectivity()
      if (!isConnected) {
        alert(ErrorMessages.GENERIC.NO_INTERNET_ERROR)
        return

      }
      setIsLoading(true);
      setDisable(true);

      let { data } = await withdrawalToken({ walletAddress: props.route.params.userAddress, amount: getObject.stakeReward, network: currentNetwork.name })
      saveDB(data.data)
      fetchStake()
      setIsLoading(false);
      setDisable(false);

      Alert.alert(
        "Success", // Title
        "You have successfully withdrawn your staking reward!", // Message
        [
          { text: "OK", onPress: () => console.log("Success Alert Closed") }, // Button
        ],
        { cancelable: false }
      );


    } catch (e) {

      let msg = errorMessageHandler(e)
      setIsError(true);
      setIsLoading(false);
      setDisable(false);

      Alert.alert(
        "Failure", // Title
        msg, // Message
        [

          { text: "Cancel", onPress: () => console.log("Cancel Pressed"), style: "cancel" }, // Cancel button
        ],
        { cancelable: false }
      );

    }
  }

  const saveDB = (data) => {

    try {
      const uniqueID = uuid.v4();
      // Create a new Realm with the transaction schema
      let realm = getRealmInstance()
      // Create a w transaction object with the current date
      const transactionObject = {
        uniqueKey: uniqueID,
        senderAddress: currentNetwork.fundindAddress,
        receiverAddress: props.route.params.userAddress,
        amountToSend: parseFloat(data.amountToSend),
        transactionStatus: 'Pending',
        sendDate: data.sendDate,// date, // Set the date property to the current date
        transactionHash: data.transactionHash,
        transactionNotes: data.transactionNotes,
        network: data.network,
        transactionType: data.transactionType

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
      <Header theme={theme} headerText="Stake USB" navigation={props.navigation}></Header>
      <View style={[styles.mainContainer, { backgroundColor: theme?.BACKGROUND_COLOR, }]}>


        <StakingBalance theme={theme} stakeAmount={getObject.amount} balance={props.route.params.balance} userAddress={props.route.params.userAddress}></StakingBalance>

        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <TouchableOpacity onPress={() => {
            props.navigation.navigate(ENUMS.SCREENS.ADD_STAKE, { balance: props.route.params.balance })
          }}

            style={styles.btnStyleSend}>
            <Text style={styles.textStyleSend}>Stake</Text>
          </TouchableOpacity>
        </View>



        {/* <Text style={{ color: COLORS.WHITE, alignSelf: "center", fontSize: 12, fontFamily: "Poppins", textAlign: 'justify' }}>To form a stake, a minimum of 100 USBs is required.</Text> */}




        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>

          <Text style={[styles.eurbMainAccountText, { color: theme?.WHITE }]}>Claim</Text>
          {/* <Text style={{ color: COLORS.WHITE, textAlign: 'justify',fontSize:12,fontFamily: "Poppins" }}>Users who stake their USB coins in our staking pool have the opportunity to earn lucrative rewards. With a 0.03% return every 8 hours, you can accumulate substantial rewards by participating in our staking program. After the 8-hour period, users can claim their earned rewards.</Text> */}
          <Text style={{ color: theme?.WHITE, textAlign: 'justify', fontSize: 12, fontFamily: "Poppins", marginRight: 8 }}>Earn lucrative rewards by staking USB coins for a period of 1 day and claiming earnings thereafter. </Text>
        </View>




        {getObject.isLoading === true ? <TransactionLoader></TransactionLoader> :
          getObject.isError === true ? <View style={{ padding: 16 }}>
            <ErrorMessage message={getObject.message}></ErrorMessage>
          </View>
            :

            <View >
              <View style={[styles.stakingCardMainViewStyle, {
                justifyContent: "space-between", // Align items at start and end
                flexDirection: "row",
                alignItems: "center", // Align items vertically in the center

              }]}>
                <View style={{
                  flex: 1, borderRadius: 8,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 24,
                  backgroundColor: theme?.BALANCE_CARD_BACKGROUND
                }}>
                  <Text style={[styles.totalRewardHeading, { color: theme?.WHITE, fontWeight: 500, marginBottom: 6 }]} >Staking Reward</Text>
                  <Text style={[styles.totalRewardHeading, { color: theme?.WHITE }]} >{parseFloat(getObject?.stakeReward).toFixed(4)} USB</Text>

                </View>
                {/* <View style={{ height: 70,width:3, backgroundColor: COLORS.BTN_BACKGROUND_COLOR,marginHorizontal:4 }}></View> */}

                <View style={{
                  flex: 1, borderRadius: 8,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 24,
                  marginLeft: 8,
                  backgroundColor: theme?.BALANCE_CARD_BACKGROUND,
                }}>
                  <Text style={[styles.totalRewardHeading, { color: theme?.WHITE, fontWeight: 500, marginBottom: 6 }]} >APR</Text>
                  <Text style={[styles.totalRewardHeading, { color: theme?.WHITE }]} >{getObject.apr}%</Text>

                </View>



              </View>
              <View style={{ paddingLeft: 16, paddingRight: 16 }}>
                <TouchableOpacity disabled={disable} onPress={withdrawToken}

                  style={[styles.btnStyleSend, { opacity: disable === true ? 0.7 : 1, }]}>
                  {isLoading ? <ActivityIndicator></ActivityIndicator> :
                    <Text style={styles.textStyleSend}>Claim Now</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
        }



        {
          getObject.data.length > 0 ? (
            <>
              <Text style={[styles.eurbMainAccountText, { color: theme?.WHITE, paddingLeft: 16, marginTop: 12 }]}>Staking Overview</Text>
              <FlatList
                data={getObject.data}
                keyExtractor={(item, index) => index.toString()}
                inverted={false}
                renderItem={({ item }) => (
                  <View>
                    <View
                      style={[
                        styles.stakingCardMainViewStyle,
                        {
                          backgroundColor: theme?.BACKGROUND_COLOR,
                          borderColor: theme?.STAKE_LIST_BORDER_COLOR,

                        },
                      ]}
                    >
                      <View style={{ flexDirection: "row", flex: 1 }}>
                        <View style={{ flex: 1, justifyContent: "center" }}>
                          <Text
                            style={[
                              styles.totalRewardHeading,
                              { color: theme?.WHITE },
                            ]}
                          >
                            Staked Amount: {item?.amount} USB
                          </Text>
                          <Text
                            style={{
                              color: theme?.WHITE,
                              fontSize: 12,
                              marginTop: 4,
                            }}
                          >
                            <Text style={{ fontWeight: "bold" }}>Staked On: </Text>
                            {moment(item.timestamps.created_At).format(
                              "DD MMM YYYY, HH:mm"
                            )}
                          </Text>
                        </View>
                        <View
                          style={{
                            justifyContent: "flex-start",
                            flex: 1,
                            alignItems: "flex-end"
                          }}
                        >
                          <Text
                            style={[
                              styles.balanceTextHeading,
                              {
                                fontWeight: "900",
                                color: theme?.WHITE,
                              },
                            ]}
                          >
                            Total Rewards Earned
                          </Text>
                          <Text
                            style={{
                              color: theme?.WHITE,
                              fontSize: 12,
                              marginTop: 4,
                            }}
                          >
                            {parseFloat(item?.rewardAmountOnStaking).toFixed(4)} USB
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              />
            </>
          ) : null
        }

      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  btnStyleSend: {
    height: 45,
    width: '100%',
    backgroundColor: COLORS.BTN_BACKGROUND_COLOR,
    color: COLORS.WHITE,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  arrowRefresh: {

    marginLeft: 8,
    marginTop: 4,
    fontWeight: "bold"
  },

  textStyleSend: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontFamily: "Poppins"
  },
  eurbMainAccountText: {

    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins"

  },
  stakingCardMainViewStyle: {

    width: "100%",

    padding: 14,
    borderRadius: 5,
    // borderWidth: 2,

    // shadowColor: COLORS.WHITE,


  },
  balanceTextHeading: {

    fontSize: 12,
    fontWeight: "400",

    fontFamily: "Poppins",
  },
  totalRewardHeading: {


    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Poppins"
  },



});


export default Stake
