import * as backend from "./Backend";
import * as appActions from "./reducers/app.actions";
import store from "./store/configureStore";
import { buildOrders } from "./OrderBuilder";

export const ORDER_STARTED = 1;
export const ORDER_DONE = 2;
export const queryOrders = testing => {
  store.dispatch(appActions.setOrdersFetchingStatus({ isFetching: true }));
  backend
    .queryOrders(testing)
    .then(submitted => {
      store.dispatch(appActions.setCurrentOrders(buildOrders(submitted)));
      store.dispatch(appActions.setOrdersFetchingStatus({ isFetching: false }));
    })
    .catch(() => {
      store.dispatch(appActions.setCurrentOrders([]));
      store.dispatch(appActions.setOrdersFetchingStatus({ isFetching: false }));
    });
};

export const completeOrder = key => {
  console.log("complete", key);

  backend
    .completeOrder(key)
    .then(submitted => {
      store.dispatch(appActions.setOrderCompleted(key, ORDER_DONE));
    })
    .catch(() => {
      store.dispatch(appActions.setCurrentOrders([]));
    });
};
