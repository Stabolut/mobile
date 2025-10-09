import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';
import Header from '../../components/Header/Header';
import { COLORS, ENUMS, THEME, Str } from '../../common';
import ErrorMessage from '../../components/ErrorComponent/ErrroMessage';
import LoadingModal from '../../components/LoadingModal/modal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { ErrorMessages } from '../../messages/errorMessage';
import { checkInternetConnectivity } from '../../utils/utils';
import SuccessMessage from '../../components/SuccessComponent/SuccessMessage';
import { ethers } from 'ethers';
import AsyncStorage from '@react-native-community/async-storage';
import { useSelector } from 'react-redux';
import { addInStake } from '../../api/wallet';

const AddStake = (props) => {
    const [stakingAmount, setStakingAmount] = useState(0);
    const [yieldAmount, setYieldAmount] = useState('');
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    let selectedTheme = useSelector((state) => state.walletReducer.theme)
    let currentNetwork = useSelector((state) => state.walletReducer.currentNetwork)
    const theme = THEME[selectedTheme];

    const handleStake = async () => {

        let isConnected = await checkInternetConnectivity()

        if (!isConnected) {
            alert(ErrorMessages.GENERIC.NO_INTERNET_ERROR)
            return

        }
        if (parseFloat(stakingAmount) === 0 || stakingAmount === "" || parseFloat(stakingAmount) <= 0 || stakingAmount === undefined) {
            setIsError(true)
            setMessage("Invalid Staking Amount - The entered staking value is incorrect. Please enter a valid staking amount.")
            return
        }

        if (parseFloat(stakingAmount) > props.route.params.balance) {
            setIsError(true)
            setMessage("Insufficient Balance - The staking amount exceeds your available balance. Please enter a valid amount within your available balance.")
            return
        }

        try {
            setIsError(false)
            setMessage("")
            setIsLoading(true)

            let address = await AsyncStorage.getItem('address');
            const provider = new ethers.providers.JsonRpcProvider(currentNetwork.rpcUrl);
            const contract = new ethers.Contract(
                currentNetwork.contractAddress,
                Str.ABI,
                provider,
            );

            let amountToSend = parseFloat(stakingAmount) * 1e2;
            let privateKey = await AsyncStorage.getItem('privateKey');

            const wallet = new ethers.Wallet(privateKey);
            const nonce = await contract.countOf(address);

            const transferHex = await contract.getTransferPreSignedHash(
                currentNetwork.contractAddress,
                currentNetwork.fundindAddress,
                amountToSend,
                Str.fees * Str.TOKEN_DECIMAL,
                parseInt(nonce),
            );
            const signature = await wallet.signMessage(
                ethers.utils.arrayify(transferHex),
            );
            let { data } = await addInStake({
                signature: signature,
                toAddress: currentNetwork.fundindAddress,
                wallet: address,
                amount: stakingAmount,
                nonce1: parseInt(nonce),
                senderAddress: address,
                amountToSend: amountToSend,
                network: currentNetwork.name
            })
            setMessage(`You have successfully staked ${stakingAmount} USB coins. After one day, you will earn ${parseFloat(data.data.yieldAmount).toFixed(4)} USB coins as a reward. The staking period is one day.`)
            setStakingAmount(0)
            setIsLoading(false)
            setYieldAmount(data.data.yieldAmount)
        }
        catch (e) {

            let msg = e?.response?.data ? e.response.data.errors[0].message : e?.message
                ? e.message
                : 'We apologize for any inconvenience caused. Currently, we are experiencing difficulties with retrieving stake reward information. We kindly ask you to please try your request again at a later time.';
            setIsError(true)
            setIsLoading(false)

            setMessage(msg)
            return;
        }
    };

    return (
        <React.Fragment>


            <StatusBarNU
                backgroundColor={theme?.BACKGROUND_COLOR}

            />
            <Header theme={theme} headerText="Stake USB" navigation={props.navigation}></Header>

            <LoadingModal task={'Staking US₿...'} modalVisible={isLoading} />

            <View style={[styles.mainContainer, { backgroundColor: theme?.BACKGROUND_COLOR, }]}>


                <View style={{ paddingHorizontal: 16, flexDirection: "column", marginTop: 24 }}>
                    <Text style={{ color: theme?.WHITE, fontFamily: "Poppins" }} >Please enter the staking amount.</Text>
                    <View style={{ marginTop: 12, backgroundColor: selectedTheme === ENUMS.THEME.DARK ? COLORS.WHITE : theme?.BALANCE_CARD_BACKGROUND, flexDirection: "row", padding: 8, borderLeftColor: "#4d4b70", borderLeftWidth: 6, borderRadius: 8, justifyContent: "center", alignItems: "center" }}>
                        <TextInput
                            style={{ flex: 1, fontFamily: "Poppins", color: COLORS.BLACK }}

                            placeholder="Enter staking amount"
                            value={stakingAmount}
                            onChangeText={newValue => {
                                setStakingAmount(newValue);
                            }}
                            // multiline={true}
                            keyboardType="numeric"
                            placeholderTextColor={theme?.SMALL_HEADING_TEXT}

                        />



                        <FontAwesome5
                            name="coins"

                            size={30}
                            color="orange"
                        />



                    </View>

                    {isError && (
                        <ErrorMessage message={message}></ErrorMessage>
                    )}
                </View>

                <View style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 24, paddingBottom: 8 }}>
                    <TouchableOpacity onPress={handleStake}

                        style={styles.btnStyleSend}>
                        <Text style={styles.textStyleSend}>Stake</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ paddingLeft: 16, paddingRight: 16 }}>
                    {yieldAmount ?


                        <SuccessMessage message={message}></SuccessMessage> : null
                    }
                </View>


                {/* {yieldAmount ? <Text>Yield after one month: {yieldAmount}</Text> : null} */}








            </View>
        </React.Fragment>
    );
};


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    btnStyleSend: {
        height: 45,
        width: '100%',
        backgroundColor: COLORS.BTN_BACKGROUND_COLOR,
        color: COLORS.WHITE,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },

    textStyleSend: {
        color: COLORS.WHITE,
        fontSize: 16,
        fontFamily: "Poppins"
    },
    eurbMainAccountText: {
        color: COLORS.WHITE,
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "Poppins"

    },
    stakingCardMainViewStyle: {

        width: "100%",

        padding: 14,
        backgroundColor: "#0a0b1d",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#4d4b70",
        shadowColor: COLORS.WHITE,


    },
    balanceTextHeading: {
        color: COLORS.WHITE,
        fontSize: 12,
        fontWeight: "400",

        fontFamily: "Poppins",
    },
    totalRewardHeading: {
        color: COLORS.WHITE,
        fontSize: 14,
        fontWeight: "700",
        fontFamily: "Poppins"
    },



});

export default AddStake;