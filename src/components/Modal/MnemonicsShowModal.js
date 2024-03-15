import React, { useRef } from 'react';
import Toast from 'react-native-easy-toast'
import { View, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Clipboard from "@react-native-community/clipboard";
export default function LoadingModal(props) {
    const toastRef = useRef(null);

    const copyToClipBoard = () => {
        Clipboard.setString(props.privateKey);
        toastRef.current.show('The private key has been successfully copied to the clipboard!', 3000);
    }

    return (
        <Modal animationType="fade"
            transparent={true}
            visible={props.visible}
            statusBarTranslucent={true}>

            <View style={styles.centeredView}>
                <Toast ref={toastRef} position="bottom" />

                <View style={styles.modalView}>
                    <Text style={[styles._Modal_inner_text1, { color: COLORS.WHITE }]}> {props.privateKey} <Ionicons style={{ marginTop: 800 }} onPress={copyToClipBoard} size={25} name="copy"></Ionicons></Text>
                    <View style={{ flexDirection: 'row', width: "100%", justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>


                        <TouchableOpacity
                            style={[styles.Button_Ok]}
                            onPress={props.onClose}
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

        width: "90%",
        padding: 24,



        backgroundColor: COLORS.BALANCE_CARD_BACKGROUND,
        borderRadius: 20,
        flexDirection: 'column',
        justifyContent: 'center',
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
    _Modal_inner_text1: {

        fontFamily: "Poppins",
        fontWeight: '500',
        textDecorationLine: "none",
        fontSize: 16,
        lineHeight: 30,
        letterSpacing: 0.1,
    },

    modalText: {

        textAlign: "center",
        color: COLORS.WHITE,
        fontSize: 17
    },
    Button_Ok: {
        width: 290,
        height: 50,
        borderRadius: 10,
        opacity: 1,
        backgroundColor: COLORS.BTN_BACKGROUND_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    Text_style_ok: {
        fontFamily: "Poppins",
        fontWeight: '500',
        textDecorationLine: "none",
        fontSize: 16,
        color: COLORS.WHITE,

        letterSpacing: 0.1,
    }
});