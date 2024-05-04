import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { ENUMS, COLORS, Str } from '../../../../common';
import StatusBarNU from '../../../../components/StatusBarNU/StatusBarNU';
import Header from '../../../../components/Header/Header';
//import Clipboard from '@react-native-community/clipboard';
import AsyncStorage from '@react-native-community/async-storage';
import LoadingModal from '../../../../components/LoadingModal/modal';
import { ethers } from 'ethers';
import firebase from '@react-native-firebase/app'
import messaging from '@react-native-firebase/messaging'
import { storeWalletInfo } from '../../../../redux/action/auth';
import axios from "axios"
import { store } from '../../../../store';
import { ErrorMessages } from '../../../../messages/errorMessage';
import ErrorMessage from '../../../../components/ErrorComponent/ErrroMessage';
import { checkInternetConnectivity, errorMessageHandler } from '../../../../utils/utils';




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
        };
    }

    handleButtonPress = async () => {
        try {
            const key = await Clipboard.getString();
            this.setState({ privateKey: key });
        }
        catch (e) {

        }
    };

    submitPrivateKey = async () => {

        // Check it privateKey is right

        if (this.state.privateKey === '' || this.state.privateKey === null) {
            return this.setState({
                isError: true,
                message: 'Please make sure to provide a value for the private key field!',
            });
        }

        // Check if internet is connected
        let isConnected = await checkInternetConnectivity()
        if (!isConnected) {
            alert(ErrorMessages.GENERIC.NO_INTERNET_ERROR)
            return

        }
        //set initial state
        this.setState({
            isLoading: true,
            disable: true,
            isError: false,
            message: '',
        });


        setTimeout(async () => {


            let mobileFcmToken = null

            // in case of ios mobile
            if (Platform.OS === 'ios') {
                let fcmToken = await AsyncStorage.getItem("fcmToken")
                if (fcmToken) mobileFcmToken = fcmToken
                else {
                    try {
                        mobileFcmToken = await messaging().getToken(firebase.app().options.messagingSenderId)
                    }
                    catch (e) {

                    }
                }

            }
            //in case of android device

            if (Platform.OS === 'android') {

                let fcmToken = await AsyncStorage.getItem("fcmToken")
                if (fcmToken) mobileFcmToken = fcmToken
                else
                    try {
                        mobileFcmToken = await messaging().getToken(firebase.app().options.messagingSenderId)

                    }
                    catch (e) {
                        console.log("Firebase error", e)
                        this.setState({ isLoading: false, disable: false });
                        alert('We are currently experiencing issues with verifying the account. Please try again later.');
                        return

                    }
            }


            try {

                let mnemonics = this.state.privateKey.trim();
                const wallet = new ethers.Wallet(mnemonics);
                console.log("mnemonics", mnemonics, "wallet", wallet)

                await axios.post(`${Str.apiUrl}/wallet/add-wallet`, {
                    account: wallet.address,
                    token: mobileFcmToken
                })

                await AsyncStorage.setItem('address', wallet.address);
                await AsyncStorage.setItem('mnemonics', mnemonics);//we are stroing private key actually
                await AsyncStorage.setItem('privateKey', mnemonics);
                store.dispatch(storeWalletInfo(true))

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
        return (
            <React.Fragment>
                <StatusBarNU
                    backgroundColor={COLORS.BACKGROUND_COLOR}
                    barStyle="light-content"
                />

                <Header
                    headerText="Import Multi-Coin Wallet"
                    navigation={this.props.navigation}></Header>

                <LoadingModal
                    task={'Importing Wallet...'}
                    modalVisible={this.state.isLoading}
                />

                <View style={styles.mainContainer}>
                    <View style={styles.container}>
                        <TouchableOpacity
                            onPress={this.handleButtonPress}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                                marginRight: 8,
                                marginTop: 8,
                            }}>
                            <Text
                                style={{
                                    color: COLORS.WHITE,
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
                                color: COLORS.WHITE,
                            }}
                        />
                    </View>

                    {this.state.isError && (
                        <ErrorMessage message={this.state.message}></ErrorMessage>
                    )}

                    <Text
                        style={{
                            color: COLORS.SMALL_HEADING_TEXT,
                            marginTop: 12,
                            fontSize: 14,
                            fontFamily: 'Poppins',
                        }}>
                        Write a private key here is hex format like (0x8028a56736671e83bd76ad9e143dbdc1d1a85b643b17dfd3e1a6be312080c13d
                        )
                    </Text>

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
        backgroundColor: COLORS.BACKGROUND_COLOR,
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
