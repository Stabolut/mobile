
import invoke from "../utils/invoke";
import { Str } from "../common";

export const addWalletWithFcm = (data) => {
  return invoke({
    method: "POST",
    baseURL: Str.apiUrl,
    route: "wallet/add-wallet",
    data: data,
  });
};

export const updateUserTransactionStatus = (data) => {
  return invoke({
    method: "POST",
    baseURL: Str.apiUrl,
    route: "wallet/update-transaction-status",
    data: data,
  });
};

export const getLimitedTransactionList = (data) => {
  return invoke({
    method: "POST",
    baseURL: Str.apiUrl,
    route: "wallet/transacions-list-with-limit",
    data: data,
  });
};

export const transfer = (data) => {
  return invoke({
    method: "POST",
    baseURL: Str.apiUrl,
    route: "wallet/transfer-token",
    data: data,
  });
};

export const getWalletTransactionList = (data) => {
  return invoke({
    method: "POST",
    baseURL: Str.apiUrl,
    route: "wallet/transacions-list",
    data: data,
  });
};

export const getInStake = (data) => {
  return invoke({
    method: "POST",
    baseURL: Str.apiUrl,
    route: "staking/get-in-stake",
    data: data,
  });
};

export const withdrawalToken = (data) => {
  return invoke({
    method: "POST",
    baseURL: Str.apiUrl,
    route: "wallet/withdrawToken",
    data: data,
  });
};

export const addInStake = (data) => {
  return invoke({
    method: "POST",
    baseURL: Str.apiUrl,
    route: "staking/add-in-stake",
    data: data,
  });
};

export const getTransactionCount = (data) => {
  return invoke({
    method: "POST",
    baseURL: Str.apiUrl,
    route: "wallet/transaction-count",
    data: data,
  });
};

export const mintCoin = (data) => {
  return invoke({
    method: "POST",
    baseURL: Str.apiUrl,
    route: "wallet/mint-coin",
    data: data,
  });
};










