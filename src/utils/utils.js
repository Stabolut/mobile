import NetInfo from '@react-native-community/netinfo';

export const checkInternetConnectivity = () => {
    return new Promise((resolve) => {
        NetInfo.fetch().then((state) => {
            resolve(state.isConnected);
        });
    });
};






