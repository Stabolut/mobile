import messaging from '@react-native-firebase/messaging';
import { onDisplayNotification } from './foregroundNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addWalletWithFcm } from '../api/wallet';
// import { sendDeviceToken } from '../api/services/auth/auth';
// import { Storage } from '../utils/storage';

export class FirebaseService {
  constructor() {
    this.isInitialized = false;
    this.messageHandler = null; // Track the message handler
  }

  /**
   * Initialize Firebase Messaging
   */
  async init() {
    if (this.isInitialized) return;

    try {
      // console.log('🔥 Initializing Firebase...');

      // Register device for remote messages
      if (!messaging().isDeviceRegisteredForRemoteMessages) {
        await messaging().registerDeviceForRemoteMessages();
      }

      // Set up message handlers
      this.setupMessageHandlers();

      this.isInitialized = true;
      // console.log('✅ Firebase initialized successfully');
    } catch (error) {
      // console.error('❌ Firebase init error:', error);
    }
  }

  /**
   * Get FCM Token
   */


  async getFCMToken() {
    try {
      const token = await messaging().getToken();
      // console.log('📱 FCM Token:', token);
      return token;
    } catch (error) {
      console.error('❌ Error getting FCM token:', error);
      return null;
    }
  }

  async setupMessageHandlers() {
    // Remove existing message handler if it exists
    if (this.messageHandler) {
      this.messageHandler();
    }

    // Background notification handler
    messaging().onNotificationOpenedApp(remoteMessage => {
      // console.log('📱 Background notification opened:', remoteMessage);
    });

    // Quit state notification handler
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          // console.log('📱 Quit state notification:', remoteMessage);
        }
      });

    // Foreground notification handler - store reference to remove later
    this.messageHandler = messaging().onMessage(async remoteMessage => {
      //  console.log('📱 Foreground notification:', remoteMessage);

      // console.log("remoteMessage first step", remoteMessage)
      // Show local notification or custom UI
      const { title, body } = remoteMessage.notification || {};
      if (title && body) {
        // showSuccessToast(body);
        // showNotificationToast(title, body, remoteMessage.data);
        await onDisplayNotification(remoteMessage);
      }
    });

    // Token refresh handler
    messaging().onTokenRefresh(token => {
      // console.log('🔄 Token refreshed:', token);
      // this.sendTokenToServer(token);
    });
  }

  /**
   * Send token to server
   */
  async sendTokenToServer(token) {
    try {
      // console.log("token",token)
      // Storage.setItem(DEVICE_ID, token);
      // console.log('🚀 Sending token to server:', token);
      try {
        let fcmToken = await AsyncStorage.getItem("fcmToken");
        console.log("token in storage dkdkddk", fcmToken, "currentToke kdkdkn", token)
        if (fcmToken === token) {
          // Token matches the stored value; no further action needed
          console.log("FCM token already exists in storage.");
        }

        else {
          let address = await AsyncStorage.getItem('address');
          console.log("address", address)
          if (address) {
            try {
              // Send the token and address to the server to associate the wallet
              await addWalletWithFcm({
                account: address,
                token: token
              })
              await AsyncStorage.setItem("fcmToken", token);

            } catch (e) {
              //no action we want to operate app incase notification cause issue
              console.error("Error associating token with wallet:", e.message);
            }

          }
          else {
            console.log("Address not exist")

          }

        }








      } catch (e) {
        console.warn('⚠️ Failed to send device token to server:', e);
        // Do not block app flow if sending fails
      }
      // TODO: Implement your API call here
    } catch (error) {
      console.error('❌ Error sending token to server:', error);
    }
  }
}

// Export singleton
export const firebaseService = new FirebaseService(); 