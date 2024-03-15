import React, { useState, useReducer } from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import ContactList from './ContactList';
import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';
import Header from '../../components/Header/Header';
import { COLORS, ENUMS, Images, Str } from '../../common';
import LoadingModal from '../../components/LoadingModal/modal';
import ErrorMessage from '../../components/ErrorComponent/ErrroMessage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import { ErrorMessages } from '../../messages/errorMessage';
import { checkInternetConnectivity } from '../../utils/utils';
import { store } from '../../store';
import axios from 'axios';


let initialState = {
    isLoading: false,
    error: false,
    message: ""
}
const reducer = (currentState, action) => {
    switch (action.type) {

        case 'sendRequest':

            return { ...currentState, isLoading: true, error: false, message: "" }

        case 'FetchSuccess':

            return { ...currentState, isLoading: false, error: false, message: "" }

        case 'FetchFail':

            return { ...currentState, isLoading: false, error: true, message: action.payload }
    }

}




const AddContact = ({ navigation }) => {
    const [contact, setContact] = useState("")
    const [name, setName] = useState("")
    const [account, setAccount] = useState("")
    const [postObject, dispatch] = useReducer(reducer, initialState)


    let addContact = async () => {
        let isConnected = await checkInternetConnectivity()
        if (!isConnected) {
            alert(ErrorMessages.GENERIC.NO_INTERNET_ERROR)
            return
        }



        let address = await AsyncStorage.getItem('address');

        try {
            dispatch({ type: "sendRequest" })
            let { data } = await axios.post(`${Str.apiUrl}/v1/eurb/add-contact`, {
                name,
                // mobieNumber: contact,
                receiverAccount: account,
                senderAccount: address
            });

            dispatch({ type: "FetchSuccess" })
            store.dispatch({ type: "ADD_CONTACT", payload: data.data })
            alert("The contact has been successfully added")
            setName("")
            setAccount("")
        }
        catch (e) {
            console.log("e.response.data.", e.response.data)
            let msg = e?.response?.data ? e.response.data.errors[0].message : e?.message
                ? e.message
                : 'Apologies for the inconvenience, but we are currently facing some issues with adding contact information. We kindly request you to try again at a later time.';
            dispatch({ type: "FetchFail", payload: msg })
            return;
        }

    }


    return (
        <React.Fragment>


            <StatusBarNU
                backgroundColor={COLORS.BACKGROUND_COLOR}
                barStyle="light-content" />
            {
                postObject.isLoading === true ? <LoadingModal task={'Adding Contact...'} modalVisible={postObject.isLoading} /> : null
            }


            <Header
                backButton={true}
                headerText="Add Favorites"
                navigation={navigation}></Header>


            <View style={styles.mainContainer}>
                <ScrollView>
                    


                    <View style={{ paddingHorizontal: 24, flexDirection: "column", marginTop: 24 }}>
                        <Text style={{ color: COLORS.WHITE, fontFamily: "Poppins" }} >Enter Name</Text>
                        <View style={{ marginTop: 12, backgroundColor: COLORS.WHITE, flexDirection: "row", padding: 8, borderLeftColor: "#4d4b70", borderLeftWidth: 6, borderRadius: 8,justifyContent:"center",alignItems:"center" }}>
                            <TextInput
                                style={{ flex: 1, fontFamily: "Poppins" }}

                                value={name}
                                onChangeText={newValue => {
                                    setName(newValue);
                                }}
                                // multiline={true}
                                placeholder={'Name'}
                                placeholderTextColor={COLORS.SMALL_HEADING_TEXT}

                            />

                            <FontAwesome
                                name="user-circle"
                               style={{marginRight:4}}
                                size={30}
                                color="orange"
                            />



                        </View>








                    </View>

                    <View style={{ paddingHorizontal: 24, flexDirection: "column", marginTop: 24 }}>
                        <Text style={{ color: COLORS.WHITE, fontFamily: "Poppins" }} >Enter Receiver Wallet</Text>
                        <View style={{ marginTop: 12, backgroundColor: COLORS.WHITE, flexDirection: "row", padding: 8, borderLeftColor: "#4d4b70", borderLeftWidth: 6, borderRadius: 8,justifyContent:"center",alignItems:"center" }}>
                            <TextInput
                                style={{ flex: 1, fontFamily: "Poppins" }}

                                value={account}
                                onChangeText={account => {
                                    setAccount(account);
                                }}
                                // multiline={true}
                                placeholder={"Receiver's wallet"}
                                placeholderTextColor={COLORS.SMALL_HEADING_TEXT}

                            />

                            <MaterialIcons
                                name="account-balance-wallet"
                                style={{marginRight:4}}
                                // style={{ fontWeight: '900' }}
                                size={30}
                                color="orange"
                            />



                        </View>








                    </View>

                    <View style={{ paddingHorizontal: 24 }}>
                        {postObject.error && (
                            <ErrorMessage message={postObject.message}></ErrorMessage>
                        )}

                    </View>

                    <View style={{ paddingHorizontal: 24, marginTop: 48 }}>
                        <TouchableOpacity
                            disabled={name === "" || account === "" ? true : false}
                            onPress={addContact}
                            style={[styles.btnStyleSend, { backgroundColor: name === "" || account === "" ? COLORS.DISABLE_COLOR : COLORS.BTN_BACKGROUND_COLOR }]}>
                            <Text style={styles.textStyleSend}>Send</Text>
                        </TouchableOpacity>
                    </View>





                </ScrollView>




            </View>
        </React.Fragment>
    );
};
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND_COLOR,

    },
    circle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'lightgray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },

    btnStyleSend: {
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
    },

    textStyleSend: {
        color: COLORS.WHITE,
        fontSize: 16,
        fontFamily: "Poppins"
    },




});

export default AddContact;