import React, { useRef, useState, useN } from 'react';
import Toast from 'react-native-easy-toast'
import { View, Modal, StyleSheet, Text, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { COLORS, CS, ENUMS } from '../../common';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';


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
                    <Text style={{ marginTop: 24, marginBottom: 12, color: COLORS.WHITE }}>
                        {userAddress === item.senderAddress ? "You have transferred" : "You have received"}{" "}


                        <Text style={{ color: COLORS.SMALL_HEADING_TEXT, fontWeight: "bold" }}>{item?.amountToSend?.toLocaleString('en-IN')} US₿</Text></Text>
                    <Text style={{ marginBottom: 24, color: COLORS.WHITE }}>


                    {userAddress === item.senderAddress ? "To" : "From"}
                    </Text>




                    <View style={{ justifyContent: "center", backgroundColor: "#252549", borderRadius: 10, padding: 12, marginBottom: 24 }}>
                        <Text style={styles.addressText}>
                        {userAddress===item.senderAddress?item.receiverAddress:item.senderAddress}
                          




                          




                        </Text>
                    </View>
                    {
                        item.transactionNotes && <Text style={{ alignSelf: "flex-start", color: COLORS.SMALL_HEADING_TEXT, marginBottom: 4, padding: 4 }}>Notes: <Text style={{ color: COLORS.WHITE, fontWeight: "500" }}>{item.transactionNotes != "" ? item.transactionNotes : ""}</Text></Text>
                    }


                    <Text style={{ alignSelf: "flex-start", marginBottom: 24, color: COLORS.SMALL_HEADING_TEXT, padding: 4 }}>Date: <Text style={{ color: COLORS.WHITE }}>{moment(item.sendDate).format('MMMM D, YYYY')}</Text></Text>

                    {/* <Text style={{ alignSelf: "flex-start", color: "gray", marginBottom: 4 }}>Notes: <Text style={{ color: COLORS.APP_BLUE_COLOR, fontWeight: "500" }}>{props.item.transactionNotes}</Text></Text>
                    <Text style={{ alignSelf: "flex-start", marginBottom: 24, color: "gray" }}>Send Data: <Text style={{ color: COLORS.BLACK }}>{props.item.sendDate}</Text></Text> */}

                    <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 16 }}>
                        <TouchableOpacity
                            style={[styles.Button_Ok, { marginRight: 8,padding:12 }]}

                            onPress={() => onBlochainContinue(item.transactionHash)}
                        >

                            <Text style={styles.Text_style_ok}>View On Blockchain</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.Button_Ok, { backgroundColor: "gray", width: "40%" }]}
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
        padding: 32,



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
        backgroundColor: COLORS.BTN_BACKGROUND_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16
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