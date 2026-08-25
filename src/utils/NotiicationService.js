import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import PushNotification, { Importance } from 'react-native-push-notification';
import { Images } from '../common';

export async function requestUserPermission() {
    try {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
            getFcmToken();
        }
    } catch (e) {
        console.log("Firebase requestUserPermission info:", e.message);
    }
}

const getFcmToken = async () => {
    try {
        let fcmToken = await AsyncStorage.getItem("fcmToken");
        if (!fcmToken) {
            fcmToken = await messaging().getToken();
            if (fcmToken) {
                await AsyncStorage.setItem("fcmToken", fcmToken);
            }
        }
    } catch (e) {
        console.log("Firebase getFcmToken info:", e.message);
    }
};

export const notificationListener = () => {
    try {
        const unsubscribeOpen = messaging().onNotificationOpenedApp(remoteMessage => {
            console.log(
                'Notification caused app to open from background state:',
                remoteMessage.notification,
            );
        });

        const unsubscribeMessage = messaging().onMessage(async remoteMessage => {
            console.log(
                'Foreground push notification received:',
                remoteMessage,
            );
        });

        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log(
                        'Notification caused app to open from quit state:',
                        remoteMessage.notification,
                    );
                }
            })
            .catch(err => {
                console.log("getInitialNotification error:", err.message);
            });

        return () => {
            if (typeof unsubscribeOpen === 'function') unsubscribeOpen();
            if (typeof unsubscribeMessage === 'function') unsubscribeMessage();
        };
    } catch (e) {
        console.log("Firebase notificationListener info:", e.message);
        return () => {};
    }
};

export const notificationChannel = (title, body) => {
    try {
        let channelID = Math.random().toString(36).substring(7);
        PushNotification.createChannel(
            {
                channelId: channelID,
                channelName: "Stabolut notification channel",
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
    } catch (e) {
        console.log("notificationChannel error:", e.message);
    }
};
