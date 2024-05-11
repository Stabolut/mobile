import React, { useState, useReducer, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import ContactList from './ContactList';
import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';
import Header from '../../components/Header/Header';
import { COLORS, ENUMS, THEME, Str } from '../../common';
import LoadingModal from '../../components/LoadingModal/modal';
import ErrorMessage from '../../components/ErrorComponent/ErrroMessage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import TransactionLoader from '../Dashboard/TransactionLoader';
import { useSelector } from 'react-redux';
import { connect } from 'react-redux';
import axios from 'axios';
import { store } from '../../store';
import { ErrorMessages } from '../../messages/errorMessage';
import { checkInternetConnectivity, errorMessageHandler } from '../../utils/utils';








const ShowContact = ({ navigation, contactList }) => {
    const [contact, setContact] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchText, setSearchText] = useState('');

    let selectedTheme = useSelector((state) => state.authReducer.theme)
  const theme = THEME[selectedTheme];


    const handleSearch = () => {

        if (searchText.trim() === '') {
            // If the search text is empty, show all contacts
            setContact(contactList);
        } else {

            // Filter the contacts based on the search text
            const filteredContacts = contactList.filter(
                (contact) =>
                    contact.name.toLowerCase().includes(searchText.toLowerCase())
                //||
                //contact.mobile.includes(searchText)
            );
            setContact(filteredContacts);
        }
    };

    const handleSearchCompleteSearch = () => {

        if (searchText.trim() === '') {
            // If the search text is empty, show all contacts
            setContact(contactList);
        } else {

            // Filter the contacts based on the search text
            const filteredContacts = contactList.filter(
                (contact) =>
                    contact.name.toLowerCase() === (searchText.toLowerCase())
                //||
                //contact.mobile === (searchText)
            );
            setContact(filteredContacts);
        }
    };

    useEffect(() => {
        handleSearch()
    }, [searchText])



    useEffect(() => {
        getContact()
    }, [])

    useEffect(() => {
        setContact(contactList)
    }, [contactList])





    let getContact = async () => {
        let isConnected = await checkInternetConnectivity()

        if (!isConnected) {
            alert(ErrorMessages.GENERIC.NO_INTERNET_ERROR)
            return

        }

        let address = await AsyncStorage.getItem('address');

        try {
            setIsLoading(true)
            let { data } = await axios.post(`${Str.apiUrl}/user/get-contact-list`, {
                account: address
            });
            setIsLoading(false)
            store.dispatch({ type: "GET_CONTACT", payload: data.data })


        }
        catch (e) {
            setIsLoading(false)
            let msg = errorMessageHandler(e)

            Alert.alert(msg)
            return;
        }

    }










    const ListItem = ({ item }) => {
        // Render each item of the FlatList
        return (
            <TouchableOpacity onPress={() => {
                navigation.navigate(`${ENUMS.SCREENS.TRANSFER}`, { receipent: item.receiver_account })
            }} style={{ paddingHorizontal: 16, flexDirection: "column", marginTop: 18 }}>


                <View style={{ backgroundColor:selectedTheme===ENUMS.THEME.DARK?COLORS.WHITE:theme?.BALANCE_CARD_BACKGROUND, flexDirection: "row", padding: 12, borderRadius: 8, alignItems: "center" }}>


                    <FontAwesome
                        name="user-circle"
                        style={{ fontWeight: '900' }}
                        size={30}
                        color="orange"
                    />
                    <View style={{ flexDirection: "column", marginLeft: 16, flex: 1 }}>
                        <Text style={{ fontFamily: "Poppins", color: COLORS.BLACK }}>{item.name}</Text>

                    </View>

                    {/* <FontAwesome
                        name="phone"
                        style={{ fontWeight: '900' }}
                        size={30}
                        color="orange"
                    /> */}



                </View>
            </TouchableOpacity>

        );
    };


    return (
        <React.Fragment>


            <StatusBarNU
                backgroundColor={theme?.BACKGROUND_COLOR}
               

            />



            <Header
                backButton={true}
                headerText="Contacts"
                theme={theme}
                navigation={navigation}></Header>



            <View style={[styles.mainContainer,{ backgroundColor: theme?.BACKGROUND_COLOR,}]}>




                <View style={styles.container1}>

                    <TextInput
                        style={styles.input}
                        placeholder="Search.."
                        value={searchText}
                        onChangeText={(text) => {
                            setSearchText(text);
                            handleSearch(text);
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <EvilIcons
                        name="search"
                        size={24}
                        color="#888"
                        style={styles.icon}
                        onPress={handleSearchCompleteSearch}
                    />
                </View>


                <View style={{}}>
                    {
                        isLoading && <TransactionLoader></TransactionLoader>
                    }

                    <FlatList
                        data={contact}
                        renderItem={({ item }) => <ListItem item={item} />}
                        keyExtractor={(item) => item.receiverAccount}
                    />
                </View>
                {
                    contact.length === 0 && searchText.length > 0 && <Text style={{ paddingHorizontal: 16, color: theme?.WHITE, fontWeight: "500", fontFamily: "Poppins", fontSize: 16, alignSelf: "center" }}>Sorry, no contacts matching your search query were found</Text>
                }




                <TouchableOpacity onPress={() => {
                    navigation.navigate(ENUMS.SCREENS.ADD_CONTACT_LIST)

                }} style={styles.addButton}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>















            </View>
        </React.Fragment>
    );
};
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1

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

    addButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.BTN_BACKGROUND_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    addButtonText: {
        fontSize: 24,
        fontWeight: "500",
        color: '#FFFFFF',
        fontFamily: "Poppins"
    },
    container1: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 8,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    input: {
        flex: 1,
        fontSize: 16,
        marginRight: 8,
        color: COLORS.BLACK
    },
    icon: {
        marginLeft: 8,
    },



});




const mapStateToProps = (state) => ({
    contactList: state.contactReducer.contact,

})

export default connect(mapStateToProps, {})(ShowContact)