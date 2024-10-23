import NetInfo from '@react-native-community/netinfo';
import { ErrorMessages } from '../messages/errorMessage';
import AsyncStorage from '@react-native-community/async-storage';

export const checkInternetConnectivity = () => {
    return new Promise((resolve) => {
        NetInfo.fetch().then((state) => {
            resolve(state.isConnected);
        });
    });
};


// function to handle error messages
export function errorMessageHandler(err) {
    let errorMessage;
    try {
        // default error message
        errorMessage = ErrorMessages.GENERIC.UNEXPECTED_ERROR;

        // enhanced error type checking
        if (!navigator.onLine || err.message === "Network Error") {
            errorMessage = ErrorMessages.GENERIC.NETWORK_ERROR;
        } else if (err?.response?.data?.errors?.[0]?.message) {
            errorMessage = err.response.data.errors[0].message;
        } else if (err?.message) {
            errorMessage = err.message;
        }

        // log error for debugging
        console.error('[Error Handler]:', {
            message: err.message,
            stack: err.stack,
            response: err?.response?.data
        });

        return errorMessage;
    } catch (e) {
        console.error('[Error Handler] Failed to handle error:', e);
        return ErrorMessages.GENERIC.UNEXPECTED_ERROR;
    }
}

export const saveString = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
     let val =  await get("theme")
     console.log("ca",val)
      return true;
    } catch (error) {
      return false;
    }
  };

export const get = async key => {
  try {
    const itemString = await AsyncStorage.getItem(key);
    if (itemString) {
      return JSON.parse(itemString);
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};


