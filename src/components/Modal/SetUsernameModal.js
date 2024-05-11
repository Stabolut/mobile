import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Modal, StyleSheet, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { COLORS, CS, Str,THEME } from '../../common';
import ErrorMessage from '../ErrorComponent/ErrroMessage';
import { checkInternetConnectivity, errorMessageHandler } from '../../utils/utils';
import { ErrorMessages } from '../../messages/errorMessage';
import axios from 'axios';
export default function SetUsernameModal({ onClose, visible, initialUsername, selectedTheme }) {
    const toastRef = useRef(null);
    const [username, setUsername] = useState(initialUsername)
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [disable, setDisable] = useState(false);
    const theme = THEME[selectedTheme];

    useEffect(() => {
      
        setUsername(initialUsername);
    }, [initialUsername]);

    submitUsername = async () => {

        let isConnected = await checkInternetConnectivity()
        if (!isConnected) {
            alert(ErrorMessages.GENERIC.NO_INTERNET_ERROR)
            return

        }

        if (username === '' || username === null || username === undefined) {
            setIsError(true);
            setMessage('Please ensure that the username field is filled in.');
            return;
        }

        if (username === initialUsername) {
            setIsError(true);
            setMessage("Please ensure that the username is different from the current one.");
            return;
        }


        try {

            setIsLoading(true)
            setIsError(false)
            setDisable(true)
            let address = await AsyncStorage.getItem('address');
            await axios.post(`${Str.apiUrl}/user/assign-username-to-wallet`, {
                accountID: address,
                username: username
            });
            setIsLoading(false)
            setDisable(false)
           

            alert("The username has been successfully added.")
        }
        catch (e) {

            let msg = errorMessageHandler(e)
           
            setIsLoading(false)
            setIsError(true)
            setDisable(false)
            setMessage(msg);
            return;
        }
    }

    return (
        <Modal animationType="fade"
            transparent={true}
            visible={visible}
            statusBarTranslucent={true}>
              

            <View style={[styles.centeredView]}>


                <View style={[styles.modalView,{backgroundColor: theme?.BALANCE_CARD_BACKGROUND,}]}>

                    <View style={{ flexDirection: 'column', width: "100%" }}>








                        <View style={styles.container}>
                            <TextInput
                                style={{ color: theme?.WHITE }}
                                value={username}
                                onChangeText={(value) => {
                                    setUsername(value)

                                }}
                                placeholderTextColor={theme?.WHITE}
                                placeholder={"Enter username"}




                            />
                        </View>

                        {isError && (
                            <ErrorMessage message={message} />


                        )}


                        <View style={{ flexDirection: "row" }}>


                            <TouchableOpacity
                                disabled={disable}
                                style={[styles.Button_Ok, { marginRight: 12 }]}
                                onPress={submitUsername}
                            >

                                <Text style={styles.Text_style_ok}>
                                    {
                                        isLoading ? <ActivityIndicator size="large" color="#ffffff" /> : "Continue"
                                    }



                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                disabled={disable}
                                style={[styles.Button_Ok, { backgroundColor: 'gray' }]}
                                onPress={() => {
                                    setIsError(false)
                                    setUsername("")
                                    setDisable(false)
                                    setIsLoading(false)
                                    onClose()
                                }}
                            >

                                <Text style={styles.Text_style_ok}>Close</Text>
                            </TouchableOpacity>
                        </View>

                    </View>



                </View>

            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#0008'

    },
    modalView: {

        width: "90%",
        padding: 32,


        
        borderRadius: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,

        shadowRadius: 4,
        elevation: 5,

    },


    Button_Ok: {
        flex: 1,
        height: 45,
        borderRadius: 5,
        opacity: 1,
        backgroundColor: COLORS.BTN_BACKGROUND_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16
    },
    Text_style_ok: {
        fontFamily: "Poppins",
        fontWeight: '500',
        textDecorationLine: "none",
        fontSize: 16,
        color: COLORS.WHITE,

        letterSpacing: 0.1,
    },
    container: {
        width: '100%',
        height: 40,
        borderColor: COLORS.SLIDER_BORDER_COLOR,
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,




    },
});