import React, { useState } from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity, Share, Image, Switch } from 'react-native';
import { COLORS, Images } from '../../common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';
import { store } from '../../store';
import { storeNetworkInfo } from '../../redux/action/wallet';
import { networkConfig } from '../../common/NetworkConfig';
import { clearRealmDB } from '../../utils/helperMethod';
export default function SwitchNetworkModal({ visible, onClose, theme, data, currentNetwork, switchNetworkCallback }) {


    const toggleSwitch = async (item) => {

        //store.dispatch(storeNetworkInfo(item))
        switchNetworkCallback(item)
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { backgroundColor: theme?.BACKGROUND_COLOR }]}>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => onClose()}
                    >
                        <FontAwesome size={30} color={theme?.WHITE} name="close"></FontAwesome>
                    </TouchableOpacity>
                    <View style={{ paddingHorizontal:16 }}>
                        {
                            Object.entries(data).map(([key, item]) => (
                                <View style={{ marginTop: 12, backgroundColor: currentNetwork.name === item.name ? theme?.BALANCE_CARD_BACKGROUND : theme?.BACKGROUND_COLOR, flexDirection: "row", padding: 16, borderRadius: 8, alignItems: "center" }}>
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                                        <Image style={styles.imageLogo} source={Images[item.icon]} />
                                        <Text style={{ fontFamily: "Poppins", color: theme?.SMALL_HEADING_TEXT, fontSize: 16, fontWeight: 'bold' }} >{item.name}</Text>
                                    </View>
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        <Switch
                                            value={currentNetwork.name === item.name}
                                            onValueChange={() => toggleSwitch(item)}
                                            thumbColor={currentNetwork.name === item.name ? "#4CAF50" : "#FF5722"}
                                            trackColor={{ false: "#FFCCBC", true: "#C8E6C9" }}
                                            disabled={currentNetwork.name === item.name}
                                        />
                                    </View>

                                </View>

                            ))
                        }
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({


    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        borderTopLeftRadius: 44,
        borderTopRightRadius: 44,
        width: '100%',
    },
    closeButton: {

        alignSelf: 'flex-end',
    },
    closeButtonText: {
        color: 'blue',
        fontSize: 16,
    },

    imageLogo: {
        width: 35,
        height: 35,
        marginRight: 12
    }

});
