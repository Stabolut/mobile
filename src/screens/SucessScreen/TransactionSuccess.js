import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';
import Header from '../../components/Header/Header';
import { COLORS, ENUMS, Images } from '../../common';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { SocketContext } from '../../App';
import { useState, useContext } from 'react';
import socketDisconnectMessage from '../../components/CustomHook/socketDisconnectMessage';

// class TransactionSuccess extends React.Component {
function TransactionSuccess(props) {

  const socketConnection = useContext(SocketContext);
  socketDisconnectMessage(socketConnection.connectionStatus);

  return (
    <React.Fragment>
      <StatusBarNU
        backgroundColor={COLORS.BACKGROUND_COLOR}
        barStyle="light-content"
      />
      <Header
        backButton={true}
        headerText="Transaction Confirmation"
        navigation={props.navigation}></Header>
      <View style={styles.mainContainer}>
        <ScrollView>
          <View

            style={{
              height: 250,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 32,
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
              marginTop: 40,
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
              color: COLORS.SMALL_HEADING_TEXT,
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
              color: COLORS.SMALL_HEADING_TEXT,
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
                color: COLORS.WHITE,
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
                  color: COLORS.SMALL_HEADING_TEXT,
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
                color: COLORS.WHITE,
                fontWeight: '700',
                fontSize: 12,
                fontFamily: 'Poppins',
              }}>
              TRANSACTION DATE
            </Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text
                style={{
                  color: COLORS.SMALL_HEADING_TEXT,
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
                color: COLORS.WHITE,
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
                  color: COLORS.SMALL_HEADING_TEXT,
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
      <View style={{ backgroundColor: COLORS.BACKGROUND_COLOR }}>
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
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_COLOR,
  },
  send: {
    marginRight: 10,
    backgroundColor: COLORS.WHITE,
    width: 50,
    height: 50,
    marginLeft: 10,
    borderRadius: 50 / 2,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 32,
    marginTop: 16,
  },

  textStyleContinue: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontFamily: 'Poppins',
  },
});

export default TransactionSuccess;
