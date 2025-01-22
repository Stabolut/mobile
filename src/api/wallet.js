
import invoke from "../utils/invoke";
import { Str } from "../common";

// arg data is {password, email}
export const addWalletWithFcm = (data) => {
    return invoke({
      method: "POST",
      baseURL:Str.apiUrl,
      route: "wallet/add-wallet",
      data: data,
    });
  };
