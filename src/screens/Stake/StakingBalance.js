import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,


} from 'react-native';
import { COLORS, Images } from '../../common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DropDownHolder from '../../components/dropDownHolder';
//import Clipboard from '@react-native-community/clipboard';
import Clipboard from '@react-native-clipboard/clipboard';


function StakingBalance(props) {

    return (
        <View style={styles.mainView}>


            <View style={{ flexDirection: "row", paddingLeft: 4, paddingRight: 4, marginTop: 16 }}>

                <View style={{ flex: 1, flexDirection: "row" }}>

                    <Image style={styles.imageLogo} source={Images.usdbLogo} />
                    <Text style={{ color: COLORS.WHITE, fontWeight: "700", fontSize: 20, fontFamily: "Poppins", alignSelf: "center" }}>USB</Text>

                </View>

                <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end" }}>
                    <Text style={[styles.balanceTextHeading, { color: "#6e6e92" }]}>Total Staking</Text>
                    <Text style={[styles.balanceTextHeading, { marginBottom: 2, fontWeight: "900" }]}>{props.stakeAmount} USB</Text>
                </View>

            </View>



            <View style={styles.balanceCardMainViewStyle}>
                <View style={{ flexDirection: "row" }}>

                    <View style={{ flex: 1, flexDirection: "column" }}>

                        <Text style={[styles.eurbMainAccountText, { marginBottom: 2 }]}>USB - Main Account</Text>



                        <Text style={styles.addressText}>{`${props.userAddress.substring(0, 10)} .... ${props.userAddress.substring(32, props.userAddress.length)}`}</Text>
                    </View>

                    
                        <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => {
                            
                            Clipboard.setString(props.userAddress);
                            DropDownHolder.alert('Success', 'Copy', `The wallet address has been copied successfully.`);
                        }}>

                            <Ionicons
                                name="copy-outline"
                                style={styles.copyText}

                                size={20}
                                color={COLORS.WHITE}
                            />
                        </TouchableOpacity>
                    
                </View>

                <View style={{ height: 2, backgroundColor: COLORS.BTN_BACKGROUND_COLOR, marginTop: 16, marginBottom: 16 }}></View>



                <View style={{ flexDirection: "row" }}>

                    <View style={{ flex: 1, flexDirection: "column" }}>

                        <Text style={styles.balanceTextHeading}>Available to Stake</Text>
                        <Text style={[styles.balanceTextHeading, { marginBottom: 2, fontWeight: "900" }]}>{props.balance} USB</Text>

                    </View>

                    <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end" }}>
                        <Text style={styles.balanceTextHeading}>In Stake</Text>
                        <Text style={[styles.balanceTextHeading, { marginBottom: 2, fontWeight: "900" }]}>{props.stakeAmount} USB</Text>
                    </View>
                </View>






            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    mainView: {
        width: "100%",
        paddingLeft: 16,
        paddingRight: 16,




    },
    balanceCardMainViewStyle: {

        width: "100%",
        marginTop: 16,
        padding: 16,
        backgroundColor: "#0a0b1d",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#4d4b70",


        shadowColor: COLORS.WHITE,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,

    },
    eurbMainAccountText: {
        color: COLORS.WHITE,
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: "Poppins"

    },
    balanceTextHeading: {
        color: COLORS.WHITE,
        fontSize: 12,
        fontWeight: "400",

        fontFamily: "Poppins",
    },
    balanceTextValue: {
        color: COLORS.WHITE,
        marginTop: 5,
        fontSize: 26,
        fontWeight: "700",
        fontFamily: "Poppins"
    },
    addressText: {
        color: COLORS.WHITE,
        fontSize: 12,
        fontWeight: "500",
        fontFamily: "Poppins",


    },
    copyText: {

        marginLeft: 8,
        fontWeight: '800'
    },
    imageLogo: {
        width: 30,
        height: 30,
        marginRight: 8,
        alignSelf: "center"

    }


});
export default StakingBalance;