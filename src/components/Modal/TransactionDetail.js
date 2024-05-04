import React, { useRef, useState, useN } from 'react';
import Toast from 'react-native-easy-toast'
import { View, Modal, StyleSheet, Text, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { COLORS, CS, ENUM, } from '../../common';
import Clipboard from '@react-native-clipboard/clipboard';
import DropDownHolder from '../dropDownHolder';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
export default function TransactionDetail({ item, showDetailModal, onClose, onBlochainContinue, userAddress }) {

    const navigation = useNavigation();

    const items = {
        amountToSend: 100000,
        // other properties of the item
    };




    return (
        <Modal animationType="fade"

            transparent={true}
            visible={showDetailModal}
            statusBarTranslucent={true}>


            <View style={styles.centeredView}>




                <View style={styles.modalView}>
                    <View style={{ width: 70, height: 70, backgroundColor: "green", borderRadius: 70 / 2, justifyContent: "center", alignItems: "center" }}>
                        <FontAwesomeIcon
                            name="check"
                            size={40}
                            color={COLORS.WHITE}></FontAwesomeIcon>

                    </View>
                    <Text style={{ marginTop: 16, marginBottom: 12, color: COLORS.WHITE }}>
                        {userAddress === item.senderAddress ? "You have transferred" : "You have received"}{" "}


                        <Text style={{ color: COLORS.SMALL_HEADING_TEXT, fontWeight: "bold" }}>{item?.amountToSend?.toLocaleString('en-IN')} US₿</Text></Text>
                    <Text style={{ marginBottom: 16, color: COLORS.WHITE }}>


                        {userAddress === item.senderAddress ? "To" : "From"}
                    </Text>



                    {/* backgroundColor: "#252549" */}
                    <View style={{ backgroundColor: "#252549", borderRadius: 10, padding: 16, marginBottom: 16, flexDirection: "row", marginHorizontal: 16 }}>
                        <Text style={styles.addressText}>
                            {userAddress === item.senderAddress ? item.receiverAddress : item.senderAddress}










                        </Text>
                        <TouchableOpacity

                            onPress={() => {

                                try {
                                    let res = userAddress === item.senderAddress ? item.receiverAddress : item.senderAddress

                                    Clipboard.setString(res);
                                    DropDownHolder.alert(
                                        'sucess',
                                        'Copy',
                                        `The wallet information has been successfully copied to the clipboard.`,
                                    );
                                }
                                catch (e) {
                                    DropDownHolder.alert(
                                        'sucess',
                                        'Copy',
                                        `Facing some problem to copy wallet information to the clipboard.`,
                                    );

                                }

                            }}

                            style={{ justifyContent: "center", alignItems: "center" }}
                        >
                            <Ionicons size={25} color={COLORS.WHITE} name="copy" />

                        </TouchableOpacity>
                    </View>
                    {
                        item.transactionNotes && <Text style={{ alignSelf: "flex-start", color: COLORS.SMALL_HEADING_TEXT, marginBottom: 4, padding: 4,paddingLeft: 28 }}>Notes: <Text style={{ color: COLORS.WHITE, fontWeight: "500" }}>{item.transactionNotes != "" ? item.transactionNotes : ""}</Text></Text>
                    }


                    <Text style={{ alignSelf: "flex-start", marginBottom: 16, color: COLORS.SMALL_HEADING_TEXT, paddingLeft: 28 }}>Date: <Text style={{ color: COLORS.WHITE }}>{moment(item.sendDate).format('MMMM D, YYYY')}</Text></Text>

                    {/* <Text style={{ alignSelf: "flex-start", color: "gray", marginBottom: 4 }}>Notes: <Text style={{ color: COLORS.APP_BLUE_COLOR, fontWeight: "500" }}>{props.item.transactionNotes}</Text></Text>
                    <Text style={{ alignSelf: "flex-start", marginBottom: 24, color: "gray" }}>Send Data: <Text style={{ color: COLORS.BLACK }}>{props.item.sendDate}</Text></Text> */}

                    <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 16, padding: 32 }}>
                      

                        <TouchableOpacity
                            style={[styles.Button_Ok,{marginRight:8,backgroundColor:COLORS.BTN_BACKGROUND_COLOR}]}

                            onPress={() => onBlochainContinue(item.transactionHash)}
                        >

                            <Text style={styles.Text_style_ok}>View On Blockchain</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.Button_Ok, { backgroundColor: "gray" }]}
                            onPress={() => onClose()}
                        >

                            <Text style={styles.Text_style_ok}>Close</Text>
                        </TouchableOpacity>

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
        margin: 20,
        width: "90%",
        paddingTop: 32,



        backgroundColor: COLORS.BALANCE_CARD_BACKGROUND,

        borderRadius: 20,
        flexDirection: 'column',

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
    addressText: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.SMALL_HEADING_TEXT,
        paddingHorizontal: 6,

        fontFamily: 'Poppins',
    },
    _Modal_inner_text1: {

        fontFamily: "Poppins",
        fontWeight: '500',
        textDecorationLine: "none",
        fontSize: 16,
        lineHeight: 30,
        letterSpacing: 0.1,
    },

    modalText: {
        marginVertical: 15,
        textAlign: "center",
        color: COLORS.WHITE,
        fontSize: 17,
        marginLeft: 15,
    },
    Button_Ok: {

        borderRadius: 5,
        opacity: 1,
        padding: 12,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",



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
        backgroundColor: COLORS.WHITE,
        width: '100%',
        height: 150,
        marginTop: 16,

        borderColor: COLORS.SLIDER_BORDER_COLOR,
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,



    },
});