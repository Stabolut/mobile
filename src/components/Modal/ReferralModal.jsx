import React from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity, Share } from 'react-native';
import { COLORS } from '../../common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';
export default function ReferralModal({ visible, onClose, theme, selectedTheme }) {

    let referralCode = useSelector((state) => state.authReducer.referral)


    let copyToClipBoard = (text) => {
        Clipboard.setString(text);
        alert(`The referral code has been successfully copied to the clipboard.`);
    };

    const shareContent = (text) => {
        Share.share({
            message: `Join me on [USB Wallet]! Create your wallet with my referral code ${text} and let's both earn rewards! 🎉`
        });
    };




    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { backgroundColor: theme?.BALANCE_CARD_BACKGROUND }]}>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => onClose()}
                    >
                        <FontAwesome size={30} color={theme?.WHITE} name="close"></FontAwesome>
                    </TouchableOpacity>
                    <View style={{ padding: 16 }}>
                        <View style={{ marginTop: 12, backgroundColor: theme?.BACKGROUND_COLOR, flexDirection: "row", padding: 16, borderRadius: 8, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ flex: 1, fontFamily: "Poppins", color: theme?.SMALL_HEADING_TEXT }} >Referral ID</Text>
                            <Text style={{ color: theme?.WHITE, fontFamily: "Poppins", marginRight: 4 }}>{referralCode?.referralCode}</Text>
                            <Ionicons onPress={() => copyToClipBoard(referralCode.referralCode)} color={theme?.WHITE} size={15} name="copy"></Ionicons>
                        </View>

                        {/* <View style={{ marginTop: 12, backgroundColor: theme?.BACKGROUND_COLOR, flexDirection: "row", padding: 16, borderRadius: 8, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ flex: 35, fontFamily: "Poppins", color: theme?.SMALL_HEADING_TEXT }}>Referral Link</Text>
                            <View style={{ flexDirection: "row", flex: 65 }}>
                                <Text style={{ color: theme?.WHITE, fontFamily: "Poppins" }}>http://stabolut/stabolut/usb/wallet/Hz6AJZQx <Ionicons onPress={() => copyToClipBoard("jhcxzxdghy")} size={15} name="copy"></Ionicons></Text>
                            </View>
                        </View> */}
                    </View>

                    <View style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 16 }}>
                        <TouchableOpacity onPress={() => shareContent(referralCode.referralCode)}

                            style={styles.btnStyleSend}>
                            <Ionicons color={COLORS?.WHITE} size={20} name="share" />
                            <Text style={styles.textStyleSend}>Share</Text>

                        </TouchableOpacity>

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
    btnStyleSend: {
        height: 45,
        width: '100%',
        backgroundColor: COLORS.BTN_BACKGROUND_COLOR,
        color: COLORS.WHITE,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        flexDirection: "row"
    },

    textStyleSend: {
        color: COLORS.WHITE,
        fontSize: 18,
        fontFamily: "Poppins",
        marginTop: 3,
        marginLeft: 4
    },
});
