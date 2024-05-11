import React, { useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,

} from 'react-native';
import Header from '../../../../components/Header/Header';
import { COLORS, ENUMS, THEME } from '../../../../common';
import StatusBarNU from '../../../../components/StatusBarNU/StatusBarNU';
import messaging from '@react-native-firebase/messaging';
import { useSelector } from 'react-redux';
function ChooseImportOption({ navigation }) {

    let selectedTheme = useSelector((state) => state.authReducer.theme)
    const theme = THEME[selectedTheme];

    useEffect(() => {
        try {
            getFcmToken()
        }
        catch (e) {
            console.log("execeptio", e)
        }
    }, [])

    let getFcmToken = async () => {
        try {

            let fcmToken = await messaging().getToken()

            console.log("fcmToken", fcmToken)
        }
        catch (e) {
            console.log("Myu toke", e)
        }
    }

    return (
        <React.Fragment>
            <StatusBarNU
                backgroundColor={theme?.BACKGROUND_COLOR}

            />

            <Header

                headerText="Add Account"
                theme={theme}
                navigation={navigation}></Header>

               


            <View style={[styles.mainContainer, { backgroundColor: theme?.BACKGROUND_COLOR, }]}>
                <View style={[styles.mainContainerChild1, { backgroundColor: theme?.IMPORT_BACKGROUND }]}>
                    <Text style={[styles.header,{ color: theme?.WHITE,}]}>What would you</Text>
                    <Text style={[styles.header, { marginBottom: 16,color: theme?.WHITE }]}>like to do?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate(ENUMS.SCREENS.IMPORT_WALLET)} style={{ backgroundColor: theme?. IMPORT_BACKGROUND_CARD, paddingLeft: 16, paddingRight: 16, paddingTop: 24, paddingBottom: 24, borderRadius: 12, marginBottom: 24 }}>
                        <View>
                            <Text style={[styles.title,{ color: theme?.WHITE,}]}>Import With Mnemonics</Text>
                            <Text style={[styles.body,{ color:  theme?.SMALL_HEADING_TEXT,}]}>Restore your external account using your mnemonic phrase</Text>

                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate(ENUMS.SCREENS.IMPORT_WALLET_PRIVATE_KEY)} style={{ backgroundColor:theme?. IMPORT_BACKGROUND_CARD, paddingLeft: 16, paddingRight: 16, paddingTop: 24, paddingBottom: 24, borderRadius: 12 }}>
                        <Text style={[styles.title,{ color: theme?.WHITE,}]}>Import With Private Key</Text>
                        <Text style={[styles.body,{ color:  theme?.SMALL_HEADING_TEXT,}]}>Restore your external account using your private key</Text>

                    </TouchableOpacity>

                </View>

            </View>
        </React.Fragment>
    );

}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1

    },
    mainContainerChild1: {
        flex: 1,

        marginTop: 20,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        padding: 32

    },

    header: {
       
        fontSize: 24,
        marginLeft: 3,
        fontWeight: "500",
        fontFamily: 'Poppins',
    },
    title: {
       
        fontSize: 16,
        fontWeight: "500",
        fontFamily: 'Poppins',

    },
    body: {
        fontSize: 12,
        marginTop: 4,

        fontFamily: 'Poppins',
    },

});

export default ChooseImportOption;
