import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { ENUMS, COLORS, THEME } from '../../../../common';
import StatusBarNU from '../../../../components/StatusBarNU/StatusBarNU';
import Header from '../../../../components/Header/Header';
//import Clipboard from '@react-native-community/clipboard';
import AsyncStorage from '@react-native-community/async-storage';
import LoadingModal from '../../../../components/LoadingModal/modal';
import { ethers } from 'ethers';
import { storeReferralInfo, storeWalletInfo } from '../../../../redux/action/wallet';
import { store } from '../../../../store';
import { ErrorMessages } from '../../../../messages/errorMessage';
import ErrorMessage from '../../../../components/ErrorComponent/ErrroMessage';
import { checkInternetConnectivity, errorMessageHandler, getFcmTokenFromLocalStorage } from '../../../../utils/utils';
import { addWalletWithFcm } from '../../../../api/wallet';
import { getStableDeviceId } from '../../../../utils/deviceIdentity';




class ImportWithPrivateKey extends React.Component {
    constructor(props) {
        super(props);
        this.textInputRef = React.createRef();
        this.state = {
            privateKey: '',
            isError: false,
            message: '',
            isLoading: false,
            disable: false,
            referenceCode: ""
        };
    }

    handlePasteButton = async () => {
        try {
            const key = await Clipboard.getString();
            this.setState({ privateKey: key });
        }
        catch (e) {

        }
    };

    submitPrivateKey = async () => {

        const { privateKey, referenceCode } = this.state;

        // Validate private key input
        if (!privateKey || privateKey.trim() === '') {
            this.setState({
                isError: true,
                message: 'Please provide a value for the private key field!',
            });

            return;
        }

        // Check internet connectivity
        const isConnected = await checkInternetConnectivity();
        if (!isConnected) {
            Alert.alert(ErrorMessages.GENERIC.NO_INTERNET_ERROR);
            return;
        }

        // Update UI state to loading
        this.setState({
            isLoading: true,
            disable: true,
            isError: false,
            message: '',
        });

        setTimeout(async () => {

            try {
                let deviceId = null
                // Get FCM token
                const mobileFcmToken = await getFcmTokenFromLocalStorage();
                try {
                    // Obtain FCM token
                    deviceId = await getStableDeviceId();

                }
                catch (e) {

                }

                // Initialize wallet
                const wallet = new ethers.Wallet(this.state.privateKey.trim());

                let { data } = await addWalletWithFcm({
                    account: wallet.address,
                    token: mobileFcmToken,
                    referenceCode: referenceCode,
                    deviceId: deviceId
                })

                // Store wallet and referral info locally
                await AsyncStorage.setItem('address', wallet.address);
                await AsyncStorage.setItem('privateKey', this.state.privateKey.trim());
                await AsyncStorage.setItem('mnemonics', this.state.privateKey.trim());//we are stroing private key actually
                if (mobileFcmToken) { await AsyncStorage.setItem("fcmToken", token); }

                store.dispatch(storeWalletInfo(true));
                store.dispatch(storeReferralInfo({ referralCode: data.data.referralCode }));

                this.setState({
                    isLoading: false,
                    disable: false,
                });
                // go to dashboard screen
                this.props.navigation.popToTop();
                this.props.navigation.replace(`${ENUMS.SCREENS.DASHBOARD}`);
            }

            catch (error) {

                let msg = errorMessageHandler(error)
                this.setState({
                    isLoading: false,
                    disable: false,
                    isError: true,
                    message: msg
                });

            }
        }, 500);
    };

    render() {
        let selectedTheme = store.getState().walletReducer?.theme
        let theme = THEME[selectedTheme]

        return (
            <React.Fragment>
                <StatusBarNU
                    backgroundColor={theme?.BACKGROUND_COLOR}

                />

                <Header
                    headerText="Import Multi-Coin Wallet"
                    theme={theme}
                    navigation={this.props.navigation}></Header>

                <LoadingModal
                    task={'Importing Wallet...'}
                    modalVisible={this.state.isLoading}
                />

                <View style={[styles.mainContainer, { backgroundColor: theme?.BACKGROUND_COLOR, }]}>
                    <View style={styles.container}>
                        <TouchableOpacity
                            onPress={this.handlePasteButton}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                                marginRight: 8,
                                marginTop: 8,
                            }}>
                            <Text
                                style={{
                                    color: theme?.WHITE,
                                    fontSize: 14,
                                    fontFamily: 'Poppins',
                                }}>
                                PASTE
                            </Text>
                        </TouchableOpacity>

                        <TextInput
                            value={this.state.privateKey}
                            onChangeText={newValue => {
                                this.setState({ privateKey: newValue });
                            }}
                            multiline={true}
                            placeholder={''}
                            style={{
                                flexWrap: 'nowrap',
                                padding: 8,
                                color: theme?.WHITE,
                            }}
                        />
                    </View>

                    <Text
                        style={{
                            color: theme?.SMALL_HEADING_TEXT,
                            marginTop: 12,
                            fontSize: 14,
                            fontFamily: 'Poppins',
                        }}>
                        Write a private key here is hex format like (0x8028a56736671e83bd76ad9e143dbdc1d1a85b643b17dfd3e1a6be312080c13d
                        )
                    </Text>

                    <View style={{
                        marginTop: 24,
                        borderColor: 'gray',
                        borderWidth: 1,
                        borderRadius: 10,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 8,

                    }}>
                        <TextInput
                            value={this.state.referenceCode}
                            onChangeText={newValue => {
                                this.setState({ referenceCode: newValue });
                            }}

                            placeholderTextColor={theme?.SMALL_HEADING_TEXT} placeholder='Referral ID' style={{ color: theme?.WHITE, flex: 80, padding: 6 }}></TextInput>
                        <Text style={{ color: theme?.WHITE, justifyContent: "flex-end", alignItems: "flex-end", flex: 20 }}>Optional</Text>


                    </View>

                    {this.state.isError && (
                        <ErrorMessage message={this.state.message}></ErrorMessage>
                    )}

                    <View>
                        <TouchableOpacity
                            disabled={this.state.disable}
                            onPress={this.submitPrivateKey}
                            style={styles.btnStyleImport}>
                            <Text style={styles.textStyleImport}>Import</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </React.Fragment>
        );
    }
}
const styles = StyleSheet.create({
    mainContainer: {
        padding: 20,
        paddingTop: 32,
        flexDirection: 'column',
        flex: 1,

    },

    container: {
        borderColor: 'gray',
        width: '100%',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
    },
    btnStyleImport: {
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
        marginTop: 32,
    },

    textStyleImport: {
        color: COLORS.WHITE,
        fontSize: 16,
        fontFamily: 'Poppins',
    },
    errorMessage: {
        fontFamily: 'Poppins',
        fontWeight: '300',
        textDecorationLine: 'none',
        fontSize: 12,
        color: '#B21807',
        letterSpacing: 0.1,
    },
    spinnerTextStyle: {
        color: '#FFF',
    },
});

export default ImportWithPrivateKey;
