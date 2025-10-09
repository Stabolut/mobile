import { Platform, Alert, Linking } from 'react-native';
import { request, check, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import { firebaseService } from './firebaseService';

export const NotificationPermissionService = {


  async initNotificationSystem() {
    try {
      console.log("i ma cal notifif")
      const hasPermission = await this.requestPermissionFlow();
      console.log("i ma cal notifif",hasPermission)
      if (!hasPermission) return;
      
      // ✅ Initialize Firebase FIRST
      await firebaseService.init();
      
      // ✅ Then get the token
      const token = await firebaseService.getFCMToken();
      console.log("FCM TOKEN GET", token)
      if (token) await firebaseService.sendTokenToServer(token);
    } catch (err) {
      console.error('❌ Error initializing notification system:', err);
    }
  },

  showSettingsDialog() {
    Alert.alert(
      'Permission Required',
      'Please enable notifications in your settings to stay updated.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Settings',
          onPress: () =>
            Platform.OS === 'ios'
              ? Linking.openURL('app-settings:')
              : openSettings(),
        },
      ]
    );
  },

  async requestPermissionFlow() {
    try {
      // console.log('Available Android permissions:', Object.keys(PERMISSIONS.ANDROID));
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        // console.log("authStatus", authStatus)
        const granted =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        return granted;
      } else {
        const androidVersion = Platform.Version;
        // console.log('📱 Android version:', androidVersion);

        if (androidVersion >= 33) {
          //  console.log('📱 Android >= 33: Checking notification permission...');

          // Use the permission string directly since POST_NOTIFICATIONS constant is not available in react-native-permissions
          const permission = 'android.permission.POST_NOTIFICATIONS';

          const currentStatus = await check(permission);
          //console.log('📱 Android notification permission status:', currentStatus);

          if (currentStatus === RESULTS.GRANTED) return true;
          if (currentStatus === RESULTS.BLOCKED) {
            this.showSettingsDialog();
            return false;
          }

          const requestResult = await request(permission);
          return requestResult === RESULTS.GRANTED;
        } else {
          // ✅ Android < 13 — permission is granted by default
          console.log('📱 Android < 13: Notifications granted by default');
          return true;
        }
      }
    } catch (error) {
      console.error('❌ Error requesting permission:', error);
      return false;
    }
  }
}