
import { createStore,compose,applyMiddleware } from "redux";
import rootReducer from "./redux/reducer/index";
import thunk from "redux-thunk";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import AsyncStorage from "@react-native-community/async-storage";

const initialState = {};
 //const middleware = [thunk];
 const persistConfig = {
  key: "root",
  storage: AsyncStorage,
 whitelist: ["authReducer"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

let store = createStore(persistedReducer);
let persistor = persistStore(store);
export { store, persistor };






