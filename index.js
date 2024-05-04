/**
 * @format
 */
import { AppRegistry, Platform } from 'react-native';
import { configurePushNotifications } from './src/utils/PushController';
import AsyncStorage from '@react-native-community/async-storage';
import PushNotification, { Importance } from 'react-native-push-notification';
import { notificationChannel } from './src/utils/NotiicationService';
import { isEmpty } from 'lodash';
import App from './src/App';
import { Images } from './src/common';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';


messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log("Notification handle here", remoteMessage);
    if (!isEmpty(remoteMessage.notification)) {
        console.log("go inside", remoteMessage);
        // notificationChannel(remoteMessage.notification.title, remoteMessage.notification.body);
    }
});






configurePushNotifications();




AppRegistry.registerComponent(appName, () => App);
