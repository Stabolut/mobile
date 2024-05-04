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

                <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 1, paddingLeft: 24, marginTop: 8, alignItems: "baseline", }}>
                        <Text style={styles.balanceTextHeading}>Balancess</Text>

                        {
                            isLoading === true ? <Text style={{ color: COLORS.WHITE }}>....</Text> :
                                <View style={{ flexDirection: "row" }}>
                                    <Image style={styles.imageLogo} source={Images.usdbLogo} />

                                    <Text style={styles.balanceTextValue}> {balance.toLocaleString() + ' US₿'}</Text>

                                </View>
                        }

                    </View>

                    <View>
                        <View style={{ backgroundColor: "red", padding: 3 }}>

                            <Text style={{
                                padding: 0, fontSize: 12,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: '#FFFFFF',

                                fontFamily: "Poppins"
                            }}>Testnet</Text>
                        </View>



                    </View>

                </View>


                <View style={{ flexDirection: "row", marginTop: 12, paddingLeft: 24, paddingRight: 24, paddingBottom: 8}}>
                    <View style={{ flex: 80 }}><Text style={styles.addressText}>{userAddress}</Text></View>
                    <TouchableOpacity onPress={copy} style={{ flex: 10}}>

                        <Ionicons
                            name="copy-outline"
                            style={styles.copyText}
                            size={20}
                            color={COLORS.WHITE}
                        />
                    </TouchableOpacity>


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
        marginTop: 8
    }


});
export default BalanceCard;