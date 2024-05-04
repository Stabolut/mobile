import { WALLET_CREATED, PIN_VALUE,SET_PIN } from "../types/auth";

const initialState = {
  pinValue: false,
  walletCreated: false,
};
export const authReducer = (state = initialState, action) => {
 

  switch (action.type) {
    case PIN_VALUE:

      return {
        ...state,
        pinValue: action.payload,
      };

    case WALLET_CREATED:
     
      return {
        ...state,
        walletCreated: action.payload,
      };

      case WALLET_CREATED:
      
        return {
          ...state,
          walletCreated: action.payload,
        };
    case SET_PIN:
     
      return {
        ...state,
        pinSet: action.payload,
      };


    default:
      return state;
  }
};
