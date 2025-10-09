
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { COLORS, THEME } from '../../common';
import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';
import PINCode from '@haskkor/react-native-pincode';
import Biometrics from 'react-native-biometrics';
import TouchID from 'react-native-touch-id';
import { store } from '../../store';
import { setPin } from '../../redux/action/wallet';
import * as Keychain from 'react-native-keychain';
const SERVICE_NAME = 'myAppPin';
class Pin extends React.Component {

  state = {
    hideTouchID: true
  }
  componentDidMount = async () => {

    const optionalConfigObject = {
      unifiedErrors: false, // use unified error messages (default false)
      passcodeFallback: false,
    }
    try {
      let bioMetrics = await AsyncStorage.getItem("fingerPrint")
      if (bioMetrics === "true") {
        let biometryType = await TouchID.isSupported(optionalConfigObject)
        if (biometryType) {
          this.setState({ hideTouchID: false })
        }
      }
    }
    catch (e) {

    }

  }




  render() {
    let selectedTheme = store.getState().walletReducer?.theme
    let theme = THEME[selectedTheme]
    console.log("Go to State", this.props.goToScreen, this.props.route.params.goToScreen)

    return (
      <React.Fragment>

        <StatusBarNU backgroundColor={theme?.BACKGROUND_COLOR} />

        <View style={[styles.mainContainer, { backgroundColor: theme?.BACKGROUND_COLOR }]}>

          <PINCode
            stylePinCodeCircle={styles.selectedDot}
            numbersButtonOverlayColor={theme?.BACKGROUND_COLOR}
            stylePinCodeColorTitle={theme?.WHITE}
            stylePinCodeColorSubtitle={theme?.SMALL_HEADING_TEXT}
            stylePinCodeDeleteButtonSize={40}
            colorCircleButtons={theme?.BALANCE_CARD_BACKGROUND}
            stylePinCodeDeleteButtonColorHideUnderlay={theme?.WHITE}
            stylePinCodeButtonNumber={theme?.WHITE}
            storePin={async (pin) => {
              await Keychain.setGenericPassword('user', pin, { service: SERVICE_NAME });
              return true;
            }}
            handleResultEnterPin={async (enteredPin) => {
              const creds = await Keychain.getGenericPassword({ service: SERVICE_NAME });
              const storedPin = creds?.password || '';
              if (enteredPin === storedPin) {
                return true;   // tells the library the PIN is valid → calls finishProcess
              }
            }}
            finishProcess={async () => {
              await AsyncStorage.setItem('PinSet', 'true');
              this.props.navigation.replace(this.props.goToScreen !== undefined ? this.props.goToScreen : this.props.route.params.goToScreen);
            }}
            status={this.props.pinState !== undefined ? this.props.pinState : this.props.route.params.pinState}
            touchIDDisabled={this.state.hideTouchID}
          />

        </View>
      </React.Fragment>
    );
  }
}



const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  selectedDot: {
    height: 15,
    width: 15,
    borderRadius: 20,
    backgroundColor: COLORS.BTN_BACKGROUND_COLOR,
    color: COLORS.BTN_BACKGROUND_COLOR,
  },
});

export default Pin;