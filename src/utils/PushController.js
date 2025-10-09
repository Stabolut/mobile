import AsyncStorage from '@react-native-community/async-storage';
// import PushNotification from 'react-native-push-notification';
import { notificationChannel } from './NotiicationService';
import { addWalletWithFcm } from '../api/wallet';


export const configurePushNotifications = () => {
    try {
        // PushNotification.configure({
        //     onRegister: async function (token) {
        //         console.log("i am call")
        //         console.log("token", token)

        //         // Retrieve the stored FCM token from AsyncStorage
        //         let fcmToken = await AsyncStorage.getItem("fcmToken");

        //         if (fcmToken === token.token) {
        //             // Token matches the stored value; no further action needed
        //             console.log("FCM token already exists in storage.");
        //         } else {
        //             let address = await AsyncStorage.getItem('address');
        //             if (address) {
        //                 try {
        //                     // Send the token and address to the server to associate the wallet
        //                     await addWalletWithFcm({
        //                         account: address,
        //                         token: token.token
        //                     })

        //                 } catch (e) {
        //                     //no action we want to operate app incase notification cause issue
        //                     console.error("Error associating token with wallet:", e.message);
        //                 }
        //             } else {
        //                 //  await AsyncStorage.setItem("fcmToken", token.token);
        //                 console.log("New FCM token saved in AsyncStorage.");

        //             }
        //         }
        //     },
        //     requestPermissions: true,
        //     popInitialNotification: true,

        //     /**
        //     * Called when a notification is received.
        //     * @param {Object} notification - The notification object.
        //     */
        //     onNotification: function (notification) {

        //         // Handle user interaction with the notification

        //         if (notification.action === "ReplyInput") {
        //             console.log("User interacted with ReplyInput action.");
        //         }
        //         // If the user didn't interact with the notification, display a channel-specific notification
        //         if (notification?.userInteraction === false) {
        //             notificationChannel(notification.title, notification.message);
        //         }
        //     },
        //     /**
        //     * Called when an action is performed on the notification.
        //     * @param {Object} notification - The notification object containing the action.
        //     */
        //     onAction: function (notification) {
        //         console.log("Notification action performed:", notification);
        //     },
        //     onRegistrationError: function (err) {
        //         // Handle registration error
        //     },
        // });
    } catch (e) {
        // Handle error
    }
};
