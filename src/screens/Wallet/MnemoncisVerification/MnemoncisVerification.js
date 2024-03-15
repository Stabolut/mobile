import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { COLORS, ENUMS, Str } from '../../../common';
import StatusBarNU from '../../../components/StatusBarNU/StatusBarNU';
import { ethers } from 'ethers';
import _ from 'lodash';
import LoadingModal from '../../../components/LoadingModal/modal';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from '@react-native-firebase/app'
import messaging from '@react-native-firebase/messaging'

import { storeWalletInfo } from '../../../redux/action/auth';
import axios from "axios"
import { store } from '../../../store';
import { checkInternetConnectivity } from '../../../utils/utils';
import { ErrorMessages } from '../../../messages/errorMessage';




class MnemoncisVerification extends React.Component {
  state = {
    mnemonicsArray: [],
    shuffledArray: [],
    userSelection: [],
    isError: false,
    disabled: true,
    isLoading: false,
    isDone: false,
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
        shuffledArray: this.state.shuffledArray.filter(function (item) {
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

  // above noble pyramid group sand dynamic eager mouse fatal bullet smile common

  render() {
    return (
      <React.Fragment>
        <StatusBarNU
          backgroundColor={COLORS.BACKGROUND_COLOR}
          barStyle="light-content"
        />
        <View style={styles.mainContainer}>
          <LoadingModal
            task={'Creating Wallet...'}
            modalVisible={this.state.isLoading}
          />

          <ScrollView>
            <View style={styles.mainContainerChild1}>
              <View style={styles.topHeadingView}>
                <Text style={styles.topHeadingViewText_1}>
                  Verify the Secret Phrase
                </Text>
                <Text style={styles.topHeadingViewText_2}>
                  Tap the words to put them next to each other in the correct
                  order
                </Text>
              </View>

              <View style={styles.selectMnemonicsViewMain}>
                {this.state.userSelection.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      this.removeSelection(item);
                    }}
                    style={styles.selectMnemonicsBox}>
                    <Text
                      style={{
                        color: COLORS.SMALL_HEADING_TEXT,
                        fontFamily: 'Poppins',
                      }}>
                      {index + 1}
                    </Text>
                    <Text
                      style={{
                        color: COLORS.WHITE,
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
                      backgroundColor: COLORS.BALANCE_CARD_BACKGROUND,
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
                      backgroundColor: COLORS.BALANCE_CARD_BACKGROUND,
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
                        color: COLORS.WHITE,
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
            <TouchableOpacity
              onPress={async () => {

                let isConnected = await checkInternetConnectivity()
                if (!isConnected) {
                  alert(ErrorMessages.GENERIC.NO_INTERNET_ERROR)
                  return

                }







                this.setState({ isLoading: true });
                setTimeout(async () => {

                  let mobileFcmToken

                  if (Platform.OS === 'ios') {
                    let fcmToken = await AsyncStorage.getItem("fcmToken")
                    if (fcmToken) mobileFcmToken = fcmToken
                    else mobileFcmToken = await messaging().getToken(firebase.app().options.messagingSenderId)
                  }


                  if (Platform.OS === 'android') {
                    let fcmToken = await AsyncStorage.getItem("fcmToken")
                    if (fcmToken) mobileFcmToken = fcmToken
                    else mobileFcmToken = await messaging().getToken(firebase.app().options.messagingSenderId)
                  }

                  try {

                    const wallet = ethers.Wallet.fromMnemonic(
                      this.props.route.params.actualMnemonics,
                    );
                    console.log("wallet", wallet)


                    await axios.post(`${Str.apiUrl}/v1/eurb/add-wallet`, {
                      account: wallet.address,
                      token: mobileFcmToken
                    })



                    await AsyncStorage.setItem('address', wallet.address);
                    await AsyncStorage.setItem('mnemonics', this.props.route.params.actualMnemonics);
                    await AsyncStorage.setItem('privateKey', wallet.privateKey);
                    store.dispatch(storeWalletInfo(true))


                    this.setState({ isLoading: false });
                    this.props.navigation.popToTop();
                    this.props.navigation.replace(`${ENUMS.SCREENS.DASHBOARD}`);

                  }
                  catch (error) {
                    console.log("Error", error)
                    this.setState({ isLoading: false });
                    alert('We are currently experiencing issues with verifying the account. Please try again later.');
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
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_COLOR,
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
    color: COLORS.WHITE,
    fontFamily: 'Poppins',
  },
  topHeadingViewText_2: {
    textAlign: 'center',
    marginTop: 4,
    color: COLORS.SMALL_HEADING_TEXT,
    fontFamily: 'Poppins',
  },

  selectMnemonicsViewMain: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    paddingLeft: 32,
    paddingRight: 48,
    paddingBottom: 64,
    paddingTop: 64,

    backgroundColor: COLORS.BALANCE_CARD_BACKGROUND
  },
  selectMnemonicsChild: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    paddingLeft: 32,
    paddingRight: 32,
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
    paddingLeft: 32,
    paddingRight: 32,
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
