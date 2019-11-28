import * as appActions from "./reducers/app.actions";
import store from "./store/configureStore";

export const saveCurrentProfile = () => {
  store.dispatch(appActions.setValidationErrors({}));
  store.dispatch(appActions.uploadCurrentProfile());
};
