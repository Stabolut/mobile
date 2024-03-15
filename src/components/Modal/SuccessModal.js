import { Modal, Text, TouchableHighlight, View, StyleSheet } from 'react-native';
import { COLORS } from '../../common';

// export default function SuccessModal({ visible, onClose }) {
export default ({ visible, onClose }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}

        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.successText}>Transaction successfully.</Text>
                    <TouchableHighlight
                        style={styles.closeButton}
                        onPress={onClose}
                        underlayColor="#dddddd"
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableHighlight>
                    {/* <Text style={styles.closeButtonText}>Close</Text> */}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    successText: {
        fontSize: 16,
        fontFamily: "Poppins",
        marginBottom: 20,
        color: COLORS.HEADING_BLACK_COLOR,
    },
    closeButton: {
        backgroundColor: COLORS.APP_BLUE_COLOR,
        borderRadius: 5,
        padding: 10,
    },
    closeButtonText: {
        fontSize: 16,
        color: COLORS.WHITE,
    },
});



// import React from 'react';
// import { View, Text, Modal, StyleSheet,Button } from 'react-native';

// const SuccessModal = ({ visible, onClose }) => {
//     return (
//         <Modal visible={visible} animationType="slide" transparent={false}>
//             <View style={styles.modalContainer}>
//                 <Text style={styles.modalText}>This is a fancy modal!</Text>
//                 <Button title="Close" onPress={onClose} />
//             </View>
//         </Modal>
//     );
// };

// const styles = StyleSheet.create({
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'pink',
//     },
//     modalText: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: 'white',
//     },
// });

// export default SuccessModal;