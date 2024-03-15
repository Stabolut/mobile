import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';

export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
        getFcmToken()
    }
}

const getFcmToken = async () => {

    let fcmToken = await AsyncStorage.getItem("fcmToken")

    if (!fcmToken) {
        let fcmToken = await messaging().getToken()
        console.log("fcmToken", fcmToken)
        AsyncStorage.setItem("fcmToken", fcmToken)
    }
}

export const notificationListener = () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
        );

    });
    messaging().onMessage(async remoteMessage => {

        console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
        );
    })

    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );

            }

        });
}