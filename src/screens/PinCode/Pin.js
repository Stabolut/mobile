import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { COLORS, Images } from '../../common';
import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';
import AsyncStorage from '@react-native-community/async-storage';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import PINCode from '@haskkor/react-native-pincode';
import Biometrics from 'react-native-biometrics';
import TouchID from 'react-native-touch-id';
import { store } from '../../store';
import { setPin } from '../../redux/action/auth';
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
   

    return (
      <React.Fragment>

        <StatusBarNU backgroundColor={COLORS.BACKGROUND_COLOR} />

        <View style={styles.mainContainer}>

          <PINCode
            stylePinCodeCircle={styles.selectedDot}
            numbersButtonOverlayColor={COLORS.BACKGROUND_COLOR}
            stylePinCodeColorTitle={COLORS.WHITE}
            stylePinCodeColorSubtitle={COLORS.SMALL_HEADING_TEXT}
            stylePinCodeDeleteButtonSize={40}
            colorCircleButtons={COLORS.BALANCE_CARD_BACKGROUND}
            stylePinCodeDeleteButtonColorHideUnderlay={COLORS.WHITE}
            stylePinCodeButtonNumber={COLORS.WHITE}
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
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_COLOR
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
