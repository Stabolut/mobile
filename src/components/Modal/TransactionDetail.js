import React, { useState } from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import { COLORS } from '../../common';
import Clipboard from '@react-native-clipboard/clipboard';
import DropDownHolder from '../dropDownHolder';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function TransactionDetail({ item, showDetailModal, onClose, onBlochainContinue, userAddress, theme }) {
    
    const [notesExpanded, setNotesExpanded] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    
    const copyToClipboard = () => {
        try {
            let addressToCopy = userAddress === item.senderAddress ? item.receiverAddress : item.senderAddress;
            Clipboard.setString(addressToCopy);
            setIsCopied(true);
            
            // Reset copied state after 2 seconds
            setTimeout(() => setIsCopied(false), 2000);
        } catch (e) {
            DropDownHolder.alert('error', 'Error', 'Failed to copy address.');
        }
    };

    const isStaking = item.transactionType === "Staking";
    const isReceived = userAddress !== item.senderAddress;
    
    // Check if notes are long (more than 100 characters as threshold)
    const isNotesLong = item.transactionNotes && item.transactionNotes.length > 100;

    return (
        <Modal 
            animationType="slide"
            transparent={true}
            visible={showDetailModal}
            statusBarTranslucent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable style={styles.overlay} onPress={onClose} />
                <View style={[styles.modalWrapper, { backgroundColor: theme?.DETAIL_CARD_BACKGROUND }]}>
                    
                    {/* Close Button */}
                    <TouchableOpacity 
                        style={styles.closeBtn}
                        onPress={onClose}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="close-circle" size={28} color={theme?.WHITE} style={{ opacity: 0.6 }} />
                    </TouchableOpacity>

                    {/* Scrollable Content */}
                    <ScrollView 
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        {/* Success Icon with Glow */}
                        <View style={styles.iconSection}>
                            <View style={styles.iconGlow}>
                                <View style={styles.successIcon}>
                                    <FontAwesomeIcon name="check" size={40} color={COLORS.WHITE} />
                                </View>
                            </View>
                        </View>

                        {/* Transaction Status */}
                        <Text style={[styles.statusLabel, { color: theme?.SMALL_HEADING_TEXT }]}>
                            {isStaking ? "STAKE WITHDRAWN" : isReceived ? "RECEIVED" : "SENT SUCCESSFULLY"}
                        </Text>

                        {/* Amount Display */}
                        <View style={styles.amountSection}>
                            <Text style={[styles.amountValue, { color: theme?.WHITE }]}>
                                {item?.amountToSend?.toLocaleString('en-IN')}
                            </Text>
                            <Text style={[styles.currencyLabel, { color: theme?.SMALL_HEADING_TEXT }]}>US₿</Text>
                        </View>

                        {/* Decorative Line */}
                        <View style={styles.dividerLine}>
                            <View style={[styles.dividerDot, { backgroundColor: theme?.SMALL_HEADING_TEXT }]} />
                            <View style={[styles.dividerBar, { backgroundColor: theme?.SMALL_HEADING_TEXT }]} />
                            <View style={[styles.dividerDot, { backgroundColor: theme?.SMALL_HEADING_TEXT }]} />
                        </View>

                        {/* Transaction Details Card */}
                        <View style={styles.detailsCard}>
                            
                            {/* Date Info */}
                            <View style={styles.infoItem}>
                                <View style={styles.infoIconBox}>
                                    <Ionicons name="calendar" size={18} color={theme?.SMALL_HEADING_TEXT} />
                                </View>
                                <View style={styles.infoContent}>
                                    <Text style={[styles.infoTitle, { color: theme?.SMALL_HEADING_TEXT }]}>Date & Time</Text>
                                    <Text style={[styles.infoText, { color: theme?.WHITE }]}>
                                        {moment(item.sendDate).format('MMM DD, YYYY • hh:mm A')}
                                    </Text>
                                </View>
                            </View>

                            {/* Address Info */}
                            {!isStaking && (
                                <View style={styles.infoItem}>
                                    <View style={styles.infoIconBox}>
                                        <MaterialCommunityIcons 
                                            name={isReceived ? "arrow-down-circle" : "arrow-up-circle"} 
                                            size={18} 
                                            color={theme?.SMALL_HEADING_TEXT} 
                                        />
                                    </View>
                                    <View style={styles.infoContent}>
                                        <Text style={[styles.infoTitle, { color: theme?.SMALL_HEADING_TEXT }]}>
                                            {isReceived ? "From Address" : "To Address"}
                                        </Text>
                                        <View style={[
                                            styles.addressRow,
                                            { borderColor: isCopied ? COLORS.GREEN_SUCCESS : 'transparent' }
                                        ]}>
                                            <Text 
                                                style={[styles.addressText, { color: theme?.WHITE }]} 
                                                numberOfLines={1}
                                                ellipsizeMode="middle"
                                            >
                                                {isReceived ? item?.senderAddress : item?.receiverAddress}
                                            </Text>
                                            <TouchableOpacity
                                                onPress={copyToClipboard}
                                                style={[
                                                    styles.copyBtn,
                                                    { backgroundColor: isCopied ? COLORS.GREEN_SUCCESS : 'transparent' }
                                                ]}
                                                activeOpacity={0.7}
                                            >
                                                <Ionicons 
                                                    size={16} 
                                                    color={isCopied ? COLORS.WHITE : COLORS.BTN_BACKGROUND_COLOR} 
                                                    name={isCopied ? "checkmark" : "copy"} 
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        
                                        {isCopied && (
                                            <Text style={[styles.copiedText, { color: COLORS.GREEN_SUCCESS }]}>
                                                ✓ Address copied!
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            )}

                            {/* Notes Info with See More/Less */}
                            {item.transactionNotes && (
                                <View style={[styles.infoItem, { marginBottom: 0 }]}>
                                    <View style={styles.infoIconBox}>
                                        <Ionicons name="document-text" size={18} color={theme?.SMALL_HEADING_TEXT} />
                                    </View>
                                    <View style={styles.infoContent}>
                                        <Text style={[styles.infoTitle, { color: theme?.SMALL_HEADING_TEXT }]}>Notes</Text>
                                        <Text 
                                            style={[styles.infoText, { color: theme?.WHITE }]}
                                            numberOfLines={notesExpanded ? undefined : 3}
                                        >
                                            {item.transactionNotes}
                                        </Text>
                                        
                                        {/* See More / See Less Button */}
                                        {isNotesLong && (
                                            <TouchableOpacity
                                                onPress={() => setNotesExpanded(!notesExpanded)}
                                                style={styles.seeMoreBtn}
                                                activeOpacity={0.7}
                                            >
                                                <Text style={[styles.seeMoreText, { color: COLORS.BTN_BACKGROUND_COLOR }]}>
                                                    {notesExpanded ? "See Less" : "See More"}
                                                </Text>
                                                <Ionicons 
                                                    name={notesExpanded ? "chevron-up" : "chevron-down"} 
                                                    size={16} 
                                                    color={COLORS.BTN_BACKGROUND_COLOR} 
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            )}
                        </View>
                    </ScrollView>

                    {/* Action Buttons - Fixed at Bottom */}
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={[styles.btnPrimary, { backgroundColor: COLORS.BTN_BACKGROUND_COLOR }]}
                            onPress={() => onBlochainContinue(item.transactionHash)}
                            activeOpacity={0.85}
                        >
                            <Ionicons name="globe-outline" size={20} color={COLORS.WHITE} />
                            <Text style={styles.btnPrimaryText}>View on Blockchain</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.btnSecondary, { borderColor: theme?.SMALL_HEADING_TEXT }]}
                            onPress={onClose}
                            activeOpacity={0.85}
                        >
                            <Text style={[styles.btnSecondaryText, { color: theme?.WHITE }]}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
    modalWrapper: {
        margin: 24,
        width: "92%",
        maxWidth: 440,
        maxHeight: '85%',
        borderRadius: 28,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 15,
    },
    scrollView: {
        flexGrow: 0,
        flexShrink: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 16,
    },
    closeBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
    },
    iconSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    iconGlow: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    successIcon: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#22C55E',
        justifyContent: "center",
        alignItems: "center",
    },
    statusLabel: {
        fontSize: 13,
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center',
        letterSpacing: 1.5,
        marginBottom: 12,
        opacity: 0.7,
    },
    amountSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginBottom: 28,
    },
    amountValue: {
        fontSize: 42,
        fontFamily: 'Poppins-Bold',
        marginRight: 8,
    },
    currencyLabel: {
        fontSize: 28,
        fontFamily: 'Poppins-SemiBold',
        opacity: 0.8,
    },
    dividerLine: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        paddingHorizontal: 40,
    },
    dividerDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        opacity: 0.3,
    },
    dividerBar: {
        flex: 1,
        height: 1,
        marginHorizontal: 12,
        opacity: 0.2,
    },
    detailsCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    infoItem: {
        flexDirection: 'row',
        marginBottom: 18,
        alignItems: 'flex-start',
    },
    infoIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    infoContent: {
        flex: 1,
        paddingTop: 2,
    },
    infoTitle: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        marginBottom: 4,
        opacity: 0.6,
    },
    infoText: {
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
        lineHeight: 22,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    addressText: {
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        flex: 1,
        marginRight: 8,
    },
    copyBtn: {
        padding: 4,
        borderRadius: 8,
    },
    copiedText: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        marginTop: 8,
        textAlign: 'center',
    },
    seeMoreBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingVertical: 4,
    },
    seeMoreText: {
        fontSize: 13,
        fontFamily: 'Poppins-SemiBold',
        marginRight: 4,
    },
    actionsContainer: {
        paddingHorizontal: 24,
        paddingVertical: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    btnPrimary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        paddingVertical: 16,
        gap: 8,
        shadowColor: COLORS.BTN_BACKGROUND_COLOR,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    btnPrimaryText: {
        fontFamily: "Poppins-SemiBold",
        fontSize: 16,
        color: COLORS.WHITE,
    },
    btnSecondary: {
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    btnSecondaryText: {
        fontFamily: "Poppins-Medium",
        fontSize: 16,
    },
});