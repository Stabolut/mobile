import {combineReducers} from 'redux';
import {socketReducer} from './SocketReducer';
import { walletReducer } from './wallet';
import {contactReducer} from "./contact"
const allReducers = combineReducers({
  socketReducer: socketReducer,
  walletReducer:walletReducer,
  contactReducer:contactReducer
});
export default allReducers;
