import Realm from 'realm';

const TransactionsHistorySchema = {
  name: 'TransactionsHistorySchema',
  properties: {
    uniqueKey: 'string',
    senderAddress: 'string',
    receiverAddress: 'string',
    amountToSend: 'double',
    transactionStatus: 'string',
    sendDate: 'date',
    transactionHash: 'string',
    transactionNotes: 'string',
    network: 'string',
    transactionType: 'string',
  },
};

let realmInstance;




export const getRealmInstance = () => {
  if (!realmInstance || realmInstance.isClosed) { // Ensure it's open
    realmInstance = new Realm({
      schema: [TransactionsHistorySchema],
      schemaVersion: 1, // Increment if schema changes
    });
  }
  return realmInstance;
};
