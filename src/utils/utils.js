import NetInfo from '@react-native-community/netinfo';
import { ErrorMessages } from '../messages/errorMessage';

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






