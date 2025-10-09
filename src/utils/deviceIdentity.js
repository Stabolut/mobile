import DeviceInfo from 'react-native-device-info';
import * as Keychain from 'react-native-keychain';
import uuid from 'react-native-uuid'; // optional, for cleaner UUIDs


let getKeychainDeviceId = async () => {
    try {
        const credentials = await Keychain.getGenericPassword({ service: 'device_id_service' });
        return credentials ? credentials.password : null;
    } catch {
        return null;
    }
}
let storeDeviceId = async (id) => {
    try {
        await Keychain.setGenericPassword('device', id, { service: 'device_id_service' });
    } catch (error) {
        console.error('Error storing device ID:', error);
    }
}


export const getStableDeviceId = async () => {
    try {
        // Check Keychain first (persists through reinstall on iOS)
        const keychainId = await getKeychainDeviceId();
        if (keychainId) return keychainId;

        // Create and store new one
        const newId = uuid.v4(); // e.g. "a3f8c0b0-1a3e-4f4a..."
        await storeDeviceId(newId);
        return newId;
    } catch (error) {
        console.error('Error getting stable device ID:', error);
        return DeviceInfo.getUniqueId(); // fallback
    }


}


