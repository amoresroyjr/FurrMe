import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import rootReducer from "./Users"; // your root reducer

const persistConfig = {
	key: "root",
	storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
	persistedReducer,
	applyMiddleware(/* your middleware here */)
);
//sdsa
const Persistor = persistStore(store);

export { Persistor };
export default store;
