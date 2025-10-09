


// import PushNotification from 'react-native-push-notification';
// import useNotificationStore from '../features/notifcation/redux/useNotificationStore';

import { showNotificationToast } from "./toast";

// // Configure once (e.g., in App.js startup)
// PushNotification.configure({
//     onNotification: function (notification) {
//         console.log("LOCAL NOTIFICATION ==>", notification);
//     },
//     requestPermissions: false, // We handle permissions ourselves
// });

export async function onDisplayNotification(remoteMessage) {
    const { title, body } = remoteMessage.notification || {};
    alert("titltttt")
    //showNotificationToast(title, body)

    // // Store in Redux
    // if (remoteMessage.data) {
    //     const store = useNotificationStore.getState();
    //     const existingNotification = store.notificationList.find(
    //         notification => notification.id === remoteMessage.data.id
    //     );

    //     if (!existingNotification) {
    //         store.setNewNotification(remoteMessage.data);
    //     }
    // }
}







