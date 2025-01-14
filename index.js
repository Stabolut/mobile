/**
 * @format
 */
import { AppRegistry } from 'react-native';
import { configurePushNotifications } from './src/utils/PushController';
import { isEmpty } from 'lodash';
import App from './src/App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import { notificationChannel } from './src/utils/NotiicationService';


messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log("Notification handle here", remoteMessage.notification);
    // if (!isEmpty(remoteMessage.notification)) {

    //notificationChannel(remoteMessage.notification.title, remoteMessage.notification.body);
    // }
});
configurePushNotifications();
AppRegistry.registerComponent(appName, () => App);
