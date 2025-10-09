import React, { useRef, useState } from 'react';
import Toast from 'react-native-easy-toast';
import { 
    View, 
    Modal, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    Dimensions, 
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { COLORS, THEME } from '../../common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function MnemonicsShowModal(props) {
    const toastRef = useRef(null);
    const theme = THEME[props.selectedTheme];
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipBoard = async () => {
        try {
            await Clipboard.setString(props.privateKey);
            setIsCopied(true);
            toastRef.current.show('Private key copied to clipboard!', 2000);
            
            // Reset copied state after 3 seconds
            setTimeout(() => setIsCopied(false), 3000);
        } catch (e) {
            Alert.alert('Error', 'Failed to copy to clipboard');
        }
    };

    const handleBackdropPress = () => {
        if (props.onClose) {
            props.onClose();
        }
    };

    return (
        <Modal 
            animationType="fade"
            transparent={true}
            visible={props.visible}
            statusBarTranslucent={true}
            onRequestClose={props.onClose}
        >
            <KeyboardAvoidingView 
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableOpacity 
                    style={styles.backdrop} 
                    activeOpacity={1} 
                    onPress={handleBackdropPress}
                >
                    <View style={styles.centeredView}>
                        <TouchableOpacity 
                            activeOpacity={1} 
                            onPress={(e) => e.stopPropagation()}
                        >
                            <View style={[
                                styles.modalView, 
                                { 
                                    backgroundColor: theme?.BALANCE_CARD_BACKGROUND,
                                    maxHeight: screenHeight * 0.7, // Responsive max height
                                }
                            ]}>
                                {/* Header with Icon */}
                                <View style={styles.header}>
                                    <View style={styles.headerLeft}>
                                        <View style={[styles.iconContainer, { backgroundColor: theme?.BTN_BACKGROUND_COLOR }]}>
                                            <Ionicons name="key" size={20} color={COLORS.WHITE} />
                                        </View>
                                        <Text style={[styles.title, { color: theme?.WHITE,textAlign:"center" }]}>
                                            Private Key
                                        </Text>
                                    </View>
                                    <TouchableOpacity 
                                        onPress={copyToClipBoard}
                                        style={[styles.copyButton, { backgroundColor: isCopied ? COLORS.GREEN_SUCCESS : 'rgba(255, 255, 255, 0.1)' }]}
                                        accessibilityLabel="Copy private key"
                                        accessibilityRole="button"
                                    >
                                        <Ionicons 
                                            name={isCopied ? "checkmark" : "copy"} 
                                            size={18} 
                                            color={COLORS.WHITE}
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Private Key Content */}
                                <ScrollView 
                                    style={styles.contentContainer}
                                    showsVerticalScrollIndicator={false}
                                    bounces={false}
                                    nestedScrollEnabled={true}
                                    contentContainerStyle={styles.scrollContent}
                                >
                                    <View style={[styles.privateKeyContainer, { 
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        borderColor: 'rgba(255, 255, 255, 0.3)'
                                    }]}>
                                        {/* <View style={styles.privateKeyHeader}>
                                            <View style={styles.iconWrapper}>
                                                <View style={styles.securityBadge}>
                                                    <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
                                                </View>
                                            </View>
                                            <Text style={styles.privateKeyLabel}>Private Key</Text>
                                        </View> */}
                                        <Text 
                                            style={{
                                                fontFamily: 'Poppins',
                                                fontWeight: '400',
                                                fontSize: 15,
                                                lineHeight: 24,
                                                letterSpacing: 0.8,
                                                textAlign: 'left',
                                                color: '#FFFFFF',
                                                backgroundColor: 'transparent',
                                                marginTop: 8,
                                            }}
                                            selectable={true}
                                            accessibilityLabel="Private key"
                                        >
                                            {props.privateKey}
                                        </Text>
                                    </View>
                                    
                                    {/* Security Warning */}
                                    <View style={[styles.warningContainer, { backgroundColor: 'rgba(255, 193, 7, 0.1)' }]}>
                                        <Ionicons name="warning" size={16} color="#FFC107" />
                                        <Text style={{
                                            fontFamily: 'Poppins',
                                            fontWeight: '400',
                                            fontSize: 13,
                                            lineHeight: 18,
                                            marginLeft: 12,
                                            flex: 1,
                                            color: '#FFC107',
                                        }}>
                                            Keep your private key secure and never share it with anyone
                                        </Text>
                                    </View>
                                </ScrollView>

                                {/* Action Buttons */}
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={[styles.closeButton, { backgroundColor: theme?.BTN_BACKGROUND_COLOR }]}
                                        onPress={props.onClose}
                                        accessibilityLabel="Close modal"
                                        accessibilityRole="button"
                                    >
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                
                <Toast ref={toastRef} position="bottom" />
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    modalView: {
        width: '100%',
        maxWidth: screenWidth * 0.9, // Responsive width
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    title: {
        fontFamily: 'Poppins',
        fontWeight: '600',
        fontSize: 20,
        letterSpacing: 0.5,
    },
    copyButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    contentContainer: {
        paddingHorizontal: 24,
        paddingBottom: 16,
        flexGrow: 1, // This is important for ScrollView
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 16,
    },
    privateKeyContainer: {
        borderRadius: 16,
        padding: 20,
        marginVertical: 16,
        borderWidth: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        minHeight: 80,
    },
    privateKeyText: {
        fontFamily: 'Poppins',
        fontWeight: '400',
        fontSize: 15,
        lineHeight: 24,
        letterSpacing: 0.8,
        textAlign: 'left',
        color: '#FFFFFF', // Force white color
        backgroundColor: 'transparent', // Ensure no background interference
    },
    warningContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 193, 7, 0.3)',
    },
    warningText: {
        fontFamily: 'Poppins',
        fontWeight: '400',
        fontSize: 13,
        lineHeight: 18,
        marginLeft: 12,
        flex: 1,
        color: '#FFC107', // Force warning color
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 8,
    },
    closeButton: {
        width: '100%',
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    closeButtonText: {
        fontFamily: 'Poppins',
        fontWeight: '600',
        fontSize: 16,
        color: COLORS.WHITE,
        letterSpacing: 0.5,
    },
    privateKeyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    privateKeyLabel: {
        fontFamily: 'Poppins',
        fontWeight: '600',
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        letterSpacing: 0.5,
    },
    securityBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4CAF50',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
});