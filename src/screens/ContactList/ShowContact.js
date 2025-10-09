import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList, Alert, Animated } from 'react-native';
import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';
import Header from '../../components/Header/Header';
import { COLORS, ENUMS, THEME, Str } from '../../common';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import TransactionLoader from '../Dashboard/TransactionLoader';
import { useSelector } from 'react-redux';
import { connect } from 'react-redux';
import axios from 'axios';
import { store } from '../../store';
import { ErrorMessages } from '../../messages/errorMessage';
import { checkInternetConnectivity, errorMessageHandler } from '../../utils/utils';

const ShowContact = ({ navigation, contactList }) => {
    const [contact, setContact] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchText, setSearchText] = useState('');

    let selectedTheme = useSelector((state) => state.walletReducer.theme)
    const theme = THEME[selectedTheme];

    const handleSearch = () => {
        if (searchText.trim() === '') {
            setContact(contactList);
        } else {
            const filteredContacts = contactList.filter(
                (contact) =>
                    contact.name.toLowerCase().includes(searchText.toLowerCase())
            );
            setContact(filteredContacts);
        }
    };

    const handleSearchCompleteSearch = () => {
        if (searchText.trim() === '') {
            setContact(contactList);
        } else {
            const filteredContacts = contactList.filter(
                (contact) =>
                    contact.name.toLowerCase() === (searchText.toLowerCase())
            );
            setContact(filteredContacts);
        }
    };

    useEffect(() => {
        handleSearch()
    }, [searchText])

    useEffect(() => {
        getContact()
    }, [])

    useEffect(() => {
        setContact(contactList)
    }, [contactList])

    let getContact = async () => {
        let isConnected = await checkInternetConnectivity()

        if (!isConnected) {
            alert(ErrorMessages.GENERIC.NO_INTERNET_ERROR)
            return
        }

        let address = await AsyncStorage.getItem('address');

        try {
            setIsLoading(true)
            let { data } = await axios.post(`${Str.apiUrl}/user/get-contact-list`, {
                account: address
            });
            setIsLoading(false)
            store.dispatch({ type: "GET_CONTACT", payload: data.data })
        }
        catch (e) {
            setIsLoading(false)
            let msg = errorMessageHandler(e)
            Alert.alert(msg)
            return;
        }
    }

    // Get initials from name
    const getInitials = (name) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Generate color from name
    const getAvatarColor = (name) => {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7B731', '#5F27CD', '#00D2D3', '#FF9FF3', '#54A0FF'];
        const index = name ? name.charCodeAt(0) % colors.length : 0;
        return colors[index];
    };

    const ListItem = ({ item }) => {
        return (
            <TouchableOpacity 
                onPress={() => {
                    navigation.navigate(`${ENUMS.SCREENS.TRANSFER}`, { receipent: item.receiver_account })
                }} 
                style={[styles.contactCard, { 
                    backgroundColor: theme?.BALANCE_CARD_BACKGROUND || '#26284e',
                }]}
                activeOpacity={0.7}
            >
                <View style={[styles.avatarContainer, { backgroundColor: getAvatarColor(item.name) }]}>
                    <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
                </View>
                
                <View style={styles.contactInfo}>
                    <Text style={[styles.contactName, { color: theme?.WHITE || '#FFFFFF' }]}>
                        {item.name}
                    </Text>
                    <Text style={styles.contactAddress} numberOfLines={1} ellipsizeMode="middle">
                        {item.receiver_account}
                    </Text>
                </View>

                <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color="#888"
                />
            </TouchableOpacity>
        );
    };

    const EmptyState = () => (
        <View style={styles.emptyStateContainer}>
            <View style={styles.emptyIconContainer}>
                <FontAwesome
                    name="address-book-o"
                    size={64}
                    color={selectedTheme === ENUMS.THEME.DARK ? '#444' : '#DDD'}
                />
            </View>
            <Text style={[styles.emptyTitle, { color: theme?.WHITE }]}>
                {searchText ? 'No contacts found' : 'No contacts yet'}
            </Text>
            <Text style={[styles.emptySubtitle, { color: selectedTheme === ENUMS.THEME.DARK ? '#888' : '#999' }]}>
                {searchText 
                    ? 'Try adjusting your search' 
                    : 'Add your first contact to get started'}
            </Text>
        </View>
    );

    return (
        <React.Fragment>
            <StatusBarNU backgroundColor={theme?.BACKGROUND_COLOR} />
            <Header
                backButton={true}
                headerText="Contacts"
                theme={theme}
                navigation={navigation}
            />

            <View style={[styles.mainContainer, { backgroundColor: theme?.BACKGROUND_COLOR }]}>
                {/* Search Bar */}
                <View style={[styles.searchContainer, {
                    backgroundColor: theme?.BALANCE_CARD_BACKGROUND || '#26284e',
                }]}>
                    <EvilIcons
                        name="search"
                        size={26}
                        color="#888"
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={[styles.searchInput, { 
                            color: theme?.WHITE || '#FFFFFF',
                            opacity:0.8
                        }]}
                        placeholder="Search contacts..."
                        placeholderTextColor="#ccc"
                        
                        value={searchText}
                        onChangeText={(text) => {
                            setSearchText(text);
                            handleSearch(text);
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchText('')}>
                            <MaterialIcons
                                name="close"
                                size={22}
                                color="#888"
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Contact Count */}
                {contact.length > 0 && !isLoading && (
                    <View style={styles.contactCountContainer}>
                        <Text style={[styles.contactCount, { color: selectedTheme === ENUMS.THEME.DARK ? '#888' : '#666' }]}>
                            {contact.length} {contact.length === 1 ? 'contact' : 'contacts'}
                        </Text>
                    </View>
                )}

                {/* Contact List or Loading */}
                <View style={styles.listContainer}>
                    {isLoading ? (
                        <View style={styles.loaderContainer}>
                            <TransactionLoader />
                        </View>
                    ) : (
                        <FlatList
                            data={contact}
                            renderItem={({ item }) => <ListItem item={item} />}
                            keyExtractor={(item, index) => item.receiverAccount || index.toString()}
                            ListEmptyComponent={<EmptyState />}
                            contentContainerStyle={contact.length === 0 ? styles.emptyList : styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>

                {/* Floating Add Button */}
                <TouchableOpacity 
                    onPress={() => {
                        navigation.navigate(ENUMS.SCREENS.ADD_CONTACT_LIST)
                    }} 
                    style={styles.addButton}
                    activeOpacity={0.8}
                >
                    <MaterialIcons name="person-add" size={28} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    
    // Search Bar Styles - BIGGER SIZE
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingVertical: 16,  // Increased from 12
        paddingHorizontal: 18,  // Increased from 16
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    searchIcon: {
        marginRight: 12,  // Increased from 8
    },
    searchInput: {
        flex: 1,
        fontSize: 17,  // Increased from 16
        fontFamily: "Poppins",
        paddingVertical: 0,
    },

    // Contact Count
    contactCountContainer: {
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    contactCount: {
        fontSize: 14,
        fontFamily: "Poppins",
        fontWeight: '500',
    },

    // List Container
    listContainer: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 80,
        paddingTop: 8,
    },
    emptyList: {
        flex: 1,
    },
    loaderContainer: {
        marginTop: 24,
    },

    // Contact Card Styles - Using theme colors
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginVertical: 6,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: "Poppins-SemiBold",
        fontWeight: '600',
    },
    contactInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    contactName: {
        fontSize: 16,
        fontFamily: "Poppins-Medium",
        fontWeight: '600',
        marginBottom: 2,
    },
    contactAddress: {
        fontSize: 12,
        fontFamily: "Poppins",
        color: '#888',
        maxWidth: '90%',
    },

    // Empty State Styles
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 60,
    },
    emptyIconContainer: {
        marginBottom: 24,
        opacity: 0.6,
    },
    emptyTitle: {
        fontSize: 20,
        fontFamily: "Poppins-SemiBold",
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        fontFamily: "Poppins",
        textAlign: 'center',
        lineHeight: 20,
    },

    // Add Button Styles
    addButton: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.BTN_BACKGROUND_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.BTN_BACKGROUND_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});

const mapStateToProps = (state) => ({
    contactList: state.contactReducer.contact,
})

export default connect(mapStateToProps, {})(ShowContact)