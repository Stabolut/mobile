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
                if (remoteMessage) {
                    console.log(
                        'Notification caused app to open from quit state:',
                        remoteMessage.notification,
                    );

                }

            });
    }
    catch (e) {

    }
}


export const createChannel = (channelId, options) => {
    PushNotification.createChannel(
        {
            channelId: channelId,
            channelName: "My channel",
            channelDescription: "A channel to categorize your notifications",
            playSound: false,
            soundName: "default",
            importance: Importance.HIGH,
            vibrate: true,
        },
        (created) => {
            PushNotification.localNotification({
                /* Android Only Properties */
                channelId: channelId,
                smallIcon: Images.coinIcon,
                subText: options.subText,
                bigLargeIconUrl: Images.coinIcon,
                color: options.color,
                vibrate: true,
                vibration: 300,
                priority: "high",
                actions: ["ReplyInput"],
                title: options.title,
                message: options.message,
            });
        }
    );
};

