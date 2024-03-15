import React, { useEffect, useState, useRef, createContext } from 'react';
import Navigation from './navigation';
import Toast from 'react-native-easy-toast';
import DropDownHolder from './components/dropDownHolder';
import { COLORS, Str, Images } from './common';
import { Provider } from 'react-redux';
import io from 'socket.io-client';
import { persistor, store } from "./store";
import { View, Text, Platform, PermissionsAndroid } from 'react-native';
import firebase from '@react-native-firebase/app'
import messaging from '@react-native-firebase/messaging'
import TouchID from 'react-native-touch-id';
import PushNotification, { Importance } from 'react-native-push-notification'
import { check, PERMISSIONS, request } from 'react-native-permissions';
import { PersistGate } from "redux-persist/integration/react";
import { requestUserPermission, notificationListener } from './utils/NotiicationService';
//https://blog.logrocket.com/manage-notifications-react-native-notifications/
export const SocketContext = createContext(null);
import Biometrics from 'react-native-biometrics';

//  import { messaging } from '@react-native-firebase/messaging';

const App = () => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');


  const createChannel = (channelId, options) => {
    PushNotification.createChannel(
      {
        channelId: channelId, // (required)
        channelName: "My channel", // (required)
        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        playSound: false, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => {
        console.log(`createChannel returned '${created}'`)

        PushNotification.localNotification({
          /* Android Only Properties */
          channelId: channelId, // (required) channelId, if the channel doesn't exist, notification will not trigger.
          //largeIconUrl: "https://cdn4.iconfinder.com/data/icons/logos-brands-5/24/react-128.png", // (optional) default: undefined
          smallIcon: Images.coinIcon, // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
          subText: options.subText, // (optional) default: none
          //bigPictureUrl: options.bigImage, // (optional) default: undefined
          bigLargeIconUrl: Images.coinIcon, // (optional) default: undefined
          color: options.color, // (optional) default: system default
          vibrate: true, // (optional) default: true
          vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
          priority: "high", // (optional) set notification priority, default: high
          actions: ["ReplyInput"],
          title: options.title, // (optional)
          message: options.message, // (required)
        });
      }
    )

  }

  useEffect(() => {
    if (Platform.OS !== 'ios') {

      try {
        const unsubscribe = messaging().onMessage(async remoteMsg => {
          const channelId = Math.random().toString(36).substring(7)
          createChannel(channelId, { bigImage: remoteMsg.notification.android.imageUrl, title: remoteMsg.notification.title, message: remoteMsg.notification.body, subText: remoteMsg.data.subTitle })
        })
        messaging().setBackgroundMessageHandler(async remoteMsg => {
          const channelId = Math.random().toString(36).substring(7)
          createChannel(channelId, { bigImage: remoteMsg.notification.android.imageUrl, title: remoteMsg.notification.title, message: remoteMsg.notification.body, subText: remoteMsg.data.subTitle })

        })
        return unsubscribe

      }
      catch (e) {
        console.log("Error", e)
      }
    }

    if (Platform.OS === 'ios') {

      requestUserPermission()
      notificationListener()




    }


    else {

      console.log("I plaeform app.js")
    }






  }, [])







  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(Str.apiUrl);
    socketRef.current.on('connect', () => {
      console.log('Socket connect');
      setSocketConnected(true);
      setConnectionStatus('connected');
    });
    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnect');
      setConnectionStatus('error');
    });

    socketRef.current.on('connect_error', error => {
      console.log('Socket disconnect due to internet');
      setConnectionStatus('error');
    });

    return () => {
      // alert('Socket disconnect');
      setConnectionStatus('error');
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SocketContext.Provider
          value={{
            socket: socketRef.current,
            isSocketConnected: socketConnected,
            connectionStatus: connectionStatus,
          }}>
          <Navigation value={socketConnected}></Navigation>
        </SocketContext.Provider>
        <Toast
          style={{ backgroundColor: COLORS.BALANCE_CARD_BACKGROUND }}
          position="bottom"
          fadeInDuration={750}
          fadeOutDuration={700}
          textStyle={{ color: 'white' }}
          ref={ref => DropDownHolder.setDropDown(ref)}
        />
      </PersistGate>
    </Provider>
  );
};

export default App;
