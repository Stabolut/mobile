import { WALLET_CREATED,PIN_VALUE } from "../types/auth";

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
