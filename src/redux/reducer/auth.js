import { WALLET_CREATED, PIN_VALUE,SET_PIN } from "../types/auth";

const initialState = {
  pinValue: false,
  walletCreated: false,
};
export const authReducer = (state = initialState, action) => {
  console.log("initialState",initialState)

  switch (action.type) {
    case PIN_VALUE:

      return {
        ...state,
        pinValue: action.payload,
      };

    case WALLET_CREATED:
      console.log("redux", action.payload)
      return {
        ...state,
        walletCreated: action.payload,
      };

      case WALLET_CREATED:
        console.log("redux", action.payload)
        return {
          ...state,
          walletCreated: action.payload,
        };
    case SET_PIN:
      console.log("redux", action.payload)
      return {
        ...state,
        pinSet: action.payload,
      };


    default:
      return state;
  }
};
