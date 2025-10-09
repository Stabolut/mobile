import React, { useState } from 'react';
import { 
    View, 
    Modal, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    Share, 
    Dimensions,
    Animated,
    Alert
} from 'react-native';
import { COLORS } from '../../common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ReferralModal({ visible, onClose, theme, selectedTheme }) {
    const [isCopied, setIsCopied] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    
    let referralCode = useSelector((state) => state.walletReducer.referral);

    React.useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const copyToClipBoard = async (text) => {
        try {
            await Clipboard.setString(text);
            setIsCopied(true);
            
            // Show success feedback
            Alert.alert(
                'Success!', 
                'Referral code copied to clipboard',
                [{ text: 'OK', style: 'default' }]
            );
            
            // Reset copied state after 2 seconds
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            Alert.alert('Error', 'Failed to copy to clipboard');
        }
    };

    const shareContent = (text) => {
        Share.share({
            message: `Join me on USB Wallet! Create your wallet with my referral code ${text} and let's both earn rewards! 🎉`,
            title: 'USB Wallet Referral'
        });
    };

    const handleBackdropPress = () => {
        onClose();
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
                <TouchableOpacity 
                    style={styles.backdrop} 
                    activeOpacity={1} 
                    onPress={handleBackdropPress}
                />
                
                <Animated.View 
                    style={[
                        styles.modalContent, 
                        { 
                            backgroundColor: theme?.BALANCE_CARD_BACKGROUND,
                            transform: [{
                                translateY: fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [screenHeight, 0]
                                })
                            }]
                        }
                    ]}
                >
                    {/* Header with drag indicator */}
                    <View style={styles.headerContainer}>
                        <View style={[styles.dragIndicator, { backgroundColor: theme?.SMALL_HEADING_TEXT }]} />
                        <Text style={[styles.modalTitle, { color: theme?.WHITE }]}>
                            Referral Program
                        </Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons 
                                name="close" 
                                size={24} 
                                color={theme?.SMALL_HEADING_TEXT} 
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View style={styles.contentContainer}>
                        {/* Referral Code Section */}
                        <View style={styles.referralSection}>
                            <View style={styles.sectionHeader}>
                                <Ionicons 
                                    name="gift" 
                                    size={20} 
                                    color={theme?.BALANCE_CARD_UPPER_BORDER} 
                                />
                                <Text style={[styles.sectionTitle, { color: theme?.WHITE }]}>
                                    Your Referral Code
                                </Text>
                            </View>
                            
                            <View style={[
                                styles.referralCodeContainer, 
                                { 
                                    backgroundColor: theme?.BACKGROUND_COLOR,
                                    borderColor: isCopied ? COLORS.GREEN_SUCCESS : theme?.SLIDER_BORDER_COLOR
                                }
                            ]}>
                                <View style={styles.referralCodeContent}>
                                    <Text style={[styles.referralCodeLabel, { color: theme?.SMALL_HEADING_TEXT }]}>
                                        Referral ID
                                    </Text>
                                    <Text style={[styles.referralCodeText, { color: theme?.WHITE }]}>
                                        {referralCode?.referralCode}
                                    </Text>
                                </View>
                                
                                <TouchableOpacity
                                    style={[
                                        styles.copyButton,
                                        { 
                                            backgroundColor: isCopied ? COLORS.GREEN_SUCCESS : theme?.BTN_BACKGROUND_COLOR 
                                        }
                                    ]}
                                    onPress={() => copyToClipBoard(referralCode?.referralCode)}
                                >
                                    <Ionicons 
                                        name={isCopied ? "checkmark" : "copy"} 
                                        size={18} 
                                        color={COLORS.WHITE} 
                                    />
                                </TouchableOpacity>
                            </View>
                            
                            {isCopied && (
                                <Text style={[styles.copiedText, { color: COLORS.GREEN_SUCCESS }]}>
                                    ✓ Copied to clipboard!
                                </Text>
                            )}
                        </View>

                        {/* Benefits Section */}
                        <View style={styles.benefitsSection}>
                            <Text style={[styles.benefitsTitle, { color: theme?.WHITE }]}>
                                Referral Benefits
                            </Text>
                            <View style={styles.benefitsList}>
                                <View style={styles.benefitItem}>
                                    <Ionicons name="star" size={16} color={theme?.BALANCE_CARD_UPPER_BORDER} />
                                    <Text style={[styles.benefitText, { color: theme?.SMALL_HEADING_TEXT }]}>
                                        Earn rewards when friends join
                                    </Text>
                                </View>
                                <View style={styles.benefitItem}>
                                    <Ionicons name="people" size={16} color={theme?.BALANCE_CARD_UPPER_BORDER} />
                                    <Text style={[styles.benefitText, { color: theme?.SMALL_HEADING_TEXT }]}>
                                        Help friends discover USB Wallet
                                    </Text>
                                </View>
                                <View style={styles.benefitItem}>
                                    <Ionicons name="trophy" size={16} color={theme?.BALANCE_CARD_UPPER_BORDER} />
                                    <Text style={[styles.benefitText, { color: theme?.SMALL_HEADING_TEXT }]}>
                                        Build your referral network
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionContainer}>
                        <TouchableOpacity 
                            style={[styles.shareButton, { backgroundColor: theme?.BTN_BACKGROUND_COLOR }]}
                            onPress={() => shareContent(referralCode?.referralCode)}
                        >
                            <Ionicons name="share-social" size={20} color={COLORS.WHITE} />
                            <Text style={styles.shareButtonText}>Share Referral</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    backdrop: {
        flex: 1,
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: screenHeight * 0.8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 16,
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 8,
        alignItems: 'center',
        position: 'relative',
    },
    dragIndicator: {
        width: 40,
        height: 4,
        borderRadius: 2,
        marginBottom: 16,
        opacity: 0.6,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 8,
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        right: 20,
        padding: 4,
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    referralSection: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 8,
    },
    referralCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1.5,
        marginBottom: 8,
    },
    referralCodeContent: {
        flex: 1,
    },
    referralCodeLabel: {
        fontSize: 12,
        fontFamily: 'Poppins',
        marginBottom: 4,
        opacity: 0.8,
    },
    referralCodeText: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        letterSpacing: 1,
    },
    copyButton: {
        padding: 10,
        borderRadius: 8,
        marginLeft: 12,
    },
    copiedText: {
        fontSize: 12,
        fontFamily: 'Poppins',
        textAlign: 'center',
        marginTop: 4,
    },
    benefitsSection: {
        marginBottom: 20,
    },
    benefitsTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 12,
    },
    benefitsList: {
        gap: 8,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    benefitText: {
        fontSize: 14,
        fontFamily: 'Poppins',
        marginLeft: 12,
        flex: 1,
    },
    actionContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 8,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    shareButtonText: {
        color: COLORS.WHITE,
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 8,
    },
});
