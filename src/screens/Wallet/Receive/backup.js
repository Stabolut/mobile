import React, {useEffect, useState, useContext} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {COLORS} from '../../../common';
import StatusBarNU from '../../../components/StatusBarNU/StatusBarNU';
import Header from '../../../components/Header/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import {SocketContext} from '../../../App';
import QRCode from 'react-native-qrcode-svg';
import {useNavigation} from '@react-navigation/native';
//import Clipboard from '@react-native-community/clipboard';
import DropDownHolder from '../../../components/dropDownHolder';
import socketDisconnectMessage from '../../../components/CustomHook/socketDisconnectMessage';
import {useRef} from 'react';

export default Receive = props => {
  const navigation = useNavigation();
  const [address, setAddress] = useState("");
  const socketConnection = useContext(SocketContext);
  socketDisconnectMessage(socketConnection.connectionStatus);

  const ref = useRef(null);

  useEffect(() => {
    let getAddress = async () => {
      let address = await AsyncStorage.getItem('address');

      setAddress(address);
    };

    getAddress();
  }, []);

  let copyToClipBoard = () => {
    //Clipboard.setString(address.substring(2));
    DropDownHolder.alert('Success', 'Copy', `Wallet address is copied`);
  };

  return (
    <React.Fragment>
      <StatusBarNU
        backgroundColor={COLORS.APP_BLUE_COLOR}
        barStyle="light-content"
      />
      <Header headerText="Receive US₿" navigation={navigation}></Header>

      <View style={styles.mainContainer}>
        {/* <View style={{ width: 300, height: 300 }}> */}
        <View style={styles.qrCodeScanCard}>
          <QRCode
            size={200}
            value={address ? address : 'null'}
            // logo={Images.coinIcon}
            logoSize={30}
            logoBackgroundColor="transparent"
            getRef={ref}></QRCode>

          <Text
            style={{
              textAlign: 'center',
              fontSize: 12,
              marginTop: 20,
              color: '#555557',
              fontFamily: 'Poppins',
            }}>
            {address}
          </Text>
          {/* <Text style={{ textAlign: "center", color: COLORS.HEADING_BLACK_COLOR, fontSize: 12, marginTop: 16, fontWeight: "700", fontFamily: "Poppins" }}>No memo required</Text> */}
        </View>
        <View style={{marginTop: 30}}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 12,
              marginTop: 20,
              color: '#555557',
              fontFamily: 'Poppins',
            }}>
            Send only{' '}
            <Text
              style={{
                color: COLORS.HEADING_BLACK_COLOR,
                fontWeight: 'bold',
                fontFamily: 'Poppins',
              }}>
              US₿(US₿)
            </Text>{' '}
            to this address.
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: '#555557',
              fontSize: 12,
              fontFamily: 'Poppins',
            }}>
            Sending any other coins may result in a permanent loss.
          </Text>
        </View>

        {/* </View> */}

        <View style={{flexDirection: 'row', marginTop: 40}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
            }}>
            <TouchableOpacity onPress={copyToClipBoard} style={styles.send}>
              <Ionicons
                name="copy-outline"
                style={{fontWeight: '800'}}
                size={20}
                color={COLORS.WHITE}
              />
            </TouchableOpacity>
            <Text
              style={{
                marginTop: 8,
                color: COLORS.APP_BLUE_COLOR,
                fontFamily: 'Poppins',
              }}>
              Copy
            </Text>
          </View>


          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              
            }}>
            <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate(`${ENUMS.SCREENS.RECEIVE}`)
                        }} style={[styles.send,{ backgroundColor: '#eaf4fd'}]}>
            <Ionicons name="share-social" style={{ fontWeight: '800' }} size={20} color={COLORS.APP_BLUE_COLOR} />
            </TouchableOpacity>
            <Text
              style={{
                marginTop: 8,
                color: COLORS.APP_BLUE_COLOR,
                fontFamily: 'Poppins',
              }}>
              Share
            </Text>
          </View>









        </View>
      </View>
    </React.Fragment>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.APP_BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },

  qrCodeScanCard: {
    height: 330,
    width: 250,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: COLORS.WHITE,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 7,
    alignSelf: 'center',
  },

  send: {
    marginRight: 10,
    backgroundColor: COLORS.APP_BLUE_COLOR,
    width: 50,
    height: 50,
    marginLeft: 10,
    borderRadius: 50 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  share: {
    backgroundColor: '#eaf4fd',
    width: 50,
    height: 50,
    marginLeft: 10,
    borderRadius: 50 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
