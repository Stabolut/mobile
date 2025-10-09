import React, { useState, useReducer } from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';
import Header from '../../components/Header/Header';
import { COLORS, ENUMS, THEME, Str } from '../../common';
import LoadingModal from '../../components/LoadingModal/modal';
import ErrorMessage from '../../components/ErrorComponent/ErrroMessage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import { ErrorMessages } from '../../messages/errorMessage';
import { useSelector } from 'react-redux';
import { checkInternetConnectivity, errorMessageHandler } from '../../utils/utils';
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
    const [name, setName] = useState("")
    const [account, setAccount] = useState("")
    const [postObject, dispatch] = useReducer(reducer, initialState)
    const selectedTheme = useSelector((state) => state.walletReducer.theme)
    const theme = THEME[selectedTheme];


    let addContact = async () => {
        let isConnected = await checkInternetConnectivity()
        if (!isConnected) {
            alert(ErrorMessages.GENERIC.NO_INTERNET_ERROR)
            return
        }



        let address = await AsyncStorage.getItem('address');

        try {

            const validAccount = account?.replace(/^(xdc)/i, "0x");


            dispatch({ type: "sendRequest" })
            let { data } = await axios.post(`${Str.apiUrl}/user/add-contact-list`, {
                name,
                receiverAccount: validAccount,
                senderAccount: address
            });

            dispatch({ type: "FetchSuccess" })
           
            store.dispatch({ type: "ADD_CONTACT", payload: data.data })
            alert("The contact has been successfully added")
            setName("")
            setAccount("")
        }
        catch (e) {

            let msg = errorMessageHandler(e)
            dispatch({ type: "FetchFail", payload: msg })
            return;
        }

    }


    return (
        <React.Fragment>
            <StatusBarNU backgroundColor={theme?.BACKGROUND_COLOR} />
            
            {postObject.isLoading === true && (
                <LoadingModal task={'Adding Contact...'} modalVisible={postObject.isLoading} />
            )}

            <Header
                backButton={true}
                headerText="Add Favorites"
                theme={theme}
                navigation={navigation}
            />

            <View style={[styles.mainContainer, { backgroundColor: theme?.BACKGROUND_COLOR }]}>
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Compact Header with Clear Description */}
                    <View style={styles.headerSection}>
                        <Text style={[styles.headerTitle, { color: theme?.WHITE }]}>
                            Add New Contact
                        </Text>
                        <Text style={[styles.headerDescription, { color: theme?.SMALL_HEADING_TEXT }]}>
                            Add frequently used wallet addresses to your favorites for quick and easy access during transactions
                        </Text>
                    </View>

                    {/* Compact Form */}
                    <View style={styles.formSection}>
                        {/* Name Input */}
                        <View style={styles.inputContainer}>
                            <Text style={[styles.inputLabel, { color: theme?.WHITE }]}>
                                Contact Name
                            </Text>
                            <View style={[
                                styles.inputWrapper, 
                                { 
                                    backgroundColor: selectedTheme === ENUMS.THEME.DARK ? COLORS.WHITE : theme?.BALANCE_CARD_BACKGROUND,
                                    borderColor: theme?.SLIDER_BORDER_COLOR,
                                }
                            ]}>
                                <FontAwesome
                                    name="user"
                                    size={16}
                                    color={theme?.SMALL_HEADING_TEXT}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={[styles.textInput, { color: COLORS.BLACK }]}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Enter name"
                                    placeholderTextColor={theme?.SMALL_HEADING_TEXT}
                                    autoCapitalize="words"
                                />
                            </View>
                        </View>

                        {/* Wallet Address Input */}
                        <View style={styles.inputContainer}>
                            <Text style={[styles.inputLabel, { color: theme?.WHITE }]}>
                                Wallet Address
                            </Text>
                            <View style={[
                                styles.inputWrapper, 
                                { 
                                    backgroundColor: selectedTheme === ENUMS.THEME.DARK ? COLORS.WHITE : theme?.BALANCE_CARD_BACKGROUND,
                                    borderColor: theme?.SLIDER_BORDER_COLOR,
                                }
                            ]}>
                                <MaterialIcons
                                    name="account-balance-wallet"
                                    size={16}
                                    color={theme?.SMALL_HEADING_TEXT}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={[styles.textInput, { color: COLORS.BLACK }]}
                                    value={account}
                                    onChangeText={setAccount}
                                    placeholder="Enter wallet address"
                                    placeholderTextColor={theme?.SMALL_HEADING_TEXT}
                                    multiline={true}
                                    numberOfLines={2}
                                />
                            </View>
                        </View>

                        {/* Compact Error Message */}
                        {postObject.error && (
                            <View style={styles.errorContainer}>
                                <ErrorMessage message={postObject.message} />
                            </View>
                        )}

                        {/* Compact Action Button */}
                        <TouchableOpacity
                            disabled={name === "" || account === ""}
                            onPress={addContact}
                            style={[
                                styles.actionButton,
                                { 
                                    backgroundColor: name === "" || account === "" 
                                        ? COLORS.DISABLE_COLOR 
                                        : COLORS.BTN_BACKGROUND_COLOR,
                                    opacity: name === "" || account === "" ? 0.6 : 1
                                }
                            ]}
                        >
                            <Text style={styles.actionButtonText}>
                                Add Contact
                            </Text>
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
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    headerSection: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: "Poppins-SemiBold",
        marginBottom: 4,
    },
    headerDescription: {
        fontSize: 13,
        fontFamily: "Poppins",
        lineHeight: 18,
        opacity: 0.9,
    },
    formSection: {
        paddingHorizontal: 20,
        flex: 1,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        minHeight: 44,
    },
    inputIcon: {
        marginRight: 10,
    },
    textInput: {
        flex: 1,
        fontFamily: "Poppins",
        fontSize: 14,
        textAlignVertical: 'top',
    },
    errorContainer: {
        marginTop: 8,
        marginBottom: 4,
    },
    actionButton: {
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        shadowColor: COLORS.BTN_BACKGROUND_COLOR,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    actionButtonText: {
        color: COLORS.WHITE,
        fontSize: 16,
        fontFamily: "Poppins-SemiBold",
    },
});

export default AddContact;