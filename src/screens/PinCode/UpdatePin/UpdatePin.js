import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../../common';
import StatusBarNU from '../../../components/StatusBarNU/StatusBarNU';
import Header from '../../../components/Header/Header';
import AsyncStorage from '@react-native-community/async-storage';

import PINCode from '@haskkor/react-native-pincode';
import DropDownHolder from '../../../components/dropDownHolder';

class UpdatePin extends React.Component {

    render() {
        return (
            <React.Fragment>

                <StatusBarNU backgroundColor={COLORS.BACKGROUND_COLOR} />
                <Header
                    backButton={true}
                    headerText="Change Pin"








                    navigation={this.props.navigation}></Header>

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

export default UpdatePin;
