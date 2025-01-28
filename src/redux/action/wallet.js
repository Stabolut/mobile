import { WALLET_CREATED,PIN_VALUE ,SET_THEME,REFERRAL_VALUE,SELECTED_NETWORK} from "../types/wallet";

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

export const storeReferralInfo = (data) => {

  return {
    type: REFERRAL_VALUE,
    payload: data,
  };
};

export const storeNetworkInfo = (data) => {
 
  return {
    type: SELECTED_NETWORK,
    payload: data,
  };
};


