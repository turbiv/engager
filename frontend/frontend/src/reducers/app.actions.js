import * as types from "../constants/actionTypes";
import store from "../store/configureStore";
import * as backend from "../Backend";

export function setAuthToken(token) {
  return dispatch => {
    dispatch({
      type: types.SET_AUTH_TOKEN,
      token
    });
  };
}

export function setTabIndexForSellable(sellable, index) {
  return dispatch => {
    dispatch({
      type: types.SET_TAB_INDEX_FOR_SELLABLE,
      sellable,
      index
    });
  };
}

export function retrieveClientProfile() {
  return dispatch => {
    dispatch({
      type: types.START_CLIENT_PROFILE_RETRIEVE
    });

    backend.retriveProfile().then(
      data => {
        dispatch({
          type: types.RETRIEVE_CLIENT_PROFILE_SUCCESS,
          profile: data
        });
      },
      () => {
        dispatch({
          type: types.RETRIEVE_CLIENT_PROFILE_FAILED
        });
      }
    );
  };
}

export function addSellableToCategory(category, sellable) {
  return dispatch => {
    dispatch({
      type: types.ADD_SELLABLE_TO_CATEGORY,
      category,
      sellable
    });
  };
}

export function removeSellable(category, sellable) {
  return dispatch => {
    dispatch({
      type: types.REMOVE_SELLABLE_FROM_PROFILE,
      category,
      sellable
    });
  };
}

export function setImageToSellable(sellable, uuid, what) {
  return dispatch => {
    dispatch({
      type: types.SET_IMAGE_TO_SELLABLE,
      sellable,
      uuid,
      what
    });
  };
}

export function removeImageFromSellable(sellable, uuid, what) {
  return dispatch => {
    dispatch({
      type: types.REMOVE_IMAGE_FROM_SELLABLE,
      sellable,
      uuid,
      what
    });
  };
}

export function addSellableCategoryToProfile(category) {
  return dispatch => {
    dispatch({
      type: types.ADD_SELLABLE_CATEGORY_TO_PROFILE,
      category
    });
  };
}
export function setCategoryName(category, name) {
  return dispatch => {
    dispatch({
      type: types.SET_CATEGORY_NAME,
      category,
      name
    });
  };
}
export function setSellableTextProp(sellable, what, value) {
  return dispatch => {
    dispatch({
      type: types.SET_SELLABLE_TEXT_PROP,
      sellable,
      what,
      value
    });
  };
}
export function updateImageSize(sellable, iuuid, meta, what) {
  return dispatch => {
    dispatch({
      type: types.SET_SELLABLE_IMAGE_SIZE,
      sellable,
      iuuid,
      meta,
      what
    });
  };
}
export function setSellablePrice(sellable, value, what, index) {
  return dispatch => {
    dispatch({
      type: types.SET_SELLABLE_PRICE,
      sellable,
      value,
      what,
      index
    });
  };
}

export function swapSellablePosition(category, from, to) {
  return dispatch => {
    dispatch({
      type: types.SWAP_SELLABLE_POSITIONS,
      category,
      from,
      to
    });
  };
}

export function removeCategory(category) {
  return dispatch => {
    dispatch({
      type: types.REMOVE_CATEGORY,
      category
    });
  };
}

export function uploadCurrentProfile() {
  return dispatch => {
    backend.uploadProfile(store.getState().clientData.profile);
  };
}

export function setSellableNewBonus(sellable, bonus) {
  return dispatch => {
    dispatch({
      type: types.SET_SELLABLE_BONUS,
      sellable,
      bonus
    });
  };
}

export function removeSellableBonus(sellable, bonus) {
  return dispatch => {
    dispatch({
      type: types.REMOVE_SELLABLE_BONUS,
      sellable,
      bonus
    });
  };
}
export function updateSellableBonus(sellable, bonus, what, value) {
  return dispatch => {
    dispatch({
      type: types.UPDATE_SELLABLE_BONUS,
      sellable,
      bonus,
      what,
      value
    });
  };
}

export function updateSellablePromo(sellable, what, value) {
  return dispatch => {
    dispatch({
      type: types.UPDATE_SELLABLE_PROMO,
      sellable,
      what,
      value
    });
  };
}

export function setValidationErrors(errors) {
  return dispatch => {
    dispatch({
      type: types.SET_VALIDATION_ERRORS,
      errors
    });
  };
}

export function setOrdersFetchingStatus(status) {
  return dispatch => {
    dispatch({
      type: types.SET_ORDERS_FETCHING_STATUS,
      status
    });
  };
}
export function setCurrentOrders(orders) {
  return dispatch => {
    dispatch({
      type: types.SET_CURRENT_ORDERS,
      orders
    });
  };
}

export function setOrderCompleted(key, status) {
  return dispatch => {
    dispatch({
      type: types.SET_ORDER_COMPLETED,
      key,
      status
    });
  };
}

export function updateContactInfo(value, dataKey) {
  return dispatch => {
    dispatch({
      type: types.UPDATE_CONTACT_INFO,
      value,
      dataKey
    });
  };
}

export function addContactInfoListElement(dataKey) {
  return dispatch => {
    dispatch({
      type: types.ADD_CONTACT_INFO_LIST_ELEMENT,
      dataKey
    });
  };
}

export function removeContactInfoListElement(index, dataKey) {
  return dispatch => {
    dispatch({
      type: types.REMOVE_CONTACT_INFO_LIST_ELEMENT,
      index,
      dataKey
    });
  };
}

export function updateContactInfoListElement(value, index, dataKey) {
  return dispatch => {
    dispatch({
      type: types.UPDATE_CONTACT_INFO_LIST_ELEMENT,
      value,
      index,
      dataKey
    });
  };
}

export function setMapImage(path) {
  return dispatch => {
    dispatch({
      type: types.SET_MAP_IMAGE,
      path
    });
  };
}

export function setLatLng(value, dataKey) {
  return dispatch => {
    dispatch({
      type: types.SET_MAP_LATLNG,
      value,
      dataKey
    });
  };
}
