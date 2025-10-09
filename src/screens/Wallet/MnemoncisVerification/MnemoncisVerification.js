import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  Alert
} from 'react-native';
import { COLORS, ENUMS, Str, THEME } from '../../../common';
import StatusBarNU from '../../../components/StatusBarNU/StatusBarNU';
import { ethers } from 'ethers';
import _ from 'lodash';
import LoadingModal from '../../../components/LoadingModal/modal';
import AsyncStorage from '@react-native-community/async-storage';
import { storeReferralInfo, storeWalletInfo } from '../../../redux/action/wallet';
import axios from "axios"
import { store } from '../../../store';
import { checkInternetConnectivity, errorMessageHandler, getFcmTokenFromLocalStorage } from '../../../utils/utils';
import { ErrorMessages } from '../../../messages/errorMessage';
import { addWalletWithFcm } from '../../../api/wallet';
import { getStableDeviceId } from '../../../utils/deviceIdentity';
const windowHeight = Dimensions.get('window').height;



class MnemoncisVerification extends React.Component {
  state = {
    mnemonicsArray: [],
    shuffledArray: [],
    userSelection: [],
    isError: false,
    disabled: true,
    isLoading: false,
    isDone: false,
    referenceCode: ""
  };



  componentDidMount() {


    const shuffledArray = _.shuffle(this.props.route.params.mnemonics);

    this.setState({
      shuffledArray: shuffledArray,
      mnemonicsArray: this.props.route.params.mnemonics,
    });
  }
  checkUserSelection(selection) {
    return selection.every(
      (element, index) => element === this.state.mnemonicsArray[index],
    );
  }

  removeSelection(element) {
    this.setState(
      {
        shuffledArray: [...this.state.shuffledArray, element],
        userSelection: this.state.userSelection.filter(function (item) {
          return item !== element;
        }),
      },
      () => {

        const isMatch = this.checkUserSelection(this.state.userSelection);

        if (isMatch) {
          if (this.state.userSelection.length === 12) {
            this.setState({ disabled: false, isDone: true });
          }
          this.setState({ isError: false });

        } else {
          this.setState({ isError: true });

        }
      },
    );
  }

  addElement(element) {


    this.setState(
      {
        userSelection: [...this.state.userSelection, element],
        shuffledArray: (() => {
          const index = this.state.shuffledArray.indexOf(element);
          if (index !== -1) {
            const newArray = [...this.state.shuffledArray];
            newArray.splice(index, 1); // Remove one instance of element
            return newArray;
          }
          return this.state.shuffledArray; // If element is not found, return the original array
        })()


      },
      () => {

        const isMatch = this.checkUserSelection(this.state.userSelection);

        if (isMatch) {
          if (this.state.userSelection.length === 12) {
            this.setState({ disabled: false, isDone: true });
          }
          this.setState({ isError: false });

        } else {
          this.setState({ isError: true });

        }
      },
    );
  }

  // above noble pyramid group sand dynamic eager mouse fatal bullet smile common

  render() {
    let selectedTheme = store.getState().walletReducer?.theme
    let theme = THEME[selectedTheme]
    return (
      <React.Fragment>
        <StatusBarNU
          backgroundColor={theme?.BACKGROUND_COLOR}

        />
        <View style={[styles.mainContainer, { backgroundColor: theme?.BACKGROUND_COLOR, }]}>
          <LoadingModal
            task={'Creating Wallet...'}
            modalVisible={this.state.isLoading}
          />

          <ScrollView>
            <View style={styles.mainContainerChild1}>
              <View style={styles.topHeadingView}>
                <Text style={[styles.topHeadingViewText_1, { color: theme?.WHITE, }]}>
                  Verify the Secret Phrase
                </Text>
                <Text style={[styles.topHeadingViewText_2, { color: theme?.SMALL_HEADING_TEXT, }]}>
                  Tap the words to put them next to each other in the correct
                  order
                </Text>
              </View>

              <View style={[styles.selectMnemonicsViewMain, { backgroundColor: theme?.BALANCE_CARD_BACKGROUND }]}>
                {this.state.userSelection.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      this.removeSelection(item);
                    }}
                    style={styles.selectMnemonicsBox}>
                    <Text
                      style={{
                        color: theme?.SMALL_HEADING_TEXT,
                        fontFamily: 'Poppins',
                      }}>
                      {index + 1}
                    </Text>
                    <Text
                      style={{
                        color: theme?.WHITE,
                        marginLeft: 2,
                        fontFamily: 'Poppins',
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {this.state.isError === true ? (
                <View
                  style={[
                    {
                      alignItems: 'center',
                      backgroundColor: theme?.BALANCE_CARD_BACKGROUND,
                      paddingBottom: 8,
                      fontFamily: 'Poppins',
                    },
                  ]}>
                  <Text style={styles.errorMessage}>
                    Invalid Code. Try again!
                  </Text>
                </View>
              ) : this.state.isDone === true ? (
                <View
                  style={[
                    {
                      alignItems: 'center',
                      backgroundColor: theme?.BALANCE_CARD_BACKGROUND,
                      paddingBottom: 8,
                      fontFamily: 'Poppins',
                    },
                  ]}>
                  <Text style={styles.successMessage}>Well done!</Text>
                </View>
              ) : null}

              <View style={styles.shuffleMnemonicsView}>
                {this.state.shuffledArray.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      this.addElement(item);
                    }}
                    style={styles.shuffleMnemonicsBox}>
                    <Text
                      style={{
                        color: theme?.WHITE,
                        marginLeft: 2,
                        fontFamily: 'Poppins',
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>





          </ScrollView>

          <View style={styles.mainContainerChild2}>
            {this.state.disabled === false &&

              <View style={{
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderColor: 'gray',
                marginBottom: 12,
                borderWidth: 1,
                borderRadius: 10,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}>
                <TextInput
                  value={this.state.referenceCode}
                  onChangeText={newValue => {
                    this.setState({ referenceCode: newValue });
                  }}

                  placeholderTextColor={theme?.SMALL_HEADING_TEXT} placeholder='Referral ID  (Optional)' style={{ color: theme?.WHITE, flex: 80 }}></TextInput>


              </View>
            }


            <TouchableOpacity
              onPress={async () => {


                // let isConnected = await checkInternetConnectivity()

                // if (!isConnected) {

                //   Alert.alert(ErrorMessages.GENERIC.NO_INTERNET_ERROR)
                //   return

                // }

                this.setState({ isLoading: true, disabled: true });
                setTimeout(async () => {

                  let deviceId = null
                  let mobileFcmToken = await getFcmTokenFromLocalStorage();

                  try {
                    // Obtain FCM token
                    deviceId = await getStableDeviceId();

                  }
                  catch (e) {

                  }

                  try {


                    const wallet = ethers.Wallet.fromMnemonic(
                      this.props.route.params.actualMnemonics,
                    );

                    let { data } = await addWalletWithFcm({
                      account: wallet.address,
                      token: mobileFcmToken,
                      referenceCode: this.state.referenceCode,
                      type: "New",
                      deviceId: deviceId

                    })

                    await AsyncStorage.setItem('address', wallet.address);
                    await AsyncStorage.setItem('privateKey', wallet.privateKey);
                    await AsyncStorage.setItem('mnemonics', this.props.route.params.actualMnemonics);
                    if (mobileFcmToken) { await AsyncStorage.setItem("fcmToken", mobileFcmToken); }

                    store.dispatch(storeWalletInfo(true))
                    store.dispatch(storeReferralInfo({ referralCode: data.data.referralCode }))

                    this.setState({ isLoading: false, disabled: false });
                    this.props.navigation.popToTop();
                    this.props.navigation.replace(`${ENUMS.SCREENS.DASHBOARD}`);

                  }
                  catch (error) {

                    let msg = errorMessageHandler(error)
                    this.setState({
                      isLoading: false,
                      disabled: false,

                    });
                    alert(msg)
                  }
                }, 500);
              }
              }
              disabled={this.state.disabled}
              style={[
                styles.btnStyleDone,
                {
                  opacity: this.state.disabled === true ? 0.4 : 1,
                },
              ]}>
              <Text style={styles.textStyleDone}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  mainContainerChild1: {
    flex: 1,
    paddingTop: 40,
  },
  mainContainerChild2: {
    marginBottom: 24,
    alignItems: 'center',
    paddingLeft: 32,
    paddingRight: 32,
  },

  topHeadingView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    paddingLeft: 32,
    paddingRight: 32,
  },

  topHeadingViewText_1: {
    fontSize: 22,
    fontFamily: 'Poppins',
  },
  topHeadingViewText_2: {
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'Poppins',
  },

  selectMnemonicsViewMain: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    paddingLeft: windowHeight >= 630 ? 32 : 0,
    paddingRight: windowHeight >= 630 ? 32 : 0,

    paddingBottom: windowHeight >= 630 ? 64 : 32,
    paddingTop: 64,

  },



  selectMnemonicsBox: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 8,
    paddingBottom: 8,
    marginRight: 8,
    marginBottom: 12,
    textAlign: 'center',
    borderRadius: 3,
    borderColor: COLORS.SLIDER_BORDER_COLOR,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },

  shuffleMnemonicsView: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingLeft: windowHeight >= 630 ? 32 : 8,
    paddingRight: windowHeight >= 630 ? 32 : 8,
  },


  shuffleMnemonicsBox: {
    padding: 8,
    marginRight: 8,
    marginBottom: 12,
    textAlign: 'center',
    borderRadius: 3,
    borderColor: COLORS.APP_NORMAL_TEXT_COLOR_BALCK,
    borderWidth: 1,
    flexDirection: 'row',

    alignItems: 'center',
  },
  errorMessage: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    textDecorationLine: 'none',
    fontSize: 16,
    color: 'red',
    letterSpacing: 0.1,
  },
  successMessage: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    textDecorationLine: 'none',
    fontSize: 16,
    color: 'green',
    letterSpacing: 0.1,
  },

  btnStyleDone: {
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

  textStyleDone: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontFamily: 'Poppins',
  },
});

export default MnemoncisVerification;
