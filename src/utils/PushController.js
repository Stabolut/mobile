import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { Str } from '../common';
import PushNotification, { Importance } from 'react-native-push-notification';

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
            requestPermissions: false,
            popInitialNotification: true,
            onNotification: function (notification) {
                if (notification.action === "ReplyInput") {
                    // Handle reply action
                }
                if (notification?.userInteraction === false) {
                    let channelID = Math.random().toString(36).substring(7);
                    PushNotification.createChannel(
                        {
                            channelId: channelID,
                            channelName: "My channel A",
                            channelDescription: "A channel to categorize your notifications",
                            playSound: false,
                            soundName: "default",
                            importance: Importance.HIGH,
                            vibrate: true,
                        },
                        (created) => {
                            PushNotification.localNotification({
                                title: notification.title,
                                message: notification.message,
                                channelId: channelID
                            });
                        }
                    );
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
