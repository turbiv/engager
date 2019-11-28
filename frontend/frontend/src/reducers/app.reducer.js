import * as types from "../constants/actionTypes";
import initialState from "./initialState";
import produce from "immer";

const findCategoryWithId = (id, state) => {
  return state.profile.categories.find(item => {
    return item.id === id;
  });
};

const getSellableToUpdate = (draftState, action) => {
  const thisCategory = findCategoryWithId(action.sellable.cat, draftState);
  if (!thisCategory) return;

  return thisCategory.sellables.find(item => {
    return item.id === action.sellable.id;
  });
};

const setTimeFields = (toUpdate, action) => {
  toUpdate.time.time_between[0] = action.value.fromTime;
  toUpdate.time.time_between[1] = action.value.toTime;
  toUpdate.time.days = action.value.days;
};

export const clientData = (state = initialState.clientData, action) => {
  switch (action.type) {
    case types.SET_AUTH_TOKEN:
      return Object.assign({}, state, {
        token: action.token
      });
    case types.SET_TAB_INDEX_FOR_SELLABLE: {
      return produce(state, draftState => {
        draftState.tabs[action.sellable.id] = action.index;
      });
    }
    case types.SET_VALIDATION_ERRORS: {
      return produce(state, draftState => {
        draftState.errors = action.errors;
      });
    }

    case types.START_CLIENT_PROFILE_RETRIEVE:
      return Object.assign({}, state, {
        isFetching: true
      });

    case types.RETRIEVE_CLIENT_PROFILE_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        error: false,
        profile:
          typeof action.profile === "object" ? action.profile : state.profile
      });
    case types.RETRIEVE_CLIENT_PROFILE_FAILED:
      return Object.assign({}, state, {
        isFetching: false,
        error: true
      });
    case types.ADD_SELLABLE_TO_CATEGORY:
      return produce(state, draftState => {
        const thisCategory = findCategoryWithId(action.category.id, draftState);
        if (!thisCategory) return;
        thisCategory.sellables.push(action.sellable);
      });

    case types.ADD_SELLABLE_CATEGORY_TO_PROFILE:
      return Object.assign({}, state, {
        profile: {
          ...state.profile,
          categories: [...state.profile.categories, action.category]
        }
      });
    case types.SET_IMAGE_TO_SELLABLE:
    case types.SET_SELLABLE_IMAGE_SIZE:
    case types.SET_SELLABLE_PRICE:
    case types.SET_SELLABLE_TEXT_PROP: {
      return produce(state, draftState => {
        const toUpdate = getSellableToUpdate(draftState, action);
        if (!toUpdate) return;

        if (action.type === types.SET_IMAGE_TO_SELLABLE) {
          if (action.what === "intro") {
            if (toUpdate.intro) toUpdate.intro.path = action.uuid;
            else toUpdate.intro = { path: action.uuid };
          }
          if (action.what === "promo") {
            toUpdate.promo.path = action.uuid;
          }
          if (action.what === "square") {
            toUpdate.promo.square.path = action.uuid;
          }
        }
        if (action.type === types.SET_SELLABLE_TEXT_PROP)
          toUpdate[action.what] = action.value;
        if (action.type === types.SET_SELLABLE_IMAGE_SIZE) {
          if (action.what === "intro") {
            toUpdate.intro.size = action.meta;
          }
          if (action.what === "promo") {
            toUpdate.promo.size = action.meta;
          }
          if (action.what === "square") {
            toUpdate.promo.square.size = action.meta;
          }
        }
        if (action.type === types.SET_SELLABLE_PRICE) {
          if (!(action.what in toUpdate)) {
            toUpdate[action.what] = [0, 0];
          }
          toUpdate[action.what][action.index] = action.value;
        }
      });
    }

    case types.REMOVE_IMAGE_FROM_SELLABLE: {
      return produce(state, draftState => {
        const toUpdate = getSellableToUpdate(draftState, action);
        if (!toUpdate) return;

        if (action.what === "intro") {
          toUpdate.intro.size = {};
          toUpdate.intro.path = "";
        }
        if (action.what === "promo") {
          toUpdate.promo.size = {};
          toUpdate.promo.path = "";
        }
        if (action.what === "square") {
          toUpdate.promo.square.size = {};
          toUpdate.promo.square.path = "";
        }
      });
    }

    case types.REMOVE_SELLABLE_FROM_PROFILE: {
      return produce(state, draftState => {
        const thisCategory = findCategoryWithId(
          action.sellable.cat,
          draftState
        );
        if (!thisCategory) return;

        thisCategory.sellables = thisCategory.sellables.filter(item => {
          return item.id !== action.sellable.id;
        });
      });
    }

    case types.SET_CATEGORY_NAME: {
      return produce(state, draftState => {
        const thisCategory = findCategoryWithId(action.category.id, draftState);
        if (!thisCategory) return;
        thisCategory.name = action.name;
      });
    }

    case types.REMOVE_CATEGORY: {
      return produce(state, draftState => {
        draftState.profile.categories = draftState.profile.categories.filter(
          item => item.id !== action.category.id
        );
      });
    }

    case types.SWAP_SELLABLE_POSITIONS: {
      return produce(state, draftState => {
        const thisCategory = findCategoryWithId(action.category.id, draftState);
        const tmp = thisCategory.sellables[action.from];
        thisCategory.sellables[action.from] = thisCategory.sellables[action.to];
        thisCategory.sellables[action.to] = tmp;
      });
    }
    case types.SET_SELLABLE_BONUS: {
      return produce(state, draftState => {
        const toUpdate = getSellableToUpdate(draftState, action);
        if (!toUpdate) return;
        if (!("bonuses" in toUpdate)) toUpdate.bonuses = [];
        toUpdate.bonuses.push(action.bonus);
      });
    }

    case types.REMOVE_SELLABLE_BONUS: {
      return produce(state, draftState => {
        const toUpdate = getSellableToUpdate(draftState, action);
        if (!toUpdate) return;
        toUpdate.bonuses = toUpdate.bonuses.filter(item => {
          return item.id !== action.bonus.id;
        });
      });
    }

    case types.UPDATE_SELLABLE_BONUS: {
      return produce(state, draftState => {
        const toUpdateSellable = getSellableToUpdate(draftState, action);
        if (!toUpdateSellable) return;
        const toUpdate = toUpdateSellable.bonuses.find(item => {
          return item.id === action.bonus.id;
        });
        if (!toUpdate) return;

        if (action.what === "interest_type" || action.what === "condition")
          toUpdate[action.what] = action.value;
        else if (action.what === "short_text")
          toUpdate.display.small.text = action.value;
        else if (action.what === "long_text")
          toUpdate.display.big.subtext = action.value;
        else if (action.what === "interest_e")
          toUpdate.interest.total[0] = action.value;
        else if (action.what === "interest_c")
          toUpdate.interest.total[1] = action.value;
        else if (action.what === "percent")
          toUpdate.interest.percent = action.value;
        else if (action.what === "scheduling") setTimeFields(toUpdate, action);
      });
    }
    case types.UPDATE_SELLABLE_PROMO: {
      return produce(state, draftState => {
        const toUpdate = getSellableToUpdate(draftState, action);
        if (!toUpdate) return;
        if (action.what === "scheduling") setTimeFields(toUpdate.promo, action);
        if (action.what === "push") toUpdate.promo.push = action.value;
        if (action.what === "message") toUpdate.promo.message = action.value;
      });
    }

    case types.UPDATE_CONTACT_INFO: {
      return produce(state, draftState => {
        if (!draftState.profile.info) draftState.profile.info = {};
        draftState.profile.info[action.dataKey] = action.value;
      });
    }
    case types.ADD_CONTACT_INFO_LIST_ELEMENT: {
      return produce(state, draftState => {
        if (!draftState.profile.info) draftState.profile.info = {};
        if (!draftState.profile.info[action.dataKey])
          draftState.profile.info[action.dataKey] = [];
        draftState.profile.info[action.dataKey].push("");
      });
    }
    case types.REMOVE_CONTACT_INFO_LIST_ELEMENT: {
      return produce(state, draftState => {
        draftState.profile.info[action.dataKey].splice(action.index, 1);
      });
    }
    case types.UPDATE_CONTACT_INFO_LIST_ELEMENT: {
      return produce(state, draftState => {
        draftState.profile.info[action.dataKey][action.index] = action.value;
      });
    }
    case types.SET_MAP_IMAGE: {
      return produce(state, draftState => {
        if (!draftState.profile.info) draftState.profile.info = {};
        if (!draftState.profile.info.location)
          draftState.profile.info.location = {};

        draftState.profile.info.location.preview = action.path;
      });
    }
    case types.SET_MAP_LATLNG: {
      return produce(state, draftState => {
        if (!draftState.profile.info) draftState.profile.info = {};
        if (!draftState.profile.info.location)
          draftState.profile.info.location = {};

        draftState.profile.info.location[action.dataKey] = action.value;
      });
    }

    default:
      return state;
  }
};

export const orderData = (state = initialState.orderData, action) => {
  switch (action.type) {
    case types.SET_ORDERS_FETCHING_STATUS:
      return produce(state, draftState => {
        draftState.isFetching = action.status.isFetching;
      });
    case types.SET_CURRENT_ORDERS:
      return produce(state, draftState => {
        draftState.orders = action.orders;
      });
    case types.SET_ORDER_COMPLETED:
      return produce(state, draftState => {
        const order = draftState.orders.find(o => o.orderKey === action.key);
        order.orderStatus = action.status;
      });

    default:
      return state;
  }
};
