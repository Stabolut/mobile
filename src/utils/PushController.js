import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { Str, Images } from '../common';
import PushNotification, { Importance } from 'react-native-push-notification';
import { notificationChannel } from './NotiicationService';

export const configurePushNotifications = () => {
    try {
        PushNotification.configure({
            onRegister: async function (token) {


                let fcmToken = await AsyncStorage.getItem("fcmToken")

                if (fcmToken === token.token) {
                    // FCM token already stored
                } else {
                    let address = await AsyncStorage.getItem('address');
                    if (address) {
                        try {


                            await axios.post(`${Str.apiUrl}/wallet/add-wallet`, {
                                account: address,
                                token: token.token
                            });
                        } catch (e) {
                            // Handle error
                        }
                    } else {
                        await AsyncStorage.setItem("fcmToken", token.token);
                    }
                }
            },
            requestPermissions: true,
            popInitialNotification: true,
            onNotification: function (notification) {


                if (notification.action === "ReplyInput") {
                    // Handle reply action
                }
                if (notification?.userInteraction === false) {
                    notificationChannel(notification.title, notification.message)
                }
            },
            onAction: function (notification) {
                // Process the action
            },
            onRegistrationError: function (err) {
                // Handle registration error
            },
        });
    } catch (e) {
        // Handle error
    }
};
