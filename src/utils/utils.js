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


// Function to handle error messages
export function errorMessageHandler(err) {
    let errorMessage;
    try {
     console.log("Error in caught",err)
        // Default error message
        errorMessage = ErrorMessages.GENERIC.UNEXPECTED_ERROR;

        // Check for specific error conditions and update error message accordingly
        if (err.message === "Network Error") {
           
            errorMessage = ErrorMessages.GENERIC.NETWORK_ERROR;
        } else if (err?.response?.data) {
           
            errorMessage = err?.response?.data?.errors[0]?.message;
        }
        else if (err.message) {
           
            errorMessage = err.message
        }
       

        return errorMessage; // Return the error message
    } catch (e) {
        errorMessage = ErrorMessages.GENERIC.UNEXPECTED_ERROR; // Handle any unexpected errors
        return errorMessage; // Return the default error message
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


