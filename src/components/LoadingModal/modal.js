import React from 'react';
import { View, Modal, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { COLORS } from '../../common';

export default function LoadingModal(props) {

    return (
        <Modal animationType="fade"
            transparent={true}
            visible={props.modalVisible}
            statusBarTranslucent={true}>
                
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <ActivityIndicator size="large" color={COLORS.APP_BLUE_COLOR} />
                    {props.task ?
                        <Text style={styles.modalText}>{props.task}</Text>
                        :
                        <Text style={styles.modalText}>Loading.. {props.title}</Text>
                    }
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
        height: 200,
       
        backgroundColor: COLORS.WHITE,
        borderRadius: 5,
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

    modalText: {
        marginVertical: 15,
        textAlign: "center",
        color:COLORS.APP_HEADING_TEXT_COLOR_BALCK,
        fontSize: 17,
        marginLeft: 15,
    }
});