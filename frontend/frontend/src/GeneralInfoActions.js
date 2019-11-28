import * as backend from "./Backend";
import * as appActions from "./reducers/app.actions";
import store from "./store/configureStore";
import { saveCurrentProfile } from "./SaveProfile";

export const updateContactInfo = (value, dataKey) => {
  store.dispatch(appActions.updateContactInfo(value, dataKey));
  saveCurrentProfile();
};

export const addContactInfoListElement = dataKey => {
  store.dispatch(appActions.addContactInfoListElement(dataKey));
  saveCurrentProfile();
};

export const removeContactInfoListElement = (index, dataKey) => {
  store.dispatch(appActions.removeContactInfoListElement(index, dataKey));
  saveCurrentProfile();
};

export const updateContactInfoListElement = (value, index, dataKey) => {
  store.dispatch(
    appActions.updateContactInfoListElement(value, index, dataKey)
  );
  saveCurrentProfile();
};

export const setMapImage = path => {
  store.dispatch(appActions.setMapImage(path));
  saveCurrentProfile();
};

export const removeMapImage = uuid => {
  store.dispatch(appActions.setMapImage(""));

  backend.deleteImages([uuid]).then(() => {
    saveCurrentProfile();
  });
};

export const setLatLng = (value, dataKey) => {
  store.dispatch(appActions.setLatLng(value, dataKey));
  saveCurrentProfile();
};
