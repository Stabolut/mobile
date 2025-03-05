

import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
// import Header from '../../components/Header/Header';
// import StatusBarNU from '../../../components/StatusBarNU/StatusBarNU';
import Header from '../../components/Header/Header';
// import { COLORS } from '../../common';
import { COLORS, ENUMS, THEME } from "../../common"
import { Text, StyleSheet, View, FlatList } from 'react-native';
import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
// import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';

function Leaderboard({ navigation }) {
    const [user, setUser] = useState({ badges: [] });
    let selectedTheme = useSelector((state) => state.walletReducer.theme)


    const theme = THEME[selectedTheme];

    const allBadges = [
        {
            category: 'Transfer Badges',
            data: [
                {
                    id: '1',
                    name: 'First Transfer',
                    description: 'Complete your first transfer',
                    reward: '10 Tokens',
                    icon: 'send',
                    earned: user.badges.includes('First Transfer'),
                },
                {
                    id: '2',
                    name: 'Frequent Sender',
                    description: 'Complete 10 transfers',
                    reward: '100 Tokens',
                    icon: 'repeat',
                    earned: user.badges.includes('Frequent Sender'),
                },
                {
                    id: '3',
                    name: 'Power User',
                    description: 'Complete 50 transfers',
                    reward: '500 Tokens',
                    icon: 'flash-on',
                    earned: user.badges.includes('Power User'),
                },
            ],
        },
        {
            category: 'Staking Badges',
            data: [
                {
                    id: '4',
                    name: 'First Stake',
                    description: 'Stake tokens for the first time',
                    reward: '20 Tokens',
                    icon: 'lock',
                    earned: user.badges.includes('First Stake'),
                },
                {
                    id: '5',
                    name: 'Staking Pro',
                    description: 'Stake 1,000 tokens',
                    reward: '200 Tokens',
                    icon: 'trending-up',
                    earned: user.badges.includes('Staking Pro'),
                },
                {
                    id: '6',
                    name: 'Whale Staker',
                    description: 'Stake 10,000 tokens',
                    reward: '1,000 Tokens',
                    icon: 'monetization-on',
                    earned: user.badges.includes('Whale Staker'),
                },
            ],
        },
    ];

    const leaderboard = [
        { address: '0xf3bBD891c56A7328e38B4125Cdbc343e0cf6ffcE', points: 11, badges: ['First Transfer', 'First Transfer'] },
        { name: '0xf3bBD891c56A7328e38B4125Cdbc343e0cf6ffcE', points: 12, badges: ['First Transfer', 'First Transfer'] },
        // Add more badges here
    ];

    const renderBadgeItem = ({ item }) => (
        <View style={[styles.badgeCard, !item.earned && styles.lockedBadge, { backgroundColor: theme?.BALANCE_CARD_BACKGROUND, }]}>
            <Icon name={item.icon} size={40} color={item.earned ? '#fff' : '#9E9E9E'} />
            <Text style={[styles.badgeName, { color: theme?.WHITE }]}>{item.name}</Text>
            <Text style={[styles.badgeDescription,{ color: theme?.WHITE }]}>{item.description}</Text>
            <Text style={[styles.badgeReward]}>Reward: {item.reward}</Text>
            <Text style={[styles.lockedText, { color: theme?.WHITE }]}>Locked</Text>
            {/* {item.earned ? (
                <LottieView
                    source={require('./assets/badge-animation.json')}
                    autoPlay
                    loop={false}
                    style={styles.animation}
                />
            ) : (
                <Text style={styles.lockedText}>Locked</Text>
            )} */}
        </View>
    );

    return (
        <React.Fragment>


            {/* <StatusBarNU
                backgroundColor={COLORS.BACKGROUND_COLOR}


            />

            <Header
                backButton={true}
                headerText="Leaderboard"
                navigation={props.navigation}
            ></Header> */}
            <StatusBarNU
                backgroundColor={theme?.BACKGROUND_COLOR}

            />
            <Header theme={theme} headerText="Transfer USB" navigation={navigation}></Header>


            <View style={[styles.container, { backgroundColor: theme?.BACKGROUND_COLOR }]}>
                <Text style={[styles.title, { color: theme?.WHITE }]}>Badges Gallery</Text>
                <Text style={[styles.subtitle, { color: theme?.WHITE }]}>Earn badges by completing transfers and staking. Unlock rewards and showcase your achievements!</Text>
                <FlatList
                    data={allBadges}
                    keyExtractor={(item) => item.category}
                    renderItem={({ item }) => (
                        <View>
                            <Text style={[styles.categoryTitle,{color:theme?.WHITE}]}>{item.category}</Text>
                            <FlatList
                                data={item.data}
                                keyExtractor={(badge) => badge.id}
                                renderItem={renderBadgeItem}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    )}
                />
            </View>








        </React.Fragment >
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontFamily: "Poppins",
        fontWeight: 'bold',
        marginBottom: 8,

    },
    subtitle: {

        marginBottom: 16,
        fontSize: 14,
        fontFamily: "Poppins",
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,

    },
    badgeCard: {
        width: 150,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lockedBadge: {
        opacity: 0.6,
    },
    badgeName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
    },
    badgeDescription: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginTop: 4,
    },
    badgeReward: {
        fontSize: 12,
        color: '#4CAF50',
        marginTop: 4,
    },
    lockedText: {
        fontSize: 12,
        color: '#9E9E9E',
        marginTop: 8,
    },
    animation: {
        width: 50,
        height: 50,
    },
});

export default Leaderboard;

