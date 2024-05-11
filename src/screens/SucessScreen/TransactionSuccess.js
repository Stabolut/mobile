import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions
} from 'react-native';
import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';
import Header from '../../components/Header/Header';
import { COLORS, ENUMS, THEME } from '../../common';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { SocketContext } from '../../App';
import { useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import socketDisconnectMessage from '../../components/CustomHook/socketDisconnectMessage';
const windowHeight = Dimensions.get('window').height;

// class TransactionSuccess extends React.Component {
function TransactionSuccess(props) {

  const socketConnection = useContext(SocketContext);
  socketDisconnectMessage(socketConnection.connectionStatus);
  let selectedTheme = useSelector((state) => state.authReducer.theme)
  const theme = THEME[selectedTheme];

  return (
    <React.Fragment>
      <StatusBarNU
        backgroundColor={theme?.BACKGROUND_COLOR}
       
      />
      <Header
        backButton={true}
        headerText="Transaction Confirmation"
        theme={theme}
        navigation={props.navigation}></Header>



      <View style={[styles.mainContainer,{ backgroundColor: theme?.BACKGROUND_COLOR}]}>
        <ScrollView>
          <View

            style={{
              height:windowHeight >= 630 ? 250:160,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop:windowHeight >= 630 ? 32:0,
              resizeMode: 'contain',
              marginLeft: 4,
              marginRight: 4,
            }}>
            <View style={styles.coin1}>
              <View style={styles.coin}>
                <FontAwesomeIcon
                  name="check"
                  size={40}
                  color={COLORS.WHITE}></FontAwesomeIcon>
              </View>
            </View>
          </View>
          <Text
            style={{
              alignSelf: 'center',
              marginTop:windowHeight >= 630 ? 40 : 20,
              fontSize: 18,
              color: '#3faf80',
              marginBottom: 8,
              fontWeight: 'bold',
              fontFamily: 'Poppins',
              opacity: 0.9,
            }}>
            {props.route.params.successType === 'Send'
              ? 'Transaction Payment Successful'
              : `You Received ${props?.route?.params?.amount?.toLocaleString('en-IN')} US₿`}
          </Text>
          <Text
            style={{
              color: theme?.SMALL_HEADING_TEXT,
              fontSize: 12,
              textAlign: 'center',
              alignSelf: 'center',
              fontFamily: 'Poppins',
            }}>
            {props.route.params.successType === 'Send'
              ? 'Your payment has been processed!'
              : 'Your payment has been received!'}
          </Text>
          <Text
            style={{
              alignSelf: 'center',
              color: theme?.SMALL_HEADING_TEXT,
              fontSize: 12,
              textAlign: 'center',
              fontFamily: 'Poppins',
              alignSelf: 'center',
              marginBottom: 8,
            }}>
            {props.route.params.successType === 'Send'
              ? 'Details of the transaction are included below'
              : 'Details of the transaction are included below'}
          </Text>

          <View
            style={{
              height: 1,
              backgroundColor: '#e4e4e4',
              marginBottom: 16,
              width: '85%',
              alignSelf: 'center',
              marginBottom: 32,
            }}></View>

          <View
            style={{
              flexDirection: 'row',
              width: '85%',
              marginBottom: 8,
              alignSelf: 'center',
            }}>
            <Text
              style={{
                flex: 1,
                color: theme?.WHITE,
                fontWeight: '700',
                fontSize: 12,
                fontFamily: 'Poppins',
              }}>
              {props.route.params.successType === 'Send'
                ? 'TOTAL AMOUNT PAID'
                : 'TOTAL AMOUNT RECEIVED'}
            </Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text
                style={{
                  color: theme?.SMALL_HEADING_TEXT,
                  fontWeight: '700',
                  fontSize: 12,
                  fontFamily: 'Poppins',
                }}>{`${props?.route?.params?.amount?.toLocaleString('en-IN')}  US₿`}</Text>
            </View>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: '#e4e4e4',
              marginBottom: 16,
              width: '85%',
              alignSelf: 'center',
            }}></View>

          <View
            style={{
              flexDirection: 'row',
              width: '85%',
              marginBottom: 8,
              alignSelf: 'center',
            }}>
            <Text
              style={{
                flex: 1,
                color: theme?.WHITE,
                fontWeight: '700',
                fontSize: 12,
                fontFamily: 'Poppins',
              }}>
              TRANSACTION DATE
            </Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text
                style={{
                  color: theme?.SMALL_HEADING_TEXT,
                  fontWeight: '700',
                  fontSize: 12,
                  fontFamily: 'Poppins',
                }}>
                {props.route.params.date}
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: '#e4e4e4',
              marginBottom: 16,
              width: '85%',
              alignSelf: 'center',
            }}></View>

          <View
            style={{
              flexDirection: 'row',
              width: '85%',
              marginBottom: 8,
              alignSelf: 'center',
            }}>
            <Text
              style={{
                flex: 1,
                color: theme?.WHITE,
                fontWeight: '700',
                fontSize: 12,
                fontFamily: 'Poppins',
                marginRight: 8,
              }}>
              TRANSACTION HASH
            </Text>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate(
                  ENUMS.SCREENS.TRANSACTION_DETAIL,
                  {
                    transactionHash: props.route.params.transactionHash,
                  },
                );
              }}
              style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text
                style={{
                  color: theme?.SMALL_HEADING_TEXT,
                  fontWeight: '700',
                  fontSize: 12,
                  fontFamily: 'Poppins',
                }}>
                {props.route.params.transactionHash}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: '#e4e4e4',
              marginBottom: 16,
              width: '85%',
              alignSelf: 'center',
            }}></View>
        </ScrollView>
      </View>
      <View style={{ backgroundColor: theme?.BACKGROUND_COLOR }}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.replace(`${ENUMS.SCREENS.DASHBOARD}`);
          }}
          style={styles.btnStyleContinue}>
          <Text style={styles.textStyleContinue}>Done</Text>
        </TouchableOpacity>
      </View>
    </React.Fragment>
  );

}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },

  coin1: {
    // backgroundColor: "#f7a03d",
    backgroundColor: '#e7fbf2',
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  


  coin: {
    backgroundColor: '#21be79',
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnStyleContinue: {
    height: 50,
    width: '85%',
    alignSelf: 'center',

    backgroundColor: COLORS.BTN_BACKGROUND_COLOR,
    color: COLORS.WHITE,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    // marginBottom: 8,
    // marginTop: 8,
    marginBottom:windowHeight >= 630 ? 32 : 8,
    
    marginTop:windowHeight >= 630 ? 16 : 8
    
  },

  textStyleContinue: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontFamily: 'Poppins',
  },
});

export default TransactionSuccess;
