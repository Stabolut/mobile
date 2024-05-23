import { WALLET_CREATED, PIN_VALUE, SET_PIN, SET_THEME, REFERRAL_VALUE } from "../types/auth";

const initialState = {
  pinValue: false,
  walletCreated: false,
  theme: "",
  referral: {}
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
    case SET_THEME:

      return {
        ...state,
        theme: action.payload,
      };
    case REFERRAL_VALUE:

      return {
        ...state,
        referral: action.payload,
      };


    default:
      return state;
  }
};
