import { Str } from "../common";
import { ethers,utils } from 'ethers';
import uuid from 'react-native-uuid';
import { getRealmInstance } from "./realmDbCreation";
// get user balance
export let getERC20Balance = async (address, contractAddress, provider) => {
  try {
    const contract = new ethers.Contract(contractAddress, Str.ABI, provider);
    const balance = await contract.balanceOf(address);
    return balance / 1e2

  } catch (e) {
    console.log("balance get error", e, provider)
    // throw e

  }
};

// Method to retrieve the transaction list of the user from the local database
export const getUserTransactionListFromLocalDb = async (networkName) => {
  try {

    const realm = getRealmInstance();

    // Retrieve transaction data from the database and sort it by date in descending order
    let transaction = realm
      .objects('TransactionsHistorySchema')
      .filtered(`network == $0`, networkName)
      .sorted('sendDate', true);

    // console.log("currentNetwork.name", currentNetwork.name, transaction)
    // Remove duplicate transactions based on transactionHash
    const uniqueArr = [];
    const uniqueObj = {};

    // Iterate through transactions to filter out duplicates
    transaction.forEach((elem) => {
      if (!uniqueObj[elem.transactionHash]) {
        uniqueObj[elem.transactionHash] = true;
        uniqueArr.push(elem);
      }
    });

    return uniqueArr
    // Set the unique transaction records in the state for further processing

  } catch (e) {
    console.log("error in get tra", e)
    // Handle any errors that occur during database access
  }
}


export const saveDB = async (date, transactionHash, sender, receiver, amount, status, notes = "", network, transactionType) => {

  try {
    const uniqueID = uuid.v4();
    const realm = getRealmInstance();
    // Create a w transaction object with the current date
    const transactionObject = {
      uniqueKey: uniqueID,
      senderAddress: sender,
      receiverAddress: receiver,
      amountToSend: parseFloat(amount),
      transactionStatus: status,
      sendDate: date, // Set the date property to the current date
      transactionHash: transactionHash,
      transactionNotes: notes,
      network: network || '',
      transactionType: transactionType || ''
    };

    // Save the transaction object to the Realm
    realm.write(() => {
      realm.create('TransactionsHistorySchema', transactionObject);
    });
    return true
  } catch (e) {
    console.log("transaction save error", e)

  }
};

export const isValidAddress = (address) => {
  try {
    utils.getAddress(address); // throws if invalid
    return true;
  } catch (error) {
    return false;
  }
}