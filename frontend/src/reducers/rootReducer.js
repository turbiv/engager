import { combineReducers } from "redux";
import { clientData, orderData } from "./app.reducer";

const rootReducer = combineReducers({
  clientData,
  orderData
});

export default rootReducer;
