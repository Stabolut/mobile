import {combineReducers} from 'redux';
import {socketReducer} from './SocketReducer';
import { authReducer } from './auth';
import {contactReducer} from "./contact"
const allReducers = combineReducers({
  socketReducer: socketReducer,
  authReducer:authReducer,
  contactReducer:contactReducer
});
export default allReducers;
