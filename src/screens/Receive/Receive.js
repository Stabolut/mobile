import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../../../common';
import StatusBarNU from '../../../components/StatusBarNU/StatusBarNU';
import Header from '../../../components/Header/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import { SocketContext } from '../../../App';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import DropDownHolder from '../../../components/dropDownHolder';
import socketDisconnectMessage from '../../../components/CustomHook/socketDisconnectMessage';

export default Receive = props => {
  const navigation = useNavigation();
  const [address, setAddress] = useState("");
  const [qrCodeImageByte, setQrCodeImageByte] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  const socketConnection = useContext(SocketContext);
  socketDisconnectMessage(socketConnection.connectionStatus);

  const ref = useRef(null);
  const svg = useRef();

  useEffect(() => {
    let getAddress = async () => {
      let address = await AsyncStorage.getItem('address');
      setAddress(address);
    };
    getAddress();
  }, []);

  const callback = (dataURL) => {
    console.log("QR Code dataURL received:", dataURL ? "Yes" : "No");
    if (dataURL) {
      setQrCodeImageByte(dataURL);
      shareQRCodeImage(dataURL);
    }
  }

  const shareQRCodeImage = async (dataURL) => {
    try {
      console.log("Starting share process...");
      
      const shareOptions = {
        title: 'Share QR Code',
        message: `My Public Address to Receive US₿ ${address}`,
        url: dataURL, // Use the dataURL directly
        type: 'image/svg+xml',
      };
      
      console.log("Share options:", shareOptions);
      const result = await Share.open(shareOptions);
      console.log("Share successful:", result);
    }
    catch (error) {
      console.log("Error sharing QR code:", error);
      if (error.message !== 'User did not share') {
        Alert.alert('Error', 'Failed to share QR code. Please try again.');
      }
    }
    finally {
      setIsSharing(false);
    }
  };

  const shareQRCode = async () => {
    console.log("Share button pressed");
    setIsSharing(true);
    
    // Add a small delay to ensure the QR code is rendered
    setTimeout(() => {
      if (svg.current) {
        console.log("Calling toDataURL...");
        svg.current.toDataURL(callback);
      } else {
        console.log("SVG ref is not available");
        setIsSharing(false);
        Alert.alert('Error', 'QR Code not ready. Please try again.');
      }
    }, 200);
  };

  let copyToClipBoard = () => {
    try {
      Clipboard.setString(address);
      DropDownHolder.alert('Success', 'Copy', `Wallet address is copied`);
    }
    catch (e) {
      console.log("Error copying to clipboard:", e);
    }
  };

  return (
    <React.Fragment>
      <StatusBarNU
        backgroundColor={COLORS.BACKGROUND_COLOR}
        barStyle="light-content"
      />
      <Header headerText="Receive Stabolut(US₿)" navigation={navigation}></Header>

      <View style={styles.mainContainer}>
        <View style={styles.qrCodeScanCard}>
          <QRCode
            size={200}
            value={address ? address : 'null'}
            getRef={(c) => (svg.current = c)}
          />
          <Text
            style={{
              textAlign: 'center',
              fontSize: 12,
              marginTop: 20,
              color: COLORS.WHITE,
              fontFamily: 'Poppins',
            }}>
            {address}
          </Text>
        </View>
        
        <View style={{ marginTop: 30 }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 12,
              marginTop: 20,
              color: COLORS.WHITE,
              fontFamily: 'Poppins',
            }}>
            Send only{' '}
            <Text
              style={{
                color: COLORS.SMALL_HEADING_TEXT,
                fontWeight: 'bold',
                fontFamily: 'Poppins',
              }}>
              USB(US₿)
            </Text>{' '}
            to this address.
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: COLORS.WHITE,
              fontSize: 12,
              fontFamily: 'Poppins',
            }}>
            Sending any other coins may result in a permanent loss.
          </Text>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 40 }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
            }}>
            <TouchableOpacity onPress={copyToClipBoard} style={styles.send}>
              <Ionicons
                name="copy-outline"
                style={{ fontWeight: '800' }}
                size={20}
                color={COLORS.WHITE}
              />
            </TouchableOpacity>
            <Text
              style={{
                marginTop: 8,
                color: COLORS.WHITE,
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
            <TouchableOpacity 
              onPress={shareQRCode} 
              style={[styles.send, { backgroundColor: '#eaf4fd' }]}
              disabled={isSharing}
            >
              <Ionicons 
                name="share-social" 
                style={{ fontWeight: '800' }} 
                size={20} 
                color={isSharing ? COLORS.GRAY : COLORS.APP_BLUE_COLOR} 
              />
            </TouchableOpacity>
            <Text
              style={{
                marginTop: 8,
                color: COLORS.WHITE,
                fontFamily: 'Poppins',
              }}>
              {isSharing ? 'Sharing...' : 'Share'}
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
    backgroundColor: COLORS.BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },

  qrCodeScanCard: {
    height: 330,
    width: 290,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: COLORS.BALANCE_CARD_BACKGROUND,
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
    backgroundColor: COLORS.BTN_BACKGROUND_COLOR,
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
