import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,
    ToastAndroid, AlertIOS
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import Header from '../../../../components/Header/Header';
import { COLORS, ENUMS } from '../../../../common';
import StatusBarNU from '../../../../components/StatusBarNU/StatusBarNU';
import { ethers } from 'ethers';
import Clipboard from '@react-native-community/clipboard';
import DropDownHolder from '../../../../components/dropDownHolder';
import RNFS from 'react-native-fs';
import { request, PERMISSIONS } from 'react-native-permissions';
import { err } from 'react-native-svg/lib/typescript/xml';
function ChooseImportOption({ navigation }) {

    return (
        <React.Fragment>
            <StatusBarNU
                backgroundColor={COLORS.BACKGROUND_COLOR}
                barStyle="light-content"
            />

            <Header

                headerText="Add Account"
                navigation={navigation}></Header>


            <View style={styles.mainContainer}>
                <View style={styles.mainContainerChild1}>
                    <Text style={styles.header}>What would you</Text>
                    <Text style={[styles.header, { marginBottom: 16 }]}>like to do?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate(ENUMS.SCREENS.IMPORT_WALLET)} style={{ backgroundColor: "#252549", paddingLeft: 16, paddingRight: 16, paddingTop: 24, paddingBottom: 24, borderRadius: 12, marginBottom: 24 }}>
                        <View>
                            <Text style={styles.title}>Import With Mnemonics</Text>
                            <Text style={styles.body}>Restore your external account using your mnemonic phrase</Text>
                            
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate(ENUMS.SCREENS.IMPORT_WALLET_PRIVATE_KEY)} style={{ backgroundColor: "#252549", paddingLeft: 16, paddingRight: 16, paddingTop: 24, paddingBottom: 24, borderRadius: 12 }}>
                        <Text style={styles.title}>Import With Private Key</Text>
                        <Text style={styles.body}>Restore your external account using your private key</Text>

                    </TouchableOpacity>

                </View>

            </View>
        </React.Fragment>
    );

}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND_COLOR,

    },
    mainContainerChild1: {
        flex: 1,
        backgroundColor: "#181834",
        marginTop: 20,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        padding: 32

    },

    header: {
        color: COLORS.WHITE,
        fontSize: 24,
        marginLeft: 3,
        fontWeight: "500",
        fontFamily: 'Poppins',
    },
    title: {
        color: COLORS.WHITE,
        fontSize: 16,
        fontWeight: "500",
        fontFamily: 'Poppins',

    },
    body: {
        color: COLORS.SMALL_HEADING_TEXT,
        fontSize: 10,
        marginTop: 4,

        fontFamily: 'Poppins',
    },

});

export default ChooseImportOption;
