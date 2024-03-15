import React, { useEffect, useRef, useState } from 'react';
import Toast from 'react-native-easy-toast'
import { View, Modal, StyleSheet, Text, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { COLORS, CS } from '../../common';

export default function Notes({navigation,onClose,onContinue,visible,transactionNotes}) {
    const toastRef = useRef(null);
    const [notes, setNotes] = useState("")
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");

    submitNotes = () => {
        // if (notes === '' || notes === null || notes === undefined) {
        //     setIsError(true);
        //     setMessage('This notes  field is required!');
        //     return;
        // }

        // else {
            setIsError(false);
            setMessage("");
            setNotes("")
            onContinue(notes)
       // }

    }


    useEffect(() => {

setNotes(transactionNotes)

       

       
    }, [visible])

    return (
        <Modal animationType="fade"
            transparent={true}
            visible={visible}
            statusBarTranslucent={true}>

            <View style={styles.centeredView}>
                <Toast ref={toastRef} position="bottom" />

                <View style={styles.modalView}>

                    <View style={{ flexDirection: 'column', width: "100%", marginBottom: 24 }}>


                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ flex: 1, fontWeight: "bold", color: COLORS.WHITE, fontSize: 16 }}>ADD NOTES</Text>
                            <TouchableOpacity onPress={() => {
                                setIsError(false)
                                setMessage("")
                                setNotes("")
                                onClose()
                            }} style={{}}><Text style={{
                                fontFamily: "Poppins",
                                fontWeight: 'bold',
                                textDecorationLine: "none",
                                fontSize: 16,
                                color: COLORS.SMALL_HEADING_TEXT,

                                letterSpacing: 0.1,
                            }}>CLOSE</Text></TouchableOpacity>
                        </View>





                        <View style={styles.container}>
                            <TextInput
                                value={notes}
                                placeholderTextColor={COLORS.WHITE}
                                style={{color:COLORS.WHITE}}
                                onChangeText={(value) => {
                                    setNotes(value)

                                }}
                                placeholder={"Add a transaction notes here"}

                                multiline={true}
                                numberOfLines={8}

                            />
                        </View>

                        {isError && (
                            <Text
                                style={[

                                    { color: COLORS.DARK_RED, marginTop: 8, marginLeft: 2 },
                                ]}>
                                {message}
                            </Text>)}




                        <TouchableOpacity
                            style={[styles.Button_Ok]}
                            onPress={submitNotes}
                        >

                            <Text style={styles.Text_style_ok}>Continue</Text>
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
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop:24,


        backgroundColor:COLORS.BALANCE_CARD_BACKGROUND,
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
        marginVertical: 15,
        textAlign: "center",
        color: COLORS.APP_HEADING_TEXT_COLOR_BALCK,
        fontSize: 17,
        marginLeft: 15,
    },
    Button_Ok: {
        width: '100%',
        height: 45,
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
        backgroundColor: COLORS.BALANCE_CARD_BACKGROUND,
        width: '100%',
        height: 150,
        marginTop: 16,

        borderColor:COLORS.SLIDER_BORDER_COLOR,
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,



    },
});