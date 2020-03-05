import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import rootReducer from "../reducers/rootReducer";

let middleware = [thunk];

if (true) {
  // __DEV__
  const reduxImmutableStateInvariant = require("redux-immutable-state-invariant").default();
  // middleware = [...middleware, reduxImmutableStateInvariant, logger];
  middleware = [...middleware, reduxImmutableStateInvariant, logger];
} else {
  middleware = [...middleware];
}
/*
export default function configureStore() {
  return createStore(rootReducer, applyMiddleware(...middleware));
}
*/

const store = createStore(rootReducer, applyMiddleware(...middleware));
export default store;
