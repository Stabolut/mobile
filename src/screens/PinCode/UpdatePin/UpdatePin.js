import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, THEME } from '../../../common';
import StatusBarNU from '../../../components/StatusBarNU/StatusBarNU';
import Header from '../../../components/Header/Header';
import AsyncStorage from '@react-native-community/async-storage';
import { store } from '../../../store';
import PINCode from '@haskkor/react-native-pincode';
import DropDownHolder from '../../../components/dropDownHolder';
import * as Keychain from 'react-native-keychain';
const SERVICE_NAME = 'myAppPin';
class UpdatePin extends React.Component {


    render() {
        let selectedTheme = store.getState().walletReducer?.theme
        let theme = THEME[selectedTheme]
        console.log("his.props.route.params.pinState", this.props.route.params.pinState, this.props.route.params.goToScreen)
        return (
            <React.Fragment>

                <StatusBarNU backgroundColor={theme?.BACKGROUND_COLOR} />
                <Header
                    backButton={true}
                    headerText="Change Pin"
                    theme={theme}
                    navigation={this.props.navigation}></Header>

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
                        finishProcess={async () => {
                            await AsyncStorage.setItem('PinSet', 'true');
                            DropDownHolder.alert(
                                'Success',
                                'Copy',
                                `Your pin is updated`,
                            );
                            this.props.navigation.replace(this.props.route.params.goToScreen);
                        }}
                        status={this.props.route.params.pinState}
                        touchIDDisabled={true}
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

export default UpdatePin;
