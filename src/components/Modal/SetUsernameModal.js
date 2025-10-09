import React, { useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { 
    View, 
    Modal, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    TextInput, 
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { COLORS, Str, THEME } from '../../common';
import ErrorMessage from '../ErrorComponent/ErrroMessage';
import { checkInternetConnectivity, errorMessageHandler } from '../../utils/utils';
import { ErrorMessages } from '../../messages/errorMessage';
import axios from 'axios';

export default function SetUsernameModal({ 
    onClose, 
    visible, 
    username, 
    initialUsername, 
    selectedTheme, 
    onChangeValue, 
    onUpdateUsername 
}) {
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [disable, setDisable] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const theme = THEME[selectedTheme];

    const submitUsername = async () => {
        let isConnected = await checkInternetConnectivity()
        if (!isConnected) {
            alert(ErrorMessages.GENERIC.NO_INTERNET_ERROR)
            return
        }

        if (username === '' || username === null || username === undefined) {
            setIsError(true);
            setMessage('Please ensure that the username field is filled in.');
            return;
        }

        if (username === initialUsername) {
            setIsError(true);
            setMessage("Please ensure that the username is different from the current one.");
            return;
        }

        try {
            setIsLoading(true)
            setIsError(false)
            setDisable(true)
            let address = await AsyncStorage.getItem('address');
            await axios.post(`${Str.apiUrl}/user/assign-username-to-wallet`, {
                accountID: address,
                username
            });
            setIsLoading(false)
            setDisable(false)
            onUpdateUsername(username)
            alert("You successfully setup the username.")
        }
        catch (e) {
            let msg = errorMessageHandler(e)
            setIsLoading(false)
            setIsError(true)
            setDisable(false)
            setMessage(msg);
            return;
        }
    }

    const handleClose = () => {
        setIsError(false)
        setDisable(false)
        setIsLoading(false)
        setIsFocused(false)
        onClose()
    }

    return (
        <Modal 
            animationType="fade"
            transparent={true}
            visible={visible}
            statusBarTranslucent={true}
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView 
                    style={styles.overlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <TouchableWithoutFeedback>
                        <View style={[styles.modalContainer, { backgroundColor: theme?.BALANCE_CARD_BACKGROUND }]}>
                            {/* Header */}
                            <View style={styles.header}>
                                <Text style={[styles.title, { color: theme?.WHITE }]}>
                                    Set Username
                                </Text>
                                <Text style={[styles.subtitle, { color: theme?.SMALL_HEADING_TEXT }]}>
                                    Choose a unique username for your wallet
                                </Text>
                            </View>

                            {/* Input Section */}
                            <View style={styles.inputSection}>
                                <Text style={[styles.label, { color: theme?.SMALL_HEADING_TEXT }]}>
                                    Username
                                </Text>
                                <View style={[
                                    styles.inputContainer, 
                                    { 
                                        borderColor: isFocused ? theme?.BTN_BACKGROUND_COLOR : theme?.SLIDER_BORDER_COLOR,
                                        backgroundColor: theme?.TRANSACTION_DETAIL_ADDRESS_BACKGROUND
                                    }
                                ]}>
                                    <TextInput
                                        style={[styles.textInput, { color: theme?.WHITE }]}
                                        value={username}
                                        onChangeText={onChangeValue}
                                        placeholderTextColor={theme?.SMALL_HEADING_TEXT}
                                        placeholder="Enter your username"
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        returnKeyType="done"
                                        onSubmitEditing={submitUsername}
                                        editable={!disable}
                                    />
                                </View>
                                
                                {/* Character count indicator */}
                                <Text style={[styles.characterCount, { color: theme?.TIMESTAMP_COLOR }]}>
                                    {username?.length || 0}/20 characters
                                </Text>
                            </View>

                            {/* Error Message */}
                            {isError && (
                                <View style={styles.errorContainer}>
                                    <ErrorMessage message={message} />
                                </View>
                            )}

                            {/* Action Buttons */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    disabled={disable}
                                    style={[
                                        styles.primaryButton, 
                                        { 
                                            backgroundColor: theme?.BTN_BACKGROUND_COLOR,
                                            opacity: disable ? 0.6 : 1
                                        }
                                    ]}
                                    onPress={submitUsername}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator size="small" color={theme?.WHITE} />
                                    ) : (
                                        <Text style={[styles.primaryButtonText, { color: theme?.WHITE }]}>
                                            Set Username
                                        </Text>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    disabled={disable}
                                    style={[
                                        styles.secondaryButton,
                                        { 
                                            borderColor: theme?.SLIDER_BORDER_COLOR,
                                            opacity: disable ? 0.6 : 1
                                        }
                                    ]}
                                    onPress={handleClose}
                                >
                                    <Text style={[styles.secondaryButtonText, { color: theme?.SMALL_HEADING_TEXT }]}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 16,
    },
    header: {
        marginBottom: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        fontFamily: 'Poppins-Bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '400',
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
        lineHeight: 20,
    },
    inputSection: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 8,
    },
    inputContainer: {
        borderWidth: 2,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        minHeight: 52,
        justifyContent: 'center',
    },
    textInput: {
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Poppins-Medium',
        padding: 0,
        margin: 0,
    },
    characterCount: {
        fontSize: 12,
        fontWeight: '400',
        fontFamily: 'Poppins-Regular',
        marginTop: 6,
        textAlign: 'right',
    },
    errorContainer: {
        marginBottom: 16,
    },
    buttonContainer: {
        gap: 12,
    },
    primaryButton: {
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    secondaryButton: {
        height: 52,
        borderRadius: 12,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
});