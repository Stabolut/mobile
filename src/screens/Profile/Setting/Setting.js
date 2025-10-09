import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import MnemonicsShowModal from '../../../components/Modal/MnemonicsShowModal';
import Header from '../../../components/Header/Header';
import { COLORS, ENUMS, Str, THEME } from '../../../common';
import StatusBarNU from '../../../components/StatusBarNU/StatusBarNU';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ReferralModal from '../../../components/Modal/ReferralModal';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ToggleSwitch from 'toggle-switch-react-native'
import DropDownHolder from '../../../components/dropDownHolder';
import Entypo from 'react-native-vector-icons/Entypo';
// import PushNotification from 'react-native-push-notification'
import TouchID from 'react-native-touch-id';
import SetUsernameModal from '../../../components/Modal/SetUsernameModal';
import AsyncStorage from '@react-native-community/async-storage';
import { useSelector } from 'react-redux';
import LoadingModal from '../../../components/LoadingModal/modal';
import { errorMessageHandler, saveString } from '../../../utils/utils';
import axios from 'axios';
import { store } from '../../../store';
import { setTheme } from '../../../redux/action/wallet';
import { getRealmInstance } from '../../../utils/realmDbCreation';


function Setting({ navigation }) {
    const [toggle, setToggle] = useState(false)
    const [toggleBioMetrics, setToggleBiometrics] = useState(false)
    const [bioMetricSupport, setBiometricSupport] = useState(false)
    const [showUsernameModal, setShowUsernameModal] = useState(false)
    const [allowContact, setAllowContact] = useState(false)
    const [privateKey, setPrivateKey] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [username, setUserName] = useState('');
    const [initialUsername, setInitialUsername] = useState('');
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const selectedTheme = useSelector((state) => state.walletReducer.theme)
    const theme = THEME[selectedTheme];



    let getLocalData = async () => {
        let address = await AsyncStorage.getItem('address');
        let privateKey = await AsyncStorage.getItem('mnemonics');
        let privateKey1 = await AsyncStorage.getItem('privateKey');
        console.log("privateKey1", privateKey1)


        setUserAddress(address);
        setPrivateKey(privateKey);
    };
    // if user address get from localStorage then we get the balance of address
    useEffect(() => {
        if (userAddress) {
            getUsername()
        }
    }, [userAddress]);

    useEffect(() => {
        getDarkModeToggle()
        getLocalData();
        getAllowContacts()
        getBiometrics()
        checkBioMetrics()


    }, []);

    let getUsername = async () => {
        try {
            let { data } = await axios.post(`${Str.apiUrl}/user/retrieve-user-by-wallet-or-username`, {
                userID: userAddress
            });
            setUserName(data?.data?.username)
            setInitialUsername(data?.data?.username)
        }
        catch (e) {
            console.log("api error", errorMessageHandler(e))
        }
    }

    let getAllowContacts = async () => {
        let allowContacts = await AsyncStorage.getItem("allowContact")
        if (allowContacts === "true") setAllowContact(true)
    }
    let getBiometrics = async () => {
        try {
            let bioMetrics = await AsyncStorage.getItem("fingerPrint")
            if (bioMetrics === "true") setToggleBiometrics(true)
        }
        catch (e) {
            console.log("Error", e)
        }
    }
    let getDarkModeToggle = async () => {
        try {
            if (selectedTheme === ENUMS.THEME.DARK) setToggle(true)
            else setToggle(false)
        }
        catch (e) {
            console.log("Error", e)
        }
    }

    let checkBioMetrics = async () => {
        const optionalConfigObject = {
            unifiedErrors: false, // use unified error messages (default false)
            passcodeFallback: false,
        }
        try {
            let biometryType = await TouchID.isSupported(optionalConfigObject)
            if (biometryType) {

                setBiometricSupport(true)
            }

        }
        catch (e) {

        }

    }

    useEffect(() => {

        if (toggle === true) {
            store.dispatch(setTheme(ENUMS.THEME.DARK))
            saveString("theme", ENUMS.THEME.DARK)
        }
        else {
            store.dispatch(setTheme(ENUMS.THEME.LIGHT))
            saveString("theme", ENUMS.THEME.LIGHT)
        }
    }, [toggle]);

    const clearRealmDB = async () => {
        try {
            // Get the shared Realm instance
            let realmInstance = getRealmInstance();
            // Begin a write transaction to delete all objects
            realmInstance.write(() => {
                const allObjects = realmInstance.objects('TransactionsHistorySchema');
                realmInstance.delete(allObjects); // Delete all objects from the schema
            });
            if (realmInstance && !realmInstance.isClosed) {
                realmInstance.close();
                realmInstance = null;
            }

            console.log('Realm database cleared successfully.');
        } catch (error) {
            console.error('Error clearing Realm database:', error);
        }
    };




    const handleYesButtonPress = async () => {
        setIsLoading(true);
        await AsyncStorage.removeItem('address');
        await AsyncStorage.removeItem('mnemonics');
        await AsyncStorage.removeItem('privateKey');
        await AsyncStorage.removeItem('pin');
        await AsyncStorage.removeItem('PinSet');
        await AsyncStorage.removeItem("fingerPrint")
        await AsyncStorage.removeItem("allowContact")
        await clearRealmDB()

        setTimeout(() => {
            setIsLoading(false);
            DropDownHolder.alert('Success', 'Copy', `Your account is deleted successfully`);
            navigation.navigate(ENUMS.SCREENS.INTRODUCTION_SLIDE)
            // Continue with your logic or perform any necessary actions
        }, 2000);
    };

    const showAlertDialog = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account?',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Delete', onPress: handleYesButtonPress },
            ],
            { cancelable: false }
        );
    };





    return (
        <React.Fragment>

            <StatusBarNU
                backgroundColor={theme?.BACKGROUND_COLOR}
            />
            <Header
                backButton={true}
                headerText="settings"
                theme={theme}
                navigation={navigation}></Header>

            <View style={[styles.mainContainer, { backgroundColor: theme?.BACKGROUND_COLOR }]}>

                <ScrollView>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate(ENUMS.SCREENS.ABOUT)
                    }} style={{ backgroundColor: theme?.BALANCE_CARD_BACKGROUND, padding: 16, flexDirection: "row" }}>

                        <View style={{ width: 30, height: 30, backgroundColor: "#fe55a7", borderRadius: 6, justifyContent: "center", alignItems: "center", alignSelf: "center" }}>
                            <FontAwesome
                                name="heart"
                                style={{ fontWeight: '900' }}
                                size={18}
                                color={COLORS.WHITE}
                            />
                        </View>
                        <Text style={{ marginLeft: 30, fontSize: 15, alignSelf: "center", color: theme?.WHITE, fontFamily: "Poppins" }}>About</Text>


                    </TouchableOpacity>


                    {/* <View style={{ backgroundColor: theme?.BALANCE_CARD_BACKGROUND, padding: 16, flexDirection: "row", marginTop: 16 }}>

                        <View style={{ width: 30, height: 30, backgroundColor: COLORS.BLACK, borderRadius: 6, justifyContent: "center", alignItems: "center", alignSelf: "center" }}>
                            <MaterialIcons
                                name="nightlight-round"
                                style={{ fontWeight: '900' }}
                                size={18}
                                color={COLORS.WHITE}
                            />
                        </View>
                        <Text style={{ marginLeft: 30, fontSize: 15, color: theme?.WHITE, flex: 1, alignSelf: "center" }}>Dark Mode</Text>

                        <ToggleSwitch
                            style={{ alignSelf: "center" }}
                            isOn={toggle}
                            onColor="green"
                            offColor="red"
                            size="medium"
                            onToggle={isOn => setToggle(!toggle)}
                        />


                    </View> */}

                    <View style={{ backgroundColor: theme?.BALANCE_CARD_BACKGROUND, padding: 16, marginTop: 12 }}>

                        <TouchableOpacity onPress={showAlertDialog} style={{ flexDirection: "row" }}>
                            {/* // when contact us on  use marginTop: 32  */}

                            <View style={{ width: 30, height: 30, backgroundColor: "red", borderRadius: 6, justifyContent: "center", alignItems: "center", alignSelf: "center" }}>
                                <MaterialCommunityIcons
                                    name="delete"
                                    style={{ fontWeight: '900' }}
                                    size={18}
                                    color={COLORS.WHITE}
                                />


                            </View>

                            <View style={{ flexDirection: "column", marginLeft: 30, flex: 1, alignSelf: "center", marginTop: 8 }}>
                                <Text

                                    style={{ fontSize: 15, color: theme?.WHITE, flex: 1, fontFamily: "Poppins" }}

                                >Delete Account</Text>
                                <View style={{ height: 1, backgroundColor: COLORS.SLIDER_BORDER_COLOR, marginTop: 12, width: "100%", opacity: 0.2 }}></View>
                            </View>

                            {isLoading &&
                                // <ActivityIndicator size="large" color={COLORS.WHITE} />
                                <LoadingModal task={'Deleting account...'} modalVisible={isLoading} />


                            }

                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            navigation?.navigate(ENUMS.SCREENS.UPDATE_PIN, {
                                goToScreen: ENUMS.SCREENS.SETTING,
                                pinState: 'choose',
                            });
                        }} style={{ flexDirection: "row", marginTop: 32 }}>

                            <View style={{ width: 30, height: 30, backgroundColor: "#8d8c92", borderRadius: 6, justifyContent: "center", alignItems: "center", alignSelf: "center" }}>
                                <FontAwesome
                                    name="lock"
                                    style={{ fontWeight: '900' }}
                                    size={18}
                                    color={COLORS.WHITE}
                                />


                            </View>


                            <View style={{ flexDirection: "column", marginLeft: 30, flex: 1, alignSelf: "center", marginTop: 8 }}>
                                <Text

                                    style={{ fontSize: 15, color: theme?.WHITE, flex: 1, fontFamily: "Poppins" }}

                                >Change Pin</Text>
                                <View style={{ height: 1, backgroundColor: COLORS.SLIDER_BORDER_COLOR, marginTop: 12, width: "100%", opacity: 0.2 }}></View>
                            </View>


                        </TouchableOpacity>



                        <TouchableOpacity onPress={() => {

                            setVisible(true)
                        }} style={{ flexDirection: "row", marginTop: 32 }}>

                            <View style={{ width: 30, height: 30, backgroundColor: "#3476b4", borderRadius: 6, justifyContent: "center", alignItems: "center", alignSelf: "center" }}>

                                <MaterialCommunityIcons
                                    name="eye"
                                    style={{ fontWeight: '900' }}
                                    size={18}
                                    color={COLORS.WHITE}
                                />


                            </View>


                            <View style={{ flexDirection: "column", marginLeft: 30, flex: 1, alignSelf: "center", marginTop: 8 }}>
                                <Text

                                    style={{ fontSize: 15, color: theme?.WHITE, flex: 1, fontFamily: "Poppins" }}

                                >Show Key</Text>
                                <View style={{ height: 1, backgroundColor: COLORS.SLIDER_BORDER_COLOR, marginTop: 12, width: "100%", opacity: 0.2 }}></View>
                            </View>


                        </TouchableOpacity>

                    </View>

                    <View style={{ backgroundColor: theme?.BALANCE_CARD_BACKGROUND, padding: 16, marginTop: 12 }}>


                        <TouchableOpacity onPress={() => {
                            navigation?.navigate(ENUMS.SCREENS.WEB_VIEW, {
                                url: ENUMS.EXTERNAL_URL.TWITTER,
                                headerText: "Twitter"
                            });



                        }} style={{ flexDirection: "row" }}>

                            <View style={{ width: 30, height: 30, backgroundColor: "#3476b4", borderRadius: 6, justifyContent: "center", alignItems: "center", alignSelf: "center" }}>
                                <Ionicons
                                    name="logo-twitter"
                                    style={{ fontWeight: '900' }}
                                    size={18}
                                    color={COLORS.WHITE}
                                />
                            </View>


                            <View style={{ flexDirection: "column", marginLeft: 30, flex: 1, alignSelf: "center", marginTop: 8 }}>
                                <Text

                                    style={{ fontSize: 15, color: theme?.WHITE, flex: 1, fontFamily: "Poppins" }}

                                >Twitter</Text>
                                <View style={{ height: 1, backgroundColor: COLORS.SLIDER_BORDER_COLOR, marginTop: 12, width: "100%", opacity: 0.2 }}></View>
                            </View>


                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            navigation?.navigate(ENUMS.SCREENS.WEB_VIEW, {
                                url: ENUMS.EXTERNAL_URL.TELEGRAM,
                                headerText: "Telegram"
                            });
                        }} style={{ flexDirection: "row", marginTop: 32 }}>

                            <View style={{ width: 30, height: 30, backgroundColor: COLORS.APP_BLUE_COLOR, borderRadius: 6, justifyContent: "center", alignItems: "center", alignSelf: "center" }}>
                                <EvilIcons
                                    name="sc-telegram"
                                    style={{ fontWeight: '900' }}
                                    size={25}
                                    color={COLORS.WHITE}
                                />
                            </View>


                            <View style={{ flexDirection: "column", marginLeft: 30, flex: 1, alignSelf: "center", marginTop: 8 }}>
                                <Text

                                    style={{ fontSize: 15, color: theme?.WHITE, flex: 1, fontFamily: "Poppins" }}

                                >Telegram</Text>
                                <View style={{ height: 1, backgroundColor: COLORS.SLIDER_BORDER_COLOR, marginTop: 12, width: "100%", opacity: 0.2 }}></View>
                            </View>


                        </TouchableOpacity>






                    </View>

                    {/* <View style={{ backgroundColor: theme?.BALANCE_CARD_BACKGROUND, padding: 16, marginTop: 12 }}>

                        <TouchableOpacity onPress={() => {


                            navigation?.navigate(ENUMS.SCREENS.LEADERBOARD)


                        }} style={{ flexDirection: "row" }}>

                            <View style={{ width: 30, height: 30, backgroundColor: "#f3b854", borderRadius: 6, justifyContent: "center", alignItems: "center", alignSelf: "center" }}>
                                <FontAwesome style={{ fontWeight: '900' }} name="trophy" size={18} color={COLORS.WHITE} />

                            </View>
                            <View style={{ flexDirection: "column", marginLeft: 30, flex: 1, alignSelf: "center", marginTop: 8 }}>
                                <Text

                                    style={{ fontSize: 15, color: theme?.WHITE, flex: 1, fontFamily: "Poppins" }}

                                >Badges & Rewards </Text>
                                <View style={{ height: 1, backgroundColor: COLORS.SLIDER_BORDER_COLOR, marginTop: 12, width: "100%", opacity: 0.2 }}></View>
                            </View>


                        </TouchableOpacity>


                    </View> */}


                    {
                        bioMetricSupport === true &&
                        <View style={{ backgroundColor: theme?.BALANCE_CARD_BACKGROUND, padding: 16, flexDirection: "row", marginTop: 16 }}>

                            <View style={{ width: 30, height: 30, backgroundColor: "gray", borderRadius: 6, justifyContent: "center", alignItems: "center", alignSelf: "center" }}>
                                <MaterialCommunityIcons
                                    name="fingerprint"
                                    style={{ fontWeight: '900' }}
                                    size={18}
                                    color={COLORS.WHITE}
                                />


                            </View>
                            <Text style={{ marginLeft: 30, fontSize: 15, color: theme?.WHITE, flex: 1, alignSelf: "center", fontFamily: "Poppins" }}>BioMetrics</Text>

                            <ToggleSwitch
                                style={{ alignSelf: "center" }}
                                isOn={toggleBioMetrics}
                                onColor="green"
                                offColor="red"
                                size="medium"
                                onToggle={async (isOn) => {
                                    setToggleBiometrics(!toggleBioMetrics)
                                    if (isOn) await AsyncStorage.setItem("fingerPrint", "true")
                                    else await AsyncStorage.setItem("fingerPrint", "false")

                                }}
                            />


                        </View>


                    }





                    <View style={{ backgroundColor: theme?.BALANCE_CARD_BACKGROUND, padding: 16, marginTop: 12 }}>

                        <TouchableOpacity onPress={async () => {
                            setShowUsernameModal(true)
                        }} style={{ flexDirection: "row" }}>

                            <View style={{ width: 30, height: 30, backgroundColor: "#fe3b2d", borderRadius: 6, justifyContent: "center", alignItems: "center", alignSelf: "center" }}>
                                <Entypo
                                    name="user"
                                    style={{ fontWeight: '900' }}
                                    size={18}
                                    color={COLORS.WHITE}
                                />


                            </View>


                            <View style={{ flexDirection: "column", marginLeft: 30, flex: 1, alignSelf: "center", marginTop: 8 }}>
                                <Text

                                    style={{ fontSize: 15, color: theme?.WHITE, flex: 1, fontFamily: "Poppins" }}

                                >Set Username</Text>
                                <View style={{ height: 1, backgroundColor: COLORS.SLIDER_BORDER_COLOR, marginTop: 12, width: "100%", opacity: 0.2 }}></View>
                            </View>

                        </TouchableOpacity>

                        <TouchableOpacity onPress={async () => {
                            navigation?.navigate(ENUMS.SCREENS.ADD_CONTACT_LIST);
                        }} style={{ flexDirection: "row", marginTop: 32 }}>

                            <View style={{ width: 30, height: 30, backgroundColor: "#fe3b2d", borderRadius: 6, justifyContent: "center", alignItems: "center", alignSelf: "center" }}>
                                <MaterialCommunityIcons
                                    name="contacts"
                                    style={{ fontWeight: '900' }}
                                    size={18}
                                    color={COLORS.WHITE}
                                />


                            </View>


                            <View style={{ flexDirection: "column", marginLeft: 30, flex: 1, alignSelf: "center", marginTop: 8 }}>
                                <Text

                                    style={{ fontSize: 15, color: theme?.WHITE, flex: 1, fontFamily: "Poppins" }}

                                >Add Contacts</Text>
                                <View style={{ height: 1, backgroundColor: COLORS.SLIDER_BORDER_COLOR, marginTop: 12, width: "100%", opacity: 0.2 }}></View>
                            </View>



                        </TouchableOpacity>


                        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ flexDirection: "row", marginTop: 32 }}>

                            <View style={{ width: 30, height: 30, backgroundColor: "#808080", borderRadius: 6, justifyContent: "center", alignItems: "center", alignSelf: "center" }}>

                                <Feather
                                    name="user-plus"
                                    style={{ fontWeight: '900' }}
                                    size={18}
                                    color={theme?.WHITE}
                                />


                            </View>


                            <View style={{ flexDirection: "column", marginLeft: 30, flex: 1, alignSelf: "center", marginTop: 8 }}>
                                <Text

                                    style={{ fontSize: 15, color: theme?.WHITE, flex: 1, fontFamily: "Poppins" }}

                                >Invites</Text>
                                <View style={{ height: 1, backgroundColor: COLORS.SLIDER_BORDER_COLOR, marginTop: 12, width: "100%", opacity: 0.2 }}></View>
                            </View>



                        </TouchableOpacity>




                    </View>

                    <View style={{ backgroundColor: theme?.BALANCE_CARD_BACKGROUND, padding: 16, flexDirection: "row", marginTop: 12 }}>

                        <View style={{ width: 30, height: 30, backgroundColor: "#808080", borderRadius: 6, justifyContent: "center", alignItems: "center", alignSelf: "center" }}>
                            <FontAwesome5
                                name="user-circle"
                                style={{ fontWeight: '900' }}
                                size={18}
                                color={COLORS.WHITE}
                            />


                        </View>
                        <Text style={{ marginLeft: 30, fontSize: 15, color: theme?.WHITE, flex: 1, alignSelf: "center", fontFamily: "Poppins" }}>Contacts Only</Text>

                        <ToggleSwitch
                            style={{ alignSelf: "center" }}
                            isOn={allowContact}
                            onColor="green"
                            offColor="red"
                            size="medium"
                            onToggle={async (isOn) => {

                                setAllowContact(!allowContact)
                                let isContactOnly = isOn === true ? "true" : "false"
                                await AsyncStorage.setItem("allowContact", isContactOnly)


                            }}
                        />


                    </View>


                </ScrollView>
            </View>



            <SetUsernameModal selectedTheme={selectedTheme} username={username} initialUsername={initialUsername} visible={showUsernameModal} onChangeValue={(username) => { setUserName(username) }} onClose={() => { setShowUsernameModal(false) }}
                onUpdateUsername={(value) => { setInitialUsername(value) }}





            ></SetUsernameModal>



            <MnemonicsShowModal
                privateKey={privateKey}
                visible={visible}
                selectedTheme={selectedTheme}

                onClose={() => {
                    setVisible(false);
                }}></MnemonicsShowModal>


            <ReferralModal

                visible={modalVisible}
                theme={theme}
                selectedTheme={selectedTheme}
                onClose={() => {
                    setModalVisible(false);
                }}></ReferralModal>



        </React.Fragment>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    image: {
        width: 300,
        height: 200,
    },
    headingStyle: {
        color: COLORS.APP_HEADING_TEXT_COLOR_BALCK,
        fontSize: 18,
        fontFamily: 'Poppins',

        fontWeight: "500"
    },
    paragraphStyle: {
        marginTop: 8,
        color: COLORS.BLACK,
        opacity: 0.6,
        fontSize: 12,
        fontFamily: 'Poppins',
    },
    menuTextStyle: {

    },
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

});

export default Setting;
