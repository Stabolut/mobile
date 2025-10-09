

import React, { useEffect, useState, useRef } from 'react';
// import Header from '../../components/Header/Header';
// import StatusBarNU from '../../../components/StatusBarNU/StatusBarNU';
import Header from '../../components/Header/Header';
// import { COLORS } from '../../common';
import { COLORS, THEME } from "../../common"
import { Text, StyleSheet, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
// import StatusBarNU from '../../components/StatusBarNU/StatusBarNU';
import LottieView from 'lottie-react-native';
import { getTransactionCount, mintCoin } from '../../api/wallet';
import AsyncStorage from '@react-native-community/async-storage';
import { errorMessageHandler } from '../../utils/utils';
import Toast from 'react-native-easy-toast'
import TransactionLoader from '../Dashboard/TransactionLoader';


function Leaderboard({ navigation }) {
    let currentNetwork = useSelector((state) => state.walletReducer.currentNetwork)
    const [isTransactionLoading, setTransactionLoading] = useState(false);
    const [transferLoader, setTransferLoader] = useState("");
    const [allBadges, setAllBadges] = useState(0);
    let selectedTheme = useSelector((state) => state.walletReducer.theme)
    const theme = THEME[selectedTheme];
    const toastRef = useRef(null);

    useEffect(() => {
        getTrsnsferCount()

    }, [])


    let getTrsnsferCount = async () => {


        // try {
        //     let address = await AsyncStorage.getItem('address');
        //     setTransactionLoading(true)
        //     let { data } = await getTransactionCount({ walletAddress: address, network: currentNetwork.name })
        //     setAllBadges(data.data.allBadges)
        //     setTransactionLoading(false)

        // }
        // catch (e) {
        //     setTransactionLoading(false)
        //     alert("We seem to be encountering a problem in retrieving the badges info. It's possible that this issue is related to your internet connection.")

        // }
    }


    let claimReward = async (item) => {
        try {

            setTransferLoader(item.name)
            let address = await AsyncStorage.getItem('address');
            await mintCoin({ walletAddress: address, amount: item.amount, badgeTitle: item.name })
            toastRef.current.show('You have successfully claimed the reward', 3000);
            getTrsnsferCount()
            setTransferLoader("")

        }
        catch (e) {
            setTransferLoader("")
            let msg = errorMessageHandler(e)
            alert(msg)
        }

    }

    const renderBadgeItem = ({ item }) => (
        <View style={[styles.badgeCard, !item.earned && styles.lockedBadge,item.rewardSent && styles.lockedBadge, { backgroundColor: theme?.BALANCE_CARD_BACKGROUND, }]}>
            <Icon name={item.icon} size={40} color={item.earned ? theme?.WHITE : '#9E9E9E'} />
            <Text style={[styles.badgeName, { color: theme?.WHITE }]}>{item.name}</Text>
            <Text style={[styles.badgeDescription, { color: theme?.WHITE, }]}>{item.description}</Text>
            <Text style={[styles.badgeReward]}>Reward: {item.reward}</Text>


            {
                item.earned === false ? <View style={{ flexDirection: "row" }}><Text style={styles.lockedText}>Locked</Text>
                    <Icon style={{ marginTop: 6 }} name={"lock"} size={18} color={item.earned ? '#fff' : '#9E9E9E'} />
                </View> :
                    item.rewardSent === true ? <Text style={[styles.lockedText, { color: theme?.WHITE }]}>Reward Claimed</Text> :
                        <View>
                            <LottieView
                                source={require('../../assets/badges-animation.json')}
                                autoPlay
                                loop={true}
                                style={styles.animation}
                            />

                            <TouchableOpacity disabled={transferLoader === item.name} onPress={() => claimReward(item)}

                                style={[styles.btnStyleSend, { opacity: transferLoader === item.name ? 0.7 : 1, }]}>
                                {transferLoader === item.name ? <ActivityIndicator></ActivityIndicator> :
                                    <Text style={styles.textStyleSend}>Claim Now </Text>
                                }
                            </TouchableOpacity>
                        </View>
            }



        </View>
    );

    return (
        <React.Fragment>

            <StatusBarNU
                backgroundColor={theme?.BACKGROUND_COLOR}

            />
            <Header theme={theme} headerText="Badges & Rewards" navigation={navigation}></Header>
            <Toast ref={toastRef} position="bottom" />


            <View style={[styles.container, { backgroundColor: theme?.BACKGROUND_COLOR }]}>
                {isTransactionLoading === true ? <TransactionLoader></TransactionLoader> :
                    <>
                        <Text style={[styles.title, { color: theme?.WHITE }]}>Badges Gallery</Text>
                        <Text style={[styles.subtitle, { color: theme?.SMALL_HEADING_TEXT, }]}>Earn badges by completing transfers and staking. Unlock rewards and showcase your achievements!</Text>
                        <FlatList
                            data={allBadges}
                            keyExtractor={(item) => item.category}
                            renderItem={({ item }) => (
                                <View>
                                    <Text style={[styles.categoryTitle, { color: theme?.WHITE }]}>{item.category}</Text>
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
                    </>
                }
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
        width: 200,
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
        textAlign: 'center',
        marginTop: 4,
    },
    badgeReward: {
        fontSize: 12,
        color: '#4CAF50',
        marginTop: 4,
    },
    lockedText: {
        fontSize: 14,
        color: '#9E9E9E',
        marginTop: 8,
    },
    animation: {
        width: 100,
        height: 80,
    },
    btnStyleSend: {
        // height: 45,
        // width: '100%',
        //  backgroundColor: COLORS.BTN_BACKGROUND_COLOR,
        color: COLORS.WHITE,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,

    },
    textStyleSend: {
        color: COLORS.WHITE,
        fontSize: 16,
        fontFamily: "Poppins",
        fontWeight: "600"
    },
});

export default Leaderboard;

