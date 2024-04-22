/**
 * @format
 */
import { AppRegistry, Platform } from 'react-native';
import { configurePushNotifications } from './src/utils/PushController';
import AsyncStorage from '@react-native-community/async-storage';
import App from './src/App';
import { name as appName } from './app.json';

if (Platform.OS !== 'ios') {
    configurePushNotifications();
} else {
   
    // iOS-specific code
}




AppRegistry.registerComponent(appName, () => App);
