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

function BalanceCard({ isLoading, balance, userAddress, copy }) {

    return (
        <View style={styles.mainView}>

            <View style={styles.balanceCardMainViewStyle}>

                <View style={{}}>

                </View>
                <View style={{
                    backgroundColor: "red", alignSelf: "flex-end", justifyContent: "center", alignItems: "center", padding: 3

                }}>

                    <Text style={{
                        padding: 0, fontSize: 12,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#FFFFFF',

                        fontFamily: "Poppins"
                    }}>Testnet</Text>


                </View>


                <View style={{ alignItems: "baseline",backgroundColor:"pink", paddingLeft: 24,paddingRight:24,paddingBottom:24 }}>

                    <Text style={styles.balanceTextHeading}>Balance</Text>

                    {
                        isLoading === true ? <Text style={{ color: COLORS.WHITE }}>....</Text> :
                            <View style={{ flexDirection: "row" }}>
                                <Image style={styles.imageLogo} source={Images.usdbLogo} />

                                <Text style={styles.balanceTextValue}> {balance.toLocaleString() + ' US₿'}</Text>

                            </View>
                    }

                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 24 }}>
                        <Text style={styles.addressText}>{userAddress}</Text>
                        <TouchableOpacity onPress={copy}>

                            <Ionicons
                                name="copy-outline"
                                style={styles.copyText}
                                size={25}
                                color={COLORS.WHITE}
                            />
                        </TouchableOpacity>

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
        marginTop:32



    },
    balanceCardMainViewStyle: {
       
        width: "100%",
        marginTop: 24,
        // padding:32 ,
        backgroundColor: COLORS.BALANCE_CARD_BACKGROUND,
        borderRadius: 10,
        borderTopWidth: 5,
        borderTopColor: COLORS.BALANCE_CARD_UPPER_BORDER,

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
        color: COLORS.USDB_MAIN_ACCOUNT_TEXT,
        fontSize: 24,
        fontWeight: "bold"

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
        flex: 1,
        fontSize: 12,
        fontWeight: "500",
        fontFamily: "Poppins",

    },
    copyText: {

        marginLeft: 64,
        fontWeight: '800'
    },
    imageLogo: {
        width: 30,
        height: 30,
        marginRight: 8,
        marginTop: 8
    }


});
export default BalanceCard;