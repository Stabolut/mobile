import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import PushNotification, { Importance } from 'react-native-push-notification'
import { Images } from '../common';
export async function requestUserPermission() {
    try {

        const authStatus = await messaging().requestPermission();

        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
            getFcmToken()
        }
    }
    catch (e) {
    }
}

const getFcmToken = async () => {
    try {

        let fcmToken = await AsyncStorage.getItem("fcmToken")

        if (!fcmToken) {

            let fcmToken = await messaging().getToken()
            AsyncStorage.setItem("fcmToken", fcmToken)
        }
    }
    catch (e) {

    }
}


export const notificationListener = () => {
    try {

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
                console.log("hit there")
                if (remoteMessage) {
                    console.log(
                        'Notification caused app to open from quit state:',
                        remoteMessage.notification,
                    );

                }

            });
        return unsubscribe
    }
    catch (e) {

    }
}


export const notificationChannel = (title,body) => {
   
    let channelID = Math.random().toString(36).substring(7);
    PushNotification.createChannel(
        {
            channelId: channelID,
            channelName: "Stabolut notifcation channel",
            channelDescription: "A channel to categorize your notifications",
            playSound: true,
            soundName: "default",
            importance: Importance.HIGH,
            vibrate: true,
        },
        (created) => {
            PushNotification.localNotification({
                title: title,
                message: body,
                channelId: channelID,
                smallIcon: Images.coinIcon,
                bigLargeIconUrl: Images.coinIcon,
            });
        }
    );

}


