import React, { useEffect, useReducer } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  Image

} from 'react-native';
import { COLORS, ENUMS, Images, Str } from '../../common';
import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';
import Header from '../../components/Header/Header';
import TransactionLoader from '../Dashboard/TransactionLoader';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import ErrorMessage from '../../components/ErrorComponent/ErrroMessage';
import StakingBalance from './StakingBalance';
import { ErrorMessages } from '../../messages/errorMessage';
import { checkInternetConnectivity, errorMessageHandler } from '../../utils/utils';





let initialState = {
  isLoading: false,
  isError: false,
  data: [],
  amount: 0,
  message: ""
}


let reducer = (currentState, action) => {
  switch (action.type) {
    case "fetch":
      return { ...initialState, isLoading: true, isError: false }
    case "fetchSuccess":
      return { ...currentState, isLoading: false, isError: false, data: action.payload.stakeList, amount: action.payload.stakeAmount }
    case "fetchFail":
      return { ...currentState, isLoading: false, isError: true, message: action.payload }
  }

}


function Stake(props) {
  const [getObject, dispatch] = useReducer(reducer, initialState)
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

      console.log("url",`${Str.apiUrl}/staking/get-in-stake`)
      let { data } = await axios.post(`${Str.apiUrl}/staking/get-in-stake`, {
        account: address
      });
      console.log("data", data)


      dispatch({ type: "fetchSuccess", payload: { stakeList: data.data[0].stakeBucketsList, stakeAmount: data.data[0].totalAmountInStake } })
    }
    catch (e) {

      let msg = errorMessageHandler(e)

      dispatch({ type: "fetchFail", payload: msg })
      return;
    }


  })

  let refresh = () => {
    fetchStake()
  }


  return (
    <React.Fragment>



      <StatusBarNU
        backgroundColor={COLORS.BACKGROUND_COLOR}
        barStyle="light-content"
      />
      <Header headerText="Stake USB" navigation={props.navigation}></Header>
      <View style={styles.mainContainer}>


        <StakingBalance stakeAmount={getObject.amount} balance={props.route.params.balance} userAddress={props.route.params.userAddress}></StakingBalance>

        <View style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 16, paddingBottom: 8 }}>
          <TouchableOpacity onPress={() => {
            props.navigation.navigate(ENUMS.SCREENS.ADD_STAKE, { balance: props.route.params.balance })
          }}

            style={styles.btnStyleSend}>
            <Text style={styles.textStyleSend}>Stake</Text>
          </TouchableOpacity>
        </View>



        {/* <Text style={{ color: COLORS.WHITE, alignSelf: "center", fontSize: 12, fontFamily: "Poppins", textAlign: 'justify' }}>To form a stake, a minimum of 100 USBs is required.</Text> */}




        <View style={{ padding: 16, marginLeft: 2 }}>



          <Text style={[styles.eurbMainAccountText, { marginBottom: 6 }]}>Claim</Text>
          {/* <Text style={{ color: COLORS.WHITE, textAlign: 'justify',fontSize:12,fontFamily: "Poppins" }}>Users who stake their USB coins in our staking pool have the opportunity to earn lucrative rewards. With a 0.03% return every 8 hours, you can accumulate substantial rewards by participating in our staking program. After the 8-hour period, users can claim their earned rewards.</Text> */}
          <Text style={{ color: COLORS.WHITE, textAlign: 'justify', fontSize: 12, fontFamily: "Poppins", marginRight: 8 }}>Earn lucrative rewards by staking USB coins for a period of 1 month and claiming earnings thereafter. </Text>
        </View>

        {/* <View style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8 }}>
            <TouchableOpacity

              style={styles.btnStyleSend}>
              <Text style={styles.textStyleSend}>Claim</Text>
            </TouchableOpacity>
          </View> */}
        <View style={{ paddingLeft: 16, paddingTop: 8, marginLeft: 2, flexDirection: "row" }}>
          <Text style={[styles.eurbMainAccountText, { marginBottom: 6 }]}>Buckets</Text>

          <TouchableOpacity onPress={refresh}>
            <Feather
              name="refresh-ccw"
              style={styles.arrowRefresh}
              size={16}
            />
          </TouchableOpacity>



        </View>

        {
          getObject.isLoading === true ? <TransactionLoader></TransactionLoader> :
            getObject.isError === true ? <View style={{ padding: 16 }}>
              <ErrorMessage message={getObject.message}></ErrorMessage>
            </View>
              :
              getObject.data.length > 0 ?

                <FlatList
                  data={getObject.data}
                  keyExtractor={(item, index) => index.toString()}
                  inverted={false}
                  renderItem={({ item }) => (
                    <View style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12 }} >
                      <View style={styles.stakingCardMainViewStyle}>
                        <View style={{ flexDirection: "row", flex: 1 }}>
                          <View style={{ flex: 1, justifyContent: "center" }}>
                            <Text style={styles.totalRewardHeading} >Total Stack ({item?.amount} USB)</Text>
                            <Text style={{ color: COLORS.WHITE, fontSize: 12, marginTop: 4 }}><Text style={{ fontWeight: "bold" }}>Date</Text>:{moment(item.timestamps.created_At).format("DD MMM YYYY, HH:mm")}</Text>

                          </View>
                          <View style={{ justifyContent: "flex-end", flex: 1, alignItems: "flex-end" }}>
                            <Text style={[styles.balanceTextHeading, { fontWeight: "900" }]}>Reward</Text>

                            <Text style={{ color: COLORS.WHITE, fontSize: 12, marginTop: 4 }}>{item?.yieldAmount} USB</Text>

                          </View>
                        </View>

                      </View>

                    </View>

                  )}
                />
                :
                <View style={{ paddingLeft: 16, paddingRight: 16, marginRight: 8 }}>

                  <Text style={{ color: COLORS.WHITE, textAlign: 'justify', fontSize: 12, fontFamily: "Poppins", marginRight: 8 }}>When you stake, a bucket is reserved for the staked amount for a duration of 1 month.
                    After the month, the staked tokens are returned to you along with a yield.
                    On average, the yield is 2.5% per month.</Text>
                  <View style={{ padding: 16, borderRadius: 8, backgroundColor: "#4d4b70", marginTop: 16 }}>
                    <Text style={[styles.totalRewardHeading, { alignSelf: "center" }]} >You have 0 non-delegated buckets</Text>

                  </View>
                </View>
        }











      </View>








    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_COLOR,
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
    color: COLORS.WHITE,
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
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins"

  },
  stakingCardMainViewStyle: {

    width: "100%",

    padding: 14,
    backgroundColor: "#0a0b1d",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4d4b70",
    shadowColor: COLORS.WHITE,


  },
  balanceTextHeading: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: "400",

    fontFamily: "Poppins",
  },
  totalRewardHeading: {
    color: COLORS.WHITE,

    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Poppins"
  },



});


export default Stake
