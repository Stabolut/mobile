import notifee, { AndroidImportance } from '@notifee/react-native';

export async function onDisplayNotification(remoteMessage) {
    const { title, body } = remoteMessage.notification || {};
    try {
        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            importance: AndroidImportance.HIGH,
            sound: 'default',
            vibration: true,
        });

        // Display the notification
        await notifee.displayNotification({
            title: title || 'New Notification',
            body: body || '',
            android: {
                channelId,
                smallIcon: 'ic_notification', // Your app icon
                importance: AndroidImportance.HIGH,
                pressAction: {
                    id: 'default',
                },
            },
            ios: {
                sound: 'default',
                foregroundPresentationOptions: {
                    badge: true,
                    sound: true,
                    banner: true,
                    list: true,
                },
            },
        });
    } catch (error) {
        console.error('Error displaying notification:', error);
    }
}








