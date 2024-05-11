import { WALLET_CREATED,PIN_VALUE ,SET_THEME} from "../types/auth";

export const storeWalletInfo = (data) => {
 
  return {
    type: WALLET_CREATED,
    payload: data,
  };
};

export const setPin = (data) => {

  return {
    type: PIN_VALUE,
    payload: data,
  };
};

export const setTheme = (data) => {

  return {
    type: SET_THEME,
    payload: data,
  };
};
