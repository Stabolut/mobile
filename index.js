/**
 * @format
 */
import { AppRegistry, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import App from './src/App';
import { name as appName } from './app.json';
import axios from 'axios';
import { Str } from './src/common';

//f_epd1N9RTqgzUHdtLMthk:APA91bHspUU16P7dQjAU5SK4gyZUrCIMXejK-15z14XQkWX_dnQr-tonkhhDdyX1xzajoSk8UTplKKDN71W42pDxfurEZ9iScr2GiiEEp49k8wH36nyoDOb0B0K1sB4Ea1ZMcju93FXf
import PushNotification, { Importance } from 'react-native-push-notification'

if (Platform.OS !== 'ios') {
    console.log("Anderoid plaeform index.js")

    try {
        PushNotification.configure({

            onRegister: async function (token) {

                let fcmToken = await AsyncStorage.getItem("fcmToken")
                console.log("fcmToken", fcmToken, token.token)
                if (fcmToken === token.token) {
                    console.log("Fcm token match with the local token")
                }
                else {

                    let address = await AsyncStorage.getItem('address');
                    if (address) {

                        try {
                            let response = await axios.post(`${Str.apiUrl}/v1/eurb/add-wallet`, {
                                account: address,
                                token: token.token
                            })
                            console.log("response index", response.data)
                        }

                        catch (e) {

                        }
                    }
                    else {
                        console.log("Address store in local db")
                        await AsyncStorage.setItem("fcmToken", token.token)

                    }

                }


            },
            requestPermissions: false,
            popInitialNotification: true,


            onNotification: function (notification) {
                console.log("notification notification", notification.userInteraction, notification.channelId)

                if (notification.action === "ReplyInput") {

                    // console.log("texto", notification.reply_text)// this will contain the inline reply text. 
                }
                if (notification?.userInteraction === false) {
                    let channelID = Math.random().toString(36).substring(7)

                    PushNotification.createChannel(
                        {
                            channelId: channelID, // (required)
                            channelName: "My channel A", // (required)
                            channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
                            playSound: false, // (optional) default: true
                            soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
                            importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
                            vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
                        },
                        (created) => {

                            PushNotification.localNotification({
                                title: notification.title,
                                message: notification.message,
                                channelId: channelID // Required for Android 8.0 and above
                            });

                        }
                    )
                }
            },

            // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
            onAction: function (notification) {
                // process the action
            },
            // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
            onRegistrationError: function (err) {
                console.error(err.message, err);
            },
            //senderId: Config.FIREBASE_CLOUD_MESSAGING_SENDER_ID,

        });
    }
    catch (e) {
        console.log("Error", e)
    }

}

else {
    console.log("IOS plaeform index.js")
}

AppRegistry.registerComponent(appName, () => App);
